/**
 * 테이블조회
 */
$(document).ready(function() {
	
    masterGrid = gf_gridInit('masterGrid', {forceFitColumns: false});
    detailGrid = gf_gridInit('detailGrid');
	
    masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
					
		var row = args.rows[0];
		var grid = args.grid;
		var preRow = args.previousSelectedRows[0];
		var selectedRowData = grid.getData().getItem(row);
					
		//상세조회
		f_detailSearch(selectedRowData.TABLE_NAME);
    });
	
});

/*****************************************************************************************************************************************************************
 * 
 * 버튼 기능
 * 
 *****************************************************************************************************************************************************************/  	
var f_search = function(){
	
	gf_ajax({
	  			QUERY_ID : 'com.S_COMM_TABLE',
	  			p_tableNm : $('#searchParam1').val()
			}, function(){
				gf_gridClear(detailGrid);
				gf_gridClear(masterGrid);
			}
			, function(data){
				gf_gridCallback('masterGrid', data);
			});
}

var f_detailSearch = function(p_tableName){
  	
	if(gf_nvl(p_tableName, '') == ''){
		gf_gridClear(detailGrid);
		return false;
	}
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_TABLE_DETAIL');
	fData.set('TABLE_NAME', p_tableName);
	
	gf_ajax( fData
			, function(){
				gf_gridClear(detailGrid);
			}
			, function(data){
				gf_gridCallback('detailGrid', data);
			});
	
}

var f_encrypt = function(){
	var fData = new FormData();

	var selectedRows = masterGrid.getSelectedRows();
	
	if(selectedRows.length == 0){
		gf_toast(gf_mlg('대상을_선택하세요'), 'info');
		return;
	}
	
	var tableName = gf_gridRowData(masterGrid, selectedRows[0], 'TABLE_NAME');
	var tableComment = gf_gridRowData(masterGrid, selectedRows[0], 'COMMENTS')
	
	var confirmTxt = gf_mlg('테이블을_암호화_하시겠습니까',{
		param1 : tableName,
		param2 : tableComment
	});
	
	if(confirm(confirmTxt)){
		
		fData.append('TABLE_NAME', tableName);	
		gf_ajax( fData
				, null
				, function(data){
					if(data.state == 'success'){
						gf_toast(gf_mlg('암호화_되었습니다'), 'success');	
					}else if(data.state == 'no_target'){
						gf_toast(gf_mlg('암호화_대상_컬럼이_없습니다'), 'success');
					}
					
				}
				, null
				, null
				, '/encrypt');
	}

}

var f_decrypt = function(){
	var fData = new FormData();

	var selectedRows = masterGrid.getSelectedRows();
	
	if(selectedRows.length == 0){
		gf_toast(gf_mlg('대상을_선택하세요'), 'info');
		return;
	}
	
	var tableName = gf_gridRowData(masterGrid, selectedRows[0], 'TABLE_NAME');
	var tableComment = gf_gridRowData(masterGrid, selectedRows[0], 'COMMENTS')
	
	var confirmTxt = gf_mlg('테이블을_복호화_하시겠습니까',{
		param1 : tableName,
		param2 : tableComment
	});
	
	if(confirm(confirmTxt)){
		
		fData.append('TABLE_NAME', tableName);	
		gf_ajax( fData
				, null
				, function(data){
					if(data.state == 'success'){
						gf_toast(gf_mlg('복호화_되었습니다'), 'success');	
					}else if(data.state == 'no_target'){
						gf_toast(gf_mlg('복호화_대상_컬럼이_없습니다'), 'success');
					}
					
				}
				, null
				, null
				, '/decrypt');
		
	}
}