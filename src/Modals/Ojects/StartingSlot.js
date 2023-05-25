export class StartingSlot {
    constructor (dailySlot, day, week) {
        this.dailySlot = dailySlot;
        this.day = day;
        this.week = week;
    }

    getDailySlot() {
        return this.dailySlot;
    }
    
    getDay() {
        return this.day;
    }

    getWeek() {
        return this.week;
    }
}