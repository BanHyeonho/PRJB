/**
 * 다국어관리
 */
$(document).ready(function() {
	
    masterGrid = gf_gridInit('masterGrid', {forceFitColumns: false});    
    
    f_search();
});

/*****************************************************************************************************************************************************************
 * 
 * 버튼 기능
 * 
 *****************************************************************************************************************************************************************/
var f_msgRefresh = function(e){
	
	gf_ajax( {}, function(){
		
				var masterData = gf_gridSaveData(masterGrid);
				
				if(masterData.state != 'empty'){
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_진행_하시겠습니까?'))){
						return false;
					}
				}
				return true;
			}
			, function(data){
				
				gf_toast(gf_mlg('갱신_되었습니다'), 'success');	
				
			},null,null,'/broad/setMlg',true,'get',false);
	 
}
  	
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_MLG');
	gf_ajax({
				QUERY_ID : 'com.S_COMM_MLG',
				p_mlgCode : $('#searchParam1').val()
			}, function(){
				
				var masterData = gf_gridSaveData(masterGrid);
				
				if(masterData.state != 'empty'){
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						return false;
					}
				}
				gf_gridClear(masterGrid);
			}
			, function(data){
				
				gf_gridCallback('masterGrid', data);
			});
}
  	
var f_save = function(){
	
	var masterData = gf_gridSaveData(masterGrid);
	var fData = new FormData();
	masterData.data.unshift({
		 'TABLE_NAME' : 'COMM_MLG'
		,'QUERY_ID' : 'com.COMM_QUERY'
	});
	fData.set('masterGrid', JSON.stringify(masterData.data));
	
	gf_ajax( fData
			, null
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(masterGrid);
				f_search();
				
			}
			, null
			, null
			, '/save');
}