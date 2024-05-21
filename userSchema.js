// Require Sequelize
const Sequelize = require('sequelize');
// Sqlite stuff
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const balances = sequelize.define('balance', {
	userId: {
		type: Sequelize.STRING,
		unique: true
	},
	userNickname: {
		type: Sequelize.STRING,
		unique: false
	},
	balance: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false
	},
	land: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false
	}
});

const sellers = sequelize.define('sellers', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	userId: {
		type: Sequelize.STRING,
		unique: false
	},
	userNickname: {
		type: Sequelize.STRING,
		unique: false
	},
	listingPrice: {
		type: Sequelize.INTEGER,
		unique: false,
		allowNull: false
	},
	landAmount: {
		type: Sequelize.INTEGER,
		unique: false,
		allowNull: false
	}
});

module.exports = {balances, sellers, sequelize};