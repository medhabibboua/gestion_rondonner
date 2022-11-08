const fs=require('fs')
const path=require('path')

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors=require("cors")
require('dotenv').config()

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/user-routes");
const app = express();

app.use(bodyParser.json());

app.use('/uploads/images',express.static(path.join("uploads", "images")))

// app.use((req, res, next) =>{
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');

//   next();
// })

app.use(cors())
app.use("/api/users", usersRoutes);
app.use("/api/places", placesRoutes);


app.use((req, res, next) => {
  res.status(404).json({ message: "page not found" });
});

app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path,(err)=>{
      console.log(err)
    })
  }
  res.status(error.statusCode || 500).json({ message: error.message });
});

mongoose
  .connect(
    "mongodb+srv://laziz:mongodb@cluster0.o5jm2.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
    console.log("database connected successfully");

  })
  .catch((err) => console.log(err));
