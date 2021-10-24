/**
 * 권한그룹관리
 */
var gridPk = function(){
	this.COMM_AUTH_GROUP_ID;
};
$(document).ready(function() {
    groupGrid = gf_gridInit('groupGrid');
    
	groupGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(gf_gridSaveData(userGrid).length > 0
				){
				
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;
				groupGrid.setSelectedRows(args.previousSelectedRows);
				return false;
			}
		}
		else if(args.rows.length == 0){
			return false;
		}
		
		var row = args.rows[0];
		var grid = args.grid;
		var preRow = args.previousSelectedRows[0];
		var selectedRowData = grid.getData().getItem(row);
		var pk = selectedRowData.COMM_AUTH_GROUP_ID;
		
		gridPk.prototype.constructor.COMM_AUTH_GROUP_ID = pk;
		
		//권한별 사용자조회
		f_userSearch(pk, preRow);
    });

	userGrid = gf_gridInit('userGrid', {
    	'defaultInsert' : {'COMM_AUTH_GROUP_ID' : gridPk}
    });

    $('#searchBtn').on('click', f_search);
    $('#saveBtn').on('click', f_save);
    
    f_search();
});

var f_userSearch = function(pk, preRow){

	if(gf_nvl(pk, '') == ''){
		gf_gridClear(userGrid);
		return false;
	}
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP_USER');
	fData.set('COMM_AUTH_GROUP_ID', pk);
	
	gf_ajax( fData
			, function(){
				
				gf_gridClear(userGrid);
				
			}
			, function(data){
				
				gf_gridCallback('userGrid', data);
								
			});
	
}

	
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP');
	gf_ajax( fData
			, function(){
				
				if(gf_gridSaveData(groupGrid).length > 0
				|| gf_gridSaveData(userGrid).length > 0
				){
				
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						gridEventIgnore = true;
						return false;
					}
				}
				gf_gridClear(groupGrid);
				gf_gridClear(userGrid);
			}
			, function(data){
				
				gf_gridCallback('groupGrid', data);
								
			});
}
  	
var f_save = function(){
	
	var groupData = gf_gridSaveData(groupGrid);
	var userData = gf_gridSaveData(userGrid);
	
	
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
				
				if(groupData.length == 0
				&& userData.length == 0
				){
				
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');
					return false;
				}
				else{
				
					if(groupData.length > 0){
						groupData.unshift({
							 'TALBE_NAME' : 'COMM_AUTH_GROUP'
							,'QUERY_ID' : 'com.COMM_QUERY'
						});
						fData.set('groupGrid', JSON.stringify(groupData));
					}
					
					if(userData.length > 0){
						userData.unshift({
							 'TALBE_NAME' : 'COMM_AUTH_GROUP_USER'
							,'QUERY_ID' : 'com.COMM_QUERY'
						});
						fData.set('userGrid', JSON.stringify(userData));
					}
					
				}
			}
			, function(data){
				
				if(data.result == 'success'){
				
					gf_toast(gf_mlg('저장_되었습니다'), 'success');
					gf_gridClear(groupGrid);
					gf_gridClear(userGrid);
  					f_search();
				}
			}
			, null
			, null
			, '/save');
}