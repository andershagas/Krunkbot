const { RichEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {
    const m = await message.channel.send(`${bot.emojis.get("626065835764613120")} Fetching latency...`)
    const embed = new RichEmbed()
    embed.setColor("PURPLE")
    embed.setTitle("Response Time")
    embed.addField('Client Latency', `${Math.floor(m.createdTimestamp - message.createdTimestamp)}ms`) // Determine time from command to the message the bot sends.
    embed.addField('API Latency', `${Math.round(bot.ping)}ms`) // Bot ping
    m.edit(embed)
}

module.exports.config = {
    command: "ping", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables t  he command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: false,

    // help
    description: "", // Description of the command, used in "help" command.
    usage: "" // Explains to the user 
}