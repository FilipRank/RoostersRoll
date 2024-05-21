const { SlashCommandBuilder } = require('discord.js');
//require schema
const {balances, sellers} = require('../userSchema');
//require embed template
const embeds = require('../embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop_sell')
		.setDescription("Sell land on the public user market.")
		.addIntegerOption(option => 
				option.setName("listing_price")
				.setDescription("Total price at which the listing is sold at.")
				.setRequired(true)
		)
		.addIntegerOption(option => 
				option.setName("land_amount")
				.setDescription("The amount of blocks of land to sell.")
				.setRequired(true)
		),

	async execute(interaction) {
		// equivalent to: UPDATE tags (description) values (?) WHERE name='?';
		const userId = "<@"+interaction.user.id+">";

		let balance = await balances.findOne({ where: { userId: userId}});

		if (balance) {
			let listingPrice = interaction.options.getInteger("listing_price");
			let landAmount =  interaction.options.getInteger("land_amount");

			if (balance.get("land") < landAmount) {
				return interaction.reply(`You do not have ${landAmount} blocks of land.`);
			}

			let seller = await sellers.create({
				userId: userId,
				userNickname: balance.get("userNickname"),
				listingPrice: listingPrice,
				landAmount: landAmount
			});

			await balance.update( { land: balance.get("land") - landAmount } );
			let embed = embeds.makeUserEmbed(balance);
			return interaction.reply({content: `You have listed ${seller.get("landAmount")} :park: of land for the price of ${seller.get("listingPrice")} :seedling:.`, embeds: [embed]})
		}
		return interaction.reply(`Could not find tag ${userId}. They might not have created an account.`);
		
	},
};