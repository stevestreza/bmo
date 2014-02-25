var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");

var config = JSON.parse(fs.readFileSync("config.json"));

var dataDirectory = module.exports.data_path || path.normalize(path.join(process.env.HOME, ".bmo"));
mkdirp.sync(dataDirectory);
config.dataDirectory = dataDirectory;

var modulesDataDirectory = path.join(dataDirectory, "modules");
mkdirp.sync(modulesDataDirectory);
config.modulesDataDirectory = modulesDataDirectory;

module.exports = config;