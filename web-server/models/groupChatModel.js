const mongoose = require('mongoose')
const groupSchema = new mongoose.Schema({
    owner: {
        type: String
    },
    name: {
        type: String
    },
    avatar: {
        type: Buffer
    },
    coverPhoto: {
        type: Buffer
    },
    members: [{
        type: Array,
        default: []
    }],
    date: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('groupChat', groupSchema)