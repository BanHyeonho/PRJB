<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "테이블조회")}</title>
</head>
<%@ include file="../../gridData.jsp"%>
<script>
	$(document).ready(function() {
		
	    masterGrid = gf_gridInit('masterGrid');
	    detailGrid = gf_gridInit('detailGrid');
	    $('#searchBtn').on('click', f_search); 
		
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
  					
  					masterGridIdx = data.result.length;
  					
  					masterGrid.getData().setItems(data.result);
					masterGrid.invalidate();
					masterGrid.updateRowCount(); //로우 카운트 업데이트
					masterGrid.render(); //다시 그리기
					masterGrid.getSelectionModel().setSelectedRanges("");
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
  					
  					detailGridIdx = data.result.length;
  					detailGrid.getData().setItems(data.result);
					detailGrid.invalidate();
					detailGrid.updateRowCount(); //로우 카운트 업데이트
					detailGrid.render(); //다시 그리기
					detailGrid.getSelectionModel().setSelectedRanges("");
										
				});
  		
  	}
  	
</script>
<body>
	<div id='content'>
		<div id='header-dummy'></div>
		<div id="content-header" class="content-panel">
			<span id="content-title"></span>
			<div class="btn-area">
				<button type="button" id='searchBtn' tabindex="99" class="btn btn-st1 fl-right">${pb:msg(pageContext.request, "조회")}</button>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "테이블명/명칭")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="1" enter-exec='99' id="searchParam1">
				</div>
			</div>
		</div>
		<div id='masterGridContainer' class='content-panel ht-pl-1 wd-pl-1 no-mg-tp'>
			<div id="masterGrid" class="grid"></div>
		</div>
		<div id='detailGridContainer' class='content-panel ht-pl-1 wd-pl-3 no-mg-tp no-mg-lt'>
			<div id="detailGrid" class="grid"></div>
		</div>
	</div>
</body>
</html>