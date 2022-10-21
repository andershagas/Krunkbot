const languageManager = require("../..")
const { warnMember } = require('../../modules/admin.js');

module.exports.run = (bot,message,args) => {
    var reason = args.slice(1).join(' ');
    message.delete()

    function warnUser(user) {
        if (!user) return message.channel.send(":x: I had issues to find that user. Try again?")
        warnMember(bot, message, user, message.guild.id, reason) // Send warning
    }

    var findUser;
    if (!message.mentions.members.first()) { // If theres no mention, search for user.
        try {
            warnUser(message.guild.members.find(member => member.user.username.toLowerCase().search(args[0].toLowerCase()) !== -1))
        } catch(e) {
            return message.channel.send(":x: I could not find that user.")
        }
        
    } else {
        warnUser(message.mentions.members.first()) // Warn the mentioned user.
    }
}

module.exports.config = {
    command: "warn", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: [], // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: ["MANAGE_MESSAGES"], // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: true,

    // help
    description: "Gives the user a warning.", // Description of the command, used in "help" command.
    usage: "warn <user> <reason>" // Explains to the user 
}