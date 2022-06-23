/**
 * 실적등록
 */
let calendar;
$(document).ready(function() {

	//그리드셋팅
	f_setMasterGrid();
	f_setDetailGrid();
	
	//달력셋팅
	f_setCalendar();

	$('#searchParam1').val(gf_getDate('month'));
});

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
		
		var detailData = gf_gridSaveData(detailGrid);
		if(gridEventIgnore){
			gridEventIgnore = false;
			return false;
		}
		else if( detailData.state != 'empty'
			 ){
		
			if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
				gridEventIgnore = true;	
				masterGrid.setSelectedRows(args.previousSelectedRows);
				return false;
			}
		}
		else if(args.rows.length == 0){
			return false;
		}
		
		//실적 조회
		f_detailSearch();
    });
}
var f_setDetailGrid = function(){

	detailGrid = gf_gridInit('detailGrid', {
		forceFitColumns: false
    });
	
}
/*****************************************************************************************************************************************************************
 * 
 * 달력
 * 
 *****************************************************************************************************************************************************************/
var f_setCalendar = function(p_date){
	var calendarEl = document.getElementById('calendar');

	var v_date = gf_nvl(p_date, gf_getDate('today'));
	
	calendar = new FullCalendar.Calendar(calendarEl, {
		height: '100%',
		initialDate: v_date,
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
var f_calendarRefresh = function(p_data){
	
	f_calendarClear();
	
	var event_list = [];
	$.each(p_data, function(idx, item){
		event_list.push({
			title : item.ITEM_NAME,
			start : item.THE_DATE,
			end : item.THE_DATE,
		});
	});
	
	if(event_list.length > 0){
		calendar.addEventSource(event_list);	
	}
	
}
var f_calendarClear = function(){
	
	calendar.destroy();
	
	var initDate;
	if($('#searchParam1').val() != ''){
		initDate = $('#searchParam1').val() + '-01';
	}
	else{
		initDate = gf_getDate('today');
	}
	
	f_setCalendar(initDate);
	
}
/*****************************************************************************************************************************************************************
 * 
 * 버튼 기능
 * 
 *****************************************************************************************************************************************************************/
var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_MY_PLAN');
	
	if($('#searchParam1').val() != ''){
		fData.set('SEARCH_DATE', $('#searchParam1').val().replace(/-/g, '') + '01');
	}	
	gf_ajax( fData
			, function(){
				
				var detailData = gf_gridSaveData(detailGrid);
		
				if(detailData.state != 'empty'
				){
					if(!confirm(gf_mlg('수정된_데이터를_저장하지_않고,_조회_하시겠습니까?'))){
						return false;
					}
				}
				
				gf_gridClear(detailGrid);
				gf_gridClear(masterGrid);
				f_calendarClear();
							
			}
			, function(data){
				
				gf_gridCallback('masterGrid', data);
				
			});
}
var f_detailSearch = function(){
	
	var MY_PLAN_ID = gf_gridSelectVal(masterGrid, 'MY_PLAN_ID');
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_MY_PLAN_RESULT');
	fData.set('MY_PLAN_ID', MY_PLAN_ID);
	
	if($('#searchParam1').val() != ''){
		fData.set('SEARCH_DATE', $('#searchParam1').val().replace(/-/g, '') + '01');
	}
	else{
		fData.set('SEARCH_DATE', gf_getDate('today'));	
	}
	
	if(gf_nvl(MY_PLAN_ID, '') == ''){
		return false;
	}
	
	//계획조회
	gf_ajax( fData
			, function(){
		
				gf_gridClear(detailGrid);
							
			}
			, function(data){
				console.log(data);
				gf_gridCallback('detailGrid', data);
				
				//달력적용
				setTimeout(function(){
					f_calendarRefresh(data.result);	
				}, 0);
				
				
			});
}
var f_save = function(){
	var detailData = gf_gridSaveData(detailGrid);
	$.each(detailData.data, function(idx, item){
		item['COMM_USER_ID'] = gv_commUserId;
	});
		
	if(!(detailData.state == 'success')
	){
		gf_toast(detailData.reason, 'info');
		return false;
	}
	
	var fData = new FormData();

	gf_ajax( fData
			, function(){
									
				detailData.data.unshift({
					'QUERY_ID' : 'my.MY_PLAN_RESULT'
				});
				fData.set('detailGrid', JSON.stringify(detailData.data));
					
			}
			, function(data){
				
				gf_gridClear(masterGrid);
				gf_gridClear(detailGrid);
				f_search();
			}
			, null
			, null
			, '/save');
	
}
