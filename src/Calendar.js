import React from "react";
import Leftbar from "./Leftbar/Leftbar";
import DefaultView from "./CalendarView/DefaultView";
import TimelineView from "./CalendarView/TimelineView";
import RightBar from "./Rightbar/RightBar";
import ImportXMLModal from "./Modals/ImportXMLModal";
import StatisticsModal from "./Modals/Stats/StatisticsModal";

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.calendarRef = React.createRef();
    this.filterRef = React.createRef();
    this.listOfBgColors = [
      "#FF5DE4",
      "#80E961",
      "#FFE25C",
      "#00B3FF",
      "#FFA87F",
      "#5603BD",
      "#FF5F5F",
      "#808000",
      "#5f9ea0",
      "#dc143c",
      "#bdb76b",
      "#e9967a",
      "#e6e6fa",
      "#3cb371",
      "#f4a460",
      "#008080",
      "#f5deb3",
      "#9acd32",
    ];
  }

  componentDidUpdate() {
    this.filterRef.current.filtrate();
  }

  state = {
    defaultview: true,
    currentEvents: [],
    salles: [],
    enseignants: [],
    clickedEvent: null,
    datedepart: new Date(),
    salles_non_utilisables: [],
    salles_utilisables: [],
    enseignants_non_utilisables: [],
    enseignants_utilisables: [],
  };

  render() {
    return (
      <div className="Calendar">
        <Leftbar
          currentEvents={this.state.currentEvents}
          salles={this.state.salles}
          enseignants={this.state.enseignants}
          calendarRef={this.calendarRef}
          ref={this.filterRef}
        />
        <DefaultView
          currentEvents={this.state.currentEvents}
          defaultview={this.state.defaultview}
          calendarRef={this.calendarRef}
          CalendarViewCallback={this.handleCalendarViewCallback}
        />

        <TimelineView
          currentEvents={this.state.currentEvents}
          defaultview={this.state.defaultview}
          calendarRef={this.calendarRef}
          salles={this.state.salles}
          enseignants={this.state.enseignants}
          CalendarViewCallback={this.handleCalendarViewCallback}
        />

        <RightBar
          clickedEvent={this.state.clickedEvent}
          changeCalendarView={this.changeCalendarView}
          defaultview={this.state.defaultview}
          calendarRef={this.calendarRef}
          currentEvents={this.state.currentEvents}
          color_event_by_categorie={this.color_event_by_categorie}
          color_event_by_matiere={this.color_event_by_matiere}
          color_event_by_enseignant={this.color_event_by_enseignant}
          color_event_by_salle={this.color_event_by_salle}
        />

        <ImportXMLModal CalendarCallback={this.handleImportXMLModalCallback} />
        <StatisticsModal
          currentEvents={this.state.currentEvents}
          salles_non_utilisables={this.state.salles_non_utilisables}
          salles_utilisables={this.state.salles_utilisables}
          calendarRef={this.calendarRef}
          listOfBgColors={this.listOfBgColors}
          enseignants_non_utilisables={this.state.enseignants_non_utilisables}
          enseignants_utilisables={this.state.enseignants_utilisables}
          datedepart={this.state.datedepart}
        />
      </div>
    );
  }

  handleImportXMLModalCallback = (
    salles,
    salles_non_utilisables,
    salles_utilisables,
    enseignants,
    enseignants_non_utilisables,
    enseignants_utilisables,
    listofevents,
    datedepart,
    timeHorizon
  ) => {
    this.setState(
      {
        salles: salles,
        salles_non_utilisables: salles_non_utilisables,
        salles_utilisables: salles_utilisables,
        enseignants: enseignants,
        enseignants_non_utilisables: enseignants_non_utilisables,
        enseignants_utilisables: enseignants_utilisables,
        currentEvents: listofevents,
        datedepart: datedepart.toString(),
        timeHorizon: timeHorizon,
      },
      () => {
        let calendarApi = this.calendarRef.current.getApi();
        calendarApi.gotoDate(this.state.datedepart);
        let categorie_btn = document.querySelector("#catégorie");
        categorie_btn.click();

        let all_filters = document.querySelectorAll("input[type='checkbox']");
        all_filters.forEach((filter) => {
          filter.checked = false;
        });
        
        let active_filters = document.querySelector(
          "ul[class='active-filters']"
        );
        active_filters.querySelectorAll("li").forEach((li) => {
          active_filters.removeChild(li);
        });
      }
    );
  };

  handleCalendarViewCallback = (event) => {
    this.setState({ clickedEvent: event });
  };

  changeCalendarView = () => {
    this.setState({ defaultview: !this.state.defaultview }, () => {
      let calendarApi = this.calendarRef.current.getApi();
      calendarApi.gotoDate(this.state.datedepart);
      document.querySelectorAll(".colorby-button").forEach((button) => {
        if (button.classList.contains("active-colorbutton")) {
          button.click();
        }
      });
    });
  };

  color_event_by_categorie = (e) => {
    document.querySelectorAll(".colorby-button").forEach((button) => {
      button.classList.remove("active-colorbutton");
    });
    e.target.classList.add("active-colorbutton");
    let calendarApi = this.calendarRef.current.getApi();
    let events = calendarApi.getEvents();

    let categories = [
      // On recupere les differentes categories
      ...new Set(
        this.state.currentEvents.map(
          (event) => event.extendedProps.categorie[0]
        )
      ),
    ];

    let categorie_bgcolor = new Map(); // On creer un tableau assiocatif categorie => couleur

    for (let i = 0; i < categories.length; i++) {
      categorie_bgcolor.set(categories[i], this.listOfBgColors[i]);
    }

    events.forEach((event) => {
      // Pour chaque evenement on recupere sa couleur dans le tableau assiocatif et on lui affecte en tant que propriete fullcalendar

      let color = categorie_bgcolor.get(event.extendedProps.categorie[0]);
      if (event.extendedProps.categorie.includes("EVAL")) {
        color = "red";
      }
      event.setProp("backgroundColor", color);
    });

    this.setState({ clickedEvent: null });
  };

  color_event_by_matiere = (e) => {
    document.querySelectorAll(".colorby-button").forEach((button) => {
      button.classList.remove("active-colorbutton");
    });
    e.target.classList.add("active-colorbutton");
    let calendarApi = this.calendarRef.current.getApi();
    let events = calendarApi.getEvents();

    let matieres = [
      ...new Set(
        this.state.currentEvents.map((event) => event.extendedProps.matiere)
      ),
    ];

    let matiere_bgcolor = new Map();

    for (let i = 0; i < matieres.length; i++) {
      matiere_bgcolor.set(matieres[i], this.listOfBgColors[i]);
    }

    events.forEach((event) => {
      let color = matiere_bgcolor.get(event.extendedProps.matiere);
      if (event.extendedProps.categorie.includes("EVAL")) {
        color = "red";
      }
      event.setProp("backgroundColor", color);
    });
    this.setState({ clickedEvent: null });
  };

  color_event_by_enseignant = (e) => {
    document.querySelectorAll(".colorby-button").forEach((button) => {
      button.classList.remove("active-colorbutton");
    });
    e.target.classList.add("active-colorbutton");
    let calendarApi = this.calendarRef.current.getApi();
    let events = calendarApi.getEvents();

    let enseignants = [
      ...new Set(
        this.state.currentEvents.map((event) => event.extendedProps.enseignant)
      ),
    ];

    let enseignant_bgcolor = new Map();

    for (let i = 0; i < enseignants.length; i++) {
      enseignant_bgcolor.set(enseignants[i], this.listOfBgColors[i]);
    }

    events.forEach((event) => {
      let color = enseignant_bgcolor.get(event.extendedProps.enseignant);
      if (event.extendedProps.categorie.includes("EVAL")) {
        color = "red";
      }
      event.setProp("backgroundColor", color);
    });
    this.setState({ clickedEvent: null });
  };

  color_event_by_salle = (e) => {
    document.querySelectorAll(".colorby-button").forEach((button) => {
      button.classList.remove("active-colorbutton");
    });
    e.target.classList.add("active-colorbutton");
    let calendarApi = this.calendarRef.current.getApi();
    let events = calendarApi.getEvents();

    let salles = [
      ...new Set(
        this.state.currentEvents.map((event) => event.extendedProps.salle)
      ),
    ];

    let salle_bgcolor = new Map();

    for (let i = 0; i < salles.length; i++) {
      salle_bgcolor.set(salles[i], this.listOfBgColors[i]);
    }

    events.forEach((event) => {
      let color = salle_bgcolor.get(event.extendedProps.salle);
      if (event.extendedProps.categorie.includes("EVAL")) {
        color = "red";
      }
      event.setProp("backgroundColor", color);
    });
    this.setState({ clickedEvent: null });
  };
}
