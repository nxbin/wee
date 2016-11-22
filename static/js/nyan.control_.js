var SelectID = 1;
function replaceSelect(selector, Class) {
	var ID = 'zerockselect_' + SelectID++;
	var Span_Click = '<span id="' + ID + '"><span></span><ul></ul></span>';

	$(selector).hide().after(Span_Click);
	$('#' + ID + ' ul').hide();
	if (Class) { $('#' + ID).addClass(Class); }

	$('#' + ID).click(function () {
		$('#' + ID + ' ul').html("");
		$(selector).find('option').each(function () {
			$('#' + ID + ' ul').append('<li name="' + $(this).val() + '">' + $(this).text() + '</li>');
			if ($(this).attr('disabled')) { $('#' + ID + ' ul').find('li').last().addClass('disable'); }
		});

		$('#' + ID + ' ul').find('li').click(function () {
			if (!$(this).hasClass('disable')) {
				$('#' + ID).find('span').text($(this).text()).attr('name', $(this).attr('name'));
				$(selector).find('option').removeAttr('selected');
				$(selector).find('option[value=' + $(this).attr('name') + ']').attr('selected', 'selected');
				$(this).parent().hide();
				$(selector).change();
			}
			return false;
		});

		$('#' + ID + ' ul').show();
		return false;
	}).mouseleave(function () { $(this).find('ul').hide(); });

	if ($(selector).find('option[selected]').length > 0)
	{ $('#' + ID).find('span').text($(selector).find('option[selected]').text()); }
	else { $('#' + ID).find('span').text($(selector).find('option').first().text()); }
}

function replaceCKB() {
	$('input[type=checkbox]').hide().wrap('<span class="checkbox"></span>');
	
	$('input[type=checkbox]').each(function () {
		if ($(this).attr('checked')) { $(this).parent().addClass('checked'); }
		if ($(this).attr('disabled')) { $(this).parent().addClass('disable'); }
	});
	
	$('input[type=checkbox]').click(function (e) {
		$(this).parent().removeClass('disable');
		if($(this).attr('disabled')) { $(this).parent().addClass('disable'); return false; }
		if($(this).attr('checked'))
		{ $(this).removeAttr('checked').parent().removeClass('checked'); }
		else { $(this).attr('checked','checked').parent().addClass('checked');}
		return false;
	});
	$('input[type=checkbox]').parent().click(function () {
		$(this).find('input[type=checkbox]').click();
		return false;
	});
}

function replaceRAD() {
	$('input[type=radio]').hide().wrap('<span class="radiobox"></span>');
	
	$('input[type=radio]').each(function () {
		if ($(this).attr('checked')) { $(this).parent().addClass('checked'); }
		if ($(this).attr('disabled')) { $(this).parent().addClass('disable'); }
	});
	
	$('input[type=radio]').click(function (e) {
		$(this).parent().removeClass('disable');
		if($(this).attr('disabled')) { $(this).parent().addClass('disable'); return false; }
		if($(this).attr('checked'))
		{ $(this).removeAttr('checked').parent().removeClass('checked'); }
		else { $(this).attr('checked','checked').parent().addClass('checked');}
		return false;
	});
	$('input[type=radio]').parent().click(function () {
		$(this).find('input[type=radio]').click();
		return false;
	});
}

$(document).ready(function () {
	$("select").each(function () { replaceSelect('#' + $(this).attr('id'), $(this).attr('class')); });
	replaceCKB();
	replaceRAD();
});

function initfrm(frm, isnomask){
	$(".frm-"+frm).fadeIn(100);
	
	if(!isnomask){
		$('.blackmask').fadeTo(500,0.6);
	}
}

function closefrm(frm){
	if(!frm) { $("div[class^='abfrm frm-']").fadeOut(); } else { $(".frm-"+frm).fadeOut(); }
	$('.blackmask').hide();
}

$(document).ready(function(){
	//首先将#back-to-top隐藏
	$("#back-to-top").hide();
	//当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
	$(function () {
		$(window).scroll(function(){
			if ($(window).scrollTop()>100){
				$("#back-to-top").fadeIn(500);
			} else {
				$("#back-to-top").fadeOut(300);
			}
		});
		//当点击跳转链接后，回到页面顶部位置
		$("#back-to-top").click(function(){
			$('body,html').animate({scrollTop:0},1000);
			return false;
		});
	});
});
