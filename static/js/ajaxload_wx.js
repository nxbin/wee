var __PUBLIC__ = '/static';
var __APP__ = '/index.php';
var __DOC__ = '';

(function($){ 
	$(document).ready(function(){
		var window_width = $(window).width();
		var window_height = $(window).height();
		/* mm 2/5
		$('.slide-show .page-num div').click(function(){
			var a = $(this).index();
			$(this).parent().find('div').removeClass('select');
			$(this).addClass('select');
			$('.slide-show .content ul li').fadeOut(1000).eq(a).fadeIn(500);
			$('.slide-show .content ul li .short-dis').slideUp().eq(a).slideDown(1000);
		}); 
		$('.originality-slideshow .num ul li').click(function(){
			var a = $(this).index();
			$(this).parent().find('li').removeClass('select');
			$(this).addClass('select');
			$('.originality-slideshow .content ul li').fadeOut(1000).eq(a).fadeIn(500);
			$('.originality-slideshow .content ul li .discription').slideUp().eq(a).slideDown(1000);
		});
		$('.originality .right ul li').each(function(){
			$(this).mouseenter(function(){
				$(this).find('.discription').animate({
					top:'-=60px'
				});
			});
			$(this).mouseleave(function(){
				$(this).find('.discription').animate({
					top:'+=60px'
				});
			});
		});
		$('.customer-head-img').hover(
			function(){
				$('.customer-head-img .edit').fadeIn();
			},
			function(){
				$('.customer-head-img .edit').fadeOut();
			}
		);
		$('.img-list ul li .pro-content').live('mouseenter',
			function(){
				$(this).find('.img-masker').fadeIn();
				$(this).find('.edit').fadeIn();
				$(this).find('.delete').fadeIn();
			}
		);
		$('.img-list ul li .pro-content').live('mouseleave',
			function(){
				$(this).find('.img-masker').fadeOut();
				$(this).find('.edit').fadeOut();
				$(this).find('.delete').fadeOut();
			}
		);
		*/
		$('.user-content .my-discuz ul li:odd').css('background','#fff');
		$('.public-main-container .lista').addClass('display-1 radius-s list grey-bg');
		$('.public-main-container .grida').addClass('display-2 radius-s list red-bg');

		//3d printer product detail slideshow
		var ALL_width = $(window).width();
		var ALL_height = $(window).height();
		var obj_width = $('.light-box').width();
		var obj_height = $('.light-box').height();
		$('.light-box').css({'left':(ALL_width-obj_width)/2 + 'px'});
		$('.light-box').css({'top':(ALL_height-obj_height)/2 + 'px'});
		$('.d_close').click(function(){
			$('.masker').fadeOut('slow');
			$('.light-box').fadeOut('slow');
		});
		$('.masker').click(function(){
			$('.masker').fadeOut('slow');
			$('.light-box').fadeOut('slow');
		});
		//comm-light-box

		/* mm 2/5
		$('.change-material').live('click',function(){
			$('.masker').fadeIn('slow');
			$('#material-light-box').fadeIn('slow');
		});
		var _name = $('.material .change-material');
		var _img = $('.material .material-img');
		var _price = $('.material .material-price');
		$('#material-light-box .content ul li').each(function(){
			$(this).click(function(){
				var img = $(this).find('.material-img').html();
				var name = $(this).find('.material-name').html();
				var price = $(this).find('.material-price').html();
				_name.html(name);
				_img.html(img);
				_price.html(price);
				$('.light-box').fadeOut('slow');
				$('.masker').fadeOut('slow');
			});
		});
		//material-light-box
		*/
		
		$('.people-discuz ul li:even').css('background','#f8f8f8');
		$('.people-discuz ul li:odd').css('background','#f0f0f0');
		//product detail slideshow
		var num = $('#printer-pro-del .slideshow .content ul li').children().length;
		var obj = $('#printer-pro-del .slideshow .content ul li');
		var Maincon = $('#printer-pro-del .slideshow .content ul');
		var LEFTarrow = $('#printer-pro-del .slideshow .left-arrow');
		var RIGHTarrow = $('#printer-pro-del .slideshow .right-arrow');
		function LEFT_arrow_change(){LEFTarrow.css({'background-position':'0 -37px'});};
		function RIGHT_arrow_change(){RIGHTarrow.css({'background-position':'-25px 0'});};
		function RIGHT_arrow_changed(){RIGHTarrow.css({'background-position':'-25px -37px'});};
		function LEFT_arrow_changed(){LEFTarrow.css({'background-position':'0 0'});};
		function right_change(){
			function delay(){
				var move = parseInt(Maincon.css('left'));
				(move < 0)?LEFT_arrow_change():'';
				(move == -(num-4)*154)?RIGHT_arrow_change():'';
			}
			setTimeout(delay,700);
		};
		function left_change(){
			function delay(){
				var move = parseInt(Maincon.css('left'));
				(move==0)?LEFT_arrow_changed():'';
				(move==0)?RIGHT_arrow_changed():'';
			}
			setTimeout(delay,700);
		};
		$('#printer-pro-del .slideshow .content ul').css({'width':(130+20+4)*num});// img = 130 margin l+r = 20 border = 4
		
		/* mm 2/5
		LEFTarrow.live('click',function(){
			var move = parseInt(Maincon.css('left'));
			if(!Maincon.is(':animated')){
				if(move < 0){
					Maincon.animate({left: '+=154px'},600);
				}
				else{};
			}
			else{};
			left_change();
		});
		RIGHTarrow.live('click',function(){
			var move = parseInt(Maincon.css('left'));
			if(!Maincon.is(':animated')){
				if(move >= -(num-5)*154){
					Maincon.animate({left: '-=154px'},600);
				}
				else{}
			}
			else{}
			right_change();
		});
		$('#printer-pro-del .slideshow .content ul li').each(function(){
			$(this).click(function(){
				var _img = $(this).html();
				obj.removeClass('select');
				$(this).addClass('select');
				$('#printer-pro-del .slideshow .slideshow-img').html(_img);
			});
		});
		$('#photograph .bottom-bar .step1 .right .man').hover(
			function(){
				$(this).find('img').attr('src',__PUBLIC__+'/images/photograph/man-2.png')
				$(this).find('.m1').css('color','#B91525');
			},
			function(){
				$(this).find('img').attr('src',__PUBLIC__+'/images/photograph/man-1.png')
				$(this).find('.m1').css('color','#999');
			}
		);
		$('#photograph .bottom-bar .step1 .right .woman').hover(
			function(){
				$(this).find('img').attr('src',__PUBLIC__+'/images/photograph/woman-2.png');
				$(this).find('.m2').css('color','#B91525');
			},
			function(){
				$(this).find('img').attr('src',__PUBLIC__+'/images/photograph/woman-1.png');
				$(this).find('.m2').css('color','#999');
			}
		);
		$('#photograph-step .top-bar .left-side ul li').hover(
			function(){
				var i = $(this).index()+1;
				var imgSrc = __PUBLIC__+'/images/photograph/p'+i+'-2.jpg';
				$(this).find('img').attr('src',imgSrc);
				$(this).css({'border-color':'#B91525','box-shadow':'0px 0px 10px #B91525'});
				$(this).find('.grey-bg').addClass('red-bg').removeClass('grey-bg');
			},
			function(){
				var i = $(this).index()+1;
				var imgSrc = __PUBLIC__+'/images/photograph/p'+i+'-1.jpg';
				$(this).find('img').attr('src',imgSrc);
				$(this).css({'border-color':'#ddd','box-shadow':'0px 0px 0px #fff'});
				$(this).find('.red-bg').addClass('grey-bg').removeClass('red-bg');
			}
		);
		*/
		// photograph slide show
		var _num = $('.role-slideshow .content ol li').length;
		var _obj = $('.role-slideshow .content ol');
		_obj.css({'width':_num*(166+10+2)+'px'});//li-w:166 border:2 magin:10
		var leftArrow = $('.role-slideshow .left-arrow');
		var rightArrow = $('.role-slideshow .right-arrow');
		
		/* mm 2/5
		leftArrow.live('click',function(){
			if(_obj.is(':animated')){return;}
			if(parseInt(_obj.css('left')) >= 0){
				$(this).css('background-position','0px 0px');
			}
			else{
				$(this).css('background-position','0px -71px');
				_obj.animate({
				left:'+=178px'
				},100,function(){
					rightArrow.css('background-position','-57px -71px');
				});
			}
		});
		rightArrow.live('click',function(){
			if(_obj.is(':animated')){return;}
			if(parseInt(_obj.css('left')) <= -(178*(_num-3))){
				$(this).css('background-position','-57px 0');
				leftArrow.css('background-position','0 -71px');
			}
			else{
				_obj.animate({
					left:'-=178px'
				},100,function(){
					leftArrow.css('background-position','0 -71px');
				});
			}
		});
		$('.height_weight .left .content').each(function(){
			var $key = $(this)
			$key.find('span').click(function(){
				$key.find('span').removeClass('select');
				$(this).addClass('select');
			});
		});
		*/
		//verification
		//email
		function infoText($obj,result,pass,error){
			if(result){
				$obj.parent().find('.warning-info').addClass('warning-info-pass').removeClass('warning-info-error').html(pass);
			}
			else {
				$obj.parent().find('.warning-info').addClass('warning-info-error').removeClass('warning-info-pass').html(error);
			} 
		}
		function checkEmail() {
			var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/; 
			result = emailReg.test($('#email').val());
			pass = '输入正确';
			error = '您输入的Email地址格式不正确！';
			infoText($(this),result,pass,error);
			return result;
		}
		function AjaxCheckMail(){
			if(!checkEmail()) { return; }
			var EmailObj = $('#email').val();
			if(EmailObj == ''){
				$(this).parent().find('.warning-info').addClass('warning-info-error').text('邮箱不能为空');
			}
			else{
				$.ajax({
					url:__DOC__+'/user.php/index/ajax/act/isReg',
					type:'post',
					cache:false,
					dataType:'json',
					data:{account : EmailObj},
					success: function(data,textStatus){
						if(data.error == 0){
							$('#email').parent().find('.warning-info').addClass('warning-info-pass').text('邮箱可以使用，输入正确');
							return;
						}
						else{
							$('#email').parent().find('.warning-info').addClass('warning-info-error').text('该邮箱已被注册！');
						}
					},
					error: function(Request,Status,Error) {}
				});
			}
		};
		//$('#email').focusout(checkEmail);
		//$('#email').focusout(AjaxCheckMail);
		//login check mail
		function LogincheckEmail(){
			var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/; 
			result = emailReg.test($('#login_email').val());
			pass = '输入正确';
			error = '您输入的Email地址格式不正确！';
			infoText($(this),result,pass,error);
			return result;
		}
		//$('#login_email').focusout(LogincheckEmail);
		//captcha
		function captcha(){
			var captcha = $('#captcha').val(); 
			result = (captcha != '' && captcha.length ==4) ? true : false;
			pass = '输入正确';
			error = '验证码格式不正确！';
			infoText($(this),result,pass,error);
			return result;
		}
		//$('#captcha').keyup(captcha);
		//password
		function passWord(){
			var passWordReg = /^.{6,20}$/; 
			result = passWordReg.test($('#password').val());
			pass = '输入正确';
			error = '密码至少6位字符！';
			infoText($(this),result,pass,error);
			return result;
		}
		//$('#password').focusout(passWord);
		//confirm password
		function cfm_password(){
			if($('#cfm_password').val() == ''){
				$('#cfm_password').parent().find('.warning-info').addClass('warning-info-error').text('密码不能为空！');
			}
			else{
				result = ($('#password').val() === $('#cfm_password').val());
				pass = '输入正确';
				error = '请确认两个密码是一致的。';
				infoText($(this),result,pass,error);
				return result;
			}
		}
		//$('#cfm_password').focusout(cfm_password);
		//nickname
		function nickname(){
			var obj = $('#nickname').val();
			var num = obj.length;
			if(num >= 21){
				$('#nickname').parent().find('.warning-info').addClass('warning-info-error').text('昵称不能超过20个字符！');
				return false;
			}
			else if(num == 0){
				$('#nickname').parent().find('.warning-info').addClass('warning-info-error').text('昵称不能为空！');
				return false;
			}
			else if(num > 0 && num < 21){
				$.ajax({
					url:__DOC__+'/user.php/index/ajax/act/isReg',
					type:'post',
					cache:false,
					dataType:'json',
					data:{nickname : obj},
					success:function(data,textstatus){
						if(data.error == 0){
							$('#nickname').parent().find('.warning-info').removeClass('warning-info-error').addClass('warning-info-pass').text('昵称可以使用');
						}
						else{
							$('#nickname').parent().find('.warning-info').removeClass('warning-info-pass').addClass('warning-info-error').text('昵称已被注册！');
						}
					},
					error:function(Ruquest,Status,Error){
						 alert(Request + '|' + Status + '|' +Error);
					}
				});
				return true;
			}
		}
		//$('#nickname').focusout(nickname);
		/*$('.regisiter input').bind('focusout keyup change',function(){
			var isEmpty = true;
			$('.regisiter .t-input :text').each(function(){
				if($(this).val() == '') { return isEmpty = false; }
			});
			if(isEmpty == true && checkEmail() && passWord() && cfm_password() && $('.agreement input').attr('checked') == 'checked'){
				$('.regisiter-btn input').removeClass('grey-btn').addClass('red-btn').removeAttr('disabled');
			}
			else{
				$('.regisiter-btn input').removeClass('red-btn').addClass('grey-btn').attr('disabled');
			}
		});
		
		/*$('.login-content input').bind('focusout keyup change',function(){
			var isEmpty = true;
			$('.login-content .t-input :text').each(function(){
				if($(this).val() == ''){
					return isEmpty = false;
				}
			});
			if(isEmpty == true && login_email && password && captcha){
				$('.login-btn input').removeClass('grey-btn').addClass('red-btn').removeAttr('disabled');
			}
			else{
				$('.login-btn input').removeClass('red-btn').addClass('grey-btn').attr('disabled');
			}
		}); */
		//select city
		$._cityInfo = [{"n":"北京市","c":["北京市"]},
		{"n":"天津市","c":["天津市"]},
		{"n":"上海市","c":["上海市"]},
		{"n":"重庆市","c":["重庆市"]},
		{"n":"河北省","c":["石家庄市","唐山市","秦皇岛市","邯郸市","邢台市","保定市","张家口市","承德市","沧州市","廊坊市","衡水市"]},
		{"n":"山西省","c":["太原市","大同市","阳泉市","长治市","晋城市","朔州市","晋中市","运城市","忻州市","临汾市","吕梁市"]},
		{"n":"台湾省","c":["台北市","高雄市","基隆市","台中市","台南市","新竹市","嘉义市","台北县","宜兰县","桃园县","新竹县","苗栗县","台中县","彰化县","南投县","云林县","嘉义县","台南县","高雄县","屏东县","澎湖县","台东县","花莲县"]},
		{"n":"辽宁省","c":["沈阳市","大连市","鞍山市","抚顺市","本溪市","丹东市","锦州市","营口市","阜新市","辽阳市","盘锦市","铁岭市","朝阳市","葫芦岛市"]},
		{"n":"吉林省","c":["长春市","吉林市","四平市","辽源市","通化市","白山市","松原市","白城市","延边朝鲜族自治州"]},
		{"n":"黑龙江省","c":["哈尔滨市","齐齐哈尔市","鹤岗市","双鸭山市","鸡西市","大庆市","伊春市","牡丹江市","佳木斯市","七台河市","黑河市","绥化市","大兴安岭地区"]},
		{"n":"江苏省","c":["南京市","无锡市","徐州市","常州市","苏州市","南通市","连云港市","淮安市","盐城市","扬州市","镇江市","泰州市","宿迁市"]},
		{"n":"浙江省","c":["杭州市","宁波市","温州市","嘉兴市","湖州市","绍兴市","金华市","衢州市","舟山市","台州市","丽水市"]},
		{"n":"安徽省","c":["合肥市","芜湖市","蚌埠市","淮南市","马鞍山市","淮北市","铜陵市","安庆市","黄山市","滁州市","阜阳市","宿州市","巢湖市","六安市","亳州市","池州市","宣城市"]},
		{"n":"福建省","c":["福州市","厦门市","莆田市","三明市","泉州市","漳州市","南平市","龙岩市","宁德市"]},
		{"n":"江西省","c":["南昌市","景德镇市","萍乡市","九江市","新余市","鹰潭市","赣州市","吉安市","宜春市","抚州市","上饶市"]},
		{"n":"山东省","c":["济南市","青岛市","淄博市","枣庄市","东营市","烟台市","潍坊市","济宁市","泰安市","威海市","日照市","莱芜市","临沂市","德州市","聊城市","滨州市","荷泽市"]},
		{"n":"河南省","c":["郑州市","开封市","洛阳市","平顶山市","安阳市","鹤壁市","新乡市","焦作市","濮阳市","许昌市","漯河市","三门峡市","南阳市","商丘市","信阳市","周口市","驻马店市"]},
		{"n":"湖北省","c":["武汉市","黄石市","十堰市","宜昌市","襄樊市","鄂州市","荆门市","孝感市","荆州市","黄冈市","咸宁市","随州市","恩施土家族苗族自治州","仙桃市","潜江市","天门市","神农架林区"]},
		{"n":"湖南省","c":["长沙市","株洲市","湘潭市","衡阳市","邵阳市","岳阳市","常德市","张家界市","益阳市","郴州市","永州市","怀化市","娄底市","湘西土家族苗族自治州"]},
		{"n":"广东省","c":["广州市","深圳市","珠海市","汕头市","韶关市","佛山市","江门市","湛江市","茂名市","肇庆市","惠州市","梅州市","汕尾市","河源市","阳江市","清远市","东莞市","中山市","潮州市","揭阳市","云浮市"]},
		{"n":"甘肃省","c":["兰州市","金昌市","白银市","天水市","嘉峪关市","武威市","张掖市","平凉市","酒泉市","庆阳市","定西市","陇南市","临夏回族自治州","甘南藏族自治州"]},
		{"n":"四川省","c":["成都市","自贡市","攀枝花市","泸州市","德阳市","绵阳市","广元市","遂宁市","内江市","乐山市","南充市","眉山市","宜宾市","广安市","达州市","雅安市","巴中市","资阳市","阿坝藏族羌族自治州","甘孜藏族自治州","凉山彝族自治州"]},
		{"n":"贵州省","c":["贵阳市","六盘水市","遵义市","安顺市","铜仁地区","毕节地区","黔西南布依族苗族自治州","黔东南苗族侗族自治州","黔南布依族苗族自治州"]},
		{"n":"海南省","c":["海口市","三亚市","五指山市","琼海市","儋州市","文昌市","万宁市","东方市","澄迈县","定安县","屯昌县","临高县","白沙黎族自治县","昌江黎族自治县","乐东黎族自治县","陵水黎族自治县","保亭黎族苗族自治县","琼中黎族苗族自治县"]},
		{"n":"云南省","c":["昆明市","曲靖市","玉溪市","保山市","昭通市","丽江市","思茅市","临沧市","楚雄彝族自治州","红河哈尼族彝族自治州","文山壮族苗族自治州","西双版纳傣族自治州","大理白族自治州","德宏傣族景颇族自治州","怒江傈僳族自治州","迪庆藏族自治州"]},
		{"n":"青海省","c":["西宁市","海东地区","海北藏族自治州","黄南藏族自治州","海南藏族自治州","果洛藏族自治州","玉树藏族自治州","海西蒙古族藏族自治州"]},
		{"n":"陕西省","c":["西安市","铜川市","宝鸡市","咸阳市","渭南市","延安市","汉中市","榆林市","安康市","商洛市"]},
		{"n":"广西壮族自治区","c":["南宁市","柳州市","桂林市","梧州市","北海市","防城港市","钦州市","贵港市","玉林市","百色市","贺州市","河池市","来宾市","崇左市"]},
		{"n":"西藏自治区","c":["拉萨市","昌都地区","山南地区","日喀则地区","那曲地区","阿里地区","林芝地区"]},
		{"n":"宁夏回族自治区","c":["银川市","石嘴山市","吴忠市","固原市","中卫市"]}];

		$.initProv = function(prov, city, defaultProv, defaultCity) {
			var provEl = $(prov);
			var cityEl = $(city);
			var hasDefaultProv = (typeof(defaultCity) != 'undefined');
			
			var provHtml = '';
			console.info('provEl');
			/*
			provHtml += '<option value="-1">请选择</option>';
			for(var i = 0; i < $._cityInfo.length; i++) {
				provHtml += '<option value="' + i + '"' + ((hasDefaultProv && $._cityInfo[i].n == defaultProv) ? ' selected="selected"' : '') + '>' + $._cityInfo[i].n + '</option>';
			}
			provEl.html(provHtml);
			$.initCities(provEl, cityEl, defaultCity);
			*/
			provEl.change(function() {
				$.initCities(provEl, cityEl);
			});
			
		};
		$.initCities = function(provEl, cityEl, defaultCity) {
			var hasDefaultCity = (typeof(defaultCity) != 'undefined');
			if(provEl.val() != '' && parseInt(provEl.val()) >= 0) {
				var cities = $._cityInfo[parseInt(provEl.val())].c;
				var cityHtml = '';
				//cityHtml += '<option value="-1">请选择</option>';
				for(var i = 0; i < cities.length; i++) {
					cityHtml += '<option value="' + i + '"' + ((hasDefaultCity && cities[i] == defaultCity) ? ' selected="selected"' : '') + '>' + cities[i] + '</option>';
				}
				cityEl.html(cityHtml);
			} else {
				cityEl.html('<option value="-1">请先选择</option>');
			}
		};
		//search
		$('#college #article-search').focusin(function(e){
			$(this).val('');
			e.stopPropagation();
		});
		
		//payment slide box
		$payment = $('#confirm-payment');
		var box_w = $payment.width();
		var box_h = $payment.height();
		$payment.css({'left':(window_width-box_w)/2+'px','top':(window_height-box_h)/2+'px'});
		$('.pay_money').click(function(){
			$('.masker').fadeIn();
			$payment.fadeIn();
		});
		
		$('#confirm-payment .close').click(function(){
			$('#confirm-payment').fadeOut('slow');
			$('.masker').fadeOut('slow');
		});
		$('#payment .pay-input').click(function(){
			$('.pay-choose input').removeAttr('checked');
		});
		$('.pay_money').click(function(){
			$('#payment .pay-choose label').each(function(){
				key = $(this);
				if(key.find('input').attr('checked') == 'checked'){
					$(this).addClass('select');
					var $val = $('.select input').val();
					var $valvprice = $('.select input').val() * 20;
					$('#confirm-payment .price').html($val);
					$('#confirm-payment .vprice').html($valvprice);
					$('#up_amount').val( $val);
					
				}
				else if($('#payment .pay-input').val() != ''){
					$('#confirm-payment .price').html($('#payment .pay-input').val());
					var $up_value=$('#payment .pay-input').val();
					$('#up_amount').val($up_value);
				}
				
			});
			var $pt=$('input:radio[name="paytype"]:checked').val();
			$('#payt').val($pt);
		});
		$('#payment .pay-choose label input').click(function(){
			$('#payment .pay-input').val('');
		});
		$('#confirm-payment .go-pay').click(function(){
			$(this).hide();
			$('#confirm-payment .go-to-pay .finish-pay').show();
			$('#confirm-payment .problem').html('遇到问题？');
		});
		//3d models sift
		/* mm 2/5
		$('.sidebar .format li.all .checkbox').live('click',function(){
			$('.sidebar .format li.sign input').removeAttr('checked').parent().removeClass('checked');
		})
		$('.sidebar .format li.sign .checkbox').live('click',function(){
			$('.sidebar .format li.all input').removeAttr('checked').parent().removeClass('checked');
		})
		$('.sidebar .models li.all .checkbox').live('click',function(){
			$('.sidebar .models li.sign input').removeAttr('checked').parent().removeClass('checked');
		})
		$('.sidebar .models li.sign .checkbox').live('click',function(){
			$('.sidebar .models li.all input').removeAttr('checked').parent().removeClass('checked');
		})
		*/
		$('.format .more-format').click(function(){
			$('.frm-tempfile').fadeIn();
			$('.masker').fadeIn();
		});
		$('.frm-tempfile .bfrm').click(function(){
			$('.frm-tempfile').fadeOut();
			$('.masker').fadeOut();
		});
		$('.masker').click(function(){
			$(this).fadeOut();
			$('.frm-tempfile').fadeOut();
		});
		
		$("#cou_content").change(function(){
			var price = Number($("#yf").text());
			var cop_num = $(this).val();
			console.info(price);
			console.info(cop_num);
			$.ajax({
				url:__APP__+'/coupon/pay',
				type:'post',
				cache:false,
				dataType:'json',
				data:{price : price, cop_num : cop_num},
				success: function(data,textStatus){
					console.info(data.detail);
					console.info(data.amount);
					$("#cou_type").html(data.detail);
					$("#cou_num").html(data.amount);
//					if(data.error == 0){
//						$('#email').parent().find('.warning-info').addClass('warning-info-pass').text('邮箱可以使用，输入正确');
//						return;
//					}
//					else{
//						$('#email').parent().find('.warning-info').addClass('warning-info-error').text('该邮箱已被注册！');
//					}
				},
				error: function(Request,Status,Error) {}
			});
		});
		
	})
})(jQuery);

//ADD BY guyiwei START 在showca页面的发送优惠券提交form函数
function formSendCou()
 {
	 var form =  document.getElementById("form-send");
	 form.action="giveca";
 	 form.submit();
 	  } 
//ADD BY guywei END