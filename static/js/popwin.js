function changeCount(usercartId,count){ 
$("#updatecartfrm_id").val(usercartId); 
$("#updatecartfrm_count").val(count); 
$("#updatecartfrm").submit(); 
} 

function addToCart(pmaId){ 
$("#addcartfrm_pmaid").val(pmaId); 
$("#addcartfrm").submit(); 
} 

function checkfile(Url){ 
window.location.href = Url; 
} 

function downloadfile(downUrl){ 
window.location.href = downUrl; 
} 

function movefilefrm(fromFolderName,fileId,isnomask){ 
var label = '从<b>' + fromFolderName + '</b>移动到'; 
$("#from_folder_label").html(label); 
$("#move_file_id").val(fileId); 

initfrm('movefile', isnomask); 
} 

function removefilefrm(fileName,fileId,isnomask){ 
var label = '您确定要删除<b>' + fileName + '</b>么？'; 
$("#remove_file_confirm_label").html(label); 
$("#remove_file_id").val(fileId); 

initfrm('removefile', isnomask); 
} 

function removefolderfrm(folderName,folderId,isnomask){ 
var label = '您确定要删除<b>' + folderName + '</b>么？'; 
$("#remove_folder_confirm_label").html(label); 
$("#remove_folder_id").val(folderId); 

initfrm('removefolder', isnomask); 
} 

function removecartfrm(cartName,cartId,isnomask){ 
cartName = decodeURI(decodeURI(cartName)); 
var label = '您确定要删除<b>' + cartName + '</b>么？'; 
$("#remove_cart_confirm_label").html(label); 
$("#remove_cart_id").val(cartId); 

initfrm('removecart', isnomask);  
} 

function clearcartfrm(cartName,isnomask){ 
cartName = decodeURI(decodeURI(cartName)); 
var label = '您确定要删除<b>' + cartName + '</b>么？'; 
$("#clear_cart_confirm_label").html(label); 

initfrm('clearcart', isnomask);  
}

function renamefolderfrm(folderName,folderId,isnomask){ 
$("#new_folder_name").val(folderName); 
$("#rename_folder_id").val(folderId); 

initfrm('renamefolder', isnomask); 
} 

function renamefilefrm(fileName,fileId,isnomask){ 
$("#new_file_name").val(fileName); 
$("#rename_file_id").val(fileId); 

initfrm('renamefile', isnomask); 
} 

function submitOrder(){ //购物车提交到订单 
	
	document.getElementById('form1').submit(); 
} 

function closefrmsubmit(frm,formid){// 关闭弹窗并提交 
	if(!frm) { $("div[class^='abfrm frm-']").fadeOut(); } else { $(".frm-"+frm).fadeOut(); } 
	document.getElementById(formid).submit(); 
	$('.blackmask').hide(); 
} 





function initfrmpay(frm, isnomask){ //弹出新窗口
	$(".frm-"+frm).fadeIn(100);
	if(!isnomask){
		$('.blackmask').fadeTo(500,0.6);
	}
	document.getElementById('modify').innerHTML="";

	document.getElementById('payfrom').submit(); 
}

function closefrmfin(frm,url){
	if(!frm) { $("div[class^='abfrm frm-']").fadeOut(); } else { $(".frm-"+frm).fadeOut(); } 
	$('.blackmask').hide();
	if (url){
		window.location.href=url;
	}
}