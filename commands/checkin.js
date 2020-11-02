const check = require("../models/check.js");
const mongoose = require("mongoose");
const mongopw = process.env.mongo;

async function add(client, message, daten){
    const membadd = new check({
        _id: mongoose.Types.ObjectId(),
        discordID: message.member.id,
        checkcount: 1,
        name: message.author.username, 
        lastcheck: daten
    })
    await membadd.save().catch(err => console.log(err));
    message.react('👑');
    //return(message.channel.send(`${message.author.username} successfully checked in for the first time.`));
    return;
}

async function update(item, client, message, dayt){
    if(item.lastcheck == dayt){
        return(message.channel.send(`${message.author.username} has already checked in today.`));
    }
    item.checkcount++;
    item.lastcheck = dayt;
    await item.save().catch(err => console.log(err));
    message.react('👑');
    //return(message.channel.send(`${message.author.username} successfully checked in.`));
    return;
}

exports.run = async (client, message, args, ops) => {

    var d = new Date();
    var startHappyHourD = new Date();
    startHappyHourD.setHours(9,30,0); // 5.30 pm
    var endHappyHourD = new Date();
    endHappyHourD.setHours(10,30,0); // 6.30 pm
    if(!(d >= startHappyHourD && d <=endHappyHourD )){
        return(message.channel.send("You must checkin between 9:30 am and 10:30 am"));
    }
    var dayt = d.getDate();

    
    await mongoose.connect(`mongodb+srv://${mongopw}?retryWrites=true&w=majority`);

    await check.findOne({discordID: message.author.id}, async function (err, items) {
        if (!items){
            await add(client, message, dayt);
        }
        else {
            await update(items,client,message, dayt);
        }
        mongoose.connection.close();
    });

}