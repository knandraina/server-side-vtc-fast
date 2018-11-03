const mongoose = require('mongoose');
const Booking = require('./course')
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

    addressDeparture : {type : String},
    datedeparture : {type : String},
    hourdeparture : {type: String},
    addressArrival: {type : String},
    flightinformation : {type : String},
    moreinformation : {type : String},
    statusBooking : { type: String, enum: ['pending', 'approved', 'declined'], default : 'pending'},
})


const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending', required: true },
    createdOn: {type :Date, default : Date.now},
    objectID : {type : String},
    role: {type : String, enum:['admin', 'user'], required : true},
    course : [bookingSchema],
})

const User = mongoose.model('User', userSchema);

module.exports = User;