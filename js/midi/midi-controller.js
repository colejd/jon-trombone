let MidiConvert = require('midiconvert');

/**
 * Simple class for MIDI playback.
 * The paradigm here's a bit weird; it's up to an external
 * source to actually produce audio. This class just manages
 * a timer, which GetPitch() reads to produce the "current"
 * note information. 
 * 
 * As an example of usage, jon-trombone calls PlaySong() to
 * begin, and then every frame uses GetPitch() to figure out
 * what the current frequency to produce is.
 */
class MidiController {

    constructor(controller) {
        this.controller = controller;

        this.midi = null;

        this.playing = false;
        this.currentTrack = 5;

        this.baseFreq = 110; //110 is A2

        this.clock = new THREE.Clock(false);
    }

    /**
     * Loads and parses a MIDI file.
     */
    LoadSong(path, callback){
        this.Stop();
        this.midi = null;
        MidiConvert.load(path, (midi) => {
            console.log("MIDI loaded.");
            this.midi = midi;
            console.log(this.midi);
            if(callback) callback(midi);
        });
    }

    LoadSongDirect(file){
        this.Stop();
        this.midi = MidiConvert.parse(file);
        console.log("MIDI loaded.");
        console.log(this.midi);
    }

    /**
     * Gets the pitch for the specified track at the current time in the song.
     */
    GetPitch(trackIndex = this.currentTrack){
        let time = this.GetSongProgress();

        // Constrain track specified to valid range
        trackIndex = Math.min(trackIndex, this.midi.tracks.length - 1);
        trackIndex = Math.max(trackIndex, 0);

        return this.midi.tracks[trackIndex].notes.find((item) => {
            return item.noteOn <= time && time <= item.noteOff;
        });
    }

    PlaySong(track = 5){
        if(this.playing){
            return;
        }

        // If no song is specified, load a song
        if(!this.midi){
            console.log("No MIDI is loaded. Loading an example...");
            this.LoadSong('../resources/midi/un-owen-was-her.mid', () => {
                this.PlaySong();
            });
            return;
        }

        // Turn off some stuff so the singing kind of sounds okay
        this.EnterSingMode();

        this.currentTrack = track;
        this.clock.start();
        this.playing = true;

        console.log("Playback started.");

    }

    GetSongProgress(){
        return this.clock.getElapsedTime();
    }

    /**
     * Converts from a MIDI note code to its corresponding frequency.
     * @param {*} midiCode 
     */
    MIDIToFrequency(midiCode){
        return this.baseFreq * Math.pow(2, (midiCode - 57) / 12);
    }

    /**
     * Restarts the playback.
     */
    Restart(){
        console.log("Playback moved to beginning.");
        this.clock = new THREE.Clock();
    }

    /**
     * Stops playback.
     */
    Stop() {
        if(!this.playing){
            return;
        }
        console.log("Playback stopped.");
        this.clock.stop();
        this.playing = false;
        this.ExitSingMode();
    }

    /**
     * Sets up the trombone for singing.
     */
    EnterSingMode(){
        if(this.backup_settings){
            return;
        }

        this.backup_settings = {};

        this.backup_settings["autoWobble"] = this.controller.trombone.autoWobble;
        this.controller.trombone.autoWobble = false;

        this.backup_settings["addPitchVariance"] = this.controller.trombone.Glottis.addPitchVariance;
        this.controller.trombone.Glottis.addPitchVariance = false;

        this.backup_settings["addTensenessVariance"] = this.controller.trombone.Glottis.addTensenessVariance;
        this.controller.trombone.Glottis.addTensenessVariance = false;

        this.backup_settings["vibratoFrequency"] = this.controller.trombone.Glottis.vibratoFrequency;
        this.controller.trombone.Glottis.vibratoFrequency = 0;

        this.backup_settings["frequency"] = this.controller.trombone.Glottis.UIFrequency;

        this.backup_settings["loudness"] = this.controller.trombone.Glottis.loudness;
    }

    /**
     * Restores the trombone to the state it was in before singing.
     */
    ExitSingMode(){
        if(!this.backup_settings) {
            return;
        }
        
        this.controller.trombone.autoWobble = this.backup_settings["autoWobble"];
        this.controller.trombone.Glottis.addPitchVariance = this.backup_settings["addPitchVariance"];
        this.controller.trombone.Glottis.addTensenessVariance = this.backup_settings["addTensenessVariance"];
        this.controller.trombone.Glottis.vibratoFrequency = this.backup_settings["vibratoFrequency"];
        this.controller.trombone.Glottis.UIFrequency = this.backup_settings["frequency"];
        this.controller.trombone.Glottis.loudness = this.backup_settings["loudness"];

        this.backup_settings = null;
    }

}

export { MidiController };