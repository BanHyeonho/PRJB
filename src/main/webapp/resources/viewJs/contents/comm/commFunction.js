/**
 * 기능관리
 */

$(document).ready(function() {
	
    //그리드셋팅
	f_setFunctionGrid();
	f_setMenuGrid();
	
});
/*****************************************************************************************************************************************************************
 * 
 * 그리드 셋팅
 * 
 *****************************************************************************************************************************************************************/
var f_setFunctionGrid = function(){
	functionGrid = gf_gridInit('functionGrid', {
		forceFitColumns: true,
		'addRowBefore' : function(){
			var menuData = gf_gridSaveData(menuGrid);
			
			if(menuData.state == 'empty'){
				return true;
			}
			else{
				gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
				return false;
			}
		}
    });
	
	functionGrid.onSelectedRowsChanged.subscribe(function (e, args) {

		var menuData = gf_gridSaveData(menuGrid);
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(menuData.state != 'empty' 
				){
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;	
				functionGrid.setSelectedRows(args.previousSelectedRows);
				return false;
			}
		}
		else if(args.rows.length == 0){
			return false;
		}
				
		//기능별 메뉴조회
		f_menuSearch();
		
    });
	
}

var f_setMenuGrid = function(){
	menuGrid = gf_gridInit('menuGrid', {
		forceFitColumns: true
    });
}
/*****************************************************************************************************************************************************************
 * 
 * 버튼 기능
 * 
 *****************************************************************************************************************************************************************/
//다국어등록
var f_mlg_regist = function(){

	if(confirm(gf_mlg('다국어를_등록하시겠습니까?'))){
		var fData = new FormData();
		fData.set('QUERY_ID', 'com.P_MLG_BATCH_REGIST');
		fData.set('TABLE_NAME', 'COMM_FUNCTION');
		fData.set('MLG_COLUMN', 'MLG_CODE');
		fData.set('COMPARE_COLUMN', 'FUNCTION_YN');
  		gf_ajax( fData
  				, function(){
  			
					var functionData = gf_gridSaveData(functionGrid);
					
					if(functionData.state != 'empty'){
						if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_진행_하시겠습니까?'))){
							return false;
						}
					}
					return true;
				}
  				, function(data){
  					
  					gf_toast(gf_mlg('저장_되었습니다'), 'success');
					
				});
	}
}

var f_search = function(){
	
	
	gf_ajax({
	  			QUERY_ID : 'com.S_COMM_FUNCTION',
	  			p_functionCode : $('#searchParam1').val()
			}, function(){
			
				var functionData = gf_gridSaveData(functionGrid);
				var menuData = gf_gridSaveData(menuGrid);
				
				if(functionData.state != 'empty'
				|| menuData.state != 'empty'
				){
				
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						gridEventIgnore = true;
						return false;
					}
				}
				
				gf_gridClear(menuGrid);
				gf_gridClear(functionGrid);
			}
			, function(data){
				
				gf_gridCallback('functionGrid', data);
				
			});
}

var f_menuSearch = function(){
  	
	var COMM_FUNCTION_ID = gf_nvl( gf_gridSelectVal(functionGrid, 'COMM_FUNCTION_ID') , '');
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_FUNCTION_MENU');
	fData.set('COMM_FUNCTION_ID', COMM_FUNCTION_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(menuGrid);
				
				if(COMM_FUNCTION_ID == ''){
					return false;
				}
				
			}
			, function(data){
				
				gf_gridCallback('menuGrid', data);
				
			});
	
}

var f_save = function(){
	var functionData = gf_gridSaveData(functionGrid);
	var menuData = gf_gridSaveData(menuGrid);
	
	if(!(functionData.state == 'success')
	&& !(menuData.state == 'success')
	){
		
		if( functionData.state == 'fail'){
			gf_toast(functionData.reason, 'info');
		}
		else if(menuData.state == 'fail'){
			gf_toast(menuData.reason, 'info');
		}
		else{
			gf_toast(functionData.reason, 'info');
		}
		
		return false;
	}
	
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
				
					
				//기능그리드
				if(functionData.data.length > 0){
					functionData.data.unshift({
						 'TABLE_NAME' : 'COMM_FUNCTION'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('functionGrid', JSON.stringify(functionData.data));
				}
				
				//메뉴그리드
				if(menuData.data.length > 0){
					menuData.data.unshift({
						 'TABLE_NAME' : 'COMM_MENU_FUNC'
						,'QUERY_ID' : 'com.COMM_MENU_FUNC'
					});
					fData.set('menuGrid', JSON.stringify(menuData.data));
				}
				
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(menuGrid);
				gf_gridClear(functionGrid);
				f_search();	
				
			}
			, null
			, null
			, '/save');
	
}