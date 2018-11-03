const User          = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcryptjs'); // !!!
const passport      = require('passport');

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});

passport.use(new LocalStrategy({ passReqToCallback: true}, (req, username, password, next) => {
    let role = req.body.role
    console.log(role)
  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      console.log(err)
      next(err);
      return;
    }

    if (!foundUser) {
      next(null, false, { message: 'Incorrect username.' });
      return;
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Incorrect password.' });
      return;
    }

    if (role !== foundUser.role){
      // next(null, false, { message: 'Incorrect role.' });
      return
    }

    next(null, foundUser);
  });
}));

function passportSetup(app) {
  app.use(passport.initialize());
  app.use(passport.session());

}

module.exports = passportSetup;