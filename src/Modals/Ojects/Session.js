export class Session {
    constructor (rank, _class, startingSlot) {
        this.rank = parseInt(rank);
        this._class = _class;
        this.startingSlot = startingSlot;
        this.rooms = {};
        this.teachers = {};
    }

    addRoom (room) {
        this.rooms[room.getId()] = room;
    }

    addTeacher (teacher) {
        this.teachers[teacher.getId()] = teacher;
    }

    getRank() {
        return this.rank;
    }

    getClass() {
        return this._class;
    }

    getStartingSlot() {
        return this.startingSlot;
    }

    getRooms() {
        return this.rooms;
    }

    getTeachers() {
        return this.teachers;
    }
}