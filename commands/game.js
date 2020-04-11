exports.run = (client, message, args, user, channel, self) => {
    client.game().then(function(channel) {
        let game = channel.game
        client.say(channel, `@${user.username} - Mushroom is playing ${game} right now. He's a bot.`)
    })
}