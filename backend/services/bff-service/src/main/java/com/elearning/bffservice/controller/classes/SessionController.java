package com.elearning.bffservice.controller.classes;

import com.elearning.bffservice.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/bff/classes/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final ClassService classService;

    

}
