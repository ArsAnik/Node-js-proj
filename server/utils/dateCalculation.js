class DateCalculation {
    millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    millisecondsPerDay = 1000 * 60 * 60 * 24;
    startDate = new Date('1970-01-05');
    weekdays_names = [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота'
    ];

    get_time(date){
        return date.getHours().toString().padStart(2, "0")
            + ':' + date.getMinutes().toString().padStart(2, "0");
    }

    get_time_period(date, duration){
        let time_start = this.get_time(date);
        date.setMinutes(date.getMinutes() + duration);
        return time_start + ' - ' + this.get_time(date);
    }

    get_weekday(date){
        return (this.weekdays_names)[date.getDay()];
    }

    get_day(date){
        return date.getDate().toString().padStart(2, "0") + "."
            + (date.getMonth()+1).toString().padStart(2, "0");
    }

    get_day_with_year(date){
        return date.getDate().toString().padStart(2, "0") + "."
            + (date.getMonth()+1).toString().padStart(2, "0") + "."
            + date.getFullYear().toString().padStart(2, "0");
    }

    get_current_day(){
        return new Date();
    }

    get_week_from_date(date){
        let differenceInMilliseconds = date - this.startDate + this.millisecondsPerDay;
        return Math.ceil(differenceInMilliseconds / this.millisecondsPerWeek);
    }

    get_current_week(){
        return this.get_week_from_date(this.get_current_day());
    }

    get_week_range(weekNumber) {
        const startOfWeek = new Date(this.startDate.getTime() + (weekNumber - 1) * this.millisecondsPerWeek);
        const endOfWeek = new Date(startOfWeek.getTime() + this.millisecondsPerWeek);
        return [startOfWeek, endOfWeek];
    }

    get_week_range_without_monday(weekNumber) {
        const startOfWeek = new Date(this.startDate.getTime() + (weekNumber - 1) * this.millisecondsPerWeek);
        const endOfWeek = new Date(startOfWeek.getTime() + this.millisecondsPerWeek - this.millisecondsPerDay);
        return [startOfWeek, endOfWeek];
    }

    get_week_range_for_db(weekNumber) {
        let weekRange = this.get_week_range(weekNumber);
        return [
            weekRange[0].toISOString().slice(0, 19).replace('T', ' '),
            weekRange[1].toISOString().slice(0, 19).replace('T', ' '),
        ];
    }

    get_date_for_db(date){
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    get_week_range_for_text(weekday){
        return this.get_day_with_year(this.get_week_range_without_monday(weekday)[0])
            + ' - ' + this.get_day_with_year(this.get_week_range_without_monday(weekday)[1]);
    }
}

module.exports = new DateCalculation()