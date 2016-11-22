function ZNecklace(materialManage, publicKey) {
    this.material = materialManage.material;
    this.wordMaterial = materialManage.wordMaterial;

    // 设置链子的位子
    this.zChain = new ZChain(this.material, publicKey, false);
    this.zChain.chainLeftMeshes.rotation.set(Math.PI / 8, 0, 0);
    this.zChain.chainLeftMeshes.position.set(0, 0, 0);
    this.zChain.chainRightMeshes.rotation.set(-Math.PI / 8, 0, 0);
    this.zChain.chainRightMeshes.position.set(0, 0, 0);
    
    this.parent = new THREE.Object3D();
    this.parent.add(this.zChain.chainLeftMeshes);
    this.parent.add(this.zChain.chainRightMeshes);

    // 定义文字mesh
    this.textMesh = null;

    // 定义吊坠mesh
    this.pendantMesh = null;

    // 尺子
    this.zPreview = new Utils.ZBoundingSizePreview();
    this.parent.add(this.zPreview.ZPreviewGroup);
    this.zPreview.setVisible(false);

    // 吊坠的体积
    this.pendantVolume = 0;
};

ZNecklace.prototype = {
    textMatrixes : {
        // 正面
        "1" : [1.985225, 0.0125804, 0.242327, 0, -0.0304901, 1.994413, 0.146245, 0, -0.0962922, -0.0595435, 0.791948, 0, -2.796619, -10.815571, 2.553654, 1], 
        "2" : [1.998011, -0.0170636, 0.0875295, 0, 0.0106989, 1.994734, 0.144646, 0, -0.0354133, -0.0576136, 0.797136, 0, -1.874856, -10.811303, 2.651284, 1], 
        "3" : [1.994551, 0, -0.147529, 0, 0.0106989, 1.994734, 0.144646, 0, 0.0588562, -0.0580165, 0.79572, 0, -0.629127, -10.812934, 2.581642, 1], 
        "4" : [1.977469, 0.0110866, -0.299155, 0, 0.0106989, 1.994734, 0.144646, 0, 0.119667, -0.0578468, 0.788881, 0, 0.169175, -10.812279, 2.513567, 1], 
        "5" : [1.95448, -0.00201386, -0.424268, 0, 0.0412899, 1.991387, 0.180758, 0, 0.168904, -0.0741612, 0.778442, 0, 1.505881, -10.816355, 2.283269, 1], 

        // 背面
        "6" : [-1.957002, -0.0782602, -0.404993, 0, -0.0474503, 1.99335, -0.155903, 0, 0.163899, -0.0571771, -0.78094, 0, 1.471661, -10.790475, -2.425154, 1], 
        "7" : [-1.982558, -0.0177622, -0.262957, 0, 0.00194697, 1.994411, -0.149398, 0, 0.10542, -0.0593403, -0.790801, 0, 0.510606, -10.775877, -2.596574, 1], 
        "8" : [-1.991721, -0.0608101, -0.171311, 0, -0.0474503, 1.99335, -0.155903, 0, 0.0701928, -0.0604773, -0.794617, 0, -0.631899, -10.810546, -2.692113, 1], 
        "9" : [-1.999071, -0.0502815, -0.0344582, 0, -0.0470507, 1.991634, -0.176583, 0, 0.0155014, -0.0702762, -0.796757, 0, -1.52699, -10.83373, -2.716115, 1], 
        "a" : [-1.99197, -0.0336644, 0.175845, 0, -0.0474503, 1.99335, -0.155903, 0, -0.0690543, -0.0637796, -0.794458, 0, -2.669211, -10.804759, -2.653199, 1]

    },

    setMatrixes : {
        "front" : {
            "1" : {
                "1" : "3"
            },
            "2" : {
                "1" : "2",
                "2" : "4"
            },
            "3" : {
                "1" : "1",
                "2" : "3",
                "3" : "5"
            }
        },
        "back" : {
            "1" : {
                "1" : "8"
            },
            "2" : {
                "1" : "7",
                "2" : "9"
            },
            "3" : {
                "1" : "6",
                "2" : "8",
                "3" : "a"
            }
        }
    },


    // 导入吊坠
    importPendant : function(publicKey, callback) {
        var self = this;
        var zGeometry = new Utils.ZGeometry();
        zGeometry.parse(publicKey + "/js/diy/plugins/common/meshes/pendants/pendant02.mesh", function(g) {
            self.pendantMesh = new THREE.Mesh(g, self.material);
            g.computeBoundingBox();
            self.parent.add(self.pendantMesh);

            // 更新尺子
            self.zPreview.update(g.boundingBox);

            // 得到吊坠的体积
            self.pendantVolume = Utils.computeModelVolume(g);
			

            // 执行callback 
            if(callback !== undefined) {
                callback();
            }
        });
    },

    // 项链
    create : function(textFront, textBack, textSize, textThickness, textFont) {
        // 删除文字
        this.parent.remove(this.textMesh);

        function scaleText(tg, tm, nl) {
            var tw = tg.boundingBox.max.x - tg.boundingBox.min.x,
                th = tg.boundingBox.max.y - tg.boundingBox.min.y,
                s;

            if(tw >= th) {
                s = nl / tw;
            } else {
                s = nl / th;
            }
            tm.scale.set(s, s, 1);
        }


        var needWidth = 2.0, bevel_size = 0.03;
        var _textThickness = textThickness - 2 * bevel_size;
       
        var textGeometry = new THREE.Geometry();

        var self = this;
        function setGeometryMatrixes(geometries, side) {
            var x, tempMesh, tempMatrix = new THREE.Matrix4();
            var len = geometries.length;
            for(x=0; x<len; x++) {
                tempMesh = new THREE.Mesh(geometries[x], this.material);
                tempMatrix.fromArray(self.textMatrixes[self.setMatrixes[side][len][x+1]]);
                tempMatrix.decompose(tempMesh.position, tempMesh.quaternion, tempMesh.scale);
                scaleText(geometries[x], tempMesh, needWidth);
                tempMesh.updateMatrixWorld();
                textGeometry.merge(geometries[x], tempMesh.matrixWorld);
            }
        }

        // 所有戒指符号、星座
        var re = /e04[0-9a-f]|e05[0-1]|e03[0-9a-b]/g;
        var fws = Utils.getFontParas(textFont);

        // 正面文字 
        var frontWords = Utils.limtWordsToSize(Utils.getWordsArrayFromRegularExpressionNew(textFront, re), 3);
        var frontShapesList = [];
        for(var i=0; i<frontWords.length; i++) {
            if(frontWords[i] in ZDiyCurves["elements"]) { //符号
                frontShapesList.push(ZDiyCurves.generateShapes(ZDiyCurves["elements"][frontWords[i]]));
            } else { // 字母
                frontShapesList.push(Utils.generateWordShape(frontWords[i], textSize-bevel_size*2, fws.name, fws.weight, fws.style));
            }
        }
        var frontTextGeometries = Utils.generateGeometriesFromShpesList(frontShapesList, textThickness, bevel_size, 0, 0, 0, 5, textSize).geometries;


        setGeometryMatrixes(frontTextGeometries, "front");

        // 背面文字
        var backWords = Utils.limtWordsToSize(Utils.getWordsArrayFromRegularExpressionNew(textBack, re), 3);
        var backShapesList = [];
        for(var i=0; i<backWords.length; i++) {
            if(backWords[i] in ZDiyCurves["elements"]) { //符号
                backShapesList.push(ZDiyCurves.generateShapes(ZDiyCurves["elements"][backWords[i]]));
            } else { // 字母
                backShapesList.push(Utils.generateWordShape(backWords[i], textSize-bevel_size*2, fws.name, fws.weight, fws.style));
            }
        }
        var backTextGeometries = Utils.generateGeometriesFromShpesList(backShapesList, textThickness, bevel_size, 0, 0, 0, 5, textSize).geometries;


        setGeometryMatrixes(backTextGeometries, "back");  

        // 更新文字材质的颜色
        this.wordMaterial.emissive.setStyle(ZDIYCONFIGURE.CHANGEWORDMATERIALCOLOR);

        this.textMesh = new THREE.Mesh(textGeometry, this.wordMaterial);
            
        this.parent.add(this.textMesh);
    },
    
    getVolume : function() {
        return this.pendantVolume + Utils.computeModelVolume(this.textMesh);
    },

    saveToSTL : function(isAscii) {
        if (isAscii === undefined) isAscii = true;
        var output;
        if(isAscii) {
            output = "solid necklace\n";
            output += Utils.saveModelToAsciiSTL(this.pendantMesh);
            output += Utils.saveModelToAsciiSTL(this.textMesh);
            output +="endsolid necklace";
        } else {
        	output = Utils.saveModelToBinarySTL([this.pendantMesh, this.textMesh]);
        }
        return output;
    }
};


// html中执行

function execute() {
    var zNecklace;
    var textFrontElement = document.getElementById("web3dNecklace03Textvalue");
    var textBackElement = document.getElementById("web3dNecklace03Backtext");

    var textParas = {
        textFrontValue : textFrontElement.value,
        textBackValue : textBackElement.value,
        textSize : 10,
        textThickness : 0.8,
        textFont : "arial_bold"
    };

    zNecklace = new ZNecklace(materialManage, webpath);
    // 创建项链模型
    zNecklace.create(textParas.textFrontValue, textParas.textBackValue, textParas.textSize, textParas.textThickness, textParas.textFont);
    zNecklace.importPendant(webpath, getprice);  


    viewport(canvas, zNecklace.parent, new THREE.Vector3(0, 20, 80), pmg_global_background, function(){materialManage.setEmissiveTo0(materialManage.wordMaterial);});


   if(textFrontElement !== null) {
        textFrontElement.onchange = function(event) {
            textParas.textFrontValue = event.target.value;
            zNecklace.create(textParas.textFrontValue, textParas.textBackValue, textParas.textSize, textParas.textThickness, textParas.textFont);
            // 计算价格
            getprice();
        };
    }

    if(textBackElement !== null) {
        textBackElement.onchange = function(event) {
            textParas.textBackValue = event.target.value;
            zNecklace.create(textParas.textFrontValue, textParas.textBackValue, textParas.textSize, textParas.textThickness, textParas.textFont);
            // 计算价格
            getprice();
        };
    }

    var saveModel = document.getElementById("savemodel");
    if(saveModel !== null) {
        saveModel.onclick = function() {
            ZPost.createModel(zNecklace.saveToSTL(false), pid);
        }
    };

    return zNecklace;
};