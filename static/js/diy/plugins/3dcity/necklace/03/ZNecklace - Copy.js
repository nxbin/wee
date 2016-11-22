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
        "1" : [0.954337, 0.0134926, 0.298426, 0, 0.0306393, 0.98929, -0.14271, 0, -0.297156, 0.145337, 0.943703, 0, -4.179675, -8.750221, 2.053212, 1],
        "2" : [0.995465, 0, 0.0951293, 0, 0, 1, 0, 0, -0.0951293, 0, 0.995465, 0, -2.580696, -10.057624, 2.427417, 1],
        "3" : [0.997059, 0, -0.0766347, 0, 0.00299364, 0.999237, 0.038949, 0, 0.0765762, -0.0390638, 0.996298, 0, -0.916742, -11.067469, 2.443569, 1],
        "4" : [0.991521, 0.00209408, -0.129933, 0, 0.00461477, 0.998672, 0.0513107, 0, 0.129867, -0.0514752, 0.990194, 0, 0, -11.109658, 2.359406, 1],
        "5" : [0.989652, -0.0227462, -0.141674, 0, 0.0257529, 0.99948, 0.0194252, 0, 0.141158, -0.0228727, 0.989723, 0, 0.811717, -10.758583, 2.262794, 1],
        "6" : [0.981779, 0, -0.190026, 0, 0.0127288, 0.997754, 0.0657641, 0, 0.189599, -0.0669846, 0.979574, 0, 2.395125, -9.815286, 1.943458, 1],
        "7" : [0.925154, 0, -0.379591, 0, -0.0300657, 0.996858, -0.0732774, 0, 0.378399, 0.0792056, 0.922248, 0, 3.932973, -8.380889, 1.468566, 1],
        
        // 背面
        "8" : [-0.93275, 0.00310985, -0.360511, 0, -0.0298278, 0.995869, 0.085764, 0, 0.359289, 0.0907496, -0.928804, 0, 4.007206, -8.362139, -1.660902, 1],
        "9" : [-0.98473, 0.00112074, -0.174086, 0, 0.00525295, 0.999715, -0.0232777, 0, 0.17401, -0.0238367, -0.984455, 0, 2.429676, -9.820019, -2.138468, 1],
        "a" : [-0.990938, 0.0157738, -0.13339, 0, 0.0167958, 0.999838, -0.00654014, 0, 0.133265, -0.00872127, -0.991042, 0, 0.805413, -10.757149, -2.381414, 1],
        "b" : [-0.997295, 0.00494174, -0.0733371, 0, 0.00534842, 0.999971, -0.00535005, 0, 0.0733085, -0.00572781, -0.997293, 0, 0, -11.130343, -2.443061, 1],
        "c" : [-0.999419, 0, -0.0340809, 0, 0, 1, 0, 0, 0.0340809, 0, -0.999419, 0, -0.915536, -11.067469, -2.479384, 1],
        "d" : [-0.994383, 0, 0.10584, 0, 0, 1, 0, 0, -0.10584, 0, -0.994383, 0, -2.589745, -10.057624, -2.512011, 1],
        "e" : [-0.968882, 0, 0.247524, 0, 0.0362076, 0.989243, 0.141728, 0, -0.244861, 0.146279, -0.95846, 0, -4.196179, -8.740362, -2.117603, 1]   
    },

    setMatrixes : {
        "front" : {
            "1" : {
                "1" : "4"
            },
            "2" : {
                "1" : "3",
                "2" : "5"
            },
            "3" : {
                "1" : "2",
                "2" : "4",
                "3" : "6"
            },
            "4" : {
                "1" : "2",
                "2" : "3",
                "3" : "5",
                "4" : "6"
            },
            "5" : {
                "1" : "1",
                "2" : "2",
                "3" : "4",
                "4" : "5",
                "5" : "6"
            },
            "6" : {
                "1" : "1",
                "2" : "2",
                "3" : "3",
                "4" : "5",
                "5" : "6",
                "6" : "7"
            }
        },
        "back" : {
            "1" : {
                "1" : "b"
            },
            "2" : {
                "1" : "a",
                "2" : "c"
            },
            "3" : {
                "1" : "9",
                "2" : "b",
                "3" : "d"
            },
            "4" : {
                "1" : "9",
                "2" : "a",
                "3" : "c",
                "4" : "d"
            },
            "5" : {
                "1" : "8",
                "2" : "9",
                "3" : "b",
                "4" : "d",
                "5" : "e"
            },
            "6" : {
                "1" : "8",
                "2" : "9",
                "3" : "a",
                "4" : "c",
                "5" : "d",
                "6" : "e"
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


        var needWidth = 1.5, bevel_size = 0.03;
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

        var fws = Utils.getFontParas(textFont);
        // 正面文字
        var frontTextGeometries = Utils.generateTexts(Utils.limtWordsToSize(textFront, 6), textSize, textThickness, fws.name, fws.weight, fws.style, bevel_size).geometries;
        setGeometryMatrixes(frontTextGeometries, "front");

        // 背面文字
        var backTextGeometries = Utils.generateTexts(Utils.limtWordsToSize(textBack, 6), textSize, textThickness, fws.name, fws.weight, fws.style, bevel_size).geometries;
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
    var textFrontElement = document.getElementById("web3dNecklace03Fronttext");
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