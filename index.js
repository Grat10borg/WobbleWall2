// fetcher only updates at a certain interval, and returns the newest one when queried.
// if "" is sent query saved API calls
let http_calls = {};
async function fetcher(httpcall) {
    let href = "https://api.twitch.tv/helix/";
    
    // fetch initial request, and save it if queried again / by another widget.
    if(Object.keys(http_calls).includes(httpcall) == false && httpcall != "") {
        http_calls[httpcall] = await $$.api(href+httpcall, true);
        return http_calls[httpcall];
    }

    // fetch previously saved request.
    if(Object.keys(http_calls).includes(httpcall) == true && httpcall != "") {
        return http_calls[httpcall];
    }

    // fetch all saved requests, on a set interval.
    if(httpcall == "") {
        console.info("INFO: pinging twitch API for newer data.");
        
        // go through each saved request and refresh them
        Object.keys(http_calls).forEach(async request => {
            http_calls[request] = await $$.api(href+request, true);
        })
    }
}

setInterval(() => { fetcher(""); }, 1000 * 15); // refresh every 15 seconds

/* Get 3rd-party emotes */
let third_party_emotes = {};
;(async () => {
    // 7TV, BetterTV, BetterTV Global, FrankerfaceZ
    let TV = await $$.api(`https://7tv.io/v3/users/twitch/${config.twitch_id}`, false);
    let BTV = await $$.api(`https://api.betterttv.net/3/cached/users/twitch/${config.twitch_id}`, false);
    let BTVG = await $$.api(`https://api.betterttv.net/3/cached/emotes/global`, false);
    let Frank = await $$.api(`https://api.frankerfacez.com/v1/room/${config.twitch_login}`, false);
    
    // 7TV, BetterTV, FrankerfaceZ sorted into an object.
    TV.emote_set.emotes.forEach(e => {
        if(settings.chat.banned_emotes.includes(e.name)) { return; }
        third_party_emotes[e.name] = `https:${e.data.host.url}/4x.webp`; });
    [ ...BTVG, ...BTV.channelEmotes, ...BTV.sharedEmotes].forEach
    (e => { 
        if(settings.chat.banned_emotes.includes(e.code)) { return; }
        third_party_emotes[e.code] = `https://cdn.betterttv.net/emote/${e.id}/3x`; });

    let set = Frank.room.set;
    Frank.sets[set].emoticons.forEach(e => { 
        if(settings.chat.banned_emotes.includes(e.name)) { return; }
        // choose animated version if available.
        if (e.animated) {
            third_party_emotes[e.name] = e.animated[4]; 
        } else {
            third_party_emotes[e.name] = e.urls[4]; 
        }
    });
})()
$$.log(third_party_emotes);

// fetch profile pictures from the twitch api
let users = {};
async function getProfile(username, flags, extra) {
    if (users[username]) {
        return users[username];
    }

	// request profile picture
    let request = await $$.api(
	"https://api.twitch.tv/helix/users?login=" + username.toLowerCase(), true);

    let pronouns;
    let pronoun_primary;
    let pronoun_secondary;

    // this api is horried
    // instead of returning the expected she/it
    // its instead giving lookup keys, which aren't available anywhere
    // so nowww i have to have two ginormous objects for current and past-tense
    // yay.
    let twitnouns = await fetch("https://api.pronouns.alejo.io/v1/users/"+username.toLowerCase());

    if(twitnouns.status == 404) {
        pronouns = false;
    } 
    if (twitnouns.status == 200) {

        twitnouns = await twitnouns.json();

        let pronouns_obj =  {
            any: ["any"],
            other: ["other"],
            eem: ["e", "em"],
            vever: ["ve", "ver"],
            xexem: ["xe", "xem"],
            itits: ["it", "its"],
            aeaer: ["ae", "aer"],
            hehim:  ["he", "him"],
            ziehir: ["zir", "hir"],
            sheher: ["she", "her"],
            perper: ["per", "per"],
            faefaer: ["fae", "faer"],
            theythem: ["they", "then"]
        }
        
        if (twitnouns["alt_pronoun_id"] != undefined && twitnouns["alt_pronoun_id"] != "") {
            pronoun_primary = pronouns_obj[twitnouns["pronoun_id"]][0];
            pronoun_secondary = pronouns_obj[twitnouns["alt_pronoun_id"]][1];

            pronouns = [pronoun_primary, pronoun_secondary].join("/"); 
        } else { // incase of any or other they just get "" appended.
            pronouns = pronouns_obj[twitnouns["pronoun_id"]].join("/");

            pronoun_primary = pronouns.split("/")[0];
            pronoun_secondary = pronouns.split("/")[1];
        }
    }


    // used for approval for higher perm command usage
    let perms = false;
    $$.log(flags);
    if(flags.broadcaster || flags.mod || flags.vip) { perms = true; }

	// make shorter "filepath" version 
	let twitch = request["data"][0];

	// log user data
	users[username] = {
        // pronouns, twitch pronouns & pronounDB
        "pronouns": pronouns,
        "pronouns_primary": pronoun_primary,
        "pronouns_secondary": pronoun_secondary,

        // twitch infomation
		"profile_img": twitch["profile_image_url"],
		"offline_img": twitch["offline_image_url"],
		"displayName": extra.displayName,
		"desc": twitch["description"],
		"color": extra.userColor,
		"login": extra.channel,
		"id": extra.userId,

		// status
		"broadcaster_type": twitch["broadcaster_type"],
		"badges": extra.userBadges,
		"extra": extra,
		"flags": flags,
        "perms": perms,

        // colors
        palette: await (async () => {
            return new Promise((resolve) => {
                Vibrant.from(twitch["profile_image_url"]).getPalette().then(resolve);
            })
        })()

	}

	// return profile src
	return users[username];
}

// add Twitch emotes with the help of the API
function addEmotes(message, extra) {
    let emotes;
    
    let newMessage = message.innerText;
    if(extra["userState"]["emotes-raw"] != null) {
        if(extra["userState"]["emotes-raw"].match("/")) {
            emotes = extra["userState"]["emotes-raw"].split("/");	
        } else {
            emotes = [extra["userState"]["emotes-raw"]];
        } 

        // twitch emotes
        emotes.map((emotes) => {
            let res = emotes.split(":");
            let locations = res[1].split(",");
            let indexs = locations[0].split("-");

            // finds emote name in message
            let emoteName = message.innerText.trim().substring(
                parseInt(indexs[0]),
                parseInt(indexs[1]) + 1
            )
            // makes direct link to emote image
            let emoteImage;	
            // add SRC and classes
            if(extra.isEmoteOnly == true) {
                emoteImage = "<img class='emote-only'"+ 
                "src='https://static-cdn.jtvnw.net/emoticons/v2/"
                + res[0] + "/default/dark/3.0'></img>";
            } else {
                emoteImage = "<img class='emote'"+ 
                "src='https://static-cdn.jtvnw.net/emoticons/v2/"
                + res[0] + "/default/dark/3.0'></img>";
            }

            newMessage = newMessage.replaceAll(emoteName, emoteImage);	
        })
    }

    $$.log(newMessage);
    //$$.log(extra.isEmoteOnly);

    for (let [key, value] of Object.entries(third_party_emotes)) {
        // if its only an a third party emote in the message
        //$$.log(`"${newMessage}"`, `"${key}"`);
        //$$.log(newMessage.replaceAll(/[^\d\w\s]/g, "") == key, newMessage.match(key));
        //$$.log(newMessage.replaceAll(/[^\d\w\s]/g, "").trim().length, key.length);
        //$$.log(newMessage);
        
        //$$.log(message.innerText, newMessage.replaceAll(/[^\d\w\s]/g, ""), key)
        if(newMessage.replaceAll(/[^\d\w\s:]/g, "") == key) {
            emoteImage = `<img class='emote-only' src="${value}"></img>`;
            newMessage = newMessage.replaceAll(key, emoteImage);
        }
        if(newMessage.match(key)) {
            emoteImage = `<img class='emote' src="${value}"></img>`;
            newMessage = newMessage.replaceAll(key, emoteImage);
        }
    }
    // third party emotes
    

	return newMessage;
}

/* -- Widgets -- */
// Loading code.
setTimeout(() =>  {
	$$.query(".loading").setAttribute("style", "opacity: 0;");
}, 1500) 

/* random extra functions */

/* make*/
/* check for special elements */
function svg_img(element) {
    // searches for <svg-img> and uses src="" to fetch and fill it with
    // the requested img (hopefully an actual SVG file)
    let svgs = $$.query_all("svg-img");
    for (let i = 0; i < svgs.length; i++) {
        // nobody specified a src="" attribute :c
        if (! svgs[i].getAttribute("src")) {
            continue;
        }

        // get and set the svg data in the background
        (async () => {
            let res = await (await fetch(svgs[i].getAttribute("src"))).text();
            svgs[i].innerHTML = res;
        })()
    }
}

;(async () => {
    svg_img($$);
})()

