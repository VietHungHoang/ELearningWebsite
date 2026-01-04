package com.elearning.classservice.dto.zoom;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request to create a Zoom scheduled meeting
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateZoomMeetingRequest {
    
    private String topic;
    
    @Builder.Default
    @JsonProperty("type")
    private Integer type = 2; // 2 = Scheduled meeting
    
    @JsonProperty("start_time")
    private String startTime; // ISO 8601 format: "2023-11-20T10:00:00Z"
    
    private Integer duration; // in minutes
    
    @Builder.Default
    private String timezone = "Asia/Ho_Chi_Minh";
    
    private String agenda;
    
    private Settings settings;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Settings {
        
        @Builder.Default
        @JsonProperty("host_video")
        private Boolean hostVideo = true;
        
        @Builder.Default
        @JsonProperty("participant_video")
        private Boolean participantVideo = true;
        
        @Builder.Default
        @JsonProperty("join_before_host")
        private Boolean joinBeforeHost = false;
        
        @Builder.Default
        @JsonProperty("mute_upon_entry")
        private Boolean muteUponEntry = false;
        
        @Builder.Default
        @JsonProperty("waiting_room")
        private Boolean waitingRoom = false;
        
        @Builder.Default
        @JsonProperty("audio")
        private String audio = "both"; // both, telephony, voip
        
        @Builder.Default
        @JsonProperty("auto_recording")
        private String autoRecording = "none"; // none, local, cloud
    }
}
