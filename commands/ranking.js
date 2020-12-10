const mongoose = require("mongoose");
const Discord = require('discord.js');
let Level = require("../models/check.js");
var membern = 0;
const profilepic = process.env.profilepic;
const mongopw = process.env.mongo;
module.exports.run = async (client, message) => {

  await mongoose.connect(`${mongopw}`);

  await Level.countDocuments(function (err, count) {
    if (count >= 10) {
      membern = 10;
    }
    else {
      membern = count;
    }
  });
  var streak = 0;
  await Level.findOne({ discordID: 69 }, async function (err, items) {
    streak = items.checkcount * (-1);
  });
  await Level.find({}).sort([['checkcount', -1]]).exec(function (err, items) {
    var arr = field(items, membern, streak);
    message.channel.send({
      embed: {
        color: 0x00FF80,
        author: {
          name: client.user.username,
          icon_url: profilepic
        },
        title: "Checkin ranking of the server",
        description:`Current Streak: ${streak} days 🔥`,
        fields: arr,
        timestamp: new Date(),
        footer: {
          icon_url: profilepic,
        }
      }
    }).then(mongoose.disconnect()).catch(err => {
      console.log(err);
      message.channel.send("<@108561995606827008>, Error")
    });;
  });
}

function field(items, n,s) {
  var arr = [];
  for (var i = 0; i < n - 1; i++) {
    var fire = '';
    if(items[i].checkcount==s && items[i].checkcount>=5){
      fire = '🔥'
    }
    var item = {
      name: `#${i + 1}, ${items[i].checkcount} days ${fire}`,
      value: items[i].name
    }
    arr.push(item);
  }
  return arr;
}

