
package com.learn.demo.enrollment;

import com.learn.demo.course.CourseRepository;
import com.learn.demo.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepo;
    private final UserRepository userRepo;
    private final CourseRepository courseRepo;

    public EnrollmentService(EnrollmentRepository e, UserRepository u, CourseRepository c) {
        this.enrollmentRepo = e; this.userRepo = u; this.courseRepo = c;
    }

    @Transactional
    public Enrollment enrollByIds(int user_Id, int course_Id) {


        var user   = userRepo.findById(user_Id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        var course = courseRepo.findById(course_Id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));


        if (enrollmentRepo. existsByUserAndCourse(user,course)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already enrolled");
        }


        var e = new Enrollment();
       e.setUser(user);
        e.setCourse(course);
        e.setStatus(EnrollmentStatus.ACTIVE);

        return enrollmentRepo.save(e);
    }

    public List<EnrollmentDTO> getEnrollmentsByUserId(int userId) {
        if (!userRepo.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return enrollmentRepo.findByUserUserId(userId)
                .stream()
                .map(EnrollmentDTO::new)
                .toList();
    }


}
