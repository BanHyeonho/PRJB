<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "menuRegist")}</title>
</head>
<%@ include file="../../gridData.jsp"%>
<script>
	
	$(document).ready(function() {
	    masterGrid = gf_gridInit('masterGrid', {
	    	'defaultInsert' : {'USE_YN' : '1'}
	    });
	    
	    $('#searchBtn').on('click', f_search);
	    $('#saveBtn').on('click', f_save);
	    f_search();
  	});
  	
  	var f_search = function(){
  		
  		var fData = new FormData();
		fData.set('QUERY_ID', 'com.S_COMM_MENU');
		gf_ajax( fData
  				, function(){
  					
  					if(gf_gf_gridSaveData(masterGrid).length > 0){
  						if(!confirm('${pb:msg(pageContext.request, "수정된_데이터를_저장하지_않고,_조회_하시겠습니까?")}')){
  							return false;
  						}
  					}
  					gf_gf_gridClear(masterGrid);
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
  		
  		var saveData = gf_gf_gridSaveData(masterGrid);
  		
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
  							 'TALBE_NAME' : 'COMM_MENU'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('masterGrid', JSON.stringify(saveData));
  					}
  				}
  				, function(data){
					
  					if(data.result == 'success'){
  						gf_toast('${pb:msg(pageContext.request, "저장_되었습니다")}', 'success');
  						gf_gf_gridClear(masterGrid);
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
<div id='masterGridContainer' class='gridContainer' style="height: 100%;">
	<div id="masterGrid" class="grid"></div>
</div>
</body>
</html>