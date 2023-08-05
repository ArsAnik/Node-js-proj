const express = require('express')
const expressHandlebars = require('express-handlebars');
const handlebars = expressHandlebars.create({
    defaultLayout: 'main',
    extname: 'hbs'
});
const adminRouter = require('./routes/adminRouter');
const studentRouter = require('./routes/studentRouter');
const commonRouter = require('./routes/commonRouter');
const PORT = process.env.PORT || 5000
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const staticPath = path.resolve(__dirname, "static");

const app = express();

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(express.json());
app.use(cors());
app.use(express.static(staticPath));
app.use('/admin', adminRouter);
app.use('/student', studentRouter);
app.use('/', commonRouter);
app.use(cookieParser());

const start = async () => {
    try {
        app.listen(PORT, ( () => console.log(`Сервер запущен на порте ${PORT}`)));
    }
    catch (e) {
        console.log(e)
    }
}

start().then()