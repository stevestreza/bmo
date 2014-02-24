var junction = require("junction");

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

		if (handler) {
			var responder = function(message) {
				var msg = new junction.elements.Message(stanza.from);
				msg.c('body', {}).t(message);
				stanza.connection.send(msg);
			};
			args.push(responder);
			handler.apply(null, args);
		}
	}
};

Plugin.register("ping", function(respond){
	respond("pong");
});

module.exports = Plugin;