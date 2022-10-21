
exports.run = async (bot, message, args) => {
    if(!module.exports.config.userOverride.includes(message.author.id)) return;
    // Clean function
    function clean(text) {
        if (typeof (text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
    try {
        var code = args.slice(0).join(' ');
        var evaled = eval(code);

        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
        message.channel.sendCode("x1", clean(evaled));
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`x1\n${clean(err)}\n\`\`\``);
    }
}

module.exports.config = {
    command: "eval", // Full command name
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