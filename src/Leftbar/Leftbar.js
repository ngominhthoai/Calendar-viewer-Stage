import React from "react";
import Filters from "./Filters";
export default class Leftbar extends React.Component {

  render() {
    return (
      <div className="Calendar-leftbar">
        <h1 className="section-title">Filtres</h1>
        <div className="Calendar-leftbar-filters">
          <ul className="active-filters"></ul>
          <button className="accordion" onClick={this.OnclickFiltersSection}>
            Matieres
          </button>
          <div className="panel">
            <ul>
              <Filters
                listOfFilters={[
                  ...new Set(
                    this.props.currentEvents.map(
                      (event) => event.extendedProps.matiere
                    )
                  ),
                ].sort()}
                onclick={this.filtrate}
                classname="filter_matiere"
              />
            </ul>
          </div>
          <button className="accordion" onClick={this.OnclickFiltersSection}>
            Categories
          </button>
          <div className="panel">
            <ul>
              <Filters
                listOfFilters={[
                  ...new Set(
                    [].concat(
                      ...this.props.currentEvents.map(
                        (event) => event.extendedProps.categorie
                      )
                    )
                  ),
                ].sort()}
                onclick={this.filtrate}
                classname="filter_categorie"
              />
            </ul>
          </div>
          <button className="accordion" onClick={this.OnclickFiltersSection}>
            Enseignants
          </button>
          <div className="panel">
            <ul>
              <Filters
                listOfFilters={[
                  ...new Set(
                    [].concat(
                      ...this.props.enseignants.map(
                        (enseignant) => enseignant.getId()
                        )
                        )
                      ),
                    ].sort()}
                onclick={this.filtrate}
                classname="filter_enseignant"
                availables={[
                  ...new Set(
                    [].concat(
                      ...this.props.currentEvents.map(
                        (event) => event.extendedProps.enseignant
                      )
                    )
                  ),
                ].sort()}
              />
            </ul>
          </div>
          <button className="accordion" onClick={this.OnclickFiltersSection}>
            Salles
          </button>
          <div className="panel">
            <ul>
              <Filters
                listOfFilters={[
                  ...new Set(
                    [].concat(
                      ...this.props.salles.map(
                        (salle) => salle.getId()
                        )
                        )
                      ),
                    ].sort()}
                onclick={this.filtrate}
                classname="filter_salle"
                availables={[
                  ...new Set(
                    [].concat(
                      ...this.props.currentEvents.map(
                        (event) => event.extendedProps.salle
                      )
                    )
                  ),
                ].sort()}
              />
            </ul>
          </div>
          <button className="accordion" onClick={this.OnclickFiltersSection}>
            Groupes
          </button>
          <div className="panel">
            <ul>
              <Filters
                listOfFilters={[
                  ...new Set(
                    [].concat(
                      ...this.props.currentEvents.map(
                        (event) => event.extendedProps.groupes
                      )
                    )
                  ),
                ].sort()}
                onclick={this.filtrate}
                classname="filter_groupe"
              />
            </ul>
          </div>
        </div>
      </div>
    );
  }

  OnclickFiltersSection = (e) => {
    e.target.classList.toggle("active");

    let panel = e.target.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  };

  filtrate = (e) => {
    let calendarApi = this.props.calendarRef.current.getApi();
    let events = calendarApi.getEvents();

    let all_filters = document.querySelectorAll(
      "input[type='checkbox']:checked"
    );
    if (all_filters.length === 0) {
      // Si aucun filtre selectionné, on affiche tous les evenements
      events.forEach((event) => {
        event.setProp("display", "auto");
      });
    } else {
      //Sinon on cache tous les evenements et on affichera par la suite les evenements concernés par les filtres
      events.forEach((event) => {
        event.setProp("display", "none");
      });
    }

    //On recupere d'abord tous les filtres selon leur classe
    let current_matiere_filters = document.querySelectorAll(
      "input[class='filter_matiere']:checked"
    );
    let current_categorie_filters = document.querySelectorAll(
      "input[class='filter_categorie']:checked"
    );
    let current_enseignant_filters = document.querySelectorAll(
      "input[class='filter_enseignant']:checked"
    );
    let current_salle_filters = document.querySelectorAll(
      "input[class='filter_salle']:checked"
    );
    let current_groupe_filters = document.querySelectorAll(
      "input[class='filter_groupe']:checked"
    );

    events.forEach((event) => {
      // on souhaite regarder pour chaque evenement, s'il est valide aux filtres selectionnés
      let valid_event = false;

      if (current_matiere_filters.length === 0) {
        // Si aucun filtre matiere n'est selectionné, on considere que l'evenement est valide
        valid_event = true;
      } else {
        current_matiere_filters.forEach((filter_matiere) => {
          // Sinon on regarde pour chaque filtre matiere si l'evenement correspond au filtre, si oui, il devient valide
          if (event.extendedProps.matiere === filter_matiere.id) {
            valid_event = true;
          }
        });
      }

      if (valid_event === true) {
        if (current_categorie_filters.length !== 0) {
          valid_event = false;
          current_categorie_filters.forEach((filter_categorie) => {
            event.extendedProps.categorie.forEach((categorie) => {
              if (categorie === filter_categorie.id) {
                valid_event = true;
              }
            });
          });
        }
      }

      if (valid_event === true) {
        if (current_enseignant_filters.length !== 0) {
          valid_event = false;
          current_enseignant_filters.forEach((filter_enseignant) => {
            if (event.extendedProps.enseignant === filter_enseignant.id) {
              valid_event = true;
            }
          });
        }
      }

      if (valid_event === true) {
        if (current_salle_filters.length !== 0) {
          valid_event = false;
          current_salle_filters.forEach((filter_salle) => {
            if (event.extendedProps.salle === filter_salle.id) {
              valid_event = true;
            }
          });
        }
      }

      if (valid_event === true) {
        if (current_groupe_filters.length !== 0) {
          valid_event = false;
          current_groupe_filters.forEach((filter_groupe) => {
            event.extendedProps.groupes.forEach((groupe) => {
              if (groupe === filter_groupe.id) {
                valid_event = true;
              }
            });
          });
        }
      }

      if (valid_event === true) {
        event.setProp("display", "auto");
      }
    });

    if (e !== undefined) {
      this.tintUnavailableFilters(e.target);
    } else {
      this.tintUnavailableFilters(<input className="null"></input>);
    }
  };

  tintUnavailableFilters = (checkbox) => {
    //On veut desactiver et griser tous les filtres ne donnant aucun resultat

    let calendarApi = this.props.calendarRef.current.getApi();
    let events = calendarApi.getEvents();

    let all_filters = document.querySelectorAll("input[type='checkbox']");
    let all_checked_filters = document.querySelectorAll(
      "input[type='checkbox']:checked"
    );

    if (all_checked_filters.length === 0) {
      all_filters.forEach((filter) => {
        if (filter.parentElement.className === "usable") {
          filter.disabled = false;
        }
      });
    }

    let available_matieres = [];
    let available_categories = [];
    let available_enseignants = [];
    let available_salles = [];
    let available_groupes = [];

    events.forEach((event) => {
      if (event.display !== "none") {
        available_matieres.push(event.extendedProps.matiere);
        event.extendedProps.categorie.forEach((categorie) => {
          available_categories.push(categorie);
        });
        event.extendedProps.enseignant.forEach((teacher) =>{
          available_enseignants.push(teacher);
        });
        event.extendedProps.salle.forEach((room) => {
          available_salles.push(room);
        });
        event.extendedProps.groupes.forEach((groupe) => {
          available_groupes.push(groupe);
        });
      }
    });

    available_matieres = [...new Set(available_matieres)];
    available_categories = [...new Set(available_categories)];
    available_enseignants = [...new Set(available_enseignants)];
    available_salles = [...new Set(available_salles)];
    available_groupes = [...new Set(available_groupes)]; //On obtient ici, par type de filtre, tous les filtres qui sortiront au moins 1 résultat si on clique dessus

    let unchecked_matiere_filters = document.querySelectorAll(
      //On recupere les filtres non selectionnés
      "input[class='filter_matiere']:not(checked)"
    );

    let unchecked_categorie_filters = document.querySelectorAll(
      "input[class='filter_categorie']:not(checked)"
    );

    let unchecked_enseignant_filters = document.querySelectorAll(
      "input[class='filter_enseignant']:not(checked)"
    );
    let unchecked_salle_filters = document.querySelectorAll(
      "input[class='filter_salle']:not(checked)"
    );
    let unchecked_groupe_filters = document.querySelectorAll(
      "input[class='filter_groupe']:not(checked)"
    );

    checkbox.className !== "filter_matiere" &&
      unchecked_matiere_filters.forEach((matiere_filter) => {
        //Si le type de filtre sur lequel on vient de cliquer n'est pas matiere, pour chaque filtre matiere non selectionné

        if (!available_matieres.includes(matiere_filter.id)) {
          // si le filtre matiere n'est pas dans la liste des filtres permettant d'obtenir au moins 1 resultat

          matiere_filter.disabled = true; //On desactive ce filtre
        } else {
          matiere_filter.disabled = false; //Sinon on l'active
        }
      });

    checkbox.className !== "filter_categorie" &&
      unchecked_categorie_filters.forEach((categorie_filter) => {
        if (!available_categories.includes(categorie_filter.id)) {
          categorie_filter.disabled = true;
        } else {
          categorie_filter.disabled = false;
        }
      });

    checkbox.className !== "filter_enseignant" &&
      unchecked_enseignant_filters.forEach((enseignant_filter) => {
        if (!available_enseignants.includes(enseignant_filter.id)) {
          enseignant_filter.disabled = true;
        } else {
          enseignant_filter.disabled = false;
        }
      });

    checkbox.className !== "filter_salle" &&
      unchecked_salle_filters.forEach((salle_filter) => {
        if (!available_salles.includes(salle_filter.id)) {
          salle_filter.disabled = true;
        } else {
          salle_filter.disabled = false;
        }
      });

    checkbox.className !== "filter_groupe" &&
      unchecked_groupe_filters.forEach((groupe_filter) => {
        if (!available_groupes.includes(groupe_filter.id)) {
          groupe_filter.disabled = true;
        } else {
          groupe_filter.disabled = false;
        }
      });

    all_filters.forEach((filter) => {
      // pour tous les filtres, si le filtre est desactivé on grise le label contenant le filtre

      if (filter.disabled) {
        filter.parentElement.style.color = "grey";
      } else {
        filter.parentElement.style.color = "black";
      }
    });

    //On veut afficher les filtres actifs

    let active_filters = document.getElementsByClassName("active-filters")[0];

    while (active_filters.firstChild) {
      active_filters.removeChild(active_filters.firstChild);
    }

    all_checked_filters.forEach((filter) => {
      if (!filter.disabled) {
        let li = document.createElement("li");
        li.innerText = filter.id;
        active_filters.appendChild(li);
      }
    });
  };
}
