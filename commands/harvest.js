const { SlashCommandBuilder } = require('discord.js');
//require schema
const {balances} = require('../userSchema');
//require embed template
const embeds = require('../embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('harvest')
		.setDescription("Gives the user one seed per block of land."),

	async execute(interaction) {
		// equivalent to: UPDATE tags (description) values (?) WHERE name='?';
		const userId = "<@"+interaction.user.id+">";
		let balance = await balances.findOne({ where: { userId: userId}});

		if (balance) {

			let harvestedSeeds = balance.get('land');
			let newBalance = balance.get('balance') + harvestedSeeds;
			if (balance.get("land") <= 0) {
				newBalance = balance.get("balance") + 1;
				await balance.update({ balance: newBalance });
				return interaction.reply("You have no land, but you found 1 seed in the ground, you lucky rascal!")
			}
        	await balance.update({ balance: newBalance });

			let embed = embeds.makeUserEmbed(balance);
			embed.setTitle(`You have harvested ${harvestedSeeds.toString()} seeds`)
			return interaction.reply({embeds: [embed]});
		}
			return interaction.reply(`Could not find tag ${userId}. They might not have created an account.`);
	},
};