require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const TOKEN = process.env.TOKEN;
const fs = require("fs");
const config = require("./config.json");
client.config = config;

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventName = new String(file.split(".")[0]);
    if (eventName.valueOf() !== "reacts" && eventName.valueOf() !== "level" && eventName.valueOf() !== "messageReactionAdd" && eventName.valueOf() !== "messageReactionRemove") {
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
const MIN_INTERVAL = 1000 * 60 *5;
client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
  setInterval(function () {
    var currentdate = new Date();
    if (currentdate.getHours() == 14 && currentdate.getMinutes() >= 30 && currentdate.getMinutes() < 35) {
      client.channels.cache.get('608862609927569445').send('Good Morning Kings 👑');
    }
  }, MIN_INTERVAL)
});

