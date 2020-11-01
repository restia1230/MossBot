const Discord = require('discord.js');
const profilepic = process.env.profilepic;

module.exports.run = async (client, message, args) => {
    const embed1 = new Discord.MessageEmbed()
        .setColor('#00FF80') // Set the color for the side pannel
        .setTitle('MossBot') // set the title
        .setThumbnail(profilepic)
        .setAuthor('MossBot', profilepic) // set the author, the profile picture on the right and the link for them
        .addFields(
            { name: 'Commands', value: 
            "**!checkin**: Checkin for the day, available 9:30am to 10:30am\n"+
            "**!ranking**: Display checkin ranking for the server\n"+
            "**!stock**: Display search result of inputted stock symbol\n"+
            "(i.e. !stock AMD)\n"+
            "\n"+
            "\n" }
        )
        .setTimestamp()
        message.channel.send({embed:embed1}).catch(console.error);
}