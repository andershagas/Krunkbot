const { fetchLanguage } = require('../../modules/server.js');
const { RichEmbed } = require('discord.js');

module.exports.run = (bot, message, args) => {
    if (!message.mentions.members.first() && !args[0]) return message.channel.send(":x: Mention or define a username.")
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":x: Sorry, I'm not permitted to do that.")

    let messagecount = parseInt(args[0]);
    if (messagecount < 101 && messagecount > 1) {
        try {
            message.channel.fetchMessages({ limit: messagecount })
                .then(fetched => {
                    const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned); // This sorts messages that aren't pinned.

                    message.channel.bulkDelete(notPinned, true); // Deletes messages.
                })
        } catch (err) {
            console.error(err)
            message.channel.send(":x: Sorry, an error occured.")
        }
    } else {
        message.channel.send(":x: Please input a valid number. (Must be over 1 and below 101.").then(m => m.delete(5000)); // Because of weird discord limits.
    }
}

module.exports.config = {
    command: "purge", // Full command name
    aliases: ["prune"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: [], // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: ["MANAGE_MESSAGES"], // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: true,

    // help
    description: "Deletes a certain amount of messages.", // Description of the command, used in "help" command.
    usage: "purge <number of messages>" // Explains to the user 
}