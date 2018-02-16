

class AudioSystem {  

    constructor(trombone) {
        this.trombone = trombone;

        this.blockLength = 512; // Turn this up if you get popping.
        this.blockTime = 1;
        this.soundOn = false;

    }

    init() {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        this.audioContext = new window.AudioContext();
        this.sampleRate = this.audioContext.sampleRate;
        
        this.blockTime = this.blockLength/this.sampleRate;

        this.processors = [];
    }
    
    startSound() {
        for (let i = 0; i < this.trombone.voices.length; i++) {
            //scriptProcessor may need a dummy input channel on iOS
            let scriptProcessor = this.audioContext.createScriptProcessor(this.blockLength, 2, 1);
            scriptProcessor.connect(this.audioContext.destination);
            scriptProcessor.onaudioprocess = (e) => {this.doScriptProcessor(e, i)};
        
            var whiteNoise = this.createWhiteNoiseNode(2 * this.sampleRate); // 2 seconds of noise
            
            var aspirateFilter = this.audioContext.createBiquadFilter();
            aspirateFilter.type = "bandpass";
            aspirateFilter.frequency.value = 500;
            aspirateFilter.Q.value = 0.5;
            whiteNoise.connect(aspirateFilter);  // Use white noise as input for filter
            aspirateFilter.connect(scriptProcessor);  // Use this as input 0 for script processor
            
            var fricativeFilter = this.audioContext.createBiquadFilter();
            fricativeFilter.type = "bandpass";
            fricativeFilter.frequency.value = 1000;
            fricativeFilter.Q.value = 0.5;
            whiteNoise.connect(fricativeFilter);  // Use white noise as input
            fricativeFilter.connect(scriptProcessor);  // Use this as input 1 for script processor
            
            whiteNoise.start(0);
            this.processors.push(scriptProcessor);
        }
    }
    
    createWhiteNoiseNode(frameCount) {
        var myArrayBuffer = this.audioContext.createBuffer(1, frameCount, this.sampleRate);

        var nowBuffering = myArrayBuffer.getChannelData(0);
        for (var i = 0; i < frameCount; i++) 
        {
            nowBuffering[i] = Math.random();// gaussian();
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
    
    
    doScriptProcessor(event, index) {
        var inputArray1 = event.inputBuffer.getChannelData(0);  // Glottis input
        var inputArray2 = event.inputBuffer.getChannelData(1);  // Tract input
        var outArray = event.outputBuffer.getChannelData(0);  // Output (mono)

        let voice = this.trombone.voices[index];

        let N = outArray.length;
        for (var j = 0; j < N; j++)
        {
            var lambda1 = j/N; // Goes from 0 to 1
            var lambda2 = (j+0.5)/N;
            var glottalOutput = voice.glottis.runStep(lambda1, inputArray1[j]); 
            
            var vocalOutput = 0;
            //Tract runs at twice the sample rate 
            voice.tract.runStep(glottalOutput, inputArray2[j], lambda1);
            vocalOutput += voice.tract.lipOutput + voice.tract.noseOutput;
            voice.tract.runStep(glottalOutput, inputArray2[j], lambda2);
            vocalOutput += voice.tract.lipOutput + voice.tract.noseOutput;
            outArray[j] = vocalOutput * 0.125;
        }
        // if(this.trombone.controller.notes !== undefined){
        //     for (var noteIndex = 1; noteIndex < this.trombone.controller.notes.length; noteIndex++){
        //         if(noteIndex > this.numVoices - 1) return;
        //         let note = this.trombone.controller.notes[noteIndex];
        //         //console.log(note);

        //     }
        // }
        voice.glottis.finishBlock();
        voice.tract.finishBlock();
    }
    
    mute() {
        this.scriptProcessor.disconnect();
    }
    
    unmute() {
        this.scriptProcessor.connect(this.audioContext.destination); 
    }
    
}

exports.AudioSystem = AudioSystem;