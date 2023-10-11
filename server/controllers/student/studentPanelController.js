const db = require('../../utils/db')
const calc_days = require('../../utils/dateCalculation')
const check_func = require('../../utils/checkFunctions')
const jwt = require("jsonwebtoken");
const {JWTKEY} = require("../../config");
const {compileETag} = require("express/lib/utils");

class StudentPanelController {

    async show_panel(req, res){
        try {
            // const token = req.headers.cookie.split('=')[1];
            // const {id} = jwt.verify(token, JWTKEY);
            const student_id = 20;
            let week = parseInt(req.params.wd);
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
                    if (!check_func.checkInt(week) || week < 0 || week > 20000) {
                        return res.redirect('/student/panel/' + calc_days.get_current_week());
                    }
                    let weekRange = calc_days.get_week_range_for_db(week);
                    const sql_student_inf = `SELECT * FROM lesson l
                    LEFT JOIN subject s ON l.FK_subject = s.id 
                    LEFT JOIN tutor t ON l.FK_tutor = t.id
                    WHERE FK_student=? AND l.date >= "` + weekRange[0] + `" AND l.date <= "` + weekRange[1]
                    +`" ORDER BY l.date;
                    SELECT * FROM const_lesson l
                    LEFT JOIN subject s ON l.FK_subject = s.id 
                    LEFT JOIN tutor t ON l.FK_tutor = t.id
                    WHERE l.FK_student = ?
                    ORDER BY l.weekday_num ASC;
                    SELECT date FROM lesson
                    WHERE FK_student=?
                    ORDER BY date ASC
                    LIMIT 1;
                    SELECT date FROM lesson
                    WHERE FK_student=?
                    ORDER BY date DESC
                    LIMIT 1`;
                    db.query(sql_student_inf, [student_id, student_id, student_id, student_id], function(err, result) {
                        if (err) {
                            console.log(err);
                            return res.redirect('/error/Ошибка базы данных!');
                        }
                        result[0].forEach(
                            function (element) {
                                element.time = calc_days.get_time_period(element.date, element.duration);
                                element.weekday = calc_days.get_weekday(element.date);
                                element.day = calc_days.get_day(element.date);
                                element.feature = element.is_regular ? "нет" : "разовое";
                            }
                        );
                        let schedule = Array(7).fill().map(() => Array());
                        result[1].forEach(
                            function (element){
                                schedule[element.weekday_num].push(element);
                            }
                        );
                        let prevWeekLink = '', nextWeekLink = '';
                        if(result[2][0] !== undefined){
                            if(!(calc_days.get_week_from_date(result[2][0].date) >= week)){
                                prevWeekLink = '/student/panel/' + (week - 1) + '#lessons';
                            }
                        }
                        if(result[3][0] !== undefined){
                            if(!(calc_days.get_week_from_date(result[3][0].date) <= (week))){
                                nextWeekLink = '/student/panel/' + (week + 1) + '#lessons';
                            }
                        }
                        return res.render("student/lk", {
                            title: "Личный кабинет ученика",
                            student_inf: students[0],
                            lessons: result[0],
                            const_lessons: schedule,
                            linkPrevWeek: prevWeekLink,
                            linkNextWeek: nextWeekLink,
                            is_neg_balance: students[0].balance < 0,
                            week_range: calc_days.get_week_range_for_text(week)
                        });
                    })
                }
            })
        }
        catch (e)
        {
            console.log(e);
            return res.redirect('/error/Ошибка загрузки!');
        }
    }

    async show_payment(req, res){
        try {
            // const token = req.headers.cookie.split('=')[1];
            // const {id} = jwt.verify(token, JWTKEY);
            const student_id = 20;
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
                        return res.render("student/payment", {
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
            console.log(e);
            return res.redirect('/error/Ошибка загрузки!');
        }
    }

    async show_history(req, res){
        try {
            // const token = req.headers.cookie.split('=')[1];
            // const {id} = jwt.verify(token, JWTKEY);
            const student_id = 20;
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
                                    element.dateForJS = element.date;
                                    element.date = calc_days.get_day_with_year(element.date);
                                }
                            );
                            return res.render("student/history", {
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

    async show_profile(req, res){
        try {
            // const token = req.headers.cookie.split('=')[1];
            // const {id} = jwt.verify(token, JWTKEY);
            const student_id = 20;
            const sql_student = `SELECT * FROM student s
                    LEFT JOIN course c ON s.FK_course = c.id
                    WHERE s.id=?`;
            db.query(sql_student, student_id, function(err, student) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                else if(student.length === 0){
                    return res.status(403).redirect('/error/Страница не существует!');
                }
                else
                {
                    return res.render("student/profile", {
                        title: "Профиль",
                        student: student[0]
                    });
                }
            })
        }
        catch (e)
        {
            console.log(e);
            return res.redirect('/error/Ошибка загрузки!');
        }
    }

    async show_editPassword(req, res){
        try {
            return res.render("student/edit_password", {
                title: "Изменение пароля",
                prevPage: "/student/profile"
            });
        }
        catch (e)
        {
            console.log(e);
            return res.redirect('/error/Ошибка загрузки!');
        }
    }

    async show_editEmail(req, res){
        try {
            return res.render("student/edit_email", {
                title: "Изменение почты"
            });
        }
        catch (e)
        {
            console.log(e);
            return res.redirect('/error/Ошибка загрузки!');
        }
    }

    async edit_information(req, res){
        try {
            const nodemailer = require('nodemailer');

            // const transporter = nodemailer.createTransport({
            //     host: "smtp.repcentr1.ru",
            //     port: 465,
            //     secure: true,
            //     auth: {
            //         user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
            //         pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
            //     },
            // });
            //
            // let testEmailAccount = await nodemailer.createTestAccount();
            //
            // console.log(testEmailAccount);
            //
            // let transporter = nodemailer.createTransport({
            //     host: 'smtp.repcentr1.ru',
            //     port: 587,
            //     secure: false,
            //     auth: {
            //         user: testEmailAccount.user,
            //         pass: testEmailAccount.pass,
            //     },
            // });

            // console.log(transporter);

            // let result = await transporter.sendMail({
            //     from: '"Node js" <nodejs@example.com>',
            //     to: 'user@example.com, user@example.com',
            //     subject: 'Message from Node js',
            //     text: 'This message was sent from Node js server.',
            //     html:
            //         'This <i>message</i> was sent from <strong>Node js</strong> server.',
            // });
            //
            // console.log(result);
        }
        catch (e)
        {
            console.log(e);
            return res.redirect('/error/Ошибка загрузки!');
        }
    }
}

module.exports = new StudentPanelController()