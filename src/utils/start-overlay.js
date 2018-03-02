class StartOverlay {

    constructor(container, audioContext) {
        this.container = container

        let overlay = document.createElement("div")
        this.container.appendChild(overlay)
        overlay.style.cssText = `
            width: 100%;
            height: 100%;
            text-align: center;
            position: absolute;
            left: 0;
            top: 0;
            display: block;
            background-color: rgba(0, 0, 0, 0.5);
        `

        overlay.addEventListener("touchstart", () => {
            // create empty buffer
            var buffer = audioContext.createBuffer(1, 1, 22050)
            var source = audioContext.createBufferSource()
            source.buffer = buffer
            // connect to output (your speakers)
            source.connect(audioContext.destination)
            // play the file
            source.noteOn(0)
            console.log("Unlocked iOS audio")

            // Remove the overlay
            overlay.remove()
        }, false)

        overlay.addEventListener("click", () => {
            // create empty buffer
            var buffer = audioContext.createBuffer(1, 1, 22050)
            var source = audioContext.createBufferSource()
            source.buffer = buffer
            // connect to output (your speakers)
            source.connect(audioContext.destination)
            // play the file
            source.noteOn(0)
            console.log("Unlocked iOS audio")

            // Remove the overlay
            overlay.remove()
        }, false)

    }

}

export { StartOverlay }