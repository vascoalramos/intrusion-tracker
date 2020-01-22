package com.it.api.model;

import lombok.Data;

/**
 * Created by Vasco Ramos on 04/12/19
 */
@Data
public class AppInfo {
    private long nDepartments;
    private long nTeams;
    private long nRooms;
    private long nPersons;
    private long nSuspectEmployees;
    private long nBadAccess;




    public AppInfo(){

    }

    public AppInfo(long nDepartments, long nTeams,long nRooms, long nPersons,long nSuspectEmployees,long nBadAccess) {
        this.nDepartments = nDepartments;
        this.nTeams = nTeams;
        this.nRooms = nRooms;
        this.nPersons = nPersons;
        this.nSuspectEmployees = nSuspectEmployees;
        this.nBadAccess=nBadAccess;

    }

}