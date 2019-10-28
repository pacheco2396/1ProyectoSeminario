const mongoose = require('mongoose');
// Direccion del cluster de la base de datos en MongoDB
mongoose.connect('mongodb+srv://albertopacheco23:becks2323@pachecocluster-gyot5.mongodb.net/Presupuesto', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(db =>console.log('La base de datos esta conectada'))
  .catch(err =>console.error(err));