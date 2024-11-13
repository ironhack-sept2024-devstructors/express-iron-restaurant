const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const Pizza = require("./models/Pizza.model");

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



// POST /pizzas
app.post("/pizzas", (req, res, next) => {

    const newPizza = req.body;

    Pizza.create(newPizza)
        .then(pizzaFromDB => {
            res.status(201).json(pizzaFromDB);
        })
        .catch(error => {
            console.log("Error creating a new pizza in the DB...");
            console.log(error);
            res.status(500).json({ error: "Failed to create a new pizza" });
        })
})




// GET /pizzas
// GET /pizzas?maxPrice=15
app.get("/pizzas", (req, res, next) => {

    const { maxPrice } = req.query;

    let filter = {};

    if (maxPrice) {
        filter = { price: { $lte: maxPrice } };
    }

    Pizza.find(filter)
        .then(pizzasFromDB => {
            res.json(pizzasFromDB);
        })
        .catch(error => {
            console.log("Error getting pizzas from DB...");
            console.log(error);
            res.status(500).json({ error: "Failed to get list of pizzas" });
        });
});


// GET /pizzas/:pizzaId
app.get("/pizzas/:pizzaId", (req, res, next) => {

    const { pizzaId } = req.params;

    Pizza.findById(pizzaId)
        .then(pizzaFromDB => {
            res.json(pizzaFromDB);
        })
        .catch(error => {
            console.log("Error getting pizza details from DB...");
            console.log(error);
            res.status(500).json({ error: "Failed to get pizza details" });
        });
});


// PATCH /pizzas/:pizzaId
app.patch("/pizzas/:pizzaId", (req, res, next) => {

    const { pizzaId } = req.params;

    const newDetails = req.body;

    Pizza.findByIdAndUpdate(pizzaId, newDetails, { new: true })
        .then(pizzaFromDB => {
            res.json(pizzaFromDB);
        })
        .catch((error) => {
            console.error("Error updating pizza...");
            console.error(error);
            res.status(500).json({ error: "Failed to update a pizza" });
        });
});


// DELETE /pizzas/:pizzaId
app.delete("/pizzas/:pizzaId", (req, res, next) => {

    const { pizzaId } = req.params;

    Pizza.findByIdAndDelete(pizzaId)
        .then(response => {
            res.json(response);
        })
        .catch((error) => {
            console.error("Error deleting pizza...");
            console.error(error);
            res.status(500).json({ error: "Failed to delete a pizza" });
        });
});




app.listen(PORT, () => { console.log(`Server listening on port ${PORT}...`) });


