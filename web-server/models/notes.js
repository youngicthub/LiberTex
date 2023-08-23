const mongoose = require('mongoose');
const Notes = mongoose.model('Notes', {
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    
})


module.exports = Notes