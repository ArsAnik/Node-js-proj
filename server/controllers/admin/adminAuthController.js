const db = require('../../utils/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { JWTKEY } = require('../../config')

const generateAccessToken = (id, role) =>{
    const  payload = {id, role};
    return jwt.sign(payload, JWTKEY, {expiresIn: "24h"});
}
class AdminAuthController {

    async show_login(req, res){
        try {
            return res.render("admin_enter", {
                title: 'Вход в панель администратора'
            });
        }
        catch (e)
        {
            return res.redirect('/error/Ошибка загрузки!');
        }
    }
    async admin_login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({ is_stand: true, error: 'Ошибка входа! ' + errors.array()[0].msg });
            }
            const {login, password} = req.body;
            const sql_login = `SELECT * FROM master WHERE login=?`;
            db.query(sql_login, login, function (err, results) {
                if (err) {
                    console.log(err);
                    return res.json({ is_stand: true, error: 'Ошибка базы данных!' });
                } else if (results.length === 0) {
                    return res.json({ is_stand: true, error: `Логин ${login} не существует!` });
                }
                const isValidPassword = bcrypt.compareSync(password, results[0].password);
                if (!isValidPassword) {
                    return res.json({ is_stand: true, error: `Пароль неверен!` });
                }
                const token = generateAccessToken(results[0].id, "admin");
                res.cookie('token', token);
                return res.json({ is_stand: false, redirect: '/admin/panel/' + results[0].id });
            })
        } catch (e) {
            return res.status(400).json({ is_stand: false, redirect: '/error/Ошибка загрузки!' });
        }
    }

    async admin_logout(req, res) {
        try {
            res.clearCookie('token');
            return res.redirect('/admin/login/');
        } catch (e) {
            return res.redirect('/error/Ошибка загрузки!');
        }
    }
}

module.exports = new AdminAuthController()