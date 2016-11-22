/**
 * @author zzp 
 * 
 * CCW: A->B->C
 *
 *
 **/

THREE.CutGeometry = function(geometry, vectors) {
     
    var planes = [];
    
    getPlanes(vectors);
     
    geometry.computeFaceNormals();
      
    var polygons = [];
    
    var f, f1 = geometry.faces.length,face;
    for ( f = 0; f < f1; f ++ ) {
        
         face = geometry.faces[f];
         // Triangle ABC
         var vA = geometry.vertices[face.a];
         var vB = geometry.vertices[face.b];
         var vC = geometry.vertices[face.c];
         
        var  _v = [];
         
        var dir =  new CSG.Vector(face.normal.x,face.normal.y,face.normal.z);
        
        _v.push(new CSG.Vertex(new CSG.Vector(vA.x, vA.y, vA.z), dir));
        _v.push(new CSG.Vertex(new CSG.Vector(vB.x, vB.y, vB.z), dir));
        _v.push(new CSG.Vertex(new CSG.Vector(vC.x, vC.y, vC.z), dir));
        
      
        polygons.push(new CSG.Polygon(_v));
          
    } 
    
    for(var p=0; p<planes.length; p++){
        var plane = planes[p];
        
        var front = [], back = [], coplanPoly = [];
        for (var i = 0; i < polygons.length; i++) {
            plane.splitPolygon(polygons[i], coplanPoly, coplanPoly, front, back);
        }
        
        polygons = [];
        polygons = polygons.concat(front);
        polygons = polygons.concat(back);
       
    }
    
     var vertices = [];
     var faces = []; 
     for (var i = 0; i < polygons.length; i++) {
        
        var polygon = polygons[i];
      
       
        var offset = vertices.length;
        
         for (var j = 0; j < polygon.vertices.length; j++) {
            var v =  polygon.vertices[j].pos;
            
            vertices.push(new THREE.Vector3(v.x, v.y, v.z));
         }
         
         var vertIndices = [];
         if(polygon.vertices.length==3){
            
            vertIndices.push([0,1,2]); 
         }
         else
         { 
            vertIndices = polygon2tri(polygon);
         }
        
         for (var j = 0; j < vertIndices.length; j++) {
            var a = vertIndices[j][0];
            var b = vertIndices[j][1];
            var c = vertIndices[j][2];
            
            var p =CSG.Plane.fromPoints(polygon.vertices[a].pos, polygon.vertices[b].pos, polygon.vertices[c].pos );
            if(polygon.plane.normal.dot(p.normal)<0){
                var d = a;
                a = c;
                c = d;
            }
            
            face = new THREE.Face3(a+offset, b+offset, c+offset);
            
            faces.push(face);
         }
            
     }
     
     
    var geometry_new = new THREE.Geometry();
    geometry_new.vertices = vertices;
    geometry_new.faces = faces;
    
    geometry_new.mergeVertices();
    
    geometry_new.computeFaceNormals();
    geometry_new.computeVertexNormals();
    
    return geometry_new;
    
    
    
    function getPlanes(vectors){
        var i, L = vectors.length;
         
        for(i = 0; i<L; ){
            var pos, posA, posB;
    
            pos = vectors[i++];
            posA = pos.clone();
            posB = pos.clone();
    
            posA.add(vectors[i++]);
            posB.add(vectors[i++]);
            
            
            var plane = CSG.Plane.fromPoints(new CSG.Vector(pos.x, pos.y, pos.z),new CSG.Vector(posA.x, posA.y, posA.z),new CSG.Vector(posB.x, posB.y, posB.z) );
            planes.push(plane);
            
        }
    }
    
    
    function polygon2tri(polygon){
        
        var abs_x = Math.abs(polygon.plane.normal.x);
        var abs_y = Math.abs(polygon.plane.normal.y);
        var abs_z = Math.abs(polygon.plane.normal.z);
        
        var b = 0;
        if(abs_x>=abs_y&&abs_x>=abs_z)
        {
            b = 0;
        }
        else if(abs_y>=abs_x&&abs_y>=abs_z){
            b = 1;
        }
        else{
            b = 2;
        }
        
       var contour = [];
         
        for (var i = 0; i < polygon.vertices.length; i++) {
            var v3 = polygon.vertices[i].pos;
            var v ;
            if(b==0){
                  v = new THREE.Vector2(v3.y, v3.z);
             
            }
            else if(b==1)
            {
              v = new THREE.Vector2(v3.x, v3.z);
            }
            else
            {
              v = new THREE.Vector2(v3.x, v3.y);
            }
            
            contour.push(v); 
        }
        
        var vertIndices = THREE.FontUtils.Triangulate( contour, true );//vertIndices
        
        return vertIndices;
    }
     
};