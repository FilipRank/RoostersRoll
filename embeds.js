const { EmbedAssertions } = require('discord.js');
const Discord = require('discord.js');
const { sellers } = require('./userSchema');

//Temp embed maker
function makeUserEmbed(balance) {
	let embed = new Discord.EmbedBuilder()
				.setColor("0xF2AC13")
				.setTitle("Account Information")
				.addFields(
					{ name: 'Name:', value: balance.get("userNickname"), inline: true} ,
					{ name: 'User Tag:', value: balance.get("userId"), inline: true},
					{ name: 'Balance:', value: balance.get("balance").toString() + " :seedling:", inline: true},
					{ name: 'Blocks of land:', value: balance.get("land").toString() + " :park:", inline: true},
					{ name: 'Current Price per block:', value: "5 :seedling:", inline: true}
				)
				.setTimestamp()
				.setFooter({text: "Account information"})
	return embed;
}

async function makeSellerList(sellers) {
	const sellerCount = await sellers.count();
	let sellerList = await sellers.findAll();
	sellerList = sellerList.reverse();
	let embeds = [];
	let fields = [];
	for (let i = 0; i < sellerList.length; i++) {
		let seller = sellerList[i];
		fields.push(
			{ name: 'Seller:', value: seller.dataValues.userNickname + " :arrow_down:", inline: false },
			{ name: 'Price:', value: seller.dataValues.listingPrice + " :seedling:", inline: true },
			{ name: 'Amount of land:', value: seller.dataValues.landAmount + " :park:", inline: true },
			{ name: "Listing number:", value: seller.dataValues.id.toString(), inline: true},
			{ name: "---------------", value: '\u200B', inline: true}
		);
	}
	let pageLength = 25;
	let numberOfPages = Math.ceil(fields.length / pageLength);
	for (let i = 0; i < numberOfPages; i++) {
		embeds[i] = new Discord.EmbedBuilder()
					.setColor("88f03a")
					.setTitle("Shop")
					.setTimestamp()
					.setFooter({text: "Player store"});
		if (i < numberOfPages - 1) {
			for (let j = 0; j < pageLength; j++) {
				embeds[i].addFields(fields[j + (pageLength * i)]);
			}
		}
		else {
			for (let j = 0; j < fields.length % pageLength; j++) {
				embeds[i].addFields(fields[j + (pageLength * i)]);
			}
		}
		
	}
	return embeds;
}
module.exports = {makeUserEmbed, makeSellerList};