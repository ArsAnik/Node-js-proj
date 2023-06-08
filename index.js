const express = require('express')
const mysql = require('mysql2')
const authRouter = require('./routes/authRouter')
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use('/auth', authRouter)

const start = () => {
    try {
       app.listen(PORT, ( => console.log(`Сервер запущен на порте ${PORT}`))
    }
    catch (e) {
        console.log(e)
    }
}

start()