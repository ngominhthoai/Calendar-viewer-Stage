export class Teacher {
    constructor (id, labels) {
        this.id = id;
        this.labels = labels.split(",");
    }

    getId() {
        return this.id;
    }

    getLabels() {
        return this.labels;
    }
}