const { RichEmbed } = require('discord.js');
const { fetchLanguage } = require('../../modules/server.js');
const { krunker, UserNotFoundError } = require("../../modules/krunker.js");
const Krunker = new krunker();

module.exports.run = async (bot, message, args) => {
    const alert = new RichEmbed()
        .setTitle("Service Alert")
        .setColor("RED")
        .setDescription("**This command is disabled.** Due to recent updates from Krunker, discord bots can no longer recieve information from Krunker's social websocket. This is done on purpose and it would be appreciated if y'all alerted us before breaking sweep systems and ruining alot of free community effort. #BringTheBotsBack")

    return message.channel.send(alert)
    if (!args[0]) return message.channel.send(embed.setDescription(`Missing __orderby__. Use one __orderby__ below. \n**- Level\n- Kills\n- Wins\n- Time\n- Krunkies\n- Clans\n- 1v1\n- 2v2\n- 4v4**`));
    const L1 = fetchLanguage(message.guild.id)


    const embed = new RichEmbed()
    embed.setTitle(L1["klb"]).setColor("RED")
    var num = 0;

    if (args[1]) {
        var isnum = Number(args[1])
        if (isnum) {
            if (isnum < 1 || isnum > 10) { // Less than one or more than 10
                return message.channel.send(embed.setDescription(`Page number must be within the number range **1-10**`));
            } else {
                num = isnum - 1
            }
        } else {
            return message.channel.send(embed.setDescription(`Page number must be a number`));
        }
    }


    var order;

    switch (args[0].toLowerCase()) {
        case "funds":
        case "krunkies":
            order = "player_funds"
            break;
        case "clan":
        case "clans":
            order = "player_clan"
            break;
        case "score":
        case "level":
            order = "player_score"
            break;
        case "kills":
        case "kill":
            order = "player_kills"
            break;
        case "played":
        case "time":
        case "timeplayed":
            order = "player_timeplayed"
            break;
        case "wins":
        case "win":
            order = "player_wins"
            break;
        case "1v1":
            order = "player_elo"
            break;
        case "2v2":
            order = "player_elo2"
            break;
        case "4v4":
            order = "player_elo4"
            break;
        default:
            return message.channel.send(":x: Invalid order.")
    }

    function emoji(id) {
        return bot.emojis.get(id);//guilds.get(620304406599958539).emojis.get(id.toString());
    }

    function convert(time) {
        time = Math.floor(time / 1000);
        var min = Math.floor(time / 60 % 60);
        var hour = Math.floor(time / 60 / 60 % 24);
        var days = Math.floor(time / 60 / 60 / 24);
        min = min < 9 ? "0" + min : min;
        hour = hour < 9 ? "0" + hour : hour;
        days = days < 9 ? "0" + days : days;
        return `${days}d ${hour}h ${min}m`
    }

    var rankedEmojis = ["660387089354850325", "660387103028281374", "660387113518235658", "660387123060539416", "660387132770091008", "660387144862400512", "660387156421771283", "660387164986671114", "660387132770091008"]

    function getRankedIcon(numbero) {
        return bot.emojis.get(rankedEmojis[Math.max(Math.min(8, Math.floor((numbero || 0) / 120)), 0)])
    }

    try {
        message.channel.send(`${bot.emojis.get("626065835764613120")} Getting leaderstats...`).then(async msg => {
            const results = await Krunker.GetLeaderboard(order) // Get leaderboard results in order.
            embed.setColor("RED").setDescription(`View the leaderboard at [Krunker.io](https://krunker.io/social.html?p=leaders&q=${order})`)
            var count = 1
            str = []
            results.forEach(object => {
                var arrayp = Math.floor((count - 1) / 10);
                if (str[arrayp] == null) str[arrayp] = "";
                if (order == "player_funds") {
                    str[arrayp] += `**${count}.** ${object.player_name}${object.player_featured ? emoji("620538546368937994") : ``}${object.player_clan ? ` **[${object.player_clan}]**` : ` `}${object.player_hack ? ` __**HACKER**__` : ` `} • :moneybag: **${object.player_funds.toLocaleString()} kr**\n`
                } else if (order == "player_clan") {
                    str[arrayp] += `**${count}. [${object.clan_name}]** • ${object.clan_membercount} members ${object.clan_hackcount ? `, **${object.clan_hackcount} have hacked**` : ` `}• Creator: **${object.creatorname}** • ${emoji("630211543459561485")} **${object.clan_score.toLocaleString()}**\n`
                } else if (order == "player_score") {
                    str[arrayp] += `**${count}.** ${object.player_name}${object.player_featured ? emoji("620538546368937994") : ``}${object.player_clan ? ` **[${object.player_clan}]**` : ` `}${object.player_hack ? ` __**HACKER**__` : ` `} • ${emoji("630211543459561485")} **${object.player_score.toLocaleString()}**\n`
                } else if (order == "player_kills") {
                    str[arrayp] += `**${count}.** ${object.player_name}${object.player_featured ? emoji("620538546368937994") : ``}${object.player_clan ? ` **[${object.player_clan}]**` : ` `}${object.player_hack ? ` __**HACKER**__` : ` `} • ${emoji("630179801197445130")} **${object.player_kills.toLocaleString()}**\n`
                } else if (order == "player_timeplayed") {
                    str[arrayp] += `**${count}.** ${object.player_name}${object.player_featured ? emoji("620538546368937994") : ``}${object.player_clan ? ` **[${object.player_clan}]**` : ` `}${object.player_hack ? ` __**HACKER**__` : ` `} • :alarm_clock: **${convert(object.player_timeplayed)}**\n`
                } else if (order == "player_wins") {
                    str[arrayp] += `**${count}.** ${object.player_name}${object.player_featured ? emoji("620538546368937994") : ``}${object.player_clan ? ` **[${object.player_clan}]**` : ` `}${object.player_hack ? ` __**HACKER**__` : ` `} • :trophy: **${object.player_wins.toLocaleString()}**\n`
                } else if (order == "player_elo") {
                    str[arrayp] += `**${count}.** ${object.player_name}${object.player_featured ? emoji("620538546368937994") : ``}${object.player_clan ? ` **[${object.player_clan}]**` : ` `}${object.player_elo ? ` (${object.player_elo}) ` : ` `}${object.player_hack ? ` __**HACKER**__` : ` `} • ${getRankedIcon(object.player_elo.toLocaleString())} **${object.player_elo.toLocaleString()}**\n`
                } else if (order == "player_elo2") {
                    str[arrayp] += `**${count}.** ${object.player_name}${object.player_featured ? emoji("620538546368937994") : ``}${object.player_clan ? ` **[${object.player_clan}]**` : ` `}${object.player_elo ? ` (${object.player_elo}) ` : ` `}${object.player_hack ? ` __**HACKER**__` : ` `} • ${getRankedIcon(object.player_elo2.toLocaleString())} **${object.player_elo2.toLocaleString()}**\n`
                } else if (order == "player_elo4") {
                    str[arrayp] += `**${count}.** ${object.player_name}${object.player_featured ? emoji("620538546368937994") : ``}${object.player_clan ? ` **[${object.player_clan}]**` : ` `}${object.player_elo ? ` (${object.player_elo}) ` : ` `}${object.player_hack ? ` __**HACKER**__` : ` `} • ${getRankedIcon(object.player_elo4.toLocaleString())} **${object.player_elo4.toLocaleString()}**\n`
                }
                count++;
            });
            embed.addField(`**Top ${num ? num * 10 : 1}-${(num + 1) * 10}**`, str[num]);
            //embed.setThumbnail("https://image.spreadshirtmedia.com/image-server/v1/compositions/T175A1PA2962PT17X45Y79D1024344140FS1525/views/1,width=500,height=500,appearanceId=1/krunker-logo-mens-jersey-t-shirt.jpg")
            embed.setColor("#e8941e")
            embed.setFooter(`Page ${num + 1}/10`);
            msg.edit(embed)
            //message.channel.send();
        })
    } catch (e) {
        console.error(e)
        message.channel.send(":x: Hmm.. I encountered an error doing that. Try again or contact a developer.")
    }
}

module.exports.config = {
    command: "leaderboard", // Full command name
    aliases: ["lb"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Gets a leaderboard of the stats chosen by you", // Description of the command, used in "help" command.
    usage: "leaderboard <Level|Kills|Wins|Time|Krunkies|Clans> [range]" // Explains to the user 
}