const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending', required: true },
    createdOn: {type :Date, default : Date.now},
    objectID : {type : String},
    role: {type : String, enum:['admin', 'user'], default : 'user', required : true},
    course : [{
        adressdeparture : {type : String},
        adressarrival : {type:  String},
        distance : {type : Number},
        duree : {type : Number},
        datedeparture : {type : String},
        hourdeparture : {type: String},
        statusBooking : { type: String, enum: ['pending', 'approved', 'declined']},
        bookingID : {type: String},
    }],
})

const User = mongoose.model('User', userSchema);

module.exports = User;