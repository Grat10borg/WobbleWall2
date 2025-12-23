
// fetcher only updates at a certain interval, and returns the newest one when queried.
// if "" is sent query saved API calls
let http_calls = {};
async function fetcher(httpcall) {
    let href = "https://api.twitch.tv/helix/";
    $$.log(await $$.api("https://api.twitch.tv/helix/eventsub/subscriptions", true));
    
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
        });
    }

}
setInterval(() => { fetcher(""); }, 1000 * 15); // refresh every 15 seconds

// Initializing Comfy.JS, twitch library to get some specific harder to make 
ComfyJS.Init(config.bot_login, config.bot_oauth, config.twitch_login);

// Loading code.
setTimeout(() =>  {
	$$.query(".loading").setAttribute("style", "opacity: 0;");
}, 1500); 



// Alertbox code
ComfyJS.onCommand = (user, command, message, flags, extra) => {
    alert( user+ " followed!", "robot_headpats.webp");
}
ComfyJS.onRaid = (user, viewers, extra) => {
    alert(user + " just raided with " + viewers +
        " viewers! welcome :3", "robot_stimmies2.webp");
}
ComfyJS.onCheer = (user, message, bits, flags, extra) => {
    alert(user + " just donated " + bits + "<br>"
    + message, "robot_stimmies2.webp");
}
ComfyJS.onSub = (user, message, subTierInfo, extra) => {
    alert(user + " subscribed at " + subTierInfo +
    "! thank youu <br>" + message, "robot_headpats.webp");
}
ComfyJS.onResub = (user, message, streamMonths, cumulativeMonths, subTierInfo, extra) => {
    alert(user + " resubscribed at " + subTierInfo +
    " for "+ cumulativeMonths +"! thank youu <br>" + message, "robot_headpats.webp");
}
ComfyJS.onSubGift = (gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra) => {
    alert(gifterUser + " just gifted " + recipientUser +
    " a tier" + subTierInfo + " sub! woagh,, :O", "robot_stimmies2.webp");
}
ComfyJS.onSubMysteryGift = (gifterUser, numOfSubs, senderCount, subTierInfo, extra) => {
    alert(gifterUser + " just gifted " + numOfSubs  +
    " tier" + subTierInfo + " subs the heck,,,", "robot_headpats.webp");
}
ComfyJS.onGiftSubContinue = (user, sender, extra) => {}
ComfyJS.onHypeTrain = (level, progressToNextLevel, goalToNextLevel, 
                       totalHype, timeRemainingInMS, extra) => {
    // Add more to this
    alert("Hype Train: level " + level + " yall,,, the fuck, <br> do make" 
    +"special graphics for this sometime Grat, -past grat10", "robot_headpats.webp");
}


// toggle alert on when called, and toggle it away again after awhile
function alert(string, img_src) {
    let box = $$.query(".alert");
    let gears = $$.query(".alert-gears");

    box.setAttribute("style", "transform: translateY(0px)");
    gears.setAttribute("style", "translate: 0px -70px");

    box.children[0].src = "images/"+img_src;
    box.children[2].innerText = string;

    setTimeout(() => {
        box.removeAttribute("style", "transition-delay: 0s;");
        gears.setAttribute("style", "translate: 0px -250px; transition-delay: 1s;");
    }, 8000);
}

// Info fields code.
// fetch meta field then do an API call to twitch and place the first
// returned entry in as a available field for formatting.
fillInfo(); // fill info on startup, then update ever 20 seconds
setInterval(() => { fillInfo(); }, 1000 * 20 );

let info_fields = {};
function fillInfo() {
	$$.query_all(".info").forEach(async (info_elem) => {
		let info_options = info_elem.getAttribute("meta").split(","); 
		info_options[0] = info_options[0].replace(
		"config.twitch_id", config.twitch_id);
		let api_res = await fetcher(info_options[0]);
		
		// typically you just want the first entry. 
		// eg: newest follower, newest sub.
		// highest on the leaderboard.
		let text = info_options[1];
		for (let [key, value] of Object.entries(api_res.data[0])) {
			text = text.replaceAll("$"+key, value)	
		}
		info_elem.children[0].innerText = text;
	});
}


// Clock code
// get the innertext of the clock seperated by commas.
// then put pretext make a date format it, then aftertext
let clock_options = $$.query(".clock").innerText.split(",");
setInterval(() => {
	$$.query(".clock").innerText = clock_options[0] + 
	$$.date(new Date(), clock_options[1]) + clock_options[2];
}, 1000);



/* make*/
/* check for special elements */
(async () => {
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
})();

