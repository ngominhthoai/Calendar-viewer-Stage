import { DateTime } from "luxon";
import { Duration } from "luxon";

export default function GroupesStatsHebdomadaire(props) {
  //On veut creer un tableau assiocatif (Volume horaire hebdomadaire des groupes) qui pour chaque evenement asoccie (groupe => [{semaine,duree},...])
  let VH_S_groupes = new Map();
  let semaines = [];

  props.groupes.forEach((groupe) => {
    VH_S_groupes.set(groupe, []);
  });

  props.groupes.forEach((groupe) => {
    props.VH_J_groupes.get(groupe).forEach((date_duree) => {
      semaines.push(new DateTime.fromMillis(date_duree["date"]).weekNumber);
      VH_S_groupes.set(
        groupe,
        VH_S_groupes.get(groupe).concat([
          {
            semaine: new DateTime.fromMillis(date_duree["date"]).weekNumber,
            duree: date_duree["duree"],
          },
        ])
      );
    });
  });

  semaines = [...new Set(semaines)];

  let horaires_par_semaines = [];

  semaines.forEach((semaine) => {
    let horaires = [];
    horaires.push("semaine " + semaine);
    props.groupes.forEach((groupe) => {
      if (VH_S_groupes.get(groupe) !== undefined) {
        let total = 0;

        VH_S_groupes.get(groupe).forEach((date_duree) => {
          if (date_duree["semaine"] === semaine) {
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
    horaires_par_semaines.push(horaires);
  });

  let compttd = 0;
  let compttr = 0;

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Volume horaire hebdomadaire (hors semaines de congés)</th>
          {props.groupes.map((groupe) => (
            <th key={groupe}>{groupe}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {horaires_par_semaines.map((arr) => (
          <tr key={"line" + ++compttr}>
            {arr.map((hor) => (
              <td key={"cell" + ++compttd}>{hor}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
