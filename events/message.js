const active = new Map();
const Discord = require('discord.js');
const fs = require("fs");

function getDirectories() {
	return fs.readdirSync('./commands').filter(function subFolder(file) {
		return fs.statSync('./commands/' + file).isDirectory();
	});
}

module.exports = (client, message) => {
  // Ignore all bots
  if (message.author.bot) return;


  // Reaction to messages without prefix


  // Our standard argument/command name definition.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  
  const cmd = client.commands.get(command);


  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;
  let ops = {
    active: active
  }

  // Run the command
  cmd.run(client, message, args, ops);
};