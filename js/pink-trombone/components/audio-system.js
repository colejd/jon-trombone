class AudioSystem {  

    constructor(trombone) {
        this.trombone = trombone;

        this.blockLength = 512;
        this.blockTime = 1;
        this.soundOn = false;

    }

    init() {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        this.audioContext = new window.AudioContext();
        this.trombone.sampleRate = this.audioContext.sampleRate;
        
        this.blockTime = this.blockLength/this.trombone.sampleRate;
    }
    
    startSound() {
        //scriptProcessor may need a dummy input channel on iOS
        this.scriptProcessor = this.audioContext.createScriptProcessor(this.blockLength, 2, 1);
        this.scriptProcessor.connect(this.audioContext.destination); 
        this.scriptProcessor.onaudioprocess = this.doScriptProcessor.bind(this);
    
        var whiteNoise = this.createWhiteNoiseNode(2 * this.trombone.sampleRate); // 2 seconds of noise
        
        var aspirateFilter = this.audioContext.createBiquadFilter();
        aspirateFilter.type = "bandpass";
        aspirateFilter.frequency.value = 500;
        aspirateFilter.Q.value = 0.5;
        whiteNoise.connect(aspirateFilter);  // Use white noise as input for filter
        aspirateFilter.connect(this.scriptProcessor);  // Use this as input 0 for script processor
        
        var fricativeFilter = this.audioContext.createBiquadFilter();
        fricativeFilter.type = "bandpass";
        fricativeFilter.frequency.value = 1000;
        fricativeFilter.Q.value = 0.5;
        whiteNoise.connect(fricativeFilter);  // Use white noise as input
        fricativeFilter.connect(this.scriptProcessor);  // Use this as input 1 for script processor
        
        whiteNoise.start(0);

        // Generate just white noise (test)
        // var wn = this.createWhiteNoiseNode(2*this.trombone.sampleRate);
        // wn.connect(this.audioContext.destination);
        // wn.start(0);
    }
    
    createWhiteNoiseNode(frameCount) {
        var myArrayBuffer = this.audioContext.createBuffer(1, frameCount, this.trombone.sampleRate);

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
    
    
    doScriptProcessor(event) {
        var inputArray1 = event.inputBuffer.getChannelData(0);  // Glottis input
        var inputArray2 = event.inputBuffer.getChannelData(1);  // Tract input
        var outArray = event.outputBuffer.getChannelData(0);  // Output (mono)
        for (var j = 0, N = outArray.length; j < N; j++)
        {
            var lambda1 = j/N;
            var lambda2 = (j+0.5)/N;
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
    
    mute() {
        this.scriptProcessor.disconnect();
    }
    
    unmute() {
        this.scriptProcessor.connect(this.audioContext.destination); 
    }
    
}

exports.AudioSystem = AudioSystem;