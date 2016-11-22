<?php
// 把所有服务器配置相关的参数放到一个文件中去
define ( 'APP_DEBUG', true );
//各分组公共配置
define ( 'DOMAIN', 'http://' . $_SERVER ["HTTP_HOST"] );
define ( 'WEBROOT_PATH', '/ignite' );
define ( 'WEBROOT_URL', DOMAIN . WEBROOT_PATH );
define ( 'WEB_ROOT', dirname ( __FILE__ ) . "/" );

define ( 'CITY_URL', 'http://locahost/ignite/' );
define ( 'RP360_URL', 'http://localhost/rp360/' );
define ( 'CITY_API_URL', CITY_URL . 'api.php/services/rest' );
define ( 'RP360_API_URL', RP360_URL . 'api.php/services/rest' );
define ( 'RP360_API_USER', 'wow730@gmail.com' );
define ( 'RP360_API_PASS', '2014bitmap' );

// WX
define ( 'WX_CALLBACK_DOMAIN', 'http://140.207.154.14:9010/city' );

define ( 'DOMAIN_HTTPS', 'https://' . $_SERVER ["HTTP_HOST"] );
define('WEBROOT_HTTPS',DOMAIN_HTTPS.'/ignite');


?>