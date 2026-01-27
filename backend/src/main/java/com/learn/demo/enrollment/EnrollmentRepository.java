package com.learn.demo.enrollment;


import com.learn.demo.course.Course;
import com.learn.demo.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository


public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {



    // Check if a user is already enrolled in a course
    boolean existsByUserAndCourse(User user, Course course);

    // Get all enrollments for a given user ID
    List<Enrollment> findByUserUserId(int userId);
}
