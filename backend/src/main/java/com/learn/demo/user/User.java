package com.learn.demo.user;


import com.learn.demo.enrollment.Enrollment;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity

@Table(schema="users")
public class User {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @Column(name = "user_id")
    private int userId;




    private String firstName;


    private String lastName;
    private String email;
    private  String password;

    public User(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }



    @ManyToMany
    @JoinTable(
            name = "user_enrollments",
            joinColumns = @JoinColumn(name ="user_id"),
            inverseJoinColumns = @JoinColumn(name = "enrollment_id")
    )
    private List<Enrollment>enrollments=new ArrayList<>();


    public User() {
    }


    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Enrollment> getEnrollments() {
        return enrollments;
    }

    public void setEnrollments(List<Enrollment> enrollments) {
        this.enrollments = enrollments;
    }
}
