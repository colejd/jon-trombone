import { Detector } from "./utils/webgl-detect.js";
import { JonTrombone } from "./jon-trombone.js";

// Optionally bundle three.js as part of the project
//import THREELib from "three-js";
//var THREE = THREELib(); // return THREE JS

let container = document.getElementById("jon-trombone-container");

/**
 * Creates and attaches a GUI to the page if DAT.GUI is included.
 */
var AttachGUI = function(){
    if(typeof(dat) === "undefined"){
        console.log("No DAT.GUI instance found. Import on the page to use!");
        return;
    }

    var gui = new dat.GUI({
    });

    var jon = window.jonTrombone;

    gui.add(jon.trombone, 'ToggleMute');

    var jonGUI = gui.addFolder("Jon");
    jonGUI.add(jon, "moveJaw")
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
}

if ( !Detector.HasWebGL() ) {
    //exit("WebGL is not supported on this browser.");
    console.log("WebGL is not supported on this browser.");
    container.innerHTML = Detector.GetErrorHTML();
    container.classList.add("no-webgl");
}
else{
    window.jonTrombone = new JonTrombone(container);
    AttachGUI();
}