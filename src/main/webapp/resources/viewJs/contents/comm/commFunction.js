/**
 * 기능관리
 */
var gridPk = function(){
	this.COMM_FUNCTION_ID;
};

$(document).ready(function() {
	
    functionGrid = gf_gridInit('functionGrid');
    menuGrid = gf_gridInit('menuGrid');
	
    functionGrid.onSelectedRowsChanged.subscribe(function (e, args) {

		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(menuGrid).length > 0
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
		
		var row = args.rows[0];
		var grid = args.grid;
		var preRow = args.previousSelectedRows[0];
		var selectedRowData = grid.getData().getItem(row);
		var pk = selectedRowData.COMM_FUNCTION_ID;
		gridPk.prototype.constructor.COMM_FUNCTION_ID = pk;
		
		//기능별 메뉴조회
		f_menuSearch(pk, preRow);
		
    });
	
});

//다국어등록
var f_mlg_regist = function(){

	if(confirm(gf_mlg('다국어를_등록하시겠습니까?'))){
		var fData = new FormData();
		fData.set('QUERY_ID', 'com.P_MLG_BATCH_REGIST');
		fData.set('TABLE_NAME', 'COMM_FUNCTION');
		fData.set('MLG_COLUMN', 'MLG_CODE');
		fData.set('COMPARE_COLUMN', 'FUNCTION_YN');
  		gf_ajax( fData
  				, null
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
			
				if((gf_gridSaveData(menuGrid).length > 0
				|| gf_gridSaveData(functionGrid).length > 0 )
				){
				
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
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

var f_menuSearch = function(pk, preRow){
  	
	if(gf_nvl(pk, '') == ''){
		gf_gridClear(menuGrid);
		return false;
	}
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_FUNCTION_MENU');
	fData.set('COMM_FUNCTION_ID', pk);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(menuGrid);
				
			}
			, function(data){
				
				gf_gridCallback('menuGrid', data);
				
			});
	
}

var f_save = function(){
	var functionData = gf_gridSaveData(functionGrid);
	var menuData = gf_gridSaveData(menuGrid);
	
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
				
				if(functionData.length == 0
				&& menuData.length == 0
				){
				
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');
					return false;
				}
				else{
					
					//기능그리드
					if(functionData.length > 0){
						functionData.unshift({
  							 'TALBE_NAME' : 'COMM_FUNCTION'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('functionGrid', JSON.stringify(functionData));
					}
					
					//메뉴그리드
					if(menuData.length > 0){
						menuData.unshift({
  							 'TALBE_NAME' : 'COMM_MENU_FUNC'
  							,'QUERY_ID' : 'com.COMM_MENU_FUNC'
  						});
  						fData.set('menuGrid', JSON.stringify(menuData));
					}
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