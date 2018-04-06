import "./math-extensions.js";

import { AudioSystem } from "./components/audio-system.js";
import { Glottis } from "./components/glottis.js";
import { Tract } from "./components/tract.js";
import { TractUI } from "./components/tract-ui.js";

class Voice {
    constructor(trombone, id) {
        this.id = id;

        this.glottis = new Glottis(trombone, id);
        this.glottis.init();

        this.tract = new Tract(trombone, this.glottis);
        this.tract.init();

        this.tractUI = new TractUI(trombone, this.tract);
        this.tractUI.init();
    }
}

class PinkTrombone {
    constructor(controller){
        this.controller = controller;
        
        this.time = 0;
        this.alwaysVoice = true;
        this.autoWobble = true;
        this.noiseFreq = 500;
        this.noiseQ = 0.7;

        this.voices = [];
        for(let i = 0; i < 8; i++){
            let voice = new Voice(this, i);
            voice.glottis.loudness = i == 0 ? 1 : 0;
            this.voices.push(voice);
        }

        this.audioSystem = new AudioSystem(this);
        this.audioSystem.init();

        //this.StartAudio();
        //this.SetMute(true);

        this.muted = false;
    }

    StartAudio() {
        this.muted = false;
        this.audioSystem.startSound();
    }

    SetMute(doMute) {
        doMute ? this.audioSystem.mute() : this.audioSystem.unmute();
        this.muted = doMute;
    }

    ToggleMute() {
        this.SetMute(!this.muted);
    }

}

export { PinkTrombone, Voice };