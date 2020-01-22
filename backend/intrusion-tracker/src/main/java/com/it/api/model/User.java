package com.it.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Set;

@Entity
@Data
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "passwd")
    @ToString.Exclude
    private String passwd;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "role", nullable = false) // Administrator, Security Enforcer, Team Manager
    private String role;

    @Column(name = "last_login")
    private Timestamp lastLogin;

    @Column(name = "date_joined", nullable = false)
    @CreationTimestamp
    private Timestamp dateJoined;

    @Column(name = "is_active", nullable = false)
    private int isActive = 1; // default value to 1 ("active")

    @OneToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Booking> bookings;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<ExpoToken> tokens;

    public User() {
    }

    public User(long id, String passwd, String phoneNumber, String role, Timestamp lastLogin, Person person) {
        this.id = id;
        this.passwd = passwd;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.lastLogin = lastLogin;
        this.person = person;
    }
}