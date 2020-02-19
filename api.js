const DB = require('./schema');
const myDB = DB.loginDB;
const ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    adduser: userdata => new Promise((resolve, reject) => {
        myDB.create(userdata, (err, result) => {
            if (err) {
                console.log('Insertion Failed');
                reject(err);
            } else {
                resolve(result);
            }
        });
    }),
    updateData: (mydata) => new Promise((resolve, reject) => {
        let id = mydata._id;
        delete mydata._id;
        // console.log(mydata);

        myDB.updateOne({ _id: new ObjectId(id) }, mydata, (err, data) => {
            if (err) {
                reject('/updateData: Database Error');
            } else {
                //console.log(data);
                resolve(mydata);
            }
        });
    }),
    getValidation: (mydata, keyname) => new Promise((resolve, reject) => {
        myDB.find({ [keyname]: mydata }, (err, data) => {
            // console.log({ [keyname]: mydata })
            if (err) {
                resolve('Error in validation');
            } else {
                data = data[0]
                if (data)
                    reject({
                        name: 'Already Exists',
                        value: data,
                    });
                else
                    resolve('Permission Access');
            }

        });
    }),

    getdata: (myData = false) => new Promise((resolve, reject) => {
        let filter = {};
        if (myData.name) {
            filter = { $and: [{ password: myData.password }, { $or: [{ email: myData.name }, { username: myData.name }] }] }
            //console.log(filter)
        }
        myDB.find(filter, (err, result) => {
            if (err) {
                console.log('/api.js: Finding Failed');
                reject(err);
            } else {
                if (myData.name) {//to filter data only
                    result = result[0] || false;
                    // console.log(result)
                    if (result) {//checking if we get something
                        resolve(result);
                    } else {
                        reject('No User Found');
                    }
                } else {//throw all data
                    //resolve(result);
                    reject(result)
                }
            }
        });
    }),

    getDataOfScoreboard: () => new Promise((resolve, reject) => {
        DB.scoreDB.aggregate([
            { $sort: { score: -1 } }
        ], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    }),

    addUserToScoreBoard: (data = false) => new Promise((resolve, reject) => {
        try {
            DB.scoreDB.create({
                username: data.name,
                score: data.score,
                gamename: data.gamename,
            }, (err, result) => {
                if (err) {
                    console.log('Insertion Failed To ScoreBoard');
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        } catch (err) {
            reject(err);
        }
    }),
}