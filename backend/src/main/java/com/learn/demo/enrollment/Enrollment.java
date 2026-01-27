package com.learn.demo.enrollment;




import com.learn.demo.course.Course;
import com.learn.demo.user.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity

@Table(
        schema = "enrollments",
        uniqueConstraints = @UniqueConstraint(
                name = "uc_user_course",
                columnNames = {"user_id", "course_id"}
        )
)


@EntityListeners(AuditingEntityListener.class)   //for @CreatedDate

public class Enrollment {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "enrollment_id")
    private int enrollmentId;




    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;


    @CreatedDate
    @Column(name = "enroll_at", nullable = false, updatable = false)
    private LocalDateTime enrolled_At;





    public Enrollment() {


    }

    public Enrollment(int enrollmentId, User user, Course course, EnrollmentStatus status, LocalDateTime enrolled_At) {
        this.enrollmentId = enrollmentId;
        this.user = user;
        this.course = course;
        this.status = status;
        this.enrolled_At = enrolled_At;
    }

    public int getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(int enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public EnrollmentStatus getStatus() {
        return status;
    }

    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }

    public LocalDateTime getEnrolled_At() {
        return enrolled_At;
    }

    public void setEnrolled_At(LocalDateTime enrolled_At) {
        this.enrolled_At = enrolled_At;
    }
}
