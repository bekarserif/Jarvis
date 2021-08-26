require('dotenv').config(); //initialize dotenv
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [];

const rest = new REST({ version: '9' }).setToken(process.env.CLIENT_TOKEN);
const commandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./slashCommands/${file}`);
	commands.push(command.data.toJSON());
}
(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
      { body: commands },
    );

    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
})();