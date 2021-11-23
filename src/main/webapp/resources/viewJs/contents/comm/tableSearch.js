/**
 * 테이블조회
 */
$(document).ready(function() {
	
    masterGrid = gf_gridInit('masterGrid');
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
