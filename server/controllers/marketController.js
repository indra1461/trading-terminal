const {
  getInstruments,
  getInstrumentBySymbol,
} = require("../services/marketService");

const getAllInstruments = (req, res) => {
  const instruments = getInstruments();

  res.json({
    success: true,
    data: instruments,
  });
};

const getSingleInstrument = (req, res) => {
  const instrument = getInstrumentBySymbol(req.params.symbol);

  if (!instrument) {
    return res.status(404).json({
      success: false,
      message: "Instrument not found",
    });
  }

  res.json({
    success: true,
    data: instrument,
  });
};

module.exports = {
  getAllInstruments,
  getSingleInstrument,
};
