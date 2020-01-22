package com.it.api.model;

import lombok.Data;

/**
 * Created by Vasco Ramos on 04/12/19
 */
@Data
public class HistogramAccesses {
    private long total;
    private long good;
    private long bad;
    private long entries;
    private long exits;


    public HistogramAccesses(long total, long good,long bad,long entries, long exits) {
        this.total = total;
        this.good = good;
        this.bad = bad;
        this.entries = entries;
        this.exits = exits;
    }

}