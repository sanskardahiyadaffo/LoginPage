const express = require('express');
const router = express.Router();
const api = require('./api');
let toogel = true;
const CookieTimeout = 10000;
let customUserName = '';
router.get(`/`, (req, res) => {
    if (req.cookies.MyCookie) {
        // console.log(i++, req.cookies.MyCookie);
        res.redirect('/login');

    } else {
        if (toogel) {
            // console.log('Session Expired');
            res.render('index.htm');
        }
        else {
            toogel = true;
            res.send('<script>alert("Session Expired");location.href="/";</script>');
        }
    }
});

router.get('/signup', (req, res) => {
    console.log('Signup is Called');
    res.clearCookie('MyCookie');
    res.render('register.htm');
});

router.get('/signout', (req, res) => {
    console.log(customUserName, ' is signing out');
    toogel = true;
    res.clearCookie('MyCookie');
    res.redirect('/');
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
            console.log(customUserName, ':Update Sucessfull\n', outputdata);
            res.cookie("MyCookie", personaldata, { maxAge: CookieTimeout });
            res.render('final.htm', { data: personaldata })
            personaldata = {}

        }
        catch (err) {
            console.log('Error found on updation');
            // console.log(err);
            res.send('<script>alert("Password is not correct\\n Please Login Again");location.href="/";</script>');
        }

    })
    .get((req, res) => {
        console.log('get call on Update by ', customUserName);
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
            console.log("Registration Done ", output);
            res.redirect('/');
        } catch (err) {
            console.log('Data Validation Failed at database')
            res.send('<script> alert("Username or Email already exists\\nPlease Re-Enter data");location.href="registration";</script>');

        }
    })
    .get((req, res) => {
        res.redirect('signup');
    });


router
    .route('/login')
    .post(async (req, res) => {
        try {
            console.log('Post Call for login by ',customUserName);
            let outputdata = await api.getdata(req.body);
            personaldata = outputdata;
            res.cookie("MyCookie", personaldata, { maxAge: CookieTimeout });
            res.render('final.htm', { data: personaldata })
            personaldata = {};
            toogel = false;
        } catch (err) {
            //console.log(err);
            res.send('<script> alert("Username/Email or Password mismatch\\nPlease try again..!!");location.href="/";</script>');

        }
    })
    .get(async (req, res) => {
        console.log('Get Call for login by ',customUserName);
        if (req.cookies.MyCookie) {
            // console.log(i++, req.mongocookies.MyCookie);
            res.render('final.htm', { data: req.cookies.MyCookie });

        } else {
            if (toogel) {
                // console.log('Session Expired');
                res.redirect('/');
            }
            else {
                toogel = true;
                res.send('<script>alert("Session Expired");location.href="/";</script>');
            }
        }
    });

router.get('*', (req, res) => {
    res.send('<script>alert("Invalid url\\n");location.href="/login";</script>');
});

module.exports = router;