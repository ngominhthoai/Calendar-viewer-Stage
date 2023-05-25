export class Room {
    constructor (id, capacity, labels) {
        this.id = id;
        this.capacity = parseInt(capacity);
        this.labels = labels.split(",");
    }

    //les getters
    getId() {
        return this.id;
    }

    getCapacity() {
        return this.capacity;
    }

    getLabels() {
        return this.labels;
    }
}