const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    owner: {
        type: String,
    },
    avatar: {
        type: String,
        default: ''
    },
    text: {
        type: String
    },
    date: {
        type: String
    },
    eventId: {
        type: String
    },
    eventOwner: {
        type: String
    },
    comment: {
        type: String
    },
    ownerName: {
        type: String
    },
    urlLink: {
        type: String
    },
    count: {
        type:Number,
        default: '1'
    },
    readStatus: {
        type: String,
        default: 'fa fa-question'
    },
    readStatusColor: {
        type: String,
        default: 'red'
    },

}, {
    timestamps: true
})



module.exports = mongoose.model('notification', notificationSchema)

// let sql = 
// `CREATE TABLE notification (
//     id int AUTO_INCREMENT,
//     _id VARCHAR(255),
//     owner VARCHAR(255), 
//     avatar VARCHAR(255),
//     text VARCHAR(255),
//     date VARCHAR(255),
//     eventId VARCHAR(255),
//     eventOwner VARCHAR(255),
//     comment VARCHAR(255),
//     ownerName VARCHAR(255),
//     urlLink VARCHAR(255),
//     count VARCHAR(255),
//     readStatus VARCHAR(255),
//     readStatusColor VARCHAR(255),
//     PRIMARY KEY (id))`
//     db.query(sql, (error) => {
//         if (error) {
//             return console.log(error)
//         }
//         console.log('Table creayed')
//     })
