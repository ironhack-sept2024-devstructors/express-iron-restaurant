const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const Pizza = require("./models/Pizza.model");
const Cook = require("./models/Cook.model");

const app = express();

const PORT = 3000;

// Setup the request logger to run on each request
app.use(logger("dev"));

// Make the static files inside of the `public/` folder publicly accessible
app.use(express.static("public"));

// JSON middleware to parse incoming HTTP requests that contain JSON
app.use(express.json());


// 
// Connect to DB
// 
mongoose.connect("mongodb://127.0.0.1:27017/iron-restaurant")
    .then((response) => {
        console.log(`Connected! Database Name: "${response.connections[0].name}"`);
    })
    .catch((error) => {
        console.log("Error connecting to DB...")
        console.log(error);
    });



// GET /
app.get("/", (req, res, next) => {
    res.sendFile(__dirname + "/views/home.html");
})


// GET /contact
app.get("/contact", (req, res, next) => {
    res.sendFile(__dirname + "/views/contact.html");
});



app.use("/", require("./routes/pizza.routes"));
app.use("/", require("./routes/cook.routes"));



app.listen(PORT, () => { console.log(`Server listening on port ${PORT}...`) });


