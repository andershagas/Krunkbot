const { RichEmbed } = require('discord.js');
const { fetchLanguage } = require('../../modules/server.js');
const { krunker, GameNotFoundError } = require("../../modules/krunker.js");
const items = require("../../Items.json");
const Krunker = new krunker();


exports.run = async (bot, message, args) => {
    const alert = new RichEmbed()
    .setTitle("Service Alert")
    .setColor("RED")
    .setDescription("**This command is disabled.** Due to recent updates from Krunker, discord bots can no longer recieve information from Krunker's social websocket. This is done on purpose and it would be appreciated if y'all alerted us before breaking sweep systems and ruining alot of free community effort. #BringTheBotsBack")

return message.channel.send(alert)
    const L1 = fetchLanguage(message.guild.id)
    if (!args[0]) return message.channel.send(":x: " + L1["invalidgameid"])
    try {
        const user = await Krunker.GetGameInfo(args[0]) // Aquire the game info
        const embed = new RichEmbed()
        embed.setTitle(L1["krunkergameinfo"])
        for (var key in user) {
            embed.addField(key, user[key]) // Lazy mode
        }
        embed.setThumbnail("https://image.spreadshirtmedia.com/image-server/v1/compositions/T175A1PA2962PT17X45Y79D1024344140FS1525/views/1,width=500,height=500,appearanceId=1/krunker-logo-mens-jersey-t-shirt.jpg")
        embed.setColor("RED")
        embed.setFooter(L1["forsupport"] + "https://discord.gg/ESY6SrG " + L1["forsupport2"])
        message.channel.send(embed)
    } catch (e) {
        if (e instanceof GameNotFoundError)
            message.channel.send(":x:" + L1["errorgamefound"]) // If the game was not found, inform
        else
            console.error(e)
    }
}

module.exports.config = {
    command: "gameinformation", // Full command name
    aliases: ["gameinfo","gi"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Gets currents stats of the game", // Description of the command, used in "help" command.
    usage: "gameinformation <gameid>" // Explains to the user 
}