const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
const PORT = process.env.PORT || 4000

const session = require('express-session')
const cookieParser = require('cookie-parser')

const cors = require('cors')
const fileUpload = require('express-fileupload')

const api = require('./routes/api.js')

// connect mongodb
const connectDB = require('./db/connect_db')
connectDB()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(session({
	secret: 'secret',
	cookie: { maxAge: 60000 },
	resave: false,
	saveUninitialized: false
}))
// app.use(flash())
app.use(cookieParser())

// for file upload
app.use(fileUpload({ useTempFiles: true }))

// Router load
app.use('/api', api)

app.listen(PORT, (req, res) => {
	console.log(`App server is running on server : http://localhost:${PORT}`)
})