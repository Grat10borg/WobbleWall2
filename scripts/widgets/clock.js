// Clock code
// get the innertext of the clock seperated by commas.
// then put pretext make a date format it, then aftertext
let clock_options = $$.query(".clock").innerText.split(",");
setInterval(() => {
	$$.query(".clock").innerText = clock_options[0] + 
	$$.date(new Date(), clock_options[1]) + clock_options[2];
}, 1000);
