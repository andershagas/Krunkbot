const fs = require("fs");
const fsn = require("fs-nextra");
const { Canvas } = require("canvas-constructor");
const discord = require('discord.js');

exports.createPlayerCard = async (stats, message) => {
    try {
        Object.keys(require.cache).forEach(function (key) {
            if (key.search("clan-colors") !== -1) {
                delete require.cache[key]
            }
        });
        
        const clanColor = require("../resource/clan-colors.json");
        const patreons = require("../patreons.json");
        if (fs.existsSync("./resource/backgrounds/User-" + stats.name.toString() + ".png")) { // Check if the user is found as background (First priority)
            stats.background = "./resource/backgrounds/User-" + stats.name.toString() + ".png"
        } else if (fs.existsSync("./resource/backgrounds/Clan-" + stats.clan.toString() + ".png")) { // Check if the user has a clan background (Second priority)
            stats.background = "./resource/backgrounds/Clan-" + stats.clan.toString() + ".png"
        } else if (stats.clan.toString() == "24/7") { // Manual 24/7 because / can't be in files.
            stats.background = "./resource/backgrounds/Clan-247Special.png"
        } else {
            stats.background = "./resource/backgrounds/Default.png" // Default
        }
        if (stats.name == "Sidney") { // If the username is Sidney, change lastplayed.
            stats.lastplayed = "Sidney"
        } else if (stats.name == "SkomakareAnton") {
            stats.lastplayed = "SkomakareAnton"
        } else if (!stats.lastplayed) { // If there's no lastplayed variable, do this thing.
            stats.lastplayed = "Agent";
        }
        if (stats.clan) { // If there's a clan
            stats.clancolor = "#fff" // Default color
            clanColor.forEach(obj => {
                if (obj.name == stats.clan) { // If the clan file has a color
                    stats.clancolor = obj.color; // Set color
                }
            })
        }
        if (patreons.tier1.includes(stats.name)) { // If the user is a patreon tier1
            stats.patreon = "./resource/profilecardmarks/tier1.png";
        } else if (patreons.tier2.includes(stats.name)) { // If the user is a patreon tier2
            stats.patreon = "./resource/profilecardmarks/tier2.png";
        } else if (patreons.tier3.includes(stats.name)) { // If the user is a patreon tier3
            stats.patreon = "./resource/profilecardmarks/tier2.png";
        }
        const buffer = await profile(stats, message);
        const filename = `profile-${stats.name}.png`;
        const attachment = new discord.Attachment(buffer, filename);
        message.channel.send(attachment);
    } catch (err) {
        console.error(err);
    }
}

async function profile(stats, message) {

    function meassure(text) {
        return new Canvas(650, 250).setTextFont("20px Krunk, Jp2, Jp, Sym").measureText(text).width;
    }

    function checkVerified(value) {
        return value == "Yes";
    }

    function isOdd(num) {
        return num % 2;
    }

    function getLevelIcon(level) {
        if(level > 101) return 101
        return isOdd(stats.level) ? stats.level : stats.level - 1
    }

    try {
        const backgroundImg = await fsn.readFile(stats.background);
        const verifiedImg = await fsn.readFile("./resource/backgrounds/Verified.png");
        const classImg = await fsn.readFile(`./resource/class/${stats.lastplayed}.png`)
        const flagImg = await fsn.readFile(`./resource/flags/flag_${stats.region}.png`)
        const levelImg = await fsn.readFile(`./resource/levelIcons/${getLevelIcon(stats.level)}.png`)

        var patreonImg;
        if (stats.patreon) patreonImg = await fsn.readFile(stats.patreon);

        Canvas.registerFont("./resource/fonts/krunker.otf", { family: "Krunk" })
        Canvas.registerFont("./resource/fonts/otsutome.ttf", { family: "Jp2" })
        Canvas.registerFont("./resource/fonts/yangfont02.ttf", { family: "Jp" })
        Canvas.registerFont("./resource/fonts/ArialUnicode.ttf", { family: "Sym" })
        var verified = checkVerified(stats.featured) ? 42 : 10;
        var nameWidth = meassure(stats.name);
        var clanWidth = stats.clan ? meassure(stats.clan) : -30;
        var levelWidth = meassure(stats.level)

        return new Canvas(650, 250)
            .addImage(backgroundImg, 0, 0, 650, 250)
            .setColor("#ffffff")
            .setTextFont("20px Krunk, Jp2, Jp, Sym")
            .addText(stats.name, 160, 40) // Username
            .setColor(stats.clancolor)
            .addImage(checkVerified(stats.featured) ? verifiedImg : "", 160 + nameWidth + 10, 18, 20, 20)
            .addText(stats.clan ? `[${stats.clan}]` : "", 160 + nameWidth + verified, 40)
            .setColor("#ffffff")
            .addText(stats.level, 160 + nameWidth + verified + clanWidth + 94, 40)

            .setColor("#a4a4a4")
            .addText("LVL", 160 + nameWidth + verified + clanWidth + 40, 40)
            .addImage(flagImg, 160 + nameWidth + verified + clanWidth + 94 + levelWidth, 8, 35, 35)
            .addImage(levelImg, 160 + nameWidth + verified + clanWidth + 84 + levelWidth + 35, 8, 35, 35)
            .setTextAlign("center")
            .setTextFont("13px Krunk")
            .addText("SCORE", 197, 72) // Score
            .addText("SPK", 298, 72) // SPK
            .addText("KR", 384, 72) // Krunkies
            .addText("KILLS", 477, 72) // Kills
            .addText("DEATHS", 592, 72) // Deaths
            .addText("GAMES", 197, 119) // Games
            .addText("KDR", 298, 119) // KDR
            .addText("WINS", 384, 119) // Wins
            .addText("W/L", 477, 119) // W/L
            .addText("MELEE", 592, 119) // Melee
            .addText("KPG", 197, 166) // KPG
            .addText("NUKES", 298, 166) // nukes
            .addText("SPG", 384, 166) // SPG
            .addText("ACCURACY", 477, 166) // Accuracy
            .addText("TIME", 592, 166) // Time played
            .addText("SINCE", 247.5, 213) // Since
            .addText("FOLLOWING/ERS", 384, 213) // Following/Followers
            //.addText("FOLLOWERS", 534.5, 213) // Followers
            .addText("1v1/2v2/4v4", 534.5, 213) // 1v1,2v2,4v4
            .setColor("#ffffff")
            .setTextFont("14px Krunk")
            .addText(stats.score, 197, 93) // Score
            .addText(stats.spk, 298, 93) // SPK
            .addText(stats.funds, 384, 93) // Krunkies
            .addText(stats.kills, 477, 93) // Kills
            .addText(stats.deaths, 592, 93) // Deaths
            .addText(stats.totalGamesPlayed, 197, 140) // Games
            .addText(Number(parseFloat(stats.kills / stats.deaths).toFixed(3)) || 0, 298, 140) // KDR
            .addText(stats.wins, 384, 140) // Wins
            .addText(stats.wl, 477, 140) // W/L
            .addText(stats.melee, 592, 140) // Melee
            .addText(Number(parseFloat(stats.kills / stats.totalGamesPlayed)).toFixed(2) || 0, 197, 187) // KPG
            .addText(stats.nukes, 298, 187) // nukes
            .addText(Number(parseFloat(stats.score / stats.totalGamesPlayed)).toFixed(2), 384, 187) // SPG
            .addText(stats.accuracy, 477, 187) // Accuracy
            .addText(stats.playTime, 592, 187) // Time played
            .addText(stats.since, 247.5, 234) // Since
            .addText(stats.following + "/" + stats.followers, 384, 234) // Following/Followers
            //.addText(stats.followers, 534.5, 234) // Followers
            .addText(stats.elo1 + "/" + stats.elo2 + "/" + stats.elo4, 534.5, 234) // 1v1/2v2/4v4
            .setColor("#ff0000")
            .addImage(stats.patreon ? patreonImg : "", -15, 179)
            .setTextFont("20px Krunk")
            .addText(stats.hacker ? "HACKER!" : "", 80, 230)
            .addImage(classImg, -90, 7, 340, 200)

            .toBufferAsync();
    } catch (err) {
        console.error(err);
    }
}