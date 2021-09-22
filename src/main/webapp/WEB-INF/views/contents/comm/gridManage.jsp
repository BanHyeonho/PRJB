<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page session="false"%>
<%@ include file="../../include.jsp"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "그리드 관리")}</title>
</head>
<%@ include file="../../gridData.jsp"%>
<script type="text/javascript">

	var gridPk = function(){
		this.MENU_CODE;
		this.MENU_NAME;
		this.COMM_GRID_MASTER_ID;
		this.COMM_GRID_DETAIL_ID;
	};
	
	$(document).ready(function() {
		
		menuGrid = gf_gridInit('menuGrid');
		
		masterGrid = gf_gridInit('masterGrid', {
	    	'defaultInsert' : {'MENU_CODE' : gridPk
	    						,'MENU_NAME' : gridPk
	    						,'FILTER_YN' : '1'
	    						, 'SORT_YN' : '1'
	    						, 'TREE_YN' : '0'}
	    });
		contextGrid = gf_gridInit('contextGrid');
		
		detailGrid = gf_gridInit('detailGrid',{
	    	'defaultInsert' : {'USE_YN' : '1'
	    					,'REQUIRE_YN' : '0'
    						,'FIXED_YN' : '0'
 							,'WIDTH' : '100'
   							,'TEXT_ALIGN' : 'CENTER'
	    					,'COMM_GRID_MASTER_ID' : gridPk
	    					}
	    });
		
// 		settingGrid = gf_gridInit('settingGrid',{
// 	    	'defaultInsert' : {'USE_YN' : '1'
// 	    					 ,'COMM_GRID_DETAIL_ID' : gridPk}
// 	    });
		
		
		menuGrid.onSelectedRowsChanged.subscribe(function (e, args) {
			
			if(gridEventIgnore){
				gridEventIgnore = false;
				return false;
			}
			else if(gf_gridSaveData(masterGrid).length > 0
			|| gf_gridSaveData(detailGrid).length > 0 
			|| gf_gridSaveData(settingGrid).length > 0
			){
				if(!confirm('${pb:msg(pageContext.request, "수정된_데이터를_저장하지_않고,_조회_하시겠습니까?")}')){
					gridEventIgnore = true;	
					menuGrid.setSelectedRows(args.previousSelectedRows);
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
			var pk = selectedRowData.MENU_CODE;
			
			gridPk.prototype.constructor.MENU_NAME = selectedRowData.MENU_NAME;
			gridPk.prototype.constructor.MENU_CODE = pk;
			
			//마스터 조회
			f_masterSearch(pk, preRow);
	    });
	    
		masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
			
			if(gridEventIgnore){
				gridEventIgnore = false;
				return false;
			}
			else if(gf_gridSaveData(detailGrid).length > 0
				 || gf_gridSaveData(contextGrid).length > 0
				 || gf_gridSaveData(settingGrid).length > 0
					){
				if(!confirm('${pb:msg(pageContext.request, "수정된_데이터를_저장하지_않고,_조회_하시겠습니까?")}')){
					gridEventIgnore = true;	
					masterGrid.setSelectedRows(args.previousSelectedRows);
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
			var pk = selectedRowData.COMM_GRID_MASTER_ID;
			gridPk.prototype.constructor.COMM_GRID_MASTER_ID = pk;
			
			//상세조회
			f_contextSearch(pk, preRow);
			
			//상세조회
			f_detailSearch(pk, preRow);
	    });
		
		detailGrid.onSelectedRowsChanged.subscribe(function (e, args) {
			
			if(gridEventIgnore){
				gridEventIgnore = false;
				return false;
			}
			else if(gf_gridSaveData(settingGrid).length > 0
					){
				if(!confirm('${pb:msg(pageContext.request, "수정된_데이터를_저장하지_않고,_조회_하시겠습니까?")}')){
					gridEventIgnore = true;	
					detailGrid.setSelectedRows(args.previousSelectedRows);
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
			var pk = selectedRowData.COMM_GRID_DETAIL_ID;
			gridPk.prototype.constructor.COMM_GRID_DETAIL_ID = pk;
			
			//상세조회
// 			f_settingSearch(pk, preRow);
			
	    });
	    
	    $('#searchBtn').on('click', f_search);
	    $('#saveBtn').on('click', f_save);
	    f_search();
  	});
	
	
	
  	var f_search = function(){
  		
  		var fData = new FormData();
		fData.set('QUERY_ID', 'com.S_GRID_MANAGE_MENU');
  		gf_ajax( fData
  				, function(){
  					
  					if((gf_gridSaveData(masterGrid).length > 0
  					|| gf_gridSaveData(detailGrid).length > 0
  					|| gf_gridSaveData(contextGrid).length > 0
  					|| gf_gridSaveData(settingGrid).length > 0
  					)
  					){
  						if(!confirm('${pb:msg(pageContext.request, "수정된_데이터를_저장하지_않고,_조회_하시겠습니까?")}')){
  							return false;
  						}
  					}
  					
  					gf_gridClear(masterGrid);
  					gf_gridClear(detailGrid);
  					gf_gridClear(contextGrid);
  					gf_gridClear(settingGrid);
  					
  				}
  				, function(data){
  					
  					menuGrid.getData().setItems(data.result);
					menuGrid.invalidate();
					menuGrid.updateRowCount(); //로우 카운트 업데이트
					menuGrid.render(); //다시 그리기
					
					if(menuGrid.getSelectedRows().length > 0
					&& Math.max.apply(null, menuGrid.getSelectedRows()) < menuGrid.getData().getItemCount() ){
						var args = {
								rows : menuGrid.getSelectedRows(),
								grid : menuGrid,
								previousSelectedRows : menuGrid.getSelectedRows()
						}
						menuGrid.onSelectedRowsChanged.notify(args);	
					}
					else{
						menuGrid.getSelectionModel().setSelectedRanges("");
					}
					
				});
  		
  	}
  	
	var f_masterSearch = function(pk, preRow){
		
		var fData = new FormData();
		fData.set('QUERY_ID', 'com.S_COMM_GRID_MASTER');
		fData.set('MENU_CODE', pk);
		
  		gf_ajax( fData
  				, function(){
  					
  					gf_gridClear(masterGrid);
  					gf_gridClear(contextGrid);
  					gf_gridClear(detailGrid);
  					gf_gridClear(settingGrid);
  					
  				}
  				, function(data){
  					
  					masterGridIdx = data.result.length;
  					masterGrid.getData().setItems(data.result);
					masterGrid.invalidate();
					masterGrid.updateRowCount(); //로우 카운트 업데이트
					masterGrid.render(); //다시 그리기
					
					if(masterGrid.getSelectedRows().length > 0
					&& Math.max.apply(null, masterGrid.getSelectedRows()) < masterGrid.getData().getItemCount() ){
						var args = {
								rows : masterGrid.getSelectedRows(),
								grid : masterGrid,
								previousSelectedRows : masterGrid.getSelectedRows()
						}
						masterGrid.onSelectedRowsChanged.notify(args);	
					}
					else{
						masterGrid.getSelectionModel().setSelectedRanges("");
					}
					
				});
  		
	}
	
	var f_contextSearch = function(pk, preRow){
	  	
  		if(gf_nvl(pk, '') == ''){
  			gf_gridClear(contextGrid);
  			return false;
  		}
  		var fData = new FormData();
		fData.set('QUERY_ID', 'com.S_COMM_GRID_CONTEXT');
		fData.set('COMM_GRID_MASTER_ID', pk);
		
  		gf_ajax( fData
  				, function(){
  			
  					gf_gridClear(contextGrid);
  					
  				}
  				, function(data){
  					
  					contextGridIdx = data.result.length;
  					contextGrid.getData().setItems(data.result);
					contextGrid.invalidate();
					contextGrid.updateRowCount(); //로우 카운트 업데이트
					contextGrid.render(); //다시 그리기
					
					if(contextGrid.getSelectedRows().length > 0
					&& Math.max.apply(null, contextGrid.getSelectedRows()) < contextGrid.getData().getItemCount() ){
						var args = {
								rows : contextGrid.getSelectedRows(),
								grid : contextGrid,
								previousSelectedRows : contextGrid.getSelectedRows()
						}
						contextGrid.onSelectedRowsChanged.notify(args);	
					}
					else{
						contextGrid.getSelectionModel().setSelectedRanges("");
					}
					
				});
  		
  	}
	
  	var f_detailSearch = function(pk, preRow){
  	
  		if(gf_nvl(pk, '') == ''){
  			gf_gridClear(detailGrid);
  			return false;
  		}
  		var fData = new FormData();
		fData.set('QUERY_ID', 'com.S_COMM_GRID_DETAIL');
		fData.set('COMM_GRID_MASTER_ID', pk);
		
  		gf_ajax( fData
  				, function(){
  			
  					gf_gridClear(detailGrid);
  					gf_gridClear(settingGrid);
  					
  				}
  				, function(data){
  					
  					detailGridIdx = data.result.length;
  					detailGrid.getData().setItems(data.result);
					detailGrid.invalidate();
					detailGrid.updateRowCount(); //로우 카운트 업데이트
					detailGrid.render(); //다시 그리기
					
					if(detailGrid.getSelectedRows().length > 0
					&& Math.max.apply(null, detailGrid.getSelectedRows()) < detailGrid.getData().getItemCount() ){
						var args = {
								rows : detailGrid.getSelectedRows(),
								grid : detailGrid,
								previousSelectedRows : detailGrid.getSelectedRows()
						}
						detailGrid.onSelectedRowsChanged.notify(args);	
					}
					else{
						detailGrid.getSelectionModel().setSelectedRanges("");
					}
					
				});
  		
  	}
  	
  	var f_settingSearch = function(pk, preRow){
  		
  		if(gf_nvl(pk, '') == ''){
  			gf_gridClear(settingGrid);
  			return false;
  		}
  		var fData = new FormData();
		fData.set('QUERY_ID', 'com.S_COMM_GRID_COMBO_POPUP');
		fData.set('COMM_GRID_DETAIL_ID', pk);
		
  		gf_ajax( fData
  				, function(){
  			
  					gf_gridClear(settingGrid);
  					
  				}
  				, function(data){
  					
  					settingGridIdx = data.result.length;
  					settingGrid.getData().setItems(data.result);
					settingGrid.invalidate();
					settingGrid.updateRowCount(); //로우 카운트 업데이트
					settingGrid.render(); //다시 그리기
					
					if(settingGrid.getSelectedRows().length > 0
					&& Math.max.apply(null, settingGrid.getSelectedRows()) < settingGrid.getData().getItemCount() ){
						var args = {
								rows : settingGrid.getSelectedRows(),
								grid : settingGrid,
								previousSelectedRows : settingGrid.getSelectedRows()
						}
						settingGrid.onSelectedRowsChanged.notify(args);	
					}
					else{
						settingGrid.getSelectionModel().setSelectedRanges("");
					}
					
				});
  	}
  	
  	var f_save = function(){
  		
  		var masterData = gf_gridSaveData(masterGrid);
  		var contextData = gf_gridSaveData(contextGrid);
  		var detailData = gf_gridSaveData(detailGrid);
  		var settingData = gf_gridSaveData(settingGrid);
  		
  		var fData = new FormData();
		fData.set('masterGrid', JSON.stringify(masterData));
		fData.set('contextGrid', JSON.stringify(contextData));
		fData.set('detailGrid', JSON.stringify(detailData));
		fData.set('settingGrid', JSON.stringify(settingData));
  		gf_ajax( fData
  				, function(){
  					
  					if(masterData.length == 0 && contextGrid.length == 0 && detailData.length == 0 && settingData.length == 0){
  						gf_toast('${pb:msg(pageContext.request, "저장할_데이터가_없습니다")}', 'info');
  						return false;
  					}
  					else{
  						
  						//마스터그리드
  						if(masterData.length > 0){
  							masterData.unshift({
  	  							 'TALBE_NAME' : 'GRID_MASTER'
  	  							,'QUERY_ID' : 'com.COMM_QUERY'
  	  						});
  	  						fData.set('masterGrid', JSON.stringify(masterData));
  						}
  						
  						//컨텍스트그리드
  						if(contextData.length > 0){
  							contextData.unshift({
  	  							 'TALBE_NAME' : 'GRID_CONTEXT'
  	  							,'QUERY_ID' : 'com.GRID_CONTEXT'
  	  						});
  	  						fData.set('contextGrid', JSON.stringify(contextData));
  						}
  					
  						//디테일그리드
  						if(detailData.length > 0){
  							detailData.unshift({
  	  							 'TALBE_NAME' : 'GRID_DETAIL'
  	  							,'QUERY_ID' : 'com.COMM_QUERY'
  	  						});
  	  						fData.set('detailGrid', JSON.stringify(detailData));
  						}
  						
  						//콤보,팝업 설정그리드
  						if(settingData.length > 0){
  							settingData.unshift({
  	  							 'TALBE_NAME' : 'GRID_COMBO_POPUP'
  	  							,'QUERY_ID' : 'com.COMM_QUERY'
  	  						});
  	  						fData.set('settingGrid', JSON.stringify(settingData));
  						}
  					
  					}
  				}
  				, function(data){
					
  					if(data.result == 'success'){
  						gf_toast('${pb:msg(pageContext.request, "저장_되었습니다")}', 'success');
  						gf_gridClear(menuGrid);
  						gf_gridClear(masterGrid);
  						gf_gridClear(contextGrid);
  						gf_gridClear(detailGrid);
  						gf_gridClear(settingGrid);
  	  					f_search();	
					}
					
				}
  				, null
  				, null
  				, '/save');
  	}
  	
  	
	</script>
<body>
	<div id='content' class="pd-15">
		<div class='btn-area'>
			<button type="button" id='saveBtn'>${pb:msg(pageContext.request, "저장")}</button>
			<button type="button" id='searchBtn'>${pb:msg(pageContext.request, "조회")}</button>
		</div>
		<div class="grid-area">
			<div id='menuGridContainer' class='gridContainer'
				style="display: inline-block; width: 20%; height: 50%;">
				<div id='menuGrid' class="grid"></div>
			</div>
			<div id='masterGridContainer' class='gridContainer'
				style="display: inline-block; width: 60%; height: 50%;">
				<div id='masterGrid' class="grid"></div>
			</div>
			<div id='contextGridContainer' class='gridContainer'
				style="display: inline-block; width: 20%; height: 50%;">
				<div id='contextGrid' class="grid"></div>
			</div>
			<div id='detailGridContainer' class='gridContainer'
				style="display: inline-block; width: 80%; height: 50%;">
				<div id='detailGrid' class="grid"></div>
			</div>
			<div id='settingGridContainer' class='gridContainer'
				style="display: inline-block; width: 20%; height: 50%;">
				<div id='settingGrid' class="grid"></div>
			</div>
		</div>
	</div>
</body>
</html>