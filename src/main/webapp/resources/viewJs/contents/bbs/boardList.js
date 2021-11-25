/**
 * 게시판
 */
var moduleCode;
$(document).ready(function() {
	
	f_setCategoryGrid();
	f_setBoardGrid();
    

    moduleCode = 'ST';
});

var f_setCategoryGrid = function(){
	categoryGrid = gf_gridInit('categoryGrid');
	
	categoryGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		var row = args.rows[0];
		var grid = args.grid;
		var preRow = args.previousSelectedRows[0];
		var selectedRowData = grid.getData().getItem(row);
					
		//게시글조회
		f_boardSearch(selectedRowData.CATEGORY_CODE);
    });
	
}
var f_setBoardGrid = function(){
	boardGrid = gf_gridInit('boardGrid', {
    	showFooterRow: false
    });
}
var f_write = function(){
	
	var v_param = {
		menuNm : gf_mlg('영상_게시글_작성'),
		menuCode : 'HIDDEN001'
	};
		
	parent.f_addPageExec(v_param);
	
}
var f_search = function(){
	
	gf_ajax({
	  			QUERY_ID : 'bbs.S_BBS_CATEGORY',
	  			MODULE_CODE : moduleCode
			}, function(){
				gf_gridClear(categoryGrid);
				gf_gridClear(boardGrid);
			}
			, function(data){
				
				gf_gridCallback('categoryGrid', data);
				
			});
}
var f_boardSearch = function(p_categoryCode){
  	
	if(gf_nvl(p_categoryCode, '') == ''){
		gf_gridClear(boardGrid);
		return false;
	}
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_TABLE_DETAIL');
	fData.set('CATEGORY_CODE', p_categoryCode);
	fData.set('PAGE', 1);
	
	gf_ajax( fData
			, function(){
				gf_gridClear(boardGrid);
			}
			, function(data){
				gf_gridCallback('boardGrid', data);
			});
	
}