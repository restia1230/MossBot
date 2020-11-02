exports.run = async (client, message, args, ops) => {
    var currentdate = new Date();
    console.log(currentdate.getMinutes())
    console.log(currentdate.getHours())
    if (currentdate.getMinutes() == 53) {
        client.channels.cache.get('763584898564882492').send('Good Morning Kings 👑');
    }
}