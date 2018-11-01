const express = require('express');
const authRoutes = express.Router();
const mongoose = require('mongoose')
const passport = require('passport');
const bcrypt = require('bcryptjs');

// require the user model !!!!
const User = require('../models/user');



module.exports = authRoutes;

