package com.elearning.courseservice.utils;

import com.elearning.courseservice.enums.CourseLevel;

public class CourseUtils {
    
    public static CourseLevel convertLevelStringToEnum(String level) {
        return CourseLevel.valueOf(level.toUpperCase().replace("-", "_"));
    }
}