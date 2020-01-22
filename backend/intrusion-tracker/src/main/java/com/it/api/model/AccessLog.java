package com.it.api.model;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 * Created by Vasco Ramos on 05/12/19
 */

@Entity
@Data
@Table(name = "access_log")
public class AccessLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "timestamp", nullable = false)
    private Timestamp timestamp;

    @Column(name = "access_type", nullable = false)
    private String accessType;

    @Column(name = "security_flag", nullable = false)
    private String securityFlag = "good";

    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person person;

    @ManyToOne
    @JoinColumn(name = "room_number")
    private Room room;
}
