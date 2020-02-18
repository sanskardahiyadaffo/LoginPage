const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
//For post request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
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
mongoose.connect('mongodb://127.0.0.1:27017/nodeJS', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

//Listening to server
const port = process.env.PORT || 8081;
const hostname = '0.0.0.0';
// const hostname = '192.168.100.152';
app.listen(port,() => {
    console.log(`Server is Running`);
});
