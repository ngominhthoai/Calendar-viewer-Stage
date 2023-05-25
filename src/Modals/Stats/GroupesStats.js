import { Duration } from "luxon";
import GroupesStatsJournalier from "./GroupesStatsJournalier";
import GroupesStatsHebdomadaire from "./GroupesStatsHebdomadaire";
import GroupesStatsGlobal from "./GroupesStatsGlobal";
export default function GroupesStats(props) {
  let calendarApi = props.calendarRef.current.getApi();
  let events = calendarApi.getEvents();
  let groupes = [
    ...new Set(
      [].concat(...events.map((event) => event.extendedProps.groupes))
    ),
  ]; //On recupere les differents groupes

  //On veut creer un tableau assiocatif (Volume horaire journalier des groupes) qui pour chaque evenement asoccie (groupe => [{jour,duree},...}]
  let VH_J_groupes = new Map();
  groupes.forEach((groupe) => {
    VH_J_groupes.set(groupe, []);
  });

  let firstday = new Date(props.datedepart).setHours(0, 0, 0, 0).valueOf();
  let lastday = 0;
  events.forEach((event) => {
    let jour = event.start;
    if (jour > lastday) {
      //On recupere le jour du dernier evenement
      lastday = jour.setHours(0, 0, 0, 0);
    }
    event.extendedProps.groupes.forEach((groupe) => {
      VH_J_groupes.set(
        groupe,
        VH_J_groupes.get(groupe).concat([
          {
            date: event.start.setHours(0, 0, 0, 0),
            duree: event.end.getTime() - event.start.getTime(),
          },
        ])
      );
    });
  });

  let horaires_par_jours = []; //Tableau 2D:[[jour1,horaire,horaire...][jour2,horaire,horaire...]] ou chaque tableau represente un jour

  for (let j = firstday; j <= lastday; j += 86400000) {
    let horaires = [];
    //On part de la date du jour du premier evenement jusqu'a la date du jour du dernier evenement avec un pas d'un jour
    let day = new Date(j);

    horaires.push(day.toLocaleDateString());

    groupes.forEach((groupe) => {
      //Pour chaque groupe on souhaite calculer la duree des evenements concernant ce groupe sur le jour courant

      if (VH_J_groupes.get(groupe) !== undefined) {
        let total = 0;

        VH_J_groupes.get(groupe).forEach((date_duree) => {
          if (date_duree["date"] === day.valueOf()) {
            total += date_duree["duree"];
          }
        });

        total = new Duration.fromMillis(total);
        total = total.toFormat("hh:mm").toString().split(":");
        let horaire = total[0] + "h" + total[1];
        horaires.push(horaire);
      } else {
        horaires.push(" ");
      }
    });
    horaires_par_jours.push(horaires);
  }

  return (
    <div id="groupes_stats">
      <h1 className="stats_title">Groupes</h1>
      <GroupesStatsGlobal VH_J_groupes={VH_J_groupes} groupes={groupes} />

      <GroupesStatsHebdomadaire groupes={groupes} VH_J_groupes={VH_J_groupes} />

      <GroupesStatsJournalier
        currentEvents={props.currentEvents}
        calendarRef={props.calendarRef}
        datedepart={props.datedepart}
        groupes={groupes}
        horaires_par_jours={horaires_par_jours}
      />


    </div>
  );
}
