const { RichEmbed } = require('discord.js');
const { fetchLanguage } = require('../../modules/server.js')
const { krunker, UserNotFoundError } = require("../../modules/krunker.js");
const Krunker = new krunker();
const fs = require('fs');

exports.run = async (bot, message, args) => {
    /*const alert = new RichEmbed()
        .setTitle("Service Alert")
        .setColor("RED")
        .setDescription("**This command is disabled.** Due to recent updates from Krunker, discord bots can no longer recieve information from Krunker's social websocket. This is done on purpose and it would be appreciated if y'all alerted us before breaking sweep systems and ruining alot of free community effort. #BringTheBotsBack")

    return message.channel.send(alert)*/
    L1 = fetchLanguage(message.guild.id)
    Object.keys(require.cache).forEach(function (key) {
        if (key.search("clan-colors") !== -1) {
            delete require.cache[key]
        }
    });
    var clancolors = require("../../resource/clan-colors.json")
    if (!args[0]) return message.channel.send(":x: Please give me a clan name.")
    message.channel.send(`${bot.emojis.get("626065835764613120")} Getting clan info...`).then(async msg => {
        const clan = await Krunker.GetClaninfo(args[0]) // Searches for the clan.
        /*
        Expected result if clan exists:
        clan_id
        clan_name
        clan_score
        members: [
            {
                player_name (string), player_score (number)
            }
        ]
        creatorname
        */

        if (!clan) {
            const embed = new RichEmbed()
            embed.setTitle("Clan not found")
            embed.addField("404 not found", "Sorry, I couldn't find that clan. Try again with different capitalization or make sure krunker is working. If problem persists, contact bot dev.")
            embed.setFooter(L1["forsupport"] + "https://discord.gg/ESY6SrG " + L1["forsupport2"])
            embed.setColor("RED")
            embed.setTimestamp()
            msg.edit(embed)
        } else {
            // Data found, make awesome embed.
            var defaultcolor = "GREY"

            clancolors.forEach(color => {
                if (clan.clan_name == color.name) {
                    defaultcolor = color.color
                }
            })
            const embed = new RichEmbed()
            embed.setTitle(clan.clan_name + ` (Id: ${clan.clan_id})`)
            embed.setDescription(`Clan info for \`${clan.clan_name}\``)
            embed.addField("Owner:", clan.creatorname)
            embed.addField("Score:", clan.clan_score)
            embed.addField("Member count:", clan.members.length)

            clan.members.sort((a, b) => (a.s < b.s) ? 1 : -1)
            if (clan.members.length > 5) {
                embed.addField("Top 5 members", clan.members.slice(0, 5).map(member => `${clan.members.indexOf(member) + 1} - ` + member.p + `: ${member.s}`))
            } else {
                embed.addField(`Top ${clan.members.length} members`, clan.members.map(member => `${clan.members.indexOf(member) + 1} - ` + member.p + `: ${member.s}`))
            }

            embed.setFooter(L1["forsupport"] + "https://discord.gg/ESY6SrG " + L1["forsupport2"])
            embed.setTimestamp()
            embed.setColor(defaultcolor)
            msg.edit(embed)
        }
    })

}

module.exports.config = {
    command: "claninfo", // Full command name
    aliases: ["clan"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Gets the clan info", // Description of the command, used in "help" command.
    usage: "claninfo <clanname>" // Explains to the user 
}