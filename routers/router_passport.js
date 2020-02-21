const passport = require('passport');
const passportGoogle = require('passport-google-oauth20');
const credentials = require('../keys');
const api = require('../apis/api')
const CookieTimeout = credentials.cookie.timeOut;

const router = require('express').Router();
router
    .route('/google')
    .get(
        (req, res, next) => {
            console.log('Google Login is clicked');
            next();
        },
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            prompt: 'select_account',
        }));
router.get('/error', () => {
    console.log('Google signin error');
})
router
    .route('/google/CB')
    .get(passport.authenticate('google', { failureRedirect: '/auth/error' }), (req, res) => {
        // console.log('Final Data',req.user);
        if (req.user)
            res.cookie("MyCookie", req.user, { maxAge: CookieTimeout });
        res.redirect('user/login')
    });

passport.serializeUser((user, done) => {
    done(null, {
        name: user.username,
        password: user.password
    });
});

passport.deserializeUser(async (user, done) => {
    try {
        let data = await api.getdata(user);
        done(null, data);
    } catch (e) {

    }
});

passport.use(
    new passportGoogle({
        callbackURL: '/auth/google/CB',
        clientID: credentials.google.id,
        clientSecret: credentials.google.secret,
    },
        async (accessToken, refreshToken, profile, done) => {
            // console.log('Access>', accessToken)
            // console.log('refresh>', refreshToken)
            console.log('profile>', profile)
            // return 0;
            // console.log('callback function of passport-google');
            let user = {
                username: profile.emails[0].value,
                name: {
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                },
                email: profile.emails[0].value,
                password: profile.id,
                phone: -1,
                photo: profile.photos[0].value,
            }
            console.log(user);
            try {
                let output = await api.getValidation(user.email, 'email');
                output = await api.adduser(user);
                console.log(output);
                done(null, output);
            } catch (err) {
                // console.log('error in passport validation', err);
                if (err.name == 'Already Exists')
                    done(null, err.value);
                else
                    done(null, user);
            }
        }
    )
);

module.exports = router;