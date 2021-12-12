const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const musicCommandFiles = fs.readdirSync('./commands/music').filter(file => file.endsWith('.js'));

const commands = {};
const musicCommands = {}
for (const file of musicCommandFiles) {
    const command = require(`./commands/music/${file}`);
    const fileName = file.replace('.js', '');
    musicCommands[fileName] = command;
}


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    const fileName = file.replace('.js', '');
    commands[fileName] = command;
}



module.exports = async function gotMessage(msg, client, player) {
    try {
        if (msg.author.bot) return;
        if (!msg.content.startsWith(process.env.prefix)) return;
        
        if (msg.channel.id == '879684918655983636' || msg.channel.id == '787633893581783040') {
            let args = msg.content.split(" ");
            let command = args.shift();
            if (command.charAt(0) === process.env.prefix) {
                command = command.substring(1);
                if (isMusicCommand(musicCommands, command)) {
                    musicCommands[command]( msg, args, player );
                }
                else{
                    commands[command](msg, args);
                }
                
            }
        }
        else {
            return message.channel.send(
                "You need to send this message to bot related channel"
            );
        }
    } catch (error) {
        console.log(error);
    }

}

function isMusicCommand(object, value) {
    return Object.keys(object).find(key => key === value) === value ? true : false;
  }