const { fetchLanguage } = require('../../modules/server.js');

module.exports.run = (bot,message,args) => { 
    if(message.guild.id !== "648218246570442812") return;
    message.channel.send("Pass")
}

module.exports.config = {
    command: "setupserver", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: ["648218246570442812"], // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: true, // Hides from help command.
    userPermission: ["ADMINISTRATOR"], // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: ["336911180054659093"],//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: false,

    // help
    description: "Clears server and creates a krunker clan server.", // Description of the command, used in "help" command.
    usage: "setupserver" // Explains to the user 
}