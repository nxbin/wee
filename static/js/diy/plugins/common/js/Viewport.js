function viewport(inCanvas, inMesh, inCameraPosition, inBackgorundURL, updateCallback) {
    var camera, scene, renderer, center, background_camera, background_scene,
        controls = null,
        animation = true,
        clock = new THREE.Clock(),
        width = inCanvas.offsetWidth, height = inCanvas.offsetHeight,
        bg_mesh, bg_texture,
        target = new THREE.Object3D(),
        lightManage = null;
  
    function init() {            
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(53, width / height, 0.01, 1000);
        camera.position.set(inCameraPosition.x, inCameraPosition.y, inCameraPosition.z);
        center = new THREE.Object3D();
        camera.lookAt(center.position);
        scene.add(camera); 
        scene.add(center);

        //背景
        background_scene = new THREE.Scene();
        var bg_geometry = new THREE.PlaneGeometry(1, 1);
        var bg_material = new THREE.MeshBasicMaterial();
        bg_texture = THREE.ImageUtils.loadTexture(inBackgorundURL, 1);
        bg_material.map = bg_texture;
        bg_material.depthTest = false;
        bg_material.depthWrite = false;
        bg_material.side = 2;
        bg_mesh = new THREE.Mesh(bg_geometry, bg_material);
        background_scene.add(bg_mesh);
        background_camera = new THREE.PerspectiveCamera(90, width/height, 1, 2);
        background_camera.position.z = 1;
        
        renderer = new THREE.WebGLRenderer({canvas : inCanvas, antialias: true, preserveDrawingBuffer: true});
        renderer.setSize(width, height);
        renderer.setClearColor(0xeeeeee);
        // renderer.gammaInput = true;
        // renderer.gammaOutput = true;

        //相机控制
        controls = new THREE.EditorControls(camera, renderer.domElement);

        // //
        lightManage = new ZLightManage();
        lightManage.setTarget(target);
        scene.add(lightManage.key_light);
        scene.add(lightManage.aux_light);
        scene.add(lightManage.ambient_light);


        // lightManage = new LightManage();
        // scene.add(lightManage.directionalLight);

        center.add(inMesh);

    };


    function backgroundUpdate() {
        if(bg_texture.image === undefined) return;
        console.log(bg_texture.image.width, bg_texture.image.height);
        var camera = background_camera;
        var target = new THREE.Vector3();
        var bg_ratio =  bg_texture.image.width/bg_texture.image.height;
        var dis = camera.far;
        var matrix = new THREE.Matrix4();
        matrix.lookAt(camera.position, target, camera.up);

        var c = new THREE.Vector3();
        c.copy(camera.position);

        var p = new THREE.Vector3();
        p.subVectors(target, c).normalize();
        
        p.multiplyScalar(dis);
        p.add(c);

        //var quaternion = new THREE.Quaternion();
        //quaternion.setFromRotationMatrix(matrix);
        bg_mesh.position.copy(p);
        //bg_mesh.quaternion.copy(quaternion);
        var s = 2 * dis * Math.tan(camera.fov*Math.PI/360);

        var l = inCanvas.offsetWidth/inCanvas.offsetHeight;
        if(l < bg_ratio){
            l = bg_ratio/l;
        } else {
            l = l/bg_ratio;
        }
        bg_mesh.scale.set(bg_ratio*s*l, s*l, 1);
    };  

    // 渲染
    function render() {
        scene.updateMatrixWorld();
        camera.updateProjectionMatrix();

        renderer.autoClear = false;
        renderer.clear();

        // 渲染背景
        if(bg_texture.image === undefined) return;
        backgroundUpdate();
        renderer.render(background_scene, background_camera);

        // 控制动画
        if(controls.getState() == -1) {
            if(clock.getElapsedTime() > ZDIYCONFIGURE.SPINTIMEOUT) {
                animation = true;
            }
        } else {
            animation = false;
            clock.elapsedTime = 0;
            clock.stop();
        }

        if(animation)
            center.rotation.y -= Math.PI / 180 * ZDIYCONFIGURE.SPINVELOCITY;

        // 控制摄像机缩放范围
        var d = camera.position.length();
        if(d > ZDIYCONFIGURE.CAMERAMAXDISTANCE || d < ZDIYCONFIGURE.CAMERAMINDISTANCE) {
            var s = 1;
            if(d > ZDIYCONFIGURE.CAMERAMAXDISTANCE) {
                s = ZDIYCONFIGURE.CAMERAMAXDISTANCE / d;
            } else {
                s = ZDIYCONFIGURE.CAMERAMINDISTANCE / d;
            }
            camera.position.x *= s;
            camera.position.y *= s;
            camera.position.z *= s;
            if(!ZDIYCONFIGURE.FORBIDDENMOVEMENT) ZDIYCONFIGURE.FORBIDDENMOVEMENT = true;
        } else {
            if(ZDIYCONFIGURE.FORBIDDENMOVEMENT) ZDIYCONFIGURE.FORBIDDENMOVEMENT = false;
        }

        // lightManage.directionalLight.position.copy(camera.position);
        lightManage.update(camera, controls.center);
        target.position.copy(controls.center);

        // 更新callback
        if(updateCallback !== undefined) updateCallback();

        // 开始渲染
        renderer.render(scene, camera);
    };

    // 渲染循环
    function renderLoop() {
        requestAnimationFrame(renderLoop);
        render();
    };

    // resize window
    function resizeWindow() {
        // resize camera aspect
        camera.aspect = inCanvas.offsetWidth / inCanvas.offsetHeight;
        camera.updateProjectionMatrix();

        background_camera.aspect = inCanvas.offsetWidth / inCanvas.offsetHeight;
        background_camera.updateProjectionMatrix();


        // resize viewport width and height
        renderer.setSize(inCanvas.offsetWidth, inCanvas.offsetHeight);
    
        // re-render
        // renderLoop();  
    };


    // When the execution webpage after loading.
    window.addEventListener("load", function(event) {
        // resizeWindow();
        onResize(inCanvas, resizeWindow);
    }, false);

    window.addEventListener('resize', function(event) {
        setTimeout(resizeWindow, 1000);
        //resizeWindow();
    }, false );

    function onResize(element, callback){
      var elementOffsetHeight = element.offsetHeight,
          elementOffsetWidth = element.offsetWidth;
      setInterval(function(){
          if(element.offsetHeight !== elementOffsetHeight || element.offsetWidth !== elementOffsetWidth ){
            elementOffsetHeight = element.offsetHeight;
            elementOffsetWidth = element.offsetWidth;
                callback();
          }
      }, 30);
    };

    init();
    renderLoop();
};