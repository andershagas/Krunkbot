const { addbotchannel, resetbotchannel, fetchLanguage } = require('../../modules/server.js');

exports.run = (bot, message, args) => {
    var L1 = fetchLanguage(message.guild.id)
    if(args[0]) {
        if(args[0].toLowerCase() == "reset") {
            resetbotchannel(message.guild.id) // Resets the bot channel for that server. Makes command usable in all channels again.
            message.channel.send(":ballot_box_with_check: Reset channels. You can now use the bot anywhere.")
        } else {
            return message.channel.send(":x: Invalid argument. Try `reset` or just leave the command by itself.")
        }
    } else {
        addbotchannel(message.guild.id, message.channel.id)
        message.channel.send(":ballot_box_with_check: Added " + message.channel.name + " to the list of channels for bot commands. If this is the first time running this, **all other channels** is now unresponsive to this bot.")
    }
}

module.exports.config = {
    command: "cmdonly", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: [], // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: ["MANAGE_GUILD"], // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false, //[123850789184602112], user can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: true,

    // help
    description: "Sets a channel in the server to only be for bot commands. (No other channel will work.)", // Description of the command, used in "help" command.
    usage: "cmdonly [reset]" // Explains to the user 
}