const mongoose = require('mongoose');
const comments = mongoose.model('replycomments', {    
    comment: {
        type: String
    }, 
    date: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId      
    },
    fullName: {
        type: String
    },
    commentorNickName: {
        type: String
    },
    mainCommentId: {
        type: mongoose.Schema.Types.ObjectId
    },
    replylength: {
        type: String,
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
    hidePhoto: {
        type: String
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String
    }
})
module.exports  = comments




// let sql = `CREATE TABLE comments
// ( id int AUTO_INCREMENT, 
// _id VARCHAR(255),
// comment VARCHAR(255),
// date VARCHAR(255),
// owner VARCHAR(255),
// fullName VARCHAR(255),
// commentorNickName VARCHAR(255),
// mainCommentId VARCHAR(255), VARCHAR(255),
// replylength VARCHAR(255),
// image VARCHAR(255),
// reaction VARCHAR(255),
// verified VARCHAR(255),
// hidePhoto VARCHAR(255),
// isDisabled VARCHAR(255),
// avatar VARCHAR(255),
// reactionLength int`,
// PRIMARY KEY (id))`

// db.query(sql, (error) => {
//     if (error) {
//         return console.log(error)
//     }
//     console.log('Table creayed')
// })