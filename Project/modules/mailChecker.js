const puppeteer = require('puppeteer');
var page, browser;

exports.getMail = async (bot, message) => {
    browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] }); // Creates a browser. (Chrome)
    page = await browser.newPage(); // Opens up new page in the browser.

    await page.goto('https://krunker.io', { waitUntil: 'networkidle0' }); // Goes to krunker.io. "networkidle0" is when the page is fully loaded, basically when Krunker has gone past the "loading..." section to enter the game.

    const getData = async () => {
        return await page.evaluate(async () => {
            return await new Promise(resolve => {
                var waitFor = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms)); // Uses promise to wait x amount of milliseconds.

                mailList = [];
                relog = function () { // recursable function
                    if ($("#signedOutHeaderBar").css("display") == "flex") {
                        accName = {
                            value: "KrunkBotVerify"
                        };
                        accPass = {
                            value: "KBotIsBadBot1923"
                        };
                        loginAcc(); // This function forces the page to authenticate with the inputted login. (Look in website docs.)

                        checkAgain = setTimeout(relog, 2500)
                    } else {
                        showWindow(30);

                        checkMail = setInterval(async function () {
                            if ($("#mailList")[0].innerText != "Loading...") {

                                clearInterval(checkMail);

                                for (const child of $("#mailList")[0].children) {
                                    $(child).click();

                                    setTimeout(function () {
                                        if ($(child)[0].children[2].innerText == "Loading...") {
                                            $(child).click();

                                            setTimeout(function () {
                                                $(child).click();
                                            }, 50)
                                        }
                                    }, 500)

                                    await waitFor(500);
                                }

                                setTimeout(async function () {
                                    $.each($(".mailObj.mailUnread"), (key, mail) => {
                                        mailList.push({
                                            timeAgo: mail.innerText.split('\n')[0],
                                            user: mail.innerText.split('\n')[2].split('sent you')[0].trim(),
                                            krAmount: Number(mail.innerText.split('\n')[2].split('sent you')[1].trim().split('KR')[0].trim()),
                                            msg: mail.innerText.split('\n')[3].trim()
                                        })
                                    })

                                    resolve(mailList);
                                }, 2500)
                            }
                        })
                    }
                }

                checkReady = setInterval(function () {
                    if ($("#signedOutHeaderBar").css("display") == "flex") {
                        relog();
                        clearInterval(checkReady);
                    }
                })
            })
        })
    }

    await page.close()

    return await getData();
}