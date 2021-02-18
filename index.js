require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const TOKEN = process.env.TOKEN;
const fs = require("fs");
const config = require("./config.json");
const fetch = require('node-fetch');
const mongoose = require("mongoose");
const check = require("./models/check.js");
const vm = require(`./events/voiceCheck.js`);
client.config = config;
const mongopw = process.env.mongo;
const morning = process.env.morning;

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventName = new String(file.split(".")[0]);
    if (eventName.valueOf() !== "tunes" && eventName.valueOf() !== "levels" && eventName.valueOf() !== "voiceCheck") {
      const event = require(`./events/${file}`);
      client.on(eventName, event.bind(null, client));
    }
  });
});

function getDirectories() {
  return fs.readdirSync('./commands').filter(function subFolder(file) {
    return fs.statSync('./commands/' + file).isDirectory();
  });
}

client.commands = new Discord.Collection();
// Reads normal .js files in the main dir
let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// Loops through all the folders in the main dir and finds those with a .js extension
for (const folder of getDirectories()) {
  const folderFiles = fs.readdirSync('./commands/' + folder).filter(file => file.endsWith('.js'));
  for (const file of folderFiles) {
    commandFiles.push([folder, file]);
  }
}
// Takes the two different command and folder lists and requires all the commands into an array which then puts it into the collection
for (const file of commandFiles) {
  let command1;
  let commandName;
  if (Array.isArray(file)) {
    command1 = require(`./commands/${file[0]}/${file[1]}`);
    commandName = file[1].replace(".js", "");
  }
  else {
    command1 = require(`./commands/${file}`);
    commandName = file.replace(".js", "");
  }
  client.commands.set(commandName, command1);
}
client.login(TOKEN);
const MIN_INTERVAL = 1000 * 60 * 1;

client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
  setInterval(async function () {
    var currentdate = new Date();
    if (currentdate.getHours() == 13 && currentdate.getMinutes() >= 0 && currentdate.getMinutes() < 1) {
      fact = await fetch('https://uselessfacts.jsph.pl/today.json?language=en').then(res => res.json()).catch(err => {});
      var result = fact.text.replace("`", "\`")
      quote = await fetch('https://quotes.rest/qod.json').then(res => res.json()).catch(err => {});
      var quote1 = quote.contents.quotes[0].quote;
      var author = quote.contents.quotes[0].author;
      client.channels.cache.get(morning).send(`Good Morning Kings 👑 \n\n**Today's random fact is**: \n> ${result} \n\n**Quote of the day**: \n> ${quote1} - **${author}**`);
      await mongoose.connect(mongopw).catch(err => console.log("INDEX"));;
      await check.findOne({ discordID: 69 }, async function (err, items) {
        items.checkcount--;
        var dayt = currentdate.getDate();
        items.lastcheck = dayt;
        await items.save().catch(err => console.log(err));
        mongoose.connection.close();
      });
    }
    vm.run(client);
  }, MIN_INTERVAL)
});

