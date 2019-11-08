const express = require ('express');
const path = require ('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const createError = require("http-errors");

//Inicializaciones
const app = express();
require('./datebase');
require('./config/passport');

//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
    //helpers: require('./lib/handlebars')
}))

app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret:'pacheco',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Variables globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });

//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/presupuesto'));
app.use(require('./routes/users'));

//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// 404
app.use((req, res, next) => {
    next(createError(404, "La página que has solicitado no existe"));
  });
  
  // Administración de los errores
  app.use((error, req, res, next) => {
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
  
    res.render("error", {
      status,
      message: error.message
    });
  });
  
//Servidor
app.listen(app.get('port'), () => {
    console.log('server en el puerto: ', app.get('port'))
})