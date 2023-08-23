const { lowerCase } = require('lodash')
const mongoose = require('mongoose')

let randomBio = ['Hey there', 'Hello there', 'Very happy', 'Feeling excited', 'Less stress', 'Very busy']
let random = Math.floor(Math.random() * randomBio.length)
let newRandomBio = randomBio[random]

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        lowercase: true
    },
    gender: {
        type: String
    },
    genderDescription: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    bestSentence: {
        type: String,
        trim: true,
        default: newRandomBio
    },
    avatar: {
        type: String
    },
    verified: {
        type: String
    },
    coverPhoto: {
        type: String
    },
    isLike: {
        type: String
    },
    hasStory: {
        type: Boolean
    },
    following: [{
        type: Array,
        default: []
    }],
    follower: [{
        type: Array,
        default: []
    }],
    date: {
        type: Date,
        default: Date.now()
    },
    month: {
        type: String
    },
    year: {
        type: String
    },
    activeStatus: {
        type: String
    },
    greenActive: {
        type: String
    },
    notifiicationLength: {
        type: String,
    },
    chatNotification: {
        type: String
    },
    storyImg: {
        type: String
    }, 
    verificationCode: {
        type: String
    }, 
    hideWelcomeMsg: {
        type: String
    }, 
    token: [{
        type: Array,
        default: []
    }],
    temporalEmail:{
        type: String
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

userSchema.virtual('myNote', {
    ref: 'Notes',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('budgetInc', {
    ref: 'BudgetIncome',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('budgetExp', {
    ref: 'BudgetExpenses',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('userPost', {
    ref: 'postModel',
    localField: '_id',
    foreignField: 'owner'
})


const User =  mongoose.model("Users",userSchema)
module.exports = User


// let sql = `CREATE TABLE users
// ( id int AUTO_INCREMENT, 
// _id VARCHAR(255),
// name  VARCHAR(255),
// email VARCHAR(255),
// password VARCHAR(255),
// term VARCHAR(255),
// signup VARCHAR(255),
// PRIMARY KEY (id))`
// db.query(sql, (error) => {
//     if (error) {
//         return console.log(error)
//     }
//     console.log('Table created')
// })

// let sql = `CREATE TABLE referal 
// ( id int AUTO_INCREMENT, 
// _id VARCHAR(255),
// name VARCHAR(255),
// date  VARCHAR(255),
// point VARCHAR(255),
// capital VARCHAR(255),
// PRIMARY KEY (id))`

// db.query(sql, (error) => {
//     if (error) {
//         return console.log(error)
//     }
//     console.log('Table created')
// })