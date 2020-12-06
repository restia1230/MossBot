const stock = require("../models/stock.js");
const mongoose = require("mongoose");
const mongostock = process.env.mongostock;
const iex = process.env.iex;
const fetch = require('node-fetch');



async function update(item, client, message, stockname) {
    var contains = false;
    const index = item.stockList.indexOf(stockname);
    if (index > -1) {
        item.stockList.splice(index, 1);
        contains = true;
        await item.save().catch(err => console.log(err));
        message.react('✅');
    }
    else{
        message.channel.send("Inputted stock is not in watchlist!");
    }
    return;
}

module.exports.run = async (client, message, args) => {
    let stockname = message.content.substring(10);

    await mongoose.connect(mongostock, { useNewUrlParser: true, useUnifiedTopology: true });

    await stock.findOne({ discordID: message.author.id }, async function (err, items) {
        if (!items) {
            message.channel.send("You have no stock in your watchlist!");
        }
        else {
            await update(items, client, message, stockname);
        }
        mongoose.connection.close();
    });

}