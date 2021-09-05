<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "msgRegist")}</title>
</head>
<%@ include file="../../gridData.jsp"%>
<script>
	
	$(document).ready(function() {
	    masterGrid = commGridInit('masterGrid');    
	    $('#searchBtn').on('click', f_search);
	    $('#saveBtn').on('click', f_save);
	    $('#refreshBtn').on('click', f_msgRefresh);	    
	    f_search();
  	});
  	
	var f_msgRefresh = function(e){
  		
  		commAjax( {}, null
  				, function(data){
  					if(data.result == 'success'){
  						toast('${pb:msg(pageContext.request, "refreshSuccess")}', 'success');	
  					}
  					else{
  						toast(data, 'danger');
  					}
  					
				},null,null,'/setMlg',true,'get',false);
  		 
  	}
  	
  	var f_search = function(){
  		
  		var fData = new FormData();
		fData.set('QUERY_ID', 'com.S_COMM_MLG');
  		commAjax( fData
  				, function(){
  					
  					if(commGridSaveData(masterGrid).length > 0){
  						if(!confirm('${pb:msg(pageContext.request, "searchConfirm")}')){
  							return false;
  						}
  					}
  					commGridClear(masterGrid);
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
  		
  		var saveData = commGridSaveData(masterGrid);
  		
  		var fData = new FormData();
		fData.set('masterGrid', JSON.stringify(saveData));
  		commAjax( fData
  				, function(){
  					
  					if(saveData.length == 0){
  						toast('${pb:msg(pageContext.request, "noSaveData")}', 'info');
  						return false;
  					}
  					else{
  						saveData.unshift({
  							 'TALBE_NAME' : 'COMM_MLG'
  							,'QUERY_ID' : 'com.COMM_QUERY'
  						});
  						fData.set('masterGrid', JSON.stringify(saveData));
  					}
  				}
  				, function(data){
					
  					if(data.result == 'success'){
  						toast('${pb:msg(pageContext.request, "saveSuccess")}', 'success');
  						commGridClear(masterGrid);
  	  					f_search();	
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
<button type="button" id='refreshBtn'>${pb:msg(pageContext.request, "mlgRefresh")}</button>
	<div id='content' class="pd-15">
		<div id='masterGridContainer' class='gridContainer'>
			<div id="masterGrid" class="grid"></div>
		</div>
	</div>
</body>
</html>