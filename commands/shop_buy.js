const { SlashCommandBuilder } = require('discord.js');
//require schema
const {balances, sellers, sequelize} = require('../userSchema');
//require embed template
const embeds = require('../embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop_buy')
		.setDescription('Buy land from the player shop.')
        .addIntegerOption(option =>
            option.setName('listing_number')
            .setDescription("The number of the listing")
            .setRequired(true)
        ),
        
	async execute(interaction) {
        const userId = "<@"+interaction.user.id+">";
		let balance = await balances.findOne({ where: { userId: userId}});

		const listingNumber = interaction.options.getInteger("listing_number");
        let seller = await sellers.findOne({ where: {id: listingNumber} });

        

        if (!seller) {
            return interaction.reply("Please input a valid listing number.")
        }

        let price = seller.get("listingPrice");
        let landToBeSold = seller.get("landAmount");

        if (!balance) {
            return interaction.reply(`Could not find tag ${userId}. They might not have created an account.`);
        }
        else if (balance.get('balance') < price) {
            return interaction.reply('Not enough funds to buy this listing.');
        }

        
        
        await balance.update({balance: balance.get('balance') - price, land: balance.get('land') + landToBeSold});
        let embed = embeds.makeUserEmbed(balance);
        seller.destroy({truncate: true, restartIdentity: true});
        return interaction.reply({content: `You have bought ${landToBeSold} :park: of land for the price of ${price} :seedling: .`, embeds: [embed]});
	},
};