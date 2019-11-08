//Requerimos router del modulo de express
const router = require('express').Router();
//Requerimos el modulo de passport
const passport = require('passport');
const authController = require("../controller/authController");
// Modelo del usuario
const User = require('../models/Usuario');

//Ruta para mostrar la ventana de registro a la App
router.get('/usuario/registrarse', (req, res) => {
  res.render('usuario/registrarse');
});

//Ruta para registrar el nuevo usuario
router.post('/usuario/registrarse', async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if(password != confirm_password) {
    errors.push({text: 'Passwords do not match.'});
  }
  if(password.length < 4) {
    errors.push({text: 'Passwords must be at least 4 characters.'})
  }
  if(errors.length > 0){
    res.render('usuario/registrarse', {errors, name, email, password, confirm_password});
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({email: email});
    if(emailUser) {
      req.flash('error_msg', 'The Email is already in use.');
      res.redirect('/usuario/registrarse');
    } else {
      // Saving a New User
      const newUser = new User({name, email, password});
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash('success_msg', 'You are registered.');
      res.redirect('/usuario/login');
    }
  }
});

//Ruta para mostrar la ventana de login de la App
router.get('/usuario/login', (req, res) => {
  res.render('usuario/login');
});

//Ruta para comprobar las credenciales del usuario  mediante el modulo de passport
router.post('/usuario/login', passport.authenticate('local', {
  successRedirect: '/presupuesto',
  failureRedirect: '/usuario/login',
  failureFlash: true
}));

//Ruta para que el usuario pueda cerrar su session
router.get('/usuario/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Has cerrado tu sesión');
  res.redirect('/usuario/login');
});
// Reestablecer la contraseña del usuario
router.get(
  "/reestablecerPassword",
  authController.formularioReestablecerPassword
);
router.post("/reestablecerPassword", authController.enviarToken);
router.get(
  "/reestablecerPassword/:token",
  authController.formularioNuevoPassword
);
router.post(
  "/reestablecerPassword/:token",
  authController.almacenarNuevaPassword
);
module.exports = router;