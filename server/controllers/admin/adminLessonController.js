const db = require('../../utils/db')
const calc_days = require("../../utils/dateCalculation");
class AdminLessonController {

    async show_add_lesson_form(req, res){
        try{
            const id = req.params.id;
            const sql_queries = `SELECT * FROM student WHERE id = ?;
                    SELECT * FROM tutor WHERE `;
            db.query(sql_queries, [id, id], function(err, results) {
                if(err) {
                    console.log(err);
                    return res.redirect('/error/Ошибка базы данных!');
                }
                results[1].forEach(
                    function (element) {
                        element.day = calc_days.get_day(element.date);
                        element.payLink = element.link;
                    }
                );
                return res.render("admin/student_page", {
                    title: "Ученик: " + results[0][0].name,
                    student: results[0][0],
                    payments: results[1],
                    is_neg_balance: results[0][0].balance < 0
                });
            })
        }
        catch (e)
        {
            return res.redirect('/error/Ошибка загрузки!');
        }
    }
}

module.exports = new AdminLessonController()