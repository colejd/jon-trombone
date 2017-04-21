class ModelLoader {

    /**
     * Loads a model asynchronously. Expects an object containing
     * the path to the object, the relative path of the OBJ file,
     * and the relative path of the MTL file.
     * 
     * An example:
     * let modelInfo = {
     *      path: "../resources/obj/",
     *      objFile: "test.obj",
     *      mtlFile: "test.mtl"
     * }
     */
    static LoadOBJ(modelInfo, loadedCallback) {

        var onProgress = function( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
            }
        };
        var onError = function( xhr ) {
        };

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath( modelInfo.path );

        mtlLoader.load( modelInfo.mtlFile, ( materials ) => {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( modelInfo.path );
            objLoader.load( modelInfo.objFile, ( object ) => {
                loadedCallback(object);
            }, onProgress, onError );
            
        });

    }

    static LoadJSON(path, loadedCallback) {

        var onProgress = function( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
            }
        };
        var onError = function( xhr ) {
        };

        var loader = new THREE.JSONLoader();
        loader.load( path, ( geometry, materials ) => {
            // Apply skinning to each material so the verts are affected by bone movement
            for(let mat of materials){
                mat.skinning = true;
            }
            let mesh = new THREE.SkinnedMesh( geometry, new THREE.MultiMaterial( materials ) );
            mesh.name = "Jon";
            loadedCallback(mesh);
        }, onProgress, onError);
    }

    static LoadFBX(path, loadedCallback) {
        let manager = new THREE.LoadingManager();
        manager.onProgress = function( item, loaded, total ) {
            console.log( item, loaded, total );
        };

        var onProgress = function( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
            }
        };
        var onError = function( xhr ) {
        };

        var loader = new THREE.FBXLoader( manager );
        loader.load( path, ( object ) => {
            loadedCallback(object);
        }, onProgress, onError );
    }

}

export { ModelLoader };