// Shorthand Dom versions
const $ = document;
const $$ = {
    dom: document,

    // document methods
    id: $.getElementById.bind($),
    class: $.getElementsByClassName.bind($),
    make: $.createElement.bind($),
    query: $.querySelector.bind($),
    query_all: $.querySelectorAll.bind($),

    // custom methods below this
    api: api.bind($), 
    api_approve: api_approve.bind($), // validate twitch token
    txt: txt.bind($),
    date: date_format.bind($),

    log: console.log,
    err: Olog.bind($),
}

// dom functions

// Http request function specify Twitch if using twitch tokens
async function api(http, isTwitch) {
  if (isTwitch == true) {
    const respon = await fetch(http, {
      headers: {
        Authorization: "Bearer " + config.my_api_token,
        "Client-ID": config.client_id, 
      },
    })
      .then((respon) => respon.json())
      .then((respon) => {
        // Return Response on Success
        return respon;
      })
      .catch((err) => {
        // Print Error if any. And return 0
        $$.log(err);
      });
    return respon;
  } else {
    const respon = await fetch(`${http}`)
      .then((respon) => respon.json())
      .then((respon) => {
        // Return Response on Success
        return respon;
      })
      .catch((err) => {
        // Print Error if any. And return 0
        $$.log(err);
      });
    return respon;
  }
}

async function api_approve() {
    await fetch("https://id.twitch.tv/oauth2/validate", {
      headers: {
        Authorization: "Bearer " + config.MY_API_TOKEN,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.status) {
          if (resp.status == 401) {
            $$.err("This api token is invalid ... " + resp.message);
            return 0;
          }
          $$.err("Unexpected output with a status");
          return 0;
        }
        if (resp) {
	  $$.log(resp);
      cached.api_clientid = resp.client_id; // client ID
	  cached.api_valid = true; // twitch connected.
	  cached.broadcaster_login = resp.login; // username
	  cached.broadcaster_id = resp.user_id; // user ID

          $$.log("Token Validated Sucessfully ... logged into "
          + resp.login);
	 
          return 1;
        }
        return 0;
      })
      .catch((err) => {
        return 0;
      });
 return 1;
}

//#endregion

/* Fetch() is the bane of my existance,
 * this /works/ but its not prettyy, if i move this to a nodejs project
 * then make a fs thing instead*/
async function txt(path) {
  await fetch(path)
  .then(response => response.text())
  .then((txt) => {    
    //return txt;
    let textarea = $$.make("textarea");
    textarea.textContent = txt;
    textarea.id = path;
    textarea.hidden = true;
    $.body.append(textarea);
  })
  let text = $$.id(path).innerHTML;
  $$.id(path).outerHTML = ""; // remove textarea again
  return text;
}

/* sorta of the PHP date_format function */
// https://www.w3schools.com/PHP/func_date_date_format.asp
function date_format(date, dateString) {

	// turn "d" into the date with leading zero 01-31
	let res = date.getDate();
	if(res < 10)
		res = "0"+res;
	dateString = dateString.replaceAll("d", res);	
	
	// turn "j" into the date 1-31
	dateString = dateString.replaceAll("j", date.getDate());	

	// turn "n" into current month (1-12)
	dateString = dateString.replaceAll("n", (date.getMonth()+1));

	// turn "m" into numeric month with leading zero
	res = date.getMonth();
	if(res < 10)
		res = "0"+res;
	dateString = dateString.replaceAll("n", res);

	// turn "Y" into a four digit year (2003)
	dateString = dateString.replaceAll("Y", date.getFullYear());

	// turn "y" into a two digit year (03)
	res = date.getFullYear()[2]+date.getFullYear()[3];
	dateString = dateString.replaceAll("y", res);

	// turn "w" into numeric repressation of the weekday (0-6)
	dateString = dateString.replaceAll("w", date.getDay());

	// turn "G" into a 24 hour clock 
	res = date.getHours();
	if(res < 10)
		res = "0"+res;
	dateString = dateString.replaceAll("G", res);

	// turn "i" into minutes
	res = date.getMinutes();
	if(res < 10)
		res = "0"+res;
	dateString = dateString.replaceAll("i", res);

	// turn "s" into seconds
	res = date.getSeconds();
	if(res < 10)
		res = "0"+res;
	dateString = dateString.replaceAll("s", res);

	// turn "u" into miliseconds 
	res = date.getMilliseconds();
	if(res < 10)
		res = "0"+res;
	dateString = dateString.replaceAll("u", res);

	// turn "U" into milliseconds since Epoch
	dateString = dateString.replaceAll("U", date.getTime());

	return dateString;
}

function Olog(message) {
	ComfyJS.Say(message);
	console.error(message);
}
