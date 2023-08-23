const mongoose = require('mongoose');

const expensesScha = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,

    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date:{
        type: String
    }, 
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }
}, {
    timestamps: true
})

const BudgetIncome = mongoose.model('BudgetIncome',expensesScha)

module.exports = BudgetIncome