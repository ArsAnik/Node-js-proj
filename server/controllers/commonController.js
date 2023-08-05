class CommonController {
    async show_errorPage(req, res){
        try {
            return res.status(400).render("error", {
                title: req.params.message
            });
        }
        catch (e)
        {
            return res.status(400).render("error", {
                title: "Неопознанная ошибка!"
            });
        }
    }
}

module.exports = new CommonController()