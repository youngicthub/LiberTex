const mongoose = require('mongoose')
const adminSchema = mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String
    }, 
    password: {
        type: String
    },
    adminAccess: {
        type: String
    }, 
    gender: {
        type: String
    }, 
    email: {
        type: String,
        timm: true
    }
}, {
    timestamp: true
})

module.exports =  mongoose.model('AdminUser', adminSchema)


// let sql =
// `CREATE TABLE admin 
// (_id VARCHAR(255),
// id int AUTO_INCREMENT,
// firstname Text,
// lastname Text,
// password Text,
// adminAccess Text,
// gender Text,
// email Text,
// PRIMARY KEY (id))`
// db.query(sql, (error) => {
//     if (error) {
//         return console.log(error)
//     }
//     console.log('Table creayed')
// })