package com.learn.demo.enrollment;

public class EnrollmentDTO {

    private final int enrollmentId;
    private final int userId;       
    private final int courseId;   
    private final String courseName; 
    private final String status;    

 
    public EnrollmentDTO(Enrollment enrollment) {
        this.enrollmentId = enrollment.getEnrollmentId();
        this.userId = enrollment.getUser().getUserId();
        this.courseId = enrollment.getCourse().getCourseId();
        this.courseName = enrollment.getCourse().getDescription();
        this.status = enrollment.getStatus().name();
    }

    // Getters (no setters needed for API read-only)
    public int getEnrollmentId() { return enrollmentId; }
    public int getUserId() { return userId; }
    public int getCourseId() { return courseId; }
    public String getCourseName() { return courseName; }
    public String getStatus() { return status; }
}
