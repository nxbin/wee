function ZNecklace(materialManage, publicKey) {
    this.material = materialManage.material;
    this.wordMaterial = materialManage.wordMaterial;
    // 设置链子的位子
    this.zChain = new ZChain(this.material, publicKey, false);
    this.zChain.chainLeftMeshes.rotation.set(Math.PI / 8, 0, 0);
    this.zChain.chainLeftMeshes.position.set(0, -0.5, 0);
    this.zChain.chainRightMeshes.rotation.set(-Math.PI / 8, 0, 0);
    this.zChain.chainRightMeshes.position.set(0, -0.5, 0);
    
    this.parent = new THREE.Object3D();
    this.parent.add(this.zChain.chainLeftMeshes);
    this.parent.add(this.zChain.chainRightMeshes);

    // 定义文字mesh
    this.frontTextMesh = null;
    this.backTextMesh = null;

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
        zGeometry.parse(publicKey + "/js/diy/plugins/common/meshes/pendants/pendant01.mesh", function(g) {
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
        this.parent.remove(this.frontTextMesh);
        this.parent.remove(this.backTextMesh);

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


        var needWidth = 2.2, needOffset_y = -9.75, needOffset_z = 0.74, bevel_size = 0.03;
        var _textThickness = textThickness - 2 * bevel_size;
        
        var fws = Utils.getFontParas(textFont);
        var re = /e02[0-9a-b]|e03[0-9a-b]/g;
        // 正面文字 
        // 罗马数字[不在一起]、星座
        var frontWords = Utils.limtWordsToSize(Utils.getWordsArrayFromRegularExpressionNew(textFront, re), 1);
        var frontShapesList = [];
        for(var i=0; i<frontWords.length; i++) {
            if(frontWords[i] in ZDiyCurves["elements"]) { //符号
                frontShapesList.push(ZDiyCurves.generateShapes(ZDiyCurves["elements"][frontWords[i]]));
            } else { // 字母
                frontShapesList.push(Utils.generateWordShape(frontWords[i], textSize-bevel_size*2, fws.name, fws.weight, fws.style));
            }
        }
        var frontTextGeometry = Utils.generateGeometriesFromShpesList(frontShapesList, textThickness, bevel_size, 0, 0, 0, 5, textSize).geometries[0];


        this.frontTextMesh = new THREE.Mesh(frontTextGeometry, this.wordMaterial);
            
        this.frontTextMesh.position.set(0, needOffset_y, needOffset_z + textThickness/2);

        scaleText(frontTextGeometry, this.frontTextMesh, needWidth);

        this.parent.add(this.frontTextMesh);

        // 背面文字
        var backWords = Utils.limtWordsToSize(Utils.getWordsArrayFromRegularExpressionNew(textBack, re), 1);
        var backShapesList = [];
        for(var i=0; i<backWords.length; i++) {
            if(backWords[i] in ZDiyCurves["elements"]) { //符号
                backShapesList.push(ZDiyCurves.generateShapes(ZDiyCurves["elements"][backWords[i]]));
            } else { // 字母
                backShapesList.push(Utils.generateWordShape(backWords[i], textSize-bevel_size*2, fws.name, fws.weight, fws.style));
            }
        }
        var backTextGeometry = Utils.generateGeometriesFromShpesList(backShapesList, textThickness, bevel_size, 0, 0, 0, 5, textSize).geometries[0];

        this.backTextMesh = new THREE.Mesh(backTextGeometry, this.wordMaterial);

        this.backTextMesh.position.set(0, needOffset_y, -needOffset_z - textThickness/2);
        this.backTextMesh.rotation.set(0, Math.PI, 0);
        scaleText(backTextGeometry, this.backTextMesh, needWidth);

        // 更新文字材质的颜色
        this.wordMaterial.emissive.setStyle(ZDIYCONFIGURE.CHANGEWORDMATERIALCOLOR);

        this.parent.add(this.backTextMesh);
    },
    
    getVolume : function() {
		console.log(this.pendantVolume);
        return this.pendantVolume + Utils.computeModelVolume(this.frontTextMesh) + Utils.computeModelVolume(this.backTextMesh);
    },

    saveToSTL : function(isAscii) {
        if (isAscii === undefined) isAscii = true;
        var output;
        if(isAscii) {
            output = "solid necklace\n";
            output += Utils.saveModelToAsciiSTL(this.pendantMesh);
            output += Utils.saveModelToAsciiSTL(this.frontTextMesh);
            output += Utils.saveModelToAsciiSTL(this.backTextMesh);
            output +="endsolid necklace";
        } else {
        	output = Utils.saveModelToBinarySTL([this.pendantMesh, this.frontTextMesh, this.backTextMesh]);
        }
        return output;
    }
};


// html中执行

function execute() {
    var textFrontElement = document.getElementById("web3dNecklace02Textvalue");
    var textBackElement = document.getElementById("web3dNecklace02Backtext");
    // var textFontElement = document.getElementById("web3dNecklace02Textfont");
    
    var textParas = {
        textFrontValue : textFrontElement.value,
        textBackValue : textBackElement.value,
        textSize : 10,
        textThickness : 0.5,
        textFont : "arial_bold"//textFontElement.value
    };

    var zNecklace = new ZNecklace(materialManage, webpath);
    // 创建项链模型
    zNecklace.create(textParas.textFrontValue, textParas.textBackValue, textParas.textSize, textParas.textThickness, textParas.textFont);
    zNecklace.importPendant(webpath, function() {
        var v = zNecklace.getVolume() / 1000;
        Utils.getPrice(v, "web3dNecklace02Material", globalChainPrice);
    }); 

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

    // if(textFontElement !== null) {
    //     textFontElement.onchange = function(event) {
    //         textParas.textFont = event.target.value;
    //         zNecklace.create(textParas.textFrontValue, textParas.textBackValue, textParas.textSize, textParas.textThickness, textParas.textFont);
    //         // 计算价格
    //         getprice();
    //     };
    // }
    return zNecklace;
};