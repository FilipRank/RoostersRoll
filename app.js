//Require Sequelize schema stuff
const {balances, sellers} = require('./userSchema');
// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');
const embeds = require('./embeds');
require('dotenv').config();
const {TOKEN} = process.env;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Fetching commands
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, () => {
    balances.sync({ force: false });
	sellers.sync({ force: true });
	console.log(`Logged in as ${client.user.tag}!`);
});

// Runs when slash command used
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	
	const { commandName } = interaction;
	const command = interaction.client.commands.get(interaction.commandName);

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(TOKEN);
