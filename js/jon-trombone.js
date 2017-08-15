import { ModelLoader } from "./utils/model-loader.js";
import { PinkTrombone } from "./pink-trombone/pink-trombone.js";
import { MidiController } from "./midi/midi-controller.js";
import { TTSController } from "./tts/tts-controller.js";
import { gui } from "./gui.js";

class JonTrombone {

    constructor(container, finishedCallback) {
        this.container = container;
        this.container.style.position = "relative";
        this.container.style.cursor = "default";

        // Set up renderer and embed in container
        this.renderer = new THREE.WebGLRenderer( { alpha: true } );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // Set up scene and view
        let aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera = new THREE.PerspectiveCamera( 45, aspect, 0.1, 100 );
        this.scene = new THREE.Scene();

        // Export scene for three js inspector
        //window.scene = this.scene;

        // Set up clock for timing
        this.clock = new THREE.Clock();

        let startDelayMS = 1000;
        this.trombone = new PinkTrombone(this);
        setTimeout(()=> {
            this.trombone.StartAudio();
            //this.trombone.SetMute(true);
            this.moveJaw = true;
        }, startDelayMS);

        // Mute button for trombone
        // let button = document.createElement("button");
        // button.innerHTML = "Mute";
        // button.style.cssText = "position: absolute; display: block; top: 0; left: 0;";
        // this.container.appendChild(button);
        // button.addEventListener ("click", () => {
        //     this.trombone.ToggleMute();
        //     button.innerHTML = this.trombone.muted ? "Unmute" : "Mute";
        // });

        this.jawFlapSpeed = 20.0;
        this.jawOpenOffset = 0.19;
        this.moveJaw = false;
        this.legato = false;
        this.flapWhileSinging = false;

        this.midiController = new MidiController(this);

        // let tts = new TTSController();
        // console.log(tts.GetGraphemes("Testing one two three 1 2 3"));

        this.SetUpThree();
        this.SetUpScene();

        // Start the update loop
        this.OnUpdate();

        gui.Init(this, this.container);
    }

    /**
     * Set up non-scene config for Three.js
     */
    SetUpThree() {
        if(THREE.OrbitControls !== undefined){
            // Add orbit controls
            this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            this.controls.target.set( 0, 0, 0 );
            this.controls.update();
        } else {
            console.warn("No THREE.OrbitControls detected. Include to allow interaction with the model.");
        }
    }

    /**
     * Populates and configures objects within the scene.
     */
    SetUpScene() {

        // Set camera position
        this.camera.position.set( 0, 0, 0.5 );

        // Lights
        let light1 = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
        light1.name = "Hemisphere Light";
        light1.position.set(0, 1, 0);
        this.scene.add(light1);

        let light2 = new THREE.DirectionalLight(0xffffff, 1.0);
        light2.name = "Directional Light";
        light2.position.set(0, 1, 0);
        this.scene.add(light2);

        // Load the Jon model and place it in the scene
        ModelLoader.LoadJSON("../resources/jon/three/jon.json", (object) => {
            this.jon = object;
            this.scene.add( this.jon );
            this.jon.rotation.y = (THREE.Math.degToRad(15));

            this.jaw = this.jon.skeleton.bones.find((obj) => {
                return obj.name == "Bone.006";
            });
            if(this.jaw){
                this.jawShutZ = this.jaw.position.z;
            }
        });


    }

    /**
     * Called every frame. Continues indefinitely after being called once.
     */
    OnUpdate() {
        let deltaTime = this.clock.getDelta();
        requestAnimationFrame( this.OnUpdate.bind(this) );

        if(this.midiController.playing){

            this.notes = this.midiController.GetPitches();
            if(this.notes != this.lastNotes){
                // Do the note
                if(this.notes !== undefined && this.notes.length != 0){ 
                    // Note on
                    // Play frequency
                    let note = this.notes[0];
                    if(this.notes.length > 1){
                        //console.log ("chord");
                    }
                    let freq = this.midiController.MIDIToFrequency(note.midi);
                    //console.log(freq);
                    this.trombone.Glottis.UIFrequency = freq;
                    this.trombone.Glottis.loudness = note.velocity;
                    // Open jaw
                    this.jaw.position.z = this.jawShutZ + this.jawOpenOffset;
                    this.trombone.TractUI.SetLipsClosed(0);

                } else { 
                    // Note off
                    if (!this.legato) this.trombone.Glottis.loudness = 0;
                    // Close jaw
                    this.jaw.position.z = this.jawShutZ;
                    this.trombone.TractUI.SetLipsClosed(1);

                }

                this.lastNotes = this.notes;
            }

        }

        if(this.jaw && this.moveJaw && (!this.midiController.playing || this.flapWhileSinging)){
            let time = this.clock.getElapsedTime();// % 60;

            // Move the jaw
            let percent = (Math.sin(time * this.jawFlapSpeed) + 1.0) / 2.0;
            this.jaw.position.z = this.jawShutZ + (percent * this.jawOpenOffset);

            // Make the audio match the jaw position
            this.trombone.TractUI.SetLipsClosed(1.0 - percent);

        }

        // Render
        this.renderer.render(this.scene, this.camera);

    }

}

export { JonTrombone };