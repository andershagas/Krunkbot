const languageManager = require("../..")
const { RichEmbed } = require('discord.js');

function getNumberOfTotalWarnings(userId, warnConfig) { // This searches through all warning logs and returns how many warnings the user has in total.
    var count = 0;

    warnConfig.forEach(server => {
        server.users.forEach(user => {
            if (user.userid == userId) {
                count = count + user.warnings.length
            }
        })
    })

    return "User has a total of `" + count + "` accumulated warnings in all servers."
}

function getNumberOfWarnings(serverId, userId, warnConfig) { // This checks how many warnings the user has
    count = 0;

    warnConfig.forEach(server => {
        if (server.serverid == serverId) {
            server.users.forEach(user => {
                if (user.userid == userId) {
                    count = count + user.warnings.length
                }
            })
        }
    })

    return "User has a total of `" + count + "` warnings in this server."
}

module.exports.run = (bot, message, args) => {
    const warnConfig = require("../../warnings.json")

    function lookupUser(user) {
        if (!user) return message.channel.send(":x: I had issues to find that user. Try again?")
        const embed = new RichEmbed()
        embed.setTitle("Warnings for " + user.user.username + "#" + user.user.discriminator + ".")
        embed.setColor(0x00AE86)
        embed.setDescription(getNumberOfWarnings(message.guild.id, user.id, warnConfig) + "\n\n" + getNumberOfTotalWarnings(user.id, warnConfig))
        embed.setFooter("Warnings lookup by " + message.author.username, message.author.avatarURL)
        embed.setTimestamp()
        message.channel.send(embed)
    }

    var findUser;
    if(!args[0]) return message.channel.send(":x: Please define a username you want to check the username for.")
    if (!message.mentions.members.first()) { // If there's no mention
        lookupUser(message.guild.members.find(member => member.user.username.toLowerCase().search(args[0].toLowerCase()) !== -1)) // Search for lower-case username.
    } else {
        lookupUser(message.mentions.members.first())
    }
}

module.exports.config = {
    command: "warnings", // Full command name
    aliases: ["warns"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: ["MANAGE_MESSAGES"], // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: false,

    // help
    description: "Displays current warnings for a user.", // Description of the command, used in "help" command.
    usage: "warnings <@/search>" // Explains to the user 
}