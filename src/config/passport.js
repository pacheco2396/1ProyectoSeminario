const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const User = require('../models/Usuario'); 

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  // Compara el correo del usuario
  const user = await User.findOne({email: email});
  if (!user) {
    return done(null, false, { message: 'Usuario no disponible' });
  } else {
    // Compara el correo del usuario
    const match = await user.matchPassword(password);
    if(match) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Contraseña erronea.' });
    }
  }

}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});