package com.it.api.repository;

import com.it.api.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;


@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStartTimeLessThanAndEndTimeGreaterThan(Timestamp start, Timestamp end);

    List<Booking> findByStartTimeGreaterThanAndEndTimeLessThan(Timestamp start, Timestamp end);

    List<Booking> findByStartTimeBetween(Timestamp start, Timestamp end);

    List<Booking> findByEndTimeBetween(Timestamp start, Timestamp end);

    List<Booking> findByRoomRoomNumberAndStartTimeLessThanAndEndTimeGreaterThan(long roomNumber, Timestamp start, Timestamp end);

    List<Booking> findByRoomRoomNumberAndStartTimeGreaterThanAndEndTimeLessThan(long roomNumber, Timestamp start, Timestamp end);

    List<Booking> findByRoomRoomNumberAndStartTimeBetween(long roomNumber, Timestamp start, Timestamp end);

    List<Booking> findByRoomRoomNumberAndEndTimeBetween(long roomNumber, Timestamp start, Timestamp end);

}