package com.it.api.controller;

import com.it.api.exception.ErrorDetails;
import com.it.api.exception.ResourceNotFoundException;
import com.it.api.model.Company;
import com.it.api.model.Person;
import com.it.api.model.User;
import com.it.api.repository.CompanyRepository;
import com.it.api.repository.PersonRepository;
import com.it.api.repository.UserRepository;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private CompanyRepository companyRepository;


    @GetMapping("/users")
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable(value = "id") long id)
            throws ResourceNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this id: " + id));
        return ResponseEntity.ok().body(user);
    }

    @PostMapping("/registration")
    public User createUser(@Valid @RequestBody User user) throws ErrorDetails, ResourceNotFoundException {
        Person person = user.getPerson();
        person.setSuspectLevel(0);
        if (userRepository.findByPerson_Email(person.getEmail()) != null) {
            throw new ErrorDetails("There is already a user with that email");
        }

        Company company = companyRepository.findById(person.getCompany().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for this id: " + person.getCompany().getId()));

        personRepository.save(person);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String pwd = generatePassword(10);
        user.setPasswd(passwordEncoder.encode(pwd));
        try {
            sendEmail(person.getEmail(), pwd, user.getRole(), company.getName());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return userRepository.save(user);
    }


    @PostMapping("/internal_registration")
    public User internalCreateUser(@Valid @RequestBody User user) throws ErrorDetails, ResourceNotFoundException {
        Person person = user.getPerson();
        if (userRepository.findByPerson_Email(person.getEmail()) != null) {
            throw new ErrorDetails("There is already a user with that email");
        }

        Company company = companyRepository.findById(person.getCompany().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for this id: " + person.getCompany().getId()));

        personRepository.save(person);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPasswd(passwordEncoder.encode("pwd"));
        return userRepository.save(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable(value = "id") long id,
                                           @Valid @RequestBody User userDetails) throws ResourceNotFoundException {

        Person personDetails = userDetails.getPerson();

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this id: " + id));

        Person person = user.getPerson();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        if (personDetails.getEmail() != null) {
            person.setEmail(personDetails.getEmail());
        }
        if (personDetails.getFname() != null) {
            person.setFname(personDetails.getFname());
        }
        if (personDetails.getLname() != null) {
            person.setLname(personDetails.getLname());
        }
        if (personDetails.getDept() != null) {
            person.setDept(personDetails.getDept());
        }
        if (personDetails.getTeam() != null) {
            person.setTeam(personDetails.getTeam());
        }
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }
        if (userDetails.getPasswd() != null) {
            user.setPasswd(passwordEncoder.encode(userDetails.getPasswd()));
        }
        if (userDetails.getPhoneNumber() != null) {
            user.setPhoneNumber(userDetails.getPhoneNumber());
        }
        if (userDetails.getLastLogin() != null) {
            user.setLastLogin(userDetails.getLastLogin());
        }
        if (userDetails.getIsActive() != 0L) {
            user.setIsActive(userDetails.getIsActive());
        }

        user.setPerson(person);
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public Map<String, Boolean> deleteUser(@PathVariable(value = "id") long id)
            throws ResourceNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this id: " + id));

        Person person = user.getPerson();

        personRepository.deleteById(person.getId());
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    private String generatePassword(int length) {
        return RandomStringUtils.randomAlphanumeric(length);
    }

    private void sendEmail(String email, String password, String role, String companyName) throws IOException {
        Email from = new Email("registration@intrusion-tracker.com");
        String subject = "Welcome [Intrusion Tracker]";
        Email to = new Email(email);
        StringBuilder sb = new StringBuilder("Welcome!\n\nYou have been added as ").append(role);
        sb.append(" in the company workspace: ").append(companyName);
        sb.append("\n\nYour login credentials:");
        sb.append("\n    - Email: ").append(email);
        sb.append("\n    - Password: ").append(password);
        Content content = new Content("text/plain", sb.toString());
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid("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");
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println(response.getStatusCode());
            System.out.println(response.getBody());
            System.out.println(response.getHeaders());
        } catch (IOException ex) {
            throw ex;
        }
    }
}