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
				
				if(gf_gridSaveData(masterGrid).length > 0){
				
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
						 'TALBE_NAME' : 'COMM_USER'
						,'QUERY_ID' : 'com.COMM_USER'
					});
					fData.set('masterGrid', JSON.stringify(saveData));
				}
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(masterGrid);
				f_search();	
				
			}
			, null
			, null
			, '/save');
}