function ZStatic(material) {
    this.parent = null;
    this.material = material;
};

ZStatic.prototype = {
    create : function(ce, modelURL, bgURL) {
        var self = this;
        var zGeometry = new Utils.ZGeometry();
        zGeometry.parse(modelURL, function(g) {
            console.log(g);
            self.parent = new THREE.Mesh(g, self.material);
            // self.parent.rotation.set(Math.PI/2, 0, 0);
            new viewport(ce, self.parent, new THREE.Vector3(0, 30, 120), bgURL);
        });
    }
};


// html中执行
function execute() {
    var canvasElement = document.getElementById("WEBGLTESTCANVAS");
    var materialElement = document.getElementById("shuYuanRingMaterial");

    // 创建物体
    var texturePath = "../common/textures/";
    var materialManage = new MaterialManage(texturePath, ".jpg");
    materialManage.setMaterialName(ZDIYCONFIGURE.MATERIALIDS[materialElement.value]);

    var backgroundUrl = "../shuyuan/bg.jpg";
    var zStatic = new ZStatic(materialManage.material);
    zStatic.create(canvasElement, "../common/meshes/rings/ring01.mesh", backgroundUrl);
    
    


    if(materialElement !== null) {
        materialElement.onchange = function(event) {
            materialManage.setMaterialName(ZDIYCONFIGURE.MATERIALIDS[event.target.value]);
            // 计算价格
            // getprice();
        };
    }

    //实时进行的价格计算
    function getprice() {
        // var v = zNecklace.getVolume() / 1000;
        // Utils.getPrice(v, "web3dNecklaceMaterial");
    }

};