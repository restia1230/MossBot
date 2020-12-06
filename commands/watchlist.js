const stock = require("../models/stock.js");
const mongoose = require("mongoose");
const mongostock = process.env.mongostock;
const iex = process.env.iex;
const profilepic = process.env.profilepic;
const fetch = require('node-fetch');


async function update(item, client, message) {

    var arr = [];
    var pos = 0;
    var neg = 0;
    for (var i = 0; i < item.stockList.length; i++) {
        let stonk = await fetch(`https://cloud.iexapis.com/stable/stock/${item.stockList[i]}/quote?token=${iex}`)
            .then(res => res.json()).catch(err => { });
        var price = 0;
        var change_emoji = '';
        var perc = (Math.round(stonk.changePercent * 100000) / 100000) * 100;
        if (stonk.change > 0) {
            change_emoji = ":chart_with_upwards_trend:";
            pos++;
        }
        else {
            change_emoji = ":chart_with_downwards_trend:"
            neg++;
        }
        if (stonk.iexRealtimePrice == null) {
            price = stonk.previousClose;
        }
        else {
            price = stonk.iexRealtimePrice;
        }
        var item1 = {
            name: `${stonk.symbol}: ${stonk.companyName}`,
            value: `$${price}, $${stonk.change}, ${perc.toFixed(2)}% ${change_emoji}`
        }
        arr.push(item1);
    }
    var sub = '';
    if (pos > neg) {
        sub = "Bull Gang";
    }
    else if (pos < neg) {
        sub = "Bear Gang";
    }
    else if (pos == neg) {
        sub = "Theta Gang"
    }
    message.channel.send({
        embed: {
            color: 0x00FF80,
            author: {
                name: client.user.username,
                icon_url: profilepic
            },
            title: `${message.author.username}'s stock watchlist`,
            description: `${sub}`,
            fields: arr,
            timestamp: new Date(),
            footer: {
                icon_url: profilepic,
            }
        }
    })
}


module.exports.run = async (client, message, args) => {
    await mongoose.connect(mongostock, { useNewUrlParser: true, useUnifiedTopology: true });

    await stock.findOne({ discordID: message.author.id }, async function (err, items) {
        if (!items) {
            message.channel.send("You have no stock in your watchlist!");
        }
        else {
            await update(items, client, message);
        }
        mongoose.connection.close();
    });
}