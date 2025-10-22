const express = require('express');
const router = express.Router();

const getInmueble = require('../controllers/inmueble/getInmueble');
const printFacturaPdf = require('../controllers/factura/printFacturaPdf');
const getNovedades = require('../controllers/novedades/getNovedades');

//inmueble
router.get("/inmueble/:codInmueble", getInmueble)

//factura
router.post("/factura/imprimir", printFacturaPdf)

//novedades
router.get("/novedades", getNovedades)

module.exports = router;