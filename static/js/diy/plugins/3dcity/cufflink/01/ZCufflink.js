function ZCufflink(materialManage, publicKey) {
    this.zGeometry = new ZGeometry();

    this.material = materialManage.material;
    this.wordMaterial = materialManage.wordMaterial;
    this.parent = new THREE.Object3D();

    // 定义文字mesh
    this.textMesh = null;

    // 定义吊坠mesh
    this.cufflinkMesh = null;
    this.cufflinkBoundingBox = null;

    // 尺子
    this.zPreview = new Utils.ZBoundingSizePreview();
    this.parent.add(this.zPreview.ZPreviewGroup);
    this.zPreview.setVisible(false);

    // 吊坠的体积
    this.cufflinkVolume = 0;
};

ZCufflink.prototype = {
    // 导入吊坠
    importPendant : function(publicKey, callback) {
        var self = this;
        // 导入袖扣模型
        var zGeometry = new Utils.ZGeometry();
        zGeometry.parse(publicKey + "/js/diy/plugins/common/meshes/cufflinks/cufflink01.mesh", function(g) {
            self.cufflinkMesh = new THREE.Mesh(g, self.material);
            g.computeBoundingBox();
            self.parent.add(self.cufflinkMesh);

            self.cufflinkBoundingBox = g.boundingBox;

            // 得到袖扣的体积
            self.cufflinkVolume = Utils.computeModelVolume(g);

            if(callback !== undefined) {
                callback();
            }
        });
    },

    // 袖扣
    create : function(inputParameters){ 
        // 删除文字
        this.parent.remove(this.textMesh);

        function set(tg, tm, nl) {
            var tw = tg.boundingBox.max.x - tg.boundingBox.min.x,
                th = tg.boundingBox.max.y - tg.boundingBox.min.y,
                s = nl / th;
            
            tm.scale.set(s, s, 1);
            return tw*s;
        }
        
        var fws = Utils.getFontParas(inputParameters.textFont);
        
        var bevel_size = 0.2, _height = 10;
        if(inputParameters.textValue.length > 0) {
            var words = Utils.limtWordsToSize(inputParameters.textValue.split(""), 2);
            var shapesList = [], word;
            for(var i=0; i<words.length; i++) {
                word = words[i].toUpperCase();
                if(word in ZDiyCurves["mierYangWords"]) { // 米尔杨设计26个大写字母
                    shapesList.push(ZDiyCurves.generateShapes(ZDiyCurves["mierYangWords"][word]));
                }
            }
            
            var wordGeometries = Utils.generateGeometriesFromShpesList(shapesList, 1, bevel_size, 0, 0, 0, 20, _height).geometries;

            var wordGeometry = this.zGeometry.joinGeometries(wordGeometries, true, 0.1, 0.1).geometry;
            
            // THREE.SoftenGeometryNormal(wordGeometry, 15);
            // 重新计算法线
            wordGeometry.computeFaceNormals();
            wordGeometry.computeVertexNormals(true);

            this.textMesh = new THREE.Mesh(wordGeometry, this.wordMaterial);

            // 更新文字材质的颜色
            this.wordMaterial.emissive.setStyle(ZDIYCONFIGURE.CHANGEWORDMATERIALCOLOR);
                
            var _px = -(wordGeometry.boundingBox.max.x+wordGeometry.boundingBox.min.x)/2, 
                _py = -(wordGeometry.boundingBox.max.y+wordGeometry.boundingBox.min.y)/2+1, 
                _pz = 6;

            this.textMesh.position.set(_px, _py, _pz);

            // this.textMesh.rotation.set(0, 0, -Math.PI/2);

            this.parent.add(this.textMesh);

            // 更新尺子
            if(this.cufflinkBoundingBox !== null) {
                var bbx = this.cufflinkBoundingBox.clone();
                this.zGeometry.mergeBoundingBox(bbx, wordGeometry.boundingBox, _px, _py, _pz);
                this.zPreview.update(bbx);
            }
        } else {
            this.textMesh = null;
            if(this.cufflinkBoundingBox !== null) {
                this.zPreview.update(this.cufflinkBoundingBox);
            }
        }
    },
    
    getVolume : function() {
        console.log(this.textMesh);
        if(this.textMesh)
            return this.cufflinkVolume + Utils.computeModelVolume(this.textMesh);
        else
            return this.cufflinkVolume;
    },

    saveToSTL : function(isAscii) {
        if (isAscii === undefined) isAscii = true;
        var output;
        if(isAscii) {
            output = "solid necklace\n";
            output += Utils.saveModelToAsciiSTL(this.cufflinkMesh);
            output += Utils.saveModelToAsciiSTL(this.textMesh);
            output +="endsolid necklace";
        } else {
            output = Utils.saveModelToBinarySTL([this.textMesh]);
        }
        return output;
    }
};


// html中执行

function execute() {
    var textElement = document.getElementById("web3dCufflink01Textvalue");
    // var textSizeElement = document.getElementById("web3dCufflink01Textsize");
    // var textFontElement = document.getElementById("web3dCufflink01Textfont");

    var textParas = {
        textValue : textElement.value,
        //textSize : textSizeElement.value,
        textThickness : 0.6,
        textFont : "arial_bold"//textFontElement.value
    };

    var zCufflink = new ZCufflink(materialManage, webpath); 

    zCufflink.importPendant(webpath,  function() {
        zCufflink.create(textParas);
        var v = zCufflink.getVolume() / 1000;
        Utils.getPrice(v, "web3dCufflink01Material", globalChainPrice);
    });

    viewport(canvas, zCufflink.parent, new THREE.Vector3(0, 20, 30), pmg_global_background, function(){materialManage.setEmissiveTo0(materialManage.wordMaterial);});


    if(textElement !== null) {
        textElement.onchange = function(event) {
            textParas.textValue = event.target.value;
            zCufflink.create(textParas);
            // 计算价格
            getprice();
        };
    }

    // if(textSizeElement !== null) {
    //     textSizeElement.onchange = function(event) {
    //         textParas.textSize = parseFloat(event.target.value);
    //         zCufflink.create(textParas);
    //         // 计算价格
    //         getprice();
    //     };
    // }

    return zCufflink;
};