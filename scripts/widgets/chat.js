let chat = {
	elem: $$.id("chat"),
	chatbox: "",

	// tells if they chat should be showing & actively update
	show: true, 

	// basic chat functionability
	message: message.bind($), // add message to chat 
	clear: clear.bind($), // clears chat 
};

/* automatic turn off if chat id isn't found. */
if (chat.elem == undefined) {
	// turn off chat
	settings.chat_on = false;

	$$.log(settings);
	$$.err("no chat element found");
} else {
	let div = $$.make("div");
	div.id = "chatbox";
	chat.elem.append(div);

	chat.chatbox = $$.id("chatbox"); 
}

// clears chat
function clear() {
	$$.log("clearing chat...");	
	chat.chatbox.classList.add("chat-clear");

	chat.chatbox.addEventListener("transitionend", () => {
		$$.log("event ran");
		chat.chatbox.innerHTML = "";
		chat.chatbox.classList.remove("chat-clear");
	});
} 

async function message(user, message, command, extra) {
	// handle message text
	let returnMessage = message.replaceAll(/\r\s/gm, ""); 
	let username = user.displayName;
	if (message[0] == "!") { 
		returnMessage = message.replace("!", ":");
    }

	if (settings.chat.shorten_names == true) {
		username = username.split(/[_-\s]/)[0];
    }	

    // TODO: add styling for if message is a command. (append : infront)

    let div = $$.make("div");
    div.classList.add("lower-line");

    div.innerHTML += `
        <div class="span">
            <div class="img"></div>
            <div class="right">
                <div class="upper-line">
                    <p class="user">
                        <div class="username">
                            <p>${username}</p>
                            <div class="mod">${await (await fetch("assets/wrench.svg")).text()}</div>
                            <div class="streamer">${await (await fetch("assets/star.svg")).text()}</div>
                            <div class="vip">${await (await fetch("assets/vip.svg")).text()}</div>
                            <div class="sub">${await (await fetch("assets/sub.svg")).text()}</div>
                        </div>
                    </p>
                    <!-- also mod & broadcaster icons --!>
                    <p class="pronouns">${user.pronouns || ""}</p>
                </div>
                <p class="text"></p>
            </div5
        </div>
    `;

    //hide unfitting flags for the user.
    let f = user.flags;
    if (f.mod == false) { div.querySelector(".mod").style.display = "none";}
    if (f.vip == false) { div.querySelector(".vip").style.display = "none";}
    if (f.broadcaster) { div.querySelector(".sub").style.display = "none"; }
    if (f.subscriber == false) { div.querySelector(".sub").style.display = "none";}
    if (f.broadcaster == false) { div.querySelector(".streamer").style.display = "none";}
    if (users[user.displayName].pronouns == false) { div.querySelector(".pronouns").style.display = "none";}

    // add italic text if needed
    if (extra.messageType == "action") { div.querySelector(".text").setAttribute("style", "font-style: italic")} // /me command

    // input data for personilazation 
    div.querySelector(".img").style.backgroundImage = `url(${user.profile_img})`;
    div.style.setProperty("--user-color", user.palette.Vibrant.hex);
    div.querySelector(".span .text").innerText = returnMessage;

    // add emotes to message
    if(settings.chat.emotes_on) {
        div.querySelector(".span .text").innerHTML = addEmotes(div.querySelector(".span .text"), extra);
    }

    div.style.display = "none";

    // remove old chat messages hidden outside of view
    if(chat.chatbox.children.length > 12) {
        chat.chatbox.children[0].remove();
    }

	chat.chatbox.append(div);		

    // asynchronously wait for images to be loaded.
    await Promise.all([...div.querySelectorAll("img")].map((img) => {
        return new Promise((resolve_img) => {
            img.addEventListener("load", resolve_img);
            img.addEventListener("error", resolve_img);
        })
    }))
    div.style.display = null;

    chat.elem.scrollBy({top: 5000, behavior: "smooth"});
}


