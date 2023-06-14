const express = require('express')
const adminAuthRouter = require('./routes/adminAuthRouter')
const studentAuthRouter = require('./routes/studentAuthController')
const PORT = process.env.PORT || 5000
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors)
app.use('/adminAuth/', adminAuthRouter)
//app.use('/studentAuth', studentAuthRouter)

const start = () => {
    try {
       app.listen(PORT, ( () => console.log(`Сервер запущен на порте ${PORT}`)));
    }
    catch (e) {
        console.log(e)
    }
}

start()