const express = require('express');
const fetch = require("./services/fetch");

// Create Express app
const app = express();

// Allow EJS
app.set('view engine', 'ejs');

// Allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Allow DEBUG query params
app.use(function(req, res, next) {
    if(req.query.debug){
        res.send(req.query);
    } else { next(); }
});

//
// API Routes
//
app.get('/api/fetch/', async (req, res) => {
    try{
        res.send( await fetch.get(req.query.url));
    } catch(e){
        res.statusCode(500);
        res.send(e);
    }
});

//
// Doc Routes
//
app.get('/', (req, res) => {
    res.render('pages/index');
});


// Start server
var port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening on port '+ port +'!'))