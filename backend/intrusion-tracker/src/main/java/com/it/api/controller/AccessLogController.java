package com.it.api.controller;

import com.it.api.exception.ResourceNotFoundException;
import com.it.api.model.*;
import com.it.api.repository.*;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.net.MalformedURLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;


/**
 * Created by Vasco Ramos on 05/12/19
 */

@RestController
public class AccessLogController {
    private final OkHttpClient httpClient = new OkHttpClient();
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private AccessLogRepository accessLogRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ExpoTokenRepository expoTokenRepository;
    private SendGrid sg = new SendGrid("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");

    public AccessLogController() throws MalformedURLException {
    }

    @GetMapping("/logs/{compId}")
    public List<AccessLog> getAllAccessLogs(@PathVariable(value = "compId") Long compId,

                                            @RequestParam(required = false) Long personId,
                                            @RequestParam(required = false) Long roomNumber,
                                            @RequestParam(required = false) Long deptId)
            throws ResourceNotFoundException {
        //Pageable pageable = PageRequest.of(page, nrows);
        Company c = companyRepository.findById(compId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for this id: " + compId));
        if (personId == null && roomNumber == null && deptId == null) {
            return accessLogRepository.findAllByPerson_Company(c);

        } else if (personId != null && roomNumber != null && deptId != null) {
            Person p = personRepository.findById(personId)
                    .orElseThrow(() -> new ResourceNotFoundException("Person not found for this id: " + personId));
            Room r = roomRepository.findById(roomNumber)
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found for this id: " + roomNumber));
            Department d = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id: " + deptId));
            return accessLogRepository.findAllByPersonAndRoomAndRoom_Dept(p, r, d);

        } else if (personId != null && roomNumber == null && deptId == null) {
            Person p = personRepository.findById(personId)
                    .orElseThrow(() -> new ResourceNotFoundException("Person not found for this id: " + personId));
            return accessLogRepository.findAllByPerson(p);

        } else if (roomNumber != null && personId == null && deptId == null) {
            Room r = roomRepository.findById(roomNumber)
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found for this id: " + roomNumber));
            return accessLogRepository.findAllByRoom(r);

        } else if (deptId != null && personId == null && roomNumber == null) {
            Department d = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id: " + deptId));
            return accessLogRepository.findAllByRoom_Dept(d);

        } else if (personId != null && roomNumber != null) {
            Person p = personRepository.findById(personId)
                    .orElseThrow(() -> new ResourceNotFoundException("Person not found for this id: " + personId));
            Room r = roomRepository.findById(roomNumber)
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found for this id: " + roomNumber));
            return accessLogRepository.findAllByPersonAndRoom(p, r);

        } else if (personId != null) {
            Person p = personRepository.findById(personId)
                    .orElseThrow(() -> new ResourceNotFoundException("Person not found for this id: " + personId));
            Department d = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id: " + deptId));
            return accessLogRepository.findAllByPersonAndRoom_Dept(p, d);

        } else {
            Room r = roomRepository.findById(roomNumber)
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found for this id: " + roomNumber));
            Department d = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id: " + deptId));
            return accessLogRepository.findAllByRoomAndRoom_Dept(r, d);
        }
    }

    @GetMapping("/logs-histogram/{compId}")
    public HistogramModel getAllAccessLogs(@PathVariable(value = "compId") Long compId
    )
            throws ResourceNotFoundException {
        Company c = companyRepository.findById(compId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for this id: " + compId));

        int total = accessLogRepository.findAllByPerson_Company(c).size();
        int total_good = accessLogRepository.findAllBySecurityFlag("good").size();
        int total_bad = accessLogRepository.findAllBySecurityFlag("bad").size();
        int total_entries = accessLogRepository.findAllByAccessType("ENTRY").size();
        int total_exits = accessLogRepository.findAllByAccessType("EXIT").size();

        HistogramAccesses first = new HistogramAccesses(total, total_good, total_bad, total_entries, total_exits);

        Date currentDate = new Date(System.currentTimeMillis() - 3600 * 1000);
        Date currentDateNow = new Date(System.currentTimeMillis());

        Timestamp begin = new Timestamp(currentDate.getTime());
        Timestamp end = new Timestamp(currentDateNow.getTime());


        total = accessLogRepository.findAllByPerson_CompanyAndTimestampGreaterThanAndTimestampLessThan(c, begin, end).size();
        total_good = accessLogRepository.findAllBySecurityFlagAndTimestampGreaterThanAndTimestampLessThan("good", begin, end).size();
        total_bad = accessLogRepository.findAllBySecurityFlagAndTimestampGreaterThanAndTimestampLessThan("bad", begin, end).size();
        total_entries = accessLogRepository.findAllByAccessTypeAndTimestampGreaterThanAndTimestampLessThan("ENTRY", begin, end).size();
        total_exits = accessLogRepository.findAllByAccessTypeAndTimestampGreaterThanAndTimestampLessThan("EXIT", begin, end).size();

        HistogramAccesses second = new HistogramAccesses(total, total_good, total_bad, total_entries, total_exits);


        begin = Timestamp.valueOf(LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT));
        end = Timestamp.valueOf(LocalDateTime.of(LocalDate.now(), LocalTime.MAX));

        total = accessLogRepository.findAllByPerson_CompanyAndTimestampGreaterThanAndTimestampLessThan(c, begin, end).size();
        total_good = accessLogRepository.findAllBySecurityFlagAndTimestampGreaterThanAndTimestampLessThan("good", begin, end).size();
        total_bad = accessLogRepository.findAllBySecurityFlagAndTimestampGreaterThanAndTimestampLessThan("bad", begin, end).size();
        total_entries = accessLogRepository.findAllByAccessTypeAndTimestampGreaterThanAndTimestampLessThan("ENTRY", begin, end).size();
        total_exits = accessLogRepository.findAllByAccessTypeAndTimestampGreaterThanAndTimestampLessThan("EXIT", begin, end).size();

        HistogramAccesses third = new HistogramAccesses(total, total_good, total_bad, total_entries, total_exits);

        HistogramModel final_data = new HistogramModel(first, second, third);

        return final_data;
    }

    @PostMapping("/logs")
    public ResponseEntity<?> registerAccessLogs(@Valid @org.springframework.web.bind.annotation.RequestBody List<AccessLog> accessLogs) {
        AtomicBoolean retVal = new AtomicBoolean(true);
        accessLogs.forEach(accessLog -> {
            long personId = accessLog.getPerson().getId();
            long roomNumber = accessLog.getRoom().getRoomNumber();
            Person person = null;
            Room room = null;
            try {
                person = personRepository.findById(personId)
                        .orElseThrow(() -> new ResourceNotFoundException("Person not found for this id: " + personId));
            } catch (ResourceNotFoundException e) {
                retVal.set(false);
            }
            try {
                room = roomRepository.findById(roomNumber)
                        .orElseThrow(() -> new ResourceNotFoundException("Room not found for this number: " + roomNumber));
            } catch (ResourceNotFoundException e) {
                retVal.set(false);
            }
            if (retVal.get()) {
                if (person.getAccessLevel() < room.getAccessLevel()) {
                    person.setSuspectLevel(person.getSuspectLevel() + 1);
                    accessLog.setSecurityFlag("bad");
                    if (person.getSuspectLevel() > 3) {
                        Person finalPerson = person;
                        userRepository.findAll().forEach((user) -> {
                            if (user.getRole().equals("admin") || user.getRole().equals("security_enforcer")) {
                                sendPushNotification(finalPerson.getEmail(), personId, roomNumber, accessLog.getTimestamp(), user);
                                sendEmail(finalPerson.getEmail(), personId, roomNumber, accessLog.getTimestamp(), user);
                            }
                        });
                    }
                }
                personRepository.save(person);
                accessLogRepository.save(accessLog);
            }
        });
        return (retVal.get()) ? ResponseEntity.ok().body("Access Logs registered with success") : ResponseEntity.badRequest().body("Error!");
    }

    private void sendEmail(String email, long id, long roomNumber, Timestamp tsp, User user) {
        Email from = new Email("alerts@intrusion-tracker.com");
        String subject = "Suspect Access Report [Intrusion Tracker]";
        StringBuilder sb = new StringBuilder("The person with id: ").append(id);
        sb.append(" and username: ").append(email);
        sb.append(" has tried a possibly suspicious access at the room: ").append(roomNumber);
        sb.append(" at ").append(tsp.toString());
        Content content = new Content("text/plain", sb.toString());
        Email to = new Email(user.getPerson().getEmail());
        Mail mail = new Mail(from, subject, to, content);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    private void sendPushNotification(String email, long id, long roomNumber, Timestamp tsp, Object user) {
        List<ExpoToken> tokens = expoTokenRepository.findAllByUser((User) user);

        tokens.forEach((token) -> {
            try {
                sendPost(token.getToken(), email, id, roomNumber, tsp);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });
    }

    private void sendPost(String token, String email, long id, long roomNumber, Timestamp tsp) throws Exception {

        StringBuilder sb = new StringBuilder("The person with id: ").append(id);
        sb.append(" and username: ").append(email);
        sb.append(" has tried a possibly suspicious access at the room: ").append(roomNumber);
        sb.append(" at ").append(tsp.toString());
        // form parameters
        RequestBody formBody = new FormBody.Builder()
                .add("to", token)
                .add("title", "Suspect Access Report")
                .add("body", sb.toString())
                .build();

        okhttp3.Request request = new okhttp3.Request.Builder()
                .url("https://exp.host/--/api/v2/push/send")
                .addHeader("accept", "application/json")
                .addHeader("accept-encoding", "gzip, deflate")
                .addHeader("content-type", "application/json")
                .addHeader("host", "exp.host")
                .post(formBody)
                .build();

        try (okhttp3.Response response = httpClient.newCall(request).execute()) {

            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
        }

    }

}

