const express = require('express');
const router = express.Router();
const api = require('./api');
const CookieTimeout = 1000 * 20;
let customUserName = '';

//Home Page
router
    .all(`/`, (req, res) => {
        if (req.cookies.MyCookie) {
            //check if user have an active session
            // console.log(i++, req.cookies.MyCookie);
            res.redirect('/login');//transfer to login

        } else {
            //No Active user
            customUserName = ''
            res.render('index.htm');//show homepage
        }
    });

router
    .get('/signup', (req, res) => {
        //signup page
        console.log('Signup is Called');
        //clear coookie if exists..!!
        res.clearCookie('MyCookie');
        res.render('register.htm');//registration page
    });

router
    .get('/signout', (req, res) => {
        //signout page
        console.log(customUserName, ' is signing out');
        //set username to empty
        customUserName = '';
        //clear cookie
        res.clearCookie('MyCookie');
        //redirect to home page
        res.redirect('/');
    });

router
    .route('/update')
    .post(async (req, res) => {
        try {
            let userdata = req.body;
            //merge firstname and lastpage into name
            userdata.name = {
                firstname: userdata.firstname,
                lastname: userdata.lastname
            }
            // console.log(userdata);
            // To verify password; Raise error if invalid
            let outputdata = await api.getdata({ name: userdata.username, password: userdata.password3 });
            //if not new password then assign old password to password
            userdata.password = userdata.password || userdata.password3;
            // update user data; Raise error if invalid
            let Validation1 = await api.updateData(userdata);
            // Assign name as username to capture user data
            Validation1.name = Validation1.username;
            let outputdata2 = await api.getdata(Validation1);
            personaldata = outputdata2;
            // Assign name to Customer 
            customUserName = outputdata2.username;
            console.log(customUserName, ':Update Sucessfull\n', outputdata2);
            // Creating cookie and expiry data
            res.cookie("MyCookie", personaldata, { maxAge: CookieTimeout });
            // Redirect to login
            res.redirect('/');
            personaldata = {}
        } catch (err) {
            console.log('Error found on updation');
            // console.log(err);
            res.clearCookie('MyCookie');
            res.send('<script>alert("Password is not correct\\n Please Login Again");location.href="/";</script>');
        }
    })
    .get((req, res) => {
        console.log('Get call on Update by ', customUserName);
        res.redirect('signup');
    });


router
    .route(`/registration`)
    .post(async (req, res) => {
        try {
            // Get Data
            let userdata = req.body;
            userdata.name = {
                firstname: userdata.firstname,
                lastname: userdata.lastname
            }
            //Validate EMAIL; Raise error if invalid
            let Validation1 = await api.getValidation(userdata.email, 'email');
            // console.log(Validation);

            //Validate USERNAME; Raise error if invalid
            let Validation2 = await api.getValidation(userdata.username, 'username');
            // console.log(Validation);

            // Insert data into database
            let output = await api.adduser(userdata);
            console.log("Registration Done ", output);
            // Creating Cookie
            res.cookie("MyCookie", output, { maxAge: CookieTimeout });
            res.redirect('/');
        } catch (err) {
            console.log('Data Validation Failed at database');
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
            // Capture Data
            let outputdata = await api.getdata(req.body);
            personaldata = outputdata;
            // Creating Cookies
            res.cookie("MyCookie", personaldata, { maxAge: CookieTimeout });
            // Assign username
            customUserName = personaldata.username;
            res.redirect('/login')
            // res.render('final.htm', { data: personaldata })
            console.log('Post Call for login by ', customUserName);
            personaldata = {};
        } catch (err) {
            //console.log(err);
            res.send('<script> alert("Username/Email or Password mismatch\\nPlease try again..!!");location.href="/";</script>');

        }
    })
    .get(async (req, res) => {
        console.log('Get Call for login by ', customUserName);
        if (req.cookies.MyCookie) {
            // console.log(i++, req.mongocookies.MyCookie);
            res.render('final.htm', { data: req.cookies.MyCookie });
        } else {
            // console.log('Session Expired');
            res.send('<script> alert("Session Expired");location.href="/";</script>');
        }
    });

router
    // Special webpage to display all data
    .get('/allData', async (req, res) => {
        try {
            let output = await api.getdata();
            res.send('Error here..!!');
        } catch (err) {
            res.render('alldata.htm', { data: err });
            console.log(data);
        }
    });

router
    .all('*', (req, res) => {
        // All Extra pages
        res.send('<script>alert("Invalid url\\n");location.href="/";</script>');
    });

module.exports = router;