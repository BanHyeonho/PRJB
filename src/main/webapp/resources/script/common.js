/**
 * 사용자정의 함수
 */

//문자 치환함수
function gf_nvl(val, val2) {

	let result = val;
	if (val === undefined || val === null || val === '') {
		result = val2;
	}

	return result;
}

//암호화
function gf_securePw(pw, puk) {	//암호화할 비밀번호 , 공개키

	// 객체 생성
	let crypt = new JSEncrypt();

	// 키 설정
	crypt.setPrivateKey(puk);

	// 암호화
	return crypt.encrypt(pw);
}

//폼 필수값 체크
function gf_chkRequire(formList) {

	let result = {
		result: true
	};
	let tags = [];
	for (let i = 0; i < formList.length; i++) {
		let requireTags = $('#' + formList[i]).find('[require=true]');

		for (let j = 0; j < requireTags.length; j++) {

			if (requireTags.eq(j).val() == '') {
				tags.push(requireTags.eq(j));
				result["result"] = false;
			}
		}
	}
	result["tags"] = tags;

	return result;
}

//다국어 반환
function gf_mlg(p_mlg_code, p_param){
	
	var v_text = mlg.hasOwnProperty(p_mlg_code) ? mlg[p_mlg_code].VALUE : p_mlg_code;
	var paramKey = Object.keys(gf_nvl(p_param, {}));
	for (var i = 0; i < paramKey.length; i++) {
		var chgKey = '\\[\\@;' + paramKey[i] + ';\\@\\]';
		var reg = new RegExp(chgKey, 'g');
		v_text = v_text.replace(reg, p_param[paramKey[i]]);
	}
	// 모든변수부분 삭제
	var regExp = new RegExp('\\[\\@;.*;\\@\\]', 'g');
	v_text = v_text.replace(regExp, '');
	
	return v_text;
}

//태그에 값 입력
function gf_setFormData(data){
	
	$.each(Object.keys(data), function(idx, item){
		var target = $('#' + item);
		
		if(target.length == 0){
			return;
		}
		
		var tagName = target.prop('tagName').toLowerCase();
		
		switch (tagName) {
		case 'input':
			if( target.attr('type') == 'file'){
				$('#' + item + '_PREVIEW').attr('src', 'data:image/*;base64,' + data[item]);
			}
			else{
				target.val(data[item]);	
			}
			
			break;
		case 'span':
			target.text(data[item]);
			break;
		}
		
	});
}
/*****************************************************************************************************************************************************************
 * 
 * AJAX
 * 
 *****************************************************************************************************************************************************************/
function gf_ajax(p_param, p_before, p_success, p_error, p_complete, p_url, p_async, p_method, p_global, p_timeout, p_dataType) {

	const v_url = gf_nvl(p_url, '/ajax');
	const v_method = gf_nvl(p_method, 'post');
	const v_dataType = gf_nvl(p_dataType, 'json');
	const v_async = gf_nvl(p_async, true);
	const v_global = gf_nvl(p_global, true);
	const v_timeout = gf_nvl(p_timeout, 3600000);

	const v_param = gf_nvl(p_param, {});

	const v_before = gf_nvl(p_before, function() {
		//aJax 요청전에 실행되는 함수, return false 일경우 ajax 요청 취소 가능
	});

	const v_success = gf_nvl(p_success, function(data) {
		//ajax통신 성공시 실행함수
		console.log('success', data);
	});

	const v_error = gf_nvl(p_error, function(data) {
		//ajax통신 실패시 실행함수
		try{
			gf_toast(JSON.parse(data.responseText).errorMsg, 'danger');	
		}catch(e){
			gf_toast(data.responseText, 'danger');
		}
	});

	const v_complete = gf_nvl(p_complete, function(data) {
		//ajax통신 완료시 실행함수
//		console.log('complete', data);
	});

	let v_contentType;
	let v_processData;
	let v_enctype;
	//new FormData() 로 데이터전송
	if (v_param.toString().indexOf('FormData') != -1) {
		//contentType : false로 선언 시 content-type 헤더가 multipart/form-data로 전송되게 함
		//processData : false로 선언 시 formData를 string으로 변환하지 않음
		v_enctype = 'multipart/form-data';
		v_contentType = false;
		v_processData = false;
		
	}
	else if (typeof v_param == 'string') {
		v_enctype = 'application/x-www-form-urlencoded';
		v_contentType = 'application/json; charset=UTF-8';
		v_processData = true;
	}
	//JSON 으로 데이터전송
	else {
		v_enctype = 'application/x-www-form-urlencoded';
		v_contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
		v_processData = true;
	}


	const setting = {
		url: v_url
		, method: v_method
		, dataType: v_dataType
		, async: v_async
		, timeout: v_timeout
		, global: v_global
		, data: v_param
		, beforeSend: v_before
		, success: v_success
		, error: v_error
		, complete: v_complete
		, enctype: v_enctype
		, contentType: v_contentType
		, processData: v_processData
		, cache: false
	};

	$.ajax(setting);
}

/*****************************************************************************************************************************************************************
 * 
 * 그리드
 * 
 *****************************************************************************************************************************************************************/
//그리드 생성함수
function gf_gridInit(gridDiv, option) {

	let vGrid;
	let columnFilters = {};
	try {
		columnFilters = new Function('return ' + gridDiv + 'Filters')();
	} catch (e) {}


	let columns;
	try {
		columns = new Function('return ' + gridDiv + 'Columns')();
	} catch (e) {
		console.error(gridDiv + ' - 그리드컬럼이 없습니다.');
		return false;
	}
	
	//////그리드생성 옵션셋팅	-START
	let vContextMenu = [];
	try {
		vContextMenu = new Function('return ' + gridDiv + 'Context')();
	} catch (e) {}

	let vOption = $.extend({},{
		rowHeight: 40,
		editable: true,
		forceFitColumns: true,
		autoEdit: false,
		enableCellNavigation: true,
		asyncEditorLoading: false,
		showHeaderRow: columns[0].filterYn == '0' ? false : true,
		headerRowHeight: 40,
		explicitInitialization: true,
		enableColumnReorder: false,
		createFooterRow: true,
		showFooterRow: true,
		multiColumnSort: true,
		footerRowHeight: 30
	}, option);
	//////그리드생성 옵션셋팅	-END  	

	//////우클릭으로 열 메뉴 생성	-START
	if(vContextMenu.length > 0){
		
		let contextDiv = $('<div>').attr('id', gridDiv + 'Context').addClass('context').addClass('gridContext');
		let contextUl = $('<ul>').attr('id', gridDiv + 'ContextUl');
	
		for (let i = 0; i < vContextMenu.length; i++) {
	
			let contextLi;
			let contextTextSpan;
			let contextText;
			let contextA;
			switch (vContextMenu[i]) {
				//행추가
				case "grid_add":
					contextLi = $('<li>').attr('onclick', 'gf_gridAddRow("' + gridDiv + '")');
					contextTextSpan = $('<span>').text(gf_mlg('행추가'));
					contextText = $('<div><span class="ui-icon ui-icon-plus"></span></div>');
					break;
				//여러행추가
				case "grid_adds":
					contextLi = $('<li>').attr('onclick', 'gf_gridAddMultiRow("' + gridDiv + '")');
					contextTextSpan = $('<span>').text(gf_mlg('여러_행추가'));
					contextText = $('<div><span class="ui-icon ui-icon-plusthick"></span></div>');
					break;
				//행삭제
				case "grid_remove":
					contextLi = $('<li>').attr('onclick', 'gf_gridRemoveRow("' + gridDiv + '")');
					contextTextSpan = $('<span>').text(gf_mlg('행삭제'));
					contextText = $('<div><span class="ui-icon ui-icon-minus"></span></div>');
					break;
				//선택된행삭제
				case "grid_removes":
					contextLi = $('<li>').attr('onclick', 'gf_gridRemoveMultiRow("' + gridDiv + '")');
					contextTextSpan = $('<span>').text(gf_mlg('선택된_행삭제'));
					contextText = $('<div><span class="ui-icon ui-icon-minusthick"></span></div>');
					break;
				//그리드 새로고침
				case "grid_refresh":
					contextLi = $('<li>').attr('onclick', 'gf_gridRefresh("' + gridDiv + '")');
					contextTextSpan = $('<span>').text(gf_mlg('그리드_새로고침'));
					contextText = $('<div><span class="ui-icon ui-icon-arrowrefresh-1-e"></span></div>');
					break;
				//그리드 엑셀다운로드
				case "grid_export":
					contextLi = $('<li>').attr('onclick', 'gf_gridExport("' + gridDiv + '")');
					contextA = $('<a>').css({'text-decoration-line' : 'none'}).attr('id', gridDiv + 'Excel').text(gf_mlg('엑셀_내보내기'));
					contextTextSpan = $('<span>').html(contextA);
					contextText = $('<div><span class="ui-icon ui-icon-arrowrefresh-1-e"></span></div>');
					break;
			}
			contextText.append(contextTextSpan);
			contextLi.append(contextText);
			contextUl.append(contextLi);
		}
		contextDiv.append(contextUl);
		$('body').append(contextDiv);
		
		$('#' + gridDiv + 'ContextUl').menu();
		
	}

	if(columns[0].checkBoxYn == '1'){
		var checkboxSelector = new Slick.CheckboxSelectColumn({ cssClass: "slick-cell-checkboxsel" });
		columns.splice(0, 0, checkboxSelector.getColumnDefinition());
		
		vGrid = new Slick.Grid("#" + gridDiv, new Slick.Data.DataView(), columns, vOption);
//    	vGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false})); 
    	vGrid.registerPlugin(checkboxSelector);
    }
	else{
		vGrid = new Slick.Grid("#" + gridDiv, new Slick.Data.DataView(), columns, vOption);
	}
	
	
	//정렬
    vGrid.onSort.subscribe(function (e, args) {
		var cols = args.sortCols;
		
		vGrid.getData().getItems().sort(function (dataRow1, dataRow2) {
			
				for (var i = 0, l = cols.length; i < l; i++) {
					
					var field = cols[i].sortCol.field;
					var sign = cols[i].sortAsc ? 1 : -1;
					var value1 = String(gf_nvl(dataRow1[field], '')).trim();
					var value2 = String(gf_nvl(dataRow2[field], '')).trim();
					
					try{
						if(cols[i].sortCol.editor.name == 'FormulaNumberEditor'){
							value1 = Number(value1);
							value2 = Number(value2);
						}	
					}catch(e){}
					
					var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
					
					if (result != 0) {
						return result;
					}
				}
				
				return 0;
			});
		
		vGrid.getData().setItems(vGrid.getData().getItems());
		vGrid.invalidate();
		vGrid.updateRowCount(); //로우 카운트 업데이트
		vGrid.render(); //다시 그리기
    });

    
    
    
	vGrid.setSelectionModel(new Slick.CellSelectionModel());
	vGrid.registerPlugin(new Slick.Plugins.Resizer({
        container: '#'+ gridDiv + 'Container',
        calculateAvailableSizeBy: 'container',
        rightPadding: 0,    // defaults to 0
        bottomPadding: 0,  // defaults to 20
        minHeight: 100,     // defaults to 180
        minWidth: 100      // defaults to 300
	}));
	
	vGrid.registerPlugin(new Slick.AutoTooltips({enableForHeaderCells : true}));
	
	// set keyboard focus on the grid
	vGrid.getCanvasNode().focus();

	vGrid.registerPlugin(new Slick.CellExternalCopyManager({
		 readOnlyMode : false
		,includeHeaderWhenCopying : false
		,newRowCreator: function(count) {
			
			for (var i = 0; i < count; i++) {
				
				let defaultInsertOption = vGrid.getOptions().defaultInsert;
				let defaultInsert = {};
				
				let key = Object.keys(gf_nvl(defaultInsertOption, {}));
				for(let i = 0; i < key.length; i++){
					if(typeof defaultInsertOption[key[i]] === 'function'){
						
						let value = defaultInsertOption[key[i]][key[i]];
						if( gf_nvl(value, '') == ''){
							gf_toast(gf_mlg('저장할_마스터ID가_없습니다'), 'info');	//저장할 마스터ID가 없습니다.
							return false;
						}			
						defaultInsert[key[i]] = value;
						
					}else{
						defaultInsert[key[i]] = defaultInsertOption[key[i]];
					}
				}
				
				var items = {
								 'gState': 'inserted'
								,id: 'id_' + new Function('return ' + gridDiv + 'Idx++')()
								
							};
				
				vGrid.getColumns().forEach(function(item){ 
					items[item.id] = "";
				});
				$.extend(items, defaultInsert);
				
//				$.extend(item, defaultInsert);
											
				vGrid.getData().addItem(items);
			}
		}
	}));

	vGrid.onClick.subscribe(function (e, args) {
		//트리일경우
		if ($(e.target).hasClass("tree-toggle")) {
			
			var item = vGrid.getData().getItem(args.row);
			if (item) {
				if (!item._collapsed) {
					item._collapsed = true;
				} else {
					item._collapsed = false;
				}
				vGrid.getData().updateItem(item.id, item);
			}
			e.stopImmediatePropagation();
		}
	});

	vGrid.onCellChange.subscribe(function(event, args) {
		let row = args.row;
		let cell = args.cell;
		let item = args.item;

		if (item['gState'] != 'inserted') {
			item['gState'] = 'updated';
		}
		
		vGrid.getData().updateItem(item.id, item);
		
		gf_gridFooter(cell, args.grid);
	});

	//우클릭으로 메뉴열기
	$('#' + gridDiv + ' .grid-canvas').on('mousedown', function(e) {

		if ((e.button == 2) || (e.which == 3)) {
			var cell = vGrid.getCellFromEvent(e);

			var addEvent = gf_nvl($('#' + gridDiv + 'Context li[onclick^=gf_gridAddRow]').attr('onclick'), '');
			addEvent = (addEvent.indexOf(',') > 0 ? addEvent.substr(0, addEvent.indexOf(',')) + ')' : addEvent);
			$('#' + gridDiv + 'Context li[onclick^=gf_gridAddRow]').attr('onclick', addEvent.replace(')', ',' + JSON.stringify(cell) + ')'));

			var addMultiEvent = gf_nvl($('#' + gridDiv + 'Context li[onclick^=gf_gridAddMultiRow]').attr('onclick'), '');
			addMultiEvent = (addMultiEvent.indexOf(',') > 0 ? addMultiEvent.substr(0, addMultiEvent.indexOf(',')) + ')' : addMultiEvent);
			$('#' + gridDiv + 'Context li[onclick^=gf_gridAddMultiRow]').attr('onclick', addMultiEvent.replace(')', ',' + JSON.stringify(cell) + ')'));

			var removeEvent = gf_nvl($('#' + gridDiv + 'Context li[onclick^=gf_gridRemoveRow]').attr('onclick'), '');
			removeEvent = (removeEvent.indexOf(',') > 0 ? removeEvent.substr(0, removeEvent.indexOf(',')) + ')' : removeEvent);
			$('#' + gridDiv + 'Context li[onclick^=gf_gridRemoveRow]').attr('onclick', removeEvent.replace(')', ',' + JSON.stringify(cell) + ')'));
			
			var exportData = gf_gridExportData(gridDiv);
			var excelFileNm = gf_nvl(new Function('return ' + gridDiv + 'Columns[0].excelFileNm')(), gridDiv);
			$('#' + gridDiv).exportToExcel(excelFileNm + ".xlsx", "Sheet1", exportData, gv_excelOptions, function (response) {});
			
			$('#' + gridDiv + 'Context').css({
				'top': e.pageY
				, 'left': e.pageX
				, 'z-index': '9999'
				, 'display': 'block'
			});
		} else {
			$('.gridContext').css({
				'top': 0
				, 'left': 0
				, 'z-index': '-1'
				, 'display': 'none'
			});
		}
	});
	//////우클릭으로 열 메뉴 생성	-END

	//////마우스 올렸을시 색상강조	-START
	$(document).on('mouseenter', ".slick-row", function() {
		$(this).addClass("slick-row-hover");
	}).on('mouseleave', ".slick-row", function() {
		$(this).removeClass("slick-row-hover");
	});
	//////마우스 올렸을시 색상강조	-END

	vGrid.getData().onRowCountChanged.subscribe(function(e, args) {
		vGrid.updateRowCount();
		vGrid.render();
	});

	vGrid.getData().onRowsChanged.subscribe(function(e, args) {
		
		vGrid.invalidateRows(args.rows);
		vGrid.render();
		gf_gridFooters(vGrid);
	});

	$(vGrid.getHeaderRow()).delegate(":input", "change keyup", function(e) {
		if (vGrid.getEditorLock().isActive()) {
			vGrid.getEditorLock().commitCurrentEdit();
		}
		var columnId = $(this).data("columnId");
		if (columnId != null) {
			columnFilters[columnId] = $.trim($(this).val());
			vGrid.getData().refresh();
		}
	});

	$(vGrid.getHeaderRow()).delegate(":input", "focus", function(e) {
		if (vGrid.getEditorLock().isActive()) {
			vGrid.getEditorLock().commitCurrentEdit();
			$(e.target).focus();
		}
	});

	vGrid.onHeaderRowCellRendered.subscribe(function(e, args) {
		$(args.node).empty();
		var alignClass = 'text-left'
		if(args.column.align == 'CENTER'){
			alignClass = 'text-center'
		}else if(args.column.align == 'RIGHT'){
			alignClass = 'text-right'
		}
		
		$("<input type='text' class='grid-editor-text " + alignClass +"' placeholder='" + gf_mlg('필터') + "'>")
			.data("columnId", args.column.id)
			.val(columnFilters[args.column.id])
			.appendTo(args.node);
	});
	vGrid.init();

	vGrid.getData().beginUpdate();
	vGrid.getData().setItems([]);
	vGrid.getData().setFilter(function filter(item) {
		
		//트리체크
		let i = 0;
		while(i < vGrid.getColumns().length && (vGrid.treeYn == undefined)){
			if(vGrid.getColumns()[i].treeYn == '1'){
				vGrid.treeYn = true;		
			}
			++i;
		}
		if(vGrid.treeYn){
			
			if (item.parent != null) {
				var parent = vGrid.getData().getItems()[item.parent];
			    while (parent) {
					if (parent._collapsed) {
						return false;
					}
					parent = vGrid.getData().getItems()[parent.parent];
				}
			}
		}else{
			vGrid.treeYn = false;
		}
				
		for (var columnId in columnFilters) {
			
			if (columnId !== undefined && columnFilters[columnId] !== "") {
				var c = vGrid.getColumns()[vGrid.getColumnIndex(columnId)];
				//콤보
				if(gf_nvl(c.editor, {}).name == 'Select2Editor'){
					if (String(gf_nvl(c.dataSource[item[c.field]], '')).indexOf(columnFilters[columnId]) == -1) {
						return false;
					}
				}
				//그외
				else{
					if (String(gf_nvl(item[c.field], '')).indexOf(columnFilters[columnId]) == -1) {
						return false;
					}
				}
			}
		}
		return true;
	});
	
	vGrid.getData().endUpdate();
	return vGrid;
}
//그리드 풋터전체갱신
function gf_gridFooters(grid) {
	
	var columnIdx = grid.getColumns().length;
	while (columnIdx--) {
		gf_gridFooter(columnIdx, grid);
	}
}
//그리드 풋터갱신
function gf_gridFooter(cell, grid) {
	var columnId = grid.getColumns()[cell].id;
	
	//건수
	if(grid.getColumns()[cell].footer == 'COUNT'){
		var count = grid.getData().getItems().length;
		var columnElement = grid.getFooterRowColumn(columnId);
		$(columnElement).html(gf_mlg('건수') + " : " + count);
	}
	//합계
	else if(grid.getColumns()[cell].footer == 'SUM'){
		var total = 0;
		var i = grid.getData().getItems().length;
		while (i--) {
			total += (parseInt(grid.getData().getItems()[i][columnId], 10) || 0);
		}
		var columnElement = grid.getFooterRowColumn(columnId);
		$(columnElement).html(gf_mlg('합계') + " : " + total);
	}
	//평균
	else if(grid.getColumns()[cell].footer == 'AVG'){
		var total = 0;
		var i = grid.getData().getItems().length;
		while (i--) {
			total += (parseInt(grid.getData().getItems()[i][columnId], 10) || 0);
		}
		var columnElement = grid.getFooterRowColumn(columnId);
		$(columnElement).html(gf_mlg('평균') + " : " + (total / grid.getData().getItems().length));
	}
	
}

//그리드 저장데이터 생성
function gf_gridSaveData(grid){
	
	//그리드 미생성시
	if(!(grid instanceof Slick.Grid)){
		return [];
	}
	
	grid.getEditorLock().commitCurrentEdit();
	var saveData = [];

	$.each(grid.getData().getItems(),function(index, item){
		//INSERT, UPDATE
		if(gf_nvl(item['gState'], '') != ''){
			saveData.push(item);
		}
	});
	var deletedData = new Function('return ' + grid.getContainerNode().id + 'DataDel')();
	$.each(deletedData,function(index, item){
		//DELETE
		item['gState'] = 'deleted';
		saveData.push(item);
	});
	return saveData;
}

function gf_gridClear(grid){
	
	//그리드 미생성시
	if(!(grid instanceof Slick.Grid)){
		return false;
	}
	
	grid.getEditorLock().commitCurrentEdit();
	try{
		new Function(grid.getContainerNode().id + 'DataDel = [];')();
	}catch(e){}
	try{
		new Function(grid.getContainerNode().id + 'Idx = 0;')();
	}catch(e){}
	grid.getData().setItems([]);
	grid.invalidate();
	grid.updateRowCount(); //로우 카운트 업데이트
	grid.render();
}

function gf_gridRowData(grid, rId, columnNm){
	
	if(gf_nvl(columnNm, '') == ''){
		
		return grid.getData().getItems()[rId];
	}
	else{
		return grid.getData().getItems()[rId][columnNm];
	}	
}

/*****************************************************************************************************************************************************************
 * 
 * 그리드 컨텍스트기능
 * 
 *****************************************************************************************************************************************************************/
//그리드엑셀내보내기
function gf_gridExport(gridDiv) {
	gf_gridRefresh(gridDiv);
}
//그리드 엑셀데이터 생성
function gf_gridExportData(gridDiv) {
	
	var result = [];
	var column = [];
	
	$.each(new Function('return ' + gridDiv + 'Columns')(), function(idx, item){				
		var m = {};
		m[item.id] = {
			name : item.name,
			editor : gf_nvl(item.editor, {}).name,
			dataSource : item.dataSource,
		}
		column.push(m);
	});
	var values = new Function('return ' + gridDiv + '.getData().getItems();')();
	$.each(values, function(idx, item){
					
		var val = {};
		$.each(column, function(idx2, item2){
			
			var id = Object.keys(item2)[0];
			var name = item2[id].name;
			var editor = item2[id].editor;
			var dataSource = item2[id].dataSource;
			
			if(editor == 'Select2Editor'){
				val[name] = gf_nvl(dataSource[item[id]], null);
			}
			else{
				val[name] = gf_nvl(item[id], null);	
			}
			
		});
		result.push(val);
	});
	return result;
}
//그리드 새로고침
function gf_gridRefresh(gridDiv) {

	new Function(gridDiv + '.invalidate()')();
	new Function(gridDiv + '.updateRowCount()')();
	new Function(gridDiv + '.render()')();
	new Function(gridDiv + '.resizeCanvas()')();
	$('.gridContext').css({
		'top': 0
		, 'left': 0
		, 'z-index': '-1'
		, 'display': 'none'
	});
}

//그리드 행추가
function gf_gridAddRow(gridDiv, cell) {
	let grid = new Function('return ' + gridDiv)();
	
	grid.getEditorLock().commitCurrentEdit();
	
	let defaultInsertOption = grid.getOptions().defaultInsert;
	let defaultInsert = {};
	
	let key = Object.keys(gf_nvl(defaultInsertOption, {}));
	for(let i = 0; i < key.length; i++){
		if(typeof defaultInsertOption[key[i]] === 'function'){
			
			let value = defaultInsertOption[key[i]][key[i]];
			if( gf_nvl(value, '') == ''){
				gf_toast(gf_mlg('저장할_마스터ID가_없습니다'), 'info');	//저장할 마스터ID가 없습니다.
				return false;
			}			
			defaultInsert[key[i]] = value;
			
		}else{
			defaultInsert[key[i]] = defaultInsertOption[key[i]];
		}
	}
	
	let items = {
		'gState': 'inserted'
		, 'id': 'id_' + new Function('return ' + gridDiv + 'Idx++')()
	};
	
	grid.getColumns().forEach(function(item){ 
		items[item.id] = "";
	});
	$.extend(items, defaultInsert);
	
	if (cell == null) {
		grid.getData().getItems().push(items); 
	} else {
		grid.getData().getItems().splice((cell.row + 1) , 0, items); 
	}
	grid.getSelectionModel().setSelectedRanges("");
	grid.getData().setItems(grid.getData().getItems());	
	gf_gridRefresh(gridDiv);
}

//그리드 여러행추가
function gf_gridAddMultiRow(gridDiv, cell) {

	let rowNum = Number(prompt(gf_mlg('몇행_추가하시겠습니까?'), 2));//'몇행 추가하시겠습니까?'
	
	let grid = new Function('return ' + gridDiv)();
	grid.getEditorLock().commitCurrentEdit();
	
	let defaultInsertOption = grid.getOptions().defaultInsert;
	let defaultInsert = {};
	
	let key = Object.keys(gf_nvl(defaultInsertOption, {}));
	for(let i = 0; i < key.length; i++){
		if(typeof defaultInsertOption[key[i]] === 'function'){
			
			let value = defaultInsertOption[key[i]][key[i]];
			if( gf_nvl(value, '') == ''){
				gf_toast(gf_mlg('저장할_마스터ID가_업습니다'), 'info');	//저장할 마스터ID가 없습니다.
				return false;
			}			
			defaultInsert[key[i]] = value;
			
		}else{
			defaultInsert[key[i]] = defaultInsertOption[key[i]];
		}
	}
		
	for (let i = 0; i < rowNum; i++) {
		let items = {
			'gState': 'inserted'
			, 'id': 'id_' + new Function('return ' + gridDiv + 'Idx++')()
		};
		
		grid.getColumns().forEach(function(item){ 
			items[item.id] = "";
		});
		
		$.extend(items, defaultInsert);
		if (cell == null) {
			grid.getData().getItems().push(items);
		} else {
			grid.getData().getItems().splice((cell.row + 1) , 0, items);
		}
	}
	grid.getSelectionModel().setSelectedRanges("");
	grid.getData().setItems(grid.getData().getItems());
	gf_gridRefresh(gridDiv);
}

//그리드 행삭제
function gf_gridRemoveRow(gridDiv, cell) {
	
	let grid = new Function('return ' + gridDiv)();
	grid.getEditorLock().cancelCurrentEdit();
	
	if (cell == null) {
		new Function('items', gridDiv + 'DataDel.push(items)')(grid.getData().getItems().pop());
	} else {
		
		//트리
		if(gf_nvl(grid.treeYn, false)){
			var gridData = grid.getData().getItems();
			var parentCnt = 0;
			for(var i = cell.row+1; i < gridData.length; i++){
				if(gf_nvl(gridData[i].parent, '') != ''){
					if(parentCnt > 0){
						gridData[i].parent = (gridData[i].parent-1);	
					}
				}else{
					++parentCnt;
				}
			}
		}
		
		new Function('items', gridDiv + 'DataDel.push(items)')(grid.getData().getItems().splice(cell.row, 1)[0]);			
		
	}
	
	grid.getSelectionModel().setSelectedRanges("");
	grid.getData().setItems(grid.getData().getItems());
	gf_gridRefresh(gridDiv);
}

//그리드 선택된행삭제
function gf_gridRemoveMultiRow(gridDiv) {

	let grid = new Function('return ' + gridDiv)();
	grid.getEditorLock().cancelCurrentEdit();
	
	let selectedRows = grid.getSelectedRows();
	
	//필터걸린부분만 제거
	selectedRows = (selectedRows.length > 0 ? selectedRows.filter(x => x < grid.getDataLength()) : selectedRows);
	
	if (selectedRows.length == 0) {
		gf_toast(gf_mlg('선택된_행이_없습니다'), 'info');	//선택된 행이 없습니다.
		return false;
	}

	//선택된 행을 삭제하겠습니까?
	if (confirm(gf_mlg('선택된_행을_삭제하겠습니까?'))) {

		//트리
		if(gf_nvl(grid.treeYn, false)){
			var gridData = grid.getData().getItems();
			var parentCnt = 0;
			for(var i = Math.max.apply(null,selectedRows)+1; i < gridData.length; i++){
				if(gf_nvl(gridData[i].parent, '') != ''){
					if(parentCnt > 0){
						gridData[i].parent = (gridData[i].parent-selectedRows.length);
					}
				}else{
					++parentCnt;
				}
			}
		}

		//내림차순정렬
		selectedRows.sort(function(a, b)  {
			return b - a;
		});
		for (let i = 0 ; i < selectedRows.length; i++) {

			var idx = grid.getData().getItems().findIndex( x => x=== grid.getData().getItem(selectedRows[i]) );
			new Function('items', gridDiv + 'DataDel.push(items)')(grid.getData().getItems().splice(idx, 1)[0]);
		}
		grid.getSelectionModel().setSelectedRanges("");
	}

	grid.getData().setItems(grid.getData().getItems());
	gf_gridRefresh(gridDiv);

}

//그리드 조회후 데이터 셋팅
var gf_gridCallback = function(p_gridNm, data){
	
	var gird = new Function('return ' + p_gridNm + ';')();
	new Function('length', p_gridNm + 'Idx = length')( data.result.length );
	gird.getData().setItems(data.result);
	gird.invalidate();
	gird.updateRowCount(); //로우 카운트 업데이트
	gird.render(); //다시 그리기
	
	if(gird.getSelectedRows().length > 0
	&& Math.max.apply(null, gird.getSelectedRows()) < gird.getData().getItemCount() ){
		var args = {
				rows : gird.getSelectedRows(),
				grid : gird,
				previousSelectedRows : gird.getSelectedRows()
		}
		gird.onSelectedRowsChanged.notify(args);	
	}
	else{
		gird.getSelectionModel().setSelectedRanges("");
	}
	
}
//탭클릭시 그리드리사이즈
var gf_gridResize = function(p_gridList){
	var v_gridList = gf_nvl(p_gridList, []);
	for (var i = 0; i < v_gridList.length; i++) {
		var grid = new Function('return ' + v_gridList[i])();
		if(grid instanceof Slick.Grid){
			grid.getPluginByName('Resizer').resizeGrid();
		}
	}
}

/*****************************************************************************************************************************************************************
 * 
 * 그리드에디터
 * 
 *****************************************************************************************************************************************************************/
function FormulaEditor(args) {
	var _self = this;
	var _editor = new Slick.Editors.Text(args);
	var _selector;

	$.extend(this, _editor);

	function init() {
		// register a plugin to select a range and append it to the textbox
		// since events are fired in reverse order (most recently added are executed first),
		// this will override other plugins like moverows or selection model and will
		// not require the grid to not be in the edit mode
		_selector = new Slick.CellRangeSelector();
		_selector.onCellRangeSelected.subscribe(_self.handleCellRangeSelected);
		args.grid.registerPlugin(_selector);
	}

	this.destroy = function() {
		_selector.onCellRangeSelected.unsubscribe(_self.handleCellRangeSelected);
		args.grid.unregisterPlugin(_selector);
		_editor.destroy();
	};

	init();
}

//그리드 숫자에디터
function FormulaNumberEditor(args) {
	var _self = this;
	var _editor = new Slick.Editors.Integer(args);
	var _selector;

	$.extend(this, _editor);

	function init() {
		// register a plugin to select a range and append it to the textbox
		// since events are fired in reverse order (most recently added are executed first),
		// this will override other plugins like moverows or selection model and will
		// not require the grid to not be in the edit mode
		_selector = new Slick.CellRangeSelector();
		_selector.onCellRangeSelected.subscribe(_self.handleCellRangeSelected);
		args.grid.registerPlugin(_selector);
	}

	this.destroy = function() {
		_selector.onCellRangeSelected.unsubscribe(_self.handleCellRangeSelected);
		args.grid.unregisterPlugin(_selector);
		_editor.destroy();
	};

	init();
}

//그리드 달력에디터
function FormulaDateEditor(args) {
	var _self = this;
	var _editor = new Slick.Editors.Date(args);
	var _selector;

	$.extend(this, _editor);

	function init() {
		// register a plugin to select a range and append it to the textbox
		// since events are fired in reverse order (most recently added are executed first),
		// this will override other plugins like moverows or selection model and will
		// not require the grid to not be in the edit mode
		_selector = new Slick.CellRangeSelector();
		_selector.onCellRangeSelected.subscribe(_self.handleCellRangeSelected);
		args.grid.registerPlugin(_selector);
	}

	this.destroy = function() {
		_selector.onCellRangeSelected.unsubscribe(_self.handleCellRangeSelected);
		args.grid.unregisterPlugin(_selector);
		_editor.destroy();
	};

	init();
}

//그리드 콤보박스
function Select2Editor(args) {
	var $input;
	var defaultValue;
	var scope = this;
	var calendarOpen = false;
	this.keyCaptureList = [Slick.keyCode.UP, Slick.keyCode.DOWN, Slick.keyCode.ENTER];
	this.init = function() {
		$input = $('<select></select>');
		$input.width(args.container.clientWidth + 3);
		PopulateSelect($input[0], args.column.dataSource, true);
		$input.appendTo(args.container);
//		$input.focus().select();
		$input.select2({
			placeholder: '',
			allowClear: true
		});
		
		$input.siblings('span').find('span[role=combobox]').focus();
	};
	this.destroy = function() {
		$input.select2('close');
		$input.select2('destroy');
		$input.remove();
	};
	this.show = function() {
	};
	this.hide = function() {
	};
	this.position = function(position) {
	};
	this.focus = function() {
		$input.select2('input_focus');
	};
	this.loadValue = function(item) {
		defaultValue = item[args.column.field];
		$input.val(defaultValue);
		$input[0].defaultValue = defaultValue;
		$input.trigger("change.select2");
		
	};
	this.serializeValue = function() {
		return $input.val();
	};
	this.applyValue = function(item, state) {
		item[args.column.field] = state;
	};
	this.isValueChanged = function() {
		return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
	};
	this.validate = function() {
		return {
			valid: true,
			msg: null
		};
	};
	this.init();
}
function PopulateSelect(select, dataSource, addBlank) {
	var index, len, newOption;
	if (addBlank) { select.appendChild(new Option('', '')); }
	$.each(dataSource, function(value, text) {
		newOption = new Option(text, value);
		select.appendChild(newOption);
	});
};

  function CheckboxEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;
    this.args = args;

    this.init = function () {
      $select = $("<INPUT type=checkbox class='editor-checkbox' hideFocus>");
      $select.appendTo(args.container);
      $select.focus();

      // trigger onCompositeEditorChange event when input checkbox changes and it's a Composite Editor
      if (args.compositeEditorOptions) {
        $select.on("change", function () {
          var activeCell = args.grid.getActiveCell();

          // when valid, we'll also apply the new value to the dataContext item object
          if (scope.validate().valid) {
            scope.applyValue(scope.args.item, scope.serializeValue());
          }
          scope.applyValue(scope.args.compositeEditorOptions.formValues, scope.serializeValue());
          args.grid.onCompositeEditorChange.notify({ row: activeCell.row, cell: activeCell.cell, item: scope.args.item, column: scope.args.column, formValues: scope.args.compositeEditorOptions.formValues });
        });
      }
    };

    this.destroy = function () {
      $select.remove();
    };

    this.focus = function () {
      $select.focus();
    };

    this.loadValue = function (item) {
	
      defaultValue = (item[args.column.field] == '1') ? true : false;
      if (defaultValue) {
        $select.prop('checked', true);
      } else {
        $select.prop('checked', false);
      }
    };

    this.preClick = function () {
      $select.prop('checked', !$select.prop('checked'));
    };

    this.serializeValue = function () {
      return $select.prop('checked') ? '1' : '0';
    };

    this.applyValue = function (item, state) {
	
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (this.serializeValue() !== defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

function gf_chkEditFunc(row, cell, grid, tag){
	
	var chk = $(tag).is(':checked');
	var item = grid.getDataItem(row);
	var columnId = grid.getColumns()[cell].id;
	item[columnId] = (chk ? '1' : '0');
	var args = {
		'row' : row
		, 'cell': cell
		, 'item' : item
		, 'grid' : grid
	};
	grid.onCellChange.notify(args);
}
//그리드 공통 포맷
function gf_slickGridFormatter(row, cell, value, columnDef, dataContext){
	
	if(typeof value == 'number'){
		value = String(value);	
	}
	
	var result = value;
	try{
		
		if(columnDef.treeYn == '1'){
			if (value == null || value == undefined || dataContext === undefined) {
				return "";
			}
			value = value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
			var spacer = "<span style='display:inline-block;height:1px;width:" + (15 * dataContext["indent"]) + "px'></span>";
			var idx = columnDef.formatter.arguments[5].getData().getIdxById(dataContext.id);
			
			var data = columnDef.formatter.arguments[5].getData().getItems();
			
			if (data[idx + 1] && data[idx + 1].indent > data[idx].indent) {
				if (dataContext._collapsed) {
					result = spacer + " <span class='tree-toggle expand'></span>&nbsp;" + value;
				} else {
					result = spacer + " <span class='tree-toggle collapse'></span>&nbsp;" + value;
				}
			} else {
				result = spacer + " <span class='tree-toggle'></span>&nbsp;" + value;
			}
		}
		//콤보
		else if(columnDef.editor.name == 'Select2Editor'){
			result = columnDef.dataSource[value] || '';
		}
		//체크박스
		else if(columnDef.editor.name == 'CheckboxEditor'){
			var tag = '<input type="checkbox" class="editor-checkbox" onchange="gf_chkEditFunc('
								+ row  + ','
								+ cell + ','
								+ columnDef.formatter.arguments[5].getContainerNode().id + ',this);" ' + (value == '1' ? "checked" :  "" ) + '>'
				
			result = tag;
		}
	
	}catch(e){}
	
	return result;
}

//파일사이즈 변환값
function gf_getFileSize(p_size){
	
	if ((p_size / 1024) < 1) {
        p_size = p_size + 'byte';
    } else if ((p_size / 1024 / 1024) < 1) {
        p_size = (p_size / 1024).toFixed(1) + 'KB';
    } else if ((p_size / 1024 / 1024 / 1024) < 1) {
        p_size = (p_size / 1024 / 1024).toFixed(1) + 'MB';
    } else if ((p_size / 1024 / 1024 / 1024 / 1024) < 1) {
        p_size = (p_size / 1024 / 1024 / 1024).toFixed(1) + 'GB';
    }

    return p_size;
}

//FormData 에서 공백,null,undefined 값제거
function gf_delFormData(p_formData){
	
	var deleteKey = [];
	for (var key of p_formData.keys()) {
	   if(gf_nvl(p_formData.get(key), '') === ''){
		   deleteKey.push(key);
	   }
	}
	$.each(deleteKey, function(idx, item){
		p_formData.delete(item);
	});
}

//모달생성
function gf_modal(p_modalId, p_option){
	
	var v_height = gf_nvl(p_option.height, '') == '' ? 500 : p_option.height;
	var v_width = gf_nvl(p_option.width, '') == '' ? 500 : p_option.width;
	var v_buttons = gf_nvl(p_option.buttons, '') == '' ? {} : p_option.buttons;
	var v_resizable = gf_nvl(p_option.resizable, '') == '' ? false : p_option.resizable;
	
	return $('#' + p_modalId ).dialog({
		modal: true,  
		autoOpen: false,
		resizable: v_resizable,
		height: v_height,
		width: v_width,
		buttons: v_buttons
	});
	
}

//자동완성태그
/**
 * 
 * @param p_tagId : 태그 id
 * @param p_items : [{
							label : 텍스트, 
							category : 카테고리,	카테고리가 없는경우 '' 으로할것
							value : 텍스트
							..
						}]
 * @param p_callback : 선택시 실행함수
 * @param p_chgCallback : 값 변경시 실행함수(선택안하고 나갔을경우)
 * @returns
 */
function gf_autoComplete(p_tagId, p_items, p_callback, p_chgCallback){
	
	//카테고리 없음
	if(p_items.filter(x=>x.category != '').length == 0){
		$.widget("custom.catcomplete", $.ui.autocomplete, {
		      _create: function() {
		        this._super();
		        this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
		      },
		      _renderMenu: function( ul, items ) {
		        var that = this,
		          currentCategory = "";
		        $.each( items, function( index, item ) {
		          that._renderItemData( ul, item );
		        });
		        ul.find('div').addClass('pd-default2');
		      }
		});
	}
	//카테고리 있음	
	else{
		$.widget("custom.catcomplete", $.ui.autocomplete, {
		      _create: function() {
		        this._super();
		        this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
		      },
		      _renderMenu: function( ul, items ) {
		        var that = this,
		          currentCategory = "";
		        $.each( items, function( index, item ) {
		          var li;
		          if ( item.category != currentCategory ) {
		            ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
		            currentCategory = item.category;
		          }
		          li = that._renderItemData( ul, item );
		          if ( item.category ) {
		            li.attr( "aria-label", item.category + " : " + item.label ).children();
		          }
		        });
		      }
		});
	}
	
	
	$("#" + p_tagId).catcomplete({
		delay: 0,
		source: p_items,
		minLength: 0,
		select: p_callback,
		change: function( event, ui ) {
			
			if(typeof p_chgCallback == 'function'){
				p_chgCallback( event, ui );	
			}
			else{
				if(ui.item == null){
					var ui = {
							item : {}
					}
					p_callback( event, ui );
				}
				else{
					p_callback( event, ui );
				}	
			}
			
		}
	});
	
}

//에디터 값
function gf_getEditorValue(p_editor){
	
	var val = $('#' + p_editor).get(0).contentWindow.document.getElementsByClassName('ck-content')[0].getInnerHTML();
	
    return val;
}
//에디터 값입력
function gf_setEditorValue(p_editor, p_value){
	
	var intervalId = setInterval(function(){
		try{
			$('#' + p_editor).get(0).contentWindow.watchdog.editor.setData(p_value);
			clearInterval(intervalId);
		}catch(e){
			setTimeout(function(){
				clearInterval(intervalId);
			}, 10000);
		}
	},10);
	
	
}
//에디터 모드변경
function gf_editorEditable(p_editor, p_value){
	
	var intervalId = setInterval(function(){
		try{
			if(p_value){
				$('#' + p_editor).get(0).contentWindow.watchdog.editor.isReadOnly = false;
			}
			else{
				$('#' + p_editor).get(0).contentWindow.watchdog.editor.isReadOnly = true;
			}
			clearInterval(intervalId);
		}catch(e){
			setTimeout(function(){
				clearInterval(intervalId);
			}, 10000);
		}
	},10);
}

/*****************************************************************************************************************************************************************
 * 
 * 토스트
 * type : success, danger, info, 기본
 * 
 *****************************************************************************************************************************************************************/
function gf_toast(text, p_type) {
	var option = {};

	//성공시
	if (p_type == 'success') {
		option = {
			duration: 2000
			, type: p_type
		};
	}
	//에러발생시
	else if (p_type == 'danger') {
		option = {
			sticky: true
			, type: p_type
		};
	}
	//정보알림
	else if (p_type == 'info') {
		option = {
			duration: 3000
			, type: p_type
		};
	}
	else {
		option = {
			duration: 3000
		};
	}
	$.toast(text, option);
}
