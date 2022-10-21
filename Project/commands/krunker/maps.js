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
    switch (args[0].toLowerCase()) { // Change to the weird search types krunker has
        case "popular":
            order = OrderByMapTypes.Popular
            break;
        case "hot":
            order = OrderByMapTypes.Hot
            break;
        case "newest":
            order = OrderByMapTypes.Newest
            break;
        default:
            order = OrderByMapTypes.Popular // Default
            break;
    }
    try {
        message.channel.send(":arrows_counterclockwise: " + L1["loadingmaps"]).then(async msg => {
            const results = await Krunker.GetMaps(order) // Get maps in what order.
            const embed = new RichEmbed()
            embed.setTitle(L1["kmaps"])

            for (let i = 0; i < 25; i++) {
                if (order == "recent") {
                    embed.addField("**" + results[i].map_name + "** **(#" + results[i].map_id + ") \n", L1["mapsstat_votes"] + results[i].map_votes + "\n" + L1["lbstat_creator"] + results[i].creatorname)
                } else if (order == "votes") {
                    embed.addField("**" + results[i].map_name + " **(#" + results[i].map_id + ") \n", L1["mapsstat_votes"] + results[i].map_votes + "\n" + L1["lbstat_creator"] + results[i].creatorname)
                } else if (order == "newest") {
                    embed.addField("**" + results[i].map_name + " **(#" + results[i].map_id + ") \n", L1["mapsstat_votes"] + results[i].map_votes + "\n" + L1["lbstat_creator"] + results[i].creatorname)
                }
                if (i == 24) {
                    embed.setThumbnail("https://image.spreadshirtmedia.com/image-server/v1/compositions/T175A1PA2962PT17X45Y79D1024344140FS1525/views/1,width=500,height=500,appearanceId=1/krunker-logo-mens-jersey-t-shirt.jpg")
                    embed.setColor("RED")
                    embed.setFooter(L1["forsupport"] + "https://discord.gg/ESY6SrG " + L1["forsupport2"])
                    msg.edit(embed)
                }
            }
        })


    } catch (e) {
        console.log(e)
        if (e instanceof MapsNotFoundError)
            message.channel.send(":x: Sorry, I could not find any maps for that user.")
        else
            message.channel.send(":x: " + L1["mapserror"])
    }
}

module.exports.config = {
    command: "maps", // Full command name
    aliases: ["map", "m"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Get a list of maps", // Description of the command, used in "help" command.
    usage: "maps <popular|hot|newest>" // Explains to the user 
}