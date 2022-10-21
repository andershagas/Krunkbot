const { RichEmbed } = require('discord.js');
const { endsession } = require("../../modules/support.js")
const { fetchLanguage } = require("../../modules/server.js")

exports.run = (bot, message, args) => {
    var L1 = fetchLanguage(message.guild.id)

    var staffMembers = require("../../staff.json")
    var staffLevel = 0 // 0: normal 1: mod 2: admin 3: developer
    var staffRoles = [L1["userrank"], L1["modrank"], L1["adminrank"], L1["devrank"]]
    if (staffMembers.developers.includes(message.author.id)) {
        staffLevel = 3
    } else if (staffMembers.admins.includes(message.author.id)) {
        staffLevel = 2
    } else if (staffMembers.mods.includes(message.author.id)) {
        staffLevel = 1
    }

    if (staffLevel !== 1 && staffLevel !== 2 && staffLevel !== 3) return message.channel.send(":x: You're not permitted to run this command.");

    endsession(bot, message)
}

module.exports.config = {
    command: "closeticket", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: true, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: true,

    // help
    description: "", // Description of the command, used in "help" command.
    usage: "" // Explains to the user 
}