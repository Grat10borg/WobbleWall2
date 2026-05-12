// overview of twitch bot
let tbot = {

	/* functions */
	clip: clip.bind($), // function, clips stream
	mark: mark.bind($), // function, stream-markers the stream
	
	// for fun functions
	dice: dice.bind($),
	lurk: lurk.bind($),
	click: click.bind($), // i am depraved. :)
    // species
    // discord
    // pronouns
    // website
    // !beep // boop
    // !boop // beep
    // commands
}

/* tbot functions */

// automatic advertisement
setInterval(() => {
    let ads = ["the onscreen chat uses Twitch Pronouns, please specify your pronouns here: https://pr.alejo.io/"];
    ComfyJS.Say(ads[Math.floor(Math.random() * (ads.length -1))]);
}, 1000 * 60 * 60 * 1) // repeat every hour

// clip the last 30s / ~27s of the stream
async function clip() { twitchPost("", "clip", "/clips?broadcaster_id="+config.twitch_id); }
async function mark(desc) { twitchPost(desc, "mark", "/streams/marker"); }

async function twitchPost(desc, cmd_name, url) {
    http = "https://api.twitch.tv/helix"+url;
    if(desc == "" || desc == undefined) {desc = "description unset."}

    let cmd_resp = await fetch(http,{
        method: "POST",
        headers: {
            Authorization: "Bearer " + config.my_api_token,
            "Client-ID": config.client_id,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"user_id": config.twitch_id, "description": desc})
    }) 
    .then((respon) => respon.json())
    .then((respon) => {
        // return Twitch's response
        console.log(respon);
        return respon; 
    })
    .catch((err) => {$$.log(err)})

    // error handling for responses
    if(cmd_resp["error"] == "Not Found")  { $$.err(`⚠ You cannot ${cmd_name} an Offline Channel!! :<`); }
    if(cmd_resp["error"] == "Unauthorized") { $$.err(`⚠ The passed Oauth token, or lack there of was invalid :<`); }
    if(cmd_resp == undefined) { $$.err(`Error, ${cmd_name} response was nothing`); }
    
    // if response was as expected
    else if(cmd_resp["data"][0]["id"] != null) {
        // save "slug" of the returned clip link
        let clip_id = clip_resp["data"][0]["id"];

        if(cmd_name == "clip") {
            // creates a stream marker at the time of clip-taking
            twitchPost("clip created here.", "mark", "/streams/marker");
        }

        ComfyJS.Say("Clipped: https://clips.twitch.tv/"+clip_id);
        $$.log(clip_resp["data"][0]["edit_url"]);
    }
    else { $$.err("Unexpected response:", cmd_resp); }
}


/* for fun functions */

function dice(max) {
    if(settings.tbot.dice_cmd_on) {
        if(isNaN(max)) {
            ComfyJS.Say("please give a NUMBER :)");
            return;
        }
        // return a random number between 0 and max 
        ComfyJS.Say("The Dice rolls..."+
        Math.floor(Math.random() * max + 1) + "!!");
    }
}

function lurk(user) {
    if(settings.tbot.lurk_cmd_on) { 
	    ComfyJS.Say("okey! please enjoy the stream @"+user+"!! :3");
    }
}

function click() {
    if(settings.tbot.click_cmd_on) { 
        audio_play("assets/clicker.mp3"); 
    }
}