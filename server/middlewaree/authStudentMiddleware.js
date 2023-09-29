const calc_days = require('../utils/dateCalculation')
const jwt = require('jsonwebtoken')
const { JWTKEY } = require('./../config')

module.exports = function (req, res, next){
    if(req.method === "OPTIONS"){
        next()
    }

    try {
        if(req.headers.cookie === undefined){
            next();
        }
        else{
            return res.redirect('/student/panel/currentWeek');
        }
    }catch (e) {
        console.log(e);
        return res.redirect('/error/Ошибка при авторизации');
    }
}