$('div.tr>span.msg').hide();
var StatusSuccess = "info-success";
var StatusError = "info-error";

function regVerifyTextBox(Obj, Fun, Message) {
	$(Obj)
	.keyup(function () { verifyTextBox(Obj, Fun, Message, false); })
	.focusout(function () { verifyTextBox(Obj, Fun, Message, true); });
}


// guyiwei added @2014.11.7---->START

function regVerifyPhone(Obj, Fun, Message) {
	$(Obj)
	.keyup(function () { verifyTextBox(Obj, Fun, Message, false); })
	.focusout(function () { 
	     verifyTextBox(Obj, Fun, Message, true);
	    /* if(/^13\d{9}$/g.test($(Obj).val())||/^15[8,9]\d{8}$/g.test($(Obj).val())){}*/
		 if(/^1\d{10}$/g.test($(Obj).val())){}
	     else{showVerifyInfo('input[name=mobile]', Message, StatusError);} 	
	});
}



function regVerifyArea(Obj, Fun, Message,noArea) {
	$(Obj)
	.keyup(function () { verifyTextBox(Obj, Fun, Message, false); })
	.focusout(function () { 
	     verifyTextBox(Obj, Fun, Message, true);
		 noArea = $('Obj').val();
	     if(noArea == 0) { showVerifyInfo(Obj, Message, StatusError); }	
		 else if(noArea != 0){$('.area_msg').remove();}	
	});
}
// guyiwei added @2014.11.7---->END


// miaomin added @2014.2.12---->START
function regVerifySelector(Obj, Fun, Message, DisapObj) {
	$(Obj)
	.keyup(function () { verifySelector(Obj, Fun, Message, false, DisapObj); })
	.focusout(function () { verifySelector(Obj, Fun, Message, false, DisapObj); });
}

function checkAddressSelector(obj) {
	var noArea = $('select[name=region]').val();
	return noArea;
}

function verifySelector(Obj, Fun, Message, isDispErr,DispObj) {
	resetVerifyInfo(Obj);
	var TorF = Fun(Obj);
	var Status = TorF != 0 ? StatusSuccess : StatusError;
	// console.error('TorF:' + TorF);
	// console.error('Status:' + Status);
	// console.error('isDispErr:' + isDispErr);
	if (isDispErr || TorF == 0) { showVerifyInfo(DispObj, Message, Status); }
	return TorF;
}
// miaomin added @2014.2.12---->END

function regVerifyConfirm(Obj, ObjConfirm, Message) {
	$(Obj)
	.keyup(function () { verifyConfirm(Obj, ObjConfirm, Message, false); })
	.focusout(function () { verifyConfirm(Obj, ObjConfirm, Message, true); });
}

function verifyTextBox(Obj, Fun, Message, isDispErr) {
	resetVerifyInfo(Obj);
	var TorF = Fun(Obj);
	var Status = TorF ? StatusSuccess : StatusError;
	if (isDispErr || TorF) { showVerifyInfo(Obj, Message, Status); }
	return TorF;
}

function verifyConfirm(Obj, ObjConfirm, Message, isDispErr) {
	resetVerifyInfo(Obj);
	var TorF = checkPassConfirm(Obj, ObjConfirm);
	var Status = TorF ? StatusSuccess : StatusError;
	if (isDispErr || TorF) { showVerifyInfo(Obj, Message, Status); }
	return TorF;
}

function showVerifyInfo(Obj, Html, Status) {

	resetVerifyInfo(Obj);
	Html = Status == StatusSuccess ? '' : Html;
	$(Obj).html(Html);
	//alert(Html);
}

function resetVerifyInfo(Obj) {
	$(Obj).nextAll('span.msg').html('').hide()
	.parent().removeClass(StatusSuccess + ' ' + StatusError);
}

function checkEmail(obj) {
	var EMailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	return EMailReg.test($(obj).val());
}
function checkPass(obj) {
	var PassReg = /^.{6,}$/;
	return PassReg.test($(obj).val());
}
function checkPassConfirm(obj, objConfirm)
{ return $(obj).val() == $(objConfirm).val(); }
function checkNickName(obj) {
	var NickNameReg = /^.{1,}$/;
	return NickNameReg.test($(obj).val());
}