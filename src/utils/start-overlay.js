import StartAudioContext from 'startaudiocontext'

class StartOverlay {

    constructor(container, audioContext) {

        var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
        if (!iOS) {
            return
        }

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
            background-color: rgba(0, 0, 0, 0.75);
        `

        let overlayText = document.createElement("div")
        overlay.appendChild(overlayText);
        overlayText.style.cssText = `
            position: relative;
            top: 50%;
            transform: translateY(-50%); 

            font-weight: bold;
            font-size: 50px;
            color: white;

            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
        `
        overlayText.innerHTML = `
                Tap here to begin.
        `

        StartAudioContext(audioContext, overlay, () => {
            console.log("Unlocked iOS audio")
            overlay.remove()
        })

    }

}

export { StartOverlay }