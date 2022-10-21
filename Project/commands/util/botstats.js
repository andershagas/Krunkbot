const { RichEmbed } = require('discord.js');
const versionfile = require("../../update.json");
const { fetchLanguage } = require('../../modules/server.js');

module.exports.run = async (bot, message, args) => {
    const L1 = fetchLanguage(message.guild.id)
    var embed = new RichEmbed()
    embed.setTitle(L1["kstats"])
    embed.addField(`**${L1["servers"]}**`,`${L1["servers2"]} **${bot.guilds.size}** ${L1["servers3"]}`)
    embed.addField(`**${L1["users"]}**`, `${L1["users2"]} **${bot.users.size.toLocaleString()}** ${L1["users3"]}`)
    embed.addField(`**${L1["version"]}**`, `${L1["version2"]} **${versionfile.currentversion}**${L1["version3"]}`)
    embed.addField(`**${L1["location"]}**`, L1["location2"])
    embed.addField(`**${L1["developer"]}**`, `${L1["developer2"]} ReturnVoidex#0001, TimLaz#6084 & Iniquity#2313${L1["developer3"]}`)
    embed.setColor("#e8941e");
    embed.setFooter(L1["forsupport"] + "https://discord.gg/ESY6SrG " + L1["forsupport2"])
    message.channel.send(embed)
}

module.exports.config = {
    command: "botstats", // Full command name
    aliases: ["bs"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Displays some stats of the bot", // Description of the command, used in "help" command.
    usage: "botstats" // Explains to the user 
}