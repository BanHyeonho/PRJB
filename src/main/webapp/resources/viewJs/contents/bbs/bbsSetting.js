/**
 * 게시판 설정
 */
$(document).ready(function() {
	
	//그리드셋팅
	f_setModuleGrid();
	f_setCategoryGrid();
	f_setBbsAuthGrid();
	
	f_search();
});

/*****************************************************************************************************************************************************************
 * 
 * 그리드 셋팅
 * 
 *****************************************************************************************************************************************************************/
var f_setModuleGrid = function(){
	moduleGrid = gf_gridInit('moduleGrid');
	
	moduleGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		var categoryData = gf_gridSaveData(categoryGrid);
		var bbsAuthData = gf_gridSaveData(bbsAuthGrid);
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(categoryData.state != 'empty' 
			 || bbsAuthData.state != 'empty'
			){
		
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;	
				moduleGrid.setSelectedRows(args.previousSelectedRows);
				return false;
			}
		}
		else if(args.rows.length == 0){
			return false;
		}
		
		//카테고리그리드 조회
		f_categoryGridSearch();
    });
	
}
var f_setCategoryGrid = function(){
	categoryGrid = gf_gridInit('categoryGrid',{
		forceFitColumns: false,
    	'defaultInsert' : {'MODULE_CODE' : function(){return gf_gridSelectVal(moduleGrid, 'MODULE_CODE')}
							,'MODULE_NAME' : function(){return gf_gridSelectVal(moduleGrid, 'MODULE_NAME')}
							,'USE_YN' : '1'}
	});
	
	categoryGrid.onSelectedRowsChanged.subscribe(function (e, args) {
		
		var bbsAuthData = gf_gridSaveData(bbsAuthGrid);
		
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if(bbsAuthData.state != 'empty'
			){
		
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;	
				categoryGrid.setSelectedRows(args.previousSelectedRows);
				return false;
			}
		}
		else if(args.rows.length == 0){
			return false;
		}
		
		//권한그룹그리드 조회
		f_bbsAuthGridSearch();
    });

}
var f_setBbsAuthGrid = function(){
	bbsAuthGrid = gf_gridInit('bbsAuthGrid',{
		forceFitColumns: false
    });
	
}

/*****************************************************************************************************************************************************************
 * 
 * 버튼 기능
 * 
 *****************************************************************************************************************************************************************/
var f_save = function(){
	
	var categoryData = gf_gridSaveData(categoryGrid);
	var bbsAuthData = gf_gridSaveData(bbsAuthGrid);
	
	if(!(categoryData.state == 'success')
	&& !(bbsAuthData.state == 'success')
	){
		
		if( categoryData.state == 'fail'){
			gf_toast(categoryData.reason, 'info');
		}
		else if(bbsAuthData.state == 'fail'){
			gf_toast(bbsAuthData.reason, 'info');
		}
		else{
			gf_toast(categoryData.reason, 'info');
		}
		
		return false;
	}
	
	var fData = new FormData();

	gf_ajax( fData
			, function(){
				
					
				//카테고리 그리드
				if(categoryData.data.length > 0){
					categoryData.data.unshift({
						 'TABLE_NAME' : 'BBS_SETTING'
						,'QUERY_ID' : 'com.COMM_QUERY'
					});
					fData.set('categoryGrid', JSON.stringify(categoryData.data));
				}
				
				//권한그룹 그리드
				if(bbsAuthData.data.length > 0){
					bbsAuthData.data.unshift({
						 'QUERY_ID' : 'bbs.BBS_AUTH'
					});
					fData.set('bbsAuthGrid', JSON.stringify(bbsAuthData.data));
				}
			
				
			}
			, function(data){
				
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				gf_gridClear(moduleGrid);
				gf_gridClear(categoryGrid);
				gf_gridClear(bbsAuthGrid);
				
				f_search();	
				
			}
			, null
			, null
			, '/save');
}
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'bbs.S_BBS_MODULE');
	gf_ajax( fData
			, function(){
				
				var categoryData = gf_gridSaveData(categoryGrid);
				var bbsAuthData = gf_gridSaveData(bbsAuthGrid);
		
				if(categoryData.state != 'empty'
				|| bbsAuthData.state != 'empty'
				){
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						return false;
					}
				}
				
				gf_gridClear(moduleGrid);
				gf_gridClear(categoryGrid);
				gf_gridClear(bbsAuthGrid);
				
			}
			, function(data){
				
				gf_gridCallback('moduleGrid', data);
				
			});
	
}
var f_categoryGridSearch = function(){
	
	var MODULE_CODE = gf_nvl( gf_gridSelectVal(moduleGrid, 'MODULE_CODE') , '');
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'bbs.S_BBS_SETTING');
	fData.set('MODULE_CODE', MODULE_CODE);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(categoryGrid);
				gf_gridClear(bbsAuthGrid);
				
				if(MODULE_CODE == ''){
					return false;
				}
				
			}
			, function(data){
				
				gf_gridCallback('categoryGrid', data);
				
			});
	
}

var f_bbsAuthGridSearch = function(){
	
	var BBS_SETTING_ID = gf_nvl( gf_gridSelectVal(categoryGrid, 'BBS_SETTING_ID') , '');
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'bbs.S_BBS_AUTH');
	fData.set('BBS_SETTING_ID', BBS_SETTING_ID);
	
	gf_ajax( fData
			, function(){
		
				gf_gridClear(bbsAuthGrid);
				
				if(BBS_SETTING_ID == ''){
					return false;
				}
				
			}
			, function(data){
				
				gf_gridCallback('bbsAuthGrid', data);
				
			});
	
}
