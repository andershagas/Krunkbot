const WebSocket = require("ws");
const request = require("request");
const { encode, decode } = require("msgpack-lite");

const wssaddress = 'wss://social.krunker.io/ws'
const loginid = '57067135855713821239';


//player_elo, player_elo2, player_elo4

const OrderByMapTypes =
{
    Popular: "votes",
    Hot: "recent",
    Newest: "initialdate"
}

class UserNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserNotFoundError"
    }
}

class GameNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "GameNotFoundError"
    }
}

class webSocketHandler {
    constructor() {
        this.socket = undefined;
    }

    connect() {
        this.socket = new WebSocket(wssaddress, {
            handshakeTimeout: 5000,
            headers: {
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Connection': 'Upgrade',
                'Host': 'krunker_social.krunker.io',
                'Origin': 'https://krunker.io',
                'Pragma': 'no-cache',
                'Upgrade': 'websocket',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36'
            }
        });
    }

    disconnect() {
        try {
            if (!this.socket && this.socket.readyState !== 1)
                return;

            this.socket.close();
            this.socket = undefined;
        } catch (e) {
            console.log("Failed to disconnect socket.")
        }

    }

    checkstate() {
        return this.socket.readyState;
    }
}

class krunker extends webSocketHandler {

    GetMaps(orderby) {
        this.connect();

        return new Promise((resolve, reject) => {
            this.socket.onopen = () => {
                const data = encode(['r', ['maps', orderby]]);
                try {
                    this.socket.send(data.buffer);
                } catch (e) {
                    console.log("Socket failed to send.")
                }

            }

            this.socket.onerror = (e) => {
                this.socket.terminate();
                return reject(e);
            }

            this.socket.onmessage = buff => {
                const data = decode(new Uint8Array(buff.data))[1][2];
                this.disconnect();

                resolve(data);
            }
        });
    }

    GetClaninfo(clanname) {
        this.connect();

        return new Promise((resolve, reject) => {
            this.socket.onopen = () => {
                const data = encode(['r', 'clan', clanname, null, "000000", null]);
                try {
                    this.socket.send(data.buffer);
                } catch (e) {
                    console.log("Socket failed to send.")
                }
            }

            this.socket.onerror = (e) => {
                this.socket.terminate();
                return reject(e);
            }

            this.socket.onmessage = buff => {
                const raw_data = decode(new Uint8Array(buff.data))
                console.log(raw_data)
                const data = raw_data[3];
                if (raw_data[0] == "pi") return;
                this.disconnect();

                if (!data)
                    return resolve(null)

                resolve(data);
            }

            /*const clan_info =
            {
                name: data.player_name,
                id: data.player_id,
                score: data.player_score,
                level: this.GetLevel(data),
                levelProgress: this.GetLevelProgress(data.player_score),
                kills: data.player_kills,
                deaths: data.player_deaths,
                kdr: this.GetKDR(data),
                spk: this.GetSPK(data),
                totalGamesPlayed: data.player_games_played,
                wins: data.player_wins,
                loses: data.player_games_played - data.player_wins,
                wl: this.GetWL(data),
                playTime: this.GetPlayTime(data),
                funds: data.player_funds,
                clan: data.player_clan ? data.player_clan : false,
                featured: data.player_featured ? "Yes" : "No",
                hacker: data.player_hack ? true : false,
                following: data.player_following || 0,
                followers: data.player_followed || 0,
                nukes: player_data.n || 0,
                lastplayed: getclass(player_data.c),
                melee: player_data.mk || 0,
                since: data.player_datenew.slice(0, data.player_datenew.length - 14).replace(/-/g, "/"),
                accuracy: (player_data.h / player_data.s * 100).toFixed(1) + "%".toString(),
                elo: data.player_elo || 0,
                region: data.player_region
            };*/
        })
    }

    GetProfile(username) {
        this.connect();

        return new Promise((resolve, reject) => {
            this.socket.onopen = () => {
                const data = encode(['r', 'profile', username, null, "000000", null ]);
                try {
                    this.socket.send(data.buffer);
                } catch (e) {
                    console.log("Socket failed to send.")
                }
            }

            this.socket.onerror = (e) => {
                this.socket.terminate();
                return reject(e);
            }

            this.socket.onmessage = buff => {
                const data = decode(new Uint8Array(buff.data))[3];
                this.disconnect();



                if (!data || !data.player_name)
                    return reject(new UserNotFoundError());

                function getclass(nn) {
                    const classes = ["Triggerman", "Hunter", "RunNGun", "SprayNPray", "Vince", "Detective", "Marksman", "Rocketeer", "Agent", "Runner", "Bowman", "Commando"]
                    return classes[nn]
                }

                var player_data = JSON.parse(data.player_stats)
                if (!player_data) {
                    player_data = { n: 0, s: 100, h: 0, c: 0 }
                }

                const profile_info =
                {
                    name: data.player_name,
                    id: data.player_id,
                    score: data.player_score,
                    level: this.GetLevel(data),
                    levelProgress: this.GetLevelProgress(data.player_score),
                    kills: data.player_kills,
                    deaths: data.player_deaths,
                    kdr: this.GetKDR(data),
                    spk: this.GetSPK(data),
                    totalGamesPlayed: data.player_games_played,
                    wins: data.player_wins,
                    loses: data.player_games_played - data.player_wins,
                    wl: this.GetWL(data),
                    playTime: this.GetPlayTime(data),
                    funds: data.player_funds,
                    clan: data.player_clan ? data.player_clan : false,
                    featured: data.player_featured ? "Yes" : "No",
                    hacker: data.player_hack ? true : false,
                    following: data.player_following || 0,
                    followers: data.player_followed || 0,
                    nukes: player_data.n || 0,
                    lastplayed: getclass(player_data.c),
                    melee: player_data.mk || 0,
                    since: data.player_datenew.slice(0, data.player_datenew.length - 14).replace(/-/g, "/"),
                    accuracy: (player_data.h / player_data.s * 100).toFixed(1) + "%".toString(),
                    elo1: data.player_elo || 0,
                    elo2: data.player_elo2 || 0,
                    elo4: data.player_elo4 || 0,
                    region: data.player_region
                };

                resolve(profile_info);
            }
        });
    }

    GetUserMods(username) {
        this.connect();

        return new Promise((resolve, reject) => {
            this.socket.onopen = () => {
                const data = encode(['r', 'profile', username, null, "000000", null]);
                try {
                    this.socket.send(data.buffer);
                } catch (e) {
                    console.log("Socket failed to send.")
                }
            }

            this.socket.onerror = (e) => {
                this.socket.terminate();
                return reject(e);
            }

            this.socket.onmessage = buff => {
                const data = decode(new Uint8Array(buff.data))[5];
                this.disconnect();

                if (!data)
                    return reject(new UserNotFoundError());

                resolve(data);
            }
        });
    }

    GetUserMaps(username) {
        this.connect();

        return new Promise((resolve, reject) => {
            this.socket.onopen = () => {
                const data = encode(['r', 'profile', username, null, "000000", null]);
                try {
                    this.socket.send(data.buffer);
                } catch (e) {
                    console.log("Socket failed to send.")
                }
            }

            this.socket.onerror = (e) => {
                this.socket.terminate();
                return reject(e);
            }

            this.socket.onmessage = buff => {
                const data = decode(new Uint8Array(buff.data))[4];
                this.disconnect();

                if (!data)
                    return reject(new UserNotFoundError());

                resolve(data);
            }
        });
    }

    GetUserStore(userid) {
        this.connect();

        return new Promise((resolve, reject) => {

            this.socket.onopen = buff => {
                const data = encode(['r', ['market', 'sales', userid, "KrunkbotWS"]]);

                try {
                    this.socket.send(data.buffer);
                } catch (e) {
                    console.log("Socket failed to send.")
                }
            }

            this.socket.onerror = (e) => {
                this.socket.terminate();
                return reject(e);
            }

            this.socket.onmessage = buff => {
                const data = decode(new Uint8Array(buff.data));

                if (!data)
                    return reject(new Error("Something went wrong!"));

                resolve(data)
            }
        });
    }


    GetStore(itemname) {

        this.connect();

        return new Promise((resolve, reject) => {
            if (itemname) {
                this.socket.onopen = buff => {
                    const login = encode(['a', ['KrunkbotWS', 'TimIsAsswipe']]);

                    try {
                        this.socket.send(login.buffer);
                    } catch (e) {
                        console.log("Socket failed to send.")
                    }
                }
            } else {
                this.socket.onopen = buff => {
                    const data = encode(['r', ['market', 'market', '6388265', 'KrunkbotWS']]);

                    try {
                        this.socket.send(data.buffer);
                    } catch (e) {
                        console.log("Socket failed to send.")
                    }
                }
            }

            this.socket.onmessage = buff => {
                const data = decode(new Uint8Array(buff.data));

                if (data[0] == 'fr') {
                    this.disconnect();
                    resolve(data[1][1]);
                } else if (data[1][1] == 'market') {
                    this.disconnect();
                    resolve(data[1][2]);
                } else if (data[1][1] == "No Items Found") {
                    this.disconnect();
                    resolve(false);
                } else if (data[0] == 'a') {
                    console.log(data)
                    this.disconnect();
                    return;
                    if (data[1][0]) {
                        if (data[1][0][0] == 6388265) {
                            const data = encode(['fil', [0x0, itemname, { 0x0: 0x1, 0x1: 0x1, 0x2: 0x1, 0x3: 0x1, 0x4: 0x1, 0x5: 0x1, 0x6: 0x1 }, '1']]);
                            try {
                                this.socket.send(data.buffer);
                            } catch (e) {
                                console.log("Socket failed to send.")
                            }
                        }
                    }
                }
            }
        });
    }

    GetLeaderboard(orderby) {
        this.connect();

        return new Promise((resolve, reject) => {
            this.socket.onopen = () => {
                const data = encode(['r', 'leaders', orderby, null, '', null]);
                try {
                    this.socket.send(data.buffer);
                } catch (e) {
                    console.log("Socket failed to send.")
                }
            }

            this.socket.onmessage = buff => {
                const data = decode(new Uint8Array(buff.data))[3];
                

                if (!data) {
                    return;
                } else {
                    this.disconnect();
                }

                resolve(data);
            }
        });
    }

    GetGameInfo(gameId) {
        return new Promise((resolve, reject) => {
            request(`https://matchmaker.krunker.io/game-info?game=${gameId}`, (err, res, body) => {
                const json = JSON.parse(body);

                if (!json.region)
                    return reject(new GameNotFoundError("Game not found!"));

                const gameInfo =
                {
                    region: this.GetRegion(json.region.slice(-2)),
                    players: `${json.clients}/${json.maxClients}`,
                    map: json.data.i,
                    custom: json.data.cs
                }

                resolve(gameInfo);
            });

        });
    }

    GetRegion(regionStr) {
        let region;

        switch (regionStr) {
            case "sv":
                region = "Silicon Valley";
                break;
            case "ia":
            case "fl":
                region = "Miami";
                break;
            case "ra":
                region = "Frankfurt";
                break;
            case "js":
                region = "New Jersey";
                break;
            case "il":
                region = "Chicago";
                break;
            case "tx":
                region = "Dallas";
                break;
            case "wa":
                region = "Seattle";
                break;
            case "la":
                region = "Los Angeles";
                break;
            case "ga":
                region = "Atlanta";
                break;
            case "on":
                region = "London";
                break;
            case "ar":
                region = "Paris";
                break;
            case "ok":
            case "nd":
                region = "Tokyo";
                break;
            case "in":
            case "gp":
                region = "Singapore";
                break;
            case "yd":
                region = "Sydney";
                break;
            default:
                region = regionStr;
                break;
        }

        return region;
    }

    GetLevel(data) {
        const score = data.player_score;
        return Math.max(1, Math.floor(0.03 * Math.sqrt(score)));
    }

    GetLevelProgress(playerScore) {
        const PROG_VAR = 0.03;

        const t = PROG_VAR * (Math.sqrt(playerScore));
        const level = Math.floor(t);
        const levelProg = Math.round(100 * (t - level));

        return levelProg;
    }

    GetPlayTime(data) {
        const time = data.player_timeplayed;
        let timeplayed = "";

        const min = Math.floor(Math.floor(time / 1000) / 60) % 60;
        const hour = Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) % 24;
        const day = Math.floor(Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) / 24);

        if (day) timeplayed += `${day}d `;
        if (hour) timeplayed += `${hour}h `;
        if (min) timeplayed += `${min}m`;
        return timeplayed;
    }

    GetKDR(data) {
        const KDR = data.player_kills / data.player_deaths || 0;
        return KDR.toFixed(2);
    }

    GetWL(data) {
        const WL = data.player_wins / data.player_games_played || 0;
        return WL.toFixed(2);
    }

    GetSPK(data) {
        const SPK = data.player_score / data.player_kills || 0;
        return SPK.toFixed(2);
    }

}

module.exports = { krunker, UserNotFoundError, GameNotFoundError, OrderByMapTypes };