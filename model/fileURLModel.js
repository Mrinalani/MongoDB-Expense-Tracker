const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileURLSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
    
    fileURL: {
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        required: true
    }
    
})

module.exports = mongoose.model('FileURL', FileURLSchema);