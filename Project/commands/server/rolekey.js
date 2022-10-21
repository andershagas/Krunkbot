const { RichEmbed } = require("discord.js");
const { setServerPrefix, fetchLanguage } = require('../../modules/server.js');

exports.run = (bot, message, args) => {
    const L1 = fetchLanguage(message.guild.id)
    const embed = new RichEmbed()
    embed.setTitle("Krunkbot role-key")
    embed.setDescription(`Role-key for Krunkbot is automatic. This command is only for users with "manage roles" in your server.\n\nIf you have the word "role-key" case-insensetive in your message, Krunkbot will scan your message and detect the role-key you have stated. It's used in the below example but you can also read this:\nrole-key\n\n:MyEmoji:: "My Admin Role"\n\n**ALERT!** You can only use custom emojis and some other emojis. If certain emojis don't work, try with a custom emoji that you upload.`)
    embed.setImage("https://i.gyazo.com/e66adb33f9f0e79ffcfed0ef5b0a2ba6.gif")
    embed.setTimestamp()
    embed.setFooter(L1["forsupport"] + "https://discord.gg/ESY6SrG " + L1["forsupport2"])
    embed.setColor("BLUE")
    message.channel.send(embed)
}

module.exports.config = {
    command: "rolekey", // Full command name
    aliases: ["rk"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Shows how to use role-key.", // Description of the command, used in "help" command.
    usage: "rolekey" // Explains to the user 
}