/**
 * 게시글 보기
 */
let boardInfo = {
	moduleCode : menuParam.MODULE_CODE,
	bbsBoardId : menuParam.BBS_BOARD_ID	
}

$(document).ready(function() {
	
    f_search();
});

var f_search = function(){
	
	var frameId = parent.$('li[aria-selected="true"]').attr('aria-labelledby');
	//내용 조회
	var fData = new FormData();
	fData.set('QUERY_ID', 'bbs.S_BBS_BOARD_ONE');
	fData.set('MODULE_CODE', boardInfo.moduleCode);
	fData.set('BBS_BOARD_ID', boardInfo.bbsBoardId);
	gf_ajax( fData
			, 
			function(){
				gf_delFormData(fData);
				return true;
			}
			, function(data){
				if(data.result.length > 0){
					gf_editorEditable('editor', false);
					var result = data.result[0];
					
					$('#CATEGORY_NAME').val(result.CATEGORY_NAME);
					$('#CATEGORY_CODE').val(result.CATEGORY_CODE);
					$('#TITLE').val(result.TITLE);
					
					if(gf_nvl(result.OPEN_YN, '0') == '1'){
						$('#OPEN_Y').prop('checked', true);	
					}
					else{
						$('#OPEN_N').prop('checked', true);
					}
					
					gf_setEditorValue('editor', result.BOARD_CONTENTS);
				}
				else{
					parent.gf_toast(gf_mlg('존재하지_않는_게시글_입니다'));
					var frameId = parent.$('li[aria-selected="true"]').attr('aria-controls');
					parent.selectedTabId = frameId;
					parent.f_tabClose();
				}
			});

	//첨부파일 조회
	gf_ajax({
		QUERY_ID : 'com.S_COMM_FILE',
		MODULE_CODE : 'BD',
		GROUP_ID : boardInfo.bbsBoardId,
	}, null
	 , function(data){
		
		$('#attachedFileTable tbody tr').remove();
		
		if(data.result.length > 0){
			$.each(data.result, function(idx, item){
				var tr = $('<tr>');
				var downTag = $('<a>').attr('href', '/fileDownload?COMM_FILE_ID=' + item.COMM_FILE_ID + '&RANDOM_KEY=' + item.RANDOM_KEY).text(item.FILE_NAME);
	            var fileNm = $('<td class="pd-bt-default pd-rt-default">').append(downTag);
	            var fileSize = $('<td class="pd-rt-default">').text('(' + gf_getFileSize(item.FILE_SIZE) + ')');
	            
	            var fileInfo = {
	            	COMM_FILE_ID : item.COMM_FILE_ID,
	            	RANDOM_KEY : item.RANDOM_KEY
	            }
	            tr.append(fileNm).append(fileSize);
	            
	            $('#attachedFileTable tbody').append(tr);
			});
		}
	});
	
}

var f_modify = function(){
	
	var frameId = parent.$('li[aria-selected="true"]').attr('aria-controls');
	var title = parent.$('li[aria-selected="true"]').attr('title');
	
	var v_param = {
		menuNm : gf_mlg('게시글_작성', {
			param : title.substr(title.indexOf('('))
		}),
		menuCode : 'HIDDEN001',
		menuParam : {
			MODULE_CODE : boardInfo.moduleCode,
			BBS_BOARD_ID : boardInfo.bbsBoardId
		}
	};	
	parent.f_addPageExec(v_param);
	parent.selectedTabId = frameId;
	parent.f_tabClose();
}
