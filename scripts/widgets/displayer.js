"use strict";

let disp = {
	elem: $$.id("displayer"),
	displayer: "",
	show: false, // by default displayer isn't shown

	// displayer basic functionability
	toggle: toggle.bind($), // toggle displayer visability
	hide: hide.bind($),
	show: show.bind($),
		
	play: play.bind($), // play a video on the displayer
	stop: stopVideo.bind($),
	pause: pauseVideo.bind($),
	resume: resumeVideo.bind($),
	mute: muteVideo.bind($),
	unmute: unmuteVideo.bind($),
};

/* automatic turn off if chat id isn't found. */
if(disp.elem == undefined) {
	// turn off chat
	settings.displayer_on = false;

	$$.log(settings);
	$$.err("no displayer element found");
} else {
	let div = $$.make("div");
	div.id = "displayer-inner";
	disp.elem.append(div);

	disp.displayer = $$.id("displayer-inner"); 
}


// youtube player
var player;

function play(link) {
	// clear previous video just incase
	let videoId;
	try {
		videoId = (new URL(link)).searchParams.get("v");
		if (! videoId) {throw Error()}
	} catch(err) {
		$$.log(err);
		ComfyJS.Say("invalid youtube link awa,.,,")
		return;
	} 

	$$.log(videoId);
	disp.displayer.innerHTML = "";
	  let div_player = $$.make("div");
	  div_player.id="player";
	  disp.displayer.append(div_player);
			
	  player = new YT.Player('player', {
          height: '95%',
          width: '95%',
          videoId,
          playerVars: {
            'playsinline': 1
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });

		console.log(player)
		// toggle display animation when ready
		if(disp.show == false) {
            disp.show = true;
			if(music.state == "running") {
                audio_stop();
			}
			disp.show();
	}
}

function hide() {
    disp.show = false;
    disp.displayer.classList.remove("disp-show");
    disp.displayer.classList.add("disp-hide");
}
function show() {
    disp.show = true;
    disp.displayer.classList.add("disp-show");
    disp.displayer.classList.remove("disp-hide");
}
function toggle() {
    $$.log("toggling displayer...");	
    disp.show = false;
    disp.displayer.classList.toggle("disp-show");
    disp.displayer.classList.toggle("disp-hide");
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
	disp.toggle();
}

// mostly to help with debuging
function onPlayerStateChange(event) {
	$$.log(YT.PlayerState);
	$$.log(event.data);
    if (event.data == YT.PlayerState.ENDED  
		|| event.data == YT.PlayerState.CUED) {
		
		/* fold displayer away when video completes */
		hide();
    }

}

function stopVideo() {
	// stop video and hide player
	player.stopVideo();
	hide();
}

function pauseVideo() {
	player.pauseVideo();
}

function resumeVideo() {
	player.playVideo();
}

function muteVideo() {
	player.mute();
}

function unmuteVideo() {
	player.unMute();
}

// set volume for player between max and none
function setVolume(vol) {
	let loudness = vol.toFixed;

	if(loudness > -1 && vol < 101) {
		player.setVolume(loudness);
    } else {
		ComfyJS.Say("Please only use numbers between 0-100 :/");
    }
}
