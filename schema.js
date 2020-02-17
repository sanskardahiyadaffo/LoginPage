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

module.exports = mongoose.model('loginpage', mySchema);