"use strict";

const musicFolder = "music"
const fs = require('fs');

let music = [];

// read all files inside the music folder 
fs.readdirSync(musicFolder).forEach(file => {
	if(file != "music.json") {
		music.push(musicFolder+"/"+file);
	}
});


// add music array to JS object

// make the JS object into a json object
console.log(music);

// export music json file to the custom folder
fs.writeFile("music/music.json", JSON.stringify(music),
	function(err){if(err){console.error(err)}});
