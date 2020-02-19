const mongoose = require('mongoose');

const mySchema = mongoose.Schema({
    username: String,
    name: {
        firstname: String,
        lastname: String
    },
    email: String,
    phone: Number,
    password: String,

},
    {
        versionKey: false
    });


const myScoreSchema = mongoose.Schema({
    username: String,
    score: String,
    gamename: String,

},
    {
        versionKey: false
    });

module.exports = {
    loginDB: mongoose.model('loginpage', mySchema),
    scoreDB: mongoose.model('scoreboard', myScoreSchema),
}