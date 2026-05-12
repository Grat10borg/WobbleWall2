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
async function clip() {
    // only clip if token is valid.
    // POST call to make and return a twitch clip
    let clip_resp = await fetch(
    "https://api.twitch.tv/helix/clips?broadcaster_id="
    +config.twitch_id,{
        method: "POST",
        headers: {
            Authorization: "Bearer " + config.my_api_token,
            "Client-ID": config.client_id,
            "Content-Type": "application/json"
    },}) 
    .then((respon) => respon.json())
    .then((respon) => {
        // return Twitch's response
        console.log(respon);
        return respon; 
    })
    // error handling for fetch
    .catch((err) => {$$.log(err)})

    // error handling for responses
    if(clip_resp["error"] == "Not Found")  {
        $$.err("⚠ You cannot clip an Offline Channel!! :<");
    }
    if(clip_resp["error"] == "Unauthorized") {
        $$.err("⚠ The passed Oauth token, "+
        "or lack there of was invalid :<");
    }
    if(clip_resp == undefined) {
        $$.err("Error, clip response was nothing");
    }
    
    // if response was as expected
    else if(clip_resp["data"][0]["id"] != null) {
        // save "slug" of the returned clip link
        let clip_id = clip_resp["data"][0]["id"];

        // creates a stream marker of the clip-taking
        this.mark("clip created here.");

        // save clips
        cached.clips.push(clip_resp);
        cached.clip_count++;

        ComfyJS.Say("Clipped: https://clips.twitch.tv/"+clip_id);
        $$.log(clip_resp["data"][0]["edit_url"]);
    }
    else {
        $$.err("Unexpected response:", clip_resp);
    }
}


// markiplier
async function mark(desc) {

    if(desc == "" || desc == undefined)
        desc = "no description given.";

    // POST call to make and return a twitch clip
    let mark_resp = await fetch(
    "https://api.twitch.tv/helix/streams/marker"
    +config.client_id,{
        method: "POST",
        headers: {
            Authorization: "Bearer " + config.my_api_token,
            "Client-ID": config.client_id,
            "Content-Type": "application/json",
    },
    // pass a user id and a description for marker desc
    body: JSON.stringify({"user_id": config.twitch_id,
        "description": desc})
    }) 
    .then((respon) => respon.json())
    .then((respon) => {
        return respon;
    })
    // error handling for fetch
    .catch((err) => {$$.log(err)}) 
    
    // error handling for responses
    if(mark_resp["error"] == "Not Found") {
        $$.err("⚠ You cannot mark an Offline Channel!! :<");
    } 
    if(clip_resp["error"] == "Unauthorized") {
        $$.err("⚠ The passed Oauth token, "+
        "or lack there of was invalid :<");
    } 
    if(mark_resp == undefined) {
        $$.err("Error, mark response was nothing");
    }

    // if response is as expected
    else if(mark_resp["data"][0]["id"] != null) {
        cached.marks.push(mark_resp);
        cached.mark_count++;
    }
    else {
        $$.err("unexpected response:", mark_resp);
    } 
}

/* for fun functions */

function dice(max) {
    if(isNaN(max)) {
		ComfyJS.Say("please give a NUMBER :)");
        return;
    }
	// return a random number between 0 and max 
    ComfyJS.Say("The Dice rolls..."+
    Math.floor(Math.random() * max + 1) + "!!");
}

function lurk(user) {
	ComfyJS.Say("okey! please enjoy the stream @"+user+"!! :3");
}

function click() {
    audio_play("images/clicker.mp3"); 
}