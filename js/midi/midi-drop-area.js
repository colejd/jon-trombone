
/**
 * Drop-in drag and drop support for the MidiController
 */
export class MidiDropArea {
    constructor(controller){
        this.controller = controller;

        this.dropArea = document.createElement("div");

        this.dropArea.style.position = "absolute";
        this.dropArea.style.top = "0";
        this.dropArea.style.left = "0";
        this.dropArea.style.width = "100%";
        this.dropArea.style.height = "100%";

        this.MakeDroppable(this.dropArea, (files) => {
            //read the file
			var reader = new FileReader();
			reader.onload = (e) => {
				this.controller.midiController.LoadSongDirect(reader.result);
			};
			reader.readAsBinaryString(files[0]);
        });

        this.controller.container.appendChild(this.dropArea);

    }

    Callback(){
        console.log("Callback");
    }

    // From http://bitwiser.in/2015/08/08/creating-dropzone-for-drag-drop-file.html
    MakeDroppable(element, callback) {

        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('multiple', true);
        input.style.display = 'none';

        input.addEventListener('change', triggerCallback);
        element.appendChild(input);
        
        element.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            element.classList.add('dragover');
        });

        element.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            element.classList.remove('dragover');
        });

        element.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            element.classList.remove('dragover');
            triggerCallback(e);
        });
        
        // element.addEventListener('click', function() {
        //     input.value = null;
        //     input.click();
        // });

        function triggerCallback(e) {
            var files;
            if(e.dataTransfer) {
            files = e.dataTransfer.files;
            } else if(e.target) {
            files = e.target.files;
            }
            callback.call(null, files);
        }
    }

    
}