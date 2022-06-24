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
	
	f_search();
	
});
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
		  }
	});
	
    calendar.render();
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
//	            format: function(value, ratio) {
//	                return value;
//	            },
	            show: false // to turn off the min/max labels.
	        },
//	    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
//	    max: 100, // 100 is default
//	    units: ' %',
	    width: 100 // for adjusting arc thickness
	    },
	    color: {
	        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
	        threshold: {
//	            unit: 'value', // percentage is default
//	            max: 100, // 100 is default
	            values: [30, 60, 90, 100]
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


