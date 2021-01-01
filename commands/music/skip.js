exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id); 
    if(!fetched){
        return message.channel.send("There isn't any music playing in the channel right now");
    }
    if(message.member.voice.channel !== message.guild.me.voice.channel){
        return message.channel.send("Sorry you aren't in the same channel as the bot"); 
    }
    ops.active.set(message.guild.id, fetched); 
    message.channel.send("Successfully skipped the song!"); 
    return fetched.dispatcher.emit('finish');
}