/**
 * 메모장
 */
const pageInfo = {
		moduleCode : 'MY',
		menuUrl : 'myNote'
}

const gv_fileExtension = parent.index_info.gv_fileExtension;

let myNoteInfo = {
	attachedFiles : [],
	attachedDelFiles : [],
}

$(document).ready(function() {

	//그리드셋팅
	f_setMasterGrid();
	f_setDetailGrid();
    
	//첨부파일세팅
	f_setFile();
	$('#fileIcon').on('click', function(){
		if($('#MY_NOTE_DETAIL_ID').val() == ''){
			$('#attachedFileContainer').hide();
		}
		else{
			$('#attachedFileContainer').toggle();
		}
	});
});

/*****************************************************************************************************************************************************************
 * 
 * 첨부파일세팅
 * 
 *****************************************************************************************************************************************************************/
var f_setFile = function(){
	
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
                var fileExt = file.name.substring(file.name.lastIndexOf('.') +1, file.name.length).toUpperCase();
                
                var fileExtensions = gv_fileExtension.map(x=>x.CODE_VALUE);
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
                else if(fileExtensions.indexOf(fileExt.toUpperCase()) == -1){
                	gf_toast(gf_mlg('다음의_확장자만_업로드_가능합니다',{
                		param : fileExtensions.join()
                	}));
                    return false;
                }
                else{
                	var fileId = new Date().getTime() + '_' + Math.round(Math.random()*10000000000);
                	var fSize = gf_getFileSize(file.size);    

                	makeFileLink({
                    	file_name : file.name,
                    	file_size : fSize,
                    	file_id : fileId
                    }, 'SCRIPT');
                	
                    file.id = fileId;
                    myNoteInfo.attachedFiles.push(file);
                }

            }, 0);

        }(file_names[i]));

    }

}
//파일삭제 type: DB / SCRIPT 
var fileDelete = function (me, id, type) {

	//DB에 저장된데이터 1건식 삭제
    if(type == 'DB'){
    	$(me).closest('tr').remove();
    	var deleteFileData = JSON.parse(decodeURIComponent(id));
    	myNoteInfo.attachedDelFiles.push(deleteFileData);
    }
    //화면에 올리기만한 데이터 1건식 삭제
    else if(type == 'SCRIPT'){
    	$(me).closest('tr').remove();
    	myNoteInfo.attachedFiles = myNoteInfo.attachedFiles.filter((x, idx, array) => {
            return x.id != id
        });
    }    

}

var makeFileLink = function(p_param, p_type){
	
	var tr = $('<tr>');
	var fileNm = $('<td class="pd-lt-default pd-bt-default pd-rt-default">');
	var fileSize = $('<td class="pd-rt-default">').text('(' + p_param.file_size + ')');
	var fileDel;
	
	if(p_type == 'SCRIPT'){
		
        fileNm.text(p_param.file_name);
        
        var fileDel = $('<td>').html( $('<i class="fi fi-rr-Cross-small" style="cursor:pointer;" onclick="fileDelete(this,\'' + p_param.file_id + '\', \'' + p_type + '\');" ></i>') );
        
	}
	else if(p_type == 'DB'){
		
		var downTag = $('<a>').attr('href', '/fileDownload?MODULE_CODE=' + pageInfo.moduleCode 
														+ '&MENU_URL=' + pageInfo.menuUrl
														+ '&COMM_FILE_ID=' + p_param.COMM_FILE_ID 
														+ '&RANDOM_KEY=' + p_param.RANDOM_KEY).text(p_param.file_name);
        
        fileNm.append(downTag);
        
        var fileInfo = {
        	COMM_FILE_ID : p_param.COMM_FILE_ID,
        	RANDOM_KEY : p_param.RANDOM_KEY
        }
        
        var fileDel = $('<td>').html( $('<i class="fi fi-rr-Cross-small" style="cursor:pointer;" onclick="fileDelete(this,\'' + encodeURIComponent(JSON.stringify(fileInfo)) + '\', \'' + p_type + '\');" ></i>') );
	}
	tr.append(fileNm).append(fileSize).append(fileDel);
	$('#attachedFileTable tbody').append(tr);
}
/*****************************************************************************************************************************************************************
 * 
 * 그리드 셋팅
 * 
 *****************************************************************************************************************************************************************/
var f_setDetailGrid = function(){
	
	detailGrid = gf_gridInit('detailGrid', {
		forceFitColumns: true,
		'addRowBefore' : function(){
			var masterData = gf_gridSaveData(masterGrid);
			if(masterData.state == 'empty'){
				return true;
			}
			else{
				gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
				return false;
			}
			
		},
		'defaultInsert' : {'MY_NOTE_MASTER_ID' : function(){return gf_gridSelectVal(masterGrid, 'MY_NOTE_MASTER_ID')}}
    });
	
	
	
	detailGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if( gf_editorModified('editor') 
			 || (myNoteInfo.attachedFiles.length > 0 || myNoteInfo.attachedDelFiles.length > 0)	
			 ){
			
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;
				detailGrid.setSelectedRows(args.previousSelectedRows);
				return false;
			}
		}
		else if(args.rows.length == 0){
			return false;
		}
		
		var row = args.rows[0];
		var grid = args.grid;
		var preRow = args.previousSelectedRows[0];
		var selectedRowData = grid.getData().getItem(row);
		
		$('#MY_NOTE_DETAIL_ID').val(selectedRowData.MY_NOTE_DETAIL_ID);
		//메모장 내용 조회
		f_detailContentSearch();
    });
}
var f_setMasterGrid = function(){

	masterGrid = gf_gridInit('masterGrid', {
		forceFitColumns: true,
		'addRowBefore' : function(){
			var detailData = gf_gridSaveData(detailGrid);
			
			if(detailData.state == 'empty'){
				return true;
			}
			else{
				gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
				return false;
			}	
		}
    });
	masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
				
		var detailData = gf_gridSaveData(detailGrid);
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if( detailData.state != 'empty' 
			 || gf_editorModified('editor')
			 || (myNoteInfo.attachedFiles.length > 0 || myNoteInfo.attachedDelFiles.length > 0)
			 ){
		
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;	
				masterGrid.setSelectedRows(args.previousSelectedRows);
				return false;
			}
		}
		else if(args.rows.length == 0){
			return false;
		}
		
		//메모장 상세 조회
		f_detailSearch();
    });
}

//메모장 상세 조회
var f_detailSearch = function(){
	
	var MY_NOTE_MASTER_ID = gf_nvl( gf_gridSelectVal(masterGrid, 'MY_NOTE_MASTER_ID') , '');
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_MY_NOTE_DETAIL');
	fData.set('MY_NOTE_MASTER_ID', MY_NOTE_MASTER_ID );
	fData.set('searchParam1', $('#searchParam1').val());
	gf_ajax( fData
			, function(){
		
				gf_gridClear(detailGrid);
				$('#MY_NOTE_DETAIL_ID').val('');				
				f_noteClear();
				if( MY_NOTE_MASTER_ID == ''){
					return false;
				}
				gf_delFormData(fData);
			}
			, function(data){
				
				gf_gridCallback('detailGrid', data);
				
			});
}
var f_detailContentSearch = function(){
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_MY_NOTE_DETAIL_CONTENT');
	fData.set('MY_NOTE_DETAIL_ID', $('#MY_NOTE_DETAIL_ID').val());
	
	gf_ajax( fData
			, function(){
		
				if(gf_nvl($('#MY_NOTE_DETAIL_ID').val(), '') == ''){
					f_noteClear();
					return false;
				}
			}
			, function(data){
				
				if(data.result.length > 0){
					$('#MY_NOTE_DETAIL_ID').val(data.result[0].MY_NOTE_DETAIL_ID);
					gf_editorEditable('editor', true);
					$('#noteForm [name=TITLE]').prop('disabled', false);
					$('#noteForm [name=TITLE]').val(data.result[0].PAGE_TITLE);
					$('#noteForm [name=MDT]').text(data.result[0].MDT);
					gf_setEditorValue('editor', gf_nvl(data.result[0].NOTE_CONTENTS, ''));	
				}
			});

	//첨부파일 조회
	gf_ajax({
		QUERY_ID : 'com.S_COMM_FILE',
		MODULE_CODE : pageInfo.moduleCode,
		MENU_URL : pageInfo.menuUrl,
		GROUP_ID : $('#MY_NOTE_DETAIL_ID').val(),
	}, null
	 , function(data){
		
		f_fileClear();
		
		if(data.result.length > 0){
			$.each(data.result, function(idx, item){           
				
	            makeFileLink({
                	file_name : item.FILE_NAME,
                	file_size : gf_getFileSize(item.FILE_SIZE),
                	COMM_FILE_ID : item.COMM_FILE_ID,
                	RANDOM_KEY : item.RANDOM_KEY
                }, 'DB');
	            
			});
		}
	});
}

var f_noteClear = function(){
	$('#attachedFileContainer').hide();
	gf_editorEditable('editor', false);
	gf_editorUndoReset('editor');
	$('#MY_NOTE_DETAIL_ID').val('');
	$('#noteForm [name=MDT]').text('-');
	$('#noteForm [name=TITLE]').prop('disabled', true);
	$('#noteForm [name=TITLE]').val('');
	gf_setEditorValue('editor', '');
	f_fileClear();
}
//파일영역 클리어
var f_fileClear = function(){
	$('#attachedFileArea tbody tr').remove();
	
	myNoteInfo.attachedFiles = [];
	myNoteInfo.attachedDelFiles = [];
	
}
/*****************************************************************************************************************************************************************
 * 
 * 버튼 기능
 * 
 *****************************************************************************************************************************************************************/
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_MY_NOTE_MASTER');
	fData.set('searchParam1', $('#searchParam1').val());
	gf_ajax( fData
			, function(){
				
				var masterData = gf_gridSaveData(masterGrid);
				var detailData = gf_gridSaveData(detailGrid);
				
				if(masterData.state != 'empty'
				|| detailData.state != 'empty'
				|| gf_editorModified('editor')
				|| ( gf_nvl(gf_gridRowData(detailGrid, detailGrid.getSelectedRows()[0], 'PAGE_TITLE'), '') != $('#TITLE').val())
				|| (myNoteInfo.attachedFiles.length > 0 || myNoteInfo.attachedDelFiles.length > 0)
				){
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						gridEventIgnore = true;
						return false;
					}
				}
				
				gf_gridClear(masterGrid);
				gf_gridClear(detailGrid);
				$('#MY_NOTE_DETAIL_ID').val('');
				f_noteClear();				
				gf_delFormData(fData);
			}
			, function(data){
				
				gf_gridCallback('masterGrid', data);
				
			});
	
}

var f_save = function(){
	
	var masterData = gf_gridSaveData(masterGrid);
	$.each(masterData.data, function(idx, item){
		item['COMM_USER_ID'] = gv_commUserId;
	});
	
	var detailData = gf_gridSaveData(detailGrid);
	
	if(!(masterData.state == 'success')
	&& !(detailData.state == 'success')
	&& ( gf_nvl(gf_gridRowData(detailGrid, detailGrid.getSelectedRows()[0], 'PAGE_TITLE'), '') == $('#TITLE').val())
	&& !gf_editorModified('editor')
	&& (myNoteInfo.attachedFiles.length == 0 && myNoteInfo.attachedDelFiles.length == 0)
	){
		
		if( masterData.state == 'fail'){
			gf_toast(masterData.reason, 'info');
		}
		else if(detailData.state == 'fail'){
			gf_toast(detailData.reason, 'info');
		}
		else{
			gf_toast(masterData.reason, 'info');
		}
		
		return false;
	}
	
	var fData = new FormData();

	gf_ajax( fData
			, function(){
									
					//마스터그리드
					if(masterData.data.length > 0){
						masterData.data.unshift({
							'TABLE_NAME' : 'MY_NOTE_MASTER'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('masterGrid', JSON.stringify(masterData.data));
					}
					
					//상세그리드
					if(detailData.data.length > 0){
						detailData.data.unshift({
							'TABLE_NAME' : 'MY_NOTE_DETAIL'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('detailGrid', JSON.stringify(detailData.data));
					}
				
					//상세 내용
					if($('#MY_NOTE_DETAIL_ID').val() != ''){
						
						//게시글내용
						var noteDara = {
							QUERY_ID : 'com.U_COMM_QUERY',
							TABLE_NAME : 'MY_NOTE_DETAIL',
							MY_NOTE_DETAIL_ID : $('#MY_NOTE_DETAIL_ID').val(),
							PAGE_TITLE : $('#TITLE').val(),
							NOTE_CONTENTS : gf_getEditorValue('editor')
						};
						fData.append('noteForm', JSON.stringify(noteDara));

						//첨부파일
						$.each(myNoteInfo.attachedFiles, function(idx, item){
							if(idx == 0){
								var fileData = {
										MODULE_CODE : pageInfo.moduleCode,
										MENU_URL : pageInfo.menuUrl,
										GROUP_ID : $('#MY_NOTE_DETAIL_ID').val()
								};
								fData.append('attachedFile', JSON.stringify(fileData));
							}
							fData.append('attachedFile', item);
						});
						
						//첨부파일삭제
						if(myNoteInfo.attachedDelFiles.length > 0){
							fData.append('attachedFileDel', JSON.stringify(myNoteInfo.attachedDelFiles));	
						}
						
					}
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				f_noteClear();
				gf_gridClear(masterGrid);
				gf_gridClear(detailGrid);
				f_search();
			}
			, null
			, null
			, '/save');
}