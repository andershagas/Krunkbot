const { fetchLanguage } = require('../../modules/server.js');
const { RichEmbed } = require('discord.js');
const fs = require('fs');

module.exports.run = async (bot, message, args) => {
    const alert = new RichEmbed()
        .setTitle("Service Alert")
        .setColor("RED")
        .setDescription("**This command is disabled.** Due to recent updates from Krunker, discord bots can no longer recieve information from Krunker's social websocket. This is done on purpose and it would be appreciated if y'all alerted us before breaking sweep systems and ruining alot of free community effort. #BringTheBotsBack")

    return message.channel.send(alert)
    // Permission check //
    const sweepAdmin = require("../../sweepAdmin.json")

    var pass = false;
    var exists = false;
    await sweepAdmin.forEach(permission => {
        if (permission.serverid == message.guild.id) {
            exists = true
            if (message.author.id == permission.adminid) {
                pass = true;
            }
        }
    })

    if (pass == true) {
        const embed = new RichEmbed()
        embed.setTitle(`Manager List for ${message.guild.name}`)
        embed.setTimestamp()
        await sweepAdmin.forEach(permission => {
            if (permission.serverid == message.guild.id) {
                permission.managers.forEach(managerId => {
                    embed.addField(message.guild.members.get(managerId) ? message.guild.members.get(managerId).displayName : `Not in server`, "Id:" + managerId)
                })
            }
        })
        message.channel.send(embed)
    } else if (exists == true) {
        // deny permission
        console.log("deny")
    } else {
        return message.channel.send(":x: Sorry, this server is not setup for this feature. Contact one of the KrunkBot staff through `k!invite`.")
    }
    // Permission check end //
}

module.exports.config = {
    command: "managers", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: false,

    // help
    description: "Shows all sweep managers.", // Description of the command, used in "help" command.
    usage: "managers" // Explains to the user 
}