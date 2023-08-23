const mongoose = require('mongoose');
const musicShema = new mongoose.Schema({
    description: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    completed: {
        type: String
    },
    musicBuffer: {
        type: Buffer
    },
    musicPhoto: {
        type: Buffer
    },
    date: {
        type: String
    },
    reaction: [{
        type: Array,
        default: []
    }],
    downloadLength: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true        
    },
    ownersname: {
        type: String
    },
    commentlength: {
        type: String,
    }
}, {
    timestamps: true
})
const music = mongoose.model('music', musicShema)
module.exports = music