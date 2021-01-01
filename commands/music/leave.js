exports.run = (client, message, args) => {
    // Check if Luna is connected to a voice channel
    if(!message.guild.me.voice.channel) return message.channel.send('MossBot is not in a voice channel!');
    // Leave Channel
    message.guild.me.voice.channel.leave();
}