<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "commCode")}</title>
</head>
	<script type="text/javascript">
	var codeMlg = {
			<c:forEach var="item" items="${codeLang}" varStatus="status">
				<c:choose>
					<c:when test="${status.first}">
						'${item.get("MLG_CD")}' : '${item.get("VALUE")}'
					</c:when>
					<c:otherwise>
						,'${item.get("MLG_CD")}' : '${item.get("VALUE")}' 		
					</c:otherwise>
				</c:choose>
			</c:forEach>
	};
	var masterGrid;
	var masterGridColumns = [
    	{id: "MLG_CD", 		align:'LEFT',	name: "마스터코드명",	field: "MLG_CD", 		sortable: true,		editor: Select2Editor,	dataSource: codeMlg, formatter: slickGridFormatter, footer: 'COUNT'},
    	{id: "USE_YN",	 	align:'CENTER',	name: "사용여부",		field: "USE_YN", 		sortable: true,		editor: Slick.Editors.Checkbox,	maxWidth: 120, formatter:slickGridFormatter},
    	{id: "DESCRIPTION",	align:'LEFT',	name: "설명", 		field: "DESCRIPTION",	sortable: true, 	editor: FormulaEditor},
    	{id: "ATTR1",		align:'LEFT',	name: "예비속성1", 	field: "ATTR1",			sortable: true, 	editor: FormulaEditor},
    	{id: "ATTR2",		align:'LEFT',	name: "예비속성2", 	field: "ATTR2",			sortable: true, 	editor: FormulaEditor},
    	{id: "ATTR3",		align:'LEFT',	name: "예비속성3", 	field: "ATTR3",			sortable: true, 	editor: FormulaEditor},
    	{id: "ATTR4",		align:'LEFT',	name: "예비속성4", 	field: "ATTR4",			sortable: true, 	editor: FormulaEditor},
    	{id: "ATTR5",		align:'LEFT',	name: "예비속성5", 	field: "ATTR5",			sortable: true, 	editor: FormulaEditor}
	];
	var masterGridData = [];
	var masterGridDataDel = [];
	var masterGridFilters = {};
	var masterGridIdx = 0;
	
	var detailGrid;
	var detailGridColumns = [
		{id: "CODE", 		align:'LEFT',	name: "상세코드", 		field: "CODE", 			sortable: true,		editor: FormulaEditor,	footer: 'COUNT'},
		{id: "MLG_CD", 		align:'LEFT',	name: "상세코드명",		field: "MLG_CD", 		sortable: true,		editor: Select2Editor,	dataSource: codeMlg, formatter: slickGridFormatter},
		{id: "USE_YN",	 	align:'CENTER',	name: "사용여부",		field: "USE_YN", 		sortable: true,		editor: Slick.Editors.Checkbox,	maxWidth: 120, formatter:slickGridFormatter},
		{id: "SEQ",			align:'RIGHT',	name: "순번", 		field: "SEQ",			sortable: true, 	editor: FormulaEditor},
		{id: "DESCRIPTION",	align:'LEFT',	name: "설명", 		field: "DESCRIPTION",	sortable: true, 	editor: FormulaEditor},
    	{id: "ATTR1",		align:'LEFT',	name: "예비속성1", 	field: "ATTR1",			sortable: true, 	editor: FormulaEditor},
    	{id: "ATTR2",		align:'LEFT',	name: "예비속성2", 	field: "ATTR2",			sortable: true, 	editor: FormulaEditor},
    	{id: "ATTR3",		align:'LEFT',	name: "예비속성3", 	field: "ATTR3",			sortable: true, 	editor: FormulaEditor},
    	{id: "ATTR4",		align:'LEFT',	name: "예비속성4", 	field: "ATTR4",			sortable: true, 	editor: FormulaEditor},
    	{id: "ATTR5",		align:'LEFT',	name: "예비속성5", 	field: "ATTR5",			sortable: true, 	editor: FormulaEditor}
	];
	var detailGridData = [];
	var detailGridDataDel = [];
	var detailGridFilters = {};
	var detailGridIdx = 0;
	
	var commandYn = false; 
	
	$(document).ready(function() {
		masterGrid = commGridInit('masterGrid', masterGridColumns, masterGridData, {
	    	'defaultInsert' : {'USE_YN' : '1'}
	    });
		detailGrid = commGridInit('detailGrid', detailGridColumns, detailGridData, {
	    	'defaultInsert' : {'USE_YN' : '1'}
	    });
		
		masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
			
			if(commandYn){
				commandYn = false;
				return false;
			}
			
			var row = args.rows[0];
			var grid = args.grid;
			var preRow = args.previousSelectedRows[0];
			var selectedRowData = grid.getData().getItem(row);
			var pk = selectedRowData.CODE_MASTER_ID;
			
			//상세조회
			f_detailSearch(pk, preRow);
	    });
		
	    $('#searchBtn').on('click', f_search);
	    $('#saveBtn').on('click', f_save);
	    f_search();
  	});

  	var f_search = function(type){
  		
  		var fData = new FormData();
		fData.set('QUERY_ID', 'comm.S_CODE_MASTER');
  		commAjax( fData
  				, function(){
  					
  					if(makeData().length > 0 && type != 'saveAfter'){
  						if(!confirm('${pb:msg(pageContext.request, "searchConfirm")}')){
  							return false;
  						}
  					}

  					masterGrid.getEditorLock().cancelCurrentEdit();
  					masterGridDataDel = [];
  					masterGridData = [];
  					masterGridIdx = 0;
  					
  					detailGrid.getEditorLock().cancelCurrentEdit();
  					detailGridDataDel = [];
  					detailGridData = [];
  					detailGridIdx = 0;
  					
  				}
  				, function(data){
  					
  					masterGridData = data.result;
  					masterGridIdx = masterGridData.length;
  					
  					masterGrid.getData().setItems(masterGridData);
					masterGrid.invalidate();
					masterGrid.updateRowCount(); //로우 카운트 업데이트
					masterGrid.render(); //다시 그리기
				});
  	}
  	
  	var f_detailSearch = function(pk, preRow){
  	
  		var fData = new FormData();
		fData.set('QUERY_ID', 'comm.S_CODE_DETAIL');
		fData.set('CODE_MASTER_ID', pk);
		
  		commAjax( fData
  				, function(){
  					
  					if(makeData().length > 0 && type != 'saveAfter'){
  						if(!confirm('${pb:msg(pageContext.request, "searchConfirm")}')){
  							commandYn = true;
  							masterGrid.setSelectedRows([preRow]);
  							return false;
  						}
  					}

  					detailGrid.getEditorLock().cancelCurrentEdit();
  					detailGridDataDel = [];
  					detailGridData = [];
  					detailGridIdx = 0;
  					
  				}
  				, function(data){
  					
  					detailGridData = data.result;
  					detailGridIdx = detailGridData.length;
  					
  					detailGrid.getData().setItems(detailGridData);
					detailGrid.invalidate();
					detailGrid.updateRowCount(); //로우 카운트 업데이트
					detailGrid.render(); //다시 그리기
				});
  		
  	}
  	
  	function makeData(grid){
  		
  		grid.getEditorLock().commitCurrentEdit();
  		var saveData = [];
		
  		var gridData = new Function('return ' + grid + 'Data')();
  		$.each(masterGridData,function(index, item){
  			//INSERT, UPDATE
  			if(commNvl(item['gState'], '') != ''){
  				saveData.push(item);
  			}
  		});
		$.each(masterGridDataDel,function(index, item){
			//DELETE
			item['gState'] = 'deleted';
			saveData.push(item);
  		});
		return saveData;
  	}
  	
  	var f_save = function(){
  		
//   		commGridSaveData(grid);
  		var saveData = makeData();
  		
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
  							 'TALBE_NAME' : 'CODE_MASTER'
  							,'QUERY_ID' : 'comm.COMM_QUERY'
  						});
  						fData.set('masterGrid', JSON.stringify(saveData));
  					}
  				}
  				, function(data){
					
  					if(data.result == 'success'){
  						toast('${pb:msg(pageContext.request, "saveSuccess")}', 'success');
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
	<div id='masterGridContainer' style="height: 50%;">
		<div id='masterGrid' class="grid">
		</div>
	</div>
	<div id='detailGridContainer' style="height: 50%;">
		<div id='detailGrid' class="grid">
		</div>
	</div>
</body>
</html>