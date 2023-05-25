import React from "react";
import { DateTime } from "luxon";
import { AllowedSlots } from "./Ojects/AllowedSlots";
import { Class } from "./Ojects/Class";
import { Course } from "./Ojects/Course";
import { Group } from "./Ojects/Group";
import { Part } from "./Ojects/Part";
import { Room } from "./Ojects/Room";
import { Session } from "./Ojects/Session";
import { StartingSlot } from "./Ojects/StartingSlot";
import { Teacher } from "./Ojects/Teacher";



export default class ImportXMLModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filename: "Aucun fichier téléchargé" };
  }

  render() {
    return (
      <div id="importXml" className="importXmlModal">
        <div className="importXmlModal-content">
          <span className="close" onClick={this.onClickCloseBtn}>
            &times;
          </span>
          <h1>Importez votre fichier</h1>
          <div className="inputMessage">
            <p>
              Le fichier doit être conforme à la DTD{" "}
              <a
                href="https://ua-usp.github.io/timetabling/schema"
                target="_blank"
                rel="noopener noreferrer"
              >
                disponible ici
              </a>
            </p>
            <p>
              Vous pouvez spécifier un horizon de temps en ajoutant tout en haut
              de votre fichier un commentaire du type :{" "}
            </p>
            <div className="TimeHorizonExample">
              <p>&lt; !--</p>

              <p>&lt;calendar&gt;</p>
              <p>&lt;startingYear&gt;2021&lt;/startingYear&gt;</p>
              <p>&lt;weeks&gt;1-8,10-13&lt;/weeks&gt;</p>
              <p>&lt;weekDays&gt;1-5&lt;/weekDays&gt;</p>
              <p>&lt;/calendar&gt;</p>
              <p>--&gt;</p>
            </div>
          </div>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
          <div className="chooseFile">
            <input
              type="file"
              id="XMLFile"
              name="XMLFile"
              accept="text/xml"
              onChange={this.onChangeInputXML}
            ></input>
            <label htmlFor="XMLFile" className="inputXML">
              Choisir un fichier XML
            </label>
            <p id="fileName">{this.state.filename}</p>

            <button id="import-xml-btn" className="option-button" onClick={this.importXML}>
              Afficher le calendrier
            </button>
          </div>
        </div>
      </div>
    );
  }

  onClickCloseBtn = () => {
    let modal = document.getElementById("importXml");
    modal.style.display = "none";
  };

  onChangeInputXML = (e) => {
    this.setState({ filename: e.target.files[0].name });
  };

  importXML = () => {
    // let btn = document.getElementById("import-xml-btn");
    let XMLFile = document.getElementById("XMLFile").files[0];
    var reader = new FileReader();
    const loader = document.querySelector(".loader");
    // btn.textContent = "Loading...";
    // btn.disabled = true;
    loader.classList.remove("loader-hidden");

    
    reader.addEventListener("load", () => {
      try {
        this.XMLFetch(reader.result);
      } catch (error) {
        alert(error);
      } finally {
        loader.classList.add("loader-hidden");
      }
    });
    
    reader.readAsText(XMLFile);
    // btn.textContent = "Afficher le calendrier";
    // btn.disabled = false;
  
    this.onClickCloseBtn(); // close the modal after finishing loading
  };



  XMLFetch(xmlText) {
    const xml = new window.DOMParser().parseFromString(xmlText, "text/xml");
    let timeHorizon = this.getTimeHorizon(xml);
    let datedepart = timeHorizon.datedepart; // date d'aujourd'hui si aucune date spécifiée en commentaire du fichier xml
    let toutes_les_salles = {};
    let salles_non_utilisables = {};
    let salles_utilisables = {}
    let listofevents = [];
    let tous_les_enseignants = {};
    let enseignants_non_utilisables = {};
    let enseignants_utilisables = {};
    let event_id = 0;

    let rooms = xml.querySelector("rooms"); // On regarde dans la premiere section : rooms, listant toutes les salles

    //on souhaite recuperer toutes les salles listées dans le fichier
    toutes_les_salles["Sans salle"] = (new Room("Sans salle", 0, "Sans salle"));
    rooms.querySelectorAll("room").forEach((room) => {
      let roomId = room["attributes"]["id"].value;
      let roomCapacity = room["attributes"]["capacity"].value;
      let roomLabels = room["attributes"]["label"].value;

      toutes_les_salles[roomId] = new Room(roomId, roomCapacity, roomLabels);
    });

    //------------------------------------------------------------------------------------------------------------------------

    //On fait la meme chose pour les enseignants
    let teachers = xml.querySelector("teachers");
    tous_les_enseignants["Sans enseignant"] = new Teacher("Sans enseignant", "Sans enseignant");

    teachers.querySelectorAll("teacher").forEach((teacher) => {
      let teacherId = teacher["attributes"]["id"].value;
      let teacherLabels = teacher["attributes"]["label"].value;
      tous_les_enseignants[teacherId] = new Teacher(teacherId, teacherLabels);
    });

    //------------------------------------------------------------------------------------------------------------------------

    //On fait la meme chose pour les cours
    let courses = xml.querySelector("courses");
    let tous_les_cours = {};
    let tous_les_part_cours = {}; // On stocke pour chaque part, quel cours il appartient
    let tous_les_parts = {}; // On stocke tous les parts
    let tous_les_classes_part = {}; // On stocke pour chaque classe, quel part il appartient
    let toutes_les_classes = {}; // On stocke toutes les classes

    courses.querySelectorAll("course").forEach((course) => {
      let courseId = course["attributes"]["id"].value;
      let courseLabels = course["attributes"]["label"].value;

      let objCourse = new Course(courseId, courseLabels);
      course.querySelectorAll("part").forEach((part) => {
        let partId = part["attributes"]["id"].value;
        tous_les_part_cours[partId] = courseId;
        // On recuprere toutes les class 
        let classes = part.querySelector("classes");
        let capacite_accueil = classes["attributes"]["maxHeadCount"].value; //On recupere la capacité d'accueil du cours
        let categorie = part["attributes"]["label"].value; // On recupere la categorie
        let nb_sessions = part["attributes"]["nrSessions"].value; //On recupere le nombre de sessions de ce cours

        let allowedSlots = part.querySelector("allowedSlots"); //On recupere la balise allowedSlots du cours
        let duree_session = allowedSlots["attributes"]["sessionLength"].value;
        let horraires_dispos =
          allowedSlots.querySelector("dailySlots").textContent;
        let jours_dispos = allowedSlots.querySelector("days").textContent;
        let semaines_dispos = allowedSlots.querySelector("weeks").textContent;
        let objAllowedSlots = new AllowedSlots(horraires_dispos, jours_dispos, semaines_dispos);

        let allowedRooms = part.querySelector("allowedRooms"); //On recupere la balise allowedRooms du cours
        let sessionRooms = null;
        if (allowedRooms != null)
          sessionRooms = allowedRooms["attributes"]["sessionRooms"].value;


        let allowedTeachers = part.querySelector("allowedTeachers"); //On recupere la balise allowedTeachers du cours
        let sessionTeachers = null
        if (allowedTeachers != null)
          sessionTeachers = allowedTeachers["attributes"]["sessionTeachers"].value;

        let objPart = new Part(partId, nb_sessions, categorie, objAllowedSlots, capacite_accueil, duree_session, sessionRooms, sessionTeachers);

        classes.querySelectorAll("class").forEach((_class) => {
          let classId = _class["attributes"]["id"].value;
          let objClass = new Class(classId);
          toutes_les_classes[classId] = objClass;
          tous_les_classes_part[classId] = partId;
          objPart.addClass(toutes_les_classes[classId]);
        });

        // On recupere toutes les salles disponibles pour le cours
        if (allowedRooms != null)
          allowedRooms.querySelectorAll("room").forEach((room) => {
            let roomId = room["attributes"]["refId"].value;
            salles_utilisables[roomId] = toutes_les_salles[roomId];
            objPart.addRoom(toutes_les_salles[roomId]);
          });
        else {
          let roomId = "Sans salle";
          salles_utilisables[roomId] = toutes_les_salles[roomId];
          objPart.addRoom(toutes_les_salles[roomId]);
        }

        // On recupere tous les enseignants disponibles pour le cours
        if (allowedTeachers != null)
          allowedTeachers.querySelectorAll("teacher").forEach((teacher) => {
            let teacherId = teacher["attributes"]["refId"].value;
            enseignants_utilisables[teacherId] = tous_les_enseignants[teacherId];
            objPart.addTeacher(tous_les_enseignants[teacherId]);
          });
        else {
          let teacherId = "Sans enseignant";
          enseignants_utilisables[teacherId] = tous_les_enseignants[teacherId];
          objPart.addTeacher(tous_les_enseignants[teacherId]);
        }

        tous_les_parts[partId] = objPart;
        objCourse.addPart(tous_les_parts[partId]);
      });
      tous_les_cours[courseId] = objCourse;
    });
    //------------------------------------------------------------------------------------------------------------------------

    //On fait la meme chose pour les groups et class dans solution
    let solution = xml.querySelector("solution");
    let toutes_les_groupes = {};
    let toutes_les_classes_groupes = {}; // // On stocke pour chaque classe, quelle groupe il appartient

    let solution_groups = solution.querySelector("groups");
    solution_groups.querySelectorAll("group").forEach((group) => {
      let groupId = group["attributes"]["id"].value;
      let groupHeadCount = group["attributes"]["headCount"].value;

      let objGroup = new Group(groupId, groupHeadCount);
      let solution_classes = group.querySelector("classes");
      solution_classes.querySelectorAll("class").forEach((_class) => {
        let classId = _class["attributes"]["refId"].value;
        objGroup.addClass(toutes_les_classes[classId]);
        if (toutes_les_classes_groupes[classId] == null)
          toutes_les_classes_groupes[classId] = {};
        toutes_les_classes_groupes[classId][groupId] = groupId;
      });
      toutes_les_groupes[groupId] = objGroup;
    });

    //On souhaite creer des objets evenements compatibles à fullcalendar pour chaque session
    xml.querySelectorAll("session").forEach((session) => {
      // On commence à iterer sur les sessions de la partie solution
      let session_class = session["attributes"]["class"].value; //On recupere l'attribut class de la session
      let objClass = toutes_les_classes[session_class]; //On recupere l'objet Class de l'id session_class dans la table de toutes les class

      let slotinfos = session.querySelector("startingSlot"); // on recupere la balise startingSlot de la session qui contient les informations concernant la date du cours
      let heure_session = slotinfos["attributes"]["dailySlot"].value; // On recupere l'horaire
      let jour = slotinfos["attributes"]["day"].value; //On recupere le jour
      let semaine = slotinfos["attributes"]["week"].value; // on recupere la semaine
      let objStartingSlot = new StartingSlot(heure_session, jour, semaine); // On construit un objet StartingSlot

      let rank = session["attributes"]["rank"].value; // On recupere le rank de la session
      let objSession = new Session(rank, objClass, objStartingSlot);

      let session_salles = session.querySelector("rooms"); // On recupere les salle
      if (session_salles != null)
        session_salles.querySelectorAll("room").forEach((salle) => {
          let salleId = salle["attributes"]["refId"].value;
          objSession.addRoom(toutes_les_salles[salleId]);
        });
      else {
        let salleId = "Sans salle"
        objSession.addRoom(toutes_les_salles[salleId]);
      }

      let session_enseignants = session.querySelector("teachers"); //On recupere les enseignants
      if (session_enseignants != null)
        session_enseignants.querySelectorAll("teacher").forEach((enseignant) => {
          let enseignantId = enseignant["attributes"]["refId"].value;
          objSession.addTeacher(tous_les_enseignants[enseignantId]);
        });
      else {
        let enseignantId = "Sans enseignant"
        objSession.addTeacher(tous_les_enseignants[enseignantId]);
      }

      //On cherche maintenant dans la partie courses (en dehors de la partie solution)
      let partId = tous_les_classes_part[session_class]; // On recupere l'id du part qui contient la class courant
      let coursId = tous_les_part_cours[partId]; // On recupere l'id du cours qui contient le part courant
      let objCourse = tous_les_cours[coursId]; //On recupere l'objet Course
      let objPart = objCourse.parts[partId]; //On recupere l'objet Part
      //On cherche maintenant dans la partie classes de la solution

      let groupes_participants = toutes_les_classes_groupes[session_class];
      if (groupes_participants == null)
        groupes_participants = [];
      else 
        groupes_participants = Object.keys(toutes_les_classes_groupes[session_class])

      //on ajoute les evenements
      let eventDate;
      if (
        timeHorizon.jours_disponibles.length !== 0 &&
        timeHorizon.semaines_disponibles.length !== 0
      ) {
        eventDate = this.getEventDate(
          timeHorizon,
          semaine,
          jour,
          heure_session
        );
      } else {
        //Si pas d'horizon de temps defini, on affiche les evenements depuis la date du jour
        eventDate = timeHorizon.datedepart.minus({ weeks: 1, day: 1 }).plus({
          weeks: semaine,
          day: jour,
          minute: heure_session,
        });
      }

    
      listofevents.push({
        id: String(event_id++),
        resourceId: Object.keys(objSession.getRooms()),
        title: objCourse.getId(),
        start: eventDate.toString(),
        end: eventDate.plus({ minute: objPart.getSessionLength() }).toString(),
        textColor: "black",
        display: "auto",
        extendedProps: {
          categorie: objPart.getLabels(),
          salle: Object.keys(objSession.getRooms()),
          matiere: objCourse.getId(),
          groupes: groupes_participants,
          enseignant: Object.keys(objSession.getTeachers()),
          capacite_accueil: objPart.getMaxHeadCount(),
          nb_sessions: objPart.getNrSessions(),
          duree_session: objPart.getSessionLength(),
          horraires_dispos: objPart.getAllowedSlots().getDailySlots(),
          salles_dispos: Object.keys(objPart.getAllowedRooms()),
          enseignants_dispos: Object.keys(objPart.getAllowedTeachers()),
        },
      });
    });

    //------------------------------------------------------------------------------------------------------------------------
    //On souhaite recuperer les salles non utilisables
    for (var salle in toutes_les_salles) {
      if (salles_utilisables[salle] == null) {
        salles_non_utilisables[salle.id] = toutes_les_salles[salle];
      }
    }

    //------------------------------------------------------------------------------------------------------------------------
    //On souhaite recuperer les enseignants non utilisables
    for( var enseignant in tous_les_enseignants) {
      if (enseignants_utilisables[enseignant] == null) {
        enseignants_non_utilisables[enseignant.id] = tous_les_enseignants[enseignant];
      }
    }

    //------------------------------------------------------------------------------------------------------------------------
    let salles = [...new Set(Object.values(salles_utilisables))].sort();
    let enseignants = [...new Set(Object.values(enseignants_utilisables))].sort();

    this.props.CalendarCallback(
      salles,
      Object.keys(salles_non_utilisables),
      Object.keys(salles_utilisables),
      enseignants,
      Object.keys(enseignants_non_utilisables),
      Object.keys(enseignants_utilisables),
      listofevents,
      datedepart.toString(),
      timeHorizon
    );

  }

  getTimeHorizon =  (xml) => {
    let annee;
    let semaines_disponibles = [];
    let jours_disponibles = [];

    //On souhaite d'abbord recuperer les semaines disponibles

    var firstnode = xml.childNodes[0]; //On recupere le premier noeud
    if (firstnode.nodeType === 8) {
      //Si le premier noeud est bien un commentaire
      const xmlfirstnode = new window.DOMParser().parseFromString(
        //On recupere le contenu du commentaire et on le traite comme un nouveau fichier xml
        firstnode.data,
        "text/xml"
      );
      let calendar = xmlfirstnode.querySelector("calendar");
      annee = calendar.querySelector("startingYear").textContent;
      calendar
        .querySelector("weeks")
        .textContent.split(",")
        .forEach((plage) => {
          // pour chaque plage de semaines
          let semaines = plage.split("-");
          let sdepart = parseInt(semaines[0]);
          let sfin = parseInt(semaines[1]); //On recupere la semaine de depart et la semaine de fin et on les convertit en entier
          for (let i = sdepart; i <= sfin; i++) {
            //On ajoute chaque semaine de la plage dans le tabeleau
            semaines_disponibles.push(i);
          }
        });
      //On fait la meme chose pour les jours
      calendar
        .querySelector("weekDays")
        .textContent.split(",")
        .forEach((plage) => {
          let jours = plage.split("-");
          let jdepart = parseInt(jours[0]);
          let jfin = parseInt(jours[1]);
          for (let i = jdepart; i <= jfin; i++) {
            jours_disponibles.push(i);
          }
        });
      return {
        datedepart: new DateTime.fromObject({
          weekYear: annee,
          weekNumber: semaines_disponibles[0],
        }),
        semaines_disponibles: semaines_disponibles,
        jours_disponibles: jours_disponibles,
      };
    }

    alert(
      "Aucun horizon de temps n'a été trouvé dans le fichier, les evenements s'afficheront à partir de la date du jour"
    );
    let jsd = new Date();
    jsd.setHours(0, 0, 0, 0);
    var d = new DateTime.fromJSDate(jsd);
    return {
      datedepart: d,
      semaines_disponibles: [],
      jours_disponibles: [],
    };
  };

  getEventDate = (timeHorizon, eventWeek, eventDay, eventMinute) => {
    let eventDate = timeHorizon.datedepart.set({
      weekNumber: timeHorizon.semaines_disponibles[eventWeek - 1],
      weekday: timeHorizon.jours_disponibles[eventDay - 1],
      minute: eventMinute,
    });
    return eventDate;
  };
}


