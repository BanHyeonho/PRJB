/**
 * 영상시청
 */
$(document).ready(function() {
	
    masterGrid = gf_gridInit('masterGrid');    

});
  	  	
var f_search = function(){
	
	gf_ajax({
	  			QUERY_ID : 'com.S_COMM_USER',
	  			p_loginId : $('#searchParam1').val()
			}, function(){
				gf_gridClear(masterGrid);
			}
			, function(data){
				
				gf_gridCallback('masterGrid', data);
				
			});
}
