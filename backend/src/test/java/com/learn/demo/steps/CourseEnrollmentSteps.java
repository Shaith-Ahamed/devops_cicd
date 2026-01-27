package com.learn.demo.steps;

import io.cucumber.java.en.*;
import static org.junit.jupiter.api.Assertions.*;

public class CourseEnrollmentSteps {

    private boolean loggedIn;
    private String response;

    @Given("the user is logged in")
    public void the_user_is_logged_in() {
        loggedIn = true; // simulate user login
    }

    @When("the user enrolls in course with id {string}")
    public void the_user_enrolls_in_course_with_id(String courseId) {
        if (!loggedIn) {
            response = "User not logged in";
        } else if (courseId.equals("101")) {
            response = "Enrollment successful";
        } else {
            response = "Course not found";
        }
    }

    @Then("the enrollment should be successful")
    public void the_enrollment_should_be_successful() {
        assertEquals("Enrollment successful", response);
    }

    @Then("the enrollment should fail")
    public void the_enrollment_should_fail() {
        assertNotEquals("Enrollment successful", response);
    }
}
