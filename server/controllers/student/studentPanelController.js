const db = require('../../utils/db')
const calc_days = require('../../utils/dateCalculation')
const check_func = require('../../utils/checkFunctions')
const jwt = require("jsonwebtoken");
const {JWTKEY} = require("../../config");

class StudentPanelController {

    async show_panel(req, res){
        try {
            const token = req.headers.cookie.split('=')[1];
            const {id} = jwt.verify(token, JWTKEY);
            const student_id = id;
            let weekday = req.params.wd;
            const sql_student = `SELECT * FROM student WHERE id=?`;
            db.query(sql_student, student_id, function(err, students) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                else if(students.length === 0){
                    return res.status(403).redirect('/error/Страница не существует!');
                }
                else
                {
                    if (!check_func.checkInt(weekday) || weekday < 0 || weekday > 20000) {
                        return res.redirect('/student/panel/' + calc_days.calc_week());
                    }
                    let weekRange = calc_days.calc_week_range_for_db(weekday);
                    const sql_student_inf = `SELECT * FROM lesson l
                    LEFT JOIN subject s ON l.FK_subject = s.id 
                    LEFT JOIN tutor t ON l.FK_tutor = t.id
                    WHERE FK_student=? AND l.date >= "` + weekRange[0] + `" AND l.date <= "` + weekRange[1]
                    +`" ORDER BY l.date`;
                    db.query(sql_student_inf, student_id, function(err, lessons) {
                        if (err) {
                            console.log(err);
                            return res.redirect('/error/Ошибка базы данных!');
                        }
                        lessons.forEach(
                            function (element) {
                                element.is_canceled = (element.is_done !== null && !element.is_done);
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
                            linkPrevWeek: '/student/panel/' + prevWeek,
                            linkNextWeek: '/student/panel/' + nextWeek,
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

    async show_payment(req, res){
        try {
            const token = req.headers.cookie.split('=')[1];
            const {id} = jwt.verify(token, JWTKEY);
            const student_id = id;
            const sql_student = `SELECT * FROM student WHERE id=?`;
            db.query(sql_student, student_id, function(err, students) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                else if(students.length === 0){
                    return res.status(403).redirect('/error/Страница не существует!');
                }
                else
                {
                    const sql_payment_inf = `SELECT * FROM lesson l
                    LEFT JOIN subject s ON l.FK_subject = s.id 
                    WHERE FK_student=? 
                    AND NOT l.is_paid=1
                    AND l.is_done=1  
                    ORDER BY l.date`;
                    db.query(sql_payment_inf, student_id, function(err, payments) {
                        if (err) {
                            console.log(err);
                            return res.redirect('/error/Ошибка базы данных!');
                        }
                        payments.forEach(
                            function (element) {
                                element.day = calc_days.get_day(element.date);
                                element.payLink = 'https://www.google.ru/';
                            }
                        );
                        return res.render("lk_student_payment", {
                            title: "Пополнение баланса",
                            student_inf: students[0],
                            payments: payments,
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

    async show_history(req, res){
        try {
            const token = req.headers.cookie.split('=')[1];
            const {id} = jwt.verify(token, JWTKEY);
            const student_id = id;
            const sql_student = `SELECT * FROM student WHERE id=?`;
            db.query(sql_student, student_id, function(err, students) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                else if(students.length === 0){
                    return res.status(403).redirect('/error/Страница не существует!');
                }
                else
                {
                    const sql_lesson_inf = `SELECT * FROM lesson l
                    LEFT JOIN subject s ON l.FK_subject = s.id
                    WHERE l.FK_student=? AND l.is_done=1
                    ORDER BY l.date`;
                    db.query(sql_lesson_inf, student_id, function(err, paid_lessons) {
                        if (err) {
                            console.log(err);
                            return res.redirect('/error/Ошибка базы данных!');
                        }
                        const sql_payment_inf = `SELECT * FROM payment
                        WHERE FK_user_student=?
                        ORDER BY date`;
                        db.query(sql_payment_inf, student_id, function(err, payments) {
                            if (err) {
                                console.log(err);
                                return res.redirect('/error/Ошибка базы данных!');
                            }
                            let all_pay_inf = [].concat(paid_lessons, payments);
                            all_pay_inf.sort((a, b) => a.date < b.date ? 1 : -1);
                            all_pay_inf.forEach(
                                function (element) {
                                    /*
                                    is_done exist only in paid_lessons elements,
                                    we can understand what the payment kind is thanks to is_done
                                     */
                                    element.is_pay = !element.is_done;
                                    element.operation = element.is_done ? "оплата занятия: " + element.title : "пополнение баланса";
                                    element.sum = element.is_done ? "-" + element.price : "+" + element.sum;
                                    element.date = calc_days.get_day(element.date);
                                }
                            );
                            return res.render("lk_student_history", {
                                title: "История оплат",
                                payments: all_pay_inf,
                            });
                        })
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