const mongoose = require('mongoose');
const expensesSchea= new mongoose.Schema({
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

const BudgetExpenses = mongoose.model('BudgetExpenses',expensesSchea)

module.exports = BudgetExpenses