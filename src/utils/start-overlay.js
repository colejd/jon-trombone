import StartAudioContext from 'startaudiocontext'

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

        overlay.innerHTML = `
            <div style="position: absolute; margin: auto; top: 0; right: 0; bottom: 0; left: 0; width: 100px; height: 100px;">
                <p class="jon-trombone-audio-overlay-text">
                    Tap here to begin.
                </p>
            </div>
        `

        StartAudioContext(audioContext, overlay, () => {
            console.log("Unlocked iOS audio")
            overlay.remove()
        })

    }

}

export { StartOverlay }