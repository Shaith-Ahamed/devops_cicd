package com.learn.demo.enrollment;

import org.antlr.v4.runtime.misc.NotNull;


public class EnrollmentRequest {

    @NotNull private int user_Id;
    @NotNull private int course_Id;



    public int getUserId() {
        return user_Id;
    }
    public void setUserId(int user_Id) { this.user_Id = user_Id; }
    public int getCourseId() { return course_Id; }
    public void setCourseId(int course_Id) { this.course_Id = course_Id; }

}
