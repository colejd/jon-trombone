class TractUI
{

    constructor(trombone) {
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
    
    init() {
        let Tract = this.trombone.Tract;

        this.setRestDiameter();
        for (var i=0; i<Tract.n; i++) 
        {
            Tract.diameter[i] = Tract.targetDiameter[i] = Tract.restDiameter[i];
        }

        this.tongueLowerIndexBound = Tract.bladeStart+2;
        this.tongueUpperIndexBound = Tract.tipStart-3;
        this.tongueIndexCentre = 0.5*(this.tongueLowerIndexBound+this.tongueUpperIndexBound);
    }
        
    getIndex(x,y) {
        let Tract = this.trombone.Tract;

        var xx = x-this.originX; var yy = y-this.originY;
        var angle = Math.atan2(yy, xx);
        while (angle> 0) angle -= 2*Math.PI;
        return (Math.PI + angle - this.angleOffset)*(Tract.lipStart-1) / (this.angleScale*Math.PI);
    }

    getDiameter(x,y) {
        var xx = x-this.originX; var yy = y-this.originY;
        return (this.radius-Math.sqrt(xx*xx + yy*yy))/this.scale;
    }
    
    setRestDiameter() {
        let Tract = this.trombone.Tract;

        for (var i=Tract.bladeStart; i<Tract.lipStart; i++)
        {
            var t = 1.1 * Math.PI*(this.tongueIndex - i)/(Tract.tipStart - Tract.bladeStart);
            var fixedTongueDiameter = 2+(this.tongueDiameter-2)/1.5;
            var curve = (1.5-fixedTongueDiameter+this.gridOffset)*Math.cos(t);
            if (i == Tract.bladeStart-2 || i == Tract.lipStart-1) curve *= 0.8;
            if (i == Tract.bladeStart || i == Tract.lipStart-2) curve *= 0.94;               
            Tract.restDiameter[i] = 1.5 - curve;
        }
    }

    Buh(progress) {

        let Tract = this.trombone.Tract;
        
        this.setRestDiameter();
        for (var i=0; i<Tract.n; i++) Tract.targetDiameter[i] = Tract.restDiameter[i];    

        // Disable this behavior if the mouth is closed a certain amount
        //if (progress > 0.8 || progress < 0.1) return;
        
        for(let i= this.index - this.radius; i <= this.index + this.radius; i++){
            if (i > Tract.targetDiameter.length || i < 0) continue;
            let interp = Math.lerp(Tract.restDiameter[i], this.target, progress);
            Tract.targetDiameter[i] = interp;
        }
    }


}

export { TractUI };