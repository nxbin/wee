var Utils = {
    IsMobile : {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        Any: function() {
            return (Utils.IsMobile.Android() || Utils.IsMobile.BlackBerry() || Utils.IsMobile.iOS() || Utils.IsMobile.Opera() || Utils.IsMobile.Windows());
        }
    }
};

Utils.indexOf = function(list, element) {
    for (var i=0; i<list.length; i++) {
        if (list[i] === element) return true;
    }
    return false;
};

// 得到指定范围内的随机整数
Utils.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 分割文字路径得到{name : false", weight : "", style : ""}
Utils.getFontParas = function(fontPathName) {
    var output = {name : "", weight : "normal", style : "normal"};
    var split = fontPathName.split("_");
    var len = split.length;
    if(len >= 1 && len <= 3) {
       output.name = split[0];
       if(len >= 2) {
            output.weight = split[1];
            if(len === 3) {
                output.style = split[2];
            }
       }
    } else {
        return null;
    }

    return output;
};

// 连接文字第一种方法
Utils.getWords01 = function (input) {
    var len = input.length;
    
    if(len>0 && len <=6) {
         var result = [], s = 0, i;

         if(len === 1) s = 6;
         else if(len === 2) s = 3;
         else s = 2;

         for(i=0; i<s; i++) {
            result.push(input);
         } 
         return result;

    } else if(len>6 && len<=12) {
        return input;
    } else if(len>12) {
        return input.slice(0, 12);
    } else {
        return [];
    }
};

// 连接文字第二种方法
Utils.getWords02 = function (input, size) {
    if(size === undefined) size = 12;
    var len = input.length;
    if(len>0 && len <=size) {
         if(len === 1) return [input, input];
         else return input;
    } else if(len>size) {
        return input.slice(0, size);
    } else {
        return [];
    }
};

// 连接文字第三种方法
Utils.getWords03 = function (input, size) {
    var result = [];
    var len = input.length;
    var i;
    if(len>0 && len<size) {
        while(true) {
            for(i=0; i<len; i++) {
                if(result.length === size) return result;
                else result.push(input[i]);
            }
        }
    } else if(len === size) return input;
    else if(len>size) return input.slice(0, size);

    return result;
};

// 截取文字到size
Utils.limtWordsToSize = function (input, size) {
    var len = input.length;
    if(len>0 && len <=size) {
         return input;
    } else if(len>size) {
        return input.slice(0, size);
    } else {
        return [];
    }
};

// 根据正则表达式得到文字或者元素列表[旧版]
Utils.getWordsArrayFromRegularExpressionOld = function(words, regular) { //regular 是正则表达式
    var output = [];
    if(words === undefined || regular === undefined) return output;
    var splits = words.split(regular);
    var matches = words.match(regular);
    for(var i=0; i<splits.length; i++) {
        for(var j=0; j<splits[i].length; j++) {
            if(splits[i].length > 0) {
                output.push(splits[i][j]);
            }
        }
        if(matches !== null && i !== splits.length-1) {
            output.push(matches[i]);
        }
    }
    return output;
};

// 根据正则表达式得到文字或者元素列表[新版]
Utils.getWordsArrayFromRegularExpressionNew = function(words, regular) { //regular 是正则表达式
    var output = [], eachWordUnicode, eachMatch;
    for(var i=0; i<words.length; i++) {
        eachWordUnicode = ("00"+words.charCodeAt(i).toString(16)).slice(-4);
        eachMatch = eachWordUnicode.match(regular);
        console.log(eachMatch);
        if(eachMatch !== null) {
            output.push(eachWordUnicode);
        } else {
            output.push(words[i]);
        }
    }
    return output;
};


// 生成文字曲线shape
Utils.generateWordShape = function(word, textSize, textFont, textWeight, textStyle) {
    if(word === undefined) word = "z";
    if(textSize === undefined) textSize = 10;
    if(textFont === undefined) textFont = "aldrich";
    if(textWeight === undefined) textWeight = "normal";
    if(textStyle === undefined) textStyle = "normal"; 
    var textParas = {
        size : textSize,
        font : textFont, 
        weight : textWeight, // normal bold
        style : textStyle // normal italic
    };

    return THREE.FontUtils.generateShapes(word, textParas);
};

// 创建文字模型列表
// 文字
Utils.generateGeometriesFromShpesList = function(shapesList, thickness, bevelSize, offset_x, offset_y, offset_z, curves_segments, needHeight) {
    if(shapesList === undefined) shapesList = [];
    if(thickness === undefined) thickness = 2;
    if(bevelSize === undefined) bevelSize = 0.03;
    if(offset_x === undefined) offset_x = 0;
    if(offset_y === undefined) offset_y = 0;
    if(offset_z === undefined) offset_z = 0;
    if(curves_segments === undefined) curves_segments = 5;
    if(needHeight === undefined) needHeight = 10.0;

    var extrudeParas = {
        amount : thickness-bevelSize*2,
        curveSegments : curves_segments,
        bevelThickness : bevelSize,
        bevelSize : bevelSize,
        bevelSegments : 5,
        bevelEnabled : true
    };

    var needSize = 6;


    // 生成文字
    var wordGeometry, output = {geometries : [], rotates : []},
        tempPosition = new THREE.Vector3(),
        tempScale = new THREE.Vector3(1, 1, 1),

        tempMatrix = new THREE.Matrix4(),
        s;

    needSize = shapesList.length;
    for(var i=0; i<needSize; i++) {
        wordGeometry = new THREE.ExtrudeGeometry(shapesList[i], extrudeParas);
        wordGeometry.computeBoundingBox();

        tempPosition.set(
            -(wordGeometry.boundingBox.max.x + wordGeometry.boundingBox.min.x)/2,
            -(wordGeometry.boundingBox.max.y + wordGeometry.boundingBox.min.y)/2,
            -(wordGeometry.boundingBox.max.z + wordGeometry.boundingBox.min.z)/2
        );


        s = needHeight/(wordGeometry.boundingBox.max.y - wordGeometry.boundingBox.min.y);
        tempScale.set(s, s, 1);

        // 更新矩阵
        tempMatrix.identity();
        tempMatrix.setPosition(tempPosition);

        // 更新geometry
        wordGeometry.applyMatrix(tempMatrix);

        // 更新矩阵
        tempMatrix.identity();
        tempMatrix.scale(tempScale);

        // 更新geometry
        wordGeometry.applyMatrix(tempMatrix);

        // 更新矩阵
        tempMatrix.identity();
        tempPosition.set(offset_x, offset_y, offset_z);
        tempMatrix.setPosition(tempPosition);

        // 更新geometry
        wordGeometry.applyMatrix(tempMatrix);

        // 
        wordGeometry.computeBoundingBox();

        output.geometries.push(wordGeometry);
        output.rotates.push(2*Math.PI*i/needSize);
    }
    return output;
};

//保留小数点后几位，1位 d=1，2位 d=2 ...
Utils.decimalPointAfter = function(v, d) {
    var num = d === undefined ? Math.pow(10, 2) : Math.pow(10, d);
    return Math.round(v * num) / num;
};

Utils.rotationPoint3D = function (radian, old_piont, pivot_start, pivot_end) {
    var c = Math.cos(radian);
    var s = Math.sin(radian);
    var new_point = new THREE.Vector3();

    var old_x = old_piont.x;
    var old_y = old_piont.y;
    var old_z = old_piont.z;

    var p = new THREE.Vector3();
    p.subVectors(pivot_end, pivot_start).normalize();

    var u = p.x, v = p.y, w = p.z;

    var x =  pivot_start.x, y = pivot_start.y, z = pivot_start.z;

    var uu = u * u,
        uv = u * v, 
        uw = u * w,
        vv = v * v, 
        vw = v * w, 
        ww = w * w,

        xu = x * u,
        xv = x * v,
        xw = x * w,
        yu = y * u,
        yv = y * v,
        yw = y * w,
        zu = z * u,
        zv = z * v,
        zw = z * w;

    var m11 = uu +(vv + ww) * c,
        m12 = uv * (1 - c) - w * s,
        m13 = uw * (1 - c) + v * s,
        m14 = (x * (vv + ww) - u * (yv + zw)) * (1 - c) + (yw - zv) * s,

        m21 = uv * (1 - c) + w * s,
        m22 = vv + (uu + ww) * c,
        m23 = vw * (1 - c) - u * s,
        m24 = (y * (uu + ww) - v * (xu + zw)) * (1 - c) + (zu - xw) * s,

        m31 = uw * (1 - c) - v * s,
        m32 = vw * (1 - c) + u * s,
        m33 = ww + (uu + vv) * c,
        m34 = (z * (uu + vv) - w * (xu + yv)) * (1 - c) + (xv - yu) * s;

    var new_x = m11 * old_x + m12 * old_y + m13 * old_z + m14,
        new_y = m21 * old_x + m22 * old_y + m23 * old_z + m24,
        new_z = m31 * old_x + m32 * old_y + m33 * old_z + m34;

    new_point.set(new_x, new_y, new_z);
    return new_point;
};

//得到点新的坐标
Utils.getPosition = function(radian, up, eye, target, axis) {
    var x = new THREE.Vector3(),
        y = new THREE.Vector3(),
        z = new THREE.Vector3();

    z.subVectors(eye, target).normalize();
    x.crossVectors(up, z).normalize();
    y.crossVectors(z, x).normalize();

    //rotate_y = new THREE.Vector3();
    var end;
    if (axis === undefined) axis = "y";
    if(axis === "y") {
        end = y.add(target);
    } else if(axis === "x") {
        end = x.add(target);
    } else if(axis === "z") {
        end = z.add(target);
    } else {
        return new THREE.Vector3();
    }

    var p = Utils.rotationPoint3D(radian, eye, target, end);
    return p;
};

// 更新path的矩阵
Utils.updatePathMatrix = function(path, matrix) {
    if(matrix === undefined) matrix = new THREE.Matrix4();
    var actions = path.actions, tempVector3 = new THREE.Vector3();
    for(var i=0; i< actions.length; i++) {
        for(var j=0; j<actions[i].args.length; j+=2)  {
            tempVector3.set(actions[i].args[j], actions[i].args[j+1], 0);
            tempVector3.applyMatrix4(matrix);
            actions[i].args[j] = tempVector3.x;
            actions[i].args[j+1] = tempVector3.y;
        }
    }
}; 

// 保存文本模型数据
Utils.saveModelToAsciiSTL = function(geometry) { 
    var output = "";
    // 判断输入的geometry的类是否属于THREE.Mesh
    if(geometry instanceof THREE.Mesh) {
        geometry.updateMatrixWorld();
        var matrix = geometry.matrixWorld;
        geometry = geometry.geometry.clone();
        geometry.applyMatrix(matrix);
    }

    if(!(geometry instanceof THREE.Geometry)) return output;
    
    var vertices = geometry.vertices,
        faces = geometry.faces;

    function outputFun(vertices, faces) {
        var vertex1, vertex2, vertex3, faceNormal
        for(var i=0; i<faces.length; i++) {
            vertex1 = vertices[faces[i].a];
            vertex2 = vertices[faces[i].b];
            vertex3 = vertices[faces[i].c];
            faceNormal = faces[i].normal;
            output += (
                "  facet normal " + 
                Utils.decimalPointAfter(faceNormal.x, 5).toString() + " " +
                Utils.decimalPointAfter(faceNormal.y, 5).toString() + " " +
                Utils.decimalPointAfter(faceNormal.z, 5).toString() + "\n    outer loop\n"+
                "      vertex " +
                Utils.decimalPointAfter(vertex1.x, 5).toString() + " " +
                Utils.decimalPointAfter(vertex1.y, 5).toString() + " " +
                Utils.decimalPointAfter(vertex1.z, 5).toString() + "\n" +
                "      vertex " +
                Utils.decimalPointAfter(vertex2.x, 5).toString() + " " +  
                Utils.decimalPointAfter(vertex2.y, 5).toString() + " " + 
                Utils.decimalPointAfter(vertex2.z, 5).toString() + "\n" +
                "      vertex " +
                Utils.decimalPointAfter(vertex3.x, 5).toString() + " " + 
                Utils.decimalPointAfter(vertex3.y, 5).toString() + " " +
                Utils.decimalPointAfter(vertex3.z, 5).toString() + "\n    endloop\n  endfacet\n" 
            );
        }
    }

    outputFun(vertices, faces);
    
    return output;
};

// 保存二进制模型数据
Utils.saveModelToBinarySTL = function(geometry) {
    var i, j, geo, matrix, vertices = [], faces = [], fLength = 0;
    // 判断输入的geometry的类是否属于Array
    if(!(geometry instanceof Array)) geometry = [geometry];
    for(i=0; i<geometry.length; i++) {
        geo = geometry[i];
        // 判断输入的geo的类是否属于THREE.Mesh
        if(geo instanceof THREE.Mesh) {
            geo.updateMatrixWorld();
            matrix = geo.matrixWorld;
            geo = geo.geometry.clone();
            geo.applyMatrix(matrix);
        }

        if(!(geo instanceof THREE.Geometry)) continue; 

        vertices.push(geo.vertices);

        faces.push(geo.faces);

        fLength += geo.faces.length;
    }
    console.log(faces);
    // 定义一个ArrayBuffer容器保存stl二进制信息
    var outputArrayBuffer = new ArrayBuffer(fLength * 50 + 84),
        dataView = new DataView(outputArrayBuffer, 0);

    // 前面80个字节用来描述创建的信息
    for(j=0; j<20; j++) {
        dataView.setFloat32(j*4, j);
    }

    // 这四个字节记录该模型的面数量
    dataView.setUint32(80, fLength, true);


    // 循环将每个面的法线和三个顶点的数据填入到ArrayBuffer中
    var vertex1, vertex2, vertex3, faceNormal, tempCount = 84;
    for(i=0; i<faces.length; i++) {
        console.log(faces[i].length);
        for(j=0; j<faces[i].length; j++) {
            vertex1 = vertices[i][faces[i][j].a];
            vertex2 = vertices[i][faces[i][j].b];
            vertex3 = vertices[i][faces[i][j].c];
            faceNormal = faces[i][j].normal;

            dataView.setFloat32(tempCount, faceNormal.x, true);
            dataView.setFloat32(tempCount+4, faceNormal.y, true);
            dataView.setFloat32(tempCount+8, faceNormal.z, true);

            dataView.setFloat32(tempCount+12, vertex1.x, true);
            dataView.setFloat32(tempCount+16, vertex1.y, true);
            dataView.setFloat32(tempCount+20, vertex1.z, true);

            dataView.setFloat32(tempCount+24, vertex2.x, true);
            dataView.setFloat32(tempCount+28, vertex2.y, true);
            dataView.setFloat32(tempCount+32, vertex2.z, true);
            

            dataView.setFloat32(tempCount+36, vertex3.x, true);
            dataView.setFloat32(tempCount+40, vertex3.y, true);
            dataView.setFloat32(tempCount+44, vertex3.z, true);

            tempCount += 50;
        }
    }

    return outputArrayBuffer;
};

// 计算模型体积
Utils.computeModelVolume = function(geometry) {
    var outVolume = 0
    // 判断输入的geometry的类是否属于THREE.Mesh
    if(geometry instanceof THREE.Mesh) {
        geometry.updateMatrixWorld();
        var matrix = geometry.matrixWorld;
        geometry = geometry.geometry.clone();
        geometry.applyMatrix(matrix);
        //geometry.computeFaceNormals();
    }

    
    if(!(geometry instanceof THREE.Geometry)) return 0;

    // 判断模型的boundingBox是否存在，如果不存在重新计算
    if(geometry.boundingBox === null) geometry.computeBoundingBox();

    // 更具模型的boundingBox得到其中心点
    var center = new THREE.Vector3(
        (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2,
        (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2,
        (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2
    );

    // 得到模型的顶点列表
    var vertices = geometry.vertices;

    // 得到模型的面列表
    var faces = geometry.faces;
    var fLength = faces.length;
    var eachVolume;
    for(var i=0; i<fLength; i++) {
        eachVolume = computeVolumeFromFace(faces[i]);
        if(!isNaN(eachVolume))
            outVolume += eachVolume;
    }

    // 取体积的绝对值
    outVolume = Math.abs(outVolume);
    
    return outVolume

    // 计算每个面和中心点组成的三棱锥的体积
    function computeVolumeFromFace(face) {
        var v1 = vertices[face.a], v2 = vertices[face.b], v3 = vertices[face.c];
        
        // 计算三菱锥的高
        var fNormal = face.normal;
        // 法线归一化
        fNormal.normalize();

        // 根据平面公式计算d的值
        var d = -(fNormal.x * v1.x +  fNormal.y * v1.y + fNormal.z * v1.z);

        // 计算中心点到平面的距离
        var height = fNormal.x * center.x + fNormal.y * center.y + fNormal.z * center.z + d;
        
        // 计算face的表面积
        var vAB = new THREE.Vector3(), vAC = new THREE.Vector3();
        vAB.subVectors(v2, v1);
        vAC.subVectors(v3, v1);
        var ABDotAC = vAB.x * vAC.x + vAB.y * vAC.y + vAB.z * vAC.z;
        var mAB = Math.sqrt(vAB.x * vAB.x + vAB.y * vAB.y + vAB.z * vAB.z);
        var mAC = Math.sqrt(vAC.x * vAC.x + vAC.y * vAC.y + vAC.z * vAC.z);
        var faceArea = 0.5 * Math.sqrt(Math.pow(mAB * mAC, 2) - Math.pow(ABDotAC, 2));

        // 计算体积
        var volume = 1/3 * faceArea * height;

        return volume;
    }
};


//实时进行的价格计算
Utils.getPrice = function(volume, materialValueId, chainPrice) {
	if(chainPrice === undefined) chainPrice = 0;
	var mValue= document.getElementById(materialValueId).value;//获取材料的当前选择值
	var cid=document.getElementById('cid').value;
	
	var pmaFormula_s=eval("pma_diy_formula_s_"+mValue).replace("V", volume);
	var pmaFormula_b=eval("pma_diy_formula_b_"+mValue).replace("V", volume);
	var pma_necklace_price=eval("pma_necklace_price_"+mValue);

	if(volume>1){
		var price=parseInt(eval(pmaFormula_b)) + chainPrice;
	}else{
		var price=parseInt(eval(pmaFormula_s)) + chainPrice;
	}
	document.getElementById('showprice').innerHTML=price;
	document.getElementById('price').value=price;
};


// 导入.Mesh模型
Utils.ZGeometry = function() {
    this.geometry = null;
}

Utils.ZGeometry.prototype = {
    parse : function(url, callback) {
        var self = this;
        var request = new XMLHttpRequest();
        request.open("GET", url, true);

        request.responseType = "arraybuffer";

        request.addEventListener("load", function(event) {
            //if(event.target.responseText) {
            //	var json = JSON.parse(event.target.responseText);
            //	self.read(json, url);
            //}
            var buffer = event.target.response;
            if(buffer) {
                self.read(buffer, true, url);
                callback(self.geometry);
            }
        }, false);

        var recode_process = 0
        request.addEventListener("progress", function(event) {
            if(event.lengthComputable) {
                var percentComplete = event.loaded / event.total;
                console.log("output: "+ percentComplete);
            }
        }, false);


        request.send(null);
    },

    read : function(data, binary, url) { //geometry json
        var self = this;

        function isBitSet(value, position) {
            return value & (1 << position);
        }
        var vertices = [],
            normals = [],
            uvs = [],
            faces = [],
            colors = [],
            uvLayers = 0;

        if(binary) {
            function parseString(data, offset, length) {
                var charArray = new Uint8Array( data, offset, length);
                var text = "";
                for ( var i = 0; i < length; i ++ ) {
                    text += String.fromCharCode( charArray[ offset + i ]);
                }
                return text;
            };

            function parseUChar8(data, offset) {
                var charArray = new Uint8Array(data, offset, 1);
                return charArray[0];
            };

            function parseUInt32(data, offset) {
                var intArray = new Uint32Array(data.slice(offset, offset+4), 0, 1);
                return intArray[0];
            };

            function parseFloat32(data, offset) {
                var floatArray = new Float32Array(data.slice(offset, offset+4), 0, 1);
                return floatArray[0];
            };

            var point = 0,
                i, j;

            uvLayers = parseUChar8(data, point);
            
            point += 1;

            var uv_counts = new Array();
            for(i=0; i<uvLayers; i++) {
                uv_counts.push(parseUInt32(data, point));
                point += 4;
            }

            var normal_count = parseUInt32(data, point);
            point += 4;

            var vertex_count = parseUInt32(data, point);
            point += 4;

            var face_infos = parseUInt32(data, point);
            point += 4;

            // uvs
            var uv;
            for(i=0; i<uv_counts.length; i++) {
                uv = [];

                for(j=0; j<uv_counts[i]*2; j++) {
                    uv.push(parseFloat32(data, point));
                    point += 4;
                }
                if(uv.length > 0) uvs.push(uv);
            }
            
            // normals
            for(i=0; i<normal_count*3; i++) {
                normals.push(parseFloat32(data, point));
                point += 4;
            }

            // vertices
            for(i=0; i<vertex_count*3; i++) {
                vertices.push(parseFloat32(data, point));
                point += 4;
            }

            // faces
            for(i=0; i<face_infos; i++) {
                faces.push(parseUInt32(data, point));
                point += 4;
            }   
            
        } else {
            var json = data;
            vertices = json.data.vertices;
            normals = json.data.normals;
            uvs = json.data.uvs;
            faces = json.data.faces;
            colors = json.data.colors;
            // uv layers
            if(uvs !== undefined) {
                if (uvs.length > 0) {
                    // disregard empty arrays
                    for(var i=0; i<uvs.length; i++) {
                        if(uvs[i].length) uvLayers++;
                    }
                }               
            }
        }

        var geometry = new THREE.Geometry();

        // uuid
        geometry.uuid = url;


        // vertices
        if(vertices.length > 0) {
            for(var i=0; i<vertices.length; i+=3) {
                var vertex = new THREE.Vector3(vertices[i], vertices[i+1], vertices[i+2]);
                geometry.vertices.push(vertex);
            }
        }


        // faces
        var faces_size = faces.length
        if(faces_size > 0) {
            var offset = 0;
            var type, face, material_index, uv_index, u, v, normal_index, color_index, face_number;

            var isTriangle,
            hasMaterial,
            hasFaceVertexUv,
            hasFaceNormal,
            hasFaceVertexNormal,
            hasFaceColor,
            hasFaceVertexColor;

            while(offset < faces_size) {
                // 
                type = faces[offset++];
                isTriangle          = !isBitSet(type, 0);
                hasMaterial         = isBitSet(type, 1);
                hasFaceVertexUv     = isBitSet(type, 3);
                hasFaceNormal       = isBitSet(type, 4);
                hasFaceVertexNormal = isBitSet(type, 5);
                hasFaceColor        = isBitSet(type, 6);
                hasFaceVertexColor  = isBitSet(type, 7);

                //
                if(isTriangle) {
                    // new a face
                    face = new THREE.Face3();
                    face.a = faces[offset++];
                    face.b = faces[offset++];
                    face.c = faces[offset++];

                    // material is true
                    if(hasMaterial) {
                        material_index = faces[offset++];
                        face.materialIndex = material_index;
                    }

                    // face vertex uv is true
                    face_number = geometry.faces.length;
                    if(uvs !== undefined) {
                        if(hasFaceVertexUv) {
                            if(uvLayers > 0) {
                                for(var i=0; i<uvLayers; i++) {
                                    if(geometry.faceVertexUvs[i] === undefined) {
                                        geometry.faceVertexUvs.push([]);
                                    }

                                    geometry.faceVertexUvs[i][face_number] = [];
                                    for(var j=0; j<3; j++) {
                                        uv_index = faces[offset++];
                                        u = uvs[i][uv_index*2];
                                        v = uvs[i][uv_index*2 + 1];
                                        geometry.faceVertexUvs[i][face_number].push(new THREE.Vector2(u, v));
                                    }                                       
                                }
                            }
                        }                           
                    }

                    // if have not uv2, copy uv1 to uv2, beacuse light map is uv2
                    if(geometry.faceVertexUvs.length === 1) {
                        geometry.faceVertexUvs.push(geometry.faceVertexUvs[0]);
                    }


                    // face normal is true
                    if(hasFaceNormal) {
                        normal_index = faces[offset++] * 3;
                        face.normal.set(
                            normals[normal_index],
                            normals[normal_index + 1],
                            normals[normal_index + 2]
                        );
                    }

                    // face vertex normal is true
                    if(hasFaceVertexNormal) {
                        for(var i=0; i<3; i++) {
                            normal_index = faces[offset++] * 3;
                            face.vertexNormals.push(
                                new THREE.Vector3(
                                    normals[normal_index],
                                    normals[normal_index + 1],
                                    normals[normal_index + 2]
                                )
                            );
                        }
                    }

                    // face color is true
                    if(hasFaceColor) {
                        color_index = faces[offset++];
                        face.color.setHex(colors[color_index]);
                    }

                    // face vertex color is true
                    if(hasFaceVertexColor) {
                        for(var i=0; i<3; i++) {
                            color_index = faces[offset++];
                            face.vertexColors.push(new THREE.Color(colors[color_index]));                       
                        }
                    }

                    geometry.faces.push(face);
                }       
            }
        }

        // compute face normals
        // if(!hasFaceVertexNormal && !hasFaceNormal)
        geometry.computeFaceNormals();
        
        self.geometry = geometry;
        
    },

    write : function() {
        var result = [];
        function _write(geometry) {
            var data = {};

            data.uid = geometry.uuid;

            if ( geometry.name !== "" ) data.name = geometry.name;

            if ( geometry instanceof THREE.PlaneGeometry ) {

                data.type = 'PlaneGeometry';
                data.width = geometry.width;
                data.height = geometry.height;
                data.widthSegments = geometry.widthSegments;
                data.heightSegments = geometry.heightSegments;

            } else if ( geometry instanceof THREE.CubeGeometry ) {

                data.type = 'CubeGeometry';
                data.width = geometry.width;
                data.height = geometry.height;
                data.depth = geometry.depth;
                data.widthSegments = geometry.widthSegments;
                data.heightSegments = geometry.heightSegments;
                data.depthSegments = geometry.depthSegments;

            } else if ( geometry instanceof THREE.CircleGeometry ) {

                data.type = 'CircleGeometry';
                data.radius = geometry.radius;
                data.segments = geometry.segments;

            } else if ( geometry instanceof THREE.CylinderGeometry ) {

                data.type = 'CylinderGeometry';
                data.radiusTop = geometry.radiusTop;
                data.radiusBottom = geometry.radiusBottom;
                data.height = geometry.height;
                data.radialSegments = geometry.radialSegments;
                data.heightSegments = geometry.heightSegments;
                data.openEnded = geometry.openEnded;

            } else if ( geometry instanceof THREE.SphereGeometry ) {

                data.type = 'SphereGeometry';
                data.radius = geometry.radius;
                data.widthSegments = geometry.widthSegments;
                data.heightSegments = geometry.heightSegments;
                data.phiStart = geometry.phiStart;
                data.phiLength = geometry.phiLength;
                data.thetaStart = geometry.thetaStart;
                data.thetaLength = geometry.thetaLength;

            } else if ( geometry instanceof THREE.IcosahedronGeometry ) {

                data.type = 'IcosahedronGeometry';
                data.radius = geometry.radius;
                data.detail = geometry.detail;

            } else if ( geometry instanceof THREE.TorusGeometry ) {

                data.type = 'TorusGeometry';
                data.radius = geometry.radius;
                data.tube = geometry.tube;
                data.radialSegments = geometry.radialSegments;
                data.tubularSegments = geometry.tubularSegments;
                data.arc = geometry.arc;

            } else if ( geometry instanceof THREE.TorusKnotGeometry ) {

                data.type = 'TorusKnotGeometry';
                data.radius = geometry.radius;
                data.tube = geometry.tube;
                data.radialSegments = geometry.radialSegments;
                data.tubularSegments = geometry.tubularSegments;
                data.p = geometry.p;
                data.q = geometry.q;
                data.heightScale = geometry.heightScale;

            } else if ( geometry instanceof THREE.BufferGeometry ) {

                data.type = 'BufferGeometry';
                var bufferGeometryExporter = new THREE.BufferGeometryExporter();
                data.data = bufferGeometryExporter.parse( geometry );

                delete data.data.metadata;

            } else if ( geometry instanceof THREE.Geometry ) {

                data.type = 'Geometry';
                var geometryExporter = new THREE.GeometryExporter();
                data.data = geometryExporter.parse( geometry );

                delete data.data.metadata;

            }

            return data;
        }

        var d;
        for(var g in this.geometries) {
            d = _write(this.geometries[g]);
            var t = false;
            for(var x in d) {
                t = true;
                break;
            }
            if(t) result.push(d);
        }

        return result;   
    }
};


// 
Utils.ZPreview = function() {
    this.ZPreviewGroup = new THREE.Object3D();
    this.widthLineMaterial = new THREE.LineBasicMaterial();
    this.widthLineMaterial.color.setStyle(ZDIYCONFIGURE.PREVIEW_MAIN_COLOR);
    this.LDLineMaterial = new THREE.LineBasicMaterial();
    this.LDLineMaterial.color.setStyle(ZDIYCONFIGURE.PREVIEW_SUB_COLOR);
    this.widthLineMaterial.depthTest = false;
    this.widthLineMaterial.transparent = true;
    this.LDLineMaterial.depthTest = false;
    this.LDLineMaterial.transparent = true;

    this.LDLineGeometry = new THREE.Geometry();
    this.LDLineGeometry.vertices = [new THREE.Vector3(0, -0.25, 0), new THREE.Vector3(0, 0.25, 0)];
};

Utils.ZPreview.prototype = {
    setVisible : function(visible) {
        if(visible === undefined) visible = true;
        this.ZPreviewGroup.visible = visible;
    },

    getVisible : function() {
        return this.ZPreviewGroup.visible;
    }
};

// 定义显示信息的类
Utils.ZMessagePreview = function(size) {
    Utils.ZPreview.call(this);
    this.messageCanvas = document.createElement("canvas");
    this.messageCanvas.width = ZDIYCONFIGURE.PREVIEW_FONT_SIZE * 15;
    this.messageCanvas.height = this.messageCanvas.width;
    this.messageContext = this.messageCanvas.getContext("2d");
    this.messageTexture = new THREE.Texture(this.messageCanvas);
    var messageMaterial = new THREE.SpriteMaterial({map : this.messageTexture, depthTest : false, transparent : true});//{color : 0xff0000, depthTest : false, transparent : true});
    this.messageSprite = new THREE.Sprite(messageMaterial);
    this.setSize(size);
    this.ZPreviewGroup.add(this.messageSprite);
};

Utils.ZMessagePreview.prototype = Object.create(Utils.ZPreview.prototype);

Utils.ZMessagePreview.prototype.update = function(message, pos, offset_x, offset_y, offset_z) {
    if(offset_x === undefined) offset_x = 0;
    if(offset_y === undefined) offset_y = 0;
    if(offset_z == undefined) offset_z = 0;
    this.messageContext.clearRect(0, 0, this.messageCanvas.width, this.messageCanvas.height);
    this.messageContext.textBaseline = 'middle';//设置文本的垂直对齐方式
    this.messageContext.textAlign = 'center'; //设置文本的水平对对齐方式
    this.messageContext.font = ZDIYCONFIGURE.PREVIEW_FONT_STYLE + " " + ZDIYCONFIGURE.PREVIEW_FONT_WEIGHT + " " + ZDIYCONFIGURE.PREVIEW_FONT_SIZE + "px " + ZDIYCONFIGURE.PREVIEW_FONT_FAMILY;
    this.messageContext.fillStyle = ZDIYCONFIGURE.PREVIEW_WORD_COLOR;
    this.messageContext.fillText(message, this.messageCanvas.width/2, this.messageCanvas.height/2);
    this.messageTexture.needsUpdate = true;
    this.messageSprite.position.copy(pos);
    this.messageSprite.position.x += offset_x;
    this.messageSprite.position.y += offset_y;
    this.messageSprite.position.z += offset_z;
};

Utils.ZMessagePreview.prototype.setSize = function(size) {
    if(size !== undefined) this.messageSprite.scale.set(size, size, 1);
    else this.messageSprite.scale.set(20, 20, 1);
};


// boundingbox 尺寸预览
Utils.ZBoundingSizePreview = function() {
    Utils.ZPreview.call( this );
    this.widthLineGeometry = new THREE.Geometry();
    this.heightLineGeometry = new THREE.Geometry();
    this.depthLineGeometry = new THREE.Geometry();

    this.widthLeftLine = null;
    this.widthRightLine = null;
    this.heightUpLine = null;
    this.heightDownLine = null;
    this.depthLeftLine = null;
    this.depthRightLine = null;
    this.create();
};

Utils.ZBoundingSizePreview.prototype = Object.create(Utils.ZPreview.prototype);

Utils.ZBoundingSizePreview.prototype.create = function() {
    this.widthLeftLine = new THREE.Line(this.LDLineGeometry, this.LDLineMaterial);
    this.widthRightLine = new THREE.Line(this.LDLineGeometry, this.LDLineMaterial);
    this.heightUpLine = new THREE.Line(this.LDLineGeometry, this.LDLineMaterial);
    this.heightUpLine.rotation.set(0, 0, Math.PI/2);
    this.heightDownLine = new THREE.Line(this.LDLineGeometry, this.LDLineMaterial);
    this.heightDownLine.rotation.set(0, 0, Math.PI/2);
    this.depthLeftLine = new THREE.Line(this.LDLineGeometry, this.LDLineMaterial);
    this.depthRightLine = new THREE.Line(this.LDLineGeometry, this.LDLineMaterial);

    for(var i=0; i<2; i++) {
        this.widthLineGeometry.vertices.push(new THREE.Vector3());
        this.heightLineGeometry.vertices.push(new THREE.Vector3());
        this.depthLineGeometry.vertices.push(new THREE.Vector3());
    }
    this.ZPreviewGroup.add(new THREE.Line(this.widthLineGeometry, this.widthLineMaterial));
    this.ZPreviewGroup.add(new THREE.Line(this.heightLineGeometry, this.widthLineMaterial)); 
    this.ZPreviewGroup.add(new THREE.Line(this.depthLineGeometry, this.widthLineMaterial));

    this.ZPreviewGroup.add(this.widthLeftLine);
    this.ZPreviewGroup.add(this.widthRightLine);
    this.ZPreviewGroup.add(this.heightUpLine);
    this.ZPreviewGroup.add(this.heightDownLine);
    this.ZPreviewGroup.add(this.depthLeftLine);
    this.ZPreviewGroup.add(this.depthRightLine);
    // this.update();

    // 添加字
    this.widthMessagePreview = new Utils.ZMessagePreview();
    this.heightMessagePreview = new Utils.ZMessagePreview();
    this.depthMessagePreview = new Utils.ZMessagePreview();

    this.ZPreviewGroup.add(this.widthMessagePreview.messageSprite);
    this.ZPreviewGroup.add(this.heightMessagePreview.messageSprite);
    this.ZPreviewGroup.add(this.depthMessagePreview.messageSprite);
};

Utils.ZBoundingSizePreview.prototype.update = function(boundingBox, matrix) {
    if(matrix === undefined) matrix = new THREE.Matrix4();
    // 更新线
    this.widthLineGeometry.vertices[0].set(boundingBox.min.x, boundingBox.min.y-2, boundingBox.max.z);
    this.widthLineGeometry.vertices[1].set(boundingBox.max.x, boundingBox.min.y-2, boundingBox.max.z);
    this.widthLeftLine.position.copy(this.widthLineGeometry.vertices[0]);
    this.widthRightLine.position.copy(this.widthLineGeometry.vertices[1]);

    this.heightLineGeometry.vertices[0].set(boundingBox.max.x+2, boundingBox.max.y, boundingBox.max.z);
    this.heightLineGeometry.vertices[1].set(boundingBox.max.x+2, boundingBox.min.y, boundingBox.max.z);
    this.heightUpLine.position.copy(this.heightLineGeometry.vertices[0]);
    this.heightDownLine.position.copy(this.heightLineGeometry.vertices[1]);

    this.depthLineGeometry.vertices[0].set(boundingBox.max.x+2, boundingBox.min.y-2, boundingBox.min.z);
    this.depthLineGeometry.vertices[1].set(boundingBox.max.x+2, boundingBox.min.y-2, boundingBox.max.z);
    this.depthLeftLine.position.copy(this.depthLineGeometry.vertices[0]);
    this.depthRightLine.position.copy(this.depthLineGeometry.vertices[1]);

    this.widthLineGeometry.verticesNeedUpdate = true;
    this.heightLineGeometry.verticesNeedUpdate = true;
    this.depthLineGeometry.verticesNeedUpdate = true;

    // 更新文字
    var wCenter = new THREE.Vector3();
    wCenter.addVectors(this.widthLineGeometry.vertices[0], this.widthLineGeometry.vertices[1]).multiplyScalar(0.5);
    var hCenter = new THREE.Vector3();
    hCenter.addVectors(this.heightLineGeometry.vertices[0], this.heightLineGeometry.vertices[1]).multiplyScalar(0.5);
    var dCenter = new THREE.Vector3();
    dCenter.addVectors(this.depthLineGeometry.vertices[0], this.depthLineGeometry.vertices[1]).multiplyScalar(0.5);

    var widthMessage = "长:" +　Utils.decimalPointAfter(boundingBox.max.x - boundingBox.min.x, 1) + "毫米";
    var heightMessage = "高:" +　Utils.decimalPointAfter(boundingBox.max.y - boundingBox.min.y, 1) + "毫米";
    var depthMessage = "宽:" +　Utils.decimalPointAfter(boundingBox.max.z - boundingBox.min.z, 1) + "毫米";

    // 宽度
    this.widthMessagePreview.update(widthMessage, wCenter, 0, -2, 0);

    // 高度
    this.heightMessagePreview.update(heightMessage, hCenter);

    // 深度
    this.depthMessagePreview.update(depthMessage, dCenter, 0, -2, 0);

    matrix.decompose(this.ZPreviewGroup.position, this.ZPreviewGroup.quaternion, this.ZPreviewGroup.scale);
};


// 戒指尺寸参考
Utils.ZRingSizePreview = function() {
    Utils.ZPreview.call(this);
    this.ringSize = 72;
    this.ringLineGeometry = new THREE.Geometry();
    this.heightLineGeometry = new THREE.Geometry();
    this.thicknessLineGeometry = new THREE.Geometry();
    this.create();
};

Utils.ZRingSizePreview.prototype = Object.create(Utils.ZPreview.prototype);

Utils.ZRingSizePreview.prototype.create = function() {
    var i;
    for(i=0; i<=this.ringSize; i++) {
       this.ringLineGeometry.vertices.push(new THREE.Vector3());
    }
    for(i=0; i<2; i++) {
        this.heightLineGeometry.vertices.push(new THREE.Vector3());
        this.thicknessLineGeometry.vertices.push(new THREE.Vector3());
    }

    this.thicknessLeftLine = new THREE.Line(this.LDLineGeometry, this.LDLineMaterial);
    this.thicknessRightLine = new THREE.Line(this.LDLineGeometry, this.LDLineMaterial);

    this.heightUpLine = new THREE.Line(this.LDLineGeometry, this.LDLineMaterial);
    this.heightUpLine.rotation.set(0, 0, Math.PI/2);
    this.heightDownLine = new THREE.Line(this.LDLineGeometry, this.LDLineMaterial);
    this.heightDownLine.rotation.set(0, 0, Math.PI/2);

    this.ZPreviewGroup.add(this.thicknessLeftLine);
    this.ZPreviewGroup.add(this.thicknessRightLine);
    this.ZPreviewGroup.add(this.heightUpLine);
    this.ZPreviewGroup.add(this.heightDownLine);


    this.ZPreviewGroup.add(new THREE.Line(this.ringLineGeometry, this.widthLineMaterial));
    this.ZPreviewGroup.add(new THREE.Line(this.heightLineGeometry, this.widthLineMaterial)); 
    this.ZPreviewGroup.add(new THREE.Line(this.thicknessLineGeometry, this.widthLineMaterial));

    // 添加字
    this.ringMessagePreview = new Utils.ZMessagePreview();
    this.heightMessagePreview = new Utils.ZMessagePreview();
    this.thicknessMessagePreview = new Utils.ZMessagePreview();

    this.ZPreviewGroup.add(this.ringMessagePreview.messageSprite);
    this.ZPreviewGroup.add(this.heightMessagePreview.messageSprite);
    this.ZPreviewGroup.add(this.thicknessMessagePreview.messageSprite);
};

Utils.ZRingSizePreview.prototype.update = function(radius, height, thickness) {
    // 设置点的位置
    var i;
    for(i=0; i<=this.ringSize; i++) {
       this.ringLineGeometry.vertices[i].set(radius*Math.cos(Math.PI * i * 2 / this.ringSize), height/2+1, radius*Math.sin(Math.PI * i * 2 / this.ringSize));
    }

    this.heightLineGeometry.vertices[0].set(radius+thickness+1, -height/2, 0);
    this.heightLineGeometry.vertices[1].set(radius+thickness+1, height/2, 0);
    this.heightUpLine.position.copy(this.heightLineGeometry.vertices[0]);
    this.heightDownLine.position.copy(this.heightLineGeometry.vertices[1]);

    this.thicknessLineGeometry.vertices[0].set(-radius, -height/2-1, 0);
    this.thicknessLineGeometry.vertices[1].set(-radius-thickness, -height/2-1, 0);
    this.thicknessLeftLine.position.copy(this.thicknessLineGeometry.vertices[0]);
    this.thicknessRightLine.position.copy(this.thicknessLineGeometry.vertices[1]);

    // 更新点
    this.ringLineGeometry.verticesNeedUpdate = true;
    this.heightLineGeometry.verticesNeedUpdate = true;
    this.thicknessLineGeometry.verticesNeedUpdate = true;

    // 更新文字
    var rCenter = new THREE.Vector3(0, this.ringLineGeometry.vertices[0].y, 0);
    var hCenter = new THREE.Vector3();
    hCenter.addVectors(this.heightLineGeometry.vertices[0], this.heightLineGeometry.vertices[1]).multiplyScalar(0.5);
    var tCenter = new THREE.Vector3();
    tCenter.addVectors(this.thicknessLineGeometry.vertices[0], this.thicknessLineGeometry.vertices[1]).multiplyScalar(0.5);

    var ringMessage = "周长:" +　Utils.decimalPointAfter(2 * Math.PI * radius)+ "毫米";
    var heightMessage = "高:" +　Utils.decimalPointAfter(height) + "毫米";
    var thicknessMessage = "厚:" +　Utils.decimalPointAfter(thickness) + "毫米";

    // 周长
    this.ringMessagePreview.update(ringMessage, rCenter);

    // 高度
    this.heightMessagePreview.update(heightMessage, hCenter);

    // 厚度
    this.thicknessMessagePreview.update(thicknessMessage, tCenter, 0, -2, 0);
};