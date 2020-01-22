package com.it.api.controller;

import com.it.api.exception.ResourceNotFoundException;
import com.it.api.model.Department;
import com.it.api.model.Room;
import com.it.api.model.Person;
import com.it.api.model.Team;
import com.it.api.model.AppInfo;
import com.it.api.model.AccessLog;

import com.it.api.repository.DepartmentRepository;
import com.it.api.repository.RoomRepository;
import com.it.api.repository.PersonRepository;
import com.it.api.repository.TeamRepository;
import com.it.api.repository.AccessLogRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
public class AppInfoController {
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private AccessLogRepository accessLogRepository;


    @GetMapping("/app_info")
    public ResponseEntity<AppInfo> getAllAppInfo() {
        long nDept=departmentRepository.findAll().size();
        long nTeams=teamRepository.findAll().size();
        long nRooms=roomRepository.findAll().size();
        long nSuspectEmployees=personRepository.findAllBySuspectLevelGreaterThanOrderBySuspectLevelDesc(3).size();
        long nPersons=personRepository.findAll().size();
        long badAccess=accessLogRepository.findAllBySecurityFlag("bad").size();
        AppInfo appInfo=new AppInfo();
        appInfo.setNDepartments(nDept);
        appInfo.setNRooms(nRooms);
        appInfo.setNTeams(nTeams);
        appInfo.setNSuspectEmployees(nSuspectEmployees);
        appInfo.setNPersons(nPersons);
        appInfo.setNBadAccess(badAccess);

        return ResponseEntity.ok().body(appInfo);

    }

    
}