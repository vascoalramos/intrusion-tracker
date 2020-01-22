package com.it.api.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class ErrorDetails extends Exception {

    private static final long serialVersionUID = 1L;

    public ErrorDetails(String message) {
        super(message);
    }
}