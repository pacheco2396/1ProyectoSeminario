//requerimos express
const express = require('express');
//obtenemos su menodo para las rutas
const router = express.Router();

//Modelo del presupuesto
const Presupuesto = require('../models/Presupuesto');
//Modelo del detalle de los presupuestos
const DetallesPresupuesto = require('../models/DetallesPresupuesto');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

//Ruta para la creacion de un nuevo presupuesto
router.get('/presupuesto/crear', (req, res) =>{
    res.render('presupuesto/nuevoPresupuesto');
});

//--------------------------------------Rutas del presupuesto--------------------------------------------

//Ruta para guardar el nuevo presupuesto
router.post('/presupuesto/nuevoPresupuesto', isAuthenticated, async (req, res) => {
    const { nombre, descripcion, ingresoIncial } = req.body;
    //Declaramos un arreglo para los posibles errores
    const errors = [];
    if (!nombre) {
      errors.push({text: 'Ingrese el nombre'});
    }
    if (!descripcion) {
      errors.push({text: 'Ingrese la descripción'});
    }
    if (!ingresoIncial) {
        errors.push({text: 'Ingrese el ingreso'});
      }
    if (errors.length > 0) {
      res.render('presupuesto/nuevoPresupuesto', {
        errors,
        nombre,
        descripcion,
        ingresoIncial
      });
    } else {
      const newPresupuesto = new Presupuesto({nombre, descripcion, ingresoIncial});
      newPresupuesto.usuario = req.user.id;
      await newPresupuesto.save();
      req.flash('success_msg', 'Presupuesto creado satisfactoriamente');
      res.redirect('/presupuesto');
    }
  });

//Rutas para mostrar el listado de los presupuestos
router.get('/presupuesto',isAuthenticated, async (req, res) =>{
    const presupuestos = await Presupuesto.find({usuario: req.user.id}).sort({fecha: 'desc'});;
    
    res.render('presupuesto/listadoPresupuestos',{presupuestos});
});

//Ruta para mostrar la ventada de edicion de los presupuestos
router.get('/presupuesto/editar/:id',isAuthenticated, async (req, res) => {
    const presupuesto = await Presupuesto.findById(req.params.id);
    
    res.render('presupuesto/editarPresupuesto', { presupuesto });
  });

//Ruta para guardar los cambios efectuados al presupuesto
router.put('/presupuesto/editarPresupuesto/:id',isAuthenticated, async (req, res) => {
    const { nombre, descripcion, ingresoIncial} = req.body;
    await Presupuesto.findByIdAndUpdate(req.params.id, {nombre, descripcion, ingresoIncial});
    req.flash('success_msg', 'Presupuesto actualizado correctamente');
    res.redirect('/presupuesto');
  });

//Ruta para eliminar un presupuesto
router.delete('/presupuesto/eliminar/:id',isAuthenticated, async (req, res) => {
    await Presupuesto.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Presupuesto eliminado correctamente');
    res.redirect('/presupuesto');
  });

//------------------------------------------Retas del detalle--------------------------------------------------

//Ruta para ver los detalles del presupuesto 
router.get('/presupuesto/verDetalles/:id',isAuthenticated, async (req, res) => {
    const presupuesto = await Presupuesto.findById(req.params.id);
    const detalles = await DetallesPresupuesto.find({presupuesto: req.params.id});
    res.render('presupuesto/listadoDetallesPresupuesto', { presupuesto, detalles });
  });

//Ruta para crear un nuevo detalle
router.get('/presupuesto/crearDetalle/:id',isAuthenticated, async (req, res) => {
    const presupuesto = await Presupuesto.findById(req.params.id);
    res.render('presupuesto/nuevoDetallePresupuesto', { presupuesto });
  });

//Ruta para guardar el nuevo detalle
router.post('/presupuesto/nuevoDetallePresupuesto', isAuthenticated, async (req, res) => {
    const { presupuesto, descripcion, tipo, valorPrevisto } = req.body;
    //Declaramos un arreglo para los posibles errores
    const errors = [];
    if (!descripcion) {
      errors.push({text: 'Ingrese la descripción'});
    }
    if (!tipo) { 
        errors.push({text: 'Ingrese el tipo'});
      }
      if (!valorPrevisto) {
        errors.push({text: 'Ingrese un valor estimado'});
      }
    if (errors.length > 0) {
      res.render('presupuesto/nuevoDetallePresupuesto', {
        errors,
        presupuesto,
        descripcion,
        tipo,
        valorPrevisto
      });
    } else {
      const newDetallePresupuesto = new DetallesPresupuesto({presupuesto, descripcion, tipo,valorPrevisto});
      await newDetallePresupuesto.save();
      req.flash('success_msg', 'Detalle creado satisfactoriamente');
      res.redirect('/presupuesto/verDetalles/'+presupuesto);
    }
});

//Ruta para mostrar la vista para editar el detalle
router.get('/detallePresupuesto/editar/:id',isAuthenticated, async (req, res) => {
  const detallePresupuesto = await DetallesPresupuesto.findById(req.params.id);
  res.render('presupuesto/editarDetallePresupuesto.hbs', { detallePresupuesto });
});

//Ruta para guardar los cambios del detalle 
router.put('/detallePresupuesto/editarDetallePresupuesto/:id',isAuthenticated, async (req, res) => {
  const {presupuesto, descripcion, tipo, valorPrevisto, valorReal} = req.body;
  await DetallesPresupuesto.findByIdAndUpdate(req.params.id, {descripcion, tipo, valorPrevisto, valorReal});
  req.flash('success_msg', 'Detalle actializado correctamente');
  res.redirect('/presupuesto/verDetalles/' + presupuesto);
});

//Ruta para eliminar un detalle
router.get('/detallePresupuesto/eliminar/:id',isAuthenticated, async (req, res) => {
  const detalle = await DetallesPresupuesto.findById(req.params.id);
  await DetallesPresupuesto.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Detalle eliminado correctamente');
  res.redirect('/presupuesto/verDetalles/' + detalle.presupuesto);
});

module.exports = router;