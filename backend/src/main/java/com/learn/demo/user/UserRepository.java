package com.learn.demo.user;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository  extends JpaRepository<User, Integer> {
    boolean existsByFirstNameAndLastName(String firstName, String lastName);


}
