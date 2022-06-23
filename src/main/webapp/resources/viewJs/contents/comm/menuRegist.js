/**
 * 메뉴등록
 */
$(document).ready(function() {
    
	//그리드셋팅
	f_setMasterGrid();
	f_setFunctionGrid();
	
    f_search();
});
/*****************************************************************************************************************************************************************
 * 
 * 그리드 셋팅
 * 
 *****************************************************************************************************************************************************************/
var f_setMasterGrid = function(){
	masterGrid = gf_gridInit('masterGrid', {
		forceFitColumns: false,
		'addRowBefore' : function(){
			var functionData = gf_gridSaveData(functionGrid);
			if(functionData.state == 'empty'){
				return true;
			}
			else{
				gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
				return false;
			}
			
		},
    	'defaultInsert' : {'USE_YN' : '1'}
    });
    
	masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		var functionData = gf_gridSaveData(functionGrid);
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(functionData.state != 'empty' 
				){
				
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;
				masterGrid.setSelectedRows(args.previousSelectedRows);
				return false;
			}
		}
		else if(args.rows.length == 0){
			return false;
		}
		
		//기능조회
		f_functionSearch();
    });
}

var f_setFunctionGrid = function(){
	functionGrid = gf_gridInit('functionGrid', {
		forceFitColumns: false,
		'addRowBefore' : function(){
			var masterData = gf_gridSaveData(masterGrid);
			if(masterData.state == 'empty'){
				return true;
			}
			else{
				gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
				return false;
			}
			
		},
    	'defaultInsert' : {'COMM_MENU_ID' : function(){return gf_gridSelectVal(masterGrid, 'COMM_MENU_ID')},
							'BTN_AREA' : 'BTN_AREA1',
							'USE_YN' : '1'
						}
    });
}

var f_functionSearch = function(){
	
	var COMM_MENU_ID = gf_nvl( gf_gridSelectVal(masterGrid, 'COMM_MENU_ID') , '');
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_MENU_FUNC');
	fData.set('COMM_MENU_ID', COMM_MENU_ID);
	
	gf_ajax( fData
			, function(){
				
				gf_gridClear(functionGrid);
				
				if( COMM_MENU_ID == ''){
					return false;
				}
			}
			, function(data){
				
				gf_gridCallback('functionGrid', data);
				
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
		fData.set('TABLE_NAME', 'COMM_MENU');
		fData.set('MLG_COLUMN', 'MLG_CODE');
		fData.set('COMPARE_COLUMN', 'MENU_YN');
  		gf_ajax( fData
  				, function(){
  			
					var masterData = gf_gridSaveData(masterGrid);
					
					if(masterData.state != 'empty'){
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
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_MENU');
	gf_ajax( fData
			, function(){
				
				var masterData = gf_gridSaveData(masterGrid);
				var functionData = gf_gridSaveData(functionGrid);
		
				if(masterData.state != 'empty'
				|| functionData.state != 'empty'
				){
				
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						return false;
					}
				}
				gf_gridClear(masterGrid);
				gf_gridClear(functionGrid);
			}
			, function(data){
				
				gf_gridCallback('masterGrid', data);
				
			});
}
  	
var f_save = function(){
	
	var masterData = gf_gridSaveData(masterGrid);
	var functionData = gf_gridSaveData(functionGrid);
	
	if(!(masterData.state == 'success')
	&& !(functionData.state == 'success')
	){
		
		if( masterData.state == 'fail'){
			gf_toast(masterData.reason, 'info');
		}
		else if(functionData.state == 'fail'){
			gf_toast(functionData.reason, 'info');
		}
		else{
			gf_toast(masterData.reason, 'info');
		}
		
		return false;
	}
	
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
				
				if(masterData.data.length > 0){
					masterData.data.unshift({
						 'TABLE_NAME' : 'COMM_MENU'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('masterGrid', JSON.stringify(masterData.data));
				}
				
				if(functionData.data.length > 0){
					functionData.data.unshift({
						 'TABLE_NAME' : 'COMM_MENU_FUNC'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('functionGrid', JSON.stringify(functionData.data));
				}
					
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(masterGrid);
				gf_gridClear(functionGrid);
				f_search();
			}
			, null
			, null
			, '/save');
}