const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const ejs = require('ejs');
const passport = require('passport');
const credentials = require('./keys');
const api = require('./api');
//For post request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Using passport
app.use(passport.initialize());
app.use(passport.session());


//using cookies
app.use(cookieParser());
app.use(cookieSession({
    maxAge: credentials.cookie.timeOut,
    keys: [credentials.cookie.keys],
}));
// Static files
app.use('/myfiles', express.static("webpage"));
app.use('/Game1', express.static("Saints_And_Cannibels"));
// Setting ejs for htm and html pages
app.engine('htm', ejs.renderFile);
app.engine('html', ejs.renderFile);
app.set('view engine', 'htm');
app.set('view engine', 'html');
app.set('views', __dirname + '/webpage');

//Routings
const auth = require('./passport').auth
app.use('/auth', auth);
const router = require('./router');
app.use('/', router);

//Listening to server
const port = process.env.PORT || 8081;
const hostname = '0.0.0.0';
// const hostname = '192.168.100.152';
const server = app.listen(port, hostname, () => {
    console.log(`Server is Running at port ${server.address().port}`);
});

//Database Connection
const mongoose = require('mongoose');
mongoose.connect(credentials.mongoose.url,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    //CB
    err => {
        if (err)
            console.log('Error in database connection');
        else
            console.log('MongoDB Connected')

    });
