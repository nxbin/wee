<?php
define('APP_DEBUG', true);
define('APP_PATH', './App/');
define('LIB_PATH', APP_PATH . 'Lib/');
define('COMMON_PATH', APP_PATH . 'Common/');
define('TMPL_PATH', APP_PATH . 'templates/');
define('RUNTIME_PATH', APP_PATH . 'Runtime/Front/');
define('CONF_PATH', APP_PATH . 'Config/Front/');
define('BASE_PATH', dirname(__FILE__));

require 'ThinkPHP/ThinkPHP.php';
?>