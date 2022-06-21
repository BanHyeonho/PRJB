/**
 * 그리드관리
 */
$(document).ready(function() {
	
	//그리드셋팅
	f_setMenuGrid();
	f_setMasterGrid();
	f_setContextGrid();
	f_setDetailGrid();
	f_setComboPopupGrid();
	
    f_search();
});
/*****************************************************************************************************************************************************************
 * 
 * 그리드 셋팅
 * 
 *****************************************************************************************************************************************************************/
var f_setMenuGrid = function(){
	menuGrid = gf_gridInit('menuGrid',{
		forceFitColumns: true
    });
	
	menuGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		var masterData = gf_gridSaveData(masterGrid);
		var contextData = gf_gridSaveData(contextGrid);
		var detailData = gf_gridSaveData(detailGrid);
		var comboPopupData = gf_gridSaveData(comboPopupGrid);
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(masterData.state != 'empty'
			 || contextData.state != 'empty' 
			 || detailData.state != 'empty'
			 || comboPopupData.state != 'empty' 
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
				
		//마스터 조회
		f_masterSearch();
    });
}

var f_setMasterGrid = function(){
	masterGrid = gf_gridInit('masterGrid', {
		forceFitColumns: true,
		'addRowBefore' : function(){
			var contextData = gf_gridSaveData(contextGrid);
			var detailData = gf_gridSaveData(detailGrid);
			var comboPopupData = gf_gridSaveData(comboPopupGrid);
			
			if(contextData.state == 'empty'
			&& detailData.state == 'empty'
			&& comboPopupData.state == 'empty'
			){
				return true;
			}
			else{
				gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
				return false;
			}
			
		},
    	'defaultInsert' : {'MENU_CODE' : function(){return gf_gridSelectVal(menuGrid, 'MENU_CODE')}
    						,'MENU_NAME' : function(){return gf_gridSelectVal(menuGrid, 'MENU_NAME')}
    						,'FILTER_YN' : '1'
    						, 'SORT_YN' : '1'
    						, 'TREE_YN' : '0'}
    });
	
	masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		var contextData = gf_gridSaveData(contextGrid);
		var detailData = gf_gridSaveData(detailGrid);
		var comboPopupData = gf_gridSaveData(comboPopupGrid);
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(contextData.state != 'empty' 
			 || detailData.state != 'empty' 
			 || comboPopupData.state != 'empty' 
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
		
		//상세조회
		f_contextSearch();
		
		//상세조회
		f_detailSearch();
    });
}

var f_setContextGrid = function(){
	contextGrid = gf_gridInit('contextGrid',{
		forceFitColumns: true
	});
}

var f_setDetailGrid = function(){
	detailGrid = gf_gridInit('detailGrid',{
		forceFitColumns: false,
		'addRowBefore' : function(){
			var contextData = gf_gridSaveData(contextGrid);
			var masterData = gf_gridSaveData(masterGrid);
			var comboPopupData = gf_gridSaveData(comboPopupGrid);
			
			if(contextData.state == 'empty'
			&& masterData.state == 'empty'
			&& comboPopupData.state == 'empty'
			){
				return true;
			}
			else{
				gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
				return false;
			}
			
		},
    	'defaultInsert' : {'USE_YN' : '1'
    					,'REQUIRE_YN' : '0'
						,'FIXED_YN' : '0'
						,'HIDE_YN' : '0'
						,'WIDTH' : '100'
						,'TEXT_ALIGN' : 'CENTER'
						,'FIELD_TYPE' : 'READ_ONLY'
    					,'COMM_GRID_MASTER_ID' : function(){return gf_gridSelectVal(masterGrid, 'COMM_GRID_MASTER_ID')}
    					}
    });
	
	detailGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		var comboPopupData = gf_gridSaveData(comboPopupGrid);
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(comboPopupData.state != 'empty' 
			 ){
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;	
				detailGrid.setSelectedRows(args.previousSelectedRows);
				return false;
			}
		}
		else if(args.rows.length == 0){
			return false;
		}
				
		//상세조회
		f_comboPopupSearch();
		
    });

}

var f_setComboPopupGrid = function(){
	comboPopupGrid = gf_gridInit('comboPopupGrid',{
		forceFitColumns: false,
		'addRowBefore' : function(){
			var contextData = gf_gridSaveData(contextGrid);
			var masterData = gf_gridSaveData(masterGrid);
			var detailData = gf_gridSaveData(detailGrid);
			
			if(contextData.state == 'empty'
			&& masterData.state == 'empty'
			&& detailData.state == 'empty'
			){
				return true;
			}
			else{
				gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
				return false;
			}
			
		},
    	'defaultInsert' : {'USE_YN' : '1'
    					 ,'COMM_GRID_DETAIL_ID' : function(){return gf_gridSelectVal(detailGrid, 'COMM_GRID_DETAIL_ID')}
    	}
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
		fData.set('TABLE_NAME', 'COMM_GRID_DETAIL');
		fData.set('MLG_COLUMN', 'MLG_CODE');
		fData.set('COMPARE_COLUMN', 'GRID_YN');
  		gf_ajax( fData
  				, function(){
  			
					var detailData = gf_gridSaveData(detailGrid);
					
					if(detailData.state != 'empty'){
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
	fData.set('QUERY_ID', 'com.S_GRID_MANAGE_MENU');
	gf_ajax( fData
			, function(){
				
				var masterData = gf_gridSaveData(masterGrid);
				var contextData = gf_gridSaveData(contextGrid);
				var detailData = gf_gridSaveData(detailGrid);
				var comboPopupData = gf_gridSaveData(comboPopupGrid);
		
				if(masterData.state != 'empty'
				|| contextData.state != 'empty'
				|| detailData.state != 'empty'
				|| comboPopupData.state != 'empty'
				){
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						gridEventIgnore = true;
						return false;
					}
				}
				
				gf_gridClear(masterGrid);
				gf_gridClear(detailGrid);
				gf_gridClear(contextGrid);
				gf_gridClear(comboPopupGrid);
				
			}
			, function(data){
				
				gf_gridCallback('menuGrid', data);
				
			});
	
}
  	
var f_masterSearch = function(){
	
	var MENU_CODE = gf_nvl( gf_gridSelectVal(menuGrid, 'MENU_CODE') , '');
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_GRID_MASTER');
	fData.set('MENU_CODE', MENU_CODE);
	
	gf_ajax( fData
			, function(){
				
				gf_gridClear(masterGrid);
				gf_gridClear(contextGrid);
				gf_gridClear(detailGrid);
				gf_gridClear(comboPopupGrid);
				
				if( MENU_CODE == ''){
					return false;
				}
				
			}
			, function(data){
				
				gf_gridCallback('masterGrid', data);
								
			});
	
}
	
var f_contextSearch = function(){
  	
	var COMM_GRID_MASTER_ID = gf_nvl( gf_gridSelectVal(masterGrid, 'COMM_GRID_MASTER_ID') , '');
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_GRID_CONTEXT');
	fData.set('COMM_GRID_MASTER_ID', COMM_GRID_MASTER_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(contextGrid);
				
				if( COMM_GRID_MASTER_ID == ''){
					return false;
				}
			}
			, function(data){
				
				gf_gridCallback('contextGrid', data);
				
			});
	
}
	
var f_detailSearch = function(){
	
	var COMM_GRID_MASTER_ID = gf_nvl( gf_gridSelectVal(masterGrid, 'COMM_GRID_MASTER_ID') , '');
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_GRID_DETAIL');
	fData.set('COMM_GRID_MASTER_ID', COMM_GRID_MASTER_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(detailGrid);
				gf_gridClear(comboPopupGrid);
				
				if( COMM_GRID_MASTER_ID == ''){
					return false;
				}
				
			}
			, function(data){
				
				gf_gridCallback('detailGrid', data);
				
			});
	
}
  	
var f_comboPopupSearch = function(){
		
	var COMM_GRID_DETAIL_ID = gf_nvl( gf_gridSelectVal(detailGrid, 'COMM_GRID_DETAIL_ID') , '');
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_GRID_COMBO_POPUP');
	fData.set('COMM_GRID_DETAIL_ID', COMM_GRID_DETAIL_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(comboPopupGrid);
				
				if( COMM_GRID_DETAIL_ID == ''){
					return false;
				}
				
			}
			, function(data){
				
				gf_gridCallback('comboPopupGrid', data);
								
			});
}
  	
var f_save = function(){
	
	var masterData = gf_gridSaveData(masterGrid);
	var contextData = gf_gridSaveData(contextGrid);
	var detailData = gf_gridSaveData(detailGrid);
	var comboPopupData = gf_gridSaveData(comboPopupGrid);
	
	if(!(masterData.state == 'success')
	&& !(contextData.state == 'success')
	&& !(detailData.state == 'success')
	&& !(comboPopupData.state == 'success')
	){
		
		if( masterData.state == 'fail'){
			gf_toast(masterData.reason, 'info');
		}
		else if(contextData.state == 'fail'){
			gf_toast(contextData.reason, 'info');
		}
		else if(detailData.state == 'fail'){
			gf_toast(detailData.reason, 'info');
		}
		else if(comboPopupData.state == 'fail'){
			gf_toast(comboPopupData.reason, 'info');
		}
		else{
			gf_toast(masterData.reason, 'info');
		}
		
		return false;
	}
	
	var fData = new FormData();

	gf_ajax( fData
			, function(){
				
					
				//마스터그리드
				if(masterData.data.length > 0){
					masterData.data.unshift({
						 'TABLE_NAME' : 'COMM_GRID_MASTER'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('masterGrid', JSON.stringify(masterData.data));
				}
				
				//컨텍스트그리드
				if(contextData.data.length > 0){
					contextData.data.unshift({
						 'TABLE_NAME' : 'COMM_GRID_CONTEXT'
						,'QUERY_ID' : 'com.COMM_GRID_CONTEXT'
					});
					fData.set('contextGrid', JSON.stringify(contextData.data));
				}
			
				//디테일그리드
				if(detailData.data.length > 0){
					detailData.data.unshift({
						 'TABLE_NAME' : 'COMM_GRID_DETAIL'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('detailGrid', JSON.stringify(detailData.data));
				}
				
				//콤보,팝업 설정그리드
				if(comboPopupData.data.length > 0){
					comboPopupData.data.unshift({
						 'TABLE_NAME' : 'COMM_GRID_COMBO_POPUP'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('comboPopupGrid', JSON.stringify(comboPopupData.data));
				}
				
				
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(menuGrid);
				gf_gridClear(masterGrid);
				gf_gridClear(contextGrid);
				gf_gridClear(detailGrid);
				gf_gridClear(comboPopupGrid);
				f_search();
				
			}
			, null
			, null
			, '/save');
}