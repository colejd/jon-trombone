import { ModelLoader } from "./utils/model-loader.js";
import { PinkTrombone } from "./pink-trombone/pink-trombone.js";

class JonTrombone {
    constructor(container) {
        this.container = container;
        this.container.style.position = "relative";

        // Set up renderer and embed in container
        this.renderer = new THREE.WebGLRenderer( { alpha: true } );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // Set up scene and view
        let aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera = new THREE.PerspectiveCamera( 45, aspect, 0.1, 100 );
        this.scene = new THREE.Scene();

        // Set up clock for timing
        this.clock = new THREE.Clock();

        //window.scene = this.scene;

        let startDelayMS = 1000;
        this.trombone = new PinkTrombone();
        setTimeout(()=> {
            this.trombone.StartAudio();
            this.moveJaw = true;
        }, startDelayMS);

        // Mute button for trombone
        let button = document.createElement("button");
        button.innerHTML = "Mute";
        button.style.cssText = "position: absolute; display: block; top: 0; left: 0;";
        this.container.appendChild(button);
        button.addEventListener ("click", () => {
            this.trombone.ToggleMute();
            button.innerHTML = this.trombone.muted ? "Unmute" : "Mute";
        });

        this.jawFlapSpeed = 20.0;
        this.jawOpenOffset = 0.19;
        this.moveJaw = false;

        this.SetUpThree();
        this.SetUpScene();

        // Start the update loop
        this.OnUpdate();
    }

    SetUpThree() {
        // Add orbit controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set( 0, 0, 0 );
        this.controls.update();
    }

    SetUpScene() {

        // Set camera position
        this.camera.position.set( 0, 0, 0.5 );

        // Lights
        let light1 = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
        light1.name = "Hemisphere Light";
        light1.position.set(0, 1, 0);
        this.scene.add(light1);

        let light2 = new THREE.DirectionalLight(0xffffff, 1.0);
        light2.name = "Directional Light";
        light2.position.set(0, 1, 0);
        this.scene.add(light2);

        // Load the Jon model and place it in the scene
        ModelLoader.LoadJSON("../resources/jon/three/jon.json", (object) => {
            this.jon = object;
            this.scene.add( this.jon );
            this.jon.rotation.y = (THREE.Math.degToRad(15));

            this.jaw = this.jon.skeleton.bones.find((obj) => {
                return obj.name == "Bone.006";
            });
            if(this.jaw){
                this.jawShutZ = this.jaw.position.z;
            }
        });


    }

    OnUpdate() {
        let deltaTime = this.clock.getDelta();
        requestAnimationFrame( this.OnUpdate.bind(this) );

        if(this.jaw && this.moveJaw){
            let time = this.clock.getElapsedTime();// % 60;

            // Move the jaw
            let percent = (Math.sin(time * this.jawFlapSpeed) + 1.0) / 2.0;
            this.jaw.position.z = this.jawShutZ + (percent * this.jawOpenOffset);

            // Make the audio match the jaw position
            this.trombone.TractUI.Buh(1.0 - percent);
        }

        // Render
        this.renderer.render(this.scene, this.camera);
    }

}

export { JonTrombone };