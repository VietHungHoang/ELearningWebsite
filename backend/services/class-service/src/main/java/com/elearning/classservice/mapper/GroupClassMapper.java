package com.elearning.classservice.mapper;

import com.elearning.classservice.dto.response.GroupClassResponse;
import com.elearning.classservice.entity.ClassEntity;
import com.elearning.classservice.entity.StudentInClass;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class GroupClassMapper {

    public GroupClassResponse mapToGroupClassResponse(ClassEntity classEntity) {
        List<GroupClassResponse.GroupClassStudent> students = new ArrayList<>();
        List<StudentInClass> studentInClasses = classEntity.getStudentInClasses();
        if (studentInClasses != null) {
            for (StudentInClass studentInClass : studentInClasses) {
                students.add(GroupClassResponse.GroupClassStudent.builder()
                        .id(studentInClass.getStudentId())
                        .name(studentInClass.getStudentName())
                        .build());
            }
        }

        return GroupClassResponse.builder()
                .classId(classEntity.getId())
                .classTitle(classEntity.getTitle())
                .classDescription(classEntity.getDescription())
                .maxStudents(classEntity.getMaxStudents())
                .students(students)
                .build();
    }
}