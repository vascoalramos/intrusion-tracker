package com.it.api.controller;

import com.it.api.exception.ResourceNotFoundException;
import com.it.api.model.ExpoToken;
import com.it.api.model.User;
import com.it.api.repository.ExpoTokenRepository;
import com.it.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
public class ExpoTokenController {
    @Autowired
    private ExpoTokenRepository expoTokenRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/expo_tokens")
    public List<ExpoToken> getAllExpoTokens() {
        return expoTokenRepository.findAll();
    }

    //Get all tokens associated to a user
    @GetMapping("/expo_tokens/{userId}")
    public List<ExpoToken> getTokenByUser(@PathVariable(value = "userId") long id)
            throws ResourceNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this id: " + id));
        return expoTokenRepository.findAllByUser(user);
    }

    @PostMapping("/expo_tokens")
    public ExpoToken createToken(@Valid @RequestBody ExpoToken expoToken) throws ResourceNotFoundException {
        User userUser = expoToken.getUser();
        User user = userRepository.findById(userUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this id : " + userUser.getId()));

        return expoTokenRepository.save(expoToken);
    }


    @DeleteMapping("/expo_tokens/{userId}")
    public Map<String, Boolean> deleteToken(@PathVariable(value = "userId") long id, @RequestBody String requestString)
            throws ResourceNotFoundException {
        requestString = requestString.replace("\"", "");
        requestString = requestString.replace("{", "").replace("}", "");
        String token = requestString.split(":")[1].replace(" ", "");

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this id: " + id));

        List<ExpoToken> expoTokens = expoTokenRepository.findByUserAndToken(user, token);

        expoTokens.forEach((tokenToDel) -> expoTokenRepository.delete(tokenToDel));

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}