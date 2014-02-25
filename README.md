`bmo`
=

`bmo` is a plugin-based Jabber bot. In development.

Requirements
=

- node.js
- an XMPP account for `bmo` to connect to
- Redis

Installation
=

Download the repo and `npm install` the dependencies. Install plugins into the `node_modules` folder. The copy the `config.json.example` file to `config.json` and edit with your Jabber information. Then `node bmo` to run the bot.

Plugins
=

- [System](https://github.com/stevestreza/bmo-plugin-system) for doing ping and uptime

Usage
=

Each plugin has one or more names associated with it (e.g. "system" for the [system](https://github.com/stevestreza/bmo-plugin-system) plugin). Plugins can either have one function, or multiple functions which all have their own names. After the names you can type whatever message you want, and the plugin can handle it appropriately.

Writing Plugins
=

*TODO*

Uses
=

- [junction](https://github.com/jaredhanson/junction)
- [node-xmpp](https://github.com/node-xmpp/node-xmpp)

