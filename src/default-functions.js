"use strict";

class TGBotDefaultFunctions {
	constructor(sdk) {
		this.sdk = sdk;
	}

	showMenuForRole(tgid) {
		var commands = [];
		for (var key in this.sdk.botMenu) {
			if(this.sdk.botMenu[key].AL <= this.sdk.users.userAL(tgid, this.sdk.groups)) {
				if(this.sdk.botMenu[key].info) {
					commands.push(this.sdk.botMenu[key]);
				}
			}
		}
		var list = ['Your role here: '+this.sdk.users.session[tgid].profile.user_role, 'You can:'];
		for(var i=0; i<commands.length; i++) {
			if(!commands[i].hidden)
				list.push( '['+(i+1)+'] '+( commands[i].icon ? (commands[i].icon+'  ') : '' )+commands[i].info + (commands[i].name ? ' Command: "'+commands[i].name+'"' : '') );
		}
		list = list.join('\n');
		this.sdk.bot.sendMessage(tgid, list, this.getKeyboard(1,tgid));
	}

	getKeyboard(state, fromId) {
		if(state) {
			var keyboard = [];
			var currentMenu = this.getCurentMenu(fromId);
			
			for (var key in currentMenu) {
				if(currentMenu[key].AL <= this.sdk.users.userAL(fromId, this.sdk.groups)) {
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
		var currentMenu = this.sdk.botMenu;
		var urlArr = this.sdk.users.session[fromId] ? this.sdk.users.session[fromId].menu_url : [];
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
		msg['text'] = msg.text ? msg.text : '';
		if(msg.from) {
			if(!this.sdk.users.session[msg.from.id])
				this.sdk.users.create(msg.from.id, msg.from.username, this.sdk.users.findOutRole(msg.from.id, this.sdk.groups.list));
			var currentMenu = this.getCurentMenu(msg.from.id);
			for (var key in currentMenu) {
				if(msg.photo) {
					if(currentMenu[key].file_provider == 'photo' && currentMenu[key].AL <= this.sdk.users.userAL(msg.from.id, this.sdk.groups)) {
						currentMenu[key].call(msg);
					}
				} else {
					var cmd = msg.text.trim();
					if(currentMenu[key].cmd_regex && currentMenu[key].cmd_regex.test(cmd) && currentMenu[key].AL <= this.sdk.users.userAL(msg.from.id, this.sdk.groups)) {
						currentMenu[key].call(msg);
						break;
					}
				}
			}
		}
	}
}

module.exports = TGBotDefaultFunctions;