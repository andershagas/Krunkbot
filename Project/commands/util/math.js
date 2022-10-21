const { fetchLanguage } = require('../../modules/server.js');

module.exports.run = (bot,message,args) => { 
    if(args[0]) {
        if (args[0] == "cargo_ship_cost()") {
            message.channel.send("more than u can afford")
        }
    }
}

module.exports.config = {
    command: "math", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: true, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: false,

    // help
    description: "", // Description of the command, used in "help" command.
    usage: "" // Explains to the user 
}