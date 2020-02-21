const api = require('../apis/api');
const express = require('express');
const router = express.Router();

//Routings
const auth = require('./router_passport')
router.use('/auth', auth);
const user = require('./router_user')
router.use('/user', user);
const game = require('./router_game')
router.use('/game', game);


//Home Page
router
    .all(`/`, (req, res) => {
        res.redirect('user/');//transfer to login
    });

router
    // Special webpage to display all data
    .get('/allData', async (req, res) => {
        try {
            let output = await api.getdata();
            res.send('Error here..!!');
        } catch (err) {
            res.render('alldata.htm', { data: err });
            console.log(err);
        }
    });

router
    .all('*', (req, res) => {
        // All Extra pages
        res.send('<script>alert("Invalid url\\n");location.href="/";</script>');
    });

module.exports = router;