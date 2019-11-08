const passport = require("passport");
const mongoose = require("mongoose");
const Usuario = mongoose.model("User");
const crypto = require("crypto");
const enviarEmail = require("../handlers/email");
// Muestra el formulario de reseteo de contraseña
exports.formularioReestablecerPassword = (req, res) => {
    res.render("reestablecerPassword", {
      nombrePagina: "Reestablece tu contraseña",
      tagline:
        "Si ya tienes una cuenta en DevFinder pero olvidaste tu contraseña, favor coloca tu correo electrónico."
    });
  };
  
  exports.enviarToken = async (req, res) => {
    // Verificar si el correo electrónico es válido
    const usuario = await Usuario.findOne({ email: req.body.email });
  
    // Si el usuario no existe
    if (!usuario) {
      req.flash("error", ["El correo electrónico ingresado no existe"]);
      return res.redirect("/reestablecerPassword");
    }
  
    // El usuario existe, generar el token
    usuario.token = crypto.randomBytes(20).toString("hex");
    usuario.expira = Date.now() + 3600000;
  
    // Guardar el usuario
    await usuario.save();
  
    // Generar la URL
    const resetUrl = `http://${req.headers.host}/reestablecerPassword/${usuario.token}`;
  
    // Enviar la notificación por email
    await enviarEmail.enviar({
      usuario,
      subject: "Reestablecer tu contraseña",
      template: "resetPassword",
      resetUrl
    });
  
    // Redireccionar
    req.flash("correcto", [
      "Verifica tu correo electrónico para seguir las instrucciones"
    ]);
    res.redirect("/login");
  };
  
  // Mostrar el formulario de cambio de contraseña
  exports.formularioNuevoPassword = async (req, res) => {
    // buscar el usuario por medio del token y la fecha de expiración
    const usuario = await Usuario.findOne({
      token: req.params.token,
      expira: { $gt: Date.now() }
    });
  
    // No se pudo encontrar el usuario con el token o token vencido
    if (!usuario) {
      req.flash("error", [
        "Solicitud expirada. Vuelve a solicitar el cambio de contraseña"
      ]);
      return res.redirect("/reestablecerPassword");
    }
  
    // Mostrar el formulario de nueva password
    res.render("nuevaPassword", {
      nombrePagina: "Ingresa tu nueva contraseña",
      tagline: "Asegurate de utilizar una contraseña segura"
    });
  };
  
  // Almacena la nueva contraseña
  exports.almacenarNuevaPassword = async (req, res) => {
    // buscar el usuario por medio del token y la fecha de expiración
    const usuario = await Usuario.findOne({
      token: req.params.token,
      expira: { $gt: Date.now() }
    });
  
    // No se pudo encontrar el usuario con el token o token vencido
    if (!usuario) {
      req.flash("error", [
        "Solicitud expirada. Vuelve a solicitar el cambio de contraseña"
      ]);
      return res.redirect("/reestablecerPassword");
    }
  
    // Obtener el nuevo password
    usuario.password = req.body.password;
    // Limpiar los valores que ya no son requeridos
    usuario.token = undefined;
    usuario.expira = undefined;
  
    // Almacenar los valores en la base de datos
    await usuario.save();
  
    // Redireccionar
    req.flash("correcto", ["Contraseña modificada correctamente"]);
    res.redirect("/login");
  };
  