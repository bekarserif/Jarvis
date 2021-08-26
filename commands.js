
const choochoo = require('./commands/choochoo');
const commands = {
    choochoo,
};

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