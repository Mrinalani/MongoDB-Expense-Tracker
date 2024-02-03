const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userId:{type:Schema.Types.ObjectId, ref:'User'},

    paymentid:{
        type:String,
    },
    orderid:{
        type:String,
    },
    status:{
        type:String,
    }
})

module.exports = mongoose.model('Orders', OrderSchema);



