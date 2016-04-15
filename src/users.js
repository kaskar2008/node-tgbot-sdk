"use strict";
class TGBotUsers {
	constructor() {
		this.session = {};
	}

	find(tgid) {
		return this.session[tgid];
	}

	create(tgid, username, role = 'User') {
		if(this.find(tgid)) return this.find(tgid);
		this.session[tgid] = {
			profile: {
				user_role: role,
				username: username
			},
			menu_url: [],
			tmp_vars: {}
		};
		return this.find(tgid);
	}

	findOutRole(tgid, groups) {
		var groupList = Object.getOwnPropertyNames(groups);
		if(groupList.length == 0) return 'User';
		for(var i=0; i<groupList.length; i++) {
			if(groups[groupList[i]].members.indexOf(tgid) >= 0)
				return groupList[i];
		}
		return 'User';
	}

	userAL(tgid, groups) {
		return ( groups.list[this.session[tgid].profile.user_role] ? groups.list[this.session[tgid].profile.user_role].level : 0 );
	}
}

module.exports = TGBotUsers;