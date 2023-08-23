const mongoose = require('mongoose')
module.exports = mongoose.model('fakeFemaileAvatar', {
    fakeavatar: {
        type: Buffer
    }
})