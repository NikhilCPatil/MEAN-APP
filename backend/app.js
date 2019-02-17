const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");


const app = express();

const db = 'mean-course';

mongoose.connect("mongodb+srv://nikhilcpatil:"+ process.env.MONGO_PASS +"@mean-jum5p.mongodb.net/" + db)
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection Failed');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join(__dirname,"images")));
app.use("/", express.static(path.join(__dirname,"angular")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
    next()
});


app.use("/v1/api/posts", postRoutes);
app.use("/v1/api/user", userRoutes);
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname , 'angular','index.html'));
});
module.exports = app;
