/**
 * 계획등록
 */
let calendar;
$(document).ready(function() {

	//그리드셋팅
	f_setMasterGrid();
	
	//달력셋팅
	f_setCalendar();
	
	//항목추가 버튼
	$('#itemPlusBtn').on('click', f_addItem);
	
	//달력에 적용
	$('#START_DATE').on('change', f_calendarRefresh);
	$('#END_DATE').on('change', f_calendarRefresh);
	$('#sun').on('change', f_calendarRefresh); 
	$('#mon').on('change', f_calendarRefresh); 
	$('#tue').on('change', f_calendarRefresh); 
	$('#wed').on('change', f_calendarRefresh); 
	$('#thu').on('change', f_calendarRefresh); 
	$('#fri').on('change', f_calendarRefresh); 
	$('#sat').on('change', f_calendarRefresh); 
	
	
	f_refresh();
	f_search();
});

var f_addItem = function(){
	
	var tr = $('<tr>').addClass('pd-tp-default');
	var tdItemName = $('<td>').addClass('pd-rt-default pd-tp-default2').append( $('<input type="text" name="ITEM_NAME" onchange="f_calendarRefresh();" >').addClass('form form-text') );
	tr.append(tdItemName);
	var tdTarget = $('<td>').addClass('pd-rt-default pd-tp-default2').append( $('<input type="number" min=1 name="TARGET">').addClass('form form-text') );
	tr.append(tdTarget);
	
	var hideClass = '';
	if($('#MY_PLAN_ITEM_TABLE tbody tr').length == 0){
		hideClass = ' hide';
	}
	var tdRemoveBtn = $('<td>').addClass('pd-rt-default pd-tp-default2').append( $('<button type="button" onclick="f_removeItem(this);">').addClass('item-btn' + hideClass).append( $('<span>').addClass('ui-icon ui-icon-minus') ) );
	tr.append(tdRemoveBtn);
	
	$('#MY_PLAN_ITEM_TABLE tbody').append(tr);
}
var f_removeItem = function(me){
	$(me).closest('tr').remove();
	f_calendarRefresh();
}
/*****************************************************************************************************************************************************************
 * 
 * 그리드 셋팅
 * 
 *****************************************************************************************************************************************************************/
var f_setMasterGrid = function(){

	masterGrid = gf_gridInit('masterGrid', {
		forceFitColumns: true
    });
	masterGrid.onSelectedRowsChanged.subscribe(function (e, args) {
				
		//상세 조회
		f_detailSearch();
    });
}

/*****************************************************************************************************************************************************************
 * 
 * 달력
 * 
 *****************************************************************************************************************************************************************/
var f_setCalendar = function(){
	var calendarEl = document.getElementById('calendar');
	
	calendar = new FullCalendar.Calendar(calendarEl, {
		height: '100%',
		initialDate: new Date().yyyy_mm_dd(),
		locale: gf_getLang(),
		editable: false,
		selectable: true,
		businessHours: true,
		dayMaxEvents: true, // allow "more" link when too many events
		headerToolbar: {
			left: 'title',
			right: ''
		}
	});

    calendar.render();
}

//달력에 적용
var f_calendarRefresh = function(){
	console.log('f_calendarRefresh');
	calendar.today();
	//달력 데이터삭제
	$.each(calendar.getEventSources(), function(idx, item){
		item.remove();
	});
	
	var calendar_start = calendar.currentData.dateProfile.currentRange.start;
	var calendar_end = calendar.currentData.dateProfile.currentRange.end;
		
	var start_date;
	var end_date;
	var event_list = [];
	//시작일셋팅
	if($('#START_DATE').val() == ''){
		start_date = calendar_start;
	}
	else if(new Date($('#START_DATE').val()) < calendar_start){
		start_date = calendar_start;
	}
	else if(new Date($('#START_DATE').val()) > calendar_end){
		return false;
	}
	else{
		start_date = new Date($('#START_DATE').val());
	}
	//종료일셋팅	
	if($('#END_DATE').val() == ''){
		end_date = calendar_end;
	}
	else if(new Date($('#END_DATE').val()) < calendar_end){
		end_date = new Date($('#END_DATE').val()).gf_addDays(1);
	}
	else if(new Date($('#END_DATE').val()) < calendar_start){
		return false;
	}
	else{
		end_date = new Date($('#END_DATE').val()).gf_addDays(1);
	}
	
	for (var curr_date = start_date; curr_date < end_date; curr_date.gf_addDays(1)) {
		$.each($('#MY_PLAN_ITEM_TABLE tbody tr input[name=ITEM_NAME]'), function(idx, item){
			if(item.value != ''
			&& makeApplyDay().split('')[curr_date.getDay()] == '1'){
				
				event_list.push({
					title : item.value,
					start : curr_date.yyyy_mm_dd(),
					end : curr_date.yyyy_mm_dd(),
				});
			}
		});
		
	}

	
	if(event_list.length > 0){
		calendar.addEventSource(event_list);	
	}
	
}
/*****************************************************************************************************************************************************************
 * 
 * 버튼 기능
 * 
 *****************************************************************************************************************************************************************/
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_MY_PLAN');
	gf_ajax( fData
			, function(){
				
				gf_gridClear(masterGrid);
							
			}
			, function(data){
				
				gf_gridCallback('masterGrid', data);
				
			});
}
var f_detailSearch = function(){
	f_refresh();
	var MY_PLAN_ID = gf_gridSelectVal(masterGrid, 'MY_PLAN_ID');
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_MY_PLAN');
	fData.set('MY_PLAN_ID', MY_PLAN_ID);
	
	if(gf_nvl(MY_PLAN_ID, '') == ''){
		return false;
	}
	
	//계획조회
	gf_ajax( fData
			, null
			, function(data){
				if(data.result.length > 0){
					$('#MY_PLAN_ID').val(data.result[0].MY_PLAN_ID);
					$('#PLAN_NAME').val(data.result[0].PLAN_NAME);
					$('#START_DATE').val(data.result[0].START_DATE);
					$('#END_DATE').val(data.result[0].END_DATE);
					checkApplyDay(data.result[0].APPLY_DAY);
				}
			}, null, null, null, false);
	
	//항목조회
	var fData2 = new FormData();
	fData2.set('QUERY_ID', 'my.S_MY_PLAN_ITEM');
	fData2.set('MY_PLAN_ID', MY_PLAN_ID);
	gf_ajax( fData2
			, null
			, function(data){
				if(data.result.length > 0){
					$.each(data.result, function(idx, item){
						if(idx > 0){
							f_addItem();	
						}
						$('#MY_PLAN_ITEM_TABLE tbody tr:eq(' + idx + ') input[name=ITEM_NAME]').val(item.ITEM_NAME);
						$('#MY_PLAN_ITEM_TABLE tbody tr:eq(' + idx + ') input[name=TARGET]').val(item.TARGET);
					});
					
				}
			}, null, null, null, false);
	
	//달력적용
	f_calendarRefresh();
}
var f_save = function(){
	
	//계획명
	if($('#PLAN_NAME').val() == ''){
		gf_toast(gf_mlg('계획명을_입력하세요'), 'info');
		$('#PLAN_NAME').focus();
		return false;
	}
	//시작일
	else if($('#START_DATE').val() == ''){
		gf_toast(gf_mlg('시작일을_입력하세요'), 'info');
		$('#START_DATE').focus();
		return false;
	}

	var fData = new FormData();
	
	var planQuery = 'com.U_COMM_QUERY';
	if($('#MY_PLAN_ID').val() == ''){
		planQuery = 'com.I_COMM_QUERY';
	}
	
	//계획데이터
	var planDara = {
		QUERY_ID : planQuery,
		TABLE_NAME : 'MY_PLAN',
		MY_PLAN_ID : $('#MY_PLAN_ID').val(),
		COMM_USER_ID : gv_commUserId,
		PLAN_NAME : $('#PLAN_NAME').val(),
		START_DATE : new Date($('#START_DATE').val()).yyyymmdd(),
		END_DATE : new Date($('#END_DATE').val()).yyyymmdd(),
		APPLY_DAY : makeApplyDay()
	};
	fData.append('planForm', JSON.stringify(planDara));
		
	var itemLen = $('#MY_PLAN_ITEM_TABLE tbody tr').length;
	var itemList = [];
	var targetList = [];
	for (var i=0; i<itemLen; i++) {
		var ITEM_NAME = $('#MY_PLAN_ITEM_TABLE tbody tr:eq(' + i + ') input[name=ITEM_NAME]').val();
		var TARGET = $('#MY_PLAN_ITEM_TABLE tbody tr:eq(' + i + ') input[name=TARGET]').val();
		if(ITEM_NAME == ''){
			gf_toast(gf_mlg('항목을_입력하세요'), 'info');
			$('#MY_PLAN_ITEM_TABLE tbody tr:eq(' + i + ') input[name=ITEM_NAME]').focus();
			return false;
		}
		if(Number(TARGET) < 1){
			gf_toast(gf_mlg('목표를_입력하세요'), 'info');
			$('#MY_PLAN_ITEM_TABLE tbody tr:eq(' + i + ') input[name=TARGET]').focus();
			return false;
		}
		
		itemList.push(ITEM_NAME);
		targetList.push(TARGET);
	}
	
	//항목데이터
	var itemDara = {
		QUERY_ID : 'my.I_MY_PLAN_ITEM',
		TABLE_NAME : 'MY_PLAN_ITEM',
		MY_PLAN_ID : $('#MY_PLAN_ID').val(),
		ITEM_NAME : itemList.join('[@;,;@]'),
		TARGET : targetList.join('[@;,;@]'),
	};
	
	if($('#MY_PLAN_ID').val() == ''){
		delete itemDara['MY_PLAN_ID'];
		itemDara['GET_PARAM'] = {
			MY_PLAN_ID : 'planForm.seq_pk'
		};
	}
	
	fData.append('itemForm', JSON.stringify(itemDara));
	
	gf_ajax( fData
			, null
			, function(data){
				
				$('#MY_PLAN_ID').val( gf_nvl(data.result.planForm.result.seq_pk, data.result.planForm.result.MY_PLAN_ID) );
				gf_toast(gf_mlg('저장_되었습니다'), 'success');
				f_search();
			}
			, null
			, null
			, '/save');
}

var makeApplyDay = function(){
	var applyDay = '';
	//일
	if($('#sun').is(':checked')){applyDay += '1';}else{applyDay += '0';}
	//월
	if($('#mon').is(':checked')){applyDay += '1';}else{applyDay += '0';}
	//화
	if($('#tue').is(':checked')){applyDay += '1';}else{applyDay += '0';}
	//수
	if($('#wed').is(':checked')){applyDay += '1';}else{applyDay += '0';}
	//목
	if($('#thu').is(':checked')){applyDay += '1';}else{applyDay += '0';}
	//금
	if($('#fri').is(':checked')){applyDay += '1';}else{applyDay += '0';}
	//토
	if($('#sat').is(':checked')){applyDay += '1';}else{applyDay += '0';}
	
	return applyDay;
}
var checkApplyDay = function(p_applyDay){
	var applyDaySp = p_applyDay.split('') ;
	
	//일
	if(applyDaySp[0] == '1'){$('#sun').prop('checked', true);}else{$('#sun').prop('checked', false);}
	//월
	if(applyDaySp[1] == '1'){$('#mon').prop('checked', true);}else{$('#mon').prop('checked', false);}
	//화
	if(applyDaySp[2] == '1'){$('#tue').prop('checked', true);}else{$('#tue').prop('checked', false);}
	//수
	if(applyDaySp[3] == '1'){$('#wed').prop('checked', true);}else{$('#wed').prop('checked', false);}
	//목
	if(applyDaySp[4] == '1'){$('#thu').prop('checked', true);}else{$('#thu').prop('checked', false);}
	//금
	if(applyDaySp[5] == '1'){$('#fri').prop('checked', true);}else{$('#fri').prop('checked', false);}
	//토
	if(applyDaySp[6] == '1'){$('#sat').prop('checked', true);}else{$('#sat').prop('checked', false);}
	
}
var f_refresh = function(){
	$('#MY_PLAN_ID').val('');
	$('#PLAN_NAME').val('');
	$('#START_DATE').val(new Date().yyyy_mm_dd());
	$('#END_DATE').val('');
	checkApplyDay('1111111');

	$('#MY_PLAN_ITEM_TABLE tbody tr').remove();
	f_addItem();
}
var f_add = function(){
	if(confirm(gf_mlg('추가_하시겠습니까'))){
		masterGrid.setSelectedRows([]);
		f_refresh();
	}
}
var f_delete = function(){
	if(confirm(gf_mlg('삭제_하시겠습니까'))){
		
		if($('#MY_PLAN_ID').val() == ''){
			gf_toast(gf_mlg('대상을_선택하세요'), 'info');	//선택된 행이 없습니다.
			return false;
		}
		
		var fData = new FormData();
		
		//삭제데이터
		var deleteDara = {
			QUERY_ID : 'my.D_MY_PLAN_ALL',
			MY_PLAN_ID : $('#MY_PLAN_ID').val()
		};
		
		fData.append('deleteForm', JSON.stringify(deleteDara));
		
		gf_ajax( fData
				, null
				, function(data){
					f_refresh();
					gf_toast(gf_mlg('삭제_되었습니다'), 'success');
					f_search();
				}
				, null
				, null
				, '/save');
		
	}
}
 