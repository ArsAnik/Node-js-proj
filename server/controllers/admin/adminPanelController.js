const db = require('../../utils/db')
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWTKEY} = require("../../config");
class AdminPanelController {

    async show_panel(req, res){
        try {
            const master_id = req.params.id;
            const sql = `SELECT * FROM student WHERE FK_master=?`;
            db.query(sql, master_id, function(err, results) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                return res.render("lk_admin", {
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

    async show_addForm(req, res){
        try {
            const sql_course = `SELECT * FROM course`;
            db.query(sql_course, function(err, results) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                return res.render("add_student", {
                    title: "Добавление ученика",
                    course: results
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
            const sql_course = `SELECT * FROM course`;
            db.query(sql_course, function(err, data_course) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    return res.json({ is_stand: true, error: 'Ошибка добавления! ' + errors.array()[0].msg });
                }
                const {name, email, personal_phone, parent_phone, password, course} = req.body;
                const sql_email = `SELECT * FROM student WHERE email=?`;
                db.query(sql_email, email, function(err, results) {
                    if(err) {
                        console.log(err);
                        return res.json({ is_stand: true, error: `Ошибка базы данных!` });
                    }
                    else if(results.length !== 0) {
                        return res.json({ is_stand: true, error: `Ученик с email ${email} уже существует!` });
                    }
                    else{
                        const {id} = jwt.verify(token, JWTKEY);
                        const sql_insertStudent = `INSERT INTO student (name, email, personal_phone, parent_phone, password, FK_course, FK_master) VALUES (?,?,?,?,?,?,?)`;
                        const hashPassword = bcrypt.hashSync(password, 7);
                        db.query(sql_insertStudent, [name, email, personal_phone, parent_phone, hashPassword, course, id], function(err, results) {
                            if(err) {
                                console.log(err);
                                return res.json({ is_stand: true, error: `Ошибка базы данных!` });
                            }else{
                                return res.json({ is_stand: false, redirect: "/admin/panel/" + id });
                            }
                        })
                    }
                });
            });
        }
        catch (e)
        {
            return res.redirect('/error/Ошибка добавления!');
        }
    }
}

module.exports = new AdminPanelController()