function ZNecklace(materialManage, publicKey) {
    this.zg = new ZGeometry();

    this.material = materialManage.material;
    this.wordMaterial = materialManage.wordMaterial;

    // 设置链子的位子
    this.zChain = new ZChain(this.material, publicKey, false);
    this.zChain.chainLeftMeshes.rotation.set(0, 0, Math.PI / 8);
    this.zChain.chainLeftMeshes.position.set(0, 16, 0);
    this.zChain.chainRightMeshes.rotation.set(0, 0, -Math.PI / 8);
    this.zChain.chainRightMeshes.position.set(0, 16, 0);
    
    this.parent = new THREE.Object3D();
    this.parent.add(this.zChain.chainLeftMeshes);
    this.parent.add(this.zChain.chainRightMeshes);

    // 定义文字mesh
    this.textMesh = null;

    // 定义吊坠mesh
    this.pendantMeshUp = null;
    this.pendantMeshDown = null;

    // 生成圆柱模型
    this.cylinderMesh = new THREE.Mesh(this.createCylinderGeometry(), this.material);
    this.cylinderMesh.rotation.set(Math.PI/2, 0, 0);
    this.parent.add(this.cylinderMesh);


    // 尺子
    this.zPreview = new Utils.ZBoundingSizePreview();
    this.parent.add(this.zPreview.ZPreviewGroup);
    this.zPreview.setVisible(false);

    // 吊坠的体积
    this.pendantVolumeUp = 0;
    this.pendantVolumeDown = 0;
};

ZNecklace.prototype = {
    // 导入吊坠
    importPendant : function(publicKey, cylinderLength, callback) {
        var self = this;
        // 导入坠子上半部分
        var zGeometryUp = new Utils.ZGeometry();
        zGeometryUp.parse(publicKey + "/js/diy/plugins/common/meshes/pendants/pendant04_1.mesh", function(g) {
            self.pendantMeshUp = new THREE.Mesh(g, self.material);
            g.computeBoundingBox();
            self.parent.add(self.pendantMeshUp);

            var bbx = g.boundingBox.clone();

            // 得到上半部分吊坠的体积
            self.pendantVolumeUp = Utils.computeModelVolume(g);

            // 导入坠子下半部分
            var zGeometryDown = new Utils.ZGeometry();
            zGeometryDown.parse(publicKey + "/js/diy/plugins/common/meshes/pendants/pendant04_2.mesh", function(g) {           
                // 
                self.pendantMeshDown = new THREE.Mesh(g, self.material);
                self.pendantMeshDown.position.set(0, -cylinderLength, 0);
                g.computeBoundingBox();
                self.parent.add(self.pendantMeshDown);
 
                // 更新尺子
                self.zg.mergeBoundingBox(bbx, g.boundingBox, 0, -cylinderLength, 0);
                self.zPreview.update(bbx);

                // 得到下半部分吊坠的体积
                self.pendantVolumeDown = Utils.computeModelVolume(g);

                // 执行callback 
                if(callback !== undefined) {
                    callback();
                }
            });
        });
    },

    // 创建圆柱模型
    createCylinderGeometry : function() {
        var zShape = new ZShape();
        var shape = zShape.createRoundedRectPath(0.9, 0, 0).toShapes();
        var extrudeSettings = {
            steps           : 1,
            amount          : 1,
            bevelEnabled    : false,
            lidFacesEnabled : false
        };
        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        return geometry;
    },


    // 项链
    create : function(inputParameters){ //textFront, textBack, textSize, textThickness, textFont) {
        // 删除文字
        this.parent.remove(this.textMesh);

        // 旋转圆柱
        this.cylinderMesh.scale.set(1, 1, inputParameters.cylinderLength);

        if(this.pendantMeshDown !== null) {
            this.pendantMeshDown.position.set(0, -inputParameters.cylinderLength, 0);
        }

        function set(tg, tm, nl) {
            var tw = tg.boundingBox.max.x - tg.boundingBox.min.x,
                th = tg.boundingBox.max.y - tg.boundingBox.min.y,
                s = nl / th;
            
            tm.scale.set(s, s, 1);
            return tw*s;
        }
        
        var wordGeometry = new THREE.Geometry(), tempMesh, bevel_size = 0.03;
        var fws = Utils.getFontParas(inputParameters.textFont);
        
        // var wordGeometriesInfo = Utils.generateTexts(Utils.limtWordsToSize(inputParameters.textValue, 6), inputParameters.textSize, inputParameters.textThickness, fws.name, fws.weight, fws.style, beve_size, 0, 0, 0, 5);
        
        var re = /e02[0-9a-b]/g;
        // 罗马数字[不在一起]
        var words = Utils.limtWordsToSize(Utils.getWordsArrayFromRegularExpressionNew(inputParameters.textValue, re), 6);
        var shapesList = [];
        for(var i=0; i<words.length; i++) {
            if(words[i] in ZDiyCurves["elements"]) { //符号
                shapesList.push(ZDiyCurves.generateShapes(ZDiyCurves["elements"][words[i]]));
            } else { // 字母
                shapesList.push(Utils.generateWordShape(words[i], inputParameters.textSize-bevel_size*2, fws.name, fws.weight, fws.style));
            }
        }
        var wordGeometriesInfo = Utils.generateGeometriesFromShpesList(shapesList, inputParameters.textThickness, bevel_size, 0, 0, 0, 5, inputParameters.textSize);


        var px = 0, tl;
        for(var i=0; i<wordGeometriesInfo.geometries.length; i++) {
            tempMesh = new THREE.Mesh(wordGeometriesInfo.geometries[i]);
            tl = set(wordGeometriesInfo.geometries[i], tempMesh, inputParameters.textSize);
            tempMesh.position.x = tl/2 + px + i*0.2;
            px += tl;
            tempMesh.updateMatrixWorld();
            wordGeometry.merge(wordGeometriesInfo.geometries[i], tempMesh.matrixWorld);
        }


        this.textMesh = new THREE.Mesh(wordGeometry, this.wordMaterial);

        // 更新文字材质的颜色
        this.wordMaterial.emissive.setStyle(ZDIYCONFIGURE.CHANGEWORDMATERIALCOLOR);
            
        var _y = px - inputParameters.cylinderLength;
        this.textMesh.position.set(inputParameters.textSize/2 + 0.7, _y+px*0.1, 0);

        this.textMesh.rotation.set(0, 0, -Math.PI/2);

        this.parent.add(this.textMesh);

        // 更新尺子
        if(this.pendantMeshUp !== null && this.pendantMeshDown !== null) {
            var bbx = this.pendantMeshUp.geometry.boundingBox.clone();
            this.zg.mergeBoundingBox(bbx, this.pendantMeshDown.geometry.boundingBox, 0, -inputParameters.cylinderLength, 0);
            this.zPreview.update(bbx);
        }
    },
    
    getVolume : function() {
        return this.pendantVolumeUp + this.pendantVolumeDown + Utils.computeModelVolume(this.textMesh) + Utils.computeModelVolume(this.cylinderMesh);
    },

    saveToSTL : function(isAscii) {
        if (isAscii === undefined) isAscii = true;
        var output;
        if(isAscii) {
            output = "solid necklace\n";
            output += Utils.saveModelToAsciiSTL(this.pendantMeshUp);
            output += Utils.saveModelToAsciiSTL(this.pendantMeshDown);
            output += Utils.saveModelToAsciiSTL(this.textMesh);
            output += Utils.saveModelToAsciiSTL(this.cylinderMesh);
            output +="endsolid necklace";
        } else {
        	output = Utils.saveModelToBinarySTL([this.pendantMeshUp, this.pendantMeshDown, this.textMesh, this.cylinderMesh]);
        }
        return output;
    }
};


// html中执行

function execute() {
    var textElement = document.getElementById("web3dNecklace06Textvalue");
    var textSizeElement = document.getElementById("web3dNecklace06Textsize");
    // var textFontElement = document.getElementById("web3dNecklace06Textfont");
    var cylinderLengthElement = document.getElementById("web3dNecklace06Cylinderlength");

    var textParas = {
        textValue : textElement.value,
        textSize : textSizeElement.value,
        textThickness : 0.6,
        cylinderLength : cylinderLengthElement.value,
        textFont : "arial_bold"//textFontElement.value
    };

    var zNecklace = new ZNecklace(materialManage, webpath); 
    // 创建项链模型
    zNecklace.create(textParas);

    zNecklace.importPendant(webpath, cylinderLengthElement.value,  function() {
        var v = zNecklace.getVolume() / 1000;
        Utils.getPrice(v, "web3dNecklace06Material", globalChainPrice);
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


    // if(textFontElement !== null) {
    //     textFontElement.onchange = function(event) {
    //         textParas.textFont = event.target.value;
    //         zNecklace.create(textParas);
    //         // 计算价格
    //         getprice();
    //     };
    // }

    if(textSizeElement !== null) {
        textSizeElement.onchange = function(event) {
            textParas.textSize = parseFloat(event.target.value);
            zNecklace.create(textParas);
            // 计算价格
            getprice();
        };
    }

$(function() {
      // 老戴控件 
      $('.nstSlider').nstSlider({ 
          "left_grip_selector": ".leftGrip", 
          "value_changed_callback": function(cause, leftValue, rightValue) { 
              $(this).parent().find('.form-control').val((leftValue/100).toFixed(2)); 
          }, 
        
          "user_mouseup_callback": function(leftValue, rightValue) { 
              // [zhengweifu 2014-10-20], 调节戒指的参数 
              var value = parseFloat((leftValue/100).toFixed(2)); 
              var pid = $(this).parent().find('.form-control').attr("id"); 
              switch(pid) { 
              case "web3dNecklace06Textsize": 
                  textParas.textSize = value; 
                  zNecklace.create(textParas);
                  break; 
              case "web3dNecklace06Cylinderlength": 
                  textParas.cylinderLength = value;
                  zNecklace.create(textParas); 
                  break; 
              }
              // 计算价格
              getprice();
          } 
      }); 

      $('#prd-desp').modal({ show:false }); 
    
    
     // $('#basic').fadeTo(300, 1); 
      $('.tips, input, select').tooltip(); 
});
    return zNecklace;
};