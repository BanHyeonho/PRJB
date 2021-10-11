<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "사용자관리")}</title>
</head>
<%@ include file="../../gridData.jsp"%>
<script>
	$(document).ready(function() {
		
	    masterGrid = gf_gridInit('masterGrid');    
	    $('#searchBtn').on('click', f_search);
	    $('#saveBtn').on('click', f_save);	    
// 	    f_search();
  	});
  	  	
  	var f_search = function(){
  		
  		gf_ajax({
		  			QUERY_ID : 'com.S_COMM_USER',
		  			p_loginId : $('#searchParam1').val()
  				}, function(){
  					
  					if(gf_gridSaveData(masterGrid).length > 0){
  						if(!confirm('${pb:msg(pageContext.request, "수정된_데이터를_저장하지_않고,_조회_하시겠습니까?")}')){
  							return false;
  						}
  					}
  					gf_gridClear(masterGrid);
  				}
  				, function(data){
  					
  					masterGridIdx = data.result.length;
  					
  					masterGrid.getData().setItems(data.result);
					masterGrid.invalidate();
					masterGrid.updateRowCount(); //로우 카운트 업데이트
					masterGrid.render(); //다시 그리기
				});
  	}
  	
  	var f_save = function(){
  		
  		var saveData = gf_gridSaveData(masterGrid);
  		
  		var fData = new FormData();
		fData.set('masterGrid', JSON.stringify(saveData));
  		gf_ajax( fData
  				, function(){
  					
  					if(saveData.length == 0){
  						gf_toast('${pb:msg(pageContext.request, "저장할_데이터가_없습니다")}', 'info');
  						return false;
  					}
  					else{
  						saveData.unshift({
  							 'TALBE_NAME' : 'COMM_USER'
  							,'QUERY_ID' : 'com.COMM_USER'
  						});
  						fData.set('masterGrid', JSON.stringify(saveData));
  					}
  				}
  				, function(data){
					
  					if(data.result == 'success'){
  						gf_toast('${pb:msg(pageContext.request, "저장_되었습니다")}', 'success');
  						gf_gridClear(masterGrid);
  	  					f_search();	
					}
					
				}
  				, null
  				, null
  				, '/save');
  	}
</script>
<body>
	<div id='content'>
		<div id='header-dummy'></div>
		<div id="content-header" class="content-panel">
			<span id="content-title"></span>
			<div class="btn-area">
				<button type="button" id='searchBtn' tabindex="99" class="btn btn-st1 fl-right">${pb:msg(pageContext.request, "조회")}</button>
				<button type="button" id='saveBtn' class="btn btn-st1 fl-right mg-rt-default">${pb:msg(pageContext.request, "저장")}</button>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "아이디/사용자명")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="1" enter-exec='99' id="searchParam1">
				</div>
			</div>
		</div>
		<div id='masterGridContainer' class='content-panel ht-pl-1'>
			<div id="masterGrid" class="grid"></div>
		</div>
	</div>
</body>
</html>