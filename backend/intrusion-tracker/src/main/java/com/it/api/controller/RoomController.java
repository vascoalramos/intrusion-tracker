package com.it.api.controller;

import com.it.api.exception.ResourceNotFoundException;
import com.it.api.model.Booking;
import com.it.api.model.Department;
import com.it.api.model.Room;
import com.it.api.model.User;
import com.it.api.repository.BookingRepository;
import com.it.api.repository.DepartmentRepository;
import com.it.api.repository.RoomRepository;
import com.it.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@RestController
public class RoomController {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private BookingRepository bookingRepository;


    @GetMapping("/rooms")
    public List<Room> getAllRooms(@RequestParam(required = false) Long id,
                                  @RequestParam(required = false) String start,
                                  @RequestParam(required = false) String end) throws ResourceNotFoundException {
        if (id == null && start == null && end == null) {
            return roomRepository.findAll();
        } else if (id != null && start != null && end != null) {
            Timestamp userStart = Timestamp.valueOf(start);
            Timestamp userEnd = Timestamp.valueOf(end);

            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found for this id : " + id));

            int userAccessLevel = user.getPerson().getAccessLevel();
            List<Room> list1 = roomRepository.findByAccessLevelLessThanEqual(userAccessLevel);
            Iterator<Room> i = list1.iterator();

            while (i.hasNext()) {
                Room r = i.next();
                List<Booking> list2 = bookingRepository.findByRoomRoomNumberAndStartTimeLessThanAndEndTimeGreaterThan(r.getRoomNumber(), userStart, userEnd);
                List<Booking> list3 = bookingRepository.findByRoomRoomNumberAndStartTimeGreaterThanAndEndTimeLessThan(r.getRoomNumber(), userStart, userEnd);
                List<Booking> list4 = bookingRepository.findByRoomRoomNumberAndStartTimeBetween(r.getRoomNumber(), userStart, userEnd);
                List<Booking> list5 = bookingRepository.findByRoomRoomNumberAndEndTimeBetween(r.getRoomNumber(), userStart, userEnd);

                if (list2.size() != 0 || list3.size() != 0 || list4.size() != 0 || list5.size() != 0) {
                    i.remove();
                }
            }

            if (list1.size() == 0) {
                throw new ResourceNotFoundException("No room available for this start time: " + start + " and this end time: " + end);
            }
            return list1;
        } else {
            throw new ResourceNotFoundException("Bad parameters usage.");
        }
    }

    @GetMapping("/rooms-in-department/{id}")
    public List<Room> getRoomsInDept(@PathVariable(value = "id") long id)
            throws ResourceNotFoundException {
        departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id : " + id));

        return roomRepository.findAllByDept_Id(id);
    }

    @GetMapping("/rooms/{room_number}")
    public ResponseEntity<Room> getRoomByRoomNumber(@PathVariable(value = "room_number") long room_number)
            throws ResourceNotFoundException {
        Room room = roomRepository.findById(room_number)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found for this room number: " + room_number));
        return ResponseEntity.ok().body(room);
    }

    @PostMapping("/rooms")
    public Room createRoom(@Valid @RequestBody Room room) throws ResourceNotFoundException {
        Department deptUser = room.getDept();

        Department dept = departmentRepository.findById(deptUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id : " + deptUser.getId()));

        return roomRepository.save(room);
    }

    @PutMapping("/rooms/{room_number}")
    public ResponseEntity<Room> updateRoom(@PathVariable(value = "room_number") long room_number,
                                           @Valid @RequestBody Room roomDetails) throws ResourceNotFoundException {
        Room room = roomRepository.findById(room_number)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found for this room number: " + room_number));

        if (roomDetails.getHeight() != 0L) {
            room.setHeight(roomDetails.getHeight());
        }
        if (roomDetails.getWidth() != 0L) {
            room.setWidth(roomDetails.getWidth());
        }
        if (roomDetails.getMaxOccupation() != 0L) {
            room.setMaxOccupation(roomDetails.getMaxOccupation());
        }
        if (roomDetails.getFloor() != 0L) {
            room.setFloor(roomDetails.getFloor());
        }
        if (roomDetails.getDept() != null) {
            departmentRepository.findById(roomDetails.getDept().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id : " + roomDetails.getDept().getId()));
            room.setDept(roomDetails.getDept());
        }
        if (roomDetails.getAccessLevel() != 0L) {
            room.setAccessLevel(roomDetails.getAccessLevel());
        }

        Room updatedRoom = roomRepository.save(room);
        return ResponseEntity.ok(updatedRoom);
    }

    @DeleteMapping("/rooms/{room_number}")
    public Map<String, Boolean> deleteRoom(@PathVariable(value = "room_number") long room_number)
            throws ResourceNotFoundException {
        Room room = roomRepository.findById(room_number)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found for this room number: " + room_number));

        roomRepository.delete(room);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}