import React from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

export default class TimelineView extends React.Component {
  render() {
    return (
      !this.props.defaultview && (
        <div className="Calendar-main">
          <FullCalendar
            schedulerLicenseKey={"GPL-My-Project-Is-Open-Source"}
            plugins={[resourceTimelinePlugin]}
            headerToolbar={{
              left: "today prev,next",
              center: "title",
              right:
                "resourceTimelineMonth,resourceTimelineWeek,resourceTimelineDay",
            }}
            buttonText={{
              today: "Aujourd'hui",
              month: "Mois",
              week: "Semaine",
              day: "Jour",
            }}
            weekNumbers={true}
            weekText={"S"}
            resourceAreaColumns={[
              {
                group: true,
                headerContent: "Infos",
                field: "infos",
              },
              {
                headerContent: "Salle",
                field: "nomsalle",
              },
              {
                headerContent: "Places",
                field: "capacite",
              },
            ]}
            resources= {[...new Set(this.props.salles)].map((salle) => ({
              nomsalle: salle.nomsalle,
              id: salle.nomsalle,
              infos: salle.infos,
              capacite: salle.capacite,
            }))}
            events={this.props.currentEvents}
            eventClick={this.handleEventClick}
            initialView="resourceTimelineWeek"
            locale="fr"
            ref={this.props.calendarRef}
            slotMinTime={"07:00:00"}
            slotDuration={"00:15:00"}
            firstDay={1} //1=Lundi
            height={"auto"}
          />
        </div>
      )
    );
  }
  handleEventClick = (arg) => {
    this.props.CalendarViewCallback(arg.event);
  };
}
