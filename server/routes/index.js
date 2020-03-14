var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/', function (req, res, next) {
    if (!req.session.loggedin)
        res.render(path.join(__dirname +'/../'+ '/views/login'));
    else
        res.redirect('/dashboard');
})
router.get('/dashboard', function (req, res, next) {
    if (req.session.loggedin){
        res.render('dashboard', { active: res.active  , clientInfo: res.clientInfo});
        
    }       
    else 
        res.redirect('/');
})
router.get('/dashboard.css', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/../' + '/css/dashboard.css'));
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
router.get('*', function(req, res){
    res.render('404' );
})


module.exports = router;