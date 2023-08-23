const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: {
        type: String
    },
    replyOldMessage: {
        type: String
    },
    date: {
        type: String
    },
    buffer: {
        type: String
    },
    ref: {
        type: mongoose.Schema.Types.ObjectId
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId
    },
    receiverName: {
        type: String
    },
    ownerName: {
        type: String
    },
    sortChat: {
        type: String
    },
    pushChat: {
        type: String
    },
    count: {
        type: Number
    },
    image: {
        type: String
    },
    hide: {
        type: String
    },
    hideChatText: {
        type: String
    },
    hideOldReply: {
        type: String
    },
    hideStory: {
        type: String
    },
    video: {
        type: String
    },
    hideVideo: {
        type: String
    },
    chatType: {
        type: String
    },
    audio: {
        type: String
    },
    storyImageUrl: {
        type: String
    },
    hideAudio: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('chatReceiver', chatSchema)


// let sql =
// `CREATE TABLE chatreceiver 
// (_id VARCHAR(255),
// id int AUTO_INCREMENT,
// message VARCHAR(255),
// replyOldMessage VARCHAR(255),
// date VARCHAR(255),
// buffer VARCHAR(255),
// ref VARCHAR(255),
// owner VARCHAR(255),
// receiverId VARCHAR(255),
// receiverName VARCHAR(255),
// ownerName VARCHAR(255),
// sortChat VARCHAR(255),
// pushChat VARCHAR(255),
// count VARCHAR(255),
// image VARCHAR(255),
// hide VARCHAR(255),
// hideChatText VARCHAR(255),
// hideOldReply VARCHAR(255),
// hideStory VARCHAR(255),
// video VARCHAR(255),
// hideVideo VARCHAR(255),
// chatType VARCHAR(255),
// audio VARCHAR(255),
// storyImageUrl VARCHAR(255),
// hideAudio  VARCHAR(255),
// PRIMARY KEY (id))`
// db.query(sql, (error) => {
//     if (error) {
//         return console.log(error)
//     }
//     console.log('Table creayed')
// })