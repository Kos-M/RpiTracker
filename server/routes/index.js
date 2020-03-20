

module.exports = function (app) {
    var express = require('express');
    var router = express.Router();
    const path = require('path');
    const dotenv = require('dotenv');
    dotenv.config();
    const web_user = process.env.web_user;
    const web_pass = process.env.web_pass;
    var input_alert = false;
    var i = 0;
    function getResults(cb) {
        let data = {}
        data.active = app.locals.active
        data.clients = app.locals.clientInfo;
        data.StatRefrRate = app.locals.StatRefrRate;
        // console.dir(data)
        cb(data);
    }


    router.get('/', function (req, res, next) {
        if (!req.session.loggedin)
            res.render(path.join(__dirname + '/../' + '/views/login'), { input_alert: false });
        else
            res.redirect('/dashboard');
    })
    router.post('/auth', function (req, res) {
        input_alert = false;
        var username = req.body.username;
        var password = req.body.password;
        if (username && password) {
            if (username == web_user && password == web_pass) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/dashboard');
            } else {
                input_alert = true;
                res.render(path.join(__dirname + '/../' + '/views/login'), { input_alert: input_alert });
            }
            res.end();
        } else {
            input_alert = true;
            res.render(path.join(__dirname + '/../' + '/views/login'), { input_alert: input_alert });
            res.end();
        }
    });

    router.get('/dashboard', function (req, res, next) {
        if (req.session.loggedin) {
            if (req.query.refr) {
                res.json({ active: app.locals.active, clientInfo: app.locals.clientInfo, user: req.session.username });
            } else {
                res.render('dashboard', { active: app.locals.active, clientInfo: app.locals.clientInfo, user: req.session.username });
                res.end();
            }
        }
        else
            res.redirect('/');
    })

    router.get("/results", function (req, res) {
        getResults(function (results) {
            res.json(results);
        });
    });
    router.get('/profile', function (req, res, next) {
        if (req.session.loggedin) {
            res.render('profile', { active: app.locals.active, clientInfo: app.locals.clientInfo });
        }else {
            res.redirect('/');
        }
        
        
    })


    router.get('/dashboard.css', function (req, res, next) {
        res.sendFile(path.join(__dirname + '/../' + '/assets/css/dashboard.css'));
    })
    router.get('/assets/scripts/device.js', function (req, res, next) {
        res.sendFile(path.join(__dirname + '/../' + '/assets/scripts/device.js'));
    })
    router.get('/assets/img/repeat.png', function (req, res, next) {
        res.sendFile(path.join(__dirname + '/../' + '/assets/img/repeat.png'));
    })
    router.get('/assets/img/repeat_sidebar.png', function (req, res, next) {
        res.sendFile(path.join(__dirname + '/../' + '/assets/img/repeat_sidebar.png'));
    })
    router.get('/assets/img/login.png', function (req, res, next) {
        res.sendFile(path.join(__dirname + '/../' + '/assets/img/login.png'));
    })
    router.get('/js/context.js', function (req, res, next) {
        res.sendFile(path.join(__dirname + '/../' + '/js/context.js'));
    })

    router.get('/logout', function (req, res, next) {
        req.session.loggedin = false;
        res.redirect('/');
    })
    router.get('*', function (req, res) {
        res.render('404');
    })

    return router
}

//module.exports = router;