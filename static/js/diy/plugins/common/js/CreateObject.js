function ZText(text) {
    this.text = "3DCITY";
    this.setText(text);
    this.textShapes = {}; // eg {"font" : {"char" : shapes}}
};

ZText.prototype = {
    setText : function(text) {
        if(text !== undefined)
            this.text = text;
    },

    // createTextGeometries : function(textSize, textHeight, textFont, textWeight, textStyle, bevelSize, curveSegments, count) {
    //     if(textSize === undefined) textSize = 20;
    //     if(textHeight === undefined) textHeight = 2;
    //     if(textFont === undefined) textFont = "aldrich";
    //     if(textWeight === undefined) textWeight = "normal";
    //     if(textStyle === undefined) textStyle = "normal";
    //     if(bevelSize === undefined) bevelSize = 0.03;
    //     if(curveSegments === undefined) curveSegments = 5;
    //     if(count === undefined) count = 12;

    //     var words = Utils.limtWordsToSize(this.text, count);

    //     var bevelSegments = 1;

    //     var parameters = {
    //         height : textHeight,
    //         size : textSize,
    //         curveSegments : curveSegments,

    //         font : textFont, 
    //         weight : textWeight, // normal bold
    //         style : textStyle, // normal italic

    //         bevelThickness : bevelSize,
    //         bevelSize : bevelSize,
    //         bevelSegments : bevelSegments,
    //         bevelEnabled : true,
    //     };

    //     var textGeometries = new Array(),
    //         chars = String(words).split(''),
    //         length = chars.length,
    //         textGeometry,
    //         i;

    //     parameters.amount = parameters.height !== undefined ? parameters.height : 50;
    //     for(i=0; i<length; i++) {
    //         if(chars[i] === " ") continue;
    //         if (chars[i] in ZDiyCurves["common"]) {
    //             textGeometry = new THREE.ExtrudeGeometry(ZDiyCurves.generateShapes(ZDiyCurves["common"][chars[i]], parameters.size/5.5), parameters);
    //         } else {
    //             textGeometry = new THREE.ExtrudeGeometry(THREE.FontUtils.generateShapes(chars[i], parameters), parameters);
    //         }
            
    //         textGeometries.push(textGeometry);
    //     }
    //     return textGeometries;
    // }
};

// 定义一个 ZShape 类，用来管理曲线
function ZShape() {
    this.minAccuracy = 0.1;
    this.maxAccuracy = 0.999;
};

ZShape.prototype = {
    createRoundedRectPath : function(_radius, _width, _height, _scale) {
        if(_radius === undefined) _radius = 1.0;
        if(_width === undefined) _width = 0.5;
        if(_height === undefined) _height = 0.5;
        if(_scale === undefined) _scale = 1.0;

        var radius = _radius*_scale, contrlLength = 4 / 3 * (Math.sqrt(2) - 1) * radius,
            width = _width*_scale, halfWidth = width / 2,
            height = _height*_scale, halfHeight = height / 2,
            path = new THREE.Path();
        path.moveTo(radius+halfWidth, halfHeight);
        path.bezierCurveTo(radius+halfWidth, halfHeight+contrlLength, contrlLength+halfWidth, halfHeight+radius, halfWidth, halfHeight+radius);
        if(halfWidth > 0)
           path.lineTo(-halfWidth, halfHeight+radius); 
        path.bezierCurveTo(-halfWidth-contrlLength, halfHeight+radius,-radius-halfWidth, halfHeight+contrlLength, -radius-halfWidth, halfHeight);
        if(halfHeight > 0)
            path.lineTo(-radius-halfWidth, -halfHeight);
        path.bezierCurveTo(-radius-halfWidth, -halfHeight-contrlLength, -contrlLength-halfWidth, -halfHeight-radius, -halfWidth, -halfHeight-radius);
        if(halfWidth > 0)
            path.lineTo(halfWidth, -halfHeight-radius); 
        path.bezierCurveTo(halfWidth+contrlLength, -halfHeight-radius, radius+halfWidth, -halfHeight-contrlLength, radius+halfWidth, -halfHeight);
        if(halfHeight > 0)
            path.lineTo(radius+halfWidth, halfHeight);
        return path;
    },

    createRoundedPolygonPath : function(roundedRadius, polygonRadius, side) {
        roundedRadius = roundedRadius || 0.1;
        polygonRadius = polygonRadius || 1;
        side = side || 3;
        if(side < 3) {
            console.error("The number of sides must be greater than or equal to 3.");
            return null;
        }

        var eachA = Math.PI / side * 2;
        var a = (Math.PI * 2 - eachA * 2) / 4;
        

        var pivotStart = new THREE.Vector3(), pivotEnd = new THREE.Vector3(0, 0, 1);

        // 下左右
        var leftRight = new THREE.Vector3(), rightLeft = new THREE.Vector3(), right = new THREE.Vector3();

        leftRight.x = -polygonRadius * Math.cos(a) + roundedRadius / Math.tan(a);
        leftRight.y = -polygonRadius * Math.sin(a);


        //下右左
        rightLeft.x = polygonRadius * Math.cos(a) - roundedRadius / Math.tan(a);
        rightLeft.y = -polygonRadius * Math.sin(a);


        // 下右点
        right.x = polygonRadius * Math.cos(a);
        right.y = -polygonRadius * Math.sin(a);       
        
        var points = [leftRight, rightLeft, right];

        var path = new THREE.Path();

        var i=0;
        var tempCenterCircle = new THREE.Vector2();
        for(i=1; i<side; i++) {
            points.push(Utils.rotationPoint3D(eachA * i, leftRight, pivotStart, pivotEnd));
            points.push(Utils.rotationPoint3D(eachA * i, rightLeft, pivotStart, pivotEnd));
            points.push(Utils.rotationPoint3D(eachA * i, right, pivotStart, pivotEnd));
        }

        points.push(leftRight);

        path.moveTo(points[0].x, points[0].y);
        for(i=1; i<points.length; i+=3) {
            path.lineTo(points[i].x, points[i].y);
            path.quadraticCurveTo(points[i+1].x, points[i+1].y, points[i+2].x, points[i+2].y);
        }

        return path;
    },

    createCircle : function(_radius) {
        _radius = _radius || 1.0;
        var contrlLength = 4 / 3 * (Math.sqrt(2) - 1) * _radius;
        var path = new THREE.Path();
        path.moveTo(0, _radius);
        path.bezierCurveTo(_radius-contrlLength, _radius, _radius, _radius-contrlLength, _radius, 0);
        path.bezierCurveTo(_radius, -_radius+contrlLength, _radius-contrlLength, -_radius, 0, -_radius);
        path.bezierCurveTo(-_radius+contrlLength, -_radius, -_radius, -_radius+contrlLength, -_radius, 0);
        path.bezierCurveTo(-_radius, _radius-contrlLength, -_radius+contrlLength, _radius, 0, _radius);
        return path;
    },

    createTOCPath : function(_radiusUp, _radiusDown, _width, _heightUD, _heightC) {
        if(_radiusUp === undefined) _radiusUp = this.minAccuracy;
        if(_radiusDown === undefined) _radiusDown = this.minAccuracy;
        if(_width === undefined) _width = 2.0;
        if(_heightUD === undefined) _heightUD = 1.2;
        if(_heightC === undefined) _heightC = 2.5;

        
        if(_radiusUp < this.minAccuracy) _radiusUp = this.minAccuracy;
        else if(_radiusUp > this.maxAccuracy) _radiusUp = this.maxAccuracy;

        if(_radiusDown < this.minAccuracy) _radiusDown = this.minAccuracy;
        else if(_radiusDown > this.maxAccuracy) _radiusDown = this.maxAccuracy;

        var halfWidth = _width/2, halfHeightUD = _heightUD/2, halfHeightC = _heightC/2, 
            radius = (halfHeightC > halfWidth) ?  (halfWidth * this.minAccuracy) : (halfHeightC * this.minAccuracy),
            URadius = (halfHeightUD > halfWidth) ?  (halfWidth * _radiusUp) : (halfHeightUD * _radiusUp), 
            DRadius = (halfHeightUD > halfWidth) ?  (halfWidth * _radiusDown) : (halfHeightUD * _radiusDown);

        if(_heightC === 0) {
            radius = (halfHeightC > halfWidth) ?  (halfWidth * this.minAccuracy) : (halfHeightC * this.minAccuracy),
            URadius = (_heightUD > halfWidth) ?  (halfWidth * _radiusUp) : (_heightUD * _radiusUp), 
            DRadius = (_heightUD > halfWidth) ?  (halfWidth * _radiusDown) : (_heightUD * _radiusDown); 
        }

        var contrlLength = 4 / 3 * (Math.sqrt(2) - 1) * radius,
            contrlLengthUp = 4 / 3 * (Math.sqrt(2) - 1) * URadius,
            contrlLengthDown = 4 / 3 * (Math.sqrt(2) - 1) * DRadius,
            path = new THREE.Path();
            
        path.moveTo(halfWidth, _heightUD + halfHeightC - URadius);
        path.bezierCurveTo(
            halfWidth, _heightUD + halfHeightC + contrlLengthUp - URadius , 
            halfWidth + contrlLengthUp - URadius, _heightUD + halfHeightC, 
            halfWidth - URadius, _heightUD + halfHeightC
        );
        path.lineTo(-halfWidth + URadius, _heightUD + halfHeightC);
        path.bezierCurveTo(
            -halfWidth - contrlLengthUp + URadius, _heightUD + halfHeightC,
            -halfWidth, _heightUD + halfHeightC + contrlLengthUp - URadius,
            -halfWidth, _heightUD + halfHeightC - URadius 
        );
        path.lineTo(-halfWidth, -halfHeightC - _heightUD + DRadius);
        path.bezierCurveTo(
            -halfWidth,  -halfHeightC - _heightUD - contrlLengthDown + DRadius,
            -halfWidth - contrlLengthDown + DRadius, -halfHeightC - _heightUD,
            -halfWidth + DRadius, -halfHeightC - _heightUD
        );

        path.lineTo(halfWidth - DRadius, -halfHeightC - _heightUD);
        path.bezierCurveTo(
            halfWidth + contrlLengthDown - DRadius, -halfHeightC - _heightUD,
            halfWidth, -halfHeightC - _heightUD - contrlLengthDown + DRadius,
            halfWidth, -halfHeightC - _heightUD + DRadius
        );

        if(_heightC > 0) {
            path.lineTo(halfWidth, -halfHeightC - radius);
            path.bezierCurveTo(
                halfWidth, -halfHeightC - radius + contrlLength,
                halfWidth + contrlLength - radius, -halfHeightC,
                halfWidth - radius, -halfHeightC
            );
            path.lineTo(radius, -halfHeightC);
            path.bezierCurveTo(
                radius - contrlLength, -halfHeightC,
                0, -halfHeightC - contrlLength + radius,
                0, -halfHeightC + radius
            );
            path.lineTo(0, halfHeightC - radius);
            path.bezierCurveTo(
                0, halfHeightC + contrlLength - radius,
                radius - contrlLength, halfHeightC,
                radius, halfHeightC
            );
            path.lineTo(halfWidth - radius, halfHeightC);
            path.bezierCurveTo(
                halfWidth + contrlLength -radius, halfHeightC,
                halfWidth, halfHeightC + radius - contrlLength,
                halfWidth, halfHeightC + radius
            );
            path.lineTo(halfWidth, _heightUD + halfHeightC - URadius);
        } else {
            path.lineTo(halfWidth, _heightUD + halfHeightC - URadius);
        }
        return path;
    },

    createTOCPath2 : function(_radius, _width, _heightUD, _heightC) {
        if(_radius === undefined) _radius = 0.05;
        if(_width === undefined) _width = 2.0;
        if(_heightUD === undefined) _heightUD = 1.2;
        if(_heightC === undefined) _heightC = 2.5;

        var halfWidth = _width/2, halfHeightUD = _heightUD/2, halfHeightC = _heightC/2;

        var contrlLength = 4 / 3 * (Math.sqrt(2) - 1) * _radius,
            path = new THREE.Path();
            
        path.moveTo(halfWidth, _heightUD + halfHeightC - _radius);
        path.bezierCurveTo(
            halfWidth, _heightUD + halfHeightC + contrlLength - _radius , 
            halfWidth + contrlLength - _radius, _heightUD + halfHeightC, 
            halfWidth - _radius, _heightUD + halfHeightC
        );
        path.lineTo(-halfWidth + _radius, _heightUD + halfHeightC);
        path.bezierCurveTo(
            -halfWidth - contrlLength + _radius, _heightUD + halfHeightC,
            -halfWidth, _heightUD + halfHeightC + contrlLength - _radius,
            -halfWidth, _heightUD + halfHeightC - _radius 
        );
        path.lineTo(-halfWidth, -halfHeightC - _heightUD + _radius);
        path.bezierCurveTo(
            -halfWidth,  -halfHeightC - _heightUD - contrlLength + _radius,
            -halfWidth - contrlLength + _radius, -halfHeightC - _heightUD,
            -halfWidth + _radius, -halfHeightC - _heightUD
        );

        path.lineTo(halfWidth - _radius, -halfHeightC - _heightUD);
        path.bezierCurveTo(
            halfWidth + contrlLength - _radius, -halfHeightC - _heightUD,
            halfWidth, -halfHeightC - _heightUD - contrlLength + _radius,
            halfWidth, -halfHeightC - _heightUD + _radius
        );

        if(_heightC > 0) {
            path.lineTo(halfWidth, -halfHeightC - _radius);
            path.bezierCurveTo(
                halfWidth, -halfHeightC - _radius + contrlLength,
                halfWidth + contrlLength - _radius, -halfHeightC,
                halfWidth - _radius, -halfHeightC
            );
            path.lineTo(_radius, -halfHeightC);
            path.bezierCurveTo(
                _radius - contrlLength, -halfHeightC,
                0, -halfHeightC - contrlLength + _radius,
                0, -halfHeightC + _radius
            );
            path.lineTo(0, halfHeightC - _radius);
            path.bezierCurveTo(
                0, halfHeightC + contrlLength - _radius,
                _radius - contrlLength, halfHeightC,
                _radius, halfHeightC
            );
            path.lineTo(halfWidth - _radius, halfHeightC);
            path.bezierCurveTo(
                halfWidth + contrlLength - _radius, halfHeightC,
                halfWidth, halfHeightC + _radius - contrlLength,
                halfWidth, halfHeightC + _radius
            );
            path.lineTo(halfWidth, _heightUD + halfHeightC - _radius);
        } else {
            path.lineTo(halfWidth, _heightUD + halfHeightC - _radius);
        }
        return path;
    },

};


// 定义一个 ZGeometry 类，用来管理物体
function ZGeometry() {

};

ZGeometry.prototype = {

    merge : function(geometry1, geometry2, materialIndexOffset) {
        var matrix;

        if ( geometry2 instanceof THREE.Mesh ) {
            geometry2.updateMatrixWorld();
            matrix = geometry2.matrixWorld;
            geometry2 = geometry2.geometry;
        }

        geometry1.merge(geometry2, matrix, materialIndexOffset);
    },

    joinGeometries : function(geometries, isCenter, space, precision) {
        if(isCenter === undefined) isCenter = false;
        var outputGeo = new THREE.Geometry(),
            outputMesh = new THREE.Mesh(outputGeo),
            testBoxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5),
            testMaterial1 = new THREE.MeshBasicMaterial({color : 0xff0000}),
            testMaterial2 = new THREE.MeshBasicMaterial({color : 0x00ff00}),
            // outputGeo.boundingBox = null,
            outputGeoWidth, outputGeoDepth, outputGeoCenter,
            i, j, startX = 0, reference = 2,
            length = geometries.length,
            tempGeo, tempMesh, intersectObject, offset = 0,
            raycaster = new THREE.Raycaster(),
            points = [],
            posX = new THREE.Vector3(1, 0, 0),
            negX = new THREE.Vector3(-1, 0, 0),
            output = {startCenter: new THREE.Vector3(), endCenter: new THREE.Vector3(), meshes : []};
        
        if(length === 1) {
            outputGeo = geometries[0];
            if(!outputGeo.boundingBox)
                outputGeo.computeBoundingBox();
            output.geometry = outputGeo;
            return output;
        }

        for(i=0; i<length; i++) {
            tempGeo = geometries[i];
            tempMesh = new THREE.Mesh(tempGeo);
            tempMesh.position.x = offset;
            // tempMesh.updateMatrixWorld();
            if(tempGeo.boundingBox === null) tempGeo.computeBoundingBox();
            
            // 处理第一个物体
            if(i === 0) {
                this.merge(outputGeo, tempMesh);
                //outputGeo.computeBoundingBox();
                outputGeo.boundingBox = tempGeo.boundingBox.clone();
                //tempGeo.boundingBox = outputGeo.boundingBox.clone();
                outputGeoWidth = outputGeo.boundingBox.max.x - outputGeo.boundingBox.min.x;
                outputGeoDepth = outputGeo.boundingBox.max.z - outputGeo.boundingBox.min.z;
                // if(isCenter) {
                //     startX = -(outputGeo.boundingBox.max.x - outputGeo.boundingBox.min.x)/2;
                // } else {
                    startX = outputGeo.boundingBox.min.x;
                // }
                
                offset = startX + outputGeoWidth;

                // 得到outputGeo的中心
                outputGeoCenter = new THREE.Vector3(
                    (outputGeo.boundingBox.max.x + outputGeo.boundingBox.min.x) / 2,
                    (outputGeo.boundingBox.max.y + outputGeo.boundingBox.min.y) / 2,
                    (outputGeo.boundingBox.max.z + outputGeo.boundingBox.min.z) / 2
                );

                // 更新points列表， 先将pints列表清空， 再加入。
                points.length = 0;
                for(j=outputGeo.boundingBox.min.y; j<outputGeo.boundingBox.max.y; j+=precision) {
                    var mm = new THREE.Mesh(testBoxGeometry.clone(), testMaterial1);
                    mm.position.set(offset + reference, j, outputGeoCenter.z);
                    output.meshes.push(mm);

                    raycaster.set(new THREE.Vector3(offset + reference, j, outputGeoCenter.z), negX);
                    intersectObject = raycaster.intersectObject(outputMesh, false)[0];
                    if(intersectObject !== undefined) {
                        points.push(intersectObject.point);
                    }
                }

                output.startCenter.set(
                    (outputGeo.boundingBox.max.x+outputGeo.boundingBox.min.x)/2,
                    (outputGeo.boundingBox.max.y+outputGeo.boundingBox.min.y)/2,
                    (outputGeo.boundingBox.max.z+outputGeo.boundingBox.min.z)/2
                );
                    
                        
            } else if(i > 0 && i < length) {
                //移动临时物体, 加上reference是使物体之间不要重合
                if(isCenter) {
                    tempMesh.position.x += reference + (tempGeo.boundingBox.max.x - tempGeo.boundingBox.min.x)/2;
                } else {
                    tempMesh.position.x += reference;
                }
                //更新临时物体世界矩阵
                tempMesh.updateMatrixWorld();

                // 定义一个变量记录射线到临时物体的最小距离
                var tempDistance = null;
                for(j=0; j<points.length; j++) {
                    var mm = new THREE.Mesh(testBoxGeometry.clone(), testMaterial2);
                    mm.position.copy(points[j]);
                    output.meshes.push(mm);

                    raycaster.set(points[j], posX);
                    intersectObject = raycaster.intersectObject(tempMesh, true)[0];
                    if(intersectObject !== undefined) {
                        if(tempDistance === null) {
                            tempDistance = intersectObject.distance;
                        } else {
                            if(intersectObject.distance < tempDistance) {
                                tempDistance = intersectObject.distance;
                            } 
                        }
                    }
                } 
                
                // 射线到临时物体的最小距离大于0时，临时物体向左移动该距离
                if(tempDistance > 0) {
                    tempMesh.position.x -= (tempDistance - space);
                }

                if(tempDistance === null) {
                   tempMesh.position.x -= reference; 
                }

                //合并
                this.merge(outputGeo, tempMesh);
                // 重新计算boundingbox
                //outputGeo.computeBoundingBox();
                this.mergeBoundingBox(outputGeo.boundingBox, tempGeo.boundingBox, tempMesh.position.x, 0, 0);
                // 重新计算boundingsphere， 不然后面射线计算时会用旧的boundingsphere
                outputGeo.boundingBox.getBoundingSphere(outputGeo.boundingSphere);
                // outputGeo.computeBoundingSphere();

                outputGeoWidth = outputGeo.boundingBox.max.x - outputGeo.boundingBox.min.x;
                outputGeoDepth = outputGeo.boundingBox.max.z - outputGeo.boundingBox.min.z;
                
                // 得到新的offset位置
                offset = startX + outputGeoWidth;

                // 得到outputGeo的中心
                outputGeoCenter = new THREE.Vector3(
                    (outputGeo.boundingBox.max.x + outputGeo.boundingBox.min.x) / 2,
                    (outputGeo.boundingBox.max.y + outputGeo.boundingBox.min.y) / 2,
                    (outputGeo.boundingBox.max.z + outputGeo.boundingBox.min.z) / 2
                );

                // 更新points列表， 先将pints列表清空， 再加入。
                if(i != length -1) {
                    points.length = 0;
                    for(j=outputGeo.boundingBox.min.y; j<outputGeo.boundingBox.max.y; j+=precision) {
                        var mm = new THREE.Mesh(testBoxGeometry.clone(), testMaterial1);
                        mm.position.set(offset + reference, j, outputGeoCenter.z);
                        output.meshes.push(mm);

                        raycaster.set(new THREE.Vector3(offset + reference, j, outputGeoCenter.z), negX);
                        intersectObject = raycaster.intersectObject(outputMesh, false)[0];
                        if(intersectObject !== undefined) {
                            points.push(intersectObject.point);
                        }
                    }

                    offset = startX + outputGeoWidth;
                } else {
                    // tempGeo.computeBoundingBox();
                    output.endCenter.set(
                        (tempGeo.boundingBox.max.x+tempGeo.boundingBox.min.x)/2 + tempMesh.position.x,
                        (tempGeo.boundingBox.max.y+tempGeo.boundingBox.min.y)/2,
                        (tempGeo.boundingBox.max.z+tempGeo.boundingBox.min.z)/2
                    );
                }
            }    
        }
        
        // var geoClone = outputGeo.clone();
        // geoClone.computeBoundingBox();
        output.geometry = outputGeo;

        return output;
    },

    joinGeometriesSimpleMethod : function(geometries, space) {
        var outputGeo = new THREE.Geometry(),
            // outputGeo.boundingBox = null,
            outputGeoWidth, outputGeoDepth,
            i, j, startX,
            length = geometries.length,
            tempGeo, tempMesh, offset = 0,

            output = {startCenter: new THREE.Vector3(), endCenter: new THREE.Vector3(), meshes : []};
        
        if(length === 1) {
            outputGeo = geometries[0];
            if(!outputGeo.boundingBox)
                outputGeo.computeBoundingBox();
            output.geometry = outputGeo;
            return output;
        }

        for(i=0; i<length; i++) {
            tempGeo = geometries[i];
            tempMesh = new THREE.Mesh(tempGeo);
            if(tempGeo.boundingBox === null) tempGeo.computeBoundingBox();
            
            // 处理第一个物体
            if(i === 0) {
                tempMesh.position.x = offset;

                // 合并
                this.merge(outputGeo, tempMesh);
                outputGeo.boundingBox = tempGeo.boundingBox.clone();
                outputGeoWidth = outputGeo.boundingBox.max.x - outputGeo.boundingBox.min.x;
                outputGeoDepth = outputGeo.boundingBox.max.z - outputGeo.boundingBox.min.z;
                
                startX = outputGeo.boundingBox.min.x;
                offset = startX + outputGeoWidth;

                output.startCenter.set(
                    (outputGeo.boundingBox.max.x+outputGeo.boundingBox.min.x)/2,
                    (outputGeo.boundingBox.max.y+outputGeo.boundingBox.min.y)/2,
                    (outputGeo.boundingBox.max.z+outputGeo.boundingBox.min.z)/2
                );
                    
                        
            } else if(i > 0 && i < length) {
                tempMesh.position.x = offset+space;

                // 合并
                this.merge(outputGeo, tempMesh);
                this.mergeBoundingBox(outputGeo.boundingBox, tempGeo.boundingBox, offset+space, 0, 0);
                console.log(outputGeo.boundingBox);
                outputGeoWidth = outputGeo.boundingBox.max.x - outputGeo.boundingBox.min.x;
                outputGeoDepth = outputGeo.boundingBox.max.z - outputGeo.boundingBox.min.z;
                
                offset = startX + outputGeoWidth;

                if(i != length -1) {
                    offset = startX + outputGeoWidth;
                } else {
                    output.endCenter.set(
                        (tempGeo.boundingBox.max.x+tempGeo.boundingBox.min.x)/2 + tempMesh.position.x,
                        (tempGeo.boundingBox.max.y+tempGeo.boundingBox.min.y)/2,
                        (tempGeo.boundingBox.max.z+tempGeo.boundingBox.min.z)/2
                    );
                }
            }    
        }
        
        output.geometry = outputGeo;

        return output;
    }
};


ZGeometry.prototype.mergeBoundingBox = function(boundingBox1, boundingBox2, px, py, pz) {
    px = px || 0;
    py = py || 0;
    pz = pz || 0;
    var max1 = boundingBox1.max.clone();
    var min1 = boundingBox1.min.clone();
    var max2 = boundingBox2.max;
    var min2 = boundingBox2.min;
    boundingBox1.min.x = Math.min(min1.x, min2.x+px);
    boundingBox1.min.y = Math.min(min1.y, min2.y+py);
    boundingBox1.min.z = Math.min(min1.z, min2.z+pz);
    boundingBox1.max.x = Math.max(max1.x, max2.x+px);
    boundingBox1.max.y = Math.max(max1.y, max2.y+py);
    boundingBox1.max.z = Math.max(max1.z, max2.z+pz);
};


// 定义一个类来管理项链链子
function ZChain(material, publicKey, joinRingEnabled) {
    this.material = material;
    this.chainLeftMeshes = new THREE.Object3D();
    this.chainRightMeshes = new THREE.Object3D();

    // 定义各种链子样式的父物体
    this.crossChainLeftMeshes = new THREE.Object3D();
    this.crossChainRightMeshes = new THREE.Object3D();
    this.seedChainLeftMeshes = new THREE.Object3D();
    this.seedChainRightMeshes = new THREE.Object3D();
    this.snakeChainLeftMeshes = new THREE.Object3D();
    this.snakeChainRightMeshes = new THREE.Object3D();
    this.boxChainLeftMeshes = new THREE.Object3D();
    this.boxChainRightMeshes = new THREE.Object3D();

    this.chainLeftMeshes.add(this.crossChainLeftMeshes);
    this.chainLeftMeshes.add(this.seedChainLeftMeshes);
    this.chainLeftMeshes.add(this.snakeChainLeftMeshes);
    this.chainLeftMeshes.add(this.boxChainLeftMeshes);

    this.chainRightMeshes.add(this.crossChainRightMeshes);
    this.chainRightMeshes.add(this.seedChainRightMeshes);
    this.chainRightMeshes.add(this.snakeChainRightMeshes);
    this.chainRightMeshes.add(this.boxChainRightMeshes);
    this.createChains(publicKey, joinRingEnabled);
    this.setChainMode(2);
};

ZChain.prototype = {
    //项链链子
    createChains : function(publicKey, jre) {
        // 导入十字链
        var self = this;
        var zCorssGeometry = new Utils.ZGeometry();
        zCorssGeometry.parse(publicKey + "/js/diy/plugins/common/meshes/chains/crossChain.mesh", function(g) {
            joinCrossChains(g);
        });

        // 导入瓜子链
        var zSeedGeometry = new Utils.ZGeometry();
        zSeedGeometry.parse(publicKey + "/js/diy/plugins/common/meshes/chains/seedChain.mesh", function(g) {
            joinSeedChains(g);
        });


        // 导入蛇骨链
        var zSnakeGeometry = new Utils.ZGeometry();
        zSnakeGeometry.parse(publicKey + "/js/diy/plugins/common/meshes/chains/snakeChain.mesh", function(g) {
            joinSnakeChains(g);
        });

        // 导入盒子链
        var zBoxGeometry = new Utils.ZGeometry();
        zBoxGeometry.parse(publicKey + "/js/diy/plugins/common/meshes/chains/boxChain.mesh", function(g) {
            joinBoxChains(g);
        });

        

        if(jre) {
            // 链子左边加一个吊环
            var ringGeometry = new THREE.TorusGeometry(0.5, 0.1, 8, 50);
            var leftRingMesh = new THREE.Mesh(ringGeometry, self.material);
            leftRingMesh.rotation.y = Math.PI / 2;
            self.chainLeftMeshes.add(leftRingMesh);

            // 链子右边加一个吊环
            var rightRingMesh = new THREE.Mesh(ringGeometry, self.material);
            rightRingMesh.rotation.y = -Math.PI / 2;
            self.chainRightMeshes.add(rightRingMesh);
        }


        // 导入链子接头
        var corssJointMesh = new THREE.Mesh(undefined, this.material);
        var seedJointMesh = new THREE.Mesh(undefined, this.material);
        var snakeJointMesh = new THREE.Mesh(undefined, this.material);
        var boxJointMesh = new THREE.Mesh(undefined, this.material);
        var zConfigurationJointGeometry = new Utils.ZGeometry();
        zConfigurationJointGeometry.parse(publicKey + "/js/diy/plugins/common/meshes/chains/configurationJoint.mesh", function(g) {
            corssJointMesh.geometry = g;
            self.crossChainLeftMeshes.add(corssJointMesh);
            seedJointMesh.geometry = g;
            self.seedChainLeftMeshes.add(seedJointMesh);
            snakeJointMesh.geometry = g;
            self.snakeChainLeftMeshes.add(snakeJointMesh);
            boxJointMesh.geometry = g;
            self.boxChainLeftMeshes.add(boxJointMesh);
        });

        // 右边接头环
        var corssJointRingMesh = new THREE.Mesh(ringGeometry, this.material);
        var seedJointRingMesh = new THREE.Mesh(ringGeometry, this.material);
        var snakeJointRingMesh = new THREE.Mesh(ringGeometry, this.material);
        var boxJointRingMesh = new THREE.Mesh(ringGeometry, this.material);
        this.crossChainRightMeshes.add(corssJointRingMesh);
        this.seedChainRightMeshes.add(seedJointRingMesh);
        this.snakeChainRightMeshes.add(snakeJointRingMesh);
        this.boxChainRightMeshes.add(boxJointRingMesh);


        // 连接十字链
        function joinCrossChains(chainGeometry) {
            chainGeometry.computeBoundingBox();
            var count = 121,
                i,
                chainMesh,
                chainHeight = chainGeometry.boundingBox.max.y - chainGeometry.boundingBox.min.y,
                chainDepth = chainGeometry.boundingBox.max.z - chainGeometry.boundingBox.min.z;
            // left
            for(i=0; i<count; i++) {
                chainMesh = new THREE.Mesh(chainGeometry, self.material);
                
                if(i % 2 === 0) {
                    chainMesh.rotation.y = Math.PI / 3;
                }
                chainMesh.position.y = 0.8 + i * chainHeight * 0.7;
                self.crossChainLeftMeshes.add(chainMesh);
            } 
            
            // right
            for(i=0; i<count; i++) {
                chainMesh = new THREE.Mesh(chainGeometry, self.material);
                
                if(i % 2 === 0) {
                    chainMesh.rotation.y = -Math.PI / 3;
                }
                chainMesh.position.y = 0.8 + i * chainHeight * 0.7;
                self.crossChainRightMeshes.add(chainMesh);
            }

            corssJointMesh.position.y = chainMesh.position.y + chainHeight/2;
            corssJointRingMesh.position.y = corssJointMesh.position.y + 0.2;
        };


        // 连接瓜子链
        function joinSeedChains(chainGeometry) {
            chainGeometry.computeBoundingBox();
            var count = 81,
                i,
                chainMesh,
                chainHeight = chainGeometry.boundingBox.max.y - chainGeometry.boundingBox.min.y,
                chainDepth = chainGeometry.boundingBox.max.z - chainGeometry.boundingBox.min.z;
            // left
            for(i=0; i<count; i++) {
                chainMesh = new THREE.Mesh(chainGeometry, self.material);
                
                if(i % 2 === 1) {
                    chainMesh.rotation.y = Math.PI / 6;
                }
                chainMesh.position.y = 1.0 + i * chainHeight * 0.88;
                self.seedChainLeftMeshes.add(chainMesh);
            } 
            
            // right
            for(i=0; i<count; i++) {
                chainMesh = new THREE.Mesh(chainGeometry, self.material);
                
                if(i % 2 === 0) {
                    chainMesh.rotation.y = -Math.PI / 6;
                }
                chainMesh.position.y = 1.0 + i * chainHeight * 0.88;
                self.seedChainRightMeshes.add(chainMesh);
            }
            seedJointMesh.position.y = chainMesh.position.y + chainHeight/2;
            seedJointRingMesh.position.y = seedJointMesh.position.y + 0.2;
        };

        // 连接蛇骨链
        function joinSnakeChains(chainGeometry) {
            chainGeometry.computeBoundingBox();
            var count = 121,
                i,
                chainMesh,
                chainHeight = chainGeometry.boundingBox.max.y - chainGeometry.boundingBox.min.y,
                chainDepth = chainGeometry.boundingBox.max.z - chainGeometry.boundingBox.min.z;
   
            // left
            for(i=0; i<count; i++) {
                chainMesh = new THREE.Mesh(chainGeometry, self.material);
                
                if(i % 2 === 1) {
                    chainMesh.rotation.y = Math.PI / 2;
                }
                chainMesh.position.y = 0.8 + i * chainHeight * 0.6;
                self.snakeChainLeftMeshes.add(chainMesh);
            } 
            
            // right
            for(i=0; i<count; i++) {
                chainMesh = new THREE.Mesh(chainGeometry, self.material);
                
                if(i % 2 === 0) {
                    chainMesh.rotation.y = -Math.PI / 2;
                }
                chainMesh.position.y = 0.8 + i * chainHeight * 0.6;
                self.snakeChainRightMeshes.add(chainMesh);
            }
            snakeJointMesh.position.y = chainMesh.position.y + chainHeight/2;
            snakeJointRingMesh.position.y = snakeJointMesh.position.y + 0.4;
        };

        // 连接盒子链
        function joinBoxChains(chainGeometry) {
            chainGeometry.computeBoundingBox();
            var count = 121,
                i,
                chainMesh,
                chainHeight = chainGeometry.boundingBox.max.y - chainGeometry.boundingBox.min.y,
                chainDepth = chainGeometry.boundingBox.max.z - chainGeometry.boundingBox.min.z;
            // left
            for(i=0; i<count; i++) {
                chainMesh = new THREE.Mesh(chainGeometry, self.material);
                
                if(i % 2 === 1) {
                    chainMesh.rotation.y = Math.PI / 2;
                }
                chainMesh.position.y = 0.8 + i * chainHeight * 0.6;
                self.boxChainLeftMeshes.add(chainMesh);
            } 
            
            // right
            for(i=0; i<count; i++) {
                chainMesh = new THREE.Mesh(chainGeometry, self.material);
                
                if(i % 2 === 0) {
                    chainMesh.rotation.y = -Math.PI / 2;
                }
                chainMesh.position.y = 0.8 + i * chainHeight * 0.6;
                self.boxChainRightMeshes.add(chainMesh);
            }
            boxJointMesh.position.y = chainMesh.position.y + chainHeight/2;
            boxJointRingMesh.position.y = boxJointMesh.position.y + 0.4;
        };
    },

    setChainMode :function(mode) { // mode = 1 瓜子链, mode = 2 十字链, mode = 3 蛇骨链, mode = 4 盒子链
        if(mode === undefined) mode = 1;
        switch(mode) {
            case 2:
                if(!this.crossChainLeftMeshes.visible) this.crossChainLeftMeshes.visible = true;
                if(!this.crossChainRightMeshes.visible) this.crossChainRightMeshes.visible = true;
                if(this.seedChainLeftMeshes.visible) this.seedChainLeftMeshes.visible = false;
                if(this.seedChainRightMeshes.visible) this.seedChainRightMeshes.visible = false;
                if(this.snakeChainLeftMeshes.visible) this.snakeChainLeftMeshes.visible = false;
                if(this.snakeChainRightMeshes.visible) this.snakeChainRightMeshes.visible = false;
                if(this.boxChainLeftMeshes.visible) this.boxChainLeftMeshes.visible = false;
                if(this.boxChainRightMeshes.visible) this.boxChainRightMeshes.visible = false;
                break;
            case 1:
                if(this.crossChainLeftMeshes.visible) this.crossChainLeftMeshes.visible = false;
                if(this.crossChainRightMeshes.visible) this.crossChainRightMeshes.visible = false;
                if(!this.seedChainLeftMeshes.visible) this.seedChainLeftMeshes.visible = true;
                if(!this.seedChainRightMeshes.visible) this.seedChainRightMeshes.visible = true;
                if(this.snakeChainLeftMeshes.visible) this.snakeChainLeftMeshes.visible = false;
                if(this.snakeChainRightMeshes.visible) this.snakeChainRightMeshes.visible = false;
                if(this.boxChainLeftMeshes.visible) this.boxChainLeftMeshes.visible = false;
                if(this.boxChainRightMeshes.visible) this.boxChainRightMeshes.visible = false;
                break;
            case 3:
                if(this.crossChainLeftMeshes.visible) this.crossChainLeftMeshes.visible = false;
                if(this.crossChainRightMeshes.visible) this.crossChainRightMeshes.visible = false;
                if(this.seedChainLeftMeshes.visible) this.seedChainLeftMeshes.visible = false;
                if(this.seedChainRightMeshes.visible) this.seedChainRightMeshes.visible = false;
                if(!this.snakeChainLeftMeshes.visible) this.snakeChainLeftMeshes.visible = true;
                if(!this.snakeChainRightMeshes.visible) this.snakeChainRightMeshes.visible = true;
                if(this.boxChainLeftMeshes.visible) this.boxChainLeftMeshes.visible = false;
                if(this.boxChainRightMeshes.visible) this.boxChainRightMeshes.visible = false;
                break;
            case 4:
                if(this.crossChainLeftMeshes.visible) this.crossChainLeftMeshes.visible = false;
                if(this.crossChainRightMeshes.visible) this.crossChainRightMeshes.visible = false;
                if(this.seedChainLeftMeshes.visible) this.seedChainLeftMeshes.visible = false;
                if(this.seedChainRightMeshes.visible) this.seedChainRightMeshes.visible = false;
                if(this.snakeChainLeftMeshes.visible) this.snakeChainLeftMeshes.visible = false;
                if(this.snakeChainRightMeshes.visible) this.snakeChainRightMeshes.visible = false;
                if(!this.boxChainLeftMeshes.visible) this.boxChainLeftMeshes.visible = true;
                if(!this.boxChainRightMeshes.visible) this.boxChainRightMeshes.visible = true;
                break;
        }
    },
};