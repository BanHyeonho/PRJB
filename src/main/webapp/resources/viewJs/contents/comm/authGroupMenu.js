/**
 * 권한메뉴관리
 */
$(document).ready(function() {

	//그리드셋팅
	f_setGroupGrid();
	f_setMenuGrid();
	f_setFunctionGrid();
	f_setGridMasterGrid();
	f_setGridContextGrid();
    
    f_search();
});
/*****************************************************************************************************************************************************************
 * 
 * 그리드 셋팅
 * 
 *****************************************************************************************************************************************************************/
var f_setGridContextGrid = function(){
	gridContextGrid = gf_gridInit('gridContextGrid',{
		forceFitColumns: true
    });
}

var f_setGridMasterGrid = function(){
	gridMasterGrid = gf_gridInit('gridMasterGrid',{
		forceFitColumns: true
    });
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
		
		//컨텍스트메뉴 조회
		f_gridContextSearch();
    });
}

var f_setFunctionGrid = function(){
	functionGrid = gf_gridInit('functionGrid',{
		forceFitColumns: true
    });
}

var f_setMenuGrid = function(){
	
	menuGrid = gf_gridInit('menuGrid',{
		forceFitColumns: true
    });
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
		
		//기능 조회
		f_functionSearch();
		//그리드 조회
		f_gridMasterSearch();
    });
}
var f_setGroupGrid = function(){
	groupGrid = gf_gridInit('groupGrid',{
		forceFitColumns: true
    });
	groupGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		var menuData = gf_gridSaveData(menuGrid);
		var functionData = gf_gridSaveData(functionGrid);
		var gridContextData = gf_gridSaveData(gridContextGrid);
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(menuData.state != 'empty' 
			 || functionData.state != 'empty'
			 || gridContextData.state != 'empty'
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
		
		//메뉴 조회
		f_menuSearch();
    });
}

//컨텍스트메뉴 조회
var f_gridContextSearch = function(){
	
	var COMM_GRID_MASTER_ID = gf_nvl( gf_gridSelectVal(gridMasterGrid, 'COMM_GRID_MASTER_ID') , '');
	var COMM_MENU_ID = gf_nvl( gf_gridSelectVal(menuGrid, 'COMM_MENU_ID') , '');
	var COMM_AUTH_GROUP_ID = gf_nvl( gf_gridSelectVal(groupGrid, 'COMM_AUTH_GROUP_ID') , '');
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP_MENU_CONTEXT');
	fData.set('COMM_GRID_MASTER_ID', COMM_GRID_MASTER_ID);
	fData.set('COMM_MENU_ID', COMM_MENU_ID);
	fData.set('COMM_AUTH_GROUP_ID', COMM_AUTH_GROUP_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(gridContextGrid);
				
				if( COMM_GRID_MASTER_ID == ''){
					return false;
				}
				else if( COMM_MENU_ID == ''){
					return false;
				}
				else if( COMM_AUTH_GROUP_ID == ''){
					return false;
				}
			}
			, function(data){
				
				gf_gridCallback('gridContextGrid', data);
				
			});
}

//그리드 조회
var f_gridMasterSearch = function(){
	
	var COMM_MENU_ID = gf_nvl( gf_gridSelectVal(menuGrid, 'COMM_MENU_ID') , '');
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_GRID_MASTER');
	fData.set('COMM_MENU_ID', COMM_MENU_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(gridMasterGrid);
				gf_gridClear(gridContextGrid);
				
				if( COMM_MENU_ID == ''){
					return false;
				}
			}
			, function(data){
				
				gf_gridCallback('gridMasterGrid', data);
				
				
			});
}

//기능 조회
var f_functionSearch = function(){
	
	var COMM_MENU_ID = gf_nvl( gf_gridSelectVal(menuGrid, 'COMM_MENU_ID') , '');
	var COMM_AUTH_GROUP_ID = gf_nvl( gf_gridSelectVal(groupGrid, 'COMM_AUTH_GROUP_ID') , '');
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP_MENU_FUNC');
	fData.set('COMM_MENU_ID', COMM_MENU_ID);
	fData.set('COMM_AUTH_GROUP_ID', COMM_AUTH_GROUP_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(functionGrid);
				
				if(COMM_MENU_ID == ''){
					return false;
				}
				else if(COMM_AUTH_GROUP_ID == ''){
					return false;
				}
			}
			, function(data){
				
				gf_gridCallback('functionGrid', data);
				
			});
}

//메뉴조회
var f_menuSearch = function(){
	
	var COMM_AUTH_GROUP_ID = gf_nvl( gf_gridSelectVal(groupGrid, 'COMM_AUTH_GROUP_ID') , '');
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP_MENU');
	fData.set('COMM_AUTH_GROUP_ID', COMM_AUTH_GROUP_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(menuGrid);
				gf_gridClear(functionGrid);
				gf_gridClear(gridMasterGrid);
				gf_gridClear(gridContextGrid);

				if( COMM_AUTH_GROUP_ID == ''){
					return false;
				}
				
			}
			, function(data){
				
				gf_gridCallback('menuGrid', data);
				
			});
}
/*****************************************************************************************************************************************************************
 * 
 * 버튼 기능
 * 
 *****************************************************************************************************************************************************************/
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP');
	gf_ajax( fData
			, function(){
				
				var menuData = gf_gridSaveData(menuGrid);
				var functionData = gf_gridSaveData(functionGrid);
				var gridContextData = gf_gridSaveData(gridContextGrid);
		
				if(menuData.state != 'empty'
				|| functionData.state != 'empty'
				|| gridContextData.state != 'empty'
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
	
	var COMM_AUTH_GROUP_ID = gf_gridSelectVal(groupGrid, 'COMM_AUTH_GROUP_ID');
	var menuData = gf_gridSaveData(menuGrid);
	$.each(menuData.data, function(idx, item){
		item['COMM_AUTH_GROUP_ID'] = COMM_AUTH_GROUP_ID; 
	});
	var functionData = gf_gridSaveData(functionGrid);
	$.each(functionData.data, function(idx, item){
		item['COMM_AUTH_GROUP_ID'] = COMM_AUTH_GROUP_ID;
	});
	var gridContextData = gf_gridSaveData(gridContextGrid);
	$.each(gridContextData.data, function(idx, item){
		item['COMM_AUTH_GROUP_ID'] = COMM_AUTH_GROUP_ID;
	});
	
	if(!(menuData.state == 'success')
	&& !(functionData.state == 'success')
	&& !(gridContextData.state == 'success')
	){
		
		if( menuData.state == 'fail'){
			gf_toast(menuData.reason, 'info');
		}
		else if(functionData.state == 'fail'){
			gf_toast(functionData.reason, 'info');
		}
		else if(gridContextData.state == 'fail'){
			gf_toast(gridContextData.reason, 'info');
		}
		else{
			gf_toast(menuData.reason, 'info');
		}
		
		return false;
	}
	
	var fData = new FormData();

	gf_ajax( fData
			, function(){
									
				//메뉴그리드
				if(menuData.data.length > 0){
					menuData.data.unshift({
						 'TABLE_NAME' : 'COMM_AUTH_GROUP_MENU'
						,'QUERY_ID' : 'com.COMM_AUTH_GROUP_MENU'
					});
					fData.set('menuGrid', JSON.stringify(menuData.data));
				}
				
				//기능그리드
				if(functionData.data.length > 0){
					functionData.data.unshift({
						 'TABLE_NAME' : 'COMM_AUTH_GROUP_MENU_FUNC'
						,'QUERY_ID' : 'com.COMM_AUTH_GROUP_MENU_FUNC'
					});
					fData.set('functionGrid', JSON.stringify(functionData.data));
				}
			
				//컨텍스트그리드
				if(gridContextData.data.length > 0){
					gridContextData.data.unshift({
						 'TABLE_NAME' : 'COMM_AUTH_GROUP_CONTEXT'
						,'QUERY_ID' : 'com.COMM_AUTH_GROUP_CONTEXT'
					});
					fData.set('gridContextGrid', JSON.stringify(gridContextData.data));
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