import { Detector } from "./utils/webgl-detect.js";
import { JonTrombone } from "./jon-trombone.js";

// Optionally bundle three.js as part of the project
//import THREELib from "three-js";
//var THREE = THREELib(); // return THREE JS

let container = document.getElementById("jon-trombone-container");

if ( !Detector.HasWebGL() ) {
    //exit("WebGL is not supported on this browser.");
    console.log("WebGL is not supported on this browser.");
    container.innerHTML = Detector.GetErrorHTML();
    container.classList.add("no-webgl");
}
else{
    let jonTrombone = new JonTrombone(container);
}