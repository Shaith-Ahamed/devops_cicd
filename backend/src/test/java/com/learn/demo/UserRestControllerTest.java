package com.learn.demo;

import com.learn.demo.user.User;
import com.learn.demo.user.UserRepository;
import com.learn.demo.user.UserRestController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserRestControllerTest {

    @Autowired
    private UserRestController userController;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void shouldReturn201WhenAddingValidUser() {


        User newUser = new User();
        newUser.setFirstName("John");
        newUser.setLastName("Doe");
        newUser.setEmail("john.doe@example.com");
        newUser.setPassword("password123");


        ResponseEntity<String> response = userController.addUser(newUser);


        assertEquals(201, response.getStatusCode().value());
        assertTrue(response.getBody().contains("John"));
        assertTrue(response.getBody().contains("Doe"));
        assertTrue(response.getBody().contains("added"));


        assertTrue(userRepository.existsByFirstNameAndLastName("John", "Doe"));
    }

    @Test
    public void shouldReturn400WhenFirstNameIsMissing() {

        User invalidUser = new User();
        invalidUser.setLastName("Doe");
        invalidUser.setEmail("test@example.com");
        invalidUser.setPassword("pass123");


        ResponseEntity<String> response = userController.addUser(invalidUser);


        assertEquals(400, response.getStatusCode().value());
        assertTrue(response.getBody().contains("First name is required"));
    }

    @Test
    public void shouldReturn400WhenPasswordIsNull() {

        User invalidUser = new User();
        invalidUser.setFirstName("Jane");
        invalidUser.setLastName("Smith");
        invalidUser.setEmail("jane@example.com");
        invalidUser.setPassword(null);


        ResponseEntity<String> response = userController.addUser(invalidUser);


        assertEquals(400, response.getStatusCode().value());
        assertTrue(response.getBody().contains("Password is required"));
    }
}