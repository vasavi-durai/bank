const mongoose = require('mongoose');

const adlogSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const Adlogin = mongoose.model('Adlogin', adlogSchema);
module.exports = Adlogin;
