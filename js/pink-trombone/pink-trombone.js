import "./math-extensions.js";

import { AudioSystem } from "./components/audio-system.js";
import { Glottis } from "./components/glottis.js";
import { Tract } from "./components/tract.js";
import { TractUI } from "./components/tract-ui.js";

class PinkTrombone {
    constructor(controller){
        this.controller = controller;
        
        this.time = 0;
        this.alwaysVoice = true;
        this.autoWobble = true;
        this.noiseFreq = 500;
        this.noiseQ = 0.7;
        
        this.glottis = new Glottis(this);
        this.glottis.init();

        this.tract = new Tract(this);
        this.tract.init();

        this.tractUI = new TractUI(this);
        this.tractUI.init();

        this.audioSystem = new AudioSystem(this.glottis, this.tract);
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

export { PinkTrombone };