<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page session="false"%>
<%@ include file="../../include.jsp"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "gridManage")}</title>
</head>
<%@ include file="../../gridData.jsp"%>
<script type="text/javascript">

	var gridPk = function(){
		this.MENU_CD;
		this.MENU_NAME;
		this.GRID_MASTER_ID;
		this.GRID_DETAIL_ID;
	};
	
	$(document).ready(function() {
		
		menuGrid = commGridInit('menuGrid');
		
		masterGrid = commGridInit('masterGrid', {
	    	'defaultInsert' : {'MENU_CD' : gridPk
	    						,'MENU_NAME' : gridPk
	    						,'FILTER_YN' : '1'
	    						, 'SORT_YN' : '1'
	    						, 'TREE_YN' : '0'}
	    });
		contextGrid = commGridInit('contextGrid');
		
		detailGrid = commGridInit('detailGrid',{
	    	'defaultInsert' : {'USE_YN' : '1'
	    					,'REQUIRE_YN' : '0'
    						,'FIXED_YN' : '0'
 							,'WIDTH' : '100'
   							,'TEXT_ALIGN' : 'CENTER'
	    					,'GRID_MASTER_ID' : gridPk
	    					}
	    });
		
		settingGrid = commGridInit('settingGrid',{
	    	'defaultInsert' : {'USE_YN' : '1'
	    					 ,'GRID_DETAIL_ID' : gridPk}
	    });
		
		
		menuGrid.onSelectedRowsChanged.subscribe(function (e, args) {
			
			if(gridEventIgnore){
				gridEventIgnore = false;
				return false;
			}
			else if(commGridSaveData(masterGrid).length > 0
			|| commGridSaveData(detailGrid).length > 0 
			|| commGridSaveData(settingGrid).length > 0
			){
				if(!confirm('${pb:msg(pageContext.request, "searchConfirm")}')){
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
			var pk = selectedRowData.MENU_CD;
			
			gridPk.prototype.constructor.MENU_NAME = selectedRowData.MENU_NAME;
			gridPk.prototype.constructor.MENU_CD = pk;
			
			//마스터 조회
			f_masterSearch(pk, preRow);
	    });
	    
		masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
			
			if(gridEventIgnore){
				gridEventIgnore = false;
				return false;
			}
			else if(commGridSaveData(detailGrid).length > 0
				 || commGridSaveData(contextGrid).length > 0
				 || commGridSaveData(settingGrid).length > 0
					){
				if(!confirm('${pb:msg(pageContext.request, "searchConfirm")}')){
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
			var pk = selectedRowData.GRID_MASTER_ID;
			gridPk.prototype.constructor.GRID_MASTER_ID = pk;
			
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
			else if(commGridSaveData(settingGrid).length > 0
					){
				if(!confirm('${pb:msg(pageContext.request, "searchConfirm")}')){
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
			var pk = selectedRowData.GRID_DETAIL_ID;
			gridPk.prototype.constructor.GRID_DETAIL_ID = pk;
			
			//상세조회
			f_settingSearch(pk, preRow);
			
	    });
	    
	    $('#searchBtn').on('click', f_search);
	    $('#saveBtn').on('click', f_save);
	    f_search();
  	});
	
	
	
  	var f_search = function(){
  		
  		var fData = new FormData();
		fData.set('QUERY_ID', 'comm.S_GRID_MANAGE_MENU');
  		commAjax( fData
  				, function(){
  					
  					if((commGridSaveData(masterGrid).length > 0
  					|| commGridSaveData(detailGrid).length > 0
  					|| commGridSaveData(contextGrid).length > 0
  					|| commGridSaveData(settingGrid).length > 0
  					)
  					){
  						if(!confirm('${pb:msg(pageContext.request, "searchConfirm")}')){
  							return false;
  						}
  					}
  					
  					commGridClear(masterGrid);
  					commGridClear(detailGrid);
  					commGridClear(contextGrid);
  					commGridClear(settingGrid);
  					
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
		fData.set('QUERY_ID', 'comm.S_GRID_MASTER');
		fData.set('MENU_CD', pk);
		
  		commAjax( fData
  				, function(){
  					
  					commGridClear(masterGrid);
  					commGridClear(contextGrid);
  					commGridClear(detailGrid);
  					commGridClear(settingGrid);
  					
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
	  	
  		if(commNvl(pk, '') == ''){
  			commGridClear(contextGrid);
  			return false;
  		}
  		var fData = new FormData();
		fData.set('QUERY_ID', 'comm.S_GRID_CONTEXT');
		fData.set('GRID_MASTER_ID', pk);
		
  		commAjax( fData
  				, function(){
  			
  					commGridClear(contextGrid);
  					
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
  	
  		if(commNvl(pk, '') == ''){
  			commGridClear(detailGrid);
  			return false;
  		}
  		var fData = new FormData();
		fData.set('QUERY_ID', 'comm.S_GRID_DETAIL');
		fData.set('GRID_MASTER_ID', pk);
		
  		commAjax( fData
  				, function(){
  			
  					commGridClear(detailGrid);
  					commGridClear(settingGrid);
  					
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
  		
  		if(commNvl(pk, '') == ''){
  			commGridClear(settingGrid);
  			return false;
  		}
  		var fData = new FormData();
		fData.set('QUERY_ID', 'comm.S_GRID_COMBO_POPUP');
		fData.set('GRID_DETAIL_ID', pk);
		
  		commAjax( fData
  				, function(){
  			
  					commGridClear(settingGrid);
  					
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
  		
  		var masterData = commGridSaveData(masterGrid);
  		var contextData = commGridSaveData(contextGrid);
  		var detailData = commGridSaveData(detailGrid);
  		var settingData = commGridSaveData(settingGrid);
  		
  		var fData = new FormData();
		fData.set('masterGrid', JSON.stringify(masterData));
		fData.set('contextGrid', JSON.stringify(contextData));
		fData.set('detailGrid', JSON.stringify(detailData));
		fData.set('settingGrid', JSON.stringify(settingData));
  		commAjax( fData
  				, function(){
  					
  					if(masterData.length == 0 && contextGrid.length == 0 && detailData.length == 0 && settingData.length == 0){
  						toast('${pb:msg(pageContext.request, "noSaveData")}', 'info');
  						return false;
  					}
  					else{
  						
  						//마스터그리드
  						if(masterData.length > 0){
  							masterData.unshift({
  	  							 'TALBE_NAME' : 'GRID_MASTER'
  	  							,'QUERY_ID' : 'comm.COMM_QUERY'
  	  						});
  	  						fData.set('masterGrid', JSON.stringify(masterData));
  						}
  						
  						//컨텍스트그리드
  						if(contextData.length > 0){
  							contextData.unshift({
  	  							 'TALBE_NAME' : 'GRID_CONTEXT'
  	  							,'QUERY_ID' : 'comm.GRID_CONTEXT'
  	  						});
  	  						fData.set('contextGrid', JSON.stringify(contextData));
  						}
  					
  						//디테일그리드
  						if(detailData.length > 0){
  							detailData.unshift({
  	  							 'TALBE_NAME' : 'GRID_DETAIL'
  	  							,'QUERY_ID' : 'comm.COMM_QUERY'
  	  						});
  	  						fData.set('detailGrid', JSON.stringify(detailData));
  						}
  						
  						//콤보,팝업 설정그리드
  						if(settingData.length > 0){
  							settingData.unshift({
  	  							 'TALBE_NAME' : 'GRID_COMBO_POPUP'
  	  							,'QUERY_ID' : 'comm.COMM_QUERY'
  	  						});
  	  						fData.set('settingGrid', JSON.stringify(settingData));
  						}
  					
  					}
  				}
  				, function(data){
					
  					if(data.result == 'success'){
  						toast('${pb:msg(pageContext.request, "saveSuccess")}', 'success');
  						commGridClear(menuGrid);
  						commGridClear(masterGrid);
  						commGridClear(contextGrid);
  						commGridClear(detailGrid);
  						commGridClear(settingGrid);
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
			<button type="button" id='saveBtn'>${pb:msg(pageContext.request, "save")}</button>
			<button type="button" id='searchBtn'>${pb:msg(pageContext.request, "search")}</button>
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