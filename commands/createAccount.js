const { SlashCommandBuilder } = require('discord.js');
//require schema
const {balances} = require('../userSchema');
//require embed template
const embeds = require('../embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create_account")
        .setDescription('Creates a new account. Action can only be done once.'),

	async execute(interaction) {

        const interactionUser = await interaction.guild.members.fetch(interaction.user.id)

		let userId = "<@" + interactionUser.id + ">";
		let userNickname = interaction.user.username;

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			let balance = await balances.create({
				userId: userId,
				userNickname: userNickname,
				balance: 0,
				land: 4
			});

			let embed = embeds.makeUserEmbed(balance);
			embed.setTitle("Account created!");
			return interaction.reply({ embeds: [embed] });
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That account already exists.');
			}
            
			console.error(error);
            console.log(userId + " | " + userNickname);
			return interaction.reply('Something went wrong with adding this account.');
		}
	}
}