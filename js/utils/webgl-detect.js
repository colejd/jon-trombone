class Detector {

    //http://stackoverflow.com/questions/11871077/proper-way-to-detect-webgl-support
    static HasWebGL() {
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                    names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                context = false;

            for(var i=0;i<4;i++) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter == "function") {
                        // WebGL is enabled
                        return true;
                    }
                } catch(e) {}
            }

            // WebGL is supported, but disabled
            return false;
        }
        // WebGL not supported
        return false;
    }

    static GetErrorHTML(message = null){
        if(message == null){
            message = `Your graphics card does not seem to support 
                        <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>. <br>
                        Find out how to get it <a href="http://get.webgl.org/">here</a>.`;
        }
        return `
        <div class="no-webgl-support">
        <p style="text-align: center;">${message}</p>
        </div>
        `
    }

}

export { Detector };