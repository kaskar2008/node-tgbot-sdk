"use strict";

class TGBotDefaultFunctions {
	constructor(sdk) {
		this.sdk = sdk;
	}

	showMenuForRole(tgid) {
		var commands = [];
		var sdk = this.sdk;
		for (var key in sdk.botMenu) {
			if(sdk.botMenu[key].AL <= sdk.users.userAL(tgid, sdk.groups)) {
				if(sdk.botMenu[key].info) {
					commands.push(sdk.botMenu[key]);
				}
			}
		}
		var list = ['Your role here: '+sdk.users.session[tgid].profile.user_role, 'You can:'];
		for(var i=0; i<commands.length; i++) {
			if(!commands[i].hidden)
				list.push( '['+(i+1)+'] '+( commands[i].icon ? (commands[i].icon+'  ') : '' )+commands[i].info + (commands[i].name ? ' Command: "'+commands[i].name+'"' : '') );
		}
		list = list.join('\n');
		sdk.bot.sendMessage(tgid, list, this.getKeyboard(1,tgid));
	}

	getKeyboard(state, fromId) {
		var sdk = this.sdk;
		if(state) {
			var keyboard = [];
			var currentMenu = this.getCurentMenu(fromId);
			
			for (var key in currentMenu) {
				if(currentMenu[key].AL <= sdk.users.userAL(fromId, sdk.groups)) {
					if(!currentMenu[key].hidden) {
						var icon = currentMenu[key].icon ? currentMenu[key].icon+'  ' : '';
						var btn = icon+currentMenu[key].name;
						if(currentMenu[key].sameRow)
							keyboard[keyboard.length-1].push(btn);
						else
							keyboard.push([btn]);
					}
				}
			}
			var normalMenuKeyboard = {
				reply_markup : {
					keyboard: keyboard,
					one_time_keyboard: false,
					resize_keyboard : true
				}
			};
			return normalMenuKeyboard;
		} else {
			return {
				reply_markup: {
					hide_keyboard: true
				}
			}
		}
	}

	getCurentMenu(fromId) {
		var sdk = this.sdk;
		var currentMenu = sdk.botMenu;
		var urlArr = sdk.users.session[fromId] ? sdk.users.session[fromId].menu_url : [];
		for(var i=0; i<urlArr.length; i++) {
			var menuItem = this.findMenuItem(currentMenu, urlArr[i]);
			currentMenu = menuItem.submenu;
		}
		return currentMenu;
	}

	findMenuItem(menu, name) {
		for(var item in menu) {
			if(menu[item].name == name) {
				return menu[item];
			}
		}
		return false;
	}

	onMessage(msg) {
		var sdk = this.sdk;
		msg['text'] = msg.text ? msg.text : '';
		if(msg.from) {
			if(!sdk.users.session[msg.from.id])
				sdk.users.create(msg.from.id, msg.from.username, sdk.users.findOutRole(msg.from.id, sdk.groups.list));
			var currentMenu = this.getCurentMenu(msg.from.id);
			var isInMenu = false;
			for (var key in currentMenu) {
				if(msg.photo) {
					if(currentMenu[key].file_provider == 'photo' && currentMenu[key].AL <= sdk.users.userAL(msg.from.id, sdk.groups)) {
						isInMenu = true;
						currentMenu[key].call(msg);
						break;
					}
				} else {
					var cmd = msg.text.trim();
					if(currentMenu[key].cmd_regex && currentMenu[key].cmd_regex.test(cmd) && currentMenu[key].AL <= sdk.users.userAL(msg.from.id, sdk.groups)) {
						isInMenu = true;
						currentMenu[key].call(msg);
						break;
					}
				}
			}
			if(!isInMenu) {
				sdk.bot.sendMessage(msg.from.id, "Please stick to the menu", this.getKeyboard(1,msg.from.id));
			}
		}
	}
}

module.exports = TGBotDefaultFunctions;