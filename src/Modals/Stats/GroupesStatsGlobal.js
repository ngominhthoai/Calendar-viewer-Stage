import { Duration } from "luxon";

export default function GroupesStatsGlobal(props) {
  let volume_horaire_global = [];
  let VH_J_groupes = props.VH_J_groupes;

  props.groupes.forEach((groupe) => {
    if (VH_J_groupes.get(groupe) !== undefined) {
      let total = 0;

      VH_J_groupes.get(groupe).forEach((date_duree) => {
        total += date_duree["duree"];
      });

      total = new Duration.fromMillis(total);
      total = total.toFormat("hh:mm").toString().split(":");
      let horaire = total[0] + "h" + total[1];
      volume_horaire_global.push(horaire);
    } else {
      volume_horaire_global.push(" ");
    }
  });

  let compttd = 0;

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Volume horaire global</th>
          {props.groupes.map((groupe) => (
            <th key={groupe}>{groupe}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          {volume_horaire_global.map((hor) => (
            <td key={hor + ++compttd}>{hor}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
