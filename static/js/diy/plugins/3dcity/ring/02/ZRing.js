function ZRing(material) {
    this.zShape = new ZShape();
    this.zShape.minAccuracy = 0.3;

    this.material = material;
    this.parent = new THREE.Object3D();

    this.textGeometry = null;
    this.mesh = null;

    // 尺子
    this.zPreview = new Utils.ZRingSizePreview();
    this.parent.add(this.zPreview.ZPreviewGroup);
    this.zPreview.setVisible(false);
};

ZRing.prototype = {
    generateRingGeometry : function (parameters) {
        parameters = parameters !== undefined ? parameters : {};
        if(parameters.length === undefined) parameters.length = 40.0;
        if(parameters.width === undefined) parameters.width = 1.2;
        if(parameters.height === undefined) parameters.height = 1.2;
        if(parameters.offset === undefined) parameters.offset = 10;
        if(parameters.upRadius === undefined) parameters.upRadius = 0.1;
        if(parameters.downRadius === undefined) parameters.downRadius = 0.1;


        var ringSegments = Math.floor(parameters.length * 3);

        var circle_radius = parameters.length / (2 * Math.PI);
        var circle_pts = [], size = ringSegments;

        for(var i=0; i<size; i++) {
            circle_pts.push(new THREE.Vector3(circle_radius * Math.cos(i * 2 * Math.PI / size), parameters.offset, circle_radius * Math.sin(i * 2 * Math.PI / size)));
        }
        var circle = new THREE.ClosedSplineCurve3(circle_pts);

        var extrudeSettings = {
            steps           : ringSegments,
            bevelEnabled    : true,
            bevelThickness  : 0.05,
            bevelSize       : 0.05,
            bevelSegments   : 2,
            lidFacesEnabled : false,
            extrudePath     : circle
        };

        var m4 = new THREE.Matrix4();
        m4.makeRotationZ(Math.PI/2);
        m4.setPosition(new THREE.Vector3(0, parameters.width/2, 0));

        var path = this.zShape.createTOCPath(parameters.upRadius, parameters.downRadius, parameters.width, parameters.height/2, 0);
        Utils.updatePathMatrix(path, m4);

        var shape = path.toShapes();

        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        return geometry;
    },

    // 戒指
    create : function(inputParameters, reDraw) {
        if(reDraw === undefined) reDraw = true;
        // 删除文字
        this.parent.remove(this.mesh);

        var ring_height = inputParameters.ringHeight,
            text_height = inputParameters.textHeight
            _thickness = inputParameters.thickness;



        // 计算戒指半径
        var radius = inputParameters.length / (2 * Math.PI);
        
        // 字
        var wordGeometry = new THREE.Geometry(), tempMesh, bevel_size = 0.1;
        var fws = Utils.getFontParas(inputParameters.textFont);

        // 罗马数字[不在一起]、节日、所有戒指元素、星座
        var re = /e02[0-9a-b]|e08[0-7]|e04[0-9a-f]|e05[0-1]|e03[0-9a-b]/g;
        var words = Utils.getWords02(Utils.getWordsArrayFromRegularExpressionNew(inputParameters.text, re), 8);
        var shapesList = [];
        for(var i=0; i<words.length; i++) {
            if(words[i] in ZDiyCurves["elements"]) { //符号
                shapesList.push(ZDiyCurves.generateShapes(ZDiyCurves["elements"][words[i]]));
            } else { // 字母
                shapesList.push(Utils.generateWordShape(words[i], text_height-bevel_size*2, fws.name, fws.weight, fws.style));
            }
        }
        
        var wordGeometriesInfo = Utils.generateGeometriesFromShpesList(shapesList, _thickness, bevel_size, 0, 0, radius+_thickness/2, 5, text_height);

        for(var i=0; i<wordGeometriesInfo.geometries.length; i++) {
            tempMesh = new THREE.Mesh(wordGeometriesInfo.geometries[i]);
            tempMesh.rotation.set(0, wordGeometriesInfo.rotates[i], 0);
            tempMesh.updateMatrixWorld();
            wordGeometry.merge(wordGeometriesInfo.geometries[i], tempMesh.matrixWorld);
        }

        var ringUpGeometry = this.generateRingGeometry({
            width : _thickness, 
            height : ring_height,
            offset : (ring_height+text_height)/2,
            upRadius : inputParameters.upRadius, 
            downRadius : 0.1, 
            length : inputParameters.length
        });

        var ringDownGeometry = this.generateRingGeometry({
            width : _thickness, 
            height : ring_height, 
            offset : (-ring_height-text_height)/2,
            upRadius : 0.1, 
            downRadius : inputParameters.downRadius, 
            length : inputParameters.length
        });

        wordGeometry.merge(ringUpGeometry);
        wordGeometry.merge(ringDownGeometry);

        // 重新计算法线
        wordGeometry.computeFaceNormals();
        wordGeometry.computeVertexNormals(true);

        this.mesh = new THREE.Mesh(wordGeometry, this.material);
        this.parent.add(this.mesh);


        // 更新尺子
        this.zPreview.update(radius, 2*ring_height+text_height, _thickness);
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
        }

        return output;
    }
};


// html中执行
function execute() {
    var zRing;

    var textElement = document.getElementById("web3dRing02Textvalue");
    var textFontElement = document.getElementById("web3dRing02Textfont");
    var thicknessElement = document.getElementById("web3dRing02Thickness");
    var ringHeightElement = document.getElementById("web3dRing02RingHeight");
    var textHeightElement = document.getElementById("web3dRing02TextHeight");

    var sizeElement = document.getElementById("web3dRing02Size");
    var parameters = {
        text : textElement.value,
        textFont : textFontElement.value,
        length : parseFloat(sizeElement.value),
        thickness : parseFloat(thicknessElement.value),
        ringHeight : parseFloat(ringHeightElement.value),
        textHeight : parseFloat(textHeightElement.value),
        upRadius : 0.3,//parseFloat(UAElement.value),
        downRadius : 0.3//parseFloat(DAElement.value)
    };

    zRing = new ZRing(materialManage.material);
    zRing.create(parameters);

    viewport(canvas, zRing.parent, new THREE.Vector3(0, 25, 25), pmg_global_background);
    
    if(textElement !== null) {
        textElement.onchange = function(event) {
            parameters.text = event.target.value;
            zRing.create(parameters);
            // 计算价格
            getprice();
        };
    }

    if(textFontElement !== null) {
        textFontElement.onchange = function(event) {
            parameters.textFont = event.target.value;
            zRing.create(parameters);
            // 计算价格
            getprice();
        };
    }

    if(thicknessElement !== null) {
        thicknessElement.onchange = function(event) {
            parameters.thickness = parseFloat(event.target.value);
            zRing.create(parameters);
            // 计算价格
            getprice();
        };
    }

    if(ringHeightElement !== null) {
        ringHeightElement.onchange = function(event) {
            parameters.ringHeight = parseFloat(event.target.value);
            zRing.create(parameters);
            // 计算价格
            getprice();
        };
    }

    if(textHeightElement !== null) {
        textHeightElement.onchange = function(event) {
            parameters.textHeight = parseFloat(event.target.value);
            zRing.create(parameters);
            // 计算价格
            getprice();
        };
    }

    // if(UAElement !== null) {
    //     UAElement.onchange = function(event) {
    //         parameters.upRadius = parseFloat(event.target.value);
    //         zRing.create(parameters);
    //         // 计算价格
    //         getprice();
    //     };
    // }

    // if(DAElement !== null) {
    //     DAElement.onchange = function(event) {
    //         parameters.downRadius = parseFloat(event.target.value);
    //         zRing.create(parameters);
    //         // 计算价格
    //         getprice();
    //     };
    // }

    if(sizeElement !== null) {
        sizeElement.onchange = function(event) {
            parameters.length = parseFloat(event.target.value);
            zRing.create(parameters);
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
              case "web3dRing02Thickness": 
                  parameters.thickness = value; 
                  zRing.create(parameters, true);
                  break; 
              case "web3dRing02RingHeight": 
                  parameters.ringHeight = value;
                  zRing.create(parameters, true); 
                  break; 
              case "web3dRing02TextHeight": 
                  parameters.textHeight = value;
                  zRing.create(parameters, true); 
                  break;
              // case "web3dRing02UA": 
              //     parameters.upRadius = value;
              //     zRing.create(parameters, false);
              //     break; 
              // case "web3dRing02DA": 
              //     parameters.downRadius = value;
              //     zRing.create(parameters, false);
              //     break; 
              }
              // 计算价格
              getprice();
          } 
      }); 

      $('#prd-desp').modal({ show:false }); 
    
    
     // $('#basic').fadeTo(300, 1); 
      $('.tips, input, select').tooltip(); 
  });
    return zRing;
};
