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

	groupListToMenuObject(onSelectItem) {
		sdk = this.sdk;
		var list = [];
		var botGroups = this.groups.list;
		for (var group in botGroups) {
			if (botGroups.hasOwnProperty(group)) {
				var stupidMethodToPreventErrors = function(group) {
					var regex = new RegExp(botGroups[group].name.toLowerCase()+" list","i");
					var obj = {cmd_regex: regex, name: botGroups[group].name+' list', info: 'Update '+botGroups[group].alias+' list for this bot.', icon: sdk.config.getParam("icons").update, AL: 2, call: function(msg) {
						onSelectItem(msg, group, callback);
					}};
					list.push(obj);
				};
				stupidMethodToPreventErrors(group);
			}
		}
		return list;
	}
}

module.exports = TGBotGroup;