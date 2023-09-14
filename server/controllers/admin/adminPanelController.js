const db = require('../../utils/db')
const check = require("../../utils/checkFunctions")
const help = require("../../utils/helpFunctions")
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWTKEY} = require("../../config");
class AdminPanelController {

    async show_panel(req, res){
        try {
            // const {id} = jwt.verify(token, JWTKEY);
            const id = 1;
            const sql = `SELECT * FROM student WHERE FK_master=?`;
            db.query(sql, id, function(err, results) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                results.forEach(function (element){
                    element.is_debt = element.balance < 0;
                });
                return res.render("admin/lk", {
                    title: "Панель администратора",
                    students: results
                });
            })
        }
        catch (e)
        {
            return res.redirect('/error/Ошибка загрузки!');
        }
    }

    async show_add_student_form(req, res){
        try {
            const sql_queries = `SELECT * FROM course; SELECT * FROM messenger; SELECT * FROM aim`;
            db.query(sql_queries, function(err, results) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                return res.render("admin/add_student", {
                    title: "Добавление ученика",
                    course: results[0],
                    messenger: results[1],
                    aim: results[2]
                });
            });
        }
        catch (e)
        {
            return res.redirect('/error/Ошибка загрузки!');
        }
    }

    async add_student(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.json({ is_error: true, error: 'Ошибка добавления! ' + errors.array()[0].msg });
            }
            const {second_name, first_name, father_name, course, messenger, email, personal_phone, aim} = req.body;
            // format phone number
            const phone = personal_phone.replace(/\D/g, '');
            // check phone number
            if(!check.checkPhoneNumber(phone)){
                return res.json({ is_error: true, error: 'Ошибка добавления! Номер телефона не корректен!' });
            }
            const name = second_name + " " + first_name + " " + father_name;
            const sql_queries = `SELECT * FROM student WHERE name=?; SELECT * FROM student WHERE email=?`;
            db.query(sql_queries, [name, email], function(err, results) {
                if(err) {
                    console.log(err);
                    return res.json({ is_error: true, error: `Ошибка базы данных!` });
                }
                else if(results[0].length !== 0) {
                    return res.json({ is_error: true, error: `Ученик с таким именем уже существует! Для уникальности можно добавить отчество.` });
                }
                else if(results[1].length !== 0) {
                    return res.json({ is_error: true, error: `Ученик с email: ${email} уже существует!` });
                }
                else{
                    // const {id} = jwt.verify(token, JWTKEY);
                    const sql_insertStudent = `INSERT INTO student (name, email, balance, phone, password, FK_course, FK_messenger, FK_aim, FK_master) VALUES (?,?,?,?,?,?,?,?,?)`;
                    const password = help.generatePassword(8);
                    const hashPassword = bcrypt.hashSync(password, 7);
                    db.query(sql_insertStudent, [name, email, 0, phone, hashPassword, course, messenger, aim, 1], function(err, results) {
                        if(err) {
                            console.log(err);
                            return res.json({ is_error: true, error: `Ошибка базы данных!` });
                        }else{
                            return res.json({ is_error: false, redirect: "/admin/panel" });
                        }
                    })
                }
            });
        }
        catch (e)
        {
            return res.redirect('/error/Ошибка добавления!');
        }
    }
}

module.exports = new AdminPanelController()