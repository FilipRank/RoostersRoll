const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sayhi')
		.setDescription('Says hi.'),
	async execute(interaction) {
		await interaction.reply("Hello!");
	},
};