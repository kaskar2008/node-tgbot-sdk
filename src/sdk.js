"use strict";
// [modules]
const TelegramBot = require('node-telegram-bot-api');
const TGBotConfig = require('./config');
const TGBotGroup = require('./groups');
const TGBotUsers = require('./users');
const TGBotFunctions = require('./default-functions');

Array.prototype.unique = function () {
	var a = this;
	return Array.from(new Set(a));
}

class TGBotSDK {

	constructor(token, options = {}) {
		this.bot = new TelegramBot(token, options);
		this.groups = new TGBotGroup(this);
		this.config = new TGBotConfig();
		this.users = new TGBotUsers();
		this.functions = new TGBotFunctions();
		this.userFunctions = null;
	}

	setBotMenu(TGBotMenu) {
		this.botMenu = TGBotMenu.makeMenu();
	}
}

module.exports.TGBotSDK = TGBotSDK;