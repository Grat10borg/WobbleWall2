// Initializing Comfy.JS, twitch library to get some specific harder to make 
ComfyJS.Init(config.bot_login, config.bot_oauth, config.twitch_login);

ComfyJS.onChat = (user, message, flags, self, extra) => {
    (async () => {
        $$.log(message, extra);
        chat.message(await getProfile(user, flags, extra), message, false, extra);
    })()
}

ComfyJS.onRaid = (user, viewers, extra) => {
    alert(`${user} just raided with ${viewers} viewers!`, "robot_stimmies2.webp");
}

ComfyJS.onCheer = (user, message, bits, flags, extra) => {
    alert(`${user} just donated ${bits} bits. ${message}`, "robot_stimmies2.webp");
}

let get_sub_str = (sub_tier_info) => {
    return sub_tier_info.prime
        ? "with Prime"
        : `at level ${sub_tier_info.plan / 1000}`;
}

ComfyJS.onSub = (user, message, subTierInfo, extra) => {
    alert(`${user} just subscribed ${get_sub_str(subTierInfo)}! ${message}`, "robot_headpats.webp");
}

ComfyJS.onResub = (user, message, streamMonths, cumulativeMonths, subTierInfo, extra) => {
    alert(`${user} resubscribed at ${get_sub_str(subTierInfo)} for
    ${cumulativeMonths}! thank youu <br> ${message}`, "robot_headpats.webp");
}

ComfyJS.onSubGift = (gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra) => {
    alert(`${gifterUser} just gifted ${recipientUser} 
    ${get_sub_str(subTierInfo)} sub! woagh,, :O`, "robot_stimmies2.webp");
}

ComfyJS.onSubMysteryGift = (gifterUser, numOfSubs, senderCount, subTierInfo, extra) => {
    alert(`${gifterUser} just gifted ${numOfSubs}  
    ${get_sub_str(subTierInfo)} the heck,,,`, "robot_headpats.webp");
}

ComfyJS.onGiftSubContinue = (user, sender, extra) => {}
ComfyJS.onHypeTrain = (level, progressToNextLevel, goalToNextLevel, 
                       totalHype, timeRemainingInMS, extra) => {
    alert(`Hype Train: level ${level}  yall,,, the fuck`, "robot_headpats.webp");
}

ComfyJS.onCommand = (user, command, message, flags, extra) => {
    (async () => {
        //chat.message(await getProfile(user, flags, extra), `!${command} ${message}`, false, extra);
        await getProfile(user, flags, extra);
    let perm_commands = [
        "play",
        "display",
        "pause",
        "resume",
        "mute",
        "unmute",
        "volume",
        "dtest",
        "music",
        "skip",
        "stop",
        "clear",
        "click"
    ]

    let commands = {
        // social links
        fedi: () => {ComfyJS.Say("boop! ^w^ https://grat.gay?fedi")},
        discord: () => {ComfyJS.Say("beep! ^w^ https://grat.gay?discord")},
        twitch: () => {ComfyJS.Say("bleep! ^w^ https://grat.gay?twitch")},
        rss: () => {ComfyJS.Say("bloop? ^w^ https://grat.gay?rss")},
        bsky: () => {ComfyJS.Say("blop ^w^ https://grat.gay?bsky")},
        live: () => {ComfyJS.Say("bleep! ^w^ https://grat.gay?twitch")},
        yt: () => {ComfyJS.Say("you,tube is, where the poop is! ^w^ https://grat.gay?yt")},
        youtube: () => {ComfyJS.Say("you,tube is, where the poop is! ^w^ https://grat.gay?yt")},
        kofi: () => {ComfyJS.Say("puppy!! ^w^ https://grat.gay?kofi")},
        pronouns: () => {ComfyJS.Say("beep!! :3 https://pr.alejo.io/")},
        pronoun: () => {ComfyJS.Say("beep!! :3 https://pr.alejo.io/")},

        // displayer
        play: () => {play(message)},
        display: () => {play(message)},
        pause: () => {pauseVideo()},
        resume: () => {resumeVideo()},
        mute: () => {muteVideo()},
        unmute: () => {unmuteVideo()},
        volume: () => {setVolume(message)},
        dtest: () => {disp.toggle()},

        // Music box
        music: () => {play_music()},
        skip: () => {music_skip()},
        stop: () => {
            try {
                audio_stop(); 
                stopVideo();
            } catch (error) { }
        },

        // Chat
        clear: () => {clear()},

        // Tbot
        clip: () => {tbot.clip()},
        mark: () => {tbot.mark()},
        dice: () => {tbot.dice(message)},
        lurk: () => {tbot.lurk(user)},
        click: () => {tbot.click()}
    }

    if (commands[command]
        && typeof commands[command] == "function"
        && (!perm_commands.includes(command) || (await getProfile(user)).perms)) {
        commands[command]();
    } else {
       // command doesn't exist!
    }
    })()




}