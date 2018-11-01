const express = require('express');
const authRoutes = express.Router();
const mongoose = require('mongoose')
const passport = require('passport');
const bcrypt = require('bcryptjs');

// require the user model !!!!
const User = require('../models/user');

authRoutes.post('/auth/signup', (req, res, next) => {
    const { firstName, lastName, email, phone, password } = req.body

    if (!firstName || lastName || email || phone || !password) {
        res.status(404).json({ message: 'Remplissez les champs vides s\'il vous plait' })
        return
    }

    if (password.length < 7) {
        res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
        return;
    }

    User.findOne({ email }, (err, findUser) => {
        if (err) {
            res.status(500).json({ message: " Something went bad." });
            return
        }

        if (findUser) {
            res.status(400).json({ message: 'Username taken. Choose another one.' });
            return;
        }
    })
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);


    const newUser = new User({
            firstName : firstName,
            lastName : lastName,
            email : email,
            phone  : phone,
            password : password
    })

    newUser.save(err => {
        if (err){
            res.status(400).json({ message: 'Saving user to database went wrong.' })
            return
        }
        req.login(newUser, (err) => {
            if (err) {
                res.status(500).json({ message: 'Login after signup went bad.' });
                return;
            }
            res.status(200).json(newUser)
        })
    })
})



module.exports = authRoutes;

