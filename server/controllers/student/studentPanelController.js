const db = require('../../utils/db')
const calc_days = require('../../utils/dateCalculation')
const check_func = require('../../utils/checkFunctions')
class StudentPanelController {

    async show_panel(req, res){
        try {
            const student_id = req.params.id;
            let weekday = req.params.wd;
            const sql_student = `SELECT * FROM student WHERE id=?`;
            db.query(sql_student, student_id, function(err, students) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                else if(students.length === 0){
                    return res.status(403).redirect('/error/Ошибка доступа');
                }
                else
                {
                    if (!check_func.checkInt(weekday) || weekday < 0 || weekday > 20000) {
                        return res.redirect('/student/panel/' + student_id + '/' + calc_days.calc_week());
                    }
                    let weekRange = calc_days.calc_week_range_for_db(weekday);
                    const sql_student_inf = `SELECT * FROM lesson l
                    LEFT JOIN subject s ON l.FK_subject = s.id 
                    LEFT JOIN tutor t ON l.FK_tutor = t.id
                    WHERE FK_student=? AND l.date >= "` + weekRange[0] + `" AND l.date <= "` + weekRange[1]
                    +`" ORDER BY l.date`;
                    db.query(sql_student_inf, students[0].id, function(err, lessons) {
                        if (err) {
                            console.log(err);
                            return res.redirect('/error/Ошибка базы данных!');
                        }
                        lessons.forEach(
                            function (element) {
                                element.is_done = (element.date < calc_days.get_current_day()) && !(element.is_canceled) && !(element.is_date_transfer);
                                element.time = calc_days.get_time(element.date);
                                element.weekday = calc_days.get_weekday(element.date);
                                element.day = calc_days.get_day(element.date);
                                element.feature = element.is_regular ? "нет" : "разовое";
                            }
                        );
                        let prevWeek = parseInt(weekday) - 1;
                        let nextWeek = parseInt(weekday) + 1;
                        return res.render("lk_student", {
                            title: "Личный кабинет ученика",
                            student_inf: students[0],
                            lessons: lessons,
                            linkPrevWeek: '/student/panel/' + students[0].id + '/' + prevWeek,
                            linkNextWeek: '/student/panel/' + students[0].id + '/' + nextWeek,
                        });
                    })
                }
            })
        }
        catch (e)
        {
            return res.redirect('/error/Ошибка загрузки!');
        }
    }
}

module.exports = new StudentPanelController()