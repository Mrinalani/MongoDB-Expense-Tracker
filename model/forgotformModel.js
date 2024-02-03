
const mongoose = require('mongoose');
const uuid = require('uuid');


const ForgotpasswordSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.ObjectId,ref:'User'},
    _id: { type: String, default: uuid.v4 },
    active: { type: Boolean, required: true },
    expiresby: { type: Date }
});

const Forgotpassword = mongoose.model('Forgotpassword', ForgotpasswordSchema);

module.exports = Forgotpassword;





