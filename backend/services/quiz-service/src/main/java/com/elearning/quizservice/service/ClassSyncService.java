package com.elearning.quizservice.service;

import com.elearning.quizservice.dto.request.UserInfoDto;
import com.elearning.quizservice.entity.ClassInfo;
import com.elearning.quizservice.entity.User;
import com.elearning.quizservice.repository.ClassInfoRepository;
import com.elearning.quizservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service for managing denormalized class data
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ClassSyncService {
    
    private final ClassInfoRepository classInfoRepository;
    private final UserRepository userRepository;
    
    /**
     * Save or update class info with students (called from controllers when class info is provided)
     */
    @Transactional
    public ClassInfo saveOrUpdateClass(UUID classId, String classTitle, List<UserInfoDto> students) {
        // Save/update students first
        List<User> studentEntities = new ArrayList<>();
        if (students != null && !students.isEmpty()) {
            for (UserInfoDto studentDto : students) {
                User student = userRepository.findById(studentDto.getId())
                        .orElse(User.builder()
                                .id(studentDto.getId())
                                .fullName(studentDto.getFullName())
                                .avatarUrl(studentDto.getAvatarUrl())
                                .build());
                
                student.setFullName(studentDto.getFullName());
                student.setAvatarUrl(studentDto.getAvatarUrl());
                student = userRepository.save(student);
                studentEntities.add(student);
            }
            log.debug("Saved/Updated {} students for class {}", studentEntities.size(), classId);
        }
        
        // Save/update class info
        ClassInfo classInfo = classInfoRepository.findById(classId)
                .orElse(ClassInfo.builder()
                        .id(classId)
                        .title(classTitle)
                        .students(new ArrayList<>())
                        .build());
        
        classInfo.setTitle(classTitle);
        classInfo.getStudents().clear();
        classInfo.getStudents().addAll(studentEntities);
        
        classInfo = classInfoRepository.save(classInfo);
        log.debug("Saved/Updated class info: {}", classId);
        
        return classInfo;
    }
}
