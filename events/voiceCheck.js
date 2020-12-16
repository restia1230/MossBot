
const mongoose = require("mongoose");
const level = require("../models/level.js");
const mongopw = process.env.mongolvl;

async function add(client, tempID) {
    var membadd = new level({
        _id: mongoose.Types.ObjectId(),
        discordID: tempID,
        name: client.users.cache.get(tempID).username,
        chatcount: 0,
        minutes: 1,
        type: 1,
        afk: 0
    })
    await membadd.save().catch(err => console.log(err));
    return;
}

async function addA(client, tempID) {
    var membadd = new level({
        _id: mongoose.Types.ObjectId(),
        discordID: tempID,
        name: client.users.cache.get(tempID).username,
        chatcount: 0,
        minutes: 0,
        type: 1,
        afk: 1
    })
    await membadd.save().catch(err => console.log(err));
    return;
}

async function update(item, client, type1) {
    if (type1 == "Talk") {
        item.minutes++;
    }
    else if (type1 == "AFK") {
        item.afk++;
    }
    item.type = 1;
    await item.save().catch(err => console.log(err));
    return;
}

async function channelAdd(client, members) {
    var membadd = new level({
        _id: mongoose.Types.ObjectId(),
        discordID: members.id,
        name: members.name,
        minutes: 1 * members.members.size,
        type: 0,
        afk: 1
    })
    await membadd.save().catch(err => console.log(err));
    return;
}


async function channelUpdate(item, client, type1, members) {
    item.minutes = item.minutes + 1 * members.members.size;
    item.afk++;
    await item.save().catch(err => console.log(err));
}



module.exports.run = async (client) => {
    var membersTalk = client.channels.cache.get('608862609927569449');
    var membersOther = client.channels.cache.get('627316866108358668');
    var membersAFK = client.channels.cache.get('608863334250577920');
    var cases;

    if (membersOther.members.size > 0) {
        cases = 3;
    }
    else if (membersAFK.members.size > 0) {
        cases = 2;
    }
    else if (membersTalk.members.size > 0) {
        cases = 1;
    }
    if (membersTalk.members.size > 0 || membersOther.members.size > 0 || membersAFK.members.size > 0) {
        await mongoose.connect(mongopw, { poolSize: 25 });
        if (membersTalk.members.size > 0) {
            var memkey = membersTalk.members.keys();
            await level.findOne({ discordID: membersTalk.id }, async function (err, items) {
                if (!items) {
                    await channelAdd(client, membersTalk);
                }
                else {
                    await channelUpdate(items, client, "Talk", membersTalk);
                }
            });
            var count = 0;
            for await (let i of membersTalk.members) {
                var tempID = memkey.next().value;
                await level.findOne({ discordID: tempID }, async function (err, items) {
                    if (!items) {
                        await add(client, tempID);
                    }
                    else {
                        await update(items, client, "Talk");
                    }
                    count++;
                    if (count == membersAFK.members.size && cases == 1){
                        mongoose.disconnect();
                    }
                });
            }
        }
        if (membersAFK.members.size > 0) {
            var memkey = membersAFK.members.keys();
            await level.findOne({ discordID: membersAFK.id }, async function (err, items) {
                if (!items) {
                    await channelAdd(client, membersAFK);
                }
                else {
                    await channelUpdate(items, client, "AFK", membersAFK);
                }
            });
            var count = 0;
            for await (let i of membersAFK.members) {
                var tempID = memkey.next().value;
                await level.findOne({ discordID: tempID }, async function (err, items) {
                    if (!items) {
                        await addA(client, tempID);
                    }
                    else {
                        await update(items, client, "AFK");
                    }
                    count++;
                    if (count == membersAFK.members.size && cases == 2){
                        mongoose.disconnect();
                    }
                });
            }
        }
        if (membersOther.members.size > 0) {
            var memkey = membersOther.members.keys();
            await level.findOne({ discordID: membersOther.id }, async function (err, items) {
                if (!items) {
                    await channelAdd(client, membersOther);
                }
                else {
                    await channelUpdate(items, client, "Talk", membersOther);
                }
            });
            var count = 0;
            for await (let i of membersOther.members) {
                var tempID = memkey.next().value;
                await level.findOne({ discordID: tempID }, async function (err, items) {
                    if (!items) {
                        await add(client, tempID);
                    }
                    else {
                        await update(items, client, "Talk");
                    }
                    count++;
                    if (count == membersAFK.members.size && cases == 3){
                        mongoose.disconnect();
                    }
                });
            }
        }
    }
    else {
        return;
    }
}