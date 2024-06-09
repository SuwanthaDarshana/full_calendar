package com.fullcalendar.diary;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class DailySchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long RECORD_ID;
    private String agntnum;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String TITLE;
    private String STATUS;
    private Boolean AllDay;
}