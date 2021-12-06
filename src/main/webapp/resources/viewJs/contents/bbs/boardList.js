/**
 * 게시판
 */
var moduleCode = pageParam.MODULE_CODE;
$(document).ready(function() {
	
	f_setCategoryGrid();
	f_setBoardGrid();
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
				menuNm : gf_mlg('게시글_보기', {
					param : '('+ parent.$('li[aria-selected="true"]').attr('title') +')'
				}),
				menuCode : 'HIDDEN002',
				menuParam : {
					MODULE_CODE : moduleCode,
					BBS_BOARD_ID : boardInfo.BBS_BOARD_ID
				}
			};
		parent.f_addPageExec(v_param);
		
		//조회수up
		gf_ajax({
  			QUERY_ID : 'bbs.U_BBS_BOARD_VIEW_UP',
			BBS_BOARD_ID : boardInfo.BBS_BOARD_ID
		}, null
		, function(data){
		});
	});
	
}
var f_write = function(){
	
	var v_param = {
		menuNm : gf_mlg('게시글_작성', {
			param : '('+ parent.$('li[aria-selected="true"]').attr('title') +')'
		}),
		menuCode : 'HIDDEN001',
		menuParam : {
			MODULE_CODE : moduleCode
		}
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