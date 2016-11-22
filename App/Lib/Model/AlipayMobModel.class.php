<?php

class AlipayMobModel extends Model {

    public function __construct() {
        Vendor('AlipayMob.config');
        Vendor('AlipayMob.alipay_core');
        Vendor('AlipayMob.alipay_rsa');
        $alipay_config=alicofingsMob();

        $this->partner = $alipay_config['partner'];
        $this->seller_email = $alipay_config['seller_email'];
        $this->service = $alipay_config['service'];
        $this->private_key_path = $alipay_config['private_key_path'];
        $this->public_key_path = $alipay_config['ali_public_key_path'];
        parent::__construct ();
    }

    public function createSign($orderid){
        $UPM=new UserPrepaidModel();
        if($UPM->updateOrderSuffix($orderid)){//更新订单号后缀加1
            $orderInfo=$UPM->getPrepaidListByOrderid($orderid);
        }
        //var_dump($orderInfo);
        //exit;
        $order_info_array = argSort(array(
            'partner' =>  '"'.$this->partner.'"',
            'seller_id' =>  '"'.$this->seller_email.'"',
            'out_trade_no' =>'"'.$orderInfo[0]['up_orderid_new'].'"',
            'subject'=>'"3dcity首饰定制"',
            'body'=>'"3dcity首饰定制"', //商品描述
            'total_fee' => '"'.$orderInfo[0]['up_amount'].'"',
            'notify_url' => '"http://140.207.154.14/user.php/Ordermob/notifyurl"',
            'service' =>  '"'.$this->service.'"',
            'payment_type' => '"1"',
            '_input_charset' => '"utf-8"',
            'it_b_pay'=>'"30m"',
            'show_url' =>'"m.alipay.com"'//用户手机未装支付宝客户端时访问支付宝H5网页版
        ));
       $order_info = createLinkstring(paraFilter($order_info_array));// 组合数据
       //logResult($order_info);
        //生成签名
//$order_info ='partner="2088901940107155"&seller_id="zhangzhibin@bitmap3d.com.cn"&out_trade_no="144290816895088716"&subject="3dcity首饰定制"&body="123123"&total_fee="0.01"&notify_url="http://www.3dcity.com"&service="mobile.securitypay.pay"&payment_type="1"&_input_charset="utf-8"&it_b_pay="30m"&show_url="m.alipay.com"';
        $sign = rsaSign($order_info, $this->private_key_path);
// logResult($sign);
        $sign = urlencode($sign);// 对签名进行url编码
        $pay_info = $order_info . "&sign=\"" . $sign . "\"&sign_type=\"RSA\"";
       // logResult($pay_info);
        //echo json_encode(array(
          //  'code' => 1,
        //    'result' => $pay_info,
       // ));
        return  $pay_info ;
    }

    //获取APP的扫码支付参数
    public function createQrCodeParam($orderid){
        $UPM=new UserPrepaidModel();
        if($UPM->updateOrderSuffix($orderid)){//更新订单号后缀加1
            $orderInfo=$UPM->getPrepaidListByOrderid($orderid);
        }
        $nowdate=date ( "Y-m-d H:i:s", time () );
        //echo $nowdate;
        //exit;
        $order_info_array = argSort(array(
            'method'    =>'alipay.trade.precreate',
            'app_id'    =>'2016071201609127',
            'charset'   =>'utf-8',
            'sign_type' =>'RSA',
            'timestamp' =>$nowdate,
            'biz_content' =>  '{
                "out_trade_no": "'.$orderInfo[0]['up_orderid_new'].'",
                "total_amount":"'.$orderInfo[0]['up_amount'].'",
                "discount_amount":"0",
                "unDiscount_amount": "'.$orderInfo[0]['up_amount'].'",
                "subject": "当面付二维码支付"
            }',
            'notify_url' => '"http://140.207.154.14/user.php/Ordermob/notifyurl"',
        ));
        $order_info = createLinkstring(paraFilter($order_info_array));// 组合数据

        $sign = rsaSign($order_info, $this->private_key_path);
        $sign = urlencode($sign);// 对签名进行url编码
        $pay_info = $order_info . "&sign=\"" . $sign . "\"&sign_type=RSA";
        return  $pay_info ;
    }

}

?>
