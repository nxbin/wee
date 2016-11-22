function ZSYRing(material, publicKey) {
    this.material = material;
    this.parent = new THREE.Object3D();
    this.chainMesh = null;
    this.importRingModel();
    this.importChain();

    this.syRingMesh = null;
};

ZSYRing.prototype = {
    constellation : ["♈", "♏", "♐", "♍", "♓", "♑", "♒", "♎", "♋", "♌", "♊", "♉"],

    chineseZodiac : ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],

    // 导入戒指模型
    importRingModel : function(publicKey) {
        var self = this;
        var zRingGeometry = new Utils.ZGeometry();
        zRingGeometry.parse("./ring.mesh", function(g) {
            var rMesh = new THREE.Mesh(g, self.material);
            rMesh.rotation.set(0, 0, Math.PI/2);
            self.parent.add(rMesh);
        });
    },

    // 导入链子
    importChain : function(publicKey) {
        var self = this;
        var zChainGeometry = new Utils.ZGeometry();
        zChainGeometry.parse("./chain.mesh", function(g) {
            self.chainMesh = new THREE.Mesh(g, self.material);
            self.chainMesh.position.y = 6;
            self.parent.add(self.chainMesh);
        }); 
    },

    // 创建文字
    generateTexts : function(text, textSize, textHeight, textFont) {
        if(text === undefined) text = "123456789";
        if(textSize === undefined) textSize = 2;
        if(textHeight === undefined) textHeight = 0.5;
        if(textFont === undefined) textFont = "aldrich";

        var needSize = 9, needHeight = 2.7;

        var textParas = {
            height : textHeight,
            amount : textHeight,
            size : textSize,
            curveSegments : 5,

            font : textFont, //(verlag book), (verlag light italic), helvetiker, aldrich, rawsymbols, damion, engagement, molle, norican, rochester, yellowtail
            weight : "normal", // normal bold
            style : "normal", // normal italic

            bevelThickness : 0.03,
            bevelSize : 0.03,
            bevelSegments : 5,
            bevelEnabled : true,
        };

        // 链接文字长度到size        
        function getWorlds(input, size) {
            var result = "";
            var len = input.length;
            var i;
            if(len>0) {
                while(true) {
                    for(i=0; i<len; i++) {
                        if(result.length === size) return result;
                        else result += input[i];
                    }
                }
            }

            return result;
        };

        // 生成文字
        var wordGeometry, output = {geometries : [], scales : [], rotates : []},
            tempPosition = new THREE.Vector3(),

            tempMatrix = new THREE.Matrix4(),
            s,
            words = getWorlds(text, 9);

        if(words.length === needSize) {
            for(var i=0; i<needSize; i++) {
                if (Utils.indexOf(this.constellation, words[i])) {
                    wordGeometry = new THREE.ExtrudeGeometry(ZDiyCurves.generateShapes(ZDiyCurves["constellation"][words[i]]), textParas);
                } else if(Utils.indexOf(this.chineseZodiac, words[i])) {
                    wordGeometry = new THREE.ExtrudeGeometry(ZDiyCurves.generateShapes(ZDiyCurves["chineseZodiac"][words[i]]), textParas);
                }else {
                    wordGeometry = new THREE.ExtrudeGeometry(THREE.FontUtils.generateShapes(words[i], textParas), textParas);
                }
                wordGeometry.computeBoundingBox();

                tempPosition.set(
                    -(wordGeometry.boundingBox.max.x + wordGeometry.boundingBox.min.x)/2,
                    -(wordGeometry.boundingBox.max.y + wordGeometry.boundingBox.min.y)/2,
                    -(wordGeometry.boundingBox.max.z + wordGeometry.boundingBox.min.z)/2+8.6
                );


                s = needHeight/(wordGeometry.boundingBox.max.y - wordGeometry.boundingBox.min.y);

                // 更新矩阵

                tempMatrix.setPosition(tempPosition);
                // tempMatrix.makeRotationFromQuaternion( tempQuaternion );
                // tempMatrix.compose(tempPosition, tempQuaternion, tempScale);

                // 更新geometry
                wordGeometry.applyMatrix(tempMatrix);

                output.geometries.push(wordGeometry);
                output.scales.push(s);
                output.rotates.push(2*Math.PI*i/needSize);
            }
        }
        return output;
    },

    // 组合
    create : function(textParameters) {
        // 删除文字
        this.parent.remove(this.syRingMesh);

        var wordGeometry = new THREE.Geometry(), tempMesh;
        var wordGeometriesInfo = this.generateTexts(textParameters.text, textParameters.textSize, textParameters.textHeight, textParameters.textFont);
        for(var i=0; i<wordGeometriesInfo.geometries.length; i++) {
            tempMesh = new THREE.Mesh(wordGeometriesInfo.geometries[i]);
            tempMesh.scale.set(wordGeometriesInfo.scales[i], wordGeometriesInfo.scales[i], 1);
            tempMesh.rotation.set(0, wordGeometriesInfo.rotates[i], 0);
            tempMesh.updateMatrixWorld();
            wordGeometry.merge(wordGeometriesInfo.geometries[i], tempMesh.matrixWorld);
        }

        this.syRingMesh = new THREE.Mesh(wordGeometry, this.material);
        this.syRingMesh.rotation.set(0, 0, Math.PI/2);
        this.parent.add(this.syRingMesh);
    },
    
    getVolume : function() {
        return Utils.computeModelVolume(this.pendantMesh.syRingMesh);
    },

    saveToSTL : function(isAscii) {
        if (isAscii === undefined) isAscii = true;
        var output;
        if(isAscii) {
            output = "solid ring\n";
            output += Utils.saveModelToAsciiSTL(this.syRingMesh);
            output +="endsolid ring";
        } else {
        	output = Utils.saveModelToBinarySTL(this.syRingMesh);
        }
        return output;
    }
};


// html中执行

function execute() {
    var canvasElement = document.getElementById("WEBGLTESTCANVAS");
    var textElement = document.getElementById("shuYuanRingText");
    var materialElement = document.getElementById("shuYuanRingMaterial");
    var textFontElement = document.getElementById("shuYuanRingFont");
    var onOffChainElement = document.getElementById("shuYuanChainOnOff");

    // 创建物体
    var texturePath = "../common/textures/";
    var materialManage = new MaterialManage(texturePath, ".jpg");
    materialManage.setMaterialName(ZDIYCONFIGURE.MATERIALIDS[materialElement.value]);

    var parameters = {
        text : textElement.value,
        textFont : textFontElement.value,
        textSize : 2,
        textHeight : 0.5
    };

    var zSYRing = new ZSYRing(materialManage.material, "");
    zSYRing.create(parameters);

    var backgroundUrl = "./bg.jpg";
    new viewport(canvasElement, zSYRing.parent, new THREE.Vector3(0, 30, 120), backgroundUrl);

    if(textElement !== null) {
        textElement.onchange = function(event) {
            parameters.text = event.target.value;
            zSYRing.create(parameters);
            // 计算价格
            // getprice();
        };
    }

    if(textFontElement !== null) {
        textFontElement.onchange = function(event) {
            parameters.textFont = event.target.value;
            zSYRing.create(parameters);
            // 计算价格
            // getprice();
        };
    }

    if(materialElement !== null) {
        materialElement.onchange = function(event) {
            materialManage.setMaterialName(ZDIYCONFIGURE.MATERIALIDS[event.target.value]);
            // 计算价格
            // getprice();
        };
    }

    if(onOffChainElement !== null) {
        onOffChainElement.onclick = function() {
            if(zSYRing.chainMesh !== null) {
                zSYRing.chainMesh.visible = !zSYRing.chainMesh.visible;
            }
        }
    }

    //实时进行的价格计算
    function getprice() {
        // var v = zNecklace.getVolume() / 1000;
        // Utils.getPrice(v, "web3dNecklaceMaterial");
    }

};