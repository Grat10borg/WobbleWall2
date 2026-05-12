<img width="150" alt="icon" src="https://github.com/user-attachments/assets/0c427739-3ba4-4d6e-bc8a-2a89b2900e50" />

# WobbleWall - A locally running stream overlay.

Wobblewall is a drop in replacement for StreamLabs & StreamElements, running locally on your computer where your data is safe.

it should run perfectly in either OBS or SLOBS via a browser source. 

Note: This overlay was specifically made for Grat10 and as such a lot of settings by default are geared towards her preferences and streams.

## Requirements
- A locally running webserver (Xampp, serve)
- OBS version which supports browser sources.
- Twitch ClientID, Token, and ID & Username
- Optionally: Bot Token & Username

## Screenshots & Yapping
<img width="1920" height="1080" alt="a screencap of Grat10's stream with several people in chat and a few info bars beneath it all within a darkblue overlay" src="https://github.com/user-attachments/assets/9c1508e3-c3c8-4dab-b590-7408eaa16f52" />
Wobblewall is supposed to comform to *Your* specific overlay, this is done by manually editing the HTML & CSS, 
the overlay's images are also placed within wobblewall ontop of any elements wobblewall displays


<hr>
<img width="500" alt="an example of the WW Chat showing a bunch of dummy data accounts along side their profile pictures" src="https://github.com/user-attachments/assets/1670878c-a389-452a-9748-f427a1f4b583" />

Wobblewalls chat is designed to show profile pictures by default making it closer in design to that of Youtube Live's chat, i found it more recognizable when pfp's are present.
the colors chosen for the users are tied to the profile pictures they have, and not the Twitch chat's user specified colors

beside the username pronouns wil be displayed as long as that user has setup Twitch Pronouns.

the differing icons in WW does not follow the design of Twitch entirely. 
- Broadcaster is: ⭐
- Moderater is 🔧
- Subscriber is 🔷
- VIP is: 🔻

## Setting WobbleWall up

To setup Wobblewall please make a config.js file in scripts/ named "config.js"
the contents should be formatted like this:
```var config = {
/* Config file for Wobblewall: https://github.com/Grat10borg/Wobblewall
 * do not share this file with anyone, treat it as a password.. */

    // Chat needs both Channel:manage:broadcast to do stream markers 
    //and clips:edit to clip to your channel with the !clip command
    my_api_token : "<api token here>", 
    twitch_login : "<your twitch username>", // the channel it connects to
    twitch_id: "<your twitch ID>", // used as Broadcaster ID or User ID in API calls
    client_id: "<your twitch client ID>",
    bot_oauth : "<your bots twitch api token>",
    bot_login : "<your bots twitch username>"
}
```

then place in your overlay images in /images and change the paths in the HTML files to point to them.

lastly edit the CSS to move the elements into the correct positions for your overlay, and change the colors to your liking.

make sure WobbleWall is locally running and import the locally running website eg "localhost:3000/gaming.html" into a browser source with audio control enabled.

## List of current commands.
- `!clip` : clips the last 30 seconds of the stream.
- `!mark` : creates a stream marker when its ran
- `!dice <number>` : returns a random number between 0 and {specified number}
- `!lurk` : returns a thanks for lurking message
 
- social media link commands
- `!yt` & `!youtube` : returns {youtube link}
- `!twitch` & `!live` : returns {twitch link}
- `!fedi` : returns {fediverse link}
- `!discord` : returns {discord invite}
- `!rss` : returns {rss link}
- `!bsky` : returns {bsky link}
- `!kofi` : returns {kofi link}

VIPs & Mods only
- `!play <YT-link>` :  plays a video on the media player, scrolls it into view if hidden.
- `!display <YT-link>`: repeat of `!play` leftover from Wobblewall V1
- `!pause` : pauses currently playing video
- `!resume` : resumes currently paused video
- `!mute` : mutes sound in the video
- `!volume {number 0 to 100}` : set volume of video
- `!stop` : stops currently playing video & music

Music player
- `!music` : starts playing music from the playlist
- `!skip` : skips currently playing song
- `!stop` : stops currently playing video & music


Misc debugging (VIPs & Mods only)
- `!dtest` : toggles the displayer/media-player incase its not in view
- `!clear` : clears chat incase it glitches out
- `!click` : sound test command.
