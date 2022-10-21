const { fetchLanguage, fetchServerPrefix } = require('../../modules/server.js');

exports.run = (bot, message, args) => {
    var L1 = fetchLanguage(message.guild.id)
    message.channel.send(L1["prefix"] + " `" + message.guild.name + "` "+L1["prefix2"]+" `" + fetchServerPrefix(message.guild.id) +"`" + L1["prefix3"])
}

module.exports.config = {
    command: "prefix", // Full command name
    aliases: ["pref"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Shows the current prefix for the server", // Description of the command, used in "help" command.
    usage: "prefix" // Explains to the user 
}