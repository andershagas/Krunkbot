const { RichEmbed } = require('discord.js');
const { fetchLanguage } = require('../../modules/server.js');

module.exports.run = (bot, message, args) => {
    const embed = new RichEmbed()
    embed.setTitle("Binding your account")
    embed.setColor("#FF4800")
    embed.setDescription("To connect your account to KrunkBot, send any amount of KR to this user:\nhttps://krunker.io/social.html?p=profile&q=KrunkBotVerify\n\n**Warning!** To verify, send kr and your discord user id with the message. Make sure your dms are open for this. Please wait a few seconds before the bot dms you with info.")
    embed.setTimestamp()
    message.channel.send(embed)
}

module.exports.config = {
    command: "bindaccount", // Full command name
    aliases: ["bind"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: true, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: ["336911180054659093"],//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: false,

    // help 
    description: "Show information on how to bind your account to the bot.", // Description of the command, used in "help" command.
    usage: "bindaccount" // Explains to the user 
}