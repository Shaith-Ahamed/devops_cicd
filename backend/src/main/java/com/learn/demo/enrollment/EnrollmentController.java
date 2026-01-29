
package com.learn.demo.enrollment;



import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000","http://3.238.141.63:3000"})

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentService service;

    public EnrollmentController(EnrollmentService service) {
        this.service = service;
    }


    @PostMapping("/doEnrollment")
    public ResponseEntity<String> doEnrollment(@RequestBody  EnrollmentRequest body) {
        var saved = service.enrollByIds(body.getUserId(), body.getCourseId());

        var id = saved.getEnrollmentId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Enrollment " + id + " created");
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EnrollmentDTO>> getUserEnrollments(@PathVariable int userId) {
        var enrollments = service.getEnrollmentsByUserId(userId);
        return ResponseEntity.ok(enrollments);
    }
}




