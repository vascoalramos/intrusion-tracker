package com.it.api.model;

import lombok.Data;

/**
 * Created by João Vasconcelos on 07/12/19
 */
@Data
public class AccessLevel {
    private long personId;
    private int accessLevel;

    public AccessLevel(long personId, int accessLevel) {
        this.personId = personId;
        this.accessLevel = accessLevel;
    }

}