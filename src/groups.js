"use strict";
Array.prototype.unique = function () {
	var a = this;
	return Array.from(new Set(a));
}

class TGBotGroup {

	constructor() {
		this.list = {};
	}

	create(name, members, level) {
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
				level: level
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
}

module.exports = TGBotGroup;