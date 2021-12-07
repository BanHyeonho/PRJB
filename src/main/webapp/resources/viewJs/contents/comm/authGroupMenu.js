/**
 * 권한메뉴관리
 */
var gridPk = function(){
	this.COMM_AUTH_GROUP_ID;
	this.COMM_MENU_ID;
	this.MENU_NAME;
	this.COMM_GRID_MASTER_ID;
};
	
$(document).ready(function() {

	//그리드셋팅
	f_setGroupGrid();
	f_setMenuGrid();
	f_setFunctionGrid();
	f_setGridMasterGrid();
	f_setGridContextGrid();
    
    f_search();
});
var f_setGridContextGrid = function(){
	gridContextGrid = gf_gridInit('gridContextGrid');
}

var f_setGridMasterGrid = function(){
	gridMasterGrid = gf_gridInit('gridMasterGrid');
	gridMasterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(gridContextGrid).length > 0
			){
		
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;	
				gridMasterGrid.setSelectedRows(args.previousSelectedRows);
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
		gridPk.prototype.constructor.COMM_GRID_MASTER_ID = selectedRowData.COMM_GRID_MASTER_ID;
		
		//컨텍스트메뉴 조회
		f_gridContextSearch(preRow);
    });
}

var f_setFunctionGrid = function(){
	functionGrid = gf_gridInit('functionGrid');
}

var f_setMenuGrid = function(){
	
	menuGrid = gf_gridInit('menuGrid');
	menuGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(functionGrid).length > 0
			|| gf_gridSaveData(gridContextGrid).length > 0
			){
		
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;	
				menuGrid.setSelectedRows(args.previousSelectedRows);
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
		
		gridPk.prototype.constructor.COMM_MENU_ID = selectedRowData.COMM_MENU_ID;
		gridPk.prototype.constructor.MENU_NAME = selectedRowData.MENU_NAME;
		
		//기능 조회
		f_functionSearch(preRow);
		//그리드 조회
		f_gridMasterSearch(preRow);
    });
}
var f_setGroupGrid = function(){
	groupGrid = gf_gridInit('groupGrid');
	groupGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(functionGrid).length > 0
			|| gf_gridSaveData(menuGrid).length > 0
			|| gf_gridSaveData(gridContextGrid).length > 0
			){
		
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;	
				groupGrid.setSelectedRows(args.previousSelectedRows);
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
		gridPk.prototype.constructor.COMM_AUTH_GROUP_ID = selectedRowData.COMM_AUTH_GROUP_ID;
		
		//메뉴 조회
		f_menuSearch(preRow);
    });
}

//컨텍스트메뉴 조회
var f_gridContextSearch = function(preRow){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP_MENU_CONTEXT');
	fData.set('COMM_GRID_MASTER_ID', gridPk.COMM_GRID_MASTER_ID);
	fData.set('COMM_MENU_ID', gridPk.COMM_MENU_ID);
	fData.set('COMM_AUTH_GROUP_ID', gridPk.COMM_AUTH_GROUP_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(gridContextGrid);
				
			}
			, function(data){
				
				gf_gridCallback('gridContextGrid', data);
				
			});
}

//그리드 조회
var f_gridMasterSearch = function(preRow){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_GRID_MASTER');
	fData.set('COMM_MENU_ID', gridPk.COMM_MENU_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(gridMasterGrid);
				gf_gridClear(gridContextGrid);
			}
			, function(data){
				
				gf_gridCallback('gridMasterGrid', data);
				
				
			});
}

//기능 조회
var f_functionSearch = function(preRow){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP_MENU_FUNC');
	fData.set('COMM_MENU_ID', gridPk.COMM_MENU_ID);
	fData.set('COMM_AUTH_GROUP_ID', gridPk.COMM_AUTH_GROUP_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(functionGrid);
				
			}
			, function(data){
				
				gf_gridCallback('functionGrid', data);
				
			});
}

//메뉴조회
var f_menuSearch = function(preRow){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP_MENU');
	fData.set('COMM_AUTH_GROUP_ID', gridPk.COMM_AUTH_GROUP_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(menuGrid);
				gf_gridClear(functionGrid);
				gf_gridClear(gridMasterGrid);
				gf_gridClear(gridContextGrid);
				
			}
			, function(data){
				
				gf_gridCallback('menuGrid', data);
				
			});
}
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP');
	gf_ajax( fData
			, function(){
				
				if((gf_gridSaveData(functionGrid).length > 0
				|| gf_gridSaveData(menuGrid).length > 0
				|| gf_gridSaveData(gridContextGrid).length > 0
				)
				){
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						gridEventIgnore = true;
						return false;
					}
				}
				
				gf_gridClear(groupGrid);
				gf_gridClear(menuGrid);
				gf_gridClear(functionGrid);
				gf_gridClear(gridMasterGrid);
				gf_gridClear(gridContextGrid);
				
			}
			, function(data){
				
				gf_gridCallback('groupGrid', data);
				
			});
	
}

var f_save = function(){
	
	var menuData = gf_gridSaveData(menuGrid);
	$.each(menuData, function(idx, item){
		item['COMM_AUTH_GROUP_ID'] = gridPk.COMM_AUTH_GROUP_ID; 
	});
	var functionData = gf_gridSaveData(functionGrid);
	$.each(functionData, function(idx, item){
		item['COMM_AUTH_GROUP_ID'] = gridPk.COMM_AUTH_GROUP_ID;
	});
	var gridContextData = gf_gridSaveData(gridContextGrid);
	$.each(gridContextData, function(idx, item){
		item['COMM_AUTH_GROUP_ID'] = gridPk.COMM_AUTH_GROUP_ID;
	});
	
	var fData = new FormData();

	gf_ajax( fData
			, function(){
				
				if(menuData.length == 0 && functionData.length == 0 && gridContextData.length == 0){
				
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');
					return false;
				}
				else{
					
					//메뉴그리드
					if(menuData.length > 0){
						menuData.unshift({
  							 'TABLE_NAME' : 'COMM_AUTH_GROUP_MENU'
  							,'QUERY_ID' : 'com.COMM_AUTH_GROUP_MENU'
  						});
  						fData.set('menuGrid', JSON.stringify(menuData));
					}
					
					//기능그리드
					if(functionData.length > 0){
						functionData.unshift({
  							 'TABLE_NAME' : 'COMM_AUTH_GROUP_MENU_FUNC'
  							,'QUERY_ID' : 'com.COMM_AUTH_GROUP_MENU_FUNC'
  						});
  						fData.set('functionGrid', JSON.stringify(functionData));
					}
				
					//컨텍스트그리드
					if(gridContextData.length > 0){
						gridContextData.unshift({
  							 'TABLE_NAME' : 'COMM_AUTH_GROUP_CONTEXT'
  							,'QUERY_ID' : 'com.COMM_AUTH_GROUP_CONTEXT'
  						});
  						fData.set('gridContextGrid', JSON.stringify(gridContextData));
					}
				}
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(groupGrid);
				gf_gridClear(menuGrid);
				gf_gridClear(functionGrid);
				gf_gridClear(gridMasterGrid);
				gf_gridClear(gridContextGrid);
				f_search();	
				
			}
			, null
			, null
			, '/save');
}