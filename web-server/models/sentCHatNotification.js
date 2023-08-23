const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    owner: {
        type: String
    },
    avatar: {
        type: String
    },
    ownerName: {
        type: String
    },
    receiverName: {
        type: String
    },
    message: {
        type: String
    },
    date: {
        type: String
    },
    receiverId: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('sentchatNotification', schema)

// let sql =
//     `CREATE TABLE sentchatnotification 
//     (id int AUTO_INCREMENT,
//     _id VARCHAR(255),
//     owner VARCHAR(255),
//     avatar VARCHAR(255),
//     ownerName VARCHAR(255),
//     receiverName VARCHAR(255),
//     message VARCHAR(255),
//     date VARCHAR(255),
//     receiverId VARCHAR(255),
//     PRIMARY KEY (id))`
// db.query(sql, (error) => {
//     if (error) {
//         return console.log(error)
//     }
//     console.log('Table creayed')
// })