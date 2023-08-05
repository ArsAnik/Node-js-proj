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
            const token = req.headers.cookie.split('=')[1];
            const {id} = jwt.verify(token, JWTKEY);
            return res.redirect('/admin/panel/' + id);
        }
    }catch (e) {
        console.log(e);
        return res.redirect('/error/Ошибка при авторизации');
    }
}