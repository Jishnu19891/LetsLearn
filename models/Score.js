const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    xp: { type: Number, default: 0 }
});

module.exports = mongoose.model('Score', scoreSchema);
