package com.it.api.controller;

import com.it.api.exception.ResourceNotFoundException;
import com.it.api.model.Person;
import com.it.api.model.Team;
import com.it.api.model.TeamMember;
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
public class TeamController {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private TeamRepository teamRepository;

    @GetMapping("/teams")
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @GetMapping("/teams/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable(value = "id") Long id)
            throws ResourceNotFoundException {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found for this id : " + id));
        return ResponseEntity.ok().body(team);
    }

    @PostMapping("/add-to-team")
    public ResponseEntity<?> addPersonToTeam(@Valid @RequestBody TeamMember teamMember) throws ResourceNotFoundException {
        Person person = personRepository.findById(teamMember.getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Person not found!"));
        Team team = teamRepository.findById(teamMember.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found!"));

        person.setTeam(team);
        personRepository.save(person);
        return ResponseEntity.ok().body("Person added successfully to team!");
    }

    @DeleteMapping("/delete-from-team")
    public ResponseEntity<?> deletePersonFromTeam(@Valid @RequestBody TeamMember teamMember) throws ResourceNotFoundException {
        Person person = personRepository.findById(teamMember.getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Person not found!"));
        Team team = teamRepository.findById(teamMember.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found!"));

        person.setTeam(null);
        personRepository.save(person);
        return ResponseEntity.ok().body("Person deleted successfully from team!");
    }

    @PostMapping("/teams")
    public Team createTeam(@Valid @RequestBody Team team) {
        return teamRepository.save(team);
    }

    @PutMapping("/teams/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable(value = "id") Long id,
                                           @Valid @RequestBody Team teamDetails) throws ResourceNotFoundException {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found for this id : " + id));

        team.setTeamName(teamDetails.getTeamName());

        Team updatedTeam = teamRepository.save(team);
        return ResponseEntity.ok(updatedTeam);
    }

    @DeleteMapping("/teams/{id}")
    public Map<String, Boolean> deleteTeam(@PathVariable(value = "id") Long id)
            throws ResourceNotFoundException {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found for this id : " + id));

        teamRepository.delete(team);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}