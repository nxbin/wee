function ZNecklace(material, publicKey) {
    this.zGeometry = new ZGeometry();
    this.zShape = new ZShape();
    this.zText = new ZText();

    this.publicKey = publicKey;
    this.zChain = new ZChain(material, publicKey, true);

    this.material = material;
    this.parent = new THREE.Object3D();
    this.parent.add(this.zChain.chainLeftMeshes);
    this.parent.add(this.zChain.chainRightMeshes);
    this.pendantMesh = null;

    // 尺子
    this.zPreview = new Utils.ZBoundingSizePreview();
    this.parent.add(this.zPreview.ZPreviewGroup);
    this.zPreview.setVisible(false);

    this.isSimple = true;

    // 心形模型
    this.hardShapedGeometry = null;
};

ZNecklace.prototype = {
    // 导入心形模型
    importHardShaped : function(callback) {
        var self = this;
        var zGeometry = new Utils.ZGeometry();
        zGeometry.parse(this.publicKey + "/js/diy/plugins/common/meshes/bases/heart-shaped.mesh", function(g) {
            self.hardShapedGeometry = g;
            g.computeBoundingBox();

            // 执行callback 
            if(callback !== undefined) {
                callback();
            }
        });
    },

    // 项链挂环
    // style => "1", "2", "3", "4", "5", "6", "7"
    createChainLink : function(style, _thickness) {
        shapes = ZDiyCurves.generateShapes(ZDiyCurves["chainLinks"][style], 0.8);
        var extrudeSettings = {
            steps           : 1,
            bevelEnabled    : true,
            bevelThickness  : 0.05,
            bevelSize       : 0.05,
            bevelSegments   : 3,
            amount          : _thickness
        }; 
        var ringGeometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
        return ringGeometry;
    },


    createRingGeometry : function(_radius, _width, _height, _scale, _thickness) {
        if(_radius === undefined) _radius = 1.0;
        if(_width === undefined) _width = 0.0;
        if(_height === undefined) _height = 0.0;
        if(_scale === undefined) _scale = 0.8;
        if(_thickness === undefined) _thickness = 0.2;

        var necklaceRingShape = this.zShape.createRoundedRectPath(
            _radius,
            _width, 
            _height,
            1.0
        ).toShapes()[0];
        
        var necklaceRingHole = this.zShape.createRoundedRectPath(
            _radius,
            _width, 
            _height,
            _scale
        );
        necklaceRingShape.holes.push(necklaceRingHole);
        var extrudeSettings = {
            steps           : 1,
            bevelEnabled    : true,
            bevelThickness  : 0.05,
            bevelSize       : 0.05,
            bevelSegments   : 3,
            amount          : _thickness
        }; 
        var ringGeometry = new THREE.ExtrudeGeometry(necklaceRingShape, extrudeSettings);
        return ringGeometry;
    },


    // 创建文字模型组
    createTextSimpleGeometry : function(text, textSize, textHeight, textFont, textWeight, textStyle, bevelSize, curveSegments, count, ringHeight, ringDepth) {
        if(textSize === undefined) textSize = 20;
        if(textHeight === undefined) textHeight = 2;
        if(textFont === undefined) textFont = "aldrich";
        if(textWeight === undefined) textWeight = "normal";
        if(textStyle === undefined) textStyle = "normal";
        if(bevelSize === undefined) bevelSize = 0.03;
        if(curveSegments === undefined) curveSegments = 5;
        if(count === undefined) count = 12;

        var words = Utils.limtWordsToSize(text, count);

        var bevelSegments = 1;

        var parameters = {
            height : textHeight,
            size : textSize,
            curveSegments : curveSegments,

            font : textFont, 
            weight : textWeight, // normal bold
            style : textStyle, // normal italic

            bevelThickness : bevelSize,
            bevelSize : bevelSize,
            bevelSegments : bevelSegments,
            bevelEnabled : true,
        };

        var output = {
            geometry : null, 
            startPosition : new THREE.Vector3(), 
            endPosition : new THREE.Vector3()
        };
        var chars = words.split('');
        if(chars.length === 0) return output;
        
        var charStart = chars[0];
        var charEnd = chars[chars.length-1];
        var startShapes = THREE.FontUtils.generateShapes(charStart, textParas);
        var endShapes = THREE.FontUtils.generateShapes(charEnd, textParas);

        var startBoundingBox =  {
            minX : Number.NEGATIVE_INFINITY,
            minY : Number.NEGATIVE_INFINITY, 
            maxX : Number.POSITIVE_INFINITY, 
            maxY : Number.POSITIVE_INFINITY
        };
        getShapeBoundingBox(startBoundingBox, startShapes);

        var endBoundingBox =  {
            minX : Number.NEGATIVE_INFINITY,
            minY : Number.NEGATIVE_INFINITY, 
            maxX : Number.POSITIVE_INFINITY, 
            maxY : Number.POSITIVE_INFINITY
        };
        getShapeBoundingBox(endBoundingBox, endShapes);

        output.startPosition.set(           
            0, 
            startBoundingBox.maxY  - ringHeight/2,
            (textHeight - ringDepth)/2
        );

        output.endPosition.set(           
            0, 
            endBoundingBox.maxY - ringHeight/2,
            (textHeight - ringDepth)/2
        );
        
        var textGeometry = new THREE.TextGeometry(text, textParas);
        output.geometry = textGeometry;

        return output;

        function getShapeBoundingBox(outputBBox, shapes) {
            var tempShapBBox, holes;
            for(var i=0; i<shapes.length; i++) {
                holes = shapes[i].holes;
                if(holes instanceof Array){
                    if(holes.length > 0) {
                        getShapeBoundingBox(outputBBox, holes);
                    }
                } 
                tempShapBBox = shapes[i].getBoundingBox();
                if(i === 0) {
                    outputBBox.minX = tempShapBBox.minX;
                    outputBBox.minY = tempShapBBox.minY;
                    outputBBox.maxX = tempShapBBox.maxX;
                    outputBBox.maxY = tempShapBBox.maxY;
                } else {
                    if(outputBBox.minX > tempShapBBox.minX) outputBBox.minX = tempShapBBox.minX;
                    if(outputBBox.minY > tempShapBBox.minY) outputBBox.minY = tempShapBBox.minY;
                    if(outputBBox.maxX < tempShapBBox.maxX) outputBBox.maxX = tempShapBBox.maxX;
                    if(outputBBox.maxY < tempShapBBox.maxY) outputBBox.maxY = tempShapBBox.maxY;
                }
            }
        }
    },

    // 项链
    create : function(inputParas) {
        // 删除文字
        this.parent.remove(this.pendantMesh);

        // 创建挂环
        var ringGeometryLeft = this.createChainLink(inputParas.chainLinkType, 0.5);
        var ringGeometryRight = ringGeometryLeft.clone();
        if(ringGeometryLeft.boundingBox === null) ringGeometryLeft.computeBoundingBox();
        var ringHeight = ringGeometryLeft.boundingBox.max.y - ringGeometryLeft.boundingBox.min.y;
        var ringDepth = ringGeometryLeft.boundingBox.max.z - ringGeometryLeft.boundingBox.min.z;

        // 如果打开调试模式，连接模型更快，但是不适合打印
        var textGeometry, startPosition, endPosition;
        var fws = Utils.getFontParas(inputParas.textFont);
        if(this.isSimple) {
            var generateTextGeometry = this.createTextSimpleGeometry(inputParas.textValue, inputParas.textSize, inputParas.textThickness, fws.name, fws.weight, fws.style, 0.03, 5, 12, ringHeight, ringDepth);
            textGeometry = generateTextGeometry.geometry;
            startPosition = generateTextGeometry.startPosition;
            endPosition = generateTextGeometry.endPosition;
        } else {
            this.zText.setText(inputParas.textValue);
           
            var bevel_size = 0.1;
            // 项链元素、罗马数字[连在一起]、节日元素、生肖元素、心形模型
            var re = /e06[0-9a-f]|e07[0-5]|e01[0-9a-b]|e09[0-8]|e00[0-9a-b]|e0b0/g;
            var words = Utils.limtWordsToSize(Utils.getWordsArrayFromRegularExpressionNew(inputParas.textValue, re), 12);
            
            var extrudeParas = {
                amount : inputParas.textThickness-bevel_size*2,
                curveSegments : 5,
                bevelThickness : bevel_size,
                bevelSize : bevel_size,
                bevelSegments : 5,
                bevelEnabled : true
            };

            var shapes;
            var reference_x = 0, reference_y = 0;
            var textGeometries = [], wordGeometry, tempPosition = new THREE.Vector3(), tempMatrix = new THREE.Matrix4();
            var hardNormalSize = ZDIYCONFIGURE.CONSTELLATION_MIN_SIZE, hardScale = inputParas.textSize/hardNormalSize;
            var elementNormalSize, elementScale;
            // var 
            for(var i=0; i<words.length; i++) {
                wordGeometry = null;
                tempMatrix.identity();
                if(words[i] in ZDiyCurves["elements"]) { //符号
                    shapes = ZDiyCurves.generateShapes(ZDiyCurves["elements"][words[i]]);
                    wordGeometry = new THREE.ExtrudeGeometry(shapes, extrudeParas);

                    // 缩放模型 ------ start---
                    if(!ZDIYCONFIGURE.FORBIDDEN_SCALE) {
                        if(words[i].match(/e06[0-9a-f]|e07[0-5]/g) !== null) {
                            elementNormalSize = ZDIYCONFIGURE.SPECIALNECKLACEELEMENT_MIN_SIZE;
                        } else if(words[i].match(/e01[0-9a-b]/g) !== null) {
                            elementNormalSize = ZDIYCONFIGURE.CONNECTROMAN_MIN_SIZE;
                        } else if(words[i].match(/e09[0-8]/g) !== null) {
                            elementNormalSize = ZDIYCONFIGURE.CHRISTMASNECKLACEELEMENT_MIN_SIZE;
                        } else if(words[i].match(/e00[0-9a-b]/g) !== null) {
                            elementNormalSize = ZDIYCONFIGURE.ZODIAC_MIN_SIZE;
                        } else {
                            elementNormalSize = 0;
                        }

                        if(elementNormalSize !== 0 && elementNormalSize < inputParas.textSize) {
                            elementScale = inputParas.textSize/elementNormalSize;
                            tempMatrix.makeScale(elementScale, elementScale, 1);
                            wordGeometry.applyMatrix(tempMatrix);
                            tempMatrix.identity();
                        }
                    }
                    // 缩放模型 ------ end---

                    wordGeometry.computeBoundingBox();
                    tempMatrix.elements[12] = reference_x - wordGeometry.boundingBox.min.x;
                    tempMatrix.elements[13] = reference_y - wordGeometry.boundingBox.min.y;
                    wordGeometry.applyMatrix(tempMatrix);
                    
                } else if(words[i] === "e0b0") { // 心形模型
                    if(this.hardShapedGeometry !== null) {
                        wordGeometry = this.hardShapedGeometry.clone();

                        if(inputParas.textSize > hardNormalSize) {
                            tempMatrix.makeScale(hardScale, hardScale, hardScale);
                            wordGeometry.applyMatrix(tempMatrix);
                            tempMatrix.identity();
                        }
                        
                        wordGeometry.computeBoundingBox();

                        tempMatrix.elements[12] = reference_x - wordGeometry.boundingBox.min.x;
                        tempMatrix.elements[13] = reference_y - wordGeometry.boundingBox.min.y;
                        tempMatrix.elements[14] = inputParas.textThickness/2;
                        wordGeometry.applyMatrix(tempMatrix);
                    }
                }else { // 字母
                    shapes = Utils.generateWordShape(words[i], inputParas.textSize-bevel_size*2, fws.name, fws.weight, fws.style);
                    wordGeometry = new THREE.ExtrudeGeometry(shapes, extrudeParas);
                }
                // THREE.SoftenGeometryNormal(wordGeometry, 30);
                if(wordGeometry !== null)
                    wordGeometry.computeBoundingBox();
                    textGeometries.push(wordGeometry);
            }

            var jionTexts = this.zGeometry.joinGeometries(textGeometries, false, -0.1, 1.0);
            textGeometry = jionTexts.geometry;
            if(textGeometry.boundingBox === null) {
                textGeometry.computeBoundingBox();
            }

            startPosition = new THREE.Vector3(
                0, 
                textGeometries[0].boundingBox.max.y - ringHeight/2,
                (textGeometries[0].boundingBox.max.z + textGeometries[0].boundingBox.min.z - ringDepth)/2
            );

            endPosition = new THREE.Vector3(
                0, 
                textGeometries[textGeometries.length-1].boundingBox.max.y - ringHeight/2,
                (textGeometries[textGeometries.length-1].boundingBox.max.z + textGeometries[textGeometries.length-1].boundingBox.min.z + ringDepth)/2
            );
        }

        // 连接文字和挂环
        var pendantGeometries = [textGeometry];

        var offsetMatrix = new THREE.Matrix4();
        offsetMatrix.setPosition(startPosition);
        ringGeometryLeft.applyMatrix(offsetMatrix);
        pendantGeometries.splice(0,0,ringGeometryLeft);
        
        offsetMatrix.makeRotationY(Math.PI);
        offsetMatrix.setPosition(endPosition);
        ringGeometryRight.applyMatrix(offsetMatrix);
        pendantGeometries.push(ringGeometryRight);

        var jointPendant = this.zGeometry.joinGeometries(pendantGeometries, false, -0.5, 1); 
        var pendantGeometry = jointPendant.geometry;

        // 重新计算法线
        pendantGeometry.computeFaceNormals();
        pendantGeometry.computeVertexNormals(true);

        this.pendantMesh = new THREE.Mesh(pendantGeometry, this.material);
        if(pendantGeometry.boundingBox === null) pendantGeometry.computeBoundingBox();
        

        var pendantWidth = Math.abs(pendantGeometry.boundingBox.max.x -pendantGeometry.boundingBox.min.x),
            pendantHeight = Math.abs(pendantGeometry.boundingBox.max.y -pendantGeometry.boundingBox.min.y),
            pendantDepth = Math.abs(pendantGeometry.boundingBox.max.z -pendantGeometry.boundingBox.min.z);
        
        // 移动文字的位置
        this.pendantMesh.position.x = -pendantWidth / 2 - pendantGeometry.boundingBox.min.x;
        this.pendantMesh.position.y = -pendantHeight / 2;
        this.pendantMesh.position.z = -pendantDepth / 2;
        this.parent.add(this.pendantMesh);

        // 移动左边链子的位置
        this.zChain.chainLeftMeshes.position.copy(jointPendant.startCenter);
        this.zChain.chainLeftMeshes.position.add(this.pendantMesh.position);
        this.zChain.chainLeftMeshes.position.x -= ringHeight/4;
        this.zChain.chainLeftMeshes.position.y += ringHeight/2;
        this.zChain.chainLeftMeshes.rotation.z = Math.PI / 10;
        
        // 移动右边链子的位置
        this.zChain.chainRightMeshes.position.copy(jointPendant.endCenter);
        this.zChain.chainRightMeshes.position.add(this.pendantMesh.position);
        this.zChain.chainRightMeshes.position.x += ringHeight/4;
        this.zChain.chainRightMeshes.position.y += ringHeight/2;
        this.zChain.chainRightMeshes.rotation.z = -Math.PI / 10;

        // 更新尺子
        //if(this.pendantMesh.geometry.boundingBox === null) this.pendantMesh.geometry.computeBoundingBox();
        this.pendantMesh.updateMatrix();
        this.zPreview.update(this.pendantMesh.geometry.boundingBox, this.pendantMesh.matrix);
    },
    
    getVolume : function() {
        if(this.pendantMesh !== null) 
            return Utils.computeModelVolume(this.pendantMesh.geometry);
        else  return 0;
    },

    saveToSTL : function(isAscii) {
        if (isAscii === undefined) isAscii = true;
        var output;
        if(isAscii) {
            output = "solid necklace\n";
            output += Utils.saveModelToAsciiSTL(this.pendantMesh);
            output +="endsolid necklace";
        } else {
        	output = Utils.saveModelToBinarySTL(this.pendantMesh);
        }
        return output;
    }
};


// html中执行

function execute(simple) {
    if(simple === undefined) simple = true;
    var textElement = document.getElementById("web3dNecklace01Textvalue");
    var textSizeElement = document.getElementById("web3dNecklace01Textsize");
    var textThicknessElement = document.getElementById("web3dNecklace01Thickness");
    var textFontElement = document.getElementById("web3dNecklace01Textfont");
    var chainTypeElement=document.getElementById("web3dNecklace01Chaintype");
    var chainLinkTypeElement=document.getElementById("web3dNecklace01Chainlinktype");
    
    var textParas = {
        textValue : textElement.value,
        textSize : parseFloat(textSizeElement.value),
        textThickness : parseFloat(textThicknessElement.value),
        chainLinkType : chainLinkTypeElement.value,
        textFont : textFontElement.value
    };

    var zNecklace = new ZNecklace(materialManage.material, webpath);
    zNecklace.importHardShaped(function() {
        // 创建项链模型
        zNecklace.create(textParas);

        var v = zNecklace.getVolume() / 1000;
        Utils.getPrice(v, "web3dNecklace01Material", globalChainPrice);
    });

    // 为了防止生成模型慢，设置isSimple值为true
    // var advancePreviewElement = document.getElementById("advancePreview"); 
    // if(advancePreviewElement !== null) {
    //     advancePreviewElement.onclick = function(event) {
    //         zNecklace.isSimple = !event.target.checked;
    //         zNecklace.create(textParas.textValue, textParas.textSize, textParas.textThickness, textParas.textFont);
    //     }

    //     zNecklace.isSimple = !advancePreviewElement.checked;
    // } else {
    //     zNecklace.isSimple = true;
    // }
    zNecklace.isSimple = simple;

    var canvas = document.getElementById("web3dViewport");
    viewport(canvas, zNecklace.parent, new THREE.Vector3(0, 20, 80), pmg_global_background);


    if(textElement !== null) {
        textElement.onchange = function(event) {
            textParas.textValue = event.target.value;
            zNecklace.create(textParas);
            // 计算价格
            getprice();
        };
    }

    if(textSizeElement !== null) {
        textSizeElement.onchange = function(event) {
            textParas.textSize = parseFloat(event.target.value);
            zNecklace.create(textParas);
            // 计算价格
            getprice();
        };
    }

    if(textThicknessElement !== null) {
        textThicknessElement.onchange = function(event) {
            textParas.textThickness = parseFloat(event.target.value);
            zNecklace.create(textParas);
            // 计算价格
            getprice();
        };
    }

    if(textFontElement !== null) {
        textFontElement.onchange = function(event) {
            textParas.textFont = event.target.value;
            zNecklace.create(textParas);
            // 计算价格
            getprice();
        };
    }

    if(chainLinkTypeElement !== null) {
        chainLinkTypeElement.onchange = function(event) {
            textParas.chainLinkType = event.target.value;
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
            // [zhengweifu 2014-10-27], 调节项链的参数 
            var value = parseFloat((leftValue/100).toFixed(2)); 
            var pid = $(this).parent().find('.form-control').attr("id");
      
            switch(pid) { 
            case "web3dNecklace01Textsize": 
                textParas.textSize = parseFloat(value);  
                break; 
            case "web3dNecklace01Thickness": 
                textParas.textThickness = parseFloat(value);
                break; 
            }

            zNecklace.create(textParas);
            
            // 计算价格
            getprice();
        } 
    }); 

    $('#prd-desp').modal({ show:false }); 
    
    
    //$('#basic').fadeTo(300, 1);
    $('.tips, input, select').tooltip(); 
});
    return zNecklace; 
};