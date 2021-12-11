/**
 * 영상시청
 */
$(document).ready(function() {
	
    f_setMasterGrid();
    
});

var f_setMasterGrid = function(){
	masterGrid = gf_gridInit('masterGrid');
	
	masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		f_showVideo();
    });
	
}

var f_search = function(){
	
	gf_ajax({
	  			QUERY_ID : 'st.S_ST_VIDEO_VIEW_FILE',
//	  			p_loginId : $('#searchParam1').val()
			}, function(){
				gf_gridClear(masterGrid);
			}
			, function(data){
				
				gf_gridCallback('masterGrid', data);
				
			});
}

var f_showVideo = function(){
	
	gf_ajax({
			QUERY_ID : 'st.S_MAPPING_FILE',
			ST_VIDEO_ID : gf_gridRowData(masterGrid, masterGrid.getSelectedRows(), 'ST_VIDEO_ID')
	}, function(){
//		gf_gridClear(masterGrid);
	}
	, function(data){
		var videoTag = $('#videoSource').parent()[0];
		videoTag.pause();
		
		if(data.result.length > 0){
			
			var files = data.result;
			
			var video = files.find(x=> x.FILE_EXTENSION.toLowerCase() == 'mp4');
			var subTitles = files.filter(x=> x.FILE_EXTENSION.toLowerCase() == 'vtt');
			
			var fileInfo = {
					COMM_FILE_ID : video.COMM_FILE_ID,
					RANDOM_KEY : video.RANDOM_KEY,
			};			
			
			fileInfo = encodeURIComponent(JSON.stringify(fileInfo));
			
			$('#videoSource').attr('src', '/st/video?fileInfo=' + fileInfo);
			
		}
		else{
			$('#videoSource').attr('src', '');
		}
		
		videoTag.load();
		videoTag.play();
		
	});
}