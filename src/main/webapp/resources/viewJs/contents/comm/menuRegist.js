/**
 * 테이블조회
 */
$(document).ready(function() {
    masterGrid = gf_gridInit('masterGrid', {
    	'defaultInsert' : {'USE_YN' : '1'}
    });
    
    $('#searchBtn').on('click', f_search);
    $('#saveBtn').on('click', f_save);
    $('#mlgRegistBtn').on('click', f_mlg_regist);
    
    f_search();
});
  	
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
				
				if(gf_gridSaveData(masterGrid).length > 0){
				
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						return false;
					}
				}
				gf_gridClear(masterGrid);
			}
			, function(data){
				
				masterGridIdx = data.result.length;
				masterGrid.getData().setItems(data.result);
				masterGrid.invalidate();
				masterGrid.updateRowCount(); //로우 카운트 업데이트
				masterGrid.render(); //다시 그리기
			});
}
  	
var f_save = function(){
	
	var saveData = gf_gridSaveData(masterGrid);
	
	var fData = new FormData();
	fData.set('masterGrid', JSON.stringify(saveData));
	gf_ajax( fData
			, function(){
				
				if(saveData.length == 0){
				
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');
					return false;
				}
				else{
					saveData.unshift({
						 'TALBE_NAME' : 'COMM_MENU'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('masterGrid', JSON.stringify(saveData));
				}
			}
			, function(data){
				
				if(data.result == 'success'){
				
					gf_toast(gf_mlg('저장_되었습니다'), 'success');
					gf_gridClear(masterGrid);
  					f_search('saveAfter');
				}
			}
			, null
			, null
			, '/save');
}