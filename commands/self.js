const { SlashCommandBuilder } = require('discord.js');
//require schema
const {balances} = require('../userSchema');
//require embed template
const embeds = require('../embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('self')
		.setDescription("Check your own account"),

	async execute(interaction) {

		const userId = "<@" + interaction.user.id + ">";
		const balance = await balances.findOne({ where: { userId: userId } });

		if (balance) {
			let embed = embeds.makeUserEmbed(balance);
			return interaction.reply({embeds: [embed]});
		}	
			return interaction.reply(`Could not find tag ${userId}. They might not have created an account.`);

	},
};