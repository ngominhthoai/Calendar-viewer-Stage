import React from "react";
import { DateTime } from "luxon";

export default class infoEvent extends React.Component {
  render() {
    if (this.props.clickedEvent === null) {
      return (
        <div className="infoEvent">
          <p>Cliquez sur un evenement pour afficher ses informations</p>
        </div>
      );
    } else {
      let debut = DateTime.fromMillis(
        Date.parse(this.props.clickedEvent.start)
      );
      let fin = DateTime.fromMillis(Date.parse(this.props.clickedEvent.end));
      let bgc = { background: this.props.clickedEvent.backgroundColor };
      let horraires_disponibles =
        this.props.clickedEvent.extendedProps.horraires_dispos
          .split(",")
          .map((horaire) => {
            let hor = DateTime.fromSeconds(horaire * 60);
            return (
              " " + hor.toLocaleString({ hour: "2-digit", minute: "2-digit" })
            );
          });

      return (
        <div className="infoEvent" style={bgc}>
          <span id="main">
            <p>
              {debut.toLocaleString({
                weekday: "long",
                day: "2-digit",
                month: "long",
              }) +
                " de " +
                debut.toLocaleString({ hour: "2-digit", minute: "2-digit" }) +
                " à " +
                fin.toLocaleString({ hour: "2-digit", minute: "2-digit" })}
            </p>
            <p>Catégorie : {this.props.clickedEvent.extendedProps.categorie}</p>
            <p>Salle(s) : {" "}
              {this.props.clickedEvent.extendedProps.salle.map(
                (salle) => " " + salle
              )}
            </p>
            <p>Matière : {this.props.clickedEvent.extendedProps.matiere}</p>
            <p>Groupe(s) : {this.props.clickedEvent.extendedProps.groupes.map(grp => " " + grp)}</p>
            <p>
              Enseignant(s) : {" "}
              {this.props.clickedEvent.extendedProps.enseignant.map(
                (enseignant) => " " + enseignant
              )}
            </p>
          </span>

          <span id="more" style={{ display: "none" }}>
            <p>
              Capacité d'accueil :{" "}
              {this.props.clickedEvent.extendedProps.capacite_accueil} élèves
            </p>
            <p>
              Nombre de sessions :{" "}
              {this.props.clickedEvent.extendedProps.nb_sessions}
            </p>
            <p>
              Durée de la session :{" "}
              {this.props.clickedEvent.extendedProps.duree_session} minutes
            </p>
            <p>Horaires disponibles pour ce cours : {horraires_disponibles}</p>
            <p>
              Salles disponibles pour ce cours :{" "}
              {this.props.clickedEvent.extendedProps.salles_dispos.map(
                (salle) => " " + salle
              )}
            </p>
            <p>
              Enseignant(s) pouvant(s) assurer le cours :{" "}
              {this.props.clickedEvent.extendedProps.enseignants_dispos.map(
                (enseignant) => " " + enseignant
              )}
            </p>
          </span>

          <button id="voirPlus" onClick={this.onClickVoirPlus}>
            Voir plus
          </button>
        </div>
      );
    }
  }
  onClickVoirPlus = (e) => {
    let more = document.querySelector("#more");
    if (more.style.display === "none") {
      more.style.display = "inline";
      e.target.innerText = "Voir moins";
    } else {
      more.style.display = "none";
      e.target.innerText = "Voir plus";
    }
  };
}
