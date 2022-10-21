const { fetchLanguage } = require('../../modules/server.js');
const { RichEmbed } = require('discord.js');
const { krunker, UserNotFoundError } = require("../../modules/krunker.js");
const fs = require('fs');
const Krunker = new krunker();

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

module.exports.run = async (bot, message, args) => {
    const alert = new RichEmbed()
        .setTitle("Service Alert")
        .setColor("RED")
        .setDescription("**This command is disabled.** Due to recent updates from Krunker, discord bots can no longer recieve information from Krunker's social websocket. This is done on purpose and it would be appreciated if y'all alerted us before breaking sweep systems and ruining alot of free community effort. #BringTheBotsBack")

    return message.channel.send(alert)
    var L1 = fetchLanguage(message.guild.id)
    // Permission check //
    const sweepAdmin = require("../../sweepAdmin.json")


    var pass = false;
    var exists = false;
    var clanName;
    await sweepAdmin.forEach(permission => {
        if (permission.serverid == message.guild.id) {
            exists = true
            clanName = permission.clan
            if (clanName == "24/7") {
                clanName = "247"
            }
            if (message.author.id == permission.adminid || permission.managers.includes(message.author.id)) {
                pass = true;
            }
        }
    })

    if (pass == true) {
        var mode = args[0]
        if (!mode) return message.channel.send(":x: Please select a sweep mode. (`score`, `playtime`, `nukes`, `exception`)")
        if (mode.toLowerCase() == "score") {
            message.channel.send(`${bot.emojis.get("626065835764613120")} Loading last save sweep. Mode \`score\`.`).then(async msg => {
                var exists = false;
                if (fs.existsSync(`./sweepclans/${clanName}.json`)) {
                    exists = true;
                }

                if (exists == false) {
                    return msg.edit(":x: It seems I have no saved data for this server. Try using `k!savesweep`.")
                }

                var clan;
                var clanOld;
                if (clanName == "247") {
                    try {
                        delete require.cache[require.resolve('../../sweepclans/247.json')]
                    } catch(e) {
                        // ignore
                    }
                    clan = await Krunker.GetClaninfo("24/7")
                    clanOld = require(`../../sweepclans/247.json`)
                } else {
                    try {
                        delete require.cache[require.resolve(`../../sweepclans/${clanName}.json`)]
                    } catch(e) {
                        // ignore
                    }
                    clan = await Krunker.GetClaninfo(clanName)
                    clanOld = require(`../../sweepclans/${clanName}.json`)
                }
                msg.edit(`${bot.emojis.get("626065835764613120")} Loading new data and comparing...`)

                var totalScore = 0;
                clanOld.forEach(oldUser => {
                    clan.members.forEach(newUser => {
                        if (newUser.p == oldUser.username) {
                            oldUser.compuserscore = newUser.s - oldUser.userscore
                            totalScore = totalScore + oldUser.compuserscore
                        }
                    })
                })

                msg.edit(`:ballot_box_with_check:  All data compared.`)
                data = JSON.stringify(clanOld)
                fs.writeFile(`./sweepclans/${clanName}.json`, data, function (err) {
                    if (err) throw err;
                })

                msg.delete()

                clanOld.sort((a, b) => (a.compuserscore < b.compuserscore) ? 1 : -1)

                function getEmbed(pageNumber) {
                    var embed = new RichEmbed()
                    embed.setTitle(`${clanName}'s sweep result`)
                    for (i = 0; i < 10; i++) {
                        if (clanOld[i + pageNumber]) {
                            embed.addField(clanOld[i + pageNumber].exception ? `**${clanOld[i + pageNumber].username}**` : `${clanOld[i + pageNumber].username}`, "Score: " + (clanOld[i + pageNumber].compuserscore ? clanOld[i + pageNumber].compuserscore.toLocaleString() : 0) + (clanOld[i + pageNumber].added ? "\nUser added " + (((Date.now() - clanOld[i + pageNumber].added) / 1000 / 60 / 60 / 24).toFixed(2)) + " days ago" : ""))
                        }
                        //embed.addField(clanOld[i + pageNumber].username, "Score: " + clanOld[i + pageNumber].compuserscore)
                    }
                    embed.setDescription("This is the `score` result. The score is how much a person has gotten since **last** `k!savesweep`. Users in **bold** text are excempt from sweep removal.\n\nTotal score since `k!savesweep`: " + totalScore.toLocaleString())
                    embed.setTimestamp()
                    return embed;
                }

                message.channel.send(`${bot.emojis.get("626065835764613120")} Loading results..`).then(async msg => {
                    var currentPage = 0
                    msg.edit(getEmbed(0))
                    await msg.react("◀")
                    await msg.react("❌")
                    await msg.react("▶")
                    async function main(msg) {
                        const collector = msg.createReactionCollector((reaction, user) =>
                            user.id !== msg.author.id
                        ).once("collect", reaction => {
                            const chosen = reaction.emoji.name;
                            if (chosen === "◀") {
                                currentPage = currentPage - 10
                                if (currentPage < 0) {
                                    currentPage = 0
                                }
                                msg.edit(getEmbed(currentPage))
                            } else if (chosen === "▶") {
                                currentPage = currentPage + 10
                                if (currentPage > clanOld.length) {
                                    currentPage = clanOld.length - 10
                                }
                                msg.edit(getEmbed(currentPage))
                            } else {
                                collector.stop()
                                return msg.delete()
                            }
                            collector.stop();
                            main(msg)
                        })
                    }
                    main(msg)

                })
            })

        } else if (mode.toLowerCase() == "playtime") {
            message.channel.send(`${bot.emojis.get("626065835764613120")} Loading last save sweep. Mode \`playtime\`. Playtime requires a user scan on all clan members and can take some time.`).then(async msg => {
                var exists = false;
                if (fs.existsSync(`./sweepclans/${clanName}.json`)) {
                    exists = true;
                }

                if (exists == false) {
                    return msg.edit(":x: It seems I have no saved data for this server. Try using `k!savesweep`.")
                }

                var clanOld;
                if (clanName == "247") {
                    clanOld = require(`../../sweepclans/247.json`)
                } else {
                    clanOld = require(`../../sweepclans/${clanName}.json`)
                }

                var failedScans = 0;
                for (const user of clanOld) {
                    try {
                        console.log("search on " + user.username)
                        const kUser = await Krunker.GetProfile(user.username)
                        console.log("Read " + kUser.playTime)
                        user.compplaytime = kUser.playTime
                        await waitFor(300);
                    } catch (e) {
                        if (e instanceof UserNotFoundError) {
                            failedScans++
                            user.compplaytime = "Fail"
                        } else {
                            console.log(e);
                            return message.channel.send(new RichEmbed().setColor("RED").setTitle("Krunkbot Sweep System").setDescription(`An error has occured. Please contact a bot developer.`));
                        }
                    }
                }

                data = JSON.stringify(clanOld)
                fs.writeFile(`./sweepclans/${clanName}.json`, data, function (err) {
                    if (err) throw err;
                })

                msg.delete()

                function getEmbed(pageNumber) {
                    var embed = new RichEmbed()
                    embed.setTitle(`${clanName}'s sweep result`)
                    embed.setDescription("This is the `timeplayed` result. This is how long a user has played since **last** `k!savesweep`.")

                    for (i = 0; i < 10; i++) {
                        if (clanOld[i + pageNumber]) {
                            embed.addField(clanOld[i + pageNumber].exception ? `**${clanOld[i + pageNumber].username}**` : `${clanOld[i + pageNumber].username}`, "**Old time:** " + clanOld[i + pageNumber].usertime + "\n**New time:** " + clanOld[i + pageNumber].compplaytime + (clanOld[i + pageNumber].added ? "\nUser added " + (((Date.now() - clanOld[i + pageNumber].added) / 1000 / 60 / 60 / 24).toFixed(2)) + " days ago" : ""))
                        }
                    }
                    embed.setTimestamp()
                    return embed;
                }

                message.channel.send(`${bot.emojis.get("626065835764613120")} Loading results..`).then(async msg => {
                    var currentPage = 0
                    msg.edit(getEmbed(0))
                    await msg.react("◀")
                    await msg.react("❌")
                    await msg.react("▶")
                    async function main(msg) {
                        const collector = msg.createReactionCollector((reaction, user) =>
                            user.id !== msg.author.id
                        ).once("collect", reaction => {
                            const chosen = reaction.emoji.name;
                            if (chosen === "◀") {
                                currentPage = currentPage - 10
                                if (currentPage < 0) {
                                    currentPage = 0
                                }
                                msg.edit(getEmbed(currentPage))
                            } else if (chosen === "▶") {
                                currentPage = currentPage + 10
                                if (currentPage > clanOld.length) {
                                    currentPage = clanOld.length - 10
                                }
                                msg.edit(getEmbed(currentPage))
                            } else {
                                collector.stop()
                                return msg.delete()
                            }
                            collector.stop();
                            main(msg)
                        })
                    }
                    main(msg)

                })
            })
        } else if (mode.toLowerCase() == "nukes") {
            message.channel.send(`${bot.emojis.get("626065835764613120")} Loading last save sweep. Mode \`nukes\`. Nukes requires a user scan on all clan members and can take some time.`).then(async msg => {
                var exists = false;
                if (fs.existsSync(`./sweepclans/${clanName}.json`)) {
                    exists = true;
                }

                if (exists == false) {
                    return msg.edit(":x: It seems I have no saved data for this server. Try using `k!savesweep`.")
                }

                var clanOld;
                if (clanName == "247") {
                    clanOld = require(`../../sweepclans/247.json`)
                } else {
                    clanOld = require(`../../sweepclans/${clanName}.json`)
                }

                var failedScans = 0;
                for (const user of clanOld) {
                    try {
                        console.log("search on " + user.username)
                        const kUser = await Krunker.GetProfile(user.username)
                        console.log("Read " + kUser.nukes + " nukes")
                        if(!user.nukes) {
                            user.nukes = kUser.nukes
                        }
                        user.compnukes = kUser.nukes
                        await waitFor(300);
                    } catch (e) {
                        if (e instanceof UserNotFoundError) {
                            failedScans++
                            user.nukes = "Fail"
                        } else {
                            console.log(e);
                            return message.channel.send(new RichEmbed().setColor("RED").setTitle("Krunkbot Sweep System").setDescription(`An error has occured. Please contact a bot developer.`));
                        }
                    }
                }

                data = JSON.stringify(clanOld)
                fs.writeFile(`./sweepclans/${clanName}.json`, data, function (err) {
                    if (err) throw err;
                })

                msg.delete()

                function getEmbed(pageNumber) {
                    var embed = new RichEmbed()
                    embed.setTitle(`${clanName}'s sweep result`)
                    embed.setDescription("This is the `nukes` result. This is how many nukes the user has gotten since **last** `k!savesweep`.")

                    for (i = 0; i < 10; i++) {
                        if (clanOld[i + pageNumber]) {
                            embed.addField(clanOld[i + pageNumber].exception ? `**${clanOld[i + pageNumber].username}**` : `${clanOld[i + pageNumber].username}`, "**Nukes:** " + (parseInt(clanOld[i + pageNumber].compnukes) - parseInt(clanOld[i + pageNumber].nukes)) + (clanOld[i + pageNumber].added ? "\nUser added " + (((Date.now() - clanOld[i + pageNumber].added) / 1000 / 60 / 60 / 24).toFixed(2)) + " days ago" : ""))
                        }
                    }
                    embed.setTimestamp()
                    return embed;
                }

                message.channel.send(`${bot.emojis.get("626065835764613120")} Loading results..`).then(async msg => {
                    var currentPage = 0
                    msg.edit(getEmbed(0))
                    await msg.react("◀")
                    await msg.react("❌")
                    await msg.react("▶")
                    async function main(msg) {
                        const collector = msg.createReactionCollector((reaction, user) =>
                            user.id !== msg.author.id
                        ).once("collect", reaction => {
                            const chosen = reaction.emoji.name;
                            if (chosen === "◀") {
                                currentPage = currentPage - 10
                                if (currentPage < 0) {
                                    currentPage = 0
                                }
                                msg.edit(getEmbed(currentPage))
                            } else if (chosen === "▶") {
                                currentPage = currentPage + 10
                                if (currentPage > clanOld.length) {
                                    currentPage = clanOld.length - 10
                                }
                                msg.edit(getEmbed(currentPage))
                            } else {
                                collector.stop()
                                return msg.delete()
                            }
                            collector.stop();
                            main(msg)
                        })
                    }
                    main(msg)

                })
            })
        } else if (mode.toLowerCase() == "exception") {
            var username = args.slice(1).join(' ')
            if (!username) return message.channel.send(":x: To change an exception state, please give a username.")
            if (fs.existsSync(`./sweepclans/${clanName}.json`)) {
                exists = true;
            }

            if (exists == false) {
                return msg.edit(":x: It seems I have no saved data for this server. Try using `k!savesweep`.")
            }

            var clan;
            if (clanName == "247") {
                clan = require(`../../sweepclans/247.json`)
            } else {
                clan = require(`../../sweepclans/${clanName}.json`)
            }

            var exists = false;
            await clan.forEach(user => {
                if (user.username.toLowerCase() == username.toLowerCase()) {
                    exists = true;
                    if (user.exception) {
                        user.exception = false
                        message.channel.send(`:ballot_box_with_check: User ${user.username} has been **removed** from exception list.`)
                    } else {
                        user.exception = true
                        message.channel.send(`:ballot_box_with_check: User ${user.username} has been **added** to the exception list.`)
                    }
                }
            })
            if (exists == false) return message.channel.send(":x: Couldn't find that member in sweep config.")
            data = JSON.stringify(clan)
            fs.writeFile(`./sweepclans/${clanName}.json`, data, function (err) {
                if (err) throw err;
            })
        }

    } else if (exists == true) {
        // deny permission
        console.log("deny")
    } else {
        return message.channel.send(L1["sweepfeaturedisabled"])
    }
    // Permission check end //
}

module.exports.config = {
    command: "sweep", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: false,

    // help
    description: "Show sweep information", // Description of the command, used in "help" command.
    usage: "sweep <score/time>" // Explains to the user 
}