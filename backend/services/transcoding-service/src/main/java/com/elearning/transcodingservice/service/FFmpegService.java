package com.elearning.transcodingservice.service;

import com.elearning.transcodingservice.enums.VideoQuality;
import com.elearning.transcodingservice.exception.TranscodingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Service for FFmpeg video transcoding operations
 */
@Slf4j
@Service
public class FFmpegService {
    
    @Value("${ffmpeg.binary-path:ffmpeg}")
    private String ffmpegBinaryPath;
    
    @Value("${ffmpeg.hls.segment-duration:10}")
    private int hlsSegmentDuration;
    
    @Value("${ffmpeg.hls.playlist-type:vod}")
    private String hlsPlaylistType;
    
    /**
     * Transcode video to multiple qualities and generate HLS streams
     */
    public void transcodeToHLS(Path inputFile, Path outputDirectory) {
        try {
            log.info("Starting HLS transcoding for: {}", inputFile);
            
            // Create output directory if it doesn't exist
            Files.createDirectories(outputDirectory);
            
            // Build FFmpeg command for multiple quality adaptive streaming
            List<String> command = buildHLSCommand(inputFile, outputDirectory);
            
            log.info("Executing FFmpeg command: {}", String.join(" ", command));
            
            // Execute FFmpeg process
            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.redirectErrorStream(true);
            
            Process process = processBuilder.start();
            
            // Log FFmpeg output
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.debug("FFmpeg: {}", line);
                }
            }
            
            // Wait for process to complete
            boolean finished = process.waitFor(30, TimeUnit.MINUTES);
            
            if (!finished) {
                process.destroyForcibly();
                throw new TranscodingException("FFmpeg process timed out after 30 minutes");
            }
            
            int exitCode = process.exitValue();
            if (exitCode != 0) {
                throw new TranscodingException("FFmpeg process failed with exit code: " + exitCode);
            }
            
            log.info("HLS transcoding completed successfully for: {}", inputFile);
            
        } catch (IOException | InterruptedException e) {
            log.error("Error during HLS transcoding", e);
            throw new TranscodingException("Error during HLS transcoding", e);
        }
    }
    
    /**
     * Build FFmpeg command for HLS transcoding with multiple qualities
     */
    private List<String> buildHLSCommand(Path inputFile, Path outputDirectory) {
        List<String> command = new ArrayList<>();
        
        command.add(ffmpegBinaryPath);
        command.add("-i");
        command.add(inputFile.toString());
        
        // Video encoding settings
        command.add("-c:v");
        command.add("libx264");
        command.add("-preset");
        command.add("medium");
        command.add("-crf");
        command.add("23");
        command.add("-sc_threshold");
        command.add("0");
        command.add("-g");
        command.add("48");
        command.add("-keyint_min");
        command.add("48");
        
        // Audio encoding settings
        command.add("-c:a");
        command.add("aac");
        command.add("-ar");
        command.add("48000");
        command.add("-ac");
        command.add("2");
        
        // Multiple quality outputs
        VideoQuality[] qualities = VideoQuality.values();
        
        // Map streams for different qualities
        for (int i = 0; i < qualities.length; i++) {
            VideoQuality quality = qualities[i];
            
            // Video settings for this quality
            command.add("-map");
            command.add("0:v:0");
            command.add("-map");
            command.add("0:a:0");
            
            command.add("-s:" + i);
            command.add(quality.getWidth() + "x" + quality.getHeight());
            command.add("-b:v:" + i);
            command.add(quality.getVideoBitrate());
            command.add("-b:a:" + i);
            command.add(quality.getAudioBitrate());
        }
        
        // HLS settings
        command.add("-f");
        command.add("hls");
        command.add("-hls_time");
        command.add(String.valueOf(hlsSegmentDuration));
        command.add("-hls_playlist_type");
        command.add(hlsPlaylistType);
        command.add("-hls_flags");
        command.add("independent_segments");
        command.add("-hls_segment_type");
        command.add("mpegts");
        
        // Master playlist
        command.add("-master_pl_name");
        command.add("playlist.m3u8");
        
        // Adaptive streaming with variant playlists
        StringBuilder varStreamMap = new StringBuilder();
        for (int i = 0; i < qualities.length; i++) {
            VideoQuality quality = qualities[i];
            if (i > 0) varStreamMap.append(" ");
            varStreamMap.append("v:").append(i).append(",a:").append(i).append(",name:").append(quality.getResolution());
        }
        
        command.add("-var_stream_map");
        command.add(varStreamMap.toString());
        
        // Output pattern
        command.add(outputDirectory.resolve("%v/playlist.m3u8").toString());
        
        return command;
    }
    
    /**
     * Check if FFmpeg is available
     */
    public boolean isFFmpegAvailable() {
        try {
            Process process = new ProcessBuilder(ffmpegBinaryPath, "-version").start();
            return process.waitFor(5, TimeUnit.SECONDS) && process.exitValue() == 0;
        } catch (IOException | InterruptedException e) {
            log.warn("FFmpeg not available at path: {}", ffmpegBinaryPath);
            return false;
        }
    }
    
    /**
     * Get video information using ffprobe
     */
    public String getVideoInfo(Path videoFile) {
        try {
            List<String> command = Arrays.asList(
                "ffprobe",
                "-v", "quiet",
                "-print_format", "json",
                "-show_format",
                "-show_streams",
                videoFile.toString()
            );
            
            ProcessBuilder processBuilder = new ProcessBuilder(command);
            Process process = processBuilder.start();
            
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            
            process.waitFor(10, TimeUnit.SECONDS);
            return output.toString();
            
        } catch (IOException | InterruptedException e) {
            log.warn("Failed to get video info for: {}", videoFile, e);
            return "";
        }
    }
}