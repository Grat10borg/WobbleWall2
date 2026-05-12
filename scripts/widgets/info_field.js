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
		try {
			for (let [key, value] of Object.entries(api_res.data[0])) {
				text = text.replaceAll("$"+key, value)	
			}
			info_elem.children[0].innerText = text;
		} catch (error) {
			info_elem.children[0].innerText = "failed fetching info. trying again...";
		}
	});
}
