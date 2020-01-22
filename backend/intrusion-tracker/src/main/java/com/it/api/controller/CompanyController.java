package com.it.api.controller;

import com.it.api.exception.ResourceNotFoundException;
import com.it.api.model.Company;
import com.it.api.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class CompanyController {
    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping("/companies")
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable(value = "id") Long id)
            throws ResourceNotFoundException {
        Company comp = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for this id : " + id));
        return ResponseEntity.ok().body(comp);
    }

    @PostMapping("/companies-reg")
    public Company createCompany(@Valid @RequestBody Company comp) {
        return companyRepository.save(comp);
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable(value = "id") Long id,
                                                 @Valid @RequestBody Company companyDetails) throws ResourceNotFoundException {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for this id : " + id));

        if (companyDetails.getName() != null) {
            company.setName(companyDetails.getName());
        }
        if (companyDetails.getAddress() != null) {
            company.setAddress(companyDetails.getAddress());
        }
        if (companyDetails.getEmail() != null) {
            company.setEmail(companyDetails.getEmail());
        }
        if (companyDetails.getPhoneNumber() != null) {
            company.setPhoneNumber(companyDetails.getPhoneNumber());
        }

        Company updatedCompany = companyRepository.save(company);
        return ResponseEntity.ok(updatedCompany);
    }

    @DeleteMapping("/companies/{id}")
    public Map<String, Boolean> deleteCompany(@PathVariable(value = "id") Long id)
            throws ResourceNotFoundException {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for this id : " + id));

        companyRepository.delete(company);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}