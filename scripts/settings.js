var settings = {
/* Config file for Wobblewall: https://github.com/Grat10borg/Wobblewall
 * do not share this file with anyone, treat it as a password.. */

	/* filters messages for bad code, do not turn off*/
	ruin_malicious_code: true,



	/*note: if you're running several wobblewall instances,
	 * turn off uneeded widgets so you don't get double results like
	 * two thanks for lurking messages*/

	/*note2: if you remove the id'ed elements from the HTML file
	 * the correct widgets should* turn off themselves.*/

	/* on-screen chat settings */
	chat_on: true,
	chat:  {
		emotes_on: true, // wobblewal will keep emotes as text
		// wobblewall will shorten names with _ - or spaces
		shorten_names: true, 
		/* should elements be colored after user chosen colors
		 * from twitches API */
		twitch_colors: true,
	},
	
	/* on-screen video-player/image display settings*/
	displayer_on: true,
	disp: {

	},


	alertbox_on: true,
	// $USER replaces with the user name
	alerts: {
		follow_msg: "$USER has been assmilated",
		follow_img: "custom/blop_spin_bg.gif",

		sub_msg: "$USER just subbed, thats very cool :3",
		sub_img: "",
		
		cheer_msg: "$USER just cheered with $AMOUNT",
		cheer_img: "",
		
		host_msg: "$USER just hosted with $AMOUNT viewers",
		host_img: "",
		
		raid_msg: "$USER just raided us!! be welcoming now!",
		raid_msg: "",
	},

	/* bot that does !lurk or !clip commands */
	tbot_on: true,
	tbot: {
		clip_cmd_on: true,
		mark_cmd_on: true,
		
		dice_cmd_on: true,
		lurk_cmd_on: true,
	},

	/* widgets that do misc things, like a music player or a clock*/
	widget: {
		clock_on: true,
		clock_before: "", // text before date string
		clock_format: "G:i", // JS date formating
		clock_after: " - CEST (USC+2)",  // text after date string
	},
	musicbox_on: true,
	musicbox_randomize: true,
}
