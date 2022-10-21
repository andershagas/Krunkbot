const { fetchLanguage } = require('../../modules/server.js');
const { RichEmbed, MessageCollector } = require('discord.js');
const { setWarnAction } = require('../../modules/admin.js');

exports.run = (bot, message, args) => {
    var L1 = fetchLanguage(message.guild.id)

    var warnAmount = args[0]
    var warnAction = args[1]
    var warnValue = args[2]

    if (!parseInt(warnAmount)) return message.channel.send(":x: Incorrect warnamount was given. Please check the command syntax.") // If it's a correct number.
    if (!warnAction) return message.channel.send(":x: Incorrect warn action given. (ban, kick, mute, tempban)") // Action

    function main() {
        setWarnAction(message.guild.id, parseInt(warnAmount), warnAction, warnValue) // Sets action
        message.channel.send(":white_check_mark: If a member recieves `" + warnAmount + "` warnings, they will now recieve a `" + (warnValue ? (warnValue + "` `") : "") + warnAction + "`")
    }

    switch (warnAction) { // These checks if the warn action is correct. Makes space for custom stuff and variables aswell.
        case "ban":
            warnValue = null
            main()
            break;

        case "kick":
            warnValue = null
            main()
            break;

        case "mute":
            if (!warnValue) return message.channel.send(":x: For mute, you need an extra value. (1m, 2h, 3d)")
            main()
            break;

        case "tempban":
            if (!warnValue) return message.channel.send(":x: For tempban, you need an extra value. (1m, 2h, 3d)")
            main()
            break;

        default:
            return message.channel.send(":x: Please input a valid warn action. (ban, kick, mute, tempban)")
            break;
    }
}

module.exports.config = {
    command: "setwarns", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: [], // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: ["MANAGE_GUILD"], // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false, //[123850789184602112], user can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Changes the consequences from amount of warns.", // Description of the command, used in "help" command.
    usage: "setwarns <amount> <action> <time>" // Explains to the user 
}