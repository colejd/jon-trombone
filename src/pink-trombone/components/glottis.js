//import noise from "../noise.js";

import { Noise } from "../noise.js";

class Glottis {

    constructor(trombone, id) {
        this.trombone = trombone;
        this.noise = new Noise();
        this.noise.seed(Date.now() + id);

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

        this.baseNote = 87.3071; //F

        this.output;

        /// Allow pitch to wobble over time
        this.addPitchVariance = true;
        /// Allow tenseness to wobble over time
        this.addTensenessVariance = true;

    }
    
    init() {
        this.setupWaveform(0);
    }
        
    runStep(lambda, noiseSource) {
        var timeStep = 1.0 / this.trombone.audioSystem.sampleRate;
        this.timeInWaveform += timeStep;
        this.totalTime += timeStep;
        if (this.timeInWaveform > this.waveformLength) 
        {
            this.timeInWaveform -= this.waveformLength;
            this.setupWaveform(lambda);
        }
        var out = this.normalizedLFWaveform(this.timeInWaveform/this.waveformLength);
        var aspiration = this.intensity*(1.0-Math.sqrt(this.UITenseness))*this.getNoiseModulator()*noiseSource;
        aspiration *= 0.2 + 0.02 * this.noise.simplex1(this.totalTime * 1.99);
        out += aspiration;
        return out;
    }
    
    getNoiseModulator() {
        var voiced = 0.1+0.2*Math.max(0,Math.sin(Math.PI*2*this.timeInWaveform/this.waveformLength));
        //return 0.3;
        return this.UITenseness* this.intensity * voiced + (1-this.UITenseness* this.intensity ) * 0.3;
    }
    
    finishBlock() {
        var vibrato = 0;
        if (this.addPitchVariance) {
            // Add small imperfections to the vocal output
            vibrato += this.vibratoAmount * Math.sin(2*Math.PI * this.totalTime *this.vibratoFrequency);          
            vibrato += 0.02 * this.noise.simplex1(this.totalTime * 4.07);
            vibrato += 0.04 * this.noise.simplex1(this.totalTime * 2.15);
        }
        
        if (this.trombone.autoWobble)
        {
            vibrato += 0.2 * this.noise.simplex1(this.totalTime * 0.98);
            vibrato += 0.4 * this.noise.simplex1(this.totalTime * 0.5);
        }

        if (this.UIFrequency>this.smoothFrequency) 
            this.smoothFrequency = Math.min(this.smoothFrequency * 1.1, this.UIFrequency);
        if (this.UIFrequency<this.smoothFrequency) 
            this.smoothFrequency = Math.max(this.smoothFrequency / 1.1, this.UIFrequency);
        this.oldFrequency = this.newFrequency;
        this.newFrequency = this.smoothFrequency * (1+vibrato);
        this.oldTenseness = this.newTenseness;

        if (this.addTensenessVariance)
            this.newTenseness = this.UITenseness + 0.1*this.noise.simplex1(this.totalTime*0.46)+0.05*this.noise.simplex1(this.totalTime*0.36);
        else
            this.newTenseness = this.UITenseness;

        if (!this.isTouched && this.trombone.alwaysVoice) this.newTenseness += (3-this.UITenseness)*(1-this.intensity);
        
        if (this.isTouched || this.trombone.alwaysVoice)
            this.intensity += 0.13;
        this.intensity = Math.clamp(this.intensity, 0, 1);
    }
    
    /// Queues up a single wave?
    setupWaveform(lambda) {
        this.frequency = this.oldFrequency*(1-lambda) + this.newFrequency*lambda;
        var tenseness = this.oldTenseness*(1-lambda) + this.newTenseness*lambda;
        this.Rd = 3*(1-tenseness);
        this.waveformLength = 1.0/this.frequency;
        
        var Rd = this.Rd;
        if (Rd<0.5) Rd = 0.5;
        if (Rd>2.7) Rd = 2.7;
        // normalized to time = 1, Ee = 1
        var Ra = -0.01 + 0.048*Rd;
        var Rk = 0.224 + 0.118*Rd;
        var Rg = (Rk/4)*(0.5+1.2*Rk)/(0.11*Rd-Ra*(0.5+1.2*Rk));
        
        var Ta = Ra;
        var Tp = 1 / (2*Rg);
        var Te = Tp + Tp*Rk; //
        
        var epsilon = 1/Ta;
        var shift = Math.exp(-epsilon * (1-Te));
        var Delta = 1 - shift; //divide by this to scale RHS
           
        var RHSIntegral = (1/epsilon)*(shift - 1) + (1-Te)*shift;
        RHSIntegral = RHSIntegral/Delta;
        
        var totalLowerIntegral = - (Te-Tp)/2 + RHSIntegral;
        var totalUpperIntegral = -totalLowerIntegral;
        
        var omega = Math.PI/Tp;
        var s = Math.sin(omega*Te);
        var y = -Math.PI*s*totalUpperIntegral / (Tp*2);
        var z = Math.log(y);
        var alpha = z/(Tp/2 - Te);
        var E0 = -1 / (s*Math.exp(alpha*Te));
        this.alpha = alpha;
        this.E0 = E0;
        this.epsilon = epsilon;
        this.shift = shift;
        this.Delta = Delta;
        this.Te=Te;
        this.omega = omega;
    }
    
 
    normalizedLFWaveform(t) {     
        if (t>this.Te) this.output = (-Math.exp(-this.epsilon * (t-this.Te)) + this.shift)/this.Delta;
        else this.output = this.E0 * Math.exp(this.alpha*t) * Math.sin(this.omega * t);
     
        return this.output * this.intensity * this.loudness;
    }
}

export { Glottis };