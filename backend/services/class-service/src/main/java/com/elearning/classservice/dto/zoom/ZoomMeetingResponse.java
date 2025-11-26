package com.elearning.classservice.dto.zoom;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response from Zoom create meeting API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoomMeetingResponse {
    
    @JsonProperty("id")
    private Long id; // Meeting ID
    
    @JsonProperty("host_id")
    private String hostId;
    
    private String topic;
    
    @JsonProperty("type")
    private Integer type;
    
    @JsonProperty("start_time")
    private String startTime;
    
    private Integer duration;
    
    private String timezone;
    
    private String agenda;
    
    @JsonProperty("created_at")
    private String createdAt;
    
    @JsonProperty("start_url")
    private String startUrl; // URL for host to start meeting
    
    @JsonProperty("join_url")
    private String joinUrl; // URL for participants to join
    
    private String password;
    
    @JsonProperty("h323_password")
    private String h323Password;
    
    @JsonProperty("encrypted_password")
    private String encryptedPassword;
    
    private Settings settings;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Settings {
        @JsonProperty("host_video")
        private Boolean hostVideo;
        
        @JsonProperty("participant_video")
        private Boolean participantVideo;
        
        @JsonProperty("waiting_room")
        private Boolean waitingRoom;
        
        @JsonProperty("join_before_host")
        private Boolean joinBeforeHost;
    }
}
