const express = require('express');
const fetch = require("./services/fetch");
var bodyParser = require('body-parser');

// Create Express app
const app = express();

// Allow EJS
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Allow DEBUG query params
app.use(function(req, res, next) {
    if(req.query.debug){
        res.send({
            query_params : req.query,
            body_params: req.body.data,
            headers: req.body.headers
        });
    } else { next(); }
});

//
// API Routes
//
app.get('/api/fetch/', async (req, res) => {
    try{
        res.send( await fetch.get(req.query.url));
    } catch(e){
        res.status(500);
        res.send(e);
    }
});
app.get('/api/', async (req, res) => {
    try{
        res.send( await fetch.get(req.query.url));
    } catch(e){
        res.status(500);
        res.send(e);
    }
});
app.post('/api/', async (req, res) => {
    try{
        var content = await fetch.post(req.query.url, req.body.data, req.body.headers);
        if(content.headers["set-cookie"]){
            console.log("cookie", content.headers["set-cookie"]);
        }
        //res.header("set-cookie","test");
        //res.cookie()
        res.send( content.data );
    } catch(e){
        res.status(500);
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