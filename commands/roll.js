exports.run = async (client, message, args, ops) => {
    var query = 6;
    try {
        query = message.content.substring(6);
        query = parseInt(query);
    }
    catch {
        query = 6;
    }
    if(isNaN(query)){
        query = 6;
    }
    message.channel.send(Math.floor(Math.random() * query) + 1);
}