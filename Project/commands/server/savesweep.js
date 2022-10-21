const { fetchLanguage } = require('../../modules/server.js');
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
    // Permission check //
    const sweepAdmin = require("../../sweepAdmin.json")

    var pass = false;
    var exists = false;
    var clanName = false
    await sweepAdmin.forEach(permission => {
        if (permission.serverid == message.guild.id) {
            exists = true
            clanName = permission.clan
            if (clanName == "24/7") {
                clanName = "247"
            }
            if (message.author.id == permission.adminid) {
                pass = true;
            }
        }
    })

    if (pass == true) {
        var clanJson = []
        message.channel.send(`${bot.emojis.get("626065835764613120")} Loading clan information... (${clanName})`).then(async msg => {
            var clan;
            if (clanName == "247") {
                clan = await Krunker.GetClaninfo("24/7")
                msg.edit(`${bot.emojis.get("626065835764613120")} Recieved ${clan.members.length} members. Reading score and input...`)
            } else {
                clan = await Krunker.GetClaninfo(clanName)
                msg.edit(`${bot.emojis.get("626065835764613120")} Recieved ${clan.members.length} members. Reading score and input...`)
            }

            clan.members.sort((a, b) => (a.player_score < b.player_score) ? 1 : -1)
            await clan.members.forEach(member => {
                clanJson.push({
                    username: member.p,
                    userscore: member.s,
                    usertime: "Not yet calculated",
                    nukes: "Not yet calculated"
                })
            })
            data = JSON.stringify(clanJson)
            fs.writeFile(`./sweepclans/${clanName}.json`, data, function (err) {
                if (err) throw err;
            })

            msg.edit(`${bot.emojis.get("626065835764613120")} Clan archive created, I'm currently proccessing user info to get time. This might take some time dependant on clan size.`)

            var failedScans = 0;
            for (const user of clanJson) {
                try {
                    console.log("search on " + user.username)
                    const kUser = await Krunker.GetProfile(user.username)
                    console.log("Read " + kUser.playTime + " time and " + kUser.nukes + " nukes")
                    user.nukes = kUser.nukes
                    user.usertime = kUser.playTime
                    await waitFor(300);
                } catch (e) {
                    if (e instanceof UserNotFoundError) {
                        failedScans++
                        user.usertime = "Fail"
                    } else {
                        console.log(e);
                        return message.channel.send(new RichEmbed().setColor("RED").setTitle("Krunkbot Sweep System").setDescription(`An error has occured. Please contact a bot developer.`));
                    }
                }
            }

            async function fixUsers() {
                failedScans = 0
                for (const user of clanJson) {
                    if (user.usertime == "Fail") {
                        try {
                            console.log("search on " + user.username)
                            const kUser = await Krunker.GetProfile(user.username)
                            console.log("Read " + kUser.playTime + " time and " + kUser.nukes + " nukes")
                            user.usertime = kUser.playTime
                            user.nukes = kUser.nukes
                            failedScans = failedScans - 1
                            await waitFor(300);
                        } catch (e) {
                            if (e instanceof UserNotFoundError) {
                                failedScans++
                                user.usertime = "Fail"
                            } else {
                                console.log(e);
                                return 
                            }
                        }
                    }
                }
                if (failedScans == 0) {
                    msg.edit(`:ballot_box_with_check: Sweep save successfully created.`)
                    data = JSON.stringify(clanJson)
                    fs.writeFile(`./sweepclans/${clanName}.json`, data, function (err) {
                        if (err) throw err;
                    })
                } else {
                    msg.edit(`${bot.emojis.get("626065835764613120")} Sweep save complete, but I more recieved more difficulties getting certain users. Krunker might be down.`)
                    data = JSON.stringify(clanJson)
                    fs.writeFile(`./sweepclans/${clanName}.json`, data, function (err) {
                        if (err) throw err;
                    })
                    fixUsers()
                }
            }

            data = JSON.stringify(clanJson)
            fs.writeFile(`./sweepclans/${clanName}.json`, data, function (err) {
                if (err) throw err;
            })
            if (failedScans !== 0) {
                msg.edit(`${bot.emojis.get("626065835764613120")} Sweep save complete, but I encountered some difficulties getting certain users. I will try again soon and this message will be updated.`)
                fixUsers()
            } else {
                msg.edit(`:ballot_box_with_check: Sweep save successfully created.`)
            }
        })
    } else if (exists == true) {
        // deny permission
        console.log("deny")
    } else {
        return message.channel.send(":x: Sorry, this server is not setup for this feature. Contact one of the KrunkBot staff through `k!invite`.")
    }
    // Permission check end //
}

module.exports.config = {
    command: "savesweep", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: false,

    // help
    description: "Saves current member stats to the clan.", // Description of the command, used in "help" command.
    usage: "savesweep" // Explains to the user 
}