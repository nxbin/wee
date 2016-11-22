/**
 * @paper "Smooth Normal Generation with Preservation of Edges"
 *  Nate Robins
 *  nate@pobox.com
 *  http://www.pobox.com/~nate
 *
 *
 * @author zzp  admininfor@126.com
 * 
 * angle - maximum angle (in degrees) to smooth across
 */
THREE.SoftenGeometryNormal = function (geometry, angle){
      
	var v, vl, f, fl, face, vertices, verFaceIndexs;
    var cos_angle = Math.cos(angle * Math.PI / 180.0); 
    
    geometry.mergeVertices();
    geometry.computeFaceNormals();

	vertices = new Array( geometry.vertices.length );
    
    verFaceIndexs = new Array( geometry.vertices.length );
     
	for ( v = 0, vl = geometry.vertices.length; v < vl; v ++ ) {

		vertices[ v ] = new THREE.Vector3();
        
        verFaceIndexs[ v ] = []; 

	}
    
    for ( f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

		face = geometry.faces[ f ];

		verFaceIndexs[ face.a ].push(f);
		verFaceIndexs[ face.b ].push(f);
		verFaceIndexs[ face.c ].push(f);
        
        face.vertexNormals[0] = face.normal.clone();
        face.vertexNormals[1] = face.normal.clone();
        face.vertexNormals[2] = face.normal.clone();

	} 
    var fvNames = [ 'a', 'b', 'c', 'd' ];
    for ( v = 0, vl = geometry.vertices.length; v < vl; v ++ ) {
    
          var face_indexs = verFaceIndexs[v];
          var f0 = face_indexs[0];
          var face0 = geometry.faces[ f0 ];
          for(var j=0, j_l = face_indexs.length; j<j_l; j++ ){
            
            f = face_indexs[j];
            face = geometry.faces[ f ];
            
            var dot = face0.normal.dot( face.normal );
            
            if(dot > cos_angle){
                vertices[ v ].add( face.normal );
                
                for(var i=0; i<3; i++){
                    if(face[fvNames[i]]==v){
                        face.vertexNormals[i] = new THREE.Vector3(0,0,0);
                    }
                }
                
            }
            else{
               
            }
            
          }  
           
    }

	 

	for ( v = 0, vl = geometry.vertices.length; v < vl; v ++ ) {

		vertices[ v ].normalize(); 
	}

	for ( f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

		face = geometry.faces[ f ];
        
        for(var i=0; i<3; i++){
            if(face.vertexNormals[i].length()==0){
                face.vertexNormals[ i ] = vertices[ face[fvNames[i]] ].clone();
            }
         } 
	}
    
    geometry.normalsNeedUpdate = true;

};