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
//    	showFooterRow: false
    });
	
	boardGrid.onDblClick.subscribe(function (e, args){
	    
	    var boardInfo = boardGrid.getDataItem(args.row);
	    
	    var v_param = {
	    		menuNm : gf_mlg('영상_게시글'),
	    		menuCode : 'HIDDEN002',
	    		p_param : {
	    			BBS_BOARD_ID : boardInfo.BBS_BOARD_ID,
	    			MODULE_CODE : boardInfo.MODULE_CODE,
	    			BOARD_NO : boardInfo.BOARD_NO
	    		}
    	};
	    		
    	parent.f_addPageExec(v_param);
	    	
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
	fData.set('QUERY_ID', 'bbs.S_BBS_BOARD');
	fData.set('MODULE_CODE', moduleCode);
	fData.set('CATEGORY_CODE', p_categoryCode);
	fData.set('WRITER', $('#WRITER').val());
	fData.set('TITLE', $('#TITLE').val());
	
	gf_ajax( fData
			, function(){
				gf_delFormData(fData);
				gf_gridClear(boardGrid);
			}
			, function(data){
				gf_gridCallback('boardGrid', data);
			});
	
}