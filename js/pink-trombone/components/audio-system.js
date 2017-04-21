class AudioSystem {  

    constructor(trombone) {
        this.trombone = trombone;

        this.blockLength = 512;
        this.blockTime = 1;
        this.soundOn = false;

        this.useWhiteNoise = true;
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
    
    createWhiteNoiseNode(frameCount) {
        var myArrayBuffer = this.audioContext.createBuffer(1, frameCount, this.trombone.sampleRate);

        var nowBuffering = myArrayBuffer.getChannelData(0);
        for (var i = 0; i < frameCount; i++) 
        {
            nowBuffering[i] = this.useWhiteNoise ? Math.random() : 1.0;// gaussian();
        }

        var source = this.audioContext.createBufferSource();
        source.buffer = myArrayBuffer;
        source.loop = true;

        return source;
    }
    
    
    doScriptProcessor(event) {
        var inputArray1 = event.inputBuffer.getChannelData(0);
        var inputArray2 = event.inputBuffer.getChannelData(1);
        var outArray = event.outputBuffer.getChannelData(0);
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