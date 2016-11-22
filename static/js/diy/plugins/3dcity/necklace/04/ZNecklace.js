function ZNecklace(materialManage, publicKey) {
    this.zShape = new ZShape();

    this.material = materialManage.material;
    
    this.zChain = new ZChain(this.material, publicKey, false);
    this.zChain.chainLeftMeshes.rotation.set(Math.PI / 8, 0, 0);
    this.zChain.chainLeftMeshes.position.set(0, 0, 0);
    this.zChain.chainRightMeshes.rotation.set(-Math.PI / 8, 0, 0);
    this.zChain.chainRightMeshes.position.set(0, 0, 0);

    this.parent = new THREE.Object3D();
    this.parent.add(this.zChain.chainLeftMeshes);
    this.parent.add(this.zChain.chainRightMeshes);
    this.pendantMesh = null;

    // 尺子
    this.zPreview = new Utils.ZBoundingSizePreview();
    this.parent.add(this.zPreview.ZPreviewGroup);
    this.zPreview.setVisible(false);
};

ZNecklace.prototype = {
    // 项链
    create : function(inputParameters) {
        // 删除
        this.parent.remove(this.pendantMesh);


        var geometry = new THREE.Geometry();

        // 创建内外环
        var inner_circle_pts = [], outer_circle_pts = [], size = 360;
        for(var i=0; i<size; i++) {
            inner_circle_pts.push(new THREE.Vector3(inputParameters.innerRadius * Math.cos(i * 2 * Math.PI / size), inputParameters.innerRadius * Math.sin(i * 2 * Math.PI / size), 0));
            outer_circle_pts.push(new THREE.Vector3(inputParameters.outerRadius * Math.cos(i * 2 * Math.PI / size), inputParameters.outerRadius * Math.sin(i * 2 * Math.PI / size), 0));
        }
        var inner_circle = new THREE.ClosedSplineCurve3(inner_circle_pts),
            outer_circle = new THREE.ClosedSplineCurve3(outer_circle_pts);

        var extrudeSettings = {
            steps : 100,
            bevelEnabled    : true,
            bevelThickness  : 0.05,
            bevelSize       : 0.05,
            bevelSegments   : 2,
            lidFacesEnabled : false,
            extrudePath     : inner_circle
        };

        var _ringRadius = 0.3, _ringWidth = 0.2;

        var m4 = new THREE.Matrix4();
        m4.makeRotationZ(Math.PI/2);
        m4.setPosition(new THREE.Vector3(0, -(_ringRadius + _ringWidth/2), 0));

        var innerPath = this.zShape.createRoundedRectPath(_ringRadius, _ringWidth, inputParameters.thickness-_ringRadius*2);
        Utils.updatePathMatrix(innerPath, m4);
        var innerShape = innerPath.toShapes();
        

        var innerGeometry = new THREE.ExtrudeGeometry(innerShape, extrudeSettings);

        extrudeSettings.extrudePath = outer_circle;
        var outerGeometry = new THREE.ExtrudeGeometry(innerShape, extrudeSettings);

        geometry.merge(innerGeometry);
        geometry.merge(outerGeometry);



        // 创建文字
        var fws = Utils.getFontParas(inputParameters.textFont);
        var bevel_size = 0.1,
            aixs = new THREE.Vector3(0, 0, 1),
            tempMatrix = new THREE.Matrix4(),
            tempQuaternoin = new THREE.Quaternion,
            _textSize = inputParameters.outerRadius - inputParameters.innerRadius - _ringRadius * 2 - _ringWidth,
            zoffset = 0.4,
            _thickness = inputParameters.thickness - 0.5;
        // var wordGeometriesInfo = Utils.generateTexts(Utils.getWords02(inputParameters.textValue, 8), _textSize, _thickness, fws.name, fws.weight, fws.style, beve_size, 0, inputParameters.innerRadius+_ringRadius*2+_ringWidth+_textSize/2, 0);
        _textSize += zoffset; 
        
        var re = /e02[0-9a-b]/g;

        // 罗马数字[不在一起]
        var words = Utils.getWords02(Utils.getWordsArrayFromRegularExpressionNew(inputParameters.textValue, re), 8);
        var shapesList = [];
        for(var i=0; i<words.length; i++) {
            if(words[i] in ZDiyCurves["elements"]) { //符号
                shapesList.push(ZDiyCurves.generateShapes(ZDiyCurves["elements"][words[i]]));
            } else { // 字母
                shapesList.push(Utils.generateWordShape(words[i], _textSize-bevel_size*2, fws.name, fws.weight, fws.style));
            }
        }
        var wordGeometriesInfo = Utils.generateGeometriesFromShpesList(shapesList, _thickness, bevel_size, 0, inputParameters.innerRadius+_ringRadius*2+_ringWidth+_textSize/2-zoffset/2, 0, 5, _textSize);


        for(var i=0; i<wordGeometriesInfo.geometries.length; i++) {
            tempQuaternoin.setFromAxisAngle(aixs, -wordGeometriesInfo.rotates[i]-0.25);
            tempMatrix.makeRotationFromQuaternion(tempQuaternoin);
            geometry.merge(wordGeometriesInfo.geometries[i], tempMatrix);
        }


        // 重新计算法线
        geometry.computeFaceNormals();
        geometry.computeVertexNormals(true);

        this.pendantMesh = new THREE.Mesh(geometry, this.material);

        this.pendantMesh.position.set(0, -inputParameters.outerRadius+1, 0)
        this.parent.add(this.pendantMesh);


        // 更新尺子
        this.pendantMesh.geometry.computeBoundingBox();
        this.pendantMesh.updateMatrix();
        this.zPreview.update(this.pendantMesh.geometry.boundingBox, this.pendantMesh.matrix);

    },
    
    getVolume : function() {
        return Utils.computeModelVolume(this.pendantMesh.geometry);
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

function execute() {
    var textElement = document.getElementById("web3dNecklace04Textvalue");
    var ringInnerRadiusElement = document.getElementById("web3dNecklace04Innerradius");
    var ringOuterRadiusElement = document.getElementById("web3dNecklace04Outerradius");
    var thicknessElement = document.getElementById("web3dNecklace04Thickness");

    var materialElement = document.getElementById("web3dNecklace04Material");
    var saveElement = document.getElementById("web3dNecklace04Save");
    
    
    var chainTypeElement=document.getElementById("web3dNecklace04Chaintype")
    
    var textParas = {
        textValue : textElement.value,
        innerRadius : parseFloat(ringInnerRadiusElement.value),
        outerRadius : parseFloat(ringOuterRadiusElement.value),
        thickness : parseFloat(thicknessElement.value),
        textFont : "arial_bold"
    };

    var zNecklace = new ZNecklace(materialManage, webpath);
    // 创建项链模型
    zNecklace.create(textParas);
   
    viewport(canvas, zNecklace.parent, new THREE.Vector3(0, 20, 80), pmg_global_background);


    if(textElement !== null) {
        textElement.onchange = function(event) {
            textParas.textValue = event.target.value;
            zNecklace.create(textParas);
            // 计算价格
            getprice();
        };
    }


    if(ringInnerRadiusElement !== null) {
        ringInnerRadiusElement.onchange = function(event) {
            textParas.innerRadius = parseFloat(event.target.value);
            zNecklace.create(textParas);
            // 计算价格
            getprice();
        };
    }

    if(ringOuterRadiusElement !== null) {
        ringOuterRadiusElement.onchange = function(event) {
            textParas.OuterRadius = parseFloat(event.target.value);
            zNecklace.create(textParas);
            // 计算价格
            getprice();
        };
    }

    if(thicknessElement !== null) {
        thicknessElement.onchange = function(event) {
            textParas.thickness = parseFloat(event.target.value);
            zNecklace.create(textParas);
            // 计算价格
            getprice();
        };
    }

    // if(textFontElement !== null) {
    //     textFontElement.onchange = function(event) {
    //         textParas.textFont = event.target.value;
    //         zNecklace.create(textParas.textValue, textParas.textSize, textParas.textThickness, textParas.textFont);
    //         // 计算价格
    //         getprice();
    //     };
    // }

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
            case "web3dNecklace04Innerradius": 
                textParas.innerRadius = parseFloat(value);  
                break; 
            case "web3dNecklace04Outerradius": 
                textParas.outerRadius = parseFloat(value);
                break; 
            case "web3dNecklace04Thickness": 
                textParas.thickness = parseFloat(value);
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