const { createsession } = require("../../modules/support.js")
const { fetchLanguage } = require('../../modules/server.js');

exports.run = (bot, message, args) => {
    var L1 = fetchLanguage(message.guild.id)
    if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(":x: "+L1["denyguildmanageronly"]);
    if(!args[0]) return message.channel.send(":x: " + L1["describehelp"])
    createsession(bot, message, args.join(" "))
}

module.exports.config = {
    command: "callsupport", // Full command name
    aliases: ["cs"], // Aliases of command.
    enable: false, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Sends a messsage to the support", // Description of the command, used in "help" command.
    usage: "callsupport <describe waht you need help with>" // Explains to the user 
}