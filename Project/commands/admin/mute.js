const { fetchLanguage } = require('../../modules/server.js');
const { muteMember } = require('../../modules/admin.js');
const { RichEmbed } = require('discord.js');
const ms = require('ms');

module.exports.run = (bot, message, args) => {
    if (!message.mentions.members.first() && !args[0]) return message.channel.send(":x: Mention or define a username.")
    if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(":x: Sorry, I'm not permitted to do that. (I need manage roles permission)")

    var time = args[1]
    if(!ms(time)) return message.channel.send(":x: Please define how long you will mute. (1h, 2m, 1d)") // If it follows the ms() requirement.

    function muteUser(user) {
        if(!user) return message.channel.send(":x: Invalid member.")
        muteMember(bot, message, user, (ms(time)/1000), args.slice(2).join(' ')) // Send the mute.
    }

    var findUser;
    if (!message.mentions.members.first()) { // If the user isn't mentioned.
        muteUser(message.guild.members.find(member => member.user.username.toLowerCase().search(args[0].toLowerCase()) !== -1)) // Search for the user case-insensetive.
    } else {
        muteUser(message.mentions.members.first()) // Mute mentioned user.
    }
}

module.exports.config = {
    command: "mute", // Full command name
    aliases: ["silence"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: [], // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: ["MANAGE_MESSAGES"], // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: true,

    // help
    description: "Mutes the user for a specific time.", // Description of the command, used in "help" command.
    usage: "mute <username/mention> <time> [reason]" // Explains to the user 
}