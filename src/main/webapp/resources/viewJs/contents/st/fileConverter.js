/**
 * 파일변환
 */
$(document).ready(function() {
	gf_editorEditable('editor', false);
	
	f_setBoardFileGrid();
	
});

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
	
	gf_ajax({
	  			QUERY_ID : 'st.S_BBS_VIDEO_LIST',
	  			p_loginId : $('#searchParam1').val()
			}, function(){
				gf_gridClear(boardFileGrid);
			}
			, function(data){
				
				gf_gridCallback('boardFileGrid', data);
				
			});
}
