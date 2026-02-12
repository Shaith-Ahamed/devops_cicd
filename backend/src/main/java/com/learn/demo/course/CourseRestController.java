package com.learn.demo.course;


import com.learn.demo.user.User;
import com.learn.demo.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


// @CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://13.219.233.90:3000"})

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/courses")



public class CourseRestController {

    @Autowired
    private CourseRepository courseRepository;



    @GetMapping("/getAllCourses")
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }



    @GetMapping("getCourseById/{course_id}")
    public ResponseEntity<?> getCourseById(@PathVariable("course_id") int courseId) {
        Optional<Course> course = courseRepository.findById(courseId);

        if (course.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(course.get());
    }




    @PostMapping("/addCourse")
    public ResponseEntity<String> addCourse(@RequestBody Course newCourse) {

        courseRepository.save(newCourse);
        return new ResponseEntity<>("Course " + newCourse.getCategory() + " " +newCourse.getDescription() + " " + "is added", HttpStatusCode.valueOf(201));
    }







    @PutMapping("/updateCourse/{instructor_Id}/{course_Id}")
    public ResponseEntity<String> updateCourse(
            @PathVariable String instructor_Id,
            @PathVariable int course_Id,
            @RequestBody Course updateCourse) {


        if (instructor_Id == null || instructor_Id.isEmpty() || course_Id <= 0) {
            return ResponseEntity.badRequest().body("Invalid instructor ID or course ID");
        }


        Optional<Course> optionalCourse = courseRepository.findById(course_Id);
        if (optionalCourse.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Course with ID " + course_Id + " not found");
        }

        Course existingCourse = optionalCourse.get();
        if (!existingCourse.getInstructor_Id().equals(instructor_Id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Instructor " + instructor_Id + " is not authorized to update this course");
        }


        existingCourse.setDescription(updateCourse.getDescription());
        existingCourse.setCategory(updateCourse.getCategory());
        existingCourse.setPrice(updateCourse.getPrice());
        existingCourse.setImage_url(updateCourse.getImage_url());


        courseRepository.save(existingCourse);

        return ResponseEntity.ok(
                "Course '" + existingCourse.getDescription() + "' updated successfully by instructor " + instructor_Id
        );
    }







    @DeleteMapping("/deleteCourse/{instructor_Id}/{course_Id}")
    public ResponseEntity<String> deleteCourse(
            @PathVariable String instructor_Id,
            @PathVariable int course_Id) {


        if (instructor_Id == null || instructor_Id.isEmpty() || course_Id <= 0) {
            return ResponseEntity.badRequest().body("Invalid instructor ID or course ID");
        }


        Optional<Course> optionalCourse = courseRepository.findById(course_Id);
        if (optionalCourse.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Course with ID " + course_Id + " not found");
        }

        Course courseToDelete = optionalCourse.get();
        if (!courseToDelete.getInstructor_Id().equals(instructor_Id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Instructor " + instructor_Id + " is not authorized to delete this course");
        }


        courseRepository.deleteById(course_Id);

        return ResponseEntity.ok(
                "Course '" + courseToDelete.getDescription() + "' deleted successfully by instructor " + instructor_Id
        );
    }





















}
