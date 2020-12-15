const mongoose = require("mongoose");
const level = require("../../models/level.js");
const mongopw = process.env.mongolvl;

async function add(client, message) {
    var membadd = new level({
        _id: mongoose.Types.ObjectId(),
        discordID: message.author.id,
        name: message.author.username,
        chatcount: 1,
        minutes: 0,
        type: 1
    })
    await membadd.save().catch(err => console.log(err));
    return;
}

async function update(item, client, message) {
    item.chatcount++;
    item.type = 1;
    await item.save().catch(err => console.log(err));
    return;
}

async function channelAdd(client, message) {
    var membadd = new level({
        _id: mongoose.Types.ObjectId(),
        discordID: message.channel.id,
        name: message.channel.name,
        chatcount: 1,
        minutes: 0,
        type: 0
    })
    await membadd.save().catch(err => console.log(err));
    return;
}


async function channelUpdate(item, client, message) {
    item.chatcount++;
    item.type = 0;
    await item.save().catch(err => console.log(err));
    return item.chatcount;
}

module.exports.run = async (client, message) => {
    await mongoose.connect(mongopw);
    if (message.author != null) {
        await level.findOne({ discordID: message.author.id }, async function (err, items) {
            if (!items) {
                await add(client, message);
            }
            else {
                await update(items, client, message);
            }
        });

        await level.findOne({ discordID: message.channel.id }, async function (err, items) {
            if (!items) {
                await channelAdd(client, message);
            }
            else {
                curr = await channelUpdate(items, client, message);
            }
        });


        await mongoose.connection.close();
    }
}