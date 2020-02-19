const passport = require('passport');
const passportGoogle = require('passport-google-oauth20');

passport.use(
    new passportGoogle(
        clientID
    ),
    () => { }
);