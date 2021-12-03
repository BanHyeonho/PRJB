/**
 * 게시글쓰기
 */
let boardInfo = {
	attachedFiles : [],
	moduleCode : 'ST',
	bbsBoardId : '',
	bbsBoardNo : ''
}

$(document).ready(function() {
	var test = [{
		category :'',
		label : '영화',
		code : 'MOVIE',
	},{
		category :'',
		label : '애니',
		code : 'ANI',
	},{
		category :'',
		label : '드라마',
		code : 'DRAMA',
	}];
	gf_autoComplete('CATEGORY_NAME', test, function(event, ui){
//		$('#' + ui.item.menuCode).trigger('click');
	});
	
	//첨부파일세팅
	f_setFile();
    
    f_search();
});

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
                    var fileDel = $('<td>').html( $('<i class="fi fi-rr-Cross-small" style="cursor:pointer;" onclick="fileDelete(this,' + file.id + ');" ></i>') );
                    tr.append(fileNm).append(fileSize).append(fileDel);
                    
                    $('#attachedFileTable tbody').append(tr);

                    boardInfo.attachedFiles.push(file);
                }

            }, 1);

        }(file_names[i]));

    }

}
//파일삭제
var fileDelete = function (me, id) {

    $(me).closest('tr').remove();
    boardInfo.attachedFiles = boardInfo.attachedFiles.filter((x, idx, array) => {
        return x.id != id
    });

}

var f_search = function(){
	
	//내용 조회
	var fData = new FormData();
	fData.set('QUERY_ID', 'bbs.S_BBS_BOARD_ONE');
	fData.set('MODULE_CODE', boardInfo.moduleCode);
	fData.set('BBS_BOARD_ID', boardInfo.bbsBoardId);
	fData.set('BOARD_NO', boardInfo.bbsBoardNo);
	gf_ajax( fData
			, function(){
		
				if(gf_nvl(boardInfo.moduleCode, '') == ''
				|| gf_nvl(boardInfo.bbsBoardId, '') == ''
				|| gf_nvl(boardInfo.bbsBoardNo, '') == ''
				){
					return false;
				}
		
				return true;
			}
			, function(data){
				if(data.result.length > 0){
					var result = data.result[0];
					gf_setEditorValue('editor', result.BOARD_CONTENTS);
				}
				else{
					parent.gf_toast(gf_mlg('존재하지_않는_게시글_입니다'));
					parent.$('li[aria-selected="true"]').find('.tabCloseBtn').click();
				}
			});
	
	//첨부파일 조회
	
}
  	
var f_save = function(){
		
	var fData = new FormData();
	
	//게시글내용
	var boardDara = {
		QUERY_ID : 'bbs.I_BBS_BOARD',
		MODULE_CODE : 'ST',//boardInfo.moduleCode,
		BBS_BOARD_ID : boardInfo.bbsBoardId,
		CATEGORY_CODE : $('#CATEGORY_CODE').val(),
		TITLE : $('#TITLE').val(),
		BOARD_CONTENTS : gf_getEditorValue('editor')
	};
	fData.set('boardForm', JSON.stringify(boardDara));

		//첨부파일
	$.each(boardInfo.attachedFiles, function(idx, item){
		if(idx == 0){
			var fileData = {
					MODULE_CODE : boardInfo.moduleCode,
					GET_PARAM : {
									GROUP_ID : 'boardForm.BBS_BOARD_ID'
								}
			};
			fData.append('attachedFile', JSON.stringify(fileData));
		}
		fData.append('attachedFile', item);	
	});
	
	gf_ajax( fData
			, function(){
//				return false;
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
	parent.gf_toast(gf_mlg('삭제_되었습니다'), 'success');
	parent.$('li[aria-selected="true"]').find('.tabCloseBtn').click();
}