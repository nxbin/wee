var ZPost = {};


//发送方法
ZPost.postData = function(config_data, post_data, callback) {
    //处理配置数据成字符串，样式"xxx=xxx&yyy=yyy&...=..."
	var cd="";
    for(var each in config_data) {
        cd += each + "=" + config_data[each] + "&";
    }
    cd = cd.substring(0, cd.length-1);

    // 得到新的URL的地址
    var url = ZDIYCONFIGURE.POSTURL + "?";
    url += cd;

    
    var request = new XMLHttpRequest();
    request.addEventListener("readystatechange", function(event) {
        if(event.target.readyState === 4) {
            if (event.target.status == 200) {
                var response = event.target.response;
                if(callback !== undefined) {
					callback(response);
                }
            } else {
                alert("Request Errors Occured");
            }
        }
    }, false);
    
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/octet-stream');
    request.send(post_data);
};


// 发送通用参数
ZPost.requestParameters = function(_method) {
    
    var _user = "miaomin@bitmap3d.com.cn";
    var _pass = MD5("123456");
    var base64 = new Base64();
    var _format = "json";
    var _visa = base64.encode(_user + " " + _pass);
    var _curlPost = "method=" + _method + "&visa=" + _visa + "&format=" + _format;

    var publicKey = 'O4rDRqwshSBojonvTt4mar21Yv1Ehmqm';
    

    var genSign = function(parameter, vcode) {
        var start = vcode - 1;
        var parameterMD5 = MD5(parameter);
        return MD5(parameterMD5 + publicKey.substring(start , start+4));
    };
    var _vcode = Math.floor(Math.random() * 27 + 1);
    var _sign = genSign(_curlPost, _vcode);
    
    return {
        visa : _visa,
        vcode : _vcode,
        method : _method,
        sign : _sign,
        format : _format,
        debug : 0
    };
};


// 画布截图
ZPost.canvasScreenshot = function(canvas, _pid, isLogin) {
	if(isLogin === undefined) isLogin = 1;
	if(isLogin === 0 ) {
		document.getElementById("diyf").submit();
		return;
	}
    var _method = "savecapture";
    var request_parameters = ZPost.requestParameters(_method);
    var configData = {
        method : request_parameters.method,
        visa : request_parameters.visa,
        format : request_parameters.format,
        vcode : request_parameters.vcode,
        sign : request_parameters.sign,
        debug : request_parameters.debug,
        pid : _pid
    };

    var captureData = canvas.toDataURL("image/png");

    ZPost.postData(configData, captureData, function(response) {
        var jsonobj=response.substr(1,(response.length-1));
		//--------------------写入到前端的form的cover中用于提交
		document.getElementById("cover").value=jsonobj;
		document.getElementById("diyf").submit();
		//--------------------
	});
};

//保存模型
ZPost.createModel = function(modeldata, _pid) {
	var _method = "savemodel";
    var request_parameters = ZPost.requestParameters(_method);
	
    var configData = {
		method : request_parameters.method,
		visa : request_parameters.visa,
		format : request_parameters.format,
		vcode : request_parameters.vcode,
		sign : request_parameters.sign,
		debug : request_parameters.debug,
		pid : _pid
    };

	ZPost.postData(configData, modeldata, function() {
		// 刷新前端页面，不显示生成模型按钮
		location.reload();
	});
};

