const mongoose = require('mongoose')
module.exports = mongoose.model('notFoundImage', {
    image: {
        type: Buffer
    } 
})