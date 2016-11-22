function ZNecklace(materialManage, publicKey) {
    this.material = materialManage.material;
    this.wordMaterial = materialManage.wordMaterial;

    // 设置链子的位子
    this.zChain = new ZChain(this.material, publicKey, false);
    this.zChain.chainLeftMeshes.rotation.set(0, 0, Math.PI / 8);
    this.zChain.chainLeftMeshes.position.set(0, 1.5, 0);
    this.zChain.chainRightMeshes.rotation.set(0, 0, -Math.PI / 8);
    this.zChain.chainRightMeshes.position.set(0, 1.5, 0);
    
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
    // 导入吊坠
    importPendant : function(publicKey, callback) {
        var self = this;
        var zGeometry = new Utils.ZGeometry();
        zGeometry.parse(publicKey + "/js/diy/plugins/common/meshes/pendants/pendant03.mesh", function(g) {
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
    create : function(inputParameters){ //textFront, textBack, textSize, textThickness, textFont) {
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


        var needWidth = 2.2, needOffset_y = -21.5, needOffset_z = 0.8, bevel_size = 0.03;
        var _textThickness = inputParameters.textThickness - 2 * bevel_size;
        // 文字
        var fws = Utils.getFontParas(inputParameters.textFont);
        // var textGeometry = Utils.generateTexts(Utils.limtWordsToSize(inputParameters.textValue, 1), inputParameters.textSize, inputParameters.textThickness, fws.name, fws.weight, fws.style, bevel_size).geometries[0];
        
        var re = /e02[0-9a-b]|e03[0-9a-b]/g;
        // 罗马数字[不在一起]、星座
        var words = Utils.getWords02(Utils.getWordsArrayFromRegularExpressionNew(inputParameters.textValue, re), 1);
        var shapesList = [];
        for(var i=0; i<words.length; i++) {
            if(words[i] in ZDiyCurves["elements"]) { //符号
                shapesList.push(ZDiyCurves.generateShapes(ZDiyCurves["elements"][words[i]]));
            } else { // 字母
                shapesList.push(Utils.generateWordShape(words[i], inputParameters.textSize-bevel_size*2, fws.name, fws.weight, fws.style));
            }
        }
        var textGeometry = Utils.generateGeometriesFromShpesList(shapesList, inputParameters.textThickness, bevel_size, 0, 0, 0, 5, inputParameters.textSize).geometries[0];

        this.textMesh = new THREE.Mesh(textGeometry, this.wordMaterial);

        // 更新文字材质的颜色
        this.wordMaterial.emissive.setStyle(ZDIYCONFIGURE.CHANGEWORDMATERIALCOLOR);
            
        this.textMesh.position.set(0, needOffset_y, needOffset_z + inputParameters.textThickness/2);

        scaleText(textGeometry, this.textMesh, needWidth);

        this.textMesh.rotation.set(Math.PI * 12/180, 0, 0);

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
    var textElement = document.getElementById("web3dNecklace05Textvalue");
    // var textFontElement = document.getElementById("web3dNecklace05Textfont");
    
    var textParas = {
        textValue : textElement.value,
        textSize : 10,
        textThickness : 0.6,
        textFont : "arial_bold"//textFontElement.value
    };


    var zNecklace = new ZNecklace(materialManage, webpath);
    // 创建项链模型
    zNecklace.create(textParas);
    zNecklace.importPendant(webpath,  function() {
        var v = zNecklace.getVolume() / 1000;
        Utils.getPrice(v, "web3dNecklace05Material", globalChainPrice);
    }); 

    viewport(canvas, zNecklace.parent, new THREE.Vector3(0, 20, 80), pmg_global_background, function(){materialManage.setEmissiveTo0(materialManage.wordMaterial);});


    if(textElement !== null) {
        textElement.onchange = function(event) {
            textParas.textValue = event.target.value;
            zNecklace.create(textParas);
            // 计算价格
            getprice();
        };
    }

    return zNecklace; 
};