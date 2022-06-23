/**
 * 권한그룹관리
 */
$(document).ready(function() {
    
	//그리드셋팅
	f_setGroupGrid();
	f_setUserGrid();
	
    f_search();
});

/*****************************************************************************************************************************************************************
 * 
 * 그리드 셋팅
 * 
 *****************************************************************************************************************************************************************/
var f_setGroupGrid = function(){
	groupGrid = gf_gridInit('groupGrid', {
		forceFitColumns: true,
		'addRowBefore' : function(){
			var userData = gf_gridSaveData(userGrid);
			if(userData.state == 'empty'){
				return true;
			}
			else{
				gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
				return false;
			}
			
		}
	});
    
	groupGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		var userData = gf_gridSaveData(userGrid);
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(userData.state != 'empty' 
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
				
		//권한별 사용자조회
		f_userSearch();
    });
}

var f_setUserGrid = function(){
	
	userGrid = gf_gridInit('userGrid', {
		forceFitColumns: true,
		'addRowBefore' : function(){
			var groupData = gf_gridSaveData(groupGrid);
			if(groupData.state == 'empty'){
				return true;
			}
			else{
				gf_toast(gf_mlg('저장_후_진행하여_주시기_바랍니다'), 'info');
				return false;
			}
			
		},
    	'defaultInsert' : {'COMM_AUTH_GROUP_ID' : function(){return gf_gridSelectVal(groupGrid, 'COMM_AUTH_GROUP_ID')}}
    });
}



var f_userSearch = function(){

	var COMM_AUTH_GROUP_ID = gf_nvl( gf_gridSelectVal(groupGrid, 'COMM_AUTH_GROUP_ID') , '');
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP_USER');
	fData.set('COMM_AUTH_GROUP_ID', COMM_AUTH_GROUP_ID);
	
	gf_ajax( fData
			, function(){
				
				gf_gridClear(userGrid);
				if(COMM_AUTH_GROUP_ID == ''){
					return false;
				}
//				gf_delFormData(fData);
			}
			, function(data){
				
				gf_gridCallback('userGrid', data);
								
			});
	
}
/*****************************************************************************************************************************************************************
 * 
 * 버튼 기능
 * 
 *****************************************************************************************************************************************************************/
	
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_AUTH_GROUP');
	gf_ajax( fData
			, function(){
				
		var groupData = gf_gridSaveData(groupGrid);
		var userData = gf_gridSaveData(userGrid);
		
				if(groupData.state != 'empty'
				|| userData.state != 'empty'
				){
				
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
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
	
	if(!(groupData.state == 'success')
	&& !(userData.state == 'success')
			){
				
				if( groupData.state == 'fail'){
					gf_toast(groupData.reason, 'info');
				}
				else if(userData.state == 'fail'){
					gf_toast(userData.reason, 'info');
				}
				else{
					gf_toast(groupData.reason, 'info');
				}
				
				return false;
			}
	
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
				
				if(groupData.data.length > 0){
					groupData.data.unshift({
						 'TABLE_NAME' : 'COMM_AUTH_GROUP'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('groupGrid', JSON.stringify(groupData.data));
				}
				
				if(userData.data.length > 0){
					userData.data.unshift({
						 'TABLE_NAME' : 'COMM_AUTH_GROUP_USER'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('userGrid', JSON.stringify(userData.data));
				}
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(groupGrid);
				gf_gridClear(userGrid);
				f_search();
			}
			, null
			, null
			, '/save');
}