const { setLanguage, fetchLanguage } = require('../../modules/server.js');
const fs = require('fs');

exports.run = (bot, message, args) => {
    var L1 = fetchLanguage(message.guild.id)
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(":x: " + L1["notallowedcommand"])
    var guildid = message.guild.id
    if (!args[0]) return message.channel.send(":x: " + L1["pleaseselectlang"])
    if (!fs.existsSync("./translations/" + args[0] + ".json")) return message.channel.send(":x: "+L1["langnoexist"]) // If the language exists
    setLanguage(guildid, args[0]) // Sets the server language
    L1 = fetchLanguage(message.guild.id)
    message.channel.send(L1["successlanguage"])

}

module.exports.config = {
    command: "setlang", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Sets the language for the bot in the current server", // Description of the command, used in "help" command.
    usage: "setlang <language>" // Explains to the user 
}