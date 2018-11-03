const express = require('express');
const authRoutes = express.Router();
const mongoose = require('mongoose')
const passport = require('passport');
const bcrypt = require('bcryptjs');

// require the user model !!!!
const User = require('../models/user');
const Booking = require('../models/course')

authRoutes.post('/auth/signup', (req, res, next) => {
    const { firstName, lastName, username, phone, password } = req.body

    if (!firstName || !lastName || !username || !phone || !password) {
        res.status(404).json({ message: 'Remplissez les champs vides s\'il vous plait' })
        return
    }

    if (password.length < 7) {
        res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
        return;
    }

    User.findOne({ username }, (err, findUser) => {
        console.log(username)
        if (err) {
            res.status(500).json({ message: " Something went bad." });
            return
        }

        if (findUser) {
            res.status(400).json({ message: 'Username taken. Choose another one.' });
            return;
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hashPass = bcrypt.hashSync(password, salt);


            const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                username: username,
                phone: phone,
                password: hashPass
            })

            newUser.save(err => {
                if (err) {
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
        }
    })

})


authRoutes.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
        console.log(err, theUser,failureDetails)
        if (err) {
            res.status(500).json({ message: 'Something went wrong authenticating user' });
            return;
        }
        if (!theUser) {
            // "failureDetails" contains the error messages
            // from our logic in "LocalStrategy" { message: '...' }.
            res.status(401).json(failureDetails);
            return;
        }

        // save user in session
        req.login(theUser, (err) => {
            if (err) {
                res.status(500).json({ message: 'Session save went bad.' });
                return;
            }

            // We are now logged in (that's why we can also send req.user)
            res.status(200).json(theUser);


        });
    })(req, res, next);
})

authRoutes.put('/auth/edit', (req, res, next) => {
    const { firstName, lastName, username, phone } = req.body
    User.findByIdAndUpdate({ '_id': req.session.passport.user }, { $set: { firstName, lastName, username, phone } }, { new: true })
        .then(data => {
            return res.status(200).json(data)
        })
        .catch(err => next(err))
})

authRoutes.get('/auth/loggedin', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
        return;
    }
    res.status(403).json({ message: 'Unauthorized' })
})

authRoutes.post('/auth/reservation', (req, res, next) => {
    const { flightinformation, datedeparture, hourdeparture, moreinformation, addressDeparture, addressArrival } = req.body;

    User.findOne({ '_id': req.user._id })
        .then(data => {
            //unshift is the new way to push data into MongoDB
            data.course.unshift({
                flightinformation: flightinformation,
                datedeparture: datedeparture,
                hourdeparture: hourdeparture,
                moreinformation: moreinformation,
                addressDeparture: addressDeparture,
                addressArrival: addressArrival
            })
            data.save()
                .then(book => {
                    console.log(book)
                    return res.status(200).json(book)
                })
                .catch(err => { console.log('An error occured', err) });
        })
})

module.exports = authRoutes;