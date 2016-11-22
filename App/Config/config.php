<?php
// Global Config
// @formatter:off
return array (
		
		//腾讯QQ登录配置
		'THINK_SDK_QQ' => array(
				'APP_KEY'    => '101144203', //应用注册成功后分配的 APP ID
				'APP_SECRET' => 'ef66aaa67babbbbafaf05d8a9b0a4c1d', //应用注册成功后分配的KEY
				//'CALLBACK'   => 'http://testqq.3dcity.com/city/index/auth-callback-type-qq-url-aaa',
				'CALLBACK'   => '',
		),
		
		
		// 设置成1启用WEB3D,设置成0启用LAO3D
		'WEB3D_ENABLED' => 1,
		
		//设置运费
		'UP_EFEE'=>0,
		
		// WEB3D文件保存路径前缀
		'WEB3D_ABSPATH_PRE' => '/home/wwwroot/default',
		
		//文件下载路径 0为网站服务器文件下载  1为先判断OSS存储路径优先
		'DOWNTYPE'=>true,
		
		
		'ENABLE_ACCESSCODE' => false,
		'ACCESSCODE' => '1113',
		
		// 验证码字体路径
		'CAPTCHA_FONTS_PATH' => array (
				//Windows版本：
				// 'C:/Windows/Fonts/Tahoma.ttf'
				//Nginx版本：
				'/tahoma.ttf'
		),
		
		// 大小写自动转换
		'URL_CASE_INSENSITIVE' => true,
		// Session
		'SESSION_AUTO_START' => false,
		
		/**
		 * miaomin added@2014.4.29
		 * 
		 * 自动侦测语言建议置为False
		 * 否则TP将会自动侦测浏览器的语言设置
		 * 默认LANG_AUTO_DETECT=true
		 */
		'LANG_SWITCH_ON' 	=> true,   	//开启语言包功能
		'LANG_AUTO_DETECT' 	=> false,	//自动侦测语言
		'DEFAULT_LANG'		=> 'zh-cn',
		'LANG_LIST'        	=> 'zh-cn,en-us',
		
		// Url模式
		'URL_MODEL' => 1,
		
		//'URL_PATHINFO_DEPR' =>'',
		// 伪静态后缀
		//'URL_HTML_SUFFIX' => 'html',
		
		// 启用Trace
		'SHOW_PAGE_TRACE' => false,
		// 启用运行状态
		'SHOW_RUN_TIME' => false,
		'SHOW_ADV_TIME' => false,
		'SHOW_DB_TIMES' => false,
		'SHOW_CACHE_TIMES' => false,
		'SHOW_USE_MEM' => false,
		'SHOW_LOAD_FILE' => false,
		'SHOW_FUN_TIMES' => false,
		
		// 页面跳转等待时间
		'JUMP_URL_WAIT_SECONDS' => 10,
		
		// 产品临时文件上传路径
		'PRODUCT_TEMPFILE_PATH' => './upload/temp/productfile/',
		// 产品文件上传路径
		'PRODUCT_FILE_PATH' => './upload/productfile/',
		
		// 文件上传路径
		'UPLOAD_PAHT' => array (
				'PRODUCT' => './upload/productfile/',
				'PRODUCT_TEMP' => './upload/temp/productfile/',
				'PRODUCT_WEB' => '/upload/productfile/',
				'PRODUCT_PHOTO' => './upload/productphoto/',
				'PRODUCT_PHOTO_WEB' => '/upload/productphoto/',
				'PROJECT'=>'./upload/project' //简笔画文件存储位置(文件和图片)
		),
		
		// 数据库配置信息
		'DB_TYPE' => 'pdo',
		'DB_PREFIX' => 'tdf_',
		'DB_USER' => 'root',
		'DB_PWD' => 'gdi2012',
		//'DB_PWD' => 'nxbin616',
		'DB_DSN' => 'mysql:host=192.168.52.17;dbname=citydvs;charset=utf8',
		//'DB_DSN' => 'mysql:host=sa.gdicorp.net;dbname=citydvs;charset=utf8',
		
		// Memcached Service
		'MEM_SERVER' => '192.168.20.166',
		
		// PYTHON WEB3D Service Host
		'PY_WEB3D_SERVER' => '192.168.20.166',
		
		// 邮件配置
		'THINK_EMAIL' => array (

				'SMTP_HOST' => 'smtp.exmail.qq.com', // SMTP服务器
				'SMTP_PORT' => '25', // SMTP服务器端口
				'SMTP_USER' => 'bitmap@bitmap3d.com.cn', // SMTP服务器用户名
				'SMTP_PASS' => 'bit2012', // SMTP服务器密码

			'FROM_EMAIL' => 'no-reply@ign.vip', // 发件人EMAIL
			'FROM_NAME' => 'IGNITE', // 发件人名称
			//'REPLY_EMAIL' => 'no-reply@bitmap3d.com.cn', // 回复EMAIL（留空则为发件人EMAIL）
			'REPLY_EMAIL' => 'no-reply@ign.vip', // 回复EMAIL（留空则为发件人EMAIL）
			'REPLY_NAME' => 'IGNITE'  // 回复名称（留空则为发件人名称）
		),
		
		// 用户邮件验证
		'USER_ACTIVE' => array (
				'URL' => WEBROOT_URL . '/user.php/userconf/active/?sv=',
				'TITLE' => 'active_title',
				'CONTENT' => 'active_content'
		),
		
		// 用户邮件验证有效时长(毫秒)
		'USER_ACTIVE_VALID_TIME' => 31536000000,
		
		// 用户重置密码
		'USER_RESET' => array (
				'URL' => WEBROOT_URL . '/user.php/mail_validate/resetpass/?code=',
				'TITLE' => 'reset_title',
				'CONTENT' => 'reset_content'
		),
		
		// 用户重置密码有效时长(秒)
		'USER_RESET_VALID_TIME' => 3600,
		
		// PYTHON WEB3D Service Port
		'PY_WEB3D_PORT' => 8002,
    //SMS配置
        'SMS_SERVER'=>array(
            'accountSid'=>'aaf98f89499d24b501499e6628f001a7',
	        'accountToken'=>'dee8f188e3734050aa9214d527ffeb65',
	        'appId'=>'8a216da85607361a01560bf70cf90410', //IGNITE

	        'serverIP'=>'app.cloopen.com',
            'serverPort'=>'8883',
            'softVersion'=>'2013-12-26',
        ),
        //对于每个用户限制每天发送的个数
        'SMS_LIMIT'=>'10',
    
);
?>