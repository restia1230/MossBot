const mongoose = require("mongoose");

const checkSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    discordID: String,
    checkcount: Number,
    name: String,
    lastcheck: Number
})

module.exports = mongoose.model("Check", checkSchema);