const mongoose = require('mongoose')
module.exports = mongoose.model('fakeCoverPhoto', {
    fakeCoverPhoto: {
        type: Buffer
    }
})