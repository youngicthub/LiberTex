const mongoose = require('mongoose');
const { string } = require('yargs');
const Story = mongoose.model('stories', {
    avatar: {
        type: String
    },
    caption: {
        type: String
    },
    color: {
        type: String
    },
    sttoryImage: {
        type: String,
    },
    image: {
        type: String
    },
    storyText: {
        type: String
    },
    video: {
        type: Buffer
    },
    owner: {
        type: String
    },
    ownerName:{
        type: String
    },
    date: {
        type: String 
    },
    withStory: {
        type: Boolean
    }, 
    storyStype: {
        type: String
    }, 
    viewers: [{
        type: Array,
        default: []
    }],
    reaction: [{
        type: Array,
        default: []
    }],
    isDisabled: {
        type: Boolean,
        default: false
    },
    exprireStoryNextDay: {
        type: Number,
    },
    storyHour: {
        type: Number,
    }
})

module.exports = Story


/*let sql = ` CREATE TABLE story 
(id int AUTO_INCREMENT,
_id VARCHAR(255),
avatar VARCHAR(255),
caption VARCHAR(255),
color VARCHAR(255),
sttoryImage VARCHAR(255),
image VARCHAR(255),
storyText VARCHAR(255),
video VARCHAR(255),
owner VARCHAR(255),
ownerName VARCHAR(255),
date VARCHAR(255),
withStory VARCHAR(255),
storyStype VARCHAR(255),
viewers VARCHAR(255),
reaction VARCHAR(255),
isDisabled VARCHAR(255),
exprireStoryNextDay VARCHAR(255),
storyHour VARCHAR(255),
PRIMARY KEY(id))`
db.query(sql, (error) => {
    if (error) {
        return console.log(error)
    }
    console.log('Table creayed')
})*/