const express = require('express');
//obtenemos su menodo para las rutas
const router = express.Router();

//Ruta de "inicio" de la aplicación
router.get('/', (req, res) =>{
    res.render('index');
});

//Ruta de "aceca de" de la aplicación
router.get('/acercaDe', (req, res) =>{
    res.render('acercaDe');
});

module.exports = router;