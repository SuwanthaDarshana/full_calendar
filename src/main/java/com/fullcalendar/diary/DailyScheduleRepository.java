package com.fullcalendar.diary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyScheduleRepository extends JpaRepository<DailySchedule,Long> {
    List<DailySchedule> findByAgntnum(String agntnum);
}
