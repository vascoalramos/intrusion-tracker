package com.it.api.controller;

import com.it.api.exception.ResourceNotFoundException;
import com.it.api.model.Department;
import com.it.api.model.DepartmentMember;
import com.it.api.model.Person;
import com.it.api.repository.DepartmentRepository;
import com.it.api.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class DepartmentController {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping("/departments")
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @GetMapping("/departments/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable(value = "id") Long id)
            throws ResourceNotFoundException {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id : " + id));
        return ResponseEntity.ok().body(dept);
    }

    @PostMapping("/add-to-department")
    public ResponseEntity<?> addPersonToDepartment(@Valid @RequestBody DepartmentMember deptMember) throws ResourceNotFoundException {
        Person person = personRepository.findById(deptMember.getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Person not found!"));
        Department dept = departmentRepository.findById(deptMember.getDeptId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found!"));

        person.setDept(dept);
        personRepository.save(person);
        return ResponseEntity.ok().body("Person added successfully to department!");
    }

    @PostMapping("/departments")
    public Department createDepartment(@Valid @RequestBody Department dept) {
        return departmentRepository.save(dept);
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable(value = "id") Long id,
                                                       @Valid @RequestBody Department departmentDetails) throws ResourceNotFoundException {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id : " + id));

        department.setDepartmentName(departmentDetails.getDepartmentName());
        Department updatedDepartment = departmentRepository.save(department);
        return ResponseEntity.ok(updatedDepartment);
    }

    @DeleteMapping("/departments/{id}")
    public Map<String, Boolean> deleteDepartment(@PathVariable(value = "id") Long id)
            throws ResourceNotFoundException {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found for this id : " + id));

        departmentRepository.delete(department);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}