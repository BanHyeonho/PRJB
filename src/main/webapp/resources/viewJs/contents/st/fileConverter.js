/**
 * 파일변환
 */
$(document).ready(function() {
	f_setWaitGrid();
	f_setProcessingGrid();
	f_setCompleteGrid();
	
});
/*****************************************************************************************************************************************************************
 * 
 * 그리드 셋팅
 * 
 *****************************************************************************************************************************************************************/
var f_setWaitGrid = function(){

	waitGrid = gf_gridInit('waitGrid', {forceFitColumns: false});

}
var f_setProcessingGrid = function(){

	processingGrid = gf_gridInit('processingGrid', {forceFitColumns: false});

}
var f_setCompleteGrid = function(){

	completeGrid = gf_gridInit('completeGrid', {forceFitColumns: false});

}

/*****************************************************************************************************************************************************************
 * 
 * 버튼 기능
 * 
 *****************************************************************************************************************************************************************/
//조회
var f_search = function(){
	
	f_searchGrid('WAIT', 'waitGrid');
	f_searchGrid('PROCESSING', 'processingGrid');
	f_searchGrid('COMPLETE', 'completeGrid');
}

var f_searchGrid = function(p_type, p_gridName){
	gf_ajax({
			QUERY_ID : 'st.S_ST_FILE_CONVERT',
			STATE_CODE : p_type,
			MENU_NAME : $('#MENU_NAME').val(),
			USER_NAME : $('#USER_NAME').val()
	}, function(){
		new Function('return ' + p_gridName)().setSelectedRows([]);
		gf_gridClear( new Function('return ' + p_gridName)() );
	}
	, function(data){
		gf_gridCallback(p_gridName, data);
	});
}

//승인
var f_approve = function(){
	
	f_approveExec(waitGrid, 'APPROVE');
}

//승인취소
var f_approveCancel = function(){
	f_approveExec(processingGrid, 'CANCEL');
}

var f_approveExec = function(p_grid, p_type){
	
	var rows = p_grid.getSelectedRows();
	
	var stateCode;
	var confirmMsg;
	var selectMsg;
	
	if(p_type == 'APPROVE'){
		stateCode = 'PROCESSING';
		selectMsg = gf_mlg('승인_처리할_파일을_선택하세요');
		confirmMsg = gf_mlg('_개의_파일을_승인_하시겠습니까',{
			param : rows.length
		});
	}
	else if(p_type == 'CANCEL'){
		stateCode = 'WAIT';
		selectMsg = gf_mlg('승인_취소할_파일을_선택하세요');
		confirmMsg = gf_mlg('_개의_파일을_승인_취소_하시겠습니까',{
			param : rows.length
		});
	}
	
	if(rows.length == 0){
		gf_toast(selectMsg, 'info');
		return;
	}
	
	if(confirm(confirmMsg)){
	
		var ids = [];
		$.each(rows, function(idx, item){
			ids.push( gf_gridRowData(p_grid, item, 'ST_FILE_CONVERT_ID') );
		});
		
		
		gf_ajax({
				QUERY_ID : 'st.U_ST_FILE_CONVERT',
				STATE_CODE : stateCode,
				ST_FILE_CONVERT_ID : ids.join('[@;,;@]')
		}, null
		, function(data){
			gf_toast(gf_mlg('처리_되었습니다'), 'success');
			f_search();
		});
		
	}
	
}


var f_converter = function(){
	
	var rows = processingGrid.getSelectedRows();
	
	var confirmMsg = gf_mlg('_개의_파일을_변환_하시겠습니까',{
		param : rows.length
	});
	var selectMsg = gf_mlg('변환할_파일을_선택하세요');
	
	if(rows.length == 0){
		gf_toast(selectMsg, 'info');
		return;
	}
	
	if(confirm(confirmMsg)){
		var fData = new FormData();
		
		var ids = [];
		$.each(rows, function(idx, item){
			ids.push( gf_gridRowData(processingGrid, item, 'ST_FILE_CONVERT_ID') );
		});
		
		fData.set('IDS', ids.join('[@;,;@]'));
		gf_ajax( fData
				, null
				, function(data){
					if(data.state == 'success'){
						gf_toast(gf_mlg('처리_되었습니다'), 'success');
					}
					else{
						gf_toast(gf_mlg('에러가_발생하였습니다'), 'danger');
					}
					f_search();
				}
				, null
				, null
				, '/st/convert');
	}
	
}
