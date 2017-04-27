
export class GUI {

    /**
     * Creates and attaches a GUI to the page if DAT.GUI is included.
     */
    static Init(controller){
        if(typeof(dat) === "undefined"){
            console.warn("No DAT.GUI instance found. Import on the page to use!");
            return;
        }

        var gui = new dat.GUI();

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

}