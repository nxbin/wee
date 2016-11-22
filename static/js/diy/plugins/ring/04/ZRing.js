function ZRing(materialManage) {
    this.material = materialManage.material;
    this.wordMaterial = materialManage.wordMaterial;
    this.parent = new THREE.Object3D();

    this.textGeometry = null;
    this.textMesh = null;

    // 尺子
    this.zPreview = new Utils.ZRingSizePreview();
    this.parent.add(this.zPreview.ZPreviewGroup);
    this.zPreview.setVisible(false);

    // 戒指体积
    this.ringVolume = 0;
};

ZRing.prototype = {
    // 导入戒指模型
    importRing : function(publicKey, callback) {
        var self = this;
        var zGeometry = new Utils.ZGeometry();
        zGeometry.parse(publicKey + "/js/diy/plugins/common/meshes/rings/ring02.mesh", function(g) {
            self.ringMesh = new THREE.Mesh(g, self.material);
            g.computeBoundingBox();
            self.ringMesh.rotation.set(0, Math.PI/2, 0)

            self.parent.add(self.ringMesh);

            //更新尺子
            self.zPreview.update(8, 19, 3);

            // 得到吊坠的体积
            self.ringVolume = Utils.computeModelVolume(g);
            
            // 执行callback 
            if(callback !== undefined) {
                callback();
            }
        });
    },

    // 创建文字模型列表
    createTextGeometry : function(text, textSize, textThickness, textFont, bevelSize) {
        if(text === undefined) text = "A";
        if(textSize === undefined) textSize = 20;
        if(textThickness === undefined) textThickness = 2;
        if(textFont === undefined) textFont = "norican";
        if(bevelSize === undefined) bevelSize = 0.03;

        var textParas = {
            height : textThickness,
            amount : textThickness,
            size : textSize,
            curveSegments : 10,

            font : textFont, 
            weight : "normal", // normal bold
            style : "normal", // normal italic

            bevelThickness : bevelSize,
            bevelSize : bevelSize,
            bevelSegments : 5,
            bevelEnabled : true,
        };


        // 生成文字
        var wordGeometry,
            tempPosition = new THREE.Vector3(),

            tempMatrix = new THREE.Matrix4(),
            s,
            word = Utils.limtWordsToSize(text, 1);


        if (word in ZDiyCurves["common"]) {
            wordGeometry = new THREE.ExtrudeGeometry(ZDiyCurves.generateShapes(ZDiyCurves["common"][word]), textParas);
        }else {
            wordGeometry = new THREE.ExtrudeGeometry(THREE.FontUtils.generateShapes(word, textParas), textParas);
        }

        wordGeometry.computeBoundingBox();

        tempPosition.set(
            -(wordGeometry.boundingBox.max.x + wordGeometry.boundingBox.min.x)/2,
            -(wordGeometry.boundingBox.max.y + wordGeometry.boundingBox.min.y)/2,
            -(wordGeometry.boundingBox.max.z + wordGeometry.boundingBox.min.z)/2
        );

        // 更新矩阵
        tempMatrix.setPosition(tempPosition);

        // 更新geometry
        wordGeometry.applyMatrix(tempMatrix);

        // 重新计算法线
        wordGeometry.computeFaceNormals();
        wordGeometry.computeVertexNormals(true);

        return wordGeometry;
    },

    // 戒指
    create : function(inputParameters) {
        // 删除文字
        this.parent.remove(this.textMesh);
      
        // 字
        var tempMesh, bevel_size = 0.1;
        var fws = Utils.getFontParas(inputParameters.textFont);
        var wordGeometry = Utils.generateTexts(Utils.getWords02(inputParameters.text, 1), 5, 1, fws.name, fws.weight, fws.style, bevel_size).geometries[0];
        // 重新计算法线
        wordGeometry.computeFaceNormals();
        wordGeometry.computeVertexNormals(true);

        // 更新文字材质的颜色
        this.wordMaterial.emissive.setStyle(ZDIYCONFIGURE.CHANGEWORDMATERIALCOLOR);

        this.textMesh = new THREE.Mesh(wordGeometry, this.wordMaterial);
        this.textMesh.position.set(0, 4.5, 11.5);
        this.textMesh.rotation.set(-Math.PI/12, 0, 0);
        this.parent.add(this.textMesh);

    },

    getVolume : function() {
        return this.ringVolume + Utils.computeModelVolume(this.textMesh.geometry);
    },

    saveToSTL : function(isAscii) {
        if (isAscii === undefined) isAscii = true;
        var output;
        if(isAscii) {
            output = "solid ring\n";
            output += Utils.saveModelToAsciiSTL(this.textMesh);
            output +="endsolid ring";
        } else {
        	output = Utils.saveModelToBinarySTL(this.textMesh);
        }

        return output;
    }
};


// html中执行
function execute() {
    var textElement = document.getElementById("web3dRing04Textvalue");
    // var textFontElement = document.getElementById("web3dRing04Textfont");
    
    var parameters = {
        text : textElement.value,
        textFont : "arial_bold"//textFontElement.value
    };

    var zRing = new ZRing(materialManage);
    zRing.create(parameters);
    zRing.importRing(webpath, function() {
        var v = zRing.getVolume() / 1000;
        Utils.getPrice(v, "web3dRing04Material", globalChainPrice);
    });


    viewport(canvas, zRing.parent, new THREE.Vector3(0, 25, 25), pmg_global_background, function(){materialManage.setEmissiveTo0(materialManage.wordMaterial);});

    if(textElement !== null) {
        textElement.onchange = function(event) {
            parameters.text = event.target.value;
            zRing.create(parameters);
            // 计算价格
            getprice();
        };
    }

    // if(textFontElement !== null) {
    //     textFontElement.onchange = function(event) {
    //         parameters.textFont = event.target.value;
    //         zRing.create(parameters);
    //         // 计算价格
    //         getprice();
    //     };
    // }

    return zRing;
};
