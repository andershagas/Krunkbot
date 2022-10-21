const { RichEmbed } = require("discord.js");
const fs = require("fs");
const { fetchLanguage } = require('../../modules/server.js');
var categories = fs.readdirSync("./commands/");

function cmdDesc(commandname, message) {
    const L1 = fetchLanguage(message.guild.id)
    return L1["comdesc"][commandname]; // Get the translation for description
}

function getAll(bot, message) { 
    const embed = new RichEmbed().setColor("#e8941e").setTitle("Krunkbot");
    embed.setDescription("**List of all commands**. Use **help <command>** to get more information about the command");

    function commands(category) {
        return bot.commands
            .filter(cmd => cmd.config.category === category) // If it's the correct category
            .filter(cmd => cmd.config.enable == true) // If command is enabled
            .filter(cmd => cmd.config.hideHelp == false) // If hidehelp is not set to true
            .map(cmd => `**${cmd.config.command} ${cmd.config.aliases.map(alias => `| ${alias} `)}** - ${cmdDesc(cmd.config.command, message)}`) // Aliases and stuff

            .join("\n") || "No commands";
    }

    const info = categories
        .filter(folder => folder.search(".js") == -1) // If file doesen't have .js
        .map(folder => embed.addField(`**${folder}**`, `${commands(folder)}`));

    embed.setFooter(`Syntax: <> = required, [] = optional`);

    return message.channel.send(embed);
}

function getCMD(bot, message, arg) { // Get command specific
    const embed = new RichEmbed().setColor("#e8941e").setTitle("Krunkbot");

    const cmd = bot.commands.get(arg) || bot.commands.get(bot.aliases.get(arg));
    let info = `No information found for command **${arg}**`;

    if (!cmd) { // If command was found
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }
    if (!cmd.config.enable || cmd.config.hideHelp) { // If it's not enabled or hide help is enabled, return
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }
    if (cmd.config.guildOnly) { // If guild only is enabled, only show command info to that guild.
        let pass = false
        cmd.config.guildOnly.forEach(val => {
            if (message.guild.id == val) {
                pass = true
            }
        });
        if (pass) {
            return message.channel.send(embed.setColor("RED").setDescription(info));
        }
    }

    info = `**Command**: ${cmd.config.command}\n**Aliases**: ${cmd.config.aliases.map(a => `\`${a}\``).join(", ")}\n**Description**: ${cmdDesc(cmd.config.command, message)}\n**Usage**: ${cmd.config.usage}`
    embed.setFooter(`Syntax: <> = required, [] = optional`);

    return message.channel.send(embed.setDescription(info));
}

module.exports.run = (bot, message, args) => {
    if (args[0]) {
        return getCMD(bot, message, args[0].toLowerCase()); // Cmd specific
    } else {
        return getAll(bot, message); // All commands
    }
}


module.exports.config = {
    command: "help", // Full command name
    aliases: ["cmds"], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378].
    hideHelp: false, // Hides from help command. Users can still run it.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    userOverride: false, // User can run this command no matter where they are nor need any userpermission
    ignoreCmdonly: false,
    
    // Help command config //
    description: "List of all commands", // Description of the command, used in "help" command.
    usage: "help [command]" // Explains to the user 
}