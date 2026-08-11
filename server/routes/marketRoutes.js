const express = require("express");

const {
  getAllInstruments,
  getSingleInstrument,
} = require("../controllers/marketController");

const router = express.Router();

router.get("/instruments", getAllInstruments);

router.get("/instruments/:symbol", getSingleInstrument);

module.exports = router;
