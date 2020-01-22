package com.it.api.model;

import lombok.Data;

/**
 * Created by Vasco Ramos on 04/12/19
 */
@Data
public class DepartmentMember {
    private long deptId;
    private long personId;

    public DepartmentMember(long deptId, long personId) {
        this.deptId = deptId;
        this.personId = personId;
    }

}