var settings = {
	/* on-screen chat settings */
	chat:  {
		emotes_on: true, 
		shorten_names: true, // - _ /s are cut away  
	},

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
	tbot: {
		clip_cmd_on: true,
		mark_cmd_on: true,
		click_cmd_on: true,
		dice_cmd_on: true,
		lurk_cmd_on: true,
	},

	widget: {
		clock_on: true,
		clock_before: "", // text before date string
		clock_format: "G:i", // JS date formating
		clock_after: " - CEST (USC+2)",  // text after date string
	},
}
