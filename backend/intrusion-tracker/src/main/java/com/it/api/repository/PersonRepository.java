package com.it.api.repository;

import com.it.api.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    List<Person> findAllBySuspectLevelGreaterThanOrderBySuspectLevelDesc(int level);

    List<Person> findAllByDept_Id(long id);

    List<Person> findAllByTeam_Id(long id);

    List<Person> findAllByTeam_IdIsNullOrTeam_IdNot(long id);

}