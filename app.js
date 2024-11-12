const express = require("express");
const logger = require("morgan");

const pizzasArr = require("./data/pizzas");

const app = express();

const PORT = 3000;

// Setup the request logger to run on each request
app.use(logger("dev"));

// Make the static files inside of the `public/` folder publicly accessible
app.use(express.static("public"));

// JSON middleware to parse incoming HTTP requests that contain JSON
app.use(express.json());



// GET /
app.get("/", (req, res, next) => {
    res.sendFile(__dirname + "/views/home.html");
})


// GET /contact
app.get("/contact", (req, res, next) => {
    res.sendFile(__dirname + "/views/contact.html");
});


// GET /pizzas
app.get("/pizzas", (req, res, next) => {
    res.json(pizzasArr);
});


// GET /pizzas/:pizzaId
app.get("/pizzas/:pizzaId", (req, res, next) => {

    const { pizzaId } = req.params;

    const pizzaDetails = pizzasArr.find((pizzaObj) => {
        return pizzaObj.id == pizzaId;
    });

    res.json(pizzaDetails);
});




app.listen(PORT, () => { console.log(`Server listening on port ${PORT}...`) });


