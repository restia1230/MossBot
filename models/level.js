const mongoose = require("mongoose");

const levelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    discordID: String,
    name: String,
    chatcount: Number,
    minutes: Number,
    type: Number
})

module.exports = mongoose.model("level", levelSchema);