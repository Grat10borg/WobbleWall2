let beat_elems = $$.query_all(".on-beat")
let playlist;
(async () => {
    playlist = await (await fetch("music/music.json")).json();
    playlist.sort(() => Math.random() - 0.5);
})();


let music;
async function audio_play(path) {


    const sound = new BeatBeat(
      new AudioContext(),
      path
    )

    // we tried to control audio. we failed :(
    //let gainNode = sound.context.createGain();
    //gainNode.connect(sound.context.destination);
    //gainNode.gain.value = 0.1; 

    await sound.load()
    let index = 0;
    let beats = []; 
    
    beat_elems.forEach(element => {
        let meta = element.getAttribute("meta").split("/");
        let pre_amount = element.getAttribute("style").match(/\((.*?)\)/)[1].replace("deg", "");
        
        let beat = {
            "element": element,
            "meta": meta,
            "bpm":  Number(meta[0]),
            "transform":  meta[1],
            "change_amount": Number(meta[2]),
            "org_amount": Number(pre_amount),
            "amount": Number(pre_amount),
            "type": meta[3]
        }
        beats.push(beat);
    });

    $$.log(sound);
    sound.play((isInitial) => { 
        //gainNode.connect(sound.context.destination);
        //gainNode.gain.setValueAtTime(-1, sound.context.currentTime); 
        //sound.source.connect(gainNode)
        if(isInitial) {
            return;
        }
        // This callback will execute at every beat of the song
        beats.forEach(beat => {
            
             
            // if beat is perfectly devisible with specified number
            // 1 = on beat
            // 2 = offbeat
            // 3 = ever third beat
            //$$.log(`[beat ${index}] is % with ${beat.bpm}`);
            if (! (index % beat.bpm) && sound.context.state == "running") {
                
                //$$.log(beat);
                beat.amount = beat.amount + beat.change_amount;
                let reset = false;
                if(beat.amount >= 360) {
                    reset = true; 
                    beat.amount = beat.amount - 360;
                    beat.element.style.transitionDuration = "0s";

                }
                beat.element.style.transform = `${beat.transform}(${beat.amount}${beat.type})`;
                
                if(reset) {
                    beat.element.style.transitionDuration = null;
                }

            }
            index++;
        });  
    })

    sound.context.addEventListener("statechange", () => {
        beats.forEach(beat => { 
            beat.element.classList.add("music-gear-end");
            beat.element.style.setProperty("--rotation", beat.amount);
            beat.element.style.transform = `${beat.transform}(${beat.org_amount+360}${beat.type})`;
            beat.element.addEventListener("transitionend", (() => {
                beat.element.classList.remove("music-gear-end");
            }))
            beat.amount = beat.org_amount+360;
        })
    }) 
    
    music = sound.context;
    return sound;
}

//play("HitTheDiamond-StevenUniverse.mp3");

let stopfrfr = false;
async function play_music() {
    stopfrfr = false;
    for (let i = 0; i < playlist.length; i++) {
        console.log(i);
        if(stopfrfr) {
            return
        }
        let path = playlist[i];
        let sound = await audio_play(path);

        let check_interval;
        await new Promise((resolve) => {
            check_interval = setInterval(() => {
                if (sound.context.state != "running"
                    || (sound.buffer.duration
                        && sound.context.currentTime
                        && sound.context.currentTime >= sound.buffer.duration)) {
                    resolve();
                    clearInterval(check_interval);
                }
            }, 250)
        })
    };
    if(!stopfrfr) {
        play_music();
    }
}

function music_skip() {
    if(music) {
        music.close();
        $$.log(music.state);
        music = false;
    }
}

function audio_stop() {
    stopfrfr = true;
    music_skip();
}
