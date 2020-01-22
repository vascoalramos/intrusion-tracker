package com.it.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.util.Set;


@Entity
@Data
@Table(name = "Team")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "team_name", nullable = false)
    private String teamName;

    @OneToMany(mappedBy = "team", cascade = CascadeType.PERSIST)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Person> persons;


    public Team() {
    }

    public Team(long id, String teamName) {
        this.id = id;
        this.teamName = teamName;
    }

    @PreRemove
    private void preRemove() {
        persons.forEach(child -> child.setTeam(null));
    }

}