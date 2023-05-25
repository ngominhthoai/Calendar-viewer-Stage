export class AllowedSlots {
    constructor (dailySlots, days, weeks) {
        this.dailySlots = dailySlots;
        this.days = days;
        this.weeks = weeks;
    }

    getDailySlots() {
        return this.dailySlots;
    }

    getDays() {
        return this.days;
    }

    getWeeks() {
        return this.weeks;
    }
}