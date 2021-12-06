/**
 * 게시글쓰기
 */
let boardInfo = {
	moduleCode : menuParam.MODULE_CODE,
	bbsBoardId : String(gf_nvl(menuParam.BBS_BOARD_ID, '')),
	attachedFiles : [],
	attachedDelFiles : [],
}

$(document).ready(function() {
	
	//카테고리콤보
	f_setCategory();
	
	//첨부파일세팅
	f_setFile();
    
    f_search();
});

//카테고리콤보 셋팅
var f_setCategory = function(){
	
	var bbsCategory = [];
	gf_ajax({
			QUERY_ID : 'combo.S_BBS_CATEGORY',
			MODULE_CODE : boardInfo.moduleCode
	}, null
	 , function(data){
		if(data.result.length > 0){
			$.each(data.result, function(idx, item){
				bbsCategory.push({
					category : gf_nvl(item.UP_CATEGORY_NAME, ''),
					label : item.CATEGORY_NAME,
					value : item.CATEGORY_NAME,
					code : item.CATEGORY_CODE,
				});
			});
			
			gf_autoComplete('CATEGORY_NAME', bbsCategory, function(event, ui){
				$('#CATEGORY_CODE').val(ui.item.code);
				$('#CATEGORY_NAME').val(ui.item.label);
			});
		}
	});
	
}

var f_setFile = function(){
	//첨부파일
	$('#attachedFileBtn').on('click', function(){
		$('#attachedFile').click();
	});
	$("#attachedFile").change(function () {
        fileAttachment();
    })
    //드래그 앤 드랍
    $("#attachedFileArea").on("dragenter", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
    }).on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        $(this).css({"background-color": "#FFD8D8"});

    }).on("dragleave", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        $(this).css({"background-color": ""});

    }).on("drop", function (e) {
    	
        e.preventDefault();
        e.stopPropagation();
        
        $(this).css({"background-color": ""});

        e.dataTransfer = e.originalEvent.dataTransfer;
        var files = e.target.files || e.dataTransfer.files;
        fileAttachment(files);

    });
}

var fileAttachment = function (dragDrop) {

    var file_names = dragDrop ? dragDrop : $("#attachedFile").prop("files");

    for (var i = 0; i < file_names.length; i++) {

        (function (file) {

            setTimeout(function () {

                //파일확장자
                var fileExt = file.name.substring(file.name.lastIndexOf('.'), file.name.length).toLowerCase();
                
                //폴더 또는 용량이 없는 파일
                if(file.size == 0
        		|| file.name.lastIndexOf('.') == -1
        		){
                  gf_toast(gf_mlg('폴더_또는_용량이_없는_파일은_업로드_할_수_없습니다'));
                    return false;   
                }
                //최대용량 초과
                else if( Number(file.size) >  Number(gv_fileMaxSize)){
                	gf_toast(gf_mlg('업로드_최대용량을_초과하였습니다',{
                		param : gf_getFileSize(gv_fileMaxSize)
                	}));
                    return false;
                }
                //업로드 불가 파일확장자
//                else if(fileExt == '.exe'){
//                    return false;
//                }
                else{
                	var fileId = new Date().getTime();
                	var fSize = gf_getFileSize(file.size);    

                    file.id = fileId;

                    var tr = $('<tr>');
                    var fileNm = $('<td class="pd-bt-default pd-rt-default">').text(file.name);
                    var fileSize = $('<td class="pd-rt-default">').text('(' + fSize + ')');
                    var fileDel = $('<td>').html( $('<i class="fi fi-rr-Cross-small" style="cursor:pointer;" onclick="fileDelete(this,' + file.id + ', \'SCRIPT\');" ></i>') );
                    tr.append(fileNm).append(fileSize).append(fileDel);
                    
                    $('#attachedFileTable tbody').append(tr);

                    boardInfo.attachedFiles.push(file);
                }

            }, 1);

        }(file_names[i]));

    }

}
//파일삭제 type: DB / SCRIPT 
var fileDelete = function (me, id, type) {

    $(me).closest('tr').remove();
    
    if(type == 'DB'){
    	var deleteFileData = JSON.parse(decodeURIComponent(id));
    	boardInfo.attachedDelFiles.push(deleteFileData);
    }
    else{
    	boardInfo.attachedFiles = boardInfo.attachedFiles.filter((x, idx, array) => {
            return x.id != id
        });
    }
    

}

var f_search = function(){
	
	//내용 조회
	var fData = new FormData();
	fData.set('QUERY_ID', 'bbs.S_BBS_BOARD_ONE');
	fData.set('MODULE_CODE', boardInfo.moduleCode);
	fData.set('BBS_BOARD_ID', boardInfo.bbsBoardId);
	gf_ajax( fData
			, function(){
		
				if(gf_nvl(boardInfo.moduleCode, '') == ''
				|| gf_nvl(boardInfo.bbsBoardId, '') == ''
				){
					return false;
				}
		
				return true;
			}
			, function(data){
				if(data.result.length > 0){
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
					parent.$('li[aria-selected="true"]').find('.tabCloseBtn').click();
				}
			});

	//첨부파일 조회
	gf_ajax({
		QUERY_ID : 'com.S_COMM_FILE',
		MODULE_CODE : boardInfo.moduleCode,
		GROUP_ID : boardInfo.bbsBoardId,
	}, null
	 , function(data){
		
		boardInfo.attachedFiles = [];
		boardInfo.attachedDelFiles = [];		
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
	            
	            var fileDel = $('<td>').html( $('<i class="fi fi-rr-Cross-small" style="cursor:pointer;" onclick="fileDelete(this,\'' + encodeURIComponent(JSON.stringify(fileInfo)) + '\', \'DB\');" ></i>') );
	            tr.append(fileNm).append(fileSize).append(fileDel);
	            
	            $('#attachedFileTable tbody').append(tr);
			});
		}
	});
	
}
  	
var f_save = function(){
		
	var fData = new FormData();
	
	//게시글내용
	var boardDara = {
		QUERY_ID : 'bbs.I_BBS_BOARD',
		MODULE_CODE : boardInfo.moduleCode,
		BBS_BOARD_ID : boardInfo.bbsBoardId,
		CATEGORY_CODE : $('#CATEGORY_CODE').val(),
		OPEN_YN : $('[name=OPEN_YN]:checked').val(),
		TITLE : $('#TITLE').val(),
		BOARD_CONTENTS : gf_getEditorValue('editor')
	};
	fData.append('boardForm', JSON.stringify(boardDara));

	//첨부파일
	$.each(boardInfo.attachedFiles, function(idx, item){
		if(idx == 0){
			var fileData = {
					MODULE_CODE : 'BD',
					GET_PARAM : {
									GROUP_ID : 'boardForm.BBS_BOARD_ID'
								}
			};
			fData.append('attachedFile', JSON.stringify(fileData));
		}
		fData.append('attachedFile', item);
	});
	
	//첨부파일삭제
	if(boardInfo.attachedDelFiles.length > 0){
		fData.append('attachedFileDel', JSON.stringify(boardInfo.attachedDelFiles));	
	}
	
	
	gf_ajax( fData
			, function(){
				var chkResult = gf_chkRequire(['boardForm']);
		
				for (var i = 0; i < chkResult.tags.length; i++) {
					gf_toast(gf_mlg('을(를)_입력하세요', {
						param : chkResult.tags[i].siblings('label').text()
					}), 'info');
				}
				
				return chkResult.result;
			}
			, function(data){
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				boardInfo.bbsBoardId = String(data.result.boardForm.result.BBS_BOARD_ID);
				f_search();
			}
			, null
			, null
			, '/save');
}

var f_delete = function(){
	if(confirm(gf_mlg('삭제_하시겠습니까'))){
		parent.gf_toast(gf_mlg('삭제_되었습니다'), 'success');
		parent.$('li[aria-selected="true"]').find('.tabCloseBtn').click();	
	}
	
}