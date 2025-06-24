const express = require('express');
const router = express.Router();

const getInmueble = require('../controllers/inmueble/getInmueble');

//inmueble
router.get("/inmueble/:codInmueble", getInmueble)

module.exports = router;