export class Course {
    constructor (id, labels) {
        this.id= id;
        this.labels= labels.split(",");
        this.parts = {};
    }

    addPart (part) {
        this.parts[part.getId()] = part;
    }

    getId() {
        return this.id;
    }

    getLabels() {
        return this.labels;
    }

    getParts() {
        return this.parts;
    }
}