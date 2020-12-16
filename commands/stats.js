const mongoose = require("mongoose");
const level = require("../models/level.js");
const mongopw = process.env.mongolvl;
const Discord = require('discord.js');
const profilepic = process.env.profilepic;
const { CanvasRenderService } = require("chartjs-node-canvas");

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function embedAll(items1, items2, embed1, client, message, items3) {
    var serverlen = Math.min(items1.length, 5)
    var memlen = Math.min(items2.length, 7)
    var memlist = [];
    var memcount = [];
    embed1
        .setColor('#00FF80')
        .setAuthor(client.user.username, profilepic)
        .setTitle(`${message.guild.name}'s Channel Statistics`)
    var lab1;
    var lab2;
    if (items3 == "msg") {
        embed1.setDescription(`\n Message count since the creation of the server. \n`)
        var serverReport = "";
        for (var i = 0; i < serverlen; i++) {
            serverReport = serverReport + `\`#${i + 1}\` <#${items1[i].discordID}>: \`${numberWithCommas(items1[i].chatcount)} messages\` \n`
        }
        var userReport = "";
        for (var i = 0; i < memlen; i++) {
            userReport = userReport + `\`#${i + 1}\` <@${items2[i].discordID}>: \`${numberWithCommas(items2[i].chatcount)} messages\` \n`
            memlist.push(items2[i].name);
            memcount.push(items2[i].chatcount);
        }
        embed1.addFields(
            {
                name: '**Channel Message Count**',
                value: `${serverReport}\n`
            },
            {
                name: '**User Message Count**',
                value: `${userReport} \n`
            }
        )
        lab1 = "# of Messages (Bar)";
        lab2 = "# of Messages (Line)";
    }
    else {
        var afklen = Math.min(items3.length, 7);
        embed1.setDescription(`\n Voice statistics since Dec 15, 2020. \n`);
        var serverReport = "";
        for (var i = 0; i < 2; i++) {
            var hr = Math.floor(items1[i].minutes / 60);
            var minute = items1[i].minutes % 60;
            var hrO = `${hr} Hours`;
            var minuteO = `${minute} Minutes`;
            if (hr == 0) {
                hrO = "";
            }
            if (minute == 0) {
                minuteO = "";
            }
            serverReport = serverReport + `\`#${i + 1}\` <#${items1[i].discordID}>: \`${hrO} ${minuteO}\` \n`
        }
        var TalkReport = "";
        for (var i = 0; i < memlen; i++) {
            var hr = Math.floor(items2[i].minutes / 60);
            var minute = items2[i].minutes % 60;
            var hrO = `${hr} Hours`;
            var minuteO = `${minute} Minutes`;
            if (hr == 0) {
                hrO = "";
            }
            if (minute == 0) {
                minuteO = "";
            }
            TalkReport = TalkReport + `\`#${i + 1}\` <@${items2[i].discordID}>: \`${hrO} ${minuteO}\` \n`
            memlist.push(items2[i].name);
            memcount.push(items2[i].minutes);
        }
        var AFKReport = "";
        for (var i = 0; i < afklen; i++) {
            var hr = Math.floor(items3[i].afk / 60);
            var minute = items3[i].afk % 60;
            var hrO = `${hr} Hours`;
            var minuteO = `${minute} Minutes`;
            if (hr == 0) {
                hrO = "";
            }
            if (minute == 0) {
                minuteO = "";
            }
            AFKReport = AFKReport + `\`#${i + 1}\` <@${items3[i].discordID}>: \`${hrO} ${minuteO}\` \n`
        }
        embed1.addFields(
            {
                name: '**Voice Channel Ranking**',
                value: `${serverReport}\n`
            },
            {
                name: `**Time in Talk Shack**`,
                value: `${TalkReport} \n`
            },
            {
                name: `**Time in Snooze Zone**`,
                value: `${AFKReport} \n`
            }
        )
        
        lab1 = "Minutes in Talk Shack (Bar)";
        lab2 = "Minutes in Talk Shack (Line)";
    }
    embed1
        .setFooter('!stats')
        .setTimestamp()


    
    const width = 1200;
    const height = 800;
    var type = '';
    type = 'bar';
    const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => { });
    const image = await canvasRenderService.renderToBuffer({
        type: type,
        data: {
            labels: memlist,
            datasets: [{
                label: lab1,
                data: memcount,
                backgroundColor: [
                    'rgba(190, 236, 151, 0.5)',
                    'rgba(190, 236, 151, 0.5)',
                    'rgba(190, 236, 151, 0.5)',
                    'rgba(190, 236, 151, 0.5)',
                    'rgba(190, 236, 151, 0.5)',
                    'rgba(190, 236, 151, 0.5)',
                    'rgba(190, 236, 151, 0.5)'
                ],
                borderColor: [
                    'rgba(190, 255, 151, 1)',
                    'rgba(190, 255, 151, 1)',
                    'rgba(190, 255, 151, 1)',
                    'rgba(190, 255, 151, 1)',
                    'rgba(190, 255, 151, 1)',
                    'rgba(190, 255, 151, 1)',
                    'rgba(190, 255, 151, 1)'
                ],
                borderWidth: 1
            }, {
                label: lab2,
                data: memcount,
                backgroundColor: [
                    'rgba(239, 151, 151, 0.2)',
                    'rgba(239, 151, 151, 0.2)',
                    'rgba(239, 151, 151, 0.2)',
                    'rgba(239, 151, 151, 0.2)',
                    'rgba(239, 151, 151, 0.2)',
                    'rgba(239, 151, 151, 0.2)',
                    'rgba(239, 151, 151, 0.2)'
                ],
                borderColor: [
                    'rgba(239, 151, 151, 1)',
                    'rgba(239, 151, 151, 1)',
                    'rgba(239, 151, 151, 1)',
                    'rgba(239, 151, 151, 1)',
                    'rgba(239, 151, 151, 1)',
                    'rgba(239, 151, 151, 1)',
                    'rgba(239, 151, 151, 1)'
                ],
                borderWidth: 1,
                type: 'line'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        fontSize: 16,
                        fontColor: 'rgba(190, 255, 151, 1)'
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: false,
                        fontSize: 16,
                        fontColor: 'rgba(190, 255, 151, 1)'
                    }
                }]
            }
        }
    });
    const attachment = new Discord.MessageAttachment(image, "image.png");
    embed1.attachFiles(attachment);
    embed1.setImage("attachment://image.png");
    return embed1;
}





module.exports.run = async (client, message, args) => {

    if (args == "msg") {
        await mongoose.connect(mongopw);
        var embed1 = new Discord.MessageEmbed();
        var items1 = await level.find({ type: 0 }).sort([['chatcount', -1]]);
        var items2 = await level.find({ type: 1 }).limit(7).sort([['chatcount', -1]])
        await embedAll(items1, items2, embed1, client, message, "msg");
        message.channel.send(embed1);
        mongoose.connection.close();
    }
    else if (args == "voice") {
        await mongoose.connect(mongopw);
        var embed1 = new Discord.MessageEmbed();
        var items1 = await level.find({ type: 0 }).sort([['minutes', -1]]);

        var items2 = await level.find({ type: 1 }).sort([['minutes', -1]]).limit(7);
        var items3 = await level.find({ type: 1 }).sort([['afk', -1]]).limit(7);
        await embedAll(items1, items2, embed1, client, message, items3);
        await message.channel.send(embed1);
        mongoose.connection.close();
    }
    else {
        const embed1 = new Discord.MessageEmbed()
            .setColor('#00FF80') // Set the color for the side pannel
            .setTitle('MossBot - stats') // set the title
            .setThumbnail(profilepic)
            .setAuthor('MossBot', profilepic) // set the author, the profile picture on the right and the link for them
            .addFields(
                {
                    name: 'Commands', value:
                        "**!stats msg**: Display statistics for messages\n" +
                        "**!stats voice**: Display statistics for voice\n"
                }
            )
            .setTimestamp()
        message.channel.send({ embed: embed1 }).catch(console.error);
    }
}