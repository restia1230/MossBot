exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id); 
    if(!fetched){
        return message.channel.send("There isn't any music playing right now");
    }

    let queue = fetched.queue;
    let nowPlaying = queue[0]; 
    let res = `__**Now playing**__:\n${nowPlaying.songTitle}| Requested by: ${nowPlaying.requester} \n\n__**Queue**__:\n`;

    for(var i = 1; i < queue.length; i++){
        res += `${i}. ${queue[i].songTitle} | Requested by: ${queue[i].requester}\n`; 
    }
    message.channel.send(res);

}