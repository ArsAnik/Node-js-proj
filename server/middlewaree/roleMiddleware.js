const jwt = require('jsonwebtoken')
const { JWTKEY } = require('./../config')

module.exports = function (roles){
    return function (req, res, next){
        if(req.method === "OPTIONS"){
            next()
        }

        try {
            if(req.headers.cookie === undefined){
                return res.redirect('/error/Пользователь не автаризован');
            }
            const token = req.headers.cookie.split('=')[1];
            const {role} = jwt.verify(token, JWTKEY);
            if(!roles.includes(role)){
                return res.status(403).redirect('/error/Ошибка доступа');
            }
            next();
        }catch (e) {
            console.log(e);
            return res.redirect('/error/Ошибка при авторизации');
        }
    }
}