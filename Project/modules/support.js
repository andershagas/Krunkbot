// Dependencies
const fs = require("fs");
const discord = require("discord.js");
const supportcategory = "620598219138793492"

exports.endsession = async (bot, message) => { // End session, basically close support requests
    var tickets = require("../support.json")
    var debounce = false
    tickets.active.forEach(ticket => { // Get active tickets.
        if (ticket.kchannel == message.channel.id) { // If the channel is an acitve ticket.
            tickets.archived.push(ticket) // Send ticket to archive
            tickets.active.splice(tickets.active.indexOf(ticket, 0)) // Remove ticket from active tickets.
            tickets.totaltickets++ // +1 total tikets
            debounce = true
            try {
                bot.users.get(ticket.member).send("The ticket has ended by the support member. If you need anything else, feel free to use callsupport again.")
            } catch (e) {
                try {
                    bot.channels.get(ticket.schannel).send("The ticket has ended by the support member. If you need anything else, feel free to use callsupport again.")
                } catch (ee) {
                    console.log("Ticket closed for removed server.")
                }
            }
            return
        }
    })

    if (debounce == false) return message.channel.send(":x: You cannot run that in this channel.") // If the channel is not a support request.
    message.channel.delete()

    data = JSON.stringify(tickets)
    fs.writeFileSync('./support.json', data, { 'flags': 'w' })
}

exports.createsession = async (bot, message, description) => { // Create a support ticket.
    var tickets = require("../support.json")
    var debounce = false


    message.author.send(":arrows_counterclockwise: Waiting for data...")
        .then(msg => {
            tickets.active.forEach(ticket => { // Go through active tickets
                if (ticket.serverid == message.guild.id) { // If an active ticket is found with this server id.
                    debounce = true
                    msg.edit(":x: Data cancelled.")
                    return message.channel.send(":x: A ticket is already active in this server in the `" + message.channel.guild.channels.get(ticket.schannel).name + "` channel. Member who requested is " + ticket.member);
                }
            })

            if (debounce == true) return;

            var session = { // Active ticket object.
                member: message.author.id, // The one who ran command (So we can filter)
                supportmember: null, // The first support member to grab ticket
                kchannel: null, // The channel id in our server
                schannel: null, // The support channel in the server that needs help
                serverid: message.channel.guild.id, // Their server id
                description: description
            }


            bot.channels.get(supportcategory).guild.createChannel(message.guild.name, { type: 'text' }) // Creates a channel in support server.
                .then(async ch => {
                    session.kchannel = ch.id
                    await ch.setParent(supportcategory) // Set support channel as child of the support category
                    await ch.lockPermissions(); // Inherit category permissions.
                    const embed = new discord.RichEmbed()
                    embed.setTitle("New support ticket")
                    embed.setColor("BLUE")
                    embed.setDescription("This channel represents the chat you have between the members that need help. First support member to send a request here will get the ticket assigned.")
                    embed.addField("Server:", message.channel.guild.name)
                    embed.addField("Member:", bot.users.get(session.member).username)
                    embed.addField("Description:", description)
                    embed.setTimestamp()
                    await ch.send("@everyone")
                    await ch.send(embed)
                    const embed2 = new discord.RichEmbed()
                    embed2.setTitle("New support ticket")
                    embed2.setColor("BLUE")
                    embed2.setDescription("You just requested a support ticket! One of our staff will talk to you here in this chat in a bit. Don't worry, you will be mentioned if anything happens.")
                    embed2.setTimestamp()
                    await msg.edit(embed2)

                    session.schannel = message.channel.id

                    tickets.active.push(session) // Push active ticket to active tickets in config.
                    data = JSON.stringify(tickets)
                    fs.writeFileSync('./support.json', data, { 'flags': 'w' })
                })
                .catch(console.error)
        })
        .catch(e => {
            tickets.active.forEach(ticket => { // Get all active tickets.
                if (ticket.serverid == message.channel.guild.id) { // If a ticket has same server id as the one the request was sent in
                    debounce = true
                    return message.channel.send(":x: A ticket is already active in this server in the `" + message.channel.guild.channels.get(ticket.schannel).name + "` channel. Member who requested is " + ticket.member);
                }
            })

            if (debounce == true) return;

            var session = {
                member: message.author.id, // The one who ran command (So we can filter)
                supportmember: null, // The first support member to grab ticket
                kchannel: null, // The channel id in our server
                schannel: null, // The support channel in the server that needs help
                serverid: message.channel.guild.id, // Their server id
                description: description
            }


            bot.channels.get(supportcategory).guild.createChannel(message.guild.name, { type: 'text' })
                .then(async ch => {
                    session.kchannel = ch.id
                    await ch.setParent(supportcategory)
                    await ch.lockPermissions();
                    const embed = new discord.RichEmbed()
                    embed.setTitle("New support ticket")
                    embed.setColor("BLUE")
                    embed.setDescription("This channel represents the chat you have between the members that need help. First support member to send a request here will get the ticket assigned.")
                    embed.addField("Server:", message.channel.guild.name)
                    embed.addField("Member:", bot.users.get(session.member).name)
                    embed.addField("Description:", description)
                    embed.setTimestamp()
                    await ch.send("@everyone")
                    await ch.send(embed)
                    const embed2 = new discord.RichEmbed()
                    embed2.setTitle("New support ticket")
                    embed2.setColor("BLUE")
                    embed2.setDescription("You just requested a support ticket! Your dms are disabled so the support will be handled in this channel. If you want us to talk to you in your dms, simply open up your dms.")
                    embed2.setTimestamp()
                    await message.channel.send(embed2)

                    session.schannel = message.channel.id

                    tickets.active.push(session)
                    data = JSON.stringify(tickets)
                    fs.writeFileSync('./support.json', data, { 'flags': 'w' })
                })
                .catch(console.error)
        })


}