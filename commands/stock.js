const fetch = require('node-fetch');
const querystring = require('querystring');
const Discord = require('discord.js');
const iex = process.env.iex;
const profile = process.env.profilepic;

exports.run = async (client, message, args, ops) => {
    var change_emoji = '';
    if (!args.length) {
        return message.channel.send('You need to supply a search term!');
    }
    const query = message.content.substring(7);
    var continue1 = true;
    let stonk = await fetch(`https://cloud.iexapis.com/stable/stock/${query}/quote?token=${iex}`)
        .then(res => res.json()).catch(err => {
            message.channel.send("Invalid symbol.");
            continue1 = false;
        });
    if (continue1) {
        var price = 0;
        var stat = '';
        if (stonk.iexRealtimePrice == null) {
            price = stonk.previousClose;
            stat = 'Market is currently closed, last'
        }
        else {
            price = stonk.iexRealtimePrice;
            stat = 'Current'
        }
        message.channel.send(`${stat} quote for **${stonk.symbol}** is **$__${price}__**`);
        if (stonk.change > 0) {
            change_emoji = ":chart_with_upwards_trend:";
        }
        else {
            change_emoji = ":chart_with_downwards_trend:"
        }
        var perc = (Math.round(stonk.changePercent * 100000) / 100000) * 100;
        const embed1 = new Discord.MessageEmbed()
            .setColor('#00FF80') // Set the color for the side pannel
            .setTitle(`**${stonk.symbol}**`) // set the title
            .setThumbnail(profile)
            .addFields(
                {
                    name: `**${stonk.companyName}**`, value:
                        "**Current Price**: " + `__${price}__` + "\n" +
                        "**Change**: $" + stonk.change + " " + change_emoji + "\n" +
                        "**% Change**: " + perc.toFixed(2) + "% " + change_emoji + "\n" +
                        "**Previous Close**: $" + stonk.previousClose + "\n" +
                        "**52 Week High**: $" + stonk.week52High + "\n" +
                        "**52 Week Low**: $" + stonk.week52Low + "\n"
                },
            )
        message.channel.send({ embed: embed1 });
    }
}