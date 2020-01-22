package com.it.api.controller;

import com.it.api.exception.ResourceNotFoundException;
import com.it.api.model.*;
import com.it.api.repository.CompanyRepository;
import com.it.api.repository.DepartmentRepository;
import com.it.api.repository.PersonRepository;
import com.it.api.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class PersonController {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping("/persons")
    public List<Person> getAllPerson() {
        return personRepository.findAll();
    }

    @GetMapping("/persons/{id}")
    public ResponseEntity<Person> getPersonById(@PathVariable(value = "id") long id)
            throws ResourceNotFoundException {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found for this id: " + id));
        return ResponseEntity.ok().body(person);
    }

    @GetMapping("/suspicious-persons")
    public List<Person> getSuspiciousPersons() {
        return personRepository.findAllBySuspectLevelGreaterThanOrderBySuspectLevelDesc(3);
    }

    @GetMapping("/persons-in-team/{id}")
    public ResponseEntity<?> getPersonsInTeam(@PathVariable(value = "id") Long id)
            throws ResourceNotFoundException {
        teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found for this id : " + id));

        List<Person> personsInTeam = personRepository.findAllByTeam_Id(id);

        return ResponseEntity.ok().body(personsInTeam);
    }

    @GetMapping("/persons-in-department/{id}")
    public ResponseEntity<?> getPersonsInDepartment(@PathVariable(value = "id") Long id)
            throws ResourceNotFoundException {
        departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id : " + id));

        List<Person> personsInTeam = personRepository.findAllByDept_Id(id);

        return ResponseEntity.ok().body(personsInTeam);
    }

    @GetMapping("/persons-not-in-team/{id}")
    public ResponseEntity<?> getPersonsNotInTeam(@PathVariable(value = "id") Long id)
            throws ResourceNotFoundException {
        teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found for this id : " + id));

        List<Person> personsNotInTeam = personRepository.findAllByTeam_IdIsNullOrTeam_IdNot(id);

        return ResponseEntity.ok().body(personsNotInTeam);
    }

    @PostMapping("/persons")
    public Person createPerson(@Valid @RequestBody Person person) throws ResourceNotFoundException {
        Company compUser = person.getCompany();

        Company comp = companyRepository.findById(compUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for this id : " + compUser.getId()));

        return personRepository.save(person);
    }

    @PostMapping("/person-access-level")
    public ResponseEntity<?> addPersonToTeam(@Valid @RequestBody AccessLevel accessLevel) throws ResourceNotFoundException {
        Person person = personRepository.findById(accessLevel.getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Person not found!"));


        person.setAccessLevel(accessLevel.getAccessLevel());
        personRepository.save(person);
        return ResponseEntity.ok().body("Changed persson access Level successfully!");
    }

    @PutMapping("/persons/{id}")
    public ResponseEntity<Person> updatePerson(@PathVariable(value = "id") long id,
                                               @Valid @RequestBody Person personDetails) throws ResourceNotFoundException {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found for this id: " + id));

        if (personDetails.getEmail() != null) {
            person.setEmail(personDetails.getEmail());
        }
        if (personDetails.getFname() != null) {
            person.setFname(personDetails.getFname());
        }
        if (personDetails.getLname() != null) {
            person.setLname(personDetails.getLname());
        }
        if (personDetails.getAccessLevel() != 0L) {
            person.setAccessLevel(personDetails.getAccessLevel());
        }
        if (personDetails.getDept() != null) {
            Department dept = departmentRepository.findById(personDetails.getDept().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id : " + personDetails.getDept().getId()));
            person.setDept(dept);
        }
        if (personDetails.getTeam() != null) {
            Team team = teamRepository.findById(personDetails.getTeam().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found for this id : " + personDetails.getTeam().getId()));
            person.setTeam(team);
        }
        if (personDetails.getCompany() != null) {
            Company comp = companyRepository.findById(personDetails.getCompany().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company not found for this id : " + personDetails.getCompany().getId()));
            person.setCompany(comp);
        }

        Person updatedPerson = personRepository.save(person);
        return ResponseEntity.ok(updatedPerson);
    }

    @DeleteMapping("/persons/{id}")
    public Map<String, Boolean> deletePerson(@PathVariable(value = "id") long id)
            throws ResourceNotFoundException {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found for this id: " + id));

        personRepository.delete(person);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}