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
    lastChat: {
        type: String
    },
    date: {
        type: String
    },
    receiverId: {
        type: String
    },
    chatReadColor: {
        type: String,
        default: 'green'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('chatNotification', schema)


// let sql = 
// `CREATE TABLE chatnotification 
// (id int AUTO_INCREMENT,
// _id VARCHAR(255),
// owner VARCHAR(255),
// avatar VARCHAR(255),
// ownerName VARCHAR(255),
// receiverName VARCHAR(255),
// message VARCHAR(255),
// lastChat VARCHAR(255),
// date VARCHAR(255),
// receiverId VARCHAR(255),
// chatReadColor VARCHAR(255),
// PRIMARY KEY (id))`
// db.query(sql, (error) => {
//     if (error) {
//         return console.log(error)
//     }
//     console.log('Table creayed')
// })
