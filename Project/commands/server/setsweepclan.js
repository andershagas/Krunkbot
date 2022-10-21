const { fetchLanguage } = require('../../modules/server.js');
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    const alert = new RichEmbed()
        .setTitle("Service Alert")
        .setColor("RED")
        .setDescription("**This command is disabled.** Due to recent updates from Krunker, discord bots can no longer recieve information from Krunker's social websocket. This is done on purpose and it would be appreciated if y'all alerted us before breaking sweep systems and ruining alot of free community effort. #BringTheBotsBack")

    return message.channel.send(alert)
    // Permission check //
    const bot_config = require("../../bot-configuration.json")
    var roleid = bot_config.sweeproleid

    if (!bot.guilds.get("620304406599958539").members.get(message.author.id).roles.get(roleid)) {
        return;
    }
    // Permission check end //

    var clan_name = args[0];
    var admin = message.mentions.users.first();

    if (!clan_name) return message.channel.send(":x: Please define a clan to bind to this server.");
    if (!admin) return message.channel.send(":x: Please mention a user to define as admin for sweep management.")

    const sweepadmin = require("../../sweepAdmin.json")

    var debounce = false;
    await sweepadmin.forEach(server => {
        if (server.serverid == message.guild.id) {
            debounce = true;
            message.channel.send(":x: Feature is already enabled. To change sweep admin, contact the developer of KrunkBot.")
        }
    })

    if (debounce == false) {
        const admin_object = {
            "serverid": message.guild.id,
            "adminid": admin.id,
            "clan": clan_name,
            "managers": []
        }

        sweepadmin.push(admin_object)

        message.channel.send(`Feature enabled. The clan \`${clan_name}\` has been connected to the server \`${message.guild.name}\`. The sweep admin for the server is set to ${admin}.`)

        data = JSON.stringify(sweepadmin)
        fs.writeFileSync("./sweepAdmin.json", data, { 'flags': 'w' })
    }
}

module.exports.config = {
    command: "setsweepclan", // Full command name
    aliases: ["ssc"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: true, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: true,

    // help
    description: "Enables sweep feature for a server and sets mentioned user for admin.", // Description of the command, used in "help" command.
    usage: "setsweepclan <clanname> <@mention>" // Explains to the user 
}