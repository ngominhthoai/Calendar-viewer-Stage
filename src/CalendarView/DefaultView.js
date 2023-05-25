import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default class DefaultView extends React.Component {
  render() {
    return (
      this.props.defaultview && (
        <div className="Calendar-main">
          <FullCalendar
            schedulerLicenseKey={"GPL-My-Project-Is-Open-Source"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Aujourd'hui",
              month: "Mois",
              week: "Semaine",
              day: "Jour",
            }}
            weekNumbers={true}
            weekText={"S"}
            initialView="timeGridWeek"
            locale="fr"
            allDaySlot={false}
            slotMinTime={"07:00:00"}
            slotDuration={"00:15:00"}
            firstDay={1} //1=Lundi
            height={"100%"}
            events={this.props.currentEvents}
            eventClick={this.handleEventClick}
            ref={this.props.calendarRef}
          />
        </div>
      )
    );
  }

  handleEventClick = (arg) => {
    this.props.CalendarViewCallback(arg.event);
  };
}
