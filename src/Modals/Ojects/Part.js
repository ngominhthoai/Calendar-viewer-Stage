export class Part {
    constructor (id, nrSessions, labels, allowedSlots, maxHeadcount, sessionLength, sessionRooms, sessionTeachers) {
        this.id = id;
        this.nrSessions = parseInt(nrSessions);
        this.labels= labels.split(",");
        this.allowedSlots = allowedSlots;
        this.maxHeadcount = parseInt(maxHeadcount);
        this.sessionLength = parseInt(sessionLength);
        this.sessionRooms = sessionRooms;
        this.sessionTeachers = parseInt(sessionTeachers);
        this.classes = {};
        this.allowedRooms = {};
        this.allowedTeachers = {};
    }

    addClass (_class) {
        this.classes[_class.getId()] = _class;
    }
    
    addRoom (room) {
        this.allowedRooms[room.getId()] = room;
    }

    addTeacher (teacher) {
        this.allowedTeachers[teacher.getId()] = teacher;
    }

    getId() {
        return this.id;
    }

    getNrSessions() {
        return this.nrSessions;
    }

    getLabels() {
        return this.labels;
    }

    getAllowedSlots() {
        return this.allowedSlots;
    }

    getMaxHeadCount() {
        return this.maxHeadcount;
    }

    getSessionLength() {
        return this.sessionLength;
    }

    getSessionRooms() {
        return this.sessionRooms;
    }

    getSessionTeachers() {
        return this.sessionTeachers;
    }

    getAllowedRooms() {
        return this.allowedRooms;
    }

    getAllowedTeachers() {
        return this.allowedTeachers;
    }
}