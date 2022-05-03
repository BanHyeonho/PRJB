/**
 * 공통코드관리
 */
var gridPk = function(){
	this.COMM_CODE_MASTER_ID;
	this.MASTER_CODE;
};
	
$(document).ready(function() {
	masterGrid = gf_gridInit('masterGrid', {
		forceFitColumns: false,
    	'defaultInsert' : {'USE_YN' : '1'}
    });
	detailGrid = gf_gridInit('detailGrid', {
		forceFitColumns: false,
    	'defaultInsert' : {'USE_YN' : '1'
    					,'COMM_CODE_MASTER_ID' : gridPk
    					,'MASTER_CODE' : gridPk
    					}
    });
	
	masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(detailGrid).length > 0
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
		var pk = selectedRowData.COMM_CODE_MASTER_ID;
		var pk2 = selectedRowData.MASTER_CODE;
		
		gridPk.prototype.constructor.COMM_CODE_MASTER_ID = pk;
		gridPk.prototype.constructor.MASTER_CODE = pk2;
		
		//상세조회
		f_detailSearch(pk, preRow);
    });
	   
    f_search();
});

//다국어등록
var f_mlg_regist = function(){

	if(confirm(gf_mlg('다국어를_등록하시겠습니까?'))){
		var fData = new FormData();
		fData.set('QUERY_ID', 'com.P_MLG_BATCH_REGIST');
		fData.set('TABLE_NAME', 'COMM_CODE_MASTER');
		fData.set('MLG_COLUMN', 'MLG_CODE');
		fData.set('COMPARE_COLUMN', 'CODE_YN');
  		gf_ajax( fData
  				, null
  				, function(data){
  					
  					gf_toast(gf_mlg('저장_되었습니다'), 'success');
					
				});
	}
}
var f_mlg_regist2 = function(){
	if(confirm(gf_mlg('다국어를_등록하시겠습니까?'))){
		var fData = new FormData();
		fData.set('QUERY_ID', 'com.P_MLG_BATCH_REGIST');
		fData.set('TABLE_NAME', 'COMM_CODE_DETAIL');
		fData.set('MLG_COLUMN', 'MLG_CODE');
		fData.set('COMPARE_COLUMN', 'CODE_YN');
  		gf_ajax( fData
  				, null
  				, function(data){
  					
  					gf_toast(gf_mlg('저장_되었습니다'), 'success');
					
				});
	}
}
var f_search = function(type){
	
	gf_ajax({
				QUERY_ID : 'com.S_COMM_CODE_MASTER',
				p_masterCode : $('#searchParam1').val()
			}, function(){
				
				if((gf_gridSaveData(masterGrid).length > 0
				|| gf_gridSaveData(detailGrid).length > 0 )
				){
				
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						return false;
					}
				}

				gf_gridClear(masterGrid);
				gf_gridClear(detailGrid);
			}
			, function(data){
				
				gf_gridCallback('masterGrid', data);
				
			});
}
  	
var f_detailSearch = function(pk, preRow){

	if(gf_nvl(pk, '') == ''){
		gf_gridClear(detailGrid);
		return false;
	}
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_CODE_DETAIL');
	fData.set('COMM_CODE_MASTER_ID', pk);
	
	gf_ajax( fData
			, function(){
				
				gf_gridClear(detailGrid);
				
			}
			, function(data){
				
				gf_gridCallback('detailGrid', data);
								
			});
	
}
  	
  	
var f_save = function(){
	
	var masterData = gf_gridSaveData(masterGrid);
	var detailData = gf_gridSaveData(detailGrid);
	$.each(detailData, function(idx, item){
		item['MASTER_DETAIL_CODE'] = item['MASTER_CODE'] + item['DETAIL_CODE']; 
	});
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
				
				if(masterData.length == 0 && detailData.length == 0){
				
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');
					return false;
				}
				else{
					
					//마스터그리드
					if(masterData.length > 0){
						masterData.unshift({
  							 'TABLE_NAME' : 'COMM_CODE_MASTER'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('masterGrid', JSON.stringify(masterData));
					}
					
					//디테일그리드
					if(detailData.length > 0){
						detailData.unshift({
  							 'TABLE_NAME' : 'COMM_CODE_DETAIL'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('detailGrid', JSON.stringify(detailData));
					}
					
				}
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(masterGrid);
				gf_gridClear(detailGrid);
				f_search();
				
			}
			, null
			, null
			, '/save');
}