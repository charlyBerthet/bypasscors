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
            try{
                for(var k in content.headers["set-cookie"]){
                    var val = content.headers["set-cookie"][k];
                    var firstVal = val.match(/^([a-zA-z]+)=(["a-zA-Z0-9%_\.]*);/);
                    var maxAge = val.match(/Max\-Age=(["a-zA-Z0-9%_\.]*);/);
                    res.cookie(firstVal[1]||"",firstVal[2] || "", { maxAge: maxAge[1]||900000, httpOnly: true })
                }
            }catch(e){
                console.log(e);
            }
        }
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