/**
 * 사용자관리
 */
$(document).ready(function() {
	
    masterGrid = gf_gridInit('masterGrid');    

});
  	  	
var f_search = function(){
	
	gf_ajax({
	  			QUERY_ID : 'com.S_COMM_USER',
	  			p_loginId : $('#searchParam1').val()
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
	
	if(!(masterData.state == 'success')
	){	
		gf_toast(masterData.reason, 'info');
				
		return false;
	}
		
	var fData = new FormData();
	masterData.data.unshift({
		 'TABLE_NAME' : 'COMM_USER'
		,'QUERY_ID' : 'com.COMM_USER'
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