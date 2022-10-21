const { RichEmbed } = require('discord.js');
const { krunker } = require("../../modules/krunker.js");
const items = require("../../Items.json");
const Krunker = new krunker();
const { fetchLanguage } = require('../../modules/server.js');
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

var itemrarity = {
    6: "Unobtainable", // Yellow
    5: "Contraband", // Black
    4: "Relic", // Red
    3: "Legendary", // Gold
    2: "Epic", // Purple
    1: "Rare", // Blue
    0: "Uncommon" // Lime
}

var raritycolor = {
    6: "#FFFF33",
    5: "#292929",
    4: "#ed4242",
    3: "#FBC02D",
    2: "#E040FB",
    1: "#2196F3",
    0: "#b2f252",
}

function embededMessage(message, arg, data) {
    const embed = new RichEmbed();
    embed.setTitle(L1["kshop"]);
    embed.setThumbnail("https://image.spreadshirtmedia.com/image-server/v1/compositions/T175A1PA2962PT17X45Y79D1024344140FS1525/views/1,width=500,height=500,appearanceId=1/krunker-logo-mens-jersey-t-shirt.jpg")
    embed.setColor("GREEN");
    embed.setTimestamp();
    embed.addField("**"+L1["kshopfilter"]+"**", "**"+L1["kshopkeyword"]+"**" + arg);
    // Sort by skinindex, ascending order
    data.sort((a, b) => parseFloat(a.skinindex) - parseFloat(b.skinindex));
    var lastObj = null;
    var curMess = "";
    var fields = 0
    var round = 1
    data.forEach(obj => {
        if (fields < 24) {
            if (lastObj == null) {
                lastObj = obj;
                curMess = "**"+L1["id"]+"**" + obj.skinindex + "\n**"+L1["type"]+"** " + itemtype[items[obj.skinindex].type] + "\n**"+L1["rarity"]+"**" + itemrarity[items[obj.skinindex].rarity] + "\n";
            }
            if (obj.skinindex != lastObj.skinindex || round == data.length || curMess.length >= 960) {
                embed.addField("**" + items[lastObj.skinindex].name + "**", curMess);
                fields += 1;
                curMess = "**"+L1["id"]+"**" + obj.skinindex + "\n**"+L1["type"]+"**" + itemtype[items[obj.skinindex].type] + "\n**"+L1["rarity"]+"**" + itemrarity[items[obj.skinindex].rarity] + "\n";
            }
            curMess += "**"+L1["kshopprice"]+"** " + obj.funds + " kr";
            lastObj = obj;
        };
        round++;
    })
    message.channel.send(embed);
}

module.exports.run = async (bot, message, args) => {
    const alert = new RichEmbed()
        .setTitle("Service Alert")
        .setColor("RED")
        .setDescription("**This command is disabled.** Due to recent updates from Krunker, discord bots can no longer recieve information from Krunker's social websocket. This is done on purpose and it would be appreciated if y'all alerted us before breaking sweep systems and ruining alot of free community effort. #BringTheBotsBack")

    return message.channel.send(alert)
    L1 = fetchLanguage(message.guild.id)
    var arg = args[0]
    if (arg) { // If userid is present
        try {
            const data = await Krunker.GetUserStore(arg);
            if (data[1][2]) { // If data is recieved.
                var saleObjects = data[1][2] // These are the results that we want.
                embededMessage(message, arg, saleObjects) // Send info with it.
            } else {
                const embed = new RichEmbed();
                embed.setTitle("Krunker User Market");
                embed.setThumbnail("https://image.spreadshirtmedia.com/image-server/v1/compositions/T175A1PA2962PT17X45Y79D1024344140FS1525/views/1,width=500,height=500,appearanceId=1/krunker-logo-mens-jersey-t-shirt.jpg")
                embed.setColor("RED");
                embed.setTimestamp();
                embed.addField("**"+L1["kshopfilter"]+"**", L1["kshopkeyword"] + arg);
                embed.addField("**"+L1["noitemfound"]+"**", L1["kshopnotsale"]);
                message.channel.send(embed);
            }
        } catch (e) {
            console.log(e)
        }
    } else {
        return message.channel.send(":x: "+L1["kshopinputuserid"])
    }
}

module.exports.config = {
    command: "userstore", // Full command name
    aliases: ["us"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Gets the a list of what the user is selling", // Description of the command, used in "help" command.
    usage: "userstore <username|userid>" // Explains to the user 
}