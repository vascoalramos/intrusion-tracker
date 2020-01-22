package com.it.api.repository;

import com.it.api.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByAccessLevelLessThanEqual(int accessLevel);

    List<Room> findAllByDept_Id(long id);

}