exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id); 
    if(!fetched){
        return message.channel.send("There isn't any music playing in the channel right now");
    }
    if(message.member.voice.channel !== message.guild.me.voice.channel){
        return message.channel.send("Sorry you aren't in the same channel as the bot"); 
    }
    if(fetched.dispatcher.paused) return message.channel.send("The music is already paused!"); 
    fetched.dispatcher.pause(); 
    message.channel.send("Successfully paused the music"); 
}