package com.it.api.controller;

import com.it.api.model.User;
import com.it.api.repository.PersonRepository;
import com.it.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;
import java.util.Calendar;

/**
 * Created by Vasco Ramos on 26/11/19
 */
@RestController
public class AccessController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PersonRepository personRepository;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestHeader("Authorization") String auth) {
        String base64Credentials = auth.substring("Basic".length()).trim();
        String email = new String(Base64.getDecoder().decode(base64Credentials)).split(":", 2)[0];
        User user = userRepository.findByPerson_Email(email);
        user.setLastLogin(new java.sql.Timestamp(Calendar.getInstance().getTime().getTime()));
        userRepository.save(user);
        return ResponseEntity.ok().body(user);
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().body("Logout Successful!");
    }
}
