/**
 * 다국어관리
 */
$(document).ready(function() {
	
    masterGrid = gf_gridInit('masterGrid');    
    
    f_search();
});
  	
var f_msgRefresh = function(e){
	
	gf_ajax( {}, null
			, function(data){
				
				if(data.status == 'success'){
				
					gf_toast(gf_mlg('갱신_되었습니다'), 'success');	
				}
				
			},null,null,'/broad/setMlg',true,'get',false);
	 
}
  	
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_MLG');
	gf_ajax({
				QUERY_ID : 'com.S_COMM_MLG',
				p_mlgCode : $('#searchParam1').val()
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
	
	gf_ajax( fData
			, function(){
				
				if(saveData.length == 0){
				
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');
					return false;
				}
				else{
					saveData.unshift({
						 'TALBE_NAME' : 'COMM_MLG'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('masterGrid', JSON.stringify(saveData));
				}
			}
			, function(data){
				
				if(data.result == 'success'){
				
					gf_toast(gf_mlg('저장_되었습니다'), 'success');
					gf_gridClear(masterGrid);
  					f_search();	
				}
				
			}
			, null
			, null
			, '/save');
}