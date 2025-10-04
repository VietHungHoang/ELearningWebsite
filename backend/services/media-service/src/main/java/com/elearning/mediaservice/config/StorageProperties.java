package com.elearning.mediaservice.config;

import com.elearning.mediaservice.enums.MediaType;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

@Component
@ConfigurationProperties(prefix = "aws.s3")
@Data
public class StorageProperties {

    // Use String keys to match YAML, then convert to MediaType keys
    private Map<String, StorageInfo> buckets = new HashMap<>();
    
    // Internal map for MediaType lookup
    private Map<MediaType, StorageInfo> mediaTypeBuckets = new HashMap<>();

    @PostConstruct
    public void init() {
        System.out.println("StorageProperties init() called");
        System.out.println("Buckets from YAML: " + buckets);
        
        // Convert String keys from YAML to MediaType keys
        if (buckets.containsKey("IMAGE")) {
            mediaTypeBuckets.put(MediaType.IMAGE, buckets.get("IMAGE"));
            System.out.println("Added IMAGE config: " + buckets.get("IMAGE"));
        } else {
            System.out.println("No IMAGE config found in buckets");
        }
        if (buckets.containsKey("VIDEO")) {
            mediaTypeBuckets.put(MediaType.VIDEO, buckets.get("VIDEO"));
            System.out.println("Added VIDEO config: " + buckets.get("VIDEO"));
        } else {
            System.out.println("No VIDEO config found in buckets");
        }
        if (buckets.containsKey("DOCUMENT")) {
            mediaTypeBuckets.put(MediaType.DOCUMENT, buckets.get("DOCUMENT"));
            System.out.println("Added DOCUMENT config: " + buckets.get("DOCUMENT"));
        } else {
            System.out.println("No DOCUMENT config found in buckets");
        }
        
        System.out.println("Final mediaTypeBuckets: " + mediaTypeBuckets);
    }

    public StorageInfo getImagesConfig() {
        return mediaTypeBuckets.get(MediaType.IMAGE);
    }

    public StorageInfo getVideosConfig() {
        return mediaTypeBuckets.get(MediaType.VIDEO);
    }

    public StorageInfo getDocumentsConfig() {
        return mediaTypeBuckets.get(MediaType.DOCUMENT);
    }
    
    public StorageInfo getBucketInfo(MediaType mediaType) {
        return mediaTypeBuckets.get(mediaType);
    }
}