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
		if(gf_nvl(gf_gridRowData(masterGrid, masterGrid.getSelectedRows(), 'VIDEO_NAME'), '') == ''){
			return false;
		}
	}
	, function(data){
		var videoTag = $('source[name=videoSource]').parent()[0];
		videoTag.pause();
		$('source[name=videoSource]').siblings('track').remove();
		
		if(data.result.length > 0){
			
			var files = data.result;
			
			var video = files.find(x=> x.FILE_TYPE == 'VIDEO');
			var subTitles = files.filter(x=> x.FILE_TYPE == 'SUB');
			
			var fileInfo = {
					COMM_FILE_ID : video.COMM_FILE_ID,
					RANDOM_KEY : video.RANDOM_KEY,
			};			
			
			fileInfo = encodeURIComponent(JSON.stringify(fileInfo));
			
			$('source[name=videoSource]').attr('src', '/st/video?fileInfo=' + fileInfo);
			
			$.each(subTitles, function(idx, item){
				
				var subTitleInfo = {
						COMM_FILE_ID : item.COMM_FILE_ID,
						RANDOM_KEY : item.RANDOM_KEY,
				};
				subTitleInfo = encodeURIComponent(JSON.stringify(subTitleInfo));
				
				var track = $('<track>').attr('kind', 'subtitles')
										.attr('srclang', gf_nvl(item.DESCRIPTION, '').toLowerCase())
										.attr('src', '/st/subtitle?subTitleInfo=' + subTitleInfo);
				
				if(item.DESCRIPTION == 'KR'){
					track.attr('label', gf_mlg('한국어'));
				}
				else if(item.DESCRIPTION == 'EN'){
					track.attr('label', gf_mlg('영어'));
				}
				
				if(item.ATTRIBUTE1 == '1'){
					track.attr('default', true);
				}
				
				$('source[name=videoSource]:eq(1)').after(track);
			});
			
			videoTag.load();
			videoTag.play();
		}
		else{
			$('source[name=videoSource]').attr('src', '');
			videoTag.load();
		}
		
		
		
	});
}