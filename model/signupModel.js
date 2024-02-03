const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SignupSchema = new Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true
    },
    ispremiumuser: {
        type: Boolean, 
    },
    totalExpense: {
        type: Number
    },
    expenses: [{ type: Schema.Types.ObjectId, ref: 'Expenses' }], // Array of Expense references
    orders: [{type:Schema.Types.ObjectId, ref:'Orders'}],
    forgotPasword:[{type:Schema.Types.ObjectId, ref:'ForgotPassword' }],
     fileURL:[{type:Schema.Types.ObjectId, ref:'FileURL' }]

})

module.exports = mongoose.model('User', SignupSchema)




