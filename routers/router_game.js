const router = require('express').Router()
const api = require('../apis/api');


router
    .get('/', async (req, res) => {
        console.log('Get Call for Game 1 by ', customUserName);
        if (req.cookies.MyCookie) {
            // console.log(i++, req.mongocookies.MyCookie);
            res.render('Game1.htm', { data: req.cookies.MyCookie });
        } else {
            // console.log('Session Expired');
            // res.render('Game1.htm', { data: { username: 'Unknown' } });
            res.send('<script> alert("Session Expired");location.href="/";</script>');
        }
    });

router
    .get('/scoreboard', async (req, res) => {
        try {
            let data = await api.getDataOfScoreboard();
            res.send(data);
        } catch (err) {
            res.send(err)
        }
        // res.render('leaderBoard.htm');
    });

// router
//     .get('/addScoretoScoreBoard', async (req, res) => {
//         try {
//             let mydata = {
//                 gamename: 'Saints And Cannibel',
//                 name: 'user5',
//                 score: 100,
//             }
//             let output = await api.addUserToScoreBoard(mydata);
//             res.send(output);
//         } catch (output) {
//             res.send(output);
//         }
//     });

module.exports = router;