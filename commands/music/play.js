const ytdl = require('ytdl-core');
const search = require('yt-search');

exports.run = async (client, message, args, ops) => {

    // if (!message.member.voice.channel) return message.channel.send('Please join a voice channel first!')

    if (!args[0]) return message.channel.send('Please enter valid title or url!');

    let validate = await ytdl.validateURL(args[0]);

    if (!validate){
        searchTitle(client, message, args[0], ops);
    }else{
        checkData(client, message, args[0],ops);    
    }
}

async function checkData(client, message, url, ops){
    let info = await ytdl.getInfo(url);
    let data = ops.active.get(message.guild.id) || {};
    if (!data.connection) data.connection = await message.member.voice.channel.join();
    if (!data.queue) data.queue = [];
    data.guildID = message.guild.id;
    data.queue.push({
        songTitle: info.videoDetails.title,
        requester: message.author.username,
        url: url,
        announceChannel: message.channel.id
    });
    if (!data.dispatcher) play(client, ops, data).catch(err => console.log(err));
    else {
        message.channel.send(`Added To Queue: ${info.videoDetails.title} | Requested By: ${message.author.username}`);
    }
    ops.active.set(message.guild.id, data);
}


async function searchTitle(client, message, title , ops){
    search(title, async function (err, r){
        if(err) return message.channel.send('Sorry, something went wrong'); 
        let videos = r.videos.slice(0, 10); 
        let resp = ''; 
        var count = 0;
        for await (var video of videos) {
            resp += `[${count+1}]: ${video.title}\n`;
            count++;
        }
        var embed = {embed: {
            color: 0x00FF80,
            title: `Choose a number between 1-${videos.length}, or enter **0** to quit the menu`,
            description: resp
            }
        }
        message.channel.send(embed);
        const filter = m => !isNaN(m.content) && m.content < videos.length+1&& m.content >0; 
        const collector = message.channel.createMessageCollector(filter, {time: 15000}); 
        collector.videos = videos; 
        collector.once('collect', function(m){
            if(m == 0 || m == '0'){
                collector.stop();
                return; 
            }
            url = this.videos[parseInt(m.content)-1].url; 
           
            checkData(client, message, url, ops);
            return;
        })
        collector.once('end ', function(m){
            return message.channel.send('Your number selection has timed out, please use !play command again.');
        })
    });
}


async function play(client, ops, data) {
    console.log(data.queue);
    client.channels.cache.get(data.queue[0].announceChannel).send(`Now Playing: ${data.queue[0].songTitle} | Requested By: ${data.queue[0].requester}`)
    data.dispatcher = await data.connection.play(ytdl(data.queue[0].url, {filter: "audioonly"}));
    data.dispatcher.guildID = data.guildID
    data.dispatcher.once('finish', function() {
        finish(client, ops, data);
    });
}

function finish(client, ops, dispatcher) {
    let fetched = ops.active.get(dispatcher.guildID);

    fetched.queue.shift();

    if (fetched.queue.length > 0) {
        ops.active.set(dispatcher.guildID, fetched);

        play(client, ops, fetched);
    } else {
        ops.active.delete(dispatcher.guildID);
        let vc = client.guilds.cache.get(dispatcher.guildID).me.voice.channel;
        if (vc) vc.leave();
    }
}