const mongoose = require("mongoose");
const Discord = require('discord.js');
let Level = require("../models/check.js");
var membern = 0;
const profilepic = process.env.profilepic;
const mongopw = process.env.mongo;
module.exports.run = async (client, message) => {
  
    await await mongoose.connect(`mongodb+srv://${mongopw}?retryWrites=true&w=majority`, { useNewUrlParser: true , useUnifiedTopology: true});

    await Level.countDocuments(function (err, count) {
        if (count>=10){
        membern = 10;
        }
        else{
        membern = count;
        }
  });
  await Level.find({}).sort([['checkcount', -1]]).exec(function (err, items) {
      var arr = field(items, membern); 
      message.channel.send({embed: {
          color: 0x00FF80,
          author: {
            name: client.user.username,
            icon_url: profilepic 
          },
          title: "Checkin ranking of the server",
          fields: arr,
          timestamp: new Date(),
          footer: {
            icon_url: profilepic ,
          }
        }
      }).then(mongoose.disconnect()).catch(err =>{
        console.log(err);
        message.channel.send("<@108561995606827008>, Error")
    });;
  });
}

function field(items, n){
  var arr = [];
  for(var i = 0; i< n; i++){
    var item = {  
      name:  `#${i+1}, ${items[i].checkcount} days`,
      value: items[i].name
    }
    arr.push(item);
  }
  return arr; 
}

