const Router = require('express')
const router = new Router()
const AuthController = require('../controllers/admin/adminAuthController')
const PanelController = require('../controllers/admin/adminPanelController')
const {check} = require('express-validator')
const roleMiddleware = require('../middlewaree/roleMiddleware')
const authAdminMiddleware = require('../middlewaree/authAdminMiddleware')
const express = require("express");

const urlencodedParser = express.urlencoded({extended: false});

router.get('/login',
    authAdminMiddleware,
    AuthController.show_login)

router.get('/panel/:id',
    [
    roleMiddleware(['admin'])
    ],
    PanelController.show_panel)

router.get('/addStudent',
    roleMiddleware(['admin']),
    PanelController.show_addForm)

router.get('/logout',
    roleMiddleware(['admin']),
    AuthController.admin_logout)

router.post('/login', [
    authAdminMiddleware,
    urlencodedParser,
    check('login', 'Логин не может быть пустым!').notEmpty(),
    check('password', 'Пароль не может быть пустым!').notEmpty(),
], AuthController.admin_login)

router.post('/addStudent', [
    urlencodedParser,
    roleMiddleware(['admin']),
    check('name', 'Укажите имя ученика!').notEmpty(),
    check('email', 'Введите email ученика!').notEmpty(),
    check('email', 'Неверный формат email').isEmail(),
    check('personal_phone', 'Введите телефон ученика!').notEmpty(),
    check('personal_phone', 'Телефон ученика введён неккоректно!').isMobilePhone('ru-RU'),
    check('parent_phone', 'Введите телефон родителя ученика!').notEmpty(),
    check('parent_phone', 'Телефон родителя ученика введён неккоректно!').isMobilePhone('ru-RU'),
    check('password', 'Пароль ученика не может быть пустым!').notEmpty(),
    check('course', 'Заполните класс ученика!').notEmpty(),
], PanelController.add_student)

module.exports = router