package com.it.api.model;

import lombok.Data;
import com.it.api.model.HistogramAccesses;


/**
 * Created by Vasco Ramos on 04/12/19
 */
@Data
public class HistogramModel {
    private HistogramAccesses all_accesses;
    private HistogramAccesses last_hour;
    private HistogramAccesses today;


    public HistogramModel(HistogramAccesses all_accesses, HistogramAccesses last_hour,HistogramAccesses today) {
        this.all_accesses = all_accesses;
        this.last_hour = last_hour;
        this.today = today;
    }

}