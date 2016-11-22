$(document).ready(function (e) {
	//Init Start
	var SelectorBtnDelete = 'button[name=delete]';

	var $InfoDiv = $('div.ajaxinfo');
	var $Mask = $('div.blackmask');

	function Init() {
		$("input[type=radio]").next('label').click(function () { $(this).prev().click(); return false; });
		$("input[type=text]").parents('tr').addClass("clickable");
		$("input[type=text]").parents('tr').click(function () { $(this).find("input[type=text]").focus(); return false; });

		$("#licenseselect").change(function () {
			var licval = parseInt($(this).val());
			$('.islicense, .freelicense, .catlicense').hide();
			switch (licval) {
				case 1: { $('.islicense').show(); break; }
				case 2: { $('.freelicense').show(); break; }
				case 3: { $('.catlicense, .freelicense').show(); break; }
			}
		});
		$("#licenseselect").change();
		$("input[name=lictype]").change(function () { lictypesw(this); });
		lictypesw("input[name=lictype]:checked");
		//$("input[name=isprint]").change(function () { alert("aa"); });
	}

	Init();
	addProductPhotoToList();
	$('ul#photolist').sortable({ handle: "img" });
	$InfoDiv.hide();
	$Mask.fadeTo(0, 0.4).hide();
	//Init End

	function lictypesw(obj) {
		$("#licenseselect").change();
		var lictypeval = parseInt($(obj).val());
		$('.lictypedis li').hide();
		switch (lictypeval) {
			case 0: {
				$('.islicense').hide(); 
				$('.islicense_free').show(); 
				
				$('.lictypedis li.lictype2').fadeIn();
				$('#shareby').val(3);
				$("#licenseselect option[value='1']").attr("disabled", "disabled");
				$('.ore').fadeOut();
				break;
			}
			case 1: {
				$('.islicense').show(); 
				$('.islicense_free').hide(); 
				$('#shareby').val(1);
				$('.lictypedis li.lictype1').fadeIn();
				$("#licenseselect option[value='3']").attr("disabled", "disabled");

				$("#licenseselect option[value='1']").removeAttr("disabled");
				$('.ore').fadeIn();
				break;
			}
			default: {
				$('.lictypedis li.lictype0').fadeIn();
				$('.ore').fadeOut();
				break;
			}
		}
	}

	//Upload Start
	var swfu = new SWFUpload({
		upload_url: UploadUrl,
		flash_url: PublicUrl + "/js/swfupload/Flash/swfupload.swf",
		file_post_name: "Photodata",
		post_params: { sessionid: SessionID },
		//debug: true,

		file_size_limit: "10 MB",
		file_types: "*.jpeg;*.jpg;*.png",
		file_types_description: "Select Files",
		file_upload_limit: 0,
		file_queue_limit: 0,

		button_width: 102,
		button_height: 29,
		button_image_url: PublicUrl + "/images/swf_btn_productphoto.jpg",
		button_text: '<span class="buttonplaceholder">添加效果图</span>',
		button_text_style: '.buttonplaceholder { font-size:12px; color:#ffffff; text-align: center; }',
		button_placeholder_id: "swf_buttonplaceholder",
		button_text_top_padding: 4,
		button_text_left_padding: 0,
		button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
		button_cursor: SWFUpload.CURSOR.HAND,

		//file_dialog_start_handler: fileDialogStart,
		file_dialog_complete_handler: fileDialogComplete,
		//file_queue_error_handler: fileQueueError,
		file_queued_handler: fileQueued,
		upload_start_handler: uploadStart,
		//upload_progress_handler: uploadProgress,
		upload_error_handler: uploadError,
		upload_success_handler: uploadSuccess,
		upload_complete_handler: uploadComplete
	});
	function fileDialogStart(file) { }

	function fileDialogComplete(numFilesSelected, numFilesQueued) {
		if (numFilesSelected > 0) {
			var queuelimit = parseInt(swfu.getSetting('file_queue_limit').toString());
			if (numFilesSelected > queuelimit && queuelimit != 0) { } //文件超出限制
			if (parseInt(swfu.getStats()['files_queued']) == 0) { } //未选择文件
			closeFrm();
			swfu.startUpload();
		}
	}

	function fileQueued(file) {
		var $template = $('ul#photolist_template li:first').clone();
		$template.attr('name', file.id);
		$template.find('h4').text(file.name);
		$template.find('span.uploading').text('等待中');
		$template.find('div.uploadinfo,div.photoinfo').hide();
		$template.find('div.uploadinfo').show();
		$template.find(SelectorBtnDelete).click(function () { removeFile(file.id); });
		$('ul#photolist').append($template);
	}

	function fileQueueError(file, errorCode, message) {
		var ErrorMessage = '';
		switch (errorCode) {
			case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT: { ErrorMessage = '文件大小超出最大限制'; break; }
			case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE: { ErrorMessage = '文件类型错误'; break; }
			case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED: { ErrorMessage = '超出一次可上传的文件量'; break; }
			case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE: { ErrorMessage = '文件为空'; break; }
		}
	}

	function uploadStart(file) { setFileMessage(file.id, '正在上传...'); }

	function uploadProgress(file, bytesComplete, totalBytes)
	{ var Percent = Math.floor((bytesComplete / totalBytes) * 100); }

	function uploadError(file, errorCode, message) {
		getFileLi(file.id).find('div.progress').hide();
		setFileMessage(file.id, '<b>上传发生错误<b>');
	}

	function uploadSuccess(file, data) {
		$Uploader = getFileLi(file.id);
		
		try {
			data = eval("(" + data + ")");
			if (data.isSuccess) {
				$Uploader.find(':input[name=title]').val(file.name);
				$Uploader.find(':hidden[name=photoid]').val(data.PhotoID);
				$Uploader.find('img').attr('src', WebRoot + data.PhotoPath.replace('/o/','/s/100_100_'));
				$Uploader.find('div.photoinfo').show();
				$Uploader.find('div.uploadinfo').hide();
			}
			else if (data.Message) { setFileMessage(file.id, '<b>' + data.Message + '<b>'); }
			else { setFileMessage(file.id, '<b>上传失败<b>'); }
		}
		catch (err) { setFileMessage(file.id, '<b>上传失败<b>'); }
	}

	function uploadComplete(file) {
		// miaomin edited@2014.8.20
		setDefaultPhotoInList();
		
		swfu.startUpload();
	}

	function removeFile(FileID) {
		var Stats = swfu.getStats();
		var $Uploader = getFileLi(FileID);
		var RegUpload = new RegExp("^SWFUpload_");
		if ($Uploader.find(":hidden[name=photoid]").val()) { //已上传的
			if (confirm("确认删除已上传的文件 " + $Uploader.find('h4').html() + "吗?"))
			{ deleteFile(FileID); }
		}
		else if (RegUpload.test($Uploader.attr('name'))) { //列表中的
			FileObj = swfu.getFile(FileID);
			if (Stats['in_progress'] == 1 && FileObj['filestatus'] == SWFUpload.FILE_STATUS.IN_PROGRESS) { //上传中
				if (confirm('文件 ' + $Uploader.find('h4').html() + '正在上传中，确认删除吗？')) {
					FileObj = swfu.getFile(FileID);
					if (FileObj['filestatus'] == SWFUpload.FILE_STATUS.IN_PROGRESS)
					{ 
						swfu.cancelUpload(FileID); $Uploader.remove(); 
					}
					else { deleteFile(FileID); } //!
				}
			}
			else { $Uploader.remove(); }
		}
		else { $Uploader.remove(); }
	}

	function deleteFile(FileID) {
		var $Uploader = getFileLi(FileID);
		$.ajax({
			url: DeleteUrl,
			type: 'post',
			data: { photoid: FileID },
			dataType: 'json',
			beforeSend: function () { $Uploader.find(SelectorBtnDelete).hide(); setFileMessage(FileID, '删除中...'); },
			success: function (data) {
				if (data.isSuccess) { 
					
					$Uploader.remove(); 
					
					// miaomin edited@2014.8.20
					setDefaultPhotoInList();
				}
				else { DelayDisplayInfo(data.Message,1000); $Uploader.find(SelectorBtnDelete).show(); }
			},
			error: function () { setFileMessage(FileID, '<b>删除失败<b>'); $Uploader.find(SelectorBtnDelete).show(); }
		});
	}

	function getFileLi(FileID) { return $('ul#photolist li[name=' + FileID + ']:first'); }
	function setFileMessage(FileID, Html) { getFileLi(FileID).find('span.uploading').html(Html); }
	//Upload End

	//Photo List Start
	function addProductPhotoToList() {
		if (isInt(ProductID) && ProductID > 0) {
			for (var i = 0; i < ProductPhoto.length; i++) {
				var PhotoObj = new Object();
				PhotoObj.id = ProductPhoto[i].PhotoID;
				PhotoObj.title = ProductPhoto[i].Title;
				PhotoObj.path =  WebRoot + (ProductPhoto[i].PhotoPath).replace('/o/','/s/100_100_');
				addPhotoToList(PhotoObj);
			}
		}
	}
	
	// miaomin edited@2014.8.20
	function setDefaultPhotoInList(){
		checkRadio = $('ul#photolist input:checked').size();
		
		if (checkRadio == 0){
			$('ul#photolist li:first').find(':radio').attr('checked', 'checked').next('i').addClass('selected');
		}
	}

	function addPhotoToList(photo) {
	

		//alert(photo);
		//exit;
		var $template = $('ul#photolist_template li:first').clone();
		$template.attr('name', photo.id);
		$template.find(':input[name=title]').val(photo.title);
		$template.find(':hidden[name=photoid]').val(photo.id);
		$template.find('img').attr('src', photo.path);
		$template.find('div.photoinfo').show();
		$template.find('div.uploadinfo').hide();
		$('ul#photolist').append($template);
		if(CoverID == photo.id) { $template.find(':radio').attr('checked','checked').next('i').addClass('selected'); }
		$template.find(SelectorBtnDelete).click(function () { removeFile(photo.id); })
		
		// miaomin edited@2014.8.20
		setDefaultPhotoInList();
	}
	//Photo List End

	//Button Start
	$('#submit').click(function () {
		if (!checkForm()) { alert("必要的内容没有被填写或填写错误\n请检查带*的项"); return false; }
		var PhotoInfo = getPhotoInfo();
		$(':hidden[name=photoinfo]').val(PhotoInfo);
		$(':hidden[name=status]').val(1);
	});

	$('#draft').click(function () {
		if (!checkForm()) { alert("必要的内容没有被填写或填写错误\n请检查带*的项"); return false; }
		var PhotoInfo = getPhotoInfo();
		$(':hidden[name=photoinfo]').val(PhotoInfo);
		$(':hidden[name=status]').val(0);
	});

	function checkForm() {
		lictype = checkCkbChecked('lictype');
		if (lictype === false) {  return false;  }
		if (!checkCommon()) { return false; }
		checkLicTypeResult = 0;
		if (lictype == 0) { checkLicTypeResult = checkLicType0(); }
		else { checkLicTypeResult = checkLicType1(); }
		return checkLicTypeResult;
	}

	function checkCommon() {
		if (!checkSelectVal('cate1') && !checkSelectVal('cate2')) { return false; }
		if (checkCkbChecked('istexture') === false) { return false; }
		if (checkCkbChecked('ismaterials') === false) { return false; }
		//var shareby = checkSelectVal('shareby');
		var shareby = $('#shareby').val();
		if (!shareby) { return false; }
		var price = 0, sharebylic = 0;
		if (shareby == 1) {
			price = $(':text[name=price]').val();
			//sharebylic = checkSelectVal('shareby1');
			if (!isInt(price) || parseInt(price) == 0) { return false; }
		}
		  else {
			price = $(':text[name=vprice]').val();
			//sharebylic = checkSelectVal('sharebyother');
			//if (!isInt(price)) {alert(shareby); return false; }
		}
		//if (!sharebylic) {alert(shareby); return false; }
		return true;
	}

	function checkLicType0() { return true; }

	function checkLicType1() //原创
	{
		if (!checkSelectVal('geometry')) { return false; }
		var mesh = $(':text[name=mesh]').val();
		if (!isInt(mesh) || parseInt(mesh) == 0) { return false; }
		var vertices = $(':text[name=vertices]').val();
		if (!isInt(vertices) || parseInt(vertices) == 0) { return false; }

		var isanimation = checkCkbChecked('isanimation');
		var isrigged = checkCkbChecked('isrigged');
		var isuvlayout = checkCkbChecked('isuvlayout');
		if (isanimation === false || isrigged === false || isuvlayout === false)
		{ return false; }
		//if (!checkSelectVal('unwrappeduvs')) { return false; }
		var intro = $('textarea[name=intro]').val();
		if (intro.trim() == '') { return false; }
		//var tags = $('textarea[name=tags]').val();
		//if (tags.trim() == '') { return false; }
		return true;
	}

	function checkCkbChecked(CkbName) {
		var $Ckb = $(':checked[name=' + CkbName + ']');
		return $Ckb.length > 0 ? $Ckb.val() : false;
	}
	function checkSelectVal(SelectName)
	{ return parseInt($('select[name=' + SelectName + ']').val()); }
	
	
	function getPhotoInfo() {
		var PhotoInfo = '';
		var PhotoCount = $('ul#photolist li').length;
		$('ul#photolist li').each(function () {
			$Li = $(this);
			PID = $Li.find(':hidden[name=photoid]').val();
			Title = $Li.find(':input[name=title]').val();
			IsCover = $Li.find(':checked[name=cover]').length;
			PhotoInfo += '{"PID":' + PID + 
						',"Title":"' + JsonEncode(Title) + 
						'","IsCover":' + IsCover + 
						',"Weight":' + PhotoCount-- + '},';
		});
		return '[' + PhotoInfo.substr(0, PhotoInfo.length - 1) + ']';
	}
	//Button End

	//Common Start
	var InfoDivTimeOut = null;
	function DelayDisplayInfo(Info, Delay) {
		clearTimeout(InfoDivTimeOut); DisplayInfo(Info);
		InfoDivTimeOut = setTimeout(function () { hideInfo(); }, Delay);
	}

	function DisplayInfo(Info) { $InfoDiv.find('h3').html(Info); $InfoDiv.fadeIn(200); }
	function hideInfo() { $InfoDiv.fadeOut(200); }

	function DisplayMask() { $Mask.fadeIn(100); }
	function HideMask() { $Mask.fadeOut(100); }

	function closeFrm() { $("div[class^='frm']").hide(); $(".blackmask").fadeOut(50); }

	function isInt(str) { var reg = /^(-|\+)?\d+$/; return reg.test(str); }

	function formatFileSize(FileSize) {
		var SizeArray = Array('Byte', 'KB', 'MB', 'GB');
		for (var i = 1; i <= SizeArray.length + 1 ; i++) {
			if (Math.pow(1024, i) > FileSize)
			{ return parseFloat(FileSize / Math.pow(1024, i - 1)).toFixed(2) + ' ' + SizeArray[i - 1]; }
		}
		return FileSize;
	}
	

	function JsonEncode(str) {
		if (str.length == 0) { return ''; }
		str = str.replace(/\'/g, "&#39;");
		str = str.replace(/\"/g, "&quot;");
		return str;
	}

	function JsonDecode(str) {
		if (str.length == 0) { return ''; }
		str = str.replace(/&#39;/g, "\'");
		str = str.replace(/&quot;/g, "\"");
		return str;
	}

	function HtmlEncode(str) {
		var s = "";
		if (str.length == 0) return "";
		s = str.replace(/&/g, "&amp;");
		s = s.replace(/</g, "&lt;");
		s = s.replace(/>/g, "&gt;");
		s = s.replace(/ /g, "&nbsp;");
		s = s.replace(/\'/g, "&#39;");
		s = s.replace(/\"/g, "&quot;");
		//s = s.replace(/\n/g, "<br>");
		return s;
	}

	function HtmlDecode(str) {
		var s = "";
		if (str.length == 0) return "";
		s = str.replace(/&amp;/g, "&");
		s = s.replace(/&lt;/g, "<");
		s = s.replace(/&gt;/g, ">");
		s = s.replace(/&nbsp;/g, " ");
		s = s.replace(/&#39;/g, "\'");
		s = s.replace(/&quot;/g, "\"");
		s = s.replace(/<br>/g, "\n");
		return s;
	}
	//Common End
});