
exports.run = async (bot, message, args) => {
    if(!module.exports.config.userOverride.includes(message.author.id)) return;

    try {
        await message.channel.send("Bot is restarting...")
        process.exit();
   } catch(e) {
       return message.channel.send(`ERROR: ${e.message}`)
   }
}

module.exports.config = {
    command: "restart", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: true, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: ["123850789184602112","336911180054659093"],//[123850789184602112], // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: true,

    // help
    description: "", // Description of the command, used in "help" command.
    usage: "" // Explains to the user 
}