(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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
                onChange: function onChange(data) {
                    jon.trombone.SetMute(data);
                }
            });

            // Jon folder
            this.panel.Register({ type: "folder", label: "Jon" });
            this.panel.Register([{ type: "checkbox", label: "Move Jaw", object: jon, property: "moveJaw" }, { type: "range", label: "Jaw Speed", object: jon, property: "jawFlapSpeed", min: 0, max: 100 }, { type: "range", label: "Jaw Range", object: jon, property: "jawOpenOffset", min: 0, max: 1 }], { folder: "Jon" });

            // Voice folder
            this.panel.Register({ type: "folder", label: "Voice" });
            this.panel.Register([{ type: "checkbox", label: "Wobble", object: jon.trombone, property: "autoWobble" }, { type: "checkbox", label: "Pitch Variance", object: jon.trombone.voices[0].glottis, property: "addPitchVariance" }, { type: "checkbox", label: "Tenseness Variance", object: jon.trombone.voices[0].glottis, property: "addTensenessVariance" }, { type: "range", label: "Tenseness", object: jon.trombone.voices[0].glottis, property: "UITenseness", min: 0, max: 1 }, { type: "range", label: "Vibrato", object: jon.trombone.voices[0].glottis, property: "vibratoAmount", min: 0, max: 0.5 }, { type: "range", label: "Frequency", object: jon.trombone.voices[0].glottis, property: "UIFrequency", min: 1, max: 1000, step: 1 }, { type: "range", label: "Loudness", object: jon.trombone.voices[0].glottis, property: "loudness", min: 0, max: 1 }], { folder: "Voice" });

            // Tract folder
            this.panel.Register({ type: "folder", label: "Tract" });
            this.panel.Register([{ type: "range", label: "Move Speed", object: jon.trombone.voices[0].tract, property: "movementSpeed", min: 1, max: 30, step: 1 }, { type: "range", label: "Velum Target", object: jon.trombone.voices[0].tract, property: "velumTarget", min: 0.001, max: 2 }, { type: "range", label: "Target", object: jon.trombone.voices[0].tractUI, property: "target", min: 0.001, max: 1 }, { type: "range", label: "Index", object: jon.trombone.voices[0].tractUI, property: "index", min: 0, max: 43, step: 1 }, { type: "range", label: "Radius", object: jon.trombone.voices[0].tractUI, property: "radius", min: 0, max: 5, step: 1 }], { folder: "Tract" });

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

                var notes = this.midiController.GetPitches();
                if (notes != this.lastNotes) {
                    // Do the note
                    if (notes !== undefined) {
                        //&& notes.length != 0){ 
                        // Note on
                        // Play frequency
                        for (var i = 0; i < this.trombone.voices.length; i++) {
                            if (i >= notes.length) {
                                if (!this.legato) this.trombone.voices[i].glottis.loudness = 0;
                                if (this.moveJaw) this.trombone.voices[i].tractUI.SetLipsClosed(1);
                                continue;
                            }

                            this.trombone.voices[i].glottis.UIFrequency = this.midiController.MIDIToFrequency(notes[i].midi);
                            this.trombone.voices[i].glottis.loudness = notes[i].velocity;

                            if (this.moveJaw) this.trombone.voices[i].tractUI.SetLipsClosed(0);
                        }
                        // let note = notes[0];
                        // if(notes.length > 1){
                        //     //console.log ("chord");
                        // }
                        // let freq = this.midiController.MIDIToFrequency(note.midi);
                        // //console.log(freq);
                        // this.trombone.glottis.UIFrequency = freq;
                        // this.trombone.glottis.loudness = note.velocity;
                        // Open jaw
                        if (this.moveJaw) this.jaw.position.z = this.jawShutZ + this.jawOpenOffset;
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = this.trombone.voices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var voice = _step.value;

                                if (this.moveJaw) voice.tractUI.SetLipsClosed(0);
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
                    }

                    if (notes.length == 0) {
                        if (this.moveJaw) this.jaw.position.z = this.jawShutZ;
                    }
                    // else { 
                    //     // Note off
                    //     if (!this.legato) this.trombone.glottis.loudness = 0;
                    //     // Close jaw
                    //     this.jaw.position.z = this.jawShutZ;
                    //     // this.trombone.tractUI.SetLipsClosed(1);

                    // }

                    this.lastNotes = notes;
                }
            }

            if (this.jaw && this.moveJaw && (!this.midiController.playing || this.flapWhileSinging)) {
                var time = this.clock.getElapsedTime(); // % 60;

                // Move the jaw
                var percent = (Math.sin(time * this.jawFlapSpeed) + 1.0) / 2.0;
                this.jaw.position.z = this.jawShutZ + percent * this.jawOpenOffset;

                // Make the audio match the jaw position
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.trombone.voices[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _voice = _step2.value;

                        _voice.tractUI.SetLipsClosed(1.0 - percent);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
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

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.controller.trombone.voices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var voice = _step.value;

                    var voiceBackup = {};

                    voiceBackup["addPitchVariance"] = voice.glottis.addPitchVariance;
                    voice.glottis.addPitchVariance = false;

                    voiceBackup["addTensenessVariance"] = voice.glottis.addTensenessVariance;
                    voice.glottis.addTensenessVariance = false;

                    voiceBackup["vibratoFrequency"] = voice.glottis.vibratoFrequency;
                    voice.glottis.vibratoFrequency = 0;

                    voiceBackup["frequency"] = voice.glottis.UIFrequency;

                    voiceBackup["loudness"] = voice.glottis.loudness;
                    voice.glottis.loudness = 0;

                    this.backup_settings["" + voice.id] = voiceBackup;
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

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.controller.trombone.voices[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var voice = _step2.value;

                    var backup = this.backup_settings["" + voice.id];
                    voice.glottis.addPitchVariance = backup["addPitchVariance"];
                    voice.glottis.addTensenessVariance = backup["addTensenessVariance"];
                    voice.glottis.vibratoFrequency = backup["vibratoFrequency"];
                    voice.glottis.UIFrequency = backup["frequency"];
                    voice.glottis.loudness = backup["loudness"];
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

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
            this.sampleRate = this.audioContext.sampleRate;

            this.blockTime = this.blockLength / this.sampleRate;

            this.processors = [];
        }
    }, {
        key: "startSound",
        value: function startSound() {
            var _this = this;

            var _loop = function _loop(i) {
                //scriptProcessor may need a dummy input channel on iOS
                var scriptProcessor = _this.audioContext.createScriptProcessor(_this.blockLength, 2, 1);
                scriptProcessor.connect(_this.audioContext.destination);
                scriptProcessor.onaudioprocess = function (e) {
                    _this.doScriptProcessor(e, i);
                };

                whiteNoise = _this.createWhiteNoiseNode(2 * _this.sampleRate); // 2 seconds of noise

                aspirateFilter = _this.audioContext.createBiquadFilter();

                aspirateFilter.type = "bandpass";
                aspirateFilter.frequency.value = 500;
                aspirateFilter.Q.value = 0.5;
                whiteNoise.connect(aspirateFilter); // Use white noise as input for filter
                aspirateFilter.connect(scriptProcessor); // Use this as input 0 for script processor

                fricativeFilter = _this.audioContext.createBiquadFilter();

                fricativeFilter.type = "bandpass";
                fricativeFilter.frequency.value = 1000;
                fricativeFilter.Q.value = 0.5;
                whiteNoise.connect(fricativeFilter); // Use white noise as input
                fricativeFilter.connect(scriptProcessor); // Use this as input 1 for script processor

                whiteNoise.start(0);
                _this.processors.push(scriptProcessor);
            };

            for (var i = 0; i < this.trombone.voices.length; i++) {
                var whiteNoise;
                var aspirateFilter;
                var fricativeFilter;

                _loop(i);
            }
        }
    }, {
        key: "createWhiteNoiseNode",
        value: function createWhiteNoiseNode(frameCount) {
            var myArrayBuffer = this.audioContext.createBuffer(1, frameCount, this.sampleRate);

            var nowBuffering = myArrayBuffer.getChannelData(0);
            for (var i = 0; i < frameCount; i++) {
                nowBuffering[i] = Math.random(); // gaussian();
            }

            var source = this.audioContext.createBufferSource();
            source.buffer = myArrayBuffer;
            source.loop = true;

            return source;
        }
    }, {
        key: "doScriptProcessor",
        value: function doScriptProcessor(event, index) {
            var inputArray1 = event.inputBuffer.getChannelData(0); // Glottis input
            var inputArray2 = event.inputBuffer.getChannelData(1); // Tract input
            var outArray = event.outputBuffer.getChannelData(0); // Output (mono)

            var voice = this.trombone.voices[index];

            var N = outArray.length;
            for (var j = 0; j < N; j++) {
                var lambda1 = j / N; // Goes from 0 to 1
                var lambda2 = (j + 0.5) / N;
                var glottalOutput = voice.glottis.runStep(lambda1, inputArray1[j]);

                var vocalOutput = 0;
                //Tract runs at twice the sample rate 
                voice.tract.runStep(glottalOutput, inputArray2[j], lambda1);
                vocalOutput += voice.tract.lipOutput + voice.tract.noseOutput;
                voice.tract.runStep(glottalOutput, inputArray2[j], lambda2);
                vocalOutput += voice.tract.lipOutput + voice.tract.noseOutput;
                outArray[j] = vocalOutput * 0.125;

                // Solves background hissing problem but introduces popping.
                //if(voice.glottis.loudness == 0) outArray[j] = 0;
            }

            voice.glottis.finishBlock();
            voice.tract.finishBlock();
        }
    }, {
        key: "mute",
        value: function mute() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.processors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var processor = _step.value;

                    processor.disconnect();
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
        }
    }, {
        key: "unmute",
        value: function unmute() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.processors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var processor = _step2.value;

                    processor.connect(this.audioContext.destination);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
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
            var timeStep = 1.0 / this.trombone.audioSystem.sampleRate;
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

        /// Queues up a single wave?

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
    function TractUI(trombone, tract) {
        _classCallCheck(this, TractUI);

        this.trombone = trombone;
        this.tract = tract;

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
            var Tract = this.tract;

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
            var Tract = this.tract;

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
            var Tract = this.tract;

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

            var Tract = this.tract;

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
    function Tract(trombone, glottis) {
        _classCallCheck(this, Tract);

        this.trombone = trombone;
        this.glottis = glottis;

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
            this.reshapeTract(this.trombone.audioSystem.blockTime);
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
                trans.timeAlive += 1.0 / (this.trombone.audioSystem.sampleRate * 2);
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
            turbulenceNoise *= this.glottis.getNoiseModulator();
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
exports.Voice = exports.PinkTrombone = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("./math-extensions.js");

var _audioSystem = require("./components/audio-system.js");

var _glottis = require("./components/glottis.js");

var _tract = require("./components/tract.js");

var _tractUi = require("./components/tract-ui.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Voice = function Voice(trombone, id) {
    _classCallCheck(this, Voice);

    this.id = id;

    this.glottis = new _glottis.Glottis(trombone);
    this.glottis.init();

    this.tract = new _tract.Tract(trombone, this.glottis);
    this.tract.init();

    this.tractUI = new _tractUi.TractUI(trombone, this.tract);
    this.tractUI.init();
};

var PinkTrombone = function () {
    function PinkTrombone(controller) {
        _classCallCheck(this, PinkTrombone);

        this.controller = controller;

        this.time = 0;
        this.alwaysVoice = true;
        this.autoWobble = true;
        this.noiseFreq = 500;
        this.noiseQ = 0.7;

        this.voices = [];
        for (var i = 0; i < 8; i++) {
            var voice = new Voice(this, i);
            voice.glottis.loudness = i == 0 ? 1 : 0;
            this.voices.push(voice);
        }

        this.audioSystem = new _audioSystem.AudioSystem(this);
        this.audioSystem.init();

        //this.StartAudio();
        //this.SetMute(true);

        this.muted = false;
    }

    _createClass(PinkTrombone, [{
        key: "StartAudio",
        value: function StartAudio() {
            this.muted = false;
            this.audioSystem.startSound();
        }
    }, {
        key: "SetMute",
        value: function SetMute(doMute) {
            doMute ? this.audioSystem.mute() : this.audioSystem.unmute();
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
exports.Voice = Voice;

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
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.MidiConvert=e():t.MidiConvert=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=7)}([function(t,e,n){"use strict";n.d(e,"a",function(){return r}),n.d(e,"b",function(){return i}),n.d(e,"c",function(){return a});var r=["acoustic grand piano","bright acoustic piano","electric grand piano","honky-tonk piano","electric piano 1","electric piano 2","harpsichord","clavi","celesta","glockenspiel","music box","vibraphone","marimba","xylophone","tubular bells","dulcimer","drawbar organ","percussive organ","rock organ","church organ","reed organ","accordion","harmonica","tango accordion","acoustic guitar (nylon)","acoustic guitar (steel)","electric guitar (jazz)","electric guitar (clean)","electric guitar (muted)","overdriven guitar","distortion guitar","guitar harmonics","acoustic bass","electric bass (finger)","electric bass (pick)","fretless bass","slap bass 1","slap bass 2","synth bass 1","synth bass 2","violin","viola","cello","contrabass","tremolo strings","pizzicato strings","orchestral harp","timpani","string ensemble 1","string ensemble 2","synthstrings 1","synthstrings 2","choir aahs","voice oohs","synth voice","orchestra hit","trumpet","trombone","tuba","muted trumpet","french horn","brass section","synthbrass 1","synthbrass 2","soprano sax","alto sax","tenor sax","baritone sax","oboe","english horn","bassoon","clarinet","piccolo","flute","recorder","pan flute","blown bottle","shakuhachi","whistle","ocarina","lead 1 (square)","lead 2 (sawtooth)","lead 3 (calliope)","lead 4 (chiff)","lead 5 (charang)","lead 6 (voice)","lead 7 (fifths)","lead 8 (bass + lead)","pad 1 (new age)","pad 2 (warm)","pad 3 (polysynth)","pad 4 (choir)","pad 5 (bowed)","pad 6 (metallic)","pad 7 (halo)","pad 8 (sweep)","fx 1 (rain)","fx 2 (soundtrack)","fx 3 (crystal)","fx 4 (atmosphere)","fx 5 (brightness)","fx 6 (goblins)","fx 7 (echoes)","fx 8 (sci-fi)","sitar","banjo","shamisen","koto","kalimba","bag pipe","fiddle","shanai","tinkle bell","agogo","steel drums","woodblock","taiko drum","melodic tom","synth drum","reverse cymbal","guitar fret noise","breath noise","seashore","bird tweet","telephone ring","helicopter","applause","gunshot"],i=["piano","chromatic percussion","organ","guitar","bass","strings","ensemble","brass","reed","pipe","synth lead","synth pad","synth effects","ethnic","percussive","sound effects"],a={0:"standard kit",8:"room kit",16:"power kit",24:"electronic kit",25:"tr-808 kit",32:"jazz kit",40:"brush kit",48:"orchestra kit",56:"sound fx kit"}},function(t,e,n){"use strict";function r(t){return t.replace(/\u0000/g,"")}function i(t,e){return 60/e.bpm*(t/e.PPQ)}function a(t){return"number"==typeof t}function o(t){return"string"==typeof t}function s(t){return["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][t%12]+(Math.floor(t/12)-1)}e.b=r,e.a=i,e.c=a,n.d(e,"d",function(){return u}),e.e=s,n.d(e,"f",function(){return c});var u=function(){var t=/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i;return function(e){return o(e)&&t.test(e)}}(),c=function(){var t=/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,e={cbb:-2,cb:-1,c:0,"c#":1,cx:2,dbb:0,db:1,d:2,"d#":3,dx:4,ebb:2,eb:3,e:4,"e#":5,ex:6,fbb:3,fb:4,f:5,"f#":6,fx:7,gbb:5,gb:6,g:7,"g#":8,gx:9,abb:7,ab:8,a:9,"a#":10,ax:11,bbb:9,bb:10,b:11,"b#":12,bx:13};return function(n){var r=t.exec(n),i=r[1],a=r[2];return e[i.toLowerCase()]+12*(parseInt(a)+1)}}()},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.d(e,"a",function(){return h});var i=n(11),a=(n.n(i),n(10)),o=(n.n(a),n(1)),s=n(9),u=n(5),c=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),h=function(){function t(){r(this,t),this.header={bpm:120,timeSignature:[4,4],PPQ:480},this.tracks=[]}return c(t,null,[{key:"fromJSON",value:function(e){var n=new t;return n.header=e.header,e.tracks.forEach(function(t){var e=s.a.fromJSON(t);n.tracks.push(e)}),n}}]),c(t,[{key:"load",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET";return new Promise(function(i,a){var o=new XMLHttpRequest;o.open(r,t),o.responseType="arraybuffer",o.addEventListener("load",function(){4===o.readyState&&200===o.status?i(e.decode(o.response)):a(o.status)}),o.addEventListener("error",a),o.send(n)}).catch(function(t){console.log(t)})}},{key:"decode",value:function(t){var e=this;if(t instanceof ArrayBuffer){var r=new Uint8Array(t);t=String.fromCharCode.apply(null,r)}var a=i(t);return this.header=n.i(u.a)(a),this.tracks=[],a.tracks.forEach(function(t,n){var r=new s.a;r.id=n,e.tracks.push(r);var i=0;t.forEach(function(t){i+=o.a(t.deltaTime,e.header),"meta"===t.type&&"trackName"===t.subtype?r.name=o.b(t.text):"noteOn"===t.subtype?(r.noteOn(t.noteNumber,i,t.velocity/127),-1===r.channelNumber&&(r.channelNumber=t.channel)):"noteOff"===t.subtype?r.noteOff(t.noteNumber,i):"controller"===t.subtype&&t.controllerType?r.cc(t.controllerType,i,t.value/127):"meta"===t.type&&"instrumentName"===t.subtype?r.instrument=t.text:"channel"===t.type&&"programChange"===t.subtype&&(r.patch(t.programNumber),r.channelNumber=t.channel)}),e.header.name||r.length||!r.name||(e.header.name=r.name)}),this}},{key:"encode",value:function(){var t=this,e=new a.File({ticks:this.header.PPQ}),n=this.tracks.filter(function(t){return!t.length})[0];if(this.header.name&&(!n||n.name!==this.header.name)){e.addTrack().addEvent(new a.MetaEvent({time:0,type:a.MetaEvent.TRACK_NAME,data:this.header.name}))}return this.tracks.forEach(function(n){var r=e.addTrack();r.setTempo(t.bpm),n.name&&r.addEvent(new a.MetaEvent({time:0,type:a.MetaEvent.TRACK_NAME,data:n.name})),n.encode(r,t.header)}),e.toBytes()}},{key:"toArray",value:function(){for(var t=this.encode(),e=new Array(t.length),n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e}},{key:"toJSON",value:function(){var t={header:this.header,startTime:this.startTime,duration:this.duration,tracks:(this.tracks||[]).map(function(t){return t.toJSON()})};return t.header.name||(t.header.name=""),t}},{key:"track",value:function(t){var e=new s.a(t);return this.tracks.push(e),e}},{key:"get",value:function(t){return o.c(t)?this.tracks[t]:this.tracks.find(function(e){return e.name===t})}},{key:"slice",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.duration,r=new t;return r.header=this.header,r.tracks=this.tracks.map(function(t){return t.slice(e,n)}),r}},{key:"startTime",get:function(){var t=this.tracks.map(function(t){return t.startTime});return t.length?Math.min.apply(Math,t)||0:0}},{key:"bpm",get:function(){return this.header.bpm},set:function(t){var e=this.header.bpm;this.header.bpm=t;var n=e/t;this.tracks.forEach(function(t){return t.scale(n)})}},{key:"timeSignature",get:function(){return this.header.timeSignature},set:function(t){this.header.timeSignature=t}},{key:"duration",get:function(){var t=this.tracks.map(function(t){return t.duration});return t.length?Math.max.apply(Math,t)||0:0}}]),t}()},function(t,e,n){"use strict";function r(t,e){var n=0,r=t.length,i=r;if(r>0&&t[r-1].time<=e)return r-1;for(;n<i;){var a=Math.floor(n+(i-n)/2),o=t[a],s=t[a+1];if(o.time===e){for(var u=a;u<t.length;u++){t[u].time===e&&(a=u)}return a}if(o.time<e&&s.time>e)return a;o.time>e?i=a:o.time<e&&(n=a+1)}return-1}function i(t,e){if(t.length){var n=r(t,e.time);t.splice(n+1,0,e)}else t.push(e)}n.d(e,"a",function(){return i})},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.d(e,"a",function(){return o});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),a={1:"modulationWheel",2:"breath",4:"footController",5:"portamentoTime",7:"volume",8:"balance",10:"pan",64:"sustain",65:"portamentoTime",66:"sostenuto",67:"softPedal",68:"legatoFootswitch",84:"portamentoContro"},o=function(){function t(e,n,i){r(this,t),this.number=e,this.time=n,this.value=i}return i(t,[{key:"name",get:function(){if(a.hasOwnProperty(this.number))return a[this.number]}}]),t}()},function(t,e,n){"use strict";function r(t){for(var e={PPQ:t.header.ticksPerBeat},n=0;n<t.tracks.length;n++)for(var r=t.tracks[n],i=0;i<r.length;i++){var a=r[i];"meta"===a.type&&("timeSignature"===a.subtype?e.timeSignature=[a.numerator,a.denominator]:"setTempo"===a.subtype&&(e.bpm||(e.bpm=6e7/a.microsecondsPerBeat)))}return e.bpm=e.bpm||120,e}n.d(e,"a",function(){return r})},function(t,e,n){"use strict";function r(t,e){for(var n=0;n<t.length;n++){var r=t[n],i=e[n];if(r.length>i)return!0}return!1}function i(t,e,n){for(var r=0,i=1/0,a=0;a<t.length;a++){var o=t[a],s=e[a];o[s]&&o[s].time<i&&(r=a,i=o[s].time)}n[r](t[r][e[r]]),e[r]+=1}function a(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];for(var a=e.filter(function(t,e){return e%2==0}),o=new Uint32Array(a.length),s=e.filter(function(t,e){return e%2==1});r(a,o);)i(a,o,s)}n.d(e,"a",function(){return a})},function(t,e,n){"use strict";function r(t){return(new s.a).decode(t)}function i(t,e){var n=(new s.a).load(t);return e&&n.then(e),n}function a(){return new s.a}function o(t){return s.a.fromJSON(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.parse=r,e.load=i,e.create=a,e.fromJSON=o;var s=n(2),u=n(0);n.d(e,"instrumentByPatchID",function(){return u.a}),n.d(e,"instrumentFamilyByID",function(){return u.b}),n.d(e,"drumKitByPatchID",function(){return u.c})},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.d(e,"a",function(){return o});var i=n(1),a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=function(){function t(e,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;if(r(this,t),i.c(e))this.midi=e;else{if(!i.d(e))throw new Error("the midi value must either be in Pitch Notation (e.g. C#4) or a midi value");this.name=e}this.time=n,this.duration=a,this.velocity=o}return a(t,null,[{key:"fromJSON",value:function(e){return new t(e.midi,e.time,e.duration,e.velocity)}}]),a(t,[{key:"match",value:function(t){return i.c(t)?this.midi===t:i.d(t)?this.name.toLowerCase()===t.toLowerCase():void 0}},{key:"toJSON",value:function(){return{name:this.name,midi:this.midi,time:this.time,velocity:this.velocity,duration:this.duration}}},{key:"name",get:function(){return i.e(this.midi)},set:function(t){this.midi=i.f(t)}},{key:"noteOn",get:function(){return this.time},set:function(t){this.time=t}},{key:"noteOff",get:function(){return this.time+this.duration},set:function(t){this.duration=t-this.time}}]),t}()},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.d(e,"a",function(){return h});var i=n(3),a=n(4),o=n(6),s=n(8),u=n(0),c=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),h=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:-1;r(this,t),this.name=e,this.channelNumber=i,this.notes=[],this.controlChanges={},this.instrumentNumber=n}return c(t,null,[{key:"fromJSON",value:function(e){var n=new t(e.name,e.instrumentNumber,e.channelNumber);return n.id=e.id,e.notes&&e.notes.forEach(function(t){var e=s.a.fromJSON(t);n.notes.push(e)}),e.controlChanges&&(n.controlChanges=e.controlChanges),n}}]),c(t,[{key:"note",value:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,o=new s.a(t,e,r,a);return n.i(i.a)(this.notes,o),this}},{key:"noteOn",value:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,a=new s.a(t,e,0,r);return n.i(i.a)(this.notes,a),this}},{key:"noteOff",value:function(t,e){for(var n=0;n<this.notes.length;n++){var r=this.notes[n];if(r.match(t)&&0===r.duration){r.noteOff=e;break}}return this}},{key:"cc",value:function(t,e,r){this.controlChanges.hasOwnProperty(t)||(this.controlChanges[t]=[]);var o=new a.a(t,e,r);return n.i(i.a)(this.controlChanges[t],o),this}},{key:"patch",value:function(t){return this.instrumentNumber=t,this}},{key:"channel",value:function(t){return this.channelNumber=t,this}},{key:"scale",value:function(t){return this.notes.forEach(function(e){e.time*=t,e.duration*=t}),this}},{key:"slice",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.duration,r=Math.max(this.notes.findIndex(function(t){return t.time>=e}),0),i=this.notes.findIndex(function(t){return t.noteOff>=n})+1,a=new t(this.name);return a.notes=this.notes.slice(r,i),a.notes.forEach(function(t){return t.time=t.time-e}),a}},{key:"encode",value:function(t,e){function r(t){var e=Math.floor(i*t),n=Math.max(e-a,0);return a=e,n}var i=e.PPQ/(60/e.bpm),a=0,s=Math.max(0,this.channelNumber);-1!==this.instrumentNumber&&t.instrument(s,this.instrumentNumber),n.i(o.a)(this.noteOns,function(e){t.addNoteOn(s,e.name,r(e.time),Math.floor(127*e.velocity))},this.noteOffs,function(e){t.addNoteOff(s,e.name,r(e.time))})}},{key:"toJSON",value:function(){var t={startTime:this.startTime,duration:this.duration,length:this.length,notes:[],controlChanges:{}};return void 0!==this.id&&(t.id=this.id),t.name=this.name,-1!==this.instrumentNumber&&(t.instrumentNumber=this.instrumentNumber,t.instrument=this.instrument,t.instrumentFamily=this.instrumentFamily),-1!==this.channelNumber&&(t.channelNumber=this.channelNumber,t.isPercussion=this.isPercussion),this.notes.length&&(t.notes=this.notes.map(function(t){return t.toJSON()})),Object.keys(this.controlChanges).length&&(t.controlChanges=this.controlChanges),t}},{key:"noteOns",get:function(){var t=[];return this.notes.forEach(function(e){t.push({time:e.noteOn,midi:e.midi,name:e.name,velocity:e.velocity})}),t}},{key:"noteOffs",get:function(){var t=[];return this.notes.forEach(function(e){t.push({time:e.noteOff,midi:e.midi,name:e.name})}),t}},{key:"length",get:function(){return this.notes.length}},{key:"startTime",get:function(){if(this.notes.length){return this.notes[0].noteOn}return 0}},{key:"duration",get:function(){if(this.notes.length){return this.notes[this.notes.length-1].noteOff}return 0}},{key:"instrument",get:function(){return this.isPercussion?u.c[this.instrumentNumber]:u.a[this.instrumentNumber]},set:function(t){var e=u.a.indexOf(t);-1!==e&&(this.instrumentNumber=e)}},{key:"isPercussion",get:function(){return[9,10].includes(this.channelNumber)}},{key:"instrumentFamily",get:function(){return this.isPercussion?"drums":u.b[Math.floor(this.instrumentNumber/8)]}}]),t}()},function(t,e,n){(function(t){var n={};!function(t){var e=t.DEFAULT_VOLUME=90,n=(t.DEFAULT_DURATION=128,t.DEFAULT_CHANNEL=0,{midi_letter_pitches:{a:21,b:23,c:12,d:14,e:16,f:17,g:19},midiPitchFromNote:function(t){var e=/([a-g])(#+|b+)?([0-9]+)$/i.exec(t),r=e[1].toLowerCase(),i=e[2]||"";return 12*parseInt(e[3],10)+n.midi_letter_pitches[r]+("#"==i.substr(0,1)?1:-1)*i.length},ensureMidiPitch:function(t){return"number"!=typeof t&&/[^0-9]/.test(t)?n.midiPitchFromNote(t):parseInt(t,10)},midi_pitches_letter:{12:"c",13:"c#",14:"d",15:"d#",16:"e",17:"f",18:"f#",19:"g",20:"g#",21:"a",22:"a#",23:"b"},midi_flattened_notes:{"a#":"bb","c#":"db","d#":"eb","f#":"gb","g#":"ab"},noteFromMidiPitch:function(t,e){var r,i=0,a=t,e=e||!1;return t>23&&(i=Math.floor(t/12)-1,a=t-12*i),r=n.midi_pitches_letter[a],e&&r.indexOf("#")>0&&(r=n.midi_flattened_notes[r]),r+i},mpqnFromBpm:function(t){var e=Math.floor(6e7/t),n=[];do{n.unshift(255&e),e>>=8}while(e);for(;n.length<3;)n.push(0);return n},bpmFromMpqn:function(t){var e=t;if(void 0!==t[0]){e=0;for(var n=0,r=t.length-1;r>=0;++n,--r)e|=t[n]<<r}return Math.floor(6e7/t)},codes2Str:function(t){return String.fromCharCode.apply(null,t)},str2Bytes:function(t,e){if(e)for(;t.length/2<e;)t="0"+t;for(var n=[],r=t.length-1;r>=0;r-=2){var i=0===r?t[r]:t[r-1]+t[r];n.unshift(parseInt(i,16))}return n},translateTickTime:function(t){for(var e=127&t;t>>=7;)e<<=8,e|=127&t|128;for(var n=[];;){if(n.push(255&e),!(128&e))break;e>>=8}return n}}),r=function(t){if(!this)return new r(t);!t||null===t.type&&void 0===t.type||null===t.channel&&void 0===t.channel||null===t.param1&&void 0===t.param1||(this.setTime(t.time),this.setType(t.type),this.setChannel(t.channel),this.setParam1(t.param1),this.setParam2(t.param2))};r.NOTE_OFF=128,r.NOTE_ON=144,r.AFTER_TOUCH=160,r.CONTROLLER=176,r.PROGRAM_CHANGE=192,r.CHANNEL_AFTERTOUCH=208,r.PITCH_BEND=224,r.prototype.setTime=function(t){this.time=n.translateTickTime(t||0)},r.prototype.setType=function(t){if(t<r.NOTE_OFF||t>r.PITCH_BEND)throw new Error("Trying to set an unknown event: "+t);this.type=t},r.prototype.setChannel=function(t){if(t<0||t>15)throw new Error("Channel is out of bounds.");this.channel=t},r.prototype.setParam1=function(t){this.param1=t},r.prototype.setParam2=function(t){this.param2=t},r.prototype.toBytes=function(){var t=[],e=this.type|15&this.channel;return t.push.apply(t,this.time),t.push(e),t.push(this.param1),void 0!==this.param2&&null!==this.param2&&t.push(this.param2),t};var i=function(t){if(!this)return new i(t);this.setTime(t.time),this.setType(t.type),this.setData(t.data)};i.SEQUENCE=0,i.TEXT=1,i.COPYRIGHT=2,i.TRACK_NAME=3,i.INSTRUMENT=4,i.LYRIC=5,i.MARKER=6,i.CUE_POINT=7,i.CHANNEL_PREFIX=32,i.END_OF_TRACK=47,i.TEMPO=81,i.SMPTE=84,i.TIME_SIG=88,i.KEY_SIG=89,i.SEQ_EVENT=127,i.prototype.setTime=function(t){this.time=n.translateTickTime(t||0)},i.prototype.setType=function(t){this.type=t},i.prototype.setData=function(t){this.data=t},i.prototype.toBytes=function(){if(!this.type)throw new Error("Type for meta-event not specified.");var t=[];if(t.push.apply(t,this.time),t.push(255,this.type),Array.isArray(this.data))t.push(this.data.length),t.push.apply(t,this.data);else if("number"==typeof this.data)t.push(1,this.data);else if(null!==this.data&&void 0!==this.data){t.push(this.data.length);var e=this.data.split("").map(function(t){return t.charCodeAt(0)});t.push.apply(t,e)}else t.push(0);return t};var a=function(t){if(!this)return new a(t);var e=t||{};this.events=e.events||[]};a.START_BYTES=[77,84,114,107],a.END_BYTES=[0,255,47,0],a.prototype.addEvent=function(t){return this.events.push(t),this},a.prototype.addNoteOn=a.prototype.noteOn=function(t,i,a,o){return this.events.push(new r({type:r.NOTE_ON,channel:t,param1:n.ensureMidiPitch(i),param2:o||e,time:a||0})),this},a.prototype.addNoteOff=a.prototype.noteOff=function(t,i,a,o){return this.events.push(new r({type:r.NOTE_OFF,channel:t,param1:n.ensureMidiPitch(i),param2:o||e,time:a||0})),this},a.prototype.addNote=a.prototype.note=function(t,e,n,r,i){return this.noteOn(t,e,r,i),n&&this.noteOff(t,e,n,i),this},a.prototype.addChord=a.prototype.chord=function(t,e,n,r){if(!Array.isArray(e)&&!e.length)throw new Error("Chord must be an array of pitches");return e.forEach(function(e){this.noteOn(t,e,0,r)},this),e.forEach(function(e,r){0===r?this.noteOff(t,e,n):this.noteOff(t,e)},this),this},a.prototype.setInstrument=a.prototype.instrument=function(t,e,n){return this.events.push(new r({type:r.PROGRAM_CHANGE,channel:t,param1:e,time:n||0})),this},a.prototype.setTempo=a.prototype.tempo=function(t,e){return this.events.push(new i({type:i.TEMPO,data:n.mpqnFromBpm(t),time:e||0})),this},a.prototype.toBytes=function(){var t=0,e=[],r=a.START_BYTES,i=a.END_BYTES,o=function(n){var r=n.toBytes();t+=r.length,e.push.apply(e,r)};this.events.forEach(o),t+=i.length;var s=n.str2Bytes(t.toString(16),4);return r.concat(s,e,i)};var o=function(t){if(!this)return new o(t);var e=t||{};if(e.ticks){if("number"!=typeof e.ticks)throw new Error("Ticks per beat must be a number!");if(e.ticks<=0||e.ticks>=32768||e.ticks%1!=0)throw new Error("Ticks per beat must be an integer between 1 and 32767!")}this.ticks=e.ticks||128,this.tracks=e.tracks||[]};o.HDR_CHUNKID="MThd",o.HDR_CHUNK_SIZE="\0\0\0",o.HDR_TYPE0="\0\0",o.HDR_TYPE1="\0",o.prototype.addTrack=function(t){return t?(this.tracks.push(t),this):(t=new a,this.tracks.push(t),t)},o.prototype.toBytes=function(){var t=this.tracks.length.toString(16),e=o.HDR_CHUNKID+o.HDR_CHUNK_SIZE;return parseInt(t,16)>1?e+=o.HDR_TYPE1:e+=o.HDR_TYPE0,e+=n.codes2Str(n.str2Bytes(t,2)),e+=String.fromCharCode(this.ticks/256,this.ticks%256),this.tracks.forEach(function(t){e+=n.codes2Str(t.toBytes())}),e},t.Util=n,t.File=o,t.Track=a,t.Event=r,t.MetaEvent=i}(n),void 0!==t&&null!==t?t.exports=n:void 0!==e&&null!==e?e=n:this.Midi=n}).call(e,n(12)(t))},function(t,e){function n(t){function e(t){var e=t.read(4),n=t.readInt32();return{id:e,length:n,data:t.read(n)}}var n;stream=r(t);var i=e(stream);if("MThd"!=i.id||6!=i.length)throw"Bad .mid file - header not found";var a=r(i.data),o=a.readInt16(),s=a.readInt16(),u=a.readInt16();if(32768&u)throw"Expressing time division in SMTPE frames is not supported yet";ticksPerBeat=u;for(var c={formatType:o,trackCount:s,ticksPerBeat:ticksPerBeat},h=[],f=0;f<c.trackCount;f++){h[f]=[];var d=e(stream);if("MTrk"!=d.id)throw"Unexpected chunk - expected MTrk, got "+d.id;for(var l=r(d.data);!l.eof();){var p=function(t){var e={};e.deltaTime=t.readVarInt();var r=t.readInt8();if(240==(240&r)){if(255==r){e.type="meta";var i=t.readInt8(),a=t.readVarInt();switch(i){case 0:if(e.subtype="sequenceNumber",2!=a)throw"Expected length for sequenceNumber event is 2, got "+a;return e.number=t.readInt16(),e;case 1:return e.subtype="text",e.text=t.read(a),e;case 2:return e.subtype="copyrightNotice",e.text=t.read(a),e;case 3:return e.subtype="trackName",e.text=t.read(a),e;case 4:return e.subtype="instrumentName",e.text=t.read(a),e;case 5:return e.subtype="lyrics",e.text=t.read(a),e;case 6:return e.subtype="marker",e.text=t.read(a),e;case 7:return e.subtype="cuePoint",e.text=t.read(a),e;case 32:if(e.subtype="midiChannelPrefix",1!=a)throw"Expected length for midiChannelPrefix event is 1, got "+a;return e.channel=t.readInt8(),e;case 47:if(e.subtype="endOfTrack",0!=a)throw"Expected length for endOfTrack event is 0, got "+a;return e;case 81:if(e.subtype="setTempo",3!=a)throw"Expected length for setTempo event is 3, got "+a;return e.microsecondsPerBeat=(t.readInt8()<<16)+(t.readInt8()<<8)+t.readInt8(),e;case 84:if(e.subtype="smpteOffset",5!=a)throw"Expected length for smpteOffset event is 5, got "+a;var o=t.readInt8();return e.frameRate={0:24,32:25,64:29,96:30}[96&o],e.hour=31&o,e.min=t.readInt8(),e.sec=t.readInt8(),e.frame=t.readInt8(),e.subframe=t.readInt8(),e;case 88:if(e.subtype="timeSignature",4!=a)throw"Expected length for timeSignature event is 4, got "+a;return e.numerator=t.readInt8(),e.denominator=Math.pow(2,t.readInt8()),e.metronome=t.readInt8(),e.thirtyseconds=t.readInt8(),e;case 89:if(e.subtype="keySignature",2!=a)throw"Expected length for keySignature event is 2, got "+a;return e.key=t.readInt8(!0),e.scale=t.readInt8(),e;case 127:return e.subtype="sequencerSpecific",e.data=t.read(a),e;default:return e.subtype="unknown",e.data=t.read(a),e}return e.data=t.read(a),e}if(240==r){e.type="sysEx";var a=t.readVarInt();return e.data=t.read(a),e}if(247==r){e.type="dividedSysEx";var a=t.readVarInt();return e.data=t.read(a),e}throw"Unrecognised MIDI event type byte: "+r}var s;0==(128&r)?(s=r,r=n):(s=t.readInt8(),n=r);var u=r>>4;switch(e.channel=15&r,e.type="channel",u){case 8:return e.subtype="noteOff",e.noteNumber=s,e.velocity=t.readInt8(),e;case 9:return e.noteNumber=s,e.velocity=t.readInt8(),0==e.velocity?e.subtype="noteOff":e.subtype="noteOn",e;case 10:return e.subtype="noteAftertouch",e.noteNumber=s,e.amount=t.readInt8(),e;case 11:return e.subtype="controller",e.controllerType=s,e.value=t.readInt8(),e;case 12:return e.subtype="programChange",e.programNumber=s,e;case 13:return e.subtype="channelAftertouch",e.amount=s,e;case 14:return e.subtype="pitchBend",e.value=s+(t.readInt8()<<7),e;default:throw"Unrecognised MIDI event type: "+u}}(l);h[f].push(p)}}return{header:c,tracks:h}}function r(t){function e(e){var n=t.substr(s,e);return s+=e,n}function n(){var e=(t.charCodeAt(s)<<24)+(t.charCodeAt(s+1)<<16)+(t.charCodeAt(s+2)<<8)+t.charCodeAt(s+3);return s+=4,e}function r(){var e=(t.charCodeAt(s)<<8)+t.charCodeAt(s+1);return s+=2,e}function i(e){var n=t.charCodeAt(s);return e&&n>127&&(n-=256),s+=1,n}function a(){return s>=t.length}function o(){for(var t=0;;){var e=i();if(!(128&e))return t+e;t+=127&e,t<<=7}}var s=0;return{eof:a,read:e,readInt32:n,readInt16:r,readInt8:i,readVarInt:o}}t.exports=function(t){return n(t)}},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}}])});

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9ndWkuanMiLCJqcy9qb24tdHJvbWJvbmUuanMiLCJqcy9tYWluLmpzIiwianMvbWlkaS9taWRpLWNvbnRyb2xsZXIuanMiLCJqcy9waW5rLXRyb21ib25lL2NvbXBvbmVudHMvYXVkaW8tc3lzdGVtLmpzIiwianMvcGluay10cm9tYm9uZS9jb21wb25lbnRzL2dsb3R0aXMuanMiLCJqcy9waW5rLXRyb21ib25lL2NvbXBvbmVudHMvdHJhY3QtdWkuanMiLCJqcy9waW5rLXRyb21ib25lL2NvbXBvbmVudHMvdHJhY3QuanMiLCJqcy9waW5rLXRyb21ib25lL21hdGgtZXh0ZW5zaW9ucy5qcyIsImpzL3BpbmstdHJvbWJvbmUvbm9pc2UuanMiLCJqcy9waW5rLXRyb21ib25lL3BpbmstdHJvbWJvbmUuanMiLCJqcy90dHMvdHRzLWNvbnRyb2xsZXIuanMiLCJqcy91dGlscy9tb2RlbC1sb2FkZXIuanMiLCJqcy91dGlscy93ZWJnbC1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvbWlkaWNvbnZlcnQvYnVpbGQvTWlkaUNvbnZlcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sRzs7Ozs7Ozs2QkFFRyxHLEVBQUssUyxFQUFVOztBQUVoQixnQkFBRyxDQUFDLEtBQUosRUFBVztBQUNQLHdCQUFRLEdBQVIsQ0FBWSw0RUFBWjtBQUNBO0FBQ0g7O0FBRUQsaUJBQUssS0FBTCxHQUFhLElBQUksS0FBSixDQUFVO0FBQ25CLHVCQUFPLGNBRFk7QUFFbkIsdUJBQU8sTUFGWTtBQUduQixzQkFBTSxTQUhhO0FBSW5CLHVCQUFPLEdBSlk7QUFLbkIseUJBQVMsT0FMVTtBQU1uQix1QkFBTyxPQU5ZO0FBT25CLHlCQUFTO0FBUFUsYUFBVixDQUFiOztBQVVBLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CO0FBQ2hCLHNCQUFNLFVBRFUsRUFDRSxPQUFP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Q0FNRSxPQUFNLENBQU4sRUFBUyxDQUFFO0FBQ2hCOztBQUVEO0FBQ0EsdUJBQU8sS0FBUDtBQUNIO0FBQ0Q7QUFDQSxtQkFBTyxLQUFQO0FBQ0g7Ozt1Q0FFa0M7QUFBQSxnQkFBZixPQUFlLHVFQUFMLElBQUs7O0FBQy9CLGdCQUFHLFdBQVcsSUFBZCxFQUFtQjtBQUNmO0FBR0g7QUFDRCw2R0FFaUMsT0FGakM7QUFLSDs7Ozs7O1FBSUksUSxHQUFBLFE7OztBQ3pDVDtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJjbGFzcyBHVUkge1xuXG4gICAgSW5pdChqb24sIGNvbnRhaW5lcil7XG5cbiAgICAgICAgaWYoIWd1aWZ5KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkd1aWZ5IHdhcyBub3QgZm91bmQhIEFkZCBpdCB0byB5b3VyIHBhZ2UgdG8gZW5hYmxlIGEgR1VJIGZvciB0aGlzIHByb2dyYW0uXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wYW5lbCA9IG5ldyBndWlmeSh7XG4gICAgICAgICAgICB0aXRsZTogXCJKb24tVHJvbWJvbmVcIiwgXG4gICAgICAgICAgICB0aGVtZTogXCJkYXJrXCIsIFxuICAgICAgICAgICAgcm9vdDogY29udGFpbmVyLFxuICAgICAgICAgICAgd2lkdGg6IDM1MCxcbiAgICAgICAgICAgIGJhck1vZGU6IFwiYWJvdmVcIixcbiAgICAgICAgICAgIGFsaWduOiBcInJpZ2h0XCIsXG4gICAgICAgICAgICBvcGFjaXR5OiBcIjAuOTVcIlxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBhbmVsLlJlZ2lzdGVyKHsgXG4gICAgICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsIGxhYmVsOiBcIk11dGVcIiwgXG4gICAgICAgICAgICBvYmplY3Q6IGpvbi50cm9tYm9uZSwgcHJvcGVydHk6IFwibXV0ZWRcIiwgXG4gICAgICAgICAgICBvbkNoYW5nZTogKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBqb24udHJvbWJvbmUuU2V0TXV0ZShkYXRhKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEpvbiBmb2xkZXJcbiAgICAgICAgdGhpcy5wYW5lbC5SZWdpc3Rlcih7IHR5cGU6IFwiZm9sZGVyXCIsIGxhYmVsOiBcIkpvblwiIH0pO1xuICAgICAgICB0aGlzLnBhbmVsLlJlZ2lzdGVyKFtcbiAgICAgICAgICAgIHsgdHlwZTogXCJjaGVja2JveFwiLCBsYWJlbDogXCJNb3ZlIEphd1wiLCBvYmplY3Q6IGpvbiwgcHJvcGVydHk6IFwibW92ZUphd1wiIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwicmFuZ2VcIiwgbGFiZWw6IFwiSmF3IFNwZWVkXCIsIG9iamVjdDogam9uLCBwcm9wZXJ0eTogXCJqYXdGbGFwU3BlZWRcIiwgbWluOiAwLCBtYXg6IDEwMCB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIkphdyBSYW5nZVwiLCBvYmplY3Q6IGpvbiwgcHJvcGVydHk6IFwiamF3T3Blbk9mZnNldFwiLCBtaW46IDAsIG1heDogMSB9LFxuICAgICAgICBdLCB7IGZvbGRlcjogXCJKb25cIiB9KTtcblxuICAgICAgICAvLyBWb2ljZSBmb2xkZXJcbiAgICAgICAgdGhpcy5wYW5lbC5SZWdpc3Rlcih7IHR5cGU6IFwiZm9sZGVyXCIsIGxhYmVsOiBcIlZvaWNlXCIgfSk7XG4gICAgICAgIHRoaXMucGFuZWwuUmVnaXN0ZXIoW1xuICAgICAgICAgICAgeyB0eXBlOiBcImNoZWNrYm94XCIsIGxhYmVsOiBcIldvYmJsZVwiLCBvYmplY3Q6IGpvbi50cm9tYm9uZSwgcHJvcGVydHk6IFwiYXV0b1dvYmJsZVwiIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwiY2hlY2tib3hcIiwgbGFiZWw6IFwiUGl0Y2ggVmFyaWFuY2VcIiwgb2JqZWN0OiBqb24udHJvbWJvbmUudm9pY2VzWzBdLmdsb3R0aXMsIHByb3BlcnR5OiBcImFkZFBpdGNoVmFyaWFuY2VcIiB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcImNoZWNrYm94XCIsIGxhYmVsOiBcIlRlbnNlbmVzcyBWYXJpYW5jZVwiLCBvYmplY3Q6IGpvbi50cm9tYm9uZS52b2ljZXNbMF0uZ2xvdHRpcywgcHJvcGVydHk6IFwiYWRkVGVuc2VuZXNzVmFyaWFuY2VcIiB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInJhbmdlXCIsIGxhYmVsOiBcIlRlbnNlbmVzc1wiLCBvYmplY3Q6IGpvbi50cm9tYm9uZS52b2ljZXNbMF0uZ2xvdHRpcywgcHJvcGVydHk6IFwiVUlUZW5zZW5lc3NcIiwgbWluOiAwLCBtYXg6IDEgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJWaWJyYXRvXCIsIG9iamVjdDogam9uLnRyb21ib25lLnZvaWNlc1swXS5nbG90dGlzLCBwcm9wZXJ0eTogXCJ2aWJyYXRvQW1vdW50XCIsIG1pbjogMCwgbWF4OiAwLjUgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJGcmVxdWVuY3lcIiwgb2JqZWN0OiBqb24udHJvbWJvbmUudm9pY2VzWzBdLmdsb3R0aXMsIHByb3BlcnR5OiBcIlVJRnJlcXVlbmN5XCIsIG1pbjogMSwgbWF4OiAxMDAwLCBzdGVwOiAxIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwicmFuZ2VcIiwgbGFiZWw6IFwiTG91ZG5lc3NcIiwgb2JqZWN0OiBqb24udHJvbWJvbmUudm9pY2VzWzBdLmdsb3R0aXMsIHByb3BlcnR5OiBcImxvdWRuZXNzXCIsIG1pbjogMCwgbWF4OiAxIH0sXG4gICAgICAgIF0sIHsgZm9sZGVyOiBcIlZvaWNlXCIgfSk7XG5cbiAgICAgICAgLy8gVHJhY3QgZm9sZGVyXG4gICAgICAgIHRoaXMucGFuZWwuUmVnaXN0ZXIoeyB0eXBlOiBcImZvbGRlclwiLCBsYWJlbDogXCJUcmFjdFwiIH0pO1xuICAgICAgICB0aGlzLnBhbmVsLlJlZ2lzdGVyKFtcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJNb3ZlIFNwZWVkXCIsIG9iamVjdDogam9uLnRyb21ib25lLnZvaWNlc1swXS50cmFjdCwgcHJvcGVydHk6IFwibW92ZW1lbnRTcGVlZFwiLCBtaW46IDEsIG1heDogMzAsIHN0ZXA6IDEgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJWZWx1bSBUYXJnZXRcIiwgb2JqZWN0OiBqb24udHJvbWJvbmUudm9pY2VzWzBdLnRyYWN0LCBwcm9wZXJ0eTogXCJ2ZWx1bVRhcmdldFwiLCBtaW46IDAuMDAxLCBtYXg6IDIgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJUYXJnZXRcIiwgb2JqZWN0OiBqb24udHJvbWJvbmUudm9pY2VzWzBdLnRyYWN0VUksIHByb3BlcnR5OiBcInRhcmdldFwiLCBtaW46IDAuMDAxLCBtYXg6IDEgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJJbmRleFwiLCBvYmplY3Q6IGpvbi50cm9tYm9uZS52b2ljZXNbMF0udHJhY3RVSSwgcHJvcGVydHk6IFwiaW5kZXhcIiwgbWluOiAwLCBtYXg6IDQzLCBzdGVwOiAxIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwicmFuZ2VcIiwgbGFiZWw6IFwiUmFkaXVzXCIsIG9iamVjdDogam9uLnRyb21ib25lLnZvaWNlc1swXS50cmFjdFVJLCBwcm9wZXJ0eTogXCJyYWRpdXNcIiwgbWluOiAwLCBtYXg6IDUsIHN0ZXA6IDEgfSxcbiAgICAgICAgXSwgeyBmb2xkZXI6IFwiVHJhY3RcIiB9KTtcblxuICAgICAgICAvLyBNSURJIGZvbGRlclxuICAgICAgICB0aGlzLnBhbmVsLlJlZ2lzdGVyKHsgdHlwZTogXCJmb2xkZXJcIiwgbGFiZWw6IFwiTUlESVwiIH0pO1xuICAgICAgICB0aGlzLnBhbmVsLlJlZ2lzdGVyKFtcbiAgICAgICAgICAgIHsgdHlwZTogXCJmaWxlXCIsIGxhYmVsOiBcIk1JREkgRmlsZVwiLCBmaWxlUmVhZEZ1bmM6IFwicmVhZEFzQmluYXJ5U3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U6IChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGpvbi5taWRpQ29udHJvbGxlci5Mb2FkU29uZ0RpcmVjdChkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcInRpdGxlXCIsIGxhYmVsOiBcIkNvbnRyb2xzXCIgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJidXR0b25cIiwgbGFiZWw6IFwiUGxheVwiLCBhY3Rpb246ICgpID0+IGpvbi5taWRpQ29udHJvbGxlci5QbGF5U29uZygpIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwiYnV0dG9uXCIsIGxhYmVsOiBcIlN0b3BcIiwgYWN0aW9uOiAoKSA9PiBqb24ubWlkaUNvbnRyb2xsZXIuU3RvcCgpIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwiYnV0dG9uXCIsIGxhYmVsOiBcIlJlc3RhcnRcIiwgYWN0aW9uOiAoKSA9PiBqb24ubWlkaUNvbnRyb2xsZXIuUmVzdGFydCgpIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwidGl0bGVcIiwgbGFiZWw6IFwiT3B0aW9uc1wiIH0sXG4gICAgICAgICAgICB7IHR5cGU6IFwicmFuZ2VcIiwgbGFiZWw6IFwiVHJhY2tcIiwgb2JqZWN0OiBqb24ubWlkaUNvbnRyb2xsZXIsIHByb3BlcnR5OiBcImN1cnJlbnRUcmFja1wiLCBtaW46IDEsIG1heDogMjAsIHN0ZXA6IDEgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJyYW5nZVwiLCBsYWJlbDogXCJCYXNlIEZyZXF1ZW5jeVwiLCBvYmplY3Q6IGpvbi5taWRpQ29udHJvbGxlciwgcHJvcGVydHk6IFwiYmFzZUZyZXFcIiwgbWluOiAxLCBtYXg6IDIwMDAsIHN0ZXA6IDEgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJjaGVja2JveFwiLCBsYWJlbDogXCJFeHRyZW1lIFZpYnJhdG9cIiwgb2JqZWN0OiBqb24sIHByb3BlcnR5OiBcImZsYXBXaGlsZVNpbmdpbmdcIiB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcImNoZWNrYm94XCIsIGxhYmVsOiBcIkxlZ2F0b1wiLCBvYmplY3Q6IGpvbiwgcHJvcGVydHk6IFwibGVnYXRvXCIgfSxcbiAgICAgICAgXSwgeyBmb2xkZXI6IFwiTUlESVwiIH0pO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBsZXQgZ3VpID0gbmV3IEdVSSgpOyIsImltcG9ydCB7IE1vZGVsTG9hZGVyIH0gZnJvbSBcIi4vdXRpbHMvbW9kZWwtbG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBQaW5rVHJvbWJvbmUgfSBmcm9tIFwiLi9waW5rLXRyb21ib25lL3BpbmstdHJvbWJvbmUuanNcIjtcbmltcG9ydCB7IE1pZGlDb250cm9sbGVyIH0gZnJvbSBcIi4vbWlkaS9taWRpLWNvbnRyb2xsZXIuanNcIjtcbmltcG9ydCB7IFRUU0NvbnRyb2xsZXIgfSBmcm9tIFwiLi90dHMvdHRzLWNvbnRyb2xsZXIuanNcIjtcbmltcG9ydCB7IGd1aSB9IGZyb20gXCIuL2d1aS5qc1wiO1xuXG5jbGFzcyBKb25Ucm9tYm9uZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGZpbmlzaGVkQ2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5jdXJzb3IgPSBcImRlZmF1bHRcIjtcblxuICAgICAgICAvLyBTZXQgdXAgcmVuZGVyZXIgYW5kIGVtYmVkIGluIGNvbnRhaW5lclxuICAgICAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoIHsgYWxwaGE6IHRydWUgfSApO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUodGhpcy5jb250YWluZXIub2Zmc2V0V2lkdGgsIHRoaXMuY29udGFpbmVyLm9mZnNldEhlaWdodCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweDAwMDAwMCwgMCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgICAgLy8gU2V0IHVwIHNjZW5lIGFuZCB2aWV3XG4gICAgICAgIGxldCBhc3BlY3QgPSB0aGlzLmNvbnRhaW5lci5vZmZzZXRXaWR0aCAvIHRoaXMuY29udGFpbmVyLm9mZnNldEhlaWdodDtcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoIDQ1LCBhc3BlY3QsIDAuMSwgMTAwICk7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgICAgICAvLyBFeHBvcnQgc2NlbmUgZm9yIHRocmVlIGpzIGluc3BlY3RvclxuICAgICAgICAvL3dpbmRvdy5zY2VuZSA9IHRoaXMuc2NlbmU7XG5cbiAgICAgICAgLy8gU2V0IHVwIGNsb2NrIGZvciB0aW1pbmdcbiAgICAgICAgdGhpcy5jbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuXG4gICAgICAgIGxldCBzdGFydERlbGF5TVMgPSAxMDAwO1xuICAgICAgICB0aGlzLnRyb21ib25lID0gbmV3IFBpbmtUcm9tYm9uZSh0aGlzKTtcbiAgICAgICAgc2V0VGltZW91dCgoKT0+IHtcbiAgICAgICAgICAgIHRoaXMudHJvbWJvbmUuU3RhcnRBdWRpbygpO1xuICAgICAgICAgICAgLy90aGlzLnRyb21ib25lLlNldE11dGUodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLm1vdmVKYXcgPSB0cnVlO1xuICAgICAgICB9LCBzdGFydERlbGF5TVMpO1xuXG4gICAgICAgIC8vIE11dGUgYnV0dG9uIGZvciB0cm9tYm9uZVxuICAgICAgICAvLyBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgLy8gYnV0dG9uLmlubmVySFRNTCA9IFwiTXV0ZVwiO1xuICAgICAgICAvLyBidXR0b24uc3R5bGUuY3NzVGV4dCA9IFwicG9zaXRpb246IGFic29sdXRlOyBkaXNwbGF5OiBibG9jazsgdG9wOiAwOyBsZWZ0OiAwO1wiO1xuICAgICAgICAvLyB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgICAgICAvLyBidXR0b24uYWRkRXZlbnRMaXN0ZW5lciAoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIC8vICAgICB0aGlzLnRyb21ib25lLlRvZ2dsZU11dGUoKTtcbiAgICAgICAgLy8gICAgIGJ1dHRvbi5pbm5lckhUTUwgPSB0aGlzLnRyb21ib25lLm11dGVkID8gXCJVbm11dGVcIiA6IFwiTXV0ZVwiO1xuICAgICAgICAvLyB9KTtcblxuICAgICAgICB0aGlzLmphd0ZsYXBTcGVlZCA9IDIwLjA7XG4gICAgICAgIHRoaXMuamF3T3Blbk9mZnNldCA9IDAuMTk7XG4gICAgICAgIHRoaXMubW92ZUphdyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxlZ2F0byA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZsYXBXaGlsZVNpbmdpbmcgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLm1pZGlDb250cm9sbGVyID0gbmV3IE1pZGlDb250cm9sbGVyKHRoaXMpO1xuXG4gICAgICAgIC8vIGxldCB0dHMgPSBuZXcgVFRTQ29udHJvbGxlcigpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0dHMuR2V0R3JhcGhlbWVzKFwiVGVzdGluZyBvbmUgdHdvIHRocmVlIDEgMiAzXCIpKTtcblxuICAgICAgICB0aGlzLlNldFVwVGhyZWUoKTtcbiAgICAgICAgdGhpcy5TZXRVcFNjZW5lKCk7XG5cbiAgICAgICAgLy8gU3RhcnQgdGhlIHVwZGF0ZSBsb29wXG4gICAgICAgIHRoaXMuT25VcGRhdGUoKTtcblxuICAgICAgICBndWkuSW5pdCh0aGlzLCB0aGlzLmNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHVwIG5vbi1zY2VuZSBjb25maWcgZm9yIFRocmVlLmpzXG4gICAgICovXG4gICAgU2V0VXBUaHJlZSgpIHtcbiAgICAgICAgaWYoVEhSRUUuT3JiaXRDb250cm9scyAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIC8vIEFkZCBvcmJpdCBjb250cm9sc1xuICAgICAgICAgICAgdGhpcy5jb250cm9scyA9IG5ldyBUSFJFRS5PcmJpdENvbnRyb2xzKCB0aGlzLmNhbWVyYSwgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50ICk7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnRhcmdldC5zZXQoIDAsIDAsIDAgKTtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHMudXBkYXRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJObyBUSFJFRS5PcmJpdENvbnRyb2xzIGRldGVjdGVkLiBJbmNsdWRlIHRvIGFsbG93IGludGVyYWN0aW9uIHdpdGggdGhlIG1vZGVsLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBvcHVsYXRlcyBhbmQgY29uZmlndXJlcyBvYmplY3RzIHdpdGhpbiB0aGUgc2NlbmUuXG4gICAgICovXG4gICAgU2V0VXBTY2VuZSgpIHtcblxuICAgICAgICAvLyBTZXQgY2FtZXJhIHBvc2l0aW9uXG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnNldCggMCwgMCwgMC41ICk7XG5cbiAgICAgICAgLy8gTGlnaHRzXG4gICAgICAgIGxldCBsaWdodDEgPSBuZXcgVEhSRUUuSGVtaXNwaGVyZUxpZ2h0KDB4ZmZmZmZmLCAweDQ0NDQ0NCwgMS4wKTtcbiAgICAgICAgbGlnaHQxLm5hbWUgPSBcIkhlbWlzcGhlcmUgTGlnaHRcIjtcbiAgICAgICAgbGlnaHQxLnBvc2l0aW9uLnNldCgwLCAxLCAwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobGlnaHQxKTtcblxuICAgICAgICBsZXQgbGlnaHQyID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDEuMCk7XG4gICAgICAgIGxpZ2h0Mi5uYW1lID0gXCJEaXJlY3Rpb25hbCBMaWdodFwiO1xuICAgICAgICBsaWdodDIucG9zaXRpb24uc2V0KDAsIDEsIDEpO1xuICAgICAgICBsaWdodDIudGFyZ2V0LnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobGlnaHQyKTtcblxuICAgICAgICAvLyBMb2FkIHRoZSBKb24gbW9kZWwgYW5kIHBsYWNlIGl0IGluIHRoZSBzY2VuZVxuICAgICAgICBNb2RlbExvYWRlci5Mb2FkSlNPTihcIi4uL3Jlc291cmNlcy9qb24vdGhyZWUvam9uLmpzb25cIiwgKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5qb24gPSBvYmplY3Q7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZCggdGhpcy5qb24gKTtcbiAgICAgICAgICAgIHRoaXMuam9uLnJvdGF0aW9uLnkgPSAoVEhSRUUuTWF0aC5kZWdUb1JhZCgxNSkpO1xuXG4gICAgICAgICAgICB0aGlzLmphdyA9IHRoaXMuam9uLnNrZWxldG9uLmJvbmVzLmZpbmQoKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoubmFtZSA9PSBcIkJvbmUuMDA2XCI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmKHRoaXMuamF3KXtcbiAgICAgICAgICAgICAgICB0aGlzLmphd1NodXRaID0gdGhpcy5qYXcucG9zaXRpb24uejtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCBldmVyeSBmcmFtZS4gQ29udGludWVzIGluZGVmaW5pdGVseSBhZnRlciBiZWluZyBjYWxsZWQgb25jZS5cbiAgICAgKi9cbiAgICBPblVwZGF0ZSgpIHtcbiAgICAgICAgbGV0IGRlbHRhVGltZSA9IHRoaXMuY2xvY2suZ2V0RGVsdGEoKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB0aGlzLk9uVXBkYXRlLmJpbmQodGhpcykgKTtcblxuICAgICAgICBpZih0aGlzLm1pZGlDb250cm9sbGVyLnBsYXlpbmcpe1xuXG4gICAgICAgICAgICBsZXQgbm90ZXMgPSB0aGlzLm1pZGlDb250cm9sbGVyLkdldFBpdGNoZXMoKTtcbiAgICAgICAgICAgIGlmKG5vdGVzICE9IHRoaXMubGFzdE5vdGVzKXtcbiAgICAgICAgICAgICAgICAvLyBEbyB0aGUgbm90ZVxuICAgICAgICAgICAgICAgIGlmKG5vdGVzICE9PSB1bmRlZmluZWQpeyAvLyYmIG5vdGVzLmxlbmd0aCAhPSAwKXsgXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdGUgb25cbiAgICAgICAgICAgICAgICAgICAgLy8gUGxheSBmcmVxdWVuY3lcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRyb21ib25lLnZvaWNlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA+PSBub3Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMubGVnYXRvKSB0aGlzLnRyb21ib25lLnZvaWNlc1tpXS5nbG90dGlzLmxvdWRuZXNzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZlSmF3KSB0aGlzLnRyb21ib25lLnZvaWNlc1tpXS50cmFjdFVJLlNldExpcHNDbG9zZWQoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cm9tYm9uZS52b2ljZXNbaV0uZ2xvdHRpcy5VSUZyZXF1ZW5jeSA9IHRoaXMubWlkaUNvbnRyb2xsZXIuTUlESVRvRnJlcXVlbmN5KG5vdGVzW2ldLm1pZGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cm9tYm9uZS52b2ljZXNbaV0uZ2xvdHRpcy5sb3VkbmVzcyA9IG5vdGVzW2ldLnZlbG9jaXR5O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZlSmF3KSB0aGlzLnRyb21ib25lLnZvaWNlc1tpXS50cmFjdFVJLlNldExpcHNDbG9zZWQoMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gbGV0IG5vdGUgPSBub3Rlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYobm90ZXMubGVuZ3RoID4gMSl7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvL2NvbnNvbGUubG9nIChcImNob3JkXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGxldCBmcmVxID0gdGhpcy5taWRpQ29udHJvbGxlci5NSURJVG9GcmVxdWVuY3kobm90ZS5taWRpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gLy9jb25zb2xlLmxvZyhmcmVxKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy50cm9tYm9uZS5nbG90dGlzLlVJRnJlcXVlbmN5ID0gZnJlcTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy50cm9tYm9uZS5nbG90dGlzLmxvdWRuZXNzID0gbm90ZS52ZWxvY2l0eTtcbiAgICAgICAgICAgICAgICAgICAgLy8gT3BlbiBqYXdcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubW92ZUphdykgdGhpcy5qYXcucG9zaXRpb24ueiA9IHRoaXMuamF3U2h1dFogKyB0aGlzLmphd09wZW5PZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgdm9pY2Ugb2YgdGhpcy50cm9tYm9uZS52b2ljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmVKYXcpIHZvaWNlLnRyYWN0VUkuU2V0TGlwc0Nsb3NlZCgwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgICAgIGlmKG5vdGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmVKYXcpIHRoaXMuamF3LnBvc2l0aW9uLnogPSB0aGlzLmphd1NodXRaO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZWxzZSB7IFxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBOb3RlIG9mZlxuICAgICAgICAgICAgICAgIC8vICAgICBpZiAoIXRoaXMubGVnYXRvKSB0aGlzLnRyb21ib25lLmdsb3R0aXMubG91ZG5lc3MgPSAwO1xuICAgICAgICAgICAgICAgIC8vICAgICAvLyBDbG9zZSBqYXdcbiAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5qYXcucG9zaXRpb24ueiA9IHRoaXMuamF3U2h1dFo7XG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIHRoaXMudHJvbWJvbmUudHJhY3RVSS5TZXRMaXBzQ2xvc2VkKDEpO1xuXG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0Tm90ZXMgPSBub3RlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5qYXcgJiYgdGhpcy5tb3ZlSmF3ICYmICghdGhpcy5taWRpQ29udHJvbGxlci5wbGF5aW5nIHx8IHRoaXMuZmxhcFdoaWxlU2luZ2luZykpe1xuICAgICAgICAgICAgbGV0IHRpbWUgPSB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7Ly8gJSA2MDtcblxuICAgICAgICAgICAgLy8gTW92ZSB0aGUgamF3XG4gICAgICAgICAgICBsZXQgcGVyY2VudCA9IChNYXRoLnNpbih0aW1lICogdGhpcy5qYXdGbGFwU3BlZWQpICsgMS4wKSAvIDIuMDtcbiAgICAgICAgICAgIHRoaXMuamF3LnBvc2l0aW9uLnogPSB0aGlzLmphd1NodXRaICsgKHBlcmNlbnQgKiB0aGlzLmphd09wZW5PZmZzZXQpO1xuXG4gICAgICAgICAgICAvLyBNYWtlIHRoZSBhdWRpbyBtYXRjaCB0aGUgamF3IHBvc2l0aW9uXG4gICAgICAgICAgICBmb3IobGV0IHZvaWNlIG9mIHRoaXMudHJvbWJvbmUudm9pY2VzKSB7XG4gICAgICAgICAgICAgICAgdm9pY2UudHJhY3RVSS5TZXRMaXBzQ2xvc2VkKDEuMCAtIHBlcmNlbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW5kZXJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCB7IEpvblRyb21ib25lIH07IiwiaW1wb3J0IHsgRGV0ZWN0b3IgfSBmcm9tIFwiLi91dGlscy93ZWJnbC1kZXRlY3QuanNcIjtcbmltcG9ydCB7IEpvblRyb21ib25lIH0gZnJvbSBcIi4vam9uLXRyb21ib25lLmpzXCI7XG5cbi8vIE9wdGlvbmFsbHkgYnVuZGxlIHRocmVlLmpzIGFzIHBhcnQgb2YgdGhlIHByb2plY3Rcbi8vaW1wb3J0IFRIUkVFTGliIGZyb20gXCJ0aHJlZS1qc1wiO1xuLy92YXIgVEhSRUUgPSBUSFJFRUxpYigpOyAvLyByZXR1cm4gVEhSRUUgSlNcblxubGV0IEluaXQgPSAoKSA9PiB7XG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam9uLXRyb21ib25lLWNvbnRhaW5lclwiKTtcblxuICAgIGlmICggIURldGVjdG9yLkhhc1dlYkdMKCkgKSB7XG4gICAgICAgIC8vZXhpdChcIldlYkdMIGlzIG5vdCBzdXBwb3J0ZWQgb24gdGhpcyBicm93c2VyLlwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJXZWJHTCBpcyBub3Qgc3VwcG9ydGVkIG9uIHRoaXMgYnJvd3Nlci5cIik7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBEZXRlY3Rvci5HZXRFcnJvckhUTUwoKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJuby13ZWJnbFwiKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgbGV0IGpvblRyb21ib25lID0gbmV3IEpvblRyb21ib25lKGNvbnRhaW5lcik7XG4gICAgfVxufVxuXG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgIEluaXQoKTtcbn0gZWxzZSB7XG4gICAgd2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgSW5pdCgpO1xuICAgIH1cbn0iLCJsZXQgTWlkaUNvbnZlcnQgPSByZXF1aXJlKCdtaWRpY29udmVydCcpO1xuXG4vKipcbiAqIFNpbXBsZSBjbGFzcyBmb3IgTUlESSBwbGF5YmFjay5cbiAqIFRoZSBwYXJhZGlnbSBoZXJlJ3MgYSBiaXQgd2VpcmQ7IGl0J3MgdXAgdG8gYW4gZXh0ZXJuYWxcbiAqIHNvdXJjZSB0byBhY3R1YWxseSBwcm9kdWNlIGF1ZGlvLiBUaGlzIGNsYXNzIGp1c3QgbWFuYWdlc1xuICogYSB0aW1lciwgd2hpY2ggR2V0UGl0Y2goKSByZWFkcyB0byBwcm9kdWNlIHRoZSBcImN1cnJlbnRcIlxuICogbm90ZSBpbmZvcm1hdGlvbi4gXG4gKiBcbiAqIEFzIGFuIGV4YW1wbGUgb2YgdXNhZ2UsIGpvbi10cm9tYm9uZSBjYWxscyBQbGF5U29uZygpIHRvXG4gKiBiZWdpbiwgYW5kIHRoZW4gZXZlcnkgZnJhbWUgdXNlcyBHZXRQaXRjaCgpIHRvIGZpZ3VyZSBvdXRcbiAqIHdoYXQgdGhlIGN1cnJlbnQgZnJlcXVlbmN5IHRvIHByb2R1Y2UgaXMuXG4gKi9cbmNsYXNzIE1pZGlDb250cm9sbGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcblxuICAgICAgICB0aGlzLm1pZGkgPSBudWxsO1xuXG4gICAgICAgIHRoaXMucGxheWluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnRUcmFjayA9IDU7XG5cbiAgICAgICAgdGhpcy5iYXNlRnJlcSA9IDQ0MDsgLy8xMTAgaXMgQTRcblxuICAgICAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkcyBhbmQgcGFyc2VzIGEgTUlESSBmaWxlLlxuICAgICAqL1xuICAgIExvYWRTb25nKHBhdGgsIGNhbGxiYWNrKXtcbiAgICAgICAgdGhpcy5TdG9wKCk7XG4gICAgICAgIHRoaXMubWlkaSA9IG51bGw7XG4gICAgICAgIE1pZGlDb252ZXJ0LmxvYWQocGF0aCwgKG1pZGkpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTUlESSBsb2FkZWQuXCIpO1xuICAgICAgICAgICAgdGhpcy5taWRpID0gbWlkaTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMubWlkaSk7XG4gICAgICAgICAgICBpZihjYWxsYmFjaykgY2FsbGJhY2sobWlkaSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIExvYWRTb25nRGlyZWN0KGZpbGUpe1xuICAgICAgICB0aGlzLlN0b3AoKTtcbiAgICAgICAgdGhpcy5taWRpID0gTWlkaUNvbnZlcnQucGFyc2UoZmlsZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTUlESSBsb2FkZWQuXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm1pZGkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHBpdGNoIGZvciB0aGUgc3BlY2lmaWVkIHRyYWNrIGF0IHRoZSBjdXJyZW50IHRpbWUgaW4gdGhlIHNvbmcuXG4gICAgICovXG4gICAgR2V0UGl0Y2godHJhY2tJbmRleCA9IHRoaXMuY3VycmVudFRyYWNrKXtcbiAgICAgICAgbGV0IHRpbWUgPSB0aGlzLkdldFNvbmdQcm9ncmVzcygpO1xuXG4gICAgICAgIC8vIENvbnN0cmFpbiB0cmFjayBzcGVjaWZpZWQgdG8gdmFsaWQgcmFuZ2VcbiAgICAgICAgdHJhY2tJbmRleCA9IE1hdGgubWluKHRyYWNrSW5kZXgsIHRoaXMubWlkaS50cmFja3MubGVuZ3RoIC0gMSk7XG4gICAgICAgIHRyYWNrSW5kZXggPSBNYXRoLm1heCh0cmFja0luZGV4LCAwKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5taWRpLnRyYWNrc1t0cmFja0luZGV4XS5ub3Rlcy5maW5kKChpdGVtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5ub3RlT24gPD0gdGltZSAmJiB0aW1lIDw9IGl0ZW0ubm90ZU9mZjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgR2V0UGl0Y2hlcyh0cmFja0luZGV4ID0gdGhpcy5jdXJyZW50VHJhY2spe1xuICAgICAgICBsZXQgdGltZSA9IHRoaXMuR2V0U29uZ1Byb2dyZXNzKCk7XG5cbiAgICAgICAgLy8gQ29uc3RyYWluIHRyYWNrIHNwZWNpZmllZCB0byB2YWxpZCByYW5nZVxuICAgICAgICB0cmFja0luZGV4ID0gTWF0aC5taW4odHJhY2tJbmRleCwgdGhpcy5taWRpLnRyYWNrcy5sZW5ndGggLSAxKTtcbiAgICAgICAgdHJhY2tJbmRleCA9IE1hdGgubWF4KHRyYWNrSW5kZXgsIDApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1pZGkudHJhY2tzW3RyYWNrSW5kZXhdLm5vdGVzLmZpbHRlcihpdGVtID0+IFxuICAgICAgICAgICAgaXRlbS5ub3RlT24gPD0gdGltZSAmJiB0aW1lIDw9IGl0ZW0ubm90ZU9mZik7XG4gICAgfVxuXG4gICAgUGxheVNvbmcodHJhY2sgPSA1KXtcbiAgICAgICAgaWYodGhpcy5wbGF5aW5nKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG5vIHNvbmcgaXMgc3BlY2lmaWVkLCBsb2FkIGEgc29uZ1xuICAgICAgICBpZighdGhpcy5taWRpKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gTUlESSBpcyBsb2FkZWQuIExvYWRpbmcgYW4gZXhhbXBsZS4uLlwiKTtcbiAgICAgICAgICAgIHRoaXMuTG9hZFNvbmcoJy4uL3Jlc291cmNlcy9taWRpL3VuLW93ZW4td2FzLWhlci5taWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5QbGF5U29uZygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUdXJuIG9mZiBzb21lIHN0dWZmIHNvIHRoZSBzaW5naW5nIGtpbmQgb2Ygc291bmRzIG9rYXlcbiAgICAgICAgdGhpcy5FbnRlclNpbmdNb2RlKCk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2sgPSB0cmFjaztcbiAgICAgICAgdGhpcy5jbG9jay5zdGFydCgpO1xuICAgICAgICB0aGlzLnBsYXlpbmcgPSB0cnVlO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGxheWJhY2sgc3RhcnRlZC5cIik7XG5cbiAgICB9XG5cbiAgICBHZXRTb25nUHJvZ3Jlc3MoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvY2suZ2V0RWxhcHNlZFRpbWUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBmcm9tIGEgTUlESSBub3RlIGNvZGUgdG8gaXRzIGNvcnJlc3BvbmRpbmcgZnJlcXVlbmN5LlxuICAgICAqIEBwYXJhbSB7Kn0gbWlkaUNvZGUgXG4gICAgICovXG4gICAgTUlESVRvRnJlcXVlbmN5KG1pZGlDb2RlKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzZUZyZXEgKiBNYXRoLnBvdygyLCAobWlkaUNvZGUgLSA2OSkgLyAxMik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzdGFydHMgdGhlIHBsYXliYWNrLlxuICAgICAqL1xuICAgIFJlc3RhcnQoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJQbGF5YmFjayBtb3ZlZCB0byBiZWdpbm5pbmcuXCIpO1xuICAgICAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcHMgcGxheWJhY2suXG4gICAgICovXG4gICAgU3RvcCgpIHtcbiAgICAgICAgaWYoIXRoaXMucGxheWluZyl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJQbGF5YmFjayBzdG9wcGVkLlwiKTtcbiAgICAgICAgdGhpcy5jbG9jay5zdG9wKCk7XG4gICAgICAgIHRoaXMucGxheWluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLkV4aXRTaW5nTW9kZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdXAgdGhlIHRyb21ib25lIGZvciBzaW5naW5nLlxuICAgICAqL1xuICAgIEVudGVyU2luZ01vZGUoKXtcbiAgICAgICAgaWYodGhpcy5iYWNrdXBfc2V0dGluZ3Mpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iYWNrdXBfc2V0dGluZ3MgPSB7fTtcblxuICAgICAgICB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcImF1dG9Xb2JibGVcIl0gPSB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuYXV0b1dvYmJsZTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRyb21ib25lLmF1dG9Xb2JibGUgPSBmYWxzZTtcblxuICAgICAgICBmb3IobGV0IHZvaWNlIG9mIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS52b2ljZXMpIHtcbiAgICAgICAgICAgIGxldCB2b2ljZUJhY2t1cCA9IHt9XG5cbiAgICAgICAgICAgIHZvaWNlQmFja3VwW1wiYWRkUGl0Y2hWYXJpYW5jZVwiXSA9IHZvaWNlLmdsb3R0aXMuYWRkUGl0Y2hWYXJpYW5jZTtcbiAgICAgICAgICAgIHZvaWNlLmdsb3R0aXMuYWRkUGl0Y2hWYXJpYW5jZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICB2b2ljZUJhY2t1cFtcImFkZFRlbnNlbmVzc1ZhcmlhbmNlXCJdID0gdm9pY2UuZ2xvdHRpcy5hZGRUZW5zZW5lc3NWYXJpYW5jZTtcbiAgICAgICAgICAgIHZvaWNlLmdsb3R0aXMuYWRkVGVuc2VuZXNzVmFyaWFuY2UgPSBmYWxzZTtcblxuICAgICAgICAgICAgdm9pY2VCYWNrdXBbXCJ2aWJyYXRvRnJlcXVlbmN5XCJdID0gdm9pY2UuZ2xvdHRpcy52aWJyYXRvRnJlcXVlbmN5O1xuICAgICAgICAgICAgdm9pY2UuZ2xvdHRpcy52aWJyYXRvRnJlcXVlbmN5ID0gMDtcblxuICAgICAgICAgICAgdm9pY2VCYWNrdXBbXCJmcmVxdWVuY3lcIl0gPSB2b2ljZS5nbG90dGlzLlVJRnJlcXVlbmN5O1xuXG4gICAgICAgICAgICB2b2ljZUJhY2t1cFtcImxvdWRuZXNzXCJdID0gdm9pY2UuZ2xvdHRpcy5sb3VkbmVzcztcbiAgICAgICAgICAgIHZvaWNlLmdsb3R0aXMubG91ZG5lc3MgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmJhY2t1cF9zZXR0aW5nc1tgJHt2b2ljZS5pZH1gXSA9IHZvaWNlQmFja3VwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXN0b3JlcyB0aGUgdHJvbWJvbmUgdG8gdGhlIHN0YXRlIGl0IHdhcyBpbiBiZWZvcmUgc2luZ2luZy5cbiAgICAgKi9cbiAgICBFeGl0U2luZ01vZGUoKXtcbiAgICAgICAgaWYoIXRoaXMuYmFja3VwX3NldHRpbmdzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuYXV0b1dvYmJsZSA9IHRoaXMuYmFja3VwX3NldHRpbmdzW1wiYXV0b1dvYmJsZVwiXTtcblxuICAgICAgICBmb3IobGV0IHZvaWNlIG9mIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS52b2ljZXMpIHtcbiAgICAgICAgICAgIGxldCBiYWNrdXAgPSB0aGlzLmJhY2t1cF9zZXR0aW5nc1tgJHt2b2ljZS5pZH1gXVxuICAgICAgICAgICAgdm9pY2UuZ2xvdHRpcy5hZGRQaXRjaFZhcmlhbmNlID0gYmFja3VwW1wiYWRkUGl0Y2hWYXJpYW5jZVwiXTtcbiAgICAgICAgICAgIHZvaWNlLmdsb3R0aXMuYWRkVGVuc2VuZXNzVmFyaWFuY2UgPSBiYWNrdXBbXCJhZGRUZW5zZW5lc3NWYXJpYW5jZVwiXTtcbiAgICAgICAgICAgIHZvaWNlLmdsb3R0aXMudmlicmF0b0ZyZXF1ZW5jeSA9IGJhY2t1cFtcInZpYnJhdG9GcmVxdWVuY3lcIl07XG4gICAgICAgICAgICB2b2ljZS5nbG90dGlzLlVJRnJlcXVlbmN5ID0gYmFja3VwW1wiZnJlcXVlbmN5XCJdO1xuICAgICAgICAgICAgdm9pY2UuZ2xvdHRpcy5sb3VkbmVzcyA9IGJhY2t1cFtcImxvdWRuZXNzXCJdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iYWNrdXBfc2V0dGluZ3MgPSBudWxsO1xuICAgIH1cblxufVxuXG5leHBvcnQgeyBNaWRpQ29udHJvbGxlciB9OyIsIlxuXG5jbGFzcyBBdWRpb1N5c3RlbSB7ICBcblxuICAgIGNvbnN0cnVjdG9yKHRyb21ib25lKSB7XG4gICAgICAgIHRoaXMudHJvbWJvbmUgPSB0cm9tYm9uZTtcblxuICAgICAgICB0aGlzLmJsb2NrTGVuZ3RoID0gNTEyO1xuICAgICAgICB0aGlzLmJsb2NrVGltZSA9IDE7XG4gICAgICAgIHRoaXMuc291bmRPbiA9IGZhbHNlO1xuXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgd2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHR8fHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gICAgICAgIHRoaXMuYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcbiAgICAgICAgdGhpcy5zYW1wbGVSYXRlID0gdGhpcy5hdWRpb0NvbnRleHQuc2FtcGxlUmF0ZTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYmxvY2tUaW1lID0gdGhpcy5ibG9ja0xlbmd0aC90aGlzLnNhbXBsZVJhdGU7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzb3JzID0gW107XG4gICAgfVxuICAgIFxuICAgIHN0YXJ0U291bmQoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50cm9tYm9uZS52b2ljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vc2NyaXB0UHJvY2Vzc29yIG1heSBuZWVkIGEgZHVtbXkgaW5wdXQgY2hhbm5lbCBvbiBpT1NcbiAgICAgICAgICAgIGxldCBzY3JpcHRQcm9jZXNzb3IgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IodGhpcy5ibG9ja0xlbmd0aCwgMiwgMSk7XG4gICAgICAgICAgICBzY3JpcHRQcm9jZXNzb3IuY29ubmVjdCh0aGlzLmF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgICAgICAgICBzY3JpcHRQcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSAoZSkgPT4ge3RoaXMuZG9TY3JpcHRQcm9jZXNzb3IoZSwgaSl9O1xuICAgICAgICBcbiAgICAgICAgICAgIHZhciB3aGl0ZU5vaXNlID0gdGhpcy5jcmVhdGVXaGl0ZU5vaXNlTm9kZSgyICogdGhpcy5zYW1wbGVSYXRlKTsgLy8gMiBzZWNvbmRzIG9mIG5vaXNlXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBhc3BpcmF0ZUZpbHRlciA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICAgICAgICAgICAgYXNwaXJhdGVGaWx0ZXIudHlwZSA9IFwiYmFuZHBhc3NcIjtcbiAgICAgICAgICAgIGFzcGlyYXRlRmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IDUwMDtcbiAgICAgICAgICAgIGFzcGlyYXRlRmlsdGVyLlEudmFsdWUgPSAwLjU7XG4gICAgICAgICAgICB3aGl0ZU5vaXNlLmNvbm5lY3QoYXNwaXJhdGVGaWx0ZXIpOyAgLy8gVXNlIHdoaXRlIG5vaXNlIGFzIGlucHV0IGZvciBmaWx0ZXJcbiAgICAgICAgICAgIGFzcGlyYXRlRmlsdGVyLmNvbm5lY3Qoc2NyaXB0UHJvY2Vzc29yKTsgIC8vIFVzZSB0aGlzIGFzIGlucHV0IDAgZm9yIHNjcmlwdCBwcm9jZXNzb3JcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGZyaWNhdGl2ZUZpbHRlciA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICAgICAgICAgICAgZnJpY2F0aXZlRmlsdGVyLnR5cGUgPSBcImJhbmRwYXNzXCI7XG4gICAgICAgICAgICBmcmljYXRpdmVGaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gMTAwMDtcbiAgICAgICAgICAgIGZyaWNhdGl2ZUZpbHRlci5RLnZhbHVlID0gMC41O1xuICAgICAgICAgICAgd2hpdGVOb2lzZS5jb25uZWN0KGZyaWNhdGl2ZUZpbHRlcik7ICAvLyBVc2Ugd2hpdGUgbm9pc2UgYXMgaW5wdXRcbiAgICAgICAgICAgIGZyaWNhdGl2ZUZpbHRlci5jb25uZWN0KHNjcmlwdFByb2Nlc3Nvcik7ICAvLyBVc2UgdGhpcyBhcyBpbnB1dCAxIGZvciBzY3JpcHQgcHJvY2Vzc29yXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoaXRlTm9pc2Uuc3RhcnQoMCk7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NvcnMucHVzaChzY3JpcHRQcm9jZXNzb3IpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNyZWF0ZVdoaXRlTm9pc2VOb2RlKGZyYW1lQ291bnQpIHtcbiAgICAgICAgdmFyIG15QXJyYXlCdWZmZXIgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgZnJhbWVDb3VudCwgdGhpcy5zYW1wbGVSYXRlKTtcblxuICAgICAgICB2YXIgbm93QnVmZmVyaW5nID0gbXlBcnJheUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcmFtZUNvdW50OyBpKyspIFxuICAgICAgICB7XG4gICAgICAgICAgICBub3dCdWZmZXJpbmdbaV0gPSBNYXRoLnJhbmRvbSgpOy8vIGdhdXNzaWFuKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc291cmNlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgIHNvdXJjZS5idWZmZXIgPSBteUFycmF5QnVmZmVyO1xuICAgICAgICBzb3VyY2UubG9vcCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9XG4gICAgXG4gICAgZG9TY3JpcHRQcm9jZXNzb3IoZXZlbnQsIGluZGV4KSB7XG4gICAgICAgIHZhciBpbnB1dEFycmF5MSA9IGV2ZW50LmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDApOyAgLy8gR2xvdHRpcyBpbnB1dFxuICAgICAgICB2YXIgaW5wdXRBcnJheTIgPSBldmVudC5pbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSgxKTsgIC8vIFRyYWN0IGlucHV0XG4gICAgICAgIHZhciBvdXRBcnJheSA9IGV2ZW50Lm91dHB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTsgIC8vIE91dHB1dCAobW9ubylcblxuICAgICAgICBsZXQgdm9pY2UgPSB0aGlzLnRyb21ib25lLnZvaWNlc1tpbmRleF07XG5cbiAgICAgICAgbGV0IE4gPSBvdXRBcnJheS5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgaisrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbGFtYmRhMSA9IGovTjsgLy8gR29lcyBmcm9tIDAgdG8gMVxuICAgICAgICAgICAgdmFyIGxhbWJkYTIgPSAoaiswLjUpL047XG4gICAgICAgICAgICB2YXIgZ2xvdHRhbE91dHB1dCA9IHZvaWNlLmdsb3R0aXMucnVuU3RlcChsYW1iZGExLCBpbnB1dEFycmF5MVtqXSk7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdm9jYWxPdXRwdXQgPSAwO1xuICAgICAgICAgICAgLy9UcmFjdCBydW5zIGF0IHR3aWNlIHRoZSBzYW1wbGUgcmF0ZSBcbiAgICAgICAgICAgIHZvaWNlLnRyYWN0LnJ1blN0ZXAoZ2xvdHRhbE91dHB1dCwgaW5wdXRBcnJheTJbal0sIGxhbWJkYTEpO1xuICAgICAgICAgICAgdm9jYWxPdXRwdXQgKz0gdm9pY2UudHJhY3QubGlwT3V0cHV0ICsgdm9pY2UudHJhY3Qubm9zZU91dHB1dDtcbiAgICAgICAgICAgIHZvaWNlLnRyYWN0LnJ1blN0ZXAoZ2xvdHRhbE91dHB1dCwgaW5wdXRBcnJheTJbal0sIGxhbWJkYTIpO1xuICAgICAgICAgICAgdm9jYWxPdXRwdXQgKz0gdm9pY2UudHJhY3QubGlwT3V0cHV0ICsgdm9pY2UudHJhY3Qubm9zZU91dHB1dDtcbiAgICAgICAgICAgIG91dEFycmF5W2pdID0gdm9jYWxPdXRwdXQgKiAwLjEyNTtcblxuICAgICAgICAgICAgLy8gU29sdmVzIGJhY2tncm91bmQgaGlzc2luZyBwcm9ibGVtIGJ1dCBpbnRyb2R1Y2VzIHBvcHBpbmcuXG4gICAgICAgICAgICAvL2lmKHZvaWNlLmdsb3R0aXMubG91ZG5lc3MgPT0gMCkgb3V0QXJyYXlbal0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdm9pY2UuZ2xvdHRpcy5maW5pc2hCbG9jaygpO1xuICAgICAgICB2b2ljZS50cmFjdC5maW5pc2hCbG9jaygpO1xuICAgIH1cbiAgICBcbiAgICBtdXRlKCkge1xuICAgICAgICBmb3IobGV0IHByb2Nlc3NvciBvZiB0aGlzLnByb2Nlc3NvcnMpIHtcbiAgICAgICAgICAgIHByb2Nlc3Nvci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdW5tdXRlKCkge1xuICAgICAgICBmb3IobGV0IHByb2Nlc3NvciBvZiB0aGlzLnByb2Nlc3NvcnMpIHtcbiAgICAgICAgICAgIHByb2Nlc3Nvci5jb25uZWN0KHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn1cblxuZXhwb3J0cy5BdWRpb1N5c3RlbSA9IEF1ZGlvU3lzdGVtOyIsImltcG9ydCBub2lzZSBmcm9tIFwiLi4vbm9pc2UuanNcIjtcblxuY2xhc3MgR2xvdHRpcyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0cm9tYm9uZSkge1xuICAgICAgICB0aGlzLnRyb21ib25lID0gdHJvbWJvbmU7XG5cbiAgICAgICAgdGhpcy50aW1lSW5XYXZlZm9ybSA9IDA7XG4gICAgICAgIHRoaXMub2xkRnJlcXVlbmN5ID0gMTQwO1xuICAgICAgICB0aGlzLm5ld0ZyZXF1ZW5jeSA9IDE0MDtcbiAgICAgICAgdGhpcy5VSUZyZXF1ZW5jeSA9IDE0MDtcbiAgICAgICAgdGhpcy5zbW9vdGhGcmVxdWVuY3kgPSAxNDA7XG4gICAgICAgIHRoaXMub2xkVGVuc2VuZXNzID0gMC42O1xuICAgICAgICB0aGlzLm5ld1RlbnNlbmVzcyA9IDAuNjtcbiAgICAgICAgdGhpcy5VSVRlbnNlbmVzcyA9IDAuNjtcbiAgICAgICAgdGhpcy50b3RhbFRpbWUgPSAwO1xuICAgICAgICB0aGlzLnZpYnJhdG9BbW91bnQgPSAwLjAwNTtcbiAgICAgICAgdGhpcy52aWJyYXRvRnJlcXVlbmN5ID0gNjtcbiAgICAgICAgdGhpcy5pbnRlbnNpdHkgPSAwO1xuICAgICAgICB0aGlzLmxvdWRuZXNzID0gMTtcbiAgICAgICAgdGhpcy5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50b3VjaCA9IDA7XG4gICAgICAgIHRoaXMueCA9IDI0MDtcbiAgICAgICAgdGhpcy55ID0gNTMwO1xuXG4gICAgICAgIHRoaXMua2V5Ym9hcmRUb3AgPSA1MDA7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRMZWZ0ID0gMDtcbiAgICAgICAgdGhpcy5rZXlib2FyZFdpZHRoID0gNjAwO1xuICAgICAgICB0aGlzLmtleWJvYXJkSGVpZ2h0ID0gMTAwO1xuICAgICAgICB0aGlzLnNlbWl0b25lcyA9IDIwO1xuICAgICAgICB0aGlzLm1hcmtzID0gWzAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDBdO1xuICAgICAgICB0aGlzLmJhc2VOb3RlID0gODcuMzA3MTsgLy9GXG5cbiAgICAgICAgdGhpcy5vdXRwdXQ7XG5cbiAgICAgICAgLy8vIEFsbG93IHBpdGNoIHRvIHdvYmJsZSBvdmVyIHRpbWVcbiAgICAgICAgdGhpcy5hZGRQaXRjaFZhcmlhbmNlID0gdHJ1ZTtcbiAgICAgICAgLy8vIEFsbG93IHRlbnNlbmVzcyB0byB3b2JibGUgb3ZlciB0aW1lXG4gICAgICAgIHRoaXMuYWRkVGVuc2VuZXNzVmFyaWFuY2UgPSB0cnVlO1xuXG4gICAgfVxuICAgIFxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuc2V0dXBXYXZlZm9ybSgwKTtcbiAgICB9XG4gICAgXG4gICAgaGFuZGxlVG91Y2hlcygpIHtcbiAgICAgICAgaWYgKHRoaXMudG91Y2ggIT0gMCAmJiAhdGhpcy50b3VjaC5hbGl2ZSkgdGhpcy50b3VjaCA9IDA7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy50b3VjaCA9PSAwKVxuICAgICAgICB7ICAgICAgICBcbiAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajxVSS50b3VjaGVzV2l0aE1vdXNlLmxlbmd0aDsgaisrKSAgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHRvdWNoID0gVUkudG91Y2hlc1dpdGhNb3VzZVtqXTtcbiAgICAgICAgICAgICAgICBpZiAoIXRvdWNoLmFsaXZlKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAodG91Y2gueTx0aGlzLmtleWJvYXJkVG9wKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdWNoID0gdG91Y2g7XG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy50b3VjaCAhPSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbG9jYWxfeSA9IHRoaXMudG91Y2gueSAtICB0aGlzLmtleWJvYXJkVG9wLTEwO1xuICAgICAgICAgICAgdmFyIGxvY2FsX3ggPSB0aGlzLnRvdWNoLnggLSB0aGlzLmtleWJvYXJkTGVmdDtcbiAgICAgICAgICAgIGxvY2FsX3kgPSBNYXRoLmNsYW1wKGxvY2FsX3ksIDAsIHRoaXMua2V5Ym9hcmRIZWlnaHQtMjYpO1xuICAgICAgICAgICAgdmFyIHNlbWl0b25lID0gdGhpcy5zZW1pdG9uZXMgKiBsb2NhbF94IC8gdGhpcy5rZXlib2FyZFdpZHRoICsgMC41O1xuICAgICAgICAgICAgR2xvdHRpcy5VSUZyZXF1ZW5jeSA9IHRoaXMuYmFzZU5vdGUgKiBNYXRoLnBvdygyLCBzZW1pdG9uZS8xMik7XG4gICAgICAgICAgICBpZiAoR2xvdHRpcy5pbnRlbnNpdHkgPT0gMCkgR2xvdHRpcy5zbW9vdGhGcmVxdWVuY3kgPSBHbG90dGlzLlVJRnJlcXVlbmN5O1xuICAgICAgICAgICAgLy9HbG90dGlzLlVJUmQgPSAzKmxvY2FsX3kgLyAodGhpcy5rZXlib2FyZEhlaWdodC0yMCk7XG4gICAgICAgICAgICB2YXIgdCA9IE1hdGguY2xhbXAoMS1sb2NhbF95IC8gKHRoaXMua2V5Ym9hcmRIZWlnaHQtMjgpLCAwLCAxKTtcbiAgICAgICAgICAgIEdsb3R0aXMuVUlUZW5zZW5lc3MgPSAxLU1hdGguY29zKHQqTWF0aC5QSSowLjUpO1xuICAgICAgICAgICAgR2xvdHRpcy5sb3VkbmVzcyA9IE1hdGgucG93KEdsb3R0aXMuVUlUZW5zZW5lc3MsIDAuMjUpO1xuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy50b3VjaC54O1xuICAgICAgICAgICAgdGhpcy55ID0gbG9jYWxfeSArIHRoaXMua2V5Ym9hcmRUb3ArMTA7XG4gICAgICAgIH1cbiAgICAgICAgR2xvdHRpcy5pc1RvdWNoZWQgPSAodGhpcy50b3VjaCAhPSAwKTtcbiAgICB9XG4gICAgICAgIFxuICAgIHJ1blN0ZXAobGFtYmRhLCBub2lzZVNvdXJjZSkge1xuICAgICAgICB2YXIgdGltZVN0ZXAgPSAxLjAgLyB0aGlzLnRyb21ib25lLmF1ZGlvU3lzdGVtLnNhbXBsZVJhdGU7XG4gICAgICAgIHRoaXMudGltZUluV2F2ZWZvcm0gKz0gdGltZVN0ZXA7XG4gICAgICAgIHRoaXMudG90YWxUaW1lICs9IHRpbWVTdGVwO1xuICAgICAgICBpZiAodGhpcy50aW1lSW5XYXZlZm9ybSA+IHRoaXMud2F2ZWZvcm1MZW5ndGgpIFxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnRpbWVJbldhdmVmb3JtIC09IHRoaXMud2F2ZWZvcm1MZW5ndGg7XG4gICAgICAgICAgICB0aGlzLnNldHVwV2F2ZWZvcm0obGFtYmRhKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3V0ID0gdGhpcy5ub3JtYWxpemVkTEZXYXZlZm9ybSh0aGlzLnRpbWVJbldhdmVmb3JtL3RoaXMud2F2ZWZvcm1MZW5ndGgpO1xuICAgICAgICB2YXIgYXNwaXJhdGlvbiA9IHRoaXMuaW50ZW5zaXR5KigxLjAtTWF0aC5zcXJ0KHRoaXMuVUlUZW5zZW5lc3MpKSp0aGlzLmdldE5vaXNlTW9kdWxhdG9yKCkqbm9pc2VTb3VyY2U7XG4gICAgICAgIGFzcGlyYXRpb24gKj0gMC4yICsgMC4wMiAqIG5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lICogMS45OSk7XG4gICAgICAgIG91dCArPSBhc3BpcmF0aW9uO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBcbiAgICBnZXROb2lzZU1vZHVsYXRvcigpIHtcbiAgICAgICAgdmFyIHZvaWNlZCA9IDAuMSswLjIqTWF0aC5tYXgoMCxNYXRoLnNpbihNYXRoLlBJKjIqdGhpcy50aW1lSW5XYXZlZm9ybS90aGlzLndhdmVmb3JtTGVuZ3RoKSk7XG4gICAgICAgIC8vcmV0dXJuIDAuMztcbiAgICAgICAgcmV0dXJuIHRoaXMuVUlUZW5zZW5lc3MqIHRoaXMuaW50ZW5zaXR5ICogdm9pY2VkICsgKDEtdGhpcy5VSVRlbnNlbmVzcyogdGhpcy5pbnRlbnNpdHkgKSAqIDAuMztcbiAgICB9XG4gICAgXG4gICAgZmluaXNoQmxvY2soKSB7XG4gICAgICAgIHZhciB2aWJyYXRvID0gMDtcbiAgICAgICAgaWYgKHRoaXMuYWRkUGl0Y2hWYXJpYW5jZSkge1xuICAgICAgICAgICAgLy8gQWRkIHNtYWxsIGltcGVyZmVjdGlvbnMgdG8gdGhlIHZvY2FsIG91dHB1dFxuICAgICAgICAgICAgdmlicmF0byArPSB0aGlzLnZpYnJhdG9BbW91bnQgKiBNYXRoLnNpbigyKk1hdGguUEkgKiB0aGlzLnRvdGFsVGltZSAqdGhpcy52aWJyYXRvRnJlcXVlbmN5KTsgICAgICAgICAgXG4gICAgICAgICAgICB2aWJyYXRvICs9IDAuMDIgKiBub2lzZS5zaW1wbGV4MSh0aGlzLnRvdGFsVGltZSAqIDQuMDcpO1xuICAgICAgICAgICAgdmlicmF0byArPSAwLjA0ICogbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUgKiAyLjE1KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMudHJvbWJvbmUuYXV0b1dvYmJsZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmlicmF0byArPSAwLjIgKiBub2lzZS5zaW1wbGV4MSh0aGlzLnRvdGFsVGltZSAqIDAuOTgpO1xuICAgICAgICAgICAgdmlicmF0byArPSAwLjQgKiBub2lzZS5zaW1wbGV4MSh0aGlzLnRvdGFsVGltZSAqIDAuNSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5VSUZyZXF1ZW5jeT50aGlzLnNtb290aEZyZXF1ZW5jeSkgXG4gICAgICAgICAgICB0aGlzLnNtb290aEZyZXF1ZW5jeSA9IE1hdGgubWluKHRoaXMuc21vb3RoRnJlcXVlbmN5ICogMS4xLCB0aGlzLlVJRnJlcXVlbmN5KTtcbiAgICAgICAgaWYgKHRoaXMuVUlGcmVxdWVuY3k8dGhpcy5zbW9vdGhGcmVxdWVuY3kpIFxuICAgICAgICAgICAgdGhpcy5zbW9vdGhGcmVxdWVuY3kgPSBNYXRoLm1heCh0aGlzLnNtb290aEZyZXF1ZW5jeSAvIDEuMSwgdGhpcy5VSUZyZXF1ZW5jeSk7XG4gICAgICAgIHRoaXMub2xkRnJlcXVlbmN5ID0gdGhpcy5uZXdGcmVxdWVuY3k7XG4gICAgICAgIHRoaXMubmV3RnJlcXVlbmN5ID0gdGhpcy5zbW9vdGhGcmVxdWVuY3kgKiAoMSt2aWJyYXRvKTtcbiAgICAgICAgdGhpcy5vbGRUZW5zZW5lc3MgPSB0aGlzLm5ld1RlbnNlbmVzcztcblxuICAgICAgICBpZiAodGhpcy5hZGRUZW5zZW5lc3NWYXJpYW5jZSlcbiAgICAgICAgICAgIHRoaXMubmV3VGVuc2VuZXNzID0gdGhpcy5VSVRlbnNlbmVzcyArIDAuMSpub2lzZS5zaW1wbGV4MSh0aGlzLnRvdGFsVGltZSowLjQ2KSswLjA1Km5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lKjAuMzYpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLm5ld1RlbnNlbmVzcyA9IHRoaXMuVUlUZW5zZW5lc3M7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzVG91Y2hlZCAmJiB0aGlzLnRyb21ib25lLmFsd2F5c1ZvaWNlKSB0aGlzLm5ld1RlbnNlbmVzcyArPSAoMy10aGlzLlVJVGVuc2VuZXNzKSooMS10aGlzLmludGVuc2l0eSk7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5pc1RvdWNoZWQgfHwgdGhpcy50cm9tYm9uZS5hbHdheXNWb2ljZSlcbiAgICAgICAgICAgIHRoaXMuaW50ZW5zaXR5ICs9IDAuMTM7XG4gICAgICAgIHRoaXMuaW50ZW5zaXR5ID0gTWF0aC5jbGFtcCh0aGlzLmludGVuc2l0eSwgMCwgMSk7XG4gICAgfVxuICAgIFxuICAgIC8vLyBRdWV1ZXMgdXAgYSBzaW5nbGUgd2F2ZT9cbiAgICBzZXR1cFdhdmVmb3JtKGxhbWJkYSkge1xuICAgICAgICB0aGlzLmZyZXF1ZW5jeSA9IHRoaXMub2xkRnJlcXVlbmN5KigxLWxhbWJkYSkgKyB0aGlzLm5ld0ZyZXF1ZW5jeSpsYW1iZGE7XG4gICAgICAgIHZhciB0ZW5zZW5lc3MgPSB0aGlzLm9sZFRlbnNlbmVzcyooMS1sYW1iZGEpICsgdGhpcy5uZXdUZW5zZW5lc3MqbGFtYmRhO1xuICAgICAgICB0aGlzLlJkID0gMyooMS10ZW5zZW5lc3MpO1xuICAgICAgICB0aGlzLndhdmVmb3JtTGVuZ3RoID0gMS4wL3RoaXMuZnJlcXVlbmN5O1xuICAgICAgICBcbiAgICAgICAgdmFyIFJkID0gdGhpcy5SZDtcbiAgICAgICAgaWYgKFJkPDAuNSkgUmQgPSAwLjU7XG4gICAgICAgIGlmIChSZD4yLjcpIFJkID0gMi43O1xuICAgICAgICAvLyBub3JtYWxpemVkIHRvIHRpbWUgPSAxLCBFZSA9IDFcbiAgICAgICAgdmFyIFJhID0gLTAuMDEgKyAwLjA0OCpSZDtcbiAgICAgICAgdmFyIFJrID0gMC4yMjQgKyAwLjExOCpSZDtcbiAgICAgICAgdmFyIFJnID0gKFJrLzQpKigwLjUrMS4yKlJrKS8oMC4xMSpSZC1SYSooMC41KzEuMipSaykpO1xuICAgICAgICBcbiAgICAgICAgdmFyIFRhID0gUmE7XG4gICAgICAgIHZhciBUcCA9IDEgLyAoMipSZyk7XG4gICAgICAgIHZhciBUZSA9IFRwICsgVHAqUms7IC8vXG4gICAgICAgIFxuICAgICAgICB2YXIgZXBzaWxvbiA9IDEvVGE7XG4gICAgICAgIHZhciBzaGlmdCA9IE1hdGguZXhwKC1lcHNpbG9uICogKDEtVGUpKTtcbiAgICAgICAgdmFyIERlbHRhID0gMSAtIHNoaWZ0OyAvL2RpdmlkZSBieSB0aGlzIHRvIHNjYWxlIFJIU1xuICAgICAgICAgICBcbiAgICAgICAgdmFyIFJIU0ludGVncmFsID0gKDEvZXBzaWxvbikqKHNoaWZ0IC0gMSkgKyAoMS1UZSkqc2hpZnQ7XG4gICAgICAgIFJIU0ludGVncmFsID0gUkhTSW50ZWdyYWwvRGVsdGE7XG4gICAgICAgIFxuICAgICAgICB2YXIgdG90YWxMb3dlckludGVncmFsID0gLSAoVGUtVHApLzIgKyBSSFNJbnRlZ3JhbDtcbiAgICAgICAgdmFyIHRvdGFsVXBwZXJJbnRlZ3JhbCA9IC10b3RhbExvd2VySW50ZWdyYWw7XG4gICAgICAgIFxuICAgICAgICB2YXIgb21lZ2EgPSBNYXRoLlBJL1RwO1xuICAgICAgICB2YXIgcyA9IE1hdGguc2luKG9tZWdhKlRlKTtcbiAgICAgICAgdmFyIHkgPSAtTWF0aC5QSSpzKnRvdGFsVXBwZXJJbnRlZ3JhbCAvIChUcCoyKTtcbiAgICAgICAgdmFyIHogPSBNYXRoLmxvZyh5KTtcbiAgICAgICAgdmFyIGFscGhhID0gei8oVHAvMiAtIFRlKTtcbiAgICAgICAgdmFyIEUwID0gLTEgLyAocypNYXRoLmV4cChhbHBoYSpUZSkpO1xuICAgICAgICB0aGlzLmFscGhhID0gYWxwaGE7XG4gICAgICAgIHRoaXMuRTAgPSBFMDtcbiAgICAgICAgdGhpcy5lcHNpbG9uID0gZXBzaWxvbjtcbiAgICAgICAgdGhpcy5zaGlmdCA9IHNoaWZ0O1xuICAgICAgICB0aGlzLkRlbHRhID0gRGVsdGE7XG4gICAgICAgIHRoaXMuVGU9VGU7XG4gICAgICAgIHRoaXMub21lZ2EgPSBvbWVnYTtcbiAgICB9XG4gICAgXG4gXG4gICAgbm9ybWFsaXplZExGV2F2ZWZvcm0odCkgeyAgICAgXG4gICAgICAgIGlmICh0PnRoaXMuVGUpIHRoaXMub3V0cHV0ID0gKC1NYXRoLmV4cCgtdGhpcy5lcHNpbG9uICogKHQtdGhpcy5UZSkpICsgdGhpcy5zaGlmdCkvdGhpcy5EZWx0YTtcbiAgICAgICAgZWxzZSB0aGlzLm91dHB1dCA9IHRoaXMuRTAgKiBNYXRoLmV4cCh0aGlzLmFscGhhKnQpICogTWF0aC5zaW4odGhpcy5vbWVnYSAqIHQpO1xuICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0cHV0ICogdGhpcy5pbnRlbnNpdHkgKiB0aGlzLmxvdWRuZXNzO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgR2xvdHRpcyB9OyIsImNsYXNzIFRyYWN0VUlcbntcblxuICAgIGNvbnN0cnVjdG9yKHRyb21ib25lLCB0cmFjdCkge1xuICAgICAgICB0aGlzLnRyb21ib25lID0gdHJvbWJvbmU7XG4gICAgICAgIHRoaXMudHJhY3QgPSB0cmFjdDtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub3JpZ2luWCA9IDM0MDsgXG4gICAgICAgIHRoaXMub3JpZ2luWSA9IDQ0OTsgXG4gICAgICAgIHRoaXMucmFkaXVzID0gMjk4OyBcbiAgICAgICAgdGhpcy5zY2FsZSA9IDYwO1xuICAgICAgICB0aGlzLnRvbmd1ZUluZGV4ID0gMTIuOTtcbiAgICAgICAgdGhpcy50b25ndWVEaWFtZXRlciA9IDIuNDM7XG4gICAgICAgIHRoaXMuaW5uZXJUb25ndWVDb250cm9sUmFkaXVzID0gMi4wNTtcbiAgICAgICAgdGhpcy5vdXRlclRvbmd1ZUNvbnRyb2xSYWRpdXMgPSAzLjU7XG4gICAgICAgIHRoaXMudG9uZ3VlVG91Y2ggPSAwO1xuICAgICAgICB0aGlzLmFuZ2xlU2NhbGUgPSAwLjY0O1xuICAgICAgICB0aGlzLmFuZ2xlT2Zmc2V0ID0gLTAuMjQ7XG4gICAgICAgIHRoaXMubm9zZU9mZnNldCA9IDAuODtcbiAgICAgICAgdGhpcy5ncmlkT2Zmc2V0ID0gMS43O1xuXG4gICAgICAgIC8vLyBGaW5hbCBvcGVubmVzcyBvZiB0aGUgbW91dGggKGNsb3NlciB0byAwIGlzIG1vcmUgY2xvc2VkKVxuICAgICAgICB0aGlzLnRhcmdldCA9IDAuMTtcbiAgICAgICAgLy8vIEluZGV4IGluIHRoZSB0aHJvYXQgYXJyYXkgdG8gbW92ZSB0byB0YXJnZXRcbiAgICAgICAgdGhpcy5pbmRleCA9IDQyO1xuICAgICAgICAvLy8gTnVtYmVyIG9mIHRocm9hdCBzZWdtZW50cyB0byBjbG9zZSBhcm91bmQgdGhlIGluZGV4XG4gICAgICAgIHRoaXMucmFkaXVzID0gMDtcbiAgICB9XG4gICAgXG4gICAgaW5pdCgpIHtcbiAgICAgICAgbGV0IFRyYWN0ID0gdGhpcy50cmFjdDtcblxuICAgICAgICB0aGlzLnNldFJlc3REaWFtZXRlcigpO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8VHJhY3QubjsgaSsrKSBcbiAgICAgICAge1xuICAgICAgICAgICAgVHJhY3QuZGlhbWV0ZXJbaV0gPSBUcmFjdC50YXJnZXREaWFtZXRlcltpXSA9IFRyYWN0LnJlc3REaWFtZXRlcltpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9uZ3VlTG93ZXJJbmRleEJvdW5kID0gVHJhY3QuYmxhZGVTdGFydCsyO1xuICAgICAgICB0aGlzLnRvbmd1ZVVwcGVySW5kZXhCb3VuZCA9IFRyYWN0LnRpcFN0YXJ0LTM7XG4gICAgICAgIHRoaXMudG9uZ3VlSW5kZXhDZW50cmUgPSAwLjUqKHRoaXMudG9uZ3VlTG93ZXJJbmRleEJvdW5kK3RoaXMudG9uZ3VlVXBwZXJJbmRleEJvdW5kKTtcbiAgICB9XG4gICAgICAgIFxuICAgIGdldEluZGV4KHgseSkge1xuICAgICAgICBsZXQgVHJhY3QgPSB0aGlzLnRyYWN0O1xuXG4gICAgICAgIHZhciB4eCA9IHgtdGhpcy5vcmlnaW5YOyB2YXIgeXkgPSB5LXRoaXMub3JpZ2luWTtcbiAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMih5eSwgeHgpO1xuICAgICAgICB3aGlsZSAoYW5nbGU+IDApIGFuZ2xlIC09IDIqTWF0aC5QSTtcbiAgICAgICAgcmV0dXJuIChNYXRoLlBJICsgYW5nbGUgLSB0aGlzLmFuZ2xlT2Zmc2V0KSooVHJhY3QubGlwU3RhcnQtMSkgLyAodGhpcy5hbmdsZVNjYWxlKk1hdGguUEkpO1xuICAgIH1cblxuICAgIGdldERpYW1ldGVyKHgseSkge1xuICAgICAgICB2YXIgeHggPSB4LXRoaXMub3JpZ2luWDsgdmFyIHl5ID0geS10aGlzLm9yaWdpblk7XG4gICAgICAgIHJldHVybiAodGhpcy5yYWRpdXMtTWF0aC5zcXJ0KHh4Knh4ICsgeXkqeXkpKS90aGlzLnNjYWxlO1xuICAgIH1cbiAgICBcbiAgICBzZXRSZXN0RGlhbWV0ZXIoKSB7XG4gICAgICAgIGxldCBUcmFjdCA9IHRoaXMudHJhY3Q7XG5cbiAgICAgICAgZm9yICh2YXIgaT1UcmFjdC5ibGFkZVN0YXJ0OyBpPFRyYWN0LmxpcFN0YXJ0OyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0ID0gMS4xICogTWF0aC5QSSoodGhpcy50b25ndWVJbmRleCAtIGkpLyhUcmFjdC50aXBTdGFydCAtIFRyYWN0LmJsYWRlU3RhcnQpO1xuICAgICAgICAgICAgdmFyIGZpeGVkVG9uZ3VlRGlhbWV0ZXIgPSAyKyh0aGlzLnRvbmd1ZURpYW1ldGVyLTIpLzEuNTtcbiAgICAgICAgICAgIHZhciBjdXJ2ZSA9ICgxLjUtZml4ZWRUb25ndWVEaWFtZXRlcit0aGlzLmdyaWRPZmZzZXQpKk1hdGguY29zKHQpO1xuICAgICAgICAgICAgaWYgKGkgPT0gVHJhY3QuYmxhZGVTdGFydC0yIHx8IGkgPT0gVHJhY3QubGlwU3RhcnQtMSkgY3VydmUgKj0gMC44O1xuICAgICAgICAgICAgaWYgKGkgPT0gVHJhY3QuYmxhZGVTdGFydCB8fCBpID09IFRyYWN0LmxpcFN0YXJ0LTIpIGN1cnZlICo9IDAuOTQ7ICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBUcmFjdC5yZXN0RGlhbWV0ZXJbaV0gPSAxLjUgLSBjdXJ2ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGxpcHMgb2YgdGhlIG1vZGVsZWQgdHJhY3QgdG8gYmUgY2xvc2VkIGJ5IHRoZSBzcGVjaWZpZWQgYW1vdW50LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcm9ncmVzcyBQZXJjZW50YWdlIGNsb3NlZCAobnVtYmVyIGJldHdlZW4gMCBhbmQgMSlcbiAgICAgKi9cbiAgICBTZXRMaXBzQ2xvc2VkKHByb2dyZXNzKSB7XG5cbiAgICAgICAgbGV0IFRyYWN0ID0gdGhpcy50cmFjdDtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0UmVzdERpYW1ldGVyKCk7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxUcmFjdC5uOyBpKyspIFRyYWN0LnRhcmdldERpYW1ldGVyW2ldID0gVHJhY3QucmVzdERpYW1ldGVyW2ldOyAgICBcblxuICAgICAgICAvLyBEaXNhYmxlIHRoaXMgYmVoYXZpb3IgaWYgdGhlIG1vdXRoIGlzIGNsb3NlZCBhIGNlcnRhaW4gYW1vdW50XG4gICAgICAgIC8vaWYgKHByb2dyZXNzID4gMC44IHx8IHByb2dyZXNzIDwgMC4xKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBmb3IobGV0IGk9IHRoaXMuaW5kZXggLSB0aGlzLnJhZGl1czsgaSA8PSB0aGlzLmluZGV4ICsgdGhpcy5yYWRpdXM7IGkrKyl7XG4gICAgICAgICAgICBpZiAoaSA+IFRyYWN0LnRhcmdldERpYW1ldGVyLmxlbmd0aCB8fCBpIDwgMCkgY29udGludWU7XG4gICAgICAgICAgICBsZXQgaW50ZXJwID0gTWF0aC5sZXJwKFRyYWN0LnJlc3REaWFtZXRlcltpXSwgdGhpcy50YXJnZXQsIHByb2dyZXNzKTtcbiAgICAgICAgICAgIFRyYWN0LnRhcmdldERpYW1ldGVyW2ldID0gaW50ZXJwO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cblxuZXhwb3J0IHsgVHJhY3RVSSB9OyIsImNsYXNzIFRyYWN0IHtcblxuICAgIGNvbnN0cnVjdG9yKHRyb21ib25lLCBnbG90dGlzKSB7XG4gICAgICAgIHRoaXMudHJvbWJvbmUgPSB0cm9tYm9uZTtcbiAgICAgICAgdGhpcy5nbG90dGlzID0gZ2xvdHRpcztcbiAgICAgICAgXG4gICAgICAgIHRoaXMubiA9IDQ0O1xuICAgICAgICB0aGlzLmJsYWRlU3RhcnQgPSAxMDtcbiAgICAgICAgdGhpcy50aXBTdGFydCA9IDMyO1xuICAgICAgICB0aGlzLmxpcFN0YXJ0ID0gMzk7XG4gICAgICAgIHRoaXMuUiA9IFtdOyAvL2NvbXBvbmVudCBnb2luZyByaWdodFxuICAgICAgICB0aGlzLkwgPSBbXTsgLy9jb21wb25lbnQgZ29pbmcgbGVmdFxuICAgICAgICB0aGlzLnJlZmxlY3Rpb24gPSBbXTtcbiAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dFIgPSBbXTtcbiAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dEwgPSBbXTtcbiAgICAgICAgdGhpcy5tYXhBbXBsaXR1ZGUgPSBbXTtcbiAgICAgICAgdGhpcy5kaWFtZXRlciA9IFtdO1xuICAgICAgICB0aGlzLnJlc3REaWFtZXRlciA9IFtdO1xuICAgICAgICB0aGlzLnRhcmdldERpYW1ldGVyID0gW107XG4gICAgICAgIHRoaXMubmV3RGlhbWV0ZXIgPSBbXTtcbiAgICAgICAgdGhpcy5BID0gW107XG4gICAgICAgIHRoaXMuZ2xvdHRhbFJlZmxlY3Rpb24gPSAwLjc1O1xuICAgICAgICB0aGlzLmxpcFJlZmxlY3Rpb24gPSAtMC44NTtcbiAgICAgICAgdGhpcy5sYXN0T2JzdHJ1Y3Rpb24gPSAtMTtcbiAgICAgICAgdGhpcy5mYWRlID0gMS4wOyAvLzAuOTk5OSxcbiAgICAgICAgdGhpcy5tb3ZlbWVudFNwZWVkID0gMTU7IC8vY20gcGVyIHNlY29uZFxuICAgICAgICB0aGlzLnRyYW5zaWVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5saXBPdXRwdXQgPSAwO1xuICAgICAgICB0aGlzLm5vc2VPdXRwdXQgPSAwO1xuICAgICAgICB0aGlzLnZlbHVtVGFyZ2V0ID0gMC4wMTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmJsYWRlU3RhcnQgPSBNYXRoLmZsb29yKHRoaXMuYmxhZGVTdGFydCp0aGlzLm4vNDQpO1xuICAgICAgICB0aGlzLnRpcFN0YXJ0ID0gTWF0aC5mbG9vcih0aGlzLnRpcFN0YXJ0KnRoaXMubi80NCk7XG4gICAgICAgIHRoaXMubGlwU3RhcnQgPSBNYXRoLmZsb29yKHRoaXMubGlwU3RhcnQqdGhpcy5uLzQ0KTsgICAgICAgIFxuICAgICAgICB0aGlzLmRpYW1ldGVyID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICB0aGlzLnJlc3REaWFtZXRlciA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKTtcbiAgICAgICAgdGhpcy50YXJnZXREaWFtZXRlciA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKTtcbiAgICAgICAgdGhpcy5uZXdEaWFtZXRlciA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubjsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZGlhbWV0ZXIgPSAwO1xuICAgICAgICAgICAgaWYgKGk8Nyp0aGlzLm4vNDQtMC41KSBkaWFtZXRlciA9IDAuNjtcbiAgICAgICAgICAgIGVsc2UgaWYgKGk8MTIqdGhpcy5uLzQ0KSBkaWFtZXRlciA9IDEuMTtcbiAgICAgICAgICAgIGVsc2UgZGlhbWV0ZXIgPSAxLjU7XG4gICAgICAgICAgICB0aGlzLmRpYW1ldGVyW2ldID0gdGhpcy5yZXN0RGlhbWV0ZXJbaV0gPSB0aGlzLnRhcmdldERpYW1ldGVyW2ldID0gdGhpcy5uZXdEaWFtZXRlcltpXSA9IGRpYW1ldGVyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuUiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKTtcbiAgICAgICAgdGhpcy5MID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICB0aGlzLnJlZmxlY3Rpb24gPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubisxKTtcbiAgICAgICAgdGhpcy5uZXdSZWZsZWN0aW9uID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4rMSk7XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRSID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4rMSk7XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRMID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4rMSk7XG4gICAgICAgIHRoaXMuQSA9bmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICB0aGlzLm1heEFtcGxpdHVkZSA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMubm9zZUxlbmd0aCA9IE1hdGguZmxvb3IoMjgqdGhpcy5uLzQ0KVxuICAgICAgICB0aGlzLm5vc2VTdGFydCA9IHRoaXMubi10aGlzLm5vc2VMZW5ndGggKyAxO1xuICAgICAgICB0aGlzLm5vc2VSID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgpO1xuICAgICAgICB0aGlzLm5vc2VMID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgpO1xuICAgICAgICB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dFIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCsxKTtcbiAgICAgICAgdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRMID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgrMSk7ICAgICAgICBcbiAgICAgICAgdGhpcy5ub3NlUmVmbGVjdGlvbiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKzEpO1xuICAgICAgICB0aGlzLm5vc2VEaWFtZXRlciA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ub3NlQSA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ub3NlTWF4QW1wbGl0dWRlID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgpO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5ub3NlTGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBkaWFtZXRlcjtcbiAgICAgICAgICAgIHZhciBkID0gMiooaS90aGlzLm5vc2VMZW5ndGgpO1xuICAgICAgICAgICAgaWYgKGQ8MSkgZGlhbWV0ZXIgPSAwLjQrMS42KmQ7XG4gICAgICAgICAgICBlbHNlIGRpYW1ldGVyID0gMC41KzEuNSooMi1kKTtcbiAgICAgICAgICAgIGRpYW1ldGVyID0gTWF0aC5taW4oZGlhbWV0ZXIsIDEuOSk7XG4gICAgICAgICAgICB0aGlzLm5vc2VEaWFtZXRlcltpXSA9IGRpYW1ldGVyO1xuICAgICAgICB9ICAgICAgIFxuICAgICAgICB0aGlzLm5ld1JlZmxlY3Rpb25MZWZ0ID0gdGhpcy5uZXdSZWZsZWN0aW9uUmlnaHQgPSB0aGlzLm5ld1JlZmxlY3Rpb25Ob3NlID0gMDtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVSZWZsZWN0aW9ucygpOyAgICAgICAgXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlTm9zZVJlZmxlY3Rpb25zKCk7XG4gICAgICAgIHRoaXMubm9zZURpYW1ldGVyWzBdID0gdGhpcy52ZWx1bVRhcmdldDtcbiAgICB9XG4gICAgXG4gICAgcmVzaGFwZVRyYWN0KGRlbHRhVGltZSkge1xuICAgICAgICB2YXIgYW1vdW50ID0gZGVsdGFUaW1lICogdGhpcy5tb3ZlbWVudFNwZWVkOyA7ICAgIFxuICAgICAgICB2YXIgbmV3TGFzdE9ic3RydWN0aW9uID0gLTE7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm47IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGRpYW1ldGVyID0gdGhpcy5kaWFtZXRlcltpXTtcbiAgICAgICAgICAgIHZhciB0YXJnZXREaWFtZXRlciA9IHRoaXMudGFyZ2V0RGlhbWV0ZXJbaV07XG4gICAgICAgICAgICBpZiAoZGlhbWV0ZXIgPD0gMCkgbmV3TGFzdE9ic3RydWN0aW9uID0gaTtcbiAgICAgICAgICAgIHZhciBzbG93UmV0dXJuOyBcbiAgICAgICAgICAgIGlmIChpPHRoaXMubm9zZVN0YXJ0KSBzbG93UmV0dXJuID0gMC42O1xuICAgICAgICAgICAgZWxzZSBpZiAoaSA+PSB0aGlzLnRpcFN0YXJ0KSBzbG93UmV0dXJuID0gMS4wOyBcbiAgICAgICAgICAgIGVsc2Ugc2xvd1JldHVybiA9IDAuNiswLjQqKGktdGhpcy5ub3NlU3RhcnQpLyh0aGlzLnRpcFN0YXJ0LXRoaXMubm9zZVN0YXJ0KTtcbiAgICAgICAgICAgIHRoaXMuZGlhbWV0ZXJbaV0gPSBNYXRoLm1vdmVUb3dhcmRzKGRpYW1ldGVyLCB0YXJnZXREaWFtZXRlciwgc2xvd1JldHVybiphbW91bnQsIDIqYW1vdW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5sYXN0T2JzdHJ1Y3Rpb24+LTEgJiYgbmV3TGFzdE9ic3RydWN0aW9uID09IC0xICYmIHRoaXMubm9zZUFbMF08MC4wNSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5hZGRUcmFuc2llbnQodGhpcy5sYXN0T2JzdHJ1Y3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdE9ic3RydWN0aW9uID0gbmV3TGFzdE9ic3RydWN0aW9uO1xuICAgICAgICBcbiAgICAgICAgYW1vdW50ID0gZGVsdGFUaW1lICogdGhpcy5tb3ZlbWVudFNwZWVkOyBcbiAgICAgICAgdGhpcy5ub3NlRGlhbWV0ZXJbMF0gPSBNYXRoLm1vdmVUb3dhcmRzKHRoaXMubm9zZURpYW1ldGVyWzBdLCB0aGlzLnZlbHVtVGFyZ2V0LCBcbiAgICAgICAgICAgICAgICBhbW91bnQqMC4yNSwgYW1vdW50KjAuMSk7XG4gICAgICAgIHRoaXMubm9zZUFbMF0gPSB0aGlzLm5vc2VEaWFtZXRlclswXSp0aGlzLm5vc2VEaWFtZXRlclswXTsgICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBjYWxjdWxhdGVSZWZsZWN0aW9ucygpIHtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubjsgaSsrKSBcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5BW2ldID0gdGhpcy5kaWFtZXRlcltpXSp0aGlzLmRpYW1ldGVyW2ldOyAvL2lnbm9yaW5nIFBJIGV0Yy5cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpPTE7IGk8dGhpcy5uOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucmVmbGVjdGlvbltpXSA9IHRoaXMubmV3UmVmbGVjdGlvbltpXTtcbiAgICAgICAgICAgIGlmICh0aGlzLkFbaV0gPT0gMCkgdGhpcy5uZXdSZWZsZWN0aW9uW2ldID0gMC45OTk7IC8vdG8gcHJldmVudCBzb21lIGJhZCBiZWhhdmlvdXIgaWYgMFxuICAgICAgICAgICAgZWxzZSB0aGlzLm5ld1JlZmxlY3Rpb25baV0gPSAodGhpcy5BW2ktMV0tdGhpcy5BW2ldKSAvICh0aGlzLkFbaS0xXSt0aGlzLkFbaV0pOyBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy9ub3cgYXQganVuY3Rpb24gd2l0aCBub3NlXG5cbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uTGVmdCA9IHRoaXMubmV3UmVmbGVjdGlvbkxlZnQ7XG4gICAgICAgIHRoaXMucmVmbGVjdGlvblJpZ2h0ID0gdGhpcy5uZXdSZWZsZWN0aW9uUmlnaHQ7XG4gICAgICAgIHRoaXMucmVmbGVjdGlvbk5vc2UgPSB0aGlzLm5ld1JlZmxlY3Rpb25Ob3NlO1xuICAgICAgICB2YXIgc3VtID0gdGhpcy5BW3RoaXMubm9zZVN0YXJ0XSt0aGlzLkFbdGhpcy5ub3NlU3RhcnQrMV0rdGhpcy5ub3NlQVswXTtcbiAgICAgICAgdGhpcy5uZXdSZWZsZWN0aW9uTGVmdCA9ICgyKnRoaXMuQVt0aGlzLm5vc2VTdGFydF0tc3VtKS9zdW07XG4gICAgICAgIHRoaXMubmV3UmVmbGVjdGlvblJpZ2h0ID0gKDIqdGhpcy5BW3RoaXMubm9zZVN0YXJ0KzFdLXN1bSkvc3VtOyAgIFxuICAgICAgICB0aGlzLm5ld1JlZmxlY3Rpb25Ob3NlID0gKDIqdGhpcy5ub3NlQVswXS1zdW0pL3N1bTsgICAgICBcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVOb3NlUmVmbGVjdGlvbnMoKSB7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm5vc2VMZW5ndGg7IGkrKykgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubm9zZUFbaV0gPSB0aGlzLm5vc2VEaWFtZXRlcltpXSp0aGlzLm5vc2VEaWFtZXRlcltpXTsgXG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaT0xOyBpPHRoaXMubm9zZUxlbmd0aDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm5vc2VSZWZsZWN0aW9uW2ldID0gKHRoaXMubm9zZUFbaS0xXS10aGlzLm5vc2VBW2ldKSAvICh0aGlzLm5vc2VBW2ktMV0rdGhpcy5ub3NlQVtpXSk7IFxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJ1blN0ZXAoZ2xvdHRhbE91dHB1dCwgdHVyYnVsZW5jZU5vaXNlLCBsYW1iZGEpIHtcbiAgICAgICAgdmFyIHVwZGF0ZUFtcGxpdHVkZXMgPSAoTWF0aC5yYW5kb20oKTwwLjEpO1xuICAgIFxuICAgICAgICAvL21vdXRoXG4gICAgICAgIHRoaXMucHJvY2Vzc1RyYW5zaWVudHMoKTtcbiAgICAgICAgdGhpcy5hZGRUdXJidWxlbmNlTm9pc2UodHVyYnVsZW5jZU5vaXNlKTtcbiAgICAgICAgXG4gICAgICAgIC8vdGhpcy5nbG90dGFsUmVmbGVjdGlvbiA9IC0wLjggKyAxLjYgKiBHbG90dGlzLm5ld1RlbnNlbmVzcztcbiAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dFJbMF0gPSB0aGlzLkxbMF0gKiB0aGlzLmdsb3R0YWxSZWZsZWN0aW9uICsgZ2xvdHRhbE91dHB1dDtcbiAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dExbdGhpcy5uXSA9IHRoaXMuUlt0aGlzLm4tMV0gKiB0aGlzLmxpcFJlZmxlY3Rpb247IFxuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaT0xOyBpPHRoaXMubjsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgciA9IHRoaXMucmVmbGVjdGlvbltpXSAqICgxLWxhbWJkYSkgKyB0aGlzLm5ld1JlZmxlY3Rpb25baV0qbGFtYmRhO1xuICAgICAgICAgICAgdmFyIHcgPSByICogKHRoaXMuUltpLTFdICsgdGhpcy5MW2ldKTtcbiAgICAgICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRSW2ldID0gdGhpcy5SW2ktMV0gLSB3O1xuICAgICAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dExbaV0gPSB0aGlzLkxbaV0gKyB3O1xuICAgICAgICB9ICAgIFxuICAgICAgICBcbiAgICAgICAgLy9ub3cgYXQganVuY3Rpb24gd2l0aCBub3NlXG4gICAgICAgIHZhciBpID0gdGhpcy5ub3NlU3RhcnQ7XG4gICAgICAgIHZhciByID0gdGhpcy5uZXdSZWZsZWN0aW9uTGVmdCAqICgxLWxhbWJkYSkgKyB0aGlzLnJlZmxlY3Rpb25MZWZ0KmxhbWJkYTtcbiAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dExbaV0gPSByKnRoaXMuUltpLTFdKygxK3IpKih0aGlzLm5vc2VMWzBdK3RoaXMuTFtpXSk7XG4gICAgICAgIHIgPSB0aGlzLm5ld1JlZmxlY3Rpb25SaWdodCAqICgxLWxhbWJkYSkgKyB0aGlzLnJlZmxlY3Rpb25SaWdodCpsYW1iZGE7XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRSW2ldID0gcip0aGlzLkxbaV0rKDErcikqKHRoaXMuUltpLTFdK3RoaXMubm9zZUxbMF0pOyAgICAgXG4gICAgICAgIHIgPSB0aGlzLm5ld1JlZmxlY3Rpb25Ob3NlICogKDEtbGFtYmRhKSArIHRoaXMucmVmbGVjdGlvbk5vc2UqbGFtYmRhO1xuICAgICAgICB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dFJbMF0gPSByKnRoaXMubm9zZUxbMF0rKDErcikqKHRoaXMuTFtpXSt0aGlzLlJbaS0xXSk7XG4gICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubjsgaSsrKVxuICAgICAgICB7ICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5SW2ldID0gdGhpcy5qdW5jdGlvbk91dHB1dFJbaV0qMC45OTk7XG4gICAgICAgICAgICB0aGlzLkxbaV0gPSB0aGlzLmp1bmN0aW9uT3V0cHV0TFtpKzFdKjAuOTk5OyBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy90aGlzLlJbaV0gPSBNYXRoLmNsYW1wKHRoaXMuanVuY3Rpb25PdXRwdXRSW2ldICogdGhpcy5mYWRlLCAtMSwgMSk7XG4gICAgICAgICAgICAvL3RoaXMuTFtpXSA9IE1hdGguY2xhbXAodGhpcy5qdW5jdGlvbk91dHB1dExbaSsxXSAqIHRoaXMuZmFkZSwgLTEsIDEpOyAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHVwZGF0ZUFtcGxpdHVkZXMpXG4gICAgICAgICAgICB7ICAgXG4gICAgICAgICAgICAgICAgdmFyIGFtcGxpdHVkZSA9IE1hdGguYWJzKHRoaXMuUltpXSt0aGlzLkxbaV0pO1xuICAgICAgICAgICAgICAgIGlmIChhbXBsaXR1ZGUgPiB0aGlzLm1heEFtcGxpdHVkZVtpXSkgdGhpcy5tYXhBbXBsaXR1ZGVbaV0gPSBhbXBsaXR1ZGU7XG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLm1heEFtcGxpdHVkZVtpXSAqPSAwLjk5OTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGlwT3V0cHV0ID0gdGhpcy5SW3RoaXMubi0xXTtcbiAgICAgICAgXG4gICAgICAgIC8vbm9zZSAgICAgXG4gICAgICAgIHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0TFt0aGlzLm5vc2VMZW5ndGhdID0gdGhpcy5ub3NlUlt0aGlzLm5vc2VMZW5ndGgtMV0gKiB0aGlzLmxpcFJlZmxlY3Rpb247IFxuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaT0xOyBpPHRoaXMubm9zZUxlbmd0aDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdyA9IHRoaXMubm9zZVJlZmxlY3Rpb25baV0gKiAodGhpcy5ub3NlUltpLTFdICsgdGhpcy5ub3NlTFtpXSk7XG4gICAgICAgICAgICB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dFJbaV0gPSB0aGlzLm5vc2VSW2ktMV0gLSB3O1xuICAgICAgICAgICAgdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRMW2ldID0gdGhpcy5ub3NlTFtpXSArIHc7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm5vc2VMZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5ub3NlUltpXSA9IHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0UltpXSAqIHRoaXMuZmFkZTtcbiAgICAgICAgICAgIHRoaXMubm9zZUxbaV0gPSB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dExbaSsxXSAqIHRoaXMuZmFkZTsgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy90aGlzLm5vc2VSW2ldID0gTWF0aC5jbGFtcCh0aGlzLm5vc2VKdW5jdGlvbk91dHB1dFJbaV0gKiB0aGlzLmZhZGUsIC0xLCAxKTtcbiAgICAgICAgICAgIC8vdGhpcy5ub3NlTFtpXSA9IE1hdGguY2xhbXAodGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRMW2krMV0gKiB0aGlzLmZhZGUsIC0xLCAxKTsgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh1cGRhdGVBbXBsaXR1ZGVzKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBhbXBsaXR1ZGUgPSBNYXRoLmFicyh0aGlzLm5vc2VSW2ldK3RoaXMubm9zZUxbaV0pO1xuICAgICAgICAgICAgICAgIGlmIChhbXBsaXR1ZGUgPiB0aGlzLm5vc2VNYXhBbXBsaXR1ZGVbaV0pIHRoaXMubm9zZU1heEFtcGxpdHVkZVtpXSA9IGFtcGxpdHVkZTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMubm9zZU1heEFtcGxpdHVkZVtpXSAqPSAwLjk5OTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubm9zZU91dHB1dCA9IHRoaXMubm9zZVJbdGhpcy5ub3NlTGVuZ3RoLTFdO1xuICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBmaW5pc2hCbG9jaygpIHsgICAgICAgICBcbiAgICAgICAgdGhpcy5yZXNoYXBlVHJhY3QodGhpcy50cm9tYm9uZS5hdWRpb1N5c3RlbS5ibG9ja1RpbWUpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlZmxlY3Rpb25zKCk7XG4gICAgfVxuICAgIFxuICAgIGFkZFRyYW5zaWVudChwb3NpdGlvbikge1xuICAgICAgICB2YXIgdHJhbnMgPSB7fVxuICAgICAgICB0cmFucy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB0cmFucy50aW1lQWxpdmUgPSAwO1xuICAgICAgICB0cmFucy5saWZlVGltZSA9IDAuMjtcbiAgICAgICAgdHJhbnMuc3RyZW5ndGggPSAwLjM7XG4gICAgICAgIHRyYW5zLmV4cG9uZW50ID0gMjAwO1xuICAgICAgICB0aGlzLnRyYW5zaWVudHMucHVzaCh0cmFucyk7XG4gICAgfVxuICAgIFxuICAgIHByb2Nlc3NUcmFuc2llbnRzKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudHJhbnNpZW50cy5sZW5ndGg7IGkrKykgIFxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdHJhbnMgPSB0aGlzLnRyYW5zaWVudHNbaV07XG4gICAgICAgICAgICB2YXIgYW1wbGl0dWRlID0gdHJhbnMuc3RyZW5ndGggKiBNYXRoLnBvdygyLCAtdHJhbnMuZXhwb25lbnQgKiB0cmFucy50aW1lQWxpdmUpO1xuICAgICAgICAgICAgdGhpcy5SW3RyYW5zLnBvc2l0aW9uXSArPSBhbXBsaXR1ZGUvMjtcbiAgICAgICAgICAgIHRoaXMuTFt0cmFucy5wb3NpdGlvbl0gKz0gYW1wbGl0dWRlLzI7XG4gICAgICAgICAgICB0cmFucy50aW1lQWxpdmUgKz0gMS4wLyh0aGlzLnRyb21ib25lLmF1ZGlvU3lzdGVtLnNhbXBsZVJhdGUqMik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaT10aGlzLnRyYW5zaWVudHMubGVuZ3RoLTE7IGk+PTA7IGktLSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRyYW5zID0gdGhpcy50cmFuc2llbnRzW2ldO1xuICAgICAgICAgICAgaWYgKHRyYW5zLnRpbWVBbGl2ZSA+IHRyYW5zLmxpZmVUaW1lKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpZW50cy5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBhZGRUdXJidWxlbmNlTm9pc2UodHVyYnVsZW5jZU5vaXNlKSB7XG4gICAgICAgIC8vIGZvciAodmFyIGo9MDsgajxVSS50b3VjaGVzV2l0aE1vdXNlLmxlbmd0aDsgaisrKVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICB2YXIgdG91Y2ggPSBVSS50b3VjaGVzV2l0aE1vdXNlW2pdO1xuICAgICAgICAvLyAgICAgaWYgKHRvdWNoLmluZGV4PDIgfHwgdG91Y2guaW5kZXg+VHJhY3QubikgY29udGludWU7XG4gICAgICAgIC8vICAgICBpZiAodG91Y2guZGlhbWV0ZXI8PTApIGNvbnRpbnVlOyAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgdmFyIGludGVuc2l0eSA9IHRvdWNoLmZyaWNhdGl2ZV9pbnRlbnNpdHk7XG4gICAgICAgIC8vICAgICBpZiAoaW50ZW5zaXR5ID09IDApIGNvbnRpbnVlO1xuICAgICAgICAvLyAgICAgdGhpcy5hZGRUdXJidWxlbmNlTm9pc2VBdEluZGV4KDAuNjYqdHVyYnVsZW5jZU5vaXNlKmludGVuc2l0eSwgdG91Y2guaW5kZXgsIHRvdWNoLmRpYW1ldGVyKTtcbiAgICAgICAgLy8gfVxuICAgIH1cbiAgICBcbiAgICBhZGRUdXJidWxlbmNlTm9pc2VBdEluZGV4KHR1cmJ1bGVuY2VOb2lzZSwgaW5kZXgsIGRpYW1ldGVyKSB7ICAgXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcihpbmRleCk7XG4gICAgICAgIHZhciBkZWx0YSA9IGluZGV4IC0gaTtcbiAgICAgICAgdHVyYnVsZW5jZU5vaXNlICo9IHRoaXMuZ2xvdHRpcy5nZXROb2lzZU1vZHVsYXRvcigpO1xuICAgICAgICB2YXIgdGhpbm5lc3MwID0gTWF0aC5jbGFtcCg4KigwLjctZGlhbWV0ZXIpLDAsMSk7XG4gICAgICAgIHZhciBvcGVubmVzcyA9IE1hdGguY2xhbXAoMzAqKGRpYW1ldGVyLTAuMyksIDAsIDEpO1xuICAgICAgICB2YXIgbm9pc2UwID0gdHVyYnVsZW5jZU5vaXNlKigxLWRlbHRhKSp0aGlubmVzczAqb3Blbm5lc3M7XG4gICAgICAgIHZhciBub2lzZTEgPSB0dXJidWxlbmNlTm9pc2UqZGVsdGEqdGhpbm5lc3MwKm9wZW5uZXNzO1xuICAgICAgICB0aGlzLlJbaSsxXSArPSBub2lzZTAvMjtcbiAgICAgICAgdGhpcy5MW2krMV0gKz0gbm9pc2UwLzI7XG4gICAgICAgIHRoaXMuUltpKzJdICs9IG5vaXNlMS8yO1xuICAgICAgICB0aGlzLkxbaSsyXSArPSBub2lzZTEvMjtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBUcmFjdCB9OyIsIk1hdGguY2xhbXAgPSBmdW5jdGlvbihudW1iZXIsIG1pbiwgbWF4KSB7XG4gICAgaWYgKG51bWJlcjxtaW4pIHJldHVybiBtaW47XG4gICAgZWxzZSBpZiAobnVtYmVyPm1heCkgcmV0dXJuIG1heDtcbiAgICBlbHNlIHJldHVybiBudW1iZXI7XG59XG5cbk1hdGgubW92ZVRvd2FyZHMgPSBmdW5jdGlvbihjdXJyZW50LCB0YXJnZXQsIGFtb3VudCkge1xuICAgIGlmIChjdXJyZW50PHRhcmdldCkgcmV0dXJuIE1hdGgubWluKGN1cnJlbnQrYW1vdW50LCB0YXJnZXQpO1xuICAgIGVsc2UgcmV0dXJuIE1hdGgubWF4KGN1cnJlbnQtYW1vdW50LCB0YXJnZXQpO1xufVxuXG5NYXRoLm1vdmVUb3dhcmRzID0gZnVuY3Rpb24oY3VycmVudCwgdGFyZ2V0LCBhbW91bnRVcCwgYW1vdW50RG93bikge1xuICAgIGlmIChjdXJyZW50PHRhcmdldCkgcmV0dXJuIE1hdGgubWluKGN1cnJlbnQrYW1vdW50VXAsIHRhcmdldCk7XG4gICAgZWxzZSByZXR1cm4gTWF0aC5tYXgoY3VycmVudC1hbW91bnREb3duLCB0YXJnZXQpO1xufVxuXG5NYXRoLmdhdXNzaWFuID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHMgPSAwO1xuICAgIGZvciAodmFyIGM9MDsgYzwxNjsgYysrKSBzKz1NYXRoLnJhbmRvbSgpO1xuICAgIHJldHVybiAocy04KS80O1xufVxuXG5NYXRoLmxlcnAgPSBmdW5jdGlvbihhLCBiLCB0KSB7XG4gICAgcmV0dXJuIGEgKyAoYiAtIGEpICogdDtcbn0iLCIvKlxuICogQSBzcGVlZC1pbXByb3ZlZCBwZXJsaW4gYW5kIHNpbXBsZXggbm9pc2UgYWxnb3JpdGhtcyBmb3IgMkQuXG4gKlxuICogQmFzZWQgb24gZXhhbXBsZSBjb2RlIGJ5IFN0ZWZhbiBHdXN0YXZzb24gKHN0ZWd1QGl0bi5saXUuc2UpLlxuICogT3B0aW1pc2F0aW9ucyBieSBQZXRlciBFYXN0bWFuIChwZWFzdG1hbkBkcml6emxlLnN0YW5mb3JkLmVkdSkuXG4gKiBCZXR0ZXIgcmFuayBvcmRlcmluZyBtZXRob2QgYnkgU3RlZmFuIEd1c3RhdnNvbiBpbiAyMDEyLlxuICogQ29udmVydGVkIHRvIEphdmFzY3JpcHQgYnkgSm9zZXBoIEdlbnRsZS5cbiAqXG4gKiBWZXJzaW9uIDIwMTItMDMtMDlcbiAqXG4gKiBUaGlzIGNvZGUgd2FzIHBsYWNlZCBpbiB0aGUgcHVibGljIGRvbWFpbiBieSBpdHMgb3JpZ2luYWwgYXV0aG9yLFxuICogU3RlZmFuIEd1c3RhdnNvbi4gWW91IG1heSB1c2UgaXQgYXMgeW91IHNlZSBmaXQsIGJ1dFxuICogYXR0cmlidXRpb24gaXMgYXBwcmVjaWF0ZWQuXG4gKlxuICovXG5cbmNsYXNzIEdyYWQge1xuICAgIGNvbnN0cnVjdG9yKHgsIHksIHope1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLnogPSB6O1xuICAgIH1cblxuICAgIGRvdDIoeCwgeSl7XG4gICAgICAgIHJldHVybiB0aGlzLngqeCArIHRoaXMueSp5O1xuICAgIH1cblxuICAgIGRvdDMoeCwgeSwgeikge1xuICAgICAgICByZXR1cm4gdGhpcy54KnggKyB0aGlzLnkqeSArIHRoaXMueip6O1xuICAgIH07XG59XG5cbmNsYXNzIE5vaXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ncmFkMyA9IFtuZXcgR3JhZCgxLDEsMCksbmV3IEdyYWQoLTEsMSwwKSxuZXcgR3JhZCgxLC0xLDApLG5ldyBHcmFkKC0xLC0xLDApLFxuICAgICAgICAgICAgICAgICAgICAgIG5ldyBHcmFkKDEsMCwxKSxuZXcgR3JhZCgtMSwwLDEpLG5ldyBHcmFkKDEsMCwtMSksbmV3IEdyYWQoLTEsMCwtMSksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IEdyYWQoMCwxLDEpLG5ldyBHcmFkKDAsLTEsMSksbmV3IEdyYWQoMCwxLC0xKSxuZXcgR3JhZCgwLC0xLC0xKV07XG4gICAgICAgIHRoaXMucCA9IFsxNTEsMTYwLDEzNyw5MSw5MCwxNSxcbiAgICAgICAgICAgIDEzMSwxMywyMDEsOTUsOTYsNTMsMTk0LDIzMyw3LDIyNSwxNDAsMzYsMTAzLDMwLDY5LDE0Miw4LDk5LDM3LDI0MCwyMSwxMCwyMyxcbiAgICAgICAgICAgIDE5MCwgNiwxNDgsMjQ3LDEyMCwyMzQsNzUsMCwyNiwxOTcsNjIsOTQsMjUyLDIxOSwyMDMsMTE3LDM1LDExLDMyLDU3LDE3NywzMyxcbiAgICAgICAgICAgIDg4LDIzNywxNDksNTYsODcsMTc0LDIwLDEyNSwxMzYsMTcxLDE2OCwgNjgsMTc1LDc0LDE2NSw3MSwxMzQsMTM5LDQ4LDI3LDE2NixcbiAgICAgICAgICAgIDc3LDE0NiwxNTgsMjMxLDgzLDExMSwyMjksMTIyLDYwLDIxMSwxMzMsMjMwLDIyMCwxMDUsOTIsNDEsNTUsNDYsMjQ1LDQwLDI0NCxcbiAgICAgICAgICAgIDEwMiwxNDMsNTQsIDY1LDI1LDYzLDE2MSwgMSwyMTYsODAsNzMsMjA5LDc2LDEzMiwxODcsMjA4LCA4OSwxOCwxNjksMjAwLDE5NixcbiAgICAgICAgICAgIDEzNSwxMzAsMTE2LDE4OCwxNTksODYsMTY0LDEwMCwxMDksMTk4LDE3MywxODYsIDMsNjQsNTIsMjE3LDIyNiwyNTAsMTI0LDEyMyxcbiAgICAgICAgICAgIDUsMjAyLDM4LDE0NywxMTgsMTI2LDI1NSw4Miw4NSwyMTIsMjA3LDIwNiw1OSwyMjcsNDcsMTYsNTgsMTcsMTgyLDE4OSwyOCw0MixcbiAgICAgICAgICAgIDIyMywxODMsMTcwLDIxMywxMTksMjQ4LDE1MiwgMiw0NCwxNTQsMTYzLCA3MCwyMjEsMTUzLDEwMSwxNTUsMTY3LCA0MywxNzIsOSxcbiAgICAgICAgICAgIDEyOSwyMiwzOSwyNTMsIDE5LDk4LDEwOCwxMTAsNzksMTEzLDIyNCwyMzIsMTc4LDE4NSwgMTEyLDEwNCwyMTgsMjQ2LDk3LDIyOCxcbiAgICAgICAgICAgIDI1MSwzNCwyNDIsMTkzLDIzOCwyMTAsMTQ0LDEyLDE5MSwxNzksMTYyLDI0MSwgODEsNTEsMTQ1LDIzNSwyNDksMTQsMjM5LDEwNyxcbiAgICAgICAgICAgIDQ5LDE5MiwyMTQsIDMxLDE4MSwxOTksMTA2LDE1NywxODQsIDg0LDIwNCwxNzYsMTE1LDEyMSw1MCw0NSwxMjcsIDQsMTUwLDI1NCxcbiAgICAgICAgICAgIDEzOCwyMzYsMjA1LDkzLDIyMiwxMTQsNjcsMjksMjQsNzIsMjQzLDE0MSwxMjgsMTk1LDc4LDY2LDIxNSw2MSwxNTYsMTgwXTtcblxuICAgICAgICAvLyBUbyByZW1vdmUgdGhlIG5lZWQgZm9yIGluZGV4IHdyYXBwaW5nLCBkb3VibGUgdGhlIHBlcm11dGF0aW9uIHRhYmxlIGxlbmd0aFxuICAgICAgICB0aGlzLnBlcm0gPSBuZXcgQXJyYXkoNTEyKTtcbiAgICAgICAgdGhpcy5ncmFkUCA9IG5ldyBBcnJheSg1MTIpO1xuXG4gICAgICAgIHRoaXMuc2VlZChEYXRlLm5vdygpKTtcbiAgICB9XG5cbiAgICBzZWVkKHNlZWQpIHtcbiAgICAgICAgaWYoc2VlZCA+IDAgJiYgc2VlZCA8IDEpIHtcbiAgICAgICAgICAgIC8vIFNjYWxlIHRoZSBzZWVkIG91dFxuICAgICAgICAgICAgc2VlZCAqPSA2NTUzNjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlZWQgPSBNYXRoLmZsb29yKHNlZWQpO1xuICAgICAgICBpZihzZWVkIDwgMjU2KSB7XG4gICAgICAgICAgICBzZWVkIHw9IHNlZWQgPDwgODtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICAgICAgICAgICAgdmFyIHY7XG4gICAgICAgICAgICBpZiAoaSAmIDEpIHtcbiAgICAgICAgICAgICAgICB2ID0gdGhpcy5wW2ldIF4gKHNlZWQgJiAyNTUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2ID0gdGhpcy5wW2ldIF4gKChzZWVkPj44KSAmIDI1NSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucGVybVtpXSA9IHRoaXMucGVybVtpICsgMjU2XSA9IHY7XG4gICAgICAgICAgICB0aGlzLmdyYWRQW2ldID0gdGhpcy5ncmFkUFtpICsgMjU2XSA9IHRoaXMuZ3JhZDNbdiAlIDEyXTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyAyRCBzaW1wbGV4IG5vaXNlXG4gICAgc2ltcGxleDIoeGluLCB5aW4pIHtcbiAgICAgICAgLy8gU2tld2luZyBhbmQgdW5za2V3aW5nIGZhY3RvcnMgZm9yIDIsIDMsIGFuZCA0IGRpbWVuc2lvbnNcbiAgICAgICAgdmFyIEYyID0gMC41KihNYXRoLnNxcnQoMyktMSk7XG4gICAgICAgIHZhciBHMiA9ICgzLU1hdGguc3FydCgzKSkvNjtcblxuICAgICAgICB2YXIgRjMgPSAxLzM7XG4gICAgICAgIHZhciBHMyA9IDEvNjtcblxuICAgICAgICB2YXIgbjAsIG4xLCBuMjsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXG4gICAgICAgIC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cbiAgICAgICAgdmFyIHMgPSAoeGluK3lpbikqRjI7IC8vIEhhaXJ5IGZhY3RvciBmb3IgMkRcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbitzKTtcbiAgICAgICAgdmFyIGogPSBNYXRoLmZsb29yKHlpbitzKTtcbiAgICAgICAgdmFyIHQgPSAoaStqKSpHMjtcbiAgICAgICAgdmFyIHgwID0geGluLWkrdDsgLy8gVGhlIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW4sIHVuc2tld2VkLlxuICAgICAgICB2YXIgeTAgPSB5aW4tait0O1xuICAgICAgICAvLyBGb3IgdGhlIDJEIGNhc2UsIHRoZSBzaW1wbGV4IHNoYXBlIGlzIGFuIGVxdWlsYXRlcmFsIHRyaWFuZ2xlLlxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggc2ltcGxleCB3ZSBhcmUgaW4uXG4gICAgICAgIHZhciBpMSwgajE7IC8vIE9mZnNldHMgZm9yIHNlY29uZCAobWlkZGxlKSBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqKSBjb29yZHNcbiAgICAgICAgaWYoeDA+eTApIHsgLy8gbG93ZXIgdHJpYW5nbGUsIFhZIG9yZGVyOiAoMCwwKS0+KDEsMCktPigxLDEpXG4gICAgICAgICAgICBpMT0xOyBqMT0wO1xuICAgICAgICB9IGVsc2UgeyAgICAvLyB1cHBlciB0cmlhbmdsZSwgWVggb3JkZXI6ICgwLDApLT4oMCwxKS0+KDEsMSlcbiAgICAgICAgICAgIGkxPTA7IGoxPTE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQSBzdGVwIG9mICgxLDApIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jKSBpbiAoeCx5KSwgYW5kXG4gICAgICAgIC8vIGEgc3RlcCBvZiAoMCwxKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKC1jLDEtYykgaW4gKHgseSksIHdoZXJlXG4gICAgICAgIC8vIGMgPSAoMy1zcXJ0KDMpKS82XG4gICAgICAgIHZhciB4MSA9IHgwIC0gaTEgKyBHMjsgLy8gT2Zmc2V0cyBmb3IgbWlkZGxlIGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcbiAgICAgICAgdmFyIHkxID0geTAgLSBqMSArIEcyO1xuICAgICAgICB2YXIgeDIgPSB4MCAtIDEgKyAyICogRzI7IC8vIE9mZnNldHMgZm9yIGxhc3QgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xuICAgICAgICB2YXIgeTIgPSB5MCAtIDEgKyAyICogRzI7XG4gICAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgdGhyZWUgc2ltcGxleCBjb3JuZXJzXG4gICAgICAgIGkgJj0gMjU1O1xuICAgICAgICBqICY9IDI1NTtcbiAgICAgICAgdmFyIGdpMCA9IHRoaXMuZ3JhZFBbaSt0aGlzLnBlcm1bal1dO1xuICAgICAgICB2YXIgZ2kxID0gdGhpcy5ncmFkUFtpK2kxK3RoaXMucGVybVtqK2oxXV07XG4gICAgICAgIHZhciBnaTIgPSB0aGlzLmdyYWRQW2krMSt0aGlzLnBlcm1baisxXV07XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcbiAgICAgICAgdmFyIHQwID0gMC41IC0geDAqeDAteTAqeTA7XG4gICAgICAgIGlmKHQwPDApIHtcbiAgICAgICAgICAgIG4wID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHQwICo9IHQwO1xuICAgICAgICAgICAgbjAgPSB0MCAqIHQwICogZ2kwLmRvdDIoeDAsIHkwKTsgIC8vICh4LHkpIG9mIGdyYWQzIHVzZWQgZm9yIDJEIGdyYWRpZW50XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQxID0gMC41IC0geDEqeDEteTEqeTE7XG4gICAgICAgIGlmKHQxPDApIHtcbiAgICAgICAgICAgIG4xID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHQxICo9IHQxO1xuICAgICAgICAgICAgbjEgPSB0MSAqIHQxICogZ2kxLmRvdDIoeDEsIHkxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDIgPSAwLjUgLSB4Mip4Mi15Mip5MjtcbiAgICAgICAgaWYodDI8MCkge1xuICAgICAgICAgICAgbjIgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdDIgKj0gdDI7XG4gICAgICAgICAgICBuMiA9IHQyICogdDIgKiBnaTIuZG90Mih4MiwgeTIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBjb250cmlidXRpb25zIGZyb20gZWFjaCBjb3JuZXIgdG8gZ2V0IHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cbiAgICAgICAgLy8gVGhlIHJlc3VsdCBpcyBzY2FsZWQgdG8gcmV0dXJuIHZhbHVlcyBpbiB0aGUgaW50ZXJ2YWwgWy0xLDFdLlxuICAgICAgICByZXR1cm4gNzAgKiAobjAgKyBuMSArIG4yKTtcbiAgICB9XG4gICAgXG4gICAgc2ltcGxleDEoeCl7XG4gICAgICAgIHJldHVybiB0aGlzLnNpbXBsZXgyKHgqMS4yLCAteCowLjcpO1xuICAgIH1cblxufVxuXG5jb25zdCBzaW5nbGV0b24gPSBuZXcgTm9pc2UoKTtcbk9iamVjdC5mcmVlemUoc2luZ2xldG9uKTtcblxuZXhwb3J0IGRlZmF1bHQgc2luZ2xldG9uOyIsImltcG9ydCBcIi4vbWF0aC1leHRlbnNpb25zLmpzXCI7XG5cbmltcG9ydCB7IEF1ZGlvU3lzdGVtIH0gZnJvbSBcIi4vY29tcG9uZW50cy9hdWRpby1zeXN0ZW0uanNcIjtcbmltcG9ydCB7IEdsb3R0aXMgfSBmcm9tIFwiLi9jb21wb25lbnRzL2dsb3R0aXMuanNcIjtcbmltcG9ydCB7IFRyYWN0IH0gZnJvbSBcIi4vY29tcG9uZW50cy90cmFjdC5qc1wiO1xuaW1wb3J0IHsgVHJhY3RVSSB9IGZyb20gXCIuL2NvbXBvbmVudHMvdHJhY3QtdWkuanNcIjtcblxuY2xhc3MgVm9pY2Uge1xuICAgIGNvbnN0cnVjdG9yKHRyb21ib25lLCBpZCkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAgICAgdGhpcy5nbG90dGlzID0gbmV3IEdsb3R0aXModHJvbWJvbmUpO1xuICAgICAgICB0aGlzLmdsb3R0aXMuaW5pdCgpO1xuXG4gICAgICAgIHRoaXMudHJhY3QgPSBuZXcgVHJhY3QodHJvbWJvbmUsIHRoaXMuZ2xvdHRpcyk7XG4gICAgICAgIHRoaXMudHJhY3QuaW5pdCgpO1xuXG4gICAgICAgIHRoaXMudHJhY3RVSSA9IG5ldyBUcmFjdFVJKHRyb21ib25lLCB0aGlzLnRyYWN0KTtcbiAgICAgICAgdGhpcy50cmFjdFVJLmluaXQoKTtcbiAgICB9XG59XG5cbmNsYXNzIFBpbmtUcm9tYm9uZSB7XG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlcil7XG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnRpbWUgPSAwO1xuICAgICAgICB0aGlzLmFsd2F5c1ZvaWNlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hdXRvV29iYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ub2lzZUZyZXEgPSA1MDA7XG4gICAgICAgIHRoaXMubm9pc2VRID0gMC43O1xuXG4gICAgICAgIHRoaXMudm9pY2VzID0gW107XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCA4OyBpKyspe1xuICAgICAgICAgICAgbGV0IHZvaWNlID0gbmV3IFZvaWNlKHRoaXMsIGkpO1xuICAgICAgICAgICAgdm9pY2UuZ2xvdHRpcy5sb3VkbmVzcyA9IGkgPT0gMCA/IDEgOiAwO1xuICAgICAgICAgICAgdGhpcy52b2ljZXMucHVzaCh2b2ljZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmF1ZGlvU3lzdGVtID0gbmV3IEF1ZGlvU3lzdGVtKHRoaXMpO1xuICAgICAgICB0aGlzLmF1ZGlvU3lzdGVtLmluaXQoKTtcblxuICAgICAgICAvL3RoaXMuU3RhcnRBdWRpbygpO1xuICAgICAgICAvL3RoaXMuU2V0TXV0ZSh0cnVlKTtcblxuICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgU3RhcnRBdWRpbygpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmF1ZGlvU3lzdGVtLnN0YXJ0U291bmQoKTtcbiAgICB9XG5cbiAgICBTZXRNdXRlKGRvTXV0ZSkge1xuICAgICAgICBkb011dGUgPyB0aGlzLmF1ZGlvU3lzdGVtLm11dGUoKSA6IHRoaXMuYXVkaW9TeXN0ZW0udW5tdXRlKCk7XG4gICAgICAgIHRoaXMubXV0ZWQgPSBkb011dGU7XG4gICAgfVxuXG4gICAgVG9nZ2xlTXV0ZSgpIHtcbiAgICAgICAgdGhpcy5TZXRNdXRlKCF0aGlzLm11dGVkKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgUGlua1Ryb21ib25lLCBWb2ljZSB9OyIsIi8vIGNvbnN0IHdvcmRzID0gcmVxdWlyZSgnY211LXByb25vdW5jaW5nLWRpY3Rpb25hcnknKTtcblxuZXhwb3J0IGNsYXNzIFRUU0NvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIFxuICAgIH1cblxuICAgIC8vIEdldEdyYXBoZW1lcyhzdHIpe1xuICAgIC8vICAgICBsZXQgemVyb1B1bmN0dWF0aW9uID0gc3RyLnJlcGxhY2UoL1suLFxcLyMhJCVcXF4mXFwqOzp7fT1cXC1fYH4oKV0vZyxcIlwiKTtcbiAgICAvLyAgICAgbGV0IHdvcmRCYW5rID0gW11cbiAgICAvLyAgICAgZm9yKGxldCB3b3JkIG9mIHplcm9QdW5jdHVhdGlvbi5zcGxpdCgnICcpKXtcbiAgICAvLyAgICAgICAgIHdvcmRCYW5rLnB1c2godGhpcy5HZXRQcm9udW5jaWF0aW9uRm9yV29yZCh3b3JkKSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmV0dXJuIHdvcmRCYW5rO1xuICAgIC8vIH1cblxuICAgIC8vIEdldFByb251bmNpYXRpb25Gb3JXb3JkKHJhd1dvcmQpe1xuICAgIC8vICAgICBsZXQgd29yZCA9IHJhd1dvcmQudG9Mb3dlckNhc2UoKTtcbiAgICAvLyAgICAgaWYgKHdvcmRzW3dvcmRdKXtcbiAgICAvLyAgICAgICAgIHJldHVybiB3b3Jkc1t3b3JkXTtcbiAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgIC8vIElmIHRoZSB3b3JkIGlzbid0IGluIHRoZSBkaWN0LCBpZ25vcmUgaXQgZm9yIG5vd1xuICAgIC8vICAgICAgICAgcmV0dXJuIFwiTm9uZVwiO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG5cblxufSIsImNsYXNzIE1vZGVsTG9hZGVyIHtcblxuICAgIC8qKlxuICAgICAqIExvYWRzIGEgbW9kZWwgYXN5bmNocm9ub3VzbHkuIEV4cGVjdHMgYW4gb2JqZWN0IGNvbnRhaW5pbmdcbiAgICAgKiB0aGUgcGF0aCB0byB0aGUgb2JqZWN0LCB0aGUgcmVsYXRpdmUgcGF0aCBvZiB0aGUgT0JKIGZpbGUsXG4gICAgICogYW5kIHRoZSByZWxhdGl2ZSBwYXRoIG9mIHRoZSBNVEwgZmlsZS5cbiAgICAgKiBcbiAgICAgKiBBbiBleGFtcGxlOlxuICAgICAqIGxldCBtb2RlbEluZm8gPSB7XG4gICAgICogICAgICBwYXRoOiBcIi4uL3Jlc291cmNlcy9vYmovXCIsXG4gICAgICogICAgICBvYmpGaWxlOiBcInRlc3Qub2JqXCIsXG4gICAgICogICAgICBtdGxGaWxlOiBcInRlc3QubXRsXCJcbiAgICAgKiB9XG4gICAgICovXG4gICAgc3RhdGljIExvYWRPQkoobW9kZWxJbmZvLCBsb2FkZWRDYWxsYmFjaykge1xuXG4gICAgICAgIHZhciBvblByb2dyZXNzID0gZnVuY3Rpb24oIHhociApIHtcbiAgICAgICAgICAgIGlmICggeGhyLmxlbmd0aENvbXB1dGFibGUgKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IHhoci5sb2FkZWQgLyB4aHIudG90YWwgKiAxMDA7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIE1hdGgucm91bmQoIHBlcmNlbnRDb21wbGV0ZSwgMiApICsgJyUgZG93bmxvYWRlZCcgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9uRXJyb3IgPSBmdW5jdGlvbiggeGhyICkge1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBtdGxMb2FkZXIgPSBuZXcgVEhSRUUuTVRMTG9hZGVyKCk7XG4gICAgICAgIG10bExvYWRlci5zZXRQYXRoKCBtb2RlbEluZm8ucGF0aCApO1xuXG4gICAgICAgIG10bExvYWRlci5sb2FkKCBtb2RlbEluZm8ubXRsRmlsZSwgKCBtYXRlcmlhbHMgKSA9PiB7XG4gICAgICAgICAgICBtYXRlcmlhbHMucHJlbG9hZCgpO1xuICAgICAgICAgICAgdmFyIG9iakxvYWRlciA9IG5ldyBUSFJFRS5PQkpMb2FkZXIoKTtcbiAgICAgICAgICAgIG9iakxvYWRlci5zZXRNYXRlcmlhbHMoIG1hdGVyaWFscyApO1xuICAgICAgICAgICAgb2JqTG9hZGVyLnNldFBhdGgoIG1vZGVsSW5mby5wYXRoICk7XG4gICAgICAgICAgICBvYmpMb2FkZXIubG9hZCggbW9kZWxJbmZvLm9iakZpbGUsICggb2JqZWN0ICkgPT4ge1xuICAgICAgICAgICAgICAgIGxvYWRlZENhbGxiYWNrKG9iamVjdCk7XG4gICAgICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yICk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgTG9hZEpTT04ocGF0aCwgbG9hZGVkQ2FsbGJhY2spIHtcblxuICAgICAgICB2YXIgb25Qcm9ncmVzcyA9IGZ1bmN0aW9uKCB4aHIgKSB7XG4gICAgICAgICAgICBpZiAoIHhoci5sZW5ndGhDb21wdXRhYmxlICkge1xuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSB4aHIubG9hZGVkIC8geGhyLnRvdGFsICogMTAwO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBNYXRoLnJvdW5kKCBwZXJjZW50Q29tcGxldGUsIDIgKSArICclIGRvd25sb2FkZWQnICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvbkVycm9yID0gZnVuY3Rpb24oIHhociApIHtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIoKTtcbiAgICAgICAgbG9hZGVyLmxvYWQoIHBhdGgsICggZ2VvbWV0cnksIG1hdGVyaWFscyApID0+IHtcbiAgICAgICAgICAgIC8vIEFwcGx5IHNraW5uaW5nIHRvIGVhY2ggbWF0ZXJpYWwgc28gdGhlIHZlcnRzIGFyZSBhZmZlY3RlZCBieSBib25lIG1vdmVtZW50XG4gICAgICAgICAgICBmb3IobGV0IG1hdCBvZiBtYXRlcmlhbHMpe1xuICAgICAgICAgICAgICAgIG1hdC5za2lubmluZyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbWVzaCA9IG5ldyBUSFJFRS5Ta2lubmVkTWVzaCggZ2VvbWV0cnksIG5ldyBUSFJFRS5NdWx0aU1hdGVyaWFsKCBtYXRlcmlhbHMgKSApO1xuICAgICAgICAgICAgbWVzaC5uYW1lID0gXCJKb25cIjtcbiAgICAgICAgICAgIGxvYWRlZENhbGxiYWNrKG1lc2gpO1xuICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgTG9hZEZCWChwYXRoLCBsb2FkZWRDYWxsYmFjaykge1xuICAgICAgICBsZXQgbWFuYWdlciA9IG5ldyBUSFJFRS5Mb2FkaW5nTWFuYWdlcigpO1xuICAgICAgICBtYW5hZ2VyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiggaXRlbSwgbG9hZGVkLCB0b3RhbCApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBpdGVtLCBsb2FkZWQsIHRvdGFsICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiggeGhyICkge1xuICAgICAgICAgICAgaWYgKCB4aHIubGVuZ3RoQ29tcHV0YWJsZSApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0geGhyLmxvYWRlZCAvIHhoci50b3RhbCAqIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggTWF0aC5yb3VuZCggcGVyY2VudENvbXBsZXRlLCAyICkgKyAnJSBkb3dubG9hZGVkJyApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgb25FcnJvciA9IGZ1bmN0aW9uKCB4aHIgKSB7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5GQlhMb2FkZXIoIG1hbmFnZXIgKTtcbiAgICAgICAgbG9hZGVyLmxvYWQoIHBhdGgsICggb2JqZWN0ICkgPT4ge1xuICAgICAgICAgICAgbG9hZGVkQ2FsbGJhY2sob2JqZWN0KTtcbiAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvciApO1xuICAgIH1cblxufVxuXG5leHBvcnQgeyBNb2RlbExvYWRlciB9OyIsImNsYXNzIERldGVjdG9yIHtcblxuICAgIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMTg3MTA3Ny9wcm9wZXItd2F5LXRvLWRldGVjdC13ZWJnbC1zdXBwb3J0XG4gICAgc3RhdGljIEhhc1dlYkdMKCkge1xuICAgICAgICBpZiAoISF3aW5kb3cuV2ViR0xSZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZXMgPSBbXCJ3ZWJnbFwiLCBcImV4cGVyaW1lbnRhbC13ZWJnbFwiLCBcIm1vei13ZWJnbFwiLCBcIndlYmtpdC0zZFwiXSxcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8NDtpKyspIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQobmFtZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dC5nZXRQYXJhbWV0ZXIgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZWJHTCBpcyBlbmFibGVkXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge31cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gV2ViR0wgaXMgc3VwcG9ydGVkLCBidXQgZGlzYWJsZWRcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXZWJHTCBub3Qgc3VwcG9ydGVkXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgR2V0RXJyb3JIVE1MKG1lc3NhZ2UgPSBudWxsKXtcbiAgICAgICAgaWYobWVzc2FnZSA9PSBudWxsKXtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgWW91ciBncmFwaGljcyBjYXJkIGRvZXMgbm90IHNlZW0gdG8gc3VwcG9ydCBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8va2hyb25vcy5vcmcvd2ViZ2wvd2lraS9HZXR0aW5nX2FfV2ViR0xfSW1wbGVtZW50YXRpb25cIj5XZWJHTDwvYT4uIDxicj5cbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbmQgb3V0IGhvdyB0byBnZXQgaXQgPGEgaHJlZj1cImh0dHA6Ly9nZXQud2ViZ2wub3JnL1wiPmhlcmU8L2E+LmA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cIm5vLXdlYmdsLXN1cHBvcnRcIj5cbiAgICAgICAgPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIGBcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgRGV0ZWN0b3IgfTsiLCIhZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxlKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLk1pZGlDb252ZXJ0PWUoKTp0Lk1pZGlDb252ZXJ0PWUoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtmdW5jdGlvbiBlKHIpe2lmKG5bcl0pcmV0dXJuIG5bcl0uZXhwb3J0czt2YXIgaT1uW3JdPXtpOnIsbDohMSxleHBvcnRzOnt9fTtyZXR1cm4gdFtyXS5jYWxsKGkuZXhwb3J0cyxpLGkuZXhwb3J0cyxlKSxpLmw9ITAsaS5leHBvcnRzfXZhciBuPXt9O3JldHVybiBlLm09dCxlLmM9bixlLmk9ZnVuY3Rpb24odCl7cmV0dXJuIHR9LGUuZD1mdW5jdGlvbih0LG4scil7ZS5vKHQsbil8fE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LG4se2NvbmZpZ3VyYWJsZTohMSxlbnVtZXJhYmxlOiEwLGdldDpyfSl9LGUubj1mdW5jdGlvbih0KXt2YXIgbj10JiZ0Ll9fZXNNb2R1bGU/ZnVuY3Rpb24oKXtyZXR1cm4gdC5kZWZhdWx0fTpmdW5jdGlvbigpe3JldHVybiB0fTtyZXR1cm4gZS5kKG4sXCJhXCIsbiksbn0sZS5vPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LGUpfSxlLnA9XCJcIixlKGUucz03KX0oW2Z1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtuLmQoZSxcImFcIixmdW5jdGlvbigpe3JldHVybiByfSksbi5kKGUsXCJiXCIsZnVuY3Rpb24oKXtyZXR1cm4gaX0pLG4uZChlLFwiY1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGF9KTt2YXIgcj1bXCJhY291c3RpYyBncmFuZCBwaWFub1wiLFwiYnJpZ2h0IGFjb3VzdGljIHBpYW5vXCIsXCJlbGVjdHJpYyBncmFuZCBwaWFub1wiLFwiaG9ua3ktdG9uayBwaWFub1wiLFwiZWxlY3RyaWMgcGlhbm8gMVwiLFwiZWxlY3RyaWMgcGlhbm8gMlwiLFwiaGFycHNpY2hvcmRcIixcImNsYXZpXCIsXCJjZWxlc3RhXCIsXCJnbG9ja2Vuc3BpZWxcIixcIm11c2ljIGJveFwiLFwidmlicmFwaG9uZVwiLFwibWFyaW1iYVwiLFwieHlsb3Bob25lXCIsXCJ0dWJ1bGFyIGJlbGxzXCIsXCJkdWxjaW1lclwiLFwiZHJhd2JhciBvcmdhblwiLFwicGVyY3Vzc2l2ZSBvcmdhblwiLFwicm9jayBvcmdhblwiLFwiY2h1cmNoIG9yZ2FuXCIsXCJyZWVkIG9yZ2FuXCIsXCJhY2NvcmRpb25cIixcImhhcm1vbmljYVwiLFwidGFuZ28gYWNjb3JkaW9uXCIsXCJhY291c3RpYyBndWl0YXIgKG55bG9uKVwiLFwiYWNvdXN0aWMgZ3VpdGFyIChzdGVlbClcIixcImVsZWN0cmljIGd1aXRhciAoamF6eilcIixcImVsZWN0cmljIGd1aXRhciAoY2xlYW4pXCIsXCJlbGVjdHJpYyBndWl0YXIgKG11dGVkKVwiLFwib3ZlcmRyaXZlbiBndWl0YXJcIixcImRpc3RvcnRpb24gZ3VpdGFyXCIsXCJndWl0YXIgaGFybW9uaWNzXCIsXCJhY291c3RpYyBiYXNzXCIsXCJlbGVjdHJpYyBiYXNzIChmaW5nZXIpXCIsXCJlbGVjdHJpYyBiYXNzIChwaWNrKVwiLFwiZnJldGxlc3MgYmFzc1wiLFwic2xhcCBiYXNzIDFcIixcInNsYXAgYmFzcyAyXCIsXCJzeW50aCBiYXNzIDFcIixcInN5bnRoIGJhc3MgMlwiLFwidmlvbGluXCIsXCJ2aW9sYVwiLFwiY2VsbG9cIixcImNvbnRyYWJhc3NcIixcInRyZW1vbG8gc3RyaW5nc1wiLFwicGl6emljYXRvIHN0cmluZ3NcIixcIm9yY2hlc3RyYWwgaGFycFwiLFwidGltcGFuaVwiLFwic3RyaW5nIGVuc2VtYmxlIDFcIixcInN0cmluZyBlbnNlbWJsZSAyXCIsXCJzeW50aHN0cmluZ3MgMVwiLFwic3ludGhzdHJpbmdzIDJcIixcImNob2lyIGFhaHNcIixcInZvaWNlIG9vaHNcIixcInN5bnRoIHZvaWNlXCIsXCJvcmNoZXN0cmEgaGl0XCIsXCJ0cnVtcGV0XCIsXCJ0cm9tYm9uZVwiLFwidHViYVwiLFwibXV0ZWQgdHJ1bXBldFwiLFwiZnJlbmNoIGhvcm5cIixcImJyYXNzIHNlY3Rpb25cIixcInN5bnRoYnJhc3MgMVwiLFwic3ludGhicmFzcyAyXCIsXCJzb3ByYW5vIHNheFwiLFwiYWx0byBzYXhcIixcInRlbm9yIHNheFwiLFwiYmFyaXRvbmUgc2F4XCIsXCJvYm9lXCIsXCJlbmdsaXNoIGhvcm5cIixcImJhc3Nvb25cIixcImNsYXJpbmV0XCIsXCJwaWNjb2xvXCIsXCJmbHV0ZVwiLFwicmVjb3JkZXJcIixcInBhbiBmbHV0ZVwiLFwiYmxvd24gYm90dGxlXCIsXCJzaGFrdWhhY2hpXCIsXCJ3aGlzdGxlXCIsXCJvY2FyaW5hXCIsXCJsZWFkIDEgKHNxdWFyZSlcIixcImxlYWQgMiAoc2F3dG9vdGgpXCIsXCJsZWFkIDMgKGNhbGxpb3BlKVwiLFwibGVhZCA0IChjaGlmZilcIixcImxlYWQgNSAoY2hhcmFuZylcIixcImxlYWQgNiAodm9pY2UpXCIsXCJsZWFkIDcgKGZpZnRocylcIixcImxlYWQgOCAoYmFzcyArIGxlYWQpXCIsXCJwYWQgMSAobmV3IGFnZSlcIixcInBhZCAyICh3YXJtKVwiLFwicGFkIDMgKHBvbHlzeW50aClcIixcInBhZCA0IChjaG9pcilcIixcInBhZCA1IChib3dlZClcIixcInBhZCA2IChtZXRhbGxpYylcIixcInBhZCA3IChoYWxvKVwiLFwicGFkIDggKHN3ZWVwKVwiLFwiZnggMSAocmFpbilcIixcImZ4IDIgKHNvdW5kdHJhY2spXCIsXCJmeCAzIChjcnlzdGFsKVwiLFwiZnggNCAoYXRtb3NwaGVyZSlcIixcImZ4IDUgKGJyaWdodG5lc3MpXCIsXCJmeCA2IChnb2JsaW5zKVwiLFwiZnggNyAoZWNob2VzKVwiLFwiZnggOCAoc2NpLWZpKVwiLFwic2l0YXJcIixcImJhbmpvXCIsXCJzaGFtaXNlblwiLFwia290b1wiLFwia2FsaW1iYVwiLFwiYmFnIHBpcGVcIixcImZpZGRsZVwiLFwic2hhbmFpXCIsXCJ0aW5rbGUgYmVsbFwiLFwiYWdvZ29cIixcInN0ZWVsIGRydW1zXCIsXCJ3b29kYmxvY2tcIixcInRhaWtvIGRydW1cIixcIm1lbG9kaWMgdG9tXCIsXCJzeW50aCBkcnVtXCIsXCJyZXZlcnNlIGN5bWJhbFwiLFwiZ3VpdGFyIGZyZXQgbm9pc2VcIixcImJyZWF0aCBub2lzZVwiLFwic2Vhc2hvcmVcIixcImJpcmQgdHdlZXRcIixcInRlbGVwaG9uZSByaW5nXCIsXCJoZWxpY29wdGVyXCIsXCJhcHBsYXVzZVwiLFwiZ3Vuc2hvdFwiXSxpPVtcInBpYW5vXCIsXCJjaHJvbWF0aWMgcGVyY3Vzc2lvblwiLFwib3JnYW5cIixcImd1aXRhclwiLFwiYmFzc1wiLFwic3RyaW5nc1wiLFwiZW5zZW1ibGVcIixcImJyYXNzXCIsXCJyZWVkXCIsXCJwaXBlXCIsXCJzeW50aCBsZWFkXCIsXCJzeW50aCBwYWRcIixcInN5bnRoIGVmZmVjdHNcIixcImV0aG5pY1wiLFwicGVyY3Vzc2l2ZVwiLFwic291bmQgZWZmZWN0c1wiXSxhPXswOlwic3RhbmRhcmQga2l0XCIsODpcInJvb20ga2l0XCIsMTY6XCJwb3dlciBraXRcIiwyNDpcImVsZWN0cm9uaWMga2l0XCIsMjU6XCJ0ci04MDgga2l0XCIsMzI6XCJqYXp6IGtpdFwiLDQwOlwiYnJ1c2gga2l0XCIsNDg6XCJvcmNoZXN0cmEga2l0XCIsNTY6XCJzb3VuZCBmeCBraXRcIn19LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0LnJlcGxhY2UoL1xcdTAwMDAvZyxcIlwiKX1mdW5jdGlvbiBpKHQsZSl7cmV0dXJuIDYwL2UuYnBtKih0L2UuUFBRKX1mdW5jdGlvbiBhKHQpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiB0fWZ1bmN0aW9uIG8odCl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIHR9ZnVuY3Rpb24gcyh0KXtyZXR1cm5bXCJDXCIsXCJDI1wiLFwiRFwiLFwiRCNcIixcIkVcIixcIkZcIixcIkYjXCIsXCJHXCIsXCJHI1wiLFwiQVwiLFwiQSNcIixcIkJcIl1bdCUxMl0rKE1hdGguZmxvb3IodC8xMiktMSl9ZS5iPXIsZS5hPWksZS5jPWEsbi5kKGUsXCJkXCIsZnVuY3Rpb24oKXtyZXR1cm4gdX0pLGUuZT1zLG4uZChlLFwiZlwiLGZ1bmN0aW9uKCl7cmV0dXJuIGN9KTt2YXIgdT1mdW5jdGlvbigpe3ZhciB0PS9eKFthLWddezF9KD86YnwjfHh8YmIpPykoLT9bMC05XSspL2k7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBvKGUpJiZ0LnRlc3QoZSl9fSgpLGM9ZnVuY3Rpb24oKXt2YXIgdD0vXihbYS1nXXsxfSg/OmJ8I3x4fGJiKT8pKC0/WzAtOV0rKS9pLGU9e2NiYjotMixjYjotMSxjOjAsXCJjI1wiOjEsY3g6MixkYmI6MCxkYjoxLGQ6MixcImQjXCI6MyxkeDo0LGViYjoyLGViOjMsZTo0LFwiZSNcIjo1LGV4OjYsZmJiOjMsZmI6NCxmOjUsXCJmI1wiOjYsZng6NyxnYmI6NSxnYjo2LGc6NyxcImcjXCI6OCxneDo5LGFiYjo3LGFiOjgsYTo5LFwiYSNcIjoxMCxheDoxMSxiYmI6OSxiYjoxMCxiOjExLFwiYiNcIjoxMixieDoxM307cmV0dXJuIGZ1bmN0aW9uKG4pe3ZhciByPXQuZXhlYyhuKSxpPXJbMV0sYT1yWzJdO3JldHVybiBlW2kudG9Mb3dlckNhc2UoKV0rMTIqKHBhcnNlSW50KGEpKzEpfX0oKX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfW4uZChlLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGh9KTt2YXIgaT1uKDExKSxhPShuLm4oaSksbigxMCkpLG89KG4ubihhKSxuKDEpKSxzPW4oOSksdT1uKDUpLGM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLHIpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLHImJnQoZSxyKSxlfX0oKSxoPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3IodGhpcyx0KSx0aGlzLmhlYWRlcj17YnBtOjEyMCx0aW1lU2lnbmF0dXJlOls0LDRdLFBQUTo0ODB9LHRoaXMudHJhY2tzPVtdfXJldHVybiBjKHQsbnVsbCxbe2tleTpcImZyb21KU09OXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIG49bmV3IHQ7cmV0dXJuIG4uaGVhZGVyPWUuaGVhZGVyLGUudHJhY2tzLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIGU9cy5hLmZyb21KU09OKHQpO24udHJhY2tzLnB1c2goZSl9KSxufX1dKSxjKHQsW3trZXk6XCJsb2FkXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcyxuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTpudWxsLHI9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOlwiR0VUXCI7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGksYSl7dmFyIG89bmV3IFhNTEh0dHBSZXF1ZXN0O28ub3BlbihyLHQpLG8ucmVzcG9uc2VUeXBlPVwiYXJyYXlidWZmZXJcIixvLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZnVuY3Rpb24oKXs0PT09by5yZWFkeVN0YXRlJiYyMDA9PT1vLnN0YXR1cz9pKGUuZGVjb2RlKG8ucmVzcG9uc2UpKTphKG8uc3RhdHVzKX0pLG8uYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsYSksby5zZW5kKG4pfSkuY2F0Y2goZnVuY3Rpb24odCl7Y29uc29sZS5sb2codCl9KX19LHtrZXk6XCJkZWNvZGVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzO2lmKHQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcil7dmFyIHI9bmV3IFVpbnQ4QXJyYXkodCk7dD1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwscil9dmFyIGE9aSh0KTtyZXR1cm4gdGhpcy5oZWFkZXI9bi5pKHUuYSkoYSksdGhpcy50cmFja3M9W10sYS50cmFja3MuZm9yRWFjaChmdW5jdGlvbih0LG4pe3ZhciByPW5ldyBzLmE7ci5pZD1uLGUudHJhY2tzLnB1c2gocik7dmFyIGk9MDt0LmZvckVhY2goZnVuY3Rpb24odCl7aSs9by5hKHQuZGVsdGFUaW1lLGUuaGVhZGVyKSxcIm1ldGFcIj09PXQudHlwZSYmXCJ0cmFja05hbWVcIj09PXQuc3VidHlwZT9yLm5hbWU9by5iKHQudGV4dCk6XCJub3RlT25cIj09PXQuc3VidHlwZT8oci5ub3RlT24odC5ub3RlTnVtYmVyLGksdC52ZWxvY2l0eS8xMjcpLC0xPT09ci5jaGFubmVsTnVtYmVyJiYoci5jaGFubmVsTnVtYmVyPXQuY2hhbm5lbCkpOlwibm90ZU9mZlwiPT09dC5zdWJ0eXBlP3Iubm90ZU9mZih0Lm5vdGVOdW1iZXIsaSk6XCJjb250cm9sbGVyXCI9PT10LnN1YnR5cGUmJnQuY29udHJvbGxlclR5cGU/ci5jYyh0LmNvbnRyb2xsZXJUeXBlLGksdC52YWx1ZS8xMjcpOlwibWV0YVwiPT09dC50eXBlJiZcImluc3RydW1lbnROYW1lXCI9PT10LnN1YnR5cGU/ci5pbnN0cnVtZW50PXQudGV4dDpcImNoYW5uZWxcIj09PXQudHlwZSYmXCJwcm9ncmFtQ2hhbmdlXCI9PT10LnN1YnR5cGUmJihyLnBhdGNoKHQucHJvZ3JhbU51bWJlciksci5jaGFubmVsTnVtYmVyPXQuY2hhbm5lbCl9KSxlLmhlYWRlci5uYW1lfHxyLmxlbmd0aHx8IXIubmFtZXx8KGUuaGVhZGVyLm5hbWU9ci5uYW1lKX0pLHRoaXN9fSx7a2V5OlwiZW5jb2RlXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLGU9bmV3IGEuRmlsZSh7dGlja3M6dGhpcy5oZWFkZXIuUFBRfSksbj10aGlzLnRyYWNrcy5maWx0ZXIoZnVuY3Rpb24odCl7cmV0dXJuIXQubGVuZ3RofSlbMF07aWYodGhpcy5oZWFkZXIubmFtZSYmKCFufHxuLm5hbWUhPT10aGlzLmhlYWRlci5uYW1lKSl7ZS5hZGRUcmFjaygpLmFkZEV2ZW50KG5ldyBhLk1ldGFFdmVudCh7dGltZTowLHR5cGU6YS5NZXRhRXZlbnQuVFJBQ0tfTkFNRSxkYXRhOnRoaXMuaGVhZGVyLm5hbWV9KSl9cmV0dXJuIHRoaXMudHJhY2tzLmZvckVhY2goZnVuY3Rpb24obil7dmFyIHI9ZS5hZGRUcmFjaygpO3Iuc2V0VGVtcG8odC5icG0pLG4ubmFtZSYmci5hZGRFdmVudChuZXcgYS5NZXRhRXZlbnQoe3RpbWU6MCx0eXBlOmEuTWV0YUV2ZW50LlRSQUNLX05BTUUsZGF0YTpuLm5hbWV9KSksbi5lbmNvZGUocix0LmhlYWRlcil9KSxlLnRvQnl0ZXMoKX19LHtrZXk6XCJ0b0FycmF5XCIsdmFsdWU6ZnVuY3Rpb24oKXtmb3IodmFyIHQ9dGhpcy5lbmNvZGUoKSxlPW5ldyBBcnJheSh0Lmxlbmd0aCksbj0wO248dC5sZW5ndGg7bisrKWVbbl09dC5jaGFyQ29kZUF0KG4pO3JldHVybiBlfX0se2tleTpcInRvSlNPTlwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9e2hlYWRlcjp0aGlzLmhlYWRlcixzdGFydFRpbWU6dGhpcy5zdGFydFRpbWUsZHVyYXRpb246dGhpcy5kdXJhdGlvbix0cmFja3M6KHRoaXMudHJhY2tzfHxbXSkubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0LnRvSlNPTigpfSl9O3JldHVybiB0LmhlYWRlci5uYW1lfHwodC5oZWFkZXIubmFtZT1cIlwiKSx0fX0se2tleTpcInRyYWNrXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9bmV3IHMuYSh0KTtyZXR1cm4gdGhpcy50cmFja3MucHVzaChlKSxlfX0se2tleTpcImdldFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBvLmModCk/dGhpcy50cmFja3NbdF06dGhpcy50cmFja3MuZmluZChmdW5jdGlvbihlKXtyZXR1cm4gZS5uYW1lPT09dH0pfX0se2tleTpcInNsaWNlXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06MCxuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTp0aGlzLmR1cmF0aW9uLHI9bmV3IHQ7cmV0dXJuIHIuaGVhZGVyPXRoaXMuaGVhZGVyLHIudHJhY2tzPXRoaXMudHJhY2tzLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdC5zbGljZShlLG4pfSkscn19LHtrZXk6XCJzdGFydFRpbWVcIixnZXQ6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnRyYWNrcy5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIHQuc3RhcnRUaW1lfSk7cmV0dXJuIHQubGVuZ3RoP01hdGgubWluLmFwcGx5KE1hdGgsdCl8fDA6MH19LHtrZXk6XCJicG1cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oZWFkZXIuYnBtfSxzZXQ6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5oZWFkZXIuYnBtO3RoaXMuaGVhZGVyLmJwbT10O3ZhciBuPWUvdDt0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHQpe3JldHVybiB0LnNjYWxlKG4pfSl9fSx7a2V5OlwidGltZVNpZ25hdHVyZVwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmhlYWRlci50aW1lU2lnbmF0dXJlfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5oZWFkZXIudGltZVNpZ25hdHVyZT10fX0se2tleTpcImR1cmF0aW9uXCIsZ2V0OmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy50cmFja3MubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0LmR1cmF0aW9ufSk7cmV0dXJuIHQubGVuZ3RoP01hdGgubWF4LmFwcGx5KE1hdGgsdCl8fDA6MH19XSksdH0oKX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCxlKXt2YXIgbj0wLHI9dC5sZW5ndGgsaT1yO2lmKHI+MCYmdFtyLTFdLnRpbWU8PWUpcmV0dXJuIHItMTtmb3IoO248aTspe3ZhciBhPU1hdGguZmxvb3IobisoaS1uKS8yKSxvPXRbYV0scz10W2ErMV07aWYoby50aW1lPT09ZSl7Zm9yKHZhciB1PWE7dTx0Lmxlbmd0aDt1Kyspe3RbdV0udGltZT09PWUmJihhPXUpfXJldHVybiBhfWlmKG8udGltZTxlJiZzLnRpbWU+ZSlyZXR1cm4gYTtvLnRpbWU+ZT9pPWE6by50aW1lPGUmJihuPWErMSl9cmV0dXJuLTF9ZnVuY3Rpb24gaSh0LGUpe2lmKHQubGVuZ3RoKXt2YXIgbj1yKHQsZS50aW1lKTt0LnNwbGljZShuKzEsMCxlKX1lbHNlIHQucHVzaChlKX1uLmQoZSxcImFcIixmdW5jdGlvbigpe3JldHVybiBpfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX1uLmQoZSxcImFcIixmdW5jdGlvbigpe3JldHVybiBvfSk7dmFyIGk9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLHIpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLHImJnQoZSxyKSxlfX0oKSxhPXsxOlwibW9kdWxhdGlvbldoZWVsXCIsMjpcImJyZWF0aFwiLDQ6XCJmb290Q29udHJvbGxlclwiLDU6XCJwb3J0YW1lbnRvVGltZVwiLDc6XCJ2b2x1bWVcIiw4OlwiYmFsYW5jZVwiLDEwOlwicGFuXCIsNjQ6XCJzdXN0YWluXCIsNjU6XCJwb3J0YW1lbnRvVGltZVwiLDY2Olwic29zdGVudXRvXCIsNjc6XCJzb2Z0UGVkYWxcIiw2ODpcImxlZ2F0b0Zvb3Rzd2l0Y2hcIiw4NDpcInBvcnRhbWVudG9Db250cm9cIn0sbz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoZSxuLGkpe3IodGhpcyx0KSx0aGlzLm51bWJlcj1lLHRoaXMudGltZT1uLHRoaXMudmFsdWU9aX1yZXR1cm4gaSh0LFt7a2V5OlwibmFtZVwiLGdldDpmdW5jdGlvbigpe2lmKGEuaGFzT3duUHJvcGVydHkodGhpcy5udW1iZXIpKXJldHVybiBhW3RoaXMubnVtYmVyXX19XSksdH0oKX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7Zm9yKHZhciBlPXtQUFE6dC5oZWFkZXIudGlja3NQZXJCZWF0fSxuPTA7bjx0LnRyYWNrcy5sZW5ndGg7bisrKWZvcih2YXIgcj10LnRyYWNrc1tuXSxpPTA7aTxyLmxlbmd0aDtpKyspe3ZhciBhPXJbaV07XCJtZXRhXCI9PT1hLnR5cGUmJihcInRpbWVTaWduYXR1cmVcIj09PWEuc3VidHlwZT9lLnRpbWVTaWduYXR1cmU9W2EubnVtZXJhdG9yLGEuZGVub21pbmF0b3JdOlwic2V0VGVtcG9cIj09PWEuc3VidHlwZSYmKGUuYnBtfHwoZS5icG09NmU3L2EubWljcm9zZWNvbmRzUGVyQmVhdCkpKX1yZXR1cm4gZS5icG09ZS5icG18fDEyMCxlfW4uZChlLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHJ9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCxlKXtmb3IodmFyIG49MDtuPHQubGVuZ3RoO24rKyl7dmFyIHI9dFtuXSxpPWVbbl07aWYoci5sZW5ndGg+aSlyZXR1cm4hMH1yZXR1cm4hMX1mdW5jdGlvbiBpKHQsZSxuKXtmb3IodmFyIHI9MCxpPTEvMCxhPTA7YTx0Lmxlbmd0aDthKyspe3ZhciBvPXRbYV0scz1lW2FdO29bc10mJm9bc10udGltZTxpJiYocj1hLGk9b1tzXS50aW1lKX1uW3JdKHRbcl1bZVtyXV0pLGVbcl0rPTF9ZnVuY3Rpb24gYSgpe2Zvcih2YXIgdD1hcmd1bWVudHMubGVuZ3RoLGU9QXJyYXkodCksbj0wO248dDtuKyspZVtuXT1hcmd1bWVudHNbbl07Zm9yKHZhciBhPWUuZmlsdGVyKGZ1bmN0aW9uKHQsZSl7cmV0dXJuIGUlMj09MH0pLG89bmV3IFVpbnQzMkFycmF5KGEubGVuZ3RoKSxzPWUuZmlsdGVyKGZ1bmN0aW9uKHQsZSl7cmV0dXJuIGUlMj09MX0pO3IoYSxvKTspaShhLG8scyl9bi5kKGUsXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gYX0pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4obmV3IHMuYSkuZGVjb2RlKHQpfWZ1bmN0aW9uIGkodCxlKXt2YXIgbj0obmV3IHMuYSkubG9hZCh0KTtyZXR1cm4gZSYmbi50aGVuKGUpLG59ZnVuY3Rpb24gYSgpe3JldHVybiBuZXcgcy5hfWZ1bmN0aW9uIG8odCl7cmV0dXJuIHMuYS5mcm9tSlNPTih0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLnBhcnNlPXIsZS5sb2FkPWksZS5jcmVhdGU9YSxlLmZyb21KU09OPW87dmFyIHM9bigyKSx1PW4oMCk7bi5kKGUsXCJpbnN0cnVtZW50QnlQYXRjaElEXCIsZnVuY3Rpb24oKXtyZXR1cm4gdS5hfSksbi5kKGUsXCJpbnN0cnVtZW50RmFtaWx5QnlJRFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHUuYn0pLG4uZChlLFwiZHJ1bUtpdEJ5UGF0Y2hJRFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHUuY30pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9bi5kKGUsXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gb30pO3ZhciBpPW4oMSksYT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fXJldHVybiBmdW5jdGlvbihlLG4scil7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksciYmdChlLHIpLGV9fSgpLG89ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGUsbil7dmFyIGE9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOjAsbz1hcmd1bWVudHMubGVuZ3RoPjMmJnZvaWQgMCE9PWFyZ3VtZW50c1szXT9hcmd1bWVudHNbM106MTtpZihyKHRoaXMsdCksaS5jKGUpKXRoaXMubWlkaT1lO2Vsc2V7aWYoIWkuZChlKSl0aHJvdyBuZXcgRXJyb3IoXCJ0aGUgbWlkaSB2YWx1ZSBtdXN0IGVpdGhlciBiZSBpbiBQaXRjaCBOb3RhdGlvbiAoZS5nLiBDIzQpIG9yIGEgbWlkaSB2YWx1ZVwiKTt0aGlzLm5hbWU9ZX10aGlzLnRpbWU9bix0aGlzLmR1cmF0aW9uPWEsdGhpcy52ZWxvY2l0eT1vfXJldHVybiBhKHQsbnVsbCxbe2tleTpcImZyb21KU09OXCIsdmFsdWU6ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyB0KGUubWlkaSxlLnRpbWUsZS5kdXJhdGlvbixlLnZlbG9jaXR5KX19XSksYSh0LFt7a2V5OlwibWF0Y2hcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gaS5jKHQpP3RoaXMubWlkaT09PXQ6aS5kKHQpP3RoaXMubmFtZS50b0xvd2VyQ2FzZSgpPT09dC50b0xvd2VyQ2FzZSgpOnZvaWQgMH19LHtrZXk6XCJ0b0pTT05cIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybntuYW1lOnRoaXMubmFtZSxtaWRpOnRoaXMubWlkaSx0aW1lOnRoaXMudGltZSx2ZWxvY2l0eTp0aGlzLnZlbG9jaXR5LGR1cmF0aW9uOnRoaXMuZHVyYXRpb259fX0se2tleTpcIm5hbWVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaS5lKHRoaXMubWlkaSl9LHNldDpmdW5jdGlvbih0KXt0aGlzLm1pZGk9aS5mKHQpfX0se2tleTpcIm5vdGVPblwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbWV9LHNldDpmdW5jdGlvbih0KXt0aGlzLnRpbWU9dH19LHtrZXk6XCJub3RlT2ZmXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGltZSt0aGlzLmR1cmF0aW9ufSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5kdXJhdGlvbj10LXRoaXMudGltZX19XSksdH0oKX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfW4uZChlLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGh9KTt2YXIgaT1uKDMpLGE9big0KSxvPW4oNikscz1uKDgpLHU9bigwKSxjPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixyKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxyJiZ0KGUsciksZX19KCksaD1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoZSl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOi0xLGk9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOi0xO3IodGhpcyx0KSx0aGlzLm5hbWU9ZSx0aGlzLmNoYW5uZWxOdW1iZXI9aSx0aGlzLm5vdGVzPVtdLHRoaXMuY29udHJvbENoYW5nZXM9e30sdGhpcy5pbnN0cnVtZW50TnVtYmVyPW59cmV0dXJuIGModCxudWxsLFt7a2V5OlwiZnJvbUpTT05cIix2YWx1ZTpmdW5jdGlvbihlKXt2YXIgbj1uZXcgdChlLm5hbWUsZS5pbnN0cnVtZW50TnVtYmVyLGUuY2hhbm5lbE51bWJlcik7cmV0dXJuIG4uaWQ9ZS5pZCxlLm5vdGVzJiZlLm5vdGVzLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIGU9cy5hLmZyb21KU09OKHQpO24ubm90ZXMucHVzaChlKX0pLGUuY29udHJvbENoYW5nZXMmJihuLmNvbnRyb2xDaGFuZ2VzPWUuY29udHJvbENoYW5nZXMpLG59fV0pLGModCxbe2tleTpcIm5vdGVcIix2YWx1ZTpmdW5jdGlvbih0LGUpe3ZhciByPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXTowLGE9YXJndW1lbnRzLmxlbmd0aD4zJiZ2b2lkIDAhPT1hcmd1bWVudHNbM10/YXJndW1lbnRzWzNdOjEsbz1uZXcgcy5hKHQsZSxyLGEpO3JldHVybiBuLmkoaS5hKSh0aGlzLm5vdGVzLG8pLHRoaXN9fSx7a2V5Olwibm90ZU9uXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXt2YXIgcj1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06MSxhPW5ldyBzLmEodCxlLDAscik7cmV0dXJuIG4uaShpLmEpKHRoaXMubm90ZXMsYSksdGhpc319LHtrZXk6XCJub3RlT2ZmXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtmb3IodmFyIG49MDtuPHRoaXMubm90ZXMubGVuZ3RoO24rKyl7dmFyIHI9dGhpcy5ub3Rlc1tuXTtpZihyLm1hdGNoKHQpJiYwPT09ci5kdXJhdGlvbil7ci5ub3RlT2ZmPWU7YnJlYWt9fXJldHVybiB0aGlzfX0se2tleTpcImNjXCIsdmFsdWU6ZnVuY3Rpb24odCxlLHIpe3RoaXMuY29udHJvbENoYW5nZXMuaGFzT3duUHJvcGVydHkodCl8fCh0aGlzLmNvbnRyb2xDaGFuZ2VzW3RdPVtdKTt2YXIgbz1uZXcgYS5hKHQsZSxyKTtyZXR1cm4gbi5pKGkuYSkodGhpcy5jb250cm9sQ2hhbmdlc1t0XSxvKSx0aGlzfX0se2tleTpcInBhdGNoXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuaW5zdHJ1bWVudE51bWJlcj10LHRoaXN9fSx7a2V5OlwiY2hhbm5lbFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmNoYW5uZWxOdW1iZXI9dCx0aGlzfX0se2tleTpcInNjYWxlXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMubm90ZXMuZm9yRWFjaChmdW5jdGlvbihlKXtlLnRpbWUqPXQsZS5kdXJhdGlvbio9dH0pLHRoaXN9fSx7a2V5Olwic2xpY2VcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTowLG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOnRoaXMuZHVyYXRpb24scj1NYXRoLm1heCh0aGlzLm5vdGVzLmZpbmRJbmRleChmdW5jdGlvbih0KXtyZXR1cm4gdC50aW1lPj1lfSksMCksaT10aGlzLm5vdGVzLmZpbmRJbmRleChmdW5jdGlvbih0KXtyZXR1cm4gdC5ub3RlT2ZmPj1ufSkrMSxhPW5ldyB0KHRoaXMubmFtZSk7cmV0dXJuIGEubm90ZXM9dGhpcy5ub3Rlcy5zbGljZShyLGkpLGEubm90ZXMuZm9yRWFjaChmdW5jdGlvbih0KXtyZXR1cm4gdC50aW1lPXQudGltZS1lfSksYX19LHtrZXk6XCJlbmNvZGVcIix2YWx1ZTpmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIHIodCl7dmFyIGU9TWF0aC5mbG9vcihpKnQpLG49TWF0aC5tYXgoZS1hLDApO3JldHVybiBhPWUsbn12YXIgaT1lLlBQUS8oNjAvZS5icG0pLGE9MCxzPU1hdGgubWF4KDAsdGhpcy5jaGFubmVsTnVtYmVyKTstMSE9PXRoaXMuaW5zdHJ1bWVudE51bWJlciYmdC5pbnN0cnVtZW50KHMsdGhpcy5pbnN0cnVtZW50TnVtYmVyKSxuLmkoby5hKSh0aGlzLm5vdGVPbnMsZnVuY3Rpb24oZSl7dC5hZGROb3RlT24ocyxlLm5hbWUscihlLnRpbWUpLE1hdGguZmxvb3IoMTI3KmUudmVsb2NpdHkpKX0sdGhpcy5ub3RlT2ZmcyxmdW5jdGlvbihlKXt0LmFkZE5vdGVPZmYocyxlLm5hbWUscihlLnRpbWUpKX0pfX0se2tleTpcInRvSlNPTlwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9e3N0YXJ0VGltZTp0aGlzLnN0YXJ0VGltZSxkdXJhdGlvbjp0aGlzLmR1cmF0aW9uLGxlbmd0aDp0aGlzLmxlbmd0aCxub3RlczpbXSxjb250cm9sQ2hhbmdlczp7fX07cmV0dXJuIHZvaWQgMCE9PXRoaXMuaWQmJih0LmlkPXRoaXMuaWQpLHQubmFtZT10aGlzLm5hbWUsLTEhPT10aGlzLmluc3RydW1lbnROdW1iZXImJih0Lmluc3RydW1lbnROdW1iZXI9dGhpcy5pbnN0cnVtZW50TnVtYmVyLHQuaW5zdHJ1bWVudD10aGlzLmluc3RydW1lbnQsdC5pbnN0cnVtZW50RmFtaWx5PXRoaXMuaW5zdHJ1bWVudEZhbWlseSksLTEhPT10aGlzLmNoYW5uZWxOdW1iZXImJih0LmNoYW5uZWxOdW1iZXI9dGhpcy5jaGFubmVsTnVtYmVyLHQuaXNQZXJjdXNzaW9uPXRoaXMuaXNQZXJjdXNzaW9uKSx0aGlzLm5vdGVzLmxlbmd0aCYmKHQubm90ZXM9dGhpcy5ub3Rlcy5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIHQudG9KU09OKCl9KSksT2JqZWN0LmtleXModGhpcy5jb250cm9sQ2hhbmdlcykubGVuZ3RoJiYodC5jb250cm9sQ2hhbmdlcz10aGlzLmNvbnRyb2xDaGFuZ2VzKSx0fX0se2tleTpcIm5vdGVPbnNcIixnZXQ6ZnVuY3Rpb24oKXt2YXIgdD1bXTtyZXR1cm4gdGhpcy5ub3Rlcy5mb3JFYWNoKGZ1bmN0aW9uKGUpe3QucHVzaCh7dGltZTplLm5vdGVPbixtaWRpOmUubWlkaSxuYW1lOmUubmFtZSx2ZWxvY2l0eTplLnZlbG9jaXR5fSl9KSx0fX0se2tleTpcIm5vdGVPZmZzXCIsZ2V0OmZ1bmN0aW9uKCl7dmFyIHQ9W107cmV0dXJuIHRoaXMubm90ZXMuZm9yRWFjaChmdW5jdGlvbihlKXt0LnB1c2goe3RpbWU6ZS5ub3RlT2ZmLG1pZGk6ZS5taWRpLG5hbWU6ZS5uYW1lfSl9KSx0fX0se2tleTpcImxlbmd0aFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLm5vdGVzLmxlbmd0aH19LHtrZXk6XCJzdGFydFRpbWVcIixnZXQ6ZnVuY3Rpb24oKXtpZih0aGlzLm5vdGVzLmxlbmd0aCl7cmV0dXJuIHRoaXMubm90ZXNbMF0ubm90ZU9ufXJldHVybiAwfX0se2tleTpcImR1cmF0aW9uXCIsZ2V0OmZ1bmN0aW9uKCl7aWYodGhpcy5ub3Rlcy5sZW5ndGgpe3JldHVybiB0aGlzLm5vdGVzW3RoaXMubm90ZXMubGVuZ3RoLTFdLm5vdGVPZmZ9cmV0dXJuIDB9fSx7a2V5OlwiaW5zdHJ1bWVudFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmlzUGVyY3Vzc2lvbj91LmNbdGhpcy5pbnN0cnVtZW50TnVtYmVyXTp1LmFbdGhpcy5pbnN0cnVtZW50TnVtYmVyXX0sc2V0OmZ1bmN0aW9uKHQpe3ZhciBlPXUuYS5pbmRleE9mKHQpOy0xIT09ZSYmKHRoaXMuaW5zdHJ1bWVudE51bWJlcj1lKX19LHtrZXk6XCJpc1BlcmN1c3Npb25cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm5bOSwxMF0uaW5jbHVkZXModGhpcy5jaGFubmVsTnVtYmVyKX19LHtrZXk6XCJpbnN0cnVtZW50RmFtaWx5XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaXNQZXJjdXNzaW9uP1wiZHJ1bXNcIjp1LmJbTWF0aC5mbG9vcih0aGlzLmluc3RydW1lbnROdW1iZXIvOCldfX1dKSx0fSgpfSxmdW5jdGlvbih0LGUsbil7KGZ1bmN0aW9uKHQpe3ZhciBuPXt9OyFmdW5jdGlvbih0KXt2YXIgZT10LkRFRkFVTFRfVk9MVU1FPTkwLG49KHQuREVGQVVMVF9EVVJBVElPTj0xMjgsdC5ERUZBVUxUX0NIQU5ORUw9MCx7bWlkaV9sZXR0ZXJfcGl0Y2hlczp7YToyMSxiOjIzLGM6MTIsZDoxNCxlOjE2LGY6MTcsZzoxOX0sbWlkaVBpdGNoRnJvbU5vdGU6ZnVuY3Rpb24odCl7dmFyIGU9LyhbYS1nXSkoIyt8YispPyhbMC05XSspJC9pLmV4ZWModCkscj1lWzFdLnRvTG93ZXJDYXNlKCksaT1lWzJdfHxcIlwiO3JldHVybiAxMipwYXJzZUludChlWzNdLDEwKStuLm1pZGlfbGV0dGVyX3BpdGNoZXNbcl0rKFwiI1wiPT1pLnN1YnN0cigwLDEpPzE6LTEpKmkubGVuZ3RofSxlbnN1cmVNaWRpUGl0Y2g6ZnVuY3Rpb24odCl7cmV0dXJuXCJudW1iZXJcIiE9dHlwZW9mIHQmJi9bXjAtOV0vLnRlc3QodCk/bi5taWRpUGl0Y2hGcm9tTm90ZSh0KTpwYXJzZUludCh0LDEwKX0sbWlkaV9waXRjaGVzX2xldHRlcjp7MTI6XCJjXCIsMTM6XCJjI1wiLDE0OlwiZFwiLDE1OlwiZCNcIiwxNjpcImVcIiwxNzpcImZcIiwxODpcImYjXCIsMTk6XCJnXCIsMjA6XCJnI1wiLDIxOlwiYVwiLDIyOlwiYSNcIiwyMzpcImJcIn0sbWlkaV9mbGF0dGVuZWRfbm90ZXM6e1wiYSNcIjpcImJiXCIsXCJjI1wiOlwiZGJcIixcImQjXCI6XCJlYlwiLFwiZiNcIjpcImdiXCIsXCJnI1wiOlwiYWJcIn0sbm90ZUZyb21NaWRpUGl0Y2g6ZnVuY3Rpb24odCxlKXt2YXIgcixpPTAsYT10LGU9ZXx8ITE7cmV0dXJuIHQ+MjMmJihpPU1hdGguZmxvb3IodC8xMiktMSxhPXQtMTIqaSkscj1uLm1pZGlfcGl0Y2hlc19sZXR0ZXJbYV0sZSYmci5pbmRleE9mKFwiI1wiKT4wJiYocj1uLm1pZGlfZmxhdHRlbmVkX25vdGVzW3JdKSxyK2l9LG1wcW5Gcm9tQnBtOmZ1bmN0aW9uKHQpe3ZhciBlPU1hdGguZmxvb3IoNmU3L3QpLG49W107ZG97bi51bnNoaWZ0KDI1NSZlKSxlPj49OH13aGlsZShlKTtmb3IoO24ubGVuZ3RoPDM7KW4ucHVzaCgwKTtyZXR1cm4gbn0sYnBtRnJvbU1wcW46ZnVuY3Rpb24odCl7dmFyIGU9dDtpZih2b2lkIDAhPT10WzBdKXtlPTA7Zm9yKHZhciBuPTAscj10Lmxlbmd0aC0xO3I+PTA7KytuLC0tcillfD10W25dPDxyfXJldHVybiBNYXRoLmZsb29yKDZlNy90KX0sY29kZXMyU3RyOmZ1bmN0aW9uKHQpe3JldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsdCl9LHN0cjJCeXRlczpmdW5jdGlvbih0LGUpe2lmKGUpZm9yKDt0Lmxlbmd0aC8yPGU7KXQ9XCIwXCIrdDtmb3IodmFyIG49W10scj10Lmxlbmd0aC0xO3I+PTA7ci09Mil7dmFyIGk9MD09PXI/dFtyXTp0W3ItMV0rdFtyXTtuLnVuc2hpZnQocGFyc2VJbnQoaSwxNikpfXJldHVybiBufSx0cmFuc2xhdGVUaWNrVGltZTpmdW5jdGlvbih0KXtmb3IodmFyIGU9MTI3JnQ7dD4+PTc7KWU8PD04LGV8PTEyNyZ0fDEyODtmb3IodmFyIG49W107Oyl7aWYobi5wdXNoKDI1NSZlKSwhKDEyOCZlKSlicmVhaztlPj49OH1yZXR1cm4gbn19KSxyPWZ1bmN0aW9uKHQpe2lmKCF0aGlzKXJldHVybiBuZXcgcih0KTshdHx8bnVsbD09PXQudHlwZSYmdm9pZCAwPT09dC50eXBlfHxudWxsPT09dC5jaGFubmVsJiZ2b2lkIDA9PT10LmNoYW5uZWx8fG51bGw9PT10LnBhcmFtMSYmdm9pZCAwPT09dC5wYXJhbTF8fCh0aGlzLnNldFRpbWUodC50aW1lKSx0aGlzLnNldFR5cGUodC50eXBlKSx0aGlzLnNldENoYW5uZWwodC5jaGFubmVsKSx0aGlzLnNldFBhcmFtMSh0LnBhcmFtMSksdGhpcy5zZXRQYXJhbTIodC5wYXJhbTIpKX07ci5OT1RFX09GRj0xMjgsci5OT1RFX09OPTE0NCxyLkFGVEVSX1RPVUNIPTE2MCxyLkNPTlRST0xMRVI9MTc2LHIuUFJPR1JBTV9DSEFOR0U9MTkyLHIuQ0hBTk5FTF9BRlRFUlRPVUNIPTIwOCxyLlBJVENIX0JFTkQ9MjI0LHIucHJvdG90eXBlLnNldFRpbWU9ZnVuY3Rpb24odCl7dGhpcy50aW1lPW4udHJhbnNsYXRlVGlja1RpbWUodHx8MCl9LHIucHJvdG90eXBlLnNldFR5cGU9ZnVuY3Rpb24odCl7aWYodDxyLk5PVEVfT0ZGfHx0PnIuUElUQ0hfQkVORCl0aHJvdyBuZXcgRXJyb3IoXCJUcnlpbmcgdG8gc2V0IGFuIHVua25vd24gZXZlbnQ6IFwiK3QpO3RoaXMudHlwZT10fSxyLnByb3RvdHlwZS5zZXRDaGFubmVsPWZ1bmN0aW9uKHQpe2lmKHQ8MHx8dD4xNSl0aHJvdyBuZXcgRXJyb3IoXCJDaGFubmVsIGlzIG91dCBvZiBib3VuZHMuXCIpO3RoaXMuY2hhbm5lbD10fSxyLnByb3RvdHlwZS5zZXRQYXJhbTE9ZnVuY3Rpb24odCl7dGhpcy5wYXJhbTE9dH0sci5wcm90b3R5cGUuc2V0UGFyYW0yPWZ1bmN0aW9uKHQpe3RoaXMucGFyYW0yPXR9LHIucHJvdG90eXBlLnRvQnl0ZXM9ZnVuY3Rpb24oKXt2YXIgdD1bXSxlPXRoaXMudHlwZXwxNSZ0aGlzLmNoYW5uZWw7cmV0dXJuIHQucHVzaC5hcHBseSh0LHRoaXMudGltZSksdC5wdXNoKGUpLHQucHVzaCh0aGlzLnBhcmFtMSksdm9pZCAwIT09dGhpcy5wYXJhbTImJm51bGwhPT10aGlzLnBhcmFtMiYmdC5wdXNoKHRoaXMucGFyYW0yKSx0fTt2YXIgaT1mdW5jdGlvbih0KXtpZighdGhpcylyZXR1cm4gbmV3IGkodCk7dGhpcy5zZXRUaW1lKHQudGltZSksdGhpcy5zZXRUeXBlKHQudHlwZSksdGhpcy5zZXREYXRhKHQuZGF0YSl9O2kuU0VRVUVOQ0U9MCxpLlRFWFQ9MSxpLkNPUFlSSUdIVD0yLGkuVFJBQ0tfTkFNRT0zLGkuSU5TVFJVTUVOVD00LGkuTFlSSUM9NSxpLk1BUktFUj02LGkuQ1VFX1BPSU5UPTcsaS5DSEFOTkVMX1BSRUZJWD0zMixpLkVORF9PRl9UUkFDSz00NyxpLlRFTVBPPTgxLGkuU01QVEU9ODQsaS5USU1FX1NJRz04OCxpLktFWV9TSUc9ODksaS5TRVFfRVZFTlQ9MTI3LGkucHJvdG90eXBlLnNldFRpbWU9ZnVuY3Rpb24odCl7dGhpcy50aW1lPW4udHJhbnNsYXRlVGlja1RpbWUodHx8MCl9LGkucHJvdG90eXBlLnNldFR5cGU9ZnVuY3Rpb24odCl7dGhpcy50eXBlPXR9LGkucHJvdG90eXBlLnNldERhdGE9ZnVuY3Rpb24odCl7dGhpcy5kYXRhPXR9LGkucHJvdG90eXBlLnRvQnl0ZXM9ZnVuY3Rpb24oKXtpZighdGhpcy50eXBlKXRocm93IG5ldyBFcnJvcihcIlR5cGUgZm9yIG1ldGEtZXZlbnQgbm90IHNwZWNpZmllZC5cIik7dmFyIHQ9W107aWYodC5wdXNoLmFwcGx5KHQsdGhpcy50aW1lKSx0LnB1c2goMjU1LHRoaXMudHlwZSksQXJyYXkuaXNBcnJheSh0aGlzLmRhdGEpKXQucHVzaCh0aGlzLmRhdGEubGVuZ3RoKSx0LnB1c2guYXBwbHkodCx0aGlzLmRhdGEpO2Vsc2UgaWYoXCJudW1iZXJcIj09dHlwZW9mIHRoaXMuZGF0YSl0LnB1c2goMSx0aGlzLmRhdGEpO2Vsc2UgaWYobnVsbCE9PXRoaXMuZGF0YSYmdm9pZCAwIT09dGhpcy5kYXRhKXt0LnB1c2godGhpcy5kYXRhLmxlbmd0aCk7dmFyIGU9dGhpcy5kYXRhLnNwbGl0KFwiXCIpLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdC5jaGFyQ29kZUF0KDApfSk7dC5wdXNoLmFwcGx5KHQsZSl9ZWxzZSB0LnB1c2goMCk7cmV0dXJuIHR9O3ZhciBhPWZ1bmN0aW9uKHQpe2lmKCF0aGlzKXJldHVybiBuZXcgYSh0KTt2YXIgZT10fHx7fTt0aGlzLmV2ZW50cz1lLmV2ZW50c3x8W119O2EuU1RBUlRfQllURVM9Wzc3LDg0LDExNCwxMDddLGEuRU5EX0JZVEVTPVswLDI1NSw0NywwXSxhLnByb3RvdHlwZS5hZGRFdmVudD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5ldmVudHMucHVzaCh0KSx0aGlzfSxhLnByb3RvdHlwZS5hZGROb3RlT249YS5wcm90b3R5cGUubm90ZU9uPWZ1bmN0aW9uKHQsaSxhLG8pe3JldHVybiB0aGlzLmV2ZW50cy5wdXNoKG5ldyByKHt0eXBlOnIuTk9URV9PTixjaGFubmVsOnQscGFyYW0xOm4uZW5zdXJlTWlkaVBpdGNoKGkpLHBhcmFtMjpvfHxlLHRpbWU6YXx8MH0pKSx0aGlzfSxhLnByb3RvdHlwZS5hZGROb3RlT2ZmPWEucHJvdG90eXBlLm5vdGVPZmY9ZnVuY3Rpb24odCxpLGEsbyl7cmV0dXJuIHRoaXMuZXZlbnRzLnB1c2gobmV3IHIoe3R5cGU6ci5OT1RFX09GRixjaGFubmVsOnQscGFyYW0xOm4uZW5zdXJlTWlkaVBpdGNoKGkpLHBhcmFtMjpvfHxlLHRpbWU6YXx8MH0pKSx0aGlzfSxhLnByb3RvdHlwZS5hZGROb3RlPWEucHJvdG90eXBlLm5vdGU9ZnVuY3Rpb24odCxlLG4scixpKXtyZXR1cm4gdGhpcy5ub3RlT24odCxlLHIsaSksbiYmdGhpcy5ub3RlT2ZmKHQsZSxuLGkpLHRoaXN9LGEucHJvdG90eXBlLmFkZENob3JkPWEucHJvdG90eXBlLmNob3JkPWZ1bmN0aW9uKHQsZSxuLHIpe2lmKCFBcnJheS5pc0FycmF5KGUpJiYhZS5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiQ2hvcmQgbXVzdCBiZSBhbiBhcnJheSBvZiBwaXRjaGVzXCIpO3JldHVybiBlLmZvckVhY2goZnVuY3Rpb24oZSl7dGhpcy5ub3RlT24odCxlLDAscil9LHRoaXMpLGUuZm9yRWFjaChmdW5jdGlvbihlLHIpezA9PT1yP3RoaXMubm90ZU9mZih0LGUsbik6dGhpcy5ub3RlT2ZmKHQsZSl9LHRoaXMpLHRoaXN9LGEucHJvdG90eXBlLnNldEluc3RydW1lbnQ9YS5wcm90b3R5cGUuaW5zdHJ1bWVudD1mdW5jdGlvbih0LGUsbil7cmV0dXJuIHRoaXMuZXZlbnRzLnB1c2gobmV3IHIoe3R5cGU6ci5QUk9HUkFNX0NIQU5HRSxjaGFubmVsOnQscGFyYW0xOmUsdGltZTpufHwwfSkpLHRoaXN9LGEucHJvdG90eXBlLnNldFRlbXBvPWEucHJvdG90eXBlLnRlbXBvPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuZXZlbnRzLnB1c2gobmV3IGkoe3R5cGU6aS5URU1QTyxkYXRhOm4ubXBxbkZyb21CcG0odCksdGltZTplfHwwfSkpLHRoaXN9LGEucHJvdG90eXBlLnRvQnl0ZXM9ZnVuY3Rpb24oKXt2YXIgdD0wLGU9W10scj1hLlNUQVJUX0JZVEVTLGk9YS5FTkRfQllURVMsbz1mdW5jdGlvbihuKXt2YXIgcj1uLnRvQnl0ZXMoKTt0Kz1yLmxlbmd0aCxlLnB1c2guYXBwbHkoZSxyKX07dGhpcy5ldmVudHMuZm9yRWFjaChvKSx0Kz1pLmxlbmd0aDt2YXIgcz1uLnN0cjJCeXRlcyh0LnRvU3RyaW5nKDE2KSw0KTtyZXR1cm4gci5jb25jYXQocyxlLGkpfTt2YXIgbz1mdW5jdGlvbih0KXtpZighdGhpcylyZXR1cm4gbmV3IG8odCk7dmFyIGU9dHx8e307aWYoZS50aWNrcyl7aWYoXCJudW1iZXJcIiE9dHlwZW9mIGUudGlja3MpdGhyb3cgbmV3IEVycm9yKFwiVGlja3MgcGVyIGJlYXQgbXVzdCBiZSBhIG51bWJlciFcIik7aWYoZS50aWNrczw9MHx8ZS50aWNrcz49MzI3Njh8fGUudGlja3MlMSE9MCl0aHJvdyBuZXcgRXJyb3IoXCJUaWNrcyBwZXIgYmVhdCBtdXN0IGJlIGFuIGludGVnZXIgYmV0d2VlbiAxIGFuZCAzMjc2NyFcIil9dGhpcy50aWNrcz1lLnRpY2tzfHwxMjgsdGhpcy50cmFja3M9ZS50cmFja3N8fFtdfTtvLkhEUl9DSFVOS0lEPVwiTVRoZFwiLG8uSERSX0NIVU5LX1NJWkU9XCJcXDBcXDBcXDBcdTAwMDZcIixvLkhEUl9UWVBFMD1cIlxcMFxcMFwiLG8uSERSX1RZUEUxPVwiXFwwXHUwMDAxXCIsby5wcm90b3R5cGUuYWRkVHJhY2s9ZnVuY3Rpb24odCl7cmV0dXJuIHQ/KHRoaXMudHJhY2tzLnB1c2godCksdGhpcyk6KHQ9bmV3IGEsdGhpcy50cmFja3MucHVzaCh0KSx0KX0sby5wcm90b3R5cGUudG9CeXRlcz1mdW5jdGlvbigpe3ZhciB0PXRoaXMudHJhY2tzLmxlbmd0aC50b1N0cmluZygxNiksZT1vLkhEUl9DSFVOS0lEK28uSERSX0NIVU5LX1NJWkU7cmV0dXJuIHBhcnNlSW50KHQsMTYpPjE/ZSs9by5IRFJfVFlQRTE6ZSs9by5IRFJfVFlQRTAsZSs9bi5jb2RlczJTdHIobi5zdHIyQnl0ZXModCwyKSksZSs9U3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLnRpY2tzLzI1Nix0aGlzLnRpY2tzJTI1NiksdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbih0KXtlKz1uLmNvZGVzMlN0cih0LnRvQnl0ZXMoKSl9KSxlfSx0LlV0aWw9bix0LkZpbGU9byx0LlRyYWNrPWEsdC5FdmVudD1yLHQuTWV0YUV2ZW50PWl9KG4pLHZvaWQgMCE9PXQmJm51bGwhPT10P3QuZXhwb3J0cz1uOnZvaWQgMCE9PWUmJm51bGwhPT1lP2U9bjp0aGlzLk1pZGk9bn0pLmNhbGwoZSxuKDEyKSh0KSl9LGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbih0KXtmdW5jdGlvbiBlKHQpe3ZhciBlPXQucmVhZCg0KSxuPXQucmVhZEludDMyKCk7cmV0dXJue2lkOmUsbGVuZ3RoOm4sZGF0YTp0LnJlYWQobil9fXZhciBuO3N0cmVhbT1yKHQpO3ZhciBpPWUoc3RyZWFtKTtpZihcIk1UaGRcIiE9aS5pZHx8NiE9aS5sZW5ndGgpdGhyb3dcIkJhZCAubWlkIGZpbGUgLSBoZWFkZXIgbm90IGZvdW5kXCI7dmFyIGE9cihpLmRhdGEpLG89YS5yZWFkSW50MTYoKSxzPWEucmVhZEludDE2KCksdT1hLnJlYWRJbnQxNigpO2lmKDMyNzY4JnUpdGhyb3dcIkV4cHJlc3NpbmcgdGltZSBkaXZpc2lvbiBpbiBTTVRQRSBmcmFtZXMgaXMgbm90IHN1cHBvcnRlZCB5ZXRcIjt0aWNrc1BlckJlYXQ9dTtmb3IodmFyIGM9e2Zvcm1hdFR5cGU6byx0cmFja0NvdW50OnMsdGlja3NQZXJCZWF0OnRpY2tzUGVyQmVhdH0saD1bXSxmPTA7ZjxjLnRyYWNrQ291bnQ7ZisrKXtoW2ZdPVtdO3ZhciBkPWUoc3RyZWFtKTtpZihcIk1UcmtcIiE9ZC5pZCl0aHJvd1wiVW5leHBlY3RlZCBjaHVuayAtIGV4cGVjdGVkIE1UcmssIGdvdCBcIitkLmlkO2Zvcih2YXIgbD1yKGQuZGF0YSk7IWwuZW9mKCk7KXt2YXIgcD1mdW5jdGlvbih0KXt2YXIgZT17fTtlLmRlbHRhVGltZT10LnJlYWRWYXJJbnQoKTt2YXIgcj10LnJlYWRJbnQ4KCk7aWYoMjQwPT0oMjQwJnIpKXtpZigyNTU9PXIpe2UudHlwZT1cIm1ldGFcIjt2YXIgaT10LnJlYWRJbnQ4KCksYT10LnJlYWRWYXJJbnQoKTtzd2l0Y2goaSl7Y2FzZSAwOmlmKGUuc3VidHlwZT1cInNlcXVlbmNlTnVtYmVyXCIsMiE9YSl0aHJvd1wiRXhwZWN0ZWQgbGVuZ3RoIGZvciBzZXF1ZW5jZU51bWJlciBldmVudCBpcyAyLCBnb3QgXCIrYTtyZXR1cm4gZS5udW1iZXI9dC5yZWFkSW50MTYoKSxlO2Nhc2UgMTpyZXR1cm4gZS5zdWJ0eXBlPVwidGV4dFwiLGUudGV4dD10LnJlYWQoYSksZTtjYXNlIDI6cmV0dXJuIGUuc3VidHlwZT1cImNvcHlyaWdodE5vdGljZVwiLGUudGV4dD10LnJlYWQoYSksZTtjYXNlIDM6cmV0dXJuIGUuc3VidHlwZT1cInRyYWNrTmFtZVwiLGUudGV4dD10LnJlYWQoYSksZTtjYXNlIDQ6cmV0dXJuIGUuc3VidHlwZT1cImluc3RydW1lbnROYW1lXCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgNTpyZXR1cm4gZS5zdWJ0eXBlPVwibHlyaWNzXCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgNjpyZXR1cm4gZS5zdWJ0eXBlPVwibWFya2VyXCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgNzpyZXR1cm4gZS5zdWJ0eXBlPVwiY3VlUG9pbnRcIixlLnRleHQ9dC5yZWFkKGEpLGU7Y2FzZSAzMjppZihlLnN1YnR5cGU9XCJtaWRpQ2hhbm5lbFByZWZpeFwiLDEhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3IgbWlkaUNoYW5uZWxQcmVmaXggZXZlbnQgaXMgMSwgZ290IFwiK2E7cmV0dXJuIGUuY2hhbm5lbD10LnJlYWRJbnQ4KCksZTtjYXNlIDQ3OmlmKGUuc3VidHlwZT1cImVuZE9mVHJhY2tcIiwwIT1hKXRocm93XCJFeHBlY3RlZCBsZW5ndGggZm9yIGVuZE9mVHJhY2sgZXZlbnQgaXMgMCwgZ290IFwiK2E7cmV0dXJuIGU7Y2FzZSA4MTppZihlLnN1YnR5cGU9XCJzZXRUZW1wb1wiLDMhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3Igc2V0VGVtcG8gZXZlbnQgaXMgMywgZ290IFwiK2E7cmV0dXJuIGUubWljcm9zZWNvbmRzUGVyQmVhdD0odC5yZWFkSW50OCgpPDwxNikrKHQucmVhZEludDgoKTw8OCkrdC5yZWFkSW50OCgpLGU7Y2FzZSA4NDppZihlLnN1YnR5cGU9XCJzbXB0ZU9mZnNldFwiLDUhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3Igc21wdGVPZmZzZXQgZXZlbnQgaXMgNSwgZ290IFwiK2E7dmFyIG89dC5yZWFkSW50OCgpO3JldHVybiBlLmZyYW1lUmF0ZT17MDoyNCwzMjoyNSw2NDoyOSw5NjozMH1bOTYmb10sZS5ob3VyPTMxJm8sZS5taW49dC5yZWFkSW50OCgpLGUuc2VjPXQucmVhZEludDgoKSxlLmZyYW1lPXQucmVhZEludDgoKSxlLnN1YmZyYW1lPXQucmVhZEludDgoKSxlO2Nhc2UgODg6aWYoZS5zdWJ0eXBlPVwidGltZVNpZ25hdHVyZVwiLDQhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3IgdGltZVNpZ25hdHVyZSBldmVudCBpcyA0LCBnb3QgXCIrYTtyZXR1cm4gZS5udW1lcmF0b3I9dC5yZWFkSW50OCgpLGUuZGVub21pbmF0b3I9TWF0aC5wb3coMix0LnJlYWRJbnQ4KCkpLGUubWV0cm9ub21lPXQucmVhZEludDgoKSxlLnRoaXJ0eXNlY29uZHM9dC5yZWFkSW50OCgpLGU7Y2FzZSA4OTppZihlLnN1YnR5cGU9XCJrZXlTaWduYXR1cmVcIiwyIT1hKXRocm93XCJFeHBlY3RlZCBsZW5ndGggZm9yIGtleVNpZ25hdHVyZSBldmVudCBpcyAyLCBnb3QgXCIrYTtyZXR1cm4gZS5rZXk9dC5yZWFkSW50OCghMCksZS5zY2FsZT10LnJlYWRJbnQ4KCksZTtjYXNlIDEyNzpyZXR1cm4gZS5zdWJ0eXBlPVwic2VxdWVuY2VyU3BlY2lmaWNcIixlLmRhdGE9dC5yZWFkKGEpLGU7ZGVmYXVsdDpyZXR1cm4gZS5zdWJ0eXBlPVwidW5rbm93blwiLGUuZGF0YT10LnJlYWQoYSksZX1yZXR1cm4gZS5kYXRhPXQucmVhZChhKSxlfWlmKDI0MD09cil7ZS50eXBlPVwic3lzRXhcIjt2YXIgYT10LnJlYWRWYXJJbnQoKTtyZXR1cm4gZS5kYXRhPXQucmVhZChhKSxlfWlmKDI0Nz09cil7ZS50eXBlPVwiZGl2aWRlZFN5c0V4XCI7dmFyIGE9dC5yZWFkVmFySW50KCk7cmV0dXJuIGUuZGF0YT10LnJlYWQoYSksZX10aHJvd1wiVW5yZWNvZ25pc2VkIE1JREkgZXZlbnQgdHlwZSBieXRlOiBcIityfXZhciBzOzA9PSgxMjgmcik/KHM9cixyPW4pOihzPXQucmVhZEludDgoKSxuPXIpO3ZhciB1PXI+PjQ7c3dpdGNoKGUuY2hhbm5lbD0xNSZyLGUudHlwZT1cImNoYW5uZWxcIix1KXtjYXNlIDg6cmV0dXJuIGUuc3VidHlwZT1cIm5vdGVPZmZcIixlLm5vdGVOdW1iZXI9cyxlLnZlbG9jaXR5PXQucmVhZEludDgoKSxlO2Nhc2UgOTpyZXR1cm4gZS5ub3RlTnVtYmVyPXMsZS52ZWxvY2l0eT10LnJlYWRJbnQ4KCksMD09ZS52ZWxvY2l0eT9lLnN1YnR5cGU9XCJub3RlT2ZmXCI6ZS5zdWJ0eXBlPVwibm90ZU9uXCIsZTtjYXNlIDEwOnJldHVybiBlLnN1YnR5cGU9XCJub3RlQWZ0ZXJ0b3VjaFwiLGUubm90ZU51bWJlcj1zLGUuYW1vdW50PXQucmVhZEludDgoKSxlO2Nhc2UgMTE6cmV0dXJuIGUuc3VidHlwZT1cImNvbnRyb2xsZXJcIixlLmNvbnRyb2xsZXJUeXBlPXMsZS52YWx1ZT10LnJlYWRJbnQ4KCksZTtjYXNlIDEyOnJldHVybiBlLnN1YnR5cGU9XCJwcm9ncmFtQ2hhbmdlXCIsZS5wcm9ncmFtTnVtYmVyPXMsZTtjYXNlIDEzOnJldHVybiBlLnN1YnR5cGU9XCJjaGFubmVsQWZ0ZXJ0b3VjaFwiLGUuYW1vdW50PXMsZTtjYXNlIDE0OnJldHVybiBlLnN1YnR5cGU9XCJwaXRjaEJlbmRcIixlLnZhbHVlPXMrKHQucmVhZEludDgoKTw8NyksZTtkZWZhdWx0OnRocm93XCJVbnJlY29nbmlzZWQgTUlESSBldmVudCB0eXBlOiBcIit1fX0obCk7aFtmXS5wdXNoKHApfX1yZXR1cm57aGVhZGVyOmMsdHJhY2tzOmh9fWZ1bmN0aW9uIHIodCl7ZnVuY3Rpb24gZShlKXt2YXIgbj10LnN1YnN0cihzLGUpO3JldHVybiBzKz1lLG59ZnVuY3Rpb24gbigpe3ZhciBlPSh0LmNoYXJDb2RlQXQocyk8PDI0KSsodC5jaGFyQ29kZUF0KHMrMSk8PDE2KSsodC5jaGFyQ29kZUF0KHMrMik8PDgpK3QuY2hhckNvZGVBdChzKzMpO3JldHVybiBzKz00LGV9ZnVuY3Rpb24gcigpe3ZhciBlPSh0LmNoYXJDb2RlQXQocyk8PDgpK3QuY2hhckNvZGVBdChzKzEpO3JldHVybiBzKz0yLGV9ZnVuY3Rpb24gaShlKXt2YXIgbj10LmNoYXJDb2RlQXQocyk7cmV0dXJuIGUmJm4+MTI3JiYobi09MjU2KSxzKz0xLG59ZnVuY3Rpb24gYSgpe3JldHVybiBzPj10Lmxlbmd0aH1mdW5jdGlvbiBvKCl7Zm9yKHZhciB0PTA7Oyl7dmFyIGU9aSgpO2lmKCEoMTI4JmUpKXJldHVybiB0K2U7dCs9MTI3JmUsdDw8PTd9fXZhciBzPTA7cmV0dXJue2VvZjphLHJlYWQ6ZSxyZWFkSW50MzI6bixyZWFkSW50MTY6cixyZWFkSW50ODppLHJlYWRWYXJJbnQ6b319dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiBuKHQpfX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIHQud2VicGFja1BvbHlmaWxsfHwodC5kZXByZWNhdGU9ZnVuY3Rpb24oKXt9LHQucGF0aHM9W10sdC5jaGlsZHJlbnx8KHQuY2hpbGRyZW49W10pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwibG9hZGVkXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHQubH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcImlkXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHQuaX19KSx0LndlYnBhY2tQb2x5ZmlsbD0xKSx0fX1dKX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TWlkaUNvbnZlcnQuanMubWFwIl19
