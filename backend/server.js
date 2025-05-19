require("dotenv").config();
const express = require("express");
const morgan  = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose")
//bring routes
const blogRoutes = require('./routes/blog')
const authRoutes = require('./routes/auth')
//app
const app = express();
//db

mongoose.connect(process.env.DATABASE_CLOUD ).then(()=>console.log('DB Connected'))

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
if(process.env.NODE_ENV === 'development'){
app.use(cors({origin :`${process.env.CLIENT_URL}`}))
}
//routes middleware
app.use('/api' ,blogRoutes)
app.use('/api',authRoutes)

const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})
//  npm i express-validator jsonwebtoken  express-jwt formidable lodash slugify string-strip-html
