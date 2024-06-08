package com.fullcalendar.diary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/Diary")
@CrossOrigin
public class DailyScheduleController {


    @Autowired
    private DailyScheduleService dailyScheduleService;

    @PostMapping("/saveDailyDiary")
    public ResponseEntity<DailySchedule> saveDailyDiary(@RequestBody DailySchedule dailySchedule) {
        try {
            DailySchedule savedDailySchedule = dailyScheduleService.saveDailySchedule(dailySchedule);
            return new ResponseEntity<>(savedDailySchedule, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/events/{agntnum}")
    public ResponseEntity<List<DailySchedule>> getEventsByAgntnum(@PathVariable String agntnum) {
        try {
            List<DailySchedule> events = dailyScheduleService.getDailySchedulesByAgntnum(agntnum);
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<DailySchedule> updateDailySchedule(@PathVariable Long id, @RequestBody DailySchedule dailySchedule) {
        try {
            DailySchedule updatedDailySchedule = dailyScheduleService.updateDailySchedule(id, dailySchedule);
            if (updatedDailySchedule != null) {
                return new ResponseEntity<>(updatedDailySchedule, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> deleteDailySchedule(@PathVariable Long id) {
        try {
            dailyScheduleService.deleteDailySchedule(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
