(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GUI = function () {
    function GUI() {
        _classCallCheck(this, GUI);
    }

    _createClass(GUI, [{
        key: "Init",
        value: function Init(jon, container) {

            if (!guify) {
                console.log("Guify was not found! Add it to your page to enable a GUI for this program.");
                return;
            }

            this.panel = new guify.GUI({
                title: "Jon-Trombone",
                theme: "dark",
                root: container,
                width: "80%",
                barMode: "above",
                align: "right",
                opacity: "0.95"
            });

            this.panel.Register({
                type: "checkbox", label: "Mute",
                object: jon.trombone, property: "muted",
                onChange: function onChange(data) {
                    jon.trombone.SetMute(data);
                }
            });

            // Jon folder
            this.panel.Register({ type: "folder", label: "Jon" });
            this.panel.Register([{ type: "checkbox", label: "Move Jaw", object: jon, property: "moveJaw" }, { type: "range", label: "Jaw Speed", object: jon, property: "jawFlapSpeed", min: 0, max: 100 }, { type: "range", label: "Jaw Range", object: jon, property: "jawOpenOffset", min: 0, max: 1 }], { folder: "Jon" });

            // Voice folder
            this.panel.Register({ type: "folder", label: "Voice" });
            this.panel.Register([{ type: "checkbox", label: "Wobble", object: jon.trombone, property: "autoWobble" }, { type: "checkbox", label: "Pitch Variance", object: jon.trombone.Glottis, property: "addPitchVariance" }, { type: "checkbox", label: "Tenseness Variance", object: jon.trombone.Glottis, property: "addTensenessVariance" }, { type: "range", label: "Tenseness", object: jon.trombone.Glottis, property: "UITenseness", min: 0, max: 1 }, { type: "range", label: "Vibrato", object: jon.trombone.Glottis, property: "vibratoAmount", min: 0, max: 0.5 }, { type: "range", label: "Frequency", object: jon.trombone.Glottis, property: "UIFrequency", min: 1, max: 1000, step: 1 }, { type: "range", label: "Loudness", object: jon.trombone.Glottis, property: "loudness", min: 0, max: 1 }], { folder: "Voice" });

            // Tract folder
            this.panel.Register({ type: "folder", label: "Tract" });
            this.panel.Register([{ type: "range", label: "Move Speed", object: jon.trombone.Tract, property: "movementSpeed", min: 1, max: 30, step: 1 }, { type: "range", label: "Velum Target", object: jon.trombone.Tract, property: "velumTarget", min: 0.001, max: 2 }, { type: "range", label: "Target", object: jon.trombone.TractUI, property: "target", min: 0.001, max: 1 }, { type: "range", label: "Index", object: jon.trombone.TractUI, property: "index", min: 0, max: 43, step: 1 }, { type: "range", label: "Radius", object: jon.trombone.TractUI, property: "radius", min: 0, max: 5, step: 1 }], { folder: "Tract" });

            // MIDI folder
            this.panel.Register({ type: "folder", label: "MIDI" });
            this.panel.Register([{ type: "file", label: "MIDI File", fileReadFunc: "readAsBinaryString",
                onChange: function onChange(data) {
                    jon.midiController.LoadSongDirect(data);
                }
            }, { type: "title", label: "Controls" }, { type: "button", label: "Play", action: function action() {
                    return jon.midiController.PlaySong();
                } }, { type: "button", label: "Stop", action: function action() {
                    return jon.midiController.Stop();
                } }, { type: "button", label: "Restart", action: function action() {
                    return jon.midiController.Restart();
                } }, { type: "title", label: "Options" }, { type: "range", label: "Track", object: jon.midiController, property: "currentTrack", min: 1, max: 20, step: 1 }, { type: "range", label: "Base Frequency", object: jon.midiController, property: "baseFreq", min: 1, max: 2000, step: 1 }, { type: "checkbox", label: "Extreme Vibrato", object: jon, property: "flapWhileSinging" }, { type: "checkbox", label: "Legato", object: jon, property: "legato" }], { folder: "MIDI" });
        }
    }]);

    return GUI;
}();

var gui = exports.gui = new GUI();

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JonTrombone = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelLoader = require("./utils/model-loader.js");

var _pinkTrombone = require("./pink-trombone/pink-trombone.js");

var _midiController = require("./midi/midi-controller.js");

var _ttsController = require("./tts/tts-controller.js");

var _gui = require("./gui.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JonTrombone = function () {
    function JonTrombone(container, finishedCallback) {
        var _this = this;

        _classCallCheck(this, JonTrombone);

        this.container = container;
        this.container.style.position = "relative";
        this.container.style.cursor = "default";

        // Set up renderer and embed in container
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // Set up scene and view
        var aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        this.scene = new THREE.Scene();

        // Export scene for three js inspector
        //window.scene = this.scene;

        // Set up clock for timing
        this.clock = new THREE.Clock();

        var startDelayMS = 1000;
        this.trombone = new _pinkTrombone.PinkTrombone(this);
        setTimeout(function () {
            _this.trombone.StartAudio();
            //this.trombone.SetMute(true);
            _this.moveJaw = true;
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

        this.midiController = new _midiController.MidiController(this);

        // let tts = new TTSController();
        // console.log(tts.GetGraphemes("Testing one two three 1 2 3"));

        this.SetUpThree();
        this.SetUpScene();

        // Start the update loop
        this.OnUpdate();

        _gui.gui.Init(this, this.container);
    }

    /**
     * Set up non-scene config for Three.js
     */


    _createClass(JonTrombone, [{
        key: "SetUpThree",
        value: function SetUpThree() {
            if (THREE.OrbitControls !== undefined) {
                // Add orbit controls
                this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.controls.target.set(0, 0, 0);
                this.controls.update();
            } else {
                console.warn("No THREE.OrbitControls detected. Include to allow interaction with the model.");
            }
        }

        /**
         * Populates and configures objects within the scene.
         */

    }, {
        key: "SetUpScene",
        value: function SetUpScene() {
            var _this2 = this;

            // Set camera position
            this.camera.position.set(0, 0, 0.5);

            // Lights
            var light1 = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
            light1.name = "Hemisphere Light";
            light1.position.set(0, 1, 0);
            this.scene.add(light1);

            var light2 = new THREE.DirectionalLight(0xffffff, 1.0);
            light2.name = "Directional Light";
            light2.position.set(0, 1, 1);
            light2.target.position.set(0, 0, 0);
            this.scene.add(light2);

            // Load the Jon model and place it in the scene
            _modelLoader.ModelLoader.LoadJSON("../resources/jon/three/jon.json", function (object) {
                _this2.jon = object;
                _this2.scene.add(_this2.jon);
                _this2.jon.rotation.y = THREE.Math.degToRad(15);

                _this2.jaw = _this2.jon.skeleton.bones.find(function (obj) {
                    return obj.name == "Bone.006";
                });
                if (_this2.jaw) {
                    _this2.jawShutZ = _this2.jaw.position.z;
                }
            });
        }

        /**
         * Called every frame. Continues indefinitely after being called once.
         */

    }, {
        key: "OnUpdate",
        value: function OnUpdate() {
            var deltaTime = this.clock.getDelta();
            requestAnimationFrame(this.OnUpdate.bind(this));

            if (this.midiController.playing) {

                this.notes = this.midiController.GetPitches();
                if (this.notes != this.lastNotes) {
                    // Do the note
                    if (this.notes !== undefined && this.notes.length != 0) {
                        // Note on
                        // Play frequency
                        var note = this.notes[0];
                        if (this.notes.length > 1) {
                            //console.log ("chord");
                        }
                        var freq = this.midiController.MIDIToFrequency(note.midi);
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

            if (this.jaw && this.moveJaw && (!this.midiController.playing || this.flapWhileSinging)) {
                var time = this.clock.getElapsedTime(); // % 60;

                // Move the jaw
                var percent = (Math.sin(time * this.jawFlapSpeed) + 1.0) / 2.0;
                this.jaw.position.z = this.jawShutZ + percent * this.jawOpenOffset;

                // Make the audio match the jaw position
                this.trombone.TractUI.SetLipsClosed(1.0 - percent);
            }

            // Render
            this.renderer.render(this.scene, this.camera);
        }
    }]);

    return JonTrombone;
}();

exports.JonTrombone = JonTrombone;

},{"./gui.js":1,"./midi/midi-controller.js":4,"./pink-trombone/pink-trombone.js":11,"./tts/tts-controller.js":12,"./utils/model-loader.js":13}],3:[function(require,module,exports){
"use strict";

var _webglDetect = require("./utils/webgl-detect.js");

var _jonTrombone = require("./jon-trombone.js");

// Optionally bundle three.js as part of the project
//import THREELib from "three-js";
//var THREE = THREELib(); // return THREE JS

var Init = function Init() {
    var container = document.getElementById("jon-trombone-container");

    if (!_webglDetect.Detector.HasWebGL()) {
        //exit("WebGL is not supported on this browser.");
        console.log("WebGL is not supported on this browser.");
        container.innerHTML = _webglDetect.Detector.GetErrorHTML();
        container.classList.add("no-webgl");
    } else {
        var jonTrombone = new _jonTrombone.JonTrombone(container);
    }
};

if (document.readyState === 'complete') {
    Init();
} else {
    window.onload = function () {
        Init();
    };
}

},{"./jon-trombone.js":2,"./utils/webgl-detect.js":14}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MidiConvert = require('midiconvert');

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

var MidiController = function () {
    function MidiController(controller) {
        _classCallCheck(this, MidiController);

        this.controller = controller;

        this.midi = null;

        this.playing = false;
        this.currentTrack = 5;

        this.baseFreq = 440; //110 is A4

        this.clock = new THREE.Clock(false);
    }

    /**
     * Loads and parses a MIDI file.
     */


    _createClass(MidiController, [{
        key: "LoadSong",
        value: function LoadSong(path, callback) {
            var _this = this;

            this.Stop();
            this.midi = null;
            MidiConvert.load(path, function (midi) {
                console.log("MIDI loaded.");
                _this.midi = midi;
                console.log(_this.midi);
                if (callback) callback(midi);
            });
        }
    }, {
        key: "LoadSongDirect",
        value: function LoadSongDirect(file) {
            this.Stop();
            this.midi = MidiConvert.parse(file);
            console.log("MIDI loaded.");
            console.log(this.midi);
        }

        /**
         * Gets the pitch for the specified track at the current time in the song.
         */

    }, {
        key: "GetPitch",
        value: function GetPitch() {
            var trackIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.currentTrack;

            var time = this.GetSongProgress();

            // Constrain track specified to valid range
            trackIndex = Math.min(trackIndex, this.midi.tracks.length - 1);
            trackIndex = Math.max(trackIndex, 0);

            return this.midi.tracks[trackIndex].notes.find(function (item) {
                return item.noteOn <= time && time <= item.noteOff;
            });
        }
    }, {
        key: "GetPitches",
        value: function GetPitches() {
            var trackIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.currentTrack;

            var time = this.GetSongProgress();

            // Constrain track specified to valid range
            trackIndex = Math.min(trackIndex, this.midi.tracks.length - 1);
            trackIndex = Math.max(trackIndex, 0);

            return this.midi.tracks[trackIndex].notes.filter(function (item) {
                return item.noteOn <= time && time <= item.noteOff;
            });
        }
    }, {
        key: "PlaySong",
        value: function PlaySong() {
            var _this2 = this;

            var track = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

            if (this.playing) {
                return;
            }

            // If no song is specified, load a song
            if (!this.midi) {
                console.log("No MIDI is loaded. Loading an example...");
                this.LoadSong('../resources/midi/un-owen-was-her.mid', function () {
                    _this2.PlaySong();
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
    }, {
        key: "GetSongProgress",
        value: function GetSongProgress() {
            return this.clock.getElapsedTime();
        }

        /**
         * Converts from a MIDI note code to its corresponding frequency.
         * @param {*} midiCode 
         */

    }, {
        key: "MIDIToFrequency",
        value: function MIDIToFrequency(midiCode) {
            return this.baseFreq * Math.pow(2, (midiCode - 69) / 12);
        }

        /**
         * Restarts the playback.
         */

    }, {
        key: "Restart",
        value: function Restart() {
            console.log("Playback moved to beginning.");
            this.clock = new THREE.Clock();
        }

        /**
         * Stops playback.
         */

    }, {
        key: "Stop",
        value: function Stop() {
            if (!this.playing) {
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

    }, {
        key: "EnterSingMode",
        value: function EnterSingMode() {
            if (this.backup_settings) {
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

    }, {
        key: "ExitSingMode",
        value: function ExitSingMode() {
            if (!this.backup_settings) {
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
    }]);

    return MidiController;
}();

exports.MidiController = MidiController;

},{"midiconvert":15}],5:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioSystem = function () {
    function AudioSystem(trombone) {
        _classCallCheck(this, AudioSystem);

        this.trombone = trombone;

        this.blockLength = 512;
        this.blockTime = 1;
        this.soundOn = false;
    }

    _createClass(AudioSystem, [{
        key: "init",
        value: function init() {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new window.AudioContext();
            this.trombone.sampleRate = this.audioContext.sampleRate;

            this.blockTime = this.blockLength / this.trombone.sampleRate;
        }
    }, {
        key: "startSound",
        value: function startSound() {
            //scriptProcessor may need a dummy input channel on iOS
            this.scriptProcessor = this.audioContext.createScriptProcessor(this.blockLength, 2, 1);
            this.scriptProcessor.connect(this.audioContext.destination);
            this.scriptProcessor.onaudioprocess = this.doScriptProcessor.bind(this);

            var whiteNoise = this.createWhiteNoiseNode(2 * this.trombone.sampleRate); // 2 seconds of noise

            var aspirateFilter = this.audioContext.createBiquadFilter();
            aspirateFilter.type = "bandpass";
            aspirateFilter.frequency.value = 500;
            aspirateFilter.Q.value = 0.5;
            whiteNoise.connect(aspirateFilter); // Use white noise as input for filter
            aspirateFilter.connect(this.scriptProcessor); // Use this as input 0 for script processor

            var fricativeFilter = this.audioContext.createBiquadFilter();
            fricativeFilter.type = "bandpass";
            fricativeFilter.frequency.value = 1000;
            fricativeFilter.Q.value = 0.5;
            whiteNoise.connect(fricativeFilter); // Use white noise as input
            fricativeFilter.connect(this.scriptProcessor); // Use this as input 1 for script processor

            whiteNoise.start(0);

            // Generate just white noise (test)
            // var wn = this.createWhiteNoiseNode(2*this.trombone.sampleRate);
            // wn.connect(this.audioContext.destination);
            // wn.start(0);
        }
    }, {
        key: "createWhiteNoiseNode",
        value: function createWhiteNoiseNode(frameCount) {
            var myArrayBuffer = this.audioContext.createBuffer(1, frameCount, this.trombone.sampleRate);

            var nowBuffering = myArrayBuffer.getChannelData(0);
            for (var i = 0; i < frameCount; i++) {
                nowBuffering[i] = Math.random(); // gaussian();
            }

            var source = this.audioContext.createBufferSource();
            source.buffer = myArrayBuffer;
            source.loop = true;

            return source;
        }

        // createNode() {
        //     let buffer = this.audioContext.createBuffer(1, frameCount, this.trombone.sampleRate);


        //     var source = this.audioContext.createBufferSource();
        //     source.buffer = buffer;
        //     source.loop = true;

        //     return source;
        // }


    }, {
        key: "doScriptProcessor",
        value: function doScriptProcessor(event) {
            var inputArray1 = event.inputBuffer.getChannelData(0); // Glottis input
            var inputArray2 = event.inputBuffer.getChannelData(1); // Tract input
            var outArray = event.outputBuffer.getChannelData(0); // Output (mono)
            for (var j = 0, N = outArray.length; j < N; j++) {
                var lambda1 = j / N;
                var lambda2 = (j + 0.5) / N;
                var glottalOutput = this.trombone.Glottis.runStep(lambda1, inputArray1[j]);

                var vocalOutput = 0;
                //Tract runs at twice the sample rate 
                this.trombone.Tract.runStep(glottalOutput, inputArray2[j], lambda1);
                vocalOutput += this.trombone.Tract.lipOutput + this.trombone.Tract.noseOutput;
                this.trombone.Tract.runStep(glottalOutput, inputArray2[j], lambda2);
                vocalOutput += this.trombone.Tract.lipOutput + this.trombone.Tract.noseOutput;
                outArray[j] = vocalOutput * 0.125;
            }
            // if(this.trombone.controller.notes !== undefined){
            //     for (var noteIndex = 1; noteIndex < this.trombone.controller.notes.length; noteIndex++){
            //         if(noteIndex > this.numVoices - 1) return;
            //         let note = this.trombone.controller.notes[noteIndex];
            //         //console.log(note);

            //     }
            // }
            this.trombone.Glottis.finishBlock();
            this.trombone.Tract.finishBlock();
        }
    }, {
        key: "mute",
        value: function mute() {
            this.scriptProcessor.disconnect();
        }
    }, {
        key: "unmute",
        value: function unmute() {
            this.scriptProcessor.connect(this.audioContext.destination);
        }
    }]);

    return AudioSystem;
}();

exports.AudioSystem = AudioSystem;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Glottis = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _noise = require("../noise.js");

var _noise2 = _interopRequireDefault(_noise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Glottis = function () {
    function Glottis(trombone) {
        _classCallCheck(this, Glottis);

        this.trombone = trombone;

        this.timeInWaveform = 0;
        this.oldFrequency = 140;
        this.newFrequency = 140;
        this.UIFrequency = 140;
        this.smoothFrequency = 140;
        this.oldTenseness = 0.6;
        this.newTenseness = 0.6;
        this.UITenseness = 0.6;
        this.totalTime = 0;
        this.vibratoAmount = 0.005;
        this.vibratoFrequency = 6;
        this.intensity = 0;
        this.loudness = 1;
        this.isTouched = false;
        this.touch = 0;
        this.x = 240;
        this.y = 530;

        this.keyboardTop = 500;
        this.keyboardLeft = 0;
        this.keyboardWidth = 600;
        this.keyboardHeight = 100;
        this.semitones = 20;
        this.marks = [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0];
        this.baseNote = 87.3071; //F

        this.output;

        /// Allow pitch to wobble over time
        this.addPitchVariance = true;
        /// Allow tenseness to wobble over time
        this.addTensenessVariance = true;
    }

    _createClass(Glottis, [{
        key: "init",
        value: function init() {
            this.setupWaveform(0);
        }
    }, {
        key: "handleTouches",
        value: function handleTouches() {
            if (this.touch != 0 && !this.touch.alive) this.touch = 0;

            if (this.touch == 0) {
                for (var j = 0; j < UI.touchesWithMouse.length; j++) {
                    var touch = UI.touchesWithMouse[j];
                    if (!touch.alive) continue;
                    if (touch.y < this.keyboardTop) continue;
                    this.touch = touch;
                }
            }

            if (this.touch != 0) {
                var local_y = this.touch.y - this.keyboardTop - 10;
                var local_x = this.touch.x - this.keyboardLeft;
                local_y = Math.clamp(local_y, 0, this.keyboardHeight - 26);
                var semitone = this.semitones * local_x / this.keyboardWidth + 0.5;
                Glottis.UIFrequency = this.baseNote * Math.pow(2, semitone / 12);
                if (Glottis.intensity == 0) Glottis.smoothFrequency = Glottis.UIFrequency;
                //Glottis.UIRd = 3*local_y / (this.keyboardHeight-20);
                var t = Math.clamp(1 - local_y / (this.keyboardHeight - 28), 0, 1);
                Glottis.UITenseness = 1 - Math.cos(t * Math.PI * 0.5);
                Glottis.loudness = Math.pow(Glottis.UITenseness, 0.25);
                this.x = this.touch.x;
                this.y = local_y + this.keyboardTop + 10;
            }
            Glottis.isTouched = this.touch != 0;
        }
    }, {
        key: "runStep",
        value: function runStep(lambda, noiseSource) {
            var timeStep = 1.0 / this.trombone.sampleRate;
            this.timeInWaveform += timeStep;
            this.totalTime += timeStep;
            if (this.timeInWaveform > this.waveformLength) {
                this.timeInWaveform -= this.waveformLength;
                this.setupWaveform(lambda);
            }
            var out = this.normalizedLFWaveform(this.timeInWaveform / this.waveformLength);
            var aspiration = this.intensity * (1.0 - Math.sqrt(this.UITenseness)) * this.getNoiseModulator() * noiseSource;
            aspiration *= 0.2 + 0.02 * _noise2.default.simplex1(this.totalTime * 1.99);
            out += aspiration;
            return out;
        }
    }, {
        key: "getNoiseModulator",
        value: function getNoiseModulator() {
            var voiced = 0.1 + 0.2 * Math.max(0, Math.sin(Math.PI * 2 * this.timeInWaveform / this.waveformLength));
            //return 0.3;
            return this.UITenseness * this.intensity * voiced + (1 - this.UITenseness * this.intensity) * 0.3;
        }
    }, {
        key: "finishBlock",
        value: function finishBlock() {
            var vibrato = 0;
            if (this.addPitchVariance) {
                // Add small imperfections to the vocal output
                vibrato += this.vibratoAmount * Math.sin(2 * Math.PI * this.totalTime * this.vibratoFrequency);
                vibrato += 0.02 * _noise2.default.simplex1(this.totalTime * 4.07);
                vibrato += 0.04 * _noise2.default.simplex1(this.totalTime * 2.15);
            }

            if (this.trombone.autoWobble) {
                vibrato += 0.2 * _noise2.default.simplex1(this.totalTime * 0.98);
                vibrato += 0.4 * _noise2.default.simplex1(this.totalTime * 0.5);
            }

            if (this.UIFrequency > this.smoothFrequency) this.smoothFrequency = Math.min(this.smoothFrequency * 1.1, this.UIFrequency);
            if (this.UIFrequency < this.smoothFrequency) this.smoothFrequency = Math.max(this.smoothFrequency / 1.1, this.UIFrequency);
            this.oldFrequency = this.newFrequency;
            this.newFrequency = this.smoothFrequency * (1 + vibrato);
            this.oldTenseness = this.newTenseness;

            if (this.addTensenessVariance) this.newTenseness = this.UITenseness + 0.1 * _noise2.default.simplex1(this.totalTime * 0.46) + 0.05 * _noise2.default.simplex1(this.totalTime * 0.36);else this.newTenseness = this.UITenseness;

            if (!this.isTouched && this.trombone.alwaysVoice) this.newTenseness += (3 - this.UITenseness) * (1 - this.intensity);

            if (this.isTouched || this.trombone.alwaysVoice) this.intensity += 0.13;
            this.intensity = Math.clamp(this.intensity, 0, 1);
        }
    }, {
        key: "setupWaveform",
        value: function setupWaveform(lambda) {
            this.frequency = this.oldFrequency * (1 - lambda) + this.newFrequency * lambda;
            var tenseness = this.oldTenseness * (1 - lambda) + this.newTenseness * lambda;
            this.Rd = 3 * (1 - tenseness);
            this.waveformLength = 1.0 / this.frequency;

            var Rd = this.Rd;
            if (Rd < 0.5) Rd = 0.5;
            if (Rd > 2.7) Rd = 2.7;
            // normalized to time = 1, Ee = 1
            var Ra = -0.01 + 0.048 * Rd;
            var Rk = 0.224 + 0.118 * Rd;
            var Rg = Rk / 4 * (0.5 + 1.2 * Rk) / (0.11 * Rd - Ra * (0.5 + 1.2 * Rk));

            var Ta = Ra;
            var Tp = 1 / (2 * Rg);
            var Te = Tp + Tp * Rk; //

            var epsilon = 1 / Ta;
            var shift = Math.exp(-epsilon * (1 - Te));
            var Delta = 1 - shift; //divide by this to scale RHS

            var RHSIntegral = 1 / epsilon * (shift - 1) + (1 - Te) * shift;
            RHSIntegral = RHSIntegral / Delta;

            var totalLowerIntegral = -(Te - Tp) / 2 + RHSIntegral;
            var totalUpperIntegral = -totalLowerIntegral;

            var omega = Math.PI / Tp;
            var s = Math.sin(omega * Te);
            var y = -Math.PI * s * totalUpperIntegral / (Tp * 2);
            var z = Math.log(y);
            var alpha = z / (Tp / 2 - Te);
            var E0 = -1 / (s * Math.exp(alpha * Te));
            this.alpha = alpha;
            this.E0 = E0;
            this.epsilon = epsilon;
            this.shift = shift;
            this.Delta = Delta;
            this.Te = Te;
            this.omega = omega;
        }
    }, {
        key: "normalizedLFWaveform",
        value: function normalizedLFWaveform(t) {
            if (t > this.Te) this.output = (-Math.exp(-this.epsilon * (t - this.Te)) + this.shift) / this.Delta;else this.output = this.E0 * Math.exp(this.alpha * t) * Math.sin(this.omega * t);

            return this.output * this.intensity * this.loudness;
        }
    }]);

    return Glottis;
}();

exports.Glottis = Glottis;

},{"../noise.js":10}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TractUI = function () {
    function TractUI(trombone) {
        _classCallCheck(this, TractUI);

        this.trombone = trombone;

        this.originX = 340;
        this.originY = 449;
        this.radius = 298;
        this.scale = 60;
        this.tongueIndex = 12.9;
        this.tongueDiameter = 2.43;
        this.innerTongueControlRadius = 2.05;
        this.outerTongueControlRadius = 3.5;
        this.tongueTouch = 0;
        this.angleScale = 0.64;
        this.angleOffset = -0.24;
        this.noseOffset = 0.8;
        this.gridOffset = 1.7;

        /// Final openness of the mouth (closer to 0 is more closed)
        this.target = 0.1;
        /// Index in the throat array to move to target
        this.index = 42;
        /// Number of throat segments to close around the index
        this.radius = 0;
    }

    _createClass(TractUI, [{
        key: "init",
        value: function init() {
            var Tract = this.trombone.Tract;

            this.setRestDiameter();
            for (var i = 0; i < Tract.n; i++) {
                Tract.diameter[i] = Tract.targetDiameter[i] = Tract.restDiameter[i];
            }

            this.tongueLowerIndexBound = Tract.bladeStart + 2;
            this.tongueUpperIndexBound = Tract.tipStart - 3;
            this.tongueIndexCentre = 0.5 * (this.tongueLowerIndexBound + this.tongueUpperIndexBound);
        }
    }, {
        key: "getIndex",
        value: function getIndex(x, y) {
            var Tract = this.trombone.Tract;

            var xx = x - this.originX;var yy = y - this.originY;
            var angle = Math.atan2(yy, xx);
            while (angle > 0) {
                angle -= 2 * Math.PI;
            }return (Math.PI + angle - this.angleOffset) * (Tract.lipStart - 1) / (this.angleScale * Math.PI);
        }
    }, {
        key: "getDiameter",
        value: function getDiameter(x, y) {
            var xx = x - this.originX;var yy = y - this.originY;
            return (this.radius - Math.sqrt(xx * xx + yy * yy)) / this.scale;
        }
    }, {
        key: "setRestDiameter",
        value: function setRestDiameter() {
            var Tract = this.trombone.Tract;

            for (var i = Tract.bladeStart; i < Tract.lipStart; i++) {
                var t = 1.1 * Math.PI * (this.tongueIndex - i) / (Tract.tipStart - Tract.bladeStart);
                var fixedTongueDiameter = 2 + (this.tongueDiameter - 2) / 1.5;
                var curve = (1.5 - fixedTongueDiameter + this.gridOffset) * Math.cos(t);
                if (i == Tract.bladeStart - 2 || i == Tract.lipStart - 1) curve *= 0.8;
                if (i == Tract.bladeStart || i == Tract.lipStart - 2) curve *= 0.94;
                Tract.restDiameter[i] = 1.5 - curve;
            }
        }

        /**
         * Sets the lips of the modeled tract to be closed by the specified amount.
         * @param {number} progress Percentage closed (number between 0 and 1)
         */

    }, {
        key: "SetLipsClosed",
        value: function SetLipsClosed(progress) {

            var Tract = this.trombone.Tract;

            this.setRestDiameter();
            for (var i = 0; i < Tract.n; i++) {
                Tract.targetDiameter[i] = Tract.restDiameter[i];
            } // Disable this behavior if the mouth is closed a certain amount
            //if (progress > 0.8 || progress < 0.1) return;

            for (var _i = this.index - this.radius; _i <= this.index + this.radius; _i++) {
                if (_i > Tract.targetDiameter.length || _i < 0) continue;
                var interp = Math.lerp(Tract.restDiameter[_i], this.target, progress);
                Tract.targetDiameter[_i] = interp;
            }
        }
    }]);

    return TractUI;
}();

exports.TractUI = TractUI;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tract = function () {
    function Tract(trombone) {
        _classCallCheck(this, Tract);

        this.trombone = trombone;

        this.n = 44;
        this.bladeStart = 10;
        this.tipStart = 32;
        this.lipStart = 39;
        this.R = []; //component going right
        this.L = []; //component going left
        this.reflection = [];
        this.junctionOutputR = [];
        this.junctionOutputL = [];
        this.maxAmplitude = [];
        this.diameter = [];
        this.restDiameter = [];
        this.targetDiameter = [];
        this.newDiameter = [];
        this.A = [];
        this.glottalReflection = 0.75;
        this.lipReflection = -0.85;
        this.lastObstruction = -1;
        this.fade = 1.0; //0.9999,
        this.movementSpeed = 15; //cm per second
        this.transients = [];
        this.lipOutput = 0;
        this.noseOutput = 0;
        this.velumTarget = 0.01;
    }

    _createClass(Tract, [{
        key: "init",
        value: function init() {
            this.bladeStart = Math.floor(this.bladeStart * this.n / 44);
            this.tipStart = Math.floor(this.tipStart * this.n / 44);
            this.lipStart = Math.floor(this.lipStart * this.n / 44);
            this.diameter = new Float64Array(this.n);
            this.restDiameter = new Float64Array(this.n);
            this.targetDiameter = new Float64Array(this.n);
            this.newDiameter = new Float64Array(this.n);
            for (var i = 0; i < this.n; i++) {
                var diameter = 0;
                if (i < 7 * this.n / 44 - 0.5) diameter = 0.6;else if (i < 12 * this.n / 44) diameter = 1.1;else diameter = 1.5;
                this.diameter[i] = this.restDiameter[i] = this.targetDiameter[i] = this.newDiameter[i] = diameter;
            }
            this.R = new Float64Array(this.n);
            this.L = new Float64Array(this.n);
            this.reflection = new Float64Array(this.n + 1);
            this.newReflection = new Float64Array(this.n + 1);
            this.junctionOutputR = new Float64Array(this.n + 1);
            this.junctionOutputL = new Float64Array(this.n + 1);
            this.A = new Float64Array(this.n);
            this.maxAmplitude = new Float64Array(this.n);

            this.noseLength = Math.floor(28 * this.n / 44);
            this.noseStart = this.n - this.noseLength + 1;
            this.noseR = new Float64Array(this.noseLength);
            this.noseL = new Float64Array(this.noseLength);
            this.noseJunctionOutputR = new Float64Array(this.noseLength + 1);
            this.noseJunctionOutputL = new Float64Array(this.noseLength + 1);
            this.noseReflection = new Float64Array(this.noseLength + 1);
            this.noseDiameter = new Float64Array(this.noseLength);
            this.noseA = new Float64Array(this.noseLength);
            this.noseMaxAmplitude = new Float64Array(this.noseLength);
            for (var i = 0; i < this.noseLength; i++) {
                var diameter;
                var d = 2 * (i / this.noseLength);
                if (d < 1) diameter = 0.4 + 1.6 * d;else diameter = 0.5 + 1.5 * (2 - d);
                diameter = Math.min(diameter, 1.9);
                this.noseDiameter[i] = diameter;
            }
            this.newReflectionLeft = this.newReflectionRight = this.newReflectionNose = 0;
            this.calculateReflections();
            this.calculateNoseReflections();
            this.noseDiameter[0] = this.velumTarget;
        }
    }, {
        key: "reshapeTract",
        value: function reshapeTract(deltaTime) {
            var amount = deltaTime * this.movementSpeed;;
            var newLastObstruction = -1;
            for (var i = 0; i < this.n; i++) {
                var diameter = this.diameter[i];
                var targetDiameter = this.targetDiameter[i];
                if (diameter <= 0) newLastObstruction = i;
                var slowReturn;
                if (i < this.noseStart) slowReturn = 0.6;else if (i >= this.tipStart) slowReturn = 1.0;else slowReturn = 0.6 + 0.4 * (i - this.noseStart) / (this.tipStart - this.noseStart);
                this.diameter[i] = Math.moveTowards(diameter, targetDiameter, slowReturn * amount, 2 * amount);
            }
            if (this.lastObstruction > -1 && newLastObstruction == -1 && this.noseA[0] < 0.05) {
                this.addTransient(this.lastObstruction);
            }
            this.lastObstruction = newLastObstruction;

            amount = deltaTime * this.movementSpeed;
            this.noseDiameter[0] = Math.moveTowards(this.noseDiameter[0], this.velumTarget, amount * 0.25, amount * 0.1);
            this.noseA[0] = this.noseDiameter[0] * this.noseDiameter[0];
        }
    }, {
        key: "calculateReflections",
        value: function calculateReflections() {
            for (var i = 0; i < this.n; i++) {
                this.A[i] = this.diameter[i] * this.diameter[i]; //ignoring PI etc.
            }
            for (var i = 1; i < this.n; i++) {
                this.reflection[i] = this.newReflection[i];
                if (this.A[i] == 0) this.newReflection[i] = 0.999; //to prevent some bad behaviour if 0
                else this.newReflection[i] = (this.A[i - 1] - this.A[i]) / (this.A[i - 1] + this.A[i]);
            }

            //now at junction with nose

            this.reflectionLeft = this.newReflectionLeft;
            this.reflectionRight = this.newReflectionRight;
            this.reflectionNose = this.newReflectionNose;
            var sum = this.A[this.noseStart] + this.A[this.noseStart + 1] + this.noseA[0];
            this.newReflectionLeft = (2 * this.A[this.noseStart] - sum) / sum;
            this.newReflectionRight = (2 * this.A[this.noseStart + 1] - sum) / sum;
            this.newReflectionNose = (2 * this.noseA[0] - sum) / sum;
        }
    }, {
        key: "calculateNoseReflections",
        value: function calculateNoseReflections() {
            for (var i = 0; i < this.noseLength; i++) {
                this.noseA[i] = this.noseDiameter[i] * this.noseDiameter[i];
            }
            for (var i = 1; i < this.noseLength; i++) {
                this.noseReflection[i] = (this.noseA[i - 1] - this.noseA[i]) / (this.noseA[i - 1] + this.noseA[i]);
            }
        }
    }, {
        key: "runStep",
        value: function runStep(glottalOutput, turbulenceNoise, lambda) {
            var updateAmplitudes = Math.random() < 0.1;

            //mouth
            this.processTransients();
            this.addTurbulenceNoise(turbulenceNoise);

            //this.glottalReflection = -0.8 + 1.6 * Glottis.newTenseness;
            this.junctionOutputR[0] = this.L[0] * this.glottalReflection + glottalOutput;
            this.junctionOutputL[this.n] = this.R[this.n - 1] * this.lipReflection;

            for (var i = 1; i < this.n; i++) {
                var r = this.reflection[i] * (1 - lambda) + this.newReflection[i] * lambda;
                var w = r * (this.R[i - 1] + this.L[i]);
                this.junctionOutputR[i] = this.R[i - 1] - w;
                this.junctionOutputL[i] = this.L[i] + w;
            }

            //now at junction with nose
            var i = this.noseStart;
            var r = this.newReflectionLeft * (1 - lambda) + this.reflectionLeft * lambda;
            this.junctionOutputL[i] = r * this.R[i - 1] + (1 + r) * (this.noseL[0] + this.L[i]);
            r = this.newReflectionRight * (1 - lambda) + this.reflectionRight * lambda;
            this.junctionOutputR[i] = r * this.L[i] + (1 + r) * (this.R[i - 1] + this.noseL[0]);
            r = this.newReflectionNose * (1 - lambda) + this.reflectionNose * lambda;
            this.noseJunctionOutputR[0] = r * this.noseL[0] + (1 + r) * (this.L[i] + this.R[i - 1]);

            for (var i = 0; i < this.n; i++) {
                this.R[i] = this.junctionOutputR[i] * 0.999;
                this.L[i] = this.junctionOutputL[i + 1] * 0.999;

                //this.R[i] = Math.clamp(this.junctionOutputR[i] * this.fade, -1, 1);
                //this.L[i] = Math.clamp(this.junctionOutputL[i+1] * this.fade, -1, 1);    

                if (updateAmplitudes) {
                    var amplitude = Math.abs(this.R[i] + this.L[i]);
                    if (amplitude > this.maxAmplitude[i]) this.maxAmplitude[i] = amplitude;else this.maxAmplitude[i] *= 0.999;
                }
            }

            this.lipOutput = this.R[this.n - 1];

            //nose     
            this.noseJunctionOutputL[this.noseLength] = this.noseR[this.noseLength - 1] * this.lipReflection;

            for (var i = 1; i < this.noseLength; i++) {
                var w = this.noseReflection[i] * (this.noseR[i - 1] + this.noseL[i]);
                this.noseJunctionOutputR[i] = this.noseR[i - 1] - w;
                this.noseJunctionOutputL[i] = this.noseL[i] + w;
            }

            for (var i = 0; i < this.noseLength; i++) {
                this.noseR[i] = this.noseJunctionOutputR[i] * this.fade;
                this.noseL[i] = this.noseJunctionOutputL[i + 1] * this.fade;

                //this.noseR[i] = Math.clamp(this.noseJunctionOutputR[i] * this.fade, -1, 1);
                //this.noseL[i] = Math.clamp(this.noseJunctionOutputL[i+1] * this.fade, -1, 1);    

                if (updateAmplitudes) {
                    var amplitude = Math.abs(this.noseR[i] + this.noseL[i]);
                    if (amplitude > this.noseMaxAmplitude[i]) this.noseMaxAmplitude[i] = amplitude;else this.noseMaxAmplitude[i] *= 0.999;
                }
            }

            this.noseOutput = this.noseR[this.noseLength - 1];
        }
    }, {
        key: "finishBlock",
        value: function finishBlock() {
            this.reshapeTract(this.trombone.AudioSystem.blockTime);
            this.calculateReflections();
        }
    }, {
        key: "addTransient",
        value: function addTransient(position) {
            var trans = {};
            trans.position = position;
            trans.timeAlive = 0;
            trans.lifeTime = 0.2;
            trans.strength = 0.3;
            trans.exponent = 200;
            this.transients.push(trans);
        }
    }, {
        key: "processTransients",
        value: function processTransients() {
            for (var i = 0; i < this.transients.length; i++) {
                var trans = this.transients[i];
                var amplitude = trans.strength * Math.pow(2, -trans.exponent * trans.timeAlive);
                this.R[trans.position] += amplitude / 2;
                this.L[trans.position] += amplitude / 2;
                trans.timeAlive += 1.0 / (this.trombone.sampleRate * 2);
            }
            for (var i = this.transients.length - 1; i >= 0; i--) {
                var trans = this.transients[i];
                if (trans.timeAlive > trans.lifeTime) {
                    this.transients.splice(i, 1);
                }
            }
        }
    }, {
        key: "addTurbulenceNoise",
        value: function addTurbulenceNoise(turbulenceNoise) {
            // for (var j=0; j<UI.touchesWithMouse.length; j++)
            // {
            //     var touch = UI.touchesWithMouse[j];
            //     if (touch.index<2 || touch.index>Tract.n) continue;
            //     if (touch.diameter<=0) continue;            
            //     var intensity = touch.fricative_intensity;
            //     if (intensity == 0) continue;
            //     this.addTurbulenceNoiseAtIndex(0.66*turbulenceNoise*intensity, touch.index, touch.diameter);
            // }
        }
    }, {
        key: "addTurbulenceNoiseAtIndex",
        value: function addTurbulenceNoiseAtIndex(turbulenceNoise, index, diameter) {
            var i = Math.floor(index);
            var delta = index - i;
            turbulenceNoise *= this.trombone.Glottis.getNoiseModulator();
            var thinness0 = Math.clamp(8 * (0.7 - diameter), 0, 1);
            var openness = Math.clamp(30 * (diameter - 0.3), 0, 1);
            var noise0 = turbulenceNoise * (1 - delta) * thinness0 * openness;
            var noise1 = turbulenceNoise * delta * thinness0 * openness;
            this.R[i + 1] += noise0 / 2;
            this.L[i + 1] += noise0 / 2;
            this.R[i + 2] += noise1 / 2;
            this.L[i + 2] += noise1 / 2;
        }
    }]);

    return Tract;
}();

;

exports.Tract = Tract;

},{}],9:[function(require,module,exports){
"use strict";

Math.clamp = function (number, min, max) {
    if (number < min) return min;else if (number > max) return max;else return number;
};

Math.moveTowards = function (current, target, amount) {
    if (current < target) return Math.min(current + amount, target);else return Math.max(current - amount, target);
};

Math.moveTowards = function (current, target, amountUp, amountDown) {
    if (current < target) return Math.min(current + amountUp, target);else return Math.max(current - amountDown, target);
};

Math.gaussian = function () {
    var s = 0;
    for (var c = 0; c < 16; c++) {
        s += Math.random();
    }return (s - 8) / 4;
};

Math.lerp = function (a, b, t) {
    return a + (b - a) * t;
};

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

var Grad = function () {
    function Grad(x, y, z) {
        _classCallCheck(this, Grad);

        this.x = x;
        this.y = y;
        this.z = z;
    }

    _createClass(Grad, [{
        key: "dot2",
        value: function dot2(x, y) {
            return this.x * x + this.y * y;
        }
    }, {
        key: "dot3",
        value: function dot3(x, y, z) {
            return this.x * x + this.y * y + this.z * z;
        }
    }]);

    return Grad;
}();

var Noise = function () {
    function Noise() {
        _classCallCheck(this, Noise);

        this.grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0), new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1), new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];
        this.p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

        // To remove the need for index wrapping, double the permutation table length
        this.perm = new Array(512);
        this.gradP = new Array(512);

        this.seed(Date.now());
    }

    _createClass(Noise, [{
        key: "seed",
        value: function seed(_seed) {
            if (_seed > 0 && _seed < 1) {
                // Scale the seed out
                _seed *= 65536;
            }

            _seed = Math.floor(_seed);
            if (_seed < 256) {
                _seed |= _seed << 8;
            }

            for (var i = 0; i < 256; i++) {
                var v;
                if (i & 1) {
                    v = this.p[i] ^ _seed & 255;
                } else {
                    v = this.p[i] ^ _seed >> 8 & 255;
                }

                this.perm[i] = this.perm[i + 256] = v;
                this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
            }
        }
    }, {
        key: "simplex2",


        // 2D simplex noise
        value: function simplex2(xin, yin) {
            // Skewing and unskewing factors for 2, 3, and 4 dimensions
            var F2 = 0.5 * (Math.sqrt(3) - 1);
            var G2 = (3 - Math.sqrt(3)) / 6;

            var F3 = 1 / 3;
            var G3 = 1 / 6;

            var n0, n1, n2; // Noise contributions from the three corners
            // Skew the input space to determine which simplex cell we're in
            var s = (xin + yin) * F2; // Hairy factor for 2D
            var i = Math.floor(xin + s);
            var j = Math.floor(yin + s);
            var t = (i + j) * G2;
            var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
            var y0 = yin - j + t;
            // For the 2D case, the simplex shape is an equilateral triangle.
            // Determine which simplex we are in.
            var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
            if (x0 > y0) {
                // lower triangle, XY order: (0,0)->(1,0)->(1,1)
                i1 = 1;j1 = 0;
            } else {
                // upper triangle, YX order: (0,0)->(0,1)->(1,1)
                i1 = 0;j1 = 1;
            }
            // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
            // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
            // c = (3-sqrt(3))/6
            var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
            var y1 = y0 - j1 + G2;
            var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
            var y2 = y0 - 1 + 2 * G2;
            // Work out the hashed gradient indices of the three simplex corners
            i &= 255;
            j &= 255;
            var gi0 = this.gradP[i + this.perm[j]];
            var gi1 = this.gradP[i + i1 + this.perm[j + j1]];
            var gi2 = this.gradP[i + 1 + this.perm[j + 1]];
            // Calculate the contribution from the three corners
            var t0 = 0.5 - x0 * x0 - y0 * y0;
            if (t0 < 0) {
                n0 = 0;
            } else {
                t0 *= t0;
                n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
            }
            var t1 = 0.5 - x1 * x1 - y1 * y1;
            if (t1 < 0) {
                n1 = 0;
            } else {
                t1 *= t1;
                n1 = t1 * t1 * gi1.dot2(x1, y1);
            }
            var t2 = 0.5 - x2 * x2 - y2 * y2;
            if (t2 < 0) {
                n2 = 0;
            } else {
                t2 *= t2;
                n2 = t2 * t2 * gi2.dot2(x2, y2);
            }
            // Add contributions from each corner to get the final noise value.
            // The result is scaled to return values in the interval [-1,1].
            return 70 * (n0 + n1 + n2);
        }
    }, {
        key: "simplex1",
        value: function simplex1(x) {
            return this.simplex2(x * 1.2, -x * 0.7);
        }
    }]);

    return Noise;
}();

var singleton = new Noise();
Object.freeze(singleton);

exports.default = singleton;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PinkTrombone = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("./math-extensions.js");

var _audioSystem = require("./components/audio-system.js");

var _glottis = require("./components/glottis.js");

var _tract = require("./components/tract.js");

var _tractUi = require("./components/tract-ui.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PinkTrombone = function () {
    function PinkTrombone(controller) {
        _classCallCheck(this, PinkTrombone);

        this.controller = controller;

        this.sampleRate = 0;
        this.time = 0;
        this.alwaysVoice = true;
        this.autoWobble = true;
        this.noiseFreq = 500;
        this.noiseQ = 0.7;

        this.AudioSystem = new _audioSystem.AudioSystem(this);
        this.AudioSystem.init();

        this.Glottis = new _glottis.Glottis(this);
        this.Glottis.init();

        this.Tract = new _tract.Tract(this);
        this.Tract.init();

        this.TractUI = new _tractUi.TractUI(this);
        this.TractUI.init();

        //this.StartAudio();
        //this.SetMute(true);

        this.muted = false;
    }

    _createClass(PinkTrombone, [{
        key: "StartAudio",
        value: function StartAudio() {
            this.muted = false;
            this.AudioSystem.startSound();
        }
    }, {
        key: "SetMute",
        value: function SetMute(doMute) {
            doMute ? this.AudioSystem.mute() : this.AudioSystem.unmute();
            this.muted = doMute;
        }
    }, {
        key: "ToggleMute",
        value: function ToggleMute() {
            this.SetMute(!this.muted);
        }
    }]);

    return PinkTrombone;
}();

exports.PinkTrombone = PinkTrombone;

},{"./components/audio-system.js":5,"./components/glottis.js":6,"./components/tract-ui.js":7,"./components/tract.js":8,"./math-extensions.js":9}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const words = require('cmu-pronouncing-dictionary');

var TTSController = exports.TTSController = function TTSController() {
    _classCallCheck(this, TTSController);
}

// GetGraphemes(str){
//     let zeroPunctuation = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
//     let wordBank = []
//     for(let word of zeroPunctuation.split(' ')){
//         wordBank.push(this.GetPronunciationForWord(word));
//     }
//     return wordBank;
// }

// GetPronunciationForWord(rawWord){
//     let word = rawWord.toLowerCase();
//     if (words[word]){
//         return words[word];
//     } else {
//         // If the word isn't in the dict, ignore it for now
//         return "None";
//     }
// }


;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelLoader = function () {
    function ModelLoader() {
        _classCallCheck(this, ModelLoader);
    }

    _createClass(ModelLoader, null, [{
        key: 'LoadOBJ',


        /**
         * Loads a model asynchronously. Expects an object containing
         * the path to the object, the relative path of the OBJ file,
         * and the relative path of the MTL file.
         * 
         * An example:
         * let modelInfo = {
         *      path: "../resources/obj/",
         *      objFile: "test.obj",
         *      mtlFile: "test.mtl"
         * }
         */
        value: function LoadOBJ(modelInfo, loadedCallback) {

            var onProgress = function onProgress(xhr) {
                if (xhr.lengthComputable) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log(Math.round(percentComplete, 2) + '% downloaded');
                }
            };
            var onError = function onError(xhr) {};

            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.setPath(modelInfo.path);

            mtlLoader.load(modelInfo.mtlFile, function (materials) {
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath(modelInfo.path);
                objLoader.load(modelInfo.objFile, function (object) {
                    loadedCallback(object);
                }, onProgress, onError);
            });
        }
    }, {
        key: 'LoadJSON',
        value: function LoadJSON(path, loadedCallback) {

            var onProgress = function onProgress(xhr) {
                if (xhr.lengthComputable) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log(Math.round(percentComplete, 2) + '% downloaded');
                }
            };
            var onError = function onError(xhr) {};

            var loader = new THREE.JSONLoader();
            loader.load(path, function (geometry, materials) {
                // Apply skinning to each material so the verts are affected by bone movement
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = materials[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var mat = _step.value;

                        mat.skinning = true;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                var mesh = new THREE.SkinnedMesh(geometry, new THREE.MultiMaterial(materials));
                mesh.name = "Jon";
                loadedCallback(mesh);
            }, onProgress, onError);
        }
    }, {
        key: 'LoadFBX',
        value: function LoadFBX(path, loadedCallback) {
            var manager = new THREE.LoadingManager();
            manager.onProgress = function (item, loaded, total) {
                console.log(item, loaded, total);
            };

            var onProgress = function onProgress(xhr) {
                if (xhr.lengthComputable) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log(Math.round(percentComplete, 2) + '% downloaded');
                }
            };
            var onError = function onError(xhr) {};

            var loader = new THREE.FBXLoader(manager);
            loader.load(path, function (object) {
                loadedCallback(object);
            }, onProgress, onError);
        }
    }]);

    return ModelLoader;
}();

exports.ModelLoader = ModelLoader;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Detector = function () {
    function Detector() {
        _classCallCheck(this, Detector);
    }

    _createClass(Detector, null, [{
        key: "HasWebGL",


        //http://stackoverflow.com/questions/11871077/proper-way-to-detect-webgl-support
        value: function HasWebGL() {
            if (!!window.WebGLRenderingContext) {
                var canvas = document.createElement("canvas"),
                    names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                    context = false;

                for (var i = 0; i < 4; i++) {
                    try {
                        context = canvas.getContext(names[i]);
                        if (context && typeof context.getParameter == "function") {
                            // WebGL is enabled
                            return true;
                        }
                    } catch (e) {}
                }

                // WebGL is supported, but disabled
                return false;
            }
            // WebGL not supported
            return false;
        }
    }, {
        key: "GetErrorHTML",
        value: function GetErrorHTML() {
            var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (message == null) {
                message = "Your graphics card does not seem to support \n                        <a href=\"http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation\">WebGL</a>. <br>\n                        Find out how to get it <a href=\"http://get.webgl.org/\">here</a>.";
            }
            return "\n        <div class=\"no-webgl-support\">\n        <p style=\"text-align: center;\">" + message + "</p>\n        </div>\n        ";
        }
    }]);

    return Detector;
}();

exports.Detector = Detector;

},{}],15:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.MidiConvert=e():t.MidiConvert=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(7),i=n(2),a={instrumentByPatchID:i.instrumentByPatchID,instrumentFamilyByID:i.instrumentFamilyByID,parse:function(t){return(new r.Midi).decode(t)},load:function(t,e){var n=(new r.Midi).load(t);return e&&n.then(e),n},create:function(){return new r.Midi}};e["default"]=a,t.exports=a},function(t,e){"use strict";function n(t){return t.replace(/\u0000/g,"")}function r(t,e){return 60/e.bpm*(t/e.PPQ)}function i(t){return"number"==typeof t}function a(t){return"string"==typeof t}function o(t){var e=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],n=Math.floor(t/12)-1,r=t%12;return e[r]+n}var s=function(){var t=/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i;return function(e){return a(e)&&t.test(e)}}(),u=function(){var t=/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,e={cbb:-2,cb:-1,c:0,"c#":1,cx:2,dbb:0,db:1,d:2,"d#":3,dx:4,ebb:2,eb:3,e:4,"e#":5,ex:6,fbb:3,fb:4,f:5,"f#":6,fx:7,gbb:5,gb:6,g:7,"g#":8,gx:9,abb:7,ab:8,a:9,"a#":10,ax:11,bbb:9,bb:10,b:11,"b#":12,bx:13};return function(n){var r=t.exec(n),i=r[1],a=r[2],o=e[i.toLowerCase()];return o+12*(parseInt(a)+1)}}();t.exports={cleanName:n,ticksToSeconds:r,isString:a,isNumber:i,isPitch:s,midiToPitch:o,pitchToMidi:u}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.instrumentByPatchID=["acoustic grand piano","bright acoustic piano","electric grand piano","honky-tonk piano","electric piano 1","electric piano 2","harpsichord","clavi","celesta","glockenspiel","music box","vibraphone","marimba","xylophone","tubular bells","dulcimer","drawbar organ","percussive organ","rock organ","church organ","reed organ","accordion","harmonica","tango accordion","acoustic guitar (nylon)","acoustic guitar (steel)","electric guitar (jazz)","electric guitar (clean)","electric guitar (muted)","overdriven guitar","distortion guitar","guitar harmonics","acoustic bass","electric bass (finger)","electric bass (pick)","fretless bass","slap bass 1","slap bass 2","synth bass 1","synth bass 2","violin","viola","cello","contrabass","tremolo strings","pizzicato strings","orchestral harp","timpani","string ensemble 1","string ensemble 2","synthstrings 1","synthstrings 2","choir aahs","voice oohs","synth voice","orchestra hit","trumpet","trombone","tuba","muted trumpet","french horn","brass section","synthbrass 1","synthbrass 2","soprano sax","alto sax","tenor sax","baritone sax","oboe","english horn","bassoon","clarinet","piccolo","flute","recorder","pan flute","blown bottle","shakuhachi","whistle","ocarina","lead 1 (square)","lead 2 (sawtooth)","lead 3 (calliope)","lead 4 (chiff)","lead 5 (charang)","lead 6 (voice)","lead 7 (fifths)","lead 8 (bass + lead)","pad 1 (new age)","pad 2 (warm)","pad 3 (polysynth)","pad 4 (choir)","pad 5 (bowed)","pad 6 (metallic)","pad 7 (halo)","pad 8 (sweep)","fx 1 (rain)","fx 2 (soundtrack)","fx 3 (crystal)","fx 4 (atmosphere)","fx 5 (brightness)","fx 6 (goblins)","fx 7 (echoes)","fx 8 (sci-fi)","sitar","banjo","shamisen","koto","kalimba","bag pipe","fiddle","shanai","tinkle bell","agogo","steel drums","woodblock","taiko drum","melodic tom","synth drum","reverse cymbal","guitar fret noise","breath noise","seashore","bird tweet","telephone ring","helicopter","applause","gunshot"],e.instrumentFamilyByID=["piano","chromatic percussion","organ","guitar","bass","strings","ensemble","brass","reed","pipe","synth lead","synth pad","synth effects","ethnic","percussive","sound effects"]},function(t,e){"use strict";function n(t,e){var n=0,r=t.length,i=r;if(r>0&&t[r-1].time<=e)return r-1;for(;i>n;){var a=Math.floor(n+(i-n)/2),o=t[a],s=t[a+1];if(o.time===e){for(var u=a;u<t.length;u++){var c=t[u];c.time===e&&(a=u)}return a}if(o.time<e&&s.time>e)return a;o.time>e?i=a:o.time<e&&(n=a+1)}return-1}function r(t,e){if(t.length){var r=n(t,e.time);t.splice(r+1,0,e)}else t.push(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.BinaryInsert=r},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i={1:"modulationWheel",2:"breath",4:"footController",5:"portamentoTime",7:"volume",8:"balance",10:"pan",64:"sustain",65:"portamentoTime",66:"sostenuto",67:"softPedal",68:"legatoFootswitch",84:"portamentoContro"},a=function(){function t(e,r,i){n(this,t),this.number=e,this.time=r,this.value=i}return r(t,[{key:"name",get:function(){return i.hasOwnProperty(this.number)?i[this.number]:void 0}}]),t}();e.Control=a},function(t,e){"use strict";function n(t){for(var e={PPQ:t.header.ticksPerBeat},n=0;n<t.tracks.length;n++)for(var r=t.tracks[n],i=0;i<r.length;i++){var a=r[i];"meta"===a.type&&("timeSignature"===a.subtype?e.timeSignature=[a.numerator,a.denominator]:"setTempo"===a.subtype&&(e.bpm||(e.bpm=6e7/a.microsecondsPerBeat)))}return e.bpm=e.bpm||120,e}Object.defineProperty(e,"__esModule",{value:!0}),e.parseHeader=n},function(t,e){"use strict";function n(t,e){for(var n=0;n<t.length;n++){var r=t[n],i=e[n];if(r.length>i)return!0}return!1}function r(t,e,n){for(var r=0,i=1/0,a=0;a<t.length;a++){var o=t[a],s=e[a];o[s]&&o[s].time<i&&(r=a,i=o[s].time)}n[r](t[r][e[r]]),e[r]+=1}function i(){for(var t=arguments.length,e=Array(t),i=0;t>i;i++)e[i]=arguments[i];for(var a=e.filter(function(t,e){return e%2===0}),o=new Uint32Array(a.length),s=e.filter(function(t,e){return e%2===1});n(a,o);)r(a,o,s)}Object.defineProperty(e,"__esModule",{value:!0}),e.Merge=i},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0}),e.Midi=void 0;var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(11),s=r(o),u=n(10),c=r(u),h=n(1),f=r(h),d=n(9),l=n(5),p=function(){function t(){i(this,t),this.header={bpm:120,timeSignature:[4,4],PPQ:480},this.tracks=[]}return a(t,[{key:"load",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET";return new Promise(function(i,a){var o=new XMLHttpRequest;o.open(r,t),o.responseType="arraybuffer",o.addEventListener("load",function(){4===o.readyState&&200===o.status?i(e.decode(o.response)):a(o.status)}),o.addEventListener("error",a),o.send(n)})}},{key:"decode",value:function(t){var e=this;if(t instanceof ArrayBuffer){var n=new Uint8Array(t);t=String.fromCharCode.apply(null,n)}var r=(0,s["default"])(t);return this.header=(0,l.parseHeader)(r),this.tracks=[],r.tracks.forEach(function(t){var n=new d.Track;e.tracks.push(n);var r=0;t.forEach(function(t){r+=f["default"].ticksToSeconds(t.deltaTime,e.header),"meta"===t.type&&"trackName"===t.subtype?n.name=f["default"].cleanName(t.text):"noteOn"===t.subtype?n.noteOn(t.noteNumber,r,t.velocity/127):"noteOff"===t.subtype?n.noteOff(t.noteNumber,r):"controller"===t.subtype&&t.controllerType?n.cc(t.controllerType,r,t.value/127):"meta"===t.type&&"instrumentName"===t.subtype?n.instrument=t.text:"channel"===t.type&&"programChange"===t.subtype&&n.patch(t.programNumber)})}),this}},{key:"encode",value:function(){var t=this,e=new c["default"].File({ticks:this.header.PPQ});return this.tracks.forEach(function(n,r){var i=e.addTrack();i.setTempo(t.bpm),n.encode(i,t.header)}),e.toBytes()}},{key:"toArray",value:function(){for(var t=this.encode(),e=new Array(t.length),n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e}},{key:"track",value:function e(t){var e=new d.Track(t);return this.tracks.push(e),e}},{key:"get",value:function(t){return f["default"].isNumber(t)?this.tracks[t]:this.tracks.find(function(e){return e.name===t})}},{key:"slice",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.duration,r=new t;return r.header=this.header,r.tracks=this.tracks.map(function(t){return t.slice(e,n)}),r}},{key:"startTime",get:function(){var t=this.tracks.map(function(t){return t.startTime});return Math.min.apply(Math,t)}},{key:"bpm",get:function(){return this.header.bpm},set:function(t){var e=this.header.bpm;this.header.bpm=t;var n=e/t;this.tracks.forEach(function(t){return t.scale(n)})}},{key:"timeSignature",get:function(){return this.header.timeSignature},set:function(t){this.header.timeSignature=timeSignature}},{key:"duration",get:function(){var t=this.tracks.map(function(t){return t.duration});return Math.max.apply(Math,t)}}]),t}();e.Midi=p},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0}),e.Note=void 0;var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),s=r(o),u=function(){function t(e,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;if(i(this,t),this.midi,s["default"].isNumber(e))this.midi=e;else{if(!s["default"].isPitch(e))throw new Error("the midi value must either be in Pitch Notation (e.g. C#4) or a midi value");this.name=e}this.time=n,this.duration=r,this.velocity=a}return a(t,[{key:"match",value:function(t){return s["default"].isNumber(t)?this.midi===t:s["default"].isPitch(t)?this.name.toLowerCase()===t.toLowerCase():void 0}},{key:"toJSON",value:function(){return{name:this.name,midi:this.midi,time:this.time,velocity:this.velocity,duration:this.duration}}},{key:"name",get:function(){return s["default"].midiToPitch(this.midi)},set:function(t){this.midi=s["default"].pitchToMidi(t)}},{key:"noteOn",get:function(){return this.time},set:function(t){this.time=t}},{key:"noteOff",get:function(){return this.time+this.duration},set:function(t){this.duration=t-this.time}}]),t}();e.Note=u},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0}),e.Track=void 0;var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),a=n(3),o=n(4),s=n(6),u=n(8),c=n(2),h=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;r(this,t),this.name=e,this.notes=[],this.controlChanges={},this.instrumentNumber=n}return i(t,[{key:"note",value:function e(t,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,e=new u.Note(t,n,r,i);return(0,a.BinaryInsert)(this.notes,e),this}},{key:"noteOn",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,r=new u.Note(t,e,0,n);return(0,a.BinaryInsert)(this.notes,r),this}},{key:"noteOff",value:function(t,e){for(var n=0;n<this.notes.length;n++){var r=this.notes[n];if(r.match(t)&&0===r.duration){r.noteOff=e;break}}return this}},{key:"cc",value:function n(t,e,r){this.controlChanges.hasOwnProperty(t)||(this.controlChanges[t]=[]);var n=new o.Control(t,e,r);return(0,a.BinaryInsert)(this.controlChanges[t],n),this}},{key:"patch",value:function(t){return this.instrumentNumber=t,this}},{key:"scale",value:function(t){return this.notes.forEach(function(e){e.time*=t,e.duration*=t}),this}},{key:"slice",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.duration,r=Math.max(this.notes.findIndex(function(t){return t.time>=e}),0),i=this.notes.findIndex(function(t){return t.noteOff>=n})+1,a=new t(this.name);return a.notes=this.notes.slice(r,i),a.notes.forEach(function(t){return t.time=t.time-e}),a}},{key:"encode",value:function(t,e){function n(t){var e=Math.floor(r*t),n=Math.max(e-i,0);return i=e,n}var r=e.PPQ/(60/e.bpm),i=0,a=0;-1!==this.instrumentNumber&&t.instrument(a,this.instrumentNumber),(0,s.Merge)(this.noteOns,function(e){t.addNoteOn(a,e.name,n(e.time),Math.floor(127*e.velocity))},this.noteOffs,function(e){t.addNoteOff(a,e.name,n(e.time))})}},{key:"noteOns",get:function(){var t=[];return this.notes.forEach(function(e){t.push({time:e.noteOn,midi:e.midi,name:e.name,velocity:e.velocity})}),t}},{key:"noteOffs",get:function(){var t=[];return this.notes.forEach(function(e){t.push({time:e.noteOff,midi:e.midi,name:e.name})}),t}},{key:"length",get:function(){return this.notes.length}},{key:"startTime",get:function(){if(this.notes.length){var t=this.notes[0];return t.noteOn}return 0}},{key:"duration",get:function(){if(this.notes.length){var t=this.notes[this.notes.length-1];return t.noteOff}return 0}},{key:"instrument",get:function(){return c.instrumentByPatchID[this.instrumentNumber]},set:function(t){var e=c.instrumentByPatchID.indexOf(t);-1!==e&&(this.instrumentNumber=e)}},{key:"instrumentFamily",get:function(){return c.instrumentFamilyByID[Math.floor(this.instrumentNumber/8)]}}]),t}();e.Track=h},function(t,e,n){(function(t){var n={};!function(t){var e=t.DEFAULT_VOLUME=90,n=(t.DEFAULT_DURATION=128,t.DEFAULT_CHANNEL=0,{midi_letter_pitches:{a:21,b:23,c:12,d:14,e:16,f:17,g:19},midiPitchFromNote:function(t){var e=/([a-g])(#+|b+)?([0-9]+)$/i.exec(t),r=e[1].toLowerCase(),i=e[2]||"",a=parseInt(e[3],10);return 12*a+n.midi_letter_pitches[r]+("#"==i.substr(0,1)?1:-1)*i.length},ensureMidiPitch:function(t){return"number"!=typeof t&&/[^0-9]/.test(t)?n.midiPitchFromNote(t):parseInt(t,10)},midi_pitches_letter:{12:"c",13:"c#",14:"d",15:"d#",16:"e",17:"f",18:"f#",19:"g",20:"g#",21:"a",22:"a#",23:"b"},midi_flattened_notes:{"a#":"bb","c#":"db","d#":"eb","f#":"gb","g#":"ab"},noteFromMidiPitch:function(t,e){var r,i=0,a=t,e=e||!1;return t>23&&(i=Math.floor(t/12)-1,a=t-12*i),r=n.midi_pitches_letter[a],e&&r.indexOf("#")>0&&(r=n.midi_flattened_notes[r]),r+i},mpqnFromBpm:function(t){var e=Math.floor(6e7/t),n=[];do n.unshift(255&e),e>>=8;while(e);for(;n.length<3;)n.push(0);return n},bpmFromMpqn:function(t){var e=t;if("undefined"!=typeof t[0]){e=0;for(var n=0,r=t.length-1;r>=0;++n,--r)e|=t[n]<<r}return Math.floor(6e7/t)},codes2Str:function(t){return String.fromCharCode.apply(null,t)},str2Bytes:function(t,e){if(e)for(;t.length/2<e;)t="0"+t;for(var n=[],r=t.length-1;r>=0;r-=2){var i=0===r?t[r]:t[r-1]+t[r];n.unshift(parseInt(i,16))}return n},translateTickTime:function(t){for(var e=127&t;t>>=7;)e<<=8,e|=127&t|128;for(var n=[];;){if(n.push(255&e),!(128&e))break;e>>=8}return n}}),r=function(t){return this?void(!t||null===t.type&&void 0===t.type||null===t.channel&&void 0===t.channel||null===t.param1&&void 0===t.param1||(this.setTime(t.time),this.setType(t.type),this.setChannel(t.channel),this.setParam1(t.param1),this.setParam2(t.param2))):new r(t)};r.NOTE_OFF=128,r.NOTE_ON=144,r.AFTER_TOUCH=160,r.CONTROLLER=176,r.PROGRAM_CHANGE=192,r.CHANNEL_AFTERTOUCH=208,r.PITCH_BEND=224,r.prototype.setTime=function(t){this.time=n.translateTickTime(t||0)},r.prototype.setType=function(t){if(t<r.NOTE_OFF||t>r.PITCH_BEND)throw new Error("Trying to set an unknown event: "+t);this.type=t},r.prototype.setChannel=function(t){if(0>t||t>15)throw new Error("Channel is out of bounds.");this.channel=t},r.prototype.setParam1=function(t){this.param1=t},r.prototype.setParam2=function(t){this.param2=t},r.prototype.toBytes=function(){var t=[],e=this.type|15&this.channel;return t.push.apply(t,this.time),t.push(e),t.push(this.param1),void 0!==this.param2&&null!==this.param2&&t.push(this.param2),t};var i=function(t){if(!this)return new i(t);this.setTime(t.time),this.setType(t.type),this.setData(t.data)};i.SEQUENCE=0,i.TEXT=1,i.COPYRIGHT=2,i.TRACK_NAME=3,i.INSTRUMENT=4,i.LYRIC=5,i.MARKER=6,i.CUE_POINT=7,i.CHANNEL_PREFIX=32,i.END_OF_TRACK=47,i.TEMPO=81,i.SMPTE=84,i.TIME_SIG=88,i.KEY_SIG=89,i.SEQ_EVENT=127,i.prototype.setTime=function(t){this.time=n.translateTickTime(t||0)},i.prototype.setType=function(t){this.type=t},i.prototype.setData=function(t){this.data=t},i.prototype.toBytes=function(){if(!this.type)throw new Error("Type for meta-event not specified.");var t=[];if(t.push.apply(t,this.time),t.push(255,this.type),Array.isArray(this.data))t.push(this.data.length),t.push.apply(t,this.data);else if("number"==typeof this.data)t.push(1,this.data);else if(null!==this.data&&void 0!==this.data){t.push(this.data.length);var e=this.data.split("").map(function(t){return t.charCodeAt(0)});t.push.apply(t,e)}else t.push(0);return t};var a=function(t){if(!this)return new a(t);var e=t||{};this.events=e.events||[]};a.START_BYTES=[77,84,114,107],a.END_BYTES=[0,255,47,0],a.prototype.addEvent=function(t){return this.events.push(t),this},a.prototype.addNoteOn=a.prototype.noteOn=function(t,i,a,o){return this.events.push(new r({type:r.NOTE_ON,channel:t,param1:n.ensureMidiPitch(i),param2:o||e,time:a||0})),this},a.prototype.addNoteOff=a.prototype.noteOff=function(t,i,a,o){return this.events.push(new r({type:r.NOTE_OFF,channel:t,param1:n.ensureMidiPitch(i),param2:o||e,time:a||0})),this},a.prototype.addNote=a.prototype.note=function(t,e,n,r,i){return this.noteOn(t,e,r,i),n&&this.noteOff(t,e,n,i),this},a.prototype.addChord=a.prototype.chord=function(t,e,n,r){if(!Array.isArray(e)&&!e.length)throw new Error("Chord must be an array of pitches");return e.forEach(function(e){this.noteOn(t,e,0,r)},this),e.forEach(function(e,r){0===r?this.noteOff(t,e,n):this.noteOff(t,e)},this),this},a.prototype.setInstrument=a.prototype.instrument=function(t,e,n){return this.events.push(new r({type:r.PROGRAM_CHANGE,channel:t,param1:e,time:n||0})),this},a.prototype.setTempo=a.prototype.tempo=function(t,e){return this.events.push(new i({type:i.TEMPO,data:n.mpqnFromBpm(t),time:e||0})),this},a.prototype.toBytes=function(){var t=0,e=[],r=a.START_BYTES,i=a.END_BYTES,o=function(n){var r=n.toBytes();t+=r.length,e.push.apply(e,r)};this.events.forEach(o),t+=i.length;var s=n.str2Bytes(t.toString(16),4);return r.concat(s,e,i)};var o=function(t){if(!this)return new o(t);var e=t||{};if(e.ticks){if("number"!=typeof e.ticks)throw new Error("Ticks per beat must be a number!");if(e.ticks<=0||e.ticks>=32768||e.ticks%1!==0)throw new Error("Ticks per beat must be an integer between 1 and 32767!")}this.ticks=e.ticks||128,this.tracks=e.tracks||[]};o.HDR_CHUNKID="MThd",o.HDR_CHUNK_SIZE="\x00\x00\x00",o.HDR_TYPE0="\x00\x00",o.HDR_TYPE1="\x00",o.prototype.addTrack=function(t){return t?(this.tracks.push(t),this):(t=new a,this.tracks.push(t),t)},o.prototype.toBytes=function(){var t=this.tracks.length.toString(16),e=o.HDR_CHUNKID+o.HDR_CHUNK_SIZE;return e+=parseInt(t,16)>1?o.HDR_TYPE1:o.HDR_TYPE0,e+=n.codes2Str(n.str2Bytes(t,2)),e+=String.fromCharCode(this.ticks/256,this.ticks%256),this.tracks.forEach(function(t){e+=n.codes2Str(t.toBytes())}),e},t.Util=n,t.File=o,t.Track=a,t.Event=r,t.MetaEvent=i}(n),"undefined"!=typeof t&&null!==t?t.exports=n:"undefined"!=typeof e&&null!==e?e=n:this.Midi=n}).call(e,n(12)(t))},function(t,e){function n(t){function e(t){var e=t.read(4),n=t.readInt32();return{id:e,length:n,data:t.read(n)}}function n(t){var e={};e.deltaTime=t.readVarInt();var n=t.readInt8();if(240==(240&n)){if(255==n){e.type="meta";var r=t.readInt8(),a=t.readVarInt();switch(r){case 0:if(e.subtype="sequenceNumber",2!=a)throw"Expected length for sequenceNumber event is 2, got "+a;return e.number=t.readInt16(),e;case 1:return e.subtype="text",e.text=t.read(a),e;case 2:return e.subtype="copyrightNotice",e.text=t.read(a),e;case 3:return e.subtype="trackName",e.text=t.read(a),e;case 4:return e.subtype="instrumentName",e.text=t.read(a),e;case 5:return e.subtype="lyrics",e.text=t.read(a),e;case 6:return e.subtype="marker",e.text=t.read(a),e;case 7:return e.subtype="cuePoint",e.text=t.read(a),e;case 32:if(e.subtype="midiChannelPrefix",1!=a)throw"Expected length for midiChannelPrefix event is 1, got "+a;return e.channel=t.readInt8(),e;case 47:if(e.subtype="endOfTrack",0!=a)throw"Expected length for endOfTrack event is 0, got "+a;return e;case 81:if(e.subtype="setTempo",3!=a)throw"Expected length for setTempo event is 3, got "+a;return e.microsecondsPerBeat=(t.readInt8()<<16)+(t.readInt8()<<8)+t.readInt8(),e;case 84:if(e.subtype="smpteOffset",5!=a)throw"Expected length for smpteOffset event is 5, got "+a;var o=t.readInt8();return e.frameRate={0:24,32:25,64:29,96:30}[96&o],e.hour=31&o,e.min=t.readInt8(),e.sec=t.readInt8(),e.frame=t.readInt8(),e.subframe=t.readInt8(),e;case 88:if(e.subtype="timeSignature",4!=a)throw"Expected length for timeSignature event is 4, got "+a;return e.numerator=t.readInt8(),e.denominator=Math.pow(2,t.readInt8()),e.metronome=t.readInt8(),e.thirtyseconds=t.readInt8(),e;case 89:if(e.subtype="keySignature",2!=a)throw"Expected length for keySignature event is 2, got "+a;return e.key=t.readInt8(!0),e.scale=t.readInt8(),e;case 127:return e.subtype="sequencerSpecific",e.data=t.read(a),e;default:return e.subtype="unknown",e.data=t.read(a),e}return e.data=t.read(a),e}if(240==n){e.type="sysEx";var a=t.readVarInt();return e.data=t.read(a),e}if(247==n){e.type="dividedSysEx";var a=t.readVarInt();return e.data=t.read(a),e}throw"Unrecognised MIDI event type byte: "+n}var s;0==(128&n)?(s=n,n=i):(s=t.readInt8(),i=n);var u=n>>4;switch(e.channel=15&n,e.type="channel",u){case 8:return e.subtype="noteOff",e.noteNumber=s,e.velocity=t.readInt8(),e;case 9:return e.noteNumber=s,e.velocity=t.readInt8(),0==e.velocity?e.subtype="noteOff":e.subtype="noteOn",e;case 10:return e.subtype="noteAftertouch",e.noteNumber=s,e.amount=t.readInt8(),e;case 11:return e.subtype="controller",e.controllerType=s,e.value=t.readInt8(),e;case 12:return e.subtype="programChange",e.programNumber=s,e;case 13:return e.subtype="channelAftertouch",e.amount=s,e;case 14:return e.subtype="pitchBend",e.value=s+(t.readInt8()<<7),e;default:throw"Unrecognised MIDI event type: "+u}}var i;stream=r(t);var a=e(stream);if("MThd"!=a.id||6!=a.length)throw"Bad .mid file - header not found";var o=r(a.data),s=o.readInt16(),u=o.readInt16(),c=o.readInt16();if(32768&c)throw"Expressing time division in SMTPE frames is not supported yet";ticksPerBeat=c;for(var h={formatType:s,trackCount:u,ticksPerBeat:ticksPerBeat},f=[],d=0;d<h.trackCount;d++){f[d]=[];var l=e(stream);if("MTrk"!=l.id)throw"Unexpected chunk - expected MTrk, got "+l.id;for(var p=r(l.data);!p.eof();){var m=n(p);f[d].push(m)}}return{header:h,tracks:f}}function r(t){function e(e){var n=t.substr(s,e);return s+=e,n}function n(){var e=(t.charCodeAt(s)<<24)+(t.charCodeAt(s+1)<<16)+(t.charCodeAt(s+2)<<8)+t.charCodeAt(s+3);return s+=4,e}function r(){var e=(t.charCodeAt(s)<<8)+t.charCodeAt(s+1);return s+=2,e}function i(e){var n=t.charCodeAt(s);return e&&n>127&&(n-=256),s+=1,n}function a(){return s>=t.length}function o(){for(var t=0;;){var e=i();if(!(128&e))return t+e;t+=127&e,t<<=7}}var s=0;return{eof:a,read:e,readInt32:n,readInt16:r,readInt8:i,readVarInt:o}}t.exports=function(t){return n(t)}},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}}])});

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9ndWkuanMiLCJqcy9qb24tdHJvbWJvbmUuanMiLCJqcy9tYWluLmpzIiwianMvbWlkaS9taWRpLWNvbnRyb2xsZXIuanMiLCJqcy9waW5rLXRyb21ib25lL2NvbXBvbmVudHMvYXVkaW8tc3lzdGVtLmpzIiwianMvcGluay10cm9tYm9uZS9jb21wb25lbnRzL2dsb3R0aXMuanMiLCJqcy9waW5rLXRyb21ib25lL2NvbXBvbmVudHMvdHJhY3QtdWkuanMiLCJqcy9waW5rLXRyb21ib25lL2NvbXBvbmVudHMvdHJhY3QuanMiLCJqcy9waW5rLXRyb21ib25lL21hdGgtZXh0ZW5zaW9ucy5qcyIsImpzL3BpbmstdHJvbWJvbmUvbm9pc2UuanMiLCJqcy9waW5rLXRyb21ib25lL3BpbmstdHJvbWJvbmUuanMiLCJqcy90dHMvdHRzLWNvbnRyb2xsZXIuanMiLCJqcy91dGlscy9tb2RlbC1sb2FkZXIuanMiLCJqcy91dGlscy93ZWJnbC1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvbWlkaWNvbnZlcnQvYnVpbGQvTWlkaUNvbnZlcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sRzs7Ozs7Ozs2QkFFRyxHLEVBQUssUyxFQUFVOztBQUVoQixnQkFBRyxDQUFDLEtBQUosRUFBVztBQUNQLHdCQUFRLEdBQVIsQ0FBWSw0RUFBWjtBQUNBO0FBQ0g7O0FBRUQsaUJBQUssS0FBTCxHQUFhLElBQUksTUFBTSxHQUFWLENBQWM7QUFDdkIsdUJBQU8sY0FEZ0I7QUFFdkIsdUJBQU8sTUFGZ0I7QUFHdkIsc0JBQU0sU0FIaUI7QUFJdkIsdUJBQU8sS0FKZ0I7QUFLdkIseUJBQVMsT0FMYztBQU12Qix1QkFBTyxPQU5nQjtBQU92Qix5QkFBUztBQVBjLGFBQWQsQ0FBYjs7QUFVQSxpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUNoQixzQkFBTSxVQURV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UCxDQUFrQixNQUFNLENBQU4sQ0FBbEIsQ0FBVjtBQUNBLDRCQUFJLFdBQVcsT0FBTyxRQUFRLFlBQWYsSUFBK0IsVUFBOUMsRUFBMEQ7QUFDdEQ7QUFDQSxtQ0FBTyxJQUFQO0FBQ0g7QUFDSixxQkFORCxDQU1FLE9BQU0sQ0FBTixFQUFTLENBQUU7QUFDaEI7O0FBRUQ7QUFDQSx1QkFBTyxLQUFQO0FBQ0g7QUFDRDtBQUNBLG1CQUFPLEtBQVA7QUFDSDs7O3VDQUVrQztBQUFBLGdCQUFmLE9BQWUsdUVBQUwsSUFBSzs7QUFDL0IsZ0JBQUcsV0FBVyxJQUFkLEVBQW1CO0FBQ2Y7QUFHSDtBQUNELDZHQUVpQyxPQUZqQztBQUtIOzs7Ozs7UUFJSSxRLEdBQUEsUTs7O0FDekNUO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgR1VJIHtcblxuICAgIEluaXQoam9uLCBjb250YWluZXIpe1xuXG4gICAgICAgIGlmKCFndWlmeSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJHdWlmeSB3YXMgbm90IGZvdW5kISBBZGQgaXQgdG8geW91ciBwYWdlIHRvIGVuYWJsZSBhIEdVSSBmb3IgdGhpcyBwcm9ncmFtLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGFuZWwgPSBuZXcgZ3VpZnkuR1VJKHtcbiAgICAgICAgICAgIHRpdGxlOiBcIkpvbi1Ucm9tYm9uZVwiLCBcbiAgICAgICAgICAgIHRoZW1lOiBcImRhcmtcIiwgXG4gICAgICAgICAgICByb290OiBjb250YWluZXIsXG4gICAgICAgICAgICB3aWR0aDogXCI4MCVcIixcbiAgICAgICAgICAgIGJhck1vZGU6IFwiYWJvdmVcIixcbiAgICAgICAgICAgIGFsaWduOiBcInJpZ2h0XCIsXG4gICAgICAgICAgICBvcGFjaXR5OiBcIjAuOTVcIlxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBhbmVsLlJlZ2lzdGVyKHsgXG4gICAgICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsIGxhYmVsOiBcIk11dGVcIiwgXG4gICAgICAgICAgICBvYmplY3Q6IGpvbi50cm9tYm9uZSwgcHJvcGVydHk6IFwibXV0ZWRcIiwgXG4gICAgICAgICAgICBvbkNoYW5nZTogKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBqb24udHJvbWJvbmUuU2V0TXV0ZShkYXRhKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEpvbiBmb2xkZXJcbiAgICAgICAgdGhpcy5wYW5lbC5SZWdpc3Rlcih7IHR5cGU6IFwiZm9sZGVyXCIsIGxhYmVsOiBcIkpvblwiIH0pO1xuICAgICAgICB0aGlzLnBhbmVsLlJlZ2lzdGVyKFtcbiAgICAgICAgICAgIHsgdHlwZTogXCJjaGVja2JveFwiLCBsYWJlbDogXCJNb3ZlIEphd1wiLCBvYmplY3Q6IGpvbiwgcHJvcGVydHk6IFwibW92ZUphd1wiIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwicmFuZ2VcIiwgbGFiZWw6IFwiSmF3IFNwZWVkXCIsIG9iamVjdDogam9uLCBwcm9wZXJ0eTogXCJqYXdGbGFwU3BlZWRcIiwgbWluOiAwLCBtYXg6IDEwMCB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIkphdyBSYW5nZVwiLCBvYmplY3Q6IGpvbiwgcHJvcGVydHk6IFwiamF3T3Blbk9mZnNldFwiLCBtaW46IDAsIG1heDogMSB9LFxuICAgICAgICBdLCB7IGZvbGRlcjogXCJKb25cIiB9KTtcblxuICAgICAgICAvLyBWb2ljZSBmb2xkZXJcbiAgICAgICAgdGhpcy5wYW5lbC5SZWdpc3Rlcih7IHR5cGU6IFwiZm9sZGVyXCIsIGxhYmVsOiBcIlZvaWNlXCIgfSk7XG4gICAgICAgIHRoaXMucGFuZWwuUmVnaXN0ZXIoW1xuICAgICAgICAgICAgeyB0eXBlOiBcImNoZWNrYm94XCIsIGxhYmVsOiBcIldvYmJsZVwiLCBvYmplY3Q6IGpvbi50cm9tYm9uZSwgcHJvcGVydHk6IFwiYXV0b1dvYmJsZVwiIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwiY2hlY2tib3hcIiwgbGFiZWw6IFwiUGl0Y2ggVmFyaWFuY2VcIiwgb2JqZWN0OiBqb24udHJvbWJvbmUuR2xvdHRpcywgcHJvcGVydHk6IFwiYWRkUGl0Y2hWYXJpYW5jZVwiIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwiY2hlY2tib3hcIiwgbGFiZWw6IFwiVGVuc2VuZXNzIFZhcmlhbmNlXCIsIG9iamVjdDogam9uLnRyb21ib25lLkdsb3R0aXMsIHByb3BlcnR5OiBcImFkZFRlbnNlbmVzc1ZhcmlhbmNlXCIgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJUZW5zZW5lc3NcIiwgb2JqZWN0OiBqb24udHJvbWJvbmUuR2xvdHRpcywgcHJvcGVydHk6IFwiVUlUZW5zZW5lc3NcIiwgbWluOiAwLCBtYXg6IDEgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJWaWJyYXRvXCIsIG9iamVjdDogam9uLnRyb21ib25lLkdsb3R0aXMsIHByb3BlcnR5OiBcInZpYnJhdG9BbW91bnRcIiwgbWluOiAwLCBtYXg6IDAuNSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIkZyZXF1ZW5jeVwiLCBvYmplY3Q6IGpvbi50cm9tYm9uZS5HbG90dGlzLCBwcm9wZXJ0eTogXCJVSUZyZXF1ZW5jeVwiLCBtaW46IDEsIG1heDogMTAwMCwgc3RlcDogMSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIkxvdWRuZXNzXCIsIG9iamVjdDogam9uLnRyb21ib25lLkdsb3R0aXMsIHByb3BlcnR5OiBcImxvdWRuZXNzXCIsIG1pbjogMCwgbWF4OiAxIH0sXG4gICAgICAgIF0sIHsgZm9sZGVyOiBcIlZvaWNlXCIgfSk7XG5cbiAgICAgICAgLy8gVHJhY3QgZm9sZGVyXG4gICAgICAgIHRoaXMucGFuZWwuUmVnaXN0ZXIoeyB0eXBlOiBcImZvbGRlclwiLCBsYWJlbDogXCJUcmFjdFwiIH0pO1xuICAgICAgICB0aGlzLnBhbmVsLlJlZ2lzdGVyKFtcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJNb3ZlIFNwZWVkXCIsIG9iamVjdDogam9uLnRyb21ib25lLlRyYWN0LCBwcm9wZXJ0eTogXCJtb3ZlbWVudFNwZWVkXCIsIG1pbjogMSwgbWF4OiAzMCwgc3RlcDogMSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIlZlbHVtIFRhcmdldFwiLCBvYmplY3Q6IGpvbi50cm9tYm9uZS5UcmFjdCwgcHJvcGVydHk6IFwidmVsdW1UYXJnZXRcIiwgbWluOiAwLjAwMSwgbWF4OiAyIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwicmFuZ2VcIiwgbGFiZWw6IFwiVGFyZ2V0XCIsIG9iamVjdDogam9uLnRyb21ib25lLlRyYWN0VUksIHByb3BlcnR5OiBcInRhcmdldFwiLCBtaW46IDAuMDAxLCBtYXg6IDEgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJJbmRleFwiLCBvYmplY3Q6IGpvbi50cm9tYm9uZS5UcmFjdFVJLCBwcm9wZXJ0eTogXCJpbmRleFwiLCBtaW46IDAsIG1heDogNDMsIHN0ZXA6IDEgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJSYWRpdXNcIiwgb2JqZWN0OiBqb24udHJvbWJvbmUuVHJhY3RVSSwgcHJvcGVydHk6IFwicmFkaXVzXCIsIG1pbjogMCwgbWF4OiA1LCBzdGVwOiAxIH0sXG4gICAgICAgIF0sIHsgZm9sZGVyOiBcIlRyYWN0XCIgfSk7XG5cbiAgICAgICAgLy8gTUlESSBmb2xkZXJcbiAgICAgICAgdGhpcy5wYW5lbC5SZWdpc3Rlcih7IHR5cGU6IFwiZm9sZGVyXCIsIGxhYmVsOiBcIk1JRElcIiB9KTtcbiAgICAgICAgdGhpcy5wYW5lbC5SZWdpc3RlcihbXG4gICAgICAgICAgICB7IHR5cGU6IFwiZmlsZVwiLCBsYWJlbDogXCJNSURJIEZpbGVcIiwgZmlsZVJlYWRGdW5jOiBcInJlYWRBc0JpbmFyeVN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBqb24ubWlkaUNvbnRyb2xsZXIuTG9hZFNvbmdEaXJlY3QoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJ0aXRsZVwiLCBsYWJlbDogXCJDb250cm9sc1wiIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwiYnV0dG9uXCIsIGxhYmVsOiBcIlBsYXlcIiwgYWN0aW9uOiAoKSA9PiBqb24ubWlkaUNvbnRyb2xsZXIuUGxheVNvbmcoKSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcImJ1dHRvblwiLCBsYWJlbDogXCJTdG9wXCIsIGFjdGlvbjogKCkgPT4gam9uLm1pZGlDb250cm9sbGVyLlN0b3AoKSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcImJ1dHRvblwiLCBsYWJlbDogXCJSZXN0YXJ0XCIsIGFjdGlvbjogKCkgPT4gam9uLm1pZGlDb250cm9sbGVyLlJlc3RhcnQoKSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInRpdGxlXCIsIGxhYmVsOiBcIk9wdGlvbnNcIiB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIlRyYWNrXCIsIG9iamVjdDogam9uLm1pZGlDb250cm9sbGVyLCBwcm9wZXJ0eTogXCJjdXJyZW50VHJhY2tcIiwgbWluOiAxLCBtYXg6IDIwLCBzdGVwOiAxIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwicmFuZ2VcIiwgbGFiZWw6IFwiQmFzZSBGcmVxdWVuY3lcIiwgb2JqZWN0OiBqb24ubWlkaUNvbnRyb2xsZXIsIHByb3BlcnR5OiBcImJhc2VGcmVxXCIsIG1pbjogMSwgbWF4OiAyMDAwLCBzdGVwOiAxIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwiY2hlY2tib3hcIiwgbGFiZWw6IFwiRXh0cmVtZSBWaWJyYXRvXCIsIG9iamVjdDogam9uLCBwcm9wZXJ0eTogXCJmbGFwV2hpbGVTaW5naW5nXCIgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJjaGVja2JveFwiLCBsYWJlbDogXCJMZWdhdG9cIiwgb2JqZWN0OiBqb24sIHByb3BlcnR5OiBcImxlZ2F0b1wiIH0sXG4gICAgICAgIF0sIHsgZm9sZGVyOiBcIk1JRElcIiB9KTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgbGV0IGd1aSA9IG5ldyBHVUkoKTsiLCJpbXBvcnQgeyBNb2RlbExvYWRlciB9IGZyb20gXCIuL3V0aWxzL21vZGVsLWxvYWRlci5qc1wiO1xuaW1wb3J0IHsgUGlua1Ryb21ib25lIH0gZnJvbSBcIi4vcGluay10cm9tYm9uZS9waW5rLXRyb21ib25lLmpzXCI7XG5pbXBvcnQgeyBNaWRpQ29udHJvbGxlciB9IGZyb20gXCIuL21pZGkvbWlkaS1jb250cm9sbGVyLmpzXCI7XG5pbXBvcnQgeyBUVFNDb250cm9sbGVyIH0gZnJvbSBcIi4vdHRzL3R0cy1jb250cm9sbGVyLmpzXCI7XG5pbXBvcnQgeyBndWkgfSBmcm9tIFwiLi9ndWkuanNcIjtcblxuY2xhc3MgSm9uVHJvbWJvbmUge1xuXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyLCBmaW5pc2hlZENhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XG5cbiAgICAgICAgLy8gU2V0IHVwIHJlbmRlcmVyIGFuZCBlbWJlZCBpbiBjb250YWluZXJcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCB7IGFscGhhOiB0cnVlIH0gKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHRoaXMuY29udGFpbmVyLm9mZnNldFdpZHRoLCB0aGlzLmNvbnRhaW5lci5vZmZzZXRIZWlnaHQpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHgwMDAwMDAsIDApO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIC8vIFNldCB1cCBzY2VuZSBhbmQgdmlld1xuICAgICAgICBsZXQgYXNwZWN0ID0gdGhpcy5jb250YWluZXIub2Zmc2V0V2lkdGggLyB0aGlzLmNvbnRhaW5lci5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA0NSwgYXNwZWN0LCAwLjEsIDEwMCApO1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgLy8gRXhwb3J0IHNjZW5lIGZvciB0aHJlZSBqcyBpbnNwZWN0b3JcbiAgICAgICAgLy93aW5kb3cuc2NlbmUgPSB0aGlzLnNjZW5lO1xuXG4gICAgICAgIC8vIFNldCB1cCBjbG9jayBmb3IgdGltaW5nXG4gICAgICAgIHRoaXMuY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcblxuICAgICAgICBsZXQgc3RhcnREZWxheU1TID0gMTAwMDtcbiAgICAgICAgdGhpcy50cm9tYm9uZSA9IG5ldyBQaW5rVHJvbWJvbmUodGhpcyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICB0aGlzLnRyb21ib25lLlN0YXJ0QXVkaW8oKTtcbiAgICAgICAgICAgIC8vdGhpcy50cm9tYm9uZS5TZXRNdXRlKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5tb3ZlSmF3ID0gdHJ1ZTtcbiAgICAgICAgfSwgc3RhcnREZWxheU1TKTtcblxuICAgICAgICAvLyBNdXRlIGJ1dHRvbiBmb3IgdHJvbWJvbmVcbiAgICAgICAgLy8gbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIC8vIGJ1dHRvbi5pbm5lckhUTUwgPSBcIk11dGVcIjtcbiAgICAgICAgLy8gYnV0dG9uLnN0eWxlLmNzc1RleHQgPSBcInBvc2l0aW9uOiBhYnNvbHV0ZTsgZGlzcGxheTogYmxvY2s7IHRvcDogMDsgbGVmdDogMDtcIjtcbiAgICAgICAgLy8gdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICAgICAgLy8gYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIgKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAvLyAgICAgdGhpcy50cm9tYm9uZS5Ub2dnbGVNdXRlKCk7XG4gICAgICAgIC8vICAgICBidXR0b24uaW5uZXJIVE1MID0gdGhpcy50cm9tYm9uZS5tdXRlZCA/IFwiVW5tdXRlXCIgOiBcIk11dGVcIjtcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgdGhpcy5qYXdGbGFwU3BlZWQgPSAyMC4wO1xuICAgICAgICB0aGlzLmphd09wZW5PZmZzZXQgPSAwLjE5O1xuICAgICAgICB0aGlzLm1vdmVKYXcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sZWdhdG8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mbGFwV2hpbGVTaW5naW5nID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5taWRpQ29udHJvbGxlciA9IG5ldyBNaWRpQ29udHJvbGxlcih0aGlzKTtcblxuICAgICAgICAvLyBsZXQgdHRzID0gbmV3IFRUU0NvbnRyb2xsZXIoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codHRzLkdldEdyYXBoZW1lcyhcIlRlc3Rpbmcgb25lIHR3byB0aHJlZSAxIDIgM1wiKSk7XG5cbiAgICAgICAgdGhpcy5TZXRVcFRocmVlKCk7XG4gICAgICAgIHRoaXMuU2V0VXBTY2VuZSgpO1xuXG4gICAgICAgIC8vIFN0YXJ0IHRoZSB1cGRhdGUgbG9vcFxuICAgICAgICB0aGlzLk9uVXBkYXRlKCk7XG5cbiAgICAgICAgZ3VpLkluaXQodGhpcywgdGhpcy5jb250YWluZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB1cCBub24tc2NlbmUgY29uZmlnIGZvciBUaHJlZS5qc1xuICAgICAqL1xuICAgIFNldFVwVGhyZWUoKSB7XG4gICAgICAgIGlmKFRIUkVFLk9yYml0Q29udHJvbHMgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAvLyBBZGQgb3JiaXQgY29udHJvbHNcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyggdGhpcy5jYW1lcmEsIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCApO1xuICAgICAgICAgICAgdGhpcy5jb250cm9scy50YXJnZXQuc2V0KCAwLCAwLCAwICk7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTm8gVEhSRUUuT3JiaXRDb250cm9scyBkZXRlY3RlZC4gSW5jbHVkZSB0byBhbGxvdyBpbnRlcmFjdGlvbiB3aXRoIHRoZSBtb2RlbC5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQb3B1bGF0ZXMgYW5kIGNvbmZpZ3VyZXMgb2JqZWN0cyB3aXRoaW4gdGhlIHNjZW5lLlxuICAgICAqL1xuICAgIFNldFVwU2NlbmUoKSB7XG5cbiAgICAgICAgLy8gU2V0IGNhbWVyYSBwb3NpdGlvblxuICAgICAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi5zZXQoIDAsIDAsIDAuNSApO1xuXG4gICAgICAgIC8vIExpZ2h0c1xuICAgICAgICBsZXQgbGlnaHQxID0gbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCgweGZmZmZmZiwgMHg0NDQ0NDQsIDEuMCk7XG4gICAgICAgIGxpZ2h0MS5uYW1lID0gXCJIZW1pc3BoZXJlIExpZ2h0XCI7XG4gICAgICAgIGxpZ2h0MS5wb3NpdGlvbi5zZXQoMCwgMSwgMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGxpZ2h0MSk7XG5cbiAgICAgICAgbGV0IGxpZ2h0MiA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAxLjApO1xuICAgICAgICBsaWdodDIubmFtZSA9IFwiRGlyZWN0aW9uYWwgTGlnaHRcIjtcbiAgICAgICAgbGlnaHQyLnBvc2l0aW9uLnNldCgwLCAxLCAxKTtcbiAgICAgICAgbGlnaHQyLnRhcmdldC5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGxpZ2h0Mik7XG5cbiAgICAgICAgLy8gTG9hZCB0aGUgSm9uIG1vZGVsIGFuZCBwbGFjZSBpdCBpbiB0aGUgc2NlbmVcbiAgICAgICAgTW9kZWxMb2FkZXIuTG9hZEpTT04oXCIuLi9yZXNvdXJjZXMvam9uL3RocmVlL2pvbi5qc29uXCIsIChvYmplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuam9uID0gb2JqZWN0O1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoIHRoaXMuam9uICk7XG4gICAgICAgICAgICB0aGlzLmpvbi5yb3RhdGlvbi55ID0gKFRIUkVFLk1hdGguZGVnVG9SYWQoMTUpKTtcblxuICAgICAgICAgICAgdGhpcy5qYXcgPSB0aGlzLmpvbi5za2VsZXRvbi5ib25lcy5maW5kKChvYmopID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqLm5hbWUgPT0gXCJCb25lLjAwNlwiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZih0aGlzLmphdyl7XG4gICAgICAgICAgICAgICAgdGhpcy5qYXdTaHV0WiA9IHRoaXMuamF3LnBvc2l0aW9uLno7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgZXZlcnkgZnJhbWUuIENvbnRpbnVlcyBpbmRlZmluaXRlbHkgYWZ0ZXIgYmVpbmcgY2FsbGVkIG9uY2UuXG4gICAgICovXG4gICAgT25VcGRhdGUoKSB7XG4gICAgICAgIGxldCBkZWx0YVRpbWUgPSB0aGlzLmNsb2NrLmdldERlbHRhKCk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggdGhpcy5PblVwZGF0ZS5iaW5kKHRoaXMpICk7XG5cbiAgICAgICAgaWYodGhpcy5taWRpQ29udHJvbGxlci5wbGF5aW5nKXtcblxuICAgICAgICAgICAgdGhpcy5ub3RlcyA9IHRoaXMubWlkaUNvbnRyb2xsZXIuR2V0UGl0Y2hlcygpO1xuICAgICAgICAgICAgaWYodGhpcy5ub3RlcyAhPSB0aGlzLmxhc3ROb3Rlcyl7XG4gICAgICAgICAgICAgICAgLy8gRG8gdGhlIG5vdGVcbiAgICAgICAgICAgICAgICBpZih0aGlzLm5vdGVzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5ub3Rlcy5sZW5ndGggIT0gMCl7IFxuICAgICAgICAgICAgICAgICAgICAvLyBOb3RlIG9uXG4gICAgICAgICAgICAgICAgICAgIC8vIFBsYXkgZnJlcXVlbmN5XG4gICAgICAgICAgICAgICAgICAgIGxldCBub3RlID0gdGhpcy5ub3Rlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ub3Rlcy5sZW5ndGggPiAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cgKFwiY2hvcmRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGZyZXEgPSB0aGlzLm1pZGlDb250cm9sbGVyLk1JRElUb0ZyZXF1ZW5jeShub3RlLm1pZGkpO1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGZyZXEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyb21ib25lLkdsb3R0aXMuVUlGcmVxdWVuY3kgPSBmcmVxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyb21ib25lLkdsb3R0aXMubG91ZG5lc3MgPSBub3RlLnZlbG9jaXR5O1xuICAgICAgICAgICAgICAgICAgICAvLyBPcGVuIGphd1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmphdy5wb3NpdGlvbi56ID0gdGhpcy5qYXdTaHV0WiArIHRoaXMuamF3T3Blbk9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cm9tYm9uZS5UcmFjdFVJLlNldExpcHNDbG9zZWQoMCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90ZSBvZmZcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxlZ2F0bykgdGhpcy50cm9tYm9uZS5HbG90dGlzLmxvdWRuZXNzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2xvc2UgamF3XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuamF3LnBvc2l0aW9uLnogPSB0aGlzLmphd1NodXRaO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0VUkuU2V0TGlwc0Nsb3NlZCgxKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMubGFzdE5vdGVzID0gdGhpcy5ub3RlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5qYXcgJiYgdGhpcy5tb3ZlSmF3ICYmICghdGhpcy5taWRpQ29udHJvbGxlci5wbGF5aW5nIHx8IHRoaXMuZmxhcFdoaWxlU2luZ2luZykpe1xuICAgICAgICAgICAgbGV0IHRpbWUgPSB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7Ly8gJSA2MDtcblxuICAgICAgICAgICAgLy8gTW92ZSB0aGUgamF3XG4gICAgICAgICAgICBsZXQgcGVyY2VudCA9IChNYXRoLnNpbih0aW1lICogdGhpcy5qYXdGbGFwU3BlZWQpICsgMS4wKSAvIDIuMDtcbiAgICAgICAgICAgIHRoaXMuamF3LnBvc2l0aW9uLnogPSB0aGlzLmphd1NodXRaICsgKHBlcmNlbnQgKiB0aGlzLmphd09wZW5PZmZzZXQpO1xuXG4gICAgICAgICAgICAvLyBNYWtlIHRoZSBhdWRpbyBtYXRjaCB0aGUgamF3IHBvc2l0aW9uXG4gICAgICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0VUkuU2V0TGlwc0Nsb3NlZCgxLjAgLSBwZXJjZW50KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVuZGVyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgeyBKb25Ucm9tYm9uZSB9OyIsImltcG9ydCB7IERldGVjdG9yIH0gZnJvbSBcIi4vdXRpbHMvd2ViZ2wtZGV0ZWN0LmpzXCI7XG5pbXBvcnQgeyBKb25Ucm9tYm9uZSB9IGZyb20gXCIuL2pvbi10cm9tYm9uZS5qc1wiO1xuXG4vLyBPcHRpb25hbGx5IGJ1bmRsZSB0aHJlZS5qcyBhcyBwYXJ0IG9mIHRoZSBwcm9qZWN0XG4vL2ltcG9ydCBUSFJFRUxpYiBmcm9tIFwidGhyZWUtanNcIjtcbi8vdmFyIFRIUkVFID0gVEhSRUVMaWIoKTsgLy8gcmV0dXJuIFRIUkVFIEpTXG5cbmxldCBJbml0ID0gKCkgPT4ge1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvbi10cm9tYm9uZS1jb250YWluZXJcIik7XG5cbiAgICBpZiAoICFEZXRlY3Rvci5IYXNXZWJHTCgpICkge1xuICAgICAgICAvL2V4aXQoXCJXZWJHTCBpcyBub3Qgc3VwcG9ydGVkIG9uIHRoaXMgYnJvd3Nlci5cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiV2ViR0wgaXMgbm90IHN1cHBvcnRlZCBvbiB0aGlzIGJyb3dzZXIuXCIpO1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gRGV0ZWN0b3IuR2V0RXJyb3JIVE1MKCk7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwibm8td2ViZ2xcIik7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIGxldCBqb25Ucm9tYm9uZSA9IG5ldyBKb25Ucm9tYm9uZShjb250YWluZXIpO1xuICAgIH1cbn1cblxuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICBJbml0KCk7XG59IGVsc2Uge1xuICAgIHdpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIEluaXQoKTtcbiAgICB9XG59IiwibGV0IE1pZGlDb252ZXJ0ID0gcmVxdWlyZSgnbWlkaWNvbnZlcnQnKTtcblxuLyoqXG4gKiBTaW1wbGUgY2xhc3MgZm9yIE1JREkgcGxheWJhY2suXG4gKiBUaGUgcGFyYWRpZ20gaGVyZSdzIGEgYml0IHdlaXJkOyBpdCdzIHVwIHRvIGFuIGV4dGVybmFsXG4gKiBzb3VyY2UgdG8gYWN0dWFsbHkgcHJvZHVjZSBhdWRpby4gVGhpcyBjbGFzcyBqdXN0IG1hbmFnZXNcbiAqIGEgdGltZXIsIHdoaWNoIEdldFBpdGNoKCkgcmVhZHMgdG8gcHJvZHVjZSB0aGUgXCJjdXJyZW50XCJcbiAqIG5vdGUgaW5mb3JtYXRpb24uIFxuICogXG4gKiBBcyBhbiBleGFtcGxlIG9mIHVzYWdlLCBqb24tdHJvbWJvbmUgY2FsbHMgUGxheVNvbmcoKSB0b1xuICogYmVnaW4sIGFuZCB0aGVuIGV2ZXJ5IGZyYW1lIHVzZXMgR2V0UGl0Y2goKSB0byBmaWd1cmUgb3V0XG4gKiB3aGF0IHRoZSBjdXJyZW50IGZyZXF1ZW5jeSB0byBwcm9kdWNlIGlzLlxuICovXG5jbGFzcyBNaWRpQ29udHJvbGxlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG5cbiAgICAgICAgdGhpcy5taWRpID0gbnVsbDtcblxuICAgICAgICB0aGlzLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2sgPSA1O1xuXG4gICAgICAgIHRoaXMuYmFzZUZyZXEgPSA0NDA7IC8vMTEwIGlzIEE0XG5cbiAgICAgICAgdGhpcy5jbG9jayA9IG5ldyBUSFJFRS5DbG9jayhmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZHMgYW5kIHBhcnNlcyBhIE1JREkgZmlsZS5cbiAgICAgKi9cbiAgICBMb2FkU29uZyhwYXRoLCBjYWxsYmFjayl7XG4gICAgICAgIHRoaXMuU3RvcCgpO1xuICAgICAgICB0aGlzLm1pZGkgPSBudWxsO1xuICAgICAgICBNaWRpQ29udmVydC5sb2FkKHBhdGgsIChtaWRpKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1JREkgbG9hZGVkLlwiKTtcbiAgICAgICAgICAgIHRoaXMubWlkaSA9IG1pZGk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm1pZGkpO1xuICAgICAgICAgICAgaWYoY2FsbGJhY2spIGNhbGxiYWNrKG1pZGkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBMb2FkU29uZ0RpcmVjdChmaWxlKXtcbiAgICAgICAgdGhpcy5TdG9wKCk7XG4gICAgICAgIHRoaXMubWlkaSA9IE1pZGlDb252ZXJ0LnBhcnNlKGZpbGUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIk1JREkgbG9hZGVkLlwiKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5taWRpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBwaXRjaCBmb3IgdGhlIHNwZWNpZmllZCB0cmFjayBhdCB0aGUgY3VycmVudCB0aW1lIGluIHRoZSBzb25nLlxuICAgICAqL1xuICAgIEdldFBpdGNoKHRyYWNrSW5kZXggPSB0aGlzLmN1cnJlbnRUcmFjayl7XG4gICAgICAgIGxldCB0aW1lID0gdGhpcy5HZXRTb25nUHJvZ3Jlc3MoKTtcblxuICAgICAgICAvLyBDb25zdHJhaW4gdHJhY2sgc3BlY2lmaWVkIHRvIHZhbGlkIHJhbmdlXG4gICAgICAgIHRyYWNrSW5kZXggPSBNYXRoLm1pbih0cmFja0luZGV4LCB0aGlzLm1pZGkudHJhY2tzLmxlbmd0aCAtIDEpO1xuICAgICAgICB0cmFja0luZGV4ID0gTWF0aC5tYXgodHJhY2tJbmRleCwgMCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWlkaS50cmFja3NbdHJhY2tJbmRleF0ubm90ZXMuZmluZCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ubm90ZU9uIDw9IHRpbWUgJiYgdGltZSA8PSBpdGVtLm5vdGVPZmY7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIEdldFBpdGNoZXModHJhY2tJbmRleCA9IHRoaXMuY3VycmVudFRyYWNrKXtcbiAgICAgICAgbGV0IHRpbWUgPSB0aGlzLkdldFNvbmdQcm9ncmVzcygpO1xuXG4gICAgICAgIC8vIENvbnN0cmFpbiB0cmFjayBzcGVjaWZpZWQgdG8gdmFsaWQgcmFuZ2VcbiAgICAgICAgdHJhY2tJbmRleCA9IE1hdGgubWluKHRyYWNrSW5kZXgsIHRoaXMubWlkaS50cmFja3MubGVuZ3RoIC0gMSk7XG4gICAgICAgIHRyYWNrSW5kZXggPSBNYXRoLm1heCh0cmFja0luZGV4LCAwKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5taWRpLnRyYWNrc1t0cmFja0luZGV4XS5ub3Rlcy5maWx0ZXIoaXRlbSA9PiBcbiAgICAgICAgICAgIGl0ZW0ubm90ZU9uIDw9IHRpbWUgJiYgdGltZSA8PSBpdGVtLm5vdGVPZmYpO1xuICAgIH1cblxuICAgIFBsYXlTb25nKHRyYWNrID0gNSl7XG4gICAgICAgIGlmKHRoaXMucGxheWluZyl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBubyBzb25nIGlzIHNwZWNpZmllZCwgbG9hZCBhIHNvbmdcbiAgICAgICAgaWYoIXRoaXMubWlkaSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIE1JREkgaXMgbG9hZGVkLiBMb2FkaW5nIGFuIGV4YW1wbGUuLi5cIik7XG4gICAgICAgICAgICB0aGlzLkxvYWRTb25nKCcuLi9yZXNvdXJjZXMvbWlkaS91bi1vd2VuLXdhcy1oZXIubWlkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuUGxheVNvbmcoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVHVybiBvZmYgc29tZSBzdHVmZiBzbyB0aGUgc2luZ2luZyBraW5kIG9mIHNvdW5kcyBva2F5XG4gICAgICAgIHRoaXMuRW50ZXJTaW5nTW9kZSgpO1xuXG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrID0gdHJhY2s7XG4gICAgICAgIHRoaXMuY2xvY2suc3RhcnQoKTtcbiAgICAgICAgdGhpcy5wbGF5aW5nID0gdHJ1ZTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXliYWNrIHN0YXJ0ZWQuXCIpO1xuXG4gICAgfVxuXG4gICAgR2V0U29uZ1Byb2dyZXNzKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgZnJvbSBhIE1JREkgbm90ZSBjb2RlIHRvIGl0cyBjb3JyZXNwb25kaW5nIGZyZXF1ZW5jeS5cbiAgICAgKiBAcGFyYW0geyp9IG1pZGlDb2RlIFxuICAgICAqL1xuICAgIE1JRElUb0ZyZXF1ZW5jeShtaWRpQ29kZSl7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2VGcmVxICogTWF0aC5wb3coMiwgKG1pZGlDb2RlIC0gNjkpIC8gMTIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3RhcnRzIHRoZSBwbGF5YmFjay5cbiAgICAgKi9cbiAgICBSZXN0YXJ0KCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGxheWJhY2sgbW92ZWQgdG8gYmVnaW5uaW5nLlwiKTtcbiAgICAgICAgdGhpcy5jbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3BzIHBsYXliYWNrLlxuICAgICAqL1xuICAgIFN0b3AoKSB7XG4gICAgICAgIGlmKCF0aGlzLnBsYXlpbmcpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGxheWJhY2sgc3RvcHBlZC5cIik7XG4gICAgICAgIHRoaXMuY2xvY2suc3RvcCgpO1xuICAgICAgICB0aGlzLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5FeGl0U2luZ01vZGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHVwIHRoZSB0cm9tYm9uZSBmb3Igc2luZ2luZy5cbiAgICAgKi9cbiAgICBFbnRlclNpbmdNb2RlKCl7XG4gICAgICAgIGlmKHRoaXMuYmFja3VwX3NldHRpbmdzKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmFja3VwX3NldHRpbmdzID0ge307XG5cbiAgICAgICAgdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJhdXRvV29iYmxlXCJdID0gdGhpcy5jb250cm9sbGVyLnRyb21ib25lLmF1dG9Xb2JibGU7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5hdXRvV29iYmxlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJhZGRQaXRjaFZhcmlhbmNlXCJdID0gdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMuYWRkUGl0Y2hWYXJpYW5jZTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMuYWRkUGl0Y2hWYXJpYW5jZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuYmFja3VwX3NldHRpbmdzW1wiYWRkVGVuc2VuZXNzVmFyaWFuY2VcIl0gPSB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy5hZGRUZW5zZW5lc3NWYXJpYW5jZTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMuYWRkVGVuc2VuZXNzVmFyaWFuY2UgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcInZpYnJhdG9GcmVxdWVuY3lcIl0gPSB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy52aWJyYXRvRnJlcXVlbmN5O1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy52aWJyYXRvRnJlcXVlbmN5ID0gMDtcblxuICAgICAgICB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcImZyZXF1ZW5jeVwiXSA9IHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLlVJRnJlcXVlbmN5O1xuXG4gICAgICAgIHRoaXMuYmFja3VwX3NldHRpbmdzW1wibG91ZG5lc3NcIl0gPSB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy5sb3VkbmVzcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXN0b3JlcyB0aGUgdHJvbWJvbmUgdG8gdGhlIHN0YXRlIGl0IHdhcyBpbiBiZWZvcmUgc2luZ2luZy5cbiAgICAgKi9cbiAgICBFeGl0U2luZ01vZGUoKXtcbiAgICAgICAgaWYoIXRoaXMuYmFja3VwX3NldHRpbmdzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5hdXRvV29iYmxlID0gdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJhdXRvV29iYmxlXCJdO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy5hZGRQaXRjaFZhcmlhbmNlID0gdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJhZGRQaXRjaFZhcmlhbmNlXCJdO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy5hZGRUZW5zZW5lc3NWYXJpYW5jZSA9IHRoaXMuYmFja3VwX3NldHRpbmdzW1wiYWRkVGVuc2VuZXNzVmFyaWFuY2VcIl07XG4gICAgICAgIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLnZpYnJhdG9GcmVxdWVuY3kgPSB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcInZpYnJhdG9GcmVxdWVuY3lcIl07XG4gICAgICAgIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLlVJRnJlcXVlbmN5ID0gdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJmcmVxdWVuY3lcIl07XG4gICAgICAgIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLmxvdWRuZXNzID0gdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJsb3VkbmVzc1wiXTtcblxuICAgICAgICB0aGlzLmJhY2t1cF9zZXR0aW5ncyA9IG51bGw7XG4gICAgfVxuXG59XG5cbmV4cG9ydCB7IE1pZGlDb250cm9sbGVyIH07IiwiY2xhc3MgQXVkaW9TeXN0ZW0geyAgXG5cbiAgICBjb25zdHJ1Y3Rvcih0cm9tYm9uZSkge1xuICAgICAgICB0aGlzLnRyb21ib25lID0gdHJvbWJvbmU7XG5cbiAgICAgICAgdGhpcy5ibG9ja0xlbmd0aCA9IDUxMjtcbiAgICAgICAgdGhpcy5ibG9ja1RpbWUgPSAxO1xuICAgICAgICB0aGlzLnNvdW5kT24gPSBmYWxzZTtcblxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0fHx3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAgICAgICB0aGlzLmF1ZGlvQ29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG4gICAgICAgIHRoaXMudHJvbWJvbmUuc2FtcGxlUmF0ZSA9IHRoaXMuYXVkaW9Db250ZXh0LnNhbXBsZVJhdGU7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmJsb2NrVGltZSA9IHRoaXMuYmxvY2tMZW5ndGgvdGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlO1xuICAgIH1cbiAgICBcbiAgICBzdGFydFNvdW5kKCkge1xuICAgICAgICAvL3NjcmlwdFByb2Nlc3NvciBtYXkgbmVlZCBhIGR1bW15IGlucHV0IGNoYW5uZWwgb24gaU9TXG4gICAgICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlU2NyaXB0UHJvY2Vzc29yKHRoaXMuYmxvY2tMZW5ndGgsIDIsIDEpO1xuICAgICAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5jb25uZWN0KHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTsgXG4gICAgICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gdGhpcy5kb1NjcmlwdFByb2Nlc3Nvci5iaW5kKHRoaXMpO1xuICAgIFxuICAgICAgICB2YXIgd2hpdGVOb2lzZSA9IHRoaXMuY3JlYXRlV2hpdGVOb2lzZU5vZGUoMiAqIHRoaXMudHJvbWJvbmUuc2FtcGxlUmF0ZSk7IC8vIDIgc2Vjb25kcyBvZiBub2lzZVxuICAgICAgICBcbiAgICAgICAgdmFyIGFzcGlyYXRlRmlsdGVyID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgICAgIGFzcGlyYXRlRmlsdGVyLnR5cGUgPSBcImJhbmRwYXNzXCI7XG4gICAgICAgIGFzcGlyYXRlRmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IDUwMDtcbiAgICAgICAgYXNwaXJhdGVGaWx0ZXIuUS52YWx1ZSA9IDAuNTtcbiAgICAgICAgd2hpdGVOb2lzZS5jb25uZWN0KGFzcGlyYXRlRmlsdGVyKTsgIC8vIFVzZSB3aGl0ZSBub2lzZSBhcyBpbnB1dCBmb3IgZmlsdGVyXG4gICAgICAgIGFzcGlyYXRlRmlsdGVyLmNvbm5lY3QodGhpcy5zY3JpcHRQcm9jZXNzb3IpOyAgLy8gVXNlIHRoaXMgYXMgaW5wdXQgMCBmb3Igc2NyaXB0IHByb2Nlc3NvclxuICAgICAgICBcbiAgICAgICAgdmFyIGZyaWNhdGl2ZUZpbHRlciA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICAgICAgICBmcmljYXRpdmVGaWx0ZXIudHlwZSA9IFwiYmFuZHBhc3NcIjtcbiAgICAgICAgZnJpY2F0aXZlRmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IDEwMDA7XG4gICAgICAgIGZyaWNhdGl2ZUZpbHRlci5RLnZhbHVlID0gMC41O1xuICAgICAgICB3aGl0ZU5vaXNlLmNvbm5lY3QoZnJpY2F0aXZlRmlsdGVyKTsgIC8vIFVzZSB3aGl0ZSBub2lzZSBhcyBpbnB1dFxuICAgICAgICBmcmljYXRpdmVGaWx0ZXIuY29ubmVjdCh0aGlzLnNjcmlwdFByb2Nlc3Nvcik7ICAvLyBVc2UgdGhpcyBhcyBpbnB1dCAxIGZvciBzY3JpcHQgcHJvY2Vzc29yXG4gICAgICAgIFxuICAgICAgICB3aGl0ZU5vaXNlLnN0YXJ0KDApO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIGp1c3Qgd2hpdGUgbm9pc2UgKHRlc3QpXG4gICAgICAgIC8vIHZhciB3biA9IHRoaXMuY3JlYXRlV2hpdGVOb2lzZU5vZGUoMip0aGlzLnRyb21ib25lLnNhbXBsZVJhdGUpO1xuICAgICAgICAvLyB3bi5jb25uZWN0KHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgICAgLy8gd24uc3RhcnQoMCk7XG4gICAgfVxuICAgIFxuICAgIGNyZWF0ZVdoaXRlTm9pc2VOb2RlKGZyYW1lQ291bnQpIHtcbiAgICAgICAgdmFyIG15QXJyYXlCdWZmZXIgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgZnJhbWVDb3VudCwgdGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlKTtcblxuICAgICAgICB2YXIgbm93QnVmZmVyaW5nID0gbXlBcnJheUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcmFtZUNvdW50OyBpKyspIFxuICAgICAgICB7XG4gICAgICAgICAgICBub3dCdWZmZXJpbmdbaV0gPSBNYXRoLnJhbmRvbSgpOy8vIGdhdXNzaWFuKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc291cmNlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgIHNvdXJjZS5idWZmZXIgPSBteUFycmF5QnVmZmVyO1xuICAgICAgICBzb3VyY2UubG9vcCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGVOb2RlKCkge1xuICAgIC8vICAgICBsZXQgYnVmZmVyID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIGZyYW1lQ291bnQsIHRoaXMudHJvbWJvbmUuc2FtcGxlUmF0ZSk7XG5cbiAgICAgICAgXG5cbiAgICAvLyAgICAgdmFyIHNvdXJjZSA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgIC8vICAgICBzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuICAgIC8vICAgICBzb3VyY2UubG9vcCA9IHRydWU7XG5cbiAgICAvLyAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAvLyB9XG4gICAgXG4gICAgXG4gICAgZG9TY3JpcHRQcm9jZXNzb3IoZXZlbnQpIHtcbiAgICAgICAgdmFyIGlucHV0QXJyYXkxID0gZXZlbnQuaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7ICAvLyBHbG90dGlzIGlucHV0XG4gICAgICAgIHZhciBpbnB1dEFycmF5MiA9IGV2ZW50LmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDEpOyAgLy8gVHJhY3QgaW5wdXRcbiAgICAgICAgdmFyIG91dEFycmF5ID0gZXZlbnQub3V0cHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDApOyAgLy8gT3V0cHV0IChtb25vKVxuICAgICAgICBmb3IgKHZhciBqID0gMCwgTiA9IG91dEFycmF5Lmxlbmd0aDsgaiA8IE47IGorKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxhbWJkYTEgPSBqL047XG4gICAgICAgICAgICB2YXIgbGFtYmRhMiA9IChqKzAuNSkvTjtcbiAgICAgICAgICAgIHZhciBnbG90dGFsT3V0cHV0ID0gdGhpcy50cm9tYm9uZS5HbG90dGlzLnJ1blN0ZXAobGFtYmRhMSwgaW5wdXRBcnJheTFbal0pOyBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHZvY2FsT3V0cHV0ID0gMDtcbiAgICAgICAgICAgIC8vVHJhY3QgcnVucyBhdCB0d2ljZSB0aGUgc2FtcGxlIHJhdGUgXG4gICAgICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0LnJ1blN0ZXAoZ2xvdHRhbE91dHB1dCwgaW5wdXRBcnJheTJbal0sIGxhbWJkYTEpO1xuICAgICAgICAgICAgdm9jYWxPdXRwdXQgKz0gdGhpcy50cm9tYm9uZS5UcmFjdC5saXBPdXRwdXQgKyB0aGlzLnRyb21ib25lLlRyYWN0Lm5vc2VPdXRwdXQ7XG4gICAgICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0LnJ1blN0ZXAoZ2xvdHRhbE91dHB1dCwgaW5wdXRBcnJheTJbal0sIGxhbWJkYTIpO1xuICAgICAgICAgICAgdm9jYWxPdXRwdXQgKz0gdGhpcy50cm9tYm9uZS5UcmFjdC5saXBPdXRwdXQgKyB0aGlzLnRyb21ib25lLlRyYWN0Lm5vc2VPdXRwdXQ7XG4gICAgICAgICAgICBvdXRBcnJheVtqXSA9IHZvY2FsT3V0cHV0ICogMC4xMjU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYodGhpcy50cm9tYm9uZS5jb250cm9sbGVyLm5vdGVzICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAvLyAgICAgZm9yICh2YXIgbm90ZUluZGV4ID0gMTsgbm90ZUluZGV4IDwgdGhpcy50cm9tYm9uZS5jb250cm9sbGVyLm5vdGVzLmxlbmd0aDsgbm90ZUluZGV4Kyspe1xuICAgICAgICAvLyAgICAgICAgIGlmKG5vdGVJbmRleCA+IHRoaXMubnVtVm9pY2VzIC0gMSkgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgIGxldCBub3RlID0gdGhpcy50cm9tYm9uZS5jb250cm9sbGVyLm5vdGVzW25vdGVJbmRleF07XG4gICAgICAgIC8vICAgICAgICAgLy9jb25zb2xlLmxvZyhub3RlKTtcblxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMudHJvbWJvbmUuR2xvdHRpcy5maW5pc2hCbG9jaygpO1xuICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0LmZpbmlzaEJsb2NrKCk7XG4gICAgfVxuICAgIFxuICAgIG11dGUoKSB7XG4gICAgICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmRpc2Nvbm5lY3QoKTtcbiAgICB9XG4gICAgXG4gICAgdW5tdXRlKCkge1xuICAgICAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5jb25uZWN0KHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTsgXG4gICAgfVxuICAgIFxufVxuXG5leHBvcnRzLkF1ZGlvU3lzdGVtID0gQXVkaW9TeXN0ZW07IiwiaW1wb3J0IG5vaXNlIGZyb20gXCIuLi9ub2lzZS5qc1wiO1xuXG5jbGFzcyBHbG90dGlzIHtcblxuICAgIGNvbnN0cnVjdG9yKHRyb21ib25lKSB7XG4gICAgICAgIHRoaXMudHJvbWJvbmUgPSB0cm9tYm9uZTtcblxuICAgICAgICB0aGlzLnRpbWVJbldhdmVmb3JtID0gMDtcbiAgICAgICAgdGhpcy5vbGRGcmVxdWVuY3kgPSAxNDA7XG4gICAgICAgIHRoaXMubmV3RnJlcXVlbmN5ID0gMTQwO1xuICAgICAgICB0aGlzLlVJRnJlcXVlbmN5ID0gMTQwO1xuICAgICAgICB0aGlzLnNtb290aEZyZXF1ZW5jeSA9IDE0MDtcbiAgICAgICAgdGhpcy5vbGRUZW5zZW5lc3MgPSAwLjY7XG4gICAgICAgIHRoaXMubmV3VGVuc2VuZXNzID0gMC42O1xuICAgICAgICB0aGlzLlVJVGVuc2VuZXNzID0gMC42O1xuICAgICAgICB0aGlzLnRvdGFsVGltZSA9IDA7XG4gICAgICAgIHRoaXMudmlicmF0b0Ftb3VudCA9IDAuMDA1O1xuICAgICAgICB0aGlzLnZpYnJhdG9GcmVxdWVuY3kgPSA2O1xuICAgICAgICB0aGlzLmludGVuc2l0eSA9IDA7XG4gICAgICAgIHRoaXMubG91ZG5lc3MgPSAxO1xuICAgICAgICB0aGlzLmlzVG91Y2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRvdWNoID0gMDtcbiAgICAgICAgdGhpcy54ID0gMjQwO1xuICAgICAgICB0aGlzLnkgPSA1MzA7XG5cbiAgICAgICAgdGhpcy5rZXlib2FyZFRvcCA9IDUwMDtcbiAgICAgICAgdGhpcy5rZXlib2FyZExlZnQgPSAwO1xuICAgICAgICB0aGlzLmtleWJvYXJkV2lkdGggPSA2MDA7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRIZWlnaHQgPSAxMDA7XG4gICAgICAgIHRoaXMuc2VtaXRvbmVzID0gMjA7XG4gICAgICAgIHRoaXMubWFya3MgPSBbMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMF07XG4gICAgICAgIHRoaXMuYmFzZU5vdGUgPSA4Ny4zMDcxOyAvL0ZcblxuICAgICAgICB0aGlzLm91dHB1dDtcblxuICAgICAgICAvLy8gQWxsb3cgcGl0Y2ggdG8gd29iYmxlIG92ZXIgdGltZVxuICAgICAgICB0aGlzLmFkZFBpdGNoVmFyaWFuY2UgPSB0cnVlO1xuICAgICAgICAvLy8gQWxsb3cgdGVuc2VuZXNzIHRvIHdvYmJsZSBvdmVyIHRpbWVcbiAgICAgICAgdGhpcy5hZGRUZW5zZW5lc3NWYXJpYW5jZSA9IHRydWU7XG5cbiAgICB9XG4gICAgXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5zZXR1cFdhdmVmb3JtKDApO1xuICAgIH1cbiAgICBcbiAgICBoYW5kbGVUb3VjaGVzKCkge1xuICAgICAgICBpZiAodGhpcy50b3VjaCAhPSAwICYmICF0aGlzLnRvdWNoLmFsaXZlKSB0aGlzLnRvdWNoID0gMDtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnRvdWNoID09IDApXG4gICAgICAgIHsgICAgICAgIFxuICAgICAgICAgICAgZm9yICh2YXIgaj0wOyBqPFVJLnRvdWNoZXNXaXRoTW91c2UubGVuZ3RoOyBqKyspICBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgdG91Y2ggPSBVSS50b3VjaGVzV2l0aE1vdXNlW2pdO1xuICAgICAgICAgICAgICAgIGlmICghdG91Y2guYWxpdmUpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmICh0b3VjaC55PHRoaXMua2V5Ym9hcmRUb3ApIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHRoaXMudG91Y2ggPSB0b3VjaDtcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnRvdWNoICE9IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBsb2NhbF95ID0gdGhpcy50b3VjaC55IC0gIHRoaXMua2V5Ym9hcmRUb3AtMTA7XG4gICAgICAgICAgICB2YXIgbG9jYWxfeCA9IHRoaXMudG91Y2gueCAtIHRoaXMua2V5Ym9hcmRMZWZ0O1xuICAgICAgICAgICAgbG9jYWxfeSA9IE1hdGguY2xhbXAobG9jYWxfeSwgMCwgdGhpcy5rZXlib2FyZEhlaWdodC0yNik7XG4gICAgICAgICAgICB2YXIgc2VtaXRvbmUgPSB0aGlzLnNlbWl0b25lcyAqIGxvY2FsX3ggLyB0aGlzLmtleWJvYXJkV2lkdGggKyAwLjU7XG4gICAgICAgICAgICBHbG90dGlzLlVJRnJlcXVlbmN5ID0gdGhpcy5iYXNlTm90ZSAqIE1hdGgucG93KDIsIHNlbWl0b25lLzEyKTtcbiAgICAgICAgICAgIGlmIChHbG90dGlzLmludGVuc2l0eSA9PSAwKSBHbG90dGlzLnNtb290aEZyZXF1ZW5jeSA9IEdsb3R0aXMuVUlGcmVxdWVuY3k7XG4gICAgICAgICAgICAvL0dsb3R0aXMuVUlSZCA9IDMqbG9jYWxfeSAvICh0aGlzLmtleWJvYXJkSGVpZ2h0LTIwKTtcbiAgICAgICAgICAgIHZhciB0ID0gTWF0aC5jbGFtcCgxLWxvY2FsX3kgLyAodGhpcy5rZXlib2FyZEhlaWdodC0yOCksIDAsIDEpO1xuICAgICAgICAgICAgR2xvdHRpcy5VSVRlbnNlbmVzcyA9IDEtTWF0aC5jb3ModCpNYXRoLlBJKjAuNSk7XG4gICAgICAgICAgICBHbG90dGlzLmxvdWRuZXNzID0gTWF0aC5wb3coR2xvdHRpcy5VSVRlbnNlbmVzcywgMC4yNSk7XG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnRvdWNoLng7XG4gICAgICAgICAgICB0aGlzLnkgPSBsb2NhbF95ICsgdGhpcy5rZXlib2FyZFRvcCsxMDtcbiAgICAgICAgfVxuICAgICAgICBHbG90dGlzLmlzVG91Y2hlZCA9ICh0aGlzLnRvdWNoICE9IDApO1xuICAgIH1cbiAgICAgICAgXG4gICAgcnVuU3RlcChsYW1iZGEsIG5vaXNlU291cmNlKSB7XG4gICAgICAgIHZhciB0aW1lU3RlcCA9IDEuMCAvIHRoaXMudHJvbWJvbmUuc2FtcGxlUmF0ZTtcbiAgICAgICAgdGhpcy50aW1lSW5XYXZlZm9ybSArPSB0aW1lU3RlcDtcbiAgICAgICAgdGhpcy50b3RhbFRpbWUgKz0gdGltZVN0ZXA7XG4gICAgICAgIGlmICh0aGlzLnRpbWVJbldhdmVmb3JtID4gdGhpcy53YXZlZm9ybUxlbmd0aCkgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMudGltZUluV2F2ZWZvcm0gLT0gdGhpcy53YXZlZm9ybUxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBXYXZlZm9ybShsYW1iZGEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvdXQgPSB0aGlzLm5vcm1hbGl6ZWRMRldhdmVmb3JtKHRoaXMudGltZUluV2F2ZWZvcm0vdGhpcy53YXZlZm9ybUxlbmd0aCk7XG4gICAgICAgIHZhciBhc3BpcmF0aW9uID0gdGhpcy5pbnRlbnNpdHkqKDEuMC1NYXRoLnNxcnQodGhpcy5VSVRlbnNlbmVzcykpKnRoaXMuZ2V0Tm9pc2VNb2R1bGF0b3IoKSpub2lzZVNvdXJjZTtcbiAgICAgICAgYXNwaXJhdGlvbiAqPSAwLjIgKyAwLjAyICogbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUgKiAxLjk5KTtcbiAgICAgICAgb3V0ICs9IGFzcGlyYXRpb247XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIFxuICAgIGdldE5vaXNlTW9kdWxhdG9yKCkge1xuICAgICAgICB2YXIgdm9pY2VkID0gMC4xKzAuMipNYXRoLm1heCgwLE1hdGguc2luKE1hdGguUEkqMip0aGlzLnRpbWVJbldhdmVmb3JtL3RoaXMud2F2ZWZvcm1MZW5ndGgpKTtcbiAgICAgICAgLy9yZXR1cm4gMC4zO1xuICAgICAgICByZXR1cm4gdGhpcy5VSVRlbnNlbmVzcyogdGhpcy5pbnRlbnNpdHkgKiB2b2ljZWQgKyAoMS10aGlzLlVJVGVuc2VuZXNzKiB0aGlzLmludGVuc2l0eSApICogMC4zO1xuICAgIH1cbiAgICBcbiAgICBmaW5pc2hCbG9jaygpIHtcbiAgICAgICAgdmFyIHZpYnJhdG8gPSAwO1xuICAgICAgICBpZiAodGhpcy5hZGRQaXRjaFZhcmlhbmNlKSB7XG4gICAgICAgICAgICAvLyBBZGQgc21hbGwgaW1wZXJmZWN0aW9ucyB0byB0aGUgdm9jYWwgb3V0cHV0XG4gICAgICAgICAgICB2aWJyYXRvICs9IHRoaXMudmlicmF0b0Ftb3VudCAqIE1hdGguc2luKDIqTWF0aC5QSSAqIHRoaXMudG90YWxUaW1lICp0aGlzLnZpYnJhdG9GcmVxdWVuY3kpOyAgICAgICAgICBcbiAgICAgICAgICAgIHZpYnJhdG8gKz0gMC4wMiAqIG5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lICogNC4wNyk7XG4gICAgICAgICAgICB2aWJyYXRvICs9IDAuMDQgKiBub2lzZS5zaW1wbGV4MSh0aGlzLnRvdGFsVGltZSAqIDIuMTUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy50cm9tYm9uZS5hdXRvV29iYmxlKVxuICAgICAgICB7XG4gICAgICAgICAgICB2aWJyYXRvICs9IDAuMiAqIG5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lICogMC45OCk7XG4gICAgICAgICAgICB2aWJyYXRvICs9IDAuNCAqIG5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lICogMC41KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLlVJRnJlcXVlbmN5PnRoaXMuc21vb3RoRnJlcXVlbmN5KSBcbiAgICAgICAgICAgIHRoaXMuc21vb3RoRnJlcXVlbmN5ID0gTWF0aC5taW4odGhpcy5zbW9vdGhGcmVxdWVuY3kgKiAxLjEsIHRoaXMuVUlGcmVxdWVuY3kpO1xuICAgICAgICBpZiAodGhpcy5VSUZyZXF1ZW5jeTx0aGlzLnNtb290aEZyZXF1ZW5jeSkgXG4gICAgICAgICAgICB0aGlzLnNtb290aEZyZXF1ZW5jeSA9IE1hdGgubWF4KHRoaXMuc21vb3RoRnJlcXVlbmN5IC8gMS4xLCB0aGlzLlVJRnJlcXVlbmN5KTtcbiAgICAgICAgdGhpcy5vbGRGcmVxdWVuY3kgPSB0aGlzLm5ld0ZyZXF1ZW5jeTtcbiAgICAgICAgdGhpcy5uZXdGcmVxdWVuY3kgPSB0aGlzLnNtb290aEZyZXF1ZW5jeSAqICgxK3ZpYnJhdG8pO1xuICAgICAgICB0aGlzLm9sZFRlbnNlbmVzcyA9IHRoaXMubmV3VGVuc2VuZXNzO1xuXG4gICAgICAgIGlmICh0aGlzLmFkZFRlbnNlbmVzc1ZhcmlhbmNlKVxuICAgICAgICAgICAgdGhpcy5uZXdUZW5zZW5lc3MgPSB0aGlzLlVJVGVuc2VuZXNzICsgMC4xKm5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lKjAuNDYpKzAuMDUqbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUqMC4zNik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMubmV3VGVuc2VuZXNzID0gdGhpcy5VSVRlbnNlbmVzcztcblxuICAgICAgICBpZiAoIXRoaXMuaXNUb3VjaGVkICYmIHRoaXMudHJvbWJvbmUuYWx3YXlzVm9pY2UpIHRoaXMubmV3VGVuc2VuZXNzICs9ICgzLXRoaXMuVUlUZW5zZW5lc3MpKigxLXRoaXMuaW50ZW5zaXR5KTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmlzVG91Y2hlZCB8fCB0aGlzLnRyb21ib25lLmFsd2F5c1ZvaWNlKVxuICAgICAgICAgICAgdGhpcy5pbnRlbnNpdHkgKz0gMC4xMztcbiAgICAgICAgdGhpcy5pbnRlbnNpdHkgPSBNYXRoLmNsYW1wKHRoaXMuaW50ZW5zaXR5LCAwLCAxKTtcbiAgICB9XG4gICAgXG4gICAgc2V0dXBXYXZlZm9ybShsYW1iZGEpIHtcbiAgICAgICAgdGhpcy5mcmVxdWVuY3kgPSB0aGlzLm9sZEZyZXF1ZW5jeSooMS1sYW1iZGEpICsgdGhpcy5uZXdGcmVxdWVuY3kqbGFtYmRhO1xuICAgICAgICB2YXIgdGVuc2VuZXNzID0gdGhpcy5vbGRUZW5zZW5lc3MqKDEtbGFtYmRhKSArIHRoaXMubmV3VGVuc2VuZXNzKmxhbWJkYTtcbiAgICAgICAgdGhpcy5SZCA9IDMqKDEtdGVuc2VuZXNzKTtcbiAgICAgICAgdGhpcy53YXZlZm9ybUxlbmd0aCA9IDEuMC90aGlzLmZyZXF1ZW5jeTtcbiAgICAgICAgXG4gICAgICAgIHZhciBSZCA9IHRoaXMuUmQ7XG4gICAgICAgIGlmIChSZDwwLjUpIFJkID0gMC41O1xuICAgICAgICBpZiAoUmQ+Mi43KSBSZCA9IDIuNztcbiAgICAgICAgLy8gbm9ybWFsaXplZCB0byB0aW1lID0gMSwgRWUgPSAxXG4gICAgICAgIHZhciBSYSA9IC0wLjAxICsgMC4wNDgqUmQ7XG4gICAgICAgIHZhciBSayA9IDAuMjI0ICsgMC4xMTgqUmQ7XG4gICAgICAgIHZhciBSZyA9IChSay80KSooMC41KzEuMipSaykvKDAuMTEqUmQtUmEqKDAuNSsxLjIqUmspKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBUYSA9IFJhO1xuICAgICAgICB2YXIgVHAgPSAxIC8gKDIqUmcpO1xuICAgICAgICB2YXIgVGUgPSBUcCArIFRwKlJrOyAvL1xuICAgICAgICBcbiAgICAgICAgdmFyIGVwc2lsb24gPSAxL1RhO1xuICAgICAgICB2YXIgc2hpZnQgPSBNYXRoLmV4cCgtZXBzaWxvbiAqICgxLVRlKSk7XG4gICAgICAgIHZhciBEZWx0YSA9IDEgLSBzaGlmdDsgLy9kaXZpZGUgYnkgdGhpcyB0byBzY2FsZSBSSFNcbiAgICAgICAgICAgXG4gICAgICAgIHZhciBSSFNJbnRlZ3JhbCA9ICgxL2Vwc2lsb24pKihzaGlmdCAtIDEpICsgKDEtVGUpKnNoaWZ0O1xuICAgICAgICBSSFNJbnRlZ3JhbCA9IFJIU0ludGVncmFsL0RlbHRhO1xuICAgICAgICBcbiAgICAgICAgdmFyIHRvdGFsTG93ZXJJbnRlZ3JhbCA9IC0gKFRlLVRwKS8yICsgUkhTSW50ZWdyYWw7XG4gICAgICAgIHZhciB0b3RhbFVwcGVySW50ZWdyYWwgPSAtdG90YWxMb3dlckludGVncmFsO1xuICAgICAgICBcbiAgICAgICAgdmFyIG9tZWdhID0gTWF0aC5QSS9UcDtcbiAgICAgICAgdmFyIHMgPSBNYXRoLnNpbihvbWVnYSpUZSk7XG4gICAgICAgIHZhciB5ID0gLU1hdGguUEkqcyp0b3RhbFVwcGVySW50ZWdyYWwgLyAoVHAqMik7XG4gICAgICAgIHZhciB6ID0gTWF0aC5sb2coeSk7XG4gICAgICAgIHZhciBhbHBoYSA9IHovKFRwLzIgLSBUZSk7XG4gICAgICAgIHZhciBFMCA9IC0xIC8gKHMqTWF0aC5leHAoYWxwaGEqVGUpKTtcbiAgICAgICAgdGhpcy5hbHBoYSA9IGFscGhhO1xuICAgICAgICB0aGlzLkUwID0gRTA7XG4gICAgICAgIHRoaXMuZXBzaWxvbiA9IGVwc2lsb247XG4gICAgICAgIHRoaXMuc2hpZnQgPSBzaGlmdDtcbiAgICAgICAgdGhpcy5EZWx0YSA9IERlbHRhO1xuICAgICAgICB0aGlzLlRlPVRlO1xuICAgICAgICB0aGlzLm9tZWdhID0gb21lZ2E7XG4gICAgfVxuICAgIFxuIFxuICAgIG5vcm1hbGl6ZWRMRldhdmVmb3JtKHQpIHsgICAgIFxuICAgICAgICBpZiAodD50aGlzLlRlKSB0aGlzLm91dHB1dCA9ICgtTWF0aC5leHAoLXRoaXMuZXBzaWxvbiAqICh0LXRoaXMuVGUpKSArIHRoaXMuc2hpZnQpL3RoaXMuRGVsdGE7XG4gICAgICAgIGVsc2UgdGhpcy5vdXRwdXQgPSB0aGlzLkUwICogTWF0aC5leHAodGhpcy5hbHBoYSp0KSAqIE1hdGguc2luKHRoaXMub21lZ2EgKiB0KTtcbiAgICAgXG4gICAgICAgIHJldHVybiB0aGlzLm91dHB1dCAqIHRoaXMuaW50ZW5zaXR5ICogdGhpcy5sb3VkbmVzcztcbiAgICB9XG59XG5cbmV4cG9ydCB7IEdsb3R0aXMgfTsiLCJjbGFzcyBUcmFjdFVJXG57XG5cbiAgICBjb25zdHJ1Y3Rvcih0cm9tYm9uZSkge1xuICAgICAgICB0aGlzLnRyb21ib25lID0gdHJvbWJvbmU7XG4gICAgICAgIFxuICAgICAgICB0aGlzLm9yaWdpblggPSAzNDA7IFxuICAgICAgICB0aGlzLm9yaWdpblkgPSA0NDk7IFxuICAgICAgICB0aGlzLnJhZGl1cyA9IDI5ODsgXG4gICAgICAgIHRoaXMuc2NhbGUgPSA2MDtcbiAgICAgICAgdGhpcy50b25ndWVJbmRleCA9IDEyLjk7XG4gICAgICAgIHRoaXMudG9uZ3VlRGlhbWV0ZXIgPSAyLjQzO1xuICAgICAgICB0aGlzLmlubmVyVG9uZ3VlQ29udHJvbFJhZGl1cyA9IDIuMDU7XG4gICAgICAgIHRoaXMub3V0ZXJUb25ndWVDb250cm9sUmFkaXVzID0gMy41O1xuICAgICAgICB0aGlzLnRvbmd1ZVRvdWNoID0gMDtcbiAgICAgICAgdGhpcy5hbmdsZVNjYWxlID0gMC42NDtcbiAgICAgICAgdGhpcy5hbmdsZU9mZnNldCA9IC0wLjI0O1xuICAgICAgICB0aGlzLm5vc2VPZmZzZXQgPSAwLjg7XG4gICAgICAgIHRoaXMuZ3JpZE9mZnNldCA9IDEuNztcblxuICAgICAgICAvLy8gRmluYWwgb3Blbm5lc3Mgb2YgdGhlIG1vdXRoIChjbG9zZXIgdG8gMCBpcyBtb3JlIGNsb3NlZClcbiAgICAgICAgdGhpcy50YXJnZXQgPSAwLjE7XG4gICAgICAgIC8vLyBJbmRleCBpbiB0aGUgdGhyb2F0IGFycmF5IHRvIG1vdmUgdG8gdGFyZ2V0XG4gICAgICAgIHRoaXMuaW5kZXggPSA0MjtcbiAgICAgICAgLy8vIE51bWJlciBvZiB0aHJvYXQgc2VnbWVudHMgdG8gY2xvc2UgYXJvdW5kIHRoZSBpbmRleFxuICAgICAgICB0aGlzLnJhZGl1cyA9IDA7XG4gICAgfVxuICAgIFxuICAgIGluaXQoKSB7XG4gICAgICAgIGxldCBUcmFjdCA9IHRoaXMudHJvbWJvbmUuVHJhY3Q7XG5cbiAgICAgICAgdGhpcy5zZXRSZXN0RGlhbWV0ZXIoKTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPFRyYWN0Lm47IGkrKykgXG4gICAgICAgIHtcbiAgICAgICAgICAgIFRyYWN0LmRpYW1ldGVyW2ldID0gVHJhY3QudGFyZ2V0RGlhbWV0ZXJbaV0gPSBUcmFjdC5yZXN0RGlhbWV0ZXJbaV07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRvbmd1ZUxvd2VySW5kZXhCb3VuZCA9IFRyYWN0LmJsYWRlU3RhcnQrMjtcbiAgICAgICAgdGhpcy50b25ndWVVcHBlckluZGV4Qm91bmQgPSBUcmFjdC50aXBTdGFydC0zO1xuICAgICAgICB0aGlzLnRvbmd1ZUluZGV4Q2VudHJlID0gMC41Kih0aGlzLnRvbmd1ZUxvd2VySW5kZXhCb3VuZCt0aGlzLnRvbmd1ZVVwcGVySW5kZXhCb3VuZCk7XG4gICAgfVxuICAgICAgICBcbiAgICBnZXRJbmRleCh4LHkpIHtcbiAgICAgICAgbGV0IFRyYWN0ID0gdGhpcy50cm9tYm9uZS5UcmFjdDtcblxuICAgICAgICB2YXIgeHggPSB4LXRoaXMub3JpZ2luWDsgdmFyIHl5ID0geS10aGlzLm9yaWdpblk7XG4gICAgICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIoeXksIHh4KTtcbiAgICAgICAgd2hpbGUgKGFuZ2xlPiAwKSBhbmdsZSAtPSAyKk1hdGguUEk7XG4gICAgICAgIHJldHVybiAoTWF0aC5QSSArIGFuZ2xlIC0gdGhpcy5hbmdsZU9mZnNldCkqKFRyYWN0LmxpcFN0YXJ0LTEpIC8gKHRoaXMuYW5nbGVTY2FsZSpNYXRoLlBJKTtcbiAgICB9XG5cbiAgICBnZXREaWFtZXRlcih4LHkpIHtcbiAgICAgICAgdmFyIHh4ID0geC10aGlzLm9yaWdpblg7IHZhciB5eSA9IHktdGhpcy5vcmlnaW5ZO1xuICAgICAgICByZXR1cm4gKHRoaXMucmFkaXVzLU1hdGguc3FydCh4eCp4eCArIHl5Knl5KSkvdGhpcy5zY2FsZTtcbiAgICB9XG4gICAgXG4gICAgc2V0UmVzdERpYW1ldGVyKCkge1xuICAgICAgICBsZXQgVHJhY3QgPSB0aGlzLnRyb21ib25lLlRyYWN0O1xuXG4gICAgICAgIGZvciAodmFyIGk9VHJhY3QuYmxhZGVTdGFydDsgaTxUcmFjdC5saXBTdGFydDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdCA9IDEuMSAqIE1hdGguUEkqKHRoaXMudG9uZ3VlSW5kZXggLSBpKS8oVHJhY3QudGlwU3RhcnQgLSBUcmFjdC5ibGFkZVN0YXJ0KTtcbiAgICAgICAgICAgIHZhciBmaXhlZFRvbmd1ZURpYW1ldGVyID0gMisodGhpcy50b25ndWVEaWFtZXRlci0yKS8xLjU7XG4gICAgICAgICAgICB2YXIgY3VydmUgPSAoMS41LWZpeGVkVG9uZ3VlRGlhbWV0ZXIrdGhpcy5ncmlkT2Zmc2V0KSpNYXRoLmNvcyh0KTtcbiAgICAgICAgICAgIGlmIChpID09IFRyYWN0LmJsYWRlU3RhcnQtMiB8fCBpID09IFRyYWN0LmxpcFN0YXJ0LTEpIGN1cnZlICo9IDAuODtcbiAgICAgICAgICAgIGlmIChpID09IFRyYWN0LmJsYWRlU3RhcnQgfHwgaSA9PSBUcmFjdC5saXBTdGFydC0yKSBjdXJ2ZSAqPSAwLjk0OyAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgVHJhY3QucmVzdERpYW1ldGVyW2ldID0gMS41IC0gY3VydmU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBsaXBzIG9mIHRoZSBtb2RlbGVkIHRyYWN0IHRvIGJlIGNsb3NlZCBieSB0aGUgc3BlY2lmaWVkIGFtb3VudC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJvZ3Jlc3MgUGVyY2VudGFnZSBjbG9zZWQgKG51bWJlciBiZXR3ZWVuIDAgYW5kIDEpXG4gICAgICovXG4gICAgU2V0TGlwc0Nsb3NlZChwcm9ncmVzcykge1xuXG4gICAgICAgIGxldCBUcmFjdCA9IHRoaXMudHJvbWJvbmUuVHJhY3Q7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldFJlc3REaWFtZXRlcigpO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8VHJhY3QubjsgaSsrKSBUcmFjdC50YXJnZXREaWFtZXRlcltpXSA9IFRyYWN0LnJlc3REaWFtZXRlcltpXTsgICAgXG5cbiAgICAgICAgLy8gRGlzYWJsZSB0aGlzIGJlaGF2aW9yIGlmIHRoZSBtb3V0aCBpcyBjbG9zZWQgYSBjZXJ0YWluIGFtb3VudFxuICAgICAgICAvL2lmIChwcm9ncmVzcyA+IDAuOCB8fCBwcm9ncmVzcyA8IDAuMSkgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgZm9yKGxldCBpPSB0aGlzLmluZGV4IC0gdGhpcy5yYWRpdXM7IGkgPD0gdGhpcy5pbmRleCArIHRoaXMucmFkaXVzOyBpKyspe1xuICAgICAgICAgICAgaWYgKGkgPiBUcmFjdC50YXJnZXREaWFtZXRlci5sZW5ndGggfHwgaSA8IDApIGNvbnRpbnVlO1xuICAgICAgICAgICAgbGV0IGludGVycCA9IE1hdGgubGVycChUcmFjdC5yZXN0RGlhbWV0ZXJbaV0sIHRoaXMudGFyZ2V0LCBwcm9ncmVzcyk7XG4gICAgICAgICAgICBUcmFjdC50YXJnZXREaWFtZXRlcltpXSA9IGludGVycDtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5cbmV4cG9ydCB7IFRyYWN0VUkgfTsiLCJjbGFzcyBUcmFjdCB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0cm9tYm9uZSkge1xuICAgICAgICB0aGlzLnRyb21ib25lID0gdHJvbWJvbmU7XG5cbiAgICAgICAgdGhpcy5uID0gNDQ7XG4gICAgICAgIHRoaXMuYmxhZGVTdGFydCA9IDEwO1xuICAgICAgICB0aGlzLnRpcFN0YXJ0ID0gMzI7XG4gICAgICAgIHRoaXMubGlwU3RhcnQgPSAzOTtcbiAgICAgICAgdGhpcy5SID0gW107IC8vY29tcG9uZW50IGdvaW5nIHJpZ2h0XG4gICAgICAgIHRoaXMuTCA9IFtdOyAvL2NvbXBvbmVudCBnb2luZyBsZWZ0XG4gICAgICAgIHRoaXMucmVmbGVjdGlvbiA9IFtdO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0UiA9IFtdO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0TCA9IFtdO1xuICAgICAgICB0aGlzLm1heEFtcGxpdHVkZSA9IFtdO1xuICAgICAgICB0aGlzLmRpYW1ldGVyID0gW107XG4gICAgICAgIHRoaXMucmVzdERpYW1ldGVyID0gW107XG4gICAgICAgIHRoaXMudGFyZ2V0RGlhbWV0ZXIgPSBbXTtcbiAgICAgICAgdGhpcy5uZXdEaWFtZXRlciA9IFtdO1xuICAgICAgICB0aGlzLkEgPSBbXTtcbiAgICAgICAgdGhpcy5nbG90dGFsUmVmbGVjdGlvbiA9IDAuNzU7XG4gICAgICAgIHRoaXMubGlwUmVmbGVjdGlvbiA9IC0wLjg1O1xuICAgICAgICB0aGlzLmxhc3RPYnN0cnVjdGlvbiA9IC0xO1xuICAgICAgICB0aGlzLmZhZGUgPSAxLjA7IC8vMC45OTk5LFxuICAgICAgICB0aGlzLm1vdmVtZW50U3BlZWQgPSAxNTsgLy9jbSBwZXIgc2Vjb25kXG4gICAgICAgIHRoaXMudHJhbnNpZW50cyA9IFtdO1xuICAgICAgICB0aGlzLmxpcE91dHB1dCA9IDA7XG4gICAgICAgIHRoaXMubm9zZU91dHB1dCA9IDA7XG4gICAgICAgIHRoaXMudmVsdW1UYXJnZXQgPSAwLjAxO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuYmxhZGVTdGFydCA9IE1hdGguZmxvb3IodGhpcy5ibGFkZVN0YXJ0KnRoaXMubi80NCk7XG4gICAgICAgIHRoaXMudGlwU3RhcnQgPSBNYXRoLmZsb29yKHRoaXMudGlwU3RhcnQqdGhpcy5uLzQ0KTtcbiAgICAgICAgdGhpcy5saXBTdGFydCA9IE1hdGguZmxvb3IodGhpcy5saXBTdGFydCp0aGlzLm4vNDQpOyAgICAgICAgXG4gICAgICAgIHRoaXMuZGlhbWV0ZXIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMucmVzdERpYW1ldGVyID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICB0aGlzLnRhcmdldERpYW1ldGVyID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICB0aGlzLm5ld0RpYW1ldGVyID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5uOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBkaWFtZXRlciA9IDA7XG4gICAgICAgICAgICBpZiAoaTw3KnRoaXMubi80NC0wLjUpIGRpYW1ldGVyID0gMC42O1xuICAgICAgICAgICAgZWxzZSBpZiAoaTwxMip0aGlzLm4vNDQpIGRpYW1ldGVyID0gMS4xO1xuICAgICAgICAgICAgZWxzZSBkaWFtZXRlciA9IDEuNTtcbiAgICAgICAgICAgIHRoaXMuZGlhbWV0ZXJbaV0gPSB0aGlzLnJlc3REaWFtZXRlcltpXSA9IHRoaXMudGFyZ2V0RGlhbWV0ZXJbaV0gPSB0aGlzLm5ld0RpYW1ldGVyW2ldID0gZGlhbWV0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5SID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICB0aGlzLkwgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMucmVmbGVjdGlvbiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKzEpO1xuICAgICAgICB0aGlzLm5ld1JlZmxlY3Rpb24gPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubisxKTtcbiAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dFIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubisxKTtcbiAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dEwgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubisxKTtcbiAgICAgICAgdGhpcy5BID1uZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMubWF4QW1wbGl0dWRlID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ub3NlTGVuZ3RoID0gTWF0aC5mbG9vcigyOCp0aGlzLm4vNDQpXG4gICAgICAgIHRoaXMubm9zZVN0YXJ0ID0gdGhpcy5uLXRoaXMubm9zZUxlbmd0aCArIDE7XG4gICAgICAgIHRoaXMubm9zZVIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgIHRoaXMubm9zZUwgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgIHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0UiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKzEpO1xuICAgICAgICB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dEwgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCsxKTsgICAgICAgIFxuICAgICAgICB0aGlzLm5vc2VSZWZsZWN0aW9uID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgrMSk7XG4gICAgICAgIHRoaXMubm9zZURpYW1ldGVyID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgpO1xuICAgICAgICB0aGlzLm5vc2VBID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgpO1xuICAgICAgICB0aGlzLm5vc2VNYXhBbXBsaXR1ZGUgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm5vc2VMZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGRpYW1ldGVyO1xuICAgICAgICAgICAgdmFyIGQgPSAyKihpL3RoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgICAgICBpZiAoZDwxKSBkaWFtZXRlciA9IDAuNCsxLjYqZDtcbiAgICAgICAgICAgIGVsc2UgZGlhbWV0ZXIgPSAwLjUrMS41KigyLWQpO1xuICAgICAgICAgICAgZGlhbWV0ZXIgPSBNYXRoLm1pbihkaWFtZXRlciwgMS45KTtcbiAgICAgICAgICAgIHRoaXMubm9zZURpYW1ldGVyW2ldID0gZGlhbWV0ZXI7XG4gICAgICAgIH0gICAgICAgXG4gICAgICAgIHRoaXMubmV3UmVmbGVjdGlvbkxlZnQgPSB0aGlzLm5ld1JlZmxlY3Rpb25SaWdodCA9IHRoaXMubmV3UmVmbGVjdGlvbk5vc2UgPSAwO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlZmxlY3Rpb25zKCk7ICAgICAgICBcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVOb3NlUmVmbGVjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5ub3NlRGlhbWV0ZXJbMF0gPSB0aGlzLnZlbHVtVGFyZ2V0O1xuICAgIH1cbiAgICBcbiAgICByZXNoYXBlVHJhY3QoZGVsdGFUaW1lKSB7XG4gICAgICAgIHZhciBhbW91bnQgPSBkZWx0YVRpbWUgKiB0aGlzLm1vdmVtZW50U3BlZWQ7IDsgICAgXG4gICAgICAgIHZhciBuZXdMYXN0T2JzdHJ1Y3Rpb24gPSAtMTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubjsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZGlhbWV0ZXIgPSB0aGlzLmRpYW1ldGVyW2ldO1xuICAgICAgICAgICAgdmFyIHRhcmdldERpYW1ldGVyID0gdGhpcy50YXJnZXREaWFtZXRlcltpXTtcbiAgICAgICAgICAgIGlmIChkaWFtZXRlciA8PSAwKSBuZXdMYXN0T2JzdHJ1Y3Rpb24gPSBpO1xuICAgICAgICAgICAgdmFyIHNsb3dSZXR1cm47IFxuICAgICAgICAgICAgaWYgKGk8dGhpcy5ub3NlU3RhcnQpIHNsb3dSZXR1cm4gPSAwLjY7XG4gICAgICAgICAgICBlbHNlIGlmIChpID49IHRoaXMudGlwU3RhcnQpIHNsb3dSZXR1cm4gPSAxLjA7IFxuICAgICAgICAgICAgZWxzZSBzbG93UmV0dXJuID0gMC42KzAuNCooaS10aGlzLm5vc2VTdGFydCkvKHRoaXMudGlwU3RhcnQtdGhpcy5ub3NlU3RhcnQpO1xuICAgICAgICAgICAgdGhpcy5kaWFtZXRlcltpXSA9IE1hdGgubW92ZVRvd2FyZHMoZGlhbWV0ZXIsIHRhcmdldERpYW1ldGVyLCBzbG93UmV0dXJuKmFtb3VudCwgMiphbW91bnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxhc3RPYnN0cnVjdGlvbj4tMSAmJiBuZXdMYXN0T2JzdHJ1Y3Rpb24gPT0gLTEgJiYgdGhpcy5ub3NlQVswXTwwLjA1KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmFkZFRyYW5zaWVudCh0aGlzLmxhc3RPYnN0cnVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0T2JzdHJ1Y3Rpb24gPSBuZXdMYXN0T2JzdHJ1Y3Rpb247XG4gICAgICAgIFxuICAgICAgICBhbW91bnQgPSBkZWx0YVRpbWUgKiB0aGlzLm1vdmVtZW50U3BlZWQ7IFxuICAgICAgICB0aGlzLm5vc2VEaWFtZXRlclswXSA9IE1hdGgubW92ZVRvd2FyZHModGhpcy5ub3NlRGlhbWV0ZXJbMF0sIHRoaXMudmVsdW1UYXJnZXQsIFxuICAgICAgICAgICAgICAgIGFtb3VudCowLjI1LCBhbW91bnQqMC4xKTtcbiAgICAgICAgdGhpcy5ub3NlQVswXSA9IHRoaXMubm9zZURpYW1ldGVyWzBdKnRoaXMubm9zZURpYW1ldGVyWzBdOyAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIGNhbGN1bGF0ZVJlZmxlY3Rpb25zKCkge1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5uOyBpKyspIFxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkFbaV0gPSB0aGlzLmRpYW1ldGVyW2ldKnRoaXMuZGlhbWV0ZXJbaV07IC8vaWdub3JpbmcgUEkgZXRjLlxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGk9MTsgaTx0aGlzLm47IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uW2ldID0gdGhpcy5uZXdSZWZsZWN0aW9uW2ldO1xuICAgICAgICAgICAgaWYgKHRoaXMuQVtpXSA9PSAwKSB0aGlzLm5ld1JlZmxlY3Rpb25baV0gPSAwLjk5OTsgLy90byBwcmV2ZW50IHNvbWUgYmFkIGJlaGF2aW91ciBpZiAwXG4gICAgICAgICAgICBlbHNlIHRoaXMubmV3UmVmbGVjdGlvbltpXSA9ICh0aGlzLkFbaS0xXS10aGlzLkFbaV0pIC8gKHRoaXMuQVtpLTFdK3RoaXMuQVtpXSk7IFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvL25vdyBhdCBqdW5jdGlvbiB3aXRoIG5vc2VcblxuICAgICAgICB0aGlzLnJlZmxlY3Rpb25MZWZ0ID0gdGhpcy5uZXdSZWZsZWN0aW9uTGVmdDtcbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uUmlnaHQgPSB0aGlzLm5ld1JlZmxlY3Rpb25SaWdodDtcbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uTm9zZSA9IHRoaXMubmV3UmVmbGVjdGlvbk5vc2U7XG4gICAgICAgIHZhciBzdW0gPSB0aGlzLkFbdGhpcy5ub3NlU3RhcnRdK3RoaXMuQVt0aGlzLm5vc2VTdGFydCsxXSt0aGlzLm5vc2VBWzBdO1xuICAgICAgICB0aGlzLm5ld1JlZmxlY3Rpb25MZWZ0ID0gKDIqdGhpcy5BW3RoaXMubm9zZVN0YXJ0XS1zdW0pL3N1bTtcbiAgICAgICAgdGhpcy5uZXdSZWZsZWN0aW9uUmlnaHQgPSAoMip0aGlzLkFbdGhpcy5ub3NlU3RhcnQrMV0tc3VtKS9zdW07ICAgXG4gICAgICAgIHRoaXMubmV3UmVmbGVjdGlvbk5vc2UgPSAoMip0aGlzLm5vc2VBWzBdLXN1bSkvc3VtOyAgICAgIFxuICAgIH1cblxuICAgIGNhbGN1bGF0ZU5vc2VSZWZsZWN0aW9ucygpIHtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubm9zZUxlbmd0aDsgaSsrKSBcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5ub3NlQVtpXSA9IHRoaXMubm9zZURpYW1ldGVyW2ldKnRoaXMubm9zZURpYW1ldGVyW2ldOyBcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpPTE7IGk8dGhpcy5ub3NlTGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubm9zZVJlZmxlY3Rpb25baV0gPSAodGhpcy5ub3NlQVtpLTFdLXRoaXMubm9zZUFbaV0pIC8gKHRoaXMubm9zZUFbaS0xXSt0aGlzLm5vc2VBW2ldKTsgXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcnVuU3RlcChnbG90dGFsT3V0cHV0LCB0dXJidWxlbmNlTm9pc2UsIGxhbWJkYSkge1xuICAgICAgICB2YXIgdXBkYXRlQW1wbGl0dWRlcyA9IChNYXRoLnJhbmRvbSgpPDAuMSk7XG4gICAgXG4gICAgICAgIC8vbW91dGhcbiAgICAgICAgdGhpcy5wcm9jZXNzVHJhbnNpZW50cygpO1xuICAgICAgICB0aGlzLmFkZFR1cmJ1bGVuY2VOb2lzZSh0dXJidWxlbmNlTm9pc2UpO1xuICAgICAgICBcbiAgICAgICAgLy90aGlzLmdsb3R0YWxSZWZsZWN0aW9uID0gLTAuOCArIDEuNiAqIEdsb3R0aXMubmV3VGVuc2VuZXNzO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0UlswXSA9IHRoaXMuTFswXSAqIHRoaXMuZ2xvdHRhbFJlZmxlY3Rpb24gKyBnbG90dGFsT3V0cHV0O1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0TFt0aGlzLm5dID0gdGhpcy5SW3RoaXMubi0xXSAqIHRoaXMubGlwUmVmbGVjdGlvbjsgXG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpPTE7IGk8dGhpcy5uOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciByID0gdGhpcy5yZWZsZWN0aW9uW2ldICogKDEtbGFtYmRhKSArIHRoaXMubmV3UmVmbGVjdGlvbltpXSpsYW1iZGE7XG4gICAgICAgICAgICB2YXIgdyA9IHIgKiAodGhpcy5SW2ktMV0gKyB0aGlzLkxbaV0pO1xuICAgICAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dFJbaV0gPSB0aGlzLlJbaS0xXSAtIHc7XG4gICAgICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0TFtpXSA9IHRoaXMuTFtpXSArIHc7XG4gICAgICAgIH0gICAgXG4gICAgICAgIFxuICAgICAgICAvL25vdyBhdCBqdW5jdGlvbiB3aXRoIG5vc2VcbiAgICAgICAgdmFyIGkgPSB0aGlzLm5vc2VTdGFydDtcbiAgICAgICAgdmFyIHIgPSB0aGlzLm5ld1JlZmxlY3Rpb25MZWZ0ICogKDEtbGFtYmRhKSArIHRoaXMucmVmbGVjdGlvbkxlZnQqbGFtYmRhO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0TFtpXSA9IHIqdGhpcy5SW2ktMV0rKDErcikqKHRoaXMubm9zZUxbMF0rdGhpcy5MW2ldKTtcbiAgICAgICAgciA9IHRoaXMubmV3UmVmbGVjdGlvblJpZ2h0ICogKDEtbGFtYmRhKSArIHRoaXMucmVmbGVjdGlvblJpZ2h0KmxhbWJkYTtcbiAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dFJbaV0gPSByKnRoaXMuTFtpXSsoMStyKSoodGhpcy5SW2ktMV0rdGhpcy5ub3NlTFswXSk7ICAgICBcbiAgICAgICAgciA9IHRoaXMubmV3UmVmbGVjdGlvbk5vc2UgKiAoMS1sYW1iZGEpICsgdGhpcy5yZWZsZWN0aW9uTm9zZSpsYW1iZGE7XG4gICAgICAgIHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0UlswXSA9IHIqdGhpcy5ub3NlTFswXSsoMStyKSoodGhpcy5MW2ldK3RoaXMuUltpLTFdKTtcbiAgICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5uOyBpKyspXG4gICAgICAgIHsgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLlJbaV0gPSB0aGlzLmp1bmN0aW9uT3V0cHV0UltpXSowLjk5OTtcbiAgICAgICAgICAgIHRoaXMuTFtpXSA9IHRoaXMuanVuY3Rpb25PdXRwdXRMW2krMV0qMC45OTk7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL3RoaXMuUltpXSA9IE1hdGguY2xhbXAodGhpcy5qdW5jdGlvbk91dHB1dFJbaV0gKiB0aGlzLmZhZGUsIC0xLCAxKTtcbiAgICAgICAgICAgIC8vdGhpcy5MW2ldID0gTWF0aC5jbGFtcCh0aGlzLmp1bmN0aW9uT3V0cHV0TFtpKzFdICogdGhpcy5mYWRlLCAtMSwgMSk7ICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodXBkYXRlQW1wbGl0dWRlcylcbiAgICAgICAgICAgIHsgICBcbiAgICAgICAgICAgICAgICB2YXIgYW1wbGl0dWRlID0gTWF0aC5hYnModGhpcy5SW2ldK3RoaXMuTFtpXSk7XG4gICAgICAgICAgICAgICAgaWYgKGFtcGxpdHVkZSA+IHRoaXMubWF4QW1wbGl0dWRlW2ldKSB0aGlzLm1heEFtcGxpdHVkZVtpXSA9IGFtcGxpdHVkZTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMubWF4QW1wbGl0dWRlW2ldICo9IDAuOTk5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5saXBPdXRwdXQgPSB0aGlzLlJbdGhpcy5uLTFdO1xuICAgICAgICBcbiAgICAgICAgLy9ub3NlICAgICBcbiAgICAgICAgdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRMW3RoaXMubm9zZUxlbmd0aF0gPSB0aGlzLm5vc2VSW3RoaXMubm9zZUxlbmd0aC0xXSAqIHRoaXMubGlwUmVmbGVjdGlvbjsgXG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpPTE7IGk8dGhpcy5ub3NlTGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB3ID0gdGhpcy5ub3NlUmVmbGVjdGlvbltpXSAqICh0aGlzLm5vc2VSW2ktMV0gKyB0aGlzLm5vc2VMW2ldKTtcbiAgICAgICAgICAgIHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0UltpXSA9IHRoaXMubm9zZVJbaS0xXSAtIHc7XG4gICAgICAgICAgICB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dExbaV0gPSB0aGlzLm5vc2VMW2ldICsgdztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubm9zZUxlbmd0aDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm5vc2VSW2ldID0gdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRSW2ldICogdGhpcy5mYWRlO1xuICAgICAgICAgICAgdGhpcy5ub3NlTFtpXSA9IHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0TFtpKzFdICogdGhpcy5mYWRlOyAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL3RoaXMubm9zZVJbaV0gPSBNYXRoLmNsYW1wKHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0UltpXSAqIHRoaXMuZmFkZSwgLTEsIDEpO1xuICAgICAgICAgICAgLy90aGlzLm5vc2VMW2ldID0gTWF0aC5jbGFtcCh0aGlzLm5vc2VKdW5jdGlvbk91dHB1dExbaSsxXSAqIHRoaXMuZmFkZSwgLTEsIDEpOyAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHVwZGF0ZUFtcGxpdHVkZXMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGFtcGxpdHVkZSA9IE1hdGguYWJzKHRoaXMubm9zZVJbaV0rdGhpcy5ub3NlTFtpXSk7XG4gICAgICAgICAgICAgICAgaWYgKGFtcGxpdHVkZSA+IHRoaXMubm9zZU1heEFtcGxpdHVkZVtpXSkgdGhpcy5ub3NlTWF4QW1wbGl0dWRlW2ldID0gYW1wbGl0dWRlO1xuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5ub3NlTWF4QW1wbGl0dWRlW2ldICo9IDAuOTk5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub3NlT3V0cHV0ID0gdGhpcy5ub3NlUlt0aGlzLm5vc2VMZW5ndGgtMV07XG4gICAgICAgXG4gICAgfVxuICAgIFxuICAgIGZpbmlzaEJsb2NrKCkgeyAgICAgICAgIFxuICAgICAgICB0aGlzLnJlc2hhcGVUcmFjdCh0aGlzLnRyb21ib25lLkF1ZGlvU3lzdGVtLmJsb2NrVGltZSk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUmVmbGVjdGlvbnMoKTtcbiAgICB9XG4gICAgXG4gICAgYWRkVHJhbnNpZW50KHBvc2l0aW9uKSB7XG4gICAgICAgIHZhciB0cmFucyA9IHt9XG4gICAgICAgIHRyYW5zLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRyYW5zLnRpbWVBbGl2ZSA9IDA7XG4gICAgICAgIHRyYW5zLmxpZmVUaW1lID0gMC4yO1xuICAgICAgICB0cmFucy5zdHJlbmd0aCA9IDAuMztcbiAgICAgICAgdHJhbnMuZXhwb25lbnQgPSAyMDA7XG4gICAgICAgIHRoaXMudHJhbnNpZW50cy5wdXNoKHRyYW5zKTtcbiAgICB9XG4gICAgXG4gICAgcHJvY2Vzc1RyYW5zaWVudHMoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50cmFuc2llbnRzLmxlbmd0aDsgaSsrKSAgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0cmFucyA9IHRoaXMudHJhbnNpZW50c1tpXTtcbiAgICAgICAgICAgIHZhciBhbXBsaXR1ZGUgPSB0cmFucy5zdHJlbmd0aCAqIE1hdGgucG93KDIsIC10cmFucy5leHBvbmVudCAqIHRyYW5zLnRpbWVBbGl2ZSk7XG4gICAgICAgICAgICB0aGlzLlJbdHJhbnMucG9zaXRpb25dICs9IGFtcGxpdHVkZS8yO1xuICAgICAgICAgICAgdGhpcy5MW3RyYW5zLnBvc2l0aW9uXSArPSBhbXBsaXR1ZGUvMjtcbiAgICAgICAgICAgIHRyYW5zLnRpbWVBbGl2ZSArPSAxLjAvKHRoaXMudHJvbWJvbmUuc2FtcGxlUmF0ZSoyKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpPXRoaXMudHJhbnNpZW50cy5sZW5ndGgtMTsgaT49MDsgaS0tKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdHJhbnMgPSB0aGlzLnRyYW5zaWVudHNbaV07XG4gICAgICAgICAgICBpZiAodHJhbnMudGltZUFsaXZlID4gdHJhbnMubGlmZVRpbWUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2llbnRzLnNwbGljZShpLDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGFkZFR1cmJ1bGVuY2VOb2lzZSh0dXJidWxlbmNlTm9pc2UpIHtcbiAgICAgICAgLy8gZm9yICh2YXIgaj0wOyBqPFVJLnRvdWNoZXNXaXRoTW91c2UubGVuZ3RoOyBqKyspXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIHZhciB0b3VjaCA9IFVJLnRvdWNoZXNXaXRoTW91c2Vbal07XG4gICAgICAgIC8vICAgICBpZiAodG91Y2guaW5kZXg8MiB8fCB0b3VjaC5pbmRleD5UcmFjdC5uKSBjb250aW51ZTtcbiAgICAgICAgLy8gICAgIGlmICh0b3VjaC5kaWFtZXRlcjw9MCkgY29udGludWU7ICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICB2YXIgaW50ZW5zaXR5ID0gdG91Y2guZnJpY2F0aXZlX2ludGVuc2l0eTtcbiAgICAgICAgLy8gICAgIGlmIChpbnRlbnNpdHkgPT0gMCkgY29udGludWU7XG4gICAgICAgIC8vICAgICB0aGlzLmFkZFR1cmJ1bGVuY2VOb2lzZUF0SW5kZXgoMC42Nip0dXJidWxlbmNlTm9pc2UqaW50ZW5zaXR5LCB0b3VjaC5pbmRleCwgdG91Y2guZGlhbWV0ZXIpO1xuICAgICAgICAvLyB9XG4gICAgfVxuICAgIFxuICAgIGFkZFR1cmJ1bGVuY2VOb2lzZUF0SW5kZXgodHVyYnVsZW5jZU5vaXNlLCBpbmRleCwgZGlhbWV0ZXIpIHsgICBcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKGluZGV4KTtcbiAgICAgICAgdmFyIGRlbHRhID0gaW5kZXggLSBpO1xuICAgICAgICB0dXJidWxlbmNlTm9pc2UgKj0gdGhpcy50cm9tYm9uZS5HbG90dGlzLmdldE5vaXNlTW9kdWxhdG9yKCk7XG4gICAgICAgIHZhciB0aGlubmVzczAgPSBNYXRoLmNsYW1wKDgqKDAuNy1kaWFtZXRlciksMCwxKTtcbiAgICAgICAgdmFyIG9wZW5uZXNzID0gTWF0aC5jbGFtcCgzMCooZGlhbWV0ZXItMC4zKSwgMCwgMSk7XG4gICAgICAgIHZhciBub2lzZTAgPSB0dXJidWxlbmNlTm9pc2UqKDEtZGVsdGEpKnRoaW5uZXNzMCpvcGVubmVzcztcbiAgICAgICAgdmFyIG5vaXNlMSA9IHR1cmJ1bGVuY2VOb2lzZSpkZWx0YSp0aGlubmVzczAqb3Blbm5lc3M7XG4gICAgICAgIHRoaXMuUltpKzFdICs9IG5vaXNlMC8yO1xuICAgICAgICB0aGlzLkxbaSsxXSArPSBub2lzZTAvMjtcbiAgICAgICAgdGhpcy5SW2krMl0gKz0gbm9pc2UxLzI7XG4gICAgICAgIHRoaXMuTFtpKzJdICs9IG5vaXNlMS8yO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IFRyYWN0IH07IiwiTWF0aC5jbGFtcCA9IGZ1bmN0aW9uKG51bWJlciwgbWluLCBtYXgpIHtcbiAgICBpZiAobnVtYmVyPG1pbikgcmV0dXJuIG1pbjtcbiAgICBlbHNlIGlmIChudW1iZXI+bWF4KSByZXR1cm4gbWF4O1xuICAgIGVsc2UgcmV0dXJuIG51bWJlcjtcbn1cblxuTWF0aC5tb3ZlVG93YXJkcyA9IGZ1bmN0aW9uKGN1cnJlbnQsIHRhcmdldCwgYW1vdW50KSB7XG4gICAgaWYgKGN1cnJlbnQ8dGFyZ2V0KSByZXR1cm4gTWF0aC5taW4oY3VycmVudCthbW91bnQsIHRhcmdldCk7XG4gICAgZWxzZSByZXR1cm4gTWF0aC5tYXgoY3VycmVudC1hbW91bnQsIHRhcmdldCk7XG59XG5cbk1hdGgubW92ZVRvd2FyZHMgPSBmdW5jdGlvbihjdXJyZW50LCB0YXJnZXQsIGFtb3VudFVwLCBhbW91bnREb3duKSB7XG4gICAgaWYgKGN1cnJlbnQ8dGFyZ2V0KSByZXR1cm4gTWF0aC5taW4oY3VycmVudCthbW91bnRVcCwgdGFyZ2V0KTtcbiAgICBlbHNlIHJldHVybiBNYXRoLm1heChjdXJyZW50LWFtb3VudERvd24sIHRhcmdldCk7XG59XG5cbk1hdGguZ2F1c3NpYW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcyA9IDA7XG4gICAgZm9yICh2YXIgYz0wOyBjPDE2OyBjKyspIHMrPU1hdGgucmFuZG9tKCk7XG4gICAgcmV0dXJuIChzLTgpLzQ7XG59XG5cbk1hdGgubGVycCA9IGZ1bmN0aW9uKGEsIGIsIHQpIHtcbiAgICByZXR1cm4gYSArIChiIC0gYSkgKiB0O1xufSIsIi8qXG4gKiBBIHNwZWVkLWltcHJvdmVkIHBlcmxpbiBhbmQgc2ltcGxleCBub2lzZSBhbGdvcml0aG1zIGZvciAyRC5cbiAqXG4gKiBCYXNlZCBvbiBleGFtcGxlIGNvZGUgYnkgU3RlZmFuIEd1c3RhdnNvbiAoc3RlZ3VAaXRuLmxpdS5zZSkuXG4gKiBPcHRpbWlzYXRpb25zIGJ5IFBldGVyIEVhc3RtYW4gKHBlYXN0bWFuQGRyaXp6bGUuc3RhbmZvcmQuZWR1KS5cbiAqIEJldHRlciByYW5rIG9yZGVyaW5nIG1ldGhvZCBieSBTdGVmYW4gR3VzdGF2c29uIGluIDIwMTIuXG4gKiBDb252ZXJ0ZWQgdG8gSmF2YXNjcmlwdCBieSBKb3NlcGggR2VudGxlLlxuICpcbiAqIFZlcnNpb24gMjAxMi0wMy0wOVxuICpcbiAqIFRoaXMgY29kZSB3YXMgcGxhY2VkIGluIHRoZSBwdWJsaWMgZG9tYWluIGJ5IGl0cyBvcmlnaW5hbCBhdXRob3IsXG4gKiBTdGVmYW4gR3VzdGF2c29uLiBZb3UgbWF5IHVzZSBpdCBhcyB5b3Ugc2VlIGZpdCwgYnV0XG4gKiBhdHRyaWJ1dGlvbiBpcyBhcHByZWNpYXRlZC5cbiAqXG4gKi9cblxuY2xhc3MgR3JhZCB7XG4gICAgY29uc3RydWN0b3IoeCwgeSwgeil7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHRoaXMueiA9IHo7XG4gICAgfVxuXG4gICAgZG90Mih4LCB5KXtcbiAgICAgICAgcmV0dXJuIHRoaXMueCp4ICsgdGhpcy55Knk7XG4gICAgfVxuXG4gICAgZG90Myh4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiB0aGlzLngqeCArIHRoaXMueSp5ICsgdGhpcy56Kno7XG4gICAgfTtcbn1cblxuY2xhc3MgTm9pc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmdyYWQzID0gW25ldyBHcmFkKDEsMSwwKSxuZXcgR3JhZCgtMSwxLDApLG5ldyBHcmFkKDEsLTEsMCksbmV3IEdyYWQoLTEsLTEsMCksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IEdyYWQoMSwwLDEpLG5ldyBHcmFkKC0xLDAsMSksbmV3IEdyYWQoMSwwLC0xKSxuZXcgR3JhZCgtMSwwLC0xKSxcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgR3JhZCgwLDEsMSksbmV3IEdyYWQoMCwtMSwxKSxuZXcgR3JhZCgwLDEsLTEpLG5ldyBHcmFkKDAsLTEsLTEpXTtcbiAgICAgICAgdGhpcy5wID0gWzE1MSwxNjAsMTM3LDkxLDkwLDE1LFxuICAgICAgICAgICAgMTMxLDEzLDIwMSw5NSw5Niw1MywxOTQsMjMzLDcsMjI1LDE0MCwzNiwxMDMsMzAsNjksMTQyLDgsOTksMzcsMjQwLDIxLDEwLDIzLFxuICAgICAgICAgICAgMTkwLCA2LDE0OCwyNDcsMTIwLDIzNCw3NSwwLDI2LDE5Nyw2Miw5NCwyNTIsMjE5LDIwMywxMTcsMzUsMTEsMzIsNTcsMTc3LDMzLFxuICAgICAgICAgICAgODgsMjM3LDE0OSw1Niw4NywxNzQsMjAsMTI1LDEzNiwxNzEsMTY4LCA2OCwxNzUsNzQsMTY1LDcxLDEzNCwxMzksNDgsMjcsMTY2LFxuICAgICAgICAgICAgNzcsMTQ2LDE1OCwyMzEsODMsMTExLDIyOSwxMjIsNjAsMjExLDEzMywyMzAsMjIwLDEwNSw5Miw0MSw1NSw0NiwyNDUsNDAsMjQ0LFxuICAgICAgICAgICAgMTAyLDE0Myw1NCwgNjUsMjUsNjMsMTYxLCAxLDIxNiw4MCw3MywyMDksNzYsMTMyLDE4NywyMDgsIDg5LDE4LDE2OSwyMDAsMTk2LFxuICAgICAgICAgICAgMTM1LDEzMCwxMTYsMTg4LDE1OSw4NiwxNjQsMTAwLDEwOSwxOTgsMTczLDE4NiwgMyw2NCw1MiwyMTcsMjI2LDI1MCwxMjQsMTIzLFxuICAgICAgICAgICAgNSwyMDIsMzgsMTQ3LDExOCwxMjYsMjU1LDgyLDg1LDIxMiwyMDcsMjA2LDU5LDIyNyw0NywxNiw1OCwxNywxODIsMTg5LDI4LDQyLFxuICAgICAgICAgICAgMjIzLDE4MywxNzAsMjEzLDExOSwyNDgsMTUyLCAyLDQ0LDE1NCwxNjMsIDcwLDIyMSwxNTMsMTAxLDE1NSwxNjcsIDQzLDE3Miw5LFxuICAgICAgICAgICAgMTI5LDIyLDM5LDI1MywgMTksOTgsMTA4LDExMCw3OSwxMTMsMjI0LDIzMiwxNzgsMTg1LCAxMTIsMTA0LDIxOCwyNDYsOTcsMjI4LFxuICAgICAgICAgICAgMjUxLDM0LDI0MiwxOTMsMjM4LDIxMCwxNDQsMTIsMTkxLDE3OSwxNjIsMjQxLCA4MSw1MSwxNDUsMjM1LDI0OSwxNCwyMzksMTA3LFxuICAgICAgICAgICAgNDksMTkyLDIxNCwgMzEsMTgxLDE5OSwxMDYsMTU3LDE4NCwgODQsMjA0LDE3NiwxMTUsMTIxLDUwLDQ1LDEyNywgNCwxNTAsMjU0LFxuICAgICAgICAgICAgMTM4LDIzNiwyMDUsOTMsMjIyLDExNCw2NywyOSwyNCw3MiwyNDMsMTQxLDEyOCwxOTUsNzgsNjYsMjE1LDYxLDE1NiwxODBdO1xuXG4gICAgICAgIC8vIFRvIHJlbW92ZSB0aGUgbmVlZCBmb3IgaW5kZXggd3JhcHBpbmcsIGRvdWJsZSB0aGUgcGVybXV0YXRpb24gdGFibGUgbGVuZ3RoXG4gICAgICAgIHRoaXMucGVybSA9IG5ldyBBcnJheSg1MTIpO1xuICAgICAgICB0aGlzLmdyYWRQID0gbmV3IEFycmF5KDUxMik7XG5cbiAgICAgICAgdGhpcy5zZWVkKERhdGUubm93KCkpO1xuICAgIH1cblxuICAgIHNlZWQoc2VlZCkge1xuICAgICAgICBpZihzZWVkID4gMCAmJiBzZWVkIDwgMSkge1xuICAgICAgICAgICAgLy8gU2NhbGUgdGhlIHNlZWQgb3V0XG4gICAgICAgICAgICBzZWVkICo9IDY1NTM2O1xuICAgICAgICB9XG5cbiAgICAgICAgc2VlZCA9IE1hdGguZmxvb3Ioc2VlZCk7XG4gICAgICAgIGlmKHNlZWQgPCAyNTYpIHtcbiAgICAgICAgICAgIHNlZWQgfD0gc2VlZCA8PCA4O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdjtcbiAgICAgICAgICAgIGlmIChpICYgMSkge1xuICAgICAgICAgICAgICAgIHYgPSB0aGlzLnBbaV0gXiAoc2VlZCAmIDI1NSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHYgPSB0aGlzLnBbaV0gXiAoKHNlZWQ+PjgpICYgMjU1KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wZXJtW2ldID0gdGhpcy5wZXJtW2kgKyAyNTZdID0gdjtcbiAgICAgICAgICAgIHRoaXMuZ3JhZFBbaV0gPSB0aGlzLmdyYWRQW2kgKyAyNTZdID0gdGhpcy5ncmFkM1t2ICUgMTJdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIDJEIHNpbXBsZXggbm9pc2VcbiAgICBzaW1wbGV4Mih4aW4sIHlpbikge1xuICAgICAgICAvLyBTa2V3aW5nIGFuZCB1bnNrZXdpbmcgZmFjdG9ycyBmb3IgMiwgMywgYW5kIDQgZGltZW5zaW9uc1xuICAgICAgICB2YXIgRjIgPSAwLjUqKE1hdGguc3FydCgzKS0xKTtcbiAgICAgICAgdmFyIEcyID0gKDMtTWF0aC5zcXJ0KDMpKS82O1xuXG4gICAgICAgIHZhciBGMyA9IDEvMztcbiAgICAgICAgdmFyIEczID0gMS82O1xuXG4gICAgICAgIHZhciBuMCwgbjEsIG4yOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcbiAgICAgICAgLy8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxuICAgICAgICB2YXIgcyA9ICh4aW4reWluKSpGMjsgLy8gSGFpcnkgZmFjdG9yIGZvciAyRFxuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeGluK3MpO1xuICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluK3MpO1xuICAgICAgICB2YXIgdCA9IChpK2opKkcyO1xuICAgICAgICB2YXIgeDAgPSB4aW4taSt0OyAvLyBUaGUgeCx5IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpbiwgdW5za2V3ZWQuXG4gICAgICAgIHZhciB5MCA9IHlpbi1qK3Q7XG4gICAgICAgIC8vIEZvciB0aGUgMkQgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYW4gZXF1aWxhdGVyYWwgdHJpYW5nbGUuXG4gICAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cbiAgICAgICAgdmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xuICAgICAgICBpZih4MD55MCkgeyAvLyBsb3dlciB0cmlhbmdsZSwgWFkgb3JkZXI6ICgwLDApLT4oMSwwKS0+KDEsMSlcbiAgICAgICAgICAgIGkxPTE7IGoxPTA7XG4gICAgICAgIH0gZWxzZSB7ICAgIC8vIHVwcGVyIHRyaWFuZ2xlLCBZWCBvcmRlcjogKDAsMCktPigwLDEpLT4oMSwxKVxuICAgICAgICAgICAgaTE9MDsgajE9MTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBIHN0ZXAgb2YgKDEsMCkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgxLWMsLWMpIGluICh4LHkpLCBhbmRcbiAgICAgICAgLy8gYSBzdGVwIG9mICgwLDEpIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jKSBpbiAoeCx5KSwgd2hlcmVcbiAgICAgICAgLy8gYyA9ICgzLXNxcnQoMykpLzZcbiAgICAgICAgdmFyIHgxID0geDAgLSBpMSArIEcyOyAvLyBPZmZzZXRzIGZvciBtaWRkbGUgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xuICAgICAgICB2YXIgeTEgPSB5MCAtIGoxICsgRzI7XG4gICAgICAgIHZhciB4MiA9IHgwIC0gMSArIDIgKiBHMjsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXG4gICAgICAgIHZhciB5MiA9IHkwIC0gMSArIDIgKiBHMjtcbiAgICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSB0aHJlZSBzaW1wbGV4IGNvcm5lcnNcbiAgICAgICAgaSAmPSAyNTU7XG4gICAgICAgIGogJj0gMjU1O1xuICAgICAgICB2YXIgZ2kwID0gdGhpcy5ncmFkUFtpK3RoaXMucGVybVtqXV07XG4gICAgICAgIHZhciBnaTEgPSB0aGlzLmdyYWRQW2kraTErdGhpcy5wZXJtW2orajFdXTtcbiAgICAgICAgdmFyIGdpMiA9IHRoaXMuZ3JhZFBbaSsxK3RoaXMucGVybVtqKzFdXTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuICAgICAgICB2YXIgdDAgPSAwLjUgLSB4MCp4MC15MCp5MDtcbiAgICAgICAgaWYodDA8MCkge1xuICAgICAgICAgICAgbjAgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdDAgKj0gdDA7XG4gICAgICAgICAgICBuMCA9IHQwICogdDAgKiBnaTAuZG90Mih4MCwgeTApOyAgLy8gKHgseSkgb2YgZ3JhZDMgdXNlZCBmb3IgMkQgZ3JhZGllbnRcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDEgPSAwLjUgLSB4MSp4MS15MSp5MTtcbiAgICAgICAgaWYodDE8MCkge1xuICAgICAgICAgICAgbjEgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdDEgKj0gdDE7XG4gICAgICAgICAgICBuMSA9IHQxICogdDEgKiBnaTEuZG90Mih4MSwgeTEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MiA9IDAuNSAtIHgyKngyLXkyKnkyO1xuICAgICAgICBpZih0MjwwKSB7XG4gICAgICAgICAgICBuMiA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0MiAqPSB0MjtcbiAgICAgICAgICAgIG4yID0gdDIgKiB0MiAqIGdpMi5kb3QyKHgyLCB5Mik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxuICAgICAgICAvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXG4gICAgICAgIHJldHVybiA3MCAqIChuMCArIG4xICsgbjIpO1xuICAgIH1cbiAgICBcbiAgICBzaW1wbGV4MSh4KXtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2ltcGxleDIoeCoxLjIsIC14KjAuNyk7XG4gICAgfVxuXG59XG5cbmNvbnN0IHNpbmdsZXRvbiA9IG5ldyBOb2lzZSgpO1xuT2JqZWN0LmZyZWV6ZShzaW5nbGV0b24pO1xuXG5leHBvcnQgZGVmYXVsdCBzaW5nbGV0b247IiwiaW1wb3J0IFwiLi9tYXRoLWV4dGVuc2lvbnMuanNcIjtcblxuaW1wb3J0IHsgQXVkaW9TeXN0ZW0gfSBmcm9tIFwiLi9jb21wb25lbnRzL2F1ZGlvLXN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgR2xvdHRpcyB9IGZyb20gXCIuL2NvbXBvbmVudHMvZ2xvdHRpcy5qc1wiO1xuaW1wb3J0IHsgVHJhY3QgfSBmcm9tIFwiLi9jb21wb25lbnRzL3RyYWN0LmpzXCI7XG5pbXBvcnQgeyBUcmFjdFVJIH0gZnJvbSBcIi4vY29tcG9uZW50cy90cmFjdC11aS5qc1wiO1xuXG5jbGFzcyBQaW5rVHJvbWJvbmUge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIpe1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zYW1wbGVSYXRlID0gMDtcbiAgICAgICAgdGhpcy50aW1lID0gMDtcbiAgICAgICAgdGhpcy5hbHdheXNWb2ljZSA9IHRydWU7XG4gICAgICAgIHRoaXMuYXV0b1dvYmJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubm9pc2VGcmVxID0gNTAwO1xuICAgICAgICB0aGlzLm5vaXNlUSA9IDAuNztcblxuICAgICAgICB0aGlzLkF1ZGlvU3lzdGVtID0gbmV3IEF1ZGlvU3lzdGVtKHRoaXMpO1xuICAgICAgICB0aGlzLkF1ZGlvU3lzdGVtLmluaXQoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuR2xvdHRpcyA9IG5ldyBHbG90dGlzKHRoaXMpO1xuICAgICAgICB0aGlzLkdsb3R0aXMuaW5pdCgpO1xuXG4gICAgICAgIHRoaXMuVHJhY3QgPSBuZXcgVHJhY3QodGhpcyk7XG4gICAgICAgIHRoaXMuVHJhY3QuaW5pdCgpO1xuXG4gICAgICAgIHRoaXMuVHJhY3RVSSA9IG5ldyBUcmFjdFVJKHRoaXMpO1xuICAgICAgICB0aGlzLlRyYWN0VUkuaW5pdCgpO1xuXG4gICAgICAgIC8vdGhpcy5TdGFydEF1ZGlvKCk7XG4gICAgICAgIC8vdGhpcy5TZXRNdXRlKHRydWUpO1xuXG4gICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBTdGFydEF1ZGlvKCkge1xuICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuQXVkaW9TeXN0ZW0uc3RhcnRTb3VuZCgpO1xuICAgIH1cblxuICAgIFNldE11dGUoZG9NdXRlKSB7XG4gICAgICAgIGRvTXV0ZSA/IHRoaXMuQXVkaW9TeXN0ZW0ubXV0ZSgpIDogdGhpcy5BdWRpb1N5c3RlbS51bm11dGUoKTtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGRvTXV0ZTtcbiAgICB9XG5cbiAgICBUb2dnbGVNdXRlKCkge1xuICAgICAgICB0aGlzLlNldE11dGUoIXRoaXMubXV0ZWQpO1xuICAgIH1cblxufVxuXG5leHBvcnQgeyBQaW5rVHJvbWJvbmUgfTsiLCIvLyBjb25zdCB3b3JkcyA9IHJlcXVpcmUoJ2NtdS1wcm9ub3VuY2luZy1kaWN0aW9uYXJ5Jyk7XG5cbmV4cG9ydCBjbGFzcyBUVFNDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBcbiAgICB9XG5cbiAgICAvLyBHZXRHcmFwaGVtZXMoc3RyKXtcbiAgICAvLyAgICAgbGV0IHplcm9QdW5jdHVhdGlvbiA9IHN0ci5yZXBsYWNlKC9bLixcXC8jISQlXFxeJlxcKjs6e309XFwtX2B+KCldL2csXCJcIik7XG4gICAgLy8gICAgIGxldCB3b3JkQmFuayA9IFtdXG4gICAgLy8gICAgIGZvcihsZXQgd29yZCBvZiB6ZXJvUHVuY3R1YXRpb24uc3BsaXQoJyAnKSl7XG4gICAgLy8gICAgICAgICB3b3JkQmFuay5wdXNoKHRoaXMuR2V0UHJvbnVuY2lhdGlvbkZvcldvcmQod29yZCkpO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHJldHVybiB3b3JkQmFuaztcbiAgICAvLyB9XG5cbiAgICAvLyBHZXRQcm9udW5jaWF0aW9uRm9yV29yZChyYXdXb3JkKXtcbiAgICAvLyAgICAgbGV0IHdvcmQgPSByYXdXb3JkLnRvTG93ZXJDYXNlKCk7XG4gICAgLy8gICAgIGlmICh3b3Jkc1t3b3JkXSl7XG4gICAgLy8gICAgICAgICByZXR1cm4gd29yZHNbd29yZF07XG4gICAgLy8gICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAvLyBJZiB0aGUgd29yZCBpc24ndCBpbiB0aGUgZGljdCwgaWdub3JlIGl0IGZvciBub3dcbiAgICAvLyAgICAgICAgIHJldHVybiBcIk5vbmVcIjtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuXG5cbn0iLCJjbGFzcyBNb2RlbExvYWRlciB7XG5cbiAgICAvKipcbiAgICAgKiBMb2FkcyBhIG1vZGVsIGFzeW5jaHJvbm91c2x5LiBFeHBlY3RzIGFuIG9iamVjdCBjb250YWluaW5nXG4gICAgICogdGhlIHBhdGggdG8gdGhlIG9iamVjdCwgdGhlIHJlbGF0aXZlIHBhdGggb2YgdGhlIE9CSiBmaWxlLFxuICAgICAqIGFuZCB0aGUgcmVsYXRpdmUgcGF0aCBvZiB0aGUgTVRMIGZpbGUuXG4gICAgICogXG4gICAgICogQW4gZXhhbXBsZTpcbiAgICAgKiBsZXQgbW9kZWxJbmZvID0ge1xuICAgICAqICAgICAgcGF0aDogXCIuLi9yZXNvdXJjZXMvb2JqL1wiLFxuICAgICAqICAgICAgb2JqRmlsZTogXCJ0ZXN0Lm9ialwiLFxuICAgICAqICAgICAgbXRsRmlsZTogXCJ0ZXN0Lm10bFwiXG4gICAgICogfVxuICAgICAqL1xuICAgIHN0YXRpYyBMb2FkT0JKKG1vZGVsSW5mbywgbG9hZGVkQ2FsbGJhY2spIHtcblxuICAgICAgICB2YXIgb25Qcm9ncmVzcyA9IGZ1bmN0aW9uKCB4aHIgKSB7XG4gICAgICAgICAgICBpZiAoIHhoci5sZW5ndGhDb21wdXRhYmxlICkge1xuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSB4aHIubG9hZGVkIC8geGhyLnRvdGFsICogMTAwO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBNYXRoLnJvdW5kKCBwZXJjZW50Q29tcGxldGUsIDIgKSArICclIGRvd25sb2FkZWQnICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvbkVycm9yID0gZnVuY3Rpb24oIHhociApIHtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbXRsTG9hZGVyID0gbmV3IFRIUkVFLk1UTExvYWRlcigpO1xuICAgICAgICBtdGxMb2FkZXIuc2V0UGF0aCggbW9kZWxJbmZvLnBhdGggKTtcblxuICAgICAgICBtdGxMb2FkZXIubG9hZCggbW9kZWxJbmZvLm10bEZpbGUsICggbWF0ZXJpYWxzICkgPT4ge1xuICAgICAgICAgICAgbWF0ZXJpYWxzLnByZWxvYWQoKTtcbiAgICAgICAgICAgIHZhciBvYmpMb2FkZXIgPSBuZXcgVEhSRUUuT0JKTG9hZGVyKCk7XG4gICAgICAgICAgICBvYmpMb2FkZXIuc2V0TWF0ZXJpYWxzKCBtYXRlcmlhbHMgKTtcbiAgICAgICAgICAgIG9iakxvYWRlci5zZXRQYXRoKCBtb2RlbEluZm8ucGF0aCApO1xuICAgICAgICAgICAgb2JqTG9hZGVyLmxvYWQoIG1vZGVsSW5mby5vYmpGaWxlLCAoIG9iamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICBsb2FkZWRDYWxsYmFjayhvYmplY3QpO1xuICAgICAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvciApO1xuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIExvYWRKU09OKHBhdGgsIGxvYWRlZENhbGxiYWNrKSB7XG5cbiAgICAgICAgdmFyIG9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiggeGhyICkge1xuICAgICAgICAgICAgaWYgKCB4aHIubGVuZ3RoQ29tcHV0YWJsZSApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0geGhyLmxvYWRlZCAvIHhoci50b3RhbCAqIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggTWF0aC5yb3VuZCggcGVyY2VudENvbXBsZXRlLCAyICkgKyAnJSBkb3dubG9hZGVkJyApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgb25FcnJvciA9IGZ1bmN0aW9uKCB4aHIgKSB7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5KU09OTG9hZGVyKCk7XG4gICAgICAgIGxvYWRlci5sb2FkKCBwYXRoLCAoIGdlb21ldHJ5LCBtYXRlcmlhbHMgKSA9PiB7XG4gICAgICAgICAgICAvLyBBcHBseSBza2lubmluZyB0byBlYWNoIG1hdGVyaWFsIHNvIHRoZSB2ZXJ0cyBhcmUgYWZmZWN0ZWQgYnkgYm9uZSBtb3ZlbWVudFxuICAgICAgICAgICAgZm9yKGxldCBtYXQgb2YgbWF0ZXJpYWxzKXtcbiAgICAgICAgICAgICAgICBtYXQuc2tpbm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG1lc2ggPSBuZXcgVEhSRUUuU2tpbm5lZE1lc2goIGdlb21ldHJ5LCBuZXcgVEhSRUUuTXVsdGlNYXRlcmlhbCggbWF0ZXJpYWxzICkgKTtcbiAgICAgICAgICAgIG1lc2gubmFtZSA9IFwiSm9uXCI7XG4gICAgICAgICAgICBsb2FkZWRDYWxsYmFjayhtZXNoKTtcbiAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvcik7XG4gICAgfVxuXG4gICAgc3RhdGljIExvYWRGQlgocGF0aCwgbG9hZGVkQ2FsbGJhY2spIHtcbiAgICAgICAgbGV0IG1hbmFnZXIgPSBuZXcgVEhSRUUuTG9hZGluZ01hbmFnZXIoKTtcbiAgICAgICAgbWFuYWdlci5vblByb2dyZXNzID0gZnVuY3Rpb24oIGl0ZW0sIGxvYWRlZCwgdG90YWwgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggaXRlbSwgbG9hZGVkLCB0b3RhbCApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBvblByb2dyZXNzID0gZnVuY3Rpb24oIHhociApIHtcbiAgICAgICAgICAgIGlmICggeGhyLmxlbmd0aENvbXB1dGFibGUgKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IHhoci5sb2FkZWQgLyB4aHIudG90YWwgKiAxMDA7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIE1hdGgucm91bmQoIHBlcmNlbnRDb21wbGV0ZSwgMiApICsgJyUgZG93bmxvYWRlZCcgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9uRXJyb3IgPSBmdW5jdGlvbiggeGhyICkge1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRkJYTG9hZGVyKCBtYW5hZ2VyICk7XG4gICAgICAgIGxvYWRlci5sb2FkKCBwYXRoLCAoIG9iamVjdCApID0+IHtcbiAgICAgICAgICAgIGxvYWRlZENhbGxiYWNrKG9iamVjdCk7XG4gICAgICAgIH0sIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgTW9kZWxMb2FkZXIgfTsiLCJjbGFzcyBEZXRlY3RvciB7XG5cbiAgICAvL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTE4NzEwNzcvcHJvcGVyLXdheS10by1kZXRlY3Qtd2ViZ2wtc3VwcG9ydFxuICAgIHN0YXRpYyBIYXNXZWJHTCgpIHtcbiAgICAgICAgaWYgKCEhd2luZG93LldlYkdMUmVuZGVyaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksXG4gICAgICAgICAgICAgICAgICAgIG5hbWVzID0gW1wid2ViZ2xcIiwgXCJleHBlcmltZW50YWwtd2ViZ2xcIiwgXCJtb3otd2ViZ2xcIiwgXCJ3ZWJraXQtM2RcIl0sXG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPDQ7aSsrKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KG5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQuZ2V0UGFyYW1ldGVyID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2ViR0wgaXMgZW5hYmxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHt9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlYkdMIGlzIHN1cHBvcnRlZCwgYnV0IGRpc2FibGVkXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2ViR0wgbm90IHN1cHBvcnRlZFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIEdldEVycm9ySFRNTChtZXNzYWdlID0gbnVsbCl7XG4gICAgICAgIGlmKG1lc3NhZ2UgPT0gbnVsbCl7XG4gICAgICAgICAgICBtZXNzYWdlID0gYFlvdXIgZ3JhcGhpY3MgY2FyZCBkb2VzIG5vdCBzZWVtIHRvIHN1cHBvcnQgXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cDovL2tocm9ub3Mub3JnL3dlYmdsL3dpa2kvR2V0dGluZ19hX1dlYkdMX0ltcGxlbWVudGF0aW9uXCI+V2ViR0w8L2E+LiA8YnI+XG4gICAgICAgICAgICAgICAgICAgICAgICBGaW5kIG91dCBob3cgdG8gZ2V0IGl0IDxhIGhyZWY9XCJodHRwOi8vZ2V0LndlYmdsLm9yZy9cIj5oZXJlPC9hPi5gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJuby13ZWJnbC1zdXBwb3J0XCI+XG4gICAgICAgIDxwIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgXG4gICAgfVxuXG59XG5cbmV4cG9ydCB7IERldGVjdG9yIH07IiwiIWZ1bmN0aW9uKHQsZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9ZSgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW10sZSk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/ZXhwb3J0cy5NaWRpQ29udmVydD1lKCk6dC5NaWRpQ29udmVydD1lKCl9KHRoaXMsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7ZnVuY3Rpb24gZShyKXtpZihuW3JdKXJldHVybiBuW3JdLmV4cG9ydHM7dmFyIGk9bltyXT17ZXhwb3J0czp7fSxpZDpyLGxvYWRlZDohMX07cmV0dXJuIHRbcl0uY2FsbChpLmV4cG9ydHMsaSxpLmV4cG9ydHMsZSksaS5sb2FkZWQ9ITAsaS5leHBvcnRzfXZhciBuPXt9O3JldHVybiBlLm09dCxlLmM9bixlLnA9XCJcIixlKDApfShbZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciByPW4oNyksaT1uKDIpLGE9e2luc3RydW1lbnRCeVBhdGNoSUQ6aS5pbnN0cnVtZW50QnlQYXRjaElELGluc3RydW1lbnRGYW1pbHlCeUlEOmkuaW5zdHJ1bWVudEZhbWlseUJ5SUQscGFyc2U6ZnVuY3Rpb24odCl7cmV0dXJuKG5ldyByLk1pZGkpLmRlY29kZSh0KX0sbG9hZDpmdW5jdGlvbih0LGUpe3ZhciBuPShuZXcgci5NaWRpKS5sb2FkKHQpO3JldHVybiBlJiZuLnRoZW4oZSksbn0sY3JlYXRlOmZ1bmN0aW9uKCl7cmV0dXJuIG5ldyByLk1pZGl9fTtlW1wiZGVmYXVsdFwiXT1hLHQuZXhwb3J0cz1hfSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCl7cmV0dXJuIHQucmVwbGFjZSgvXFx1MDAwMC9nLFwiXCIpfWZ1bmN0aW9uIHIodCxlKXtyZXR1cm4gNjAvZS5icG0qKHQvZS5QUFEpfWZ1bmN0aW9uIGkodCl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIHR9ZnVuY3Rpb24gYSh0KXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdH1mdW5jdGlvbiBvKHQpe3ZhciBlPVtcIkNcIixcIkMjXCIsXCJEXCIsXCJEI1wiLFwiRVwiLFwiRlwiLFwiRiNcIixcIkdcIixcIkcjXCIsXCJBXCIsXCJBI1wiLFwiQlwiXSxuPU1hdGguZmxvb3IodC8xMiktMSxyPXQlMTI7cmV0dXJuIGVbcl0rbn12YXIgcz1mdW5jdGlvbigpe3ZhciB0PS9eKFthLWddezF9KD86YnwjfHh8YmIpPykoLT9bMC05XSspL2k7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBhKGUpJiZ0LnRlc3QoZSl9fSgpLHU9ZnVuY3Rpb24oKXt2YXIgdD0vXihbYS1nXXsxfSg/OmJ8I3x4fGJiKT8pKC0/WzAtOV0rKS9pLGU9e2NiYjotMixjYjotMSxjOjAsXCJjI1wiOjEsY3g6MixkYmI6MCxkYjoxLGQ6MixcImQjXCI6MyxkeDo0LGViYjoyLGViOjMsZTo0LFwiZSNcIjo1LGV4OjYsZmJiOjMsZmI6NCxmOjUsXCJmI1wiOjYsZng6NyxnYmI6NSxnYjo2LGc6NyxcImcjXCI6OCxneDo5LGFiYjo3LGFiOjgsYTo5LFwiYSNcIjoxMCxheDoxMSxiYmI6OSxiYjoxMCxiOjExLFwiYiNcIjoxMixieDoxM307cmV0dXJuIGZ1bmN0aW9uKG4pe3ZhciByPXQuZXhlYyhuKSxpPXJbMV0sYT1yWzJdLG89ZVtpLnRvTG93ZXJDYXNlKCldO3JldHVybiBvKzEyKihwYXJzZUludChhKSsxKX19KCk7dC5leHBvcnRzPXtjbGVhbk5hbWU6bix0aWNrc1RvU2Vjb25kczpyLGlzU3RyaW5nOmEsaXNOdW1iZXI6aSxpc1BpdGNoOnMsbWlkaVRvUGl0Y2g6byxwaXRjaFRvTWlkaTp1fX0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtlLmluc3RydW1lbnRCeVBhdGNoSUQ9W1wiYWNvdXN0aWMgZ3JhbmQgcGlhbm9cIixcImJyaWdodCBhY291c3RpYyBwaWFub1wiLFwiZWxlY3RyaWMgZ3JhbmQgcGlhbm9cIixcImhvbmt5LXRvbmsgcGlhbm9cIixcImVsZWN0cmljIHBpYW5vIDFcIixcImVsZWN0cmljIHBpYW5vIDJcIixcImhhcnBzaWNob3JkXCIsXCJjbGF2aVwiLFwiY2VsZXN0YVwiLFwiZ2xvY2tlbnNwaWVsXCIsXCJtdXNpYyBib3hcIixcInZpYnJhcGhvbmVcIixcIm1hcmltYmFcIixcInh5bG9waG9uZVwiLFwidHVidWxhciBiZWxsc1wiLFwiZHVsY2ltZXJcIixcImRyYXdiYXIgb3JnYW5cIixcInBlcmN1c3NpdmUgb3JnYW5cIixcInJvY2sgb3JnYW5cIixcImNodXJjaCBvcmdhblwiLFwicmVlZCBvcmdhblwiLFwiYWNjb3JkaW9uXCIsXCJoYXJtb25pY2FcIixcInRhbmdvIGFjY29yZGlvblwiLFwiYWNvdXN0aWMgZ3VpdGFyIChueWxvbilcIixcImFjb3VzdGljIGd1aXRhciAoc3RlZWwpXCIsXCJlbGVjdHJpYyBndWl0YXIgKGphenopXCIsXCJlbGVjdHJpYyBndWl0YXIgKGNsZWFuKVwiLFwiZWxlY3RyaWMgZ3VpdGFyIChtdXRlZClcIixcIm92ZXJkcml2ZW4gZ3VpdGFyXCIsXCJkaXN0b3J0aW9uIGd1aXRhclwiLFwiZ3VpdGFyIGhhcm1vbmljc1wiLFwiYWNvdXN0aWMgYmFzc1wiLFwiZWxlY3RyaWMgYmFzcyAoZmluZ2VyKVwiLFwiZWxlY3RyaWMgYmFzcyAocGljaylcIixcImZyZXRsZXNzIGJhc3NcIixcInNsYXAgYmFzcyAxXCIsXCJzbGFwIGJhc3MgMlwiLFwic3ludGggYmFzcyAxXCIsXCJzeW50aCBiYXNzIDJcIixcInZpb2xpblwiLFwidmlvbGFcIixcImNlbGxvXCIsXCJjb250cmFiYXNzXCIsXCJ0cmVtb2xvIHN0cmluZ3NcIixcInBpenppY2F0byBzdHJpbmdzXCIsXCJvcmNoZXN0cmFsIGhhcnBcIixcInRpbXBhbmlcIixcInN0cmluZyBlbnNlbWJsZSAxXCIsXCJzdHJpbmcgZW5zZW1ibGUgMlwiLFwic3ludGhzdHJpbmdzIDFcIixcInN5bnRoc3RyaW5ncyAyXCIsXCJjaG9pciBhYWhzXCIsXCJ2b2ljZSBvb2hzXCIsXCJzeW50aCB2b2ljZVwiLFwib3JjaGVzdHJhIGhpdFwiLFwidHJ1bXBldFwiLFwidHJvbWJvbmVcIixcInR1YmFcIixcIm11dGVkIHRydW1wZXRcIixcImZyZW5jaCBob3JuXCIsXCJicmFzcyBzZWN0aW9uXCIsXCJzeW50aGJyYXNzIDFcIixcInN5bnRoYnJhc3MgMlwiLFwic29wcmFubyBzYXhcIixcImFsdG8gc2F4XCIsXCJ0ZW5vciBzYXhcIixcImJhcml0b25lIHNheFwiLFwib2JvZVwiLFwiZW5nbGlzaCBob3JuXCIsXCJiYXNzb29uXCIsXCJjbGFyaW5ldFwiLFwicGljY29sb1wiLFwiZmx1dGVcIixcInJlY29yZGVyXCIsXCJwYW4gZmx1dGVcIixcImJsb3duIGJvdHRsZVwiLFwic2hha3VoYWNoaVwiLFwid2hpc3RsZVwiLFwib2NhcmluYVwiLFwibGVhZCAxIChzcXVhcmUpXCIsXCJsZWFkIDIgKHNhd3Rvb3RoKVwiLFwibGVhZCAzIChjYWxsaW9wZSlcIixcImxlYWQgNCAoY2hpZmYpXCIsXCJsZWFkIDUgKGNoYXJhbmcpXCIsXCJsZWFkIDYgKHZvaWNlKVwiLFwibGVhZCA3IChmaWZ0aHMpXCIsXCJsZWFkIDggKGJhc3MgKyBsZWFkKVwiLFwicGFkIDEgKG5ldyBhZ2UpXCIsXCJwYWQgMiAod2FybSlcIixcInBhZCAzIChwb2x5c3ludGgpXCIsXCJwYWQgNCAoY2hvaXIpXCIsXCJwYWQgNSAoYm93ZWQpXCIsXCJwYWQgNiAobWV0YWxsaWMpXCIsXCJwYWQgNyAoaGFsbylcIixcInBhZCA4IChzd2VlcClcIixcImZ4IDEgKHJhaW4pXCIsXCJmeCAyIChzb3VuZHRyYWNrKVwiLFwiZnggMyAoY3J5c3RhbClcIixcImZ4IDQgKGF0bW9zcGhlcmUpXCIsXCJmeCA1IChicmlnaHRuZXNzKVwiLFwiZnggNiAoZ29ibGlucylcIixcImZ4IDcgKGVjaG9lcylcIixcImZ4IDggKHNjaS1maSlcIixcInNpdGFyXCIsXCJiYW5qb1wiLFwic2hhbWlzZW5cIixcImtvdG9cIixcImthbGltYmFcIixcImJhZyBwaXBlXCIsXCJmaWRkbGVcIixcInNoYW5haVwiLFwidGlua2xlIGJlbGxcIixcImFnb2dvXCIsXCJzdGVlbCBkcnVtc1wiLFwid29vZGJsb2NrXCIsXCJ0YWlrbyBkcnVtXCIsXCJtZWxvZGljIHRvbVwiLFwic3ludGggZHJ1bVwiLFwicmV2ZXJzZSBjeW1iYWxcIixcImd1aXRhciBmcmV0IG5vaXNlXCIsXCJicmVhdGggbm9pc2VcIixcInNlYXNob3JlXCIsXCJiaXJkIHR3ZWV0XCIsXCJ0ZWxlcGhvbmUgcmluZ1wiLFwiaGVsaWNvcHRlclwiLFwiYXBwbGF1c2VcIixcImd1bnNob3RcIl0sZS5pbnN0cnVtZW50RmFtaWx5QnlJRD1bXCJwaWFub1wiLFwiY2hyb21hdGljIHBlcmN1c3Npb25cIixcIm9yZ2FuXCIsXCJndWl0YXJcIixcImJhc3NcIixcInN0cmluZ3NcIixcImVuc2VtYmxlXCIsXCJicmFzc1wiLFwicmVlZFwiLFwicGlwZVwiLFwic3ludGggbGVhZFwiLFwic3ludGggcGFkXCIsXCJzeW50aCBlZmZlY3RzXCIsXCJldGhuaWNcIixcInBlcmN1c3NpdmVcIixcInNvdW5kIGVmZmVjdHNcIl19LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih0LGUpe3ZhciBuPTAscj10Lmxlbmd0aCxpPXI7aWYocj4wJiZ0W3ItMV0udGltZTw9ZSlyZXR1cm4gci0xO2Zvcig7aT5uOyl7dmFyIGE9TWF0aC5mbG9vcihuKyhpLW4pLzIpLG89dFthXSxzPXRbYSsxXTtpZihvLnRpbWU9PT1lKXtmb3IodmFyIHU9YTt1PHQubGVuZ3RoO3UrKyl7dmFyIGM9dFt1XTtjLnRpbWU9PT1lJiYoYT11KX1yZXR1cm4gYX1pZihvLnRpbWU8ZSYmcy50aW1lPmUpcmV0dXJuIGE7by50aW1lPmU/aT1hOm8udGltZTxlJiYobj1hKzEpfXJldHVybi0xfWZ1bmN0aW9uIHIodCxlKXtpZih0Lmxlbmd0aCl7dmFyIHI9bih0LGUudGltZSk7dC5zcGxpY2UocisxLDAsZSl9ZWxzZSB0LnB1c2goZSl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5CaW5hcnlJbnNlcnQ9cn0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgcj1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fXJldHVybiBmdW5jdGlvbihlLG4scil7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksciYmdChlLHIpLGV9fSgpLGk9ezE6XCJtb2R1bGF0aW9uV2hlZWxcIiwyOlwiYnJlYXRoXCIsNDpcImZvb3RDb250cm9sbGVyXCIsNTpcInBvcnRhbWVudG9UaW1lXCIsNzpcInZvbHVtZVwiLDg6XCJiYWxhbmNlXCIsMTA6XCJwYW5cIiw2NDpcInN1c3RhaW5cIiw2NTpcInBvcnRhbWVudG9UaW1lXCIsNjY6XCJzb3N0ZW51dG9cIiw2NzpcInNvZnRQZWRhbFwiLDY4OlwibGVnYXRvRm9vdHN3aXRjaFwiLDg0OlwicG9ydGFtZW50b0NvbnRyb1wifSxhPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChlLHIsaSl7bih0aGlzLHQpLHRoaXMubnVtYmVyPWUsdGhpcy50aW1lPXIsdGhpcy52YWx1ZT1pfXJldHVybiByKHQsW3trZXk6XCJuYW1lXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGkuaGFzT3duUHJvcGVydHkodGhpcy5udW1iZXIpP2lbdGhpcy5udW1iZXJdOnZvaWQgMH19XSksdH0oKTtlLkNvbnRyb2w9YX0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQpe2Zvcih2YXIgZT17UFBROnQuaGVhZGVyLnRpY2tzUGVyQmVhdH0sbj0wO248dC50cmFja3MubGVuZ3RoO24rKylmb3IodmFyIHI9dC50cmFja3Nbbl0saT0wO2k8ci5sZW5ndGg7aSsrKXt2YXIgYT1yW2ldO1wibWV0YVwiPT09YS50eXBlJiYoXCJ0aW1lU2lnbmF0dXJlXCI9PT1hLnN1YnR5cGU/ZS50aW1lU2lnbmF0dXJlPVthLm51bWVyYXRvcixhLmRlbm9taW5hdG9yXTpcInNldFRlbXBvXCI9PT1hLnN1YnR5cGUmJihlLmJwbXx8KGUuYnBtPTZlNy9hLm1pY3Jvc2Vjb25kc1BlckJlYXQpKSl9cmV0dXJuIGUuYnBtPWUuYnBtfHwxMjAsZX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLnBhcnNlSGVhZGVyPW59LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih0LGUpe2Zvcih2YXIgbj0wO248dC5sZW5ndGg7bisrKXt2YXIgcj10W25dLGk9ZVtuXTtpZihyLmxlbmd0aD5pKXJldHVybiEwfXJldHVybiExfWZ1bmN0aW9uIHIodCxlLG4pe2Zvcih2YXIgcj0wLGk9MS8wLGE9MDthPHQubGVuZ3RoO2ErKyl7dmFyIG89dFthXSxzPWVbYV07b1tzXSYmb1tzXS50aW1lPGkmJihyPWEsaT1vW3NdLnRpbWUpfW5bcl0odFtyXVtlW3JdXSksZVtyXSs9MX1mdW5jdGlvbiBpKCl7Zm9yKHZhciB0PWFyZ3VtZW50cy5sZW5ndGgsZT1BcnJheSh0KSxpPTA7dD5pO2krKyllW2ldPWFyZ3VtZW50c1tpXTtmb3IodmFyIGE9ZS5maWx0ZXIoZnVuY3Rpb24odCxlKXtyZXR1cm4gZSUyPT09MH0pLG89bmV3IFVpbnQzMkFycmF5KGEubGVuZ3RoKSxzPWUuZmlsdGVyKGZ1bmN0aW9uKHQsZSl7cmV0dXJuIGUlMj09PTF9KTtuKGEsbyk7KXIoYSxvLHMpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuTWVyZ2U9aX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1mdW5jdGlvbiBpKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLk1pZGk9dm9pZCAwO3ZhciBhPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixyKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxyJiZ0KGUsciksZX19KCksbz1uKDExKSxzPXIobyksdT1uKDEwKSxjPXIodSksaD1uKDEpLGY9cihoKSxkPW4oOSksbD1uKDUpLHA9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7aSh0aGlzLHQpLHRoaXMuaGVhZGVyPXticG06MTIwLHRpbWVTaWduYXR1cmU6WzQsNF0sUFBROjQ4MH0sdGhpcy50cmFja3M9W119cmV0dXJuIGEodCxbe2tleTpcImxvYWRcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOm51bGwscj1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06XCJHRVRcIjtyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oaSxhKXt2YXIgbz1uZXcgWE1MSHR0cFJlcXVlc3Q7by5vcGVuKHIsdCksby5yZXNwb25zZVR5cGU9XCJhcnJheWJ1ZmZlclwiLG8uYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixmdW5jdGlvbigpezQ9PT1vLnJlYWR5U3RhdGUmJjIwMD09PW8uc3RhdHVzP2koZS5kZWNvZGUoby5yZXNwb25zZSkpOmEoby5zdGF0dXMpfSksby5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIixhKSxvLnNlbmQobil9KX19LHtrZXk6XCJkZWNvZGVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzO2lmKHQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcil7dmFyIG49bmV3IFVpbnQ4QXJyYXkodCk7dD1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbil9dmFyIHI9KDAsc1tcImRlZmF1bHRcIl0pKHQpO3JldHVybiB0aGlzLmhlYWRlcj0oMCxsLnBhcnNlSGVhZGVyKShyKSx0aGlzLnRyYWNrcz1bXSxyLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHQpe3ZhciBuPW5ldyBkLlRyYWNrO2UudHJhY2tzLnB1c2gobik7dmFyIHI9MDt0LmZvckVhY2goZnVuY3Rpb24odCl7cis9ZltcImRlZmF1bHRcIl0udGlja3NUb1NlY29uZHModC5kZWx0YVRpbWUsZS5oZWFkZXIpLFwibWV0YVwiPT09dC50eXBlJiZcInRyYWNrTmFtZVwiPT09dC5zdWJ0eXBlP24ubmFtZT1mW1wiZGVmYXVsdFwiXS5jbGVhbk5hbWUodC50ZXh0KTpcIm5vdGVPblwiPT09dC5zdWJ0eXBlP24ubm90ZU9uKHQubm90ZU51bWJlcixyLHQudmVsb2NpdHkvMTI3KTpcIm5vdGVPZmZcIj09PXQuc3VidHlwZT9uLm5vdGVPZmYodC5ub3RlTnVtYmVyLHIpOlwiY29udHJvbGxlclwiPT09dC5zdWJ0eXBlJiZ0LmNvbnRyb2xsZXJUeXBlP24uY2ModC5jb250cm9sbGVyVHlwZSxyLHQudmFsdWUvMTI3KTpcIm1ldGFcIj09PXQudHlwZSYmXCJpbnN0cnVtZW50TmFtZVwiPT09dC5zdWJ0eXBlP24uaW5zdHJ1bWVudD10LnRleHQ6XCJjaGFubmVsXCI9PT10LnR5cGUmJlwicHJvZ3JhbUNoYW5nZVwiPT09dC5zdWJ0eXBlJiZuLnBhdGNoKHQucHJvZ3JhbU51bWJlcil9KX0pLHRoaXN9fSx7a2V5OlwiZW5jb2RlXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLGU9bmV3IGNbXCJkZWZhdWx0XCJdLkZpbGUoe3RpY2tzOnRoaXMuaGVhZGVyLlBQUX0pO3JldHVybiB0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKG4scil7dmFyIGk9ZS5hZGRUcmFjaygpO2kuc2V0VGVtcG8odC5icG0pLG4uZW5jb2RlKGksdC5oZWFkZXIpfSksZS50b0J5dGVzKCl9fSx7a2V5OlwidG9BcnJheVwiLHZhbHVlOmZ1bmN0aW9uKCl7Zm9yKHZhciB0PXRoaXMuZW5jb2RlKCksZT1uZXcgQXJyYXkodC5sZW5ndGgpLG49MDtuPHQubGVuZ3RoO24rKyllW25dPXQuY2hhckNvZGVBdChuKTtyZXR1cm4gZX19LHtrZXk6XCJ0cmFja1wiLHZhbHVlOmZ1bmN0aW9uIGUodCl7dmFyIGU9bmV3IGQuVHJhY2sodCk7cmV0dXJuIHRoaXMudHJhY2tzLnB1c2goZSksZX19LHtrZXk6XCJnZXRcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gZltcImRlZmF1bHRcIl0uaXNOdW1iZXIodCk/dGhpcy50cmFja3NbdF06dGhpcy50cmFja3MuZmluZChmdW5jdGlvbihlKXtyZXR1cm4gZS5uYW1lPT09dH0pfX0se2tleTpcInNsaWNlXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06MCxuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTp0aGlzLmR1cmF0aW9uLHI9bmV3IHQ7cmV0dXJuIHIuaGVhZGVyPXRoaXMuaGVhZGVyLHIudHJhY2tzPXRoaXMudHJhY2tzLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdC5zbGljZShlLG4pfSkscn19LHtrZXk6XCJzdGFydFRpbWVcIixnZXQ6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnRyYWNrcy5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIHQuc3RhcnRUaW1lfSk7cmV0dXJuIE1hdGgubWluLmFwcGx5KE1hdGgsdCl9fSx7a2V5OlwiYnBtXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaGVhZGVyLmJwbX0sc2V0OmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuaGVhZGVyLmJwbTt0aGlzLmhlYWRlci5icG09dDt2YXIgbj1lL3Q7dGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbih0KXtyZXR1cm4gdC5zY2FsZShuKX0pfX0se2tleTpcInRpbWVTaWduYXR1cmVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oZWFkZXIudGltZVNpZ25hdHVyZX0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuaGVhZGVyLnRpbWVTaWduYXR1cmU9dGltZVNpZ25hdHVyZX19LHtrZXk6XCJkdXJhdGlvblwiLGdldDpmdW5jdGlvbigpe3ZhciB0PXRoaXMudHJhY2tzLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdC5kdXJhdGlvbn0pO3JldHVybiBNYXRoLm1heC5hcHBseShNYXRoLHQpfX1dKSx0fSgpO2UuTWlkaT1wfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIGkodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuTm90ZT12b2lkIDA7dmFyIGE9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLHIpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLHImJnQoZSxyKSxlfX0oKSxvPW4oMSkscz1yKG8pLHU9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGUsbil7dmFyIHI9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOjAsYT1hcmd1bWVudHMubGVuZ3RoPjMmJnZvaWQgMCE9PWFyZ3VtZW50c1szXT9hcmd1bWVudHNbM106MTtpZihpKHRoaXMsdCksdGhpcy5taWRpLHNbXCJkZWZhdWx0XCJdLmlzTnVtYmVyKGUpKXRoaXMubWlkaT1lO2Vsc2V7aWYoIXNbXCJkZWZhdWx0XCJdLmlzUGl0Y2goZSkpdGhyb3cgbmV3IEVycm9yKFwidGhlIG1pZGkgdmFsdWUgbXVzdCBlaXRoZXIgYmUgaW4gUGl0Y2ggTm90YXRpb24gKGUuZy4gQyM0KSBvciBhIG1pZGkgdmFsdWVcIik7dGhpcy5uYW1lPWV9dGhpcy50aW1lPW4sdGhpcy5kdXJhdGlvbj1yLHRoaXMudmVsb2NpdHk9YX1yZXR1cm4gYSh0LFt7a2V5OlwibWF0Y2hcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gc1tcImRlZmF1bHRcIl0uaXNOdW1iZXIodCk/dGhpcy5taWRpPT09dDpzW1wiZGVmYXVsdFwiXS5pc1BpdGNoKHQpP3RoaXMubmFtZS50b0xvd2VyQ2FzZSgpPT09dC50b0xvd2VyQ2FzZSgpOnZvaWQgMH19LHtrZXk6XCJ0b0pTT05cIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybntuYW1lOnRoaXMubmFtZSxtaWRpOnRoaXMubWlkaSx0aW1lOnRoaXMudGltZSx2ZWxvY2l0eTp0aGlzLnZlbG9jaXR5LGR1cmF0aW9uOnRoaXMuZHVyYXRpb259fX0se2tleTpcIm5hbWVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc1tcImRlZmF1bHRcIl0ubWlkaVRvUGl0Y2godGhpcy5taWRpKX0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMubWlkaT1zW1wiZGVmYXVsdFwiXS5waXRjaFRvTWlkaSh0KX19LHtrZXk6XCJub3RlT25cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aW1lfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy50aW1lPXR9fSx7a2V5Olwibm90ZU9mZlwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbWUrdGhpcy5kdXJhdGlvbn0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuZHVyYXRpb249dC10aGlzLnRpbWV9fV0pLHR9KCk7ZS5Ob3RlPXV9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLlRyYWNrPXZvaWQgMDt2YXIgaT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fXJldHVybiBmdW5jdGlvbihlLG4scil7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksciYmdChlLHIpLGV9fSgpLGE9bigzKSxvPW4oNCkscz1uKDYpLHU9big4KSxjPW4oMiksaD1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06XCJcIixuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTotMTtyKHRoaXMsdCksdGhpcy5uYW1lPWUsdGhpcy5ub3Rlcz1bXSx0aGlzLmNvbnRyb2xDaGFuZ2VzPXt9LHRoaXMuaW5zdHJ1bWVudE51bWJlcj1ufXJldHVybiBpKHQsW3trZXk6XCJub3RlXCIsdmFsdWU6ZnVuY3Rpb24gZSh0LG4pe3ZhciByPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXTowLGk9YXJndW1lbnRzLmxlbmd0aD4zJiZ2b2lkIDAhPT1hcmd1bWVudHNbM10/YXJndW1lbnRzWzNdOjEsZT1uZXcgdS5Ob3RlKHQsbixyLGkpO3JldHVybigwLGEuQmluYXJ5SW5zZXJ0KSh0aGlzLm5vdGVzLGUpLHRoaXN9fSx7a2V5Olwibm90ZU9uXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXt2YXIgbj1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06MSxyPW5ldyB1Lk5vdGUodCxlLDAsbik7cmV0dXJuKDAsYS5CaW5hcnlJbnNlcnQpKHRoaXMubm90ZXMsciksdGhpc319LHtrZXk6XCJub3RlT2ZmXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtmb3IodmFyIG49MDtuPHRoaXMubm90ZXMubGVuZ3RoO24rKyl7dmFyIHI9dGhpcy5ub3Rlc1tuXTtpZihyLm1hdGNoKHQpJiYwPT09ci5kdXJhdGlvbil7ci5ub3RlT2ZmPWU7YnJlYWt9fXJldHVybiB0aGlzfX0se2tleTpcImNjXCIsdmFsdWU6ZnVuY3Rpb24gbih0LGUscil7dGhpcy5jb250cm9sQ2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSh0KXx8KHRoaXMuY29udHJvbENoYW5nZXNbdF09W10pO3ZhciBuPW5ldyBvLkNvbnRyb2wodCxlLHIpO3JldHVybigwLGEuQmluYXJ5SW5zZXJ0KSh0aGlzLmNvbnRyb2xDaGFuZ2VzW3RdLG4pLHRoaXN9fSx7a2V5OlwicGF0Y2hcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5pbnN0cnVtZW50TnVtYmVyPXQsdGhpc319LHtrZXk6XCJzY2FsZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLm5vdGVzLmZvckVhY2goZnVuY3Rpb24oZSl7ZS50aW1lKj10LGUuZHVyYXRpb24qPXR9KSx0aGlzfX0se2tleTpcInNsaWNlXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06MCxuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTp0aGlzLmR1cmF0aW9uLHI9TWF0aC5tYXgodGhpcy5ub3Rlcy5maW5kSW5kZXgoZnVuY3Rpb24odCl7cmV0dXJuIHQudGltZT49ZX0pLDApLGk9dGhpcy5ub3Rlcy5maW5kSW5kZXgoZnVuY3Rpb24odCl7cmV0dXJuIHQubm90ZU9mZj49bn0pKzEsYT1uZXcgdCh0aGlzLm5hbWUpO3JldHVybiBhLm5vdGVzPXRoaXMubm90ZXMuc2xpY2UocixpKSxhLm5vdGVzLmZvckVhY2goZnVuY3Rpb24odCl7cmV0dXJuIHQudGltZT10LnRpbWUtZX0pLGF9fSx7a2V5OlwiZW5jb2RlXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBuKHQpe3ZhciBlPU1hdGguZmxvb3Iocip0KSxuPU1hdGgubWF4KGUtaSwwKTtyZXR1cm4gaT1lLG59dmFyIHI9ZS5QUFEvKDYwL2UuYnBtKSxpPTAsYT0wOy0xIT09dGhpcy5pbnN0cnVtZW50TnVtYmVyJiZ0Lmluc3RydW1lbnQoYSx0aGlzLmluc3RydW1lbnROdW1iZXIpLCgwLHMuTWVyZ2UpKHRoaXMubm90ZU9ucyxmdW5jdGlvbihlKXt0LmFkZE5vdGVPbihhLGUubmFtZSxuKGUudGltZSksTWF0aC5mbG9vcigxMjcqZS52ZWxvY2l0eSkpfSx0aGlzLm5vdGVPZmZzLGZ1bmN0aW9uKGUpe3QuYWRkTm90ZU9mZihhLGUubmFtZSxuKGUudGltZSkpfSl9fSx7a2V5Olwibm90ZU9uc1wiLGdldDpmdW5jdGlvbigpe3ZhciB0PVtdO3JldHVybiB0aGlzLm5vdGVzLmZvckVhY2goZnVuY3Rpb24oZSl7dC5wdXNoKHt0aW1lOmUubm90ZU9uLG1pZGk6ZS5taWRpLG5hbWU6ZS5uYW1lLHZlbG9jaXR5OmUudmVsb2NpdHl9KX0pLHR9fSx7a2V5Olwibm90ZU9mZnNcIixnZXQ6ZnVuY3Rpb24oKXt2YXIgdD1bXTtyZXR1cm4gdGhpcy5ub3Rlcy5mb3JFYWNoKGZ1bmN0aW9uKGUpe3QucHVzaCh7dGltZTplLm5vdGVPZmYsbWlkaTplLm1pZGksbmFtZTplLm5hbWV9KX0pLHR9fSx7a2V5OlwibGVuZ3RoXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubm90ZXMubGVuZ3RofX0se2tleTpcInN0YXJ0VGltZVwiLGdldDpmdW5jdGlvbigpe2lmKHRoaXMubm90ZXMubGVuZ3RoKXt2YXIgdD10aGlzLm5vdGVzWzBdO3JldHVybiB0Lm5vdGVPbn1yZXR1cm4gMH19LHtrZXk6XCJkdXJhdGlvblwiLGdldDpmdW5jdGlvbigpe2lmKHRoaXMubm90ZXMubGVuZ3RoKXt2YXIgdD10aGlzLm5vdGVzW3RoaXMubm90ZXMubGVuZ3RoLTFdO3JldHVybiB0Lm5vdGVPZmZ9cmV0dXJuIDB9fSx7a2V5OlwiaW5zdHJ1bWVudFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBjLmluc3RydW1lbnRCeVBhdGNoSURbdGhpcy5pbnN0cnVtZW50TnVtYmVyXX0sc2V0OmZ1bmN0aW9uKHQpe3ZhciBlPWMuaW5zdHJ1bWVudEJ5UGF0Y2hJRC5pbmRleE9mKHQpOy0xIT09ZSYmKHRoaXMuaW5zdHJ1bWVudE51bWJlcj1lKX19LHtrZXk6XCJpbnN0cnVtZW50RmFtaWx5XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGMuaW5zdHJ1bWVudEZhbWlseUJ5SURbTWF0aC5mbG9vcih0aGlzLmluc3RydW1lbnROdW1iZXIvOCldfX1dKSx0fSgpO2UuVHJhY2s9aH0sZnVuY3Rpb24odCxlLG4peyhmdW5jdGlvbih0KXt2YXIgbj17fTshZnVuY3Rpb24odCl7dmFyIGU9dC5ERUZBVUxUX1ZPTFVNRT05MCxuPSh0LkRFRkFVTFRfRFVSQVRJT049MTI4LHQuREVGQVVMVF9DSEFOTkVMPTAse21pZGlfbGV0dGVyX3BpdGNoZXM6e2E6MjEsYjoyMyxjOjEyLGQ6MTQsZToxNixmOjE3LGc6MTl9LG1pZGlQaXRjaEZyb21Ob3RlOmZ1bmN0aW9uKHQpe3ZhciBlPS8oW2EtZ10pKCMrfGIrKT8oWzAtOV0rKSQvaS5leGVjKHQpLHI9ZVsxXS50b0xvd2VyQ2FzZSgpLGk9ZVsyXXx8XCJcIixhPXBhcnNlSW50KGVbM10sMTApO3JldHVybiAxMiphK24ubWlkaV9sZXR0ZXJfcGl0Y2hlc1tyXSsoXCIjXCI9PWkuc3Vic3RyKDAsMSk/MTotMSkqaS5sZW5ndGh9LGVuc3VyZU1pZGlQaXRjaDpmdW5jdGlvbih0KXtyZXR1cm5cIm51bWJlclwiIT10eXBlb2YgdCYmL1teMC05XS8udGVzdCh0KT9uLm1pZGlQaXRjaEZyb21Ob3RlKHQpOnBhcnNlSW50KHQsMTApfSxtaWRpX3BpdGNoZXNfbGV0dGVyOnsxMjpcImNcIiwxMzpcImMjXCIsMTQ6XCJkXCIsMTU6XCJkI1wiLDE2OlwiZVwiLDE3OlwiZlwiLDE4OlwiZiNcIiwxOTpcImdcIiwyMDpcImcjXCIsMjE6XCJhXCIsMjI6XCJhI1wiLDIzOlwiYlwifSxtaWRpX2ZsYXR0ZW5lZF9ub3Rlczp7XCJhI1wiOlwiYmJcIixcImMjXCI6XCJkYlwiLFwiZCNcIjpcImViXCIsXCJmI1wiOlwiZ2JcIixcImcjXCI6XCJhYlwifSxub3RlRnJvbU1pZGlQaXRjaDpmdW5jdGlvbih0LGUpe3ZhciByLGk9MCxhPXQsZT1lfHwhMTtyZXR1cm4gdD4yMyYmKGk9TWF0aC5mbG9vcih0LzEyKS0xLGE9dC0xMippKSxyPW4ubWlkaV9waXRjaGVzX2xldHRlclthXSxlJiZyLmluZGV4T2YoXCIjXCIpPjAmJihyPW4ubWlkaV9mbGF0dGVuZWRfbm90ZXNbcl0pLHIraX0sbXBxbkZyb21CcG06ZnVuY3Rpb24odCl7dmFyIGU9TWF0aC5mbG9vcig2ZTcvdCksbj1bXTtkbyBuLnVuc2hpZnQoMjU1JmUpLGU+Pj04O3doaWxlKGUpO2Zvcig7bi5sZW5ndGg8Mzspbi5wdXNoKDApO3JldHVybiBufSxicG1Gcm9tTXBxbjpmdW5jdGlvbih0KXt2YXIgZT10O2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB0WzBdKXtlPTA7Zm9yKHZhciBuPTAscj10Lmxlbmd0aC0xO3I+PTA7KytuLC0tcillfD10W25dPDxyfXJldHVybiBNYXRoLmZsb29yKDZlNy90KX0sY29kZXMyU3RyOmZ1bmN0aW9uKHQpe3JldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsdCl9LHN0cjJCeXRlczpmdW5jdGlvbih0LGUpe2lmKGUpZm9yKDt0Lmxlbmd0aC8yPGU7KXQ9XCIwXCIrdDtmb3IodmFyIG49W10scj10Lmxlbmd0aC0xO3I+PTA7ci09Mil7dmFyIGk9MD09PXI/dFtyXTp0W3ItMV0rdFtyXTtuLnVuc2hpZnQocGFyc2VJbnQoaSwxNikpfXJldHVybiBufSx0cmFuc2xhdGVUaWNrVGltZTpmdW5jdGlvbih0KXtmb3IodmFyIGU9MTI3JnQ7dD4+PTc7KWU8PD04LGV8PTEyNyZ0fDEyODtmb3IodmFyIG49W107Oyl7aWYobi5wdXNoKDI1NSZlKSwhKDEyOCZlKSlicmVhaztlPj49OH1yZXR1cm4gbn19KSxyPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzP3ZvaWQoIXR8fG51bGw9PT10LnR5cGUmJnZvaWQgMD09PXQudHlwZXx8bnVsbD09PXQuY2hhbm5lbCYmdm9pZCAwPT09dC5jaGFubmVsfHxudWxsPT09dC5wYXJhbTEmJnZvaWQgMD09PXQucGFyYW0xfHwodGhpcy5zZXRUaW1lKHQudGltZSksdGhpcy5zZXRUeXBlKHQudHlwZSksdGhpcy5zZXRDaGFubmVsKHQuY2hhbm5lbCksdGhpcy5zZXRQYXJhbTEodC5wYXJhbTEpLHRoaXMuc2V0UGFyYW0yKHQucGFyYW0yKSkpOm5ldyByKHQpfTtyLk5PVEVfT0ZGPTEyOCxyLk5PVEVfT049MTQ0LHIuQUZURVJfVE9VQ0g9MTYwLHIuQ09OVFJPTExFUj0xNzYsci5QUk9HUkFNX0NIQU5HRT0xOTIsci5DSEFOTkVMX0FGVEVSVE9VQ0g9MjA4LHIuUElUQ0hfQkVORD0yMjQsci5wcm90b3R5cGUuc2V0VGltZT1mdW5jdGlvbih0KXt0aGlzLnRpbWU9bi50cmFuc2xhdGVUaWNrVGltZSh0fHwwKX0sci5wcm90b3R5cGUuc2V0VHlwZT1mdW5jdGlvbih0KXtpZih0PHIuTk9URV9PRkZ8fHQ+ci5QSVRDSF9CRU5EKXRocm93IG5ldyBFcnJvcihcIlRyeWluZyB0byBzZXQgYW4gdW5rbm93biBldmVudDogXCIrdCk7dGhpcy50eXBlPXR9LHIucHJvdG90eXBlLnNldENoYW5uZWw9ZnVuY3Rpb24odCl7aWYoMD50fHx0PjE1KXRocm93IG5ldyBFcnJvcihcIkNoYW5uZWwgaXMgb3V0IG9mIGJvdW5kcy5cIik7dGhpcy5jaGFubmVsPXR9LHIucHJvdG90eXBlLnNldFBhcmFtMT1mdW5jdGlvbih0KXt0aGlzLnBhcmFtMT10fSxyLnByb3RvdHlwZS5zZXRQYXJhbTI9ZnVuY3Rpb24odCl7dGhpcy5wYXJhbTI9dH0sci5wcm90b3R5cGUudG9CeXRlcz1mdW5jdGlvbigpe3ZhciB0PVtdLGU9dGhpcy50eXBlfDE1JnRoaXMuY2hhbm5lbDtyZXR1cm4gdC5wdXNoLmFwcGx5KHQsdGhpcy50aW1lKSx0LnB1c2goZSksdC5wdXNoKHRoaXMucGFyYW0xKSx2b2lkIDAhPT10aGlzLnBhcmFtMiYmbnVsbCE9PXRoaXMucGFyYW0yJiZ0LnB1c2godGhpcy5wYXJhbTIpLHR9O3ZhciBpPWZ1bmN0aW9uKHQpe2lmKCF0aGlzKXJldHVybiBuZXcgaSh0KTt0aGlzLnNldFRpbWUodC50aW1lKSx0aGlzLnNldFR5cGUodC50eXBlKSx0aGlzLnNldERhdGEodC5kYXRhKX07aS5TRVFVRU5DRT0wLGkuVEVYVD0xLGkuQ09QWVJJR0hUPTIsaS5UUkFDS19OQU1FPTMsaS5JTlNUUlVNRU5UPTQsaS5MWVJJQz01LGkuTUFSS0VSPTYsaS5DVUVfUE9JTlQ9NyxpLkNIQU5ORUxfUFJFRklYPTMyLGkuRU5EX09GX1RSQUNLPTQ3LGkuVEVNUE89ODEsaS5TTVBURT04NCxpLlRJTUVfU0lHPTg4LGkuS0VZX1NJRz04OSxpLlNFUV9FVkVOVD0xMjcsaS5wcm90b3R5cGUuc2V0VGltZT1mdW5jdGlvbih0KXt0aGlzLnRpbWU9bi50cmFuc2xhdGVUaWNrVGltZSh0fHwwKX0saS5wcm90b3R5cGUuc2V0VHlwZT1mdW5jdGlvbih0KXt0aGlzLnR5cGU9dH0saS5wcm90b3R5cGUuc2V0RGF0YT1mdW5jdGlvbih0KXt0aGlzLmRhdGE9dH0saS5wcm90b3R5cGUudG9CeXRlcz1mdW5jdGlvbigpe2lmKCF0aGlzLnR5cGUpdGhyb3cgbmV3IEVycm9yKFwiVHlwZSBmb3IgbWV0YS1ldmVudCBub3Qgc3BlY2lmaWVkLlwiKTt2YXIgdD1bXTtpZih0LnB1c2guYXBwbHkodCx0aGlzLnRpbWUpLHQucHVzaCgyNTUsdGhpcy50eXBlKSxBcnJheS5pc0FycmF5KHRoaXMuZGF0YSkpdC5wdXNoKHRoaXMuZGF0YS5sZW5ndGgpLHQucHVzaC5hcHBseSh0LHRoaXMuZGF0YSk7ZWxzZSBpZihcIm51bWJlclwiPT10eXBlb2YgdGhpcy5kYXRhKXQucHVzaCgxLHRoaXMuZGF0YSk7ZWxzZSBpZihudWxsIT09dGhpcy5kYXRhJiZ2b2lkIDAhPT10aGlzLmRhdGEpe3QucHVzaCh0aGlzLmRhdGEubGVuZ3RoKTt2YXIgZT10aGlzLmRhdGEuc3BsaXQoXCJcIikubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0LmNoYXJDb2RlQXQoMCl9KTt0LnB1c2guYXBwbHkodCxlKX1lbHNlIHQucHVzaCgwKTtyZXR1cm4gdH07dmFyIGE9ZnVuY3Rpb24odCl7aWYoIXRoaXMpcmV0dXJuIG5ldyBhKHQpO3ZhciBlPXR8fHt9O3RoaXMuZXZlbnRzPWUuZXZlbnRzfHxbXX07YS5TVEFSVF9CWVRFUz1bNzcsODQsMTE0LDEwN10sYS5FTkRfQllURVM9WzAsMjU1LDQ3LDBdLGEucHJvdG90eXBlLmFkZEV2ZW50PWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmV2ZW50cy5wdXNoKHQpLHRoaXN9LGEucHJvdG90eXBlLmFkZE5vdGVPbj1hLnByb3RvdHlwZS5ub3RlT249ZnVuY3Rpb24odCxpLGEsbyl7cmV0dXJuIHRoaXMuZXZlbnRzLnB1c2gobmV3IHIoe3R5cGU6ci5OT1RFX09OLGNoYW5uZWw6dCxwYXJhbTE6bi5lbnN1cmVNaWRpUGl0Y2goaSkscGFyYW0yOm98fGUsdGltZTphfHwwfSkpLHRoaXN9LGEucHJvdG90eXBlLmFkZE5vdGVPZmY9YS5wcm90b3R5cGUubm90ZU9mZj1mdW5jdGlvbih0LGksYSxvKXtyZXR1cm4gdGhpcy5ldmVudHMucHVzaChuZXcgcih7dHlwZTpyLk5PVEVfT0ZGLGNoYW5uZWw6dCxwYXJhbTE6bi5lbnN1cmVNaWRpUGl0Y2goaSkscGFyYW0yOm98fGUsdGltZTphfHwwfSkpLHRoaXN9LGEucHJvdG90eXBlLmFkZE5vdGU9YS5wcm90b3R5cGUubm90ZT1mdW5jdGlvbih0LGUsbixyLGkpe3JldHVybiB0aGlzLm5vdGVPbih0LGUscixpKSxuJiZ0aGlzLm5vdGVPZmYodCxlLG4saSksdGhpc30sYS5wcm90b3R5cGUuYWRkQ2hvcmQ9YS5wcm90b3R5cGUuY2hvcmQ9ZnVuY3Rpb24odCxlLG4scil7aWYoIUFycmF5LmlzQXJyYXkoZSkmJiFlLmxlbmd0aCl0aHJvdyBuZXcgRXJyb3IoXCJDaG9yZCBtdXN0IGJlIGFuIGFycmF5IG9mIHBpdGNoZXNcIik7cmV0dXJuIGUuZm9yRWFjaChmdW5jdGlvbihlKXt0aGlzLm5vdGVPbih0LGUsMCxyKX0sdGhpcyksZS5mb3JFYWNoKGZ1bmN0aW9uKGUscil7MD09PXI/dGhpcy5ub3RlT2ZmKHQsZSxuKTp0aGlzLm5vdGVPZmYodCxlKX0sdGhpcyksdGhpc30sYS5wcm90b3R5cGUuc2V0SW5zdHJ1bWVudD1hLnByb3RvdHlwZS5pbnN0cnVtZW50PWZ1bmN0aW9uKHQsZSxuKXtyZXR1cm4gdGhpcy5ldmVudHMucHVzaChuZXcgcih7dHlwZTpyLlBST0dSQU1fQ0hBTkdFLGNoYW5uZWw6dCxwYXJhbTE6ZSx0aW1lOm58fDB9KSksdGhpc30sYS5wcm90b3R5cGUuc2V0VGVtcG89YS5wcm90b3R5cGUudGVtcG89ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5ldmVudHMucHVzaChuZXcgaSh7dHlwZTppLlRFTVBPLGRhdGE6bi5tcHFuRnJvbUJwbSh0KSx0aW1lOmV8fDB9KSksdGhpc30sYS5wcm90b3R5cGUudG9CeXRlcz1mdW5jdGlvbigpe3ZhciB0PTAsZT1bXSxyPWEuU1RBUlRfQllURVMsaT1hLkVORF9CWVRFUyxvPWZ1bmN0aW9uKG4pe3ZhciByPW4udG9CeXRlcygpO3QrPXIubGVuZ3RoLGUucHVzaC5hcHBseShlLHIpfTt0aGlzLmV2ZW50cy5mb3JFYWNoKG8pLHQrPWkubGVuZ3RoO3ZhciBzPW4uc3RyMkJ5dGVzKHQudG9TdHJpbmcoMTYpLDQpO3JldHVybiByLmNvbmNhdChzLGUsaSl9O3ZhciBvPWZ1bmN0aW9uKHQpe2lmKCF0aGlzKXJldHVybiBuZXcgbyh0KTt2YXIgZT10fHx7fTtpZihlLnRpY2tzKXtpZihcIm51bWJlclwiIT10eXBlb2YgZS50aWNrcyl0aHJvdyBuZXcgRXJyb3IoXCJUaWNrcyBwZXIgYmVhdCBtdXN0IGJlIGEgbnVtYmVyIVwiKTtpZihlLnRpY2tzPD0wfHxlLnRpY2tzPj0zMjc2OHx8ZS50aWNrcyUxIT09MCl0aHJvdyBuZXcgRXJyb3IoXCJUaWNrcyBwZXIgYmVhdCBtdXN0IGJlIGFuIGludGVnZXIgYmV0d2VlbiAxIGFuZCAzMjc2NyFcIil9dGhpcy50aWNrcz1lLnRpY2tzfHwxMjgsdGhpcy50cmFja3M9ZS50cmFja3N8fFtdfTtvLkhEUl9DSFVOS0lEPVwiTVRoZFwiLG8uSERSX0NIVU5LX1NJWkU9XCJcXHgwMFxceDAwXFx4MDBcdTAwMDZcIixvLkhEUl9UWVBFMD1cIlxceDAwXFx4MDBcIixvLkhEUl9UWVBFMT1cIlxceDAwXHUwMDAxXCIsby5wcm90b3R5cGUuYWRkVHJhY2s9ZnVuY3Rpb24odCl7cmV0dXJuIHQ/KHRoaXMudHJhY2tzLnB1c2godCksdGhpcyk6KHQ9bmV3IGEsdGhpcy50cmFja3MucHVzaCh0KSx0KX0sby5wcm90b3R5cGUudG9CeXRlcz1mdW5jdGlvbigpe3ZhciB0PXRoaXMudHJhY2tzLmxlbmd0aC50b1N0cmluZygxNiksZT1vLkhEUl9DSFVOS0lEK28uSERSX0NIVU5LX1NJWkU7cmV0dXJuIGUrPXBhcnNlSW50KHQsMTYpPjE/by5IRFJfVFlQRTE6by5IRFJfVFlQRTAsZSs9bi5jb2RlczJTdHIobi5zdHIyQnl0ZXModCwyKSksZSs9U3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLnRpY2tzLzI1Nix0aGlzLnRpY2tzJTI1NiksdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbih0KXtlKz1uLmNvZGVzMlN0cih0LnRvQnl0ZXMoKSl9KSxlfSx0LlV0aWw9bix0LkZpbGU9byx0LlRyYWNrPWEsdC5FdmVudD1yLHQuTWV0YUV2ZW50PWl9KG4pLFwidW5kZWZpbmVkXCIhPXR5cGVvZiB0JiZudWxsIT09dD90LmV4cG9ydHM9bjpcInVuZGVmaW5lZFwiIT10eXBlb2YgZSYmbnVsbCE9PWU/ZT1uOnRoaXMuTWlkaT1ufSkuY2FsbChlLG4oMTIpKHQpKX0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBuKHQpe2Z1bmN0aW9uIGUodCl7dmFyIGU9dC5yZWFkKDQpLG49dC5yZWFkSW50MzIoKTtyZXR1cm57aWQ6ZSxsZW5ndGg6bixkYXRhOnQucmVhZChuKX19ZnVuY3Rpb24gbih0KXt2YXIgZT17fTtlLmRlbHRhVGltZT10LnJlYWRWYXJJbnQoKTt2YXIgbj10LnJlYWRJbnQ4KCk7aWYoMjQwPT0oMjQwJm4pKXtpZigyNTU9PW4pe2UudHlwZT1cIm1ldGFcIjt2YXIgcj10LnJlYWRJbnQ4KCksYT10LnJlYWRWYXJJbnQoKTtzd2l0Y2gocil7Y2FzZSAwOmlmKGUuc3VidHlwZT1cInNlcXVlbmNlTnVtYmVyXCIsMiE9YSl0aHJvd1wiRXhwZWN0ZWQgbGVuZ3RoIGZvciBzZXF1ZW5jZU51bWJlciBldmVudCBpcyAyLCBnb3QgXCIrYTtyZXR1cm4gZS5udW1iZXI9dC5yZWFkSW50MTYoKSxlO2Nhc2UgMTpyZXR1cm4gZS5zdWJ0eXBlPVwidGV4dFwiLGUudGV4dD10LnJlYWQoYSksZTtjYXNlIDI6cmV0dXJuIGUuc3VidHlwZT1cImNvcHlyaWdodE5vdGljZVwiLGUudGV4dD10LnJlYWQoYSksZTtjYXNlIDM6cmV0dXJuIGUuc3VidHlwZT1cInRyYWNrTmFtZVwiLGUudGV4dD10LnJlYWQoYSksZTtjYXNlIDQ6cmV0dXJuIGUuc3VidHlwZT1cImluc3RydW1lbnROYW1lXCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgNTpyZXR1cm4gZS5zdWJ0eXBlPVwibHlyaWNzXCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgNjpyZXR1cm4gZS5zdWJ0eXBlPVwibWFya2VyXCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgNzpyZXR1cm4gZS5zdWJ0eXBlPVwiY3VlUG9pbnRcIixlLnRleHQ9dC5yZWFkKGEpLGU7Y2FzZSAzMjppZihlLnN1YnR5cGU9XCJtaWRpQ2hhbm5lbFByZWZpeFwiLDEhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3IgbWlkaUNoYW5uZWxQcmVmaXggZXZlbnQgaXMgMSwgZ290IFwiK2E7cmV0dXJuIGUuY2hhbm5lbD10LnJlYWRJbnQ4KCksZTtjYXNlIDQ3OmlmKGUuc3VidHlwZT1cImVuZE9mVHJhY2tcIiwwIT1hKXRocm93XCJFeHBlY3RlZCBsZW5ndGggZm9yIGVuZE9mVHJhY2sgZXZlbnQgaXMgMCwgZ290IFwiK2E7cmV0dXJuIGU7Y2FzZSA4MTppZihlLnN1YnR5cGU9XCJzZXRUZW1wb1wiLDMhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3Igc2V0VGVtcG8gZXZlbnQgaXMgMywgZ290IFwiK2E7cmV0dXJuIGUubWljcm9zZWNvbmRzUGVyQmVhdD0odC5yZWFkSW50OCgpPDwxNikrKHQucmVhZEludDgoKTw8OCkrdC5yZWFkSW50OCgpLGU7Y2FzZSA4NDppZihlLnN1YnR5cGU9XCJzbXB0ZU9mZnNldFwiLDUhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3Igc21wdGVPZmZzZXQgZXZlbnQgaXMgNSwgZ290IFwiK2E7dmFyIG89dC5yZWFkSW50OCgpO3JldHVybiBlLmZyYW1lUmF0ZT17MDoyNCwzMjoyNSw2NDoyOSw5NjozMH1bOTYmb10sZS5ob3VyPTMxJm8sZS5taW49dC5yZWFkSW50OCgpLGUuc2VjPXQucmVhZEludDgoKSxlLmZyYW1lPXQucmVhZEludDgoKSxlLnN1YmZyYW1lPXQucmVhZEludDgoKSxlO2Nhc2UgODg6aWYoZS5zdWJ0eXBlPVwidGltZVNpZ25hdHVyZVwiLDQhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3IgdGltZVNpZ25hdHVyZSBldmVudCBpcyA0LCBnb3QgXCIrYTtyZXR1cm4gZS5udW1lcmF0b3I9dC5yZWFkSW50OCgpLGUuZGVub21pbmF0b3I9TWF0aC5wb3coMix0LnJlYWRJbnQ4KCkpLGUubWV0cm9ub21lPXQucmVhZEludDgoKSxlLnRoaXJ0eXNlY29uZHM9dC5yZWFkSW50OCgpLGU7Y2FzZSA4OTppZihlLnN1YnR5cGU9XCJrZXlTaWduYXR1cmVcIiwyIT1hKXRocm93XCJFeHBlY3RlZCBsZW5ndGggZm9yIGtleVNpZ25hdHVyZSBldmVudCBpcyAyLCBnb3QgXCIrYTtyZXR1cm4gZS5rZXk9dC5yZWFkSW50OCghMCksZS5zY2FsZT10LnJlYWRJbnQ4KCksZTtjYXNlIDEyNzpyZXR1cm4gZS5zdWJ0eXBlPVwic2VxdWVuY2VyU3BlY2lmaWNcIixlLmRhdGE9dC5yZWFkKGEpLGU7ZGVmYXVsdDpyZXR1cm4gZS5zdWJ0eXBlPVwidW5rbm93blwiLGUuZGF0YT10LnJlYWQoYSksZX1yZXR1cm4gZS5kYXRhPXQucmVhZChhKSxlfWlmKDI0MD09bil7ZS50eXBlPVwic3lzRXhcIjt2YXIgYT10LnJlYWRWYXJJbnQoKTtyZXR1cm4gZS5kYXRhPXQucmVhZChhKSxlfWlmKDI0Nz09bil7ZS50eXBlPVwiZGl2aWRlZFN5c0V4XCI7dmFyIGE9dC5yZWFkVmFySW50KCk7cmV0dXJuIGUuZGF0YT10LnJlYWQoYSksZX10aHJvd1wiVW5yZWNvZ25pc2VkIE1JREkgZXZlbnQgdHlwZSBieXRlOiBcIitufXZhciBzOzA9PSgxMjgmbik/KHM9bixuPWkpOihzPXQucmVhZEludDgoKSxpPW4pO3ZhciB1PW4+PjQ7c3dpdGNoKGUuY2hhbm5lbD0xNSZuLGUudHlwZT1cImNoYW5uZWxcIix1KXtjYXNlIDg6cmV0dXJuIGUuc3VidHlwZT1cIm5vdGVPZmZcIixlLm5vdGVOdW1iZXI9cyxlLnZlbG9jaXR5PXQucmVhZEludDgoKSxlO2Nhc2UgOTpyZXR1cm4gZS5ub3RlTnVtYmVyPXMsZS52ZWxvY2l0eT10LnJlYWRJbnQ4KCksMD09ZS52ZWxvY2l0eT9lLnN1YnR5cGU9XCJub3RlT2ZmXCI6ZS5zdWJ0eXBlPVwibm90ZU9uXCIsZTtjYXNlIDEwOnJldHVybiBlLnN1YnR5cGU9XCJub3RlQWZ0ZXJ0b3VjaFwiLGUubm90ZU51bWJlcj1zLGUuYW1vdW50PXQucmVhZEludDgoKSxlO2Nhc2UgMTE6cmV0dXJuIGUuc3VidHlwZT1cImNvbnRyb2xsZXJcIixlLmNvbnRyb2xsZXJUeXBlPXMsZS52YWx1ZT10LnJlYWRJbnQ4KCksZTtjYXNlIDEyOnJldHVybiBlLnN1YnR5cGU9XCJwcm9ncmFtQ2hhbmdlXCIsZS5wcm9ncmFtTnVtYmVyPXMsZTtjYXNlIDEzOnJldHVybiBlLnN1YnR5cGU9XCJjaGFubmVsQWZ0ZXJ0b3VjaFwiLGUuYW1vdW50PXMsZTtjYXNlIDE0OnJldHVybiBlLnN1YnR5cGU9XCJwaXRjaEJlbmRcIixlLnZhbHVlPXMrKHQucmVhZEludDgoKTw8NyksZTtkZWZhdWx0OnRocm93XCJVbnJlY29nbmlzZWQgTUlESSBldmVudCB0eXBlOiBcIit1fX12YXIgaTtzdHJlYW09cih0KTt2YXIgYT1lKHN0cmVhbSk7aWYoXCJNVGhkXCIhPWEuaWR8fDYhPWEubGVuZ3RoKXRocm93XCJCYWQgLm1pZCBmaWxlIC0gaGVhZGVyIG5vdCBmb3VuZFwiO3ZhciBvPXIoYS5kYXRhKSxzPW8ucmVhZEludDE2KCksdT1vLnJlYWRJbnQxNigpLGM9by5yZWFkSW50MTYoKTtpZigzMjc2OCZjKXRocm93XCJFeHByZXNzaW5nIHRpbWUgZGl2aXNpb24gaW4gU01UUEUgZnJhbWVzIGlzIG5vdCBzdXBwb3J0ZWQgeWV0XCI7dGlja3NQZXJCZWF0PWM7Zm9yKHZhciBoPXtmb3JtYXRUeXBlOnMsdHJhY2tDb3VudDp1LHRpY2tzUGVyQmVhdDp0aWNrc1BlckJlYXR9LGY9W10sZD0wO2Q8aC50cmFja0NvdW50O2QrKyl7ZltkXT1bXTt2YXIgbD1lKHN0cmVhbSk7aWYoXCJNVHJrXCIhPWwuaWQpdGhyb3dcIlVuZXhwZWN0ZWQgY2h1bmsgLSBleHBlY3RlZCBNVHJrLCBnb3QgXCIrbC5pZDtmb3IodmFyIHA9cihsLmRhdGEpOyFwLmVvZigpOyl7dmFyIG09bihwKTtmW2RdLnB1c2gobSl9fXJldHVybntoZWFkZXI6aCx0cmFja3M6Zn19ZnVuY3Rpb24gcih0KXtmdW5jdGlvbiBlKGUpe3ZhciBuPXQuc3Vic3RyKHMsZSk7cmV0dXJuIHMrPWUsbn1mdW5jdGlvbiBuKCl7dmFyIGU9KHQuY2hhckNvZGVBdChzKTw8MjQpKyh0LmNoYXJDb2RlQXQocysxKTw8MTYpKyh0LmNoYXJDb2RlQXQocysyKTw8OCkrdC5jaGFyQ29kZUF0KHMrMyk7cmV0dXJuIHMrPTQsZX1mdW5jdGlvbiByKCl7dmFyIGU9KHQuY2hhckNvZGVBdChzKTw8OCkrdC5jaGFyQ29kZUF0KHMrMSk7cmV0dXJuIHMrPTIsZX1mdW5jdGlvbiBpKGUpe3ZhciBuPXQuY2hhckNvZGVBdChzKTtyZXR1cm4gZSYmbj4xMjcmJihuLT0yNTYpLHMrPTEsbn1mdW5jdGlvbiBhKCl7cmV0dXJuIHM+PXQubGVuZ3RofWZ1bmN0aW9uIG8oKXtmb3IodmFyIHQ9MDs7KXt2YXIgZT1pKCk7aWYoISgxMjgmZSkpcmV0dXJuIHQrZTt0Kz0xMjcmZSx0PDw9N319dmFyIHM9MDtyZXR1cm57ZW9mOmEscmVhZDplLHJlYWRJbnQzMjpuLHJlYWRJbnQxNjpyLHJlYWRJbnQ4OmkscmVhZFZhckludDpvfX10LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIG4odCl9fSxmdW5jdGlvbih0LGUpe3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gdC53ZWJwYWNrUG9seWZpbGx8fCh0LmRlcHJlY2F0ZT1mdW5jdGlvbigpe30sdC5wYXRocz1bXSx0LmNoaWxkcmVuPVtdLHQud2VicGFja1BvbHlmaWxsPTEpLHR9fV0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1NaWRpQ29udmVydC5qcy5tYXAiXX0=
