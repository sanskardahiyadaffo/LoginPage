const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//For post request
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static("webpage"));
app.engine('htm', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname+'/webpage');

//Routings
const router = require('./router');
app.use('/', router);

//Database Connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/nodeJS', { useUnifiedTopology: true, useNewUrlParser: true });

//Listening to server
const port = 8081;
const hostname = '127.0.0.1';
app.listen(port, hostname, () => {
    console.log(`Server at http://${hostname}:${port}`);
});