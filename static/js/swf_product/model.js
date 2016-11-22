$(document).ready(function () {
	//Init Start
	var SelectorCT = 'select[name=ct]';
	var SelectorCTV = 'input[name=ctv]';
	var SelectorSCT = 'select[name=sct]';
	var SelectorSCTV = 'input[name=sctv]';
	var SelectorBtnDelete = 'button[name=delete]';

	var $InfoDiv = $('div.ajaxinfo');
	var $Mask = $('div.blackmask');
	$InfoDiv.hide();
	$Mask.fadeTo(0, 0.4).hide();

	// BUG MARK
	addProductFileToList();
	InitTempFileList();
	//Init End

	//Upload Start
	var swfu = new SWFUpload({
		upload_url: UploadUrl,
		flash_url: PublicUrl + "/js/swfupload/Flash/swfupload.swf",
		file_post_name: "Filedata",
		post_params: { sessionid: SessionID },
		//debug: true,

		file_size_limit: "2 GB",
		file_types: "*.zip;*.rar;*.7z",
		file_types_description: "Select Files",
		file_upload_limit: 0,
		file_queue_limit: 0,

		button_width: 260,
		button_height: 80,
		button_image_url: PublicUrl + "/images/swf_btn_productmodel9.jpg",
		button_text: '<span class="buttonplaceholder"></span>',
		button_text_style: '.buttonplaceholder { font-size:20px; }',
		button_placeholder_id: "swf_buttonplaceholder",
		button_text_top_padding: 30,
		button_text_left_padding: 0,
		button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
		button_cursor: SWFUpload.CURSOR.HAND,

		file_dialog_start_handler: fileDialogStart,
		file_dialog_complete_handler: fileDialogComplete,
		//file_queue_error_handler: fileQueueError,
		file_queued_handler: fileQueued,
		upload_start_handler: uploadStart,
		upload_progress_handler: uploadProgress,
		upload_error_handler: uploadError,
		upload_success_handler: uploadSuccess,
		upload_complete_handler: uploadComplete
	});
	function fileDialogStart() { }

	function fileDialogComplete(numFilesSelected, numFilesQueued) {
		if (numFilesSelected > 0) {
			var queuelimit = parseInt(swfu.getSetting('file_queue_limit').toString());
			if (numFilesSelected > queuelimit && queuelimit != 0) { alert('max'); } //文件超出限制
			if (parseInt(swfu.getStats()['files_queued']) == 0) { } //未选择文件
			swfu.startUpload();
		}
		checkFileListIsEmpty();
	}

	function fileQueued(file) {
		var $template = $('ul#filelist_template li:first').clone();
		$template.attr('name', file.id);
		$template.find('h4').text(file.name);
		$template.find('h5').text('等待中');
		$template.find('div.ct,div.sct').hide();
		$template.find('div.progress').show();
		$template.find(".tipa").tipTip({maxWidth: "auto", delay: 100}); //!!
		$template.find(SelectorCT).change(function () { setSubCreateTool(file.id, $(this).val()); });
		$template.find(SelectorBtnDelete).click(function () { removeFile(file.id); });
		$('ul#filelist').append($template);
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

	function uploadStart(file) { setFileMessage(file.id, '正在上传中，请稍等 ...'); }

	function uploadProgress(file, bytesComplete, totalBytes) {
		var Percent = Math.floor((bytesComplete / totalBytes) * 100);
		var $ProgressBar = getFileLi(file.id).find('div.progressBar');
		var ProgressBarWidth = Percent * $ProgressBar.width() / 100;
		$ProgressBar.find('div').css({ width: ProgressBarWidth }).html(Percent + "%&nbsp;");
	}

	function uploadError(file, errorCode, message) {
		getFileLi(file.id).find('div.progress').hide();
		setFileMessage(file.id, '<b>文件处理失败，请重新上传。<b>');
	}

	function uploadSuccess(file, data) {
		$Uploader = getFileLi(file.id);
		try {
			data = eval("(" + data + ")");
			if (data.isSuccess) {
				$Uploader.find('h5').text(data.CreateDate);
				$Uploader.find('div.ct,div.sct').show();
				var $FileID = $('<input></input>');
				$FileID.attr('type', 'hidden').attr('name', 'FileID').val(data.FileID);
				$Uploader.find('div.hidden').append($FileID);
				setCreateTool(file.id, 1);
			}
			else if (data.Message) { setFileMessage(file.id, '<b>' + data.Message + '<b>'); }
			else { setFileMessage(file.id, '<b>未知错误，请重新上传。<b>'); }
		}
		catch (err) { setFileMessage(file.id, '<b>未知错误，请重新上传。<b>'); }
		$Uploader.find('div.progress').hide();
	}

	function uploadComplete(file) { swfu.startUpload(); }

	function setCreateTool(FileID, Cate) {
		var $Uploader = getFileLi(FileID);
		$Uploader.find(SelectorCT).children().remove();

		var $Option = $("<option></option>");
		$Option.text('- 请选择创作工具 -').attr('value', '0');
		$Uploader.find(SelectorCT).append($Option);

		for (var CTIndex in CreateTool) {
			CT = CreateTool[CTIndex];
			if (CT.CateID == Cate) {
				$Option = $("<option></option>");
				$Option.text(CT.name).attr('value', CT.id);
				$Uploader.find(SelectorCT).append($Option);
			}
		}
		$Uploader.find(SelectorCT).change();
	}

	function setSubCreateTool(FileID, CreateToolID) {
		var $Uploader = getFileLi(FileID);
		$Uploader.find(SelectorSCT).children().remove();
		$Uploader.find('div.sct').hide();

		if (CreateTool[CreateToolID] && CreateTool[CreateToolID].hasSubType) {
			var SubToolList = CreateToolIndex[CreateToolID];
			var $Option = $("<option></option>");
			$Option.text('- 请选择渲染器 -').attr('value', '0');
			$Uploader.find(SelectorSCT).append($Option);
			for (var i = 0; i < SubToolList.length; i++) {
				if (SCT = CreateTool[SubToolList[i]]) {
					$Option = $("<option></option>");
					$Option.text(SCT.name).attr('value', SCT.id);
					$Uploader.find(SelectorSCT).append($Option);
				}
			}
			$Uploader.find('div.sct').show();
		}
	}

	function removeFile(FileID) {
		var Stats = swfu.getStats();
		var $Uploader = getFileLi(FileID);
		var RegUpload = new RegExp("^SWFUpload_");
		
		if ($Uploader.find(":hidden[name=FileID]").val()) { //已上传的
			if (confirm("确认删除已上传的文件 " + $Uploader.find('h4').html() + "吗?"))
			{ deleteFile(FileID); }
		}
		else if (RegUpload.test($Uploader.attr('name'))) { //列表中的
			FileObj = swfu.getFile(FileID);
			if (Stats['in_progress'] == 1 && FileObj['filestatus'] == SWFUpload.FILE_STATUS.IN_PROGRESS) { //上传中
				if (confirm('文件 ' + $Uploader.find('h4').html() + '正在上传中，确认删除吗？')) {
					FileObj = swfu.getFile(FileID);
					if (FileObj['filestatus'] == SWFUpload.FILE_STATUS.IN_PROGRESS)
					{ swfu.cancelUpload(FileID); $Uploader.remove(); }
					else { deleteFile(FileID); }
				}
			}
			else { $Uploader.remove(); }
		}
		else { $Uploader.remove(); }
	}

	function deleteFile(FileID) {
		var $Uploader = getFileLi(FileID);
		var RealFileID = $Uploader.find(":hidden[name=FileID]").val();
		RealFileID = RealFileID ? RealFileID : FileID;
		JsonID = '[' + RealFileID + ']';
		$.ajax({
			url: DeleteUrl,
			type: 'post',
			data: { fileid: JsonID },
			dataType: 'json',
			beforeSend: function () { $Uploader.find(SelectorBtnDelete).hide(); setFileMessage(FileID, '删除中...'); },
			success: function (data) {
				if (data.isSuccess) { $Uploader.remove(); }
				else { setFileMessage(FileID, '<b>删除失败，请重试<b>'); $Uploader.find(SelectorBtnDelete).show(); }
				checkFileListIsEmpty();
			},
			error: function () { setFileMessage(FileID, '<b>删除失败，请重试<b>'); $Uploader.find(SelectorBtnDelete).show(); }
		});
	}

	function getFileLi(FileID) { return $('ul#filelist li[name=' + FileID + ']:first'); }
	function setFileMessage(FileID, Html) { getFileLi(FileID).find('h5').html(Html); }
	//Upload End

	//File List Start
	function InitTempFileList() {
		for (var i = 0; i < TempFile.length; i++) {
			var $template = $('ul#tempfilelist_template li:first').clone();
			$template.attr('name', TempFile[i].FileID);
			$template.find('h5').html(TempFile[i].FileName + '<i>' + formatFileSize(TempFile[i].FileSize) + '</i>');
			$template.find('em').text(TempFile[i].CreateDate);
			$template.find(':hidden[name=filesize]').val(TempFile[i].FileSize);
			$template.find(SelectorBtnDelete).click(removeTempFile);
			$template.find(".tipa").tipTip({maxWidth: "auto", delay: 100}); //!
			$('ul#tempfilelist').append($template);
		}
		resetTempListCount();

		$(".fahistory").click(function (e) { $(".blackmask").fadeTo(200, 0.6); $(".frm-tempfile").show(); });
		$("a[id^='bfrm']").click(function (e) { closeFrm(); });
		$('#addtempfiletolist').click(function () { addTempFileToList(); });
		$('#selectallfile').click(function () { $('ul#tempfilelist').find(':checkbox').attr('checked', 'checked'); });
	}

	function removeTempFile() {
		var $thisLi = $(this).parent();
		var FileID = $thisLi.attr('name');
		var JsonID = '[' + FileID + ']';
		var FileSize = $thisLi.find(':hidden[name=filesize]').val();
		var FileLimit = 1024 * 1024 * 10;
		var doAction = true;
		if (parseInt(FileSize) >= FileLimit && !confirm('该文件较大，再次上传可能会花一定时间\n确认删除该文件?'))
		{ doAction = false; }
		if (doAction) {
			$.ajax({
				url: DeleteUrl,
				type: 'post',
				data: { fileid: JsonID },
				dataType: 'json',
				beforeSend: function () { $thisLi.find(SelectorBtnDelete).hide(); },
				success: function (data) {
					if (data.isSuccess) { DelayDisplayInfo('删除成功', 1000); $thisLi.remove(); resetTempListCount(); }
					else { DelayDisplayInfo('删除失败', 1000); $thisLi.find(SelectorBtnDelete).show(); }
				},
				error: function () { DelayDisplayInfo('删除失败', 1000); $thisLi.find(SelectorBtnDelete).show(); }
			});
		}
	}

	function addTempFileToList() {
		if ($('#tempfilelist :checked').length > 0) {
			$('#tempfilelist :checked').each(function () {
				var $thisLi = $(this).parent();
				var FileObj = new Object();
				var FileName = $thisLi.find('h5').clone();
				FileName.find('i').remove();
				FileObj.id = $thisLi.attr('name');
				FileObj.name = FileName.text();
				FileObj.createdate = $thisLi.attr('span');
				addFiletoList(FileObj);
				$thisLi.remove();
			});
			resetTempListCount();
			closeFrm();
		}
		else { alert('请选择要添加的文件'); }
		checkFileListIsEmpty();
	}

	function addProductFileToList() {
		if (isInt(ProductID) && ProductID > 0) {
			for (var i = 0; i < ProductFile.length; i++) {
				var FileObj = new Object();
				FileObj.id = ProductFile[i].FileID;
				FileObj.name = ProductFile[i].FileName;
				FileObj.createdate = ProductFile[i].CreateDate;
				addFiletoList(FileObj);
				$ListItem = getFileLi(ProductFile[i].FileID);
				$ListItem.find(SelectorCT).val(ProductFile[i].CT);
				$ListItem.find(SelectorCTV).val(ProductFile[i].CTV);
				$ListItem.find(SelectorCT).change();
				$ListItem.find(SelectorSCT).val(ProductFile[i].SCT);
				$ListItem.find(SelectorSCTV).val(ProductFile[i].SCTV);
				// BUG MARK
				/*
				$ListItem = getFileLi(ProductFile[i].FileID);
				$ListItem.find(SelectorCT).val(ProductFile[i].CT);
				$ListItem.find(SelectorCTV).val(ProductFile[i].CTV);
				$ListItem.find(SelectorCT).change();
				$ListItem.find(SelectorSCT).val(ProductFile[i].SCT);
				$ListItem.find(SelectorSCTV).val(ProductFile[i].SCTV);
				*/
			}
		}
	}

	function addFiletoList(file) {
		var $template = $('ul#filelist_template li:first').clone();
		$template.attr('name', file.id);
		$template.find('h4').text(file.name);
		$template.find('h5').text(file.createdate);
		$template.find('div.ct,div.sct').show();
		$template.find('div.progress').hide();
		var $FileID = $('<input></input>');
		$FileID.attr('type', 'hidden').attr('name', 'FileID').val(file.id);
		$template.find('div.hidden').append($FileID);
		$template.find(".tipa").tipTip({maxWidth: "auto", delay: 100});
		$template.find(SelectorCT).change(function () { setSubCreateTool(file.id, $(this).val()); });
		$template.find(SelectorBtnDelete).click(function () { removeFile(file.id); });
		if(file.id == MainFile) { $template.find(':radio[name=mainfile]').attr('checked','checked'); }
		$('ul#filelist').append($template);
		setCreateTool(file.id, 1);
	}

	function resetTempListCount() {
		var Count = $('ul#tempfilelist li').length;
		if (Count > 0) { $('button.fahistory').text('恢复临时文件 (' + Count + ')'); }
		else { $("div.tempfiles").hide(); }
	}
	//File List End

	//Button Start
	$('#nextstep').click(function () {
		var Stats = swfu.getStats();
		if (Stats['in_progress'] == 1) { alert('请等待文件上传完成'); return false; }
		var $FileList = $('ul#filelist li');
		var NoCT = 0;
		var NoCTV = 0;
		var FileData = '';
		if ($FileList.length > 0) {
			var reg = /^[0-9a-zA-Z]{0,5}$/;
			$FileList.each(function () {
				$Uploader = $(this);
				if($Uploader.attr('id') == 'unselected') { return true; }
				
				$Uploader.removeClass('item-alert').find(SelectorCT).removeClass('item-alert');
				if ($Uploader.find(SelectorCT).val() == 0)
				{ $Uploader.addClass('item-alert').find(SelectorCT).addClass('item-alert'); NoCT++; }
				if(!reg.test($Uploader.find(SelectorCTV).val()))
				{ $Uploader.addClass('item-alert').find(SelectorCTV).addClass('item-alert'); NoCTV++; }
				if(!reg.test($Uploader.find(SelectorSCTV).val()))
				{ $Uploader.addClass('item-alert').find(SelectorSCTV).addClass('item-alert'); NoCTV++; }
				var FileID = $Uploader.find(":hidden[name=FileID]").val();
				var CT = $Uploader.find(SelectorCT).val();
				var CTV = $Uploader.find(SelectorCTV).val();
				var SCT = $Uploader.find(SelectorSCT).val();
				var SCTV = $Uploader.find(SelectorSCTV).val();
				var MainFile = $Uploader.find(':radio:checked[name=mainfile]').length>0 ? 'true' : 'false';
				CT = CT != null ? CT : 0; SCT = SCT != null ? SCT : 0;
				FileData += '{"FileID":"' + FileID + '","CT":"' + CT + '","CTV":"' + CTV + '","SCT":"' + SCT + '","SCTV":"' + SCTV + '","MainFile":"' + MainFile + '"},';
			});
			FileData = '[' + FileData.substr(0, FileData.length - 1) + ']';
			if (NoCT > 0) { alert('创作工具是必填项'); return false; }
			//if (NoCTV > 0) { alert('版本号必须是不多于5位的字母和数字组合'); return false; }
			$.ajax({
				url: SubmitUrl,
				type: 'post',
				data: { PID: ProductID, FileData: FileData },
				dataType: 'json',
				beforeSend: function () { DisplayMask(); DisplayInfo("提交中"); },
				success: function (data) {
					if (data.isSuccess) { location.href = EditUrl + '/' + data.PID; }
					else { HideMask(); DelayDisplayInfo(data.Message, 2000); }
				},
				error: function () { HideMask(); DelayDisplayInfo('提交失败，请稍后再试', 2000); }
			});
		}
		else { alert('请选择要上传的文件'); }
		return false;
	});

	$('#cancelupload').click(function () {
		var $FileList = $('ul#filelist li');
		if ($FileList.length > 0) {
			if (confirm("确认放弃当前操作?")) { location.href = ""; }//!
		}
	});
	//Button End

	//Common Start
	var InfoDivTimeOut = null;
	function DelayDisplayInfo(Info, Delay)
	{ clearTimeout(InfoDivTimeOut); DisplayInfo(Info); InfoDivTimeOut = setTimeout(function () { hideInfo(); }, Delay); }

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
	function checkFileListIsEmpty()
	{
		if($('ul#filelist li').length != 1) { $('#unselected').hide(); }
		else{ $('#unselected').show(); }
	}
	//Common End
	checkFileListIsEmpty();
});