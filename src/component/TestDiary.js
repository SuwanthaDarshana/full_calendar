import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Box,
  CssBaseline,
  Paper,
  Typography,
  Grid,
  Container,
  styled,
  TextField,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import Swal from "sweetalert2";
import API_BASE_URL from "./config";
import Autocomplete from "@mui/material/Autocomplete";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Diary() {
  const agentNumber = 209349;
  const [events, setEvents] = useState([]);
  const [defaultEvents, setDefaultEvents] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const draggableEventRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/Diary/eventNames`)
      .then((response) => {
        setDefaultEvents(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the events!", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `${API_BASE_URL}/Diary/clientCities?agntnum=${agentNumber}&city=NULL`
      )
      .then((response) => {
        const transformedCityOptions = response.data.map((city) => ({
          cityName: city,
        }));
        setCityOptions(transformedCityOptions);
      })
      .catch((error) => {
        console.error("There was an error fetching the cities!", error);
      });
  }, [agentNumber]);

  useEffect(() => {
    let draggableEl = draggableEventRef.current;
    const draggable = new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        return {
          title: eventEl.innerText.trim(),
        };
      },
    });

    // Cleanup function to destroy Draggable instance
    return () => draggable.destroy();
  }, [defaultEvents]);

  const transformEventData = (eventsData) => {
    return eventsData.map((eventData) => ({
      id: eventData.record_ID,
      title: eventData.title,
      start: eventData.startDate,
      end: eventData.endDate,
      allDay: eventData.allDay,
    }));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get(`${API_BASE_URL}/Diary/events/${agentNumber}`)
      .then((response) => {
        const transformedEvents = transformEventData(response.data);
        setEvents(transformedEvents);
        console.log(transformedEvents);
      })
      .catch((error) => {
        console.error("There was an error fetching the events!", error);
      });
  };

  function handleDateSelect(selectInfo) {
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    Swal.fire({
      title: 'Enter a new title for your event',
      input: 'text',
      inputPlaceholder: 'Event Title',
      showCancelButton: true,
      confirmButtonText: 'Add Event',
      preConfirm: (title) => {
        if (!title) {
          Swal.showValidationMessage('You need to write something!');
        }
        return title;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let title = result.value;
        if (title) {
          // Create event object to send to the backend
          const event = {
            agntnum: agentNumber, // Replace with actual agent number
            startDate: new Date(selectInfo.startStr).toISOString(),
            endDate: new Date(selectInfo.endStr).toISOString(),
            title: title,
            status: 'active',
            allDay: selectInfo.allDay
          };

          console.log('Event to be sent:', event); // Debug: log the event object

          // Send event to the backend
          fetch(`${API_BASE_URL}/Diary/saveDailyDiary`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Data received:', data); // Debug: log the data received from the server
            // Add event to calendar if save was successful
            calendarApi.addEvent({
              id: data.RECORD_ID, // Assuming the backend returns the saved event with an ID
              title,
              start: selectInfo.startStr,
              end: selectInfo.endStr,
              allDay: selectInfo.allDay
            });
            Swal.fire('Event Added!', 'Your event has been added.', 'success');
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            Swal.fire('Error', 'There was a problem saving your event. Please try again.', 'error');
          });
        }
      }
    });
  }

  function handleEventClick(clickInfo) {
    Swal.fire({
      title: 'Update or Delete Event',
      input: 'text',
      inputValue: clickInfo.event.title,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Update',
      denyButtonText: 'Delete',
      preConfirm: (newTitle) => {
        if (!newTitle) {
          Swal.showValidationMessage('You need to write something!');
        }
        return newTitle;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let newTitle = result.value;

        const updatedEvent = {
          id: clickInfo.event.id,
          agntnum: agentNumber, // Replace with actual agent number
          startDate: clickInfo.event.start.toISOString(),
          endDate: clickInfo.event.end.toISOString(),
          title: newTitle,
          status: 'active',
          allDay: clickInfo.event.allDay
        };

        axios.put(`${API_BASE_URL}/Diary/update/${clickInfo.event.id}`, updatedEvent)
          .then(response => {
            clickInfo.event.setProp('title', newTitle);
            Swal.fire('Event Updated!', 'Your event has been updated.', 'success');
          })
          .catch(error => {
            console.error('There was a problem updating the event:', error);
            Swal.fire('Error', 'There was a problem updating your event. Please try again.', 'error');
          });

      } else if (result.isDenied) {
        axios.delete(`${API_BASE_URL}/Diary/delete/${clickInfo.event.id}`)
          .then(response => {
            clickInfo.event.remove();
            Swal.fire('Event Deleted!', 'Your event has been deleted.', 'success');
          })
          .catch(error => {
            console.error('There was a problem deleting the event:', error);
            Swal.fire('Error', 'There was a problem deleting your event. Please try again.', 'error');
          });
      }
    });
  }

  function handleEventDrop(dropInfo) {
    const updatedEvent = {
      id: dropInfo.event.id,
      agntnum: agentNumber, // Replace with actual agent number
      startDate: dropInfo.event.start.toISOString(),
      endDate: dropInfo.event.end ? dropInfo.event.end.toISOString() : dropInfo.event.start.toISOString(), // Handle null endDate
      title: dropInfo.event.title,
      status: 'active',
      allDay: dropInfo.event.allDay
    };

    axios.put(`${API_BASE_URL}/Diary/update/${dropInfo.event.id}`, updatedEvent)
      .then(response => {
        Swal.fire('Event Updated!', 'Your event has been updated.', 'success');
      })
      .catch(error => {
        console.error('There was a problem updating the event:', error);
        Swal.fire('Error', 'There was a problem updating your event. Please try again.', 'error');
        // Optionally, revert the event change in case of error
        dropInfo.revert();
      });
  }

  function handleEventResize(resizeInfo) {
    const updatedEvent = {
      id: resizeInfo.event.id,
      agntnum: agentNumber, // Replace with actual agent number
      startDate: resizeInfo.event.start.toISOString(),
      endDate: resizeInfo.event.end ? resizeInfo.event.end.toISOString() : resizeInfo.event.start.toISOString(), // Handle null endDate
      title: resizeInfo.event.title,
      status: 'active',
      allDay: resizeInfo.event.allDay
    };

    axios.put(`${API_BASE_URL}/Diary/update/${resizeInfo.event.id}`, updatedEvent)
      .then(response => {
        Swal.fire('Event Updated!', 'Your event duration has been updated.', 'success');
      })
      .catch(error => {
        console.error('There was a problem updating the event:', error);
        Swal.fire('Error', 'There was a problem updating your event duration. Please try again.', 'error');
        // Optionally, revert the event change in case of error
        resizeInfo.revert();
      });
  }

  return (
    <div>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <main>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Item ref={draggableEventRef}>
                      <Typography variant="h6">Event</Typography>
                      {defaultEvents.map((event) => (
                        <div
                          key={event.eventId}
                          className="fc-event"
                          style={{
                            margin: "10px 0",
                            padding: "8px",
                            backgroundColor: "#ffdd57",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          {event.eventName}
                        </div>
                      ))}
                    </Item>
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      disablePortal
                      id="city-autocomplete"
                      options={cityOptions}
                      getOptionLabel={(option) => option.cityName || ""}
                      renderInput={(params) => (
                        <TextField {...params} label="City" />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={8} lg={9}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Item>
                      <FullCalendar
                        plugins={[
                          dayGridPlugin,
                          timeGridPlugin,
                          interactionPlugin,
                          listPlugin,
                        ]}
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right:
                            "dayGridMonth,timeGridWeek,timeGridDay,listDay",
                        }}
                        initialView="dayGridMonth"
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        events={events}// alternatively, use the `events` setting to fetch from a feed
                        select={handleDateSelect}
                        eventContent={renderEventContent} // custom render function
                        eventClick={handleEventClick}
                        eventsSet={(events) => setEvents(events)} // called after events are initialized/added/changed/removed
                        timeZone="UTC"
                        eventDrop={handleEventDrop}
                        eventResize={handleEventResize}
                      />
                    </Item>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </main>
      </Box>
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default Diary;
