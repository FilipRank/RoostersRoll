const { SlashCommandBuilder } = require('discord.js');
//require schema
const {balances} = require('../userSchema');
//require embed template
const embeds = require('../embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('account')
		.setDescription("Check a user's account.")
        .addStringOption(option => 
            option.setName('user_tag')
            .setDescription("The user's tag. Ping the user.")
            .setRequired(true)
        ),

	async execute(interaction) {

		const userId = interaction.options.getString('user_tag');

		const balance = await balances.findOne({ where: { userId: userId } });

		if (balance) {
			let embed = embeds.makeUserEmbed(balance);
			return interaction.reply({embeds: [embed]});
		}	
			return interaction.reply(`Could not find tag ${userId}. They might not have created an account.`);

	},
};