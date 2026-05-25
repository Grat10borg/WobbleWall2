var settings = {
	/* on-screen chat settings */
	chat:  {
		emotes_on: true, 
		// some emotes aren't easilly distinguishable from someone just talking normally,
		// also use this to ban any uncomfortable emotes you might have <3
		banned_emotes: ["glorp", "s!", "D:", "c!", "h!", "l!", "p!", "r!", "v!", "w!", "z!"], 
		shorten_names: true, // - _ /s are cut away  
	},

	// alertbox settings planned.

	// misc commands
	tbot: {
		clip_cmd_on: true,
		mark_cmd_on: true,
		click_cmd_on: true, // WW is actually a secret plot to clicker train Twitch streamers
		dice_cmd_on: true,
		lurk_cmd_on: true,
	},

	// Clock settings are manually placed inside the HTML files.
	// this is so you can have unique clocks eg, one only showing the date, and another that shows the time.
}
