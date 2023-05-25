export class Group {
    constructor (id, headCount) {
        this.id = id;
        this.headCount = parseInt(headCount);
        this.classes = {};
    }

    addClass (_class) {
        this.classes[_class.getId()] = _class;
    }
    
    getId() {
        return this.id;
    }
    
    getHeadCount() {
        return this.headCount;
    }

    getClasses() {
        return this.classes;
    }
}