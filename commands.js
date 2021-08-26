const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commands = {};
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    const fileName = file.replace('.js','');
	commands[fileName] = command;
}



module.exports = async function gotMessage(msg)
{
	if(msg.channel.id == '879684918655983636')
    {
        let tokens= msg.content.split(" ");
        let command = tokens.shift();
        if (command.charAt(0) === "!") {
            command = command.substring(1);
            // valid command   
            commands[command](msg, tokens);
        }
    }
}