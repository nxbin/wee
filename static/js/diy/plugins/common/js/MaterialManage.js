function MaterialManage(path, format) {
    this.material = null;
    this.wordMaterial = null;
    this.parameters = {
        "materialName" : "925silver", // 925silver, 18kgold_red, 18kgold_yellow, 18kgold_white, gesso
        "technology" : "mirror" // mirror, frosted
    };
    this.createMaterial(path, format);
};

MaterialManage.prototype = {
    createMaterial : function(path, format) {
        var urls = [
                path + 'cubemaps/common/05/px' + format, path + 'cubemaps/common/05/nx' + format,
                path + 'cubemaps/common/05/py' + format, path + 'cubemaps/common/05/ny' + format,
                path + 'cubemaps/common/05/pz' + format, path + 'cubemaps/common/05/nz' + format
            ];
        var blur_urls = [
                path + 'cubemaps/common/01/blur/px' + format, path + 'cubemaps/common/01/blur/nx' + format,
                path + 'cubemaps/common/01/blur/py' + format, path + 'cubemaps/common/01/blur/ny' + format,
                path + 'cubemaps/common/01/blur/pz' + format, path + 'cubemaps/common/01/blur/nz' + format
            ];
        this.reflectionCube = THREE.ImageUtils.loadTextureCube(urls);
        this.reflectionBlurCube = THREE.ImageUtils.loadTextureCube(blur_urls);
        this.reflectionCube.format = THREE.RGBFormat;
        this.reflectionBlurCube.format = THREE.RGBFormat;
        this.material = new THREE.MeshPhongMaterial({
            shading: THREE.SmoothShading,
            metal : true,
            wireframe : false,
            side : 2
        });

        this.wordMaterial = this.material.clone();
        this.update();
    },

    setMaterialName : function(materialName) {
        if(this.parameters["materialName"] === materialName) return;
        this.parameters["materialName"] = materialName;
        this.update();
    },

    setMakeTechnology : function(tec) {
        if(this.parameters["technology"] === tec) return;
        this.parameters["technology"] = tec;
        this.update();
    },

    update : function() {
        var materials = [this.material, this.wordMaterial];

        for(var i=0; i<materials.length; i++) {
            if(this.parameters["materialName"] === "925silver") {
                // materials[i].color.setRGB(0.7, 0.7, 0.7);
                // materials[i].color.setRGB(0.50754, 0.50754, 0.50754);
                // materials[i].color.setRGB(, 0.65, 0.65);
                materials[i].color.setStyle("#ffffff");
                materials[i].ambient.setRGB(0.19225, 0.19225, 0.19225);
                materials[i].envMap = this.reflectionCube;
                // materials[i].specular.setRGB(0.508273, 0.508273, 0.508273);
                materials[i].specular.setStyle("#ffffff");
                if(this.parameters["technology"] === "mirror") {
                    materials[i].reflectivity = 0.75;
                    materials[i].shininess = 54;
                } else if(this.parameters["technology"] === "frosted") {
                    materials[i].reflectivity = 0.35;
                    materials[i].shininess = 10;
                }
                
                materials[i].combine = THREE.MixOperation;
            } else if(this.parameters["materialName"] === "18kgold_red") {
                // materials[i].color.setRGB(1, 0.69, 0.72);
                materials[i].color.setStyle("#febaa3")
                // materials[i].ambient.setRGB(0.253, 0.192, 0.134);
                materials[i].envMap = this.reflectionCube;
                materials[i].specular.setStyle("#333333");
                // materials[i].specular.setRGB(0.569, 0.569, 0.569);
                if(this.parameters["technology"] === "mirror") {
                    materials[i].reflectivity = 0.55;
                    materials[i].shininess = 40;
                } else if(this.parameters["technology"] === "frosted") {
                    materials[i].reflectivity = 0.35;
                    materials[i].shininess = 10;
                }

                materials[i].combine = THREE.MixOperation;
            } else if(this.parameters["materialName"] === "18kgold_yellow") {
                // materials[i].color.setRGB(0.75164, 0.60648, 0.22648);
                materials[i].color.setStyle("#ffce42")
                materials[i].ambient.setRGB(0.24725, 0.1995, 0.0745)
                materials[i].envMap = this.reflectionCube;
                // materials[i].specular.setRGB(0.628281, 0.555805, 0.366065);
                materials[i].specular.setStyle("#333333");
                if(this.parameters["technology"] === "mirror") {
                    materials[i].reflectivity = 0.55;
                    materials[i].shininess = 40;
                } else if(this.parameters["technology"] === "frosted") {
                    materials[i].reflectivity = 0.35;
                    materials[i].shininess = 10;
                }
                materials[i].combine = THREE.MixOperation;
            } else if(this.parameters["materialName"] === "18kgold_white") {
                // materials[i].color.setRGB(0.7, 0.7, 0.7);
                // materials[i].color.setRGB(0.50754, 0.50754, 0.50754);
                // materials[i].color.setRGB(, 0.65, 0.65);
                materials[i].color.setStyle("#ffffff");
                materials[i].ambient.setRGB(0.19225, 0.19225, 0.19225);
                materials[i].envMap = this.reflectionCube;
                // materials[i].specular.setRGB(0.508273, 0.508273, 0.508273);
                materials[i].specular.setStyle("#ffffff");
                if(this.parameters["technology"] === "mirror") {
                    materials[i].reflectivity = 0.75;
                    materials[i].shininess = 54;
                } else if(this.parameters["technology"] === "frosted") {
                    materials[i].reflectivity = 0.35;
                    materials[i].shininess = 10;
                }
                
                materials[i].combine = THREE.MixOperation;
            } else if(this.parameters["materialName"] === "gesso") {
                materials[i].color.setRGB(0.8, 0.8, 0.8);
                materials[i].specular.setRGB(0.1, 0.1, 0.1);
                materials[i].shininess = 20;
                materials[i].reflectivity = 0.01;
            }
            materials[i].needsUpdate = true;
        }
    },

    setEmissiveTo0 : function(wm) {
        if (wm) {
            var step = 0.01;
            if(wm.emissive.r > 0) wm.emissive.r -= step; 
            else if(wm.emissive.r < 0) wm.emissive.r = 0;

            if(wm.emissive.g > 0) wm.emissive.g -= step; 
            else if(wm.emissive.g < 0) wm.emissive.g = 0;

            if(wm.emissive.b > 0) wm.emissive.b -= step; 
            else if(wm.emissive.b < 0) wm.emissive.b = 0;
        }
    }
};