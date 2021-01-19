const stock = require("../models/stock.js");
const mongoose = require("mongoose");
const mongostock = process.env.mongostock;
const iex = process.env.iex;
const fetch = require('node-fetch');

async function add(client, message, stockname) {
    var membadd = new stock({
        _id: mongoose.Types.ObjectId(),
        discordID: message.member.id,
        username: message.author.username,
        stockList: [stockname]
    })
    await membadd.save().catch(err => console.log(err));
    message.react('✅');
    return;
}

async function update(item, client, message, stockname) {
    if (item.stockList.length >= 14) {
        return (message.channel.send(`${message.author.username} is at max stocks in watchlist.`));
    }
    item.stockList.push(stockname);
    await item.save().catch(err => console.log(err));
    message.react('✅');
    return;
}

module.exports.run = async (client, message, args) => {
    let stockname = message.content.substring(10);
    var continue1 = true;
    let stonk = await fetch(`https://cloud.iexapis.com/stable/stock/${stockname}/quote?token=${iex}`)
        .then(res => res.json()).catch(err => {
            message.channel.send("Invalid symbol.");
            continue1 = false;
        });

    if (continue1) {
        await mongoose.connect(mongostock, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.log("STOCKADD"));;

        await stock.findOne({ discordID: message.author.id }, async function (err, items) {
            if (!items) {
                await add(client, message, stockname);
            }
            else {
                await update(items, client, message, stockname);
            }
            mongoose.connection.close();
        });
    }
}