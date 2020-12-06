const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    discordID: String,
    username: String,
    stockList: [String]
})

module.exports = mongoose.model("stock", stockSchema);