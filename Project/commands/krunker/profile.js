const { RichEmbed } = require('discord.js');
const { createPlayerCard } = require("../../modules/imagerender.js");
const { fetchLanguage } = require('../../modules/server.js')
const { krunker, UserNotFoundError } = require("../../modules/krunker.js");
const Krunker = new krunker();
const fs = require('fs');

module.exports.run = async (bot, message, args) => {
    const L1 = fetchLanguage(message.guild.id)
    try {
        const user = await Krunker.GetProfile(args.slice(0).join(' '));// Search for profile.
        console.log(user ? "User search on " + user.name : "User failed search on " + args.slice(0).join(' ')); // If search is successfull or not.
        createPlayerCard(user, message); // Player card creation.
    } catch (e) {
        if (e instanceof UserNotFoundError) {
            return message.channel.send(new RichEmbed().setColor("RED").setTitle("Krunkbot Profile").setDescription(`I could not find the user **${args.slice(0).join(' ') || "none"}**`));
        } else {
            console.log(e);
            return message.channel.send(new RichEmbed().setColor("RED").setTitle("Krunkbot Profile").setDescription(`An error has occured.`));
        }
    }
}

module.exports.config = {
    command: "profile", // Full command name
    aliases: ["p"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,

    // help
    description: "Displays an image of in-game stats", // Description of the command, used in "help" command.
    usage: "profile <username>" // Explains to the user 
}