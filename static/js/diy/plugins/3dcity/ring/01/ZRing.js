function ZRing(material) {
    this.zGeometry = new ZGeometry();
    this.zShape = new ZShape();
    this.zText = new ZText();

    this.material = material;
    this.parent = new THREE.Object3D();

    this.isMobile = Utils.IsMobile.Any();

    this.textGeometry = null;
    this.mesh = null;

    // 尺子
    this.zPreview = new Utils.ZRingSizePreview();
    this.parent.add(this.zPreview.ZPreviewGroup);
    this.zPreview.setVisible(false);
};

ZRing.prototype = {
    createRingGeometry : function (parameters) {
        parameters = parameters !== undefined ? parameters : {};
        if(parameters.length === undefined) parameters.length = 40.0;
        if(parameters.width === undefined) parameters.width = 1.0;
        if(parameters.height === undefined) parameters.height = 3.0;
        if(parameters.leftUpRadius === undefined) parameters.leftUpRadius = 0.01;
        if(parameters.leftDownRadius === undefined) parameters.leftDownRadius = 0.01;
        if(parameters.rightUpRadius === undefined) parameters.rightUpRadius = 0.01;
        if(parameters.rightDownRadius === undefined) parameters.rightDownRadius = 0.01;

        var minAccuracy = 0.001, maxAccuracy = 0.999;
        if(parameters.leftUpRadius < minAccuracy) parameters.leftUpRadius = minAccuracy;
        else if(parameters.leftUpRadius > maxAccuracy) parameters.leftUpRadius = maxAccuracy;

        if(parameters.leftDownRadius < minAccuracy) parameters.leftDownRadius = minAccuracy;
        else if(parameters.leftDownRadius > maxAccuracy) parameters.leftDownRadius = maxAccuracy;

        if(parameters.rightUpRadius < minAccuracy) parameters.rightUpRadius = minAccuracy;
        else if(parameters.rightUpRadius > maxAccuracy) parameters.rightUpRadius = maxAccuracy;

        if(parameters.rightDownRadius < minAccuracy) parameters.rightDownRadius = minAccuracy;
        else if(parameters.rightDownRadius > maxAccuracy) parameters.rightDownRadius = maxAccuracy;

        var ringSegments = Math.floor(parameters.length * 3);
        var extrudeSettings = {
            steps           : ringSegments,
            bevelEnabled    : true,
            bevelThickness  : 0.05,
            bevelSize       : 0.05,
            bevelSegments   : 2,
            amount          : parameters.length
        };

        var halfWith = parameters.width/2, halfHeight = parameters.height/2,
            LURadius = (halfHeight > halfWith) ?  (halfWith * parameters.rightUpRadius) : (halfHeight * parameters.rightUpRadius),
            RURadius = (halfHeight > halfWith) ?  (halfWith * parameters.leftUpRadius) : (halfHeight * parameters.leftUpRadius), 
            LDRadius = (halfHeight > halfWith) ?  (halfWith * parameters.rightDownRadius) : (halfHeight * parameters.rightDownRadius), 
            RDRadius = (halfHeight > halfWith) ?  (halfWith * parameters.leftDownRadius) : (halfHeight * parameters.leftDownRadius); 

        var shape = new THREE.Shape();
        shape.moveTo(-halfWith, halfHeight-LURadius);
        shape.quadraticCurveTo(-halfWith, halfHeight, -halfWith + LURadius, halfHeight);
        shape.lineTo(halfWith - RURadius, halfHeight);
        shape.quadraticCurveTo(halfWith, halfHeight, halfWith, halfHeight - RURadius);
        shape.lineTo(halfWith, -halfHeight + RDRadius);
        shape.quadraticCurveTo(halfWith, -halfHeight, halfWith - RDRadius, -halfHeight);
        shape.lineTo(-halfWith + LDRadius, -halfHeight);
        shape.quadraticCurveTo(-halfWith, -halfHeight, -halfWith, -halfHeight + LDRadius);
        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        return geometry;
    },

    // 戒指
    create : function(parameters, reDraw) {
        if(reDraw === undefined) reDraw = true;
        // 删除文字
        this.parent.remove(this.mesh);

        var _height = parameters.height,
            _thickness = parameters.width,
            __height = parameters.height - 0.1,
            __width = parameters.width - 0.1,
            textLength, textHeight;


        // 计算戒指半径
        var radius = parameters.length / (2 * Math.PI);
        
        // 字
        if(this.textGeometry === null || reDraw === true) {
            var fws = Utils.getFontParas(parameters.textFont);
            var bevelSize = 0.05, curves_segments = 5;
            // 所有戒指符号、罗马数字、星座、节日元素
            var re = /e04[0-9a-f]|e05[0-1]|e01[0-9a-b]|e03[0-9a-b]|e08[0-7]/g;
            var words = Utils.limtWordsToSize(Utils.getWordsArrayFromRegularExpressionNew(parameters.text, re), 12);
            var shapesList = [];
            for(var i=0; i<words.length; i++) {
                if(words[i] in ZDiyCurves["elements"]) { //符号
                    shapesList.push(ZDiyCurves.generateShapes(ZDiyCurves["elements"][words[i]]));
                } else { // 字母
                    shapesList.push(Utils.generateWordShape(words[i], __height-bevelSize*2, fws.name, fws.weight, fws.style));
                }
            }
            
            if(this.isMobile) curves_segments = 2;

            var textGeometries = Utils.generateGeometriesFromShpesList(shapesList, __width, bevelSize, 0, 0, 0, curves_segments, __height).geometries;
            var tginfo = this.zGeometry.joinGeometries(textGeometries, true, -0.1, 0.1);
            var textGeometry = tginfo.geometry;
    

            // 计算boundingbox
            if(textGeometry.boundingBox === null) this.textGeometry.computeBoundingBox();

            // 更新位置
            textLength = Math.abs(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
            textHeight = Math.abs(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);

            if(this.isMobile) {
                // 切割文字模型
                var i, j, a = 0.03, planeVectors = [];
                for(i=textLength*a; i<textLength; i+=textLength*a) {
                   planeVectors.push(new THREE.Vector3(textGeometry.boundingBox.min.x+i, 0, 0));
                   planeVectors.push(new THREE.Vector3(0, 0, 1));
                   planeVectors.push(new THREE.Vector3(0, 1, 0));
                }

                // for(j=textHeight*a; j<textHeight; j+=textHeight*a) {
                //     planeVectors.push(new THREE.Vector3(0,textGeometry.boundingBox.min.y+j, 0));
                //     planeVectors.push(new THREE.Vector3(0, 0, 1));
                //     planeVectors.push(new THREE.Vector3(1, 0, 0)); 
                // }

                this.textGeometry = THREE.CutGeometry(textGeometry, planeVectors);
            } else {
                this.textGeometry = textGeometry;
            }

            this.textGeometry.boundingBox = textGeometry.boundingBox.clone();
            
        } else {
            // 计算boundingbox
            if(this.textGeometry.boundingBox === null) this.textGeometry.computeBoundingBox();

            // 更新位置
            textLength = Math.abs(this.textGeometry.boundingBox.max.x - this.textGeometry.boundingBox.min.x);
            textHeight = Math.abs(this.textGeometry.boundingBox.max.y - this.textGeometry.boundingBox.min.y);
        }

        var textMatrix = new THREE.Matrix4();
        textMatrix.setPosition(new THREE.Vector3(-this.textGeometry.boundingBox.min.x, 0, radius+(this.textGeometry.boundingBox.max.z - this.textGeometry.boundingBox.min.z)/2));
        var outGeometry = this.textGeometry.clone();
        outGeometry.applyMatrix(textMatrix);

        // 输出环
        var allLength = parameters.length;
        var angleText, angleRing, ringGeometry;
        if(textLength < allLength) {
            var ringLength = allLength - textLength;
            // ring
            var ringGeometry = this.createRingGeometry({
                length              : ringLength,
                width               : __width,
                height              : __height,
                leftUpRadius        : parameters.leftUpRadius,
                leftDownRadius      : parameters.leftDownRadius,
                rightUpRadius       : parameters.rightUpRadius,
                rightDownRadius     : parameters.rightDownRadius
            });

            var ringMatrix = new THREE.Matrix4();
            ringMatrix.makeRotationAxis(new THREE.Vector3(0, 1, 0), -Math.PI/2);
            ringMatrix.setPosition(new THREE.Vector3(allLength, 0, __width/2+radius));
            ringGeometry.applyMatrix(ringMatrix);
            ringMesh = new THREE.Mesh(ringGeometry, this.material);
            outGeometry.merge(ringGeometry);
            outGeometry = outGeometry.clone();
        }
        outGeometry.boundingBox = null;
        outGeometry.computeBoundingBox();
        // 弯曲
        var bend = new THREE.BendModifier(outGeometry);
        bend.bendAngle = -360;
        bend.modify();

        // 重新计算法线
        // this.geometry.computeFaceNormals();
        THREE.SoftenGeometryNormal(outGeometry, 11);

        this.mesh = new THREE.Mesh(outGeometry, this.material);
        this.parent.add(this.mesh);


        // 更新尺子
        // this.mesh.geometry.computeBoundingBox();
        // this.mesh.updateMatrix();

        this.zPreview.update(radius, _height, _thickness);
        // this.parent.add(new THREE.Mesh(new THREE.SphereGeometry(9, 100, 100), this.material));
        // var testM = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 3));
        // testM.position.set(1,2,5);
        // testM.rotation.set(0, Math.PI/2, Math.PI/4);
        
        // this.parent.add(testM);
    },

    getVolume : function() {
        return Utils.computeModelVolume(this.mesh.geometry);
    },

    saveToSTL : function(isAscii) {
        if (isAscii === undefined) isAscii = true;
        var output;
        if(isAscii) {
            output = "solid ring\n";
            output += Utils.saveModelToAsciiSTL(this.mesh);
            output +="endsolid ring";
        } else {
        	output = Utils.saveModelToBinarySTL(this.mesh);
            // 制作中
        }

        return output;
    }
};


// html中执行
function execute() {
    var zRing;
    var textElement = document.getElementById("web3dRing01Textvalue");
    var textFontElement = document.getElementById("web3dRing01Textfont");
    var thicknessElement = document.getElementById("web3dRing01Thickness");
    var heightElement = document.getElementById("web3dRing01Height");
    var LUAElement = document.getElementById("web3dRing01LUA");
    var LDAElement = document.getElementById("web3dRing01LDA");
    var RUAElement = document.getElementById("web3dRing01RUA");
    var RDAElement = document.getElementById("web3dRing01RDA");
    var sizeElement = document.getElementById("web3dRing01Size");

    var parameters = {
        text : textElement.value,
        textFont : textFontElement.value,
        length : parseFloat(sizeElement.value),
        width : parseFloat(thicknessElement.value),
        height : parseFloat(heightElement.value),
        leftUpRadius : parseFloat(LUAElement.value),
        leftDownRadius : parseFloat(LDAElement.value),
        rightUpRadius : parseFloat(RUAElement.value),
        rightDownRadius : parseFloat(RDAElement.value)
    };

    zRing = new ZRing(materialManage.material);
    zRing.create(parameters);

    viewport(canvas, zRing.parent, new THREE.Vector3(0, 25, 25), pmg_global_background);

    
    if(textElement !== null) {
        // textElement.oninput = function(event) {
        textElement.onchange = function(event) {
            parameters.text = event.target.value;
            zRing.create(parameters, true);
            // 计算价格
            getprice();
        };
    }

    if(textFontElement !== null) {
        textFontElement.onchange = function(event) {
            parameters.textFont = event.target.value;
            zRing.create(parameters, true);
            // 计算价格
            getprice();
        };
    }

    if(thicknessElement !== null) {
        thicknessElement.onchange = function(event) {
            parameters.width = parseFloat(event.target.value);
            zRing.create(parameters, true);
            // 计算价格
            getprice();
        };
    }

    if(heightElement !== null) {
        heightElement.onchange = function(event) {
            parameters.height = parseFloat(event.target.value);
            zRing.create(parameters, true);
            // 计算价格
            getprice();
        };
    }

    if(LUAElement !== null) {
        LUAElement.onchange = function(event) {
            parameters.leftUpRadius = parseFloat(event.target.value);
            zRing.create(parameters, false);
            // 计算价格
            getprice();
        };
    }

    if(LDAElement !== null) {
        LDAElement.onchange = function(event) {
            parameters.leftDownRadius = parseFloat(event.target.value);
            zRing.create(parameters, false);
            // 计算价格
            getprice();
        };
    }

    if(RUAElement !== null) {
        RUAElement.onchange = function(event) {
            parameters.rightUpRadius = parseFloat(event.target.value);
            zRing.create(parameters, false);
            // 计算价格
            getprice();
        };
    }

    if(RDAElement !== null) {
        RDAElement.onchange = function(event) {
            parameters.rightDownRadius = parseFloat(event.target.value);
            zRing.create(parameters, false);
            // 计算价格
            getprice();
        };
    }

    if(sizeElement !== null) {
        sizeElement.onchange = function(event) {
            parameters.length = parseFloat(event.target.value);
            zRing.create(parameters, false);
            // 计算价格
            getprice();
        };
    }


$(function () {
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
            case "web3dRing01Thickness": 
                parameters.width = value; 
                zRing.create(parameters, true);
                break; 
            case "web3dRing01Height": 
                parameters.height = value;
                zRing.create(parameters, true); 
                break; 
            case "web3dRing01LUA": 
                parameters.leftUpRadius = value;
                zRing.create(parameters, false);
                break; 
            case "web3dRing01LDA": 
                parameters.leftDownRadius = value;
                zRing.create(parameters, false);
                break; 
            case "web3dRing01RUA": 
                parameters.rightUpRadius = value;
                zRing.create(parameters, false); 
                break; 
            case "web3dRing01RDA": 
                parameters.rightDownRadius = value;
                zRing.create(parameters, false);
                break; 
            }
            // 计算价格
            getprice();
        } 
    }); 

    $('#prd-desp').modal({ show:false }); 
    
    
    //$('#basic').fadeTo(300, 1); 
    $('.tips, input, select').tooltip(); 
});
    return zRing;
};
