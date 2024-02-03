const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model

    expense:{
        type:Number,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model('Expenses', ExpenseSchema)





