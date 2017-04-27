import "./math-extensions.js";

import { AudioSystem } from "./components/audio-system.js";
import { Glottis } from "./components/glottis.js";
import { Tract } from "./components/tract.js";
import { TractUI } from "./components/tract-ui.js";

class PinkTrombone {
    constructor(controller){
        this.controller = controller;
        
        this.sampleRate = 0;
        this.time = 0;
        this.alwaysVoice = true;
        this.autoWobble = true;
        this.noiseFreq = 500;
        this.noiseQ = 0.7;

        this.AudioSystem = new AudioSystem(this);
        this.AudioSystem.init();
        
        this.Glottis = new Glottis(this);
        this.Glottis.init();

        this.Tract = new Tract(this);
        this.Tract.init();

        this.TractUI = new TractUI(this);
        this.TractUI.init();

        //this.StartAudio();
        //this.SetMute(true);
    }

    StartAudio() {
        this.muted = false;
        this.AudioSystem.startSound();
    }

    SetMute(doMute) {
        doMute ? this.AudioSystem.mute() : this.AudioSystem.unmute();
        this.muted = doMute;
    }

    ToggleMute() {
        this.SetMute(!this.muted);
    }

}

export { PinkTrombone };