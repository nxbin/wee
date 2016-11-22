function SYRing(material, publicKey, paras) {
    this.zShape = new ZShape();
    this.zShape.minAccuracy = 0.05;

    this.material = material;
    this.parent = new THREE.Object3D();

    this.innerMesh = null;
    this.outerMesh = null;

    this.zodiacTable = {
        mouse : {},
        cattle : {},
        tiger : {},
        rabbit : {},
        dargon : {},
        snake : {},
        horse : {},
        sheep : {},
        monkey : {},
        chicken : {},
        dog : {},
        pig : {}
    };

    this.publicKey = publicKey;

    this.importZodiaces(paras);

    // 尺子
    this.zPreview = new Utils.ZRingSizePreview();
    this.parent.add(this.zPreview.ZPreviewGroup);
    this.zPreview.setVisible(false);
};

SYRing.prototype = {
    importZodiaces : function(paras) {
        var self = this;

        // 导入鼠
        if(paras.animal === "mouse") importTwoElement(paras.animal, true);
        else importTwoElement("mouse", false);

        // 导入牛
        if(paras.animal === "cattle") importTwoElement(paras.animal, true);
        else importTwoElement("cattle", false);

        // 导入虎
        if(paras.animal === "tiger") importTwoElement(paras.animal, true);
        else importTwoElement("tiger", false);

        // 导入兔
        if(paras.animal === "rabbit") importTwoElement(paras.animal, true);
        else importTwoElement("rabbit", false);

        // 导入龙
        if(paras.animal === "dargon") importOneElement(paras.animal, true);
        else importOneElement("dargon", false);

        // 导入蛇
        if(paras.animal === "snake") importTwoElement(paras.animal, true);
        else importTwoElement("snake", false);

        // 导入马
        if(paras.animal === "horse") importThreeElement(paras.animal, true);
        else importThreeElement("horse", false);

        // 导入羊
        if(paras.animal === "sheep") importTwoElement(paras.animal, true);
        else importTwoElement("sheep", false);

        // 导入猴
        if(paras.animal === "monkey") importTwoElement(paras.animal, true);
        else importTwoElement("monkey", false);

        // 导入鸡
        if(paras.animal === "chicken") importTwoElement(paras.animal, true);
        else importTwoElement("chicken", false);

        // 导入狗
        if(paras.animal === "dog") importTwoElement(paras.animal, true);
        else importTwoElement("dog", false);

        // 导入猪
        if(paras.animal === "pig") importTwoElement(paras.animal, true);
        else importTwoElement("pig", false);

        // 导入一个动物
        function importOneElement(key, callback) {
            var zGeometry01 = new Utils.ZGeometry();
            zGeometry01.parse(self.publicKey + "/js/diy/plugins/suyuan/meshes/zodiac/" + key + "_01.mesh", function(g) {
                g.computeBoundingBox();
                self.zodiacTable[key]["1"] = g;
                self.zodiacTable[key]["2"] = g;
                self.zodiacTable[key]["3"] = g;
                self.zodiacTable[key]["4"] = g;
                self.zodiacTable[key]["5"] = g;
                self.zodiacTable[key]["6"] = g;
                self.zodiacTable[key]["7"] = g;
                if(callback)
                    self.create(paras);
            });
        }

        // 导入二个动物
        function importTwoElement(key, callback) {
            var zGeometry01 = new Utils.ZGeometry();
            zGeometry01.parse(self.publicKey + "/js/diy/plugins/suyuan/meshes/zodiac/" + key + "_01.mesh", function(g) {
                g.computeBoundingBox();
                self.zodiacTable[key]["1"] = g;
                self.zodiacTable[key]["3"] = g;
                self.zodiacTable[key]["5"] = g;
                self.zodiacTable[key]["7"] = g;
                var zGeometry02 = new Utils.ZGeometry();
                zGeometry02.parse(self.publicKey + "/js/diy/plugins/suyuan/meshes/zodiac/" + key + "_02.mesh", function(g) {
                    g.computeBoundingBox(); 
                    self.zodiacTable[key]["2"] = g;
                    self.zodiacTable[key]["4"] = g;
                    self.zodiacTable[key]["6"] = g;
                    if(callback)
                        self.create(paras);
                });
            });
        }


        // 导入三个动物
        function importThreeElement(key, callback) {
            var zGeometry01 = new Utils.ZGeometry();
            zGeometry01.parse(self.publicKey + "/js/diy/plugins/suyuan/meshes/zodiac/" + key + "_01.mesh", function(g) {
                g.computeBoundingBox();
                self.zodiacTable[key]["1"] = g;
                var zGeometry02 = new Utils.ZGeometry();
                zGeometry02.parse(self.publicKey + "/js/diy/plugins/suyuan/meshes/zodiac/" + key + "_02.mesh", function(g) {
                    g.computeBoundingBox(); 
                    self.zodiacTable[key]["2"] = g;
                    self.zodiacTable[key]["4"] = g;
                    self.zodiacTable[key]["6"] = g;
                    var zGeometry03 = new Utils.ZGeometry();
                    zGeometry03.parse(self.publicKey + "/js/diy/plugins/suyuan/meshes/zodiac/" + key + "_03.mesh", function(g) {
                        g.computeBoundingBox();
                        self.zodiacTable[key]["3"] = g;
                        self.zodiacTable[key]["5"] = g;
                        self.zodiacTable[key]["7"] = g;
                        if(callback)
                            self.create(paras);
                    });
                });
            });
        }
    },

    createRingGeometry : function (_path, _radius, _position, _steps) {
        _radius = _radius || 10;
        _position = _position || new THREE.Vector3();
        _steps = _steps || 100;

        var circle_pts = [];

        for(var i=0; i<_steps; i++) {
            circle_pts.push(new THREE.Vector3(_radius * Math.cos(i * 2 * Math.PI / _steps), 0, _radius * Math.sin(i * 2 * Math.PI / _steps)));
        }
        var circle = new THREE.ClosedSplineCurve3(circle_pts);

        var extrudeSettings = {
            steps           : _steps,
            bevelEnabled    : false,
            lidFacesEnabled : false,
            curveSegments : 5,
            extrudePath     : circle
        };

        var m4 = new THREE.Matrix4();
        m4.makeRotationZ(Math.PI/2);

        m4.setPosition(_position);

        Utils.updatePathMatrix(_path, m4);

        var shape = _path.toShapes();

        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        return geometry;
    },

    // 戒指
    create : function(inputParameters, reDraw) {
        if(this.innerMesh !== null && this.innerMesh !== undefined)
            this.parent.remove(this.innerMesh);
        if(this.outerMesh !== null && this.outerMesh !== undefined)
            this.parent.remove(this.outerMesh);

        // 计算戒指半径
        var radius = inputParameters.length / (2 * Math.PI);
        var steps = 100;

        // 制作时需要偏移
        var g_offset = 0.05, g_space = 0.015;
        // 内圈
        var innerWidth = 2, innerHeightUD = 0.6, innerHeightC = 6.2;
        var innerRadius = 0.05;
        var innerPath = this.zShape.createTOCPath2(innerRadius, innerWidth, innerHeightUD, innerHeightC);
        var innerGeometry = this.createRingGeometry(innerPath, radius, new THREE.Vector3(0, 1, 0), steps);

        // 重新计算法线
        innerGeometry.computeFaceNormals();
        innerGeometry.computeVertexNormals(false);

        // 外圈
        var outerGeometry = new THREE.Geometry();
        var outerWidth = 0.8+g_offset, outerHeight = 0.6;
        var outerRadius = 0.05;

        var _offset = 0.05; //外圈偏移半径

        var offset_x = radius + (outerWidth + innerWidth)/2 + _offset;
        var _outerRadius = radius + innerWidth / 2 + _offset;
        var _outerLength = 2 * Math.PI * _outerRadius;

        var outerShape = this.zShape.createRoundedRectPath(outerRadius, outerWidth-outerRadius*2, outerHeight-outerRadius*2).toShapes();
        var ourerExtrudeSettings = {
            steps           : steps,
            bevelEnabled    : false,
            lidFacesEnabled : false,
            curveSegments : 5,
            amount : _outerLength
        };
        var outerGeometryTop = new THREE.ExtrudeGeometry(outerShape, ourerExtrudeSettings);

        var m4 = new THREE.Matrix4();
        m4.setPosition(new THREE.Vector3(offset_x, (innerHeightC-outerHeight)/2-g_space, 0));
        outerGeometry.merge(outerGeometryTop, m4);
        var outerGeometryDown = outerGeometryTop.clone();
        m4.setPosition(new THREE.Vector3(offset_x, -(innerHeightC-outerHeight)/2+g_space, 0));
        outerGeometry.merge(outerGeometryDown, m4);

        // 中间格子
        var ZLWidth = outerWidth-0.012, ZLHeight = outerHeight;
        var ZLRadius = outerRadius;
        var ZLShape = this.zShape.createRoundedRectPath(ZLRadius, ZLWidth-ZLRadius*2, ZLHeight-ZLRadius*2).toShapes();
        var ZLExtrudeSettings = {
            steps           : 1,
            bevelEnabled    : false,
            lidFacesEnabled : false,
            curveSegments : ourerExtrudeSettings.curveSegments,
            amount : innerHeightC-outerHeight*2 + outerRadius * 2,
        };
        var ZLGeometry = new THREE.ExtrudeGeometry(ZLShape, ZLExtrudeSettings);
        m4.makeRotationX(Math.PI/2);
        var p = new THREE.Vector3(offset_x, ZLExtrudeSettings.amount/2, ZLHeight/2);

        // 移动步长
        var eachStep = _outerLength / 7;

        // 格子的长宽
        var cellWidth = eachStep - ZLHeight + 0.1, cellHeight = innerHeightC-outerHeight*2 + 0.1;

        var animalGeometry = null;
        // 动物宽高
        var animalWidth = 0, animalHeight = 0;

        var scaleWidth, scaleHeight, s, _scale = new THREE.Vector3(1, 1, 1);

        // 动物移动矩阵
        var am4 = new THREE.Matrix4();
        var ap = new THREE.Vector3(offset_x-1, 0, (eachStep+ZLHeight)/2);

        // 循环
        for(var i=0; i<7; i++) {
            m4.setPosition(p);
            outerGeometry.merge(ZLGeometry, m4);
            p.z += eachStep;

            // 加入动物
            if(this.zodiacTable[inputParameters.animal][i+1] !== null) {
                am4.makeRotationY(Math.PI/2);
                am4.setPosition(ap);
                animalGeometry = this.zodiacTable[inputParameters.animal][i+1].clone();
                animalGeometry.boundingBox = this.zodiacTable[inputParameters.animal][i+1].boundingBox.clone();
                animalWidth = animalGeometry.boundingBox.max.x - animalGeometry.boundingBox.min.x;
                animalHeight = animalGeometry.boundingBox.max.y - animalGeometry.boundingBox.min.y;
                
                scaleWidth = cellWidth / animalWidth;
                scaleHeight = cellHeight / animalHeight;

                s = scaleWidth < scaleHeight ? scaleWidth : scaleHeight;
                _scale.set(s, s, 1);
                am4.scale(_scale);

                outerGeometry.merge(animalGeometry, am4);
                ap.z += eachStep;
            }
        }

        // 弯曲
        var bend = new THREE.BendModifier(outerGeometry);
        bend.bendAxis = "+z";
        bend.bendAngle = 360;
        bend.modify();


        this.innerMesh = new THREE.Mesh(innerGeometry, this.material);
        this.outerMesh = new THREE.Mesh(outerGeometry, this.material);

        this.parent.add(this.innerMesh);
        this.parent.add(this.outerMesh);

        // 更新尺子
        this.zPreview.update(radius, 7.4, 2);

        // 计算价格
        var v = this.getVolume() / 1000;
        console.log(v);
        Utils.getPrice(v, globalMaterialStyleIDName, globalChainPrice);
    },

    getVolume : function() {
        if(this.innerMesh instanceof THREE.Mesh && this.outerMesh instanceof THREE.Mesh) {
            return Utils.computeModelVolume(this.innerMesh.geometry) + Utils.computeModelVolume(this.outerMesh.geometry);
        } else {
            return 0;
        }
    },

    saveToSTL : function(isAscii) {
        if (isAscii === undefined) isAscii = true;
        var output;
        if(isAscii) {
            output = "solid ring\n";
            output += Utils.saveModelToAsciiSTL(this.innerMesh);
            output += Utils.saveModelToAsciiSTL(this.outerMesh);
            output +="endsolid ring";
        } else {
        	output = Utils.saveModelToBinarySTL([this.innerMesh, this.outerMesh]);
            console.log(output);
        }

        return output;
    }
};


// html中执行
function execute() {
    var animalElement = document.getElementById("web3dSYRing01Animal");
    var sizeElement = document.getElementById("web3dSYRing01Size");

    var parameters = {
        animal : animalElement.value,
        length : parseFloat(sizeElement.value)
    };

    var syRing = new SYRing(materialManage.material, webpath, parameters);

    // 计算价格
    // getprice();

    viewport(canvas, syRing.parent, new THREE.Vector3(0, 25, 25), pmg_global_background);

    if(animalElement !== null) {
        animalElement.onchange = function(event) {
            parameters.animal = event.target.value;
            syRing.create(parameters);
        };
    }
    
    if(sizeElement !== null) {
        sizeElement.onchange = function(event) {
            parameters.length = parseFloat(event.target.value);
            syRing.create(parameters);
        };
    }

    return syRing;
};
