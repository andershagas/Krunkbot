const fs = require("fs");
const { RichEmbed } = require('discord.js');
const ms = require("ms");

/*
Since I'm lazy and this file is massive, I will document the input and output of these functions.

warnMember(bot, messageObject, userToWarn, serverId, reasonForMute) => {
    This creates a server if it doesen't exist, aswell as member object, and it gives the user 
    the warning.
}

kickMember(bot, messageObject, userToKick, reasonForKick) => {
    Kicks the user and sends warning log to server log.
}

banMember(bot, messageObject, userToBan, reasonForBan) => {
    Bans the user and sends warning log to server log.
}

muteMember(bot, messageObject, userToMute, timeToMute(1m,2m,3h,4d), reasonForMute) => {
    Mutes the user by adding the role to the user. Creates the role if it doesen't exist and fixes channels.
    Sends warning and adds to timed actions thing.
}

tempbanMember(bot, messageObject, userToMute, timeToBan(1m,2m,3h,4d), reasonForTempban) => {
    Bans the user and adds the timed action to config and unbans when time has passed. Sends log to server.
}

setServerPrefix(serverId, prefixToChangeTo) => {
    Sets the server prefix to the defined server id.
}

setLanguage(serverId, languageToChangeTo) => {
    Sets the language to the defined server id. (en,fr,se,no)
}

addBotChannel(serverId, channelIdToAdd) => {
    Adds the channel to be available for bot commands.
}

resetbotchannel(serverIdToReset) => {
 Resets the channels for the server, makes bot available in all commands again.
}

fetchLanguage(serverId) => {
    Fetches the language from the server.
}

resetlogchannel(serverId) => {
    Resets log channel with the server.
}

setlogchannel(serverId, channelId) => {
    Sets log channel to that server and channel id.
}

setWarnAction(serverId, howManyWarnings, action, value(IfItExists)) => {
    Defines how many warnings a user can have before an action is completed.
}
*/


exports.warnMember = async (bot, message, user, serverId, reason) => {
    const settings = require("../guild-configuration.json")
    const warnConfig = require("../warnings.json");

    function checkWarnings(warningCount, serverId) {
        settings.servers.forEach(server => {
            if (server.serverid == serverId) {
                server.warnAction.forEach(action => {
                    if (action.amount == warningCount) {
                        switch (action.action) {
                            case "ban":
                                exports.banMember(bot, message, user, "User has been automatically banned during to exceeding warning limit.")
                                break;

                            case "kick":
                                exports.kickMember(bot, message, user, "User has been automatically kicked during to exceeding warning limit.")
                                break;

                            case "mute":
                                exports.muteMember(bot, message, user, (ms(action.value) / 1000), "User has been automatically muted during to exceeding warning limit.")
                                break;

                            case "tempban":
                                exports.tempbanMember(bot, message, user, (ms(action.value) / 1000), "User has been automatically temp banned during to exceeding warning limit.")
                                break;
                        }
                    }
                })
            }
        })
    }


    // Check if server has config
    var serverDebounce = false;
    await warnConfig.forEach(server => {
        if (server.serverid == serverId) {
            serverDebounce = true
        }
    })

    if (serverDebounce == false) {
        const serverObj = {
            "serverid": serverId,
            "warns": 0,
            "users": []
        }
        warnConfig.push(serverObj)
    }
    // Done server check

    // Check if user exists
    var memberDebounce = false;
    await warnConfig.forEach(server => {
        if (server.serverid == serverId) {
            server.users.forEach(userCheck => {
                if (userCheck.userid == user.id) {
                    memberDebounce = true
                    userCheck.warnings.push({
                        "warnid": ++warnConfig.find(item => item.serverid == serverId).warns,
                        "warnreason": reason,
                        "warnauthor": message.author.username + "#" + message.author.discriminator
                    })
                    checkWarnings(userCheck.warnings.length, serverId)
                }
            })
        }
    })

    if (memberDebounce == false) {

        const memberObj = {
            "userid": user.id,
            "warnings": [{
                "warnid": ++warnConfig.find(item => item.serverid == serverId).warns,
                "warnreason": reason,
                "warnauthor": message.author.username + "#" + message.author.discriminator
            }]
        }
        warnConfig.forEach(server => {
            if (server.serverid == serverId) {
                server.users.push(memberObj)
            }
        })
        checkWarnings(1, serverId)
    }

    data = JSON.stringify(warnConfig)
    fs.writeFileSync("./warnings.json", data, { 'flags': 'w' })

    settings.servers.forEach(server => {
        if (server.serverid == message.guild.id) {
            logsChannel = server.logschannel
            if (logsChannel) {
                const embed = new RichEmbed()
                embed.setTitle("User warned - (" + user.user.username + "#" + user.user.discriminator + ")")
                embed.setAuthor(message.author.username + "#" + message.author.discriminator)
                embed.setColor("#ffb700")
                embed.setDescription(reason ? reason : "No reason was specified.")
                embed.setFooter("https://discordapp.com/invite/5NErxfN - Krunkbot support", "https://cdn.discordapp.com/icons/620304406599958539/179de6f8e56f2b113ece22f30a2d9bf1.png?size=128")
                embed.setThumbnail(message.guild.iconURL)
                embed.setTimestamp()
                message.guild.channels.get(logsChannel).send(embed)
            }
        }
    })

    message.channel.send(":ballot_box_with_check: User `" + user.user.username + "#" + user.user.discriminator + "` warned.")
}


exports.kickMember = (bot, message, user, reason) => {
    const settings = require("../guild-configuration.json")
    var logsChannel = null;

    settings.servers.forEach(server => {
        if (server.serverid == message.guild.id) {
            logsChannel = server.logschannel
            if (logsChannel) {
                message.guild.members.get(user.id).kick(reason ? reason : "No reason was specified.")
                    .then(() => {
                        const embed = new RichEmbed()
                        embed.setTitle("User kicked - (" + user.user.username + "#" + user.user.discriminator + ")")
                        embed.setAuthor(message.author.username + "#" + message.author.discriminator)
                        embed.setColor("#ffb700")
                        embed.setDescription(reason ? reason : "No reason was specified.")
                        embed.setFooter("https://discordapp.com/invite/5NErxfN - Krunkbot support", "https://cdn.discordapp.com/icons/620304406599958539/179de6f8e56f2b113ece22f30a2d9bf1.png?size=128")
                        embed.setThumbnail(message.guild.iconURL)
                        embed.setTimestamp()
                        message.guild.channels.get(logsChannel).send(embed)
                        message.channel.send(":ballot_box_with_check: Successfully kicked member.")
                    })
                    .catch(error => message.channel.send(":x: An error occured. (**" + error + "**)"))
            } else {
                message.guild.members.get(user.id).kick(reason ? reason : "No reason was specified.")
                    .then(() => message.channel.send(":ballot_box_with_check: Successfully kicked member."))
                    .catch(error => message.channel.send(":x: An error occured. (**" + error + "**)"))
            }
        }
    })
}

exports.banMember = (bot, message, user, reason) => {
    const settings = require("../guild-configuration.json")
    var logsChannel = null;

    settings.servers.forEach(server => {
        if (server.serverid == message.guild.id) {
            logsChannel = server.logschannel
            if (logsChannel) {
                message.guild.members.get(user.id).ban(reason ? reason : "No reason was specified.")
                    .then(() => {
                        const embed = new RichEmbed()
                        embed.setTitle("User banned - (" + user.user.username + "#" + user.user.discriminator + ")")
                        embed.setAuthor(message.author.username + "#" + message.author.discriminator)
                        embed.setColor("#ff0000")
                        embed.setDescription(reason ? reason : "No reason was specified.")
                        embed.setFooter("https://discordapp.com/invite/5NErxfN - Krunkbot support", "https://cdn.discordapp.com/icons/620304406599958539/179de6f8e56f2b113ece22f30a2d9bf1.png?size=128")
                        embed.setThumbnail(message.guild.iconURL)
                        embed.setTimestamp()
                        message.guild.channels.get(logsChannel).send(embed)
                        message.channel.send(":ballot_box_with_check: Successfully banned member.")
                    })
                    .catch(error => message.channel.send(":x: An error occured. (**" + error + "**)"))
            } else {
                message.guild.members.get(user.id).ban(reason ? reason : "No reason was specified.")
                    .then(() => message.channel.send(":ballot_box_with_check: Successfully banned member."))
                    .catch(error => message.channel.send(":x: An error occured. (**" + error + "**)"))
            }
        }
    })
}

exports.muteMember = async (bot, message, user, timeReq, reason) => {
    const settings = require("../guild-configuration.json")
    const timedActions = require("../timedActions.json")
    var logsChannel = null;

    if (user.id === message.author.id) return message.channel.send(":x: You cannot mute yourself.");
    if (user.highestRole.position >= message.member.highestRole.position) return message.channel.send(":x: You cannot mute that member. (They have the same or higher role than you)");

    let muteRole = message.guild.roles.find(r => r.name.toLowerCase() === "muted");
    if (!muteRole) {
        try {
            message.guild.createRole({
                name: "Muted",
                color: "#000000",
                permissions: []
            })
        } catch(e) {
            return message.channel.send(":x: I do not have the required permissions to do this. (Need manage roles.)")
        }
        
        muteRole = message.guild.roles.find(r => r.name.toLowerCase() === "muted");

        try {
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muteRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                })
            })
        } catch (e) {
            return message.channel.send(":x: I do not have the required permissions to do this. (Need manage channels.)")
        }
    }

    if (user.roles.has(muteRole.id)) return message.channel.send(":x: That user is already muted.")

    settings.servers.forEach(server => {
        if (server.serverid == message.guild.id) {
            logsChannel = server.logschannel
            if (logsChannel) {
                message.guild.members.get(user.id).addRole(muteRole)
                    .then(() => {
                        const embed = new RichEmbed()
                        embed.setTitle("User muted - (" + user.user.username + "#" + user.user.discriminator + ")")
                        embed.setAuthor(message.author.username + "#" + message.author.discriminator)
                        embed.setColor("#ffff00")
                        embed.addField("Time", timeReq)
                        embed.setDescription(reason ? reason : "No reason was specified.")
                        embed.setFooter("https://discordapp.com/invite/5NErxfN - Krunkbot support", "https://cdn.discordapp.com/icons/620304406599958539/179de6f8e56f2b113ece22f30a2d9bf1.png?size=128")
                        embed.setThumbnail(message.guild.iconURL)
                        embed.setTimestamp()
                        message.guild.channels.get(logsChannel).send(embed)
                        message.channel.send(":ballot_box_with_check: Successfully muted member.")

                        timedActions.mutes.push({
                            userid: user.id,
                            guild: message.guild.id,
                            time: Date.now() + parseInt(timeReq) * 1000,
                            channel: message.channel.id
                        })

                        data = JSON.stringify(timedActions)
                        fs.writeFileSync("./timedActions.json", data, { 'flags': 'w' })
                    })
                    .catch(error => message.channel.send(":x: An error occured. (**" + error + "**)"))
            } else {
                message.guild.members.get(user.id).addRole(muteRole)
                    .then(() => {
                        timedActions.mutes.push({
                            userid: user.id,
                            guild: message.guild.id,
                            time: Date.now() + parseInt(timeReq) * 1000,
                            channel: message.channel.id
                        })

                        data = JSON.stringify(timedActions)
                        fs.writeFileSync("./timedActions.json", data, { 'flags': 'w' })

                        message.channel.send(":ballot_box_with_check: Successfully muted member.")
                    })
                    .catch(error => message.channel.send(":x: An error occured. (**" + error + "**)"))
            }
        }
    })
}

exports.tempbanMember = async (bot, message, user, time, reason) => {
    const settings = require("../guild-configuration.json")
    const timedActions = require("../timedActions.json")
    var logsChannel = null;

    if (user.id === message.author.id) return message.channel.send(":x: You cannot ban yourself.");
    if (user.highestRole.position >= message.member.highestRole.position) return message.channel.send(":x: You cannot ban that member. (They have the same or higher role than you)");

    settings.servers.forEach(server => {
        if (server.serverid == message.guild.id) {
            logsChannel = server.logschannel
            if (logsChannel) {
                message.guild.members.get(user.id).ban(reason ? reason : "No reason was specified.")
                    .then(() => {
                        const embed = new RichEmbed()
                        embed.setTitle("User temp banned - (" + user.user.username + "#" + user.user.discriminator + ")")
                        embed.setAuthor(message.author.username + "#" + message.author.discriminator)
                        embed.setColor("#ffff00")
                        embed.setDescription(reason ? reason : "(Tempban: " + time + " seconds) No reason was specified.")
                        embed.setFooter("https://discordapp.com/invite/5NErxfN - Krunkbot support", "https://cdn.discordapp.com/icons/620304406599958539/179de6f8e56f2b113ece22f30a2d9bf1.png?size=128")
                        embed.setThumbnail(message.guild.iconURL)
                        embed.setTimestamp()
                        message.guild.channels.get(logsChannel).send(embed)
                        message.channel.send(":ballot_box_with_check: Successfully temp banned member.")

                        timedActions.bans.push({
                            userid: user.id,
                            guild: message.guild.id,
                            time: Date.now() + parseInt(time) * 1000
                        })

                        data = JSON.stringify(timedActions)
                        fs.writeFileSync("./timedActions.json", data, { 'flags': 'w' })
                    })
                    .catch(error => message.channel.send(":x: An error occured. (**" + error + "**)"))
            } else {
                message.guild.members.get(user.id).ban(reason ? reason : "(Tempban: " + time + " seconds)No reason was specified.")
                    .then(() => {
                        timedActions.bans.push({
                            userid: user.id,
                            guild: message.guild.id,
                            time: Date.now() + parseInt(time) * 1000
                        })

                        data = JSON.stringify(timedActions)
                        fs.writeFileSync("./timedActions.json", data, { 'flags': 'w' })

                        message.channel.send(":ballot_box_with_check: Successfully temp banned member.")
                    })
                    .catch(error => message.channel.send(":x: An error occured. (**" + error + "**)"))
            }
        }
    })
}

exports.setServerPrefix = (serverid, prefix) => {
    const settings = require("../guild-configuration.json")

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            server.prefix = prefix
        }
    })
    data = JSON.stringify(settings)
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}

exports.setLanguage = (serverid, language) => {
    const settings = require("../guild-configuration.json")

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            server.lang = language
        }
    })
    data = JSON.stringify(settings)
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}

exports.fetchLanguage = (serverid) => {
    const settings = require("../guild-configuration.json")
    var language = null

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            language = require("../translations/" + server.lang + ".json")
        }
    })
    return language
}

exports.addbotchannel = (serverid, channelid) => {
    const settings = require("../guild-configuration.json")

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            server.botchannel.push(channelid)
        }
    })
    data = JSON.stringify(settings)
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}

exports.resetbotchannel = (serverid) => {
    const settings = require("../guild-configuration.json")

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            server.botchannel = [];
        }
    })
    data = JSON.stringify(settings)
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}

exports.resetlogchannel = (serverid) => {
    const settings = require("../guild-configuration.json")

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            server.logschannel = null;
        }
    })

    data = JSON.stringify(settings)
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}


exports.setlogchannel = (serverid, channelid) => {
    const settings = require("../guild-configuration.json")

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            server.logschannel = channelid;
        }
    })

    data = JSON.stringify(settings)
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}

exports.setWarnAction = (serverid, amount, action, value) => {
    const settings = require("../guild-configuration.json")

    const constructor = {
        "amount": amount,
        "action": action,
        "value": value ? value : null
    }

    settings.servers.forEach(server => {
        if (server.serverid == serverid) {
            server.warnAction.push(constructor)
        }
    })

    data = JSON.stringify(settings)
    fs.writeFileSync("./guild-configuration.json", data, { 'flags': 'w' })
}