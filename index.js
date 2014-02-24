var junction = require("junction");
var config = require("./config");
var Plugin = require("./plugin");

var app = junction().use(junction.messageParser())

app.use(junction.message(function(handler) {
	handler.on('chat', function(stanza) {
		if ((!config.xmpp.requireJID || stanza.from.indexOf(config.xmpp.requireJID) == 0) && stanza.body) {
			Plugin.handleStanza(stanza);
		}
	});
}));

var connection = app.connect({ jid: config.xmpp.JID + "/bot", password: config.xmpp.password }).on('online', function() {
	console.log("BMO online.");
	this.send(new junction.elements.Presence());
});

console.log("Connecting…");

process.on('SIGINT', function() {
	console.log(" Battery low. Shutdown.");
	connection.on('close', function(){
		process.exit(0);
	})
	connection.end();
});
