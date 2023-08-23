const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String
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
    sharedPosterNickName: {
        type: String,
    },
    posterGenderType: {
        type: String
    },
    verified: {
        type: String
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
    hideLastComment: {
        type: String,
        default: 'none'
    },
    lastCommentAvatar: {
        type: String
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
    // Shared section
    sharedPostAvatar: {
        type: String
    },
    sharedPostDate: {
        type: String
    },
    sharedPostDescription: {
        type: String
    },
    sharedPostImage: {
        type: String
    },
    sharedPostVideo: {
        type: String
    },
    mainOwner: {
        type: String
    },
    verifiedSharedPost: {
        type: String
    },
    sharedPostOwnerName: {
        type: String
    },
    sharedPostLink: {
        type: String
    },
    sharedPostType: {
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
    },
    avatar: {
        type: String
    },
    shareAvatar: {
        type: String
    },
    sharePostUrl: {
        type: String
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('sharedPost', postSchema)

// let sql = `CREATE TABLE sharePost
// ( id int AUTO_INCREMENT, _id VARCHAR(255),
// description VARCHAR(255),
// image VARCHAR(255),
// video VARCHAR(255),
// postType VARCHAR(255),
// date VARCHAR(255),
// postImageId VARCHAR(255),
// possterName VARCHAR(255),
// posterNickName VARCHAR(255),
// sharedPosterNickName VARCHAR(255),
// posterGenderType VARCHAR(255),
// verified VARCHAR(255),
// reaction VARCHAR(255),
// isLike VARCHAR(255),
// owner VARCHAR(255),
// commentlength VARCHAR(255),
// Initcomment VARCHAR(255),
// hideLastComment VARCHAR(255),
// lastCommentAvatar VARCHAR(255),
// commentImage VARCHAR(255),
// commentName VARCHAR(255),
// verifiedComment VARCHAR(255),
// commentWidth VARCHAR(255),
// commentHeight VARCHAR(255),
// sharedPostAvatar VARCHAR(255),
// sharedPostDate VARCHAR(255),
// sharedPostDescription VARCHAR(255),
// sharedPostImage VARCHAR(255),
// sharedPostVideo VARCHAR(255),
// mainOwner VARCHAR(255),
// verifiedSharedPost VARCHAR(255),
// sharedPostOwnerName VARCHAR(255),
// sharedPostLink VARCHAR(255),
// sharedPostType VARCHAR(255),
// shareLength VARCHAR(255),
// posterFollower VARCHAR(255),
// posterFollowing VARCHAR(255),
// posterBio VARCHAR(255),
// reactionLength int,
// isDisabled VARCHAR(255),
// avatar VARCHAR(255),
// shareAvatar VARCHAR(255),
// sharePostUrl VARCHAR(255),
// ownerPrimaryid VARCHAR(255),
// PRIMARY KEY (id))`
// db.query(sql, (error) => {
//     if (error) {
//         return console.log(error)
//     }
//     console.log('Table creayed')
// })