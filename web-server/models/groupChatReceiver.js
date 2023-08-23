const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: {
        type: String
    },
    date: {
        type: String        
    },
    buffer: {
        type: Buffer
    },
    ref: {
        type: mongoose.Schema.Types.ObjectId
    },
    owner:  {
        type: mongoose.Schema.Types.ObjectId
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId
    },
    receiverName: {
        type: String
    },
    ownerName:{
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
        type: Buffer
    },
    hide: {
        type: String
    }
},{
    timestamps: true
})

module.exports = mongoose.model('groupchatReceiver', chatSchema)