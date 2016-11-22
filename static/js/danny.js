(function($){
	$(document).ready(function(){
		function infoText($obj,result,pass,error){
			if(result){
				$obj.parent().find('.warning-info').addClass('warning-info-pass').removeClass('warning-info-error').html(pass);
			}
			else {
				$obj.parent().find('.warning-info').addClass('warning-info-error').removeClass('warning-info-pass').html(error);
			} 
		}
		function checkEmail(){
			var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/; 
			result = emailReg.test($(this).val());
			pass = '输入正确';
			error = '您输入的Email地址格式不正确！';
			infoText($(this),result,pass,error);
			$('#email_confirm').change();
		}
		$('#email').change(checkEmail);
		
		function confirmEmail(){
			result = ($('#email').val() === $('#email_confirm').val());
			pass = '输入正确';
			error = '请确认两个电子邮箱的地址是一致的。';
			infoText($(this),result,pass,error);
		}
		$('#email_confirm').change(confirmEmail);
		
		function useName(){
			var useNameReg = /^[\d\w\_]{5,24}$/; 
			result = useNameReg.test($(this).val());
			pass = '输入正确';
			error = '请填写有效用户名！';
			infoText($(this),result,pass,error);
		}
		$('#username').change(useName);
		
		function passWord(){
			var passWordReg = /^.{6,20}$/; 
			result = passWordReg.test($(this).val());
			pass = '输入正确';
			error = '密码至少6位字符！';
			infoText($(this),result,pass,error);
			$('#cpassword').change();
		}
		$('#password').change(passWord);
		
		function confirmpassWord(){
			result = ($('#password').val() === $('#cpassword').val());
			pass = '输入正确';
			error = '请确认两个密码是一致的。';
			infoText($(this),result,pass,error);
		}
		$('#cpassword').change(confirmpassWord);
		
		function old_password(){
			var old_passwordReg = /^.{6,20}$/; 
			result = old_passwordReg.test($(this).val());
			pass = '输入正确';
			error = '密码至少6位字符！';
			infoText($(this),result,pass,error);
		}
		$('#old_password').change(old_password);
		
		function cfm_password(){
			result = ($('#password').val() === $('#cfm_password').val());
			pass = '输入正确';
			error = '请确认两个密码是一致的。';
			infoText($(this),result,pass,error);
		}
		$('#cfm_password').change(cfm_password);
		
		var $payBtn = $('.payment .pay-light-box-btn');
		$payBtn.live('click',function(){
			var a = $('.get-jifen').text();
			$('.d_jifen').html(a);
			$('.pay').html(a/10);
			$('#up_amount').val(a/10);
			var InputCheck = $('.sum span label input:checked').length;
			if(InputCheck == 0 && $('#my-c-pay').val() == ''){
				$('.payment .warning-info-error').show().html('请选择需要充值的金额！');
			}
			else{
				$('.payment .warning-info-error').hide();
				$('.masker').fadeIn('slow');
				$('.light-box-pay').fadeIn('slow');
			}
		});
		$('.payment .sum input').live('click',function(){
			if($(this).attr('checked') == 'checked'){
				var a = $(this).val()
				$('.get-jifen').html(a*10)
			}
		})
		$('.sum label').click(function(){
			$('#my-c-pay').val('');
		});
		$('.light-box-pay .close').click(function(){
			$('.light-box-pay').fadeOut('slow');
			$('.masker').fadeOut('slow');
		});
		$('#my-c-pay').click(function(){
			$('.sum span label input').removeAttr('checked');
			$('.get-jifen').html('');
		});
		$('#my-c-pay').keyup(function(){
			var a = $(this).val();
			$('.get-jifen').html(a*10);
		});
		$('.light-box-btn').click(function(){
			$('.masker').fadeIn('slow');
			$('.light-box').fadeIn('slow');
		});
		$('.masker').click(function(){
			$(this).fadeOut('slow');
			$('.light-box').fadeOut('slow');
		});
		$('.light-box .close a').click(function(){
			$('.masker').fadeOut('slow');
			$('.light-box').fadeOut('slow');
		});
		$('.light-box-pay .active .abutton').click(function(){
			$(this).html('支付完成');
			$('.light-box-pay .active .other-info').html('<button class="abutton download" style="background:#666; border:1px solid #333;">支付遇到问题？</button>');
		});
		var $windowWidth = $(window).width();
		var $windowHeight = $(window).height();
		var objWidth = $('.light-box').width();
		var objHeight = $('.light-box').height();
		var objPayWidth = $('.light-box-pay').width();
		var objPayHeight = $('.light-box-pay').height();
		$('.light-box').css({'left':($windowWidth-objWidth)/2 + 'px','top':($windowHeight-objHeight)/2 + 'px'});
		$('.light-box-pay').css({'left':($windowWidth-objPayWidth)/2 + 'px','top':($windowHeight-objPayHeight)/2 + 'px'});
		
	});
})(jQuery);