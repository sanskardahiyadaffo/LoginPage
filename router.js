const express = require('express');
const router = express.Router();
const fs = require('fs');
const api = require('./api');

router.get(`/`, (req, res) => {
    res.render('index.htm');
    //    res.end(`Home Page`);
});

router.get('/signup', (req, res) => {
    res.render('register.htm');
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
            // console.log(userdata);
            let outputdata = await api.getdata({ name: userdata.username, password: userdata.password3 });///verify password
            let Validation1 = await api.updateData(userdata);//update user data
            Validation1.name = Validation1.username;
            let outputdata2 = await api.getdata(Validation1);
            personaldata = outputdata;
            res.render('final.htm', { data: personaldata })
            personaldata = {}

        }
        catch (err) {
            console.log('Error found on updation');
            console.log(err);
            res.send('<script>alert("Password is not correct\\n Please Login Again");location.href="/";</script>');
        }

    })
    .get((req, res) => {
        res.redirect('signup');
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
            res.redirect('/')
        } catch (err) {
            console.log('Data Validation Failed at database')
            res.send('<script> alert("Username or Email \
already exists\\nPlease Re-Enter data");location.href="registration";</script>');

        }
    })
    .get((req, res) => {
        res.redirect('signup');
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
            res.send('<script> alert("Username/Email or Password mismatch\\nPlease try again..!!");location.href="/";</script>');

        }
    })
    .get(async (req, res) => {
        res.redirect('/');
    });

router.get('*', (req, res) => {
    res.send('<script>alert("Invalid url\\n");location.href="/";</script>');
});

module.exports = router;