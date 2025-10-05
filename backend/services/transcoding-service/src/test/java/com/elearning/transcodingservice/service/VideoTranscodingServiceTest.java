package com.elearning.transcodingservice.service;

import com.elearning.transcodingservice.dto.VideoTranscodingMessage;
import com.elearning.transcodingservice.enums.VideoStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Path;
import java.nio.file.Paths;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VideoTranscodingServiceTest {
    
    @Mock
    private S3Service s3Service;
    
    @Mock
    private FFmpegService ffmpegService;
    
    @Mock
    private CourseServiceClient courseServiceClient;
    
    @InjectMocks
    private VideoTranscodingService videoTranscodingService;
    
    private VideoTranscodingMessage testMessage;
    
    @BeforeEach
    void setUp() {
        // Set up test configuration
        ReflectionTestUtils.setField(videoTranscodingService, "workspaceRoot", "/tmp/test-transcoding");
        ReflectionTestUtils.setField(videoTranscodingService, "cleanupAfterProcessing", true);
        
        // Create test message
        testMessage = new VideoTranscodingMessage();
        testMessage.setBucket("raw-videos");
        testMessage.setKey("courses/123/original.mp4");
        testMessage.setVideoId("test-video-123");
        testMessage.setLessonId("course-123");
        testMessage.setOriginalFilename("test-video.mp4");
        testMessage.setFileSize(1000000L);
        testMessage.setContentType("video/mp4");
    }
    
    @Test
    void processVideoTranscoding_Success() {
        // Arrange
        when(ffmpegService.isFFmpegAvailable()).thenReturn(true);
        when(s3Service.getStreamingAssetsBucket()).thenReturn("streaming-assets");
        doNothing().when(s3Service).downloadFile(anyString(), anyString(), any(Path.class));
        doNothing().when(ffmpegService).transcodeToHLS(any(Path.class), any(Path.class));
        doNothing().when(s3Service).uploadDirectory(anyString(), anyString(), any(Path.class));
        doNothing().when(courseServiceClient).updateVideoStatus(any());
        
        // Act & Assert (should not throw exception)
        videoTranscodingService.processVideoTranscoding(testMessage);
        
        // Verify interactions
        verify(s3Service).downloadFile(eq("raw-videos"), eq("courses/123/original.mp4"), any(Path.class));
        verify(ffmpegService).transcodeToHLS(any(Path.class), any(Path.class));
        verify(s3Service).uploadDirectory(eq("streaming-assets"), anyString(), any(Path.class));
        verify(courseServiceClient).updateVideoStatus(any());
    }
    
    @Test
    void processVideoTranscoding_FFmpegNotAvailable() {
        // Arrange
        when(ffmpegService.isFFmpegAvailable()).thenReturn(false);
        doNothing().when(s3Service).downloadFile(anyString(), anyString(), any(Path.class));
        
        // Act & Assert
        try {
            videoTranscodingService.processVideoTranscoding(testMessage);
        } catch (Exception e) {
            // Expected exception
        }
        
        // Verify that status was updated to FAILED
        verify(courseServiceClient).updateVideoStatus(argThat(request -> 
            VideoStatus.FAILED.name().equals(request.getStatus())));
    }
}