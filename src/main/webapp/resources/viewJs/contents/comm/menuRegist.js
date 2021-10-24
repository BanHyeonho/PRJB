/**
 * 메뉴등록
 */
var gridPk = function(){
	this.COMM_MENU_ID;
};
$(document).ready(function() {
    masterGrid = gf_gridInit('masterGrid', {
    	'defaultInsert' : {'USE_YN' : '1'}
    });
    
	masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(functionGrid).length > 0
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
		var pk = selectedRowData.COMM_MENU_ID;
		
		gridPk.prototype.constructor.COMM_MENU_ID = pk;
		
		//기능조회
		f_functionSearch(pk, preRow);
    });

	functionGrid = gf_gridInit('functionGrid', {
    	'defaultInsert' : {'COMM_MENU_ID' : gridPk,
							'BTN_AREA' : 'BTN_AREA1',
						}
    });

    $('#searchBtn').on('click', f_search);
    $('#saveBtn').on('click', f_save);
    $('#mlgRegistBtn').on('click', f_mlg_regist);
    
    f_search();
});

var f_functionSearch = function(pk, preRow){

	if(gf_nvl(pk, '') == ''){
		gf_gridClear(functionGrid);
		return false;
	}
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_MENU_FUNC');
	fData.set('COMM_MENU_ID', pk);
	
	gf_ajax( fData
			, function(){
				
				gf_gridClear(functionGrid);
				
			}
			, function(data){
				
				gf_gridCallback('functionGrid', data);
				
			});
	
}

//다국어등록
var f_mlg_regist = function(){

	if(confirm(gf_mlg('다국어를_등록하시겠습니까?'))){
		var fData = new FormData();
		fData.set('QUERY_ID', 'com.P_MLG_BATCH_REGIST');
		fData.set('TABLE_NAME', 'COMM_MENU');
		fData.set('MLG_COLUMN', 'MLG_CODE');
		fData.set('COMPARE_COLUMN', 'MENU_YN');
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
	fData.set('QUERY_ID', 'com.S_COMM_MENU');
	gf_ajax( fData
			, function(){
				
				if(gf_gridSaveData(masterGrid).length > 0
				|| gf_gridSaveData(functionGrid).length > 0
				){
				
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						gridEventIgnore = true;
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
	
	
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
				
				if(masterData.length == 0
				&& functionData.length == 0
				){
				
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');
					return false;
				}
				else{
				
					if(masterData.length > 0){
						masterData.unshift({
							 'TALBE_NAME' : 'COMM_MENU'
							,'QUERY_ID' : 'com.COMM_QUERY'
						});
						fData.set('masterGrid', JSON.stringify(masterData));
					}
					
					if(functionData.length > 0){
						functionData.unshift({
							 'TALBE_NAME' : 'COMM_MENU_FUNC'
							,'QUERY_ID' : 'com.COMM_QUERY'
						});
						fData.set('functionGrid', JSON.stringify(functionData));
					}
					
				}
			}
			, function(data){
				
				if(data.result == 'success'){
				
					gf_toast(gf_mlg('저장_되었습니다'), 'success');
					gf_gridClear(masterGrid);
					gf_gridClear(functionGrid);
  					f_search();
				}
			}
			, null
			, null
			, '/save');
}