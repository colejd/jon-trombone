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

    _createClass(GUI, null, [{
        key: "Init",


        /**
         * Creates and attaches a GUI to the page if DAT.GUI is included.
         */
        value: function Init(controller) {
            if (typeof dat === "undefined") {
                console.warn("No DAT.GUI instance found. Import on the page to use!");
                return;
            }

            var gui = new dat.GUI({});

            var jon = controller;

            gui.add(jon.trombone, 'ToggleMute');

            var jonGUI = gui.addFolder("Jon");
            jonGUI.add(jon, "moveJaw").listen();
            jonGUI.add(jon, "jawFlapSpeed").min(0).max(100);
            jonGUI.add(jon, "jawOpenOffset").min(0).max(1);

            var voiceGUI = gui.addFolder("Voice");
            voiceGUI.add(jon.trombone, 'autoWobble');
            voiceGUI.add(jon.trombone.Glottis, 'addPitchVariance').listen();
            voiceGUI.add(jon.trombone.Glottis, 'addTensenessVariance').listen();
            voiceGUI.add(jon.trombone.Glottis, 'UITenseness').min(0).max(1);
            voiceGUI.add(jon.trombone.Glottis, 'vibratoAmount').min(0).max(0.5);
            voiceGUI.add(jon.trombone.Glottis, 'UIFrequency').min(1).max(1000).listen();
            voiceGUI.add(jon.trombone.Glottis, 'loudness').min(0).max(1).listen();

            var tractGUI = gui.addFolder("Tract");
            tractGUI.add(jon.trombone.Tract, 'movementSpeed').min(1).max(30).step(1);
            tractGUI.add(jon.trombone.Tract, 'velumTarget').min(0.001).max(2);
            tractGUI.add(jon.trombone.TractUI, 'target').min(0.001).max(1);
            tractGUI.add(jon.trombone.TractUI, 'index').min(0).max(43).step(1);
            tractGUI.add(jon.trombone.TractUI, 'radius').min(0).max(5).step(1);

            var songGUI = gui.addFolder("midi");
            songGUI.add(jon.midiController, 'PlaySong');
            songGUI.add(jon.midiController, 'Stop');
            songGUI.add(jon.midiController, 'Restart');
            songGUI.add(jon.midiController, 'currentTrack').min(0).max(20).step(1).listen();
            songGUI.add(jon.midiController, 'baseFreq').min(1).max(2000);
            songGUI.add(jon, 'flapWhileSinging');
            songGUI.add(jon, 'legato').listen();
        }
    }]);

    return GUI;
}();

exports.GUI = GUI;

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

var _midiDropArea = require("./midi/midi-drop-area.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JonTrombone = function () {
    function JonTrombone(container) {
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
        this.trombone = new _pinkTrombone.PinkTrombone();
        setTimeout(function () {
            _this.trombone.StartAudio();
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
        var dropArea = new _midiDropArea.MidiDropArea(this);

        this.SetUpThree();
        this.SetUpScene();

        // Start the update loop
        this.OnUpdate();
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
            light2.position.set(0, 1, 0);
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

                var note = this.midiController.GetPitch();
                if (note != this.lastNote) {
                    //console.log(note);
                    // Do the note
                    if (note === undefined) {
                        // Note off
                        if (!this.legato) this.trombone.Glottis.loudness = 0;
                        // Close jaw
                        this.jaw.position.z = this.jawShutZ;
                        this.trombone.TractUI.SetLipsClosed(1);
                    } else {
                        // Note on
                        //this.trombone.Glottis.loudness = 1;
                        // Play frequency
                        var freq = this.midiController.MIDIToFrequency(note.midi);
                        //console.log(freq);
                        this.trombone.Glottis.UIFrequency = freq;
                        this.trombone.Glottis.loudness = note.velocity;
                        // Open jaw
                        this.jaw.position.z = this.jawShutZ + this.jawOpenOffset;
                        this.trombone.TractUI.SetLipsClosed(0);
                    }

                    this.lastNote = note;
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

},{"./midi/midi-controller.js":4,"./midi/midi-drop-area.js":5,"./pink-trombone/pink-trombone.js":12,"./utils/model-loader.js":13}],3:[function(require,module,exports){
"use strict";

var _webglDetect = require("./utils/webgl-detect.js");

var _jonTrombone = require("./jon-trombone.js");

var _gui = require("./gui.js");

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
    _gui.GUI.Init(jonTrombone);
}

},{"./gui.js":1,"./jon-trombone.js":2,"./utils/webgl-detect.js":14}],4:[function(require,module,exports){
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

        this.baseFreq = 110; //110 is A2

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
            return this.baseFreq * Math.pow(2, (midiCode - 57) / 12);
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

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Drop-in drag and drop support for the MidiController
 */
var MidiDropArea = exports.MidiDropArea = function () {
    function MidiDropArea(controller) {
        var _this = this;

        _classCallCheck(this, MidiDropArea);

        this.controller = controller;

        this.dropArea = document.createElement("div");

        this.dropArea.style.position = "absolute";
        this.dropArea.style.top = "0";
        this.dropArea.style.left = "0";
        this.dropArea.style.width = "100%";
        this.dropArea.style.height = "100%";

        this.MakeDroppable(this.dropArea, function (files) {
            //read the file
            var reader = new FileReader();
            reader.onload = function (e) {
                _this.controller.midiController.LoadSongDirect(reader.result);
            };
            reader.readAsBinaryString(files[0]);
        });

        this.controller.container.appendChild(this.dropArea);
    }

    _createClass(MidiDropArea, [{
        key: "Callback",
        value: function Callback() {
            console.log("Callback");
        }

        // From http://bitwiser.in/2015/08/08/creating-dropzone-for-drag-drop-file.html

    }, {
        key: "MakeDroppable",
        value: function MakeDroppable(element, callback) {

            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('multiple', true);
            input.style.display = 'none';

            input.addEventListener('change', triggerCallback);
            element.appendChild(input);

            element.addEventListener('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                element.classList.add('dragover');
            });

            element.addEventListener('dragleave', function (e) {
                e.preventDefault();
                e.stopPropagation();
                element.classList.remove('dragover');
            });

            element.addEventListener('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
                element.classList.remove('dragover');
                triggerCallback(e);
            });

            // element.addEventListener('click', function() {
            //     input.value = null;
            //     input.click();
            // });

            function triggerCallback(e) {
                var files;
                if (e.dataTransfer) {
                    files = e.dataTransfer.files;
                } else if (e.target) {
                    files = e.target.files;
                }
                callback.call(null, files);
            }
        }
    }]);

    return MidiDropArea;
}();

},{}],6:[function(require,module,exports){
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

        this.useWhiteNoise = true;
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
            whiteNoise.connect(aspirateFilter);
            aspirateFilter.connect(this.scriptProcessor);

            var fricativeFilter = this.audioContext.createBiquadFilter();
            fricativeFilter.type = "bandpass";
            fricativeFilter.frequency.value = 1000;
            fricativeFilter.Q.value = 0.5;
            whiteNoise.connect(fricativeFilter);
            fricativeFilter.connect(this.scriptProcessor);

            whiteNoise.start(0);

            // Generate white noise (test)
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
                nowBuffering[i] = this.useWhiteNoise ? Math.random() : 1.0; // gaussian();
            }

            var source = this.audioContext.createBufferSource();
            source.buffer = myArrayBuffer;
            source.loop = true;

            return source;
        }
    }, {
        key: "doScriptProcessor",
        value: function doScriptProcessor(event) {
            var inputArray1 = event.inputBuffer.getChannelData(0);
            var inputArray2 = event.inputBuffer.getChannelData(1);
            var outArray = event.outputBuffer.getChannelData(0);
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

},{}],7:[function(require,module,exports){
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

        this.addPitchVariance = true;
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
            if (this.addTensenessVariance) {
                this.newTenseness = this.UITenseness + 0.1 * _noise2.default.simplex1(this.totalTime * 0.46) + 0.05 * _noise2.default.simplex1(this.totalTime * 0.36);
            } else {
                this.newTenseness = this.UITenseness;
            }
            if (!this.isTouched && this.trombone.alwaysVoice) this.newTenseness += (3 - this.UITenseness) * (1 - this.intensity);

            if (this.isTouched || this.trombone.alwaysVoice) {
                this.intensity += 0.13;
            }
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

},{"../noise.js":11}],8:[function(require,module,exports){
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

        // Jon's UI options
        this.target = 0.1;
        this.index = 42;
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
    function PinkTrombone() {
        _classCallCheck(this, PinkTrombone);

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

},{"./components/audio-system.js":6,"./components/glottis.js":7,"./components/tract-ui.js":8,"./components/tract.js":9,"./math-extensions.js":10}],13:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9ndWkuanMiLCJqcy9qb24tdHJvbWJvbmUuanMiLCJqcy9tYWluLmpzIiwianMvbWlkaS9taWRpLWNvbnRyb2xsZXIuanMiLCJqcy9taWRpL21pZGktZHJvcC1hcmVhLmpzIiwianMvcGluay10cm9tYm9uZS9jb21wb25lbnRzL2F1ZGlvLXN5c3RlbS5qcyIsImpzL3BpbmstdHJvbWJvbmUvY29tcG9uZW50cy9nbG90dGlzLmpzIiwianMvcGluay10cm9tYm9uZS9jb21wb25lbnRzL3RyYWN0LXVpLmpzIiwianMvcGluay10cm9tYm9uZS9jb21wb25lbnRzL3RyYWN0LmpzIiwianMvcGluay10cm9tYm9uZS9tYXRoLWV4dGVuc2lvbnMuanMiLCJqcy9waW5rLXRyb21ib25lL25vaXNlLmpzIiwianMvcGluay10cm9tYm9uZS9waW5rLXRyb21ib25lLmpzIiwianMvdXRpbHMvbW9kZWwtbG9hZGVyLmpzIiwianMvdXRpbHMvd2ViZ2wtZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL21pZGljb252ZXJ0L2J1aWxkL01pZGlDb252ZXJ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0NNLEc7Ozs7Ozs7OztBQUVGOzs7NkJBR1ksVSxFQUFXO0FBQ2YsZ0JBQUcsT0FBTyxHQUFQLEtBQWdCLFdBQW5CLEVBQStCO0FBQy9CLHdCQUFRLElBQVIsQ0FBYSx1REFBYjtBQUNBO0FBQ0g7O0FBRUQsZ0JBQUksTUFBTSxJQUFJLElBQUksR0FBUixDQUFZLEVBQVosQ0FBVjs7QUFHQSxnQkFBSSxNQUFNLFVBQVY7O0FBRUEsZ0JBQUksR0FBSixDQUFRLElBQUksUUFBWixFQUFzQixZQUF0Qjs7QUFFQSxnQkFBSSxTQUFTLElBQUksU0FBSixDQUFjLEtBQWQsQ0FBYjtBQUNBLG1CQUFPLEdBQVAsQ0FBVyxHQUFYLEVBQWdCLFNBQWhCLEVBQTJCLE1BQTNCO0FBQ0Es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QVcsT0FBTyxRQUFRLFlBQWYsSUFBK0IsVUFBOUMsRUFBMEQ7QUFDdEQ7QUFDQSxtQ0FBTyxJQUFQO0FBQ0g7QUFDSixxQkFORCxDQU1FLE9BQU0sQ0FBTixFQUFTLENBQUU7QUFDaEI7O0FBRUQ7QUFDQSx1QkFBTyxLQUFQO0FBQ0g7QUFDRDtBQUNBLG1CQUFPLEtBQVA7QUFDSDs7O3VDQUVrQztBQUFBLGdCQUFmLE9BQWUsdUVBQUwsSUFBSzs7QUFDL0IsZ0JBQUcsV0FBVyxJQUFkLEVBQW1CO0FBQ2Y7QUFHSDtBQUNELDZHQUVpQyxPQUZqQztBQUtIOzs7Ozs7UUFJSSxRLEdBQUEsUTs7O0FDekNUO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5jbGFzcyBHVUkge1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbmQgYXR0YWNoZXMgYSBHVUkgdG8gdGhlIHBhZ2UgaWYgREFULkdVSSBpcyBpbmNsdWRlZC5cbiAgICAgKi9cbiAgICBzdGF0aWMgSW5pdChjb250cm9sbGVyKXtcbiAgICAgICAgICAgIGlmKHR5cGVvZihkYXQpID09PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vIERBVC5HVUkgaW5zdGFuY2UgZm91bmQuIEltcG9ydCBvbiB0aGUgcGFnZSB0byB1c2UhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGd1aSA9IG5ldyBkYXQuR1VJKHtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGpvbiA9IGNvbnRyb2xsZXI7XG5cbiAgICAgICAgZ3VpLmFkZChqb24udHJvbWJvbmUsICdUb2dnbGVNdXRlJyk7XG5cbiAgICAgICAgdmFyIGpvbkdVSSA9IGd1aS5hZGRGb2xkZXIoXCJKb25cIik7XG4gICAgICAgIGpvbkdVSS5hZGQoam9uLCBcIm1vdmVKYXdcIikubGlzdGVuKCk7XG4gICAgICAgIGpvbkdVSS5hZGQoam9uLCBcImphd0ZsYXBTcGVlZFwiKS5taW4oMCkubWF4KDEwMCk7XG4gICAgICAgIGpvbkdVSS5hZGQoam9uLCBcImphd09wZW5PZmZzZXRcIikubWluKDApLm1heCgxKTtcblxuICAgICAgICB2YXIgdm9pY2VHVUkgPSBndWkuYWRkRm9sZGVyKFwiVm9pY2VcIik7XG4gICAgICAgIHZvaWNlR1VJLmFkZChqb24udHJvbWJvbmUsICdhdXRvV29iYmxlJyk7XG4gICAgICAgIHZvaWNlR1VJLmFkZChqb24udHJvbWJvbmUuR2xvdHRpcywgJ2FkZFBpdGNoVmFyaWFuY2UnKS5saXN0ZW4oKTtcbiAgICAgICAgdm9pY2VHVUkuYWRkKGpvbi50cm9tYm9uZS5HbG90dGlzLCAnYWRkVGVuc2VuZXNzVmFyaWFuY2UnKS5saXN0ZW4oKTtcbiAgICAgICAgdm9pY2VHVUkuYWRkKGpvbi50cm9tYm9uZS5HbG90dGlzLCAnVUlUZW5zZW5lc3MnKS5taW4oMCkubWF4KDEpO1xuICAgICAgICB2b2ljZUdVSS5hZGQoam9uLnRyb21ib25lLkdsb3R0aXMsICd2aWJyYXRvQW1vdW50JykubWluKDApLm1heCgwLjUpO1xuICAgICAgICB2b2ljZUdVSS5hZGQoam9uLnRyb21ib25lLkdsb3R0aXMsICdVSUZyZXF1ZW5jeScpLm1pbigxKS5tYXgoMTAwMCkubGlzdGVuKCk7XG4gICAgICAgIHZvaWNlR1VJLmFkZChqb24udHJvbWJvbmUuR2xvdHRpcywgJ2xvdWRuZXNzJykubWluKDApLm1heCgxKS5saXN0ZW4oKTtcblxuICAgICAgICB2YXIgdHJhY3RHVUkgPSBndWkuYWRkRm9sZGVyKFwiVHJhY3RcIik7XG4gICAgICAgIHRyYWN0R1VJLmFkZChqb24udHJvbWJvbmUuVHJhY3QsICdtb3ZlbWVudFNwZWVkJykubWluKDEpLm1heCgzMCkuc3RlcCgxKTtcbiAgICAgICAgdHJhY3RHVUkuYWRkKGpvbi50cm9tYm9uZS5UcmFjdCwgJ3ZlbHVtVGFyZ2V0JykubWluKDAuMDAxKS5tYXgoMik7XG4gICAgICAgIHRyYWN0R1VJLmFkZChqb24udHJvbWJvbmUuVHJhY3RVSSwgJ3RhcmdldCcpLm1pbigwLjAwMSkubWF4KDEpO1xuICAgICAgICB0cmFjdEdVSS5hZGQoam9uLnRyb21ib25lLlRyYWN0VUksICdpbmRleCcpLm1pbigwKS5tYXgoNDMpLnN0ZXAoMSk7XG4gICAgICAgIHRyYWN0R1VJLmFkZChqb24udHJvbWJvbmUuVHJhY3RVSSwgJ3JhZGl1cycpLm1pbigwKS5tYXgoNSkuc3RlcCgxKTtcblxuICAgICAgICB2YXIgc29uZ0dVSSA9IGd1aS5hZGRGb2xkZXIoXCJtaWRpXCIpO1xuICAgICAgICBzb25nR1VJLmFkZChqb24ubWlkaUNvbnRyb2xsZXIsICdQbGF5U29uZycpO1xuICAgICAgICBzb25nR1VJLmFkZChqb24ubWlkaUNvbnRyb2xsZXIsICdTdG9wJyk7XG4gICAgICAgIHNvbmdHVUkuYWRkKGpvbi5taWRpQ29udHJvbGxlciwgJ1Jlc3RhcnQnKTtcbiAgICAgICAgc29uZ0dVSS5hZGQoam9uLm1pZGlDb250cm9sbGVyLCAnY3VycmVudFRyYWNrJykubWluKDApLm1heCgyMCkuc3RlcCgxKS5saXN0ZW4oKTtcbiAgICAgICAgc29uZ0dVSS5hZGQoam9uLm1pZGlDb250cm9sbGVyLCAnYmFzZUZyZXEnKS5taW4oMSkubWF4KDIwMDApO1xuICAgICAgICBzb25nR1VJLmFkZChqb24sICdmbGFwV2hpbGVTaW5naW5nJyk7XG4gICAgICAgIHNvbmdHVUkuYWRkKGpvbiwgJ2xlZ2F0bycpLmxpc3RlbigpO1xuICAgIH1cblxufVxuXG5leHBvcnQgeyBHVUkgfTsiLCJpbXBvcnQgeyBNb2RlbExvYWRlciB9IGZyb20gXCIuL3V0aWxzL21vZGVsLWxvYWRlci5qc1wiO1xuaW1wb3J0IHsgUGlua1Ryb21ib25lIH0gZnJvbSBcIi4vcGluay10cm9tYm9uZS9waW5rLXRyb21ib25lLmpzXCI7XG5pbXBvcnQgeyBNaWRpQ29udHJvbGxlciB9IGZyb20gXCIuL21pZGkvbWlkaS1jb250cm9sbGVyLmpzXCI7XG5pbXBvcnQgeyBNaWRpRHJvcEFyZWEgfSBmcm9tIFwiLi9taWRpL21pZGktZHJvcC1hcmVhLmpzXCI7XG5cbmNsYXNzIEpvblRyb21ib25lIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcikge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmN1cnNvciA9IFwiZGVmYXVsdFwiO1xuXG4gICAgICAgIC8vIFNldCB1cCByZW5kZXJlciBhbmQgZW1iZWQgaW4gY29udGFpbmVyXG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciggeyBhbHBoYTogdHJ1ZSB9ICk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh0aGlzLmNvbnRhaW5lci5vZmZzZXRXaWR0aCwgdGhpcy5jb250YWluZXIub2Zmc2V0SGVpZ2h0KTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDAwMDAwLCAwKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgICAvLyBTZXQgdXAgc2NlbmUgYW5kIHZpZXdcbiAgICAgICAgbGV0IGFzcGVjdCA9IHRoaXMuY29udGFpbmVyLm9mZnNldFdpZHRoIC8gdGhpcy5jb250YWluZXIub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSggNDUsIGFzcGVjdCwgMC4xLCAxMDAgKTtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIC8vIEV4cG9ydCBzY2VuZSBmb3IgdGhyZWUganMgaW5zcGVjdG9yXG4gICAgICAgIC8vd2luZG93LnNjZW5lID0gdGhpcy5zY2VuZTtcblxuICAgICAgICAvLyBTZXQgdXAgY2xvY2sgZm9yIHRpbWluZ1xuICAgICAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG5cbiAgICAgICAgbGV0IHN0YXJ0RGVsYXlNUyA9IDEwMDA7XG4gICAgICAgIHRoaXMudHJvbWJvbmUgPSBuZXcgUGlua1Ryb21ib25lKCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICB0aGlzLnRyb21ib25lLlN0YXJ0QXVkaW8oKTtcbiAgICAgICAgICAgIHRoaXMubW92ZUphdyA9IHRydWU7XG4gICAgICAgIH0sIHN0YXJ0RGVsYXlNUyk7XG5cbiAgICAgICAgLy8gTXV0ZSBidXR0b24gZm9yIHRyb21ib25lXG4gICAgICAgIC8vIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAvLyBidXR0b24uaW5uZXJIVE1MID0gXCJNdXRlXCI7XG4gICAgICAgIC8vIGJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gXCJwb3NpdGlvbjogYWJzb2x1dGU7IGRpc3BsYXk6IGJsb2NrOyB0b3A6IDA7IGxlZnQ6IDA7XCI7XG4gICAgICAgIC8vIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICAgIC8vIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyIChcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgLy8gICAgIHRoaXMudHJvbWJvbmUuVG9nZ2xlTXV0ZSgpO1xuICAgICAgICAvLyAgICAgYnV0dG9uLmlubmVySFRNTCA9IHRoaXMudHJvbWJvbmUubXV0ZWQgPyBcIlVubXV0ZVwiIDogXCJNdXRlXCI7XG4gICAgICAgIC8vIH0pO1xuXG4gICAgICAgIHRoaXMuamF3RmxhcFNwZWVkID0gMjAuMDtcbiAgICAgICAgdGhpcy5qYXdPcGVuT2Zmc2V0ID0gMC4xOTtcbiAgICAgICAgdGhpcy5tb3ZlSmF3ID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGVnYXRvID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZmxhcFdoaWxlU2luZ2luZyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMubWlkaUNvbnRyb2xsZXIgPSBuZXcgTWlkaUNvbnRyb2xsZXIodGhpcyk7XG4gICAgICAgIGxldCBkcm9wQXJlYSA9IG5ldyBNaWRpRHJvcEFyZWEodGhpcyk7XG5cbiAgICAgICAgdGhpcy5TZXRVcFRocmVlKCk7XG4gICAgICAgIHRoaXMuU2V0VXBTY2VuZSgpO1xuXG4gICAgICAgIC8vIFN0YXJ0IHRoZSB1cGRhdGUgbG9vcFxuICAgICAgICB0aGlzLk9uVXBkYXRlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHVwIG5vbi1zY2VuZSBjb25maWcgZm9yIFRocmVlLmpzXG4gICAgICovXG4gICAgU2V0VXBUaHJlZSgpIHtcbiAgICAgICAgaWYoVEhSRUUuT3JiaXRDb250cm9scyAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIC8vIEFkZCBvcmJpdCBjb250cm9sc1xuICAgICAgICAgICAgdGhpcy5jb250cm9scyA9IG5ldyBUSFJFRS5PcmJpdENvbnRyb2xzKCB0aGlzLmNhbWVyYSwgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50ICk7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnRhcmdldC5zZXQoIDAsIDAsIDAgKTtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHMudXBkYXRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJObyBUSFJFRS5PcmJpdENvbnRyb2xzIGRldGVjdGVkLiBJbmNsdWRlIHRvIGFsbG93IGludGVyYWN0aW9uIHdpdGggdGhlIG1vZGVsLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBvcHVsYXRlcyBhbmQgY29uZmlndXJlcyBvYmplY3RzIHdpdGhpbiB0aGUgc2NlbmUuXG4gICAgICovXG4gICAgU2V0VXBTY2VuZSgpIHtcblxuICAgICAgICAvLyBTZXQgY2FtZXJhIHBvc2l0aW9uXG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnNldCggMCwgMCwgMC41ICk7XG5cbiAgICAgICAgLy8gTGlnaHRzXG4gICAgICAgIGxldCBsaWdodDEgPSBuZXcgVEhSRUUuSGVtaXNwaGVyZUxpZ2h0KDB4ZmZmZmZmLCAweDQ0NDQ0NCwgMS4wKTtcbiAgICAgICAgbGlnaHQxLm5hbWUgPSBcIkhlbWlzcGhlcmUgTGlnaHRcIjtcbiAgICAgICAgbGlnaHQxLnBvc2l0aW9uLnNldCgwLCAxLCAwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobGlnaHQxKTtcblxuICAgICAgICBsZXQgbGlnaHQyID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDEuMCk7XG4gICAgICAgIGxpZ2h0Mi5uYW1lID0gXCJEaXJlY3Rpb25hbCBMaWdodFwiO1xuICAgICAgICBsaWdodDIucG9zaXRpb24uc2V0KDAsIDEsIDApO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChsaWdodDIpO1xuXG4gICAgICAgIC8vIExvYWQgdGhlIEpvbiBtb2RlbCBhbmQgcGxhY2UgaXQgaW4gdGhlIHNjZW5lXG4gICAgICAgIE1vZGVsTG9hZGVyLkxvYWRKU09OKFwiLi4vcmVzb3VyY2VzL2pvbi90aHJlZS9qb24uanNvblwiLCAob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmpvbiA9IG9iamVjdDtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKCB0aGlzLmpvbiApO1xuICAgICAgICAgICAgdGhpcy5qb24ucm90YXRpb24ueSA9IChUSFJFRS5NYXRoLmRlZ1RvUmFkKDE1KSk7XG5cbiAgICAgICAgICAgIHRoaXMuamF3ID0gdGhpcy5qb24uc2tlbGV0b24uYm9uZXMuZmluZCgob2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai5uYW1lID09IFwiQm9uZS4wMDZcIjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYodGhpcy5qYXcpe1xuICAgICAgICAgICAgICAgIHRoaXMuamF3U2h1dFogPSB0aGlzLmphdy5wb3NpdGlvbi56O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIGV2ZXJ5IGZyYW1lLiBDb250aW51ZXMgaW5kZWZpbml0ZWx5IGFmdGVyIGJlaW5nIGNhbGxlZCBvbmNlLlxuICAgICAqL1xuICAgIE9uVXBkYXRlKCkge1xuICAgICAgICBsZXQgZGVsdGFUaW1lID0gdGhpcy5jbG9jay5nZXREZWx0YSgpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMuT25VcGRhdGUuYmluZCh0aGlzKSApO1xuXG4gICAgICAgIGlmKHRoaXMubWlkaUNvbnRyb2xsZXIucGxheWluZyl7XG5cbiAgICAgICAgICAgIGxldCBub3RlID0gdGhpcy5taWRpQ29udHJvbGxlci5HZXRQaXRjaCgpO1xuICAgICAgICAgICAgaWYobm90ZSAhPSB0aGlzLmxhc3ROb3RlKXtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKG5vdGUpO1xuICAgICAgICAgICAgICAgIC8vIERvIHRoZSBub3RlXG4gICAgICAgICAgICAgICAgaWYobm90ZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90ZSBvZmZcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxlZ2F0bykgdGhpcy50cm9tYm9uZS5HbG90dGlzLmxvdWRuZXNzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2xvc2UgamF3XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuamF3LnBvc2l0aW9uLnogPSB0aGlzLmphd1NodXRaO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0VUkuU2V0TGlwc0Nsb3NlZCgxKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdGUgb25cbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLnRyb21ib25lLkdsb3R0aXMubG91ZG5lc3MgPSAxO1xuICAgICAgICAgICAgICAgICAgICAvLyBQbGF5IGZyZXF1ZW5jeVxuICAgICAgICAgICAgICAgICAgICBsZXQgZnJlcSA9IHRoaXMubWlkaUNvbnRyb2xsZXIuTUlESVRvRnJlcXVlbmN5KG5vdGUubWlkaSk7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZnJlcSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJvbWJvbmUuR2xvdHRpcy5VSUZyZXF1ZW5jeSA9IGZyZXE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJvbWJvbmUuR2xvdHRpcy5sb3VkbmVzcyA9IG5vdGUudmVsb2NpdHk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE9wZW4gamF3XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuamF3LnBvc2l0aW9uLnogPSB0aGlzLmphd1NodXRaICsgdGhpcy5qYXdPcGVuT2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0VUkuU2V0TGlwc0Nsb3NlZCgwKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMubGFzdE5vdGUgPSBub3RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmphdyAmJiB0aGlzLm1vdmVKYXcgJiYgKCF0aGlzLm1pZGlDb250cm9sbGVyLnBsYXlpbmcgfHwgdGhpcy5mbGFwV2hpbGVTaW5naW5nKSl7XG4gICAgICAgICAgICBsZXQgdGltZSA9IHRoaXMuY2xvY2suZ2V0RWxhcHNlZFRpbWUoKTsvLyAlIDYwO1xuXG4gICAgICAgICAgICAvLyBNb3ZlIHRoZSBqYXdcbiAgICAgICAgICAgIGxldCBwZXJjZW50ID0gKE1hdGguc2luKHRpbWUgKiB0aGlzLmphd0ZsYXBTcGVlZCkgKyAxLjApIC8gMi4wO1xuICAgICAgICAgICAgdGhpcy5qYXcucG9zaXRpb24ueiA9IHRoaXMuamF3U2h1dFogKyAocGVyY2VudCAqIHRoaXMuamF3T3Blbk9mZnNldCk7XG5cbiAgICAgICAgICAgIC8vIE1ha2UgdGhlIGF1ZGlvIG1hdGNoIHRoZSBqYXcgcG9zaXRpb25cbiAgICAgICAgICAgIHRoaXMudHJvbWJvbmUuVHJhY3RVSS5TZXRMaXBzQ2xvc2VkKDEuMCAtIHBlcmNlbnQpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW5kZXJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCB7IEpvblRyb21ib25lIH07IiwiaW1wb3J0IHsgRGV0ZWN0b3IgfSBmcm9tIFwiLi91dGlscy93ZWJnbC1kZXRlY3QuanNcIjtcbmltcG9ydCB7IEpvblRyb21ib25lIH0gZnJvbSBcIi4vam9uLXRyb21ib25lLmpzXCI7XG5pbXBvcnQgeyBHVUkgfSBmcm9tIFwiLi9ndWkuanNcIjtcblxuLy8gT3B0aW9uYWxseSBidW5kbGUgdGhyZWUuanMgYXMgcGFydCBvZiB0aGUgcHJvamVjdFxuLy9pbXBvcnQgVEhSRUVMaWIgZnJvbSBcInRocmVlLWpzXCI7XG4vL3ZhciBUSFJFRSA9IFRIUkVFTGliKCk7IC8vIHJldHVybiBUSFJFRSBKU1xuXG5sZXQgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb24tdHJvbWJvbmUtY29udGFpbmVyXCIpO1xuXG5pZiAoICFEZXRlY3Rvci5IYXNXZWJHTCgpICkge1xuICAgIC8vZXhpdChcIldlYkdMIGlzIG5vdCBzdXBwb3J0ZWQgb24gdGhpcyBicm93c2VyLlwiKTtcbiAgICBjb25zb2xlLmxvZyhcIldlYkdMIGlzIG5vdCBzdXBwb3J0ZWQgb24gdGhpcyBicm93c2VyLlwiKTtcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gRGV0ZWN0b3IuR2V0RXJyb3JIVE1MKCk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJuby13ZWJnbFwiKTtcbn1cbmVsc2V7XG4gICAgbGV0IGpvblRyb21ib25lID0gbmV3IEpvblRyb21ib25lKGNvbnRhaW5lcik7XG4gICAgR1VJLkluaXQoam9uVHJvbWJvbmUpO1xufSIsImxldCBNaWRpQ29udmVydCA9IHJlcXVpcmUoJ21pZGljb252ZXJ0Jyk7XG5cbi8qKlxuICogU2ltcGxlIGNsYXNzIGZvciBNSURJIHBsYXliYWNrLlxuICogVGhlIHBhcmFkaWdtIGhlcmUncyBhIGJpdCB3ZWlyZDsgaXQncyB1cCB0byBhbiBleHRlcm5hbFxuICogc291cmNlIHRvIGFjdHVhbGx5IHByb2R1Y2UgYXVkaW8uIFRoaXMgY2xhc3MganVzdCBtYW5hZ2VzXG4gKiBhIHRpbWVyLCB3aGljaCBHZXRQaXRjaCgpIHJlYWRzIHRvIHByb2R1Y2UgdGhlIFwiY3VycmVudFwiXG4gKiBub3RlIGluZm9ybWF0aW9uLiBcbiAqIFxuICogQXMgYW4gZXhhbXBsZSBvZiB1c2FnZSwgam9uLXRyb21ib25lIGNhbGxzIFBsYXlTb25nKCkgdG9cbiAqIGJlZ2luLCBhbmQgdGhlbiBldmVyeSBmcmFtZSB1c2VzIEdldFBpdGNoKCkgdG8gZmlndXJlIG91dFxuICogd2hhdCB0aGUgY3VycmVudCBmcmVxdWVuY3kgdG8gcHJvZHVjZSBpcy5cbiAqL1xuY2xhc3MgTWlkaUNvbnRyb2xsZXIge1xuXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlcikge1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuXG4gICAgICAgIHRoaXMubWlkaSA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrID0gNTtcblxuICAgICAgICB0aGlzLmJhc2VGcmVxID0gMTEwOyAvLzExMCBpcyBBMlxuXG4gICAgICAgIHRoaXMuY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWRzIGFuZCBwYXJzZXMgYSBNSURJIGZpbGUuXG4gICAgICovXG4gICAgTG9hZFNvbmcocGF0aCwgY2FsbGJhY2spe1xuICAgICAgICB0aGlzLlN0b3AoKTtcbiAgICAgICAgdGhpcy5taWRpID0gbnVsbDtcbiAgICAgICAgTWlkaUNvbnZlcnQubG9hZChwYXRoLCAobWlkaSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNSURJIGxvYWRlZC5cIik7XG4gICAgICAgICAgICB0aGlzLm1pZGkgPSBtaWRpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5taWRpKTtcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrKSBjYWxsYmFjayhtaWRpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgTG9hZFNvbmdEaXJlY3QoZmlsZSl7XG4gICAgICAgIHRoaXMuU3RvcCgpO1xuICAgICAgICB0aGlzLm1pZGkgPSBNaWRpQ29udmVydC5wYXJzZShmaWxlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJNSURJIGxvYWRlZC5cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubWlkaSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgcGl0Y2ggZm9yIHRoZSBzcGVjaWZpZWQgdHJhY2sgYXQgdGhlIGN1cnJlbnQgdGltZSBpbiB0aGUgc29uZy5cbiAgICAgKi9cbiAgICBHZXRQaXRjaCh0cmFja0luZGV4ID0gdGhpcy5jdXJyZW50VHJhY2spe1xuICAgICAgICBsZXQgdGltZSA9IHRoaXMuR2V0U29uZ1Byb2dyZXNzKCk7XG5cbiAgICAgICAgLy8gQ29uc3RyYWluIHRyYWNrIHNwZWNpZmllZCB0byB2YWxpZCByYW5nZVxuICAgICAgICB0cmFja0luZGV4ID0gTWF0aC5taW4odHJhY2tJbmRleCwgdGhpcy5taWRpLnRyYWNrcy5sZW5ndGggLSAxKTtcbiAgICAgICAgdHJhY2tJbmRleCA9IE1hdGgubWF4KHRyYWNrSW5kZXgsIDApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1pZGkudHJhY2tzW3RyYWNrSW5kZXhdLm5vdGVzLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm5vdGVPbiA8PSB0aW1lICYmIHRpbWUgPD0gaXRlbS5ub3RlT2ZmO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBQbGF5U29uZyh0cmFjayA9IDUpe1xuICAgICAgICBpZih0aGlzLnBsYXlpbmcpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbm8gc29uZyBpcyBzcGVjaWZpZWQsIGxvYWQgYSBzb25nXG4gICAgICAgIGlmKCF0aGlzLm1pZGkpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBNSURJIGlzIGxvYWRlZC4gTG9hZGluZyBhbiBleGFtcGxlLi4uXCIpO1xuICAgICAgICAgICAgdGhpcy5Mb2FkU29uZygnLi4vcmVzb3VyY2VzL21pZGkvdW4tb3dlbi13YXMtaGVyLm1pZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLlBsYXlTb25nKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFR1cm4gb2ZmIHNvbWUgc3R1ZmYgc28gdGhlIHNpbmdpbmcga2luZCBvZiBzb3VuZHMgb2theVxuICAgICAgICB0aGlzLkVudGVyU2luZ01vZGUoKTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRUcmFjayA9IHRyYWNrO1xuICAgICAgICB0aGlzLmNsb2NrLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMucGxheWluZyA9IHRydWU7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJQbGF5YmFjayBzdGFydGVkLlwiKTtcblxuICAgIH1cblxuICAgIEdldFNvbmdQcm9ncmVzcygpe1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9jay5nZXRFbGFwc2VkVGltZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGZyb20gYSBNSURJIG5vdGUgY29kZSB0byBpdHMgY29ycmVzcG9uZGluZyBmcmVxdWVuY3kuXG4gICAgICogQHBhcmFtIHsqfSBtaWRpQ29kZSBcbiAgICAgKi9cbiAgICBNSURJVG9GcmVxdWVuY3kobWlkaUNvZGUpe1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNlRnJlcSAqIE1hdGgucG93KDIsIChtaWRpQ29kZSAtIDU3KSAvIDEyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXN0YXJ0cyB0aGUgcGxheWJhY2suXG4gICAgICovXG4gICAgUmVzdGFydCgpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXliYWNrIG1vdmVkIHRvIGJlZ2lubmluZy5cIik7XG4gICAgICAgIHRoaXMuY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdG9wcyBwbGF5YmFjay5cbiAgICAgKi9cbiAgICBTdG9wKCkge1xuICAgICAgICBpZighdGhpcy5wbGF5aW5nKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXliYWNrIHN0b3BwZWQuXCIpO1xuICAgICAgICB0aGlzLmNsb2NrLnN0b3AoKTtcbiAgICAgICAgdGhpcy5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuRXhpdFNpbmdNb2RlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB1cCB0aGUgdHJvbWJvbmUgZm9yIHNpbmdpbmcuXG4gICAgICovXG4gICAgRW50ZXJTaW5nTW9kZSgpe1xuICAgICAgICBpZih0aGlzLmJhY2t1cF9zZXR0aW5ncyl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJhY2t1cF9zZXR0aW5ncyA9IHt9O1xuXG4gICAgICAgIHRoaXMuYmFja3VwX3NldHRpbmdzW1wiYXV0b1dvYmJsZVwiXSA9IHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5hdXRvV29iYmxlO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuYXV0b1dvYmJsZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuYmFja3VwX3NldHRpbmdzW1wiYWRkUGl0Y2hWYXJpYW5jZVwiXSA9IHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLmFkZFBpdGNoVmFyaWFuY2U7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLmFkZFBpdGNoVmFyaWFuY2UgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcImFkZFRlbnNlbmVzc1ZhcmlhbmNlXCJdID0gdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMuYWRkVGVuc2VuZXNzVmFyaWFuY2U7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci50cm9tYm9uZS5HbG90dGlzLmFkZFRlbnNlbmVzc1ZhcmlhbmNlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJ2aWJyYXRvRnJlcXVlbmN5XCJdID0gdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMudmlicmF0b0ZyZXF1ZW5jeTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMudmlicmF0b0ZyZXF1ZW5jeSA9IDA7XG5cbiAgICAgICAgdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJmcmVxdWVuY3lcIl0gPSB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy5VSUZyZXF1ZW5jeTtcblxuICAgICAgICB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcImxvdWRuZXNzXCJdID0gdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMubG91ZG5lc3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzdG9yZXMgdGhlIHRyb21ib25lIHRvIHRoZSBzdGF0ZSBpdCB3YXMgaW4gYmVmb3JlIHNpbmdpbmcuXG4gICAgICovXG4gICAgRXhpdFNpbmdNb2RlKCl7XG4gICAgICAgIGlmKCF0aGlzLmJhY2t1cF9zZXR0aW5ncykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuYXV0b1dvYmJsZSA9IHRoaXMuYmFja3VwX3NldHRpbmdzW1wiYXV0b1dvYmJsZVwiXTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMuYWRkUGl0Y2hWYXJpYW5jZSA9IHRoaXMuYmFja3VwX3NldHRpbmdzW1wiYWRkUGl0Y2hWYXJpYW5jZVwiXTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRyb21ib25lLkdsb3R0aXMuYWRkVGVuc2VuZXNzVmFyaWFuY2UgPSB0aGlzLmJhY2t1cF9zZXR0aW5nc1tcImFkZFRlbnNlbmVzc1ZhcmlhbmNlXCJdO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy52aWJyYXRvRnJlcXVlbmN5ID0gdGhpcy5iYWNrdXBfc2V0dGluZ3NbXCJ2aWJyYXRvRnJlcXVlbmN5XCJdO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy5VSUZyZXF1ZW5jeSA9IHRoaXMuYmFja3VwX3NldHRpbmdzW1wiZnJlcXVlbmN5XCJdO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudHJvbWJvbmUuR2xvdHRpcy5sb3VkbmVzcyA9IHRoaXMuYmFja3VwX3NldHRpbmdzW1wibG91ZG5lc3NcIl07XG5cbiAgICAgICAgdGhpcy5iYWNrdXBfc2V0dGluZ3MgPSBudWxsO1xuICAgIH1cblxufVxuXG5leHBvcnQgeyBNaWRpQ29udHJvbGxlciB9OyIsIlxuLyoqXG4gKiBEcm9wLWluIGRyYWcgYW5kIGRyb3Agc3VwcG9ydCBmb3IgdGhlIE1pZGlDb250cm9sbGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBNaWRpRHJvcEFyZWEge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIpe1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuXG4gICAgICAgIHRoaXMuZHJvcEFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgIHRoaXMuZHJvcEFyZWEuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIHRoaXMuZHJvcEFyZWEuc3R5bGUudG9wID0gXCIwXCI7XG4gICAgICAgIHRoaXMuZHJvcEFyZWEuc3R5bGUubGVmdCA9IFwiMFwiO1xuICAgICAgICB0aGlzLmRyb3BBcmVhLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgIHRoaXMuZHJvcEFyZWEuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG5cbiAgICAgICAgdGhpcy5NYWtlRHJvcHBhYmxlKHRoaXMuZHJvcEFyZWEsIChmaWxlcykgPT4ge1xuICAgICAgICAgICAgLy9yZWFkIHRoZSBmaWxlXG5cdFx0XHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0XHRcdHJlYWRlci5vbmxvYWQgPSAoZSkgPT4ge1xuXHRcdFx0XHR0aGlzLmNvbnRyb2xsZXIubWlkaUNvbnRyb2xsZXIuTG9hZFNvbmdEaXJlY3QocmVhZGVyLnJlc3VsdCk7XG5cdFx0XHR9O1xuXHRcdFx0cmVhZGVyLnJlYWRBc0JpbmFyeVN0cmluZyhmaWxlc1swXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5kcm9wQXJlYSk7XG5cbiAgICB9XG5cbiAgICBDYWxsYmFjaygpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNhbGxiYWNrXCIpO1xuICAgIH1cblxuICAgIC8vIEZyb20gaHR0cDovL2JpdHdpc2VyLmluLzIwMTUvMDgvMDgvY3JlYXRpbmctZHJvcHpvbmUtZm9yLWRyYWctZHJvcC1maWxlLmh0bWxcbiAgICBNYWtlRHJvcHBhYmxlKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG5cbiAgICAgICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2ZpbGUnKTtcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdtdWx0aXBsZScsIHRydWUpO1xuICAgICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRyaWdnZXJDYWxsYmFjayk7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgICAgICBcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RyYWdvdmVyJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ292ZXInKTtcbiAgICAgICAgICAgIHRyaWdnZXJDYWxsYmFjayhlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICBpbnB1dC52YWx1ZSA9IG51bGw7XG4gICAgICAgIC8vICAgICBpbnB1dC5jbGljaygpO1xuICAgICAgICAvLyB9KTtcblxuICAgICAgICBmdW5jdGlvbiB0cmlnZ2VyQ2FsbGJhY2soZSkge1xuICAgICAgICAgICAgdmFyIGZpbGVzO1xuICAgICAgICAgICAgaWYoZS5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgICAgIGZpbGVzID0gZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZS50YXJnZXQpIHtcbiAgICAgICAgICAgIGZpbGVzID0gZS50YXJnZXQuZmlsZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKG51bGwsIGZpbGVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFxufSIsImNsYXNzIEF1ZGlvU3lzdGVtIHsgIFxuXG4gICAgY29uc3RydWN0b3IodHJvbWJvbmUpIHtcbiAgICAgICAgdGhpcy50cm9tYm9uZSA9IHRyb21ib25lO1xuXG4gICAgICAgIHRoaXMuYmxvY2tMZW5ndGggPSA1MTI7XG4gICAgICAgIHRoaXMuYmxvY2tUaW1lID0gMTtcbiAgICAgICAgdGhpcy5zb3VuZE9uID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy51c2VXaGl0ZU5vaXNlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dHx8d2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgICAgICAgdGhpcy5hdWRpb0NvbnRleHQgPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpOyAgICAgIFxuICAgICAgICB0aGlzLnRyb21ib25lLnNhbXBsZVJhdGUgPSB0aGlzLmF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ibG9ja1RpbWUgPSB0aGlzLmJsb2NrTGVuZ3RoL3RoaXMudHJvbWJvbmUuc2FtcGxlUmF0ZTtcbiAgICB9XG4gICAgXG4gICAgc3RhcnRTb3VuZCgpIHtcbiAgICAgICAgLy9zY3JpcHRQcm9jZXNzb3IgbWF5IG5lZWQgYSBkdW1teSBpbnB1dCBjaGFubmVsIG9uIGlPU1xuICAgICAgICB0aGlzLnNjcmlwdFByb2Nlc3NvciA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZVNjcmlwdFByb2Nlc3Nvcih0aGlzLmJsb2NrTGVuZ3RoLCAyLCAxKTtcbiAgICAgICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuY29ubmVjdCh0aGlzLmF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7IFxuICAgICAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IHRoaXMuZG9TY3JpcHRQcm9jZXNzb3IuYmluZCh0aGlzKTtcbiAgICBcbiAgICAgICAgdmFyIHdoaXRlTm9pc2UgPSB0aGlzLmNyZWF0ZVdoaXRlTm9pc2VOb2RlKDIgKiB0aGlzLnRyb21ib25lLnNhbXBsZVJhdGUpOyAvLyAyIHNlY29uZHMgb2Ygbm9pc2VcbiAgICAgICAgXG4gICAgICAgIHZhciBhc3BpcmF0ZUZpbHRlciA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICAgICAgICBhc3BpcmF0ZUZpbHRlci50eXBlID0gXCJiYW5kcGFzc1wiO1xuICAgICAgICBhc3BpcmF0ZUZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSA1MDA7XG4gICAgICAgIGFzcGlyYXRlRmlsdGVyLlEudmFsdWUgPSAwLjU7XG4gICAgICAgIHdoaXRlTm9pc2UuY29ubmVjdChhc3BpcmF0ZUZpbHRlcik7XG4gICAgICAgIGFzcGlyYXRlRmlsdGVyLmNvbm5lY3QodGhpcy5zY3JpcHRQcm9jZXNzb3IpOyAgXG4gICAgICAgIFxuICAgICAgICB2YXIgZnJpY2F0aXZlRmlsdGVyID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgICAgIGZyaWNhdGl2ZUZpbHRlci50eXBlID0gXCJiYW5kcGFzc1wiO1xuICAgICAgICBmcmljYXRpdmVGaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gMTAwMDtcbiAgICAgICAgZnJpY2F0aXZlRmlsdGVyLlEudmFsdWUgPSAwLjU7XG4gICAgICAgIHdoaXRlTm9pc2UuY29ubmVjdChmcmljYXRpdmVGaWx0ZXIpO1xuICAgICAgICBmcmljYXRpdmVGaWx0ZXIuY29ubmVjdCh0aGlzLnNjcmlwdFByb2Nlc3Nvcik7ICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIHdoaXRlTm9pc2Uuc3RhcnQoMCk7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgd2hpdGUgbm9pc2UgKHRlc3QpXG4gICAgICAgIC8vIHZhciB3biA9IHRoaXMuY3JlYXRlV2hpdGVOb2lzZU5vZGUoMip0aGlzLnRyb21ib25lLnNhbXBsZVJhdGUpO1xuICAgICAgICAvLyB3bi5jb25uZWN0KHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgICAgLy8gd24uc3RhcnQoMCk7XG4gICAgfVxuICAgIFxuICAgIGNyZWF0ZVdoaXRlTm9pc2VOb2RlKGZyYW1lQ291bnQpIHtcbiAgICAgICAgdmFyIG15QXJyYXlCdWZmZXIgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgZnJhbWVDb3VudCwgdGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlKTtcblxuICAgICAgICB2YXIgbm93QnVmZmVyaW5nID0gbXlBcnJheUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcmFtZUNvdW50OyBpKyspIFxuICAgICAgICB7XG4gICAgICAgICAgICBub3dCdWZmZXJpbmdbaV0gPSB0aGlzLnVzZVdoaXRlTm9pc2UgPyBNYXRoLnJhbmRvbSgpIDogMS4wOy8vIGdhdXNzaWFuKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc291cmNlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgIHNvdXJjZS5idWZmZXIgPSBteUFycmF5QnVmZmVyO1xuICAgICAgICBzb3VyY2UubG9vcCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9XG4gICAgXG4gICAgXG4gICAgZG9TY3JpcHRQcm9jZXNzb3IoZXZlbnQpIHtcbiAgICAgICAgdmFyIGlucHV0QXJyYXkxID0gZXZlbnQuaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG4gICAgICAgIHZhciBpbnB1dEFycmF5MiA9IGV2ZW50LmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDEpO1xuICAgICAgICB2YXIgb3V0QXJyYXkgPSBldmVudC5vdXRwdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG4gICAgICAgIGZvciAodmFyIGogPSAwLCBOID0gb3V0QXJyYXkubGVuZ3RoOyBqIDwgTjsgaisrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbGFtYmRhMSA9IGovTjtcbiAgICAgICAgICAgIHZhciBsYW1iZGEyID0gKGorMC41KS9OO1xuICAgICAgICAgICAgdmFyIGdsb3R0YWxPdXRwdXQgPSB0aGlzLnRyb21ib25lLkdsb3R0aXMucnVuU3RlcChsYW1iZGExLCBpbnB1dEFycmF5MVtqXSk7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdm9jYWxPdXRwdXQgPSAwO1xuICAgICAgICAgICAgLy9UcmFjdCBydW5zIGF0IHR3aWNlIHRoZSBzYW1wbGUgcmF0ZSBcbiAgICAgICAgICAgIHRoaXMudHJvbWJvbmUuVHJhY3QucnVuU3RlcChnbG90dGFsT3V0cHV0LCBpbnB1dEFycmF5MltqXSwgbGFtYmRhMSk7XG4gICAgICAgICAgICB2b2NhbE91dHB1dCArPSB0aGlzLnRyb21ib25lLlRyYWN0LmxpcE91dHB1dCArIHRoaXMudHJvbWJvbmUuVHJhY3Qubm9zZU91dHB1dDtcbiAgICAgICAgICAgIHRoaXMudHJvbWJvbmUuVHJhY3QucnVuU3RlcChnbG90dGFsT3V0cHV0LCBpbnB1dEFycmF5MltqXSwgbGFtYmRhMik7XG4gICAgICAgICAgICB2b2NhbE91dHB1dCArPSB0aGlzLnRyb21ib25lLlRyYWN0LmxpcE91dHB1dCArIHRoaXMudHJvbWJvbmUuVHJhY3Qubm9zZU91dHB1dDtcbiAgICAgICAgICAgIG91dEFycmF5W2pdID0gdm9jYWxPdXRwdXQgKiAwLjEyNTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRyb21ib25lLkdsb3R0aXMuZmluaXNoQmxvY2soKTtcbiAgICAgICAgdGhpcy50cm9tYm9uZS5UcmFjdC5maW5pc2hCbG9jaygpO1xuICAgIH1cbiAgICBcbiAgICBtdXRlKCkge1xuICAgICAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5kaXNjb25uZWN0KCk7XG4gICAgfVxuICAgIFxuICAgIHVubXV0ZSgpIHtcbiAgICAgICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuY29ubmVjdCh0aGlzLmF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7IFxuICAgIH1cbiAgICBcbn1cblxuZXhwb3J0cy5BdWRpb1N5c3RlbSA9IEF1ZGlvU3lzdGVtOyIsImltcG9ydCBub2lzZSBmcm9tIFwiLi4vbm9pc2UuanNcIjtcblxuY2xhc3MgR2xvdHRpcyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0cm9tYm9uZSkge1xuICAgICAgICB0aGlzLnRyb21ib25lID0gdHJvbWJvbmU7XG5cbiAgICAgICAgdGhpcy50aW1lSW5XYXZlZm9ybSA9IDA7XG4gICAgICAgIHRoaXMub2xkRnJlcXVlbmN5ID0gMTQwO1xuICAgICAgICB0aGlzLm5ld0ZyZXF1ZW5jeSA9IDE0MDtcbiAgICAgICAgdGhpcy5VSUZyZXF1ZW5jeSA9IDE0MDtcbiAgICAgICAgdGhpcy5zbW9vdGhGcmVxdWVuY3kgPSAxNDA7XG4gICAgICAgIHRoaXMub2xkVGVuc2VuZXNzID0gMC42O1xuICAgICAgICB0aGlzLm5ld1RlbnNlbmVzcyA9IDAuNjtcbiAgICAgICAgdGhpcy5VSVRlbnNlbmVzcyA9IDAuNjtcbiAgICAgICAgdGhpcy50b3RhbFRpbWUgPSAwO1xuICAgICAgICB0aGlzLnZpYnJhdG9BbW91bnQgPSAwLjAwNTtcbiAgICAgICAgdGhpcy52aWJyYXRvRnJlcXVlbmN5ID0gNjtcbiAgICAgICAgdGhpcy5pbnRlbnNpdHkgPSAwO1xuICAgICAgICB0aGlzLmxvdWRuZXNzID0gMTtcbiAgICAgICAgdGhpcy5pc1RvdWNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50b3VjaCA9IDA7XG4gICAgICAgIHRoaXMueCA9IDI0MDtcbiAgICAgICAgdGhpcy55ID0gNTMwO1xuXG4gICAgICAgIHRoaXMua2V5Ym9hcmRUb3AgPSA1MDA7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRMZWZ0ID0gMDtcbiAgICAgICAgdGhpcy5rZXlib2FyZFdpZHRoID0gNjAwO1xuICAgICAgICB0aGlzLmtleWJvYXJkSGVpZ2h0ID0gMTAwO1xuICAgICAgICB0aGlzLnNlbWl0b25lcyA9IDIwO1xuICAgICAgICB0aGlzLm1hcmtzID0gWzAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDBdO1xuICAgICAgICB0aGlzLmJhc2VOb3RlID0gODcuMzA3MTsgLy9GXG5cbiAgICAgICAgdGhpcy5vdXRwdXQ7XG5cbiAgICAgICAgdGhpcy5hZGRQaXRjaFZhcmlhbmNlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hZGRUZW5zZW5lc3NWYXJpYW5jZSA9IHRydWU7XG5cbiAgICB9XG4gICAgXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5zZXR1cFdhdmVmb3JtKDApO1xuICAgIH1cbiAgICBcbiAgICBoYW5kbGVUb3VjaGVzKCkge1xuICAgICAgICBpZiAodGhpcy50b3VjaCAhPSAwICYmICF0aGlzLnRvdWNoLmFsaXZlKSB0aGlzLnRvdWNoID0gMDtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnRvdWNoID09IDApXG4gICAgICAgIHsgICAgICAgIFxuICAgICAgICAgICAgZm9yICh2YXIgaj0wOyBqPFVJLnRvdWNoZXNXaXRoTW91c2UubGVuZ3RoOyBqKyspICBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgdG91Y2ggPSBVSS50b3VjaGVzV2l0aE1vdXNlW2pdO1xuICAgICAgICAgICAgICAgIGlmICghdG91Y2guYWxpdmUpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmICh0b3VjaC55PHRoaXMua2V5Ym9hcmRUb3ApIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHRoaXMudG91Y2ggPSB0b3VjaDtcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnRvdWNoICE9IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBsb2NhbF95ID0gdGhpcy50b3VjaC55IC0gIHRoaXMua2V5Ym9hcmRUb3AtMTA7XG4gICAgICAgICAgICB2YXIgbG9jYWxfeCA9IHRoaXMudG91Y2gueCAtIHRoaXMua2V5Ym9hcmRMZWZ0O1xuICAgICAgICAgICAgbG9jYWxfeSA9IE1hdGguY2xhbXAobG9jYWxfeSwgMCwgdGhpcy5rZXlib2FyZEhlaWdodC0yNik7XG4gICAgICAgICAgICB2YXIgc2VtaXRvbmUgPSB0aGlzLnNlbWl0b25lcyAqIGxvY2FsX3ggLyB0aGlzLmtleWJvYXJkV2lkdGggKyAwLjU7XG4gICAgICAgICAgICBHbG90dGlzLlVJRnJlcXVlbmN5ID0gdGhpcy5iYXNlTm90ZSAqIE1hdGgucG93KDIsIHNlbWl0b25lLzEyKTtcbiAgICAgICAgICAgIGlmIChHbG90dGlzLmludGVuc2l0eSA9PSAwKSBHbG90dGlzLnNtb290aEZyZXF1ZW5jeSA9IEdsb3R0aXMuVUlGcmVxdWVuY3k7XG4gICAgICAgICAgICAvL0dsb3R0aXMuVUlSZCA9IDMqbG9jYWxfeSAvICh0aGlzLmtleWJvYXJkSGVpZ2h0LTIwKTtcbiAgICAgICAgICAgIHZhciB0ID0gTWF0aC5jbGFtcCgxLWxvY2FsX3kgLyAodGhpcy5rZXlib2FyZEhlaWdodC0yOCksIDAsIDEpO1xuICAgICAgICAgICAgR2xvdHRpcy5VSVRlbnNlbmVzcyA9IDEtTWF0aC5jb3ModCpNYXRoLlBJKjAuNSk7XG4gICAgICAgICAgICBHbG90dGlzLmxvdWRuZXNzID0gTWF0aC5wb3coR2xvdHRpcy5VSVRlbnNlbmVzcywgMC4yNSk7XG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLnRvdWNoLng7XG4gICAgICAgICAgICB0aGlzLnkgPSBsb2NhbF95ICsgdGhpcy5rZXlib2FyZFRvcCsxMDtcbiAgICAgICAgfVxuICAgICAgICBHbG90dGlzLmlzVG91Y2hlZCA9ICh0aGlzLnRvdWNoICE9IDApO1xuICAgIH1cbiAgICAgICAgXG4gICAgcnVuU3RlcChsYW1iZGEsIG5vaXNlU291cmNlKSB7XG4gICAgICAgIHZhciB0aW1lU3RlcCA9IDEuMCAvIHRoaXMudHJvbWJvbmUuc2FtcGxlUmF0ZTtcbiAgICAgICAgdGhpcy50aW1lSW5XYXZlZm9ybSArPSB0aW1lU3RlcDtcbiAgICAgICAgdGhpcy50b3RhbFRpbWUgKz0gdGltZVN0ZXA7XG4gICAgICAgIGlmICh0aGlzLnRpbWVJbldhdmVmb3JtID4gdGhpcy53YXZlZm9ybUxlbmd0aCkgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMudGltZUluV2F2ZWZvcm0gLT0gdGhpcy53YXZlZm9ybUxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBXYXZlZm9ybShsYW1iZGEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvdXQgPSB0aGlzLm5vcm1hbGl6ZWRMRldhdmVmb3JtKHRoaXMudGltZUluV2F2ZWZvcm0vdGhpcy53YXZlZm9ybUxlbmd0aCk7XG4gICAgICAgIHZhciBhc3BpcmF0aW9uID0gdGhpcy5pbnRlbnNpdHkqKDEuMC1NYXRoLnNxcnQodGhpcy5VSVRlbnNlbmVzcykpKnRoaXMuZ2V0Tm9pc2VNb2R1bGF0b3IoKSpub2lzZVNvdXJjZTtcbiAgICAgICAgYXNwaXJhdGlvbiAqPSAwLjIgKyAwLjAyICogbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUgKiAxLjk5KTtcbiAgICAgICAgb3V0ICs9IGFzcGlyYXRpb247XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIFxuICAgIGdldE5vaXNlTW9kdWxhdG9yKCkge1xuICAgICAgICB2YXIgdm9pY2VkID0gMC4xKzAuMipNYXRoLm1heCgwLE1hdGguc2luKE1hdGguUEkqMip0aGlzLnRpbWVJbldhdmVmb3JtL3RoaXMud2F2ZWZvcm1MZW5ndGgpKTtcbiAgICAgICAgLy9yZXR1cm4gMC4zO1xuICAgICAgICByZXR1cm4gdGhpcy5VSVRlbnNlbmVzcyogdGhpcy5pbnRlbnNpdHkgKiB2b2ljZWQgKyAoMS10aGlzLlVJVGVuc2VuZXNzKiB0aGlzLmludGVuc2l0eSApICogMC4zO1xuICAgIH1cbiAgICBcbiAgICBmaW5pc2hCbG9jaygpIHtcbiAgICAgICAgdmFyIHZpYnJhdG8gPSAwO1xuICAgICAgICBpZiAodGhpcy5hZGRQaXRjaFZhcmlhbmNlKSB7XG4gICAgICAgICAgICAvLyBBZGQgc21hbGwgaW1wZXJmZWN0aW9ucyB0byB0aGUgdm9jYWwgb3V0cHV0XG4gICAgICAgICAgICB2aWJyYXRvICs9IHRoaXMudmlicmF0b0Ftb3VudCAqIE1hdGguc2luKDIqTWF0aC5QSSAqIHRoaXMudG90YWxUaW1lICp0aGlzLnZpYnJhdG9GcmVxdWVuY3kpOyAgICAgICAgICBcbiAgICAgICAgICAgIHZpYnJhdG8gKz0gMC4wMiAqIG5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lICogNC4wNyk7XG4gICAgICAgICAgICB2aWJyYXRvICs9IDAuMDQgKiBub2lzZS5zaW1wbGV4MSh0aGlzLnRvdGFsVGltZSAqIDIuMTUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRyb21ib25lLmF1dG9Xb2JibGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZpYnJhdG8gKz0gMC4yICogbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUgKiAwLjk4KTtcbiAgICAgICAgICAgIHZpYnJhdG8gKz0gMC40ICogbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUgKiAwLjUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLlVJRnJlcXVlbmN5PnRoaXMuc21vb3RoRnJlcXVlbmN5KSBcbiAgICAgICAgICAgIHRoaXMuc21vb3RoRnJlcXVlbmN5ID0gTWF0aC5taW4odGhpcy5zbW9vdGhGcmVxdWVuY3kgKiAxLjEsIHRoaXMuVUlGcmVxdWVuY3kpO1xuICAgICAgICBpZiAodGhpcy5VSUZyZXF1ZW5jeTx0aGlzLnNtb290aEZyZXF1ZW5jeSkgXG4gICAgICAgICAgICB0aGlzLnNtb290aEZyZXF1ZW5jeSA9IE1hdGgubWF4KHRoaXMuc21vb3RoRnJlcXVlbmN5IC8gMS4xLCB0aGlzLlVJRnJlcXVlbmN5KTtcbiAgICAgICAgdGhpcy5vbGRGcmVxdWVuY3kgPSB0aGlzLm5ld0ZyZXF1ZW5jeTtcbiAgICAgICAgdGhpcy5uZXdGcmVxdWVuY3kgPSB0aGlzLnNtb290aEZyZXF1ZW5jeSAqICgxK3ZpYnJhdG8pO1xuICAgICAgICB0aGlzLm9sZFRlbnNlbmVzcyA9IHRoaXMubmV3VGVuc2VuZXNzO1xuICAgICAgICBpZiAodGhpcy5hZGRUZW5zZW5lc3NWYXJpYW5jZSkge1xuICAgICAgICAgICAgdGhpcy5uZXdUZW5zZW5lc3MgPSB0aGlzLlVJVGVuc2VuZXNzICsgMC4xKm5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lKjAuNDYpKzAuMDUqbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUqMC4zNik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5ld1RlbnNlbmVzcyA9IHRoaXMuVUlUZW5zZW5lc3M7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzVG91Y2hlZCAmJiB0aGlzLnRyb21ib25lLmFsd2F5c1ZvaWNlKSB0aGlzLm5ld1RlbnNlbmVzcyArPSAoMy10aGlzLlVJVGVuc2VuZXNzKSooMS10aGlzLmludGVuc2l0eSk7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5pc1RvdWNoZWQgfHwgdGhpcy50cm9tYm9uZS5hbHdheXNWb2ljZSl7XG4gICAgICAgICAgICB0aGlzLmludGVuc2l0eSArPSAwLjEzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW50ZW5zaXR5ID0gTWF0aC5jbGFtcCh0aGlzLmludGVuc2l0eSwgMCwgMSk7XG4gICAgfVxuICAgIFxuICAgIHNldHVwV2F2ZWZvcm0obGFtYmRhKSB7XG4gICAgICAgIHRoaXMuZnJlcXVlbmN5ID0gdGhpcy5vbGRGcmVxdWVuY3kqKDEtbGFtYmRhKSArIHRoaXMubmV3RnJlcXVlbmN5KmxhbWJkYTtcbiAgICAgICAgdmFyIHRlbnNlbmVzcyA9IHRoaXMub2xkVGVuc2VuZXNzKigxLWxhbWJkYSkgKyB0aGlzLm5ld1RlbnNlbmVzcypsYW1iZGE7XG4gICAgICAgIHRoaXMuUmQgPSAzKigxLXRlbnNlbmVzcyk7XG4gICAgICAgIHRoaXMud2F2ZWZvcm1MZW5ndGggPSAxLjAvdGhpcy5mcmVxdWVuY3k7XG4gICAgICAgIFxuICAgICAgICB2YXIgUmQgPSB0aGlzLlJkO1xuICAgICAgICBpZiAoUmQ8MC41KSBSZCA9IDAuNTtcbiAgICAgICAgaWYgKFJkPjIuNykgUmQgPSAyLjc7XG4gICAgICAgIC8vIG5vcm1hbGl6ZWQgdG8gdGltZSA9IDEsIEVlID0gMVxuICAgICAgICB2YXIgUmEgPSAtMC4wMSArIDAuMDQ4KlJkO1xuICAgICAgICB2YXIgUmsgPSAwLjIyNCArIDAuMTE4KlJkO1xuICAgICAgICB2YXIgUmcgPSAoUmsvNCkqKDAuNSsxLjIqUmspLygwLjExKlJkLVJhKigwLjUrMS4yKlJrKSk7XG4gICAgICAgIFxuICAgICAgICB2YXIgVGEgPSBSYTtcbiAgICAgICAgdmFyIFRwID0gMSAvICgyKlJnKTtcbiAgICAgICAgdmFyIFRlID0gVHAgKyBUcCpSazsgLy9cbiAgICAgICAgXG4gICAgICAgIHZhciBlcHNpbG9uID0gMS9UYTtcbiAgICAgICAgdmFyIHNoaWZ0ID0gTWF0aC5leHAoLWVwc2lsb24gKiAoMS1UZSkpO1xuICAgICAgICB2YXIgRGVsdGEgPSAxIC0gc2hpZnQ7IC8vZGl2aWRlIGJ5IHRoaXMgdG8gc2NhbGUgUkhTXG4gICAgICAgICAgIFxuICAgICAgICB2YXIgUkhTSW50ZWdyYWwgPSAoMS9lcHNpbG9uKSooc2hpZnQgLSAxKSArICgxLVRlKSpzaGlmdDtcbiAgICAgICAgUkhTSW50ZWdyYWwgPSBSSFNJbnRlZ3JhbC9EZWx0YTtcbiAgICAgICAgXG4gICAgICAgIHZhciB0b3RhbExvd2VySW50ZWdyYWwgPSAtIChUZS1UcCkvMiArIFJIU0ludGVncmFsO1xuICAgICAgICB2YXIgdG90YWxVcHBlckludGVncmFsID0gLXRvdGFsTG93ZXJJbnRlZ3JhbDtcbiAgICAgICAgXG4gICAgICAgIHZhciBvbWVnYSA9IE1hdGguUEkvVHA7XG4gICAgICAgIHZhciBzID0gTWF0aC5zaW4ob21lZ2EqVGUpO1xuICAgICAgICB2YXIgeSA9IC1NYXRoLlBJKnMqdG90YWxVcHBlckludGVncmFsIC8gKFRwKjIpO1xuICAgICAgICB2YXIgeiA9IE1hdGgubG9nKHkpO1xuICAgICAgICB2YXIgYWxwaGEgPSB6LyhUcC8yIC0gVGUpO1xuICAgICAgICB2YXIgRTAgPSAtMSAvIChzKk1hdGguZXhwKGFscGhhKlRlKSk7XG4gICAgICAgIHRoaXMuYWxwaGEgPSBhbHBoYTtcbiAgICAgICAgdGhpcy5FMCA9IEUwO1xuICAgICAgICB0aGlzLmVwc2lsb24gPSBlcHNpbG9uO1xuICAgICAgICB0aGlzLnNoaWZ0ID0gc2hpZnQ7XG4gICAgICAgIHRoaXMuRGVsdGEgPSBEZWx0YTtcbiAgICAgICAgdGhpcy5UZT1UZTtcbiAgICAgICAgdGhpcy5vbWVnYSA9IG9tZWdhO1xuICAgIH1cbiAgICBcbiBcbiAgICBub3JtYWxpemVkTEZXYXZlZm9ybSh0KSB7ICAgICBcbiAgICAgICAgaWYgKHQ+dGhpcy5UZSkgdGhpcy5vdXRwdXQgPSAoLU1hdGguZXhwKC10aGlzLmVwc2lsb24gKiAodC10aGlzLlRlKSkgKyB0aGlzLnNoaWZ0KS90aGlzLkRlbHRhO1xuICAgICAgICBlbHNlIHRoaXMub3V0cHV0ID0gdGhpcy5FMCAqIE1hdGguZXhwKHRoaXMuYWxwaGEqdCkgKiBNYXRoLnNpbih0aGlzLm9tZWdhICogdCk7XG4gICAgIFxuICAgICAgICByZXR1cm4gdGhpcy5vdXRwdXQgKiB0aGlzLmludGVuc2l0eSAqIHRoaXMubG91ZG5lc3M7XG4gICAgfVxufVxuXG5leHBvcnQgeyBHbG90dGlzIH07IiwiY2xhc3MgVHJhY3RVSVxue1xuXG4gICAgY29uc3RydWN0b3IodHJvbWJvbmUpIHtcbiAgICAgICAgdGhpcy50cm9tYm9uZSA9IHRyb21ib25lO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5vcmlnaW5YID0gMzQwOyBcbiAgICAgICAgdGhpcy5vcmlnaW5ZID0gNDQ5OyBcbiAgICAgICAgdGhpcy5yYWRpdXMgPSAyOTg7IFxuICAgICAgICB0aGlzLnNjYWxlID0gNjA7XG4gICAgICAgIHRoaXMudG9uZ3VlSW5kZXggPSAxMi45O1xuICAgICAgICB0aGlzLnRvbmd1ZURpYW1ldGVyID0gMi40MztcbiAgICAgICAgdGhpcy5pbm5lclRvbmd1ZUNvbnRyb2xSYWRpdXMgPSAyLjA1O1xuICAgICAgICB0aGlzLm91dGVyVG9uZ3VlQ29udHJvbFJhZGl1cyA9IDMuNTtcbiAgICAgICAgdGhpcy50b25ndWVUb3VjaCA9IDA7XG4gICAgICAgIHRoaXMuYW5nbGVTY2FsZSA9IDAuNjQ7XG4gICAgICAgIHRoaXMuYW5nbGVPZmZzZXQgPSAtMC4yNDtcbiAgICAgICAgdGhpcy5ub3NlT2Zmc2V0ID0gMC44O1xuICAgICAgICB0aGlzLmdyaWRPZmZzZXQgPSAxLjc7XG5cbiAgICAgICAgLy8gSm9uJ3MgVUkgb3B0aW9uc1xuICAgICAgICB0aGlzLnRhcmdldCA9IDAuMTtcbiAgICAgICAgdGhpcy5pbmRleCA9IDQyO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IDA7XG4gICAgfVxuICAgIFxuICAgIGluaXQoKSB7XG4gICAgICAgIGxldCBUcmFjdCA9IHRoaXMudHJvbWJvbmUuVHJhY3Q7XG5cbiAgICAgICAgdGhpcy5zZXRSZXN0RGlhbWV0ZXIoKTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPFRyYWN0Lm47IGkrKykgXG4gICAgICAgIHtcbiAgICAgICAgICAgIFRyYWN0LmRpYW1ldGVyW2ldID0gVHJhY3QudGFyZ2V0RGlhbWV0ZXJbaV0gPSBUcmFjdC5yZXN0RGlhbWV0ZXJbaV07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRvbmd1ZUxvd2VySW5kZXhCb3VuZCA9IFRyYWN0LmJsYWRlU3RhcnQrMjtcbiAgICAgICAgdGhpcy50b25ndWVVcHBlckluZGV4Qm91bmQgPSBUcmFjdC50aXBTdGFydC0zO1xuICAgICAgICB0aGlzLnRvbmd1ZUluZGV4Q2VudHJlID0gMC41Kih0aGlzLnRvbmd1ZUxvd2VySW5kZXhCb3VuZCt0aGlzLnRvbmd1ZVVwcGVySW5kZXhCb3VuZCk7XG4gICAgfVxuICAgICAgICBcbiAgICBnZXRJbmRleCh4LHkpIHtcbiAgICAgICAgbGV0IFRyYWN0ID0gdGhpcy50cm9tYm9uZS5UcmFjdDtcblxuICAgICAgICB2YXIgeHggPSB4LXRoaXMub3JpZ2luWDsgdmFyIHl5ID0geS10aGlzLm9yaWdpblk7XG4gICAgICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIoeXksIHh4KTtcbiAgICAgICAgd2hpbGUgKGFuZ2xlPiAwKSBhbmdsZSAtPSAyKk1hdGguUEk7XG4gICAgICAgIHJldHVybiAoTWF0aC5QSSArIGFuZ2xlIC0gdGhpcy5hbmdsZU9mZnNldCkqKFRyYWN0LmxpcFN0YXJ0LTEpIC8gKHRoaXMuYW5nbGVTY2FsZSpNYXRoLlBJKTtcbiAgICB9XG5cbiAgICBnZXREaWFtZXRlcih4LHkpIHtcbiAgICAgICAgdmFyIHh4ID0geC10aGlzLm9yaWdpblg7IHZhciB5eSA9IHktdGhpcy5vcmlnaW5ZO1xuICAgICAgICByZXR1cm4gKHRoaXMucmFkaXVzLU1hdGguc3FydCh4eCp4eCArIHl5Knl5KSkvdGhpcy5zY2FsZTtcbiAgICB9XG4gICAgXG4gICAgc2V0UmVzdERpYW1ldGVyKCkge1xuICAgICAgICBsZXQgVHJhY3QgPSB0aGlzLnRyb21ib25lLlRyYWN0O1xuXG4gICAgICAgIGZvciAodmFyIGk9VHJhY3QuYmxhZGVTdGFydDsgaTxUcmFjdC5saXBTdGFydDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdCA9IDEuMSAqIE1hdGguUEkqKHRoaXMudG9uZ3VlSW5kZXggLSBpKS8oVHJhY3QudGlwU3RhcnQgLSBUcmFjdC5ibGFkZVN0YXJ0KTtcbiAgICAgICAgICAgIHZhciBmaXhlZFRvbmd1ZURpYW1ldGVyID0gMisodGhpcy50b25ndWVEaWFtZXRlci0yKS8xLjU7XG4gICAgICAgICAgICB2YXIgY3VydmUgPSAoMS41LWZpeGVkVG9uZ3VlRGlhbWV0ZXIrdGhpcy5ncmlkT2Zmc2V0KSpNYXRoLmNvcyh0KTtcbiAgICAgICAgICAgIGlmIChpID09IFRyYWN0LmJsYWRlU3RhcnQtMiB8fCBpID09IFRyYWN0LmxpcFN0YXJ0LTEpIGN1cnZlICo9IDAuODtcbiAgICAgICAgICAgIGlmIChpID09IFRyYWN0LmJsYWRlU3RhcnQgfHwgaSA9PSBUcmFjdC5saXBTdGFydC0yKSBjdXJ2ZSAqPSAwLjk0OyAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgVHJhY3QucmVzdERpYW1ldGVyW2ldID0gMS41IC0gY3VydmU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBsaXBzIG9mIHRoZSBtb2RlbGVkIHRyYWN0IHRvIGJlIGNsb3NlZCBieSB0aGUgc3BlY2lmaWVkIGFtb3VudC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJvZ3Jlc3MgUGVyY2VudGFnZSBjbG9zZWQgKG51bWJlciBiZXR3ZWVuIDAgYW5kIDEpXG4gICAgICovXG4gICAgU2V0TGlwc0Nsb3NlZChwcm9ncmVzcykge1xuXG4gICAgICAgIGxldCBUcmFjdCA9IHRoaXMudHJvbWJvbmUuVHJhY3Q7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldFJlc3REaWFtZXRlcigpO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8VHJhY3QubjsgaSsrKSBUcmFjdC50YXJnZXREaWFtZXRlcltpXSA9IFRyYWN0LnJlc3REaWFtZXRlcltpXTsgICAgXG5cbiAgICAgICAgLy8gRGlzYWJsZSB0aGlzIGJlaGF2aW9yIGlmIHRoZSBtb3V0aCBpcyBjbG9zZWQgYSBjZXJ0YWluIGFtb3VudFxuICAgICAgICAvL2lmIChwcm9ncmVzcyA+IDAuOCB8fCBwcm9ncmVzcyA8IDAuMSkgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgZm9yKGxldCBpPSB0aGlzLmluZGV4IC0gdGhpcy5yYWRpdXM7IGkgPD0gdGhpcy5pbmRleCArIHRoaXMucmFkaXVzOyBpKyspe1xuICAgICAgICAgICAgaWYgKGkgPiBUcmFjdC50YXJnZXREaWFtZXRlci5sZW5ndGggfHwgaSA8IDApIGNvbnRpbnVlO1xuICAgICAgICAgICAgbGV0IGludGVycCA9IE1hdGgubGVycChUcmFjdC5yZXN0RGlhbWV0ZXJbaV0sIHRoaXMudGFyZ2V0LCBwcm9ncmVzcyk7XG4gICAgICAgICAgICBUcmFjdC50YXJnZXREaWFtZXRlcltpXSA9IGludGVycDtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5cbmV4cG9ydCB7IFRyYWN0VUkgfTsiLCJjbGFzcyBUcmFjdCB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0cm9tYm9uZSkge1xuICAgICAgICB0aGlzLnRyb21ib25lID0gdHJvbWJvbmU7XG5cbiAgICAgICAgdGhpcy5uID0gNDQ7XG4gICAgICAgIHRoaXMuYmxhZGVTdGFydCA9IDEwO1xuICAgICAgICB0aGlzLnRpcFN0YXJ0ID0gMzI7XG4gICAgICAgIHRoaXMubGlwU3RhcnQgPSAzOTtcbiAgICAgICAgdGhpcy5SID0gW107IC8vY29tcG9uZW50IGdvaW5nIHJpZ2h0XG4gICAgICAgIHRoaXMuTCA9IFtdOyAvL2NvbXBvbmVudCBnb2luZyBsZWZ0XG4gICAgICAgIHRoaXMucmVmbGVjdGlvbiA9IFtdO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0UiA9IFtdO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0TCA9IFtdO1xuICAgICAgICB0aGlzLm1heEFtcGxpdHVkZSA9IFtdO1xuICAgICAgICB0aGlzLmRpYW1ldGVyID0gW107XG4gICAgICAgIHRoaXMucmVzdERpYW1ldGVyID0gW107XG4gICAgICAgIHRoaXMudGFyZ2V0RGlhbWV0ZXIgPSBbXTtcbiAgICAgICAgdGhpcy5uZXdEaWFtZXRlciA9IFtdO1xuICAgICAgICB0aGlzLkEgPSBbXTtcbiAgICAgICAgdGhpcy5nbG90dGFsUmVmbGVjdGlvbiA9IDAuNzU7XG4gICAgICAgIHRoaXMubGlwUmVmbGVjdGlvbiA9IC0wLjg1O1xuICAgICAgICB0aGlzLmxhc3RPYnN0cnVjdGlvbiA9IC0xO1xuICAgICAgICB0aGlzLmZhZGUgPSAxLjA7IC8vMC45OTk5LFxuICAgICAgICB0aGlzLm1vdmVtZW50U3BlZWQgPSAxNTsgLy9jbSBwZXIgc2Vjb25kXG4gICAgICAgIHRoaXMudHJhbnNpZW50cyA9IFtdO1xuICAgICAgICB0aGlzLmxpcE91dHB1dCA9IDA7XG4gICAgICAgIHRoaXMubm9zZU91dHB1dCA9IDA7XG4gICAgICAgIHRoaXMudmVsdW1UYXJnZXQgPSAwLjAxO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuYmxhZGVTdGFydCA9IE1hdGguZmxvb3IodGhpcy5ibGFkZVN0YXJ0KnRoaXMubi80NCk7XG4gICAgICAgIHRoaXMudGlwU3RhcnQgPSBNYXRoLmZsb29yKHRoaXMudGlwU3RhcnQqdGhpcy5uLzQ0KTtcbiAgICAgICAgdGhpcy5saXBTdGFydCA9IE1hdGguZmxvb3IodGhpcy5saXBTdGFydCp0aGlzLm4vNDQpOyAgICAgICAgXG4gICAgICAgIHRoaXMuZGlhbWV0ZXIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMucmVzdERpYW1ldGVyID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICB0aGlzLnRhcmdldERpYW1ldGVyID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICB0aGlzLm5ld0RpYW1ldGVyID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5uOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBkaWFtZXRlciA9IDA7XG4gICAgICAgICAgICBpZiAoaTw3KnRoaXMubi80NC0wLjUpIGRpYW1ldGVyID0gMC42O1xuICAgICAgICAgICAgZWxzZSBpZiAoaTwxMip0aGlzLm4vNDQpIGRpYW1ldGVyID0gMS4xO1xuICAgICAgICAgICAgZWxzZSBkaWFtZXRlciA9IDEuNTtcbiAgICAgICAgICAgIHRoaXMuZGlhbWV0ZXJbaV0gPSB0aGlzLnJlc3REaWFtZXRlcltpXSA9IHRoaXMudGFyZ2V0RGlhbWV0ZXJbaV0gPSB0aGlzLm5ld0RpYW1ldGVyW2ldID0gZGlhbWV0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5SID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICB0aGlzLkwgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMucmVmbGVjdGlvbiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKzEpO1xuICAgICAgICB0aGlzLm5ld1JlZmxlY3Rpb24gPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubisxKTtcbiAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dFIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubisxKTtcbiAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dEwgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubisxKTtcbiAgICAgICAgdGhpcy5BID1uZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMubWF4QW1wbGl0dWRlID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ub3NlTGVuZ3RoID0gTWF0aC5mbG9vcigyOCp0aGlzLm4vNDQpXG4gICAgICAgIHRoaXMubm9zZVN0YXJ0ID0gdGhpcy5uLXRoaXMubm9zZUxlbmd0aCArIDE7XG4gICAgICAgIHRoaXMubm9zZVIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgIHRoaXMubm9zZUwgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgIHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0UiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKzEpO1xuICAgICAgICB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dEwgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCsxKTsgICAgICAgIFxuICAgICAgICB0aGlzLm5vc2VSZWZsZWN0aW9uID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgrMSk7XG4gICAgICAgIHRoaXMubm9zZURpYW1ldGVyID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgpO1xuICAgICAgICB0aGlzLm5vc2VBID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgpO1xuICAgICAgICB0aGlzLm5vc2VNYXhBbXBsaXR1ZGUgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm5vc2VMZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGRpYW1ldGVyO1xuICAgICAgICAgICAgdmFyIGQgPSAyKihpL3RoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgICAgICBpZiAoZDwxKSBkaWFtZXRlciA9IDAuNCsxLjYqZDtcbiAgICAgICAgICAgIGVsc2UgZGlhbWV0ZXIgPSAwLjUrMS41KigyLWQpO1xuICAgICAgICAgICAgZGlhbWV0ZXIgPSBNYXRoLm1pbihkaWFtZXRlciwgMS45KTtcbiAgICAgICAgICAgIHRoaXMubm9zZURpYW1ldGVyW2ldID0gZGlhbWV0ZXI7XG4gICAgICAgIH0gICAgICAgXG4gICAgICAgIHRoaXMubmV3UmVmbGVjdGlvbkxlZnQgPSB0aGlzLm5ld1JlZmxlY3Rpb25SaWdodCA9IHRoaXMubmV3UmVmbGVjdGlvbk5vc2UgPSAwO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlZmxlY3Rpb25zKCk7ICAgICAgICBcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVOb3NlUmVmbGVjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5ub3NlRGlhbWV0ZXJbMF0gPSB0aGlzLnZlbHVtVGFyZ2V0O1xuICAgIH1cbiAgICBcbiAgICByZXNoYXBlVHJhY3QoZGVsdGFUaW1lKSB7XG4gICAgICAgIHZhciBhbW91bnQgPSBkZWx0YVRpbWUgKiB0aGlzLm1vdmVtZW50U3BlZWQ7IDsgICAgXG4gICAgICAgIHZhciBuZXdMYXN0T2JzdHJ1Y3Rpb24gPSAtMTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubjsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZGlhbWV0ZXIgPSB0aGlzLmRpYW1ldGVyW2ldO1xuICAgICAgICAgICAgdmFyIHRhcmdldERpYW1ldGVyID0gdGhpcy50YXJnZXREaWFtZXRlcltpXTtcbiAgICAgICAgICAgIGlmIChkaWFtZXRlciA8PSAwKSBuZXdMYXN0T2JzdHJ1Y3Rpb24gPSBpO1xuICAgICAgICAgICAgdmFyIHNsb3dSZXR1cm47IFxuICAgICAgICAgICAgaWYgKGk8dGhpcy5ub3NlU3RhcnQpIHNsb3dSZXR1cm4gPSAwLjY7XG4gICAgICAgICAgICBlbHNlIGlmIChpID49IHRoaXMudGlwU3RhcnQpIHNsb3dSZXR1cm4gPSAxLjA7IFxuICAgICAgICAgICAgZWxzZSBzbG93UmV0dXJuID0gMC42KzAuNCooaS10aGlzLm5vc2VTdGFydCkvKHRoaXMudGlwU3RhcnQtdGhpcy5ub3NlU3RhcnQpO1xuICAgICAgICAgICAgdGhpcy5kaWFtZXRlcltpXSA9IE1hdGgubW92ZVRvd2FyZHMoZGlhbWV0ZXIsIHRhcmdldERpYW1ldGVyLCBzbG93UmV0dXJuKmFtb3VudCwgMiphbW91bnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxhc3RPYnN0cnVjdGlvbj4tMSAmJiBuZXdMYXN0T2JzdHJ1Y3Rpb24gPT0gLTEgJiYgdGhpcy5ub3NlQVswXTwwLjA1KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmFkZFRyYW5zaWVudCh0aGlzLmxhc3RPYnN0cnVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0T2JzdHJ1Y3Rpb24gPSBuZXdMYXN0T2JzdHJ1Y3Rpb247XG4gICAgICAgIFxuICAgICAgICBhbW91bnQgPSBkZWx0YVRpbWUgKiB0aGlzLm1vdmVtZW50U3BlZWQ7IFxuICAgICAgICB0aGlzLm5vc2VEaWFtZXRlclswXSA9IE1hdGgubW92ZVRvd2FyZHModGhpcy5ub3NlRGlhbWV0ZXJbMF0sIHRoaXMudmVsdW1UYXJnZXQsIFxuICAgICAgICAgICAgICAgIGFtb3VudCowLjI1LCBhbW91bnQqMC4xKTtcbiAgICAgICAgdGhpcy5ub3NlQVswXSA9IHRoaXMubm9zZURpYW1ldGVyWzBdKnRoaXMubm9zZURpYW1ldGVyWzBdOyAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIGNhbGN1bGF0ZVJlZmxlY3Rpb25zKCkge1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5uOyBpKyspIFxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkFbaV0gPSB0aGlzLmRpYW1ldGVyW2ldKnRoaXMuZGlhbWV0ZXJbaV07IC8vaWdub3JpbmcgUEkgZXRjLlxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGk9MTsgaTx0aGlzLm47IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5yZWZsZWN0aW9uW2ldID0gdGhpcy5uZXdSZWZsZWN0aW9uW2ldO1xuICAgICAgICAgICAgaWYgKHRoaXMuQVtpXSA9PSAwKSB0aGlzLm5ld1JlZmxlY3Rpb25baV0gPSAwLjk5OTsgLy90byBwcmV2ZW50IHNvbWUgYmFkIGJlaGF2aW91ciBpZiAwXG4gICAgICAgICAgICBlbHNlIHRoaXMubmV3UmVmbGVjdGlvbltpXSA9ICh0aGlzLkFbaS0xXS10aGlzLkFbaV0pIC8gKHRoaXMuQVtpLTFdK3RoaXMuQVtpXSk7IFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvL25vdyBhdCBqdW5jdGlvbiB3aXRoIG5vc2VcblxuICAgICAgICB0aGlzLnJlZmxlY3Rpb25MZWZ0ID0gdGhpcy5uZXdSZWZsZWN0aW9uTGVmdDtcbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uUmlnaHQgPSB0aGlzLm5ld1JlZmxlY3Rpb25SaWdodDtcbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uTm9zZSA9IHRoaXMubmV3UmVmbGVjdGlvbk5vc2U7XG4gICAgICAgIHZhciBzdW0gPSB0aGlzLkFbdGhpcy5ub3NlU3RhcnRdK3RoaXMuQVt0aGlzLm5vc2VTdGFydCsxXSt0aGlzLm5vc2VBWzBdO1xuICAgICAgICB0aGlzLm5ld1JlZmxlY3Rpb25MZWZ0ID0gKDIqdGhpcy5BW3RoaXMubm9zZVN0YXJ0XS1zdW0pL3N1bTtcbiAgICAgICAgdGhpcy5uZXdSZWZsZWN0aW9uUmlnaHQgPSAoMip0aGlzLkFbdGhpcy5ub3NlU3RhcnQrMV0tc3VtKS9zdW07ICAgXG4gICAgICAgIHRoaXMubmV3UmVmbGVjdGlvbk5vc2UgPSAoMip0aGlzLm5vc2VBWzBdLXN1bSkvc3VtOyAgICAgIFxuICAgIH1cblxuICAgIGNhbGN1bGF0ZU5vc2VSZWZsZWN0aW9ucygpIHtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubm9zZUxlbmd0aDsgaSsrKSBcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5ub3NlQVtpXSA9IHRoaXMubm9zZURpYW1ldGVyW2ldKnRoaXMubm9zZURpYW1ldGVyW2ldOyBcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpPTE7IGk8dGhpcy5ub3NlTGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubm9zZVJlZmxlY3Rpb25baV0gPSAodGhpcy5ub3NlQVtpLTFdLXRoaXMubm9zZUFbaV0pIC8gKHRoaXMubm9zZUFbaS0xXSt0aGlzLm5vc2VBW2ldKTsgXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcnVuU3RlcChnbG90dGFsT3V0cHV0LCB0dXJidWxlbmNlTm9pc2UsIGxhbWJkYSkge1xuICAgICAgICB2YXIgdXBkYXRlQW1wbGl0dWRlcyA9IChNYXRoLnJhbmRvbSgpPDAuMSk7XG4gICAgXG4gICAgICAgIC8vbW91dGhcbiAgICAgICAgdGhpcy5wcm9jZXNzVHJhbnNpZW50cygpO1xuICAgICAgICB0aGlzLmFkZFR1cmJ1bGVuY2VOb2lzZSh0dXJidWxlbmNlTm9pc2UpO1xuICAgICAgICBcbiAgICAgICAgLy90aGlzLmdsb3R0YWxSZWZsZWN0aW9uID0gLTAuOCArIDEuNiAqIEdsb3R0aXMubmV3VGVuc2VuZXNzO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0UlswXSA9IHRoaXMuTFswXSAqIHRoaXMuZ2xvdHRhbFJlZmxlY3Rpb24gKyBnbG90dGFsT3V0cHV0O1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0TFt0aGlzLm5dID0gdGhpcy5SW3RoaXMubi0xXSAqIHRoaXMubGlwUmVmbGVjdGlvbjsgXG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpPTE7IGk8dGhpcy5uOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciByID0gdGhpcy5yZWZsZWN0aW9uW2ldICogKDEtbGFtYmRhKSArIHRoaXMubmV3UmVmbGVjdGlvbltpXSpsYW1iZGE7XG4gICAgICAgICAgICB2YXIgdyA9IHIgKiAodGhpcy5SW2ktMV0gKyB0aGlzLkxbaV0pO1xuICAgICAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dFJbaV0gPSB0aGlzLlJbaS0xXSAtIHc7XG4gICAgICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0TFtpXSA9IHRoaXMuTFtpXSArIHc7XG4gICAgICAgIH0gICAgXG4gICAgICAgIFxuICAgICAgICAvL25vdyBhdCBqdW5jdGlvbiB3aXRoIG5vc2VcbiAgICAgICAgdmFyIGkgPSB0aGlzLm5vc2VTdGFydDtcbiAgICAgICAgdmFyIHIgPSB0aGlzLm5ld1JlZmxlY3Rpb25MZWZ0ICogKDEtbGFtYmRhKSArIHRoaXMucmVmbGVjdGlvbkxlZnQqbGFtYmRhO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0TFtpXSA9IHIqdGhpcy5SW2ktMV0rKDErcikqKHRoaXMubm9zZUxbMF0rdGhpcy5MW2ldKTtcbiAgICAgICAgciA9IHRoaXMubmV3UmVmbGVjdGlvblJpZ2h0ICogKDEtbGFtYmRhKSArIHRoaXMucmVmbGVjdGlvblJpZ2h0KmxhbWJkYTtcbiAgICAgICAgdGhpcy5qdW5jdGlvbk91dHB1dFJbaV0gPSByKnRoaXMuTFtpXSsoMStyKSoodGhpcy5SW2ktMV0rdGhpcy5ub3NlTFswXSk7ICAgICBcbiAgICAgICAgciA9IHRoaXMubmV3UmVmbGVjdGlvbk5vc2UgKiAoMS1sYW1iZGEpICsgdGhpcy5yZWZsZWN0aW9uTm9zZSpsYW1iZGE7XG4gICAgICAgIHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0UlswXSA9IHIqdGhpcy5ub3NlTFswXSsoMStyKSoodGhpcy5MW2ldK3RoaXMuUltpLTFdKTtcbiAgICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5uOyBpKyspXG4gICAgICAgIHsgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLlJbaV0gPSB0aGlzLmp1bmN0aW9uT3V0cHV0UltpXSowLjk5OTtcbiAgICAgICAgICAgIHRoaXMuTFtpXSA9IHRoaXMuanVuY3Rpb25PdXRwdXRMW2krMV0qMC45OTk7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL3RoaXMuUltpXSA9IE1hdGguY2xhbXAodGhpcy5qdW5jdGlvbk91dHB1dFJbaV0gKiB0aGlzLmZhZGUsIC0xLCAxKTtcbiAgICAgICAgICAgIC8vdGhpcy5MW2ldID0gTWF0aC5jbGFtcCh0aGlzLmp1bmN0aW9uT3V0cHV0TFtpKzFdICogdGhpcy5mYWRlLCAtMSwgMSk7ICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodXBkYXRlQW1wbGl0dWRlcylcbiAgICAgICAgICAgIHsgICBcbiAgICAgICAgICAgICAgICB2YXIgYW1wbGl0dWRlID0gTWF0aC5hYnModGhpcy5SW2ldK3RoaXMuTFtpXSk7XG4gICAgICAgICAgICAgICAgaWYgKGFtcGxpdHVkZSA+IHRoaXMubWF4QW1wbGl0dWRlW2ldKSB0aGlzLm1heEFtcGxpdHVkZVtpXSA9IGFtcGxpdHVkZTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMubWF4QW1wbGl0dWRlW2ldICo9IDAuOTk5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5saXBPdXRwdXQgPSB0aGlzLlJbdGhpcy5uLTFdO1xuICAgICAgICBcbiAgICAgICAgLy9ub3NlICAgICBcbiAgICAgICAgdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRMW3RoaXMubm9zZUxlbmd0aF0gPSB0aGlzLm5vc2VSW3RoaXMubm9zZUxlbmd0aC0xXSAqIHRoaXMubGlwUmVmbGVjdGlvbjsgXG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpPTE7IGk8dGhpcy5ub3NlTGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB3ID0gdGhpcy5ub3NlUmVmbGVjdGlvbltpXSAqICh0aGlzLm5vc2VSW2ktMV0gKyB0aGlzLm5vc2VMW2ldKTtcbiAgICAgICAgICAgIHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0UltpXSA9IHRoaXMubm9zZVJbaS0xXSAtIHc7XG4gICAgICAgICAgICB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dExbaV0gPSB0aGlzLm5vc2VMW2ldICsgdztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubm9zZUxlbmd0aDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm5vc2VSW2ldID0gdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRSW2ldICogdGhpcy5mYWRlO1xuICAgICAgICAgICAgdGhpcy5ub3NlTFtpXSA9IHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0TFtpKzFdICogdGhpcy5mYWRlOyAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL3RoaXMubm9zZVJbaV0gPSBNYXRoLmNsYW1wKHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0UltpXSAqIHRoaXMuZmFkZSwgLTEsIDEpO1xuICAgICAgICAgICAgLy90aGlzLm5vc2VMW2ldID0gTWF0aC5jbGFtcCh0aGlzLm5vc2VKdW5jdGlvbk91dHB1dExbaSsxXSAqIHRoaXMuZmFkZSwgLTEsIDEpOyAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHVwZGF0ZUFtcGxpdHVkZXMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGFtcGxpdHVkZSA9IE1hdGguYWJzKHRoaXMubm9zZVJbaV0rdGhpcy5ub3NlTFtpXSk7XG4gICAgICAgICAgICAgICAgaWYgKGFtcGxpdHVkZSA+IHRoaXMubm9zZU1heEFtcGxpdHVkZVtpXSkgdGhpcy5ub3NlTWF4QW1wbGl0dWRlW2ldID0gYW1wbGl0dWRlO1xuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5ub3NlTWF4QW1wbGl0dWRlW2ldICo9IDAuOTk5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub3NlT3V0cHV0ID0gdGhpcy5ub3NlUlt0aGlzLm5vc2VMZW5ndGgtMV07XG4gICAgICAgXG4gICAgfVxuICAgIFxuICAgIGZpbmlzaEJsb2NrKCkgeyAgICAgICAgIFxuICAgICAgICB0aGlzLnJlc2hhcGVUcmFjdCh0aGlzLnRyb21ib25lLkF1ZGlvU3lzdGVtLmJsb2NrVGltZSk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUmVmbGVjdGlvbnMoKTtcbiAgICB9XG4gICAgXG4gICAgYWRkVHJhbnNpZW50KHBvc2l0aW9uKSB7XG4gICAgICAgIHZhciB0cmFucyA9IHt9XG4gICAgICAgIHRyYW5zLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRyYW5zLnRpbWVBbGl2ZSA9IDA7XG4gICAgICAgIHRyYW5zLmxpZmVUaW1lID0gMC4yO1xuICAgICAgICB0cmFucy5zdHJlbmd0aCA9IDAuMztcbiAgICAgICAgdHJhbnMuZXhwb25lbnQgPSAyMDA7XG4gICAgICAgIHRoaXMudHJhbnNpZW50cy5wdXNoKHRyYW5zKTtcbiAgICB9XG4gICAgXG4gICAgcHJvY2Vzc1RyYW5zaWVudHMoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50cmFuc2llbnRzLmxlbmd0aDsgaSsrKSAgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0cmFucyA9IHRoaXMudHJhbnNpZW50c1tpXTtcbiAgICAgICAgICAgIHZhciBhbXBsaXR1ZGUgPSB0cmFucy5zdHJlbmd0aCAqIE1hdGgucG93KDIsIC10cmFucy5leHBvbmVudCAqIHRyYW5zLnRpbWVBbGl2ZSk7XG4gICAgICAgICAgICB0aGlzLlJbdHJhbnMucG9zaXRpb25dICs9IGFtcGxpdHVkZS8yO1xuICAgICAgICAgICAgdGhpcy5MW3RyYW5zLnBvc2l0aW9uXSArPSBhbXBsaXR1ZGUvMjtcbiAgICAgICAgICAgIHRyYW5zLnRpbWVBbGl2ZSArPSAxLjAvKHRoaXMudHJvbWJvbmUuc2FtcGxlUmF0ZSoyKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpPXRoaXMudHJhbnNpZW50cy5sZW5ndGgtMTsgaT49MDsgaS0tKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdHJhbnMgPSB0aGlzLnRyYW5zaWVudHNbaV07XG4gICAgICAgICAgICBpZiAodHJhbnMudGltZUFsaXZlID4gdHJhbnMubGlmZVRpbWUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2llbnRzLnNwbGljZShpLDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGFkZFR1cmJ1bGVuY2VOb2lzZSh0dXJidWxlbmNlTm9pc2UpIHtcbiAgICAgICAgLy8gZm9yICh2YXIgaj0wOyBqPFVJLnRvdWNoZXNXaXRoTW91c2UubGVuZ3RoOyBqKyspXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIHZhciB0b3VjaCA9IFVJLnRvdWNoZXNXaXRoTW91c2Vbal07XG4gICAgICAgIC8vICAgICBpZiAodG91Y2guaW5kZXg8MiB8fCB0b3VjaC5pbmRleD5UcmFjdC5uKSBjb250aW51ZTtcbiAgICAgICAgLy8gICAgIGlmICh0b3VjaC5kaWFtZXRlcjw9MCkgY29udGludWU7ICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICB2YXIgaW50ZW5zaXR5ID0gdG91Y2guZnJpY2F0aXZlX2ludGVuc2l0eTtcbiAgICAgICAgLy8gICAgIGlmIChpbnRlbnNpdHkgPT0gMCkgY29udGludWU7XG4gICAgICAgIC8vICAgICB0aGlzLmFkZFR1cmJ1bGVuY2VOb2lzZUF0SW5kZXgoMC42Nip0dXJidWxlbmNlTm9pc2UqaW50ZW5zaXR5LCB0b3VjaC5pbmRleCwgdG91Y2guZGlhbWV0ZXIpO1xuICAgICAgICAvLyB9XG4gICAgfVxuICAgIFxuICAgIGFkZFR1cmJ1bGVuY2VOb2lzZUF0SW5kZXgodHVyYnVsZW5jZU5vaXNlLCBpbmRleCwgZGlhbWV0ZXIpIHsgICBcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKGluZGV4KTtcbiAgICAgICAgdmFyIGRlbHRhID0gaW5kZXggLSBpO1xuICAgICAgICB0dXJidWxlbmNlTm9pc2UgKj0gdGhpcy50cm9tYm9uZS5HbG90dGlzLmdldE5vaXNlTW9kdWxhdG9yKCk7XG4gICAgICAgIHZhciB0aGlubmVzczAgPSBNYXRoLmNsYW1wKDgqKDAuNy1kaWFtZXRlciksMCwxKTtcbiAgICAgICAgdmFyIG9wZW5uZXNzID0gTWF0aC5jbGFtcCgzMCooZGlhbWV0ZXItMC4zKSwgMCwgMSk7XG4gICAgICAgIHZhciBub2lzZTAgPSB0dXJidWxlbmNlTm9pc2UqKDEtZGVsdGEpKnRoaW5uZXNzMCpvcGVubmVzcztcbiAgICAgICAgdmFyIG5vaXNlMSA9IHR1cmJ1bGVuY2VOb2lzZSpkZWx0YSp0aGlubmVzczAqb3Blbm5lc3M7XG4gICAgICAgIHRoaXMuUltpKzFdICs9IG5vaXNlMC8yO1xuICAgICAgICB0aGlzLkxbaSsxXSArPSBub2lzZTAvMjtcbiAgICAgICAgdGhpcy5SW2krMl0gKz0gbm9pc2UxLzI7XG4gICAgICAgIHRoaXMuTFtpKzJdICs9IG5vaXNlMS8yO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IFRyYWN0IH07IiwiTWF0aC5jbGFtcCA9IGZ1bmN0aW9uKG51bWJlciwgbWluLCBtYXgpIHtcbiAgICBpZiAobnVtYmVyPG1pbikgcmV0dXJuIG1pbjtcbiAgICBlbHNlIGlmIChudW1iZXI+bWF4KSByZXR1cm4gbWF4O1xuICAgIGVsc2UgcmV0dXJuIG51bWJlcjtcbn1cblxuTWF0aC5tb3ZlVG93YXJkcyA9IGZ1bmN0aW9uKGN1cnJlbnQsIHRhcmdldCwgYW1vdW50KSB7XG4gICAgaWYgKGN1cnJlbnQ8dGFyZ2V0KSByZXR1cm4gTWF0aC5taW4oY3VycmVudCthbW91bnQsIHRhcmdldCk7XG4gICAgZWxzZSByZXR1cm4gTWF0aC5tYXgoY3VycmVudC1hbW91bnQsIHRhcmdldCk7XG59XG5cbk1hdGgubW92ZVRvd2FyZHMgPSBmdW5jdGlvbihjdXJyZW50LCB0YXJnZXQsIGFtb3VudFVwLCBhbW91bnREb3duKSB7XG4gICAgaWYgKGN1cnJlbnQ8dGFyZ2V0KSByZXR1cm4gTWF0aC5taW4oY3VycmVudCthbW91bnRVcCwgdGFyZ2V0KTtcbiAgICBlbHNlIHJldHVybiBNYXRoLm1heChjdXJyZW50LWFtb3VudERvd24sIHRhcmdldCk7XG59XG5cbk1hdGguZ2F1c3NpYW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcyA9IDA7XG4gICAgZm9yICh2YXIgYz0wOyBjPDE2OyBjKyspIHMrPU1hdGgucmFuZG9tKCk7XG4gICAgcmV0dXJuIChzLTgpLzQ7XG59XG5cbk1hdGgubGVycCA9IGZ1bmN0aW9uKGEsIGIsIHQpIHtcbiAgICByZXR1cm4gYSArIChiIC0gYSkgKiB0O1xufSIsIi8qXG4gKiBBIHNwZWVkLWltcHJvdmVkIHBlcmxpbiBhbmQgc2ltcGxleCBub2lzZSBhbGdvcml0aG1zIGZvciAyRC5cbiAqXG4gKiBCYXNlZCBvbiBleGFtcGxlIGNvZGUgYnkgU3RlZmFuIEd1c3RhdnNvbiAoc3RlZ3VAaXRuLmxpdS5zZSkuXG4gKiBPcHRpbWlzYXRpb25zIGJ5IFBldGVyIEVhc3RtYW4gKHBlYXN0bWFuQGRyaXp6bGUuc3RhbmZvcmQuZWR1KS5cbiAqIEJldHRlciByYW5rIG9yZGVyaW5nIG1ldGhvZCBieSBTdGVmYW4gR3VzdGF2c29uIGluIDIwMTIuXG4gKiBDb252ZXJ0ZWQgdG8gSmF2YXNjcmlwdCBieSBKb3NlcGggR2VudGxlLlxuICpcbiAqIFZlcnNpb24gMjAxMi0wMy0wOVxuICpcbiAqIFRoaXMgY29kZSB3YXMgcGxhY2VkIGluIHRoZSBwdWJsaWMgZG9tYWluIGJ5IGl0cyBvcmlnaW5hbCBhdXRob3IsXG4gKiBTdGVmYW4gR3VzdGF2c29uLiBZb3UgbWF5IHVzZSBpdCBhcyB5b3Ugc2VlIGZpdCwgYnV0XG4gKiBhdHRyaWJ1dGlvbiBpcyBhcHByZWNpYXRlZC5cbiAqXG4gKi9cblxuY2xhc3MgR3JhZCB7XG4gICAgY29uc3RydWN0b3IoeCwgeSwgeil7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHRoaXMueiA9IHo7XG4gICAgfVxuXG4gICAgZG90Mih4LCB5KXtcbiAgICAgICAgcmV0dXJuIHRoaXMueCp4ICsgdGhpcy55Knk7XG4gICAgfVxuXG4gICAgZG90Myh4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiB0aGlzLngqeCArIHRoaXMueSp5ICsgdGhpcy56Kno7XG4gICAgfTtcbn1cblxuY2xhc3MgTm9pc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmdyYWQzID0gW25ldyBHcmFkKDEsMSwwKSxuZXcgR3JhZCgtMSwxLDApLG5ldyBHcmFkKDEsLTEsMCksbmV3IEdyYWQoLTEsLTEsMCksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IEdyYWQoMSwwLDEpLG5ldyBHcmFkKC0xLDAsMSksbmV3IEdyYWQoMSwwLC0xKSxuZXcgR3JhZCgtMSwwLC0xKSxcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgR3JhZCgwLDEsMSksbmV3IEdyYWQoMCwtMSwxKSxuZXcgR3JhZCgwLDEsLTEpLG5ldyBHcmFkKDAsLTEsLTEpXTtcbiAgICAgICAgdGhpcy5wID0gWzE1MSwxNjAsMTM3LDkxLDkwLDE1LFxuICAgICAgICAgICAgMTMxLDEzLDIwMSw5NSw5Niw1MywxOTQsMjMzLDcsMjI1LDE0MCwzNiwxMDMsMzAsNjksMTQyLDgsOTksMzcsMjQwLDIxLDEwLDIzLFxuICAgICAgICAgICAgMTkwLCA2LDE0OCwyNDcsMTIwLDIzNCw3NSwwLDI2LDE5Nyw2Miw5NCwyNTIsMjE5LDIwMywxMTcsMzUsMTEsMzIsNTcsMTc3LDMzLFxuICAgICAgICAgICAgODgsMjM3LDE0OSw1Niw4NywxNzQsMjAsMTI1LDEzNiwxNzEsMTY4LCA2OCwxNzUsNzQsMTY1LDcxLDEzNCwxMzksNDgsMjcsMTY2LFxuICAgICAgICAgICAgNzcsMTQ2LDE1OCwyMzEsODMsMTExLDIyOSwxMjIsNjAsMjExLDEzMywyMzAsMjIwLDEwNSw5Miw0MSw1NSw0NiwyNDUsNDAsMjQ0LFxuICAgICAgICAgICAgMTAyLDE0Myw1NCwgNjUsMjUsNjMsMTYxLCAxLDIxNiw4MCw3MywyMDksNzYsMTMyLDE4NywyMDgsIDg5LDE4LDE2OSwyMDAsMTk2LFxuICAgICAgICAgICAgMTM1LDEzMCwxMTYsMTg4LDE1OSw4NiwxNjQsMTAwLDEwOSwxOTgsMTczLDE4NiwgMyw2NCw1MiwyMTcsMjI2LDI1MCwxMjQsMTIzLFxuICAgICAgICAgICAgNSwyMDIsMzgsMTQ3LDExOCwxMjYsMjU1LDgyLDg1LDIxMiwyMDcsMjA2LDU5LDIyNyw0NywxNiw1OCwxNywxODIsMTg5LDI4LDQyLFxuICAgICAgICAgICAgMjIzLDE4MywxNzAsMjEzLDExOSwyNDgsMTUyLCAyLDQ0LDE1NCwxNjMsIDcwLDIyMSwxNTMsMTAxLDE1NSwxNjcsIDQzLDE3Miw5LFxuICAgICAgICAgICAgMTI5LDIyLDM5LDI1MywgMTksOTgsMTA4LDExMCw3OSwxMTMsMjI0LDIzMiwxNzgsMTg1LCAxMTIsMTA0LDIxOCwyNDYsOTcsMjI4LFxuICAgICAgICAgICAgMjUxLDM0LDI0MiwxOTMsMjM4LDIxMCwxNDQsMTIsMTkxLDE3OSwxNjIsMjQxLCA4MSw1MSwxNDUsMjM1LDI0OSwxNCwyMzksMTA3LFxuICAgICAgICAgICAgNDksMTkyLDIxNCwgMzEsMTgxLDE5OSwxMDYsMTU3LDE4NCwgODQsMjA0LDE3NiwxMTUsMTIxLDUwLDQ1LDEyNywgNCwxNTAsMjU0LFxuICAgICAgICAgICAgMTM4LDIzNiwyMDUsOTMsMjIyLDExNCw2NywyOSwyNCw3MiwyNDMsMTQxLDEyOCwxOTUsNzgsNjYsMjE1LDYxLDE1NiwxODBdO1xuXG4gICAgICAgIC8vIFRvIHJlbW92ZSB0aGUgbmVlZCBmb3IgaW5kZXggd3JhcHBpbmcsIGRvdWJsZSB0aGUgcGVybXV0YXRpb24gdGFibGUgbGVuZ3RoXG4gICAgICAgIHRoaXMucGVybSA9IG5ldyBBcnJheSg1MTIpO1xuICAgICAgICB0aGlzLmdyYWRQID0gbmV3IEFycmF5KDUxMik7XG5cbiAgICAgICAgdGhpcy5zZWVkKERhdGUubm93KCkpO1xuICAgIH1cblxuICAgIHNlZWQoc2VlZCkge1xuICAgICAgICBpZihzZWVkID4gMCAmJiBzZWVkIDwgMSkge1xuICAgICAgICAgICAgLy8gU2NhbGUgdGhlIHNlZWQgb3V0XG4gICAgICAgICAgICBzZWVkICo9IDY1NTM2O1xuICAgICAgICB9XG5cbiAgICAgICAgc2VlZCA9IE1hdGguZmxvb3Ioc2VlZCk7XG4gICAgICAgIGlmKHNlZWQgPCAyNTYpIHtcbiAgICAgICAgICAgIHNlZWQgfD0gc2VlZCA8PCA4O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdjtcbiAgICAgICAgICAgIGlmIChpICYgMSkge1xuICAgICAgICAgICAgICAgIHYgPSB0aGlzLnBbaV0gXiAoc2VlZCAmIDI1NSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHYgPSB0aGlzLnBbaV0gXiAoKHNlZWQ+PjgpICYgMjU1KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wZXJtW2ldID0gdGhpcy5wZXJtW2kgKyAyNTZdID0gdjtcbiAgICAgICAgICAgIHRoaXMuZ3JhZFBbaV0gPSB0aGlzLmdyYWRQW2kgKyAyNTZdID0gdGhpcy5ncmFkM1t2ICUgMTJdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIDJEIHNpbXBsZXggbm9pc2VcbiAgICBzaW1wbGV4Mih4aW4sIHlpbikge1xuICAgICAgICAvLyBTa2V3aW5nIGFuZCB1bnNrZXdpbmcgZmFjdG9ycyBmb3IgMiwgMywgYW5kIDQgZGltZW5zaW9uc1xuICAgICAgICB2YXIgRjIgPSAwLjUqKE1hdGguc3FydCgzKS0xKTtcbiAgICAgICAgdmFyIEcyID0gKDMtTWF0aC5zcXJ0KDMpKS82O1xuXG4gICAgICAgIHZhciBGMyA9IDEvMztcbiAgICAgICAgdmFyIEczID0gMS82O1xuXG4gICAgICAgIHZhciBuMCwgbjEsIG4yOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcbiAgICAgICAgLy8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxuICAgICAgICB2YXIgcyA9ICh4aW4reWluKSpGMjsgLy8gSGFpcnkgZmFjdG9yIGZvciAyRFxuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeGluK3MpO1xuICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluK3MpO1xuICAgICAgICB2YXIgdCA9IChpK2opKkcyO1xuICAgICAgICB2YXIgeDAgPSB4aW4taSt0OyAvLyBUaGUgeCx5IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpbiwgdW5za2V3ZWQuXG4gICAgICAgIHZhciB5MCA9IHlpbi1qK3Q7XG4gICAgICAgIC8vIEZvciB0aGUgMkQgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYW4gZXF1aWxhdGVyYWwgdHJpYW5nbGUuXG4gICAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cbiAgICAgICAgdmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xuICAgICAgICBpZih4MD55MCkgeyAvLyBsb3dlciB0cmlhbmdsZSwgWFkgb3JkZXI6ICgwLDApLT4oMSwwKS0+KDEsMSlcbiAgICAgICAgICAgIGkxPTE7IGoxPTA7XG4gICAgICAgIH0gZWxzZSB7ICAgIC8vIHVwcGVyIHRyaWFuZ2xlLCBZWCBvcmRlcjogKDAsMCktPigwLDEpLT4oMSwxKVxuICAgICAgICAgICAgaTE9MDsgajE9MTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBIHN0ZXAgb2YgKDEsMCkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgxLWMsLWMpIGluICh4LHkpLCBhbmRcbiAgICAgICAgLy8gYSBzdGVwIG9mICgwLDEpIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jKSBpbiAoeCx5KSwgd2hlcmVcbiAgICAgICAgLy8gYyA9ICgzLXNxcnQoMykpLzZcbiAgICAgICAgdmFyIHgxID0geDAgLSBpMSArIEcyOyAvLyBPZmZzZXRzIGZvciBtaWRkbGUgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xuICAgICAgICB2YXIgeTEgPSB5MCAtIGoxICsgRzI7XG4gICAgICAgIHZhciB4MiA9IHgwIC0gMSArIDIgKiBHMjsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXG4gICAgICAgIHZhciB5MiA9IHkwIC0gMSArIDIgKiBHMjtcbiAgICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSB0aHJlZSBzaW1wbGV4IGNvcm5lcnNcbiAgICAgICAgaSAmPSAyNTU7XG4gICAgICAgIGogJj0gMjU1O1xuICAgICAgICB2YXIgZ2kwID0gdGhpcy5ncmFkUFtpK3RoaXMucGVybVtqXV07XG4gICAgICAgIHZhciBnaTEgPSB0aGlzLmdyYWRQW2kraTErdGhpcy5wZXJtW2orajFdXTtcbiAgICAgICAgdmFyIGdpMiA9IHRoaXMuZ3JhZFBbaSsxK3RoaXMucGVybVtqKzFdXTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuICAgICAgICB2YXIgdDAgPSAwLjUgLSB4MCp4MC15MCp5MDtcbiAgICAgICAgaWYodDA8MCkge1xuICAgICAgICAgICAgbjAgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdDAgKj0gdDA7XG4gICAgICAgICAgICBuMCA9IHQwICogdDAgKiBnaTAuZG90Mih4MCwgeTApOyAgLy8gKHgseSkgb2YgZ3JhZDMgdXNlZCBmb3IgMkQgZ3JhZGllbnRcbiAgICAgICAgfVxuICAgICAgICB2YXIgdDEgPSAwLjUgLSB4MSp4MS15MSp5MTtcbiAgICAgICAgaWYodDE8MCkge1xuICAgICAgICAgICAgbjEgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdDEgKj0gdDE7XG4gICAgICAgICAgICBuMSA9IHQxICogdDEgKiBnaTEuZG90Mih4MSwgeTEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0MiA9IDAuNSAtIHgyKngyLXkyKnkyO1xuICAgICAgICBpZih0MjwwKSB7XG4gICAgICAgICAgICBuMiA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0MiAqPSB0MjtcbiAgICAgICAgICAgIG4yID0gdDIgKiB0MiAqIGdpMi5kb3QyKHgyLCB5Mik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxuICAgICAgICAvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXG4gICAgICAgIHJldHVybiA3MCAqIChuMCArIG4xICsgbjIpO1xuICAgIH1cbiAgICBcbiAgICBzaW1wbGV4MSh4KXtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2ltcGxleDIoeCoxLjIsIC14KjAuNyk7XG4gICAgfVxuXG59XG5cbmNvbnN0IHNpbmdsZXRvbiA9IG5ldyBOb2lzZSgpO1xuT2JqZWN0LmZyZWV6ZShzaW5nbGV0b24pO1xuXG5leHBvcnQgZGVmYXVsdCBzaW5nbGV0b247IiwiaW1wb3J0IFwiLi9tYXRoLWV4dGVuc2lvbnMuanNcIjtcblxuaW1wb3J0IHsgQXVkaW9TeXN0ZW0gfSBmcm9tIFwiLi9jb21wb25lbnRzL2F1ZGlvLXN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgR2xvdHRpcyB9IGZyb20gXCIuL2NvbXBvbmVudHMvZ2xvdHRpcy5qc1wiO1xuaW1wb3J0IHsgVHJhY3QgfSBmcm9tIFwiLi9jb21wb25lbnRzL3RyYWN0LmpzXCI7XG5pbXBvcnQgeyBUcmFjdFVJIH0gZnJvbSBcIi4vY29tcG9uZW50cy90cmFjdC11aS5qc1wiO1xuXG5jbGFzcyBQaW5rVHJvbWJvbmUge1xuICAgIGNvbnN0cnVjdG9yKCl7XG5cbiAgICAgICAgdGhpcy5zYW1wbGVSYXRlID0gMDtcbiAgICAgICAgdGhpcy50aW1lID0gMDtcbiAgICAgICAgdGhpcy5hbHdheXNWb2ljZSA9IHRydWU7XG4gICAgICAgIHRoaXMuYXV0b1dvYmJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubm9pc2VGcmVxID0gNTAwO1xuICAgICAgICB0aGlzLm5vaXNlUSA9IDAuNztcblxuICAgICAgICB0aGlzLkF1ZGlvU3lzdGVtID0gbmV3IEF1ZGlvU3lzdGVtKHRoaXMpO1xuICAgICAgICB0aGlzLkF1ZGlvU3lzdGVtLmluaXQoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuR2xvdHRpcyA9IG5ldyBHbG90dGlzKHRoaXMpO1xuICAgICAgICB0aGlzLkdsb3R0aXMuaW5pdCgpO1xuXG4gICAgICAgIHRoaXMuVHJhY3QgPSBuZXcgVHJhY3QodGhpcyk7XG4gICAgICAgIHRoaXMuVHJhY3QuaW5pdCgpO1xuXG4gICAgICAgIHRoaXMuVHJhY3RVSSA9IG5ldyBUcmFjdFVJKHRoaXMpO1xuICAgICAgICB0aGlzLlRyYWN0VUkuaW5pdCgpO1xuXG4gICAgICAgIC8vdGhpcy5TdGFydEF1ZGlvKCk7XG4gICAgICAgIC8vdGhpcy5TZXRNdXRlKHRydWUpO1xuICAgIH1cblxuICAgIFN0YXJ0QXVkaW8oKSB7XG4gICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5BdWRpb1N5c3RlbS5zdGFydFNvdW5kKCk7XG4gICAgfVxuXG4gICAgU2V0TXV0ZShkb011dGUpIHtcbiAgICAgICAgZG9NdXRlID8gdGhpcy5BdWRpb1N5c3RlbS5tdXRlKCkgOiB0aGlzLkF1ZGlvU3lzdGVtLnVubXV0ZSgpO1xuICAgICAgICB0aGlzLm11dGVkID0gZG9NdXRlO1xuICAgIH1cblxuICAgIFRvZ2dsZU11dGUoKSB7XG4gICAgICAgIHRoaXMuU2V0TXV0ZSghdGhpcy5tdXRlZCk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCB7IFBpbmtUcm9tYm9uZSB9OyIsImNsYXNzIE1vZGVsTG9hZGVyIHtcblxuICAgIC8qKlxuICAgICAqIExvYWRzIGEgbW9kZWwgYXN5bmNocm9ub3VzbHkuIEV4cGVjdHMgYW4gb2JqZWN0IGNvbnRhaW5pbmdcbiAgICAgKiB0aGUgcGF0aCB0byB0aGUgb2JqZWN0LCB0aGUgcmVsYXRpdmUgcGF0aCBvZiB0aGUgT0JKIGZpbGUsXG4gICAgICogYW5kIHRoZSByZWxhdGl2ZSBwYXRoIG9mIHRoZSBNVEwgZmlsZS5cbiAgICAgKiBcbiAgICAgKiBBbiBleGFtcGxlOlxuICAgICAqIGxldCBtb2RlbEluZm8gPSB7XG4gICAgICogICAgICBwYXRoOiBcIi4uL3Jlc291cmNlcy9vYmovXCIsXG4gICAgICogICAgICBvYmpGaWxlOiBcInRlc3Qub2JqXCIsXG4gICAgICogICAgICBtdGxGaWxlOiBcInRlc3QubXRsXCJcbiAgICAgKiB9XG4gICAgICovXG4gICAgc3RhdGljIExvYWRPQkoobW9kZWxJbmZvLCBsb2FkZWRDYWxsYmFjaykge1xuXG4gICAgICAgIHZhciBvblByb2dyZXNzID0gZnVuY3Rpb24oIHhociApIHtcbiAgICAgICAgICAgIGlmICggeGhyLmxlbmd0aENvbXB1dGFibGUgKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IHhoci5sb2FkZWQgLyB4aHIudG90YWwgKiAxMDA7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIE1hdGgucm91bmQoIHBlcmNlbnRDb21wbGV0ZSwgMiApICsgJyUgZG93bmxvYWRlZCcgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9uRXJyb3IgPSBmdW5jdGlvbiggeGhyICkge1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBtdGxMb2FkZXIgPSBuZXcgVEhSRUUuTVRMTG9hZGVyKCk7XG4gICAgICAgIG10bExvYWRlci5zZXRQYXRoKCBtb2RlbEluZm8ucGF0aCApO1xuXG4gICAgICAgIG10bExvYWRlci5sb2FkKCBtb2RlbEluZm8ubXRsRmlsZSwgKCBtYXRlcmlhbHMgKSA9PiB7XG4gICAgICAgICAgICBtYXRlcmlhbHMucHJlbG9hZCgpO1xuICAgICAgICAgICAgdmFyIG9iakxvYWRlciA9IG5ldyBUSFJFRS5PQkpMb2FkZXIoKTtcbiAgICAgICAgICAgIG9iakxvYWRlci5zZXRNYXRlcmlhbHMoIG1hdGVyaWFscyApO1xuICAgICAgICAgICAgb2JqTG9hZGVyLnNldFBhdGgoIG1vZGVsSW5mby5wYXRoICk7XG4gICAgICAgICAgICBvYmpMb2FkZXIubG9hZCggbW9kZWxJbmZvLm9iakZpbGUsICggb2JqZWN0ICkgPT4ge1xuICAgICAgICAgICAgICAgIGxvYWRlZENhbGxiYWNrKG9iamVjdCk7XG4gICAgICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yICk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgTG9hZEpTT04ocGF0aCwgbG9hZGVkQ2FsbGJhY2spIHtcblxuICAgICAgICB2YXIgb25Qcm9ncmVzcyA9IGZ1bmN0aW9uKCB4aHIgKSB7XG4gICAgICAgICAgICBpZiAoIHhoci5sZW5ndGhDb21wdXRhYmxlICkge1xuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSB4aHIubG9hZGVkIC8geGhyLnRvdGFsICogMTAwO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBNYXRoLnJvdW5kKCBwZXJjZW50Q29tcGxldGUsIDIgKSArICclIGRvd25sb2FkZWQnICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvbkVycm9yID0gZnVuY3Rpb24oIHhociApIHtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIoKTtcbiAgICAgICAgbG9hZGVyLmxvYWQoIHBhdGgsICggZ2VvbWV0cnksIG1hdGVyaWFscyApID0+IHtcbiAgICAgICAgICAgIC8vIEFwcGx5IHNraW5uaW5nIHRvIGVhY2ggbWF0ZXJpYWwgc28gdGhlIHZlcnRzIGFyZSBhZmZlY3RlZCBieSBib25lIG1vdmVtZW50XG4gICAgICAgICAgICBmb3IobGV0IG1hdCBvZiBtYXRlcmlhbHMpe1xuICAgICAgICAgICAgICAgIG1hdC5za2lubmluZyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbWVzaCA9IG5ldyBUSFJFRS5Ta2lubmVkTWVzaCggZ2VvbWV0cnksIG5ldyBUSFJFRS5NdWx0aU1hdGVyaWFsKCBtYXRlcmlhbHMgKSApO1xuICAgICAgICAgICAgbWVzaC5uYW1lID0gXCJKb25cIjtcbiAgICAgICAgICAgIGxvYWRlZENhbGxiYWNrKG1lc2gpO1xuICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgTG9hZEZCWChwYXRoLCBsb2FkZWRDYWxsYmFjaykge1xuICAgICAgICBsZXQgbWFuYWdlciA9IG5ldyBUSFJFRS5Mb2FkaW5nTWFuYWdlcigpO1xuICAgICAgICBtYW5hZ2VyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiggaXRlbSwgbG9hZGVkLCB0b3RhbCApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBpdGVtLCBsb2FkZWQsIHRvdGFsICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiggeGhyICkge1xuICAgICAgICAgICAgaWYgKCB4aHIubGVuZ3RoQ29tcHV0YWJsZSApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0geGhyLmxvYWRlZCAvIHhoci50b3RhbCAqIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggTWF0aC5yb3VuZCggcGVyY2VudENvbXBsZXRlLCAyICkgKyAnJSBkb3dubG9hZGVkJyApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgb25FcnJvciA9IGZ1bmN0aW9uKCB4aHIgKSB7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5GQlhMb2FkZXIoIG1hbmFnZXIgKTtcbiAgICAgICAgbG9hZGVyLmxvYWQoIHBhdGgsICggb2JqZWN0ICkgPT4ge1xuICAgICAgICAgICAgbG9hZGVkQ2FsbGJhY2sob2JqZWN0KTtcbiAgICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvciApO1xuICAgIH1cblxufVxuXG5leHBvcnQgeyBNb2RlbExvYWRlciB9OyIsImNsYXNzIERldGVjdG9yIHtcblxuICAgIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMTg3MTA3Ny9wcm9wZXItd2F5LXRvLWRldGVjdC13ZWJnbC1zdXBwb3J0XG4gICAgc3RhdGljIEhhc1dlYkdMKCkge1xuICAgICAgICBpZiAoISF3aW5kb3cuV2ViR0xSZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZXMgPSBbXCJ3ZWJnbFwiLCBcImV4cGVyaW1lbnRhbC13ZWJnbFwiLCBcIm1vei13ZWJnbFwiLCBcIndlYmtpdC0zZFwiXSxcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8NDtpKyspIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQobmFtZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dC5nZXRQYXJhbWV0ZXIgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZWJHTCBpcyBlbmFibGVkXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge31cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gV2ViR0wgaXMgc3VwcG9ydGVkLCBidXQgZGlzYWJsZWRcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXZWJHTCBub3Qgc3VwcG9ydGVkXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgR2V0RXJyb3JIVE1MKG1lc3NhZ2UgPSBudWxsKXtcbiAgICAgICAgaWYobWVzc2FnZSA9PSBudWxsKXtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgWW91ciBncmFwaGljcyBjYXJkIGRvZXMgbm90IHNlZW0gdG8gc3VwcG9ydCBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8va2hyb25vcy5vcmcvd2ViZ2wvd2lraS9HZXR0aW5nX2FfV2ViR0xfSW1wbGVtZW50YXRpb25cIj5XZWJHTDwvYT4uIDxicj5cbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbmQgb3V0IGhvdyB0byBnZXQgaXQgPGEgaHJlZj1cImh0dHA6Ly9nZXQud2ViZ2wub3JnL1wiPmhlcmU8L2E+LmA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cIm5vLXdlYmdsLXN1cHBvcnRcIj5cbiAgICAgICAgPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIGBcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgRGV0ZWN0b3IgfTsiLCIhZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxlKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLk1pZGlDb252ZXJ0PWUoKTp0Lk1pZGlDb252ZXJ0PWUoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtmdW5jdGlvbiBlKHIpe2lmKG5bcl0pcmV0dXJuIG5bcl0uZXhwb3J0czt2YXIgaT1uW3JdPXtleHBvcnRzOnt9LGlkOnIsbG9hZGVkOiExfTtyZXR1cm4gdFtyXS5jYWxsKGkuZXhwb3J0cyxpLGkuZXhwb3J0cyxlKSxpLmxvYWRlZD0hMCxpLmV4cG9ydHN9dmFyIG49e307cmV0dXJuIGUubT10LGUuYz1uLGUucD1cIlwiLGUoMCl9KFtmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHI9big3KSxpPW4oMiksYT17aW5zdHJ1bWVudEJ5UGF0Y2hJRDppLmluc3RydW1lbnRCeVBhdGNoSUQsaW5zdHJ1bWVudEZhbWlseUJ5SUQ6aS5pbnN0cnVtZW50RmFtaWx5QnlJRCxwYXJzZTpmdW5jdGlvbih0KXtyZXR1cm4obmV3IHIuTWlkaSkuZGVjb2RlKHQpfSxsb2FkOmZ1bmN0aW9uKHQsZSl7dmFyIG49KG5ldyByLk1pZGkpLmxvYWQodCk7cmV0dXJuIGUmJm4udGhlbihlKSxufSxjcmVhdGU6ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IHIuTWlkaX19O2VbXCJkZWZhdWx0XCJdPWEsdC5leHBvcnRzPWF9LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih0KXtyZXR1cm4gdC5yZXBsYWNlKC9cXHUwMDAwL2csXCJcIil9ZnVuY3Rpb24gcih0LGUpe3JldHVybiA2MC9lLmJwbSoodC9lLlBQUSl9ZnVuY3Rpb24gaSh0KXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgdH1mdW5jdGlvbiBhKHQpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiB0fWZ1bmN0aW9uIG8odCl7dmFyIGU9W1wiQ1wiLFwiQyNcIixcIkRcIixcIkQjXCIsXCJFXCIsXCJGXCIsXCJGI1wiLFwiR1wiLFwiRyNcIixcIkFcIixcIkEjXCIsXCJCXCJdLG49TWF0aC5mbG9vcih0LzEyKS0xLHI9dCUxMjtyZXR1cm4gZVtyXStufXZhciBzPWZ1bmN0aW9uKCl7dmFyIHQ9L14oW2EtZ117MX0oPzpifCN8eHxiYik/KSgtP1swLTldKykvaTtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGEoZSkmJnQudGVzdChlKX19KCksdT1mdW5jdGlvbigpe3ZhciB0PS9eKFthLWddezF9KD86YnwjfHh8YmIpPykoLT9bMC05XSspL2ksZT17Y2JiOi0yLGNiOi0xLGM6MCxcImMjXCI6MSxjeDoyLGRiYjowLGRiOjEsZDoyLFwiZCNcIjozLGR4OjQsZWJiOjIsZWI6MyxlOjQsXCJlI1wiOjUsZXg6NixmYmI6MyxmYjo0LGY6NSxcImYjXCI6NixmeDo3LGdiYjo1LGdiOjYsZzo3LFwiZyNcIjo4LGd4OjksYWJiOjcsYWI6OCxhOjksXCJhI1wiOjEwLGF4OjExLGJiYjo5LGJiOjEwLGI6MTEsXCJiI1wiOjEyLGJ4OjEzfTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIHI9dC5leGVjKG4pLGk9clsxXSxhPXJbMl0sbz1lW2kudG9Mb3dlckNhc2UoKV07cmV0dXJuIG8rMTIqKHBhcnNlSW50KGEpKzEpfX0oKTt0LmV4cG9ydHM9e2NsZWFuTmFtZTpuLHRpY2tzVG9TZWNvbmRzOnIsaXNTdHJpbmc6YSxpc051bWJlcjppLGlzUGl0Y2g6cyxtaWRpVG9QaXRjaDpvLHBpdGNoVG9NaWRpOnV9fSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2UuaW5zdHJ1bWVudEJ5UGF0Y2hJRD1bXCJhY291c3RpYyBncmFuZCBwaWFub1wiLFwiYnJpZ2h0IGFjb3VzdGljIHBpYW5vXCIsXCJlbGVjdHJpYyBncmFuZCBwaWFub1wiLFwiaG9ua3ktdG9uayBwaWFub1wiLFwiZWxlY3RyaWMgcGlhbm8gMVwiLFwiZWxlY3RyaWMgcGlhbm8gMlwiLFwiaGFycHNpY2hvcmRcIixcImNsYXZpXCIsXCJjZWxlc3RhXCIsXCJnbG9ja2Vuc3BpZWxcIixcIm11c2ljIGJveFwiLFwidmlicmFwaG9uZVwiLFwibWFyaW1iYVwiLFwieHlsb3Bob25lXCIsXCJ0dWJ1bGFyIGJlbGxzXCIsXCJkdWxjaW1lclwiLFwiZHJhd2JhciBvcmdhblwiLFwicGVyY3Vzc2l2ZSBvcmdhblwiLFwicm9jayBvcmdhblwiLFwiY2h1cmNoIG9yZ2FuXCIsXCJyZWVkIG9yZ2FuXCIsXCJhY2NvcmRpb25cIixcImhhcm1vbmljYVwiLFwidGFuZ28gYWNjb3JkaW9uXCIsXCJhY291c3RpYyBndWl0YXIgKG55bG9uKVwiLFwiYWNvdXN0aWMgZ3VpdGFyIChzdGVlbClcIixcImVsZWN0cmljIGd1aXRhciAoamF6eilcIixcImVsZWN0cmljIGd1aXRhciAoY2xlYW4pXCIsXCJlbGVjdHJpYyBndWl0YXIgKG11dGVkKVwiLFwib3ZlcmRyaXZlbiBndWl0YXJcIixcImRpc3RvcnRpb24gZ3VpdGFyXCIsXCJndWl0YXIgaGFybW9uaWNzXCIsXCJhY291c3RpYyBiYXNzXCIsXCJlbGVjdHJpYyBiYXNzIChmaW5nZXIpXCIsXCJlbGVjdHJpYyBiYXNzIChwaWNrKVwiLFwiZnJldGxlc3MgYmFzc1wiLFwic2xhcCBiYXNzIDFcIixcInNsYXAgYmFzcyAyXCIsXCJzeW50aCBiYXNzIDFcIixcInN5bnRoIGJhc3MgMlwiLFwidmlvbGluXCIsXCJ2aW9sYVwiLFwiY2VsbG9cIixcImNvbnRyYWJhc3NcIixcInRyZW1vbG8gc3RyaW5nc1wiLFwicGl6emljYXRvIHN0cmluZ3NcIixcIm9yY2hlc3RyYWwgaGFycFwiLFwidGltcGFuaVwiLFwic3RyaW5nIGVuc2VtYmxlIDFcIixcInN0cmluZyBlbnNlbWJsZSAyXCIsXCJzeW50aHN0cmluZ3MgMVwiLFwic3ludGhzdHJpbmdzIDJcIixcImNob2lyIGFhaHNcIixcInZvaWNlIG9vaHNcIixcInN5bnRoIHZvaWNlXCIsXCJvcmNoZXN0cmEgaGl0XCIsXCJ0cnVtcGV0XCIsXCJ0cm9tYm9uZVwiLFwidHViYVwiLFwibXV0ZWQgdHJ1bXBldFwiLFwiZnJlbmNoIGhvcm5cIixcImJyYXNzIHNlY3Rpb25cIixcInN5bnRoYnJhc3MgMVwiLFwic3ludGhicmFzcyAyXCIsXCJzb3ByYW5vIHNheFwiLFwiYWx0byBzYXhcIixcInRlbm9yIHNheFwiLFwiYmFyaXRvbmUgc2F4XCIsXCJvYm9lXCIsXCJlbmdsaXNoIGhvcm5cIixcImJhc3Nvb25cIixcImNsYXJpbmV0XCIsXCJwaWNjb2xvXCIsXCJmbHV0ZVwiLFwicmVjb3JkZXJcIixcInBhbiBmbHV0ZVwiLFwiYmxvd24gYm90dGxlXCIsXCJzaGFrdWhhY2hpXCIsXCJ3aGlzdGxlXCIsXCJvY2FyaW5hXCIsXCJsZWFkIDEgKHNxdWFyZSlcIixcImxlYWQgMiAoc2F3dG9vdGgpXCIsXCJsZWFkIDMgKGNhbGxpb3BlKVwiLFwibGVhZCA0IChjaGlmZilcIixcImxlYWQgNSAoY2hhcmFuZylcIixcImxlYWQgNiAodm9pY2UpXCIsXCJsZWFkIDcgKGZpZnRocylcIixcImxlYWQgOCAoYmFzcyArIGxlYWQpXCIsXCJwYWQgMSAobmV3IGFnZSlcIixcInBhZCAyICh3YXJtKVwiLFwicGFkIDMgKHBvbHlzeW50aClcIixcInBhZCA0IChjaG9pcilcIixcInBhZCA1IChib3dlZClcIixcInBhZCA2IChtZXRhbGxpYylcIixcInBhZCA3IChoYWxvKVwiLFwicGFkIDggKHN3ZWVwKVwiLFwiZnggMSAocmFpbilcIixcImZ4IDIgKHNvdW5kdHJhY2spXCIsXCJmeCAzIChjcnlzdGFsKVwiLFwiZnggNCAoYXRtb3NwaGVyZSlcIixcImZ4IDUgKGJyaWdodG5lc3MpXCIsXCJmeCA2IChnb2JsaW5zKVwiLFwiZnggNyAoZWNob2VzKVwiLFwiZnggOCAoc2NpLWZpKVwiLFwic2l0YXJcIixcImJhbmpvXCIsXCJzaGFtaXNlblwiLFwia290b1wiLFwia2FsaW1iYVwiLFwiYmFnIHBpcGVcIixcImZpZGRsZVwiLFwic2hhbmFpXCIsXCJ0aW5rbGUgYmVsbFwiLFwiYWdvZ29cIixcInN0ZWVsIGRydW1zXCIsXCJ3b29kYmxvY2tcIixcInRhaWtvIGRydW1cIixcIm1lbG9kaWMgdG9tXCIsXCJzeW50aCBkcnVtXCIsXCJyZXZlcnNlIGN5bWJhbFwiLFwiZ3VpdGFyIGZyZXQgbm9pc2VcIixcImJyZWF0aCBub2lzZVwiLFwic2Vhc2hvcmVcIixcImJpcmQgdHdlZXRcIixcInRlbGVwaG9uZSByaW5nXCIsXCJoZWxpY29wdGVyXCIsXCJhcHBsYXVzZVwiLFwiZ3Vuc2hvdFwiXSxlLmluc3RydW1lbnRGYW1pbHlCeUlEPVtcInBpYW5vXCIsXCJjaHJvbWF0aWMgcGVyY3Vzc2lvblwiLFwib3JnYW5cIixcImd1aXRhclwiLFwiYmFzc1wiLFwic3RyaW5nc1wiLFwiZW5zZW1ibGVcIixcImJyYXNzXCIsXCJyZWVkXCIsXCJwaXBlXCIsXCJzeW50aCBsZWFkXCIsXCJzeW50aCBwYWRcIixcInN5bnRoIGVmZmVjdHNcIixcImV0aG5pY1wiLFwicGVyY3Vzc2l2ZVwiLFwic291bmQgZWZmZWN0c1wiXX0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsZSl7dmFyIG49MCxyPXQubGVuZ3RoLGk9cjtpZihyPjAmJnRbci0xXS50aW1lPD1lKXJldHVybiByLTE7Zm9yKDtpPm47KXt2YXIgYT1NYXRoLmZsb29yKG4rKGktbikvMiksbz10W2FdLHM9dFthKzFdO2lmKG8udGltZT09PWUpe2Zvcih2YXIgdT1hO3U8dC5sZW5ndGg7dSsrKXt2YXIgYz10W3VdO2MudGltZT09PWUmJihhPXUpfXJldHVybiBhfWlmKG8udGltZTxlJiZzLnRpbWU+ZSlyZXR1cm4gYTtvLnRpbWU+ZT9pPWE6by50aW1lPGUmJihuPWErMSl9cmV0dXJuLTF9ZnVuY3Rpb24gcih0LGUpe2lmKHQubGVuZ3RoKXt2YXIgcj1uKHQsZS50aW1lKTt0LnNwbGljZShyKzEsMCxlKX1lbHNlIHQucHVzaChlKX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLkJpbmFyeUluc2VydD1yfSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciByPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixyKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxyJiZ0KGUsciksZX19KCksaT17MTpcIm1vZHVsYXRpb25XaGVlbFwiLDI6XCJicmVhdGhcIiw0OlwiZm9vdENvbnRyb2xsZXJcIiw1OlwicG9ydGFtZW50b1RpbWVcIiw3Olwidm9sdW1lXCIsODpcImJhbGFuY2VcIiwxMDpcInBhblwiLDY0Olwic3VzdGFpblwiLDY1OlwicG9ydGFtZW50b1RpbWVcIiw2NjpcInNvc3RlbnV0b1wiLDY3Olwic29mdFBlZGFsXCIsNjg6XCJsZWdhdG9Gb290c3dpdGNoXCIsODQ6XCJwb3J0YW1lbnRvQ29udHJvXCJ9LGE9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGUscixpKXtuKHRoaXMsdCksdGhpcy5udW1iZXI9ZSx0aGlzLnRpbWU9cix0aGlzLnZhbHVlPWl9cmV0dXJuIHIodCxbe2tleTpcIm5hbWVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaS5oYXNPd25Qcm9wZXJ0eSh0aGlzLm51bWJlcik/aVt0aGlzLm51bWJlcl06dm9pZCAwfX1dKSx0fSgpO2UuQ29udHJvbD1hfSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCl7Zm9yKHZhciBlPXtQUFE6dC5oZWFkZXIudGlja3NQZXJCZWF0fSxuPTA7bjx0LnRyYWNrcy5sZW5ndGg7bisrKWZvcih2YXIgcj10LnRyYWNrc1tuXSxpPTA7aTxyLmxlbmd0aDtpKyspe3ZhciBhPXJbaV07XCJtZXRhXCI9PT1hLnR5cGUmJihcInRpbWVTaWduYXR1cmVcIj09PWEuc3VidHlwZT9lLnRpbWVTaWduYXR1cmU9W2EubnVtZXJhdG9yLGEuZGVub21pbmF0b3JdOlwic2V0VGVtcG9cIj09PWEuc3VidHlwZSYmKGUuYnBtfHwoZS5icG09NmU3L2EubWljcm9zZWNvbmRzUGVyQmVhdCkpKX1yZXR1cm4gZS5icG09ZS5icG18fDEyMCxlfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUucGFyc2VIZWFkZXI9bn0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsZSl7Zm9yKHZhciBuPTA7bjx0Lmxlbmd0aDtuKyspe3ZhciByPXRbbl0saT1lW25dO2lmKHIubGVuZ3RoPmkpcmV0dXJuITB9cmV0dXJuITF9ZnVuY3Rpb24gcih0LGUsbil7Zm9yKHZhciByPTAsaT0xLzAsYT0wO2E8dC5sZW5ndGg7YSsrKXt2YXIgbz10W2FdLHM9ZVthXTtvW3NdJiZvW3NdLnRpbWU8aSYmKHI9YSxpPW9bc10udGltZSl9bltyXSh0W3JdW2Vbcl1dKSxlW3JdKz0xfWZ1bmN0aW9uIGkoKXtmb3IodmFyIHQ9YXJndW1lbnRzLmxlbmd0aCxlPUFycmF5KHQpLGk9MDt0Pmk7aSsrKWVbaV09YXJndW1lbnRzW2ldO2Zvcih2YXIgYT1lLmZpbHRlcihmdW5jdGlvbih0LGUpe3JldHVybiBlJTI9PT0wfSksbz1uZXcgVWludDMyQXJyYXkoYS5sZW5ndGgpLHM9ZS5maWx0ZXIoZnVuY3Rpb24odCxlKXtyZXR1cm4gZSUyPT09MX0pO24oYSxvKTspcihhLG8scyl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5NZXJnZT1pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIGkodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuTWlkaT12b2lkIDA7dmFyIGE9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLHIpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLHImJnQoZSxyKSxlfX0oKSxvPW4oMTEpLHM9cihvKSx1PW4oMTApLGM9cih1KSxoPW4oMSksZj1yKGgpLGQ9big5KSxsPW4oNSkscD1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtpKHRoaXMsdCksdGhpcy5oZWFkZXI9e2JwbToxMjAsdGltZVNpZ25hdHVyZTpbNCw0XSxQUFE6NDgwfSx0aGlzLnRyYWNrcz1bXX1yZXR1cm4gYSh0LFt7a2V5OlwibG9hZFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMsbj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06bnVsbCxyPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXTpcIkdFVFwiO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihpLGEpe3ZhciBvPW5ldyBYTUxIdHRwUmVxdWVzdDtvLm9wZW4ocix0KSxvLnJlc3BvbnNlVHlwZT1cImFycmF5YnVmZmVyXCIsby5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGZ1bmN0aW9uKCl7ND09PW8ucmVhZHlTdGF0ZSYmMjAwPT09by5zdGF0dXM/aShlLmRlY29kZShvLnJlc3BvbnNlKSk6YShvLnN0YXR1cyl9KSxvLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLGEpLG8uc2VuZChuKX0pfX0se2tleTpcImRlY29kZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXM7aWYodCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKXt2YXIgbj1uZXcgVWludDhBcnJheSh0KTt0PVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxuKX12YXIgcj0oMCxzW1wiZGVmYXVsdFwiXSkodCk7cmV0dXJuIHRoaXMuaGVhZGVyPSgwLGwucGFyc2VIZWFkZXIpKHIpLHRoaXMudHJhY2tzPVtdLHIudHJhY2tzLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIG49bmV3IGQuVHJhY2s7ZS50cmFja3MucHVzaChuKTt2YXIgcj0wO3QuZm9yRWFjaChmdW5jdGlvbih0KXtyKz1mW1wiZGVmYXVsdFwiXS50aWNrc1RvU2Vjb25kcyh0LmRlbHRhVGltZSxlLmhlYWRlciksXCJtZXRhXCI9PT10LnR5cGUmJlwidHJhY2tOYW1lXCI9PT10LnN1YnR5cGU/bi5uYW1lPWZbXCJkZWZhdWx0XCJdLmNsZWFuTmFtZSh0LnRleHQpOlwibm90ZU9uXCI9PT10LnN1YnR5cGU/bi5ub3RlT24odC5ub3RlTnVtYmVyLHIsdC52ZWxvY2l0eS8xMjcpOlwibm90ZU9mZlwiPT09dC5zdWJ0eXBlP24ubm90ZU9mZih0Lm5vdGVOdW1iZXIscik6XCJjb250cm9sbGVyXCI9PT10LnN1YnR5cGUmJnQuY29udHJvbGxlclR5cGU/bi5jYyh0LmNvbnRyb2xsZXJUeXBlLHIsdC52YWx1ZS8xMjcpOlwibWV0YVwiPT09dC50eXBlJiZcImluc3RydW1lbnROYW1lXCI9PT10LnN1YnR5cGU/bi5pbnN0cnVtZW50PXQudGV4dDpcImNoYW5uZWxcIj09PXQudHlwZSYmXCJwcm9ncmFtQ2hhbmdlXCI9PT10LnN1YnR5cGUmJm4ucGF0Y2godC5wcm9ncmFtTnVtYmVyKX0pfSksdGhpc319LHtrZXk6XCJlbmNvZGVcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciB0PXRoaXMsZT1uZXcgY1tcImRlZmF1bHRcIl0uRmlsZSh7dGlja3M6dGhpcy5oZWFkZXIuUFBRfSk7cmV0dXJuIHRoaXMudHJhY2tzLmZvckVhY2goZnVuY3Rpb24obixyKXt2YXIgaT1lLmFkZFRyYWNrKCk7aS5zZXRUZW1wbyh0LmJwbSksbi5lbmNvZGUoaSx0LmhlYWRlcil9KSxlLnRvQnl0ZXMoKX19LHtrZXk6XCJ0b0FycmF5XCIsdmFsdWU6ZnVuY3Rpb24oKXtmb3IodmFyIHQ9dGhpcy5lbmNvZGUoKSxlPW5ldyBBcnJheSh0Lmxlbmd0aCksbj0wO248dC5sZW5ndGg7bisrKWVbbl09dC5jaGFyQ29kZUF0KG4pO3JldHVybiBlfX0se2tleTpcInRyYWNrXCIsdmFsdWU6ZnVuY3Rpb24gZSh0KXt2YXIgZT1uZXcgZC5UcmFjayh0KTtyZXR1cm4gdGhpcy50cmFja3MucHVzaChlKSxlfX0se2tleTpcImdldFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBmW1wiZGVmYXVsdFwiXS5pc051bWJlcih0KT90aGlzLnRyYWNrc1t0XTp0aGlzLnRyYWNrcy5maW5kKGZ1bmN0aW9uKGUpe3JldHVybiBlLm5hbWU9PT10fSl9fSx7a2V5Olwic2xpY2VcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTowLG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOnRoaXMuZHVyYXRpb24scj1uZXcgdDtyZXR1cm4gci5oZWFkZXI9dGhpcy5oZWFkZXIsci50cmFja3M9dGhpcy50cmFja3MubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0LnNsaWNlKGUsbil9KSxyfX0se2tleTpcInN0YXJ0VGltZVwiLGdldDpmdW5jdGlvbigpe3ZhciB0PXRoaXMudHJhY2tzLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdC5zdGFydFRpbWV9KTtyZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCx0KX19LHtrZXk6XCJicG1cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oZWFkZXIuYnBtfSxzZXQ6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5oZWFkZXIuYnBtO3RoaXMuaGVhZGVyLmJwbT10O3ZhciBuPWUvdDt0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHQpe3JldHVybiB0LnNjYWxlKG4pfSl9fSx7a2V5OlwidGltZVNpZ25hdHVyZVwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmhlYWRlci50aW1lU2lnbmF0dXJlfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5oZWFkZXIudGltZVNpZ25hdHVyZT10aW1lU2lnbmF0dXJlfX0se2tleTpcImR1cmF0aW9uXCIsZ2V0OmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy50cmFja3MubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0LmR1cmF0aW9ufSk7cmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsdCl9fV0pLHR9KCk7ZS5NaWRpPXB9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19ZnVuY3Rpb24gaSh0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5Ob3RlPXZvaWQgMDt2YXIgYT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fXJldHVybiBmdW5jdGlvbihlLG4scil7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksciYmdChlLHIpLGV9fSgpLG89bigxKSxzPXIobyksdT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoZSxuKXt2YXIgcj1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06MCxhPWFyZ3VtZW50cy5sZW5ndGg+MyYmdm9pZCAwIT09YXJndW1lbnRzWzNdP2FyZ3VtZW50c1szXToxO2lmKGkodGhpcyx0KSx0aGlzLm1pZGksc1tcImRlZmF1bHRcIl0uaXNOdW1iZXIoZSkpdGhpcy5taWRpPWU7ZWxzZXtpZighc1tcImRlZmF1bHRcIl0uaXNQaXRjaChlKSl0aHJvdyBuZXcgRXJyb3IoXCJ0aGUgbWlkaSB2YWx1ZSBtdXN0IGVpdGhlciBiZSBpbiBQaXRjaCBOb3RhdGlvbiAoZS5nLiBDIzQpIG9yIGEgbWlkaSB2YWx1ZVwiKTt0aGlzLm5hbWU9ZX10aGlzLnRpbWU9bix0aGlzLmR1cmF0aW9uPXIsdGhpcy52ZWxvY2l0eT1hfXJldHVybiBhKHQsW3trZXk6XCJtYXRjaFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBzW1wiZGVmYXVsdFwiXS5pc051bWJlcih0KT90aGlzLm1pZGk9PT10OnNbXCJkZWZhdWx0XCJdLmlzUGl0Y2godCk/dGhpcy5uYW1lLnRvTG93ZXJDYXNlKCk9PT10LnRvTG93ZXJDYXNlKCk6dm9pZCAwfX0se2tleTpcInRvSlNPTlwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJue25hbWU6dGhpcy5uYW1lLG1pZGk6dGhpcy5taWRpLHRpbWU6dGhpcy50aW1lLHZlbG9jaXR5OnRoaXMudmVsb2NpdHksZHVyYXRpb246dGhpcy5kdXJhdGlvbn19fSx7a2V5OlwibmFtZVwiLGdldDpmdW5jdGlvbigpe3JldHVybiBzW1wiZGVmYXVsdFwiXS5taWRpVG9QaXRjaCh0aGlzLm1pZGkpfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5taWRpPXNbXCJkZWZhdWx0XCJdLnBpdGNoVG9NaWRpKHQpfX0se2tleTpcIm5vdGVPblwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbWV9LHNldDpmdW5jdGlvbih0KXt0aGlzLnRpbWU9dH19LHtrZXk6XCJub3RlT2ZmXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGltZSt0aGlzLmR1cmF0aW9ufSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5kdXJhdGlvbj10LXRoaXMudGltZX19XSksdH0oKTtlLk5vdGU9dX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuVHJhY2s9dm9pZCAwO3ZhciBpPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixyKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxyJiZ0KGUsciksZX19KCksYT1uKDMpLG89big0KSxzPW4oNiksdT1uKDgpLGM9bigyKSxoPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpcIlwiLG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOi0xO3IodGhpcyx0KSx0aGlzLm5hbWU9ZSx0aGlzLm5vdGVzPVtdLHRoaXMuY29udHJvbENoYW5nZXM9e30sdGhpcy5pbnN0cnVtZW50TnVtYmVyPW59cmV0dXJuIGkodCxbe2tleTpcIm5vdGVcIix2YWx1ZTpmdW5jdGlvbiBlKHQsbil7dmFyIHI9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOjAsaT1hcmd1bWVudHMubGVuZ3RoPjMmJnZvaWQgMCE9PWFyZ3VtZW50c1szXT9hcmd1bWVudHNbM106MSxlPW5ldyB1Lk5vdGUodCxuLHIsaSk7cmV0dXJuKDAsYS5CaW5hcnlJbnNlcnQpKHRoaXMubm90ZXMsZSksdGhpc319LHtrZXk6XCJub3RlT25cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXToxLHI9bmV3IHUuTm90ZSh0LGUsMCxuKTtyZXR1cm4oMCxhLkJpbmFyeUluc2VydCkodGhpcy5ub3RlcyxyKSx0aGlzfX0se2tleTpcIm5vdGVPZmZcIix2YWx1ZTpmdW5jdGlvbih0LGUpe2Zvcih2YXIgbj0wO248dGhpcy5ub3Rlcy5sZW5ndGg7bisrKXt2YXIgcj10aGlzLm5vdGVzW25dO2lmKHIubWF0Y2godCkmJjA9PT1yLmR1cmF0aW9uKXtyLm5vdGVPZmY9ZTticmVha319cmV0dXJuIHRoaXN9fSx7a2V5OlwiY2NcIix2YWx1ZTpmdW5jdGlvbiBuKHQsZSxyKXt0aGlzLmNvbnRyb2xDaGFuZ2VzLmhhc093blByb3BlcnR5KHQpfHwodGhpcy5jb250cm9sQ2hhbmdlc1t0XT1bXSk7dmFyIG49bmV3IG8uQ29udHJvbCh0LGUscik7cmV0dXJuKDAsYS5CaW5hcnlJbnNlcnQpKHRoaXMuY29udHJvbENoYW5nZXNbdF0sbiksdGhpc319LHtrZXk6XCJwYXRjaFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmluc3RydW1lbnROdW1iZXI9dCx0aGlzfX0se2tleTpcInNjYWxlXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMubm90ZXMuZm9yRWFjaChmdW5jdGlvbihlKXtlLnRpbWUqPXQsZS5kdXJhdGlvbio9dH0pLHRoaXN9fSx7a2V5Olwic2xpY2VcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTowLG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOnRoaXMuZHVyYXRpb24scj1NYXRoLm1heCh0aGlzLm5vdGVzLmZpbmRJbmRleChmdW5jdGlvbih0KXtyZXR1cm4gdC50aW1lPj1lfSksMCksaT10aGlzLm5vdGVzLmZpbmRJbmRleChmdW5jdGlvbih0KXtyZXR1cm4gdC5ub3RlT2ZmPj1ufSkrMSxhPW5ldyB0KHRoaXMubmFtZSk7cmV0dXJuIGEubm90ZXM9dGhpcy5ub3Rlcy5zbGljZShyLGkpLGEubm90ZXMuZm9yRWFjaChmdW5jdGlvbih0KXtyZXR1cm4gdC50aW1lPXQudGltZS1lfSksYX19LHtrZXk6XCJlbmNvZGVcIix2YWx1ZTpmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIG4odCl7dmFyIGU9TWF0aC5mbG9vcihyKnQpLG49TWF0aC5tYXgoZS1pLDApO3JldHVybiBpPWUsbn12YXIgcj1lLlBQUS8oNjAvZS5icG0pLGk9MCxhPTA7LTEhPT10aGlzLmluc3RydW1lbnROdW1iZXImJnQuaW5zdHJ1bWVudChhLHRoaXMuaW5zdHJ1bWVudE51bWJlciksKDAscy5NZXJnZSkodGhpcy5ub3RlT25zLGZ1bmN0aW9uKGUpe3QuYWRkTm90ZU9uKGEsZS5uYW1lLG4oZS50aW1lKSxNYXRoLmZsb29yKDEyNyplLnZlbG9jaXR5KSl9LHRoaXMubm90ZU9mZnMsZnVuY3Rpb24oZSl7dC5hZGROb3RlT2ZmKGEsZS5uYW1lLG4oZS50aW1lKSl9KX19LHtrZXk6XCJub3RlT25zXCIsZ2V0OmZ1bmN0aW9uKCl7dmFyIHQ9W107cmV0dXJuIHRoaXMubm90ZXMuZm9yRWFjaChmdW5jdGlvbihlKXt0LnB1c2goe3RpbWU6ZS5ub3RlT24sbWlkaTplLm1pZGksbmFtZTplLm5hbWUsdmVsb2NpdHk6ZS52ZWxvY2l0eX0pfSksdH19LHtrZXk6XCJub3RlT2Zmc1wiLGdldDpmdW5jdGlvbigpe3ZhciB0PVtdO3JldHVybiB0aGlzLm5vdGVzLmZvckVhY2goZnVuY3Rpb24oZSl7dC5wdXNoKHt0aW1lOmUubm90ZU9mZixtaWRpOmUubWlkaSxuYW1lOmUubmFtZX0pfSksdH19LHtrZXk6XCJsZW5ndGhcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ub3Rlcy5sZW5ndGh9fSx7a2V5Olwic3RhcnRUaW1lXCIsZ2V0OmZ1bmN0aW9uKCl7aWYodGhpcy5ub3Rlcy5sZW5ndGgpe3ZhciB0PXRoaXMubm90ZXNbMF07cmV0dXJuIHQubm90ZU9ufXJldHVybiAwfX0se2tleTpcImR1cmF0aW9uXCIsZ2V0OmZ1bmN0aW9uKCl7aWYodGhpcy5ub3Rlcy5sZW5ndGgpe3ZhciB0PXRoaXMubm90ZXNbdGhpcy5ub3Rlcy5sZW5ndGgtMV07cmV0dXJuIHQubm90ZU9mZn1yZXR1cm4gMH19LHtrZXk6XCJpbnN0cnVtZW50XCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGMuaW5zdHJ1bWVudEJ5UGF0Y2hJRFt0aGlzLmluc3RydW1lbnROdW1iZXJdfSxzZXQ6ZnVuY3Rpb24odCl7dmFyIGU9Yy5pbnN0cnVtZW50QnlQYXRjaElELmluZGV4T2YodCk7LTEhPT1lJiYodGhpcy5pbnN0cnVtZW50TnVtYmVyPWUpfX0se2tleTpcImluc3RydW1lbnRGYW1pbHlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gYy5pbnN0cnVtZW50RmFtaWx5QnlJRFtNYXRoLmZsb29yKHRoaXMuaW5zdHJ1bWVudE51bWJlci84KV19fV0pLHR9KCk7ZS5UcmFjaz1ofSxmdW5jdGlvbih0LGUsbil7KGZ1bmN0aW9uKHQpe3ZhciBuPXt9OyFmdW5jdGlvbih0KXt2YXIgZT10LkRFRkFVTFRfVk9MVU1FPTkwLG49KHQuREVGQVVMVF9EVVJBVElPTj0xMjgsdC5ERUZBVUxUX0NIQU5ORUw9MCx7bWlkaV9sZXR0ZXJfcGl0Y2hlczp7YToyMSxiOjIzLGM6MTIsZDoxNCxlOjE2LGY6MTcsZzoxOX0sbWlkaVBpdGNoRnJvbU5vdGU6ZnVuY3Rpb24odCl7dmFyIGU9LyhbYS1nXSkoIyt8YispPyhbMC05XSspJC9pLmV4ZWModCkscj1lWzFdLnRvTG93ZXJDYXNlKCksaT1lWzJdfHxcIlwiLGE9cGFyc2VJbnQoZVszXSwxMCk7cmV0dXJuIDEyKmErbi5taWRpX2xldHRlcl9waXRjaGVzW3JdKyhcIiNcIj09aS5zdWJzdHIoMCwxKT8xOi0xKSppLmxlbmd0aH0sZW5zdXJlTWlkaVBpdGNoOmZ1bmN0aW9uKHQpe3JldHVyblwibnVtYmVyXCIhPXR5cGVvZiB0JiYvW14wLTldLy50ZXN0KHQpP24ubWlkaVBpdGNoRnJvbU5vdGUodCk6cGFyc2VJbnQodCwxMCl9LG1pZGlfcGl0Y2hlc19sZXR0ZXI6ezEyOlwiY1wiLDEzOlwiYyNcIiwxNDpcImRcIiwxNTpcImQjXCIsMTY6XCJlXCIsMTc6XCJmXCIsMTg6XCJmI1wiLDE5OlwiZ1wiLDIwOlwiZyNcIiwyMTpcImFcIiwyMjpcImEjXCIsMjM6XCJiXCJ9LG1pZGlfZmxhdHRlbmVkX25vdGVzOntcImEjXCI6XCJiYlwiLFwiYyNcIjpcImRiXCIsXCJkI1wiOlwiZWJcIixcImYjXCI6XCJnYlwiLFwiZyNcIjpcImFiXCJ9LG5vdGVGcm9tTWlkaVBpdGNoOmZ1bmN0aW9uKHQsZSl7dmFyIHIsaT0wLGE9dCxlPWV8fCExO3JldHVybiB0PjIzJiYoaT1NYXRoLmZsb29yKHQvMTIpLTEsYT10LTEyKmkpLHI9bi5taWRpX3BpdGNoZXNfbGV0dGVyW2FdLGUmJnIuaW5kZXhPZihcIiNcIik+MCYmKHI9bi5taWRpX2ZsYXR0ZW5lZF9ub3Rlc1tyXSkscitpfSxtcHFuRnJvbUJwbTpmdW5jdGlvbih0KXt2YXIgZT1NYXRoLmZsb29yKDZlNy90KSxuPVtdO2RvIG4udW5zaGlmdCgyNTUmZSksZT4+PTg7d2hpbGUoZSk7Zm9yKDtuLmxlbmd0aDwzOyluLnB1c2goMCk7cmV0dXJuIG59LGJwbUZyb21NcHFuOmZ1bmN0aW9uKHQpe3ZhciBlPXQ7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHRbMF0pe2U9MDtmb3IodmFyIG49MCxyPXQubGVuZ3RoLTE7cj49MDsrK24sLS1yKWV8PXRbbl08PHJ9cmV0dXJuIE1hdGguZmxvb3IoNmU3L3QpfSxjb2RlczJTdHI6ZnVuY3Rpb24odCl7cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCx0KX0sc3RyMkJ5dGVzOmZ1bmN0aW9uKHQsZSl7aWYoZSlmb3IoO3QubGVuZ3RoLzI8ZTspdD1cIjBcIit0O2Zvcih2YXIgbj1bXSxyPXQubGVuZ3RoLTE7cj49MDtyLT0yKXt2YXIgaT0wPT09cj90W3JdOnRbci0xXSt0W3JdO24udW5zaGlmdChwYXJzZUludChpLDE2KSl9cmV0dXJuIG59LHRyYW5zbGF0ZVRpY2tUaW1lOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZT0xMjcmdDt0Pj49NzspZTw8PTgsZXw9MTI3JnR8MTI4O2Zvcih2YXIgbj1bXTs7KXtpZihuLnB1c2goMjU1JmUpLCEoMTI4JmUpKWJyZWFrO2U+Pj04fXJldHVybiBufX0pLHI9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXM/dm9pZCghdHx8bnVsbD09PXQudHlwZSYmdm9pZCAwPT09dC50eXBlfHxudWxsPT09dC5jaGFubmVsJiZ2b2lkIDA9PT10LmNoYW5uZWx8fG51bGw9PT10LnBhcmFtMSYmdm9pZCAwPT09dC5wYXJhbTF8fCh0aGlzLnNldFRpbWUodC50aW1lKSx0aGlzLnNldFR5cGUodC50eXBlKSx0aGlzLnNldENoYW5uZWwodC5jaGFubmVsKSx0aGlzLnNldFBhcmFtMSh0LnBhcmFtMSksdGhpcy5zZXRQYXJhbTIodC5wYXJhbTIpKSk6bmV3IHIodCl9O3IuTk9URV9PRkY9MTI4LHIuTk9URV9PTj0xNDQsci5BRlRFUl9UT1VDSD0xNjAsci5DT05UUk9MTEVSPTE3NixyLlBST0dSQU1fQ0hBTkdFPTE5MixyLkNIQU5ORUxfQUZURVJUT1VDSD0yMDgsci5QSVRDSF9CRU5EPTIyNCxyLnByb3RvdHlwZS5zZXRUaW1lPWZ1bmN0aW9uKHQpe3RoaXMudGltZT1uLnRyYW5zbGF0ZVRpY2tUaW1lKHR8fDApfSxyLnByb3RvdHlwZS5zZXRUeXBlPWZ1bmN0aW9uKHQpe2lmKHQ8ci5OT1RFX09GRnx8dD5yLlBJVENIX0JFTkQpdGhyb3cgbmV3IEVycm9yKFwiVHJ5aW5nIHRvIHNldCBhbiB1bmtub3duIGV2ZW50OiBcIit0KTt0aGlzLnR5cGU9dH0sci5wcm90b3R5cGUuc2V0Q2hhbm5lbD1mdW5jdGlvbih0KXtpZigwPnR8fHQ+MTUpdGhyb3cgbmV3IEVycm9yKFwiQ2hhbm5lbCBpcyBvdXQgb2YgYm91bmRzLlwiKTt0aGlzLmNoYW5uZWw9dH0sci5wcm90b3R5cGUuc2V0UGFyYW0xPWZ1bmN0aW9uKHQpe3RoaXMucGFyYW0xPXR9LHIucHJvdG90eXBlLnNldFBhcmFtMj1mdW5jdGlvbih0KXt0aGlzLnBhcmFtMj10fSxyLnByb3RvdHlwZS50b0J5dGVzPWZ1bmN0aW9uKCl7dmFyIHQ9W10sZT10aGlzLnR5cGV8MTUmdGhpcy5jaGFubmVsO3JldHVybiB0LnB1c2guYXBwbHkodCx0aGlzLnRpbWUpLHQucHVzaChlKSx0LnB1c2godGhpcy5wYXJhbTEpLHZvaWQgMCE9PXRoaXMucGFyYW0yJiZudWxsIT09dGhpcy5wYXJhbTImJnQucHVzaCh0aGlzLnBhcmFtMiksdH07dmFyIGk9ZnVuY3Rpb24odCl7aWYoIXRoaXMpcmV0dXJuIG5ldyBpKHQpO3RoaXMuc2V0VGltZSh0LnRpbWUpLHRoaXMuc2V0VHlwZSh0LnR5cGUpLHRoaXMuc2V0RGF0YSh0LmRhdGEpfTtpLlNFUVVFTkNFPTAsaS5URVhUPTEsaS5DT1BZUklHSFQ9MixpLlRSQUNLX05BTUU9MyxpLklOU1RSVU1FTlQ9NCxpLkxZUklDPTUsaS5NQVJLRVI9NixpLkNVRV9QT0lOVD03LGkuQ0hBTk5FTF9QUkVGSVg9MzIsaS5FTkRfT0ZfVFJBQ0s9NDcsaS5URU1QTz04MSxpLlNNUFRFPTg0LGkuVElNRV9TSUc9ODgsaS5LRVlfU0lHPTg5LGkuU0VRX0VWRU5UPTEyNyxpLnByb3RvdHlwZS5zZXRUaW1lPWZ1bmN0aW9uKHQpe3RoaXMudGltZT1uLnRyYW5zbGF0ZVRpY2tUaW1lKHR8fDApfSxpLnByb3RvdHlwZS5zZXRUeXBlPWZ1bmN0aW9uKHQpe3RoaXMudHlwZT10fSxpLnByb3RvdHlwZS5zZXREYXRhPWZ1bmN0aW9uKHQpe3RoaXMuZGF0YT10fSxpLnByb3RvdHlwZS50b0J5dGVzPWZ1bmN0aW9uKCl7aWYoIXRoaXMudHlwZSl0aHJvdyBuZXcgRXJyb3IoXCJUeXBlIGZvciBtZXRhLWV2ZW50IG5vdCBzcGVjaWZpZWQuXCIpO3ZhciB0PVtdO2lmKHQucHVzaC5hcHBseSh0LHRoaXMudGltZSksdC5wdXNoKDI1NSx0aGlzLnR5cGUpLEFycmF5LmlzQXJyYXkodGhpcy5kYXRhKSl0LnB1c2godGhpcy5kYXRhLmxlbmd0aCksdC5wdXNoLmFwcGx5KHQsdGhpcy5kYXRhKTtlbHNlIGlmKFwibnVtYmVyXCI9PXR5cGVvZiB0aGlzLmRhdGEpdC5wdXNoKDEsdGhpcy5kYXRhKTtlbHNlIGlmKG51bGwhPT10aGlzLmRhdGEmJnZvaWQgMCE9PXRoaXMuZGF0YSl7dC5wdXNoKHRoaXMuZGF0YS5sZW5ndGgpO3ZhciBlPXRoaXMuZGF0YS5zcGxpdChcIlwiKS5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIHQuY2hhckNvZGVBdCgwKX0pO3QucHVzaC5hcHBseSh0LGUpfWVsc2UgdC5wdXNoKDApO3JldHVybiB0fTt2YXIgYT1mdW5jdGlvbih0KXtpZighdGhpcylyZXR1cm4gbmV3IGEodCk7dmFyIGU9dHx8e307dGhpcy5ldmVudHM9ZS5ldmVudHN8fFtdfTthLlNUQVJUX0JZVEVTPVs3Nyw4NCwxMTQsMTA3XSxhLkVORF9CWVRFUz1bMCwyNTUsNDcsMF0sYS5wcm90b3R5cGUuYWRkRXZlbnQ9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuZXZlbnRzLnB1c2godCksdGhpc30sYS5wcm90b3R5cGUuYWRkTm90ZU9uPWEucHJvdG90eXBlLm5vdGVPbj1mdW5jdGlvbih0LGksYSxvKXtyZXR1cm4gdGhpcy5ldmVudHMucHVzaChuZXcgcih7dHlwZTpyLk5PVEVfT04sY2hhbm5lbDp0LHBhcmFtMTpuLmVuc3VyZU1pZGlQaXRjaChpKSxwYXJhbTI6b3x8ZSx0aW1lOmF8fDB9KSksdGhpc30sYS5wcm90b3R5cGUuYWRkTm90ZU9mZj1hLnByb3RvdHlwZS5ub3RlT2ZmPWZ1bmN0aW9uKHQsaSxhLG8pe3JldHVybiB0aGlzLmV2ZW50cy5wdXNoKG5ldyByKHt0eXBlOnIuTk9URV9PRkYsY2hhbm5lbDp0LHBhcmFtMTpuLmVuc3VyZU1pZGlQaXRjaChpKSxwYXJhbTI6b3x8ZSx0aW1lOmF8fDB9KSksdGhpc30sYS5wcm90b3R5cGUuYWRkTm90ZT1hLnByb3RvdHlwZS5ub3RlPWZ1bmN0aW9uKHQsZSxuLHIsaSl7cmV0dXJuIHRoaXMubm90ZU9uKHQsZSxyLGkpLG4mJnRoaXMubm90ZU9mZih0LGUsbixpKSx0aGlzfSxhLnByb3RvdHlwZS5hZGRDaG9yZD1hLnByb3RvdHlwZS5jaG9yZD1mdW5jdGlvbih0LGUsbixyKXtpZighQXJyYXkuaXNBcnJheShlKSYmIWUubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkNob3JkIG11c3QgYmUgYW4gYXJyYXkgb2YgcGl0Y2hlc1wiKTtyZXR1cm4gZS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3RoaXMubm90ZU9uKHQsZSwwLHIpfSx0aGlzKSxlLmZvckVhY2goZnVuY3Rpb24oZSxyKXswPT09cj90aGlzLm5vdGVPZmYodCxlLG4pOnRoaXMubm90ZU9mZih0LGUpfSx0aGlzKSx0aGlzfSxhLnByb3RvdHlwZS5zZXRJbnN0cnVtZW50PWEucHJvdG90eXBlLmluc3RydW1lbnQ9ZnVuY3Rpb24odCxlLG4pe3JldHVybiB0aGlzLmV2ZW50cy5wdXNoKG5ldyByKHt0eXBlOnIuUFJPR1JBTV9DSEFOR0UsY2hhbm5lbDp0LHBhcmFtMTplLHRpbWU6bnx8MH0pKSx0aGlzfSxhLnByb3RvdHlwZS5zZXRUZW1wbz1hLnByb3RvdHlwZS50ZW1wbz1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLmV2ZW50cy5wdXNoKG5ldyBpKHt0eXBlOmkuVEVNUE8sZGF0YTpuLm1wcW5Gcm9tQnBtKHQpLHRpbWU6ZXx8MH0pKSx0aGlzfSxhLnByb3RvdHlwZS50b0J5dGVzPWZ1bmN0aW9uKCl7dmFyIHQ9MCxlPVtdLHI9YS5TVEFSVF9CWVRFUyxpPWEuRU5EX0JZVEVTLG89ZnVuY3Rpb24obil7dmFyIHI9bi50b0J5dGVzKCk7dCs9ci5sZW5ndGgsZS5wdXNoLmFwcGx5KGUscil9O3RoaXMuZXZlbnRzLmZvckVhY2gobyksdCs9aS5sZW5ndGg7dmFyIHM9bi5zdHIyQnl0ZXModC50b1N0cmluZygxNiksNCk7cmV0dXJuIHIuY29uY2F0KHMsZSxpKX07dmFyIG89ZnVuY3Rpb24odCl7aWYoIXRoaXMpcmV0dXJuIG5ldyBvKHQpO3ZhciBlPXR8fHt9O2lmKGUudGlja3Mpe2lmKFwibnVtYmVyXCIhPXR5cGVvZiBlLnRpY2tzKXRocm93IG5ldyBFcnJvcihcIlRpY2tzIHBlciBiZWF0IG11c3QgYmUgYSBudW1iZXIhXCIpO2lmKGUudGlja3M8PTB8fGUudGlja3M+PTMyNzY4fHxlLnRpY2tzJTEhPT0wKXRocm93IG5ldyBFcnJvcihcIlRpY2tzIHBlciBiZWF0IG11c3QgYmUgYW4gaW50ZWdlciBiZXR3ZWVuIDEgYW5kIDMyNzY3IVwiKX10aGlzLnRpY2tzPWUudGlja3N8fDEyOCx0aGlzLnRyYWNrcz1lLnRyYWNrc3x8W119O28uSERSX0NIVU5LSUQ9XCJNVGhkXCIsby5IRFJfQ0hVTktfU0laRT1cIlxceDAwXFx4MDBcXHgwMFx1MDAwNlwiLG8uSERSX1RZUEUwPVwiXFx4MDBcXHgwMFwiLG8uSERSX1RZUEUxPVwiXFx4MDBcdTAwMDFcIixvLnByb3RvdHlwZS5hZGRUcmFjaz1mdW5jdGlvbih0KXtyZXR1cm4gdD8odGhpcy50cmFja3MucHVzaCh0KSx0aGlzKToodD1uZXcgYSx0aGlzLnRyYWNrcy5wdXNoKHQpLHQpfSxvLnByb3RvdHlwZS50b0J5dGVzPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy50cmFja3MubGVuZ3RoLnRvU3RyaW5nKDE2KSxlPW8uSERSX0NIVU5LSUQrby5IRFJfQ0hVTktfU0laRTtyZXR1cm4gZSs9cGFyc2VJbnQodCwxNik+MT9vLkhEUl9UWVBFMTpvLkhEUl9UWVBFMCxlKz1uLmNvZGVzMlN0cihuLnN0cjJCeXRlcyh0LDIpKSxlKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMudGlja3MvMjU2LHRoaXMudGlja3MlMjU2KSx0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHQpe2UrPW4uY29kZXMyU3RyKHQudG9CeXRlcygpKX0pLGV9LHQuVXRpbD1uLHQuRmlsZT1vLHQuVHJhY2s9YSx0LkV2ZW50PXIsdC5NZXRhRXZlbnQ9aX0obiksXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHQmJm51bGwhPT10P3QuZXhwb3J0cz1uOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBlJiZudWxsIT09ZT9lPW46dGhpcy5NaWRpPW59KS5jYWxsKGUsbigxMikodCkpfSxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIG4odCl7ZnVuY3Rpb24gZSh0KXt2YXIgZT10LnJlYWQoNCksbj10LnJlYWRJbnQzMigpO3JldHVybntpZDplLGxlbmd0aDpuLGRhdGE6dC5yZWFkKG4pfX1mdW5jdGlvbiBuKHQpe3ZhciBlPXt9O2UuZGVsdGFUaW1lPXQucmVhZFZhckludCgpO3ZhciBuPXQucmVhZEludDgoKTtpZigyNDA9PSgyNDAmbikpe2lmKDI1NT09bil7ZS50eXBlPVwibWV0YVwiO3ZhciByPXQucmVhZEludDgoKSxhPXQucmVhZFZhckludCgpO3N3aXRjaChyKXtjYXNlIDA6aWYoZS5zdWJ0eXBlPVwic2VxdWVuY2VOdW1iZXJcIiwyIT1hKXRocm93XCJFeHBlY3RlZCBsZW5ndGggZm9yIHNlcXVlbmNlTnVtYmVyIGV2ZW50IGlzIDIsIGdvdCBcIithO3JldHVybiBlLm51bWJlcj10LnJlYWRJbnQxNigpLGU7Y2FzZSAxOnJldHVybiBlLnN1YnR5cGU9XCJ0ZXh0XCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgMjpyZXR1cm4gZS5zdWJ0eXBlPVwiY29weXJpZ2h0Tm90aWNlXCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgMzpyZXR1cm4gZS5zdWJ0eXBlPVwidHJhY2tOYW1lXCIsZS50ZXh0PXQucmVhZChhKSxlO2Nhc2UgNDpyZXR1cm4gZS5zdWJ0eXBlPVwiaW5zdHJ1bWVudE5hbWVcIixlLnRleHQ9dC5yZWFkKGEpLGU7Y2FzZSA1OnJldHVybiBlLnN1YnR5cGU9XCJseXJpY3NcIixlLnRleHQ9dC5yZWFkKGEpLGU7Y2FzZSA2OnJldHVybiBlLnN1YnR5cGU9XCJtYXJrZXJcIixlLnRleHQ9dC5yZWFkKGEpLGU7Y2FzZSA3OnJldHVybiBlLnN1YnR5cGU9XCJjdWVQb2ludFwiLGUudGV4dD10LnJlYWQoYSksZTtjYXNlIDMyOmlmKGUuc3VidHlwZT1cIm1pZGlDaGFubmVsUHJlZml4XCIsMSE9YSl0aHJvd1wiRXhwZWN0ZWQgbGVuZ3RoIGZvciBtaWRpQ2hhbm5lbFByZWZpeCBldmVudCBpcyAxLCBnb3QgXCIrYTtyZXR1cm4gZS5jaGFubmVsPXQucmVhZEludDgoKSxlO2Nhc2UgNDc6aWYoZS5zdWJ0eXBlPVwiZW5kT2ZUcmFja1wiLDAhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3IgZW5kT2ZUcmFjayBldmVudCBpcyAwLCBnb3QgXCIrYTtyZXR1cm4gZTtjYXNlIDgxOmlmKGUuc3VidHlwZT1cInNldFRlbXBvXCIsMyE9YSl0aHJvd1wiRXhwZWN0ZWQgbGVuZ3RoIGZvciBzZXRUZW1wbyBldmVudCBpcyAzLCBnb3QgXCIrYTtyZXR1cm4gZS5taWNyb3NlY29uZHNQZXJCZWF0PSh0LnJlYWRJbnQ4KCk8PDE2KSsodC5yZWFkSW50OCgpPDw4KSt0LnJlYWRJbnQ4KCksZTtjYXNlIDg0OmlmKGUuc3VidHlwZT1cInNtcHRlT2Zmc2V0XCIsNSE9YSl0aHJvd1wiRXhwZWN0ZWQgbGVuZ3RoIGZvciBzbXB0ZU9mZnNldCBldmVudCBpcyA1LCBnb3QgXCIrYTt2YXIgbz10LnJlYWRJbnQ4KCk7cmV0dXJuIGUuZnJhbWVSYXRlPXswOjI0LDMyOjI1LDY0OjI5LDk2OjMwfVs5NiZvXSxlLmhvdXI9MzEmbyxlLm1pbj10LnJlYWRJbnQ4KCksZS5zZWM9dC5yZWFkSW50OCgpLGUuZnJhbWU9dC5yZWFkSW50OCgpLGUuc3ViZnJhbWU9dC5yZWFkSW50OCgpLGU7Y2FzZSA4ODppZihlLnN1YnR5cGU9XCJ0aW1lU2lnbmF0dXJlXCIsNCE9YSl0aHJvd1wiRXhwZWN0ZWQgbGVuZ3RoIGZvciB0aW1lU2lnbmF0dXJlIGV2ZW50IGlzIDQsIGdvdCBcIithO3JldHVybiBlLm51bWVyYXRvcj10LnJlYWRJbnQ4KCksZS5kZW5vbWluYXRvcj1NYXRoLnBvdygyLHQucmVhZEludDgoKSksZS5tZXRyb25vbWU9dC5yZWFkSW50OCgpLGUudGhpcnR5c2Vjb25kcz10LnJlYWRJbnQ4KCksZTtjYXNlIDg5OmlmKGUuc3VidHlwZT1cImtleVNpZ25hdHVyZVwiLDIhPWEpdGhyb3dcIkV4cGVjdGVkIGxlbmd0aCBmb3Iga2V5U2lnbmF0dXJlIGV2ZW50IGlzIDIsIGdvdCBcIithO3JldHVybiBlLmtleT10LnJlYWRJbnQ4KCEwKSxlLnNjYWxlPXQucmVhZEludDgoKSxlO2Nhc2UgMTI3OnJldHVybiBlLnN1YnR5cGU9XCJzZXF1ZW5jZXJTcGVjaWZpY1wiLGUuZGF0YT10LnJlYWQoYSksZTtkZWZhdWx0OnJldHVybiBlLnN1YnR5cGU9XCJ1bmtub3duXCIsZS5kYXRhPXQucmVhZChhKSxlfXJldHVybiBlLmRhdGE9dC5yZWFkKGEpLGV9aWYoMjQwPT1uKXtlLnR5cGU9XCJzeXNFeFwiO3ZhciBhPXQucmVhZFZhckludCgpO3JldHVybiBlLmRhdGE9dC5yZWFkKGEpLGV9aWYoMjQ3PT1uKXtlLnR5cGU9XCJkaXZpZGVkU3lzRXhcIjt2YXIgYT10LnJlYWRWYXJJbnQoKTtyZXR1cm4gZS5kYXRhPXQucmVhZChhKSxlfXRocm93XCJVbnJlY29nbmlzZWQgTUlESSBldmVudCB0eXBlIGJ5dGU6IFwiK259dmFyIHM7MD09KDEyOCZuKT8ocz1uLG49aSk6KHM9dC5yZWFkSW50OCgpLGk9bik7dmFyIHU9bj4+NDtzd2l0Y2goZS5jaGFubmVsPTE1Jm4sZS50eXBlPVwiY2hhbm5lbFwiLHUpe2Nhc2UgODpyZXR1cm4gZS5zdWJ0eXBlPVwibm90ZU9mZlwiLGUubm90ZU51bWJlcj1zLGUudmVsb2NpdHk9dC5yZWFkSW50OCgpLGU7Y2FzZSA5OnJldHVybiBlLm5vdGVOdW1iZXI9cyxlLnZlbG9jaXR5PXQucmVhZEludDgoKSwwPT1lLnZlbG9jaXR5P2Uuc3VidHlwZT1cIm5vdGVPZmZcIjplLnN1YnR5cGU9XCJub3RlT25cIixlO2Nhc2UgMTA6cmV0dXJuIGUuc3VidHlwZT1cIm5vdGVBZnRlcnRvdWNoXCIsZS5ub3RlTnVtYmVyPXMsZS5hbW91bnQ9dC5yZWFkSW50OCgpLGU7Y2FzZSAxMTpyZXR1cm4gZS5zdWJ0eXBlPVwiY29udHJvbGxlclwiLGUuY29udHJvbGxlclR5cGU9cyxlLnZhbHVlPXQucmVhZEludDgoKSxlO2Nhc2UgMTI6cmV0dXJuIGUuc3VidHlwZT1cInByb2dyYW1DaGFuZ2VcIixlLnByb2dyYW1OdW1iZXI9cyxlO2Nhc2UgMTM6cmV0dXJuIGUuc3VidHlwZT1cImNoYW5uZWxBZnRlcnRvdWNoXCIsZS5hbW91bnQ9cyxlO2Nhc2UgMTQ6cmV0dXJuIGUuc3VidHlwZT1cInBpdGNoQmVuZFwiLGUudmFsdWU9cysodC5yZWFkSW50OCgpPDw3KSxlO2RlZmF1bHQ6dGhyb3dcIlVucmVjb2duaXNlZCBNSURJIGV2ZW50IHR5cGU6IFwiK3V9fXZhciBpO3N0cmVhbT1yKHQpO3ZhciBhPWUoc3RyZWFtKTtpZihcIk1UaGRcIiE9YS5pZHx8NiE9YS5sZW5ndGgpdGhyb3dcIkJhZCAubWlkIGZpbGUgLSBoZWFkZXIgbm90IGZvdW5kXCI7dmFyIG89cihhLmRhdGEpLHM9by5yZWFkSW50MTYoKSx1PW8ucmVhZEludDE2KCksYz1vLnJlYWRJbnQxNigpO2lmKDMyNzY4JmMpdGhyb3dcIkV4cHJlc3NpbmcgdGltZSBkaXZpc2lvbiBpbiBTTVRQRSBmcmFtZXMgaXMgbm90IHN1cHBvcnRlZCB5ZXRcIjt0aWNrc1BlckJlYXQ9Yztmb3IodmFyIGg9e2Zvcm1hdFR5cGU6cyx0cmFja0NvdW50OnUsdGlja3NQZXJCZWF0OnRpY2tzUGVyQmVhdH0sZj1bXSxkPTA7ZDxoLnRyYWNrQ291bnQ7ZCsrKXtmW2RdPVtdO3ZhciBsPWUoc3RyZWFtKTtpZihcIk1UcmtcIiE9bC5pZCl0aHJvd1wiVW5leHBlY3RlZCBjaHVuayAtIGV4cGVjdGVkIE1UcmssIGdvdCBcIitsLmlkO2Zvcih2YXIgcD1yKGwuZGF0YSk7IXAuZW9mKCk7KXt2YXIgbT1uKHApO2ZbZF0ucHVzaChtKX19cmV0dXJue2hlYWRlcjpoLHRyYWNrczpmfX1mdW5jdGlvbiByKHQpe2Z1bmN0aW9uIGUoZSl7dmFyIG49dC5zdWJzdHIocyxlKTtyZXR1cm4gcys9ZSxufWZ1bmN0aW9uIG4oKXt2YXIgZT0odC5jaGFyQ29kZUF0KHMpPDwyNCkrKHQuY2hhckNvZGVBdChzKzEpPDwxNikrKHQuY2hhckNvZGVBdChzKzIpPDw4KSt0LmNoYXJDb2RlQXQocyszKTtyZXR1cm4gcys9NCxlfWZ1bmN0aW9uIHIoKXt2YXIgZT0odC5jaGFyQ29kZUF0KHMpPDw4KSt0LmNoYXJDb2RlQXQocysxKTtyZXR1cm4gcys9MixlfWZ1bmN0aW9uIGkoZSl7dmFyIG49dC5jaGFyQ29kZUF0KHMpO3JldHVybiBlJiZuPjEyNyYmKG4tPTI1Nikscys9MSxufWZ1bmN0aW9uIGEoKXtyZXR1cm4gcz49dC5sZW5ndGh9ZnVuY3Rpb24gbygpe2Zvcih2YXIgdD0wOzspe3ZhciBlPWkoKTtpZighKDEyOCZlKSlyZXR1cm4gdCtlO3QrPTEyNyZlLHQ8PD03fX12YXIgcz0wO3JldHVybntlb2Y6YSxyZWFkOmUscmVhZEludDMyOm4scmVhZEludDE2OnIscmVhZEludDg6aSxyZWFkVmFySW50Om99fXQuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gbih0KX19LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiB0LndlYnBhY2tQb2x5ZmlsbHx8KHQuZGVwcmVjYXRlPWZ1bmN0aW9uKCl7fSx0LnBhdGhzPVtdLHQuY2hpbGRyZW49W10sdC53ZWJwYWNrUG9seWZpbGw9MSksdH19XSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU1pZGlDb252ZXJ0LmpzLm1hcCJdfQ==
