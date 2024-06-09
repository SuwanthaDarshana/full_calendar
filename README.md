# FullCalendar Diary Backend

This project provides a backend API for managing daily schedules using Spring Boot and JPA. The API supports CRUD operations for daily schedules, which can be integrated with a frontend such as FullCalendar for displaying and interacting with calendar events.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Java 11 or higher
- Maven
- MySQL (or any other preferred SQL database)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/fullcalendar-diary-backend.git
   cd fullcalendar-diary-backend
Set up your database:

* Create a database for the application.
* Update the application.properties file with your database connection details.

spring.datasource.url=jdbc:mysql://localhost:3306/your-database-name
spring.datasource.username=your-database-username
spring.datasource.password=your-database-password
spring.jpa.hibernate.ddl-auto=update
Build and run the application:

mvn clean install
mvn spring-boot:run
The application should now be running on http://localhost:8080.

API Endpoints
The following endpoints are available in the API:

* Create a Daily Schedule

* POST /Diary/saveDailyDiary
Request Body:

{
  "agntnum": "12345",
  "startDate": "2023-06-15T10:00:00",
  "endDate": "2023-06-15T11:00:00",
  "title": "Meeting with client",
  "status": "active",
  "allDay": false
}

* Response:
201 Created: The created schedule.
* Get Events by Agent Number
GET /Diary/events/{agntnum}

*Response:

200 OK: List of events for the specified agent number.

* Update a Daily Schedule
* PUT /Diary/update/{id}
  
Request Body:
{
  "agntnum": "12345",
  "startDate": "2023-06-15T10:00:00",
  "endDate": "2023-06-15T11:00:00",
  "title": "Updated Meeting",
  "status": "active",
  "allDay": false
}
*
Response:
200 OK: The updated schedule.
404 Not Found: If the schedule with the given ID is not found.

* Delete a Daily Schedule
* DELETE /Diary/delete/{id}
* 
Response:
204 No Content: If the deletion is successful.
404 Not Found: If the schedule with the given ID is not found.
  
* Data Model
The data model for DailySchedule is defined as follows:

@Entity
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

* Technologies Used
 - Java
 - Spring Boot
 - Spring Data JPA
 - Hibernate
 - MySQL (or any preferred SQL database)
 - Maven
   
Contributing
Contributions are welcome! Please fork the repository and submit a pull request for review.
