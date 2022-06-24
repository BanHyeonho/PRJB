/**
 * 달력 
 */
let calendar;
let chart;
$(document).ready(function() {
	//달력셋팅
	f_setCalendar();
	
	//차트셋팅
	f_setChart();
	
	//모달셋팅
	f_set_modal();
	
	
	f_search();
});
/*****************************************************************************************************************************************************************
 * 
 * 모달
 * 
 *****************************************************************************************************************************************************************/
var f_set_modal = function(){
	
	//실적입력 모달
	var registResultOption = {
			resizable : false,
			height: 350,
			width: 500,
			buttons : {}
	}
	registResultOption.buttons[gf_mlg('확인')] = function(){
   	
		var fData = new FormData();
		
		var noData = true;
		$.each($('#modal_registResult table tbody tr'), function(idx, item){
			var resultVal = $(item).find('input[name=RESULT]').val();
			var beforeVal = $(item).find('input[name=RESULT]').attr('before_value');
			if(gf_nvl(resultVal, '') != gf_nvl(beforeVal, '')){
				var resultDara = {
					QUERY_ID : 'my.U_MY_PLAN_RESULT',
					MY_PLAN_ITEM_ID : $(item).find('input[name=MY_PLAN_ITEM_ID]').val(),
					THE_DATE : $(item).find('input[name=THE_DATE]').val(),
					RESULT : resultVal
				};
				fData.append(idx + 'resultForm', JSON.stringify(resultDara));
				noData = false;
			}
			
		});
		
		if(noData){
			$('#modal_registResult').dialog('close');
			return false;
		}
		
		gf_ajax( fData
				, null
				, function(data){
					$('#modal_registResult').dialog('close');
					gf_toast(gf_mlg('저장_되었습니다'), 'success');
					f_searchCal();
				}
				, null
				, null
				, '/save');

	};
   
	registResultOption.buttons[gf_mlg('닫기')] = function(){
   		$(this).dialog('close');
	};
   gf_modal('modal_registResult', registResultOption);
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
			right: 'today prev,next'
		},
		customButtons: {
			today: {
				text: gf_mlg('오늘'),
				click: function() {
					calendar.today();
					f_search();
				}
			},
		    prev: {
		    	text: gf_mlg('이전달'),
		    	click: function() {
		    		calendar.prev();
		    		f_search();
	    		}
		    },
		    next: {
		    	text: gf_mlg('다음달'),
		    	click: function() {
		    		calendar.next();
		    		f_search();
	    		}
		    },			    
		},
		dateClick : function(e){
			f_openModal(e.date);
		}
	});
	
    calendar.render();
}
var f_openModal = function(p_date){
	$("#modal_registResult table tbody tr").remove();
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_MY_PLAN_RESULT_ONEDAY');
	fData.set('SEARCH_DATE', p_date.yyyymmdd());
	gf_ajax( fData
			, null
			, function(data){
		
				if(data.result.length > 0){
					$.each(data.result, function(idx, item){
						
						var tr = $('<tr>').addClass('line-tp');
						var itemName = $('<td style="width: 65%;">').addClass('pd-default line-rt').append( $('<input type="hidden" name="MY_PLAN_ITEM_ID">').val(item.MY_PLAN_ITEM_ID) )
																									.append( $('<input type="hidden" name="THE_DATE">').val(item.THE_DATE) )
																									.append( $('<span>').text(item.ITEM_NAME) );
						tr.append(itemName);
						
						var target = $('<td style="width: 15%; text-align: center;">').addClass('pd-default line-rt').append( $('<span>').text(item.TARGET) );
						tr.append(target);
						
						var result = $('<td style="width: 20%;">').addClass('pd-default2').append( $('<input class="form form-text" type="number" name="RESULT" min="0" before_value="'+ gf_nvl(item.RESULT, '') +'">').val(item.RESULT) );
						tr.append(result);
						
						$('#modal_registResult table tbody').append(tr);
						
					});
					$( "#modal_registResult" ).dialog({title : '(' + p_date.yyyy_mm_dd() + ') ' + gf_mlg('실적입력') })
					$( "#modal_registResult" ).dialog('open');
				}
				
			});
	
	
	
}
/*****************************************************************************************************************************************************************
 * 
 * 차트
 * 
 *****************************************************************************************************************************************************************/
var f_setChart = function(){
	chart = c3.generate({
	    data: {
	        columns: [
	            [gf_mlg('종합'), 0]
	        ],
	        type: 'gauge',
	    },
	    gauge: {
	        label: {
	            show: false // to turn off the min/max labels.
	        },
	    width: 100 // for adjusting arc thickness
	    },
	    color: {
	        pattern: gv_gaugeColor.pattern,
	        threshold: {
	            values: gv_gaugeColor.values
	        }
	    },
	    size: {
	        height: 250
	    }
	});
	
}

/*****************************************************************************************************************************************************************
 * 
 * 저장
 * 
 *****************************************************************************************************************************************************************/
var f_saveList = function(me){
	var tr = $(me).closest('tr');
	var checked = tr.find('input[type=checkbox]').is(':checked') ? '1' : '0';
	var cal_type =tr.find('input[type=checkbox]').attr('cal_type');
	var key_id = tr.find('input[type=checkbox]').attr('key_id');
	var color = tr.find('input.minicolors').val();
	
	var fData = new FormData();

	//목록체크
	var listDara = {
		QUERY_ID : 'my.U_MY_CALENDAR_LIST',
		CAL_TYPE : cal_type,
		KEY_ID : key_id,
		CHECKED_YN : checked,
		COLOR : color,
	};
	fData.append('listForm', JSON.stringify(listDara));
	
	gf_ajax( fData
			, null
			, function(data){
		
				//색상편집기
				if( $(me).hasClass('minicolors') ){
					f_searchList();
					f_searchCal();
				}
				//그외
				else{
					f_search();
				}
			}
			, null
			, null
			, '/save');
	
}
/*****************************************************************************************************************************************************************
 * 
 * 조회
 * 
 *****************************************************************************************************************************************************************/
var f_search = function(){
	f_searchList();
	f_searchChart();
	f_searchCal();
}
var f_searchList = function(){
	
	//목록조회
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_CALENDAR_VIEW_LIST');
	fData.set('SEARCH_DATE', calendar.getDate().yyyymmdd());
	gf_ajax( fData
			, function(){
				$('#listTable tbody tr').remove();	
			}
			, function(data){
				$.each(data.result, function(idx, item){
					
					var tr = $('<tr>');
					var chkbox = $('<input class="form-checkbox" type="checkbox" onchange="f_saveList(this);" id="' + item.CAL_TYPE + '_' + item.KEY_ID + '" '
																											+ 'cal_type="' + item.CAL_TYPE + '" '
																											+ 'key_id="' + item.KEY_ID + '" '
																											+ (gf_nvl(item.CHECKED_YN, '0') == '1' ? 'checked' : '') + ' >');
					
					var chkboxTd = $('<td>').addClass('pd-default line-rt').append(chkbox);
					tr.append(chkboxTd);
					
					var color = $('<td>').addClass('pd-default').append( $('<input class="minicolors" type="hidden">') );
					tr.append(color);
					
					var label = $('<td>').addClass('pd-default').append( $('<label for="' + item.CAL_TYPE + '_' + item.KEY_ID + '" class="color-label" >').text(item.TITLE) );
					tr.append(label);
					
					if(idx == 0
					|| item.CAL_TYPE != data.result[idx-1].CAL_TYPE
					){
						tr.addClass('line-tp');
					}
					
					$('#listTable tbody').append(tr);
					f_color(tr.find('.minicolors'), item.COLOR);
				});
			});
}
var f_color = function(p_target, p_color){
	var defaultColor;
	
	if(gf_nvl(p_color, '') == ''){
		var defaultIdx = Math.floor(Math.random() * gv_color.length);
		defaultColor = gv_color[defaultIdx];
	}
	else{
		defaultColor = p_color;
	}
	
	p_target.minicolors({
		        control: 'wheel',	
				position:'bottom left',
				swatches: gv_color,
				defaultValue : defaultColor,
				hide: function() {
					f_saveList(this);
				}
		    });
}
var f_searchChart = function(){
	//달성율
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_CALENDAR_VIEW_LIST_CHART');
	fData.set('SEARCH_DATE', calendar.getDate().yyyymmdd());
	gf_ajax( fData
			, null
			, function(data){
				
				if(data.result.length > 0){
					var columns = [];
					var total = 0;
					$.each(data.result, function(idx, item){
						columns.push([item.ITEM_NAME, item.ACHIEVE_RATE]);
						total += Number(item.ACHIEVE_RATE);
					});
					
					if(data.result.length > 1){
						columns.push([gf_mlg('종합'), (total/data.result.length).toFixed(1) ]);	
					}
					
					chart.load({
				        columns: columns
				        ,unload: chart.data().map(x=>x.id)
				    });
				}
				else{
					chart.unload({
						ids: chart.data().map(x=>x.id)
					});
				}
			});
}
var f_searchCal = function(){
	//달성율
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_CALENDAR_VIEW_CALENDAR');
	fData.set('SEARCH_DATE', calendar.getDate().yyyymmdd());
	gf_ajax( fData
			, null
			, function(data){
				
				//달력 데이터삭제
				$.each(calendar.getEventSources(), function(idx, item){
					item.remove();
				});
				if(data.result.length > 0){
					calendar.addEventSource(data.result);
				}
				
			});
}


