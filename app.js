const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const Pizza = require("./models/Pizza.model");

const pizzasArr = require("./data/pizzas");

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
        .then( pizzaFromDB => {
            res.status(201).json(pizzaFromDB);
        })
        .catch( error => {
            console.log("Error creating a new pizza in the DB...");
            console.log(error);
            res.status(500).json({ error: "Failed to create a new pizza" });
        })
})




// GET /pizzas
// GET /pizzas?maxPrice=15
app.get("/pizzas", (req, res, next) => {

    const maxPrice = req.query.maxPrice;

    // if maxPrice not provided, return the whole list
    if(maxPrice === undefined){
        res.json(pizzasArr);
        return;
    }

    
    // if maxPrice is provided, return only the pizzas with that maximum price
    const filteredPizzas = pizzasArr.filter( (pizzaObj) => {
        return pizzaObj.price <= parseFloat(maxPrice);
    });
    
    res.json(filteredPizzas);
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


