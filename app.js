const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const flash = require("connect-flash");
const expressEjsLayouts = require("express-ejs-layouts");
const minifyHTML = require('express-minify-html-terser')
const compression  = require('compression')
require("dotenv").config();

// middleware
app.use(express.json({limit:'100mb'}));
app.use(express.urlencoded({ extended: true ,limit:'100mb'}));
app.use(express.static(path.join(__dirname, "public"),{maxAge:'1d'}));
app.use(expressEjsLayouts)
app.use(cookieParser())
app.set("layout", "layout");
app.use(compression({
    level:9,
    threshold: 10*1024
}))
app.use(minifyHTML({
    override:      true,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));
// database connectons
mongoose.connect(process.env.MONGODB_URI)
// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes

app.use("/admin",(req,res,next)=>{
     res.locals.layout='admin/layout';
     next()
})

/**
 * git remote add origin https://github.com/ginisys9/news-blog.git
git branch -M main
git push -u origin main
 */


app.use('/admin',require('./routes/admin'))
app.use('/',require('./routes/frontend'));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server are running  on the port  ${port}`));