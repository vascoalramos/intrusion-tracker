package com.it.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.util.Set;

@Entity
@Data
@Table(name = "Room")
public class Room {
    @Id
    @Column(name = "room_number", nullable = false)
    private long roomNumber;

    @Column(name = "height", nullable = false)
    private float height;

    @Column(name = "width", nullable = false)
    private float width;

    @Column(name = "max_occupation", nullable = false)
    private int maxOccupation;

    @Column(name = "floor", nullable = false)
    private int floor;

    @Column(name = "access_level", nullable = false)
    private int accessLevel;

    @ManyToOne
    @JoinColumn(name = "dept_id", nullable = false)
    private Department dept;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Booking> bookings;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private Set<AccessLog> accesses;


    public Room() {
    }

    public Room(long roomNumber, float height, float width, int maxOccupation, int floor, Department dept, int accessLevel) {
        this.roomNumber = roomNumber;
        this.height = height;
        this.width = width;
        this.maxOccupation = maxOccupation;
        this.floor = floor;
        this.dept = dept;
        this.accessLevel = accessLevel;
    }

}