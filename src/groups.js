"use strict";
Array.prototype.unique = function () {
	var a = this;
	return Array.from(new Set(a));
}

class TGBotGroup {

	constructor(sdk = null) {
		this.list = {};
		this.sdk = sdk;
	}

	create(name, members, level, alias = '') {
		if(alias == '') alias = name;
		if(this.list.hasOwnProperty(name)) {
			return this.addMembersToGroup(name, members);
		} else {
			var isSameLevel = false;
			var params = Object.getOwnPropertyNames(this.list);
			for(var i=0; i<params.length; i++) {
				if(this.list[params[i]].level == level) {
					isSameLevel = true;
					break;
				}
			}
			if(isSameLevel) {
				for(var i=0; i<params.length; i++) {
					if(this.list[params[i]].level>=level) this.list[params[i]].level++;
				}
			}
			this.list[name] = {
				members: members,
				level: level,
				alias: alias
			};
			return true;
		}
	}

	addMembers(name, members) {
		if(this.list.hasOwnProperty(name)) {
			this.list[name].members = this.list[name].members.concat(members).unique();
			return true;
		} else
		return false;
	}

	groupListToMenuObject() {
		var list = [];
		var botGroups = ufunc.sdk.groups.list;
		for (var group in botGroups) {
			if (botGroups.hasOwnProperty(group)) {
				var boolshit = function(group) {
					var regex = new RegExp(botGroups[group].name.toLowerCase()+" list","i");
					var obj = {cmd_regex: regex, name: botGroups[group].name+' list', info: 'Update '+group+' list for this bot.', icon: icons.update, AL: 2, call: function(msg) {
						getGroup(group, function() {
							var listToSend = [];
							for(var i=0; i<botGroups[group].members.length; i++) {
								if(sessionList[botGroups[group].members[i]] && sessionList[botGroups[group].members[i]].profile.username != '')
									listToSend.push('@'+sessionList[botGroups[group].members[i]].profile.username + ' ['+botGroups[group].members[i]+']');
								else
									listToSend.push(botGroups[group].members[i]);
							}
							sessionList[msg.from.id].menu_url = [];
							bot.sendMessage(msg.from.id, "You are "+sessionList[msg.from.id].profile.user_role+'\nBot '+group+' are:\n'+listToSend.join('\n'), getKeyboard(1,msg.from.id));
						});
					}};
					list.push(obj);
				};
				boolshit(group);
			}
		}
		return list;
	}
}

module.exports = TGBotGroup;