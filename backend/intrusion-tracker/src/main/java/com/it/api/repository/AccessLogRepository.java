package com.it.api.repository;

import com.it.api.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import java.sql.Timestamp;



import java.util.List;

/**
 * Created by Vasco Ramos on 05/12/19
 */
@Repository
public interface
AccessLogRepository extends JpaRepository<AccessLog, Long> {

    Page<AccessLog> findAllByPerson_Company(Company c,Pageable pageable);

    List<AccessLog> findAllByPerson_Company(Company c);

    List<AccessLog> findAllByPerson_CompanyAndTimestampGreaterThanAndTimestampLessThan(Company c,Timestamp start, Timestamp end);

    Page<AccessLog> findAllByPerson(Person p,Pageable pageable);
    
    List<AccessLog> findAllByPerson(Person p);


    Page<AccessLog> findAllByRoom(Room r,Pageable pageable);

    List<AccessLog> findAllByRoom(Room r);

    Page<AccessLog> findAllByRoom_Dept(Department d,Pageable pageable);

    List<AccessLog> findAllByRoom_Dept(Department d);

    Page<AccessLog> findAllByPersonAndRoom(Person p, Room r,Pageable pageable);

    List<AccessLog> findAllByPersonAndRoom(Person p, Room r);

    Page<AccessLog> findAllByPersonAndRoom_Dept(Person p, Department d,Pageable pageable);

    List<AccessLog> findAllByPersonAndRoom_Dept(Person p, Department d);

    Page<AccessLog> findAllByRoomAndRoom_Dept(Room r, Department d,Pageable pageable);

    List<AccessLog> findAllByRoomAndRoom_Dept(Room r, Department d);

    Page<AccessLog> findAllByPersonAndRoomAndRoom_Dept(Person p, Room r, Department d,Pageable pageable);

    List<AccessLog> findAllByPersonAndRoomAndRoom_Dept(Person p, Room r, Department d);

    Page<AccessLog> findAllBySecurityFlag(String s,Pageable pageable);

    List<AccessLog> findAllBySecurityFlag(String s);

    List<AccessLog> findAllBySecurityFlagAndTimestampGreaterThanAndTimestampLessThan(String s,Timestamp start, Timestamp end);

    List<AccessLog> findAllByAccessType(String s);

    List<AccessLog> findAllByAccessTypeAndTimestampGreaterThanAndTimestampLessThan(String s,Timestamp start, Timestamp end);

}
