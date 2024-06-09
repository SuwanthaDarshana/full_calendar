package com.fullcalendar.diary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DailyScheduleService {

    @Autowired
    private DailyScheduleRepository dailyScheduleRepository;

    public DailySchedule saveDailySchedule(DailySchedule dailySchedule) {
        return dailyScheduleRepository.save(dailySchedule);
    }

    public List<DailySchedule> getAllDailySchedules() {
        return dailyScheduleRepository.findAll();
    }

    public Optional<DailySchedule> getDailyScheduleById(Long id) {
        return dailyScheduleRepository.findById(id);
    }

    public List<DailySchedule> getDailySchedulesByAgntnum(String agntnum) {
        return dailyScheduleRepository.findByAgntnum(agntnum);
    }

    public DailySchedule updateDailySchedule(Long id, DailySchedule dailySchedule) {
        Optional<DailySchedule> optionalDailySchedule = dailyScheduleRepository.findById(id);
        if (optionalDailySchedule.isPresent()) {
            DailySchedule existingDailySchedule = optionalDailySchedule.get();
            existingDailySchedule.setAgntnum(dailySchedule.getAgntnum());
            existingDailySchedule.setStartDate(dailySchedule.getStartDate());
            existingDailySchedule.setEndDate(dailySchedule.getEndDate());
            existingDailySchedule.setTITLE(dailySchedule.getTITLE());
            existingDailySchedule.setSTATUS(dailySchedule.getSTATUS());
            existingDailySchedule.setAllDay(dailySchedule.getAllDay());
            return dailyScheduleRepository.save(existingDailySchedule);
        }
        return null;
    }

    public void deleteDailySchedule(Long id) {
        dailyScheduleRepository.deleteById(id);
    }

}
