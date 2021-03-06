const express = require('express');
const router = express.Router();

const api = require('../apis/api');
const CookieTimeout = require('../keys').cookie.timeOut;
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'views/profilePictures')
    },
    filename: function (req, file, cb) {
        try {
            let removalPath = `${__dirname.toString().slice(0, -7)}views/profilePictures/${req.cookies.MyCookie.photo}`;
            require('fs').unlinkSync(removalPath);
            // console.log('mypath>>>', removalPath);
        } catch (err) {
            // console.log('errr>>>>', err);
        }
        let indx = file.mimetype.search('/');
        cb(null, `${Math.random().toString().substr(2)}${Date.now()}.${file.mimetype.substr(indx + 1)}`);
    }
})
const upload = multer({ storage: storage })


//Home Page
router
    .all(`/`, (req, res) => {
        if (req.cookies.MyCookie) {
            //check if user have an active session
            // console.log(i++, req.cookies.MyCookie);
            res.redirect('login');//transfer to login
        } else {
            //No Active user
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
        console.log(req.cookies.MyCookie.username, ' is signing out');
        //clear cookie
        req.logOut();
        res.clearCookie('MyCookie');
        //redirect to home page
        res.redirect('/');
    });

router
    .route('/update')
    .post(
        upload.any(),
        async (req, res) => {
            // console.log('uploaded image is at', req.files || 'No Image Found');
            try {
                let userdata = req.body;
                //merge firstname and lastpage into name
                userdata.name = {
                    firstname: userdata.firstname,
                    lastname: userdata.lastname
                }
                if (req.files) {
                    userdata.photo = req.files[0].filename;
                }
                // To verify password; Raise error if invalid
                let outputdata = await api.getdata({ name: userdata.email, password: userdata.password3 });
                //if not new password then assign old password to password
                if (!userdata.password)
                    userdata.password = userdata.password3;
                else
                    console.log('New Password', userdata.password);
                // update user data; Raise error if invalid
                let Validation1 = await api.updateData(userdata);
                // console.log('3>', Validation1)
                // Assign name as username to capture user data
                Validation1.name = Validation1.username;
                let outputdata2 = await api.getdata(Validation1);
                personaldata = outputdata2;
                // Assign name to Customer 
                // Creating cookie and expiry data
                res.cookie("MyCookie", personaldata, { maxAge: CookieTimeout });
                console.log(req.cookies.MyCookie.username, ':Update Sucessfull\n', outputdata2);
                // Redirect to login
                res.redirect('/');
                personaldata = {}
            } catch (err) {
                console.log('Error found on updation');
                console.log(err);
                res.clearCookie('MyCookie');
                res.send('<script>alert("Password is not correct\\n Please Login Again");location.href="/";</script>');
            }
        })
    .get((req, res) => {
        console.log('Get call on Update by ', req.cookies.MyCookie.username);
        res.redirect('signup');
    });


router
    .route(`/registration`)
    .post(
        upload.any(),
        async (req, res) => {
            // console.log('uploaded image is at', req.files || 'No Image Found');
            try {
                // Get Data
                let userdata = req.body;
                userdata.name = {
                    firstname: userdata.firstname,
                    lastname: userdata.lastname
                }
                if (req.files) {
                    userdata.photo = req.files[0].filename;
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
                res.send('<script> alert("Username or Email already exists\\nPlease Re-Enter data");location.href="user/registration";</script>');
            }
        })
    .get((req, res) => {
        res.redirect('signup');
    });


router
    .route('/login')

    .post(
        upload.none(),
        async (req, res) => {
            try {
                // Capture Data
                let outputdata = await api.getdata(req.body);
                // Creating Cookies
                res.cookie("MyCookie", outputdata, { maxAge: CookieTimeout });
                // Assign username
                console.log('Post Call for /login');
                // res.render('final.htm', { data: personaldata })
                res.redirect('/')
            } catch (err) {
                //console.log(err);
                res.send('<script> alert("Username/Email or Password mismatch\\nPlease try again..!!");location.href="/";</script>');

            }
        })
    .get(async (req, res) => {
        if (req.cookies.MyCookie) {
            console.log('Get Call for /login by ', req.cookies.MyCookie.username);
            // console.log(i++, req.mongocookies.MyCookie);
            res.render('final.htm', { data: req.cookies.MyCookie });
        } else {
            console.log('Get Call for /login');
            // console.log('Session Expired');
            res.send('<script> alert("Session Expired");location.href="/";</script>');
        }
    });

module.exports = router;