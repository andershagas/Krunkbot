const { RichEmbed } = require('discord.js');
const { fetchLanguage } = require('../../modules/server.js');
const { krunker } = require("../../modules/krunker.js");
const items = require("../../Items.json");
const Krunker = new krunker();
var L1;

var itemtype = {
    0: "Sniper Rifle",
    1: "Submachine Gun",
    2: "Assault Rifle",
    3: "Light Machine Gun",
    4: "Shotgun",
    5: "Rocket Launcher",
    6: "Akimbo Uzi",
    7: "Semi-Auto",
    8: "Famas",
    9: "Revolver",
    10: "Melee Item",
    11: "Head Item",
    12: "Back Item"
}

var itemrarity = [
    "Uncommon", "Rare", "Epic", "Legendary", "Relic", "Contraband", "Unobtainable"
]

var raritycolor = [
    "#FFFF33", "#292929", "#ed4242", "#FBC02D", "#E040FB", "#2196F3", "#b2f252"
]

function embededMessage(message, arg, data) {
    const embed = new RichEmbed()
        .setTitle(L1["kshop"])
        .setThumbnail("https://image.spreadshirtmedia.com/image-server/v1/compositions/T175A1PA2962PT17X45Y79D1024344140FS1525/views/1,width=500,height=500,appearanceId=1/krunker-logo-mens-jersey-t-shirt.jpg")
        .setColor("GREEN")
        .setTimestamp()
        .addField(L1["kshopfilter"], "**" + L1["kshopkeyword"] + "**" + arg);
    // Sort by skinindex, ascending order
    console.log(data)
    data.forEach(obj => {
        console.log("By: " + obj.player + " | Cost: " + obj.funds + " | Weapon: " + items[obj.skinindex].name + " | Rarity: " + itemrarity[items[obj.skinindex].rarity])
    })
    message.channel.send(embed);
}

module.exports.run = async (bot, message, args) => {
    const alert = new RichEmbed()
        .setTitle("Service Alert")
        .setColor("RED")
        .setDescription("**This command is disabled.** Due to recent updates from Krunker, discord bots can no longer recieve information from Krunker's social websocket. This is done on purpose and it would be appreciated if y'all alerted us before breaking sweep systems and ruining alot of free community effort. #BringTheBotsBack")

    return message.channel.send(alert)
    if (message.guild.id !== "620304406599958539") return message.channel.send(":x: This command is disabled during to rewrite.")
    L1 = fetchLanguage(message.guild.id)
    var arg = args.join(" ");
    if (arg) {
        try {
            const data = await Krunker.GetStore(arg);
            //const embed = await 
            if (data) { // If there are sales.
                embededMessage(message, arg, data);
            } else { // If no items are returned from shop.
                const embed = new RichEmbed();
                embed.setTitle(L1["kshop"]);
                embed.setThumbnail("https://image.spreadshirtmedia.com/image-server/v1/compositions/T175A1PA2962PT17X45Y79D1024344140FS1525/views/1,width=500,height=500,appearanceId=1/krunker-logo-mens-jersey-t-shirt.jpg")
                embed.setColor("RED");
                embed.setTimestamp();
                embed.addField(L1["kshopfilter"], L1["kshopkeyword"] + arg);
                embed.addField(L1["noitemfound"], L1["kshopnotsale"]);
                message.channel.send(embed);
            }
        } catch (e) {
            console.log(e)
        }
    } else {
        try {
            const data = await Krunker.GetStore(arg);
            if (data) {
                embededMessage(message, "__**" + L1["frontpage"] + "**__", data);
            }
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports.config = {
    command: "shop", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "This is just a example command", // Description of the command, used in "help" command.
    usage: "shop [item]" // Explains to the user 
}