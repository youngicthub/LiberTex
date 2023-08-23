const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    avatar: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    image1: {
        type: String
    },
    image2: {
        type: String
    },
    imageLength: {
        type: Number
    },
    video: {
        type: String
    },
    postType: {
        type: String
    },
    date: {
        type: String
    },
    postImageId: {
        type: String
    },
    possterName: {
        type: String
    },
    posterNickName: {
        type: String,
    },
    posterGenderType: {
        type: String
    },
    posertFollowing: {
        type: Array,
        default: []
    },
    posterPostLikes: {
        type: String
    },
    verified: {
        type: String
    },
    hideSLides: {
        type: String,
    },
    reaction: [{
        type: Array,
        default: []
    }],
    isLike: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    commentlength: {
        type: String,
    },
    Initcomment: {
        type: String
    },
    lastCommentAvatar: {
        type: String
    },
    hideLastComment: {
        type: String,
        default: 'none'
    },
    commentImage: {
        type: String
    },
    commentName: {
        type: String
    },
    verifiedComment: {
        type: String
    },
    commentWidth: {
        type: String
    },
    commentHeight: {
        type: String
    },
    shareLength: {
        type: Number,
        default: 0
    },
    posterFollower: {
        type: String
    },
    posterFollowing: {
        type: String
    },
    posterBio: {
        type: String
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Post = mongoose.model('createPost', postSchema)
module.exports = Post

/*let sql = `CREATE TABLE posts
( id int AUTO_INCREMENT, _id VARCHAR(255),
avatar VARCHAR(255),
description VARCHAR(255),
reactionLength int,
image VARCHAR(255),
image1 VARCHAR(255),
image2 VARCHAR(255),
imageLength VARCHAR(255),
video VARCHAR(255),
postType VARCHAR(255),
date VARCHAR(255),
postImageId VARCHAR(255), 
possterName VARCHAR(255),
posterNickName VARCHAR(255),
posterGenderType VARCHAR(255),
posertFollowing VARCHAR(255),
posterPostLikes VARCHAR(255),
verified VARCHAR(255),
hideSLides VARCHAR(255),
reaction VARCHAR(255),
isLike VARCHAR(255),
owner VARCHAR(255),
commentlength VARCHAR(255),
Initcomment VARCHAR(255),
lastCommentAvatar VARCHAR(255),
hideLastComment VARCHAR(255),
commentImage VARCHAR(255),
reactionLength = int,
commentName VARCHAR(255),
verifiedComment VARCHAR(255),
commentWidth VARCHAR(255),
commentHeight VARCHAR(255),
shareLength VARCHAR(255),
posterFollower VARCHAR(255),
posterFollowing VARCHAR(255),
posterBio VARCHAR(255),
ownerPrimaryid VARCHAR(255),
isDisabled VARCHAR(255),
PRIMARY KEY (id))`
    db.query(sql, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log('Table creayed')
    })

    */