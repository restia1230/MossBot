const { API, } = require('nhentai-api');
const api = new API();

const profilepic = process.env.profilepic;


module.exports.run = async (client, message, args) => {

    if (!args.length) {
        return message.channel.send('You need to supply a search term!');
    }
    var query = message.content.substring(9);
    if (query.match(/^[0-9]+$/) && query.length == 6) {
        try {
            api.getBook(query).then(book => {
                var a = api.getImageURL(book.cover);    // https://t.nhentai.net/galleries/987560/cover.jpg
                
                message.channel.send(`https://nhentai.net/g/${query}/\n` + a)
            });
        }
        catch {
            message.channel.send("Invalid Search!");
        }
    }
    else {
        var pagen = 1;
        if (query.includes("> ")) {
            var query3 = query.split("> ");
            query = query3[1];
            pagen = Number(query3[0])
        }
        var query2 = query.replace(" ", ",");
        var searchResult = await api.search(query2, pagen).then();
        //console.log(searchResult)
        var books1 = searchResult.books;
        var dict1 = {};
        var c = 0;
        for (item in books1) {
            dict1[c] = books1[item].favorites;
            c++;
        }
        //Object.keys(dict1).reduce((a, b) => dict1[a] > dict1[b] ? a : b);
        var items = Object.keys(dict1).map(function (key) {
            return [key, dict1[key]];
        });

        // Sort the array based on the second element
        items.sort(function (first, second) {
            return second[1] - first[1];
        });

        // for (i in items){
        //     console.log(items[i])
        // }
        var arr = field(items, books1)
        // for(item in items){
        //     console.log(books1[item[0]].id)
        // }

        message.channel.send({
            embed: {
                color: 0x00FF80,
                author: {
                    name: client.user.username,
                    icon_url: profilepic
                },
                title: `Search Result for ${query}`,
                description: `Page: ${pagen} of ${searchResult.pages}`,
                fields: arr,
                timestamp: new Date(),
                footer: {
                    icon_url: profilepic,
                    text: "List created at"
                }
            }
        }).catch(err => {
            console.log(err);
            message.channel.send("<@108561995606827008>, Error")
        });;
    }
}

function field(items, books1) {
    var arr = [];
    count = 0
    for (i in items) {
        var title = "n/a";
        if (books1[items[i][0]].title["english"] != null) {
            title = books1[items[i][0]].title["english"];
        }
        var item = {
            name: `#${count + 1}, ${books1[[items[i][0]]].id}`,
            value: `Title: ${title}\n` +
                `Favorites: ${books1[[items[i][0]]].favorites}\n` +
                `[Link](https://nhentai.net/g/${books1[[items[i][0]]].id})`
        }
        count++;
        arr.push(item);
        if (count == 6) {
            break;
        }
    }
    return arr;
}