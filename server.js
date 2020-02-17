const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//For post request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use('/myfiles', express.static("webpage"));

app.engine('htm', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.set('view engine', 'htm');
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
const port = 8081;
const hostname = '127.0.0.1';
// const hostname = '192.168.100.152';
app.listen(port, hostname, () => {
    console.log(`Server at http://${hostname}:${port}`);
});
