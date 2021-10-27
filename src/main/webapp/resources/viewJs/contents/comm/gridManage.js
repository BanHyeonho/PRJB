/**
 * 그리드관리
 */
var gridPk = function(){
	this.MENU_CODE;
	this.MENU_NAME;
	this.COMM_GRID_MASTER_ID;
	this.COMM_GRID_DETAIL_ID;
};
	
$(document).ready(function() {
	
	menuGrid = gf_gridInit('menuGrid');
	
	masterGrid = gf_gridInit('masterGrid', {
    	'defaultInsert' : {'MENU_CODE' : gridPk
    						,'MENU_NAME' : gridPk
    						,'FILTER_YN' : '1'
    						, 'SORT_YN' : '1'
    						, 'TREE_YN' : '0'}
    });
	contextGrid = gf_gridInit('contextGrid');
	
	detailGrid = gf_gridInit('detailGrid',{
    	'defaultInsert' : {'USE_YN' : '1'
    					,'REQUIRE_YN' : '0'
						,'FIXED_YN' : '0'
						,'HIDDEN_YN' : '0'
						,'WIDTH' : '100'
						,'TEXT_ALIGN' : 'CENTER'
    					,'COMM_GRID_MASTER_ID' : gridPk
    					}
    });
	
	comboPopupGrid = gf_gridInit('comboPopupGrid',{
    	'defaultInsert' : {'USE_YN' : '1'
    					 ,'COMM_GRID_DETAIL_ID' : gridPk}
    });
	
	
	menuGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(masterGrid).length > 0
		|| gf_gridSaveData(detailGrid).length > 0 
		|| gf_gridSaveData(comboPopupGrid).length > 0
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
		var pk = selectedRowData.MENU_CODE;
		
		gridPk.prototype.constructor.MENU_NAME = selectedRowData.MENU_NAME;
		gridPk.prototype.constructor.MENU_CODE = pk;
		
		//마스터 조회
		f_masterSearch(pk, preRow);
    });
    
	masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(detailGrid).length > 0
			 || gf_gridSaveData(contextGrid).length > 0
			 || gf_gridSaveData(comboPopupGrid).length > 0
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
		
		var row = args.rows[0];
		var grid = args.grid;
		var preRow = args.previousSelectedRows[0];
		var selectedRowData = grid.getData().getItem(row);
		var pk = selectedRowData.COMM_GRID_MASTER_ID;
		gridPk.prototype.constructor.COMM_GRID_MASTER_ID = pk;
		
		//상세조회
		f_contextSearch(pk, preRow);
		
		//상세조회
		f_detailSearch(pk, preRow);
    });
	
	detailGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(comboPopupGrid).length > 0
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
		
		var row = args.rows[0];
		var grid = args.grid;
		var preRow = args.previousSelectedRows[0];
		var selectedRowData = grid.getData().getItem(row);
		var pk = selectedRowData.COMM_GRID_DETAIL_ID;
		gridPk.prototype.constructor.COMM_GRID_DETAIL_ID = pk;
		
		//상세조회
		f_comboPopupSearch(pk, preRow);
		
    });
    
    $('#mlgRegistBtn').on('click', f_mlg_regist);
    
    f_search();
});
	
//다국어등록
var f_mlg_regist = function(){

	if(confirm(gf_mlg('다국어를_등록하시겠습니까?'))){
		var fData = new FormData();
		fData.set('QUERY_ID', 'com.P_MLG_BATCH_REGIST');
		fData.set('TABLE_NAME', 'COMM_GRID_DETAIL');
		fData.set('MLG_COLUMN', 'MLG_CODE');
		fData.set('COMPARE_COLUMN', 'GRID_YN');
  		gf_ajax( fData
  				, null
  				, function(data){
  					
		  			if(data.result == 'success'){
			
						gf_toast(gf_mlg('저장_되었습니다'), 'success');
					}
					
				});
	}
}
	
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_GRID_MANAGE_MENU');
	gf_ajax( fData
			, function(){
				
				if((gf_gridSaveData(masterGrid).length > 0
				|| gf_gridSaveData(detailGrid).length > 0
				|| gf_gridSaveData(contextGrid).length > 0
				|| gf_gridSaveData(comboPopupGrid).length > 0
				)
				){
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
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
  	
var f_masterSearch = function(pk, preRow){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_GRID_MASTER');
	fData.set('MENU_CODE', pk);
	
	gf_ajax( fData
			, function(){
				
				gf_gridClear(masterGrid);
				gf_gridClear(contextGrid);
				gf_gridClear(detailGrid);
				gf_gridClear(comboPopupGrid);
				
			}
			, function(data){
				
				gf_gridCallback('masterGrid', data);
								
			});
	
}
	
var f_contextSearch = function(pk, preRow){
  	
	if(gf_nvl(pk, '') == ''){
		gf_gridClear(contextGrid);
		return false;
	}
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_GRID_CONTEXT');
	fData.set('COMM_GRID_MASTER_ID', pk);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(contextGrid);
				
			}
			, function(data){
				
				gf_gridCallback('contextGrid', data);
				
			});
	
}
	
var f_detailSearch = function(pk, preRow){

	if(gf_nvl(pk, '') == ''){
		gf_gridClear(detailGrid);
		return false;
	}
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_GRID_DETAIL');
	fData.set('COMM_GRID_MASTER_ID', pk);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(detailGrid);
				gf_gridClear(comboPopupGrid);
				
			}
			, function(data){
				
				gf_gridCallback('detailGrid', data);
				
			});
	
}
  	
var f_comboPopupSearch = function(pk, preRow){
	
	if(gf_nvl(pk, '') == ''){
		gf_gridClear(comboPopupGrid);
		return false;
	}
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_GRID_COMBO_POPUP');
	fData.set('COMM_GRID_DETAIL_ID', pk);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(comboPopupGrid);
				
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
	
	var fData = new FormData();

	gf_ajax( fData
			, function(){
				
				if(masterData.length == 0 && contextData.length == 0 && detailData.length == 0 && comboPopupData.length == 0){
				
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');
					return false;
				}
				else{
					
					//마스터그리드
					if(masterData.length > 0){
						masterData.unshift({
  							 'TALBE_NAME' : 'COMM_GRID_MASTER'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('masterGrid', JSON.stringify(masterData));
					}
					
					//컨텍스트그리드
					if(contextData.length > 0){
						contextData.unshift({
  							 'TALBE_NAME' : 'COMM_GRID_CONTEXT'
  							,'QUERY_ID' : 'com.COMM_GRID_CONTEXT'
  						});
  						fData.set('contextGrid', JSON.stringify(contextData));
					}
				
					//디테일그리드
					if(detailData.length > 0){
						detailData.unshift({
  							 'TALBE_NAME' : 'COMM_GRID_DETAIL'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('detailGrid', JSON.stringify(detailData));
					}
					
					//콤보,팝업 설정그리드
					if(comboPopupData.length > 0){
						comboPopupData.unshift({
  							 'TALBE_NAME' : 'COMM_GRID_COMBO_POPUP'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('comboPopupGrid', JSON.stringify(comboPopupData));
					}
				
				}
			}
			, function(data){
				
				if(data.result == 'success'){
				
					gf_toast(gf_mlg('저장_되었습니다'), 'success');
					gf_gridClear(menuGrid);
					gf_gridClear(masterGrid);
					gf_gridClear(contextGrid);
					gf_gridClear(detailGrid);
					gf_gridClear(comboPopupGrid);
  					f_search();	
				}
				
			}
			, null
			, null
			, '/save');
}