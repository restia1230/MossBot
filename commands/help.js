const Discord = require('discord.js');
const profilepic = process.env.profilepic;

module.exports.run = async (client, message, args) => {
    var query = message.content.substring(6);
    if (!args.length) {
        const embed1 = new Discord.MessageEmbed()
        .setColor('#00FF80') // Set the color for the side pannel
        .setTitle('MossBot Help') // set the title
        .setThumbnail(profilepic)
        .setAuthor('MossBot', profilepic) // set the author, the profile picture on the right and the link for them
        .addFields(
            {
                name: 'Commands', value:
                    "**!checkin**: Checkin for the day, available 9:30am to 10:30am\n" +
                    "**!ranking**: Display checkin ranking for the server\n" +
                    "**!stock**: Display search result of inputted stock symbol\n" +
                    "(i.e. !stock AMD)\n" +
                    "\n" +
                    "**!help nhentai**: Help page for nhentai commands\n" +
                    "\n"
            }
        )
        .setTimestamp()
        message.channel.send({ embed: embed1 }).catch(console.error);
    }
    else if (query="nhentai"){
        const embed1 = new Discord.MessageEmbed()
        .setColor('#00FF80') // Set the color for the side pannel
        .setTitle('MossBot Help - nhentai') // set the title
        .setThumbnail(profilepic)
        .setAuthor('MossBot', profilepic) // set the author, the profile picture on the right and the link for them
        .addFields(
            {
                name: 'Commands', value:
                    "**!nhentai ID**: ID needs to be provided in 6 digit number\n" +
                    "(i.e. !nhentai 177013)\n" +
                    "**!nhentai search term**: Enter ther search term for result of default page 1\n" +
                    "(i.e. !nhentai metamorphosis)\n" +
                    "**!help page number> search term**: Go to specified result page for the inputted search term\n" +
                    "(i.e. !nhentai 2> metamorphosis, display 2nd page of the result)\n" +
                    "\n"
            }
        )
        .setTimestamp()
        message.channel.send({ embed: embed1 }).catch(console.error);
    }
}