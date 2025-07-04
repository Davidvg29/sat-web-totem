const express = require('express');
const router = express.Router();

const getInmueble = require('../controllers/inmueble/getInmueble');
const printFacturaPdf = require('../controllers/factura/printFacturaPdf');

//inmueble
router.get("/inmueble/:codInmueble", getInmueble)

//factura
router.get("/factura/imprimir/:numeroFactura", printFacturaPdf)

module.exports = router;