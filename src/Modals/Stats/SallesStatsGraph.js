import "chartjs-adapter-luxon";
import { Bar } from "react-chartjs-2";
import { Duration } from "luxon";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function SallesStatsGraph(props) {
  let calendarApi = props.calendarRef.current.getApi();
  let events = calendarApi.getEvents();

  //On veut creer un tableau assiocatif (salle => volume horaire)
  let volume_horaire_salles = new Map();
  props.salles_utilisables.forEach((salle) => {
    volume_horaire_salles.set(salle, 0);
  });

  events.forEach((event) => {
    //Pour chaque evenement, on calcule sa duree et on l'affecte dans le tableau assiociatif à la salle correspondante
    let duree = event.end.getTime() - event.start.getTime(); //Duree en miliseconds
    event.extendedProps.salle.forEach((room) => {
      volume_horaire_salles.set(
        room,
        volume_horaire_salles.get(room) + duree
      );
    });
  });

  volume_horaire_salles = Array.from(volume_horaire_salles, ([key, value]) => ({
    key,
    value,
  })); //On convertit le map en tableau

  return (
    <div id="salles_graph">
      <Bar
        id="salles_chart"
        data={{
          labels: volume_horaire_salles.map((obj) => obj.key),
          datasets: [
            {
              label: "volume horaire global",
              data: volume_horaire_salles.map((obj) => obj.value),
              backgroundColor: props.listOfBgColors,
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (val) {
                  let duration = new Duration.fromMillis(val);
                  let formatted_duration = duration.toFormat("hh").toString();
                  return formatted_duration + "h";
                },
              },
            },
          },
          plugins: {
            tooltip: {
              enabled: true,
              callbacks: {
                label: function (tooltip) {
                  let duration = new Duration.fromMillis(tooltip.parsed.y);
                  let formatted_duration = duration
                    .toFormat("hh:mm")
                    .toString()
                    .split(":");
                  return (
                    formatted_duration[0] +
                    " heures et " +
                    formatted_duration[1] +
                    " minutes"
                  );
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
