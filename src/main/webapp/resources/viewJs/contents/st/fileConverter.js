/**
 * 파일변환
 */
$(document).ready(function() {
	gf_editorEditable('editor', false);
	gf_editorEditable('editor2', false);
	
	f_setBoardFileGrid();
	
	f_setVideoGrid();
	f_setVideoFileGrid();
});

var f_setVideoGrid = function(){
	videoGrid = gf_gridInit('videoGrid', {
    	'defaultInsert' : {'OPEN_YN' : '1'}
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
    });
}

var f_search = function(){
	
	if((gf_gridSaveData(videoGrid).length > 0)
	){
	
		if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
			return false;
		}
	}
	
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

var f_save = function(){
	
	var videoData = gf_gridSaveData(videoGrid);
	
	
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
				
				if(videoData.length == 0){
				
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');
					return false;
				}
				else{
					
					//영상그리드
					if(videoData.length > 0){
						videoData.unshift({
  							 'TABLE_NAME' : 'ST_VIDEO'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('videoGrid', JSON.stringify(videoData));
					}
				}
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(videoGrid);
				f_videoSearch();
				
			}
			, null
			, null
			, '/save');
}