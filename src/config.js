"use strict";
class TGBotConfig {
	constructor() {
		this.servers = {};
	}

	setParam(param, value) {
		this[param] = value;
		return true;
	}

	getParam(param) {
		return this[param];
	}

	addServer(name, params) {
		this.servers[name] = params;
	}

	addServerApi(name, params) {
		if(!this.servers.hasOwnProperty(name)) {
			this.addServer(name, {});
		}
		this.servers[name]["api"] = params;
		return true;
	}

	getServer(name) {
		if(!this.servers.hasOwnProperty(name)) return null;
		return this.servers[name];
	}

	getServerApi(name) {
		if(!this.servers.hasOwnProperty(name)) return null;
		if(!this.servers[name].hasOwnProperty("api")) return null;
		return this.servers[name].api;
	}
}

module.exports = TGBotConfig;