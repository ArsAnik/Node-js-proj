const db = require('../../utils/db')
const calc_days = require("../../utils/dateCalculation");
const {validationResult} = require("express-validator");
const check = require("../../utils/checkFunctions");
const help = require("../../utils/helpFunctions");
const bcrypt = require("bcryptjs");
class AdminLessonController {

    async show_add_lesson_form(req, res){
        try{
            const id = req.params.studentId;
            const master_id = 1;
            const sql_queries = `SELECT * FROM student WHERE id = ?;
                    SELECT * FROM tutor WHERE FK_master_tutor = ?`;
            db.query(sql_queries, [id, master_id], function(err, results) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                return res.render("admin/add_lesson", {
                    title: results[0][0].name
                });
            })
        }
        catch (e)
        {
            return res.redirect('/error/Ошибка загрузки!');
        }
    }

    async add_lesson(req, res) {
        try {
            let date = new Date('2023-04-15T20:00:00.000Z');
            let date_db = calc_days.get_date_for_db(date);
            let sql_query = `INSERT INTO lesson (id, link, description, price, duration, is_paid, date, is_regular, is_done, is_canceled, FK_subject, FK_tutor, FK_student) VALUES (NULL, 'https://www.google.ru/', NULL, '1000', '60', '0', '`+date_db+`', '1', '0', '0', '3', '4', '20');`;
            for (let i = 0; i < 6; i++) {
                sql_query += `INSERT INTO lesson (id, link, description, price, duration, is_paid, date, is_regular, is_done, is_canceled, FK_subject, FK_tutor, FK_student) VALUES (NULL, 'https://www.google.ru/', NULL, '1000', '60', '0', '`+date_db+`', '1', '0', '0', '3', '4', '20');`;
                date.setDate(date.getDate() + 7);
                date_db = calc_days.get_date_for_db(date);
            }
            db.query(sql_query, function(err, result) {
                if (err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                else{
                    res.redirect('/admin/panel');
                }
            });
        } catch (e) {
            return res.redirect('/error/Ошибка добавления!');
        }
    }
}

module.exports = new AdminLessonController()