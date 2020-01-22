package com.it.api.controller;

import com.it.api.exception.ResourceNotFoundException;
import com.it.api.model.Booking;
import com.it.api.model.Room;
import com.it.api.model.User;
import com.it.api.repository.BookingRepository;
import com.it.api.repository.RoomRepository;
import com.it.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
public class BookingController {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoomRepository roomRepository;


    @GetMapping("/bookings")
    public List<Booking> getAllBooking() {
        return bookingRepository.findAll();
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable(value = "id") long id)
            throws ResourceNotFoundException {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found for this id: " + id));
        return ResponseEntity.ok().body(booking);
    }

    @PostMapping("/bookings")
    public Booking createBooking(@Valid @RequestBody Booking booking) throws ResourceNotFoundException {
        User userUser = booking.getUser();
        User user = userRepository.findById(userUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this id : " + userUser.getId()));

        Room roomUser = booking.getRoom();
        Room room = roomRepository.findById(roomUser.getRoomNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found for this room number : " + roomUser.getRoomNumber()));

        Timestamp start = booking.getStartTime();
        Timestamp end = booking.getEndTime();

        int userAccessLevel = user.getPerson().getAccessLevel();
        int roomAccessLevel = room.getAccessLevel();
        List<Booking> list1 = bookingRepository.findByStartTimeLessThanAndEndTimeGreaterThan(start, end);
        List<Booking> list2 = bookingRepository.findByStartTimeGreaterThanAndEndTimeLessThan(start, end);
        List<Booking> list3 = bookingRepository.findByStartTimeBetween(start, end);
        List<Booking> list4 = bookingRepository.findByEndTimeBetween(start, end);
        int size1 = list1.size();
        int size2 = list2.size();
        int size3 = list3.size();
        int size4 = list4.size();

        //Check if it doesn't overlap existing bookings
        if (size1 != 0 || size2 != 0 || size3 != 0 || size4 != 0) {
            throw new ResourceNotFoundException("Booking not possible for these start and end time.");
        }
        //Check if user access level is good enough for this room
        if (roomAccessLevel > userAccessLevel) {
            throw new ResourceNotFoundException("User access level not enough for this room.");
        }

        return bookingRepository.save(booking);
    }

    @PutMapping("/bookings/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable(value = "id") long id,
                                                 @Valid @RequestBody Booking bookingDetails) throws ResourceNotFoundException {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found for this id: " + id));

        if (bookingDetails.getStartTime() != null) {
            booking.setStartTime(bookingDetails.getStartTime());
        }
        if (bookingDetails.getEndTime() != null) {
            booking.setEndTime(bookingDetails.getEndTime());
        }

        Booking updatedBooking = bookingRepository.save(booking);
        return ResponseEntity.ok(updatedBooking);
    }


    @DeleteMapping("/bookings/{id}")
    public Map<String, Boolean> deleteBooking(@PathVariable(value = "id") long id)
            throws ResourceNotFoundException {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found for this id: " + id));

        bookingRepository.delete(booking);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}