const { fetchLanguage } = require('../../modules/server.js');
const { kickMember } = require('../../modules/admin.js');
const { RichEmbed } = require('discord.js');

module.exports.run = (bot, message, args) => {
    if (!message.mentions.members.first() && !args[0]) return message.channel.send(":x: Mention or define a username.")
    if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send(":x: Sorry, I'm not permitted to do that.")

    function kickUser(user) {
        if(!user) return message.channel.send(":x: Invalid member.")
        kickMember(bot, message, user, args.slice(1).join(' ')) // Send the kick.
    }

    var findUser;
    if (!message.mentions.members.first()) { // If user isn't mentioned.
        kickUser(message.guild.members.find(member => member.user.username.toLowerCase().search(args[0].toLowerCase()) !== -1)) // Search for the user case insensetive.
    } else {
        kickUser(message.mentions.members.first()) // Kick the mentioned user
    }
}

module.exports.config = {
    command: "kick", // Full command name
    aliases: ["remove"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: [], // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: ["KICK_MEMBERS"], // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: true,

    // help
    description: "Kicks the user.", // Description of the command, used in "help" command.
    usage: "kick <username/mention> [reason]" // Explains to the user 
}