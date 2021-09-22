<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "commCode")}</title>
<%@ include file="../../gridData.jsp"%>
</head>
	<script type="text/javascript">
	
	var gridPk = function(){
		this.CODE_MASTER_ID;
	};
	
	$(document).ready(function() {
		masterGrid = gf_gridInit('masterGrid', masterGridColumns, {
	    	'defaultInsert' : {'USE_YN' : '1'}
	    });
		detailGrid = gf_gridInit('detailGrid', detailGridColumns, {
	    	'defaultInsert' : {'USE_YN' : '1'
	    					,'CODE_MASTER_ID' : gridPk
	    					}
	    });
		
		masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
			
			if(gridEventIgnore){
				gridEventIgnore = false;
				return false;
			}
			else if(gf_gridSaveData(detailGrid).length > 0
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
			var pk = selectedRowData.CODE_MASTER_ID;
			gridPk.prototype.constructor.CODE_MASTER_ID = pk;
						
			//상세조회
			f_detailSearch(pk, preRow);
	    });
		
	    $('#searchBtn').on('click', f_search);
	    $('#saveBtn').on('click', f_save);
	    f_search();
  	});

  	var f_search = function(type){
  		
  		var fData = new FormData();
		fData.set('QUERY_ID', 'com.S_CODE_MASTER');
  		gf_ajax( fData
  				, function(){
  					
  					if((gf_gridSaveData(masterGrid).length > 0
  					|| gf_gridSaveData(detailGrid).length > 0 )
  					&& type != 'saveAfter'){
  						if(!confirm('${pb:msg(pageContext.request, "수정된_데이터를_저장하지_않고,_조회_하시겠습니까?")}')){
  							return false;
  						}
  					}

  					gf_gridClear(masterGrid);
  					gf_gridClear(detailGrid);
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
  	
  	var f_detailSearch = function(pk, preRow){
  	
  		var fData = new FormData();
		fData.set('QUERY_ID', 'com.S_CODE_DETAIL');
		fData.set('CODE_MASTER_ID', pk);
		
  		gf_ajax( fData
  				, function(){
  					
  					if(gf_gridSaveData(detailGrid).length > 0){
  						if(!confirm('${pb:msg(pageContext.request, "수정된_데이터를_저장하지_않고,_조회_하시겠습니까?")}')){
  							commandYn = true;
  							masterGrid.setSelectedRows([preRow]);
  							return false;
  						}
  					}
  					gf_gridClear(detailGrid);
  					
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
  	
  	
  	var f_save = function(){
  		
  		var masterData = gf_gridSaveData(masterGrid);
  		var detailData = gf_gridSaveData(detailGrid);
  		var fData = new FormData();
		fData.set('masterGrid', JSON.stringify(masterData));
		fData.set('detailGrid', JSON.stringify(detailData));
  		gf_ajax( fData
  				, function(){
  					
  					if(masterData.length == 0 && detailData.length == 0){
  						gf_toast('${pb:msg(pageContext.request, "저장할_데이터가_없습니다")}', 'info');
  						return false;
  					}
  					else{
  						
  						//마스터그리드
  						if(masterData.length > 0){
  							masterData.unshift({
  	  							 'TALBE_NAME' : 'CODE_MASTER'
  	  							,'QUERY_ID' : 'com.COMM_QUERY'
  	  						});
  	  						fData.set('masterGrid', JSON.stringify(masterData));
  						}
  						
  						//디테일그리드
  						if(detailData.length > 0){
  							detailData.unshift({
  	  							 'TALBE_NAME' : 'CODE_DETAIL'
  	  							,'QUERY_ID' : 'com.COMM_QUERY'
  	  						});
  	  						fData.set('detailGrid', JSON.stringify(detailData));
  						}
  						
  					}
  				}
  				, function(data){
					
  					if(data.result == 'success'){
  						gf_toast('${pb:msg(pageContext.request, "저장_되었습니다")}', 'success');
  						gf_gridClear(masterGrid);
  						gf_gridClear(detailGrid);
  	  					f_search('saveAfter');	
					}
					
				}
  				, null
  				, null
  				, '/save');
  	}
  	
  	
	</script>
<body>
<button type="button" id='saveBtn'>${pb:msg(pageContext.request, "save")}</button>
<button type="button" id='searchBtn'>${pb:msg(pageContext.request, "search")}</button>
<div id='content' class="pd-15">
	<div id='masterGridContainer' class='gridContainer' style="height: 50%;">
		<div id='masterGrid' class="grid">
		</div>
	</div>
	<div id='detailGridContainer' class='gridContainer' style="height: 50%;">
		<div id='detailGrid' class="grid">
		</div>
	</div>
</div>
</body>
</html>