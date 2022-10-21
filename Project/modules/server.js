const fs = require("fs");

exports.fetchServerPrefix = (serverid) => {
    const settings = require("../guild-configuration.json") // Fetch guild server config
    var prefix = null

    settings.servers.forEach(server => {
        if (server.serverid == serverid) { // Find the server config
            prefix = server.prefix // Get server prefix
        }
    })
    return prefix // Return the prefix to where the function was called.
}

exports.setServerPrefix = (serverid, prefix) => {
    const settings = require("../guild-configuration.json") // Fetch guild server config

    settings.servers.forEach(server => {
        if (server.serverid == serverid) { // Find the server config
            server.prefix = prefix // Define the server prefix.
        }
    })
    data = JSON.stringify(settings) // Save
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}

exports.setLanguage = (serverid, language) => {
    const settings = require("../guild-configuration.json") // Fetch guild server config

    settings.servers.forEach(server => {
        if (server.serverid == serverid) { // Find the server config
            server.lang = language // Define the server language.
        }
    })
    data = JSON.stringify(settings) // Save
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}

exports.fetchLanguage = (serverid) => {
    const settings = require("../guild-configuration.json") // Fetch guild server config
    var language = null

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {// Find the server config
            language = require("../translations/" + server.lang + ".json") // Get the server language and require the language.json in translations folder.
        }
    })
    return language
}

exports.addbotchannel = (serverid, channelid) => {
    const settings = require("../guild-configuration.json") // Fetch guild server config

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            server.botchannel.push(channelid)
        }
    })
    data = JSON.stringify(settings)
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}

exports.resetbotchannel = (serverid) => {
    const settings = require("../guild-configuration.json") // Fetch guild server config

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            server.botchannel = [];
        }
    })
    data = JSON.stringify(settings)
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}

exports.resetlogchannel = (serverid) => {
    const settings = require("../guild-configuration.json") // Fetch guild server config

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            server.logschannel = null;
        }
    })

    data = JSON.stringify(settings)
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}

exports.setlogchannel = (serverid, channelid) => {
    const settings = require("../guild-configuration.json") // Fetch guild server config

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            server.logschannel = channelid;
        }
    })

    data = JSON.stringify(settings)
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}