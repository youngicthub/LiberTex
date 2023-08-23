const mongoose = require('mongoose')
module.exports = mongoose.model('fakeavatar', {
    fakeavatar: {
        type: Buffer
    }
})