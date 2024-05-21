const { SlashCommandBuilder } = require('discord.js');
//require schema
const {balances} = require('../userSchema');
//require embed template
const embeds = require('../embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy_land')
		.setDescription("The user buys land at a price of 5 seeds per block.")
		.addIntegerOption(option => 
				option.setName("amount")
				.setDescription("The amount of blocks of land to buy.")
				.setRequired(true)
		),

	async execute(interaction) {
		// equivalent to: UPDATE tags (description) values (?) WHERE name='?';
		const userId = "<@"+interaction.user.id+">";
		let balance = await balances.findOne({ where: { userId: userId}});

		let landToBuyAmount = interaction.options.getInteger("amount");
		let price = landToBuyAmount * 5;

		if (balance) {
			if (balance.get('balance') < price) {
				return interaction.reply("This account doesn't have enough funds to buy this much land.")
			}
			let newBalance = balance.get('balance') - price;
        	await balance.update({ balance: newBalance });
			let newLand = balance.get('land') + landToBuyAmount;
			await balance.update({ land: newLand });

			let embed = embeds.makeUserEmbed(balance);
			embed.setTitle(`You have bought ${landToBuyAmount.toString()} block(s) of land.`)
			return interaction.reply({embeds: [embed]});		
		}
		return interaction.reply(`Could not find tag ${userId}. They might not have created an account.`);
		
	},
};