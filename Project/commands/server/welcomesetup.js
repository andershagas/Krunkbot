const { fetchLanguage } = require('../../modules/server.js');
const Discord = require('discord.js');
const { RichEmbed } = require('discord.js');
const fs = require('fs');

module.exports.run = (bot, message, args) => {
    const questionEmbed = new RichEmbed();
    questionEmbed.setTitle("Krunkbot Welcoming Messages")
    questionEmbed.setColor("RED")
    questionEmbed.setDescription("What channel do you want to use for welcoming? (Name of it)")
    questionEmbed.setFooter("You have 30 seconds to answer.")
    questionEmbed.setTimestamp()
    message.channel.send(questionEmbed)

    const welcomeSetup = {
        "channel": "",
        "welcomeMessage": ""
    }

    const channelCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 30000 })
    channelCollector.on('collect', m1 => {
        try {
            var channels = [];
            message.guild.channels.forEach(ch => {
                if (ch.name.toLowerCase().search(m1.content.toLowerCase()) !== -1) {
                    channels.push(ch)
                }
            })
            if (channels.length == 0) return message.channel.send(":x: I couldn't find that channel. Try again.")
            if (channels.length > 1) return message.channel.send(":x: More than one channel was searched for. Please narrow it down.")
            channelCollector.stop()
            welcomeSetup.channel = channels[0].id
            questionEmbed.setDescription("What do you want your message to be once people join?\n\nQueries: {userMention} | {serverName} | {memberCount}\n\nExample: {userMention} has joined {serverName}! We are now at {memberCount} members. Read #rules for rules.")
            message.channel.send(questionEmbed)
            const MessageCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 30000 })
            MessageCollector.on('collect', m2 => {
                MessageCollector.stop()
                welcomeSetup.welcomeMessage = m2.content
                //questionEmbed.setDescription(`Welcome messages are now sent in \`${message.guild.channels.get(welcomeSetup.channel).name}\` and the message is \`${welcomeSetup.welcomeMessage}\`.`)
                questionEmbed.setColor("GREEN")
                message.channel.send(questionEmbed)
                const settings = require("../../guild-configuration.json")
                settings.servers.forEach(server => {
                    if (server.serverid == message.guild.id) {
                        server.welcomeSetup = welcomeSetup
                        data = JSON.stringify(settings)
                        fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
                    }
                })
            })
        } catch (e) {
            channelCollector.stop()
            message.channel.send("An error occured, try again.")
            console.log(e)
        }

    })
}

module.exports.config = {
    command: "welcomesetup", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: true, // Hides from help command.
    userPermission: ["MANAGE_GUILD"], // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: false,

    // help
    description: "A fuckin' example command.", // Description of the command, used in "help" command.
    usage: "ye what'd you expect" // Explains to the user 
}