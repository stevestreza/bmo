var fs = require("fs");
var path = require("path");

var async = require("async");
var junction = require("junction");
var nstore = require("nstore");
var mkdirp = require("mkdirp");

var config = require("./config");

var Plugin = {plugins: {}};
Plugin.register = function() {
	var last = arguments[arguments.length - 1];
	var names = Array.apply(null, arguments); 
	names.splice(arguments.length - 1);

	for (var idx = 0; idx < names.length; idx++) {
		if (typeof last == "function") {
			Plugin.plugins[names[idx]] = last;
		} else {
			for (var key in last) {
				Plugin.plugins[names[idx] + " " + key] = last[key];
			}
		}
	}
};

Plugin.handleStanza = function(stanza) {
	if (stanza.body) {
		var args = stanza.body.split(' ');
		var handler = null;
		if (args.length > 1) {
			var longKey = args[0] + " " + args[1];
			if (Plugin.plugins[longKey]) {
				handler = Plugin.plugins[longKey];
				args.splice(0, 2);
			}
		}

		if (!handler && args.length > 0) {
			var key = args[0];
			if (Plugin.plugins[key]) {
				handler = Plugin.plugins[key];
				args.splice(0, 1);
			}
		}

		var responder = function(message) {
			var msg = new junction.elements.Message(stanza.from);
			msg.c('body', {}).t(message);
			stanza.connection.send(msg);
		};
		if (handler) {
			args.push(responder);
			handler.apply(null, args);
		} else {
			responder("Unknown command");
		}
	}
};

Plugin.loadPlugins = function(app, cb) {
	var pluginFolder = path.resolve("node_modules");
	fs.readdir(pluginFolder, function (err, modules) {
		async.forEach(modules, function (module, cb) {
			if (module.indexOf("bmo-") == 0) {
				var modulePath = path.join(pluginFolder, module);
				Plugin.loadPlugin(modulePath, app, cb);
			} else {
				cb();
			}
		}, cb);
	});
};

Plugin.loadPlugin = function(modulePath, app, cb) {
	var packageJSONPath = path.join(modulePath, "package.json");
	fs.readFile(packageJSONPath, function(err, data) {
		var packageJSON = JSON.parse(data);

		var mainJS = packageJSON.main;
		var store = nstore.new(path.join(config.modulesDataDirectory, packageJSON.name), function() {});

		var plugin = require(path.join(modulePath, mainJS));
		plugin(app, store);

		cb();
	});
};

module.exports = Plugin;