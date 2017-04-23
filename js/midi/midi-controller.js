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
        this.midi = null;
        MidiConvert.load(path, (midi) => {
            console.log("MIDI loaded.");
            this.midi = midi;
            console.log(this.midi);
            if(callback) callback(midi);
        });
    }

    LoadSongDirect(file){
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

        // If no song is specified, load a song
        if(!this.midi){
            console.log("No MIDI is loaded.");
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
        this.clock = new THREE.Clock();
    }

    /**
     * Stops playback.
     */
    Stop() {
        this.clock.stop();
        this.playing = false;
        this.ExitSingMode();
    }

    /**
     * Sets up the trombone for singing.
     */
    EnterSingMode(){
        this.oldAutoWobble = this.controller.trombone.autoWobble;
        this.controller.trombone.autoWobble = false;

        this.oldUseWhiteNoise = this.controller.trombone.AudioSystem.useWhiteNoise;
        this.controller.trombone.AudioSystem.useWhiteNoise = false;

        this.oldVibratoFrequency = this.controller.trombone.Glottis.vibratoFrequency;
        this.controller.trombone.Glottis.vibratoFrequency = 0;

        this.oldFrequency = this.controller.trombone.Glottis.UIFrequency;
    }

    /**
     * Restores the trombone to the state it was in before singing.
     */
    ExitSingMode(){
        this.controller.trombone.autoWobble = this.oldAutoWobble;
        this.controller.trombone.AudioSystem.useWhiteNoise = this.oldUseWhiteNoise;
        this.controller.trombone.Glottis.vibratoFrequency = this.oldVibratoFrequency;
        this.controller.trombone.Glottis.UIFrequency = this.oldFrequency;
    }

}

export { MidiController };