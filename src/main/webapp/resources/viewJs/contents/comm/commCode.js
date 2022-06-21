/**
 * 공통코드관리
 */
var detailGridDefaultColumns = []; 
$(document).ready(function() {
	
	//그리드셋팅
	f_setMasterGrid();
	f_setDetailGrid();
	
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
			var detailData = gf_gridSaveData(detailGrid);
			
			if(detailData.state == 'empty'){
				return true;
			}
			else{
				gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
				return false;
			}	
		},
    	'defaultInsert' : {'USE_YN' : '1'
    					, 'SYSTEM_CODE_YN' : '1'}
    });
	
	masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		var detailData = gf_gridSaveData(detailGrid);
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(detailData.state != 'empty' 
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
		f_detailSearch();
    });

}

var f_setDetailGrid = function(){

	detailGrid = gf_gridInit('detailGrid', {
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
    	'defaultInsert' : {'USE_YN' : '1'
    					,'COMM_CODE_MASTER_ID' : function(){return gf_gridSelectVal(masterGrid, 'COMM_CODE_MASTER_ID')}
    					,'MASTER_CODE' : function(){return gf_gridSelectVal(masterGrid, 'MASTER_CODE')}
    					}
    });
	
	detailGridDefaultColumns = $.extend(true, [], detailGrid.getColumns());

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
		fData.set('TABLE_NAME', 'COMM_CODE_MASTER');
		fData.set('MLG_COLUMN', 'MLG_CODE');
		fData.set('COMPARE_COLUMN', 'CODE_YN');
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
var f_mlg_regist2 = function(){
	if(confirm(gf_mlg('다국어를_등록하시겠습니까?'))){
		var fData = new FormData();
		fData.set('QUERY_ID', 'com.P_MLG_BATCH_REGIST');
		fData.set('TABLE_NAME', 'COMM_CODE_DETAIL');
		fData.set('MLG_COLUMN', 'MLG_CODE');
		fData.set('COMPARE_COLUMN', 'CODE_YN');
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
var f_search = function(type){
	
	gf_ajax({
				QUERY_ID : 'com.S_COMM_CODE_MASTER',
				p_masterCode : $('#searchParam1').val()
			}, function(){
				
				var masterData = gf_gridSaveData(masterGrid);
				var detailData = gf_gridSaveData(detailGrid);
				
				if(masterData.state != 'empty'
				|| detailData.state != 'empty'
				){
				
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						gridEventIgnore = true;
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
  	
var f_detailSearch = function(){

	var COMM_CODE_MASTER_ID = gf_nvl( gf_gridSelectVal(masterGrid, 'COMM_CODE_MASTER_ID') , '');
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_CODE_DETAIL');
	fData.set('COMM_CODE_MASTER_ID', COMM_CODE_MASTER_ID);
	
	gf_ajax( fData
			, function(){
		
				detailGrid.setColumns(detailGridDefaultColumns);
				gf_gridClear(detailGrid);
				
				if(COMM_CODE_MASTER_ID == ''){
					return false;
				}
				
			}
			, function(data){

				//컬럼명 변경
				var masterCol = masterGrid.getData().getItem(masterGrid.getSelectedRows());
				var attrCol = Object.keys( masterCol ).filter( x=> x.indexOf('ATTRIBUTE') > -1);
				var detailCol = $.extend(true, [], detailGrid.getColumns());
				
				$.each(attrCol, function(idx, item){
					detailCol.find(x=> x.field == item).name = masterCol[item];
				});
				detailGrid.setColumns(detailCol);
				//데이터조회
				gf_gridCallback('detailGrid', data);
								
			});
	
}

var f_save = function(){
	
	var masterData = gf_gridSaveData(masterGrid);
	var detailData = gf_gridSaveData(detailGrid);
	
	$.each(detailData.data, function(idx, item){
		item['MASTER_DETAIL_CODE'] = item['MASTER_CODE'] + item['DETAIL_CODE'];
	});
	
	if(!(masterData.state == 'success')
	&& !(detailData.state == 'success')
	){
		
		if( masterData.state == 'fail'){
			gf_toast(masterData.reason, 'info');
		}
		else if(detailData.state == 'fail'){
			gf_toast(detailData.reason, 'info');
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
						 'TABLE_NAME' : 'COMM_CODE_MASTER'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('masterGrid', JSON.stringify(masterData.data));
				}
				
				//디테일그리드
				if(detailData.data.length > 0){
					detailData.data.unshift({
						 'TABLE_NAME' : 'COMM_CODE_DETAIL'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('detailGrid', JSON.stringify(detailData.data));
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