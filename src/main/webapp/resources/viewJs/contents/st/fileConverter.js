/**
 * 파일변환
 */
$(document).ready(function() {
	gf_editorEditable('editor', false);
	
	f_setBoardFileGrid();
	
	f_setVideoGrid();
	f_setVideoFileGrid();
});

var f_setVideoGrid = function(){
	videoGrid = gf_gridInit('videoGrid', {
    	'defaultInsert' : {'OPEN_YN' : '1'}
    });    

	videoGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(videoFileGrid).length > 0
		){
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;
				videoGrid.setSelectedRows(args.previousSelectedRows);
				return false;
			}
		}
		else if(videoGrid.getSelectedRows().length != 1){
			return false;
		}
		
		gf_ajax({
			QUERY_ID : 'st.S_MAPPING_FILE',
			ST_VIDEO_ID : gf_gridRowData(videoGrid, videoGrid.getSelectedRows(), 'ST_VIDEO_ID')
		}, function(){
			gf_gridClear(videoFileGrid);
		}
		, function(data){
			gf_gridCallback('videoFileGrid', data);
		});
		
    });

}
var f_setVideoFileGrid = function(){
	videoFileGrid = gf_gridInit('videoFileGrid');    

}
var f_setBoardFileGrid = function(){
	boardFileGrid = gf_gridInit('boardFileGrid');    

	boardFileGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		var row = args.rows[0];
		var grid = args.grid;
		var preRow = args.previousSelectedRows[0];
		var selectedRowData = grid.getData().getItem(row);
					
		//내용 조회
		var fData = new FormData();
		fData.set('QUERY_ID', 'bbs.S_BBS_BOARD_ONE');
		fData.set('MODULE_CODE', 'ST');
		fData.set('BBS_BOARD_ID', selectedRowData.BBS_BOARD_ID);
		gf_ajax( fData
				, 
				function(){
					gf_delFormData(fData);
					return true;
				}
				, function(data){
					if(data.result.length > 0){
						
						var result = data.result[0];
						
						gf_setEditorValue('editor', result.BOARD_CONTENTS);
					}
					else{
						
						gf_setEditorValue('editor', gf_mlg('존재하지_않는_게시글_입니다'));
						
					}
				});
		
		//자막내용 조회		
		gf_ajax({
			RANDOM_KEY : selectedRowData.RANDOM_KEY,
			COMM_FILE_ID : selectedRowData.COMM_FILE_ID
				}
				, function(){
					
					$('#subtitleContent').val('');
//					if(gf_nvl(selectedRowData.FILE_TYPE, '') != 'SUB'){
						return false;	
//					}
					
				}
				, function(data){
					if(typeof data.result === 'object'){
						$('#subtitleContent').val(data.result.result);
					}
				}
				, null
				, null
				, '/st/subTitleContent');
    });
}

var f_search = function(){
	
	if(gf_gridSaveData(boardFileGrid).length > 0
	|| gf_gridSaveData(videoGrid).length > 0
	|| gf_gridSaveData(videoFileGrid).length > 0
	){
	
		if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
			return false;
		}
	}
	
	gf_gridClear(videoFileGrid);
	f_boardSearch();
	f_videoSearch();
}
var f_boardSearch = function(){
	gf_ajax({
			QUERY_ID : 'st.S_BBS_VIDEO_LIST',
			TITLE : $('#TITLE').val()
	}, function(){
		
		gf_gridClear(boardFileGrid);		
	}
	, function(data){
		
		gf_gridCallback('boardFileGrid', data);
		
	});
}
var f_videoSearch = function(){
	
	gf_ajax({
		QUERY_ID : 'st.S_ST_VIDEO'
	}, function(){
		
		gf_gridClear(videoGrid);
	}
	, function(data){
		
		gf_gridCallback('videoGrid', data);
		
	});
}

var f_converter = function(){
	
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
				
				if(gf_gridSaveData(boardFileGrid).length > 0
				|| gf_gridSaveData(videoGrid).length > 0
				|| gf_gridSaveData(videoFileGrid).length > 0
				){
					gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
					return false;
				}
		
				// boardFileGrid validation
				var convertFiles = gf_gridSaveData(boardFileGrid).filter( x=> x.CHK=='1' );
				var videoCnt = convertFiles.filter(x=>x.FILE_TYPE=='VIDEO').length;
								
				if(convertFiles .length == 0){
					gf_toast(gf_mlg('변환할_파일을_체크하세요'), 'info');
					return false;
				}
				else if(videoCnt > 1){
					gf_toast(gf_mlg('한_영상에_하나의_영상만_변환_가능합니다'), 'info');
					return false;
				}

				// videoGrid validation
				var target = videoGrid.getSelectedRows();
				
				if(target.length == 0){
					gf_toast(gf_mlg('변환하여_저장할_대상_영상을_선택하세요'), 'info');
					return false;
				}
				else if(target.length != 1){
					gf_toast(gf_mlg('변환하여_저장할_대상_영상을_하나만_선택하세요'), 'info');
					return false;
				}
				
				
				fData.append('CONVERT_FILES', JSON.stringify(convertFiles));
				fData.append('GROUP_ID', gf_gridRowData(videoGrid, videoGrid.getSelectedRows(), 'ST_VIDEO_ID'));
				
			}
			, function(data){
				
				gf_toast(gf_mlg('변환_되었습니다'), 'success');
				gf_gridClear(boardFileGrid);
				gf_gridClear(videoFileGrid);
				f_boardSearch();
				videoGrid.onSelectedRowsChanged.notify();
			}
			, null
			, null
			, '/st/convert');
	
	
}

var f_save = function(){
	
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
		
				var boardFileData = gf_gridSaveData(boardFileGrid);
				var videoData = gf_gridSaveData(videoGrid);
				var videoFileData = gf_gridSaveData(videoFileGrid);
				
				if(boardFileData.length == 0
				&& videoData.length == 0
				&& videoFileData.length == 0
				){
				
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');
					return false;
				}
				else{
					
					//게시판 첨부파일
					if(boardFileData.length > 0){
						boardFileData.unshift({
  							 'TABLE_NAME' : 'COMM_FILE'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('boardFileGrid', JSON.stringify(boardFileData));
					}
					
					//영상그리드
					if(videoData.length > 0){
						videoData.unshift({
  							 'TABLE_NAME' : 'ST_VIDEO'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('videoGrid', JSON.stringify(videoData));
					}
					
					//영상파일
					if(videoFileData.length > 0){
						
						var updateFileData = videoFileData.filter(x=> x.gState=='updated');
						if(updateFileData.length > 0){
							updateFileData.unshift({
	  							 'TABLE_NAME' : 'COMM_FILE'
	  							,'QUERY_ID' : 'st.MAPPING_FILE'
	  						});
							fData.set('videoFileGrid', JSON.stringify(updateFileData));	
						}
						
						var deleteFileData = videoFileData.filter(x=> x.gState=='deleted');
						if(deleteFileData.length > 0){
							fData.append('STFileDel', JSON.stringify(deleteFileData));	
						}
						
					}
					
				}
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(boardFileGrid);
				gf_gridClear(videoGrid);
				gf_gridClear(videoFileGrid);
				f_videoSearch();
				
			}
			, null
			, null
			, '/save');
}

var f_converter = function(){
	
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
		
				if(gf_gridSaveData(boardFileGrid).length > 0
				|| gf_gridSaveData(videoGrid).length > 0
				|| gf_gridSaveData(videoFileGrid).length > 0
				){
					gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
					return false;
				}
		
			}
			, function(data){
				gf_toast(gf_mlg('요청하였습니다'), 'success');
			}
			, function(data){
				gf_toast(gf_mlg('요청하였습니다'), 'success');
			}
			, null
			, null
			, '/st/scheduleConvert'
			, true
			, 'post'
			, true
			, 1);
}