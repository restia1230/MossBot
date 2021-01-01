exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id); 
    if(!fetched){
        return message.channel.send("There isn't any music playing in the channel right now");
    }
    if(message.member.voice.channel !== message.guild.me.voice.channel){
        return message.channel.send("Sorry you aren't in the same channel as the bot"); 
    }
    if(!fetched.dispatcher.paused) return message.channel.send("The music isn't paused!"); 
    fetched.dispatcher.resume(); 
    message.channel.send("Successfully resumed the music"); 
}