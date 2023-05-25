import React from "react";
import SallesStatsGraph from "./SallesStatsGraph";
import EnseignantsStatsGraph from "./EnseignantsStatsGraph";
import GroupesStats from "./GroupesStats";

export default class StatisticsModal extends React.Component {
  render() {
    if (this.props.currentEvents.length === 0) {
      return (
        <div
          id="showStatistics"
          className="showStatisticsModal"
          style={{ display: "none" }}
        >
          <div className="showStatistics-content">
            <span className="close" onClick={this.onClickCloseBtn}>
              &times;
            </span>
            <h1>Statistiques</h1>
            <p>Veuillez d'abord charger un fichier</p>
          </div>
        </div>
      );
    } else {
      let salles_utilisées = [
        ...new Set(
          this.props.currentEvents.map((event) => event.extendedProps.salle)
        ),
      ];
      let salles_non_utilisées = [];
      this.props.salles_utilisables.forEach((salle) => {
        if (!salles_utilisées.includes(salle)) {
          salles_non_utilisées.push(salle);
        }
      });

      let enseignants_utilisés = [
        ...new Set(
          this.props.currentEvents.map(
            (event) => event.extendedProps.enseignant
          )
        ),
      ];
      let enseignants_non_utilisés = [];
      this.props.enseignants_utilisables.forEach((enseignant) => {
        if (!enseignants_utilisés.includes(enseignant)) {
          enseignants_non_utilisés.push(enseignant);
        }
      });

      return (
        <div
          id="showStatistics"
          className="showStatisticsModal"
          style={{ display: "none" }}
        >
          <div className="showStatistics-content">
            <span className="close" onClick={this.onClickCloseBtn}>
              &times;
            </span>
            <h1>Statistiques</h1>
            <div className="statistics">
              <div id="salles_stats">
                <h1 className="stats_title">Salles</h1>
                <span>
                  Salles non utilisables :{" "}
                  {this.props.salles_non_utilisables.length === 0 ? (
                    "aucune"
                  ) : (
                    <span>
                      <ul>
                        {this.props.salles_non_utilisables.map((salle) => (
                          <li key={salle}>{salle}</li>
                        ))}
                      </ul>
                    </span>
                  )}
                </span>
                <br />
                <span>
                  Salles non utilisées :{" "}
                  {salles_non_utilisées.length === 0 ? (
                    "aucune"
                  ) : (
                    <span>
                      <ul>
                        {salles_non_utilisées.map((salle) => (
                          <li key={salle}>{salle}</li>
                        ))}
                      </ul>
                    </span>
                  )}
                </span>
                <SallesStatsGraph
                  salles_utilisables={this.props.salles_utilisables}
                  calendarRef={this.props.calendarRef}
                  listOfBgColors={this.props.listOfBgColors}
                />
              </div>
              <div id="enseignants_stats">
                <h1 className="stats_title">Enseignants</h1>
                <span>
                  Enseignants non utilisables :{" "}
                  {this.props.enseignants_non_utilisables.length === 0 ? (
                    "aucun"
                  ) : (
                    <span>
                      <ul>
                        {this.props.enseignants_non_utilisables.map(
                          (enseignant) => (
                            <li key={enseignant}>{enseignant}</li>
                          )
                        )}
                      </ul>
                    </span>
                  )}
                </span>
                <br />
                <span>
                  Enseignants non utilisées :{" "}
                  {enseignants_non_utilisés.length === 0 ? (
                    "aucun"
                  ) : (
                    <span>
                      <ul>
                        {enseignants_non_utilisés.map((enseignant) => (
                          <li key={enseignant}>{enseignant}</li>
                        ))}
                      </ul>
                    </span>
                  )}
                </span>
                <EnseignantsStatsGraph
                  enseignants_utilisables={this.props.enseignants_utilisables}
                  calendarRef={this.props.calendarRef}
                  listOfBgColors={this.props.listOfBgColors}
                />
              </div>

              <GroupesStats
                currentEvents={this.props.currentEvents}
                calendarRef={this.props.calendarRef}
                datedepart={this.props.datedepart}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  onClickCloseBtn = () => {
    let modal = document.getElementById("showStatistics");
    modal.style.display = "none";
  };
}
