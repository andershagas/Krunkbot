const { RichEmbed } = require('discord.js');
const { fetchLanguage } = require('../../modules/server.js');
const { krunker, OrderByMapTypes, MapsNotFoundError } = require("../../modules/krunker.js");
const Krunker = new krunker();

module.exports.run = async (bot, message, args) => {
    const alert = new RichEmbed()
        .setTitle("Service Alert")
        .setColor("RED")
        .setDescription("**This command is disabled.** Due to recent updates from Krunker, discord bots can no longer recieve information from Krunker's social websocket. This is done on purpose and it would be appreciated if y'all alerted us before breaking sweep systems and ruining alot of free community effort. #BringTheBotsBack")

    return message.channel.send(alert)
    const L1 = fetchLanguage(message.guild.id)
    if (!args[0]) return message.channel.send(":x: " + L1["definesearchterm"])
    try {
        message.channel.send(":arrows_counterclockwise: Loading mods..").then(async msg => {
            const results = await Krunker.GetUserMods(args.slice(0).join(' ')) // Get maps in what order.
            const embed = new RichEmbed()
            embed.setTitle("User Mods for " + args.slice(0).join(' '))
            if(results.length !== 0) {
                results.forEach(mod => {
                    if(results.length > 24) {
                        for (i = 0; i <= 24; i++) {
                            embed.addField(mod.mod_name, `${mod.mod_votes} ${bot.emojis.get("654587738074644500")} ` + (mod.mod_featured ? bot.emojis.get("647261507666837535") : ""))
                        }
                    } else {
                        embed.addField(mod.mod_name, `${mod.mod_votes} ${bot.emojis.get("654587738074644500")} ` + (mod.mod_featured ? bot.emojis.get("647261507666837535") : ""))
                    }
                })
            } else {
                embed.setDescription("No mods found.")
                embed.setColor("RED")
            }
            embed.setTimestamp()
            msg.edit(embed)
        })


    } catch (e) {
        console.log(e)
        if (e instanceof MapsNotFoundError)
            message.channel.send(":x: Sorry, I could not find mods for that user.")
        else
            message.channel.send(":x: " + L1["mapserror"])
    }
}

module.exports.config = {
    command: "usermods", // Full command name
    aliases: ["mods"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Get a list of the users mod.", // Description of the command, used in "help" command.
    usage: "mods <username>" // Explains to the user 
}