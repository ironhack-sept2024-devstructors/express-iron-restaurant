const express = require("express");

const app = express();


// app.get(path, code);
// app.get(path, function(req, res, next){});


app.get("/", function(req, res, next){    
    console.log("we recieved a GET request for the HOME page...");
    res.send("This is the homepage");
})


app.get("/contact", function(req, res, next){
    console.log("we recieved a GET request for the CONTACT page...");
    res.send("This is contact page");
});


app.listen(3000, function(){ console.log("Server listening on port 3000...")});


