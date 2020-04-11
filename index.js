const tmi = require('tmi.js')
var channelName = "ReallyMushroom"
var prefix = "!"

const options = {
    options: {
        debug: true,
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: 'ShroomStream',
        password: 'oauth:ktqdxw2e79tbje7voht3amq4vgfjbk',
    },
    channels: [channelName],
};

var theGame = ""

const client = new tmi.client(options)

client.connect();

client.on('connected', (address, port) => {
   client.action(channelName, 'Hello, Shroom Bot is now connected.')
}); 

client.on('stream-change-game', (game) => {
    theGame = game;
});

client.on('chat', (channel, user, message, self) => {
    
    if (self) return;
    let sender = user['display-name']
    
    if (user['mod'] === false && user['vip'] === false) {
        if(message.includes("www.") || message.includes(".com")){
            client.timeout(channel, sender, 30, "Hey is that a link? No links allowed!")
        }
    }

    const args = message.slice(prefix.length).trim().split(/ + /g)
    const cmd = args.shift().toLowerCase();

    try {
        let commandFile = require(`./commands/${cmd}.js`)
        commandFile.run(client, message, args, user, channel, self)
    } catch (err) {
        // client.say(channelName, "That command doesn't exist.")
        return;
    }
})