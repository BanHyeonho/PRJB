<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "공통코드관리")}</title>
<%@ include file="../../gridData.jsp"%>
</head>
	<script type="text/javascript">
	
	var gridPk = function(){
		this.COMM_CODE_MASTER_ID;
		this.MASTER_CODE;
	};
	
	$(document).ready(function() {
		masterGrid = gf_gridInit('masterGrid', {
	    	'defaultInsert' : {'USE_YN' : '1'}
	    });
		detailGrid = gf_gridInit('detailGrid', {
	    	'defaultInsert' : {'USE_YN' : '1'
	    					,'COMM_CODE_MASTER_ID' : gridPk
	    					,'MASTER_CODE' : gridPk
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
			var pk = selectedRowData.COMM_CODE_MASTER_ID;
			var pk2 = selectedRowData.MASTER_CODE;
			
			gridPk.prototype.constructor.COMM_CODE_MASTER_ID = pk;
			gridPk.prototype.constructor.MASTER_CODE = pk2;
			
			//상세조회
			f_detailSearch(pk, preRow);
	    });
		
	    $('#searchBtn').on('click', f_search);
	    $('#saveBtn').on('click', f_save);
	    $('#masterMlgRegistBtn').on('click', f_mlg_regist);
	    $('#detailMlgRegistBtn').on('click', f_mlg_regist2);
	   
	    f_search();
  	});

	//다국어등록
	var f_mlg_regist = function(){
		if(confirm('${pb:msg(pageContext.request, "다국어를_등록하시겠습니까?")}')){
			var fData = new FormData();
			fData.set('QUERY_ID', 'com.P_MLG_BATCH_REGIST');
			fData.set('TABLE_NAME', 'COMM_CODE_MASTER');
			fData.set('MLG_COLUMN', 'MLG_CODE');
			fData.set('COMPARE_COLUMN', 'CODE_YN');
	  		gf_ajax( fData
	  				, null
	  				, function(data){
	  					
			  			if(data.result == 'success'){
							gf_toast('${pb:msg(pageContext.request, "저장_되었습니다")}', 'success');
						}
						
					});
		}
	}
	var f_mlg_regist2 = function(){
		if(confirm('${pb:msg(pageContext.request, "다국어를_등록하시겠습니까?")}')){
			var fData = new FormData();
			fData.set('QUERY_ID', 'com.P_MLG_BATCH_REGIST');
			fData.set('TABLE_NAME', 'COMM_CODE_DETAIL');
			fData.set('MLG_COLUMN', 'MLG_CODE');
			fData.set('COMPARE_COLUMN', 'CODE_YN');
	  		gf_ajax( fData
	  				, null
	  				, function(data){
	  					
			  			if(data.result == 'success'){
							gf_toast('${pb:msg(pageContext.request, "저장_되었습니다")}', 'success');
						}
						
					});
		}
	}
  	var f_search = function(type){
  		
  		var fData = new FormData();
		fData.set('QUERY_ID', 'com.S_COMM_CODE_MASTER');
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
  	
  		if(gf_nvl(pk, '') == ''){
  			gf_gridClear(detailGrid);
  			return false;
  		}
  		
  		var fData = new FormData();
		fData.set('QUERY_ID', 'com.S_COMM_CODE_DETAIL');
		fData.set('COMM_CODE_MASTER_ID', pk);
		
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
  		$.each(detailData, function(idx, item){
  			item['MASTER_DETAIL_CODE'] = item['MASTER_CODE'] + item['DETAIL_CODE']; 
  		});
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
  	  							 'TALBE_NAME' : 'COMM_CODE_MASTER'
  	  							,'QUERY_ID' : 'com.COMM_QUERY'
  	  						});
  	  						fData.set('masterGrid', JSON.stringify(masterData));
  						}
  						
  						//디테일그리드
  						if(detailData.length > 0){
  							detailData.unshift({
  	  							 'TALBE_NAME' : 'COMM_CODE_DETAIL'
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
	<div id='content'>
		<div id="content-header" class="content-panel">
			<label id="content-title"></label>
			<div class="btn-area">
				<button type="button" id='saveBtn' class="btn btn-st1 fl-right">${pb:msg(pageContext.request, "저장")}</button>
				<button type="button" id='searchBtn' class="btn btn-st1 fl-right mg-rt-default">${pb:msg(pageContext.request, "조회")}</button>
				<button type="button" id='masterMlgRegistBtn' class="btn btn-st1 fl-right mg-rt-default">${pb:msg(pageContext.request, "마스터_다국어_일괄등록")}</button>
				<button type="button" id='detailMlgRegistBtn' class="btn btn-st1 fl-right mg-rt-default">${pb:msg(pageContext.request, "상세_다국어_일괄등록")}</button>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "코드/코드명")}</label>
					<input class="form form-text mg-tp-default" type="text">
				</div>
			</div>
		</div>
		
		<div id='masterGridContainer' class='content-panel ht-pl-2'>
			<div id="masterGrid" class="grid"></div>
		</div>
		<div id='detailGridContainer' class='content-panel ht-pl-2'>
			<div id='detailGrid' class="grid"></div>
		</div>
	</div>
</body>
</html>