import React from "react";

import InfoEvent from "./InfoEvent";

export default class Leftbar extends React.Component {
  render() {
    return (
      <div className="Calendar-rightbar">
        <h1 className="section-title">Informations</h1>

        <InfoEvent clickedEvent={this.props.clickedEvent} />

        <div className="options">
          <h1 className="section-title">Options</h1>

          <button
            className="option-button"
            id="showStatisticsBtn"
            onClick={this.onClickShowStatistics}
          >
            Voir les statistiques
          </button>

          <br />
          <br />

          <button
            className="option-button"
            id="importXmlBtn"
            onClick={this.onClickImportXml}
          >
            Importer un fichier XML
          </button>

          <br />
          <br />

          <button
            className="option-button"
            onClick={this.props.changeCalendarView}
          >
            {this.props.defaultview
              ? "Basculer en vue par salle"
              : "Revenir à la vue par default"}
          </button>

          <div className="select-section">
            <p>Colorer les evenements par </p>

            <div className="colorby-buttons">
              <button
                className="colorby-button"
                id="catégorie"
                onClick={this.props.color_event_by_categorie}
              >
                catégorie
              </button>
              <button
                className="colorby-button"
                id="matière"
                onClick={this.props.color_event_by_matiere}
              >
                matière
              </button>
              <button
                className="colorby-button"
                id="enseignant"
                onClick={this.props.color_event_by_enseignant}
              >
                enseignant
              </button>
              <button
                className="colorby-button"
                id="salle"
                onClick={this.props.color_event_by_salle}
              >
                salle
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  onClickImportXml = () => {
    let modal = document.getElementById("importXml");
    modal.style.display = "block";
  };

  onClickShowStatistics = () => {
    let modal = document.getElementById("showStatistics");
    modal.style.display = "block";
  };
}
