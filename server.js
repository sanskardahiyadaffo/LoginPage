const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const ejs = require('ejs');
const passport = require('passport');
const credentials = require('./keys');

//For post request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//using cookies
app.use(cookieParser());
app.use(cookieSession({
    maxAge: credentials.cookie.timeOut,
    keys: [credentials.cookie.keys],
}));
app.use('/myfiles', express.static("webpage"));
app.use('/Game1', express.static("Saints_And_Cannibels"));

app.engine('htm', ejs.renderFile);
app.engine('html', ejs.renderFile);

app.set('view engine', 'htm');
app.set('view engine', 'html');

app.set('views', __dirname + '/webpage');


//Routings
const router = require('./router');
app.use('/', router);

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
    });

//Listening to server
const port = process.env.PORT || 8081;
const hostname = '0.0.0.0';
// const hostname = '192.168.100.152';
const server = app.listen(port, hostname, () => {
    console.log(`Server is Running`);
    // console.log(server.address())
});
