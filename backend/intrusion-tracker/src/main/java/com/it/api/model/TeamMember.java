package com.it.api.model;

import lombok.Data;

/**
 * Created by Vasco Ramos on 04/12/19
 */
@Data
public class TeamMember {
    private long teamId;
    private long personId;

    public TeamMember(long teamId, long personId) {
        this.teamId = teamId;
        this.personId = personId;
    }

}