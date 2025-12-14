package com.elearning.testservice.controller;

import com.elearning.testservice.data.TutorDataGenerator;
import com.elearning.testservice.dto.AssignRoleRequest;
import com.elearning.testservice.dto.TutorRequest;
import com.elearning.testservice.dto.TutorAvailabilityRequest;
import com.elearning.testservice.dto.TutorLanguageRequest;
import com.elearning.testservice.dto.TutorReviewRequest;
import com.elearning.testservice.dto.TutorSocialRequest;
import com.elearning.testservice.dto.TutorSubjectRequest;
import com.elearning.testservice.dto.UserWithRoles;
import com.elearning.testservice.dto.response.ApiResponse;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.RoleResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final JdbcTemplate keycloakJdbcTemplate;
    private final JdbcTemplate mainJdbcTemplate;
    private final Keycloak keycloak;
    private final TutorDataGenerator tutorDataGenerator;

    @Value("${keycloak.realm}")
    private String realmName;

    public TestController(
            @Qualifier("keycloakJdbcTemplate") JdbcTemplate keycloakJdbcTemplate,
            @Qualifier("mainJdbcTemplate") JdbcTemplate mainJdbcTemplate,
            Keycloak keycloak,
            TutorDataGenerator tutorDataGenerator) {
        this.keycloakJdbcTemplate = keycloakJdbcTemplate;
        this.mainJdbcTemplate = mainJdbcTemplate;
        this.keycloak = keycloak;
        this.tutorDataGenerator = tutorDataGenerator;
    }

    @GetMapping("/keycloak-user-ids")
    public ResponseEntity<ApiResponse<List<UUID>>> getKeycloakUserIds() {
        String sql = "SELECT id FROM user_entity";
        List<UUID> ids = keycloakJdbcTemplate.query(sql, (rs, rowNum) -> UUID.fromString(rs.getString("id")));
        return ResponseEntity.ok(ApiResponse.success(ids, "Keycloak user IDs retrieved successfully"));
    }

    @GetMapping("/keycloak-users-with-roles")
    public ResponseEntity<ApiResponse<List<UserWithRoles>>> getKeycloakUsersWithRoles() {
        String sql = "SELECT u.id, u.username, string_agg(r.name, ',') as roles " +
                     "FROM user_entity u " +
                     "LEFT JOIN user_role_mapping urm ON u.id = urm.user_id " +
                     "LEFT JOIN keycloak_role r ON urm.role_id = r.id " +
                     "GROUP BY u.id, u.username";
        List<UserWithRoles> users = keycloakJdbcTemplate.query(sql, (rs, rowNum) -> {
            UUID id = UUID.fromString(rs.getString("id"));
            String username = rs.getString("username");
            String rolesStr = rs.getString("roles");
            List<String> roles = rolesStr != null ? Arrays.asList(rolesStr.split(",")) : List.of();
            return new UserWithRoles(id, username, roles);
        });
        return ResponseEntity.ok(ApiResponse.success(users, "Keycloak users with roles retrieved successfully"));
    }

    @PostMapping("/assign-role")
    public ResponseEntity<ApiResponse<String>> assignRole(@RequestBody AssignRoleRequest request) {
        RealmResource realm = keycloak.realm(realmName);
        RoleResource roleResource = realm.roles().get(request.getRoleName());
        if (roleResource == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Role not found: " + request.getRoleName()));
        }
        RoleRepresentation role = roleResource.toRepresentation();

        List<UserRepresentation> usersToUpdate = new ArrayList<>();

        if (request.getUserIds() != null && !request.getUserIds().isEmpty()) {
            for (UUID userId : request.getUserIds()) {
                UserResource userResource = realm.users().get(userId.toString());
                if (userResource != null) {
                    usersToUpdate.add(userResource.toRepresentation());
                }
            }
        }

        if (request.getEmails() != null && !request.getEmails().isEmpty()) {
            for (String email : request.getEmails()) {
                List<UserRepresentation> users = realm.users().search(null, null, null, email, 0, 1);
                if (!users.isEmpty()) {
                    usersToUpdate.add(users.get(0));
                }
            }
        }

        if ((request.getUserIds() == null || request.getUserIds().isEmpty()) &&
            (request.getEmails() == null || request.getEmails().isEmpty())) {
            // Update all users
            List<UserRepresentation> allUsers = realm.users().list();
            usersToUpdate.addAll(allUsers);
        }

        for (UserRepresentation user : usersToUpdate) {
            UserResource userResource = realm.users().get(user.getId());
            userResource.roles().realmLevel().add(List.of(role));
        }

        return ResponseEntity.ok(ApiResponse.success("Role assigned successfully to " + usersToUpdate.size() + " users", "Role assignment completed"));
    }

    @PostMapping("/bulk-insert-tutors")
    public ResponseEntity<ApiResponse<String>> bulkInsertTutors(@RequestBody List<TutorRequest> tutors) {
        int count = tutors.size();

        // Get latest x user IDs from Keycloak
        String userSql = "SELECT id FROM user_entity ORDER BY created_timestamp DESC LIMIT ?";
        List<UUID> userIds = keycloakJdbcTemplate.query(userSql, (rs, rowNum) -> UUID.fromString(rs.getString("id")), count);

        if (userIds.size() < count) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Not enough users in Keycloak. Found: " + userIds.size() + ", needed: " + count));
        }

        // Sample timezones
        List<String> timezones = Arrays.asList("+07:00", "+08:00", "+09:00", "+10:00", "+11:00", "+12:00", "-05:00", "-06:00", "-07:00", "-08:00", "+00:00", "+01:00", "+02:00");
        Random random = new Random();

        String sql = "INSERT INTO tutors (id, name, avatar_url, is_verified, bio, specialization, nationality_code, video_url, video_thumbnail_url, current_session_fee, previous_session_fee, session_duration_minutes, currency, teaches_in_groups, max_group_members, timezone_offset) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        int[] results = mainJdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                TutorRequest tutor = tutors.get(i);
                ps.setObject(1, userIds.get(i));
                ps.setString(2, tutor.getName());
                ps.setString(3, tutor.getAvatarUrl());
                ps.setBoolean(4, tutor.getIsVerified() != null ? tutor.getIsVerified() : false);
                ps.setString(5, tutor.getBio());
                ps.setString(6, tutor.getSpecialization());
                ps.setString(7, tutor.getNationalityCode());
                ps.setString(8, tutor.getVideoUrl());
                ps.setString(9, tutor.getVideoThumbnailUrl());
                ps.setBigDecimal(10, tutor.getCurrentSessionFee());
                ps.setBigDecimal(11, tutor.getPreviousSessionFee());
                ps.setInt(12, tutor.getSessionDurationMinutes());
                ps.setString(13, tutor.getCurrency());
                ps.setBoolean(14, tutor.getTeachesInGroups() != null ? tutor.getTeachesInGroups() : false);
                ps.setInt(15, tutor.getMaxGroupMembers());
                ps.setString(16, timezones.get(random.nextInt(timezones.size())));
            }

            @Override
            public int getBatchSize() {
                return tutors.size();
            }
        });
        int total = Arrays.stream(results).sum();
        return ResponseEntity.ok(ApiResponse.success("Inserted " + total + " tutors with assigned Keycloak user IDs", "Bulk tutors inserted successfully"));
    }

    @PostMapping("/bulk-insert-tutor-availabilities")
    public ResponseEntity<ApiResponse<String>> bulkInsertTutorAvailabilities() {
        // Get all tutor IDs from main DB
        String tutorSql = "SELECT id FROM tutors";
        List<Long> tutorIds = mainJdbcTemplate.query(tutorSql, (rs, rowNum) -> rs.getLong("id"));

        if (tutorIds.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "No tutors in DB"));
        }

        Random random = new Random();
        List<TutorAvailabilityRequest> allData = new ArrayList<>();
        List<Long> assignedTutorIds = new ArrayList<>();

        for (Long tutorId : tutorIds) {
            int num = random.nextInt(9) + 1; // Random number between 1 and 5
            List<TutorAvailabilityRequest> availabilities = tutorDataGenerator.generateTutorAvailabilities(num);
            allData.addAll(availabilities);
            for (int j = 0; j < num; j++) {
                assignedTutorIds.add(tutorId);
            }
        }

        String sql = "INSERT INTO tutor_availabilities (tutor_id, day_of_week, start_time, end_time, effective_start_date, effective_end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        int[] results = mainJdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                TutorAvailabilityRequest availability = allData.get(i);
                ps.setObject(1, assignedTutorIds.get(i));
                ps.setShort(2, availability.getDayOfWeek());
                ps.setObject(3, availability.getStartTime());
                ps.setObject(4, availability.getEndTime());
                ps.setObject(5, availability.getEffectiveStartDate());
                ps.setObject(6, availability.getEffectiveEndDate());
                ps.setString(7, availability.getStatus());
            }

            @Override
            public int getBatchSize() {
                return allData.size();
            }
        });
        int total = Arrays.stream(results).sum();
        return ResponseEntity.ok(ApiResponse.success("Inserted " + total + " tutor availabilities", "Bulk tutor availabilities inserted successfully"));
    }

    @PostMapping("/bulk-insert-tutor-languages")
    public ResponseEntity<ApiResponse<String>> bulkInsertTutorLanguages(@RequestBody(required = false) List<TutorLanguageRequest> languages, @RequestParam(required = false) Integer count) {
        List<TutorLanguageRequest> data;
        if ((languages == null || languages.isEmpty()) && count != null && count > 0) {
            data = tutorDataGenerator.generateTutorLanguages(count);
        } else {
            data = languages;
        }
        if (data == null || data.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "No data provided"));
        }

        int countFinal = data.size();

        // Get latest x tutor IDs from main DB
        String tutorSql = "SELECT id FROM tutors ORDER BY id DESC LIMIT ?";
        List<Long> tutorIds = mainJdbcTemplate.query(tutorSql, (rs, rowNum) -> rs.getLong("id"), countFinal);

        if (tutorIds.size() < countFinal) {
            return ResponseEntity.badRequest().body("Not enough tutors in DB. Found: " + tutorIds.size() + ", needed: " + countFinal);
        }

        String sql = "INSERT INTO tutor_languages (tutor_id, language_code, proficiency_level) VALUES (?, ?, ?)";
        int[] results = mainJdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                TutorLanguageRequest language = data.get(i);
                ps.setObject(1, tutorIds.get(i));
                ps.setString(2, language.getLanguageCode());
                ps.setString(3, language.getProficiencyLevel());
            }

            @Override
            public int getBatchSize() {
                return data.size();
            }
        });
        int total = Arrays.stream(results).sum();
        return ResponseEntity.ok(ApiResponse.success("Inserted " + total + " tutor languages", "Bulk tutor languages inserted successfully"));
    }

    @PostMapping("/bulk-insert-tutor-reviews")
    public ResponseEntity<ApiResponse<String>> bulkInsertTutorReviews(@RequestBody(required = false) List<TutorReviewRequest> reviews, @RequestParam(required = false) Integer count) {
        List<TutorReviewRequest> data;
        if ((reviews == null || reviews.isEmpty()) && count != null && count > 0) {
            data = tutorDataGenerator.generateTutorReviews(count);
        } else {
            data = reviews;
        }
        if (data == null || data.isEmpty()) {
            return ResponseEntity.badRequest().body("No data provided");
        }

        int countFinal = data.size();

        // Get latest x tutor IDs from main DB
        String tutorSql = "SELECT id FROM tutors ORDER BY id DESC LIMIT ?";
        List<Long> tutorIds = mainJdbcTemplate.query(tutorSql, (rs, rowNum) -> rs.getLong("id"), countFinal);

        if (tutorIds.size() < countFinal) {
            return ResponseEntity.badRequest().body("Not enough tutors in DB. Found: " + tutorIds.size() + ", needed: " + countFinal);
        }

        // Get latest x student IDs from Keycloak
        String studentSql = "SELECT id FROM user_entity ORDER BY created_timestamp DESC LIMIT ?";
        List<UUID> studentIds = keycloakJdbcTemplate.query(studentSql, (rs, rowNum) -> UUID.fromString(rs.getString("id")), countFinal);

        if (studentIds.size() < countFinal) {
            return ResponseEntity.badRequest().body("Not enough students in Keycloak. Found: " + studentIds.size() + ", needed: " + countFinal);
        }

        String sql = "INSERT INTO tutor_reviews (tutor_id, student_id, rating, comment) VALUES (?, ?, ?, ?)";
        int[] results = mainJdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                TutorReviewRequest review = data.get(i);
                ps.setObject(1, tutorIds.get(i));
                ps.setObject(2, studentIds.get(i));
                ps.setInt(3, review.getRating());
                ps.setString(4, review.getComment());
            }

            @Override
            public int getBatchSize() {
                return data.size();
            }
        });
        int total = Arrays.stream(results).sum();
        return ResponseEntity.ok(ApiResponse.success("Inserted " + total + " tutor reviews", "Bulk tutor reviews inserted successfully"));
    }

    @PostMapping("/bulk-insert-tutor-socials")
    public ResponseEntity<ApiResponse<String>> bulkInsertTutorSocials(@RequestBody(required = false) List<TutorSocialRequest> socials, @RequestParam(required = false) Integer count) {
        List<TutorSocialRequest> data;
        if ((socials == null || socials.isEmpty()) && count != null && count > 0) {
            data = tutorDataGenerator.generateTutorSocials(count);
        } else {
            data = socials;
        }
        if (data == null || data.isEmpty()) {
            return ResponseEntity.badRequest().body("No data provided");
        }

        int countFinal = data.size();

        // Get latest x tutor IDs from main DB
        String tutorSql = "SELECT id FROM tutors ORDER BY id DESC LIMIT ?";
        List<Long> tutorIds = mainJdbcTemplate.query(tutorSql, (rs, rowNum) -> rs.getLong("id"), countFinal);

        if (tutorIds.size() < countFinal) {
            return ResponseEntity.badRequest().body("Not enough tutors in DB. Found: " + tutorIds.size() + ", needed: " + countFinal);
        }

        String sql = "INSERT INTO tutor_socials (tutor_id, platform, url) VALUES (?, ?, ?)";
        int[] results = mainJdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                TutorSocialRequest social = data.get(i);
                ps.setObject(1, tutorIds.get(i));
                ps.setString(2, social.getPlatform());
                ps.setString(3, social.getUrl());
            }

            @Override
            public int getBatchSize() {
                return data.size();
            }
        });
        int total = Arrays.stream(results).sum();
        return ResponseEntity.ok(ApiResponse.success("Inserted " + total + " tutor socials", "Bulk tutor socials inserted successfully"));
    }

    @PostMapping("/bulk-insert-tutor-subjects")
    public ResponseEntity<ApiResponse<String>> bulkInsertTutorSubjects(@RequestBody(required = false) List<TutorSubjectRequest> subjects, @RequestParam(required = false) Integer count) {
        List<TutorSubjectRequest> data;
        if ((subjects == null || subjects.isEmpty()) && count != null && count > 0) {
            data = tutorDataGenerator.generateTutorSubjects(count);
        } else {
            data = subjects;
        }
        if (data == null || data.isEmpty()) {
            return ResponseEntity.badRequest().body("No data provided");
        }

        int countFinal = data.size();

        // Get latest x tutor IDs from main DB
        String tutorSql = "SELECT id FROM tutors ORDER BY id DESC LIMIT ?";
        List<Long> tutorIds = mainJdbcTemplate.query(tutorSql, (rs, rowNum) -> rs.getLong("id"), countFinal);

        if (tutorIds.size() < countFinal) {
            return ResponseEntity.badRequest().body("Not enough tutors in DB. Found: " + tutorIds.size() + ", needed: " + countFinal);
        }

        String sql = "INSERT INTO tutor_subjects (tutor_id, category_id, subject_name) VALUES (?, ?, ?)";
        int[] results = mainJdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                TutorSubjectRequest subject = data.get(i);
                ps.setObject(1, tutorIds.get(i));
                ps.setObject(2, subject.getCategoryId());
                ps.setString(3, subject.getSubjectName());
            }

            @Override
            public int getBatchSize() {
                return data.size();
            }
        });
        int total = Arrays.stream(results).sum();
        return ResponseEntity.ok(ApiResponse.success("Inserted " + total + " tutor subjects", "Bulk tutor subjects inserted successfully"));
    }
}