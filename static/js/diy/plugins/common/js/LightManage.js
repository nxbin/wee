function LightManage() {
    this.directionalLight = null;
    this.createLights();
};

LightManage.prototype = {
    createLights : function() {
        // ligths
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.target = new THREE.Object3D();

        // directionalLight.castShadow = true;
        // directionalLight.shadowCameraVisible = true;

        // directionalLight.shadowMapWidth = 2048;
        // directionalLight.shadowMapHeight = 2048;

        // directionalLight.shadowCameraNear = 2;
        // directionalLight.shadowCameraFar = 1500;

        // directionalLight.shadowCameraLeft = -500;
        // directionalLight.shadowCameraRight = 500;
        // directionalLight.shadowCameraTop = 500;
        // directionalLight.shadowCameraBottom = -500;
        // directionalLight.shadowBias = -0.005;
        // directionalLight.shadowDarkness = 1;
        // this.directionalLight.add(new THREE.HemisphereLight(0xcbf1fe, 0xfff2d6, 0.2));  
        this.directionalLight.add(new THREE.AmbientLight(0xffffff));
    }
};


var ZLightManage = function() {
    this.key_light = null;
    this.aux_light = null;
    this.ambient_light = null;

    this.createKeyLight();
    this.createAuxLight();
    this.createAmbientLight();
};

ZLightManage.prototype = {
    createKeyLight : function() {
        this.key_light = new THREE.DirectionalLight(0xffffe6, 0.95);
        // this.key_light.visible = false;
    },

    createAuxLight : function() {
        this.aux_light = new THREE.DirectionalLight(0xd9d9ff, 0.75);
        // this.aux_light.visible = false;
    },

    createAmbientLight : function() {
        this.ambient_light = new THREE.HemisphereLight(0xcbf1fe, 0xfff2d6, 0.4); 
        // this.ambient_light.visible = false;       
    },

    setTarget : function(target) {
        this.key_light.target = target;
        this.aux_light.target = target;
    },

    update : function(camera, target) {
        this.key_light.position.copy(
            Utils.getPosition(Math.PI/-4, camera.up, camera.position, target)
        );
        
        this.aux_light.position.copy(
            Utils.getPosition(Math.PI/4, camera.up, camera.position, target)
        );
    },

    setKeyValues : function(parameters) {
        if(parameters.color !== undefined)
            this.key_light.color.setHex(parameters.color);
        else
            this.key_light.color.setHex(16777215);

        if(parameters.intensity !== undefined)
            this.key_light.intensity = parameters.intensity;
        else 
            this.key_light.intensity = 1;
    },

    setAuxValues : function(parameters) {
        if(parameters.color !== undefined)
            this.aux_light.color.setHex(parameters.color);
        else
            this.aux_light.color.setHex(16777215);

        if(parameters.intensity !== undefined)
            this.aux_light.intensity = parameters.intensity;
        else 
            this.aux_light.intensity = 1;
    }
};