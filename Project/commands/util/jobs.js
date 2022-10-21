const { fetchLanguage } = require('../../modules/server.js');
const { RichEmbed } = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs');

// big gay anders 


module.exports.run = async (bot, message, args) => {
    /*
    Jobs command.

    jobs list - This lists the following data: Username (The one who published the job), Job description (Short detail), Job id (Identifier for the job), kr reward.
    jobs info <Id> - This shows the information of the job. Username, long description, kr reward, shows if you want to accept job, run k!jobs acquire <jobid>
    jobs create - Starts the job creation dialog, asks for:
        - What's the short title of this job? (Ex. GFX job)
        - What's the description of this job? (What you need to be done)
        - What's the reward for this job? (Ex. 10,000kr)
    jobs acquire <Id> - Asks for confirmation that you want this job.
    */

    var selector = args[0]
    if (!args[0]) return message.channel.send(":x: Please provide a valid argument. (create/list/acquire/info/complete)")

    const embed = new RichEmbed()
    try {
        delete require.cache[require.resolve('../../Jobs.json')]
    } catch (e) {
        // ignore
    }
    switch (args[0].toLowerCase()) {
        case "complete":
            if (!args[1]) return message.channel.send(':x: Please define a job id. You can find them in `k!jobs list`, encased in ()')
            if (parseInt(args[1]) == NaN) return message.channel.send(":x: Invalid job id, make sure the id is a number.")
            var jobId = parseInt(args[1])


            var jobsJson = require('../../Jobs.json');
            if (jobsJson[jobId].taker == false) return message.channel.send(":x: No one has taken this job. You can't complete this job.");
            if (jobsJson[jobId].host !== message.author.id) return message.channel.send(":x: You can only complete jobs you have created.")
            if (jobsJson[jobId].complete == true) return message.channel.send(":x: This is already completed.")
            jobsJson[jobId].complete = true
            message.channel.send(":ballot_box_with_check: Job has been completed. Recipents has been messaged.")

            const completedEmbed = new RichEmbed()
            completedEmbed.setTitle("Krunkbot Job Alert")
            completedEmbed.setDescription("Job has been marked `complete` by " + bot.users.get(jobsJson[jobId].host).tag + ".")
            completedEmbed.addField("Job taker", bot.users.get(jobsJson[jobId].taker).tag)
            completedEmbed.addField("Title", jobsJson[jobId].shortTitle)
            completedEmbed.addField("Description", jobsJson[jobId].longDescription)
            completedEmbed.addField("Reward", jobsJson[jobId].reward)
            completedEmbed.setColor("GREEN")
            completedEmbed.setTimestamp()
            bot.users.get(jobsJson[jobId].taker).send(completedEmbed)
            bot.users.get(jobsJson[jobId].host).send(completedEmbed)

            data = JSON.stringify(jobsJson)
            fs.writeFileSync("./Jobs.json", data, { 'flags': 'w' })
            break;

        case "acquire":
            if (!args[1]) return message.channel.send(':x: Please define a job id. You can find them in `k!jobs list`, encased in ()')
            if (parseInt(args[1]) == NaN) return message.channel.send(":x: Invalid job id, make sure the id is a number.")
            var jobId = parseInt(args[1])


            var jobsJson = require('../../Jobs.json');
            if (jobsJson[jobId].taker !== false) return message.channel.send(":x: Couldn't find that job. Try find one in `k!jobs list`");
            if (jobsJson[jobId].host === message.author.id) return message.channel.send(":x: You can't take your own jobs.")
            embed.setTitle("Krunkbot Job acquire")
            embed.setDescription("Are you sure you want to acquire this job?\n\n**ANSWER WITH YES OR NO!**")
            embed.addField("Job giver", bot.users.get(jobsJson[jobId].host).tag)
            embed.addField("Title", jobsJson[jobId].shortTitle)
            embed.addField("Description", jobsJson[jobId].longDescription)
            embed.addField("Reward", jobsJson[jobId].reward)
            embed.setColor("GOLD")
            embed.setTimestamp()
            message.channel.send(embed)
            const yesCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 20000 })
            yesCollector.on('collect', m1 => {
                yesCollector.stop()
                switch (m1.content.toLowerCase()) {
                    case "yes":
                        try {
                            delete require.cache[require.resolve('../../Jobs.json')]
                        } catch (e) {
                            // ignore
                        }

                        jobsJson = require('../../Jobs.json');
                        message.channel.send("Job registration complete.")
                        jobsJson[jobId].taker = message.author.id
                        const embed2 = new RichEmbed()
                        embed2.setTitle("Krunkbot Job Alert")
                        embed2.setColor("GREEN")
                        embed2.setTimestamp()
                        embed2.setDescription("Someone has accepted your job. You will be contacted or you can contact the following:\n\n" + message.author.tag + ` (${message.author.id})`)
                        embed2.addField("Title", jobsJson[jobId].shortTitle)
                        bot.users.get(jobsJson[jobId].host).send(embed2)

                        const embed3 = new RichEmbed()
                        embed3.setTitle("Krunkbot Job Alert")
                        embed3.setColor("GREEN")
                        embed3.setTimestamp()
                        embed3.setDescription("You have accepted a job.")
                        embed3.addField("Job giver", bot.users.get(jobsJson[jobId].host).tag)
                        embed3.addField("Title", jobsJson[jobId].shortTitle)
                        embed3.addField("Description", jobsJson[jobId].longDescription)
                        embed3.addField("Reward", jobsJson[jobId].reward)
                        bot.users.get(jobsJson[jobId].taker).send(embed3)


                        data = JSON.stringify(jobsJson)
                        fs.writeFileSync("./Jobs.json", data, { 'flags': 'w' })
                        break;

                    case "no":
                        message.channel.send("Job registration cancelled.")
                        break;

                    default:
                        message.channel.send("Unknown reply. Job registration cancelled.")
                        break;
                }
            })
            break;

        case "create":
            embed.setColor("BLUE")
            embed.setTitle("Krunkbot Job Creation")
            embed.setDescription("**What's the short title of this job? (Ex. GFX Job)**\n\n*You have 60 seconds to reply*")

            var sentMessage;

            await message.author.send(embed)
                .catch(() => {
                    message.channel.send(":x: Your dms are closed. Please re-open them and re-run the command.")
                    sentMessage = false;
                })

            if (sentMessage == false) return;
            var jobsJson = require('../../Jobs.json');
            message.channel.send(":ballot_box_with_check: I've sent you a message.")
            // message check done

            var responseObject = {
                "host": message.author.id,
                "shortTitle": null,
                "longDescription": null,
                "reward": null,
                "taker": false,
                "complete": false
            }

            const firstCollector = new Discord.MessageCollector(message.author.dmChannel, m => m.author.id === message.author.id, { time: 60000 });
            firstCollector.on('collect', m1 => {
                firstCollector.stop()
                responseObject.shortTitle = m1.content
                embed.setDescription("**What is the long long description of the job?**\n\nIf someone is interested, they can check job info. This is where you say what, how many, and so on of what you need. (Ex. 3 logos for 3 servers)\n\n*You have 60 seconds to reply.*")
                message.author.send(embed)
                const secondCollector = new Discord.MessageCollector(message.author.dmChannel, m => m.author.id === message.author.id, { time: 60000 });
                secondCollector.on('collect', m2 => {
                    secondCollector.stop()
                    responseObject.longDescription = m2.content
                    embed.setDescription("**How much does this cost?** (Ex. 3,500KR, real money or any other current is not permitted. Same goes to job. You cannot buy KR for irl money.)\n\n*You have 60 seconds to reply.*")
                    message.author.send(embed)
                    const thirdCollector = new Discord.MessageCollector(message.author.dmChannel, m => m.author.id === message.author.id, { time: 60000 });
                    thirdCollector.on('collect', m3 => {
                        thirdCollector.stop()
                        responseObject.reward = m3.content
                        embed.setDescription("Successfully created job.")
                        embed.addField("Short description", responseObject.shortTitle)
                        embed.addField("Long description", responseObject.longDescription)
                        embed.addField("Reward", responseObject.reward)
                        embed.addField("Identifier", "When you want to complete the task, or show info, use the id `" + jobId + "`")
                        embed.setColor("GREEN")
                        message.author.send(embed)
                        jobsJson.push(responseObject)
                        data = JSON.stringify(jobsJson)
                        fs.writeFileSync("./Jobs.json", data, { 'flags': 'w' })
                    })
                })
            })
            break;

        case "info":
            if (!args[1]) return message.channel.send(':x: Please provide a job id, you can find them in `k!jobs list`')
            if (parseInt(args[1]) == NaN) return message.channel.send(":x: Invalid job id, make sure the id is a number.")
            var jobId = parseInt(args[1])

            var jobsJson = require('../../Jobs.json');
            embed.setTitle('KrunkBot Job Information')
            if (jobsJson[jobId].taker !== false) return message.channel.send(":x: Couldn't find that job. Try find one in `k!jobs list`");
            embed.addField("**Job Giver**", bot.users.get(jobsJson[jobId].host).tag)
            embed.addField("**Job Info**", "**" + jobsJson[jobId].shortTitle + "**\n\n" + jobsJson[jobId].longDescription)
            embed.addField("**Reward**", jobsJson[jobId].reward)
            embed.setColor("BLUE")
            embed.setTimestamp()
            message.channel.send(embed)
            break;

        case "list":
            var jobsJson = require('../../Jobs.json');
            function getEmbed(pageNumber) {
                hasJobs = false;
                var embed = new RichEmbed()
                for (i = 0; i < 10; i++) {
                    if (jobsJson[i + pageNumber]) {
                        if (jobsJson[i + pageNumber].taker !== false) continue;
                        embed.addField(jobsJson[i + pageNumber].shortTitle + ` (${i + pageNumber})`, "**" + bot.users.get(jobsJson[i + pageNumber].host).tag + "** " + jobsJson[i + pageNumber].reward)
                        hasJobs = true;
                    }
                }
                if (hasJobs == false) {
                    embed.setTitle("Krunkbot Jobs List")
                    embed.setColor("RED")
                    embed.setDescription("Sorry, there are no jobs currently available.")
                    embed.setTimestamp()
                } else {
                    embed.setTitle(`Krunkbot Jobs List`)
                    embed.setDescription("This is the Krunker jobs list. You can take a job by using `k!jobs acquire <jobId>`")
                    embed.setTimestamp()
                }
                return embed;
            }

            message.channel.send(`${bot.emojis.get("626065835764613120")} Loading jobs..`).then(async msg => {
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
                            if (currentPage > jobsJson.length) {
                                currentPage = jobsJson.length - 10
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
            break;
    }
}

module.exports.config = {
    command: "jobs", // Full command name
    aliases: [], // Aliases of command.
    enable: true, // Enables the command.
    guildOnly: false, // Guild only command, ex [126012103910752257,488840409829605378]
    hideHelp: false, // Hides from help command.
    userPermission: false, // Permission the user need to interact with the command in the chat channel. If empty it get ignored. administrator permission override this.
    //userOnly: false, // User only command. Only one or more users can use this command
    userOverride: false,//[123850789184602112], // User can run this command no matter where they are nor need any userpermission,
    ignoreCmdonly: false,

    // help
    description: "acquire, create and list jobs.", // Description of the command, used in "help" command.
    usage: "jobs <create/list/acquire/info>" // Explains to the user 
}