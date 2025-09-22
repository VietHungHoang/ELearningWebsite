package com.elearning.quiz.controller;

import com.elearning.quiz.dto.LessonProgressRequest;
import com.elearning.quiz.dto.LessonProgressResponse;
import com.elearning.quiz.model.Lesson;
import com.elearning.quiz.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonProgressController {

    @Autowired
    private LessonRepository lessonRepository;

    @PutMapping("/{lessonId}/progress")
    public ResponseEntity<LessonProgressResponse> updateLessonProgress(
            @PathVariable String lessonId,
            @RequestBody LessonProgressRequest request) {
        
        try {
            // Find the lesson
            Lesson lesson = lessonRepository.findById(lessonId).orElse(null);
            if (lesson == null) {
                return ResponseEntity.notFound().build();
            }

            // Update lesson progress
            lesson.setIsCompleted(request.isCompleted());
            lesson.setIsCurrent(request.isCurrent());
            lesson.setIsLocked(request.isLocked());
            
            // Save the updated lesson
            lessonRepository.save(lesson);

            // Create response
            LessonProgressResponse response = new LessonProgressResponse();
            response.setSuccess(true);
            response.setMessage("Lesson progress updated successfully");
            response.setLessonId(lessonId);
            response.setIsCompleted(lesson.getIsCompleted());
            response.setIsCurrent(lesson.getIsCurrent());
            response.setIsLocked(lesson.getIsLocked());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            LessonProgressResponse response = new LessonProgressResponse();
            response.setSuccess(false);
            response.setMessage("Failed to update lesson progress: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/{lessonId}/progress")
    public ResponseEntity<LessonProgressResponse> getLessonProgress(@PathVariable String lessonId) {
        try {
            Lesson lesson = lessonRepository.findById(lessonId).orElse(null);
            if (lesson == null) {
                return ResponseEntity.notFound().build();
            }

            LessonProgressResponse response = new LessonProgressResponse();
            response.setSuccess(true);
            response.setMessage("Lesson progress retrieved successfully");
            response.setLessonId(lessonId);
            response.setIsCompleted(lesson.getIsCompleted());
            response.setIsCurrent(lesson.getIsCurrent());
            response.setIsLocked(lesson.getIsLocked());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            LessonProgressResponse response = new LessonProgressResponse();
            response.setSuccess(false);
            response.setMessage("Failed to get lesson progress: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
