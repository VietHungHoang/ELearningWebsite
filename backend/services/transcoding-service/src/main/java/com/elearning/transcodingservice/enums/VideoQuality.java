package com.elearning.transcodingservice.enums;

/**
 * Enumeration for video quality configurations
 */
public enum VideoQuality {
    HD_1080P("1080p", "5000k", "192k", 1920, 1080),
    HD_720P("720p", "3000k", "128k", 1280, 720),
    SD_480P("480p", "1500k", "96k", 854, 480);
    
    private final String resolution;
    private final String videoBitrate;
    private final String audioBitrate;
    private final int width;
    private final int height;
    
    VideoQuality(String resolution, String videoBitrate, String audioBitrate, int width, int height) {
        this.resolution = resolution;
        this.videoBitrate = videoBitrate;
        this.audioBitrate = audioBitrate;
        this.width = width;
        this.height = height;
    }
    
    public String getResolution() {
        return resolution;
    }
    
    public String getVideoBitrate() {
        return videoBitrate;
    }
    
    public String getAudioBitrate() {
        return audioBitrate;
    }
    
    public int getWidth() {
        return width;
    }
    
    public int getHeight() {
        return height;
    }
}