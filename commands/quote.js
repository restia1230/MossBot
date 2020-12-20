

const fetch = require('node-fetch');

exports.run = async (client, message, args, ops) => {
    quote = await fetch('https://api.quotable.io/random').then(res => res.json()).catch(err => {});
    var quote1= quote.content;
    var author = quote.author;
    
    message.channel.send(`${quote1} - **${author}**`);
}