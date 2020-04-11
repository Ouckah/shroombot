const tmi = require('tmi.js')
var channelName = "ReallyMushroom"

// Command prefix
var prefix = "!"

// Define configuration options
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

// Create a bot client
const client = new tmi.client(options)

// Connect the bot to Twitch
client.connect();

// Handler registration
client.on('connected', onConnectedHandler)
client.on('chat', onChatHandler)

// List of known commands
let commands = { ping }

function ping (client, message, args, user, channelName, self) {
    client.ping().then(function(data) {
        let ping = Math.floor(Math.round(data*1000))
        client.say(channelName, `@${user.username} - My ping is ${ping} ms`)
    }
)}
// Handler declarations
function onConnectedHandler (address, port) {
    client.action(channelName, 'Hello, Shroom Bot is now connected.')
}

function onChatHandler (channelName, user, message, self) {

    // If message from self ignore
    if (self) return;

    // If message doesn't start with prefix it is not a command
    if(message.substr(0, 1) !== prefix) {

        let sender = user['display-name']

    // If message does start with prefix check commands folder
    } else {

        // Chops of the "args" after the command 
        const args = message.slice(prefix.length).trim().split(/ + /g)
        
        // Takes away the first word in the args
        const cmd = args.shift().toLowerCase();

        // If command is a known command execute it
        if (cmd in commands) {
            const command = commands[cmd]

            command(client, message, args, user, channelName, self)

            console.log(`* EXECUTED_COMMAND : ${cmd} command for ${user.username}`)
        } else {
            console.log(`* ERROR : Unknown command "${cmd}" from ${user.username}`)
        }
    } 
}