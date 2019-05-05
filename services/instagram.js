var Client = require('instagram-private-api').V1;
var device = new Client.Device('testdelamortOK');
var storage = new Client.CookieFileStorage(__dirname + '/someuser.json');

var express = require('express')
var router = express.Router()


router.post('/auth', function (req, res) {
    Client.Session.create(device, storage, req.body.username, req.body.password)
    .then(function(session) {
        session.getAccount()
            .then((account) => {
                res.send({"authenticated":false, "account":account});
            });
    }, err => {
        console.log(err);
        res.status(500);
        res.send({"authenticated":false});
    });
});

router.post('/followers', function (req, res) {
    Client.Session.create(device, storage, req.body.username, req.body.password)
    .then(function(session) {
        session.getAccount()
        .then((account) => {
            var feed = new Client.Feed.AccountFollowers(session, account.id);
            if(req.body.cursor){
                feed.setCursor(req.body.cursor);
            }
            feed.get().then(followers => {
                res.send({data:followers.map(f => f._params), next_cursor:feed.getCursor()});
            });
        });
    });
});

router.post('/following', function (req, res) {
    Client.Session.create(device, storage, req.body.username, req.body.password)
        .then(function(session) {
            session.getAccount()
                .then((account) => {
                    var feed = new Client.Feed.AccountFollowing(session, account.id);
                    if(req.body.cursor){
                        feed.setCursor(req.body.cursor);
                    }
                    feed.get().then(followers => {
                        res.send({data:followers.map(f => f._params), next_cursor:feed.getCursor()});
                    });
                });
        });
});

router.post('/unfollow/:id', function (req, res) {
    Client.Session.create(device, storage, req.body.username, req.body.password)
        .then(function(session) {
            Client.Relationship.destroy(session, req.params.id).then(data => {
                res.send({"unfollowed":true});
            }, err => {
                res.status(500);
                res.send(err);
            });
        });
});

exports.router = router;