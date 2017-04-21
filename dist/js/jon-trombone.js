(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JonTrombone = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelLoader = require("./utils/model-loader.js");

var _pinkTrombone = require("./pink-trombone/pink-trombone.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JonTrombone = function () {
    function JonTrombone(container) {
        var _this = this;

        _classCallCheck(this, JonTrombone);

        this.container = container;
        this.container.style.position = "relative";

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

        // Set up clock for timing
        this.clock = new THREE.Clock();

        //window.scene = this.scene;

        var startDelayMS = 1000;
        this.trombone = new _pinkTrombone.PinkTrombone();
        setTimeout(function () {
            _this.trombone.StartAudio();
            _this.moveJaw = true;
        }, startDelayMS);

        // Mute button for trombone
        var button = document.createElement("button");
        button.innerHTML = "Mute";
        button.style.cssText = "position: absolute; display: block; top: 0; left: 0;";
        this.container.appendChild(button);
        button.addEventListener("click", function () {
            _this.trombone.ToggleMute();
            button.innerHTML = _this.trombone.muted ? "Unmute" : "Mute";
        });

        this.jawFlapSpeed = 20.0;
        this.jawOpenOffset = 0.19;
        this.moveJaw = false;

        this.SetUpThree();
        this.SetUpScene();

        // Start the update loop
        this.OnUpdate();
    }

    _createClass(JonTrombone, [{
        key: "SetUpThree",
        value: function SetUpThree() {
            // Add orbit controls
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        }
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
    }, {
        key: "OnUpdate",
        value: function OnUpdate() {
            var deltaTime = this.clock.getDelta();
            requestAnimationFrame(this.OnUpdate.bind(this));

            if (this.jaw && this.moveJaw) {
                var time = this.clock.getElapsedTime(); // % 60;

                // Move the jaw
                var percent = (Math.sin(time * this.jawFlapSpeed) + 1.0) / 2.0;
                this.jaw.position.z = this.jawShutZ + percent * this.jawOpenOffset;

                // Make the audio match the jaw position
                this.trombone.TractUI.Buh(1.0 - percent);
            }

            // Render
            this.renderer.render(this.scene, this.camera);
        }
    }]);

    return JonTrombone;
}();

exports.JonTrombone = JonTrombone;

},{"./pink-trombone/pink-trombone.js":9,"./utils/model-loader.js":10}],2:[function(require,module,exports){
"use strict";

var _webglDetect = require("./utils/webgl-detect.js");

var _jonTrombone = require("./jon-trombone.js");

// Optionally bundle three.js as part of the project
//import THREELib from "three-js";
//var THREE = THREELib(); // return THREE JS

var container = document.getElementById("jon-trombone-container");

/**
 * Creates and attaches a GUI to the page if DAT.GUI is included.
 */
var AttachGUI = function AttachGUI() {
    if (typeof dat === "undefined") {
        console.log("No DAT.GUI instance found. Import on the page to use!");
        return;
    }

    var gui = new dat.GUI({});

    var jon = window.jonTrombone;

    gui.add(jon.trombone, 'ToggleMute');

    var jonGUI = gui.addFolder("Jon");
    jonGUI.add(jon, "moveJaw");
    jonGUI.add(jon, "jawFlapSpeed").min(0).max(100);
    jonGUI.add(jon, "jawOpenOffset").min(0).max(1);

    var voiceGUI = gui.addFolder("Voice");
    voiceGUI.add(jon.trombone, 'autoWobble');
    voiceGUI.add(jon.trombone.AudioSystem, 'useWhiteNoise');
    voiceGUI.add(jon.trombone.Glottis, 'UITenseness').min(0).max(1);
    voiceGUI.add(jon.trombone.Glottis, 'vibratoAmount').min(0).max(0.5);
    voiceGUI.add(jon.trombone.Glottis, 'UIFrequency').min(1).max(1000);
    voiceGUI.add(jon.trombone.Glottis, 'loudness').min(0).max(1);

    var tractGUI = gui.addFolder("Tract");
    tractGUI.add(jon.trombone.Tract, 'movementSpeed').min(1).max(30).step(1);
    tractGUI.add(jon.trombone.TractUI, 'target').min(0.001).max(1);
    tractGUI.add(jon.trombone.TractUI, 'index').min(0).max(43).step(1);
    tractGUI.add(jon.trombone.TractUI, 'radius').min(0).max(5).step(1);
};

if (!_webglDetect.Detector.HasWebGL()) {
    //exit("WebGL is not supported on this browser.");
    console.log("WebGL is not supported on this browser.");
    container.innerHTML = _webglDetect.Detector.GetErrorHTML();
    container.classList.add("no-webgl");
} else {
    window.jonTrombone = new _jonTrombone.JonTrombone(container);
    AttachGUI();
}

},{"./jon-trombone.js":1,"./utils/webgl-detect.js":11}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
            vibrato += this.vibratoAmount * Math.sin(2 * Math.PI * this.totalTime * this.vibratoFrequency);
            vibrato += 0.02 * _noise2.default.simplex1(this.totalTime * 4.07);
            vibrato += 0.04 * _noise2.default.simplex1(this.totalTime * 2.15);
            if (this.trombone.autoWobble) {
                vibrato += 0.2 * _noise2.default.simplex1(this.totalTime * 0.98);
                vibrato += 0.4 * _noise2.default.simplex1(this.totalTime * 0.5);
            }
            if (this.UIFrequency > this.smoothFrequency) this.smoothFrequency = Math.min(this.smoothFrequency * 1.1, this.UIFrequency);
            if (this.UIFrequency < this.smoothFrequency) this.smoothFrequency = Math.max(this.smoothFrequency / 1.1, this.UIFrequency);
            this.oldFrequency = this.newFrequency;
            this.newFrequency = this.smoothFrequency * (1 + vibrato);
            this.oldTenseness = this.newTenseness;
            this.newTenseness = this.UITenseness + 0.1 * _noise2.default.simplex1(this.totalTime * 0.46) + 0.05 * _noise2.default.simplex1(this.totalTime * 0.36);
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

},{"../noise.js":8}],5:[function(require,module,exports){
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
    }, {
        key: "Buh",
        value: function Buh(progress) {

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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./components/audio-system.js":3,"./components/glottis.js":4,"./components/tract-ui.js":5,"./components/tract.js":6,"./math-extensions.js":7}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9qb24tdHJvbWJvbmUuanMiLCJqcy9tYWluLmpzIiwianMvcGluay10cm9tYm9uZS9jb21wb25lbnRzL2F1ZGlvLXN5c3RlbS5qcyIsImpzL3BpbmstdHJvbWJvbmUvY29tcG9uZW50cy9nbG90dGlzLmpzIiwianMvcGluay10cm9tYm9uZS9jb21wb25lbnRzL3RyYWN0LXVpLmpzIiwianMvcGluay10cm9tYm9uZS9jb21wb25lbnRzL3RyYWN0LmpzIiwianMvcGluay10cm9tYm9uZS9tYXRoLWV4dGVuc2lvbnMuanMiLCJqcy9waW5rLXRyb21ib25lL25vaXNlLmpzIiwianMvcGluay10cm9tYm9uZS9waW5rLXRyb21ib25lLmpzIiwianMvdXRpbHMvbW9kZWwtbG9hZGVyLmpzIiwianMvdXRpbHMvd2ViZ2wtZGV0ZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FDQUE7O0FBQ0E7Ozs7SUFFTSxXO0FBQ0YseUJBQVksU0FBWixFQUF1QjtBQUFBOztBQUFBOztBQUNuQixhQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFDQSxhQUFLLFNBQUwsQ0FBZSxLQUFmLENBQXFCLFFBQXJCLEdBQWdDLFVBQWhDOztBQUVBO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLElBQUksTUFBTSxhQUFWLENBQXlCLEVBQUUsT0FBTyxJQUFULEVBQXpCLENBQWhCO0FBQ0EsYUFBSyxRQUFMLENBQWMsYUFBZCxDQUE0QixPQUFPLGdCQUFuQztBQUNBLGFBQUssUUFBTCxDQUFjLE9BQWQsQ0FBc0IsS0FBSyxTQUFMLENBQWUsV0FBckMsRUFBa0QsS0FBSyxTQUFMLENBQWUsWUFBakU7QUFDQSxhQUFLLFFBQUwsQ0FBYyxhQUFkLENBQTRCLFFBQTVCLEVBQXNDLENBQXRDO0FBQ0EsYUFBSyxTQUFMLENBQWUsV0FBZixDQUEyQixLQUFLLFFBQUwsQ0FBYyxVQUF6Qzs7QUFFQTtBQUNB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Q0FDa0I7QUFDZCxnQkFBSSxDQUFDLENBQUMsT0FBTyxxQkFBYixFQUFvQztBQUNoQyxvQkFBSSxTQUFTLFNBQVMsYUFBVCxDQUF1QixRQUF2QixDQUFiO0FBQUEsb0JBQ1EsUUFBUSxDQUFDLE9BQUQsRUFBVSxvQkFBVixFQUFnQyxXQUFoQyxFQUE2QyxXQUE3QyxDQURoQjtBQUFBLG9CQUVJLFVBQVUsS0FGZDs7QUFJQSxxQkFBSSxJQUFJLElBQUUsQ0FBVixFQUFZLElBQUUsQ0FBZCxFQUFnQixHQUFoQixFQUFxQjtBQUNqQix3QkFBSTtBQUNBLGtDQUFVLE9BQU8sVUFBUCxDQUFrQixNQUFNLENBQU4sQ0FBbEIsQ0FBVjtBQUNBLDRCQUFJLFdBQVcsT0FBTyxRQUFRLFlBQWYsSUFBK0IsVUFBOUMsRUFBMEQ7QUFDdEQ7QUFDQSxtQ0FBTyxJQUFQO0FBQ0g7QUFDSixxQkFORCxDQU1FLE9BQU0sQ0FBTixFQUFTLENBQUU7QUFDaEI7O0FBRUQ7QUFDQSx1QkFBTyxLQUFQO0FBQ0g7QUFDRDtBQUNBLG1CQUFPLEtBQVA7QUFDSDs7O3VDQUVrQztBQUFBLGdCQUFmLE9BQWUsdUVBQUwsSUFBSzs7QUFDL0IsZ0JBQUcsV0FBVyxJQUFkLEVBQW1CO0FBQ2Y7QUFHSDtBQUNELDZHQUVpQyxPQUZqQztBQUtIOzs7Ozs7UUFJSSxRLEdBQUEsUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBNb2RlbExvYWRlciB9IGZyb20gXCIuL3V0aWxzL21vZGVsLWxvYWRlci5qc1wiO1xuaW1wb3J0IHsgUGlua1Ryb21ib25lIH0gZnJvbSBcIi4vcGluay10cm9tYm9uZS9waW5rLXRyb21ib25lLmpzXCI7XG5cbmNsYXNzIEpvblRyb21ib25lIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuXG4gICAgICAgIC8vIFNldCB1cCByZW5kZXJlciBhbmQgZW1iZWQgaW4gY29udGFpbmVyXG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciggeyBhbHBoYTogdHJ1ZSB9ICk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh0aGlzLmNvbnRhaW5lci5vZmZzZXRXaWR0aCwgdGhpcy5jb250YWluZXIub2Zmc2V0SGVpZ2h0KTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDAwMDAwLCAwKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgICAvLyBTZXQgdXAgc2NlbmUgYW5kIHZpZXdcbiAgICAgICAgbGV0IGFzcGVjdCA9IHRoaXMuY29udGFpbmVyLm9mZnNldFdpZHRoIC8gdGhpcy5jb250YWluZXIub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSggNDUsIGFzcGVjdCwgMC4xLCAxMDAgKTtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIC8vIFNldCB1cCBjbG9jayBmb3IgdGltaW5nXG4gICAgICAgIHRoaXMuY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcblxuICAgICAgICAvL3dpbmRvdy5zY2VuZSA9IHRoaXMuc2NlbmU7XG5cbiAgICAgICAgbGV0IHN0YXJ0RGVsYXlNUyA9IDEwMDA7XG4gICAgICAgIHRoaXMudHJvbWJvbmUgPSBuZXcgUGlua1Ryb21ib25lKCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgICAgICB0aGlzLnRyb21ib25lLlN0YXJ0QXVkaW8oKTtcbiAgICAgICAgICAgIHRoaXMubW92ZUphdyA9IHRydWU7XG4gICAgICAgIH0sIHN0YXJ0RGVsYXlNUyk7XG5cbiAgICAgICAgLy8gTXV0ZSBidXR0b24gZm9yIHRyb21ib25lXG4gICAgICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICBidXR0b24uaW5uZXJIVE1MID0gXCJNdXRlXCI7XG4gICAgICAgIGJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gXCJwb3NpdGlvbjogYWJzb2x1dGU7IGRpc3BsYXk6IGJsb2NrOyB0b3A6IDA7IGxlZnQ6IDA7XCI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyIChcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudHJvbWJvbmUuVG9nZ2xlTXV0ZSgpO1xuICAgICAgICAgICAgYnV0dG9uLmlubmVySFRNTCA9IHRoaXMudHJvbWJvbmUubXV0ZWQgPyBcIlVubXV0ZVwiIDogXCJNdXRlXCI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuamF3RmxhcFNwZWVkID0gMjAuMDtcbiAgICAgICAgdGhpcy5qYXdPcGVuT2Zmc2V0ID0gMC4xOTtcbiAgICAgICAgdGhpcy5tb3ZlSmF3ID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5TZXRVcFRocmVlKCk7XG4gICAgICAgIHRoaXMuU2V0VXBTY2VuZSgpO1xuXG4gICAgICAgIC8vIFN0YXJ0IHRoZSB1cGRhdGUgbG9vcFxuICAgICAgICB0aGlzLk9uVXBkYXRlKCk7XG4gICAgfVxuXG4gICAgU2V0VXBUaHJlZSgpIHtcbiAgICAgICAgLy8gQWRkIG9yYml0IGNvbnRyb2xzXG4gICAgICAgIHRoaXMuY29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyggdGhpcy5jYW1lcmEsIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCApO1xuICAgICAgICB0aGlzLmNvbnRyb2xzLnRhcmdldC5zZXQoIDAsIDAsIDAgKTtcbiAgICAgICAgdGhpcy5jb250cm9scy51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBTZXRVcFNjZW5lKCkge1xuXG4gICAgICAgIC8vIFNldCBjYW1lcmEgcG9zaXRpb25cbiAgICAgICAgdGhpcy5jYW1lcmEucG9zaXRpb24uc2V0KCAwLCAwLCAwLjUgKTtcblxuICAgICAgICAvLyBMaWdodHNcbiAgICAgICAgbGV0IGxpZ2h0MSA9IG5ldyBUSFJFRS5IZW1pc3BoZXJlTGlnaHQoMHhmZmZmZmYsIDB4NDQ0NDQ0LCAxLjApO1xuICAgICAgICBsaWdodDEubmFtZSA9IFwiSGVtaXNwaGVyZSBMaWdodFwiO1xuICAgICAgICBsaWdodDEucG9zaXRpb24uc2V0KDAsIDEsIDApO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChsaWdodDEpO1xuXG4gICAgICAgIGxldCBsaWdodDIgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMS4wKTtcbiAgICAgICAgbGlnaHQyLm5hbWUgPSBcIkRpcmVjdGlvbmFsIExpZ2h0XCI7XG4gICAgICAgIGxpZ2h0Mi5wb3NpdGlvbi5zZXQoMCwgMSwgMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGxpZ2h0Mik7XG5cbiAgICAgICAgLy8gTG9hZCB0aGUgSm9uIG1vZGVsIGFuZCBwbGFjZSBpdCBpbiB0aGUgc2NlbmVcbiAgICAgICAgTW9kZWxMb2FkZXIuTG9hZEpTT04oXCIuLi9yZXNvdXJjZXMvam9uL3RocmVlL2pvbi5qc29uXCIsIChvYmplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuam9uID0gb2JqZWN0O1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoIHRoaXMuam9uICk7XG4gICAgICAgICAgICB0aGlzLmpvbi5yb3RhdGlvbi55ID0gKFRIUkVFLk1hdGguZGVnVG9SYWQoMTUpKTtcblxuICAgICAgICAgICAgdGhpcy5qYXcgPSB0aGlzLmpvbi5za2VsZXRvbi5ib25lcy5maW5kKChvYmopID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqLm5hbWUgPT0gXCJCb25lLjAwNlwiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZih0aGlzLmphdyl7XG4gICAgICAgICAgICAgICAgdGhpcy5qYXdTaHV0WiA9IHRoaXMuamF3LnBvc2l0aW9uLno7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICB9XG5cbiAgICBPblVwZGF0ZSgpIHtcbiAgICAgICAgbGV0IGRlbHRhVGltZSA9IHRoaXMuY2xvY2suZ2V0RGVsdGEoKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB0aGlzLk9uVXBkYXRlLmJpbmQodGhpcykgKTtcblxuICAgICAgICBpZih0aGlzLmphdyAmJiB0aGlzLm1vdmVKYXcpe1xuICAgICAgICAgICAgbGV0IHRpbWUgPSB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7Ly8gJSA2MDtcblxuICAgICAgICAgICAgLy8gTW92ZSB0aGUgamF3XG4gICAgICAgICAgICBsZXQgcGVyY2VudCA9IChNYXRoLnNpbih0aW1lICogdGhpcy5qYXdGbGFwU3BlZWQpICsgMS4wKSAvIDIuMDtcbiAgICAgICAgICAgIHRoaXMuamF3LnBvc2l0aW9uLnogPSB0aGlzLmphd1NodXRaICsgKHBlcmNlbnQgKiB0aGlzLmphd09wZW5PZmZzZXQpO1xuXG4gICAgICAgICAgICAvLyBNYWtlIHRoZSBhdWRpbyBtYXRjaCB0aGUgamF3IHBvc2l0aW9uXG4gICAgICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0VUkuQnVoKDEuMCAtIHBlcmNlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVuZGVyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgSm9uVHJvbWJvbmUgfTsiLCJpbXBvcnQgeyBEZXRlY3RvciB9IGZyb20gXCIuL3V0aWxzL3dlYmdsLWRldGVjdC5qc1wiO1xuaW1wb3J0IHsgSm9uVHJvbWJvbmUgfSBmcm9tIFwiLi9qb24tdHJvbWJvbmUuanNcIjtcblxuLy8gT3B0aW9uYWxseSBidW5kbGUgdGhyZWUuanMgYXMgcGFydCBvZiB0aGUgcHJvamVjdFxuLy9pbXBvcnQgVEhSRUVMaWIgZnJvbSBcInRocmVlLWpzXCI7XG4vL3ZhciBUSFJFRSA9IFRIUkVFTGliKCk7IC8vIHJldHVybiBUSFJFRSBKU1xuXG5sZXQgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb24tdHJvbWJvbmUtY29udGFpbmVyXCIpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW5kIGF0dGFjaGVzIGEgR1VJIHRvIHRoZSBwYWdlIGlmIERBVC5HVUkgaXMgaW5jbHVkZWQuXG4gKi9cbnZhciBBdHRhY2hHVUkgPSBmdW5jdGlvbigpe1xuICAgIGlmKHR5cGVvZihkYXQpID09PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJObyBEQVQuR1VJIGluc3RhbmNlIGZvdW5kLiBJbXBvcnQgb24gdGhlIHBhZ2UgdG8gdXNlIVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBndWkgPSBuZXcgZGF0LkdVSSh7XG4gICAgfSk7XG5cbiAgICB2YXIgam9uID0gd2luZG93LmpvblRyb21ib25lO1xuXG4gICAgZ3VpLmFkZChqb24udHJvbWJvbmUsICdUb2dnbGVNdXRlJyk7XG5cbiAgICB2YXIgam9uR1VJID0gZ3VpLmFkZEZvbGRlcihcIkpvblwiKTtcbiAgICBqb25HVUkuYWRkKGpvbiwgXCJtb3ZlSmF3XCIpXG4gICAgam9uR1VJLmFkZChqb24sIFwiamF3RmxhcFNwZWVkXCIpLm1pbigwKS5tYXgoMTAwKTtcbiAgICBqb25HVUkuYWRkKGpvbiwgXCJqYXdPcGVuT2Zmc2V0XCIpLm1pbigwKS5tYXgoMSk7XG5cbiAgICB2YXIgdm9pY2VHVUkgPSBndWkuYWRkRm9sZGVyKFwiVm9pY2VcIik7XG4gICAgdm9pY2VHVUkuYWRkKGpvbi50cm9tYm9uZSwgJ2F1dG9Xb2JibGUnKTtcbiAgICB2b2ljZUdVSS5hZGQoam9uLnRyb21ib25lLkF1ZGlvU3lzdGVtLCAndXNlV2hpdGVOb2lzZScpO1xuICAgIHZvaWNlR1VJLmFkZChqb24udHJvbWJvbmUuR2xvdHRpcywgJ1VJVGVuc2VuZXNzJykubWluKDApLm1heCgxKTtcbiAgICB2b2ljZUdVSS5hZGQoam9uLnRyb21ib25lLkdsb3R0aXMsICd2aWJyYXRvQW1vdW50JykubWluKDApLm1heCgwLjUpO1xuICAgIHZvaWNlR1VJLmFkZChqb24udHJvbWJvbmUuR2xvdHRpcywgJ1VJRnJlcXVlbmN5JykubWluKDEpLm1heCgxMDAwKTtcbiAgICB2b2ljZUdVSS5hZGQoam9uLnRyb21ib25lLkdsb3R0aXMsICdsb3VkbmVzcycpLm1pbigwKS5tYXgoMSk7XG5cbiAgICB2YXIgdHJhY3RHVUkgPSBndWkuYWRkRm9sZGVyKFwiVHJhY3RcIik7XG4gICAgdHJhY3RHVUkuYWRkKGpvbi50cm9tYm9uZS5UcmFjdCwgJ21vdmVtZW50U3BlZWQnKS5taW4oMSkubWF4KDMwKS5zdGVwKDEpO1xuICAgIHRyYWN0R1VJLmFkZChqb24udHJvbWJvbmUuVHJhY3RVSSwgJ3RhcmdldCcpLm1pbigwLjAwMSkubWF4KDEpO1xuICAgIHRyYWN0R1VJLmFkZChqb24udHJvbWJvbmUuVHJhY3RVSSwgJ2luZGV4JykubWluKDApLm1heCg0Mykuc3RlcCgxKTtcbiAgICB0cmFjdEdVSS5hZGQoam9uLnRyb21ib25lLlRyYWN0VUksICdyYWRpdXMnKS5taW4oMCkubWF4KDUpLnN0ZXAoMSk7XG59XG5cbmlmICggIURldGVjdG9yLkhhc1dlYkdMKCkgKSB7XG4gICAgLy9leGl0KFwiV2ViR0wgaXMgbm90IHN1cHBvcnRlZCBvbiB0aGlzIGJyb3dzZXIuXCIpO1xuICAgIGNvbnNvbGUubG9nKFwiV2ViR0wgaXMgbm90IHN1cHBvcnRlZCBvbiB0aGlzIGJyb3dzZXIuXCIpO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBEZXRlY3Rvci5HZXRFcnJvckhUTUwoKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm5vLXdlYmdsXCIpO1xufVxuZWxzZXtcbiAgICB3aW5kb3cuam9uVHJvbWJvbmUgPSBuZXcgSm9uVHJvbWJvbmUoY29udGFpbmVyKTtcbiAgICBBdHRhY2hHVUkoKTtcbn0iLCJjbGFzcyBBdWRpb1N5c3RlbSB7ICBcblxuICAgIGNvbnN0cnVjdG9yKHRyb21ib25lKSB7XG4gICAgICAgIHRoaXMudHJvbWJvbmUgPSB0cm9tYm9uZTtcblxuICAgICAgICB0aGlzLmJsb2NrTGVuZ3RoID0gNTEyO1xuICAgICAgICB0aGlzLmJsb2NrVGltZSA9IDE7XG4gICAgICAgIHRoaXMuc291bmRPbiA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMudXNlV2hpdGVOb2lzZSA9IHRydWU7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgd2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHR8fHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gICAgICAgIHRoaXMuYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTsgICAgICBcbiAgICAgICAgdGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlID0gdGhpcy5hdWRpb0NvbnRleHQuc2FtcGxlUmF0ZTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYmxvY2tUaW1lID0gdGhpcy5ibG9ja0xlbmd0aC90aGlzLnRyb21ib25lLnNhbXBsZVJhdGU7XG4gICAgfVxuICAgIFxuICAgIHN0YXJ0U291bmQoKSB7XG4gICAgICAgIC8vc2NyaXB0UHJvY2Vzc29yIG1heSBuZWVkIGEgZHVtbXkgaW5wdXQgY2hhbm5lbCBvbiBpT1NcbiAgICAgICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IodGhpcy5ibG9ja0xlbmd0aCwgMiwgMSk7XG4gICAgICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pOyBcbiAgICAgICAgdGhpcy5zY3JpcHRQcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSB0aGlzLmRvU2NyaXB0UHJvY2Vzc29yLmJpbmQodGhpcyk7XG4gICAgXG4gICAgICAgIHZhciB3aGl0ZU5vaXNlID0gdGhpcy5jcmVhdGVXaGl0ZU5vaXNlTm9kZSgyICogdGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlKTsgLy8gMiBzZWNvbmRzIG9mIG5vaXNlXG4gICAgICAgIFxuICAgICAgICB2YXIgYXNwaXJhdGVGaWx0ZXIgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICAgICAgYXNwaXJhdGVGaWx0ZXIudHlwZSA9IFwiYmFuZHBhc3NcIjtcbiAgICAgICAgYXNwaXJhdGVGaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gNTAwO1xuICAgICAgICBhc3BpcmF0ZUZpbHRlci5RLnZhbHVlID0gMC41O1xuICAgICAgICB3aGl0ZU5vaXNlLmNvbm5lY3QoYXNwaXJhdGVGaWx0ZXIpO1xuICAgICAgICBhc3BpcmF0ZUZpbHRlci5jb25uZWN0KHRoaXMuc2NyaXB0UHJvY2Vzc29yKTsgIFxuICAgICAgICBcbiAgICAgICAgdmFyIGZyaWNhdGl2ZUZpbHRlciA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICAgICAgICBmcmljYXRpdmVGaWx0ZXIudHlwZSA9IFwiYmFuZHBhc3NcIjtcbiAgICAgICAgZnJpY2F0aXZlRmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IDEwMDA7XG4gICAgICAgIGZyaWNhdGl2ZUZpbHRlci5RLnZhbHVlID0gMC41O1xuICAgICAgICB3aGl0ZU5vaXNlLmNvbm5lY3QoZnJpY2F0aXZlRmlsdGVyKTtcbiAgICAgICAgZnJpY2F0aXZlRmlsdGVyLmNvbm5lY3QodGhpcy5zY3JpcHRQcm9jZXNzb3IpOyAgICAgICAgXG4gICAgICAgIFxuICAgICAgICB3aGl0ZU5vaXNlLnN0YXJ0KDApO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIHdoaXRlIG5vaXNlICh0ZXN0KVxuICAgICAgICAvLyB2YXIgd24gPSB0aGlzLmNyZWF0ZVdoaXRlTm9pc2VOb2RlKDIqdGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlKTtcbiAgICAgICAgLy8gd24uY29ubmVjdCh0aGlzLmF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgICAgIC8vIHduLnN0YXJ0KDApO1xuICAgIH1cbiAgICBcbiAgICBjcmVhdGVXaGl0ZU5vaXNlTm9kZShmcmFtZUNvdW50KSB7XG4gICAgICAgIHZhciBteUFycmF5QnVmZmVyID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIGZyYW1lQ291bnQsIHRoaXMudHJvbWJvbmUuc2FtcGxlUmF0ZSk7XG5cbiAgICAgICAgdmFyIG5vd0J1ZmZlcmluZyA9IG15QXJyYXlCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZnJhbWVDb3VudDsgaSsrKSBcbiAgICAgICAge1xuICAgICAgICAgICAgbm93QnVmZmVyaW5nW2ldID0gdGhpcy51c2VXaGl0ZU5vaXNlID8gTWF0aC5yYW5kb20oKSA6IDEuMDsvLyBnYXVzc2lhbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICBzb3VyY2UuYnVmZmVyID0gbXlBcnJheUJ1ZmZlcjtcbiAgICAgICAgc291cmNlLmxvb3AgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgfVxuICAgIFxuICAgIFxuICAgIGRvU2NyaXB0UHJvY2Vzc29yKGV2ZW50KSB7XG4gICAgICAgIHZhciBpbnB1dEFycmF5MSA9IGV2ZW50LmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgICAgICB2YXIgaW5wdXRBcnJheTIgPSBldmVudC5pbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSgxKTtcbiAgICAgICAgdmFyIG91dEFycmF5ID0gZXZlbnQub3V0cHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgICAgICBmb3IgKHZhciBqID0gMCwgTiA9IG91dEFycmF5Lmxlbmd0aDsgaiA8IE47IGorKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxhbWJkYTEgPSBqL047XG4gICAgICAgICAgICB2YXIgbGFtYmRhMiA9IChqKzAuNSkvTjtcbiAgICAgICAgICAgIHZhciBnbG90dGFsT3V0cHV0ID0gdGhpcy50cm9tYm9uZS5HbG90dGlzLnJ1blN0ZXAobGFtYmRhMSwgaW5wdXRBcnJheTFbal0pOyBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHZvY2FsT3V0cHV0ID0gMDtcbiAgICAgICAgICAgIC8vVHJhY3QgcnVucyBhdCB0d2ljZSB0aGUgc2FtcGxlIHJhdGUgXG4gICAgICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0LnJ1blN0ZXAoZ2xvdHRhbE91dHB1dCwgaW5wdXRBcnJheTJbal0sIGxhbWJkYTEpO1xuICAgICAgICAgICAgdm9jYWxPdXRwdXQgKz0gdGhpcy50cm9tYm9uZS5UcmFjdC5saXBPdXRwdXQgKyB0aGlzLnRyb21ib25lLlRyYWN0Lm5vc2VPdXRwdXQ7XG4gICAgICAgICAgICB0aGlzLnRyb21ib25lLlRyYWN0LnJ1blN0ZXAoZ2xvdHRhbE91dHB1dCwgaW5wdXRBcnJheTJbal0sIGxhbWJkYTIpO1xuICAgICAgICAgICAgdm9jYWxPdXRwdXQgKz0gdGhpcy50cm9tYm9uZS5UcmFjdC5saXBPdXRwdXQgKyB0aGlzLnRyb21ib25lLlRyYWN0Lm5vc2VPdXRwdXQ7XG4gICAgICAgICAgICBvdXRBcnJheVtqXSA9IHZvY2FsT3V0cHV0ICogMC4xMjU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cm9tYm9uZS5HbG90dGlzLmZpbmlzaEJsb2NrKCk7XG4gICAgICAgIHRoaXMudHJvbWJvbmUuVHJhY3QuZmluaXNoQmxvY2soKTtcbiAgICB9XG4gICAgXG4gICAgbXV0ZSgpIHtcbiAgICAgICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgICBcbiAgICB1bm11dGUoKSB7XG4gICAgICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pOyBcbiAgICB9XG4gICAgXG59XG5cbmV4cG9ydHMuQXVkaW9TeXN0ZW0gPSBBdWRpb1N5c3RlbTsiLCJpbXBvcnQgbm9pc2UgZnJvbSBcIi4uL25vaXNlLmpzXCI7XG5cbmNsYXNzIEdsb3R0aXMge1xuXG4gICAgY29uc3RydWN0b3IodHJvbWJvbmUpIHtcbiAgICAgICAgdGhpcy50cm9tYm9uZSA9IHRyb21ib25lO1xuXG4gICAgICAgIHRoaXMudGltZUluV2F2ZWZvcm0gPSAwO1xuICAgICAgICB0aGlzLm9sZEZyZXF1ZW5jeSA9IDE0MDtcbiAgICAgICAgdGhpcy5uZXdGcmVxdWVuY3kgPSAxNDA7XG4gICAgICAgIHRoaXMuVUlGcmVxdWVuY3kgPSAxNDA7XG4gICAgICAgIHRoaXMuc21vb3RoRnJlcXVlbmN5ID0gMTQwO1xuICAgICAgICB0aGlzLm9sZFRlbnNlbmVzcyA9IDAuNjtcbiAgICAgICAgdGhpcy5uZXdUZW5zZW5lc3MgPSAwLjY7XG4gICAgICAgIHRoaXMuVUlUZW5zZW5lc3MgPSAwLjY7XG4gICAgICAgIHRoaXMudG90YWxUaW1lID0gMDtcbiAgICAgICAgdGhpcy52aWJyYXRvQW1vdW50ID0gMC4wMDU7XG4gICAgICAgIHRoaXMudmlicmF0b0ZyZXF1ZW5jeSA9IDY7XG4gICAgICAgIHRoaXMuaW50ZW5zaXR5ID0gMDtcbiAgICAgICAgdGhpcy5sb3VkbmVzcyA9IDE7XG4gICAgICAgIHRoaXMuaXNUb3VjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudG91Y2ggPSAwO1xuICAgICAgICB0aGlzLnggPSAyNDA7XG4gICAgICAgIHRoaXMueSA9IDUzMDtcblxuICAgICAgICB0aGlzLmtleWJvYXJkVG9wID0gNTAwO1xuICAgICAgICB0aGlzLmtleWJvYXJkTGVmdCA9IDA7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRXaWR0aCA9IDYwMDtcbiAgICAgICAgdGhpcy5rZXlib2FyZEhlaWdodCA9IDEwMDtcbiAgICAgICAgdGhpcy5zZW1pdG9uZXMgPSAyMDtcbiAgICAgICAgdGhpcy5tYXJrcyA9IFswLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwXTtcbiAgICAgICAgdGhpcy5iYXNlTm90ZSA9IDg3LjMwNzE7IC8vRlxuXG4gICAgICAgIHRoaXMub3V0cHV0O1xuXG4gICAgfVxuICAgIFxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuc2V0dXBXYXZlZm9ybSgwKTtcbiAgICB9XG4gICAgXG4gICAgaGFuZGxlVG91Y2hlcygpIHtcbiAgICAgICAgaWYgKHRoaXMudG91Y2ggIT0gMCAmJiAhdGhpcy50b3VjaC5hbGl2ZSkgdGhpcy50b3VjaCA9IDA7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy50b3VjaCA9PSAwKVxuICAgICAgICB7ICAgICAgICBcbiAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajxVSS50b3VjaGVzV2l0aE1vdXNlLmxlbmd0aDsgaisrKSAgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHRvdWNoID0gVUkudG91Y2hlc1dpdGhNb3VzZVtqXTtcbiAgICAgICAgICAgICAgICBpZiAoIXRvdWNoLmFsaXZlKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAodG91Y2gueTx0aGlzLmtleWJvYXJkVG9wKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdWNoID0gdG91Y2g7XG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy50b3VjaCAhPSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbG9jYWxfeSA9IHRoaXMudG91Y2gueSAtICB0aGlzLmtleWJvYXJkVG9wLTEwO1xuICAgICAgICAgICAgdmFyIGxvY2FsX3ggPSB0aGlzLnRvdWNoLnggLSB0aGlzLmtleWJvYXJkTGVmdDtcbiAgICAgICAgICAgIGxvY2FsX3kgPSBNYXRoLmNsYW1wKGxvY2FsX3ksIDAsIHRoaXMua2V5Ym9hcmRIZWlnaHQtMjYpO1xuICAgICAgICAgICAgdmFyIHNlbWl0b25lID0gdGhpcy5zZW1pdG9uZXMgKiBsb2NhbF94IC8gdGhpcy5rZXlib2FyZFdpZHRoICsgMC41O1xuICAgICAgICAgICAgR2xvdHRpcy5VSUZyZXF1ZW5jeSA9IHRoaXMuYmFzZU5vdGUgKiBNYXRoLnBvdygyLCBzZW1pdG9uZS8xMik7XG4gICAgICAgICAgICBpZiAoR2xvdHRpcy5pbnRlbnNpdHkgPT0gMCkgR2xvdHRpcy5zbW9vdGhGcmVxdWVuY3kgPSBHbG90dGlzLlVJRnJlcXVlbmN5O1xuICAgICAgICAgICAgLy9HbG90dGlzLlVJUmQgPSAzKmxvY2FsX3kgLyAodGhpcy5rZXlib2FyZEhlaWdodC0yMCk7XG4gICAgICAgICAgICB2YXIgdCA9IE1hdGguY2xhbXAoMS1sb2NhbF95IC8gKHRoaXMua2V5Ym9hcmRIZWlnaHQtMjgpLCAwLCAxKTtcbiAgICAgICAgICAgIEdsb3R0aXMuVUlUZW5zZW5lc3MgPSAxLU1hdGguY29zKHQqTWF0aC5QSSowLjUpO1xuICAgICAgICAgICAgR2xvdHRpcy5sb3VkbmVzcyA9IE1hdGgucG93KEdsb3R0aXMuVUlUZW5zZW5lc3MsIDAuMjUpO1xuICAgICAgICAgICAgdGhpcy54ID0gdGhpcy50b3VjaC54O1xuICAgICAgICAgICAgdGhpcy55ID0gbG9jYWxfeSArIHRoaXMua2V5Ym9hcmRUb3ArMTA7XG4gICAgICAgIH1cbiAgICAgICAgR2xvdHRpcy5pc1RvdWNoZWQgPSAodGhpcy50b3VjaCAhPSAwKTtcbiAgICB9XG4gICAgICAgIFxuICAgIHJ1blN0ZXAobGFtYmRhLCBub2lzZVNvdXJjZSkge1xuICAgICAgICB2YXIgdGltZVN0ZXAgPSAxLjAgLyB0aGlzLnRyb21ib25lLnNhbXBsZVJhdGU7XG4gICAgICAgIHRoaXMudGltZUluV2F2ZWZvcm0gKz0gdGltZVN0ZXA7XG4gICAgICAgIHRoaXMudG90YWxUaW1lICs9IHRpbWVTdGVwO1xuICAgICAgICBpZiAodGhpcy50aW1lSW5XYXZlZm9ybSA+IHRoaXMud2F2ZWZvcm1MZW5ndGgpIFxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnRpbWVJbldhdmVmb3JtIC09IHRoaXMud2F2ZWZvcm1MZW5ndGg7XG4gICAgICAgICAgICB0aGlzLnNldHVwV2F2ZWZvcm0obGFtYmRhKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3V0ID0gdGhpcy5ub3JtYWxpemVkTEZXYXZlZm9ybSh0aGlzLnRpbWVJbldhdmVmb3JtL3RoaXMud2F2ZWZvcm1MZW5ndGgpO1xuICAgICAgICB2YXIgYXNwaXJhdGlvbiA9IHRoaXMuaW50ZW5zaXR5KigxLjAtTWF0aC5zcXJ0KHRoaXMuVUlUZW5zZW5lc3MpKSp0aGlzLmdldE5vaXNlTW9kdWxhdG9yKCkqbm9pc2VTb3VyY2U7XG4gICAgICAgIGFzcGlyYXRpb24gKj0gMC4yICsgMC4wMiAqIG5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lICogMS45OSk7XG4gICAgICAgIG91dCArPSBhc3BpcmF0aW9uO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBcbiAgICBnZXROb2lzZU1vZHVsYXRvcigpIHtcbiAgICAgICAgdmFyIHZvaWNlZCA9IDAuMSswLjIqTWF0aC5tYXgoMCxNYXRoLnNpbihNYXRoLlBJKjIqdGhpcy50aW1lSW5XYXZlZm9ybS90aGlzLndhdmVmb3JtTGVuZ3RoKSk7XG4gICAgICAgIC8vcmV0dXJuIDAuMztcbiAgICAgICAgcmV0dXJuIHRoaXMuVUlUZW5zZW5lc3MqIHRoaXMuaW50ZW5zaXR5ICogdm9pY2VkICsgKDEtdGhpcy5VSVRlbnNlbmVzcyogdGhpcy5pbnRlbnNpdHkgKSAqIDAuMztcbiAgICB9XG4gICAgXG4gICAgZmluaXNoQmxvY2soKSB7XG4gICAgICAgIHZhciB2aWJyYXRvID0gMDtcbiAgICAgICAgdmlicmF0byArPSB0aGlzLnZpYnJhdG9BbW91bnQgKiBNYXRoLnNpbigyKk1hdGguUEkgKiB0aGlzLnRvdGFsVGltZSAqdGhpcy52aWJyYXRvRnJlcXVlbmN5KTsgICAgICAgICAgXG4gICAgICAgIHZpYnJhdG8gKz0gMC4wMiAqIG5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lICogNC4wNyk7XG4gICAgICAgIHZpYnJhdG8gKz0gMC4wNCAqIG5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lICogMi4xNSk7XG4gICAgICAgIGlmICh0aGlzLnRyb21ib25lLmF1dG9Xb2JibGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZpYnJhdG8gKz0gMC4yICogbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUgKiAwLjk4KTtcbiAgICAgICAgICAgIHZpYnJhdG8gKz0gMC40ICogbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUgKiAwLjUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLlVJRnJlcXVlbmN5PnRoaXMuc21vb3RoRnJlcXVlbmN5KSBcbiAgICAgICAgICAgIHRoaXMuc21vb3RoRnJlcXVlbmN5ID0gTWF0aC5taW4odGhpcy5zbW9vdGhGcmVxdWVuY3kgKiAxLjEsIHRoaXMuVUlGcmVxdWVuY3kpO1xuICAgICAgICBpZiAodGhpcy5VSUZyZXF1ZW5jeTx0aGlzLnNtb290aEZyZXF1ZW5jeSkgXG4gICAgICAgICAgICB0aGlzLnNtb290aEZyZXF1ZW5jeSA9IE1hdGgubWF4KHRoaXMuc21vb3RoRnJlcXVlbmN5IC8gMS4xLCB0aGlzLlVJRnJlcXVlbmN5KTtcbiAgICAgICAgdGhpcy5vbGRGcmVxdWVuY3kgPSB0aGlzLm5ld0ZyZXF1ZW5jeTtcbiAgICAgICAgdGhpcy5uZXdGcmVxdWVuY3kgPSB0aGlzLnNtb290aEZyZXF1ZW5jeSAqICgxK3ZpYnJhdG8pO1xuICAgICAgICB0aGlzLm9sZFRlbnNlbmVzcyA9IHRoaXMubmV3VGVuc2VuZXNzO1xuICAgICAgICB0aGlzLm5ld1RlbnNlbmVzcyA9IHRoaXMuVUlUZW5zZW5lc3NcbiAgICAgICAgICAgICsgMC4xKm5vaXNlLnNpbXBsZXgxKHRoaXMudG90YWxUaW1lKjAuNDYpKzAuMDUqbm9pc2Uuc2ltcGxleDEodGhpcy50b3RhbFRpbWUqMC4zNik7XG4gICAgICAgIGlmICghdGhpcy5pc1RvdWNoZWQgJiYgdGhpcy50cm9tYm9uZS5hbHdheXNWb2ljZSkgdGhpcy5uZXdUZW5zZW5lc3MgKz0gKDMtdGhpcy5VSVRlbnNlbmVzcykqKDEtdGhpcy5pbnRlbnNpdHkpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuaXNUb3VjaGVkIHx8IHRoaXMudHJvbWJvbmUuYWx3YXlzVm9pY2Upe1xuICAgICAgICAgICAgdGhpcy5pbnRlbnNpdHkgKz0gMC4xMztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludGVuc2l0eSA9IE1hdGguY2xhbXAodGhpcy5pbnRlbnNpdHksIDAsIDEpO1xuICAgIH1cbiAgICBcbiAgICBzZXR1cFdhdmVmb3JtKGxhbWJkYSkge1xuICAgICAgICB0aGlzLmZyZXF1ZW5jeSA9IHRoaXMub2xkRnJlcXVlbmN5KigxLWxhbWJkYSkgKyB0aGlzLm5ld0ZyZXF1ZW5jeSpsYW1iZGE7XG4gICAgICAgIHZhciB0ZW5zZW5lc3MgPSB0aGlzLm9sZFRlbnNlbmVzcyooMS1sYW1iZGEpICsgdGhpcy5uZXdUZW5zZW5lc3MqbGFtYmRhO1xuICAgICAgICB0aGlzLlJkID0gMyooMS10ZW5zZW5lc3MpO1xuICAgICAgICB0aGlzLndhdmVmb3JtTGVuZ3RoID0gMS4wL3RoaXMuZnJlcXVlbmN5O1xuICAgICAgICBcbiAgICAgICAgdmFyIFJkID0gdGhpcy5SZDtcbiAgICAgICAgaWYgKFJkPDAuNSkgUmQgPSAwLjU7XG4gICAgICAgIGlmIChSZD4yLjcpIFJkID0gMi43O1xuICAgICAgICAvLyBub3JtYWxpemVkIHRvIHRpbWUgPSAxLCBFZSA9IDFcbiAgICAgICAgdmFyIFJhID0gLTAuMDEgKyAwLjA0OCpSZDtcbiAgICAgICAgdmFyIFJrID0gMC4yMjQgKyAwLjExOCpSZDtcbiAgICAgICAgdmFyIFJnID0gKFJrLzQpKigwLjUrMS4yKlJrKS8oMC4xMSpSZC1SYSooMC41KzEuMipSaykpO1xuICAgICAgICBcbiAgICAgICAgdmFyIFRhID0gUmE7XG4gICAgICAgIHZhciBUcCA9IDEgLyAoMipSZyk7XG4gICAgICAgIHZhciBUZSA9IFRwICsgVHAqUms7IC8vXG4gICAgICAgIFxuICAgICAgICB2YXIgZXBzaWxvbiA9IDEvVGE7XG4gICAgICAgIHZhciBzaGlmdCA9IE1hdGguZXhwKC1lcHNpbG9uICogKDEtVGUpKTtcbiAgICAgICAgdmFyIERlbHRhID0gMSAtIHNoaWZ0OyAvL2RpdmlkZSBieSB0aGlzIHRvIHNjYWxlIFJIU1xuICAgICAgICAgICBcbiAgICAgICAgdmFyIFJIU0ludGVncmFsID0gKDEvZXBzaWxvbikqKHNoaWZ0IC0gMSkgKyAoMS1UZSkqc2hpZnQ7XG4gICAgICAgIFJIU0ludGVncmFsID0gUkhTSW50ZWdyYWwvRGVsdGE7XG4gICAgICAgIFxuICAgICAgICB2YXIgdG90YWxMb3dlckludGVncmFsID0gLSAoVGUtVHApLzIgKyBSSFNJbnRlZ3JhbDtcbiAgICAgICAgdmFyIHRvdGFsVXBwZXJJbnRlZ3JhbCA9IC10b3RhbExvd2VySW50ZWdyYWw7XG4gICAgICAgIFxuICAgICAgICB2YXIgb21lZ2EgPSBNYXRoLlBJL1RwO1xuICAgICAgICB2YXIgcyA9IE1hdGguc2luKG9tZWdhKlRlKTtcbiAgICAgICAgdmFyIHkgPSAtTWF0aC5QSSpzKnRvdGFsVXBwZXJJbnRlZ3JhbCAvIChUcCoyKTtcbiAgICAgICAgdmFyIHogPSBNYXRoLmxvZyh5KTtcbiAgICAgICAgdmFyIGFscGhhID0gei8oVHAvMiAtIFRlKTtcbiAgICAgICAgdmFyIEUwID0gLTEgLyAocypNYXRoLmV4cChhbHBoYSpUZSkpO1xuICAgICAgICB0aGlzLmFscGhhID0gYWxwaGE7XG4gICAgICAgIHRoaXMuRTAgPSBFMDtcbiAgICAgICAgdGhpcy5lcHNpbG9uID0gZXBzaWxvbjtcbiAgICAgICAgdGhpcy5zaGlmdCA9IHNoaWZ0O1xuICAgICAgICB0aGlzLkRlbHRhID0gRGVsdGE7XG4gICAgICAgIHRoaXMuVGU9VGU7XG4gICAgICAgIHRoaXMub21lZ2EgPSBvbWVnYTtcbiAgICB9XG4gICAgXG4gXG4gICAgbm9ybWFsaXplZExGV2F2ZWZvcm0odCkgeyAgICAgXG4gICAgICAgIGlmICh0PnRoaXMuVGUpIHRoaXMub3V0cHV0ID0gKC1NYXRoLmV4cCgtdGhpcy5lcHNpbG9uICogKHQtdGhpcy5UZSkpICsgdGhpcy5zaGlmdCkvdGhpcy5EZWx0YTtcbiAgICAgICAgZWxzZSB0aGlzLm91dHB1dCA9IHRoaXMuRTAgKiBNYXRoLmV4cCh0aGlzLmFscGhhKnQpICogTWF0aC5zaW4odGhpcy5vbWVnYSAqIHQpO1xuICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0cHV0ICogdGhpcy5pbnRlbnNpdHkgKiB0aGlzLmxvdWRuZXNzO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgR2xvdHRpcyB9OyIsImNsYXNzIFRyYWN0VUlcbntcblxuICAgIGNvbnN0cnVjdG9yKHRyb21ib25lKSB7XG4gICAgICAgIHRoaXMudHJvbWJvbmUgPSB0cm9tYm9uZTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub3JpZ2luWCA9IDM0MDsgXG4gICAgICAgIHRoaXMub3JpZ2luWSA9IDQ0OTsgXG4gICAgICAgIHRoaXMucmFkaXVzID0gMjk4OyBcbiAgICAgICAgdGhpcy5zY2FsZSA9IDYwO1xuICAgICAgICB0aGlzLnRvbmd1ZUluZGV4ID0gMTIuOTtcbiAgICAgICAgdGhpcy50b25ndWVEaWFtZXRlciA9IDIuNDM7XG4gICAgICAgIHRoaXMuaW5uZXJUb25ndWVDb250cm9sUmFkaXVzID0gMi4wNTtcbiAgICAgICAgdGhpcy5vdXRlclRvbmd1ZUNvbnRyb2xSYWRpdXMgPSAzLjU7XG4gICAgICAgIHRoaXMudG9uZ3VlVG91Y2ggPSAwO1xuICAgICAgICB0aGlzLmFuZ2xlU2NhbGUgPSAwLjY0O1xuICAgICAgICB0aGlzLmFuZ2xlT2Zmc2V0ID0gLTAuMjQ7XG4gICAgICAgIHRoaXMubm9zZU9mZnNldCA9IDAuODtcbiAgICAgICAgdGhpcy5ncmlkT2Zmc2V0ID0gMS43O1xuXG4gICAgICAgIC8vIEpvbidzIFVJIG9wdGlvbnNcbiAgICAgICAgdGhpcy50YXJnZXQgPSAwLjE7XG4gICAgICAgIHRoaXMuaW5kZXggPSA0MjtcbiAgICAgICAgdGhpcy5yYWRpdXMgPSAwO1xuICAgIH1cbiAgICBcbiAgICBpbml0KCkge1xuICAgICAgICBsZXQgVHJhY3QgPSB0aGlzLnRyb21ib25lLlRyYWN0O1xuXG4gICAgICAgIHRoaXMuc2V0UmVzdERpYW1ldGVyKCk7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxUcmFjdC5uOyBpKyspIFxuICAgICAgICB7XG4gICAgICAgICAgICBUcmFjdC5kaWFtZXRlcltpXSA9IFRyYWN0LnRhcmdldERpYW1ldGVyW2ldID0gVHJhY3QucmVzdERpYW1ldGVyW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b25ndWVMb3dlckluZGV4Qm91bmQgPSBUcmFjdC5ibGFkZVN0YXJ0KzI7XG4gICAgICAgIHRoaXMudG9uZ3VlVXBwZXJJbmRleEJvdW5kID0gVHJhY3QudGlwU3RhcnQtMztcbiAgICAgICAgdGhpcy50b25ndWVJbmRleENlbnRyZSA9IDAuNSoodGhpcy50b25ndWVMb3dlckluZGV4Qm91bmQrdGhpcy50b25ndWVVcHBlckluZGV4Qm91bmQpO1xuICAgIH1cbiAgICAgICAgXG4gICAgZ2V0SW5kZXgoeCx5KSB7XG4gICAgICAgIGxldCBUcmFjdCA9IHRoaXMudHJvbWJvbmUuVHJhY3Q7XG5cbiAgICAgICAgdmFyIHh4ID0geC10aGlzLm9yaWdpblg7IHZhciB5eSA9IHktdGhpcy5vcmlnaW5ZO1xuICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKHl5LCB4eCk7XG4gICAgICAgIHdoaWxlIChhbmdsZT4gMCkgYW5nbGUgLT0gMipNYXRoLlBJO1xuICAgICAgICByZXR1cm4gKE1hdGguUEkgKyBhbmdsZSAtIHRoaXMuYW5nbGVPZmZzZXQpKihUcmFjdC5saXBTdGFydC0xKSAvICh0aGlzLmFuZ2xlU2NhbGUqTWF0aC5QSSk7XG4gICAgfVxuXG4gICAgZ2V0RGlhbWV0ZXIoeCx5KSB7XG4gICAgICAgIHZhciB4eCA9IHgtdGhpcy5vcmlnaW5YOyB2YXIgeXkgPSB5LXRoaXMub3JpZ2luWTtcbiAgICAgICAgcmV0dXJuICh0aGlzLnJhZGl1cy1NYXRoLnNxcnQoeHgqeHggKyB5eSp5eSkpL3RoaXMuc2NhbGU7XG4gICAgfVxuICAgIFxuICAgIHNldFJlc3REaWFtZXRlcigpIHtcbiAgICAgICAgbGV0IFRyYWN0ID0gdGhpcy50cm9tYm9uZS5UcmFjdDtcblxuICAgICAgICBmb3IgKHZhciBpPVRyYWN0LmJsYWRlU3RhcnQ7IGk8VHJhY3QubGlwU3RhcnQ7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHQgPSAxLjEgKiBNYXRoLlBJKih0aGlzLnRvbmd1ZUluZGV4IC0gaSkvKFRyYWN0LnRpcFN0YXJ0IC0gVHJhY3QuYmxhZGVTdGFydCk7XG4gICAgICAgICAgICB2YXIgZml4ZWRUb25ndWVEaWFtZXRlciA9IDIrKHRoaXMudG9uZ3VlRGlhbWV0ZXItMikvMS41O1xuICAgICAgICAgICAgdmFyIGN1cnZlID0gKDEuNS1maXhlZFRvbmd1ZURpYW1ldGVyK3RoaXMuZ3JpZE9mZnNldCkqTWF0aC5jb3ModCk7XG4gICAgICAgICAgICBpZiAoaSA9PSBUcmFjdC5ibGFkZVN0YXJ0LTIgfHwgaSA9PSBUcmFjdC5saXBTdGFydC0xKSBjdXJ2ZSAqPSAwLjg7XG4gICAgICAgICAgICBpZiAoaSA9PSBUcmFjdC5ibGFkZVN0YXJ0IHx8IGkgPT0gVHJhY3QubGlwU3RhcnQtMikgY3VydmUgKj0gMC45NDsgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIFRyYWN0LnJlc3REaWFtZXRlcltpXSA9IDEuNSAtIGN1cnZlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQnVoKHByb2dyZXNzKSB7XG5cbiAgICAgICAgbGV0IFRyYWN0ID0gdGhpcy50cm9tYm9uZS5UcmFjdDtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0UmVzdERpYW1ldGVyKCk7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxUcmFjdC5uOyBpKyspIFRyYWN0LnRhcmdldERpYW1ldGVyW2ldID0gVHJhY3QucmVzdERpYW1ldGVyW2ldOyAgICBcblxuICAgICAgICAvLyBEaXNhYmxlIHRoaXMgYmVoYXZpb3IgaWYgdGhlIG1vdXRoIGlzIGNsb3NlZCBhIGNlcnRhaW4gYW1vdW50XG4gICAgICAgIC8vaWYgKHByb2dyZXNzID4gMC44IHx8IHByb2dyZXNzIDwgMC4xKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBmb3IobGV0IGk9IHRoaXMuaW5kZXggLSB0aGlzLnJhZGl1czsgaSA8PSB0aGlzLmluZGV4ICsgdGhpcy5yYWRpdXM7IGkrKyl7XG4gICAgICAgICAgICBpZiAoaSA+IFRyYWN0LnRhcmdldERpYW1ldGVyLmxlbmd0aCB8fCBpIDwgMCkgY29udGludWU7XG4gICAgICAgICAgICBsZXQgaW50ZXJwID0gTWF0aC5sZXJwKFRyYWN0LnJlc3REaWFtZXRlcltpXSwgdGhpcy50YXJnZXQsIHByb2dyZXNzKTtcbiAgICAgICAgICAgIFRyYWN0LnRhcmdldERpYW1ldGVyW2ldID0gaW50ZXJwO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cblxuZXhwb3J0IHsgVHJhY3RVSSB9OyIsImNsYXNzIFRyYWN0IHtcblxuICAgIGNvbnN0cnVjdG9yKHRyb21ib25lKSB7XG4gICAgICAgIHRoaXMudHJvbWJvbmUgPSB0cm9tYm9uZTtcblxuICAgICAgICB0aGlzLm4gPSA0NDtcbiAgICAgICAgdGhpcy5ibGFkZVN0YXJ0ID0gMTA7XG4gICAgICAgIHRoaXMudGlwU3RhcnQgPSAzMjtcbiAgICAgICAgdGhpcy5saXBTdGFydCA9IDM5O1xuICAgICAgICB0aGlzLlIgPSBbXTsgLy9jb21wb25lbnQgZ29pbmcgcmlnaHRcbiAgICAgICAgdGhpcy5MID0gW107IC8vY29tcG9uZW50IGdvaW5nIGxlZnRcbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uID0gW107XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRSID0gW107XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRMID0gW107XG4gICAgICAgIHRoaXMubWF4QW1wbGl0dWRlID0gW107XG4gICAgICAgIHRoaXMuZGlhbWV0ZXIgPSBbXTtcbiAgICAgICAgdGhpcy5yZXN0RGlhbWV0ZXIgPSBbXTtcbiAgICAgICAgdGhpcy50YXJnZXREaWFtZXRlciA9IFtdO1xuICAgICAgICB0aGlzLm5ld0RpYW1ldGVyID0gW107XG4gICAgICAgIHRoaXMuQSA9IFtdO1xuICAgICAgICB0aGlzLmdsb3R0YWxSZWZsZWN0aW9uID0gMC43NTtcbiAgICAgICAgdGhpcy5saXBSZWZsZWN0aW9uID0gLTAuODU7XG4gICAgICAgIHRoaXMubGFzdE9ic3RydWN0aW9uID0gLTE7XG4gICAgICAgIHRoaXMuZmFkZSA9IDEuMDsgLy8wLjk5OTksXG4gICAgICAgIHRoaXMubW92ZW1lbnRTcGVlZCA9IDE1OyAvL2NtIHBlciBzZWNvbmRcbiAgICAgICAgdGhpcy50cmFuc2llbnRzID0gW107XG4gICAgICAgIHRoaXMubGlwT3V0cHV0ID0gMDtcbiAgICAgICAgdGhpcy5ub3NlT3V0cHV0ID0gMDtcbiAgICAgICAgdGhpcy52ZWx1bVRhcmdldCA9IDAuMDE7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5ibGFkZVN0YXJ0ID0gTWF0aC5mbG9vcih0aGlzLmJsYWRlU3RhcnQqdGhpcy5uLzQ0KTtcbiAgICAgICAgdGhpcy50aXBTdGFydCA9IE1hdGguZmxvb3IodGhpcy50aXBTdGFydCp0aGlzLm4vNDQpO1xuICAgICAgICB0aGlzLmxpcFN0YXJ0ID0gTWF0aC5mbG9vcih0aGlzLmxpcFN0YXJ0KnRoaXMubi80NCk7ICAgICAgICBcbiAgICAgICAgdGhpcy5kaWFtZXRlciA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKTtcbiAgICAgICAgdGhpcy5yZXN0RGlhbWV0ZXIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMudGFyZ2V0RGlhbWV0ZXIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMubmV3RGlhbWV0ZXIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm47IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGRpYW1ldGVyID0gMDtcbiAgICAgICAgICAgIGlmIChpPDcqdGhpcy5uLzQ0LTAuNSkgZGlhbWV0ZXIgPSAwLjY7XG4gICAgICAgICAgICBlbHNlIGlmIChpPDEyKnRoaXMubi80NCkgZGlhbWV0ZXIgPSAxLjE7XG4gICAgICAgICAgICBlbHNlIGRpYW1ldGVyID0gMS41O1xuICAgICAgICAgICAgdGhpcy5kaWFtZXRlcltpXSA9IHRoaXMucmVzdERpYW1ldGVyW2ldID0gdGhpcy50YXJnZXREaWFtZXRlcltpXSA9IHRoaXMubmV3RGlhbWV0ZXJbaV0gPSBkaWFtZXRlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLlIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIHRoaXMuTCA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKTtcbiAgICAgICAgdGhpcy5yZWZsZWN0aW9uID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm4rMSk7XG4gICAgICAgIHRoaXMubmV3UmVmbGVjdGlvbiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKzEpO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0UiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKzEpO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0TCA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKzEpO1xuICAgICAgICB0aGlzLkEgPW5ldyBGbG9hdDY0QXJyYXkodGhpcy5uKTtcbiAgICAgICAgdGhpcy5tYXhBbXBsaXR1ZGUgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubik7XG4gICAgICAgIFxuICAgICAgICB0aGlzLm5vc2VMZW5ndGggPSBNYXRoLmZsb29yKDI4KnRoaXMubi80NClcbiAgICAgICAgdGhpcy5ub3NlU3RhcnQgPSB0aGlzLm4tdGhpcy5ub3NlTGVuZ3RoICsgMTtcbiAgICAgICAgdGhpcy5ub3NlUiA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ub3NlTCA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRSID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLm5vc2VMZW5ndGgrMSk7XG4gICAgICAgIHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0TCA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKzEpOyAgICAgICAgXG4gICAgICAgIHRoaXMubm9zZVJlZmxlY3Rpb24gPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCsxKTtcbiAgICAgICAgdGhpcy5ub3NlRGlhbWV0ZXIgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgIHRoaXMubm9zZUEgPSBuZXcgRmxvYXQ2NEFycmF5KHRoaXMubm9zZUxlbmd0aCk7XG4gICAgICAgIHRoaXMubm9zZU1heEFtcGxpdHVkZSA9IG5ldyBGbG9hdDY0QXJyYXkodGhpcy5ub3NlTGVuZ3RoKTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMubm9zZUxlbmd0aDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZGlhbWV0ZXI7XG4gICAgICAgICAgICB2YXIgZCA9IDIqKGkvdGhpcy5ub3NlTGVuZ3RoKTtcbiAgICAgICAgICAgIGlmIChkPDEpIGRpYW1ldGVyID0gMC40KzEuNipkO1xuICAgICAgICAgICAgZWxzZSBkaWFtZXRlciA9IDAuNSsxLjUqKDItZCk7XG4gICAgICAgICAgICBkaWFtZXRlciA9IE1hdGgubWluKGRpYW1ldGVyLCAxLjkpO1xuICAgICAgICAgICAgdGhpcy5ub3NlRGlhbWV0ZXJbaV0gPSBkaWFtZXRlcjtcbiAgICAgICAgfSAgICAgICBcbiAgICAgICAgdGhpcy5uZXdSZWZsZWN0aW9uTGVmdCA9IHRoaXMubmV3UmVmbGVjdGlvblJpZ2h0ID0gdGhpcy5uZXdSZWZsZWN0aW9uTm9zZSA9IDA7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUmVmbGVjdGlvbnMoKTsgICAgICAgIFxuICAgICAgICB0aGlzLmNhbGN1bGF0ZU5vc2VSZWZsZWN0aW9ucygpO1xuICAgICAgICB0aGlzLm5vc2VEaWFtZXRlclswXSA9IHRoaXMudmVsdW1UYXJnZXQ7XG4gICAgfVxuICAgIFxuICAgIHJlc2hhcGVUcmFjdChkZWx0YVRpbWUpIHtcbiAgICAgICAgdmFyIGFtb3VudCA9IGRlbHRhVGltZSAqIHRoaXMubW92ZW1lbnRTcGVlZDsgOyAgICBcbiAgICAgICAgdmFyIG5ld0xhc3RPYnN0cnVjdGlvbiA9IC0xO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5uOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBkaWFtZXRlciA9IHRoaXMuZGlhbWV0ZXJbaV07XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RGlhbWV0ZXIgPSB0aGlzLnRhcmdldERpYW1ldGVyW2ldO1xuICAgICAgICAgICAgaWYgKGRpYW1ldGVyIDw9IDApIG5ld0xhc3RPYnN0cnVjdGlvbiA9IGk7XG4gICAgICAgICAgICB2YXIgc2xvd1JldHVybjsgXG4gICAgICAgICAgICBpZiAoaTx0aGlzLm5vc2VTdGFydCkgc2xvd1JldHVybiA9IDAuNjtcbiAgICAgICAgICAgIGVsc2UgaWYgKGkgPj0gdGhpcy50aXBTdGFydCkgc2xvd1JldHVybiA9IDEuMDsgXG4gICAgICAgICAgICBlbHNlIHNsb3dSZXR1cm4gPSAwLjYrMC40KihpLXRoaXMubm9zZVN0YXJ0KS8odGhpcy50aXBTdGFydC10aGlzLm5vc2VTdGFydCk7XG4gICAgICAgICAgICB0aGlzLmRpYW1ldGVyW2ldID0gTWF0aC5tb3ZlVG93YXJkcyhkaWFtZXRlciwgdGFyZ2V0RGlhbWV0ZXIsIHNsb3dSZXR1cm4qYW1vdW50LCAyKmFtb3VudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubGFzdE9ic3RydWN0aW9uPi0xICYmIG5ld0xhc3RPYnN0cnVjdGlvbiA9PSAtMSAmJiB0aGlzLm5vc2VBWzBdPDAuMDUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVHJhbnNpZW50KHRoaXMubGFzdE9ic3RydWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhc3RPYnN0cnVjdGlvbiA9IG5ld0xhc3RPYnN0cnVjdGlvbjtcbiAgICAgICAgXG4gICAgICAgIGFtb3VudCA9IGRlbHRhVGltZSAqIHRoaXMubW92ZW1lbnRTcGVlZDsgXG4gICAgICAgIHRoaXMubm9zZURpYW1ldGVyWzBdID0gTWF0aC5tb3ZlVG93YXJkcyh0aGlzLm5vc2VEaWFtZXRlclswXSwgdGhpcy52ZWx1bVRhcmdldCwgXG4gICAgICAgICAgICAgICAgYW1vdW50KjAuMjUsIGFtb3VudCowLjEpO1xuICAgICAgICB0aGlzLm5vc2VBWzBdID0gdGhpcy5ub3NlRGlhbWV0ZXJbMF0qdGhpcy5ub3NlRGlhbWV0ZXJbMF07ICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgY2FsY3VsYXRlUmVmbGVjdGlvbnMoKSB7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm47IGkrKykgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuQVtpXSA9IHRoaXMuZGlhbWV0ZXJbaV0qdGhpcy5kaWFtZXRlcltpXTsgLy9pZ25vcmluZyBQSSBldGMuXG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaT0xOyBpPHRoaXMubjsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnJlZmxlY3Rpb25baV0gPSB0aGlzLm5ld1JlZmxlY3Rpb25baV07XG4gICAgICAgICAgICBpZiAodGhpcy5BW2ldID09IDApIHRoaXMubmV3UmVmbGVjdGlvbltpXSA9IDAuOTk5OyAvL3RvIHByZXZlbnQgc29tZSBiYWQgYmVoYXZpb3VyIGlmIDBcbiAgICAgICAgICAgIGVsc2UgdGhpcy5uZXdSZWZsZWN0aW9uW2ldID0gKHRoaXMuQVtpLTFdLXRoaXMuQVtpXSkgLyAodGhpcy5BW2ktMV0rdGhpcy5BW2ldKTsgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vbm93IGF0IGp1bmN0aW9uIHdpdGggbm9zZVxuXG4gICAgICAgIHRoaXMucmVmbGVjdGlvbkxlZnQgPSB0aGlzLm5ld1JlZmxlY3Rpb25MZWZ0O1xuICAgICAgICB0aGlzLnJlZmxlY3Rpb25SaWdodCA9IHRoaXMubmV3UmVmbGVjdGlvblJpZ2h0O1xuICAgICAgICB0aGlzLnJlZmxlY3Rpb25Ob3NlID0gdGhpcy5uZXdSZWZsZWN0aW9uTm9zZTtcbiAgICAgICAgdmFyIHN1bSA9IHRoaXMuQVt0aGlzLm5vc2VTdGFydF0rdGhpcy5BW3RoaXMubm9zZVN0YXJ0KzFdK3RoaXMubm9zZUFbMF07XG4gICAgICAgIHRoaXMubmV3UmVmbGVjdGlvbkxlZnQgPSAoMip0aGlzLkFbdGhpcy5ub3NlU3RhcnRdLXN1bSkvc3VtO1xuICAgICAgICB0aGlzLm5ld1JlZmxlY3Rpb25SaWdodCA9ICgyKnRoaXMuQVt0aGlzLm5vc2VTdGFydCsxXS1zdW0pL3N1bTsgICBcbiAgICAgICAgdGhpcy5uZXdSZWZsZWN0aW9uTm9zZSA9ICgyKnRoaXMubm9zZUFbMF0tc3VtKS9zdW07ICAgICAgXG4gICAgfVxuXG4gICAgY2FsY3VsYXRlTm9zZVJlZmxlY3Rpb25zKCkge1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5ub3NlTGVuZ3RoOyBpKyspIFxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm5vc2VBW2ldID0gdGhpcy5ub3NlRGlhbWV0ZXJbaV0qdGhpcy5ub3NlRGlhbWV0ZXJbaV07IFxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGk9MTsgaTx0aGlzLm5vc2VMZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5ub3NlUmVmbGVjdGlvbltpXSA9ICh0aGlzLm5vc2VBW2ktMV0tdGhpcy5ub3NlQVtpXSkgLyAodGhpcy5ub3NlQVtpLTFdK3RoaXMubm9zZUFbaV0pOyBcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBydW5TdGVwKGdsb3R0YWxPdXRwdXQsIHR1cmJ1bGVuY2VOb2lzZSwgbGFtYmRhKSB7XG4gICAgICAgIHZhciB1cGRhdGVBbXBsaXR1ZGVzID0gKE1hdGgucmFuZG9tKCk8MC4xKTtcbiAgICBcbiAgICAgICAgLy9tb3V0aFxuICAgICAgICB0aGlzLnByb2Nlc3NUcmFuc2llbnRzKCk7XG4gICAgICAgIHRoaXMuYWRkVHVyYnVsZW5jZU5vaXNlKHR1cmJ1bGVuY2VOb2lzZSk7XG4gICAgICAgIFxuICAgICAgICAvL3RoaXMuZ2xvdHRhbFJlZmxlY3Rpb24gPSAtMC44ICsgMS42ICogR2xvdHRpcy5uZXdUZW5zZW5lc3M7XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRSWzBdID0gdGhpcy5MWzBdICogdGhpcy5nbG90dGFsUmVmbGVjdGlvbiArIGdsb3R0YWxPdXRwdXQ7XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRMW3RoaXMubl0gPSB0aGlzLlJbdGhpcy5uLTFdICogdGhpcy5saXBSZWZsZWN0aW9uOyBcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGk9MTsgaTx0aGlzLm47IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHIgPSB0aGlzLnJlZmxlY3Rpb25baV0gKiAoMS1sYW1iZGEpICsgdGhpcy5uZXdSZWZsZWN0aW9uW2ldKmxhbWJkYTtcbiAgICAgICAgICAgIHZhciB3ID0gciAqICh0aGlzLlJbaS0xXSArIHRoaXMuTFtpXSk7XG4gICAgICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0UltpXSA9IHRoaXMuUltpLTFdIC0gdztcbiAgICAgICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRMW2ldID0gdGhpcy5MW2ldICsgdztcbiAgICAgICAgfSAgICBcbiAgICAgICAgXG4gICAgICAgIC8vbm93IGF0IGp1bmN0aW9uIHdpdGggbm9zZVxuICAgICAgICB2YXIgaSA9IHRoaXMubm9zZVN0YXJ0O1xuICAgICAgICB2YXIgciA9IHRoaXMubmV3UmVmbGVjdGlvbkxlZnQgKiAoMS1sYW1iZGEpICsgdGhpcy5yZWZsZWN0aW9uTGVmdCpsYW1iZGE7XG4gICAgICAgIHRoaXMuanVuY3Rpb25PdXRwdXRMW2ldID0gcip0aGlzLlJbaS0xXSsoMStyKSoodGhpcy5ub3NlTFswXSt0aGlzLkxbaV0pO1xuICAgICAgICByID0gdGhpcy5uZXdSZWZsZWN0aW9uUmlnaHQgKiAoMS1sYW1iZGEpICsgdGhpcy5yZWZsZWN0aW9uUmlnaHQqbGFtYmRhO1xuICAgICAgICB0aGlzLmp1bmN0aW9uT3V0cHV0UltpXSA9IHIqdGhpcy5MW2ldKygxK3IpKih0aGlzLlJbaS0xXSt0aGlzLm5vc2VMWzBdKTsgICAgIFxuICAgICAgICByID0gdGhpcy5uZXdSZWZsZWN0aW9uTm9zZSAqICgxLWxhbWJkYSkgKyB0aGlzLnJlZmxlY3Rpb25Ob3NlKmxhbWJkYTtcbiAgICAgICAgdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRSWzBdID0gcip0aGlzLm5vc2VMWzBdKygxK3IpKih0aGlzLkxbaV0rdGhpcy5SW2ktMV0pO1xuICAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm47IGkrKylcbiAgICAgICAgeyAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuUltpXSA9IHRoaXMuanVuY3Rpb25PdXRwdXRSW2ldKjAuOTk5O1xuICAgICAgICAgICAgdGhpcy5MW2ldID0gdGhpcy5qdW5jdGlvbk91dHB1dExbaSsxXSowLjk5OTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vdGhpcy5SW2ldID0gTWF0aC5jbGFtcCh0aGlzLmp1bmN0aW9uT3V0cHV0UltpXSAqIHRoaXMuZmFkZSwgLTEsIDEpO1xuICAgICAgICAgICAgLy90aGlzLkxbaV0gPSBNYXRoLmNsYW1wKHRoaXMuanVuY3Rpb25PdXRwdXRMW2krMV0gKiB0aGlzLmZhZGUsIC0xLCAxKTsgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh1cGRhdGVBbXBsaXR1ZGVzKVxuICAgICAgICAgICAgeyAgIFxuICAgICAgICAgICAgICAgIHZhciBhbXBsaXR1ZGUgPSBNYXRoLmFicyh0aGlzLlJbaV0rdGhpcy5MW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoYW1wbGl0dWRlID4gdGhpcy5tYXhBbXBsaXR1ZGVbaV0pIHRoaXMubWF4QW1wbGl0dWRlW2ldID0gYW1wbGl0dWRlO1xuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5tYXhBbXBsaXR1ZGVbaV0gKj0gMC45OTk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxpcE91dHB1dCA9IHRoaXMuUlt0aGlzLm4tMV07XG4gICAgICAgIFxuICAgICAgICAvL25vc2UgICAgIFxuICAgICAgICB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dExbdGhpcy5ub3NlTGVuZ3RoXSA9IHRoaXMubm9zZVJbdGhpcy5ub3NlTGVuZ3RoLTFdICogdGhpcy5saXBSZWZsZWN0aW9uOyBcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGk9MTsgaTx0aGlzLm5vc2VMZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHcgPSB0aGlzLm5vc2VSZWZsZWN0aW9uW2ldICogKHRoaXMubm9zZVJbaS0xXSArIHRoaXMubm9zZUxbaV0pO1xuICAgICAgICAgICAgdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRSW2ldID0gdGhpcy5ub3NlUltpLTFdIC0gdztcbiAgICAgICAgICAgIHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0TFtpXSA9IHRoaXMubm9zZUxbaV0gKyB3O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5ub3NlTGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubm9zZVJbaV0gPSB0aGlzLm5vc2VKdW5jdGlvbk91dHB1dFJbaV0gKiB0aGlzLmZhZGU7XG4gICAgICAgICAgICB0aGlzLm5vc2VMW2ldID0gdGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRMW2krMV0gKiB0aGlzLmZhZGU7ICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vdGhpcy5ub3NlUltpXSA9IE1hdGguY2xhbXAodGhpcy5ub3NlSnVuY3Rpb25PdXRwdXRSW2ldICogdGhpcy5mYWRlLCAtMSwgMSk7XG4gICAgICAgICAgICAvL3RoaXMubm9zZUxbaV0gPSBNYXRoLmNsYW1wKHRoaXMubm9zZUp1bmN0aW9uT3V0cHV0TFtpKzFdICogdGhpcy5mYWRlLCAtMSwgMSk7ICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodXBkYXRlQW1wbGl0dWRlcylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgYW1wbGl0dWRlID0gTWF0aC5hYnModGhpcy5ub3NlUltpXSt0aGlzLm5vc2VMW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoYW1wbGl0dWRlID4gdGhpcy5ub3NlTWF4QW1wbGl0dWRlW2ldKSB0aGlzLm5vc2VNYXhBbXBsaXR1ZGVbaV0gPSBhbXBsaXR1ZGU7XG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLm5vc2VNYXhBbXBsaXR1ZGVbaV0gKj0gMC45OTk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5vc2VPdXRwdXQgPSB0aGlzLm5vc2VSW3RoaXMubm9zZUxlbmd0aC0xXTtcbiAgICAgICBcbiAgICB9XG4gICAgXG4gICAgZmluaXNoQmxvY2soKSB7ICAgICAgICAgXG4gICAgICAgIHRoaXMucmVzaGFwZVRyYWN0KHRoaXMudHJvbWJvbmUuQXVkaW9TeXN0ZW0uYmxvY2tUaW1lKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVSZWZsZWN0aW9ucygpO1xuICAgIH1cbiAgICBcbiAgICBhZGRUcmFuc2llbnQocG9zaXRpb24pIHtcbiAgICAgICAgdmFyIHRyYW5zID0ge31cbiAgICAgICAgdHJhbnMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdHJhbnMudGltZUFsaXZlID0gMDtcbiAgICAgICAgdHJhbnMubGlmZVRpbWUgPSAwLjI7XG4gICAgICAgIHRyYW5zLnN0cmVuZ3RoID0gMC4zO1xuICAgICAgICB0cmFucy5leHBvbmVudCA9IDIwMDtcbiAgICAgICAgdGhpcy50cmFuc2llbnRzLnB1c2godHJhbnMpO1xuICAgIH1cbiAgICBcbiAgICBwcm9jZXNzVHJhbnNpZW50cygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRyYW5zaWVudHMubGVuZ3RoOyBpKyspICBcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHRyYW5zID0gdGhpcy50cmFuc2llbnRzW2ldO1xuICAgICAgICAgICAgdmFyIGFtcGxpdHVkZSA9IHRyYW5zLnN0cmVuZ3RoICogTWF0aC5wb3coMiwgLXRyYW5zLmV4cG9uZW50ICogdHJhbnMudGltZUFsaXZlKTtcbiAgICAgICAgICAgIHRoaXMuUlt0cmFucy5wb3NpdGlvbl0gKz0gYW1wbGl0dWRlLzI7XG4gICAgICAgICAgICB0aGlzLkxbdHJhbnMucG9zaXRpb25dICs9IGFtcGxpdHVkZS8yO1xuICAgICAgICAgICAgdHJhbnMudGltZUFsaXZlICs9IDEuMC8odGhpcy50cm9tYm9uZS5zYW1wbGVSYXRlKjIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGk9dGhpcy50cmFuc2llbnRzLmxlbmd0aC0xOyBpPj0wOyBpLS0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB0cmFucyA9IHRoaXMudHJhbnNpZW50c1tpXTtcbiAgICAgICAgICAgIGlmICh0cmFucy50aW1lQWxpdmUgPiB0cmFucy5saWZlVGltZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaWVudHMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgYWRkVHVyYnVsZW5jZU5vaXNlKHR1cmJ1bGVuY2VOb2lzZSkge1xuICAgICAgICAvLyBmb3IgKHZhciBqPTA7IGo8VUkudG91Y2hlc1dpdGhNb3VzZS5sZW5ndGg7IGorKylcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgdmFyIHRvdWNoID0gVUkudG91Y2hlc1dpdGhNb3VzZVtqXTtcbiAgICAgICAgLy8gICAgIGlmICh0b3VjaC5pbmRleDwyIHx8IHRvdWNoLmluZGV4PlRyYWN0Lm4pIGNvbnRpbnVlO1xuICAgICAgICAvLyAgICAgaWYgKHRvdWNoLmRpYW1ldGVyPD0wKSBjb250aW51ZTsgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIHZhciBpbnRlbnNpdHkgPSB0b3VjaC5mcmljYXRpdmVfaW50ZW5zaXR5O1xuICAgICAgICAvLyAgICAgaWYgKGludGVuc2l0eSA9PSAwKSBjb250aW51ZTtcbiAgICAgICAgLy8gICAgIHRoaXMuYWRkVHVyYnVsZW5jZU5vaXNlQXRJbmRleCgwLjY2KnR1cmJ1bGVuY2VOb2lzZSppbnRlbnNpdHksIHRvdWNoLmluZGV4LCB0b3VjaC5kaWFtZXRlcik7XG4gICAgICAgIC8vIH1cbiAgICB9XG4gICAgXG4gICAgYWRkVHVyYnVsZW5jZU5vaXNlQXRJbmRleCh0dXJidWxlbmNlTm9pc2UsIGluZGV4LCBkaWFtZXRlcikgeyAgIFxuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoaW5kZXgpO1xuICAgICAgICB2YXIgZGVsdGEgPSBpbmRleCAtIGk7XG4gICAgICAgIHR1cmJ1bGVuY2VOb2lzZSAqPSB0aGlzLnRyb21ib25lLkdsb3R0aXMuZ2V0Tm9pc2VNb2R1bGF0b3IoKTtcbiAgICAgICAgdmFyIHRoaW5uZXNzMCA9IE1hdGguY2xhbXAoOCooMC43LWRpYW1ldGVyKSwwLDEpO1xuICAgICAgICB2YXIgb3Blbm5lc3MgPSBNYXRoLmNsYW1wKDMwKihkaWFtZXRlci0wLjMpLCAwLCAxKTtcbiAgICAgICAgdmFyIG5vaXNlMCA9IHR1cmJ1bGVuY2VOb2lzZSooMS1kZWx0YSkqdGhpbm5lc3MwKm9wZW5uZXNzO1xuICAgICAgICB2YXIgbm9pc2UxID0gdHVyYnVsZW5jZU5vaXNlKmRlbHRhKnRoaW5uZXNzMCpvcGVubmVzcztcbiAgICAgICAgdGhpcy5SW2krMV0gKz0gbm9pc2UwLzI7XG4gICAgICAgIHRoaXMuTFtpKzFdICs9IG5vaXNlMC8yO1xuICAgICAgICB0aGlzLlJbaSsyXSArPSBub2lzZTEvMjtcbiAgICAgICAgdGhpcy5MW2krMl0gKz0gbm9pc2UxLzI7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgVHJhY3QgfTsiLCJNYXRoLmNsYW1wID0gZnVuY3Rpb24obnVtYmVyLCBtaW4sIG1heCkge1xuICAgIGlmIChudW1iZXI8bWluKSByZXR1cm4gbWluO1xuICAgIGVsc2UgaWYgKG51bWJlcj5tYXgpIHJldHVybiBtYXg7XG4gICAgZWxzZSByZXR1cm4gbnVtYmVyO1xufVxuXG5NYXRoLm1vdmVUb3dhcmRzID0gZnVuY3Rpb24oY3VycmVudCwgdGFyZ2V0LCBhbW91bnQpIHtcbiAgICBpZiAoY3VycmVudDx0YXJnZXQpIHJldHVybiBNYXRoLm1pbihjdXJyZW50K2Ftb3VudCwgdGFyZ2V0KTtcbiAgICBlbHNlIHJldHVybiBNYXRoLm1heChjdXJyZW50LWFtb3VudCwgdGFyZ2V0KTtcbn1cblxuTWF0aC5tb3ZlVG93YXJkcyA9IGZ1bmN0aW9uKGN1cnJlbnQsIHRhcmdldCwgYW1vdW50VXAsIGFtb3VudERvd24pIHtcbiAgICBpZiAoY3VycmVudDx0YXJnZXQpIHJldHVybiBNYXRoLm1pbihjdXJyZW50K2Ftb3VudFVwLCB0YXJnZXQpO1xuICAgIGVsc2UgcmV0dXJuIE1hdGgubWF4KGN1cnJlbnQtYW1vdW50RG93biwgdGFyZ2V0KTtcbn1cblxuTWF0aC5nYXVzc2lhbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzID0gMDtcbiAgICBmb3IgKHZhciBjPTA7IGM8MTY7IGMrKykgcys9TWF0aC5yYW5kb20oKTtcbiAgICByZXR1cm4gKHMtOCkvNDtcbn1cblxuTWF0aC5sZXJwID0gZnVuY3Rpb24oYSwgYiwgdCkge1xuICAgIHJldHVybiBhICsgKGIgLSBhKSAqIHQ7XG59IiwiLypcbiAqIEEgc3BlZWQtaW1wcm92ZWQgcGVybGluIGFuZCBzaW1wbGV4IG5vaXNlIGFsZ29yaXRobXMgZm9yIDJELlxuICpcbiAqIEJhc2VkIG9uIGV4YW1wbGUgY29kZSBieSBTdGVmYW4gR3VzdGF2c29uIChzdGVndUBpdG4ubGl1LnNlKS5cbiAqIE9wdGltaXNhdGlvbnMgYnkgUGV0ZXIgRWFzdG1hbiAocGVhc3RtYW5AZHJpenpsZS5zdGFuZm9yZC5lZHUpLlxuICogQmV0dGVyIHJhbmsgb3JkZXJpbmcgbWV0aG9kIGJ5IFN0ZWZhbiBHdXN0YXZzb24gaW4gMjAxMi5cbiAqIENvbnZlcnRlZCB0byBKYXZhc2NyaXB0IGJ5IEpvc2VwaCBHZW50bGUuXG4gKlxuICogVmVyc2lvbiAyMDEyLTAzLTA5XG4gKlxuICogVGhpcyBjb2RlIHdhcyBwbGFjZWQgaW4gdGhlIHB1YmxpYyBkb21haW4gYnkgaXRzIG9yaWdpbmFsIGF1dGhvcixcbiAqIFN0ZWZhbiBHdXN0YXZzb24uIFlvdSBtYXkgdXNlIGl0IGFzIHlvdSBzZWUgZml0LCBidXRcbiAqIGF0dHJpYnV0aW9uIGlzIGFwcHJlY2lhdGVkLlxuICpcbiAqL1xuXG5jbGFzcyBHcmFkIHtcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCB6KXtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgdGhpcy56ID0gejtcbiAgICB9XG5cbiAgICBkb3QyKHgsIHkpe1xuICAgICAgICByZXR1cm4gdGhpcy54KnggKyB0aGlzLnkqeTtcbiAgICB9XG5cbiAgICBkb3QzKHgsIHksIHopIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCp4ICsgdGhpcy55KnkgKyB0aGlzLnoqejtcbiAgICB9O1xufVxuXG5jbGFzcyBOb2lzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ3JhZDMgPSBbbmV3IEdyYWQoMSwxLDApLG5ldyBHcmFkKC0xLDEsMCksbmV3IEdyYWQoMSwtMSwwKSxuZXcgR3JhZCgtMSwtMSwwKSxcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgR3JhZCgxLDAsMSksbmV3IEdyYWQoLTEsMCwxKSxuZXcgR3JhZCgxLDAsLTEpLG5ldyBHcmFkKC0xLDAsLTEpLFxuICAgICAgICAgICAgICAgICAgICAgIG5ldyBHcmFkKDAsMSwxKSxuZXcgR3JhZCgwLC0xLDEpLG5ldyBHcmFkKDAsMSwtMSksbmV3IEdyYWQoMCwtMSwtMSldO1xuICAgICAgICB0aGlzLnAgPSBbMTUxLDE2MCwxMzcsOTEsOTAsMTUsXG4gICAgICAgICAgICAxMzEsMTMsMjAxLDk1LDk2LDUzLDE5NCwyMzMsNywyMjUsMTQwLDM2LDEwMywzMCw2OSwxNDIsOCw5OSwzNywyNDAsMjEsMTAsMjMsXG4gICAgICAgICAgICAxOTAsIDYsMTQ4LDI0NywxMjAsMjM0LDc1LDAsMjYsMTk3LDYyLDk0LDI1MiwyMTksMjAzLDExNywzNSwxMSwzMiw1NywxNzcsMzMsXG4gICAgICAgICAgICA4OCwyMzcsMTQ5LDU2LDg3LDE3NCwyMCwxMjUsMTM2LDE3MSwxNjgsIDY4LDE3NSw3NCwxNjUsNzEsMTM0LDEzOSw0OCwyNywxNjYsXG4gICAgICAgICAgICA3NywxNDYsMTU4LDIzMSw4MywxMTEsMjI5LDEyMiw2MCwyMTEsMTMzLDIzMCwyMjAsMTA1LDkyLDQxLDU1LDQ2LDI0NSw0MCwyNDQsXG4gICAgICAgICAgICAxMDIsMTQzLDU0LCA2NSwyNSw2MywxNjEsIDEsMjE2LDgwLDczLDIwOSw3NiwxMzIsMTg3LDIwOCwgODksMTgsMTY5LDIwMCwxOTYsXG4gICAgICAgICAgICAxMzUsMTMwLDExNiwxODgsMTU5LDg2LDE2NCwxMDAsMTA5LDE5OCwxNzMsMTg2LCAzLDY0LDUyLDIxNywyMjYsMjUwLDEyNCwxMjMsXG4gICAgICAgICAgICA1LDIwMiwzOCwxNDcsMTE4LDEyNiwyNTUsODIsODUsMjEyLDIwNywyMDYsNTksMjI3LDQ3LDE2LDU4LDE3LDE4MiwxODksMjgsNDIsXG4gICAgICAgICAgICAyMjMsMTgzLDE3MCwyMTMsMTE5LDI0OCwxNTIsIDIsNDQsMTU0LDE2MywgNzAsMjIxLDE1MywxMDEsMTU1LDE2NywgNDMsMTcyLDksXG4gICAgICAgICAgICAxMjksMjIsMzksMjUzLCAxOSw5OCwxMDgsMTEwLDc5LDExMywyMjQsMjMyLDE3OCwxODUsIDExMiwxMDQsMjE4LDI0Niw5NywyMjgsXG4gICAgICAgICAgICAyNTEsMzQsMjQyLDE5MywyMzgsMjEwLDE0NCwxMiwxOTEsMTc5LDE2MiwyNDEsIDgxLDUxLDE0NSwyMzUsMjQ5LDE0LDIzOSwxMDcsXG4gICAgICAgICAgICA0OSwxOTIsMjE0LCAzMSwxODEsMTk5LDEwNiwxNTcsMTg0LCA4NCwyMDQsMTc2LDExNSwxMjEsNTAsNDUsMTI3LCA0LDE1MCwyNTQsXG4gICAgICAgICAgICAxMzgsMjM2LDIwNSw5MywyMjIsMTE0LDY3LDI5LDI0LDcyLDI0MywxNDEsMTI4LDE5NSw3OCw2NiwyMTUsNjEsMTU2LDE4MF07XG5cbiAgICAgICAgLy8gVG8gcmVtb3ZlIHRoZSBuZWVkIGZvciBpbmRleCB3cmFwcGluZywgZG91YmxlIHRoZSBwZXJtdXRhdGlvbiB0YWJsZSBsZW5ndGhcbiAgICAgICAgdGhpcy5wZXJtID0gbmV3IEFycmF5KDUxMik7XG4gICAgICAgIHRoaXMuZ3JhZFAgPSBuZXcgQXJyYXkoNTEyKTtcblxuICAgICAgICB0aGlzLnNlZWQoRGF0ZS5ub3coKSk7XG4gICAgfVxuXG4gICAgc2VlZChzZWVkKSB7XG4gICAgICAgIGlmKHNlZWQgPiAwICYmIHNlZWQgPCAxKSB7XG4gICAgICAgICAgICAvLyBTY2FsZSB0aGUgc2VlZCBvdXRcbiAgICAgICAgICAgIHNlZWQgKj0gNjU1MzY7XG4gICAgICAgIH1cblxuICAgICAgICBzZWVkID0gTWF0aC5mbG9vcihzZWVkKTtcbiAgICAgICAgaWYoc2VlZCA8IDI1Nikge1xuICAgICAgICAgICAgc2VlZCB8PSBzZWVkIDw8IDg7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgICAgICAgIHZhciB2O1xuICAgICAgICAgICAgaWYgKGkgJiAxKSB7XG4gICAgICAgICAgICAgICAgdiA9IHRoaXMucFtpXSBeIChzZWVkICYgMjU1KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdiA9IHRoaXMucFtpXSBeICgoc2VlZD4+OCkgJiAyNTUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnBlcm1baV0gPSB0aGlzLnBlcm1baSArIDI1Nl0gPSB2O1xuICAgICAgICAgICAgdGhpcy5ncmFkUFtpXSA9IHRoaXMuZ3JhZFBbaSArIDI1Nl0gPSB0aGlzLmdyYWQzW3YgJSAxMl07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gMkQgc2ltcGxleCBub2lzZVxuICAgIHNpbXBsZXgyKHhpbiwgeWluKSB7XG4gICAgICAgIC8vIFNrZXdpbmcgYW5kIHVuc2tld2luZyBmYWN0b3JzIGZvciAyLCAzLCBhbmQgNCBkaW1lbnNpb25zXG4gICAgICAgIHZhciBGMiA9IDAuNSooTWF0aC5zcXJ0KDMpLTEpO1xuICAgICAgICB2YXIgRzIgPSAoMy1NYXRoLnNxcnQoMykpLzY7XG5cbiAgICAgICAgdmFyIEYzID0gMS8zO1xuICAgICAgICB2YXIgRzMgPSAxLzY7XG5cbiAgICAgICAgdmFyIG4wLCBuMSwgbjI7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuICAgICAgICAvLyBTa2V3IHRoZSBpbnB1dCBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggc2ltcGxleCBjZWxsIHdlJ3JlIGluXG4gICAgICAgIHZhciBzID0gKHhpbit5aW4pKkYyOyAvLyBIYWlyeSBmYWN0b3IgZm9yIDJEXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcih4aW4rcyk7XG4gICAgICAgIHZhciBqID0gTWF0aC5mbG9vcih5aW4rcyk7XG4gICAgICAgIHZhciB0ID0gKGkraikqRzI7XG4gICAgICAgIHZhciB4MCA9IHhpbi1pK3Q7IC8vIFRoZSB4LHkgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luLCB1bnNrZXdlZC5cbiAgICAgICAgdmFyIHkwID0geWluLWordDtcbiAgICAgICAgLy8gRm9yIHRoZSAyRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhbiBlcXVpbGF0ZXJhbCB0cmlhbmdsZS5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggd2UgYXJlIGluLlxuICAgICAgICB2YXIgaTEsIGoxOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgKG1pZGRsZSkgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaikgY29vcmRzXG4gICAgICAgIGlmKHgwPnkwKSB7IC8vIGxvd2VyIHRyaWFuZ2xlLCBYWSBvcmRlcjogKDAsMCktPigxLDApLT4oMSwxKVxuICAgICAgICAgICAgaTE9MTsgajE9MDtcbiAgICAgICAgfSBlbHNlIHsgICAgLy8gdXBwZXIgdHJpYW5nbGUsIFlYIG9yZGVyOiAoMCwwKS0+KDAsMSktPigxLDEpXG4gICAgICAgICAgICBpMT0wOyBqMT0xO1xuICAgICAgICB9XG4gICAgICAgIC8vIEEgc3RlcCBvZiAoMSwwKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKDEtYywtYykgaW4gKHgseSksIGFuZFxuICAgICAgICAvLyBhIHN0ZXAgb2YgKDAsMSkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgtYywxLWMpIGluICh4LHkpLCB3aGVyZVxuICAgICAgICAvLyBjID0gKDMtc3FydCgzKSkvNlxuICAgICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzI7IC8vIE9mZnNldHMgZm9yIG1pZGRsZSBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXG4gICAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHMjtcbiAgICAgICAgdmFyIHgyID0geDAgLSAxICsgMiAqIEcyOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcbiAgICAgICAgdmFyIHkyID0geTAgLSAxICsgMiAqIEcyO1xuICAgICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIHRocmVlIHNpbXBsZXggY29ybmVyc1xuICAgICAgICBpICY9IDI1NTtcbiAgICAgICAgaiAmPSAyNTU7XG4gICAgICAgIHZhciBnaTAgPSB0aGlzLmdyYWRQW2krdGhpcy5wZXJtW2pdXTtcbiAgICAgICAgdmFyIGdpMSA9IHRoaXMuZ3JhZFBbaStpMSt0aGlzLnBlcm1baitqMV1dO1xuICAgICAgICB2YXIgZ2kyID0gdGhpcy5ncmFkUFtpKzErdGhpcy5wZXJtW2orMV1dO1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXG4gICAgICAgIHZhciB0MCA9IDAuNSAtIHgwKngwLXkwKnkwO1xuICAgICAgICBpZih0MDwwKSB7XG4gICAgICAgICAgICBuMCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0MCAqPSB0MDtcbiAgICAgICAgICAgIG4wID0gdDAgKiB0MCAqIGdpMC5kb3QyKHgwLCB5MCk7ICAvLyAoeCx5KSBvZiBncmFkMyB1c2VkIGZvciAyRCBncmFkaWVudFxuICAgICAgICB9XG4gICAgICAgIHZhciB0MSA9IDAuNSAtIHgxKngxLXkxKnkxO1xuICAgICAgICBpZih0MTwwKSB7XG4gICAgICAgICAgICBuMSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0MSAqPSB0MTtcbiAgICAgICAgICAgIG4xID0gdDEgKiB0MSAqIGdpMS5kb3QyKHgxLCB5MSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQyID0gMC41IC0geDIqeDIteTIqeTI7XG4gICAgICAgIGlmKHQyPDApIHtcbiAgICAgICAgICAgIG4yID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHQyICo9IHQyO1xuICAgICAgICAgICAgbjIgPSB0MiAqIHQyICogZ2kyLmRvdDIoeDIsIHkyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXG4gICAgICAgIC8vIFRoZSByZXN1bHQgaXMgc2NhbGVkIHRvIHJldHVybiB2YWx1ZXMgaW4gdGhlIGludGVydmFsIFstMSwxXS5cbiAgICAgICAgcmV0dXJuIDcwICogKG4wICsgbjEgKyBuMik7XG4gICAgfVxuICAgIFxuICAgIHNpbXBsZXgxKHgpe1xuICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGV4Mih4KjEuMiwgLXgqMC43KTtcbiAgICB9XG5cbn1cblxuY29uc3Qgc2luZ2xldG9uID0gbmV3IE5vaXNlKCk7XG5PYmplY3QuZnJlZXplKHNpbmdsZXRvbik7XG5cbmV4cG9ydCBkZWZhdWx0IHNpbmdsZXRvbjsiLCJpbXBvcnQgXCIuL21hdGgtZXh0ZW5zaW9ucy5qc1wiO1xuXG5pbXBvcnQgeyBBdWRpb1N5c3RlbSB9IGZyb20gXCIuL2NvbXBvbmVudHMvYXVkaW8tc3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBHbG90dGlzIH0gZnJvbSBcIi4vY29tcG9uZW50cy9nbG90dGlzLmpzXCI7XG5pbXBvcnQgeyBUcmFjdCB9IGZyb20gXCIuL2NvbXBvbmVudHMvdHJhY3QuanNcIjtcbmltcG9ydCB7IFRyYWN0VUkgfSBmcm9tIFwiLi9jb21wb25lbnRzL3RyYWN0LXVpLmpzXCI7XG5cbmNsYXNzIFBpbmtUcm9tYm9uZSB7XG4gICAgY29uc3RydWN0b3IoKXtcblxuICAgICAgICB0aGlzLnNhbXBsZVJhdGUgPSAwO1xuICAgICAgICB0aGlzLnRpbWUgPSAwO1xuICAgICAgICB0aGlzLmFsd2F5c1ZvaWNlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hdXRvV29iYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ub2lzZUZyZXEgPSA1MDA7XG4gICAgICAgIHRoaXMubm9pc2VRID0gMC43O1xuXG4gICAgICAgIHRoaXMuQXVkaW9TeXN0ZW0gPSBuZXcgQXVkaW9TeXN0ZW0odGhpcyk7XG4gICAgICAgIHRoaXMuQXVkaW9TeXN0ZW0uaW5pdCgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5HbG90dGlzID0gbmV3IEdsb3R0aXModGhpcyk7XG4gICAgICAgIHRoaXMuR2xvdHRpcy5pbml0KCk7XG5cbiAgICAgICAgdGhpcy5UcmFjdCA9IG5ldyBUcmFjdCh0aGlzKTtcbiAgICAgICAgdGhpcy5UcmFjdC5pbml0KCk7XG5cbiAgICAgICAgdGhpcy5UcmFjdFVJID0gbmV3IFRyYWN0VUkodGhpcyk7XG4gICAgICAgIHRoaXMuVHJhY3RVSS5pbml0KCk7XG5cbiAgICAgICAgLy90aGlzLlN0YXJ0QXVkaW8oKTtcbiAgICAgICAgLy90aGlzLlNldE11dGUodHJ1ZSk7XG4gICAgfVxuXG4gICAgU3RhcnRBdWRpbygpIHtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLkF1ZGlvU3lzdGVtLnN0YXJ0U291bmQoKTtcbiAgICB9XG5cbiAgICBTZXRNdXRlKGRvTXV0ZSkge1xuICAgICAgICBkb011dGUgPyB0aGlzLkF1ZGlvU3lzdGVtLm11dGUoKSA6IHRoaXMuQXVkaW9TeXN0ZW0udW5tdXRlKCk7XG4gICAgICAgIHRoaXMubXV0ZWQgPSBkb011dGU7XG4gICAgfVxuXG4gICAgVG9nZ2xlTXV0ZSgpIHtcbiAgICAgICAgdGhpcy5TZXRNdXRlKCF0aGlzLm11dGVkKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHsgUGlua1Ryb21ib25lIH07IiwiY2xhc3MgTW9kZWxMb2FkZXIge1xuXG4gICAgLyoqXG4gICAgICogTG9hZHMgYSBtb2RlbCBhc3luY2hyb25vdXNseS4gRXhwZWN0cyBhbiBvYmplY3QgY29udGFpbmluZ1xuICAgICAqIHRoZSBwYXRoIHRvIHRoZSBvYmplY3QsIHRoZSByZWxhdGl2ZSBwYXRoIG9mIHRoZSBPQkogZmlsZSxcbiAgICAgKiBhbmQgdGhlIHJlbGF0aXZlIHBhdGggb2YgdGhlIE1UTCBmaWxlLlxuICAgICAqIFxuICAgICAqIEFuIGV4YW1wbGU6XG4gICAgICogbGV0IG1vZGVsSW5mbyA9IHtcbiAgICAgKiAgICAgIHBhdGg6IFwiLi4vcmVzb3VyY2VzL29iai9cIixcbiAgICAgKiAgICAgIG9iakZpbGU6IFwidGVzdC5vYmpcIixcbiAgICAgKiAgICAgIG10bEZpbGU6IFwidGVzdC5tdGxcIlxuICAgICAqIH1cbiAgICAgKi9cbiAgICBzdGF0aWMgTG9hZE9CSihtb2RlbEluZm8sIGxvYWRlZENhbGxiYWNrKSB7XG5cbiAgICAgICAgdmFyIG9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiggeGhyICkge1xuICAgICAgICAgICAgaWYgKCB4aHIubGVuZ3RoQ29tcHV0YWJsZSApIHtcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0geGhyLmxvYWRlZCAvIHhoci50b3RhbCAqIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggTWF0aC5yb3VuZCggcGVyY2VudENvbXBsZXRlLCAyICkgKyAnJSBkb3dubG9hZGVkJyApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgb25FcnJvciA9IGZ1bmN0aW9uKCB4aHIgKSB7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG10bExvYWRlciA9IG5ldyBUSFJFRS5NVExMb2FkZXIoKTtcbiAgICAgICAgbXRsTG9hZGVyLnNldFBhdGgoIG1vZGVsSW5mby5wYXRoICk7XG5cbiAgICAgICAgbXRsTG9hZGVyLmxvYWQoIG1vZGVsSW5mby5tdGxGaWxlLCAoIG1hdGVyaWFscyApID0+IHtcbiAgICAgICAgICAgIG1hdGVyaWFscy5wcmVsb2FkKCk7XG4gICAgICAgICAgICB2YXIgb2JqTG9hZGVyID0gbmV3IFRIUkVFLk9CSkxvYWRlcigpO1xuICAgICAgICAgICAgb2JqTG9hZGVyLnNldE1hdGVyaWFscyggbWF0ZXJpYWxzICk7XG4gICAgICAgICAgICBvYmpMb2FkZXIuc2V0UGF0aCggbW9kZWxJbmZvLnBhdGggKTtcbiAgICAgICAgICAgIG9iakxvYWRlci5sb2FkKCBtb2RlbEluZm8ub2JqRmlsZSwgKCBvYmplY3QgKSA9PiB7XG4gICAgICAgICAgICAgICAgbG9hZGVkQ2FsbGJhY2sob2JqZWN0KTtcbiAgICAgICAgICAgIH0sIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBMb2FkSlNPTihwYXRoLCBsb2FkZWRDYWxsYmFjaykge1xuXG4gICAgICAgIHZhciBvblByb2dyZXNzID0gZnVuY3Rpb24oIHhociApIHtcbiAgICAgICAgICAgIGlmICggeGhyLmxlbmd0aENvbXB1dGFibGUgKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IHhoci5sb2FkZWQgLyB4aHIudG90YWwgKiAxMDA7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIE1hdGgucm91bmQoIHBlcmNlbnRDb21wbGV0ZSwgMiApICsgJyUgZG93bmxvYWRlZCcgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9uRXJyb3IgPSBmdW5jdGlvbiggeGhyICkge1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuSlNPTkxvYWRlcigpO1xuICAgICAgICBsb2FkZXIubG9hZCggcGF0aCwgKCBnZW9tZXRyeSwgbWF0ZXJpYWxzICkgPT4ge1xuICAgICAgICAgICAgLy8gQXBwbHkgc2tpbm5pbmcgdG8gZWFjaCBtYXRlcmlhbCBzbyB0aGUgdmVydHMgYXJlIGFmZmVjdGVkIGJ5IGJvbmUgbW92ZW1lbnRcbiAgICAgICAgICAgIGZvcihsZXQgbWF0IG9mIG1hdGVyaWFscyl7XG4gICAgICAgICAgICAgICAgbWF0LnNraW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBtZXNoID0gbmV3IFRIUkVFLlNraW5uZWRNZXNoKCBnZW9tZXRyeSwgbmV3IFRIUkVFLk11bHRpTWF0ZXJpYWwoIG1hdGVyaWFscyApICk7XG4gICAgICAgICAgICBtZXNoLm5hbWUgPSBcIkpvblwiO1xuICAgICAgICAgICAgbG9hZGVkQ2FsbGJhY2sobWVzaCk7XG4gICAgICAgIH0sIG9uUHJvZ3Jlc3MsIG9uRXJyb3IpO1xuICAgIH1cblxuICAgIHN0YXRpYyBMb2FkRkJYKHBhdGgsIGxvYWRlZENhbGxiYWNrKSB7XG4gICAgICAgIGxldCBtYW5hZ2VyID0gbmV3IFRIUkVFLkxvYWRpbmdNYW5hZ2VyKCk7XG4gICAgICAgIG1hbmFnZXIub25Qcm9ncmVzcyA9IGZ1bmN0aW9uKCBpdGVtLCBsb2FkZWQsIHRvdGFsICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coIGl0ZW0sIGxvYWRlZCwgdG90YWwgKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgb25Qcm9ncmVzcyA9IGZ1bmN0aW9uKCB4aHIgKSB7XG4gICAgICAgICAgICBpZiAoIHhoci5sZW5ndGhDb21wdXRhYmxlICkge1xuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSB4aHIubG9hZGVkIC8geGhyLnRvdGFsICogMTAwO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBNYXRoLnJvdW5kKCBwZXJjZW50Q29tcGxldGUsIDIgKSArICclIGRvd25sb2FkZWQnICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvbkVycm9yID0gZnVuY3Rpb24oIHhociApIHtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLkZCWExvYWRlciggbWFuYWdlciApO1xuICAgICAgICBsb2FkZXIubG9hZCggcGF0aCwgKCBvYmplY3QgKSA9PiB7XG4gICAgICAgICAgICBsb2FkZWRDYWxsYmFjayhvYmplY3QpO1xuICAgICAgICB9LCBvblByb2dyZXNzLCBvbkVycm9yICk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCB7IE1vZGVsTG9hZGVyIH07IiwiY2xhc3MgRGV0ZWN0b3Ige1xuXG4gICAgLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzExODcxMDc3L3Byb3Blci13YXktdG8tZGV0ZWN0LXdlYmdsLXN1cHBvcnRcbiAgICBzdGF0aWMgSGFzV2ViR0woKSB7XG4gICAgICAgIGlmICghIXdpbmRvdy5XZWJHTFJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLFxuICAgICAgICAgICAgICAgICAgICBuYW1lcyA9IFtcIndlYmdsXCIsIFwiZXhwZXJpbWVudGFsLXdlYmdsXCIsIFwibW96LXdlYmdsXCIsIFwid2Via2l0LTNkXCJdLFxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBmYWxzZTtcblxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTw0O2krKykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChuYW1lc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0LmdldFBhcmFtZXRlciA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlYkdMIGlzIGVuYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlKSB7fVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXZWJHTCBpcyBzdXBwb3J0ZWQsIGJ1dCBkaXNhYmxlZFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdlYkdMIG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBHZXRFcnJvckhUTUwobWVzc2FnZSA9IG51bGwpe1xuICAgICAgICBpZihtZXNzYWdlID09IG51bGwpe1xuICAgICAgICAgICAgbWVzc2FnZSA9IGBZb3VyIGdyYXBoaWNzIGNhcmQgZG9lcyBub3Qgc2VlbSB0byBzdXBwb3J0IFxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly9raHJvbm9zLm9yZy93ZWJnbC93aWtpL0dldHRpbmdfYV9XZWJHTF9JbXBsZW1lbnRhdGlvblwiPldlYkdMPC9hPi4gPGJyPlxuICAgICAgICAgICAgICAgICAgICAgICAgRmluZCBvdXQgaG93IHRvIGdldCBpdCA8YSBocmVmPVwiaHR0cDovL2dldC53ZWJnbC5vcmcvXCI+aGVyZTwvYT4uYDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwibm8td2ViZ2wtc3VwcG9ydFwiPlxuICAgICAgICA8cCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjtcIj4ke21lc3NhZ2V9PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgYFxuICAgIH1cblxufVxuXG5leHBvcnQgeyBEZXRlY3RvciB9OyJdfQ==
