class GUI {

    Init(jon, container){

        if(!guify) {
            console.log("Guify was not found! Add it to your page to enable a GUI for this program.");
            return;
        }

        this.panel = new guify({
            title: "Jon-Trombone", 
            theme: "dark", 
            root: container,
            width: 350,
            barMode: "above",
            align: "right",
            opacity: "0.95"
        });

        this.panel.Register({ 
            type: "checkbox", label: "Mute", 
            object: jon.trombone, property: "muted", 
            onChange: (data) => {
                jon.trombone.SetMute(data);
            } 
        });

        // Jon folder
        this.panel.Register({ type: "folder", label: "Jon" });
        this.panel.Register([
            { type: "checkbox", label: "Move Jaw", object: jon, property: "moveJaw" },
            { type: "range", label: "Jaw Speed", object: jon, property: "jawFlapSpeed", min: 0, max: 100 },
            { type: "range", label: "Jaw Range", object: jon, property: "jawOpenOffset", min: 0, max: 1 },
        ], { folder: "Jon" });

        // Voice folder
        this.panel.Register({ type: "folder", label: "Voice" });
        this.panel.Register([
            { type: "checkbox", label: "Wobble", object: jon.trombone, property: "autoWobble" },
            { type: "checkbox", label: "Pitch Variance", object: jon.trombone.glottis, property: "addPitchVariance" },
            { type: "checkbox", label: "Tenseness Variance", object: jon.trombone.glottis, property: "addTensenessVariance" },
            { type: "range", label: "Tenseness", object: jon.trombone.glottis, property: "UITenseness", min: 0, max: 1 },
            { type: "range", label: "Vibrato", object: jon.trombone.glottis, property: "vibratoAmount", min: 0, max: 0.5 },
            { type: "range", label: "Frequency", object: jon.trombone.glottis, property: "UIFrequency", min: 1, max: 1000, step: 1 },
            { type: "range", label: "Loudness", object: jon.trombone.glottis, property: "loudness", min: 0, max: 1 },
        ], { folder: "Voice" });

        // Tract folder
        this.panel.Register({ type: "folder", label: "Tract" });
        this.panel.Register([
            { type: "range", label: "Move Speed", object: jon.trombone.tract, property: "movementSpeed", min: 1, max: 30, step: 1 },
            { type: "range", label: "Velum Target", object: jon.trombone.tract, property: "velumTarget", min: 0.001, max: 2 },
            { type: "range", label: "Target", object: jon.trombone.tractUI, property: "target", min: 0.001, max: 1 },
            { type: "range", label: "Index", object: jon.trombone.tractUI, property: "index", min: 0, max: 43, step: 1 },
            { type: "range", label: "Radius", object: jon.trombone.tractUI, property: "radius", min: 0, max: 5, step: 1 },
        ], { folder: "Tract" });

        // MIDI folder
        this.panel.Register({ type: "folder", label: "MIDI" });
        this.panel.Register([
            { type: "file", label: "MIDI File", fileReadFunc: "readAsBinaryString",
                onChange: (data) => {
                    jon.midiController.LoadSongDirect(data);
                }
            },
            { type: "title", label: "Controls" },
            { type: "button", label: "Play", action: () => jon.midiController.PlaySong() },
            { type: "button", label: "Stop", action: () => jon.midiController.Stop() },
            { type: "button", label: "Restart", action: () => jon.midiController.Restart() },
            { type: "title", label: "Options" },
            { type: "range", label: "Track", object: jon.midiController, property: "currentTrack", min: 1, max: 20, step: 1 },
            { type: "range", label: "Base Frequency", object: jon.midiController, property: "baseFreq", min: 1, max: 2000, step: 1 },
            { type: "checkbox", label: "Extreme Vibrato", object: jon, property: "flapWhileSinging" },
            { type: "checkbox", label: "Legato", object: jon, property: "legato" },
        ], { folder: "MIDI" });

    }

}

export let gui = new GUI();