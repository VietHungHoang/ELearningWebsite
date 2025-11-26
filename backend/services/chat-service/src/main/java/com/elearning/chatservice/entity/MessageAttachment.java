package com.elearning.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Message attachment - embedded in Message entity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageAttachment {

    private String fileName;

    private String fileUrl;

    private String fileType;  // MIME type

    private long fileSize;  // Size in bytes

    private String thumbnailUrl;  // For images/videos
}
