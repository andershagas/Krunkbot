const { RichEmbed } = require('discord.js');
const { fetchLanguage } = require('../../modules/server.js')
const { krunker, UserNotFoundError } = require("../../modules/krunker.js");
const Krunker = new krunker();
const fs = require('fs');

exports.run = async (bot, message, args) => {
    const alert = new RichEmbed()
        .setTitle("Service Alert")
        .setColor("RED")
        .setDescription("**This command is disabled.** Due to recent updates from Krunker, discord bots can no longer recieve information from Krunker's social websocket. This is done on purpose and it would be appreciated if y'all alerted us before breaking sweep systems and ruining alot of free community effort. #BringTheBotsBack")

    return message.channel.send(alert)
    L1 = fetchLanguage(message.guild.id)
    try {
        const user = await Krunker.GetProfile(args.slice(0).join(' ')) // Searches for the user.
        message.channel.send("**" + L1["id"] + "**is **" + user.id + "**") // Gets the user id from result.
    } catch (e) {
        console.log(e)
        if (e instanceof UserNotFoundError)
            message.channel.send(":x: " + L1["profilenotfound"])
        else {
            message.channel.send(":warning: " + L1["krunkerconnectissues"])
        }
    }
}

module.exports.config = {
    command: "userid", // Full command name
    aliases: ["ui"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Gets the id of a user from username", // Description of the command, used in "help" command.
    usage: "userid <username>" // Explains to the user 
}