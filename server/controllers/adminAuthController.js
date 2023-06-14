const db = require('./../utils/db')
class AdminAuthController {
    async admin_login(req, res){
        try {
            const filter = req.body;
            const sql = `SELECT * FROM master WHERE login=? AND password=?`;
            db.query(sql, filter, function(err, results) {
                if(err) {
                    console.log(err);
                    res.status(400).json({message: 'Ошибка входа!'});
                }
                console.log(results);
                /*else if(typeof results !== 'undefined' && results.length > 0) {
                    res.status(320).json({message: `Пользователь с таким email уже зарегстрирован!`});
                } else {

                }*/
            })
        }
        catch (e)
        {
            console.log(e);
            res.status(400).json({message: 'Ошибка входа!'});
        }
    }
}

module.exports = new AdminAuthController()