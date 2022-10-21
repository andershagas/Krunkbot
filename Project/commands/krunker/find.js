const { RichEmbed } = require('discord.js');
const { fetchLanguage } = require('../../modules/server.js');
const { krunker } = require("../../modules/krunker.js");
const items = require("../../Items.json");

var guntype = {
    0: "Melee Item",
    1: "Sniper Rifle",
    2: "Assault Rifle",
    4: "Submachine Gun",
    5: "Revolver",
    6: "Shotgun",
    7: "Light Machine Gun",
    8: "Semi-Auto",
    9: "Rocket Launcher",
    10: "Akimbo Uzi",
    15: "Famas",
}

var cosmetictype = {
    1: "Head Item",
    2: "Back Item"
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

exports.run = async (bot, message, args) => {
    const alert = new RichEmbed()
        .setTitle("Service Alert")
        .setColor("RED")
        .setDescription("**This command is disabled.** Due to recent updates from Krunker, discord bots can no longer recieve information from Krunker's social websocket. This is done on purpose and it would be appreciated if y'all alerted us before breaking sweep systems and ruining alot of free community effort. #BringTheBotsBack")

    return message.channel.send(alert)
    const L1 = fetchLanguage(message.guild.id)
    var arg = args.join(" ");
    if (arg) {
        var first;
        var rest = [];
        for (var i = 0; i < 449; i++) {
            var tab = items[i];
            if ((items[i].name.toUpperCase()).match(arg.toUpperCase())) {
                if (first == null) {
                    first = tab;
                } else {
                    rest.push(tab.name + " - " + tab.id);
                }

            }
        }
        if (first) {
            const embed = new RichEmbed();
            embed.setTitle(L1["kitemfinder"]);
            if (!first.type) {
                embed.setThumbnail("https://krunker.io/textures/previews/weapons/weapon_" + first.weapon + "_" + first.id + ".png");
            } else if (first.type == 1 || first.type == 2) {
                embed.setThumbnail("https://krunker.io/textures/previews/cosmetics/" + first.type + "_" + first.id + ".png");
            } else if (first.type == 3) {
                embed.setThumbnail("https://krunker.io/textures/previews/melee/melee_" + first.weapon + first.id + ".png");
            }

            embed.setColor(raritycolor[first.rarity]);
            embed.setTimestamp();
            embed.addField("**" + first.name + "**", L1["id"] + first.id + "\n" + L1["type"] + guntype[first.weapon] + "\n" + L1["rarity"] + itemrarity[first.rarity]);
            if(first.creator) {
                embed.addField("**Creator**", first.creator)
            }

            //
            if (rest.length > 0) {
                var restname = ""
                var maxlength = 30;
                var maxforlength = rest.length <= maxlength ? rest.length : maxlength;
                for (var i = 0; i < maxforlength; i++) {
                    restname += "\n" + rest[i];
                }
                if (rest.length > maxlength) {
                    restname += "\n" + L1["moreitems"] + Number(rest.length - maxlength) + L1["moreitems2"];
                }
                embed.addField(L1["otheritems"] + arg + L1["otheritems2"], restname);
            }
            message.channel.send(embed);
            return 0;
        }
        const embed = new RichEmbed(); // If the search returned no results.
        embed.setTitle(L1["kitemfinder"]);
        embed.setThumbnail("https://image.spreadshirtmedia.com/image-server/v1/compositions/T175A1PA2962PT17X45Y79D1024344140FS1525/views/1,width=500,height=500,appearanceId=1/krunker-logo-mens-jersey-t-shirt.jpg")
        embed.setColor("RED");
        embed.setTimestamp();
        embed.addField(L1["noitemfound"], L1["namesearchedfail"]);
        message.channel.send(embed);

    } else { // If there's no search variable.
        const embed = new RichEmbed();
        embed.setTitle(L1["kitemfinder"]);
        embed.setThumbnail("https://image.spreadshirtmedia.com/image-server/v1/compositions/T175A1PA2962PT17X45Y79D1024344140FS1525/views/1,width=500,height=500,appearanceId=1/krunker-logo-mens-jersey-t-shirt.jpg")
        embed.setColor("RED");
        embed.setTimestamp();
        embed.addField(L1["find"], L1["needsearch"]);
        message.channel.send(embed);
    }
}

module.exports.config = {
    command: "find", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Displays a list of one or more weapons aswell as an image", // Description of the command, used in "help" command.
    usage: "find <item>" // Explains to the user 
}