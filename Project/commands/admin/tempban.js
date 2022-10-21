const { fetchLanguage } = require('../../modules/server.js');
const { tempbanMember } = require('../../modules/admin.js');
const { RichEmbed } = require('discord.js');
const ms = require('ms');

module.exports.run = (bot, message, args) => {
    if (!message.mentions.members.first() && !args[0]) return message.channel.send(":x: Mention or define a username.")
    if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(":x: Sorry, I'm not permitted to do that. (I need ban members permission)")

    var time = args[1]
    if(!args[1]) return message.channel.send(":x: Please define how long you will ban. (1h, 2m, 1d)") // If theres an argument
    if(!ms(time)) return message.channel.send(":x: Please define how long you will ban. (1h, 2m, 1d)") // If it follows the time.

    function tempbanUser(user) {
        if(!user) return message.channel.send(":x: Invalid member.")
        tempbanMember(bot, message, user, (ms(time)/1000), args.slice(2).join(' ')) // Send the tempban.
    }

    var findUser;
    if (!message.mentions.members.first()) {
        tempbanUser(message.guild.members.find(member => member.user.username.toLowerCase().search(args[0].toLowerCase()) !== -1)) // If the user is foudn with the serach.
    } else {
        tempbanUser(message.mentions.members.first()) // Tempban the mentioned user.
    }
}

module.exports.config = {
    command: "tempban", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: [], // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: ["BAN_MEMBERS"], // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: true,

    // help
    description: "Bans the user for a specific time.", // Description of the command, used in "help" command.
    usage: "tempban <username/mention> <time> [reason]" // Explains to the user 
}