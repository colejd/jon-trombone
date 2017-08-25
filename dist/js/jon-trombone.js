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

var container = document.getElementById("jon-trombone-container");

if (!_webglDetect.Detector.HasWebGL()) {
    //exit("WebGL is not supported on this browser.");
    console.log("WebGL is not supported on this browser.");
    container.innerHTML = _webglDetect.Detector.GetErrorHTML();
    container.classList.add("no-webgl");
} else {
    var jonTrombone = new _jonTrombone.JonTrombone(container);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9ndWkuanMiLCJqcy9qb24tdHJvbWJvbmUuanMiLCJqcy9tYWluLmpzIiwianMvbWlkaS9taWRpLWNvbnRyb2xsZXIuanMiLCJqcy9waW5rLXRyb21ib25lL2NvbXBvbmVudHMvYXVkaW8tc3lzdGVtLmpzIiwianMvcGluay10cm9tYm9uZS9jb21wb25lbnRzL2dsb3R0aXMuanMiLCJqcy9waW5rLXRyb21ib25lL2NvbXBvbmVudHMvdHJhY3QtdWkuanMiLCJqcy9waW5rLXRyb21ib25lL2NvbXBvbmVudHMvdHJhY3QuanMiLCJqcy9waW5rLXRyb21ib25lL21hdGgtZXh0ZW5zaW9ucy5qcyIsImpzL3BpbmstdHJvbWJvbmUvbm9pc2UuanMiLCJqcy9waW5rLXRyb21ib25lL3BpbmstdHJvbWJvbmUuanMiLCJqcy90dHMvdHRzLWNvbnRyb2xsZXIuanMiLCJqcy91dGlscy9tb2RlbC1sb2FkZXIuanMiLCJqcy91dGlscy93ZWJnbC1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvbWlkaWNvbnZlcnQvYnVpbGQvTWlkaUNvbnZlcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sRzs7Ozs7Ozs2QkFFRyxHLEVBQUssUyxFQUFVOztBQUVoQixnQkFBRyxDQUFDLEtBQUosRUFBVztBQUNQLHdCQUFRLEdBQVIsQ0FBWSw0RUFBWjtBQUNBO0FBQ0g7O0FBRUQsaUJBQUssS0FBTCxHQUFhLElBQUksTUFBTSxHQUFWLENBQWM7QUFDdkIsdUJBQU8sY0FEZ0I7QUFFdkIsdUJBQU8sTUFGZ0I7QUFHdkIsc0JBQU0sU0FIaUI7QUFJdkIsdUJBQU8sS0FKZ0I7QUFLdkIseUJBQVMsT0FMYztBQU12Qix1QkFBTyxPQU5nQjtBQU92Qix5QkFBUztBQVBjLGFBQWQsQ0FBYjs7QUFVQSxpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUNoQixzQkFBTSxVQURV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RUQ7QUFDQSx1QkFBTyxLQUFQO0FBQ0g7QUFDRDtBQUNBLG1CQUFPLEtBQVA7QUFDSDs7O3VDQUVrQztBQUFBLGdCQUFmLE9BQWUsdUVBQUwsSUFBSzs7QUFDL0IsZ0JBQUcsV0FBVyxJQUFkLEVBQW1CO0FBQ2Y7QUFHSDtBQUNELDZHQUVpQyxPQUZqQztBQUtIOzs7Ozs7UUFJSSxRLEdBQUEsUTs7O0FDekNUO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgR1VJIHtcblxuICAgIEluaXQoam9uLCBjb250YWluZXIpe1xuXG4gICAgICAgIGlmKCFndWlmeSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJHdWlmeSB3YXMgbm90IGZvdW5kISBBZGQgaXQgdG8geW91ciBwYWdlIHRvIGVuYWJsZSBhIEdVSSBmb3IgdGhpcyBwcm9ncmFtLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGFuZWwgPSBuZXcgZ3VpZnkuR1VJKHtcbiAgICAgICAgICAgIHRpdGxlOiBcIkpvbi1Ucm9tYm9uZVwiLCBcbiAgICAgICAgICAgIHRoZW1lOiBcImRhcmtcIiwgXG4gICAgICAgICAgICByb290OiBjb250YWluZXIsXG4gICAgICAgICAgICB3aWR0aDogXCI4MCVcIixcbiAgICAgICAgICAgIGJhck1vZGU6IFwiYWJvdmVcIixcbiAgICAgICAgICAgIGFsaWduOiBcInJpZ2h0XCIsXG4gICAgICAgICAgICBvcGFjaXR5OiBcIjAuOTVcIlxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBhbmVsLlJlZ2lzdGVyKHsgXG4gICAgICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsIGxhYmVsOiBcIk11dGVcIiwgXG4gICAgICAgICAgICBvYmplY3Q6IGpvbi50cm9tYm9uZSwgcHJvcGVydHk6IFwibXV0ZWRcIiwgXG4gICAgICAgICAgICBvbkNoYW5nZTogKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBqb24udHJvbWJvbmUuU2V0TXV0ZShkYXRhKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEpvbiBmb2xkZXJcbiAgICAgICAgdGhpcy5wYW5lbC5SZWdpc3Rlcih7IHR5cGU6IFwiZm9sZGVyXCIsIGxhYmVsOiBcIkpvblwiIH0pO1xuICAgICAgICB0aGlzLnBhbmVsLlJlZ2lzdGVyKFtcbiAgICAgICAgICAgIHsgdHlwZTogXCJjaGVja2JveFwiLCBsYWJlbDogXCJNb3ZlIEphd1wiLCBvYmplY3Q6IGpvbiwgcHJvcGVydHk6IFwibW92ZUphd1wiIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwicmFuZ2VcIiwgbGFiZWw6IFwiSmF3IFNwZWVkXCIsIG9iamVjdDogam9uLCBwcm9wZXJ0eTogXCJqYXdGbGFwU3BlZWRcIiwgbWluOiAwLCBtYXg6IDEwMCB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIkphdyBSYW5nZVwiLCBvYmplY3Q6IGpvbiwgcHJvcGVydHk6IFwiamF3T3Blbk9mZnNldFwiLCBtaW46IDAsIG1heDogMSB9LFxuICAgICAgICBdLCB7IGZvbGRlcjogXCJKb25cIiB9KTtcblxuICAgICAgICAvLyBWb2ljZSBmb2xkZXJcbiAgICAgICAgdGhpcy5wYW5lbC5SZWdpc3Rlcih7IHR5cGU6IFwiZm9sZGVyXCIsIGxhYmVsOiBcIlZvaWNlXCIgfSk7XG4gICAgICAgIHRoaXMucGFuZWwuUmVnaXN0ZXIoW1xuICAgICAgICAgICAgeyB0eXBlOiBcImNoZWNrYm94XCIsIGxhYmVsOiBcIldvYmJsZVwiLCBvYmplY3Q6IGpvbi50cm9tYm9uZSwgcHJvcGVydHk6IFwiYXV0b1dvYmJsZVwiIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwiY2hlY2tib3hcIiwgbGFiZWw6IFwiUGl0Y2ggVmFyaWFuY2VcIiwgb2JqZWN0OiBqb24udHJvbWJvbmUuR2xvdHRpcywgcHJvcGVydHk6IFwiYWRkUGl0Y2hWYXJpYW5jZVwiIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwiY2hlY2tib3hcIiwgbGFiZWw6IFwiVGVuc2VuZXNzIFZhcmlhbmNlXCIsIG9iamVjdDogam9uLnRyb21ib25lLkdsb3R0aXMsIHByb3BlcnR5OiBcImFkZFRlbnNlbmVzc1ZhcmlhbmNlXCIgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJUZW5zZW5lc3NcIiwgb2JqZWN0OiBqb24udHJvbWJvbmUuR2xvdHRpcywgcHJvcGVydHk6IFwiVUlUZW5zZW5lc3NcIiwgbWluOiAwLCBtYXg6IDEgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJWaWJyYXRvXCIsIG9iamVjdDogam9uLnRyb21ib25lLkdsb3R0aXMsIHByb3BlcnR5OiBcInZpYnJhdG9BbW91bnRcIiwgbWluOiAwLCBtYXg6IDAuNSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIkZyZXF1ZW5jeVwiLCBvYmplY3Q6IGpvbi50cm9tYm9uZS5HbG90dGlzLCBwcm9wZXJ0eTogXCJVSUZyZXF1ZW5jeVwiLCBtaW46IDEsIG1heDogMTAwMCwgc3RlcDogMSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIkxvdWRuZXNzXCIsIG9iamVjdDogam9uLnRyb21ib25lLkdsb3R0aXMsIHByb3BlcnR5OiBcImxvdWRuZXNzXCIsIG1pbjogMCwgbWF4OiAxIH0sXG4gICAgICAgIF0sIHsgZm9sZGVyOiBcIlZvaWNlXCIgfSk7XG5cbiAgICAgICAgLy8gVHJhY3QgZm9sZGVyXG4gICAgICAgIHRoaXMucGFuZWwuUmVnaXN0ZXIoeyB0eXBlOiBcImZvbGRlclwiLCBsYWJlbDogXCJUcmFjdFwiIH0pO1xuICAgICAgICB0aGlzLnBhbmVsLlJlZ2lzdGVyKFtcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJNb3ZlIFNwZWVkXCIsIG9iamVjdDogam9uLnRyb21ib25lLlRyYWN0LCBwcm9wZXJ0eTogXCJtb3ZlbWVudFNwZWVkXCIsIG1pbjogMSwgbWF4OiAzMCwgc3RlcDogMSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIlZlbHVtIFRhcmdldFwiLCBvYmplY3Q6IGpvbi50cm9tYm9uZS5UcmFjdCwgcHJvcGVydHk6IFwidmVsdW1UYXJnZXRcIiwgbWluOiAwLjAwMSwgbWF4OiAyIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwicmFuZ2VcIiwgbGFiZWw6IFwiVGFyZ2V0XCIsIG9iamVjdDogam9uLnRyb21ib25lLlRyYWN0VUksIHByb3BlcnR5OiBcInRhcmdldFwiLCBtaW46IDAuMDAxLCBtYXg6IDEgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJJbmRleFwiLCBvYmplY3Q6IGpvbi50cm9tYm9uZS5UcmFjdFVJLCBwcm9wZXJ0eTogXCJpbmRleFwiLCBtaW46IDAsIG1heDogNDMsIHN0ZXA6IDEgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJSYWRpdXNcIiwgb2JqZWN0OiBqb24udHJvbWJvbmUuVHJhY3RVSSwgcHJvcGVydHk6IFwicmFkaXVzXCIsIG1pbjogMCwgbWF4OiA1LCBzdGVwOiAxIH0sXG4gICAgICAgIF0sIHsgZm9sZGVyOiBcIlRyYWN0XCIgfSk7XG5cbiAgICAgICAgLy8gTUlESSBmb2xkZXJcbiAgICAgICAgdGhpcy5wYW5lbC5SZWdpc3Rlcih7IHR5cGU6IFwiZm9sZGVyXCIsIGxhYmVsOiBcIk1JRElcIiB9KTtcbiAgICAgICAgdGhpcy5wYW5lbC5SZWdpc3RlcihbXG4gICAgICAgICAgICB7IHR5cGU6IFwiZmlsZVwiLCBsYWJlbDogXCJNSURJIEZpbGVcIiwgZmlsZVJlYWRGdW5jOiBcInJlYWRBc0JpbmFyeVN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBqb24ubWlkaUNvbnRyb2xsZXIuTG9hZFNvbmdEaXJlY3QoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJ0aXRsZVwiLCBsYWJlbDogXCJDb250cm9sc1wiIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwiYnV0dG9uXCIsIGxhYmVsOiBcIlBsYXlcIiwgYWN0aW9uOiAoKSA9PiBqb24ubWlkaUNvbnRyb2xsZXIuUGxheVNvbmcoKSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcImJ1dHRvblwiLCBsYWJlbDogXCJTdG9wXCIsIGFjdGlvbjogKCkgPT4gam9uLm1pZGlDb250cm9sbGVyLlN0b3AoKSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcImJ1dHRvblwiLCBsYWJlbDogXCJSZXN0YXJ0XCIsIGFjdGlvbjogKCkgPT4gam9uLm1pZGlDb250cm9sbGVyLlJlc3RhcnQoKSB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInRpdGxlXCIsIGxhYmVsOiBcIk9wdGlvbnNcIiB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIlRyYWNrXCIsIG9iamVjdDogam9uLm1pZGlDb250cm9sbGVyLCBwcm9wZXJ0eTogXCJjdXJyZW50VHJhY2tcIiwgbWluOiAxLCBtYXg6IDIwLCBzdGVwOiAxIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwicmFuZ2VcIiwgbGFiZWw6IFwiQmFzZSBGcmVxdWVuY3lcIiwgb2JqZWN0OiBqb24ubWlkaUNvbnRyb2xsZXIsIHByb3BlcnR5OiBcImJhc2VGcmVxXCIsIG1pbjogMSwgbWF4OiAyMDAwLCBzdGVwOiAxIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwiY2hlY2tib3hcIiwgbGFiZWw6IFwiRXh0cmVtZSBWaWJyYXRvXCIsIG9iamVjdDogam9uLCBwcm9wZXJ0eTogXCJmbGFwV2hpbGVTaW5naW5nXCIgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJjaGVja2JveFwiLCBsYWJlbDogXCJMZWdhdG9cIiwgb2JqZWN0OiBqb24sIHByb3BlcnR5OiBcImxlZ2F0b1wiIH0sXG4gICAgICAgIF0sIHsgZm9sZGVyOiBcIk1JRElcIiB9KTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgbGV0IGd1aSA9IG5ldyBHVUkoKTsiLCJpbXBvcnQgeyBNb2RlbExvYWRlciB9IGZyb20gXCIuL3V0aWxzL21vZGVsLWxvYWRlci5qc1wiO1xuaW1wb3J0IHsgUGlua1Ryb21ib25lIH0gZnJvbSBcIi4vcGluay10cm9tYm9uZS9waW5rLXRyb21ib25lLmpzXCI7XG5pbXBvcnQgeyBNaWRpQ29udHJvbGxlciB9IGZyb20gXCIuL21pZGkvbWlkaS1jb250cm9sbGVyLmpzXCI7XG5pbXBvcnQgeyBUVFNDb250cm9sbGVyIH0gZnJvbSBcIi4vdHRzL3R0cy1jb250cm9sbGVyLmpzXCI7XG5pbXBvcnQgeyBndWkgfSBmcm9tIFwiLi9ndWkuanNcIjtcblxuY2xhc3MgSm9uVHJvbWJvbmUge1xuXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyLCBmaW5pc2hlZENhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XG5cbiAgICAgICAgLy8gU2V0IHVwIHJlbmRlcmVyIGFuZCBlbWJlZCBpbiBjb250YWluZXJcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCB7IGFscGhhOiB0cnVlIH0gKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHRoaXMuY29udGFpbmVyLm9mZnNldFdpZHRoLCB0aGlzLmNvbnRhaW5lci5vZmZzZXRIZWlnaHQpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHgwMDAwMDAsIDApO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIC8vIFNldCB1cCBzY2VuZSBhbmQgdmlld1xuICAgICAgICBsZXQgYXNwZWN0ID0gdGhpcy5jb250YWluZXIub2Zmc2V0V2lkdGggLyB0aGlzLmNvbnRhaW5lci5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA0NSwgYXNwZWN0LCAwLjEsIDEwMCApO1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgLy8gRXhwb3J0IHNjZW5lIGZvciB0aHJlZSBqcyBpbnNwZWN0b3JcbiAgICAgICAgLy93aW5kb3cuc2NlbmUgPSB0aGlzLnNjZW5lO1xuXG4gICAgICAgIC8vIFNldCB1cCBjbG9jayBmb3IgdGltaW5nXG4gICAgICAgIHRoaXMuY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcblxuICAgICAgICBsZXQgc3RhcnREZWxheU1TID0gMTAwMDtcbiAgICAgICAgdGhpcy50cm9tYm9uZSA9IG5ldyBQaW5rVHJvbWJvbmUodGhpcyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICB0aGlzLnRyb21ib25lLlN0YXJ0QXVkaW8oKTtcbiAgICAgICAgICAgIC8vdGhpcy50cm9tYm9uZS5TZXRNdXRlKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5tb3ZlSmF3ID0gdHJ1ZTtcbiAgICAgICAgfSwgc3RhcnREZWxheU1TKTtcblxuICAgICAgICAvLyBNdXRlIGJ1dHRvbiBmb3IgdHJvbWJvbmVcbiAgICAgICAgLy8gbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIC8vIGJ1dHRvbi5pbm5lckhUTUwgPSBcIk11dGVcIjtcbiAgICAgICAgLy8gYnV0dG9uLnN0eWxlLmNzc1RleHQgPSBcInBvc2l0aW9uOiBhYnNvbHV0ZTsgZGlzcGxheTogYmxvY2s7IHRvcDogMDsgbGVmdDogMDtcIjtcbiAgICAgICAgLy8gdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICAgICAgLy8gYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIgKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAvLyAgICAgdGhpcy50cm9tYm9uZS5Ub2dnbGVNdXRlKCk7XG4gICAgICAgIC8vICAgICBidXR0b24uaW5uZXJIVE1MID0gdGhpcy50cm9tYm9uZS5tdXRlZCA/IFwiVW5tdXRlXCIgOiBcIk11dGVcIjtcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgdGhpcy5qYXdGbGFwU3BlZWQgPSAyMC4wO1xuICAgICAgICB0aGlzLmphd09wZW5PZmZzZXQgPSAwLjE5O1xuICAgICAgICB0aGlzLm1vdmVKYXcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sZWdhdG8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mbGFwV2hpbGVTaW5naW5nID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5taWRpQ29udHJvbGxlciA9IG5ldyBNaWRpQ29udHJvbGxlcih0aGlzKTtcblxuICAgICAgICAvLyBsZXQgdHRzID0gbmV3IFRUU0NvbnRyb2xsZXIoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codHRzLkdldEdyYXBoZW1lcyhcIlRlc3Rpbmcgb25lIHR3byB0aHJlZSAxIDIgM1wiKSk7XG5cbiAgICAgICAgdGhpcy5TZXRVcFRocmVlKCk7XG4gICAgICAgIHRoaXMuU2V0VXBTY2VuZSgpO1xuXG4gICAgICAgIC8vIFN0YXJ0IHRoZSB1cGRhdGUgbG9vcFxuICAgICAgICB0aGlzLk9uVXBkYXRlKCk7XG5cbiAgICAgICAgZ3VpLkluaXQodGhpcywgdGhpcy5jb250YWluZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB1cCBub24tc2NlbmUgY29uZmlnIGZvciBUaHJlZS5qc1xuICAgICAqL1xuICAgIFNldFVwVGhyZWUoKSB7XG4gICAgICAgIGlmKFRIUkVFLk9yYml0Q29udHJvbHMgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAvLyBBZGQgb3JiaXQgY29udHJvbHNcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyggdGhpcy5jYW1lcmEsIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCApO1xuICAgICAgICAgICAgdGhpcy5jb250cm9scy50YXJnZXQuc2V0KCAwLCAwLCAwICk7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTm8gVEhSRUUuT3JiaXRDb250cm9scyBkZXRlY3RlZC4gSW5jbHVkZSB0byBhbGxvdyBpbnRlcmFjdGlvbiB3aXRoIHRoZSBtb2RlbC5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQb3B1bGF0ZXMgYW5kIGNvbmZpZ3VyZXMgb2JqZWN0cyB3aXRoaW4gdGhlIHNjZW5lLlxuICAgICAqL1xuICAgIFNldFVwU2NlbmUoKSB7XG5cbiAgICAgICAgLy8gU2V0IGNhbWVyYSBwb3NpdGlvblxuICAgICAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi5zZXQoIDAsIDAsIDAuNSApO1xuXG4gICAgICAgIC8vIExpZ2h0c1xuICAgICAgICBsZXQgbGlnaHQxID0gbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCgweGZmZmZmZiwgMHg0NDQ0NDQsIDEuMCk7XG4gICAgICAgIGxpZ2h0MS5uYW1lID0gXCJIZW1pc3BoZXJlIExpZ2h0XCI7XG4gICAgICAgIGxpZ2h0MS5wb3NpdGlvbi5zZXQoMCwgMSwgMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGxpZ2h0MSk7XG5cbiAgICAgICAgbGV0IGxpZ2h0MiA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAxLjApO1xuICAgICAgICBsaWdodDIubmFtZSA9IFwiRGlyZWN0aW9uYWwgTGlnaHRcIjtcbiAgICAgICAgbGlnaHQyLnBvc2l0aW9uLnNldCgwLCAxLCAxKTtcbiAgICAgICAgbGlnaHQyLnRhcmdldC5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGxpZ2h0Mik7XG5cbiAgICAgICAgLy8gTG9hZCB0aGUgSm9uIG1vZGVsIGFuZCBwbGFjZSBpdCBpbiB0aGUgc2NlbmVcbiAgICAgICAgTW9kZWxMb2FkZXIuTG9hZEpTT04oXCIuLi9yZXNvdXJjZXMvam9uL3RocmVlL2pvbi5qc29uXCIsIChvYmplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuam9uID0gb2JqZWN0O1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoIHRoaXMuam9uICk7XG4gICAgICAgICAgICB0aGlzLmpvbi5yb3RhdGlvbi55ID0gKFRIUkVFLk1hdGguZGVnVG9SYWQoMTUpKTtcblxuICAgICAgICAgICAgdGhpcy5qYXcgPSB0aGlzLmpvbi5za2VsZXRvbi5ib25lcy5maW5kKChvYmopID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqLm5hbWUgPT0gXCJCb25lLjAwNlwiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZih0aGlzLmphdyl7XG4gICAgICAgICAgICAgICAgdGhpcy5qYXdTaHV0WiA9IHRoaXMuamF3LnBvc2l0aW9uLno7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgZXZlcnkgZnJhbWUuIENvbnRpbnVlcyBpbmRlZmluaXRlbHkgYWZ0ZXIgYmVpbmcgY2FsbGVkIG9uY2UuXG4gICAgICovXG4gICAgT25VcGRhdGUoKSB7XG4gICAgICAgIGxldCBkZWx0YVRpbWUgPSB0aGlzLmNsb2NrLmdldERlbHRhKCk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggdGhpcy5PblVwZGF0ZS5iaW5kKHRoaXMpICk7XG5cbiAgICAgICAgaWYodGhpcy5taWRpQ29udHJvbGxlci5wbGF5aW5nKXtcblxuICAgICAgICAgICAgdGhpcy5ub3RlcyA9IHRoaXMubWlkaUNvbnRyb2xsZXIuR2V0UGl0Y2hlcygpO1xuICAgICAgICAgICAgaWYodGhpcy5ub3RlcyAhPSB0aGlzLmxhc3ROb3Rlcyl7XG4gICAgICAgICAgICAgICAgLy8gRG8gdGhlIG5vdGVcbiAgICAgICAgICAgICAgICBpZih0aGlzLm5vdGVzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5ub3Rlcy5sZW5ndGggIT0gMCl7IFxuICAgICAgICAgICAgICAgICAgICAvLyBOb3RlIG9uXG4gICAgICAgICAgICAgICAgICAgIC8vIFBsYXkgZnJlcXVlbmN5XG4gICAgICAgICAgICAgICAgICAgIGxldCBub3RlID0gdGhpcy5ub3Rlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ub3Rlcy5sZW5ndGggPiAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cgKFwiY2hvcmRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGZyZXEgPSB0aGlzLm1pZGlDb250cm9sbGVyLk1JRElUb0ZyZXF1ZW5jeShub3RlLm1pZGkpO1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGZyZXEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyb21ib25lLkdsb3R0aXMuVUlGcmVxdWVuY3kgPSBmcmVxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyb21ib25lLkdsb3R0aXMubG91ZG5lc3MgPSBub3RlLnZlbG9jaXR5O1xuICAgICAgICAgICAgICAgICAgICAvLyBPcGVuIGphd1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmphdy5wb3NpdGlvbi56ID0gdGhpcy5qYXdTaHV0WiArIHRoaXMuamF3T3Blbk9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cm9tYm9uZS5UcmFjdFVJLlNldExpcHNDbG9zZWQoMCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90ZSBvZmZcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxlZ2F0bykgdGhpcy50cm9tYm9uZS5HbG90dGlzLmxvdWRuZXNzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2xvc2UgamF3XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuamF3LnBvc2l0aW9uLnogPSB0aGlzLmphd1NodXRaO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0VUkuU2V0TGlwc0Nsb3NlZCgxKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMubGFzdE5vdGVzID0gdGhpcy5ub3RlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5qYXcgJiYgdGhpcy5tb3ZlSmF3ICYmICghdGhpcy5taWRpQ29udHJvbGxlci5wbGF5aW5nIHx8IHRoaXMuZmxhcFdoaWxlU2luZ2luZykpe1xuICAgICAgICAgICAgbGV0IHRpbWUgPSB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7Ly8gJSA2MDtcblxuICAgICAgICAgICAgLy8gTW92ZSB0aGUgamF3XG4gICAgICAgICAgICBsZXQgcGVyY2VudCA9IChNYXRoLnNpbih0aW1lICogdGhpcy5qYXdGbGFwU3BlZWQpICsgMS4wKSAvIDIuMDtcbiAgICAgICAgICAgIHRoaXMuamF3LnBvc2l0aW9uLnogPSB0aGlzLmphd1NodXRaICsgKHBlcmNlbnQgKiB0aGlzLmphd09wZW5PZmZzZXQpO1xuXG4gICAgICAgICAgICAvLyBNYWtlIHRoZSBhdWRpbyBtYXRjaCB0aGUgamF3IHBvc2l0aW9uXG4gICAgICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0VUkuU2V0TGlwc0Nsb3NlZCgxLjAgLSBwZXJjZW50KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVuZGVyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgeyBKb25Ucm9tYm9uZSB9OyIsImltcG9ydCB7IERldGVjdG9yIH0gZnJvbSBcIi4vdXRpbHMvd2ViZ2wtZGV0ZWN0LmpzXCI7XG5pbXBvcnQgeyBKb25Ucm9tYm9uZSB9IGZyb20gXCIuL2pvbi10cm9tYm9uZS5qc1wiO1xuXG4vLyBPcHRpb25hbGx5IGJ1bmRsZSB0aHJlZS5qcyBhcyBwYXJ0IG9mIHRoZSBwcm9qZWN0XG4vL2ltcG9ydCBUSFJFRUxpYiBmcm9tIFwidGhyZWUtanNcIjtcbi8vdmFyIFRIUkVFID0gVEhSRUVMaWIoKTsgLy8gcmV0dXJuIFRIUkVFIEpTXG5cbmxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvbi10cm9tYm9uZS1jb250YWluZXJcIik7XG5cbmlmICggIURldGVjdG9yLkhhc1dlYkdMKCkgKSB7XG4gICAgLy9leGl0KFwiV2ViR0wgaXMgbm90IHN1cHBvcnRlZCBvbiB0aGlzIGJyb3dzZXIuXCIpO1xuICAgIGNvbnNvbGUubG9nKFwiV2ViR0wgaXMgbm90IHN1cHBvcnRlZCBvbiB0aGlzIGJyb3dzZXIuXCIpO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBEZXRlY3Rvci5HZXRFcnJvckhUTUwoKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm5vLXdlYmdsXCIpO1xufVxuZWxzZXtcbiAgICBsZXQgam9uVHJvbWJvbmUgPSBuZXcgSm9uVHJvbWJvbmUoY29udGFpbmVyKTtcbn0iLCJsZXQgTWlkaUNvbnZlcnQgPSByZXF1aXJlKCdtaWRpY29udmVydCcpO1xuXG4vKipcbiAqIFNpbXBsZSBjbGFzcyBmb3IgTUlESSBwbGF5YmFjay5cbiAqIFRoZSBwYXJhZGlnbSBoZXJlJ3MgYSBiaXQgd2VpcmQ7IGl0J3MgdXAgdG8gYW4gZXh0ZXJuYWxcbiAqIHNvdXJjZSB0byBhY3R1YWxseSBwcm9kdWNlIGF1ZGlvLiBUaGlzIGNsYXNzIGp1c3QgbWFuYWdlc1xuICogYSB0aW1lciwgd2hpY2ggR2V0UGl0Y2goKSByZWFkcyB0byBwcm9kdWNlIHRoZSBcImN1cnJlbnRcIlxuICogbm90ZSBpbmZvcm1hdGlvbi4gXG4gKiBcbiAqIEFzIGFuIGV4YW1wbGUgb2YgdXNhZ2UsIGpvbi10cm9tYm9uZSBjYWxscyBQbGF5U29uZygpIHRvXG4gKiBiZWdpbiwgYW5kIHRoZW4gZXZlcnkgZnJhbWUgdXNlcyBHZXRQaXRjaCgpIHRvIGZpZ3VyZSBvdXRcbiAqIHdoYXQgdGhlIGN1cnJlbnQgZnJlcXVlbmN5IHRvIHByb2R1Y2UgaXMuXG4gKi9cbmNsYXNzIE1pZGlDb250cm9sbGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcblxuICAgICAgICB0aGlzLm1pZGkgPSBudWxsO1xuXG4gICAgICAgIHRoaXMucGxheWluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnRUcmFjayA9IDU7XG5cbiAgICAgICAgdGhpcy5iYXNlRnJlcSA9IDQ0MDsgLy8xMTAgaXMgQTRcblxuICAgICAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkcyBhbmQgcGFyc2VzIGEgTUlESSBmaWxlLlxuICAgICAqL1xuICAgIExvYWRTb25nKHBhdGgsIGNhbGxiYWNrKXtcbiAgICAgICAgdGhpcy5TdG9wKCk7XG4gICAgICAgIHRoaXMubWlkaSA9IG51bGw7XG4gICAgICAgIE1pZGlDb252ZXJ0LmxvYWQocGF0aCwgKG1pZGkpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTUlESSBsb2FkZWQuXCIpO1xuICAgICAgICAgICAgdGhpcy5taWRpID0gbWlkaTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMubWlkaSk7XG4gICAgICAgICAgICBpZihjYWxsYmFjaykgY2FsbGJhY2sobWlkaSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIExvYWRTb25nRGlyZWN0KGZpbGUpe1xuICAgICAgICB0aGlzLlN0b3AoKTtcbiAgICAgICAgdGhpcy5taWRpID0gTWlkaUNvbnZlcnQucGFyc2UoZmlsZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTUlESSBsb2FkZWQuXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm1pZGkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHBpdGNoIGZvciB0aGUgc3BlY2lmaWVkIHRyYWNrIGF0IHRoZSBjdXJyZW50IHRpbWUgaW4gdGhlIHNvbmcuXG4gICAgICovXG4gICAgR2V0UGl0Y2godHJhY2tJbmRleCA9IHRoaXMuY3VycmVudFRyYWNrKXtcbiAgICAgICAgbGV0IHRpbWUgPSB0aGlzLkdldFNvbmdQcm9ncmVzcygpO1xuXG4gICAgICAgIC8vIENvbnN0cmFpbiB0cmFjayBzcGVjaWZpZWQgdG8gdmFsaWQgcmFuZ2VcbiAgICAgICAgdHJhY2tJbmRleCA9IE1hdGgubWluKHRyYWNrSW5kZXgsIHRoaXMubWlkaS50cmFja3MubGVuZ3RoIC0gMSk7XG4gICAgICAgIHRyYWNrSW5kZXggPSBNYXRoLm1heCh0cmFja0luZGV4LCAwKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5taWRpLnRyYWNrc1t0cmFja0luZGV4XS5ub3Rlcy5maW5kKChpdGVtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5ub3RlT24gPD0gdGltZSAmJiB0aW1lIDw9IGl0ZW0ubm90ZU9mZjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgR2V0UGl0Y2hlcyh0cmFja0luZGV4ID0gdGhpcy5jdXJyZW50VHJhY2spe1xuICAgICAgICBsZXQgdGltZSA9IHRoaXMuR2V0U29uZ1Byb2dyZXNzKCk7XG5cbiAgICAgICAgLy8gQ29uc3RyYWluIHRyYWNrIHNwZWNpZmllZCB0byB2YWxpZCByYW5nZVxuICAgICAgICB0cmFja0luZGV4ID0gTWF0aC5taW4odHJhY2tJbmRleCwgdGhpcy5taWRpLnRyYWNrcy5sZW5ndGggLSAxKTtcbiAgICAgICAgdHJhY2tJbmRleCA9IE1hdGgubWF4KHRyYWNrSW5kZXgsIDApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1pZGkudHJhY2tzW3RyYWNrSW5kZXhdLm5vdGVzLmZpbHRlcihpdGVtID0+IFxuICAgICAgICAgICAgaXRlbS5ub3RlT24gPD0gdGltZSAmJiB0aW1lIDw9IGl0ZW0ubm90ZU9mZik7XG4gICAgfVxuXG4gICAgUGxheVNvbmcodHJhY2sgPSA1KXtcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG5vIHNvbmcgaXMgc3BlY2lmaWVkLCBsb2FkIGEgc29uZ1xuICAgICAgICBpZighdGhpcy5taWRpKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gTUlESSBpcyBsb2FkZWQuIExvYWRpbmcgYW4gZXhhbXBsZS4uLlwiKTtcbiAgICAgICAgICAgIHRoaXMuTG9hZFNvbmcoJy4uL3Jlc291cmNlcy9taWRpL3VuLW93ZW4td2FzLWhlci5taWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5QbGF5U29uZygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUdXJuIG9mZiBzb21lIHN0dWZmIHNvIHRoZSBzaW5naW5nIGtpbmQgb2Ygc291bmRzIG9rYXlcbiAgICAgICAgdGhpcy5FbnRlclNpbmdNb2RlKCk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2sgPSB0cmFjaztcbiAgICAgICAgdGhpcy5jbG9jay5zdGFydCgpO1xuICAgICAgICB0aGlzLnBsYXlpbmcgPSB0cnVlO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGxheWJhY2sgc3RhcnRlZC5cIik7XG5cbiAgICB9XG5cbiAgICBHZXRTb25nUHJvZ3Jlc3MoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvY2suZ2V0RWxhcHNlZFRpbWUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBmcm9tIGEgTUlESSBub3RlIGNvZGUgdG8gaXRzIGNvcnJlc3BvbmRpbmcgZnJlcXVlbmN5LlxuICAgICAqIEBwYXJhbSB7Kn0gbWlkaUNvZGUgXG4gICAgICovXG4gICAgTUlESVRvRnJlcXVlbmN5KG1pZGlDb2RlKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzZUZyZXEgKiBNYXRoLnBvdygyLCAobWlkaUNvZGUgLSA2OSkgLyAxMik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzdGFydHMgdGhlIHBsYXliYWNrLlxuICAgICAqL1xuICAgIFJlc3RhcnQoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJQbGF5YmFjayBtb3ZlZCB0byBiZWdpbm5pbmcuXCIpO1xuICAgICAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcHMgcGxheWJhY2suXG4gICAgICovXG4gICAgU3RvcCgpIHtcbiAgICAgICAgaWYoIXRoaXMucGxheWluZyl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJQbGF5YmFjayBzdG9wcGVkLlwiKTtcbiAgICAgICAgdGhpcy5jbG9jay5zdG9wKCk7XG4gICAgICAgIHRoaXMucGxheWluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLkV4aXRTaW5nTW9kZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdXAgdGhlIHRyb21ib25lIGZvciBzaW5naW5nLlxuICAgICAqL1xuICAgIEVudGVyU2luZ01vZGUoKXtcbiAgICAgICAgaWYodGhpcy5iYWNrdXBfc2V0dGluZ3Mpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iYWNrdXBfc2V0dGluZ3MgPSB7fTtcblxuICAgICAgICB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcImF1dG9Xb2JibGVcIl0gPSB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuYXV0b1dvYmJsZTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRyb21ib25lLmF1dG9Xb2JibGUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcImFkZFBpdGNoVmFyaWFuY2VcIl0gPSB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy5hZGRQaXRjaFZhcmlhbmNlO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy5hZGRQaXRjaFZhcmlhbmNlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJhZGRUZW5zZW5lc3NWYXJpYW5jZVwiXSA9IHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLmFkZFRlbnNlbmVzc1ZhcmlhbmNlO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy5hZGRUZW5zZW5lc3NWYXJpYW5jZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuYmFja3VwX3NldHRpbmdzW1widmlicmF0b0ZyZXF1ZW5jeVwiXSA9IHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLnZpYnJhdG9GcmVxdWVuY3k7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLnZpYnJhdG9GcmVxdWVuY3kgPSAwO1xuXG4gICAgICAgIHRoaXMuYmFja3VwX3NldHRpbmdzW1wiZnJlcXVlbmN5XCJdID0gdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMuVUlGcmVxdWVuY3k7XG5cbiAgICAgICAgdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJsb3VkbmVzc1wiXSA9IHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLmxvdWRuZXNzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3RvcmVzIHRoZSB0cm9tYm9uZSB0byB0aGUgc3RhdGUgaXQgd2FzIGluIGJlZm9yZSBzaW5naW5nLlxuICAgICAqL1xuICAgIEV4aXRTaW5nTW9kZSgpe1xuICAgICAgICBpZighdGhpcy5iYWNrdXBfc2V0dGluZ3MpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRyb21ib25lLmF1dG9Xb2JibGUgPSB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcImF1dG9Xb2JibGVcIl07XG4gICAgICAgIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLmFkZFBpdGNoVmFyaWFuY2UgPSB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcImFkZFBpdGNoVmFyaWFuY2VcIl07XG4gICAgICAgIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLmFkZFRlbnNlbmVzc1ZhcmlhbmNlID0gdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJhZGRUZW5zZW5lc3NWYXJpYW5jZVwiXTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMudmlicmF0b0ZyZXF1ZW5jeSA9IHRoaXMuYmFja3VwX3NldHRpbmdzW1widmlicmF0b0ZyZXF1ZW5jeVwiXTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMuVUlGcmVxdWVuY3kgPSB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcImZyZXF1ZW5jeVwiXTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMubG91ZG5lc3MgPSB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcImxvdWRuZXNzXCJdO1xuXG4gICAgICAgIHRoaXMuYmFja3VwX3NldHRpbmdzID0gbnVsbDtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgTWlkaUNvbnRyb2xsZXIgfTsiLCJjbGFzcyBBdWRpb1N5c3RlbSB7ICBcblxuICAgIGNvbnN0cnVjdG9yKHRyb21ib25lKSB7XG4gICAgICAgIHRoaXMudHJvbWJvbmUgPSB0cm9tYm9uZTtcblxuICAgICAgICB0aGlzLmJsb2NrTGVuZ3RoID0gNTEyO1xuICAgICAgICB0aGlzLmJsb2NrVGltZSA9IDE7XG4gICAgICAgIHRoaXMuc291bmRPbiA9IGZhbHNlO1xuXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgd2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHR8fHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gICAgICAgIHRoaXMuYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcbiAgICAgICAgdGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlID0gdGhpcy5hdWRpb0NvbnRleHQuc2FtcGxlUmF0ZTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYmxvY2tUaW1lID0gdGhpcy5ibG9ja0xlbmd0aC90aGlzLnRyb21ib25lLnNhbXBsZVJhdGU7XG4gICAgfVxuICAgIFxuICAgIHN0YXJ0U291bmQoKSB7XG4gICAgICAgIC8vc2NyaXB0UHJvY2Vzc29yIG1heSBuZWVkIGEgZHVtbXkgaW5wdXQgY2hhbm5lbCBvbiBpT1NcbiAgICAgICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IodGhpcy5ibG9ja0xlbmd0aCwgMiwgMSk7XG4gICAgICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pOyBcbiAgICAgICAgdGhpcy5zY3JpcHRQcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSB0aGlzLmRvU2NyaXB0UHJvY2Vzc29yLmJpbmQodGhpcyk7XG4gICAgXG4gICAgICAgIHZhciB3aGl0ZU5vaXNlID0gdGhpcy5jcmVhdGVXaGl0ZU5vaXNlTm9kZSgyICogdGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlKTsgLy8gMiBzZWNvbmRzIG9mIG5vaXNlXG4gICAgICAgIFxuICAgICAgICB2YXIgYXNwaXJhdGVGaWx0ZXIgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICAgICAgYXNwaXJhdGVGaWx0ZXIudHlwZSA9IFwiYmFuZHBhc3NcIjtcbiAgICAgICAgYXNwaXJhdGVGaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gNTAwO1xuICAgICAgICBhc3BpcmF0ZUZpbHRlci5RLnZhbHVlID0gMC41O1xuICAgICAgICB3aGl0ZU5vaXNlLmNvbm5lY3QoYXNwaXJhdGVGaWx0ZXIpOyAgLy8gVXNlIHdoaXRlIG5vaXNlIGFzIGlucHV0IGZvciBmaWx0ZXJcbiAgICAgICAgYXNwaXJhdGVGaWx0ZXIuY29ubmVjdCh0aGlzLnNjcmlwdFByb2Nlc3Nvcik7ICAvLyBVc2UgdGhpcyBhcyBpbnB1dCAwIGZvciBzY3JpcHQgcHJvY2Vzc29yXG4gICAgICAgIFxuICAgICAgICB2YXIgZnJpY2F0aXZlRmlsdGVyID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgICAgIGZyaWNhdGl2ZUZpbHRlci50eXBlID0gXCJiYW5kcGFzc1wiO1xuICAgICAgICBmcmljYXRpdmVGaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gMTAwMDtcbiAgICAgICAgZnJpY2F0aXZlRmlsdGVyLlEudmFsdWUgPSAwLjU7XG4gICAgICAgIHdoaXRlTm9pc2UuY29ubmVjdChmcmljYXRpdmVGaWx0ZXIpOyAgLy8gVXNlIHdoaXRlIG5vaXNlIGFzIGlucHV0XG4gICAgICAgIGZyaWNhdGl2ZUZpbHRlci5jb25uZWN0KHRoaXMuc2NyaXB0UHJvY2Vzc29yKTsgIC8vIFVzZSB0aGlzIGFzIGlucHV0IDEgZm9yIHNjcmlwdCBwcm9jZXNzb3JcbiAgICAgICAgXG4gICAgICAgIHdoaXRlTm9pc2Uuc3RhcnQoMCk7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUganVzdCB3aGl0ZSBub2lzZSAodGVzdClcbiAgICAgICAgLy8gdmFyIHduID0gdGhpcy5jcmVhdGVXaGl0ZU5vaXNlTm9kZSgyKnRoaXMudHJvbWJvbmUuc2FtcGxlUmF0ZSk7XG4gICAgICAgIC8vIHduLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgICAvLyB3bi5zdGFydCgwKTtcbiAgICB9XG4gICAgXG4gICAgY3JlYXRlV2hpdGVOb2lzZU5vZGUoZnJhbWVDb3VudCkge1xuICAgICAgICB2YXIgbXlBcnJheUJ1ZmZlciA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBmcmFtZUNvdW50LCB0aGlzLnRyb21ib25lLnNhbXBsZVJhdGUpO1xuXG4gICAgICAgIHZhciBub3dCdWZmZXJpbmcgPSBteUFycmF5QnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZyYW1lQ291bnQ7IGkrKykgXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5vd0J1ZmZlcmluZ1tpXSA9IE1hdGgucmFuZG9tKCk7Ly8gZ2F1c3NpYW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzb3VyY2UgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICAgICAgc291cmNlLmJ1ZmZlciA9IG15QXJyYXlCdWZmZXI7XG4gICAgICAgIHNvdXJjZS5sb29wID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZU5vZGUoKSB7XG4gICAgLy8gICAgIGxldCBidWZmZXIgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgZnJhbWVDb3VudCwgdGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlKTtcblxuICAgICAgICBcblxuICAgIC8vICAgICB2YXIgc291cmNlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgLy8gICAgIHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG4gICAgLy8gICAgIHNvdXJjZS5sb29wID0gdHJ1ZTtcblxuICAgIC8vICAgICByZXR1cm4gc291cmNlO1xuICAgIC8vIH1cbiAgICBcbiAgICBcbiAgICBkb1NjcmlwdFByb2Nlc3NvcihldmVudCkge1xuICAgICAgICB2YXIgaW5wdXRBcnJheTEgPSBldmVudC5pbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTsgIC8vIEdsb3R0aXMgaW5wdXRcbiAgICAgICAgdmFyIGlucHV0QXJyYXkyID0gZXZlbnQuaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMSk7ICAvLyBUcmFjdCBpbnB1dFxuICAgICAgICB2YXIgb3V0QXJyYXkgPSBldmVudC5vdXRwdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7ICAvLyBPdXRwdXQgKG1vbm8pXG4gICAgICAgIGZvciAodmFyIGogPSAwLCBOID0gb3V0QXJyYXkubGVuZ3RoOyBqIDwgTjsgaisrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbGFtYmRhMSA9IGovTjtcbiAgICAgICAgICAgIHZhciBsYW1iZGEyID0gKGorMC41KS9OO1xuICAgICAgICAgICAgdmFyIGdsb3R0YWxPdXRwdXQgPSB0aGlzLnRyb21ib25lLkdsb3R0aXMucnVuU3RlcChsYW1iZGExLCBpbnB1dEFycmF5MVtqXSk7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdm9jYWxPdXRwdXQgPSAwO1xuICAgICAgICAgICAgLy9UcmFjdCBydW5zIGF0IHR3aWNlIHRoZSBzYW1wbGUgcmF0ZSBcbiAgICAgICAgICAgIHRoaXMudHJvbWJvbmUuVHJhY3QucnVuU3RlcChnbG90dGFsT3V0cHV0LCBpbnB1dEFycmF5MltqXSwgbGFtYmRhMSk7XG4gICAgICAgICAgICB2b2NhbE91dHB1dCArPSB0aGlzLnRyb21ib25lLlRyYWN0LmxpcE91dHB1dCArIHRoaXMudHJvbWJvbmUuVHJhY3Qubm9zZU91dHB1dDtcbiAgICAgICAgICAgIHRoaXMudHJvbWJvbmUuVHJhY3QucnVuU3RlcChnbG90dGFsT3V0cHV0LCBpbnB1dEFycmF5MltqXSwgbGFtYmRhMik7XG4gICAgICAgICAgICB2b2NhbE91dHB1dCArPSB0aGlzLnRyb21ib25lLlRyYWN0LmxpcE91dHB1dCArIHRoaXMudHJvbWJvbmUuVHJhY3Qubm9zZU91dHB1dDtcbiAgICAgICAgICAgIG91dEFycmF5W2pdID0gdm9jYWxPdXRwdXQgKiAwLjEyNTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZih0aGlzLnRyb21ib25lLmNvbnRyb2xsZXIubm90ZXMgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIC8vICAgICBmb3IgKHZhciBub3RlSW5kZXggPSAxOyBub3RlSW5kZXggPCB0aGlzLnRyb21ib25lLmNvbnRyb2xsZXIubm90ZXMubGVuZ3RoOyBub3RlSW5kZXgrKyl7XG4gICAgICAgIC8vICAgICAgICAgaWYobm90ZUluZGV4ID4gdGhpcy5udW1Wb2ljZXMgLSAxKSByZXR1cm47XG4gICAgICAgIC8vICAgICAgICAgbGV0IG5vdGUgPSB0aGlzLnRyb21ib25lLmNvbnRyb2xsZXIubm90ZXNbbm90ZUluZGV4XTtcbiAgICAgICAgLy8gICAgICAgICAvL2NvbnNvbGUubG9nKG5vdGUpO1xuXG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cbiAgICAgICAgdGhpcy50cm9tYm9uZS5HbG90dGlzLmZpbmlzaEJsb2NrKCk7XG4gICAgICAgIHRoaXMudHJvbWJvbmUuVHJhY3QuZmluaXNoQmxvY2soKTtcbiAgICB9XG4gICAgXG4gICAgbXV0ZSgpIHtcbiAgICAgICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgICBcbiAgICB1bm11dGUoKSB7XG4gICAgICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pOyBcbiAgICB9XG4gICAgXG59XG5cbmV4cG9ydHMuQXVkaW9TeXN0ZW0gPSBBdWRpb1N5c3RlbTsiLCJpbXBvcnQgbm9pc2UgZnJvbSBcIi4uL25vaXNlLmpzXCI7XG5cbmNsYXNzIEdsb3R0aXMge1xuXG4gICAgY29uc3RydWN0b3IodHJvbWJvbmUpIHtcbiAgICAgICAgdGhpcy50cm9tYm9uZSA9IHRyb21ib25lO1xuXG4gICAgICAgIHRoaXMudGltZUluV2F2ZWZvcm0gPSAwO1xuICAgICAgICB0aGlzLm9sZEZyZXF1ZW5jeSA9IDE0MDtcbiAgICAgICAgdGhpcy5uZXdGcmVxdWVuY3kgPSAxNDA7XG4gICAgICAgIHRoaXMuVUlGcmVxdWVuY3kgPSAxNDA7XG4gICAgICAgIHRoaXMuc21vb3RoRnJlcXVlbmN5ID0gMTQwO1xuICAgICAgICB0aGlzLm9sZFRlbnNlbmVzcyA9IDAuNjtcbiAgICAgICAgdGhpcy5uZXdUZW5zZW5lc3MgPSAwLjY7XG4gICAgICAgIHRoaXMuVUlUZW5zZW5lc3MgPSAwLjY7XG4gICAgICAgIHRoaXMudG90YWxUaW1lID0gMDtcbiAgICAgICAgdGhpcy52aWJyYXRvQW1vdW50ID0gMC4wMDU7XG4gICAgICAgIHRoaXMudmlicmF0b0ZyZXF1ZW5jeSA9IDY7XG4gICAgICAgIHRoaXMuaW50ZW5zaXR5ID0gMDtcbiAgICAgICAgdGhpcy5sb3VkbmVzcyA9IDE7XG4gICAgICAgIHRoaXMuaXNUb3VjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudG91Y2ggPSAwO1xuICAgICAgICB0aGlzLnggPSAyNDA7XG4gICAgICAgIHRoaXMueSA9IDUzMDtcblxuICAgICAgICB0aGlzLmtleWJvYXJkVG9wID0gNTAwO1xuICAgICAgICB0aGlzLmtleWJvYXJkTGVmdCA9IDA7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRXaWR0aCA9IDYwMDtcbiAgICAgICAgdGhpcy5rZXlib2FyZEhlaWdodCA9IDEwMDtcbiAgICAgICAgdGhpcy5zZW1pdG9uZXMgPSAyMDtcbiAgICAgICAgdGhpcy5tYXJrcyA9IFswLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwXTtcbiAgICAgICAgdGhpcy5iYXNlTm90ZSA9IDg3LjMwNzE7IC8vRlxuXG4gICAgICAgIHRoaXMub3V0cHV0O1xuXG4gICAgICAgIC8vLyBBbGxvdyBwaXRjaCB0byB3b2JibGUgb3ZlciB0aW1lXG4gICAgICAgIHRoaXMuYWRkUGl0Y2hWYXJpYW5jZSA9IHRydWU7XG4gICAgICAgIC8vLyBBbGxvdyB0ZW5zZW5lc3MgdG8gd29iYmxlIG92ZXIgdGltZVxuICAgICAgICB0aGlzLmFkZFRlbnNlbmVzc1ZhcmlhbmNlID0gdHJ1ZTtcblxuICAgIH1cbiAgICBcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLnNldHVwV2F2ZWZvcm0oMCk7XG4gICAgfVxuICAgIFxuICAgIGhhbmRsZVRvdWNoZXMoKSB7XG4gICAgICAgIGlmICh0aGlzLnRvdWNoICE9IDAgJiYgIXRoaXMudG91Y2guYWxpdmUpIHRoaXMudG91Y2ggPSAwO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMudG91Y2ggPT0gMClcbiAgICAgICAgeyAgICAgICAgXG4gICAgICAgICAgICBmb3IgKHZhciBqPTA7IGo8VUkudG91Y2hlc1dpdGhNb3VzZS5sZW5ndGg7IGorKykgIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciB0b3VjaCA9IFVJLnRvdWNoZXNXaXRoTW91c2Vbal07XG4gICAgICAgICAgICAgICAgaWYgKCF0b3VjaC5hbGl2ZSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKHRvdWNoLnk8dGhpcy5rZXlib2FyZFRvcCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgdGhpcy50b3VjaCA9IHRvdWNoO1xuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMudG91Y2ggIT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxvY2FsX3kgPSB0aGlzLnRvdWNoLnkgLSAgdGhpcy5rZXlib2FyZFRvcC0xMDtcbiAgICAgICAgICAgIHZhciBsb2NhbF94ID0gdGhpcy50b3VjaC54IC0gdGhpcy5rZXlib2FyZExlZnQ7XG4gICAgICAgICAgICBsb2NhbF95ID0gTWF0aC5jbGFtcChsb2NhbF95LCAwLCB0aGlzLmtleWJvYXJkSGVpZ2h0LTI2KTtcbiAgICAgICAgICAgIHZhciBzZW1pdG9uZSA9IHRoaXMuc2VtaXRvbmVzICogbG9jYWxfeCAvIHRoaXMua2V5Ym9hcmRXaWR0aCArIDAuNTtcbiAgICAgICAgICAgIEdsb3R0aXMuVUlGcmVxdWVuY3kgPSB0aGlzLmJhc2VOb3RlICogTWF0aC5wb3coMiwgc2VtaXRvbmUvMTIpO1xuICAgICAgICAgICAgaWYgKEdsb3R0aXMuaW50ZW5zaXR5ID09IDApIEdsb3R0aXMuc21vb3RoRnJlcXVlbmN5ID0gR2xvdHRpcy5VSUZyZXF1ZW5jeTtcbiAgICAgICAgICAgIC8vR2xvdHRpcy5VSVJkID0gMypsb2NhbF95IC8gKHRoaXMua2V5Ym9hcmRIZWlnaHQtMjApO1xuICAgICAgICAgICAgdmFyIHQgPSBNYXRoLmNsYW1wKDEtbG9jYWxfeSAvICh0aGlzLmtleWJvYXJkSGVpZ2h0LTI4KSwgMCwgMSk7XG4gICAgICAgICAgICBHbG90dGlzLlVJVGVuc2VuZXNzID0gMS1NYXRoLmNvcyh0Kk1hdGguUEkqMC41KTtcbiAgICAgICAgICAgIEdsb3R0aXMubG91ZG5lc3MgPSBNYXRoLnBvdyhHbG90dGlzLlVJVGVuc2VuZXNzLCAwLjI1KTtcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMudG91Y2gueDtcbiAgICAgICAgICAgIHRoaXMueSA9IGxvY2FsX3kgKyB0aGlzLmtleWJvYXJkVG9wKzEwO1xuICAgICAgICB9XG4gICAgICAgIEdsb3R0aXMuaXNUb3VjaGVkID0gKHRoaXMudG91Y2ggIT0gMCk7XG4gICAgfVxuICAgICAgICBcbiAgICBydW5TdGVwKGxhbWJkYSwgbm9pc2VTb3VyY2UpIHtcbiAgICAgICAgdmFyIHRpbWVTdGVwID0gMS4wIC8gdGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlO1xuICAgICAgICB0aGlzLnRpbWVJbldhdmVmb3JtICs9IHRpbWVTdGVwO1xuICAgICAgICB0aGlzLnRvdGFsVGltZSArPSB0aW1lU3RlcDtcbiAgICAgICAgaWYgKHRoaXMudGltZUluV2F2ZWZvcm0gPiB0aGlzLndhdmVmb3JtTGVuZ3RoKSBcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy50aW1lSW5XYXZlZm9ybSAtPSB0aGlzLndhdmVmb3JtTGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5zZXR1cFdhdmVmb3JtKGxhbWJkYSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG91dCA9IHRoaXMubm9ybWFsaXplZExGV2F2ZWZvcm0odGhpcy50aW1lSW5XYXZlZm9ybS90aGlzLndhdmVmb3JtTGVuZ3RoKTtcbiAgICAgICAgdmFyIGFzcGlyYXRpb24gPSB0aGlzLmludGVuc2l0eSooMS4wLU1hdGguc3FydCh0aGlzLlVJVGVuc2VuZXNzKSkqdGhpcy5nZXROb2lzZU1vZHVsYXRvcigpKm5vaXNlU291cmNlO1xuICAgICAgICBhc3BpcmF0aW9uICo9IDAuMiArIDAuMDIgKiBub2lzZS5zaW1wbGV4MSh0aGlzLnRvdGFsVGltZSAqIDEuOTkpO1xuICAgICAgICBvdXQgKz0gYXNwaXJhdGlvbjtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgXG4gICAgZ2V0Tm9pc2VNb2R1bGF0b3IoKSB7XG4gICAgICAgIHZhciB2b2ljZWQgPSAwLjErMC4yKk1hdGgubWF4KDAsTWF0aC5zaW4oTWF0aC5QSSoyKnRoaXMudGltZUluV2F2ZWZvcm0vdGhpcy53YXZlZm9ybUxlbmd0aCkpO1xuICAgICAgICAvL3JldHVybiAwLjM7XG4gICAgICAgIHJldHVybiB0aGlzLlVJVGVuc2VuZXNzKiB0aGlzLmludGVuc2l0eSAqIHZvaWNlZCArICgxLXRoaXMuVUlUZW5zZW5lc3MqIHRoaXMuaW50ZW5zaXR5ICkgKiAwLjM7XG4gICAgfVxuICAgIFxuICAgIGZpbmlzaEJsb2NrKCkge1xuICAgICAgICB2YXIgdmlicmF0byA9IDA7XG4gICAgICAgIGlmICh0aGlzLmFkZFBpdGNoVmFyaWFuY2UpIHtcbiAgICAgICAgICAgIC8vIEFkZCBzbWFsbCBpbXBlcmZlY3Rpb25zIHRvIHRoZSB2b2NhbCBvdXRwdXRcbiAgICAgICAgICAgIHZpYnJhdG8gKz0gdGhpcy52aWJyYXRvQW1vdW50ICogTWF0aC5zaW4oMipNYXRoLlBJICogdGhpcy50b3RhbFRpbWUgKnRoaXMudmlicmF0b0ZyZXF1ZW5jeSk7ICAgICAgICAgIFxuICAgICAgICAgICAgdmlicmF0byArPSAwLjAyICogbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUgKiA0LjA3KTtcbiAgICAgICAgICAgIHZpYnJhdG8gKz0gMC4wNCAqIG5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lICogMi4xNSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnRyb21ib25lLmF1dG9Xb2JibGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZpYnJhdG8gKz0gMC4yICogbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUgKiAwLjk4KTtcbiAgICAgICAgICAgIHZpYnJhdG8gKz0gMC40ICogbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUgKiAwLjUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuVUlGcmVxdWVuY3k+dGhpcy5zbW9vdGhGcmVxdWVuY3kpIFxuICAgICAgICAgICAgdGhpcy5zbW9vdGhGcmVxdWVuY3kgPSBNYXRoLm1pbih0aGlzLnNtb290aEZyZXF1ZW5jeSAqIDEuMSwgdGhpcy5VSUZyZXF1ZW5jeSk7XG4gICAgICAgIGlmICh0aGlzLlVJRnJlcXVlbmN5PHRoaXMuc21vb3RoRnJlcXVlbmN5KSBcbiAgICAgICAgICAgIHRoaXMuc21vb3RoRnJlcXVlbmN5ID0gTWF0aC5tYXgodGhpcy5zbW9vdGhGcmVxdWVuY3kgLyAxLjEsIHRoaXMuVUlGcmVxdWVuY3kpO1xuICAgICAgICB0aGlzLm9sZEZyZXF1ZW5jeSA9IHRoaXMubmV3RnJlcXVlbmN5O1xuICAgICAgICB0aGlzLm5ld0ZyZXF1ZW5jeSA9IHRoaXMuc21vb3RoRnJlcXVlbmN5ICogKDErdmlicmF0byk7XG4gICAgICAgIHRoaXMub2xkVGVuc2VuZXNzID0gdGhpcy5uZXdUZW5zZW5lc3M7XG5cbiAgICAgICAgaWYgKHRoaXMuYWRkVGVuc2VuZXNzVmFyaWFuY2UpXG4gICAgICAgICAgICB0aGlzLm5ld1RlbnNlbmVzcyA9IHRoaXMuVUlUZW5zZW5lc3MgKyAwLjEqbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUqMC40NikrMC4wNSpub2lzZS5zaW1wbGV4MSh0aGlzLnRvdGFsVGltZSowLjM2KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5uZXdUZW5zZW5lc3MgPSB0aGlzLlVJVGVuc2VuZXNzO1xuXG4gICAgICAgIGlmICghdGhpcy5pc1RvdWNoZWQgJiYgdGhpcy50cm9tYm9uZS5hbHdheXNWb2ljZSkgdGhpcy5uZXdUZW5zZW5lc3MgKz0gKDMtdGhpcy5VSVRlbnNlbmVzcykqKDEtdGhpcy5pbnRlbnNpdHkpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuaXNUb3VjaGVkIHx8IHRoaXMudHJvbWJvbmUuYWx3YXlzVm9pY2UpXG4gICAgICAgICAgICB0aGlzLmludGVuc2l0eSArPSAwLjEzO1xuICAgICAgICB0aGlzLmludGVuc2l0eSA9IE1hdGguY2xhbXAodGhpcy5pbnRlbnNpdHksIDAsIDEpO1xuICAgIH1cbiAgICBcbiAgICBzZXR1cFdhdmVmb3JtKGxhbWJkYSkge1xuICAgICAgICB0aGlzLmZyZXF1ZW5jeSA9IHRoaXMub2xkRnJlcXVlbmN5KigxLWxhbWJkYSkgKyB0aGlzLm5ld0ZyZXF1ZW5jeSpsYW1iZGE7XG4gICAgICAgIHZhciB0ZW5zZW5lc3MgPSB0aGlzLm9sZFRlbnNlbmVzcyooMS1sYW1iZGEpICsgdGhpcy5uZXdUZW5zZW5lc3MqbGFtYmRhO1xuICAgICAgICB0aGlzLlJkID0gMyooMS10ZW5zZW5lc3MpO1xuICAgICAgICB0aGlzLndhdmVmb3JtTGVuZ3RoID0gMS4wL3RoaXMuZnJlcXVlbmN5O1xuICAgICAgICBcbiAgICAgICAgdmFyIFJkID0gdGhpcy5SZDtcbiAgICAgICAgaWYgKFJkPDAuNSkgUmQgPSAwLjU7XG4gICAgICAgIGlmIChSZD4yLjcpIFJkID0gMi43O1xuICAgICAgICAvLyBub3JtYWxpemVkIHRvIHRpbWUgPSAxLCBFZSA9IDFcbiAgICAgICAgdmFyIFJhID0gLTAuMDEgKyAwLjA0OCpSZDtcbiAgICAgICAgdmFyIFJrID0gMC4yMjQgKyAwLjExOCpSZDtcbiAgICAgICAgdmFyIFJnID0gKFJrLzQpKigwLjUrMS4yKlJrKS8oMC4xMSpSZC1SYSooMC41KzEuMipSaykpO1xuICAgICAgICBcbiAgICAgICAgdmFyIFRhID0gUmE7XG4gICAgICAgIHZhciBUcCA9IDEgLyAoMipSZyk7XG4gICAgICAgIHZhciBUZSA9IFRwICsgVHAqUms7IC8vXG4gICAgICAgIFxuICAgICAgICB2YXIgZXBzaWxvbiA9IDEvVGE7XG4gICAgICAgIHZhciBzaGlmdCA9IE1hdGguZXhwKC1lcHNpbG9uICogKDEtVGUpKTtcbiAgICAgICAgdmFyIERlbHRhID0gMSAtIHNoaWZ0OyAvL2RpdmlkZSBieSB0aGlzIHRvIHNjYWxlIFJIU1xuICAgICAgICAgICBcbiAgICAgICAgdmFyIFJIU0ludGVncmFsID0gKDEvZXBzaWxvbikqKHNoaWZ0IC0gMSkgKyAoMS1UZSkqc2hpZnQ7XG4gICAgICAgIFJIU0ludGVncmFsID0gUkhTSW50ZWdyYWwvRGVsdGE7XG4gICAgICAgIFxuICAgICAgICB2YXIgdG90YWxMb3dlckludGVncmFsID0gLSAoVGUtVHApLzIgKyBSSFNJbnRlZ3JhbDtcbiAgICAgICAgdmFyIHRvdGFsVXBwZXJJbnRlZ3JhbCA9IC10b3RhbExvd2VySW50ZWdyYWw7XG4gICAgICAgIFxuICAgICAgICB2YXIgb21lZ2EgPSBNYXRoLlBJL1RwO1xuICAgICAgICB2YXIgcyA9IE1hdGguc2luKG9tZWdhKlRlKTtcbiAgICAgICAgdmFyIHkgPSAtTWF0aC5QSSpzKnRvdGFsVXBwZXJJbnRlZ3JhbCAvIChUcCoyKTtcbiAgICAgICAgdmFyIHogPSBNYXRoLmxvZyh5KTtcbiAgICAgICAgdmFyIGFscGhhID0gei8oVHAvMiAtIFRlKTtcbiAgICAgICAgdmFyIEUwID0gLTEgLyAocypNYXRoLmV4cChhbHBoYSpUZSkpO1xuICAgICAgICB0aGlzLmFscGhhID0gYWxwaGE7XG4gICAgICAgIHRoaXMuRTAgPSBFMDtcbiAgICAgICAgdGhpcy5lcHNpbG9uID0gZXBzaWxvbjtcbiAgICAgICAgdGhpcy5zaGlmdCA9IHNoaWZ0O1xuICAgICAgICB0aGlzLkRlbHRhID0gRGVsdGE7XG4gICAgICAgIHRoaXMuVGU9VGU7XG4gICAgICAgIHRoaXMub21lZ2EgPSBvbWVnYTtcbiAgICB9XG4gICAgXG4gXG4gICAgbm9ybWFsaXplZExGV2F2ZWZvcm0odCkgeyAgICAgXG4gICAgICAgIGlmICh0PnRoaXMuVGUpIHRoaXMub3V0cHV0ID0gKC1NYXRoLmV4cCgtdGhpcy5lcHNpbG9uICogKHQtdGhpcy5UZSkpICsgdGhpcy5zaGlmdCkvdGhpcy5EZWx0YTtcbiAgICAgICAgZWxzZSB0aGlzLm91dHB1dCA9IHRoaXMuRTAgKiBNYXRoLmV4cCh0aGlzLmFscGhhKnQpICogTWF0aC5zaW4odGhpcy5vbWVnYSAqIHQpO1xuICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0cHV0ICogdGhpcy5pbnRlbnNpdHkgKiB0aGlzLmxvdWRuZXNzO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgR2xvdHRpcyB9OyIsImNsYXNzIFRyYWN0VUlcbntcblxuICAgIGNvbnN0cnVjdG9yKHRyb21ib25lKSB7XG4gICAgICAgIHRoaXMudHJvbWJvbmUgPSB0cm9tYm9uZTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub3JpZ2luWCA9IDM0MDsgXG4gICAgICAgIHRoaXMub3JpZ2luWSA9IDQ0OTsgXG4gICAgICAgIHRoaXMucmFkaXVzID0gMjk4OyBcbiAgICAgICAgdGhpcy5zY2FsZSA9IDYwO1xuICAgICAgICB0aGlzLnRvbmd1ZUluZGV4ID0gMTIuOTtcbiAgICAgICAgdGhpcy50b25ndWVEaWFtZXRlciA9IDIuNDM7XG4gICAgICAgIHRoaXMuaW5uZXJUb25ndWVDb250cm9sUmFkaXVzID0gMi4wNTtcbiAgICAgICAgdGhpcy5vdXRlclRvbmd1ZUNvbnRyb2xSYWRpdXMgPSAzLjU7XG4gICAgICAgIHRoaXMudG9uZ3VlVG91Y2ggPSAwO1xuICAgICAgICB0aGlzLmFuZ2xlU2NhbGUgPSAwLjY0O1xuICAgICAgICB0aGlzLmFuZ2xlT2Zmc2V0ID0gLTAuMjQ7XG4gICAgICAgIHRoaXMubm9zZU9mZnNldCA9IDAuODtcbiAgICAgICAgdGhpcy5ncmlkT2Zmc2V0ID0gMS43O1xuXG4gICAgICAgIC8vLyBGaW5hbCBvcGVubmVzcyBvZiB0aGUgbW91dGggKGNsb3NlciB0byAwIGlzIG1vcmUgY2xvc2VkKVxuICAgICAgICB0aGlzLnRhcmdldCA9IDAuMTtcbiAgICAgICAgLy8vIEluZGV4IGluIHRoZSB0aHJvYXQgYXJyYXkgdG8gbW92ZSB0byB0YXJnZXRcbiAgICAgICAgdGhpcy5pbmRleCA9IDQyO1xuICAgICAgICAvLy8gTnVtYmVyIG9mIHRocm9hdCBzZWdtZW50cyB0byBjbG9zZSBhcm91bmQgdGhlIGluZGV4XG4gICAgICAgIHRoaXMucmFkaXVzID0gMDtcbiAgICB9XG4gICAgXG4gICAgaW5pdCgpIHtcbiAgICAgICAgbGV0IFRyYWN0ID0gdGhpcy50cm9tYm9uZS5UcmFjdDtcblxuICAgICAgICB0aGlzLnNldFJlc3REaWFtZXRlcigpO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8VHJhY3QubjsgaSsrKSBcbiAgICAgICAge1xuICAgICAgICAgICAgVHJhY3QuZGlhbWV0ZXJbaV0gPSBUcmFjdC50YXJnZXREaWFtZXRlcltpXSA9IFRyYWN0LnJlc3REaWFtZXRlcltpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9uZ3VlTG93ZXJJbmRleEJvdW5kID0gVHJhY3QuYmxhZGVTdGFydCsyO1xuICAgICAgICB0aGlzLnRvbmd1ZVVwcGVySW5kZXhCb3VuZCA9IFRyYWN0LnRpcFN0YXJ0LTM7XG4gICAgICAgIHRoaXMudG9uZ3VlSW5kZXhDZW50cmUgPSAwLjUqKHRoaXMudG9uZ3VlTG93ZXJJbmRleEJvdW5kK3RoaXMudG9uZ3VlVXBwZXJJbmRleEJvdW5kKTtcbiAgICB9XG4gICAgICAgIFxuICAgIGdldEluZGV4KHgseSkge1xuICAgICAgICBsZXQgVHJhY3QgPSB0aGlzLnRyb21ib25lLlRyYWN0O1xuXG4gICAgICAgIHZhciB4eCA9IHgtdGhpcy5vcmlnaW5YOyB2YXIgeXkgPSB5LXRoaXMub3JpZ2luWTtcbiAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMih5eSwgeHgpO1xuICAgICAgICB3aGlsZSAoYW5nbGU+IDApIGFuZ2xlIC09IDIqTWF0aC5QSTtcbiAgICAgICAgcmV0dXJuIChNYXRoLlBJICsgYW5nbGUgLSB0aGlzLmFuZ2xlT2Zmc2V0KSooVHJhY3QubGlwU3RhcnQtMSkgLyAodGhpcy5hbmdsZVNjYWxlKk1hdGguUEkpO1xuICAgIH1cblxuICAgIGdldERpYW1ldGVyKHgseSkge1xuICAgICAgICB2YXIgeHggPSB4LXRoaXMub3JpZ2luWDsgdmFyIHl5ID0geS10aGlzLm9yaWdpblk7XG4gICAgICAgIHJldHVybiAodGhpcy5yYWRpdXMtTWF0aC5zcXJ0KHh4Knh4ICsgeXkqeXkpKS90aGlzLnNjYWxlO1xuICAgIH1cbiAgICBcbiAgICBzZXRSZXN0RGlhbWV0ZXIoKSB7XG4gICAgICAgIGxldCBUcmFjdCA9IHRoaXMudHJvbWJvbmUuVHJhY3Q7XG5cbiAgICAgICAgZm9yICh2YXIgaT1UcmFjdC5ibGFkZVN0YXJ0OyBpPFRyYWN0LmxpcFN0YXJ0OyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0ID0gMS4xICogTWF0aC5QSSoodGhpcy50b25ndWVJbmRleCAtIGkpLyhUcmFjdC50aXBTdGFydCAtIFRyYWN0LmJsYWRlU3RhcnQpO1xuICAgICAgICAgICAgdmFyIGZpeGVkVG9uZ3VlRGlhbWV0ZXIgPSAyKyh0aGlzLnRvbmd1ZURpYW1ldGVyLTIpLzEuNTtcbiAgICAgICAgICAgIHZhciBjdXJ2ZSA9ICgxLjUtZml4ZWRUb25ndWVEaWFtZXRlcit0aGlzLmdyaWRPZmZzZXQpKk1hdGguY29zKHQpO1xuICAgICAgICAgICAgaWYgKGkgPT0gVHJhY3QuYmxhZGVTdGFydC0yIHx8IGkgPT0gVHJhY3QubGlwU3RhcnQtMSkgY3VydmUgKj0gMC44O1xuICAgICAgICAgICAgaWYgKGkgPT0gVHJhY3QuYmxhZGVTdGFydCB8fCBpID09IFRyYWN0LmxpcFN0YXJ0LTIpIGN1cnZlICo9IDAuOTQ7ICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBUcmFjdC5yZXN0RGlhbWV0ZXJbaV0gPSAxLjUgLSBjdXJ2ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGxpcHMgb2YgdGhlIG1vZGVsZWQgdHJhY3QgdG8gYmUgY2xvc2VkIGJ5IHRoZSBzcGVjaWZpZWQgYW1vdW50LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcm9ncmVzcyBQZXJjZW50YWdlIGNsb3NlZCAobnVtYmVyIGJldHdlZW4gMCBhbmQgMSlcbiAgICAgKi9cbiAgICBTZXRMaXBzQ2xvc2VkKHByb2dyZXNzKSB7XG5cbiAgICAgICAgbGV0IFRyYWN0ID0gdGhpcy50cm9tYm9uZS5UcmFjdDtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0UmVzdERpYW1ldGVyKCk7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxUcmFjdC5uOyBpKyspIFRyYWN0LnRhcmdldERpYW1ldGVyW2ldID0gVHJhY3QucmVzdERpYW1ldGVyW2ldOyAgICBcblxuICAgICAgICAvLyBEaXNhYmxlIHRoaXMgYmVoYXZpb3IgaWYgdGhlIG1vdXRoIGlzIGNsb3NlZCBhIGNlcnRhaW4gYW1vdW50XG4gICAgICAgIC8vaWYgKHByb2dyZXNzID4gMC44IHx8IHByb2dyZXNzIDwgMC4xKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBmb3IobGV0IGk9IHRoaXMuaW5kZXggLSB0aGlzLnJhZGl1czsgaSA8PSB0aGlzLmluZGV4ICsgdGhpcy5yYWRpdXM7IGkrKyl7XG4gICAgICAgICAgICBpZiAoaSA+IFRyYWN0LnRhcmdldERpYW1ldGVyLmxlbmd0aCB8fCBpIDwgMCkgY29udGludWU7XG4gICAgICAgICAgICBsZXQgaW50ZXJwID0gTWF0aC5sZXJwKFRyYWN0LnJlc3REaWFtZXRlcltpXSwgdGhpcy50YXJnZXQsIHByb2dyZXNzKTtcbiAgICAgICAgICAgIFRyYWN0LnRhcmdldERpYW1ldGVyW2ldID0gaW50ZXJwO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cblxuZXhwb3J0IHsgVHJhY3RVSSB9OyIsImNsYXNzIFRyYWN0IHtcblxuICAgIGNvbnN0cnVjdG9yKHRyb21ib25lKSB7XG4gICAgICAgIHRoaXMudHJvbWJvbmUgPSB0cm9tYm9uZTtcblxuICAgICAgICB0aGlzLm4gPSA0NDtcbiAgICAgICAgdGhpcy5ibGFkZVN0YXJ0ID0gMTA7XG4gICAgICAgIHRoaXMudGlwU3RhcnQgPSAzMjtcbiAgICAgICAgdGhpcy5saXBTdGFydCA9IDM5O1xuICAgICAgICB0aGlzLlIgPSBbXTsgLy9jb21wb25lbnQgZ29pbmcgcmlnaHRcbiAgICAgICAgdGhpcy5MID0gW107IC8vY29tcG9uZW50IGdvaW5nIGxlZnRcbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uID0gW107XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRSID0gW107XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRMID0gW107XG4gICAgICAgIHRoaXMubWF4QW1wbGl0dWRlID0gW107XG4gICAgICAgIHRoaXMuZGlhbWV0ZXIgPSBbXTtcbiAgICAgICAgdGhpcy5yZXN0RGlhbWV0ZXIgPSBbXTtcbiAgICAgICAgdGhpcy50YXJnZXREaWFtZXRlciA9IFtdO1xuICAgICAgICB0aGlzLm5ld0RpYW1ldGVyID0gW107XG4gICAgICAgIHRoaXMuQSA9IFtdO1xuICAgICAgICB0aGlzLmdsb3R0YWxSZWZsZWN0aW9uID0gMC43NTtcbiAgICAgICAgdGhpcy5saXBSZWZsZWN0aW9uID0gLTAuODU7XG4gICAgICAgIHRoaXMubGFzdE9ic3RydWN0aW9uID0gLTE7XG4gICAgICAgIHRoaXMuZmFkZSA9IDEuMDsgLy8wLjk5OTksXG4gICAgICAgIHRoaXMubW92ZW1lbnRTcGVlZCA9IDE1OyAvL2NtIHBlciBzZWNvbmRcbiAgICAgICAgdGhpcy50cmFuc2llbnRzID0gW107XG4gICAgICAgIHRoaXMubGlwT3V0cHV0ID0gMDtcbiAgICAgICAgdGhpcy5ub3NlT3V0cHV0ID0gMDtcbiAgICAgICAgdGhpcy52ZWx1bVRhcmdldCA9IDAuMDE7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5ibGFkZVN0YXJ0ID0gTWF0aC5mbG9vcih0aGlzLmJsYWRlU3RhcnQqdGhpcy5uLzQ0KTtcbiAgICAgICAgdGhpcy50aXBTdGFydCA9IE1hdGguZmxvb3IodGhpcy50aXBTdGFydCp0aGlzLm4vNDQpO1xuICAgICAgICB0aGlzLmxpcFN0YXJ0ID0gTWF0aC5mbG9vcih0aGlzLmxpcFN0YXJ0KnRoaXMubi80NCk7ICAgICAgICBcbiAgICAgICAgdGhpcy5kaWFtZXRlciA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKTtcbiAgICAgICAgdGhpcy5yZXN0RGlhbWV0ZXIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMudGFyZ2V0RGlhbWV0ZXIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMubmV3RGlhbWV0ZXIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm47IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGRpYW1ldGVyID0gMDtcbiAgICAgICAgICAgIGlmIChpPDcqdGhpcy5uLzQ0LTAuNSkgZGlhbWV0ZXIgPSAwLjY7XG4gICAgICAgICAgICBlbHNlIGlmIChpPDEyKnRoaXMubi80NCkgZGlhbWV0ZXIgPSAxLjE7XG4gICAgICAgICAgICBlbHNlIGRpYW1ldGVyID0gMS41O1xuICAgICAgICAgICAgdGhpcy5kaWFtZXRlcltpXSA9IHRoaXMucmVzdERpYW1ldGVyW2ldID0gdGhpcy50YXJnZXREaWFtZXRlcltpXSA9IHRoaXMubmV3RGlhbWV0ZXJbaV0gPSBkaWFtZXRlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLlIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMuTCA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKTtcbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4rMSk7XG4gICAgICAgIHRoaXMubmV3UmVmbGVjdGlvbiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKzEpO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0UiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKzEpO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0TCA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKzEpO1xuICAgICAgICB0aGlzLkEgPW5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKTtcbiAgICAgICAgdGhpcy5tYXhBbXBsaXR1ZGUgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIFxuICAgICAgICB0aGlzLm5vc2VMZW5ndGggPSBNYXRoLmZsb29yKDI4KnRoaXMubi80NClcbiAgICAgICAgdGhpcy5ub3NlU3RhcnQgPSB0aGlzLm4tdGhpcy5ub3NlTGVuZ3RoICsgMTtcbiAgICAgICAgdGhpcy5ub3NlUiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ub3NlTCA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRSID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgrMSk7XG4gICAgICAgIHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0TCA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKzEpOyAgICAgICAgXG4gICAgICAgIHRoaXMubm9zZVJlZmxlY3Rpb24gPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCsxKTtcbiAgICAgICAgdGhpcy5ub3NlRGlhbWV0ZXIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgIHRoaXMubm9zZUEgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgIHRoaXMubm9zZU1heEFtcGxpdHVkZSA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubm9zZUxlbmd0aDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZGlhbWV0ZXI7XG4gICAgICAgICAgICB2YXIgZCA9IDIqKGkvdGhpcy5ub3NlTGVuZ3RoKTtcbiAgICAgICAgICAgIGlmIChkPDEpIGRpYW1ldGVyID0gMC40KzEuNipkO1xuICAgICAgICAgICAgZWxzZSBkaWFtZXRlciA9IDAuNSsxLjUqKDItZCk7XG4gICAgICAgICAgICBkaWFtZXRlciA9IE1hdGgubWluKGRpYW1ldGVyLCAxLjkpO1xuICAgICAgICAgICAgdGhpcy5ub3NlRGlhbWV0ZXJbaV0gPSBkaWFtZXRlcjtcbiAgICAgICAgfSAgICAgICBcbiAgICAgICAgdGhpcy5uZXdSZWZsZWN0aW9uTGVmdCA9IHRoaXMubmV3UmVmbGVjdGlvblJpZ2h0ID0gdGhpcy5uZXdSZWZsZWN0aW9uTm9zZSA9IDA7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUmVmbGVjdGlvbnMoKTsgICAgICAgIFxuICAgICAgICB0aGlzLmNhbGN1bGF0ZU5vc2VSZWZsZWN0aW9ucygpO1xuICAgICAgICB0aGlzLm5vc2VEaWFtZXRlclswXSA9IHRoaXMudmVsdW1UYXJnZXQ7XG4gICAgfVxuICAgIFxuICAgIHJlc2hhcGVUcmFjdChkZWx0YVRpbWUpIHtcbiAgICAgICAgdmFyIGFtb3VudCA9IGRlbHRhVGltZSAqIHRoaXMubW92ZW1lbnRTcGVlZDsgOyAgICBcbiAgICAgICAgdmFyIG5ld0xhc3RPYnN0cnVjdGlvbiA9IC0xO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5uOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBkaWFtZXRlciA9IHRoaXMuZGlhbWV0ZXJbaV07XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RGlhbWV0ZXIgPSB0aGlzLnRhcmdldERpYW1ldGVyW2ldO1xuICAgICAgICAgICAgaWYgKGRpYW1ldGVyIDw9IDApIG5ld0xhc3RPYnN0cnVjdGlvbiA9IGk7XG4gICAgICAgICAgICB2YXIgc2xvd1JldHVybjsgXG4gICAgICAgICAgICBpZiAoaTx0aGlzLm5vc2VTdGFydCkgc2xvd1JldHVybiA9IDAuNjtcbiAgICAgICAgICAgIGVsc2UgaWYgKGkgPj0gdGhpcy50aXBTdGFydCkgc2xvd1JldHVybiA9IDEuMDsgXG4gICAgICAgICAgICBlbHNlIHNsb3dSZXR1cm4gPSAwLjYrMC40KihpLXRoaXMubm9zZVN0YXJ0KS8odGhpcy50aXBTdGFydC10aGlzLm5vc2VTdGFydCk7XG4gICAgICAgICAgICB0aGlzLmRpYW1ldGVyW2ldID0gTWF0aC5tb3ZlVG93YXJkcyhkaWFtZXRlciwgdGFyZ2V0RGlhbWV0ZXIsIHNsb3dSZXR1cm4qYW1vdW50LCAyKmFtb3VudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubGFzdE9ic3RydWN0aW9uPi0xICYmIG5ld0xhc3RPYnN0cnVjdGlvbiA9PSAtMSAmJiB0aGlzLm5vc2VBWzBdPDAuMDUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVHJhbnNpZW50KHRoaXMubGFzdE9ic3RydWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhc3RPYnN0cnVjdGlvbiA9IG5ld0xhc3RPYnN0cnVjdGlvbjtcbiAgICAgICAgXG4gICAgICAgIGFtb3VudCA9IGRlbHRhVGltZSAqIHRoaXMubW92ZW1lbnRTcGVlZDsgXG4gICAgICAgIHRoaXMubm9zZURpYW1ldGVyWzBdID0gTWF0aC5tb3ZlVG93YXJkcyh0aGlzLm5vc2VEaWFtZXRlclswXSwgdGhpcy52ZWx1bVRhcmdldCwgXG4gICAgICAgICAgICAgICAgYW1vdW50KjAuMjUsIGFtb3VudCowLjEpO1xuICAgICAgICB0aGlzLm5vc2VBWzBdID0gdGhpcy5ub3NlRGlhbWV0ZXJbMF0qdGhpcy5ub3NlRGlhbWV0ZXJbMF07ICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgY2FsY3VsYXRlUmVmbGVjdGlvbnMoKSB7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm47IGkrKykgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuQVtpXSA9IHRoaXMuZGlhbWV0ZXJbaV0qdGhpcy5kaWFtZXRlcltpXTsgLy9pZ25vcmluZyBQSSBldGMuXG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaT0xOyBpPHRoaXMubjsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb25baV0gPSB0aGlzLm5ld1JlZmxlY3Rpb25baV07XG4gICAgICAgICAgICBpZiAodGhpcy5BW2ldID09IDApIHRoaXMubmV3UmVmbGVjdGlvbltpXSA9IDAuOTk5OyAvL3RvIHByZXZlbnQgc29tZSBiYWQgYmVoYXZpb3VyIGlmIDBcbiAgICAgICAgICAgIGVsc2UgdGhpcy5uZXdSZWZsZWN0aW9uW2ldID0gKHRoaXMuQVtpLTFdLXRoaXMuQVtpXSkgLyAodGhpcy5BW2ktMV0rdGhpcy5BW2ldKTsgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vbm93IGF0IGp1bmN0aW9uIHdpdGggbm9zZVxuXG4gICAgICAgIHRoaXMucmVmbGVjdGlvbkxlZnQgPSB0aGlzLm5ld1JlZmxlY3Rpb25MZWZ0O1xuICAgICAgICB0aGlzLnJlZmxlY3Rpb25SaWdodCA9IHRoaXMubmV3UmVmbGVjdGlvblJpZ2h0O1xuICAgICAgICB0aGlzLnJlZmxlY3Rpb25Ob3NlID0gdGhpcy5uZXdSZWZsZWN0aW9uTm9zZTtcbiAgICAgICAgdmFyIHN1bSA9IHRoaXMuQVt0aGlzLm5vc2VTdGFydF0rdGhpcy5BW3RoaXMubm9zZVN0YXJ0KzFdK3RoaXMubm9zZUFbMF07XG4gICAgICAgIHRoaXMubmV3UmVmbGVjdGlvbkxlZnQgPSAoMip0aGlzLkFbdGhpcy5ub3NlU3RhcnRdLXN1bSkvc3VtO1xuICAgICAgICB0aGlzLm5ld1JlZmxlY3Rpb25SaWdodCA9ICgyKnRoaXMuQVt0aGlzLm5vc2VTdGFydCsxXS1zdW0pL3N1bTsgICBcbiAgICAgICAgdGhpcy5uZXdSZWZsZWN0aW9uTm9zZSA9ICgyKnRoaXMubm9zZUFbMF0tc3VtKS9zdW07ICAgICAgXG4gICAgfVxuXG4gICAgY2FsY3VsYXRlTm9zZVJlZmxlY3Rpb25zKCkge1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5ub3NlTGVuZ3RoOyBpKyspIFxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm5vc2VBW2ldID0gdGhpcy5ub3NlRGlhbWV0ZXJbaV0qdGhpcy5ub3NlRGlhbWV0ZXJbaV07IFxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGk9MTsgaTx0aGlzLm5vc2VMZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5ub3NlUmVmbGVjdGlvbltpXSA9ICh0aGlzLm5vc2VBW2ktMV0tdGhpcy5ub3NlQVtpXSkgLyAodGhpcy5ub3NlQVtpLTFdK3RoaXMubm9zZUFbaV0pOyBcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBydW5TdGVwKGdsb3R0YWxPdXRwdXQsIHR1cmJ1bGVuY2VOb2lzZSwgbGFtYmRhKSB7XG4gICAgICAgIHZhciB1cGRhdGVBbXBsaXR1ZGVzID0gKE1hdGgucmFuZG9tKCk8MC4xKTtcbiAgICBcbiAgICAgICAgLy9tb3V0aFxuICAgICAgICB0aGlzLnByb2Nlc3NUcmFuc2llbnRzKCk7XG4gICAgICAgIHRoaXMuYWRkVHVyYnVsZW5jZU5vaXNlKHR1cmJ1bGVuY2VOb2lzZSk7XG4gICAgICAgIFxuICAgICAgICAvL3RoaXMuZ2xvdHRhbFJlZmxlY3Rpb24gPSAtMC44ICsgMS42ICogR2xvdHRpcy5uZXdUZW5zZW5lc3M7XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRSWzBdID0gdGhpcy5MWzBdICogdGhpcy5nbG90dGFsUmVmbGVjdGlvbiArIGdsb3R0YWxPdXRwdXQ7XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRMW3RoaXMubl0gPSB0aGlzLlJbdGhpcy5uLTFdICogdGhpcy5saXBSZWZsZWN0aW9uOyBcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGk9MTsgaTx0aGlzLm47IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHIgPSB0aGlzLnJlZmxlY3Rpb25baV0gKiAoMS1sYW1iZGEpICsgdGhpcy5uZXdSZWZsZWN0aW9uW2ldKmxhbWJkYTtcbiAgICAgICAgICAgIHZhciB3ID0gciAqICh0aGlzLlJbaS0xXSArIHRoaXMuTFtpXSk7XG4gICAgICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0UltpXSA9IHRoaXMuUltpLTFdIC0gdztcbiAgICAgICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRMW2ldID0gdGhpcy5MW2ldICsgdztcbiAgICAgICAgfSAgICBcbiAgICAgICAgXG4gICAgICAgIC8vbm93IGF0IGp1bmN0aW9uIHdpdGggbm9zZVxuICAgICAgICB2YXIgaSA9IHRoaXMubm9zZVN0YXJ0O1xuICAgICAgICB2YXIgciA9IHRoaXMubmV3UmVmbGVjdGlvbkxlZnQgKiAoMS1sYW1iZGEpICsgdGhpcy5yZWZsZWN0aW9uTGVmdCpsYW1iZGE7XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRMW2ldID0gcip0aGlzLlJbaS0xXSsoMStyKSoodGhpcy5ub3NlTFswXSt0aGlzLkxbaV0pO1xuICAgICAgICByID0gdGhpcy5uZXdSZWZsZWN0aW9uUmlnaHQgKiAoMS1sYW1iZGEpICsgdGhpcy5yZWZsZWN0aW9uUmlnaHQqbGFtYmRhO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0UltpXSA9IHIqdGhpcy5MW2ldKygxK3IpKih0aGlzLlJbaS0xXSt0aGlzLm5vc2VMWzBdKTsgICAgIFxuICAgICAgICByID0gdGhpcy5uZXdSZWZsZWN0aW9uTm9zZSAqICgxLWxhbWJkYSkgKyB0aGlzLnJlZmxlY3Rpb25Ob3NlKmxhbWJkYTtcbiAgICAgICAgdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRSWzBdID0gcip0aGlzLm5vc2VMWzBdKygxK3IpKih0aGlzLkxbaV0rdGhpcy5SW2ktMV0pO1xuICAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm47IGkrKylcbiAgICAgICAgeyAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuUltpXSA9IHRoaXMuanVuY3Rpb25PdXRwdXRSW2ldKjAuOTk5O1xuICAgICAgICAgICAgdGhpcy5MW2ldID0gdGhpcy5qdW5jdGlvbk91dHB1dExbaSsxXSowLjk5OTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vdGhpcy5SW2ldID0gTWF0aC5jbGFtcCh0aGlzLmp1bmN0aW9uT3V0cHV0UltpXSAqIHRoaXMuZmFkZSwgLTEsIDEpO1xuICAgICAgICAgICAgLy90aGlzLkxbaV0gPSBNYXRoLmNsYW1wKHRoaXMuanVuY3Rpb25PdXRwdXRMW2krMV0gKiB0aGlzLmZhZGUsIC0xLCAxKTsgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh1cGRhdGVBbXBsaXR1ZGVzKVxuICAgICAgICAgICAgeyAgIFxuICAgICAgICAgICAgICAgIHZhciBhbXBsaXR1ZGUgPSBNYXRoLmFicyh0aGlzLlJbaV0rdGhpcy5MW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoYW1wbGl0dWRlID4gdGhpcy5tYXhBbXBsaXR1ZGVbaV0pIHRoaXMubWF4QW1wbGl0dWRlW2ldID0gYW1wbGl0dWRlO1xuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5tYXhBbXBsaXR1ZGVbaV0gKj0gMC45OTk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxpcE91dHB1dCA9IHRoaXMuUlt0aGlzLm4tMV07XG4gICAgICAgIFxuICAgICAgICAvL25vc2UgICAgIFxuICAgICAgICB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dExbdGhpcy5ub3NlTGVuZ3RoXSA9IHRoaXMubm9zZVJbdGhpcy5ub3NlTGVuZ3RoLTFdICogdGhpcy5saXBSZWZsZWN0aW9uOyBcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGk9MTsgaTx0aGlzLm5vc2VMZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHcgPSB0aGlzLm5vc2VSZWZsZWN0aW9uW2ldICogKHRoaXMubm9zZVJbaS0xXSArIHRoaXMubm9zZUxbaV0pO1xuICAgICAgICAgICAgdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRSW2ldID0gdGhpcy5ub3NlUltpLTFdIC0gdztcbiAgICAgICAgICAgIHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0TFtpXSA9IHRoaXMubm9zZUxbaV0gKyB3O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5ub3NlTGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubm9zZVJbaV0gPSB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dFJbaV0gKiB0aGlzLmZhZGU7XG4gICAgICAgICAgICB0aGlzLm5vc2VMW2ldID0gdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRMW2krMV0gKiB0aGlzLmZhZGU7ICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vdGhpcy5ub3NlUltpXSA9IE1hdGguY2xhbXAodGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRSW2ldICogdGhpcy5mYWRlLCAtMSwgMSk7XG4gICAgICAgICAgICAvL3RoaXMubm9zZUxbaV0gPSBNYXRoLmNsYW1wKHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0TFtpKzFdICogdGhpcy5mYWRlLCAtMSwgMSk7ICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodXBkYXRlQW1wbGl0dWRlcylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgYW1wbGl0dWRlID0gTWF0aC5hYnModGhpcy5ub3NlUltpXSt0aGlzLm5vc2VMW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoYW1wbGl0dWRlID4gdGhpcy5ub3NlTWF4QW1wbGl0dWRlW2ldKSB0aGlzLm5vc2VNYXhBbXBsaXR1ZGVbaV0gPSBhbXBsaXR1ZGU7XG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLm5vc2VNYXhBbXBsaXR1ZGVbaV0gKj0gMC45OTk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5vc2VPdXRwdXQgPSB0aGlzLm5vc2VSW3RoaXMubm9zZUxlbmd0aC0xXTtcbiAgICAgICBcbiAgICB9XG4gICAgXG4gICAgZmluaXNoQmxvY2soKSB7ICAgICAgICAgXG4gICAgICAgIHRoaXMucmVzaGFwZVRyYWN0KHRoaXMudHJvbWJvbmUuQXVkaW9TeXN0ZW0uYmxvY2tUaW1lKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVSZWZsZWN0aW9ucygpO1xuICAgIH1cbiAgICBcbiAgICBhZGRUcmFuc2llbnQocG9zaXRpb24pIHtcbiAgICAgICAgdmFyIHRyYW5zID0ge31cbiAgICAgICAgdHJhbnMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdHJhbnMudGltZUFsaXZlID0gMDtcbiAgICAgICAgdHJhbnMubGlmZVRpbWUgPSAwLjI7XG4gICAgICAgIHRyYW5zLnN0cmVuZ3RoID0gMC4zO1xuICAgICAgICB0cmFucy5leHBvbmVudCA9IDIwMDtcbiAgICAgICAgdGhpcy50cmFuc2llbnRzLnB1c2godHJhbnMpO1xuICAgIH1cbiAgICBcbiAgICBwcm9jZXNzVHJhbnNpZW50cygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRyYW5zaWVudHMubGVuZ3RoOyBpKyspICBcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRyYW5zID0gdGhpcy50cmFuc2llbnRzW2ldO1xuICAgICAgICAgICAgdmFyIGFtcGxpdHVkZSA9IHRyYW5zLnN0cmVuZ3RoICogTWF0aC5wb3coMiwgLXRyYW5zLmV4cG9uZW50ICogdHJhbnMudGltZUFsaXZlKTtcbiAgICAgICAgICAgIHRoaXMuUlt0cmFucy5wb3NpdGlvbl0gKz0gYW1wbGl0dWRlLzI7XG4gICAgICAgICAgICB0aGlzLkxbdHJhbnMucG9zaXRpb25dICs9IGFtcGxpdHVkZS8yO1xuICAgICAgICAgICAgdHJhbnMudGltZUFsaXZlICs9IDEuMC8odGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlKjIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGk9dGhpcy50cmFuc2llbnRzLmxlbmd0aC0xOyBpPj0wOyBpLS0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0cmFucyA9IHRoaXMudHJhbnNpZW50c1tpXTtcbiAgICAgICAgICAgIGlmICh0cmFucy50aW1lQWxpdmUgPiB0cmFucy5saWZlVGltZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaWVudHMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgYWRkVHVyYnVsZW5jZU5vaXNlKHR1cmJ1bGVuY2VOb2lzZSkge1xuICAgICAgICAvLyBmb3IgKHZhciBqPTA7IGo8VUkudG91Y2hlc1dpdGhNb3VzZS5sZW5ndGg7IGorKylcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgdmFyIHRvdWNoID0gVUkudG91Y2hlc1dpdGhNb3VzZVtqXTtcbiAgICAgICAgLy8gICAgIGlmICh0b3VjaC5pbmRleDwyIHx8IHRvdWNoLmluZGV4PlRyYWN0Lm4pIGNvbnRpbnVlO1xuICAgICAgICAvLyAgICAgaWYgKHRvdWNoLmRpYW1ldGVyPD0wKSBjb250aW51ZTsgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIHZhciBpbnRlbnNpdHkgPSB0b3VjaC5mcmljYXRpdmVfaW50ZW5zaXR5O1xuICAgICAgICAvLyAgICAgaWYgKGludGVuc2l0eSA9PSAwKSBjb250aW51ZTtcbiAgICAgICAgLy8gICAgIHRoaXMuYWRkVHVyYnVsZW5jZU5vaXNlQXRJbmRleCgwLjY2KnR1cmJ1bGVuY2VOb2lzZSppbnRlbnNpdHksIHRvdWNoLmluZGV4LCB0b3VjaC5kaWFtZXRlcik7XG4gICAgICAgIC8vIH1cbiAgICB9XG4gICAgXG4gICAgYWRkVHVyYnVsZW5jZU5vaXNlQXRJbmRleCh0dXJidWxlbmNlTm9pc2UsIGluZGV4LCBkaWFtZXRlcikgeyAgIFxuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoaW5kZXgpO1xuICAgICAgICB2YXIgZGVsdGEgPSBpbmRleCAtIGk7XG4gICAgICAgIHR1cmJ1bGVuY2VOb2lzZSAqPSB0aGlzLnRyb21ib25lLkdsb3R0aXMuZ2V0Tm9pc2VNb2R1bGF0b3IoKTtcbiAgICAgICAgdmFyIHRoaW5uZXNzMCA9IE1hdGguY2xhbXAoOCooMC43LWRpYW1ldGVyKSwwLDEpO1xuICAgICAgICB2YXIgb3Blbm5lc3MgPSBNYXRoLmNsYW1wKDMwKihkaWFtZXRlci0wLjMpLCAwLCAxKTtcbiAgICAgICAgdmFyIG5vaXNlMCA9IHR1cmJ1bGVuY2VOb2lzZSooMS1kZWx0YSkqdGhpbm5lc3MwKm9wZW5uZXNzO1xuICAgICAgICB2YXIgbm9pc2UxID0gdHVyYnVsZW5jZU5vaXNlKmRlbHRhKnRoaW5uZXNzMCpvcGVubmVzcztcbiAgICAgICAgdGhpcy5SW2krMV0gKz0gbm9pc2UwLzI7XG4gICAgICAgIHRoaXMuTFtpKzFdICs9IG5vaXNlMC8yO1xuICAgICAgICB0aGlzLlJbaSsyXSArPSBub2lzZTEvMjtcbiAgICAgICAgdGhpcy5MW2krMl0gKz0gbm9pc2UxLzI7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgVHJhY3QgfTsiLCJNYXRoLmNsYW1wID0gZnVuY3Rpb24obnVtYmVyLCBtaW4sIG1heCkge1xuICAgIGlmIChudW1iZXI8bWluKSByZXR1cm4gbWluO1xuICAgIGVsc2UgaWYgKG51bWJlcj5tYXgpIHJldHVybiBtYXg7XG4gICAgZWxzZSByZXR1cm4gbnVtYmVyO1xufVxuXG5NYXRoLm1vdmVUb3dhcmRzID0gZnVuY3Rpb24oY3VycmVudCwgdGFyZ2V0LCBhbW91bnQpIHtcbiAgICBpZiAoY3VycmVudDx0YXJnZXQpIHJldHVybiBNYXRoLm1pbihjdXJyZW50K2Ftb3VudCwgdGFyZ2V0KTtcbiAgICBlbHNlIHJldHVybiBNYXRoLm1heChjdXJyZW50LWFtb3VudCwgdGFyZ2V0KTtcbn1cblxuTWF0aC5tb3ZlVG93YXJkcyA9IGZ1bmN0aW9uKGN1cnJlbnQsIHRhcmdldCwgYW1vdW50VXAsIGFtb3VudERvd24pIHtcbiAgICBpZiAoY3VycmVudDx0YXJnZXQpIHJldHVybiBNYXRoLm1pbihjdXJyZW50K2Ftb3VudFVwLCB0YXJnZXQpO1xuICAgIGVsc2UgcmV0dXJuIE1hdGgubWF4KGN1cnJlbnQtYW1vdW50RG93biwgdGFyZ2V0KTtcbn1cblxuTWF0aC5nYXVzc2lhbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzID0gMDtcbiAgICBmb3IgKHZhciBjPTA7IGM8MTY7IGMrKykgcys9TWF0aC5yYW5kb20oKTtcbiAgICByZXR1cm4gKHMtOCkvNDtcbn1cblxuTWF0aC5sZXJwID0gZnVuY3Rpb24oYSwgYiwgdCkge1xuICAgIHJldHVybiBhICsgKGIgLSBhKSAqIHQ7XG59IiwiLypcbiAqIEEgc3BlZWQtaW1wcm92ZWQgcGVybGluIGFuZCBzaW1wbGV4IG5vaXNlIGFsZ29yaXRobXMgZm9yIDJELlxuICpcbiAqIEJhc2VkIG9uIGV4YW1wbGUgY29kZSBieSBTdGVmYW4gR3VzdGF2c29uIChzdGVndUBpdG4ubGl1LnNlKS5cbiAqIE9wdGltaXNhdGlvbnMgYnkgUGV0ZXIgRWFzdG1hbiAocGVhc3RtYW5AZHJpenpsZS5zdGFuZm9yZC5lZHUpLlxuICogQmV0dGVyIHJhbmsgb3JkZXJpbmcgbWV0aG9kIGJ5IFN0ZWZhbiBHdXN0YXZzb24gaW4gMjAxMi5cbiAqIENvbnZlcnRlZCB0byBKYXZhc2NyaXB0IGJ5IEpvc2VwaCBHZW50bGUuXG4gKlxuICogVmVyc2lvbiAyMDEyLTAzLTA5XG4gKlxuICogVGhpcyBjb2RlIHdhcyBwbGFjZWQgaW4gdGhlIHB1YmxpYyBkb21haW4gYnkgaXRzIG9yaWdpbmFsIGF1dGhvcixcbiAqIFN0ZWZhbiBHdXN0YXZzb24uIFlvdSBtYXkgdXNlIGl0IGFzIHlvdSBzZWUgZml0LCBidXRcbiAqIGF0dHJpYnV0aW9uIGlzIGFwcHJlY2lhdGVkLlxuICpcbiAqL1xuXG5jbGFzcyBHcmFkIHtcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCB6KXtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgdGhpcy56ID0gejtcbiAgICB9XG5cbiAgICBkb3QyKHgsIHkpe1xuICAgICAgICByZXR1cm4gdGhpcy54KnggKyB0aGlzLnkqeTtcbiAgICB9XG5cbiAgICBkb3QzKHgsIHksIHopIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCp4ICsgdGhpcy55KnkgKyB0aGlzLnoqejtcbiAgICB9O1xufVxuXG5jbGFzcyBOb2lzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ3JhZDMgPSBbbmV3IEdyYWQoMSwxLDApLG5ldyBHcmFkKC0xLDEsMCksbmV3IEdyYWQoMSwtMSwwKSxuZXcgR3JhZCgtMSwtMSwwKSxcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgR3JhZCgxLDAsMSksbmV3IEdyYWQoLTEsMCwxKSxuZXcgR3JhZCgxLDAsLTEpLG5ldyBHcmFkKC0xLDAsLTEpLFxuICAgICAgICAgICAgICAgICAgICAgIG5ldyBHcmFkKDAsMSwxKSxuZXcgR3JhZCgwLC0xLDEpLG5ldyBHcmFkKDAsMSwtMSksbmV3IEdyYWQoMCwtMSwtMSldO1xuICAgICAgICB0aGlzLnAgPSBbMTUxLDE2MCwxMzcsOTEsOTAsMTUsXG4gICAgICAgICAgICAxMzEsMTMsMjAxLDk1LDk2LDUzLDE5NCwyMzMsNywyMjUsMTQwLDM2LDEwMywzMCw2OSwxNDIsOCw5OSwzNywyNDAsMjEsMTAsMjMsXG4gICAgICAgICAgICAxOTAsIDYsMTQ4LDI0NywxMjAsMjM0LDc1LDAsMjYsMTk3LDYyLDk0LDI1MiwyMTksMjAzLDExNywzNSwxMSwzMiw1NywxNzcsMzMsXG4gICAgICAgICAgICA4OCwyMzcsMTQ5LDU2LDg3LDE3NCwyMCwxMjUsMTM2LDE3MSwxNjgsIDY4LDE3NSw3NCwxNjUsNzEsMTM0LDEzOSw0OCwyNywxNjYsXG4gICAgICAgICAgICA3NywxNDYsMTU4LDIzMSw4MywxMTEsMjI5LDEyMiw2MCwyMTEsMTMzLDIzMCwyMjAsMTA1LDkyLDQxLDU1LDQ2LDI0NSw0MCwyNDQsXG4gICAgICAgICAgICAxMDIsMTQzLDU0LCA2NSwyNSw2MywxNjEsIDEsMjE2LDgwLDczLDIwOSw3NiwxMzIsMTg3LDIwOCwgODksMTgsMTY5LDIwMCwxOTYsXG4gICAgICAgICAgICAxMzUsMTMwLDExNiwxODgsMTU5LDg2LDE2NCwxMDAsMTA5LDE5OCwxNzMsMTg2LCAzLDY0LDUyLDIxNywyMjYsMjUwLDEyNCwxMjMsXG4gICAgICAgICAgICA1LDIwMiwzOCwxNDcsMTE4LDEyNiwyNTUsODIsODUsMjEyLDIwNywyMDYsNTksMjI3LDQ3LDE2LDU4LDE3LDE4MiwxODksMjgsNDIsXG4gICAgICAgICAgICAyMjMsMTgzLDE3MCwyMTMsMTE5LDI0OCwxNTIsIDIsNDQsMTU0LDE2MywgNzAsMjIxLDE1MywxMDEsMTU1LDE2NywgNDMsMTcyLDksXG4gICAgICAgICAgICAxMjksMjIsMzksMjUzLCAxOSw5OCwxMDgsMTEwLDc5LDExMywyMjQsMjMyLDE3OCwxODUsIDExMiwxMDQsMjE4LDI0Niw5NywyMjgsXG4gICAgICAgICAgICAyNTEsMzQsMjQyLDE5MywyMzgsMjEwLDE0NCwxMiwxOTEsMTc5LDE2MiwyNDEsIDgxLDUxLDE0NSwyMzUsMjQ5LDE0LDIzOSwxMDcsXG4gICAgICAgICAgICA0OSwxOTIsMjE0LCAzMSwxODEsMTk5LDEwNiwxNTcsMTg0LCA4NCwyMDQsMTc2LDExNSwxMjEsNTAsNDUsMTI3LCA0LDE1MCwyNTQsXG4gICAgICAgICAgICAxMzgsMjM2LDIwNSw5MywyMjIsMTE0LDY3LDI5LDI0LDcyLDI0MywxNDEsMTI4LDE5NSw3OCw2NiwyMTUsNjEsMTU2LDE4MF07XG5cbiAgICAgICAgLy8gVG8gcmVtb3ZlIHRoZSBuZWVkIGZvciBpbmRleCB3cmFwcGluZywgZG91YmxlIHRoZSBwZXJtdXRhdGlvbiB0YWJsZSBsZW5ndGhcbiAgICAgICAgdGhpcy5wZXJtID0gbmV3IEFycmF5KDUxMik7XG4gICAgICAgIHRoaXMuZ3JhZFAgPSBuZXcgQXJyYXkoNTEyKTtcblxuICAgICAgICB0aGlzLnNlZWQoRGF0ZS5ub3coKSk7XG4gICAgfVxuXG4gICAgc2VlZChzZWVkKSB7XG4gICAgICAgIGlmKHNlZWQgPiAwICYmIHNlZWQgPCAxKSB7XG4gICAgICAgICAgICAvLyBTY2FsZSB0aGUgc2VlZCBvdXRcbiAgICAgICAgICAgIHNlZWQgKj0gNjU1MzY7XG4gICAgICAgIH1cblxuICAgICAgICBzZWVkID0gTWF0aC5mbG9vcihzZWVkKTtcbiAgICAgICAgaWYoc2VlZCA8IDI1Nikge1xuICAgICAgICAgICAgc2VlZCB8PSBzZWVkIDw8IDg7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgICAgICAgIHZhciB2O1xuICAgICAgICAgICAgaWYgKGkgJiAxKSB7XG4gICAgICAgICAgICAgICAgdiA9IHRoaXMucFtpXSBeIChzZWVkICYgMjU1KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdiA9IHRoaXMucFtpXSBeICgoc2VlZD4+OCkgJiAyNTUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnBlcm1baV0gPSB0aGlzLnBlcm1baSArIDI1Nl0gPSB2O1xuICAgICAgICAgICAgdGhpcy5ncmFkUFtpXSA9IHRoaXMuZ3JhZFBbaSArIDI1Nl0gPSB0aGlzLmdyYWQzW3YgJSAxMl07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gMkQgc2ltcGxleCBub2lzZVxuICAgIHNpbXBsZXgyKHhpbiwgeWluKSB7XG4gICAgICAgIC8vIFNrZXdpbmcgYW5kIHVuc2tld2luZyBmYWN0b3JzIGZvciAyLCAzLCBhbmQgNCBkaW1lbnNpb25zXG4gICAgICAgIHZhciBGMiA9IDAuNSooTWF0aC5zcXJ0KDMpLTEpO1xuICAgICAgICB2YXIgRzIgPSAoMy1NYXRoLnNxcnQoMykpLzY7XG5cbiAgICAgICAgdmFyIEYzID0gMS8zO1xuICAgICAgICB2YXIgRzMgPSAxLzY7XG5cbiAgICAgICAgdmFyIG4wLCBuMSwgbjI7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuICAgICAgICAvLyBTa2V3IHRoZSBpbnB1dCBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggc2ltcGxleCBjZWxsIHdlJ3JlIGluXG4gICAgICAgIHZhciBzID0gKHhpbit5aW4pKkYyOyAvLyBIYWlyeSBmYWN0b3IgZm9yIDJEXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcih4aW4rcyk7XG4gICAgICAgIHZhciBqID0gTWF0aC5mbG9vcih5aW4rcyk7XG4gICAgICAgIHZhciB0ID0gKGkraikqRzI7XG4gICAgICAgIHZhciB4MCA9IHhpbi1pK3Q7IC8vIFRoZSB4LHkgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luLCB1bnNrZXdlZC5cbiAgICAgICAgdmFyIHkwID0geWluLWordDtcbiAgICAgICAgLy8gRm9yIHRoZSAyRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhbiBlcXVpbGF0ZXJhbCB0cmlhbmdsZS5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggd2UgYXJlIGluLlxuICAgICAgICB2YXIgaTEsIGoxOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgKG1pZGRsZSkgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaikgY29vcmRzXG4gICAgICAgIGlmKHgwPnkwKSB7IC8vIGxvd2VyIHRyaWFuZ2xlLCBYWSBvcmRlcjogKDAsMCktPigxLDApLT4oMSwxKVxuICAgICAgICAgICAgaTE9MTsgajE9MDtcbiAgICAgICAgfSBlbHNlIHsgICAgLy8gdXBwZXIgdHJpYW5nbGUsIFlYIG9yZGVyOiAoMCwwKS0+KDAsMSktPigxLDEpXG4gICAgICAgICAgICBpMT0wOyBqMT0xO1xuICAgICAgICB9XG4gICAgICAgIC8vIEEgc3RlcCBvZiAoMSwwKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKDEtYywtYykgaW4gKHgseSksIGFuZFxuICAgICAgICAvLyBhIHN0ZXAgb2YgKDAsMSkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgtYywxLWMpIGluICh4LHkpLCB3aGVyZVxuICAgICAgICAvLyBjID0gKDMtc3FydCgzKSkvNlxuICAgICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzI7IC8vIE9mZnNldHMgZm9yIG1pZGRsZSBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXG4gICAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHMjtcbiAgICAgICAgdmFyIHgyID0geDAgLSAxICsgMiAqIEcyOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcbiAgICAgICAgdmFyIHkyID0geTAgLSAxICsgMiAqIEcyO1xuICAgICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIHRocmVlIHNpbXBsZXggY29ybmVyc1xuICAgICAgICBpICY9IDI1NTtcbiAgICAgICAgaiAmPSAyNTU7XG4gICAgICAgIHZhciBnaTAgPSB0aGlzLmdyYWRQW2krdGhpcy5wZXJtW2pdXTtcbiAgICAgICAgdmFyIGdpMSA9IHRoaXMuZ3JhZFBbaStpMSt0aGlzLnBlcm1baitqMV1dO1xuICAgICAgICB2YXIgZ2kyID0gdGhpcy5ncmFkUFtpKzErdGhpcy5wZXJtW2orMV1dO1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXG4gICAgICAgIHZhciB0MCA9IDAuNSAtIHgwKngwLXkwKnkwO1xuICAgICAgICBpZih0MDwwKSB7XG4gICAgICAgICAgICBuMCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0MCAqPSB0MDtcbiAgICAgICAgICAgIG4wID0gdDAgKiB0MCAqIGdpMC5kb3QyKHgwLCB5MCk7ICAvLyAoeCx5KSBvZiBncmFkMyB1c2VkIGZvciAyRCBncmFkaWVudFxuICAgICAgICB9XG4gICAgICAgIHZhciB0MSA9IDAuNSAtIHgxKngxLXkxKnkxO1xuICAgICAgICBpZih0MTwwKSB7XG4gICAgICAgICAgICBuMSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0MSAqPSB0MTtcbiAgICAgICAgICAgIG4xID0gdDEgKiB0MSAqIGdpMS5kb3QyKHgxLCB5MSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQyID0gMC41IC0geDIqeDIteTIqeTI7XG4gICAgICAgIGlmKHQyPDApIHtcbiAgICAgICAgICAgIG4yID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHQyICo9IHQyO1xuICAgICAgICAgICAgbjIgPSB0MiAqIHQyICogZ2kyLmRvdDIoeDIsIHkyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXG4gICAgICAgIC8vIFRoZSByZXN1bHQgaXMgc2NhbGVkIHRvIHJldHVybiB2YWx1ZXMgaW4gdGhlIGludGVydmFsIFstMSwxXS5cbiAgICAgICAgcmV0dXJuIDcwICogKG4wICsgbjEgKyBuMik7XG4gICAgfVxuICAgIFxuICAgIHNpbXBsZXgxKHgpe1xuICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGV4Mih4KjEuMiwgLXgqMC43KTtcbiAgICB9XG5cbn1cblxuY29uc3Qgc2luZ2xldG9uID0gbmV3IE5vaXNlKCk7XG5PYmplY3QuZnJlZXplKHNpbmdsZXRvbik7XG5cbmV4cG9ydCBkZWZhdWx0IHNpbmdsZXRvbjsiLCJpbXBvcnQgXCIuL21hdGgtZXh0ZW5zaW9ucy5qc1wiO1xuXG5pbXBvcnQgeyBBdWRpb1N5c3RlbSB9IGZyb20gXCIuL2NvbXBvbmVudHMvYXVkaW8tc3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBHbG90dGlzIH0gZnJvbSBcIi4vY29tcG9uZW50cy9nbG90dGlzLmpzXCI7XG5pbXBvcnQgeyBUcmFjdCB9IGZyb20gXCIuL2NvbXBvbmVudHMvdHJhY3QuanNcIjtcbmltcG9ydCB7IFRyYWN0VUkgfSBmcm9tIFwiLi9jb21wb25lbnRzL3RyYWN0LXVpLmpzXCI7XG5cbmNsYXNzIFBpbmtUcm9tYm9uZSB7XG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlcil7XG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNhbXBsZVJhdGUgPSAwO1xuICAgICAgICB0aGlzLnRpbWUgPSAwO1xuICAgICAgICB0aGlzLmFsd2F5c1ZvaWNlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hdXRvV29iYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ub2lzZUZyZXEgPSA1MDA7XG4gICAgICAgIHRoaXMubm9pc2VRID0gMC43O1xuXG4gICAgICAgIHRoaXMuQXVkaW9TeXN0ZW0gPSBuZXcgQXVkaW9TeXN0ZW0odGhpcyk7XG4gICAgICAgIHRoaXMuQXVkaW9TeXN0ZW0uaW5pdCgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5HbG90dGlzID0gbmV3IEdsb3R0aXModGhpcyk7XG4gICAgICAgIHRoaXMuR2xvdHRpcy5pbml0KCk7XG5cbiAgICAgICAgdGhpcy5UcmFjdCA9IG5ldyBUcmFjdCh0aGlzKTtcbiAgICAgICAgdGhpcy5UcmFjdC5pbml0KCk7XG5cbiAgICAgICAgdGhpcy5UcmFjdFVJID0gbmV3IFRyYWN0VUkodGhpcyk7XG4gICAgICAgIHRoaXMuVHJhY3RVSS5pbml0KCk7XG5cbiAgICAgICAgLy90aGlzLlN0YXJ0QXVkaW8oKTtcbiAgICAgICAgLy90aGlzLlNldE11dGUodHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIFN0YXJ0QXVkaW8oKSB7XG4gICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5BdWRpb1N5c3RlbS5zdGFydFNvdW5kKCk7XG4gICAgfVxuXG4gICAgU2V0TXV0ZShkb011dGUpIHtcbiAgICAgICAgZG9NdXRlID8gdGhpcy5BdWRpb1N5c3RlbS5tdXRlKCkgOiB0aGlzLkF1ZGlvU3lzdGVtLnVubXV0ZSgpO1xuICAgICAgICB0aGlzLm11dGVkID0gZG9NdXRlO1xuICAgIH1cblxuICAgIFRvZ2dsZU11dGUoKSB7XG4gICAgICAgIHRoaXMuU2V0TXV0ZSghdGhpcy5tdXRlZCk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCB7IFBpbmtUcm9tYm9uZSB9OyIsIi8vIGNvbnN0IHdvcmRzID0gcmVxdWlyZSgnY211LXByb25vdW5jaW5nLWRpY3Rpb25hcnknKTtcblxuZXhwb3J0IGNsYXNzIFRUU0NvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIFxuICAgIH1cblxuICAgIC8vIEdldEdyYXBoZW1lcyhzdHIpe1xuICAgIC8vICAgICBsZXQgemVyb1B1bmN0dWF0aW9uID0gc3RyLnJlcGxhY2UoL1suLFxcLyMhJCVcXF4mXFwqOzp7fT1cXC1fYH4oKV0vZyxcIlwiKTtcbiAgICAvLyAgICAgbGV0IHdvcmRCYW5rID0gW11cbiAgICAvLyAgICAgZm9yKGxldCB3b3JkIG9mIHplcm9QdW5jdHVhdGlvbi5zcGxpdCgnICcpKXtcbiAgICAvLyAgICAgICAgIHdvcmRCYW5rLnB1c2godGhpcy5HZXRQcm9udW5jaWF0aW9uRm9yV29yZCh3b3JkKSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmV0dXJuIHdvcmRCYW5rO1xuICAgIC8vIH1cblxuICAgIC8vIEdldFByb251bmNpYXRpb25Gb3JXb3JkKHJhd1dvcmQpe1xuICAgIC8vICAgICBsZXQgd29yZCA9IHJhd1dvcmQudG9Mb3dlckNhc2UoKTtcbiAgICAvLyAgICAgaWYgKHdvcmRzW3dvcmRdKXtcbiAgICAvLyAgICAgICAgIHJldHVybiB3b3Jkc1t3b3JkXTtcbiAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgIC8vIElmIHRoZSB3b3JkIGlzbid0IGluIHRoZSBkaWN0LCBpZ25vcmUgaXQgZm9yIG5vd1xuICAgIC8vICAgICAgICAgcmV0dXJuIFwiTm9uZVwiO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG5cblxufSIsImNsYXNzIE1vZGVsTG9hZGVyIHtcblxuICAgIC8qKlxuICAgICAqIExvYWRzIGEgbW9kZWwgYXN5bmNocm9ub3VzbHkuIEV4cGVjdHMgYW4gb2JqZWN0IGNvbnRhaW5pbmdcbiAgICAgKiB0aGUgcGF0aCB0byB0aGUgb2JqZWN0LCB0aGUgcmVsYXRpdmUgcGF0aCBvZiB0aGUgT0JKIGZpbGUsXG4gICAgICogYW5kIHRoZSByZWxhdGl2ZSBwYXRoIG9mIHRoZSBNVEwgZmlsZS5cbiAgICAgKiBcbiAgICAgKiBBbiBleGFtcGxlOlxuICAgICAqIGxldCBtb2RlbEluZm8gPSB7XG4gICAgICogICAgICBwYXRoOiBcIi4uL3Jlc291cmNlcy9vYmovXCIsXG4gICAgICogICAgICBvYmpGaWxlOiBcInRlc3Qub2JqXCIsXG4gICAgICogICAgICBtdGxGaWxlOiBcInRlc3QubXRsXCJcbiAgICAgKiB9XG4gICAgICovXG4gICAgc3RhdGljIExvYWRPQkoobW9kZWxJbmZvLCBsb2FkZWRDYWxsYmFjaykge1xuXG4gICAgICAgIHZhciBvblByb2dyZXNzID0gZnVuY3Rpb24oIHhociApIHtcbiAgICAgICAgICAgIGlmICggeGhyLmxlbmd0aENvbXB1dGFibGUgKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IHhoci5sb2FkZWQgLyB4aHIudG90YWwgKiAxMDA7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIE1hdGgucm91bmQoIHBlcmNlbnRDb21wbGV0ZSwgMiApICsgJyUgZG93bmxvYWRlZCcgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9uRXJyb3IgPSBmdW5jdGlvbiggeGhyICkge1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBtdGxMb2FkZXIgPSBuZXcgVEhSRUUuTVRMTG9hZGVyKCk7XG4gICAgICAgIG10bExvYWRlci5zZXRQYXRoKCBtb2RlbEluZm8ucGF0aCApO1xuXG4gICAgICAgIG10bExvYWRlci5sb2FkKCBtb2RlbEluZm8ubXRsRmlsZSwgKCBtYXRlcmlhbHMgKSA9PiB7XG4gICAgICAgICAgICBtYXRlcmlhbHMucHJlbG9hZCgpO1xuICAgICAgICAgICAgdmFyIG9iakxvYWRlciA9IG5ldyBUSFJFRS5PQkpMb2FkZXIoKTtcbiAgICAgICAgICAgIG9iakxvYWRlci5zZXRNYXRlcmlhbHMoIG1hdGVyaWFscyApO1xuICAgICAgICAgICAgb2JqTG9hZGVyLnNldFBhdGgoIG1vZGVsSW5mby5wYXRoICk7XG4gICAgICAgICAgICBvYmpMb2FkZXIubG9hZCggbW9kZWxJbmZvLm9iakZpbGUsICggb2JqZWN0ICkgPT4ge1xuICAgICAgICAgICAgICAgIGxvYWRlZENhbGxiYWNrKG9iamVjdCk7XG4gICAgICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yICk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgTG9hZEpTT04ocGF0aCwgbG9hZGVkQ2FsbGJhY2spIHtcblxuICAgICAgICB2YXIgb25Qcm9ncmVzcyA9IGZ1bmN0aW9uKCB4aHIgKSB7XG4gICAgICAgICAgICBpZiAoIHhoci5sZW5ndGhDb21wdXRhYmxlICkge1xuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSB4aHIubG9hZGVkIC8geGhyLnRvdGFsICogMTAwO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBNYXRoLnJvdW5kKCBwZXJjZW50Q29tcGxldGUsIDIgKSArICclIGRvd25sb2FkZWQnICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvbkVycm9yID0gZnVuY3Rpb24oIHhociApIHtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIoKTtcbiAgICAgICAgbG9hZGVyLmxvYWQoIHBhdGgsICggZ2VvbWV0cnksIG1hdGVyaWFscyApID0+IHtcbiAgICAgICAgICAgIC8vIEFwcGx5IHNraW5uaW5nIHRvIGVhY2ggbWF0ZXJpYWwgc28gdGhlIHZlcnRzIGFyZSBhZmZlY3RlZCBieSBib25lIG1vdmVtZW50XG4gICAgICAgICAgICBmb3IobGV0IG1hdCBvZiBtYXRlcmlhbHMpe1xuICAgICAgICAgICAgICAgIG1hdC5za2lubmluZyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbWVzaCA9IG5ldyBUSFJFRS5Ta2lubmVkTWVzaCggZ2VvbWV0cnksIG5ldyBUSFJFRS5NdWx0aU1hdGVyaWFsKCBtYXRlcmlhbHMgKSApO1xuICAgICAgICAgICAgbWVzaC5uYW1lID0gXCJKb25cIjtcbiAgICAgICAgICAgIGxvYWRlZENhbGxiYWNrKG1lc2gpO1xuICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgTG9hZEZCWChwYXRoLCBsb2FkZWRDYWxsYmFjaykge1xuICAgICAgICBsZXQgbWFuYWdlciA9IG5ldyBUSFJFRS5Mb2FkaW5nTWFuYWdlcigpO1xuICAgICAgICBtYW5hZ2VyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiggaXRlbSwgbG9hZGVkLCB0b3RhbCApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBpdGVtLCBsb2FkZWQsIHRvdGFsICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiggeGhyICkge1xuICAgICAgICAgICAgaWYgKCB4aHIubGVuZ3RoQ29tcHV0YWJsZSApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0geGhyLmxvYWRlZCAvIHhoci50b3RhbCAqIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggTWF0aC5yb3VuZCggcGVyY2VudENvbXBsZXRlLCAyICkgKyAnJSBkb3dubG9hZGVkJyApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgb25FcnJvciA9IGZ1bmN0aW9uKCB4aHIgKSB7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5GQlhMb2FkZXIoIG1hbmFnZXIgKTtcbiAgICAgICAgbG9hZGVyLmxvYWQoIHBhdGgsICggb2JqZWN0ICkgPT4ge1xuICAgICAgICAgICAgbG9hZGVkQ2FsbGJhY2sob2JqZWN0KTtcbiAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvciApO1xuICAgIH1cblxufVxuXG5leHBvcnQgeyBNb2RlbExvYWRlciB9OyIsImNsYXNzIERldGVjdG9yIHtcblxuICAgIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMTg3MTA3Ny9wcm9wZXItd2F5LXRvLWRldGVjdC13ZWJnbC1zdXBwb3J0XG4gICAgc3RhdGljIEhhc1dlYkdMKCkge1xuICAgICAgICBpZiAoISF3aW5kb3cuV2ViR0xSZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZXMgPSBbXCJ3ZWJnbFwiLCBcImV4cGVyaW1lbnRhbC13ZWJnbFwiLCBcIm1vei13ZWJnbFwiLCBcIndlYmtpdC0zZFwiXSxcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8NDtpKyspIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQobmFtZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dC5nZXRQYXJhbWV0ZXIgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZWJHTCBpcyBlbmFibGVkXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge31cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gV2ViR0wgaXMgc3VwcG9ydGVkLCBidXQgZGlzYWJsZWRcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXZWJHTCBub3Qgc3VwcG9ydGVkXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgR2V0RXJyb3JIVE1MKG1lc3NhZ2UgPSBudWxsKXtcbiAgICAgICAgaWYobWVzc2FnZSA9PSBudWxsKXtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgWW91ciBncmFwaGljcyBjYXJkIGRvZXMgbm90IHNlZW0gdG8gc3VwcG9ydCBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8va2hyb25vcy5vcmcvd2ViZ2wvd2lraS9HZXR0aW5nX2FfV2ViR0xfSW1wbGVtZW50YXRpb25cIj5XZWJHTDwvYT4uIDxicj5cbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbmQgb3V0IGhvdyB0byBnZXQgaXQgPGEgaHJlZj1cImh0dHA6Ly9nZXQud2ViZ2wub3JnL1wiPmhlcmU8L2E+LmA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cIm5vLXdlYmdsLXN1cHBvcnRcIj5cbiAgICAgICAgPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIGBcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgRGV0ZWN0b3IgfTsiLCIhZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxlKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLk1pZGlDb252ZXJ0PWUoKTp0Lk1pZGlDb252ZXJ0PWUoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtmdW5jdGlvbiBlKHIpe2lmKG5bcl0pcmV0dXJuIG5bcl0uZXhwb3J0czt2YXIgaT1uW3JdPXtleHBvcnRzOnt9LGlkOnIsbG9hZGVkOiExfTtyZXR1cm4gdFtyXS5jYWxsKGkuZXhwb3J0cyxpLGkuZXhwb3J0cyxlKSxpLmxvYWRlZD0hMCxpLmV4cG9ydHN9dmFyIG49e307cmV0dXJuIGUubT10LGUuYz1uLGUucD1cIlwiLGUoMCl9KFtmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHI9big3KSxpPW4oMiksYT17aW5zdHJ1bWVudEJ5UGF0Y2hJRDppLmluc3RydW1lbnRCeVBhdGNoSUQsaW5zdHJ1bWVudEZhbWlseUJ5SUQ6aS5pbnN0cnVtZW50RmFtaWx5QnlJRCxwYXJzZTpmdW5jdGlvbih0KXtyZXR1cm4obmV3IHIuTWlkaSkuZGVjb2RlKHQpfSxsb2FkOmZ1bmN0aW9uKHQsZSl7dmFyIG49KG5ldyByLk1pZGkpLmxvYWQodCk7cmV0dXJuIGUmJm4udGhlbihlKSxufSxjcmVhdGU6ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IHIuTWlkaX19O2VbXCJkZWZhdWx0XCJdPWEsdC5leHBvcnRzPWF9LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih0KXtyZXR1cm4gdC5yZXBsYWNlKC9cXHUwMDAwL2csXCJcIil9ZnVuY3Rpb24gcih0LGUpe3JldHVybiA2MC9lLmJwbSoodC9lLlBQUSl9ZnVuY3Rpb24gaSh0KXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgdH1mdW5jdGlvbiBhKHQpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiB0fWZ1bmN0aW9uIG8odCl7dmFyIGU9W1wiQ1wiLFwiQyNcIixcIkRcIixcIkQjXCIsXCJFXCIsXCJGXCIsXCJGI1wiLFwiR1wiLFwiRyNcIixcIkFcIixcIkEjXCIsXCJCXCJdLG49TWF0aC5mbG9vcih0LzEyKS0xLHI9dCUxMjtyZXR1cm4gZVtyXStufXZhciBzPWZ1bmN0aW9uKCl7dmFyIHQ9L14oW2EtZ117MX0oPzpifCN8eHxiYik/KSgtP1swLTldKykvaTtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGEoZSkmJnQudGVzdChlKX19KCksdT1mdW5jdGlvbigpe3ZhciB0PS9eKFthLWddezF9KD86YnwjfHh8YmIpPykoLT9bMC05XSspL2ksZT17Y2JiOi0yLGNiOi0xLGM6MCxcImMjXCI6MSxjeDoyLGRiYjowLGRiOjEsZDoyLFwiZCNcIjozLGR4OjQsZWJiOjIsZWI6MyxlOjQsXCJlI1wiOjUsZXg6NixmYmI6MyxmYjo0LGY6NSxcImYjXCI6NixmeDo3LGdiYjo1LGdiOjYsZzo3LFwiZyNcIjo4LGd4OjksYWJiOjcsYWI6OCxhOjksXCJhI1wiOjEwLGF4OjExLGJiYjo5LGJiOjEwLGI6MTEsXCJiI1wiOjEyLGJ4OjEzfTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIHI9dC5leGVjKG4pLGk9clsxXSxhPXJbMl0sbz1lW2kudG9Mb3dlckNhc2UoKV07cmV0dXJuIG8rMTIqKHBhcnNlSW50KGEpKzEpfX0oKTt0LmV4cG9ydHM9e2NsZWFuTmFtZTpuLHRpY2tzVG9TZWNvbmRzOnIsaXNTdHJpbmc6YSxpc051bWJlcjppLGlzUGl0Y2g6cyxtaWRpVG9QaXRjaDpvLHBpdGNoVG9NaWRpOnV9fSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2UuaW5zdHJ1bWVudEJ5UGF0Y2hJRD1bXCJhY291c3RpYyBncmFuZCBwaWFub1wiLFwiYnJpZ2h0IGFjb3VzdGljIHBpYW5vXCIsXCJlbGVjdHJpYyBncmFuZCBwaWFub1wiLFwiaG9ua3ktdG9uayBwaWFub1wiLFwiZWxlY3RyaWMgcGlhbm8gMVwiLFwiZWxlY3RyaWMgcGlhbm8gMlwiLFwiaGFycHNpY2hvcmRcIixcImNsYXZpXCIsXCJjZWxlc3RhXCIsXCJnbG9ja2Vuc3BpZWxcIixcIm11c2ljIGJveFwiLFwidmlicmFwaG9uZVwiLFwibWFyaW1iYVwiLFwieHlsb3Bob25lXCIsXCJ0dWJ1bGFyIGJlbGxzXCIsXCJkdWxjaW1lclwiLFwiZHJhd2JhciBvcmdhblwiLFwicGVyY3Vzc2l2ZSBvcmdhblwiLFwicm9jayBvcmdhblwiLFwiY2h1cmNoIG9yZ2FuXCIsXCJyZWVkIG9yZ2FuXCIsXCJhY2NvcmRpb25cIixcImhhcm1vbmljYVwiLFwidGFuZ28gYWNjb3JkaW9uXCIsXCJhY291c3RpYyBndWl0YXIgKG55bG9uKVwiLFwiYWNvdXN0aWMgZ3VpdGFyIChzdGVlbClcIixcImVsZWN0cmljIGd1aXRhciAoamF6eilcIixcImVsZWN0cmljIGd1aXRhciAoY2xlYW4pXCIsXCJlbGVjdHJpYyBndWl0YXIgKG11dGVkKVwiLFwib3ZlcmRyaXZlbiBndWl0YXJcIixcImRpc3RvcnRpb24gZ3VpdGFyXCIsXCJndWl0YXIgaGFybW9uaWNzXCIsXCJhY291c3RpYyBiYXNzXCIsXCJlbGVjdHJpYyBiYXNzIChmaW5nZXIpXCIsXCJlbGVjdHJpYyBiYXNzIChwaWNrKVwiLFwiZnJldGxlc3MgYmFzc1wiLFwic2xhcCBiYXNzIDFcIixcInNsYXAgYmFzcyAyXCIsXCJzeW50aCBiYXNzIDFcIixcInN5bnRoIGJhc3MgMlwiLFwidmlvbGluXCIsXCJ2aW9sYVwiLFwiY2VsbG9cIixcImNvbnRyYWJhc3NcIixcInRyZW1vbG8gc3RyaW5nc1wiLFwicGl6emljYXRvIHN0cmluZ3NcIixcIm9yY2hlc3RyYWwgaGFycFwiLFwidGltcGFuaVwiLFwic3RyaW5nIGVuc2VtYmxlIDFcIixcInN0cmluZyBlbnNlbWJsZSAyXCIsXCJzeW50aHN0cmluZ3MgMVwiLFwic3ludGhzdHJpbmdzIDJcIixcImNob2lyIGFhaHNcIixcInZvaWNlIG9vaHNcIixcInN5bnRoIHZvaWNlXCIsXCJvcmNoZXN0cmEgaGl0XCIsXCJ0cnVtcGV0XCIsXCJ0cm9tYm9uZVwiLFwidHViYVwiLFwibXV0ZWQgdHJ1bXBldFwiLFwiZnJlbmNoIGhvcm5cIixcImJyYXNzIHNlY3Rpb25cIixcInN5bnRoYnJhc3MgMVwiLFwic3ludGhicmFzcyAyXCIsXCJzb3ByYW5vIHNheFwiLFwiYWx0byBzYXhcIixcInRlbm9yIHNheFwiLFwiYmFyaXRvbmUgc2F4XCIsXCJvYm9lXCIsXCJlbmdsaXNoIGhvcm5cIixcImJhc3Nvb25cIixcImNsYXJpbmV0XCIsXCJwaWNjb2xvXCIsXCJmbHV0ZVwiLFwicmVjb3JkZXJcIixcInBhbiBmbHV0ZVwiLFwiYmxvd24gYm90dGxlXCIsXCJzaGFrdWhhY2hpXCIsXCJ3aGlzdGxlXCIsXCJvY2FyaW5hXCIsXCJsZWFkIDEgKHNxdWFyZSlcIixcImxlYWQgMiAoc2F3dG9vdGgpXCIsXCJsZWFkIDMgKGNhbGxpb3BlKVwiLFwibGVhZCA0IChjaGlmZilcIixcImxlYWQgNSAoY2hhcmFuZylcIixcImxlYWQgNiAodm9pY2UpXCIsXCJsZWFkIDcgKGZpZnRocylcIixcImxlYWQgOCAoYmFzcyArIGxlYWQpXCIsXCJwYWQgMSAobmV3IGFnZSlcIixcInBhZCAyICh3YXJtKVwiLFwicGFkIDMgKHBvbHlzeW50aClcIixcInBhZCA0IChjaG9pcilcIixcInBhZCA1IChib3dlZClcIixcInBhZCA2IChtZXRhbGxpYylcIixcInBhZCA3IChoYWxvKVwiLFwicGFkIDggKHN3ZWVwKVwiLFwiZnggMSAocmFpbilcIixcImZ4IDIgKHNvdW5kdHJhY2spXCIsXCJmeCAzIChjcnlzdGFsKVwiLFwiZnggNCAoYXRtb3NwaGVyZSlcIixcImZ4IDUgKGJyaWdodG5lc3MpXCIsXCJmeCA2IChnb2JsaW5zKVwiLFwiZnggNyAoZWNob2VzKVwiLFwiZnggOCAoc2NpLWZpKVwiLFwic2l0YXJcIixcImJhbmpvXCIsXCJzaGFtaXNlblwiLFwia290b1wiLFwia2FsaW1iYVwiLFwiYmFnIHBpcGVcIixcImZpZGRsZVwiLFwic2hhbmFpXCIsXCJ0aW5rbGUgYmVsbFwiLFwiYWdvZ29cIixcInN0ZWVsIGRydW1zXCIsXCJ3b29kYmxvY2tcIixcInRhaWtvIGRydW1cIixcIm1lbG9kaWMgdG9tXCIsXCJzeW50aCBkcnVtXCIsXCJyZXZlcnNlIGN5bWJhbFwiLFwiZ3VpdGFyIGZyZXQgbm9pc2VcIixcImJyZWF0aCBub2lzZVwiLFwic2Vhc2hvcmVcIixcImJpcmQgdHdlZXRcIixcInRlbGVwaG9uZSByaW5nXCIsXCJoZWxpY29wdGVyXCIsXCJhcHBsYXVzZVwiLFwiZ3Vuc2hvdFwiXSxlLmluc3RydW1lbnRGYW1pbHlCeUlEPVtcInBpYW5vXCIsXCJjaHJvbWF0aWMgcGVyY3Vzc2lvblwiLFwib3JnYW5cIixcImd1aXRhclwiLFwiYmFzc1wiLFwic3RyaW5nc1wiLFwiZW5zZW1ibGVcIixcImJyYXNzXCIsXCJyZWVkXCIsXCJwaXBlXCIsXCJzeW50aCBsZWFkXCIsXCJzeW50aCBwYWRcIixcInN5bnRoIGVmZmVjdHNcIixcImV0aG5pY1wiLFwicGVyY3Vzc2l2ZVwiLFwic291bmQgZWZmZWN0c1wiXX0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsZSl7dmFyIG49MCxyPXQubGVuZ3RoLGk9cjtpZihyPjAmJnRbci0xXS50aW1lPD1lKXJldHVybiByLTE7Zm9yKDtpPm47KXt2YXIgYT1NYXRoLmZsb29yKG4rKGktbikvMiksbz10W2FdLHM9dFthKzFdO2lmKG8udGltZT09PWUpe2Zvcih2YXIgdT1hO3U8dC5sZW5ndGg7dSsrKXt2YXIgYz10W3VdO2MudGltZT09PWUmJihhPXUpfXJldHVybiBhfWlmKG8udGltZTxlJiZzLnRpbWU+ZSlyZXR1cm4gYTtvLnRpbWU+ZT9pPWE6by50aW1lPGUmJihuPWErMSl9cmV0dXJuLTF9ZnVuY3Rpb24gcih0LGUpe2lmKHQubGVuZ3RoKXt2YXIgcj1uKHQsZS50aW1lKTt0LnNwbGljZShyKzEsMCxlKX1lbHNlIHQucHVzaChlKX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLkJpbmFyeUluc2VydD1yfSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciByPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixyKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxyJiZ0KGUsciksZX19KCksaT17MTpcIm1vZHVsYXRpb25XaGVlbFwiLDI6XCJicmVhdGhcIiw0OlwiZm9vdENvbnRyb2xsZXJcIiw1OlwicG9ydGFtZW50b1RpbWVcIiw3Olwidm9sdW1lXCIsODpcImJhbGFuY2VcIiwxMDpcInBhblwiLDY0Olwic3VzdGFpblwiLDY1OlwicG9ydGFtZW50b1RpbWVcIiw2NjpcInNvc3RlbnV0b1wiLDY3Olwic29mdFBlZGFsXCIsNjg6XCJsZWdhdG9Gb290c3dpdGNoXCIsODQ6XCJwb3J0YW1lbnRvQ29udHJvXCJ9LGE9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGUscixpKXtuKHRoaXMsdCksdGhpcy5udW1iZXI9ZSx0aGlzLnRpbWU9cix0aGlzLnZhbHVlPWl9cmV0dXJuIHIodCxbe2tleTpcIm5hbWVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaS5oYXNPd25Qcm9wZXJ0eSh0aGlzLm51bWJlcik/aVt0aGlzLm51bWJlcl06dm9pZCAwfX1dKSx0fSgpO2UuQ29udHJvbD1hfSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCl7Zm9yKHZhciBlPXtQUFE6dC5oZWFkZXIudGlja3NQZXJCZWF0fSxuPTA7bjx0LnRyYWNrcy5sZW5ndGg7bisrKWZvcih2YXIgcj10LnRyYWNrc1tuXSxpPTA7aTxyLmxlbmd0aDtpKyspe3ZhciBhPXJbaV07XCJtZXRhXCI9PT1hLnR5cGUmJihcInRpbWVTaWduYXR1cmVcIj09PWEuc3VidHlwZT9lLnRpbWVTaWduYXR1cmU9W2EubnVtZXJhdG9yLGEuZGVub21pbmF0b3JdOlwic2V0VGVtcG9cIj09PWEuc3VidHlwZSYmKGUuYnBtfHwoZS5icG09NmU3L2EubWljcm9zZWNvbmRzUGVyQmVhdCkpKX1yZXR1cm4gZS5icG09ZS5icG18fDEyMCxlfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUucGFyc2VIZWFkZXI9bn0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsZSl7Zm9yKHZhciBuPTA7bjx0Lmxlbmd0aDtuKyspe3ZhciByPXRbbl0saT1lW25dO2lmKHIubGVuZ3RoPmkpcmV0dXJuITB9cmV0dXJuITF9ZnVuY3Rpb24gcih0LGUsbil7Zm9yKHZhciByPTAsaT0xLzAsYT0wO2E8dC5sZW5ndGg7YSsrKXt2YXIgbz10W2FdLHM9ZVthXTtvW3NdJiZvW3NdLnRpbWU8aSYmKHI9YSxpPW9bc10udGltZSl9bltyXSh0W3JdW2Vbcl1dKSxlW3JdKz0xfWZ1bmN0aW9uIGkoKXtmb3IodmFyIHQ9YXJndW1lbnRzLmxlbmd0aCxlPUFycmF5KHQpLGk9MDt0Pmk7aSsrKWVbaV09YXJndW1lbnRzW2ldO2Zvcih2YXIgYT1lLmZpbHRlcihmdW5jdGlvbih0LGUpe3JldHVybiBlJTI9PT0wfSksbz1uZXcgVWludDMyQXJyYXkoYS5sZW5ndGgpLHM9ZS5maWx0ZXIoZnVuY3Rpb24odCxlKXtyZXR1cm4gZSUyPT09MX0pO24oYSxvKTspcihhLG8scyl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5NZXJnZT1pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIGkodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuTWlkaT12b2lkIDA7dmFyIGE9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLHIpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLHImJnQoZSxyKSxlfX0oKSxvPW4oMTEpLHM9cihvKSx1PW4oMTApLGM9cih1KSxoPW4oMSksZj1yKGgpLGQ9big5KSxsPW4oNSkscD1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtpKHRoaXMsdCksdGhpcy5oZWFkZXI9e2JwbToxMjAsdGltZVNpZ25hdHVyZTpbNCw0XSxQUFE6NDgwfSx0aGlzLnRyYWNrcz1bXX1yZXR1cm4gYSh0LFt7a2V5OlwibG9hZFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMsbj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06bnVsbCxyPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXTpcIkdFVFwiO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihpLGEpe3ZhciBvPW5ldyBYTUxIdHRwUmVxdWVzdDtvLm9wZW4ocix0KSxvLnJlc3BvbnNlVHlwZT1cImFycmF5YnVmZmVyXCIsby5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGZ1bmN0aW9uKCl7ND09PW8ucmVhZHlTdGF0ZSYmMjAwPT09by5zdGF0dXM/aShlLmRlY29kZShvLnJlc3BvbnNlKSk6YShvLnN0YXR1cyl9KSxvLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLGEpLG8uc2VuZChuKX0pfX0se2tleTpcImRlY29kZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXM7aWYodCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKXt2YXIgbj1uZXcgVWludDhBcnJheSh0KTt0PVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxuKX12YXIgcj0oMCxzW1wiZGVmYXVsdFwiXSkodCk7cmV0dXJuIHRoaXMuaGVhZGVyPSgwLGwucGFyc2VIZWFkZXIpKHIpLHRoaXMudHJhY2tzPVtdLHIudHJhY2tzLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIG49bmV3IGQuVHJhY2s7ZS50cmFja3MucHVzaChuKTt2YXIgcj0wO3QuZm9yRWFjaChmdW5jdGlvbih0KXtyKz1mW1wiZGVmYXVsdFwiXS50aWNrc1RvU2Vjb25kcyh0LmRlbHRhVGltZSxlLmhlYWRlciksXCJtZXRhXCI9PT10LnR5cGUmJlwidHJhY2tOYW1lXCI9PT10LnN1YnR5cGU/bi5uYW1lPWZbXCJkZWZhdWx0XCJdLmNsZWFuTmFtZSh0LnRleHQpOlwibm90ZU9uXCI9PT10LnN1YnR5cGU/bi5ub3RlT24odC5ub3RlTnVtYmVyLHIsdC52ZWxvY2l0eS8xMjcpOlwibm90ZU9mZlwiPT09dC5zdWJ0eXBlP24ubm90ZU9mZih0Lm5vdGVOdW1iZXIscik6XCJjb250cm9sbGVyXCI9PT10LnN1YnR5cGUmJnQuY29udHJvbGxlclR5cGU/bi5jYyh0LmNvbnRyb2xsZXJUeXBlLHIsdC52YWx1ZS8xMjcpOlwibWV0YVwiPT09dC50eXBlJiZcImluc3RydW1lbnROYW1lXCI9PT10LnN1YnR5cGU/bi5pbnN0cnVtZW50PXQudGV4dDpcImNoYW5uZWxcIj09PXQudHlwZSYmXCJwcm9ncmFtQ2hhbmdlXCI9PT10LnN1YnR5cGUmJm4ucGF0Y2godC5wcm9ncmFtTnVtYmVyKX0pfSksdGhpc319LHtrZXk6XCJlbmNvZGVcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciB0PXRoaXMsZT1uZXcgY1tcImRlZmF1bHRcIl0uRmlsZSh7dGlja3M6dGhpcy5oZWFkZXIuUFBRfSk7cmV0dXJuIHRoaXMudHJhY2tzLmZvckVhY2goZnVuY3Rpb24obixyKXt2YXIgaT1lLmFkZFRyYWNrKCk7aS5zZXRUZW1wbyh0LmJwbSksbi5lbmNvZGUoaSx0LmhlYWRlcil9KSxlLnRvQnl0ZXMoKX19LHtrZXk6XCJ0b0FycmF5XCIsdmFsdWU6ZnVuY3Rpb24oKXtmb3IodmFyIHQ9dGhpcy5lbmNvZGUoKSxlPW5ldyBBcnJheSh0Lmxlbmd0aCksbj0wO248dC5sZW5ndGg7bisrKWVbbl09dC5jaGFyQ29kZUF0KG4pO3JldHVybiBlfX0se2tleTpcInRyYWNrXCIsdmFsdWU6ZnVuY3Rpb24gZSh0KXt2YXIgZT1uZXcgZC5UcmFjayh0KTtyZXR1cm4gdGhpcy50cmFja3MucHVzaChlKSxlfX0se2tleTpcImdldFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBmW1wiZGVmYXVsdFwiXS5pc051bWJlcih0KT90aGlzLnRyYWNrc1t0XTp0aGlzLnRyYWNrcy5maW5kKGZ1bmN0aW9uKGUpe3JldHVybiBlLm5hbWU9PT10fSl9fSx7a2V5Olwic2xpY2VcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTowLG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOnRoaXMuZHVyYXRpb24scj1uZXcgdDtyZXR1cm4gci5oZWFkZXI9dGhpcy5oZWFkZXIsci50cmFja3M9dGhpcy50cmFja3MubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0LnNsaWNlKGUsbil9KSxyfX0se2tleTpcInN0YXJ0VGltZVwiLGdldDpmdW5jdGlvbigpe3ZhciB0PXRoaXMudHJhY2tzLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdC5zdGFydFRpbWV9KTtyZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCx0KX19LHtrZXk6XCJicG1cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oZWFkZXIuYnBtfSxzZXQ6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5oZWFkZXIuYnBtO3RoaXMuaGVhZGVyLmJwbT10O3ZhciBuPWUvdDt0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHQpe3JldHVybiB0LnNjYWxlKG4pfSl9fSx7a2V5OlwidGltZVNpZ25hdHVyZVwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmhlYWRlci50aW1lU2lnbmF0dXJlfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5oZWFkZXIudGltZVNpZ25hdHVyZT10aW1lU2lnbmF0dXJlfX0se2tleTpcImR1cmF0aW9uXCIsZ2V0OmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy50cmFja3MubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0LmR1cmF0aW9ufSk7cmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsdCl9fV0pLHR9KCk7ZS5NaWRpPXB9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19ZnVuY3Rpb24gaSh0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5Ob3RlPXZvaWQgMDt2YXIgYT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fXJldHVybiBmdW5jdGlvbihlLG4scil7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksciYmdChlLHIpLGV9fSgpLG89bigxKSxzPXIobyksdT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoZSxuKXt2YXIgcj1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06MCxhPWFyZ3VtZW50cy5sZW5ndGg+MyYmdm9pZCAwIT09YXJndW1lbnRzWzNdP2FyZ3VtZW50c1szXToxO2lmKGkodGhpcyx0KSx0aGlzLm1pZGksc1tcImRlZmF1bHRcIl0uaXNOdW1iZXIoZSkpdGhpcy5taWRpPWU7ZWxzZXtpZighc1tcImRlZmF1bHRcIl0uaXNQaXRjaChlKSl0aHJvdyBuZXcgRXJyb3IoXCJ0aGUgbWlkaSB2YWx1ZSBtdXN0IGVpdGhlciBiZSBpbiBQaXRjaCBOb3RhdGlvbiAoZS5nLiBDIzQpIG9yIGEgbWlkaSB2YWx1ZVwiKTt0aGlzLm5hbWU9ZX10aGlzLnRpbWU9bix0aGlzLmR1cmF0aW9uPXIsdGhpcy52ZWxvY2l0eT1hfXJldHVybiBhKHQsW3trZXk6XCJtYXRjaFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBzW1wiZGVmYXVsdFwiXS5pc051bWJlcih0KT90aGlzLm1pZGk9PT10OnNbXCJkZWZhdWx0XCJdLmlzUGl0Y2godCk/dGhpcy5uYW1lLnRvTG93ZXJDYXNlKCk9PT10LnRvTG93ZXJDYXNlKCk6dm9pZCAwfX0se2tleTpcInRvSlNPTlwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJue25hbWU6dGhpcy5uYW1lLG1pZGk6dGhpcy5taWRpLHRpbWU6dGhpcy50aW1lLHZlbG9jaXR5OnRoaXMudmVsb2NpdHksZHVyYXRpb246dGhpcy5kdXJhdGlvbn19fSx7a2V5OlwibmFtZVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzW1wiZGVmYXVsdFwiXS5taWRpVG9QaXRjaCh0aGlzLm1pZGkpfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5taWRpPXNbXCJkZWZhdWx0XCJdLnBpdGNoVG9NaWRpKHQpfX0se2tleTpcIm5vdGVPblwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbWV9LHNldDpmdW5jdGlvbih0KXt0aGlzLnRpbWU9dH19LHtrZXk6XCJub3RlT2ZmXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGltZSt0aGlzLmR1cmF0aW9ufSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5kdXJhdGlvbj10LXRoaXMudGltZX19XSksdH0oKTtlLk5vdGU9dX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuVHJhY2s9dm9pZCAwO3ZhciBpPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixyKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxyJiZ0KGUsciksZX19KCksYT1uKDMpLG89big0KSxzPW4oNiksdT1uKDgpLGM9bigyKSxoPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpcIlwiLG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOi0xO3IodGhpcyx0KSx0aGlzLm5hbWU9ZSx0aGlzLm5vdGVzPVtdLHRoaXMuY29udHJvbENoYW5nZXM9e30sdGhpcy5pbnN0cnVtZW50TnVtYmVyPW59cmV0dXJuIGkodCxbe2tleTpcIm5vdGVcIix2YWx1ZTpmdW5jdGlvbiBlKHQsbil7dmFyIHI9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOjAsaT1hcmd1bWVudHMubGVuZ3RoPjMmJnZvaWQgMCE9PWFyZ3VtZW50c1szXT9hcmd1bWVudHNbM106MSxlPW5ldyB1Lk5vdGUodCxuLHIsaSk7cmV0dXJuKDAsYS5CaW5hcnlJbnNlcnQpKHRoaXMubm90ZXMsZSksdGhpc319LHtrZXk6XCJub3RlT25cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXToxLHI9bmV3IHUuTm90ZSh0LGUsMCxuKTtyZXR1cm4oMCxhLkJpbmFyeUluc2VydCkodGhpcy5ub3RlcyxyKSx0aGlzfX0se2tleTpcIm5vdGVPZmZcIix2YWx1ZTpmdW5jdGlvbih0LGUpe2Zvcih2YXIgbj0wO248dGhpcy5ub3Rlcy5sZW5ndGg7bisrKXt2YXIgcj10aGlzLm5vdGVzW25dO2lmKHIubWF0Y2godCkmJjA9PT1yLmR1cmF0aW9uKXtyLm5vdGVPZmY9ZTticmVha319cmV0dXJuIHRoaXN9fSx7a2V5OlwiY2NcIix2YWx1ZTpmdW5jdGlvbiBuKHQsZSxyKXt0aGlzLmNvbnRyb2xDaGFuZ2VzLmhhc093blByb3BlcnR5KHQpfHwodGhpcy5jb250cm9sQ2hhbmdlc1t0XT1bXSk7dmFyIG49bmV3IG8uQ29udHJvbCh0LGUscik7cmV0dXJuKDAsYS5CaW5hcnlJbnNlcnQpKHRoaXMuY29udHJvbENoYW5nZXNbdF0sbiksdGhpc319LHtrZXk6XCJwYXRjaFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmluc3RydW1lbnROdW1iZXI9dCx0aGlzfX0se2tleTpcInNjYWxlXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMubm90ZXMuZm9yRWFjaChmdW5jdGlvbihlKXtlLnRpbWUqPXQsZS5kdXJhdGlvbio9dH0pLHRoaXN9fSx7a2V5Olwic2xpY2VcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTowLG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOnRoaXMuZHVyYXRpb24scj1NYXRoLm1heCh0aGlzLm5vdGVzLmZpbmRJbmRleChmdW5jdGlvbih0KXtyZXR1cm4gdC50aW1lPj1lfSksMCksaT10aGlzLm5vdGVzLmZpbmRJbmRleChmdW5jdGlvbih0KXtyZXR1cm4gdC5ub3RlT2ZmPj1ufSkrMSxhPW5ldyB0KHRoaXMubmFtZSk7cmV0dXJuIGEubm90ZXM9dGhpcy5ub3Rlcy5zbGljZShyLGkpLGEubm90ZXMuZm9yRWFjaChmdW5jdGlvbih0KXtyZXR1cm4gdC50aW1lPXQudGltZS1lfSksYX19LHtrZXk6XCJlbmNvZGVcIix2YWx1ZTpmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIG4odCl7dmFyIGU9TWF0aC5mbG9vcihyKnQpLG49TWF0aC5tYXgoZS1pLDApO3JldHVybiBpPWUsbn12YXIgcj1lLlBQUS8oNjAvZS5icG0pLGk9MCxhPTA7LTEhPT10aGlzLmluc3RydW1lbnROdW1iZXImJnQuaW5zdHJ1bWVudChhLHRoaXMuaW5zdHJ1bWVudE51bWJlciksKDAscy5NZXJnZSkodGhpcy5ub3RlT25zLGZ1bmN0aW9uKGUpe3QuYWRkTm90ZU9uKGEsZS5uYW1lLG4oZS50aW1lKSxNYXRoLmZsb29yKDEyNyplLnZlbG9jaXR5KSl9LHRoaXMubm90ZU9mZnMsZnVuY3Rpb24oZSl7dC5hZGROb3RlT2ZmKGEsZS5uYW1lLG4oZS50aW1lKSl9KX19LHtrZXk6XCJub3RlT25zXCIsZ2V0OmZ1bmN0aW9uKCl7dmFyIHQ9W107cmV0dXJuIHRoaXMubm90ZXMuZm9yRWFjaChmdW5jdGlvbihlKXt0LnB1c2goe3RpbWU6ZS5ub3RlT24sbWlkaTplLm1pZGksbmFtZTplLm5hbWUsdmVsb2NpdHk6ZS52ZWxvY2l0eX0pfSksdH19LHtrZXk6XCJub3RlT2Zmc1wiLGdldDpmdW5jdGlvbigpe3ZhciB0PVtdO3JldHVybiB0aGlzLm5vdGVzLmZvckVhY2goZnVuY3Rpb24oZSl7dC5wdXNoKHt0aW1lOmUubm90ZU9mZixtaWRpOmUubWlkaSxuYW1lOmUubmFtZX0pfSksdH19LHtrZXk6XCJsZW5ndGhcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ub3Rlcy5sZW5ndGh9fSx7a2V5Olwic3RhcnRUaW1lXCIsZ2V0OmZ1bmN0aW9uKCl7aWYodGhpcy5ub3Rlcy5sZW5ndGgpe3ZhciB0PXRoaXMubm90ZXNbMF07cmV0dXJuIHQubm90ZU9ufXJldHVybiAwfX0se2tleTpcImR1cmF0aW9uXCIsZ2V0OmZ1bmN0aW9uKCl7aWYodGhpcy5ub3Rlcy5sZW5ndGgpe3ZhciB0PXRoaXMubm90ZXNbdGhpcy5ub3Rlcy5sZW5ndGgtMV07cmV0dXJuIHQubm90ZU9mZn1yZXR1cm4gMH19LHtrZXk6XCJpbnN0cnVtZW50XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGMuaW5zdHJ1bWVudEJ5UGF0Y2hJRFt0aGlzLmluc3RydW1lbnROdW1iZXJdfSxzZXQ6ZnVuY3Rpb24odCl7dmFyIGU9Yy5pbnN0cnVtZW50QnlQYXRjaElELmluZGV4T2YodCk7LTEhPT1lJiYodGhpcy5pbnN0cnVtZW50TnVtYmVyPWUpfX0se2tleTpcImluc3RydW1lbnRGYW1pbHlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gYy5pbnN0cnVtZW50RmFtaWx5QnlJRFtNYXRoLmZsb29yKHRoaXMuaW5zdHJ1bWVudE51bWJlci84KV19fV0pLHR9KCk7ZS5UcmFjaz1ofSxmdW5jdGlvbih0LGUsbil7KGZ1bmN0aW9uKHQpe3ZhciBuPXt9OyFmdW5jdGlvbih0KXt2YXIgZT10LkRFRkFVTFRfVk9MVU1FPTkwLG49KHQuREVGQVVMVF9EVVJBVElPTj0xMjgsdC5ERUZBVUxUX0NIQU5ORUw9MCx7bWlkaV9sZXR0ZXJfcGl0Y2hlczp7YToyMSxiOjIzLGM6MTIsZDoxNCxlOjE2LGY6MTcsZzoxOX0sbWlkaVBpdGNoRnJvbU5vdGU6ZnVuY3Rpb24odCl7dmFyIGU9LyhbYS1nXSkoIyt8YispPyhbMC05XSspJC9pLmV4ZWModCkscj1lWzFdLnRvTG93ZXJDYXNlKCksaT1lWzJdfHxcIlwiLGE9cGFyc2VJbnQoZVszXSwxMCk7cmV0dXJuIDEyKmErbi5taWRpX2xldHRlcl9waXRjaGVzW3JdKyhcIiNcIj09aS5zdWJzdHIoMCwxKT8xOi0xKSppLmxlbmd0aH0sZW5zdXJlTWlkaVBpdGNoOmZ1bmN0aW9uKHQpe3JldHVyblwibnVtYmVyXCIhPXR5cGVvZiB0JiYvW14wLTldLy50ZXN0KHQpP24ubWlkaVBpdGNoRnJvbU5vdGUodCk6cGFyc2VJbnQodCwxMCl9LG1pZGlfcGl0Y2hlc19sZXR0ZXI6ezEyOlwiY1wiLDEzOlwiYyNcIiwxNDpcImRcIiwxNTpcImQjXCIsMTY6XCJlXCIsMTc6XCJmXCIsMTg6XCJmI1wiLDE5OlwiZ1wiLDIwOlwiZyNcIiwyMTpcImFcIiwyMjpcImEjXCIsMjM6XCJiXCJ9LG1pZGlfZmxhdHRlbmVkX25vdGVzOntcImEjXCI6XCJiYlwiLFwiYyNcIjpcImRiXCIsXCJkI1wiOlwiZWJcIixcImYjXCI6XCJnYlwiLFwiZyNcIjpcImFiXCJ9LG5vdGVGcm9tTWlkaVBpdGNoOmZ1bmN0aW9uKHQsZSl7dmFyIHIsaT0wLGE9dCxlPWV8fCExO3JldHVybiB0PjIzJiYoaT1NYXRoLmZsb29yKHQvMTIpLTEsYT10LTEyKmkpLHI9bi5taWRpX3BpdGNoZXNfbGV0dGVyW2FdLGUmJnIuaW5kZXhPZihcIiNcIik+MCYmKHI9bi5taWRpX2ZsYXR0ZW5lZF9ub3Rlc1tyXSkscitpfSxtcHFuRnJvbUJwbTpmdW5jdGlvbih0KXt2YXIgZT1NYXRoLmZsb29yKDZlNy90KSxuPVtdO2RvIG4udW5zaGlmdCgyNTUmZSksZT4+PTg7d2hpbGUoZSk7Zm9yKDtuLmxlbmd0aDwzOyluLnB1c2goMCk7cmV0dXJuIG59LGJwbUZyb21NcHFuOmZ1bmN0aW9uKHQpe3ZhciBlPXQ7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHRbMF0pe2U9MDtmb3IodmFyIG49MCxyPXQubGVuZ3RoLTE7cj49MDsrK24sLS1yKWV8PXRbbl08PHJ9cmV0dXJuIE1hdGguZmxvb3IoNmU3L3QpfSxjb2RlczJTdHI6ZnVuY3Rpb24odCl7cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCx0KX0sc3RyMkJ5dGVzOmZ1bmN0aW9uKHQsZSl7aWYoZSlmb3IoO3QubGVuZ3RoLzI8ZTspdD1cIjBcIit0O2Zvcih2YXIgbj1bXSxyPXQubGVuZ3RoLTE7cj49MDtyLT0yKXt2YXIgaT0wPT09cj90W3JdOnRbci0xXSt0W3JdO24udW5zaGlmdChwYXJzZUludChpLDE2KSl9cmV0dXJuIG59LHRyYW5zbGF0ZVRpY2tUaW1lOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZT0xMjcmdDt0Pj49NzspZTw8PTgsZXw9MTI3JnR8MTI4O2Zvcih2YXIgbj1bXTs7KXtpZihuLnB1c2goMjU1JmUpLCEoMTI4JmUpKWJyZWFrO2U+Pj04fXJldHVybiBufX0pLHI9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXM/dm9pZCghdHx8bnVsbD09PXQudHlwZSYmdm9pZCAwPT09dC50eXBlfHxudWxsPT09dC5jaGFubmVsJiZ2b2lkIDA9PT10LmNoYW5uZWx8fG51bGw9PT10LnBhcmFtMSYmdm9pZCAwPT09dC5wYXJhbTF8fCh0aGlzLnNldFRpbWUodC50aW1lKSx0aGlzLnNldFR5cGUodC50eXBlKSx0aGlzLnNldENoYW5uZWwodC5jaGFubmVsKSx0aGlzLnNldFBhcmFtMSh0LnBhcmFtMSksdGhpcy5zZXRQYXJhbTIodC5wYXJhbTIpKSk6bmV3IHIodCl9O3IuTk9URV9PRkY9MTI4LHIuTk9URV9PTj0xNDQsci5BRlRFUl9UT1VDSD0xNjAsci5DT05UUk9MTEVSPTE3NixyLlBST0dSQU1fQ0hBTkdFPTE5MixyLkNIQU5ORUxfQUZURVJUT1VDSD0yMDgsci5QSVRDSF9CRU5EPTIyNCxyLnByb3RvdHlwZS5zZXRUaW1lPWZ1bmN0aW9uKHQpe3RoaXMudGltZT1uLnRyYW5zbGF0ZVRpY2tUaW1lKHR8fDApfSxyLnByb3RvdHlwZS5zZXRUeXBlPWZ1bmN0aW9uKHQpe2lmKHQ8ci5OT1RFX09GRnx8dD5yLlBJVENIX0JFTkQpdGhyb3cgbmV3IEVycm9yKFwiVHJ5aW5nIHRvIHNldCBhbiB1bmtub3duIGV2ZW50OiBcIit0KTt0aGlzLnR5cGU9dH0sci5wcm90b3R5cGUuc2V0Q2hhbm5lbD1mdW5jdGlvbih0KXtpZigwPnR8fHQ+MTUpdGhyb3cgbmV3IEVycm9yKFwiQ2hhbm5lbCBpcyBvdXQgb2YgYm91bmRzLlwiKTt0aGlzLmNoYW5uZWw9dH0sci5wcm90b3R5cGUuc2V0UGFyYW0xPWZ1bmN0aW9uKHQpe3RoaXMucGFyYW0xPXR9LHIucHJvdG90eXBlLnNldFBhcmFtMj1mdW5jdGlvbih0KXt0aGlzLnBhcmFtMj10fSxyLnByb3RvdHlwZS50b0J5dGVzPWZ1bmN0aW9uKCl7dmFyIHQ9W10sZT10aGlzLnR5cGV8MTUmdGhpcy5jaGFubmVsO3JldHVybiB0LnB1c2guYXBwbHkodCx0aGlzLnRpbWUpLHQucHVzaChlKSx0LnB1c2godGhpcy5wYXJhbTEpLHZvaWQgMCE9PXRoaXMucGFyYW0yJiZudWxsIT09dGhpcy5wYXJhbTImJnQucHVzaCh0aGlzLnBhcmFtMiksdH07dmFyIGk9ZnVuY3Rpb24odCl7aWYoIXRoaXMpcmV0dXJuIG5ldyBpKHQpO3RoaXMuc2V0VGltZSh0LnRpbWUpLHRoaXMuc2V0VHlwZSh0LnR5cGUpLHRoaXMuc2V0RGF0YSh0LmRhdGEpfTtpLlNFUVVFTkNFPTAsaS5URVhUPTEsaS5DT1BZUklHSFQ9MixpLlRSQUNLX05BTUU9MyxpLklOU1RSVU1FTlQ9NCxpLkxZUklDPTUsaS5NQVJLRVI9NixpLkNVRV9QT0lOVD03LGkuQ0hBTk5FTF9QUkVGSVg9MzIsaS5FTkRfT0ZfVFJBQ0s9NDcsaS5URU1QTz04MSxpLlNNUFRFPTg0LGkuVElNRV9TSUc9ODgsaS5LRVlfU0lHPTg5LGkuU0VRX0VWRU5UPTEyNyxpLnByb3RvdHlwZS5zZXRUaW1lPWZ1bmN0aW9uKHQpe3RoaXMudGltZT1uLnRyYW5zbGF0ZVRpY2tUaW1lKHR8fDApfSxpLnByb3RvdHlwZS5zZXRUeXBlPWZ1bmN0aW9uKHQpe3RoaXMudHlwZT10fSxpLnByb3RvdHlwZS5zZXREYXRhPWZ1bmN0aW9uKHQpe3RoaXMuZGF0YT10fSxpLnByb3RvdHlwZS50b0J5dGVzPWZ1bmN0aW9uKCl7aWYoIXRoaXMudHlwZSl0aHJvdyBuZXcgRXJyb3IoXCJUeXBlIGZvciBtZXRhLWV2ZW50IG5vdCBzcGVjaWZpZWQuXCIpO3ZhciB0PVtdO2lmKHQucHVzaC5hcHBseSh0LHRoaXMudGltZSksdC5wdXNoKDI1NSx0aGlzLnR5cGUpLEFycmF5LmlzQXJyYXkodGhpcy5kYXRhKSl0LnB1c2godGhpcy5kYXRhLmxlbmd0aCksdC5wdXNoLmFwcGx5KHQsdGhpcy5kYXRhKTtlbHNlIGlmKFwibnVtYmVyXCI9PXR5cGVvZiB0aGlzLmRhdGEpdC5wdXNoKDEsdGhpcy5kYXRhKTtlbHNlIGlmKG51bGwhPT10aGlzLmRhdGEmJnZvaWQgMCE9PXRoaXMuZGF0YSl7dC5wdXNoKHRoaXMuZGF0YS5sZW5ndGgpO3ZhciBlPXRoaXMuZGF0YS5zcGxpdChcIlwiKS5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIHQuY2hhckNvZGVBdCgwKX0pO3QucHVzaC5hcHBseSh0LGUpfWVsc2UgdC5wdXNoKDApO3JldHVybiB0fTt2YXIgYT1mdW5jdGlvbih0KXtpZighdGhpcylyZXR1cm4gbmV3IGEodCk7dmFyIGU9dHx8e307dGhpcy5ldmVudHM9ZS5ldmVudHN8fFtdfTthLlNUQVJUX0JZVEVTPVs3Nyw4NCwxMTQsMTA3XSxhLkVORF9CWVRFUz1bMCwyNTUsNDcsMF0sYS5wcm90b3R5cGUuYWRkRXZlbnQ9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuZXZlbnRzLnB1c2godCksdGhpc30sYS5wcm90b3R5cGUuYWRkTm90ZU9uPWEucHJvdG90eXBlLm5vdGVPbj1mdW5jdGlvbih0LGksYSxvKXtyZXR1cm4gdGhpcy5ldmVudHMucHVzaChuZXcgcih7dHlwZTpyLk5PVEVfT04sY2hhbm5lbDp0LHBhcmFtMTpuLmVuc3VyZU1pZGlQaXRjaChpKSxwYXJhbTI6b3x8ZSx0aW1lOmF8fDB9KSksdGhpc30sYS5wcm90b3R5cGUuYWRkTm90ZU9mZj1hLnByb3RvdHlwZS5ub3RlT2ZmPWZ1bmN0aW9uKHQsaSxhLG8pe3JldHVybiB0aGlzLmV2ZW50cy5wdXNoKG5ldyByKHt0eXBlOnIuTk9URV9PRkYsY2hhbm5lbDp0LHBhcmFtMTpuLmVuc3VyZU1pZGlQaXRjaChpKSxwYXJhbTI6b3x8ZSx0aW1lOmF8fDB9KSksdGhpc30sYS5wcm90b3R5cGUuYWRkTm90ZT1hLnByb3RvdHlwZS5ub3RlPWZ1bmN0aW9uKHQsZSxuLHIsaSl7cmV0dXJuIHRoaXMubm90ZU9uKHQsZSxyLGkpLG4mJnRoaXMubm90ZU9mZih0LGUsbixpKSx0aGlzfSxhLnByb3RvdHlwZS5hZGRDaG9yZD1hLnByb3RvdHlwZS5jaG9yZD1mdW5jdGlvbih0LGUsbixyKXtpZighQXJyYXkuaXNBcnJheShlKSYmIWUubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkNob3JkIG11c3QgYmUgYW4gYXJyYXkgb2YgcGl0Y2hlc1wiKTtyZXR1cm4gZS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3RoaXMubm90ZU9uKHQsZSwwLHIpfSx0aGlzKSxlLmZvckVhY2goZnVuY3Rpb24oZSxyKXswPT09cj90aGlzLm5vdGVPZmYodCxlLG4pOnRoaXMubm90ZU9mZih0LGUpfSx0aGlzKSx0aGlzfSxhLnByb3RvdHlwZS5zZXRJbnN0cnVtZW50PWEucHJvdG90eXBlLmluc3RydW1lbnQ9ZnVuY3Rpb24odCxlLG4pe3JldHVybiB0aGlzLmV2ZW50cy5wdXNoKG5ldyByKHt0eXBlOnIuUFJPR1JBTV9DSEFOR0UsY2hhbm5lbDp0LHBhcmFtMTplLHRpbWU6bnx8MH0pKSx0aGlzfSxhLnByb3RvdHlwZS5zZXRUZW1wbz1hLnByb3RvdHlwZS50ZW1wbz1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLmV2ZW50cy5wdXNoKG5ldyBpKHt0eXBlOmkuVEVNUE8sZGF0YTpuLm1wcW5Gcm9tQnBtKHQpLHRpbWU6ZXx8MH0pKSx0aGlzfSxhLnByb3RvdHlwZS50b0J5dGVzPWZ1bmN0aW9uKCl7dmFyIHQ9MCxlPVtdLHI9YS5TVEFSVF9CWVRFUyxpPWEuRU5EX0JZVEVTLG89ZnVuY3Rpb24obil7dmFyIHI9bi50b0J5dGVzKCk7dCs9ci5sZW5ndGgsZS5wdXNoLmFwcGx5KGUscil9O3RoaXMuZXZlbnRzLmZvckVhY2gobyksdCs9aS5sZW5ndGg7dmFyIHM9bi5zdHIyQnl0ZXModC50b1N0cmluZygxNiksNCk7cmV0dXJuIHIuY29uY2F0KHMsZSxpKX07dmFyIG89ZnVuY3Rpb24odCl7aWYoIXRoaXMpcmV0dXJuIG5ldyBvKHQpO3ZhciBlPXR8fHt9O2lmKGUudGlja3Mpe2lmKFwibnVtYmVyXCIhPXR5cGVvZiBlLnRpY2tzKXRocm93IG5ldyBFcnJvcihcIlRpY2tzIHBlciBiZWF0IG11c3QgYmUgYSBudW1iZXIhXCIpO2lmKGUudGlja3M8PTB8fGUudGlja3M+PTMyNzY4fHxlLnRpY2tzJTEhPT0wKXRocm93IG5ldyBFcnJvcihcIlRpY2tzIHBlciBiZWF0IG11c3QgYmUgYW4gaW50ZWdlciBiZXR3ZWVuIDEgYW5kIDMyNzY3IVwiKX10aGlzLnRpY2tzPWUudGlja3N8fDEyOCx0aGlzLnRyYWNrcz1lLnRyYWNrc3x8W119O28uSERSX0NIVU5LSUQ9XCJNVGhkXCIsby5IRFJfQ0hVTktfU0laRT1cIlxceDAwXFx4MDBcXHgwMFx1MDAwNlwiLG8uSERSX1RZUEUwPVwiXFx4MDBcXHgwMFwiLG8uSERSX1RZUEUxPVwiXFx4MDBcdTAwMDFcIixvLnByb3RvdHlwZS5hZGRUcmFjaz1mdW5jdGlvbih0KXtyZXR1cm4gdD8odGhpcy50cmFja3MucHVzaCh0KSx0aGlzKToodD1uZXcgYSx0aGlzLnRyYWNrcy5wdXNoKHQpLHQpfSxvLnByb3RvdHlwZS50b0J5dGVzPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy50cmFja3MubGVuZ3RoLnRvU3RyaW5nKDE2KSxlPW8uSERSX0NIVU5LSUQrby5IRFJfQ0hVTktfU0laRTtyZXR1cm4gZSs9cGFyc2VJbnQodCwxNik+MT9vLkhEUl9UWVBFMTpvLkhEUl9UWVBFMCxlKz1uLmNvZGVzMlN0cihuLnN0cjJCeXRlcyh0LDIpKSxlKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMudGlja3MvMjU2LHRoaXMudGlja3MlMjU2KSx0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHQpe2UrPW4uY29kZXMyU3RyKHQudG9CeXRlcygpKX0pLGV9LHQuVXRpbD1uLHQuRmlsZT1vLHQuVHJhY2s9YSx0LkV2ZW50PXIsdC5NZXRhRXZlbnQ9aX0obiksXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHQmJm51bGwhPT10P3QuZXhwb3J0cz1uOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBlJiZudWxsIT09ZT9lPW46dGhpcy5NaWRpPW59KS5jYWxsKGUsbigxMikodCkpfSxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIG4odCl7ZnVuY3Rpb24gZSh0KXt2YXIgZT10LnJlYWQoNCksbj10LnJlYWRJbnQzMigpO3JldHVybntpZDplLGxlbmd0aDpuLGRhdGE6dC5yZWFkKG4pfX1mdW5jdGlvbiBuKHQpe3ZhciBlPXt9O2UuZGVsdGFUaW1lPXQucmVhZFZhckludCgpO3ZhciBuPXQucmVhZEludDgoKTtpZigyNDA9PSgyNDAmbikpe2lmKDI1NT09bil7ZS50eXBlPVwibWV0YVwiO3ZhciByPXQucmVhZEludDgoKSxhPXQucmVhZFZhckludCgpO3N3aXRjaChyKXtjYXNlIDA6aWYoZS5zdWJ0eXBlPVwic2VxdWVuY2VOdW1iZXJcIiwyIT1hKXRocm93XCJFeHBlY3RlZCBsZW5ndGggZm9yIHNlcXVlbmNlTnVtYmVyIGV2ZW50IGlzIDIsIGdvdCBcIithO3JldHVybiBlLm51bWJlcj10LnJlYWRJbnQxNigpLGU7Y2FzZSAxOnJldHVybiBlLnN1YnR5cGU9XCJ0ZXh0XCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgMjpyZXR1cm4gZS5zdWJ0eXBlPVwiY29weXJpZ2h0Tm90aWNlXCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgMzpyZXR1cm4gZS5zdWJ0eXBlPVwidHJhY2tOYW1lXCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgNDpyZXR1cm4gZS5zdWJ0eXBlPVwiaW5zdHJ1bWVudE5hbWVcIixlLnRleHQ9dC5yZWFkKGEpLGU7Y2FzZSA1OnJldHVybiBlLnN1YnR5cGU9XCJseXJpY3NcIixlLnRleHQ9dC5yZWFkKGEpLGU7Y2FzZSA2OnJldHVybiBlLnN1YnR5cGU9XCJtYXJrZXJcIixlLnRleHQ9dC5yZWFkKGEpLGU7Y2FzZSA3OnJldHVybiBlLnN1YnR5cGU9XCJjdWVQb2ludFwiLGUudGV4dD10LnJlYWQoYSksZTtjYXNlIDMyOmlmKGUuc3VidHlwZT1cIm1pZGlDaGFubmVsUHJlZml4XCIsMSE9YSl0aHJvd1wiRXhwZWN0ZWQgbGVuZ3RoIGZvciBtaWRpQ2hhbm5lbFByZWZpeCBldmVudCBpcyAxLCBnb3QgXCIrYTtyZXR1cm4gZS5jaGFubmVsPXQucmVhZEludDgoKSxlO2Nhc2UgNDc6aWYoZS5zdWJ0eXBlPVwiZW5kT2ZUcmFja1wiLDAhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3IgZW5kT2ZUcmFjayBldmVudCBpcyAwLCBnb3QgXCIrYTtyZXR1cm4gZTtjYXNlIDgxOmlmKGUuc3VidHlwZT1cInNldFRlbXBvXCIsMyE9YSl0aHJvd1wiRXhwZWN0ZWQgbGVuZ3RoIGZvciBzZXRUZW1wbyBldmVudCBpcyAzLCBnb3QgXCIrYTtyZXR1cm4gZS5taWNyb3NlY29uZHNQZXJCZWF0PSh0LnJlYWRJbnQ4KCk8PDE2KSsodC5yZWFkSW50OCgpPDw4KSt0LnJlYWRJbnQ4KCksZTtjYXNlIDg0OmlmKGUuc3VidHlwZT1cInNtcHRlT2Zmc2V0XCIsNSE9YSl0aHJvd1wiRXhwZWN0ZWQgbGVuZ3RoIGZvciBzbXB0ZU9mZnNldCBldmVudCBpcyA1LCBnb3QgXCIrYTt2YXIgbz10LnJlYWRJbnQ4KCk7cmV0dXJuIGUuZnJhbWVSYXRlPXswOjI0LDMyOjI1LDY0OjI5LDk2OjMwfVs5NiZvXSxlLmhvdXI9MzEmbyxlLm1pbj10LnJlYWRJbnQ4KCksZS5zZWM9dC5yZWFkSW50OCgpLGUuZnJhbWU9dC5yZWFkSW50OCgpLGUuc3ViZnJhbWU9dC5yZWFkSW50OCgpLGU7Y2FzZSA4ODppZihlLnN1YnR5cGU9XCJ0aW1lU2lnbmF0dXJlXCIsNCE9YSl0aHJvd1wiRXhwZWN0ZWQgbGVuZ3RoIGZvciB0aW1lU2lnbmF0dXJlIGV2ZW50IGlzIDQsIGdvdCBcIithO3JldHVybiBlLm51bWVyYXRvcj10LnJlYWRJbnQ4KCksZS5kZW5vbWluYXRvcj1NYXRoLnBvdygyLHQucmVhZEludDgoKSksZS5tZXRyb25vbWU9dC5yZWFkSW50OCgpLGUudGhpcnR5c2Vjb25kcz10LnJlYWRJbnQ4KCksZTtjYXNlIDg5OmlmKGUuc3VidHlwZT1cImtleVNpZ25hdHVyZVwiLDIhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3Iga2V5U2lnbmF0dXJlIGV2ZW50IGlzIDIsIGdvdCBcIithO3JldHVybiBlLmtleT10LnJlYWRJbnQ4KCEwKSxlLnNjYWxlPXQucmVhZEludDgoKSxlO2Nhc2UgMTI3OnJldHVybiBlLnN1YnR5cGU9XCJzZXF1ZW5jZXJTcGVjaWZpY1wiLGUuZGF0YT10LnJlYWQoYSksZTtkZWZhdWx0OnJldHVybiBlLnN1YnR5cGU9XCJ1bmtub3duXCIsZS5kYXRhPXQucmVhZChhKSxlfXJldHVybiBlLmRhdGE9dC5yZWFkKGEpLGV9aWYoMjQwPT1uKXtlLnR5cGU9XCJzeXNFeFwiO3ZhciBhPXQucmVhZFZhckludCgpO3JldHVybiBlLmRhdGE9dC5yZWFkKGEpLGV9aWYoMjQ3PT1uKXtlLnR5cGU9XCJkaXZpZGVkU3lzRXhcIjt2YXIgYT10LnJlYWRWYXJJbnQoKTtyZXR1cm4gZS5kYXRhPXQucmVhZChhKSxlfXRocm93XCJVbnJlY29nbmlzZWQgTUlESSBldmVudCB0eXBlIGJ5dGU6IFwiK259dmFyIHM7MD09KDEyOCZuKT8ocz1uLG49aSk6KHM9dC5yZWFkSW50OCgpLGk9bik7dmFyIHU9bj4+NDtzd2l0Y2goZS5jaGFubmVsPTE1Jm4sZS50eXBlPVwiY2hhbm5lbFwiLHUpe2Nhc2UgODpyZXR1cm4gZS5zdWJ0eXBlPVwibm90ZU9mZlwiLGUubm90ZU51bWJlcj1zLGUudmVsb2NpdHk9dC5yZWFkSW50OCgpLGU7Y2FzZSA5OnJldHVybiBlLm5vdGVOdW1iZXI9cyxlLnZlbG9jaXR5PXQucmVhZEludDgoKSwwPT1lLnZlbG9jaXR5P2Uuc3VidHlwZT1cIm5vdGVPZmZcIjplLnN1YnR5cGU9XCJub3RlT25cIixlO2Nhc2UgMTA6cmV0dXJuIGUuc3VidHlwZT1cIm5vdGVBZnRlcnRvdWNoXCIsZS5ub3RlTnVtYmVyPXMsZS5hbW91bnQ9dC5yZWFkSW50OCgpLGU7Y2FzZSAxMTpyZXR1cm4gZS5zdWJ0eXBlPVwiY29udHJvbGxlclwiLGUuY29udHJvbGxlclR5cGU9cyxlLnZhbHVlPXQucmVhZEludDgoKSxlO2Nhc2UgMTI6cmV0dXJuIGUuc3VidHlwZT1cInByb2dyYW1DaGFuZ2VcIixlLnByb2dyYW1OdW1iZXI9cyxlO2Nhc2UgMTM6cmV0dXJuIGUuc3VidHlwZT1cImNoYW5uZWxBZnRlcnRvdWNoXCIsZS5hbW91bnQ9cyxlO2Nhc2UgMTQ6cmV0dXJuIGUuc3VidHlwZT1cInBpdGNoQmVuZFwiLGUudmFsdWU9cysodC5yZWFkSW50OCgpPDw3KSxlO2RlZmF1bHQ6dGhyb3dcIlVucmVjb2duaXNlZCBNSURJIGV2ZW50IHR5cGU6IFwiK3V9fXZhciBpO3N0cmVhbT1yKHQpO3ZhciBhPWUoc3RyZWFtKTtpZihcIk1UaGRcIiE9YS5pZHx8NiE9YS5sZW5ndGgpdGhyb3dcIkJhZCAubWlkIGZpbGUgLSBoZWFkZXIgbm90IGZvdW5kXCI7dmFyIG89cihhLmRhdGEpLHM9by5yZWFkSW50MTYoKSx1PW8ucmVhZEludDE2KCksYz1vLnJlYWRJbnQxNigpO2lmKDMyNzY4JmMpdGhyb3dcIkV4cHJlc3NpbmcgdGltZSBkaXZpc2lvbiBpbiBTTVRQRSBmcmFtZXMgaXMgbm90IHN1cHBvcnRlZCB5ZXRcIjt0aWNrc1BlckJlYXQ9Yztmb3IodmFyIGg9e2Zvcm1hdFR5cGU6cyx0cmFja0NvdW50OnUsdGlja3NQZXJCZWF0OnRpY2tzUGVyQmVhdH0sZj1bXSxkPTA7ZDxoLnRyYWNrQ291bnQ7ZCsrKXtmW2RdPVtdO3ZhciBsPWUoc3RyZWFtKTtpZihcIk1UcmtcIiE9bC5pZCl0aHJvd1wiVW5leHBlY3RlZCBjaHVuayAtIGV4cGVjdGVkIE1UcmssIGdvdCBcIitsLmlkO2Zvcih2YXIgcD1yKGwuZGF0YSk7IXAuZW9mKCk7KXt2YXIgbT1uKHApO2ZbZF0ucHVzaChtKX19cmV0dXJue2hlYWRlcjpoLHRyYWNrczpmfX1mdW5jdGlvbiByKHQpe2Z1bmN0aW9uIGUoZSl7dmFyIG49dC5zdWJzdHIocyxlKTtyZXR1cm4gcys9ZSxufWZ1bmN0aW9uIG4oKXt2YXIgZT0odC5jaGFyQ29kZUF0KHMpPDwyNCkrKHQuY2hhckNvZGVBdChzKzEpPDwxNikrKHQuY2hhckNvZGVBdChzKzIpPDw4KSt0LmNoYXJDb2RlQXQocyszKTtyZXR1cm4gcys9NCxlfWZ1bmN0aW9uIHIoKXt2YXIgZT0odC5jaGFyQ29kZUF0KHMpPDw4KSt0LmNoYXJDb2RlQXQocysxKTtyZXR1cm4gcys9MixlfWZ1bmN0aW9uIGkoZSl7dmFyIG49dC5jaGFyQ29kZUF0KHMpO3JldHVybiBlJiZuPjEyNyYmKG4tPTI1Nikscys9MSxufWZ1bmN0aW9uIGEoKXtyZXR1cm4gcz49dC5sZW5ndGh9ZnVuY3Rpb24gbygpe2Zvcih2YXIgdD0wOzspe3ZhciBlPWkoKTtpZighKDEyOCZlKSlyZXR1cm4gdCtlO3QrPTEyNyZlLHQ8PD03fX12YXIgcz0wO3JldHVybntlb2Y6YSxyZWFkOmUscmVhZEludDMyOm4scmVhZEludDE2OnIscmVhZEludDg6aSxyZWFkVmFySW50Om99fXQuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gbih0KX19LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiB0LndlYnBhY2tQb2x5ZmlsbHx8KHQuZGVwcmVjYXRlPWZ1bmN0aW9uKCl7fSx0LnBhdGhzPVtdLHQuY2hpbGRyZW49W10sdC53ZWJwYWNrUG9seWZpbGw9MSksdH19XSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU1pZGlDb252ZXJ0LmpzLm1hcCJdfQ==
