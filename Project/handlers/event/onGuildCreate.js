const guildconfig = require("../../guild-configuration.json");
const fs = require('fs');

// This gets fired whenever a guild is added. (Fired manually)

module.exports = (bot, guild) => {
    var exists = false;
    guildconfig.servers.forEach(server => {
        if (server.serverid == guild.id) {
	    bot.channels.get("630960806967771156").send(`Bot added back. **Name:** ${guild.name} (${guild.id}) **Members:** ${guild.memberCount} members. **Owner:** ${guild.owner.user.tag} (${guild.ownerID})\n**Region:** ${guild.region} **Bot join date:** ${guild.joinedAt.toUTCString()} **Guild create date:** ${guild.createdAt.toUTCString()}`);
            //bot.channels.get("630960806967771156").send("Server added back with " + guild.members.size + " members. (" + guild.name + ")")
            exists = true // If server config already exists, server is added back.
        }
    })
    if (exists == true) return; // return if data already exists.
    try {
        var setupData = {
            "servername": guild.name,
            "serverid": guild.id,
            "warnactions": [], // What is done whenever a warning is given.
            "logschannel": null,
            "botchannel": [],
            "lang": "en",
            "ownerid": guild.ownerID,
            "serverowner": (guild.owner ? guild.owner.user.username : "none") + "#" + (guild.owner ? guild.owner.user.discriminator : "none"),
            "region": guild.region,
            "prefix": "k!"
        }
    } catch(e) {
        return console.log(e + " Error in " + guild.id)
    }
    

    guildconfig.servers.push(setupData)
    data = JSON.stringify(guildconfig) // Save
    fs.writeFileSync('./guild-configuration.json', data, { 'flags': 'w' })

      bot.channels.get("630960806967771156").send(`Bot added. **Name:** ${guild.name} (${guild.id}) **Members:** ${guild.memberCount} members. **Owner:** ${guild.owner.user.tag} (${guild.ownerID})\n**Region:** ${guild.region} **Bot join date:** ${guild.joinedAt.toUTCString()} **Guild create date:** ${guild.createdAt.toUTCString()}`);
    //bot.channels.get("630960806967771156").send("Bot added to " + guild.name + " (" + guild.id + ") with " + guild.members.size + " members.")

}