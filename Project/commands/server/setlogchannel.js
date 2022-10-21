const { setlogchannel, resetlogchannel, fetchLanguage } = require('../../modules/server.js');

exports.run = (bot, message, args) => {
    var L1 = fetchLanguage(message.guild.id)
    if(args[0]) {
        if(args[0].toLowerCase() == "disable") {
            resetlogchannel(message.guild.id)
            message.channel.send(":ballot_box_with_check: Removed log channel. Admin commands now disabled.")
        } else {
            return message.channel.send(":x: Invalid argument. Try `disable` or just leave the command by itself.")
        }
    } else {
        setlogchannel(message.guild.id, message.channel.id) // Sets the log channel to that server.
        message.channel.send(":ballot_box_with_check: Set " + message.channel.name + " for bot logs.")
    }
}

module.exports.config = {
    command: "setlogchannel", // Full command name
    aliases: ["setlogschannel"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: [], // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: ["MANAGE_GUILD"], // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false, //[123850789184602112], user can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: true,

    // help
    description: "Sets a channel in the server for bot to log admin actions.", // Description of the command, used in "help" command.
    usage: "setlogchannel [disable]" // Explains to the user 
}