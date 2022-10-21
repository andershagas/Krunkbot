const { fetchLanguage } = require('../../modules/server.js');
const { RichEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    var serverId = args[0];
    if (!serverId && !bot.guilds.get(serverId)) return message.channel.send(":x: Please define a valid server id.");

    var channels = bot.guilds.get(serverId).channels.filter(function (ch) {
        return ch.type === "text";
    })

    const embed = new RichEmbed()
    embed.setTitle("Server Communication")
    embed.setColor("RED")
    embed.setFooter("Send 'cancel' to cancel.")
    embed.setDescription("Which channel will the bot attempt to communicate in? You can search channel with short word. F.ex.: bot-com (Completed to bot-commands)")
    await message.channel.send(embed)
    message.channel.send("```\n" + channels.map(ch => ch.name + "\n") + "```")
    const channelCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 })
    channelCollector.on('collect', m1 => {
        try {
            if(m1.content.toLowerCase() == "cancel") {
                channelCollector.stop()
                return message.channel.send("Query cancelled.")
            }
            if(bot.guilds.get(serverId).channels.get(channels.findKey(val => val.name.toLowerCase().search(m1.content.toLowerCase()) !== -1)).name) {
                var channelName = bot.guilds.get(serverId).channels.get(channels.findKey(val => val.name.toLowerCase().search(m1.content.toLowerCase()) !== -1)).name
                var channelSend = bot.guilds.get(serverId).channels.get(channels.findKey(val => val.name.toLowerCase().search(m1.content.toLowerCase()) !== -1))
                channelCollector.stop()
                // Passed channel finder
                const embed2 = new RichEmbed()
                embed2.setTitle("Server Communication")
                embed2.setColor("BLUE")
                embed2.setDescription("Connection created. You can now chat in that channel. Connection will be automatically interrupted in 300 seconds.")
                embed2.setFooter("Send 'stopsend' to stop the connection.")
                message.channel.send(embed2)
                const messageSender = new Discord.MessageCollector(message.channel, m => m.author.bot == false, {time: 300000})
                const messageReciever = new Discord.MessageCollector(channelSend, m => m.author.id === message.author.id, { time: 300000})
                messageReciever.on('collect', m1 => {
                    message.channel.send("(" + m1.author.tag + ": " + m1.content + ")")
                })
                messageSender.on('collect', m2 => {
                    if(m2.content == "stopsend") {
                        messageReciever.stop();
                        messageSender.stop();
                        return message.channel.send("Connection ended.")
                    }

                    channelSend.send(`${message.guild.emojis.get("620538546368937994")} **(${message.author.username}: ${m2.content})**`)
                })
                messageSender
            } else {
                message.channel.send(":x: Couldn't find that channel. Try again?")
            }
        } catch(e) {
            channelCollector.stop()
            console.error("Dev error: " + e)
        }
        
    })
}

module.exports.config = {
    command: "sendchat", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: ["620304406599958539"], // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: true, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: ["336911180054659093", "123850789184602112", "551825457948131339"],//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: false,

    // help
    description: "A fuckin' example command.", // Description of the command, used in "help" command.
    usage: "ye what'd you expect" // Explains to the user 
}