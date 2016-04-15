// [modules]
const TelegramBot = require('node-telegram-bot-api');
const TGBotConfig = require('./config');
const TGBotGroup = require('./groups');
const TGBotUsers = require('./users');

class TGBotSDK {

	constructor(token, options = {}) {
		this.bot = new TelegramBot(token, options);
		this.groups = new TGBotGroup();
		this.config = new TGBotConfig();
		this.users = new TGBotUsers();
		this.userFunctions = null;
	}

	setBotMenu(TGBotMenu) {
		this.botMenu = TGBotMenu.makeMenu();
	}
}

module.exports.TGBotSDK = TGBotSDK;