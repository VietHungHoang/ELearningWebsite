package com.elearning.transcodingservice.service;

import com.elearning.transcodingservice.exception.TranscodingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

/**
 * Main service for video transcoding workflow
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VideoTranscodingService {
    
    private final FFmpegService ffmpegService;
    
    @Value("${processing.workspace-root:/tmp/transcoding}")
    private String workspaceRoot;
    
    @Value("${processing.cleanup-after-processing:true}")
    private boolean cleanupAfterProcessing;
    
    @Value("${processing.cleanup-on-failure:false}")
    private boolean cleanupOnFailure;
    
    /**
     * Process video transcoding
     */
    public void transcodeVideo(Path inputVideoPath, Path outputDir) {
        String jobId = UUID.randomUUID().toString();
        long startTime = System.currentTimeMillis();
        
        try {
            log.info("Starting video transcoding job {} for input: {}", jobId, inputVideoPath);
            
            // Perform FFmpeg transcoding
            performTranscoding(inputVideoPath, outputDir);
            log.info("Transcoding completed, output in: {}", outputDir);
            
            log.info("Video transcoding job {} completed successfully in {} ms", 
                    jobId, System.currentTimeMillis() - startTime);
            
        } catch (Exception e) {
            log.error("Video transcoding job {} failed", jobId, e);
            throw new TranscodingException("Video transcoding failed", e);
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