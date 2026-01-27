Feature: Course Enrollment
  As a user
  I want to enroll in courses
  So that I can participate in them

  Scenario: Successful course enrollment
    Given the user is logged in
    When the user enrolls in course with id "101"
    Then the enrollment should be successful

  Scenario: Enrollment in a non-existing course
    Given the user is logged in
    When the user enrolls in course with id "9999"
    Then the enrollment should fail
