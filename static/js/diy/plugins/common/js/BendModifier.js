THREE.BendModifier = function(geometry) {
	this.bendAngle = 0; //is 0 -- 360
	this.radius = 0;

	this.bendAxis = "+x";

	this.bbMax = null;
	this.bbMin = null;
	this.width = null;
	this.height = null;
	this.depth = null;

	this.geometry = null;

	this.vertices = null;
	this.faces = null;

	this.setGeometry(geometry)
};

THREE.BendModifier.prototype.modify = function() {
	var i, v_depth, aspect, radius, a;
	if(this.bendAngle >= -360 && this.bendAngle <= 360) {

		if(this.bendAngle == 0) return;

		var cornerPoint = new THREE.Vector3(), centerCoordinate;
		if(this.bendAxis === "+x" || this.bendAxis === "-x") {
			this.setRadius(this.width);
			if(this.bendAxis === "+x") {
				if(this.bendAngle > 0) {
					cornerPoint.set(this.bbMin.x, (this.bbMax.y + this.bbMin.y) / 2, this.bbMax.z);
				} else {
					cornerPoint.set(this.bbMin.x, (this.bbMax.y + this.bbMin.y) / 2, this.bbMin.z);
				}
				
			} else {
				if(this.bendAngle > 0) {
					cornerPoint.set(this.bbMax.x, (this.bbMax.y + this.bbMin.y) / 2, this.bbMin.z);
				} else {
					cornerPoint.set(this.bbMax.x, (this.bbMax.y + this.bbMin.y) / 2, this.bbMax.z);
				}
			}
		} else if(this.bendAxis === "+y" || this.bendAxis === "-y") {

		} else if(this.bendAxis === "+z" || this.bendAxis === "-z") {
			this.setRadius(this.depth); 
			if(this.bendAxis === "+z") {
				if(this.bendAngle > 0) {
					cornerPoint.set(this.bbMin.x, (this.bbMax.y + this.bbMin.y) / 2, this.bbMin.z);
				} else {
					cornerPoint.set(this.bbMax.x, (this.bbMax.y + this.bbMin.y) / 2, this.bbMin.z);
				}
			} else {
				if(this.bendAngle > 0) {
					cornerPoint.set(this.bbMax.x, (this.bbMax.y + this.bbMin.y) / 2, this.bbMax.z);
				} else {
					cornerPoint.set(this.bbMin.x, (this.bbMax.y + this.bbMin.y) / 2, this.bbMax.z);
				}
			}
		}

		centerCoordinate = this.getCenterCoordinate(cornerPoint);

		var angles = new Array();

		var self = this;
		function modifyToSingle(newVertex, oldVertex) {
			if(self.bendAxis === "+x" || self.bendAxis === "-x") {
				if(self.bendAxis === "+x") {
					aspect = Math.abs(oldVertex.x - self.bbMin.x) / self.width;
					if(self.bendAngle > 0) {
						radius = Math.abs(cornerPoint.z - oldVertex.z + self.radius);
					} else {
						radius = Math.abs(oldVertex.z - cornerPoint.z + self.radius);
					}
				} else {
					aspect = Math.abs(oldVertex.x - self.bbMax.x) / self.width;
					if(self.bendAngle > 0) {
						radius = Math.abs(oldVertex.z - cornerPoint.z + self.radius);
					} else {
						radius = Math.abs(cornerPoint.z - oldVertex.z + self.radius);
					}
				}

				a = self.bendAngle * Math.PI / 180 * aspect;
				angles.push(a);


				newVertex.y = oldVertex.y;

				if(self.bendAxis === "+x") {
					if(self.bendAngle > 0) {
						newVertex.z = centerCoordinate.z - radius * Math.cos(a);
						newVertex.x = centerCoordinate.x + radius * Math.sin(a);
					} else {
						newVertex.z = centerCoordinate.z  + radius * Math.cos(a);
						newVertex.x = centerCoordinate.x - radius * Math.sin(a);
					}
				} else {
					if(self.bendAngle > 0) {
						newVertex.z = centerCoordinate.z + radius * Math.cos(a);
						newVertex.x = centerCoordinate.x - radius * Math.sin(a);
					} else {
						newVertex.z = centerCoordinate.z  - radius * Math.cos(a);
						newVertex.x = centerCoordinate.x + radius * Math.sin(a);
					}	
				}
			} else if(self.bendAxis === "+y" || self.bendAxis === "-y") {

			} else if(self.bendAxis === "+z" || self.bendAxis === "-z") {
				if(self.bendAxis === "+z") {
					aspect = Math.abs(oldVertex.z - self.bbMin.z) / self.depth;
					if(self.bendAngle > 0) {
						radius = Math.abs(oldVertex.x - cornerPoint.x + self.radius);
					} else {
						radius = Math.abs(cornerPoint.x - oldVertex.x + self.radius);
					}
				} else {
					aspect = Math.abs(oldVertex.z - self.bbMax.z) / self.depth;
					if(self.bendAngle > 0) {
						radius = Math.abs(oldVertex.z - cornerPoint.z + self.radius);
					} else {
						radius = Math.abs(cornerPoint.z - oldVertex.z + self.radius);
					}
				}

				a = self.bendAngle * Math.PI / 180 * aspect;

				newVertex.y = oldVertex.y;

				if(self.bendAxis === "+z") {
					if(self.bendAngle > 0) {
						newVertex.z = centerCoordinate.z + radius * Math.sin(a);
						newVertex.x = centerCoordinate.x + radius * Math.cos(a);
					} else {
						newVertex.z = centerCoordinate.z  - radius * Math.sin(a);
						newVertex.x = centerCoordinate.x - radius * Math.cos(a);
					}
				} else {
					if(self.bendAngle > 0) {
						newVertex.z = centerCoordinate.z + radius * Math.cos(a);
						newVertex.x = centerCoordinate.x - radius * Math.sin(a);
					} else {
						newVertex.z = centerCoordinate.z  - radius * Math.cos(a);
						newVertex.x = centerCoordinate.x + radius * Math.sin(a);
					}	
				}
			}
		};

		for(i=0; i<this.vertices.length; i++) {
			modifyToSingle(this.geometry.vertices[i], this.vertices[i]);
		}

		// var v1, v2, v3, vn1, vn2, vn3;
		// vn1 = vn2 = vn3 = new THREE.Vector3();
		//console.log(this.geometry.faces)
		for(i=0; i<this.geometry.faces.length; i++) {
			this.geometry.faces[i].vertexNormals.length = 0;
			//if (this.geometry.faces[i].vertexNormals.length <= 0) continue;
			//console.log(this.geometry.faces[i].vertexNormals);
			//this.geometry.faces[i].vertexNormals[0].x *= Math.sin(angles[]);
			//this.geometry.faces[i].vertexNormals.splice(0,this.geometry.faces[i].vertexNormals.length);
			//console.log(this.geometry.faces[i]);
			// if(this.geometry.faces[i].vertexNormals.length <= 0) continue;

			// v1 = this.geometry.vertices[this.geometry.faces[i].a];
			// v2 = this.geometry.vertices[this.geometry.faces[i].b];
			// v3 = this.geometry.vertices[this.geometry.faces[i].c];

			// vn1.copy(this.vertices[this.geometry.faces[i].a]);
			// vn1.add(this.geometry.faces[i].vertexNormals[0]);

			// vn2.copy(this.vertices[this.geometry.faces[i].b]);
			// vn2.add(this.geometry.faces[i].vertexNormals[1]);

			// vn3.copy(this.vertices[this.geometry.faces[i].c]);
			// vn3.add(this.geometry.faces[i].vertexNormals[2]);


		}
	}
};

THREE.BendModifier.prototype.setGeometry = function(geometry) {
	if(geometry === undefined) return;

	if(!geometry.boundingBox) {
		geometry.computeBoundingBox();
	}
	var boundingBox = geometry.boundingBox.clone();
	this.bbMax = boundingBox.max;
	this.bbMin = boundingBox.min;
	this.width = Math.abs(this.bbMax.x - this.bbMin.x);
	this.height = Math.abs(this.bbMax.y - this.bbMin.y);
	this.depth = Math.abs(this.bbMax.z - this.bbMin.z);

	this.geometry = geometry;

	this.vertices = geometry.vertices.concat();
	this.faces = geometry.faces.concat();
};

THREE.BendModifier.prototype.setRadius = function(arcLength) {
	this.radius = Math.abs((180 * arcLength) / (this.bendAngle * Math.PI));
};

THREE.BendModifier.prototype.getCenterCoordinate = function(cornerPoint) {// cornerPoint is THREE.Vector3
	var centerCoordinate = cornerPoint.clone();
	if(this.bendAxis === "+x") {
		if(this.bendAngle > 0) {
			centerCoordinate.z = cornerPoint.z + this.radius;
		} else {
			centerCoordinate.z = cornerPoint.z - this.radius;
		}			
	} else if(this.bendAxis === "-x") {
		if(this.bendAngle > 0) {
			centerCoordinate.z = cornerPoint.z - this.radius;
		} else {
			centerCoordinate.z = cornerPoint.z + this.radius;
		}
	} else if(this.bendAxis === "+y") {

	} else if(this.bendAxis === "-y") {

	} else if(this.bendAxis === "+z") {
		if(this.bendAngle > 0) {
			centerCoordinate.x = cornerPoint.x - this.radius;
		} else {
			centerCoordinate.x = cornerPoint.x + this.radius;
		}	
	} else if(this.bendAxis === "-z") {
		if(this.bendAngle > 0) {
			centerCoordinate.x = cornerPoint.x + this.radius;
		} else {
			centerCoordinate.x = cornerPoint.x - this.radius;
		}	
	} 

	return centerCoordinate;
};