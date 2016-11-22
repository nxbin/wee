<?php
/**
 * Testaction
 *
 * @author miaomin 
 * Oct 15, 2013 10:34:02 AM
 * 
 * $$Id: TestAction.class.php 578 2013-10-15 02:40:54Z miaomiao $$
 */
class TestAction extends Action {
	
	public function testversion() {
		
		$parameter = 'method=' . $data ['method'] . '&visa=' . $data ['visa'] . '&format=' . $data ['format'] . '&';
		
		$sign=s;
		$remote_url = 'http://localhost/city/api.php/services/rest';
		$curlPost = array (
				'method' => 'users.getversion',
				'visa' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				'format' => 'xml',
				'vcode' => xx,
				
				'sign' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx'
		);
		$ch = curl_init ();
		curl_setopt_array ( $ch, array (
		CURLOPT_POST => 1,
		CURLOPT_RETURNTRANSFER => 1,
		CURLOPT_URL => $remote_url,
		CURLOPT_POSTFIELDS => $curlPost
		) );
		$response = curl_exec ( $ch );
		curl_close ( $ch );

	}


    public function testsafe(){
       // $user = '18621118091';
       // $pass = '123456';
        $publicKey = 'O4rDRqwshSBojonvTt4mar21Yv1Ehmqm';

        $user = 'wx_4ec2f4263ee6af58@3dcity.com';
        $pass = '3dcity2014';
        $visa = base64_encode ( $user . ' ' . $pass );
        //$visa = pub_encode_pass($visa,$this->_publicKey,"encode");
        $enpass=pub_encode_pass($visa,$publicKey,"encode");
        echo $enpass;
        $depass=pub_encode_pass($enpass,$publicKey,"decode");
        echo "<br>".base64_decode($depass);

    }
	
}
?>