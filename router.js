const express = require('express');
const router = express.Router();
const fs = require('fs');
const api = require('./api');
let ObjectId = require('mongoose').Types.ObjectId;
router.get(`/`, (req, res) => {
    res.render('index.htm');
    //    res.end(`Home Page`);
});

router.get('/signup', (req, res) => {
    res.redirect('register.htm');
});

router
    .route('/update')
    .post(async (req, res) => {
        try {
            let userdata = req.body;
            userdata.name = {
                firstname: userdata.firstname,
                lastname: userdata.lastname
            }

            delete userdata.firstname;
            delete userdata.lastname;
            userdata._id = new ObjectId(userdata._id);
            // console.log(userdata);
            let Validation1 = await api.updateData(userdata);
            let outputdata = await api.getdata(userdata);
            personaldata = outputdata;
            res.render('final.htm', { data: personaldata })
            personaldata = {}

        }
        catch (err) { console.log(err); res.redirect('/') }

    })
    .get((req, res) => {
        res.redirect('/');
    });


router
    .route(`/registration`)
    .post(async (req, res) => {
        try {
            let userdata = req.body;
            userdata.name = {
                firstname: userdata.firstname,
                lastname: userdata.lastname
            }

            delete userdata.firstname;
            delete userdata.lastname;
            let Validation1 = await api.getValidation(userdata.email, 'email')
            // console.log(Validation);
            let Validation2 = await api.getValidation(userdata.username, 'username')
            // console.log(Validation);
            let output = await api.adduser(userdata);
            // console.log(output);
            res.redirect('index.htm')
        } catch (err) {
            console.log('Data Validation Failed at database')
            fs.readFile('webpage/register.htm', (err, data) => {
                if (err) {
                    console.log('/registration: File not Found');
                    res.redirect('index.htm');
                } else {
                    console.log('Creating alert on webpage');
                    res.send(data.toString() + '<script> alert("Username or Email \
already exists\\nPlease Re-Enter data");signup.click();</script>');
                }
            });

        }
    })
    .get((req, res) => {
        res.redirect('index.htm');
    });


router
    .route('/login')
    .post(async (req, res) => {
        try {
            let outputdata = await api.getdata(req.body);
            personaldata = outputdata;
            res.render('final.htm', { data: personaldata })
            personaldata = {}
        } catch (err) {
            //console.log(err);
            fs.readFile('webpage/index.htm', (err, data) => {
                if (err) {
                    console.log('/data error: File not Found');
                    res.redirect('index.htm');
                } else {
                    //console.log('/data error: Creating alert on webpage');
                    res.send(data.toString() + '<script> alert("Username/Email or Password mismatch\\nPlease try again..!!");</script>');
                }
            });
        }
    })
    .get(async (req, res) => {
        res.redirect('/index.htm');
    });
module.exports = router;