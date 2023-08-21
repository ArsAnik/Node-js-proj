class DateCalculation {
    millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
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

    calc_week(){
        let now = new Date();
        let differenceInMilliseconds = now - this.startDate;
        return Math.ceil(differenceInMilliseconds / this.millisecondsPerWeek);
    }

    calc_week_range_for_db(weekNumber) {
        let weekRange = this.calc_week_range(weekNumber);
        return [
            weekRange[0].toISOString().slice(0, 19).replace('T', ' '),
            weekRange[1].toISOString().slice(0, 19).replace('T', ' '),
        ];
    }

    calc_week_range(weekNumber) {
        const startOfWeek = new Date(this.startDate.getTime() + (weekNumber - 1) * this.millisecondsPerWeek);
        const endOfWeek = new Date(startOfWeek.getTime() + this.millisecondsPerWeek);
        return [startOfWeek, endOfWeek];
    }
}

module.exports = new DateCalculation()