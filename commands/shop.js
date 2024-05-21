const { SlashCommandBuilder } = require('discord.js');
//require schema
const {balances, sellers} = require('../userSchema');
//require embed template
const embeds = require('../embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Player shop listings.'),
        
	async execute(interaction) {
		let embedList = await embeds.makeSellerList(sellers);
		let sellerCount = await sellers.count();
		if (sellerCount <= 0) {
			return interaction.reply("Shop is empty :(");
		}
        return interaction.reply({ embeds: embedList });
	},
};