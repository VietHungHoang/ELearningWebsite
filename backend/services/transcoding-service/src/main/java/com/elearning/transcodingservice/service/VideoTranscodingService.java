package com.elearning.transcodingservice.service;

import com.elearning.transcodingservice.dto.VideoTranscodingMessage;
import com.elearning.transcodingservice.event.VideoProcessedEvent;
import com.elearning.transcodingservice.enums.VideoStatus;
import com.elearning.transcodingservice.exception.TranscodingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
// ...existing imports...
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.UUID;
import java.util.stream.Stream;

/**
 * Main service for video transcoding workflow
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VideoTranscodingService {
    
    private final FFmpegService ffmpegService;
    private final S3Service s3Service;
    private final KafkaTemplate<String, VideoProcessedEvent> videoProcessedKafkaTemplate;
    
    @Value("${processing.workspace-root:/tmp/transcoding}")
    private String workspaceRoot;
    
    @Value("${processing.cleanup-after-processing:true}")
    private boolean cleanupAfterProcessing;
    
    @Value("${processing.cleanup-on-failure:false}")
    private boolean cleanupOnFailure;
    
    @Value("${kafka.topics.video-processed}")
    private String videoProcessedTopic;
    
    public void processMessage(VideoTranscodingMessage message) {
        String jobId = UUID.randomUUID().toString();
        Path jobDir = Paths.get(workspaceRoot, "job-" + jobId + "-" + message.getVideoId());
        Path inputPath = jobDir.resolve("input.mp4");
        Path outputDir = jobDir.resolve("output");

        try {
        log.info("Starting processing for videoId={} lessonId={} bucket={} object={}",
            message.getVideoId(), message.getLessonId(), message.getBucketName(), message.getObjectName());

            Files.createDirectories(jobDir);

            // Determine bucket to use: prefer message.bucketName, fallback to configured VIDEO-RAW bucket
            String bucketToUse = message.getBucketName();
            if (bucketToUse == null || bucketToUse.isBlank()) {
                bucketToUse = s3Service.getVideosRawBucketName();
            }

            s3Service.downloadObject(bucketToUse, message.getObjectName(), inputPath);

            // Perform transcoding (this method already handles ffmpeg availability and verification)
            performTranscoding(inputPath, outputDir);

            // Upload transcoded files to VIDEO-STREAM bucket
            String streamBucket = s3Service.getVideosStreamBucketName();
            if (streamBucket != null && !streamBucket.isBlank()) {
                String baseKey = message.getLessonId() + "/" + message.getVideoId(); // Use lessonId/videoId as base key
                s3Service.uploadDirectory(streamBucket, outputDir, baseKey);
                log.info("Uploaded transcoded files for videoId={} lessonId={} to bucket {} with base key {}", message.getVideoId(), message.getLessonId(), streamBucket, baseKey);

                // Send processed event
                VideoProcessedEvent event = VideoProcessedEvent.builder()
                    .videoId(message.getVideoId())
                    .lessonId(message.getLessonId())
                    .status(VideoStatus.READY)
                    .masterPlaylistUrl("s3://" + streamBucket + "/" + baseKey + "/playlist.m3u8")
                    .processedAt(LocalDateTime.now())
                    .build();
                videoProcessedKafkaTemplate.send(videoProcessedTopic, String.valueOf(message.getVideoId()), event);
                log.info("Sent VideoProcessedEvent for videoId={}", message.getVideoId());
            } else {
                log.warn("VIDEO-STREAM bucket not configured, skipping upload after transcoding for videoId={}", message.getVideoId());
            }

            // Log completion
            log.info("Transcoding finished for videoId={} outputDir={}", message.getVideoId(), outputDir);

        } catch (Exception e) {
            log.error("Failed to process videoId={}", message.getVideoId(), e);
            if (cleanupOnFailure) {
                try {
                    deleteRecursively(jobDir);
                } catch (IOException ex) {
                    log.warn("Failed to cleanup after failure for job {}", jobDir, ex);
                }
            }
            throw new TranscodingException("Processing failed for videoId=" + message.getVideoId(), e);
        }

        // Cleanup only after successful processing when configured
        if (cleanupAfterProcessing) {
            try {
                deleteRecursively(jobDir);
                log.debug("Cleaned up job directory {} after successful processing", jobDir);
            } catch (IOException ex) {
                log.warn("Failed to cleanup job directory {} after processing", jobDir, ex);
            }
        }
    }

    // downloadVideoTo removed: downloading is performed via S3Service.downloadObject(bucket, key, dest)

    private void deleteRecursively(Path dir) throws IOException {
        if (dir == null) return;
        if (!Files.exists(dir)) return;
        try (Stream<Path> stream = Files.walk(dir)) {
            stream.sorted(Comparator.reverseOrder()).forEach(p -> {
                try {
                    Files.deleteIfExists(p);
                } catch (IOException ex) {
                    log.warn("Failed to delete path {}", p, ex);
                }
            });
        }
    }
    
    
    /**
     * Perform FFmpeg transcoding
     */
    private void performTranscoding(Path inputVideoPath, Path outputDir) {
        // Check if FFmpeg is available
        if (!ffmpegService.isFFmpegAvailable()) {
            throw new TranscodingException("FFmpeg is not available on this system");
        }
        
        // Get video info for logging
        String videoInfo = ffmpegService.getVideoInfo(inputVideoPath);
        log.debug("Input video info: {}", videoInfo);
        
        // Create output directory if it doesn't exist
        try {
            Files.createDirectories(outputDir);
        } catch (IOException e) {
            throw new TranscodingException("Failed to create output directory", e);
        }
        
        // Perform HLS transcoding
        ffmpegService.transcodeToHLS(inputVideoPath, outputDir);
        
        // Verify output files were created
        verifyTranscodingOutput(outputDir);
    }
    
    /**
     * Verify that transcoding produced expected output files
     */
    private void verifyTranscodingOutput(Path outputDir) {
        Path masterPlaylist = outputDir.resolve("playlist.m3u8");
        if (!Files.exists(masterPlaylist)) {
            throw new TranscodingException("Master playlist file not found after transcoding");
        }
        
        log.info("Transcoding verification passed - master playlist exists");
    }
}