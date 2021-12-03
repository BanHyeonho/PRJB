/**
 * 게시판 설정
 */
var gridPk = function(){
	this.MODULE_CODE;
	this.MODULE_NAME;
//	this.MENU_NAME;
//	THIS.COMM_GRID_MASTER_ID;
};
$(document).ready(function() {
	
	//그리드셋팅
	f_setModuleGrid();
	f_setCategoryGrid();
	f_setAuthGroupGrid();
	f_setBbsAuthGrid();
	
	f_search();
});
var f_setModuleGrid = function(){
	moduleGrid = gf_gridInit('moduleGrid');
	moduleGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(categoryGrid).length > 0
			 || gf_gridSaveData(authGroupGrid).length > 0
			 || gf_gridSaveData(bbsAuthGrid).length > 0
			){
		
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;	
				moduleGrid.setSelectedRows(args.previousSelectedRows);
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
		gridPk.prototype.constructor.MODULE_CODE = selectedRowData.MODULE_CODE;
		gridPk.prototype.constructor.MODULE_NAME = selectedRowData.MODULE_NAME;
		
		//카테고리그리드 조회
		f_categoryGridSearch();
    });
	
}
var f_setCategoryGrid = function(){
	categoryGrid = gf_gridInit('categoryGrid',{
    	'defaultInsert' : {'MODULE_CODE' : gridPk
							,'MODULE_NAME' : gridPk
							,'USE_YN' : '1'}
});
}
var f_setAuthGroupGrid = function(){
	authGroupGrid = gf_gridInit('authGroupGrid');
}
var f_setBbsAuthGrid = function(){
	bbsAuthGrid = gf_gridInit('bbsAuthGrid');
}
var f_save = function(){
	
	var categoryData = gf_gridSaveData(categoryGrid);
	var authGroupData = gf_gridSaveData(authGroupGrid);
	var bbsAuthData = gf_gridSaveData(bbsAuthGrid);
	
	var fData = new FormData();

	gf_ajax( fData
			, function(){
				
				if(categoryData.length == 0 
				&& authGroupData.length == 0 
				&& bbsAuthData.length == 0
				){
				
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');
					return false;
				}
				else{
					
					//카테고리 그리드
					if(categoryData.length > 0){
						categoryData.unshift({
  							 'TALBE_NAME' : 'BBS_SETTING'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('categoryGrid', JSON.stringify(categoryData));
					}
					
					//권한그룹 그리드
					if(authGroupData.length > 0){
						authGroupData.unshift({
  							 'TALBE_NAME' : 'COMM_AUTH_GROUP_MENU_FUNC'
  							,'QUERY_ID' : 'com.COMM_AUTH_GROUP_MENU_FUNC'
  						});
  						fData.set('authGroupGrid', JSON.stringify(authGroupData));
					}
				
					//게시판 권한 그리드
					if(bbsAuthData.length > 0){
						bbsAuthData.unshift({
  							 'TALBE_NAME' : 'COMM_AUTH_GROUP_CONTEXT'
  							,'QUERY_ID' : 'com.COMM_AUTH_GROUP_CONTEXT'
  						});
  						fData.set('bbsAuthGrid', JSON.stringify(bbsAuthData));
					}
				}
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(moduleGrid);
				gf_gridClear(categoryGrid);
				gf_gridClear(authGroupGrid);
				gf_gridClear(bbsAuthGrid);
				f_search();	
				
			}
			, null
			, null
			, '/save');
}
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'bbs.S_BBS_MODULE');
	gf_ajax( fData
			, function(){
				
				if((gf_gridSaveData(categoryGrid).length > 0
				|| gf_gridSaveData(authGroupGrid).length > 0
				|| gf_gridSaveData(bbsAuthGrid).length > 0
				)
				){
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						gridEventIgnore = true;
						return false;
					}
				}
				
				gf_gridClear(moduleGrid);
				gf_gridClear(categoryGrid);
				gf_gridClear(authGroupGrid);
				gf_gridClear(bbsAuthGrid);
				
			}
			, function(data){
				
				gf_gridCallback('moduleGrid', data);
				
			});
	
}
var f_categoryGridSearch = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'bbs.S_BBS_SETTING');
	fData.set('MODULE_CODE', gridPk.MODULE_CODE);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(categoryGrid);
				gf_gridClear(authGroupGrid);
				gf_gridClear(bbsAuthGrid);
				
			}
			, function(data){
				
				gf_gridCallback('categoryGrid', data);
				
			});
	
}

