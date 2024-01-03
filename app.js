const express = require('express')
const path = require('path')
const expressSession = require('express-session')
const dotenv = require('dotenv')
const fileUpload = require('express-fileupload')
const {engine} = require('express-handlebars')
const conn = require(path.join(__dirname, 'conn.js'))



// default setting and variables 
conn()
const app = express()
dotenv.config()
const PORT = process.env.PORT || 8000
const API_URL = process.env.API_URL || `http://127.0.0.1:${PORT}`
const SESSION_SECRET = process.env.SESSION_SECRET || 'deneme';
const time = 1000 * 60 * 30;


app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views' ))
app.use(express.json())
app.use(fileUpload())
app.use(expressSession({
   secret:SESSION_SECRET,
   resave:false,
   saveUninitialized:true, 
   cookie:{path:'/', httpOnly:true, secure:false, maxAge:time}
}))
app.use(express.static(path.join(__dirname, 'public')))


app.use((req, res, next)=>{
   const {userID} = req.session
   if(userID){
      res.locals.userLink = true
   }
   else{
      res.locals.userLink = false
   }
   next()
})


// Router include area
const mainPage = require(path.join(__dirname, 'router', 'mainPage.js'))
const aboutPage = require(path.join(__dirname, 'router', 'aboutPage.js'))
const registerPage = require(path.join(__dirname, 'router', 'registerPage.js'))
const loginPage = require(path.join(__dirname, 'router', 'loginPage.js'))
const adminPage = require(path.join(__dirname, 'router', 'adminPage.js'))
const singlePage = require(path.join(__dirname, 'router', 'singlePage.js'))



// Router usage area
app.use('/', mainPage)
app.use('/about', aboutPage)
app.use('/register', registerPage)
app.use('/login', loginPage)
app.use('/admin', adminPage)
app.use('/single', singlePage)
app.use((req, res)=>{
   res.render('site/error')
})


app.listen(PORT, ()=>{
   console.log(`Server is running, ${API_URL}`)
})