const mongoose = require('mongoose');
const comments = mongoose.model('comments', {
    comment: {
        type: String
    },
    avatar: {
        type: String
    },
    date: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
    },
    fullName: {
        type: String
    },
    commentorNickName: {
        type: String
    },
    postId: {
        type: String
    },
    hideImage: {
        type: String
    },
    replylength: {
        type: String
    },
    image: {
        type: String
    },
    reaction: [{
        type: Array,
        default: []
    }],
    verified: {
        type: String
    },
    lastPostOwnerId: {
        type: String
    },
    lastReplyName: {
        type: String
    },
    lastReplyText: {
        type: String
    },
    lastReplyAvatar: {
        type: String
    },
    hideReply:{
        type: String,
        default: 'none'
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
})
module.exports = comments

// let sql = `CREATE TABLE comments
// ( id int AUTO_INCREMENT, 
// _id VARCHAR(255),
// comment  VARCHAR(255),
// avatar VARCHAR(255),
// date VARCHAR(255),
// owner VARCHAR(255),
// fullName VARCHAR(255),
// commentorNickName VARCHAR(255),
// postId VARCHAR(255),
// hideImage VARCHAR(255),
// replylength VARCHAR(255),
// image VARCHAR(255),
// reaction VARCHAR(255),
// verified VARCHAR(255),
// lastPostOwnerId VARCHAR(255),
// lastReplyName VARCHAR(255),
// lastReplyText VARCHAR(255),
// lastReplyAvatar VARCHAR(255),
// hideReply VARCHAR(255),
// reactionLength varchar(10000),
// isDisabled VARCHAR(255),
// PRIMARY KEY (id))`
// db.query(sql, (error) => {
//     if (error) {
//         return console.log(error)
//     }
//     console.log('Table creayed')
// })