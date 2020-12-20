const fetch = require('node-fetch');

exports.run = async (client, message, args, ops) => {
    fact = await fetch('https://uselessfacts.jsph.pl/random.json?language=en').then(res => res.json()).catch(err => {
        return message.channel.send("Result not found.")
    });
    var result = fact.text.replace("`", "\`")
    message.channel.send(result);
}