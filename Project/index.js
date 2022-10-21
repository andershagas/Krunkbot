/*
KRUNKBOT DISCORD MANAGEMENT BOT
Coded by KrunkBot development team

# JSON FILE DESCRIPTIONS #

bot-configuration.json - Storage for bot token and any non-changeable data-entries.
guild-configuration.json - Storage for all guild configs (Warn actions, prefix, bot logs, whatever guild specific settings)
clan-colors.json - What color the clan tags get.
items.json - Old Krunker item database, haven't removed yet since something somewhere might break.
patreons.json - Kinda unused. Supposed to be a list of who is patreon.
roleKey.json - Auto-generated list of role key messages.
staff.json - List of who is staff. Editable by command or editing the .json.
support.json - List of active/archived support requests. Not used.
timedActions.json - Auto-generated list of actions that needs to be completed within a time.
update.json - Manual update log.
warnings.json - Auto-generated server logs for who has warnings.
*/

// Dependencies // PROD
const discord = require("discord.js") // discord.js
const { RichEmbed } = require('discord.js');
const fs = require("fs"); // Filesystem
const update = require("./update.json") // Update file
const { fetchServerPrefix } = require("./modules/server.js") // Get custom server prefix
const { registerRoleKey } = require("./modules/roleKey.js") // Register role-key when role-key is deteted
const { createPlayerCard } = require("./modules/imagerender.js"); // Renders the profile cards.
const { krunker, UserNotFoundError } = require("./modules/krunker.js"); // Kruner module
const Krunker = new krunker();
const krunkerMail = require("./modules/mailChecker.js") // krunkerMail.getMail()
//const { createsupportrequest, createsupportalert } = require("./modules/support.js")

// Files //
const botconfig = require("./bot-configuration.json"); // Non-editable bot config
const guildconfig = require("./guild-configuration.json"); // Guild config

// Objects //
const bot = new discord.Client(); // New discord client -> bot
var handler = {}; // For storing commands whatnot
bot.commands = new discord.Collection(); // Storing commands
bot.aliases = new discord.Collection(); // Storing command aliases


// Read Directory // This reads through the handler folder. Requires (runs) them accordingly and makes them available through the handler array.
fs.readdir("./handlers/", (err, folder) => {
    if (err) console.error(err);
    folder.forEach(folderName => {
        if (folderName.search(".js") == -1) {
            if (folderName !== "core")
                handler[folderName] = [];
            fs.readdir("./handlers/" + folderName, (err, files) => {
                let jsfile = files.filter(f => f.split(".").pop() === "js");
                if (jsfile.length > 0) {
                    jsfile.forEach((f, i) => {
                        if (folderName === "core") {
                            require(`./handlers/${folderName}/${f}`)(bot);
                        } else {
                            handler[folderName][f.replace(".js", "")] = require(`./handlers/${folderName}/${f}`);
                        }
                    });
                }
            });
        }
    });
});

// Events //

bot.on("message", async message => {
    if (message.author.bot) return; // If who sent the message is a bot, ignore.
    if (message.channel.type === "dm")
        return; // Ignore dms.

    if (message.channel.id == "631223375355969536") {
        try {
            const user = await Krunker.GetProfile(message.content);// Search for profile.
            console.log(user ? "User search on " + user.name : "User failed search on " + args.slice(0).join(' ')); // If search is successfull or not.
            createPlayerCard(user, message); // Player card creation.
            message.channel.send(":white_check_mark: Added user to sweep.")
            const config24 = require('./sweepclans/247.json')
            config24.push({
                username: user.name,
                userscore: user.score,
                usertime: user.playTime,
                added: Date.now()
            })
            data = JSON.stringify(config24)
            fs.writeFile(`./sweepclans/247.json`, data, function (err) {
                if (err) throw err;
            })
        } catch (e) {
            if (e instanceof UserNotFoundError) {
                return message.channel.send(new RichEmbed().setColor("RED").setTitle("Krunkbot Profile").setDescription(`I could not find the user **${args.slice(0).join(' ') || "none"}**`));
            } else {
                console.log(e);
                return message.channel.send(new RichEmbed().setColor("RED").setTitle("Krunkbot Profile").setDescription(`An error has occured.`));
            }
        }
        return;
    }

    if (message.content.toLowerCase().indexOf("role-key") !== -1) { // If it detects lower-case "role-key"
        if (message.member.hasPermission("MANAGE_ROLES")) { // If user has permission to manage roles.
            message.channel.send(":arrows_counterclockwise: Role-key detected, parsing...").then(m => { // m
                return registerRoleKey(bot, message, m) // Runs required function at the top of the code.
            })
        }

    }

    /*if (message.content !== "k!closeticket") {
        var ticketsCheck = require("./support.json")
        ticketsCheck.active.forEach(async obj => {
            if (obj.schannel == message.channel.id) {
                if (obj.member == message.author.id) {
                    bot.channels.get(obj.kchannel).send(">>> **Message from member**\n" + message.content)
                }
            } else if (obj.kchannel == message.channel.id) {
                if (obj.supportmember) {
                    if (message.author.username + "#" + message.author.discriminator == obj.supportmember) {
                        try {
                            bot.users.get(obj.member).send(">>> **Message from support (" + obj.supportmember + ")**\n" + message.content)
                        } catch (e) {
                            bot.channels.get(obj.schannel).send(">>> **Message from support (" + obj.supportmember + ")**\n" + message.content)
                        }
                    }
                } else {
                    obj.supportmember = message.author.username + "#" + message.author.discriminator
                    try {
                        await bot.users.get(obj.member).send("> **Ticket has been answered by " + obj.supportmember + ". You can now speak to them.**\n" + bot.users.get(obj.member))
                        await bot.users.get(obj.member).send(">>> **Message from support (" + obj.supportmember + ")**\n" + message.content)
                    } catch (e) {
                        await bot.channels.get(obj.schannel).send(">>> **Ticket has been answered by " + obj.supportmember + ". You can now speak to them.**\n@" + obj.member)
                        await bot.channels.get(obj.schannel).send(">>> **Message from support (" + obj.supportmember + ")**\n" + message.content)
                    }

                    data = JSON.stringify(ticketsCheck)
                    fs.writeFileSync('./support.json', data, { 'flags': 'w' })
                }
            } else if (message.channel.type === "dm" && message.author.id == obj.member) {
                bot.channels.get(obj.kchannel).send(">>> **Message from member**\n" + message.content)
            }
        })
    }*/




    var g_info = require("./guild-configuration.json");
    var deny = false;
    // Bot channel check - This checks if the channel is allowed for bot usage.
    g_info.servers.forEach(server => {
        if (server.serverid == message.guild.id) {
            if (server.botchannel.length !== 0) { // If there are any restrictions (Basically if bot-channel only is enabled.)
                if (!server.botchannel.includes(message.channel.id)) { // If the channel the message was sent in is not included, deny
                    deny = true
                }
            }
        }
    })

    var serverprefix = await fetchServerPrefix(message.guild.id) // Get guild specific prefix

    let msgSplit = message.content.split(" "); // ["this", "is", "args"]
    let command;
    let args = msgSplit.slice(1); // Args without the first argument (the command name like k!ban)
    let cmd;

    if (message.content.toLowerCase().startsWith(botconfig.defaultprefix.toLowerCase())) { // If it starts with the default prefix
        command = msgSplit[0].toLowerCase().slice(botconfig.defaultprefix.length) // Command = k!prefix -> prefix
    } else if (message.content.toLowerCase().startsWith(serverprefix.toLowerCase())) { // If it starts with the server prefix
        command = msgSplit[0].toLowerCase().slice(serverprefix.length) // Command = ?prefix -> prefix
    } else return;

    if (bot.commands.has(command)) { // If the full commandname exists as a command
        cmd = bot.commands.get(command);
    } else if (bot.aliases.has(command)) { // If command ran is an alias of another command
        cmd = bot.commands.get(bot.aliases.get(command));
    }

    if (cmd) { // If it found the command
        var perm_check = handler.inhibitor.checkConfiguration(bot, message, cmd, deny)
        if (perm_check && perm_check !== "noperm" && typeof cmd.run === "function") { // Check permissions, if the command is enabled and other stuff
            cmd.run(bot, message, args); // Run command.
        } else if (perm_check == "noperm") {
            return message.channel.send(":x: Sorry, you don't have access to that command.")
        }
    } else {
        //message.channel.send(`That command doesn't exist. Use **${bot.config.prefix}help**, go get all the commands`);
    }

});

bot.on("guildCreate", guild => { // When bot is added to a guild
    handler.event.onGuildCreate(bot, guild); // Send event to our guildCreate manager.
})

bot.on("ready", async () => {
    console.log("Bot starting => " + bot.guilds.size + " guilds, " + bot.users.size + " users.");

    /*bot.setInterval(() => { // Loop
        try {
            var timedActions = require("./timedActions.json") // Actions that need to be completed after a set time.
            if (timedActions.mutes.length !== 0) { // If there are any mutes that need to be handled.
                for (i = 0; i < timedActions.mutes.length; i++) { // Loop
                    let time = timedActions.mutes[i].time; // For how long
                    let guildId = timedActions.mutes[i].guild; // What guild it's in
                    let warnChannel = timedActions.mutes[i].channel
                    let guild = bot.guilds.get(guildId); // Gets guild object
                    let member = guild.members.get(timedActions.mutes[i].userid); // Gets guild member from same guild
                    let mutedRole = guild.roles.find(r => r.name.toLowerCase() === "muted"); // Gets role object
                    if (!mutedRole) continue; // If there's no muted role in the server, skip to next mute action.

                    if (Date.now() > time) { // If action is past, go through with action.
                        if (!member) { // If member is not in the server.
                            timedActions.mutes.splice(timedActions.mutes.indexOf(i, 0)) // Remove auto action in config.

                            fs.writeFile("./timedActions.json", JSON.stringify(timedActions), err => { // Save
                                if (err) throw err;
                                console.log("Admin://User unmuted. (Was not found)") // Since the member isn't in the server.
                            })
                            return;
                        }

                        bot.channels.get(warnChannel).send(`${member} has been unmuted.`)

                        member.removeRole(mutedRole); // Remove role from user.
                        timedActions.mutes.splice(timedActions.mutes.indexOf(i, 0)) // Remove auto action in config.

                        fs.writeFile("./timedActions.json", JSON.stringify(timedActions), err => { // save
                            if (err) throw err;
                            console.log("Admin://User unmuted. ")
                        })
                    }
                }
            }

            if (timedActions.bans.length !== 0) {  // If there are any mutes that need to be handled.
                for (i = 0; i < timedActions.bans.length; i++) { // Loop    
                    let time = timedActions.bans[i].time; // Length of ban
                    let guildId = timedActions.bans[i].guild; // Id of the guild the ban needs to commence
                    let guild = bot.guilds.get(guildId); // Guild object
                    let userId = timedActions.bans[i].userid; // User id of the user.
                    //let member = guild.members.get(timedActions.mutes[i].userid);

                    if (Date.now() > time) { // If action is past, go through with action.
                        guild.unban(userId) // Unban the user.
                            .then(() => {
                                timedActions.bans.splice(timedActions.bans.indexOf(i, 0)) // Remove action from config

                                fs.writeFile("./timedActions.json", JSON.stringify(timedActions), err => { // Save
                                    if (err) throw err;
                                    console.log("Admin://User unbanned. ")
                                })
                            })
                            .catch(err => {
                                console.log("Admin://User failed to be unbanned. (" + guildId + ") User: " + userId + " | " + err) // Debug if user can't be banned.
                            })

                    }
                }
            }
        } catch (err) {
            console.error(err)
        }



    }, 10000); // Check actions every 10 seconds.*/

    /*bot.setInterval(async () => { // Loop
        try {
            var recievedMail = await krunkerMail.getMail()
            console.log("Mail check: " + recievedMail.length + " mails recieved.")
            console.log(recievedMail)
            console.log(recievedMail.size)
        } catch (e) {
            console.log("Couldn't recieve mail.")
        }

    }, 50000); // Check mail every 50 seconds.*/

    bot.user.setPresence({
        status: "online",
        game: {
            name: "k!cmds | k!invite to get the bot!",
            type: "WATCHING"
        }
    })

    /*
    Updates are commenced only through 'update.json' and not through code.
    Updates should be 
    */
    if (update.currentversion !== update.newversion) { // If current version is not the same as new-update version. Can be used to go back or forward in updates.
        console.log("New version found, updating to " + update.newversion + "!")
        update.currentversion = update.newversion
        var uMessage = new discord.RichEmbed()
        uMessage.setTitle("New update!")
        uMessage.setDescription("Krunkbot just had a new update, these are the changelogs.")
        uMessage.addField("Version " + update.newversion + ":", update.updates.join('\n'))
        uMessage.setColor("PURPLE")
        uMessage.setFooter(update.author, bot.users.find("username", update.author).displayAvatarURL)
        await bot.channels.get(botconfig.updatechannel).send(bot.channels.get(botconfig.updatechannel).guild.roles.get("649381782780641300"), uMessage)

        data = JSON.stringify(update)
        fs.writeFileSync('./update.json', data, { 'flags': 'w' })
    }

    // Doing a server scan
    var debounce;
    bot.guilds.forEach(serverthing => {
        debounce = false
        var guildconfig = require('./guild-configuration.json')
        for (i = 0; i < guildconfig.servers.length; i++) { // Loop through guild configuration
            if (guildconfig.servers[i].serverid == serverthing.id) {
                debounce = true // Server was found
            }
        }
        if (debounce == false) { // If the server doesen't exist in config, manually send event.
            handler.event.onGuildCreate(bot, bot.guilds.get(serverthing.id))
        }
    })

    console.log("Bot Loaded");
});

// Player joined event //

bot.on('guildMemberAdd', member => {
    
})

// Raw event //

bot.on('raw', packet => { // Raw event, this is where ALL discord actions goes through
    if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return; // If the reaction add is not in the packet, return.
    const channel = bot.channels.get(packet.d.channel_id); // Get channel from the 
    if (channel.messages.has(packet.d.message_id)) return; // If the message exists.
    channel.fetchMessage(packet.d.message_id).then(message => { // Get the message.
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name; // Create the emoji "object" manually
        const reaction = message.reactions.get(emoji); // get the emoji
        if (reaction) reaction.users.set(packet.d.user_id, bot.users.get(packet.d.user_id)); // Add the users property to the manually created reaction property.
        if (packet.t === 'MESSAGE_REACTION_ADD') { // If the packet is only a reaction add.
            bot.emit('messageReactionAdd', reaction, bot.users.get(packet.d.user_id)); // Emit the event manually through the bot
        }
    });
});

// Emoji event //
bot.on("messageReactionAdd", (reaction, user) => { // When a reaction is added to a CACHED message (Or manually, like the raw event above.)
    const message = reaction.message // Message object.
    const member = reaction.message.guild.members.get(user.id) // Guild member object.

    const roleKeySettings = require("./roleKey.json") // Rolekey settings.

    roleKeySettings.forEach(object => { // For each rolekey entry
        if (object.messageId == message.id) { // If message id is the same
            object.reactions.forEach(reactionObject => { // Get the reactions for the message
                if (reactionObject.emojiId == reaction.emoji.id) { // If the emoji is the same as in role-key object.
                    try {
                        member.addRole(message.guild.roles.get(reactionObject.roleId)) // Add the corresponding role to the user.
                    } catch (e) {
                        // No perms
                    }
                }
            })
        }
    })
})

// Message deleted event

bot.on("messageDelete", (message) => { // Message delete event
    const roleKeySettings = require("./roleKey.json")

    roleKeySettings.forEach(object => { // For each rolekey entry
        if (object.messageId == message.id) { // If message id is the same
            roleKeySettings.splice(roleKeySettings.indexOf(object), 1); // Remove rolekey entry in config
            data = JSON.stringify(roleKeySettings) // Save
            fs.writeFileSync('./roleKey.json', data, { 'flags': 'w' })
        }
    })
})

// Login //
bot.on("error", console.error); // If the bot errors, send to console.
bot.on("warn", console.warn); // If the bot warns, send to console.

bot.login(botconfig.bottoken); // Login with the token in botconfig.
