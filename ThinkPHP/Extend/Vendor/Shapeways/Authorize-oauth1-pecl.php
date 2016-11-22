#!/usr/bin/php
<?php

require "consumer_key.php";
require "api_url_base.php";
require "error.php";

$verbose_debug = true;

try {
    $oauth_client = new Oauth($consumer_key, $consumer_secret, OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_AUTHORIZATION);
    $oauth_client->enableDebug();
} catch(OAuthException $E) {
    Error("setup exception", $E->getMessage(), null, null, $E->debugInfo);
}

try {
    $info = $oauth_client->getRequestToken("$api_url_base/oauth1/request_token/v1", "oob");
    # work around our Pecl getRequestToken->array bug https://bugs.php.net/bug.php?id=63572 :
    if (   array_key_exists('oauth_token_secret', $info) &&
           array_key_exists('authentication_url', $info) &&
         ! array_key_exists('oauth_token', $info)) {
        $urlArray = parse_url($info['authentication_url']);
        $info['authentication_url'] = $urlArray['scheme'] .'://'. $urlArray['host'] . $urlArray['path'];
        parse_str($urlArray['query']);
        $info['oauth_token'] = $oauth_token;
    }
    if ( array_key_exists('oauth_token', $info) &&
         array_key_exists('oauth_token_secret', $info) &&
         array_key_exists('authentication_url', $info) ) {
        echo "Request token        : ".$info['oauth_token']."\n";
        echo "Request token secret : ".$info['oauth_token_secret']."\n";
        echo "Next please authenticate yourself at ".$info['authentication_url']."?oauth_token=".$info['oauth_token']." and collect the PIN for the next step.\n";
        $oauth_client->setToken( $info['oauth_token'] , $info['oauth_token_secret'] );
    } else {
        Error("getRequestToken", null, $info, $oauth_client->getLastResponseInfo(), null);
    }
} catch(OAuthException $E){
    Error("getRequestToken", $E->getMessage(), null, $oauth_client->getLastResponseInfo(), $E->debugInfo);
}

//print_r($info);
//$pin = readline("Pin: ");
$pin = 'f7ce86';
try {
    $info = $oauth_client->getAccessToken("$api_url_base/oauth1/access_token/v1", null, $pin);
    if ( array_key_exists('oauth_token', $info) &&
         array_key_exists('oauth_token_secret', $info) ) {
        echo "Access token        : ".$info['oauth_token']."\n";
        echo "Access token secret : ".$info['oauth_token_secret']."\n";
        echo "\nYou can store these access token values in access_token.php for the other scripts to use.\n";
        $oauth_client->setToken( $info['oauth_token'] , $info['oauth_token_secret'] );
    } else {
        Error("getAccessToken", null, $info, $oauth_client->getLastResponseInfo(), null);
    }
} catch(OAuthException $E){
    Error("getAccessToken exception", $E->getMessage(), null, $oauth_client->getLastResponseInfo(), $E->debugInfo);
}

?>

