const fs = require("fs");

exports.registerRoleKey = (bot, message, alert) => {
    const settings = require("../roleKey.json") // Require the rolekey config

    var regex = /:\w+>: \"(.*?)\"/g;
    var scanMessage = message.content.match(regex) // Match the message with regex. Should return :1237918723124

    if (!scanMessage) { // If there are no results.
        message.channel.send("```"+message.content+"```") 
        return alert.edit(":x: I could not read that role-key properly. Use `k!rolekey` for more info.")
    }
    
    var roleIdObject = {
        "messageId": message.id,
        "reactions": [
        ]
    }

    scanMessage.forEach(thing => {
        var match1 = thing.match(/"[A-z- -\W-\d]+/)[0]
        var roleName = match1.replace(/^"|"$/g, "")
        if (!message.guild.roles.find("name", roleName)) return;
        var addonObject = {
            "emojiId": thing.match(/\d+/g)[0],
            "roleId": message.guild.roles.find("name", roleName).id // 
        }
        roleIdObject.reactions.push(addonObject)
    })

    if (roleIdObject.reactions.length == 0) {
        message.channel.send("```"+message.content+"```")
        return alert.edit(":x: I could not parse any of those emojis or roles. Are you sure you have the correct role name? Use `k!rolekey` for more info.")
    } 

    alert.edit("Role-key has been detected and added with the following roles and emojis:\n" + roleIdObject.reactions.map(Registry => "**Emoji:** " + bot.emojis.get(Registry.emojiId) + "\n**Role:** " + message.guild.roles.get(Registry.roleId).name + "\n\n"))
    settings.push(roleIdObject)

    data = JSON.stringify(settings)
    fs.writeFileSync("./roleKey.json", data, { 'flags': 'w' })

    roleIdObject.reactions.forEach(reaction => {
        message.react(bot.emojis.get(reaction.emojiId))
    })
}