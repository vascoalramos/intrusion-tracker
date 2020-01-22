package com.it.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.Set;

@Entity
@Data
@Table(name = "Person")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "fname")
    private String fname;

    @Column(name = "lname")
    private String lname;

    @Column(name = "access_level", nullable = false)
    private int accessLevel;

    @Column(name = "suspect_level", nullable = false)
    private int suspectLevel;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department dept;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @OneToOne(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private User user;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private Set<AccessLog> accesses;

    public Person() {
    }

    public Person(long id, String email, String fname, String lname, int accessLevel,
                  Department dept, Team team, Company company) {
        this.id = id;
        this.email = email;
        this.fname = fname;
        this.lname = lname;
        this.accessLevel = accessLevel;
        this.dept = dept;
        this.team = team;
        this.company = company;
        this.suspectLevel = 0;
    }
}