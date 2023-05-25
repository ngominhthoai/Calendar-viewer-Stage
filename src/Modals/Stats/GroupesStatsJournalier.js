export default function GroupesStatsJournalier(props) {
  let compttr = 0;
  let compttd = 0;
  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Volume horaire journalier</th>
          {props.groupes.map((groupe) => (
            <th key={groupe}>{groupe}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.horaires_par_jours.map((arr) => (
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
