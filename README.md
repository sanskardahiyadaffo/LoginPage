# LoginPage
Web login/authentication page using nodeJS and mongodb


create a keys.js file and copy paste the code

module.exports = {
    //credentials
    google: {
        id: 'Your Google Client ID',
        secret: 'Your Google Client Secret',
    },
    mongoose: {
        url: 'MongoDB database address',
    },
    cookie: {
        keys: 'Key name',
        timeOut: 1000*60*60,//Max duration of cookie
    }
    
}
