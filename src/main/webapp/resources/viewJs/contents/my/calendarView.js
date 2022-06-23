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
	
	f_searchList();
	
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
	            ['종합', 0]
	        ],
	        type: 'gauge',
	        onclick: function (d, i) { console.log("onclick", d, i); },
	        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
	        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
	    },
	    gauge: {
//	        label: {
//	            format: function(value, ratio) {
//	                return value;
//	            },
//	            show: false // to turn off the min/max labels.
//	        },
//	    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
//	    max: 100, // 100 is default
//	    units: ' %',
	    width: 100 // for adjusting arc thickness
	    },
	    color: {
	        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
	        threshold: {
//	            unit: 'value', // percentage is default
//	            max: 200, // 100 is default
	            values: [30, 60, 90, 100]
	        }
	    },
	    size: {
	        height: 270
	    }
	});
	
	setInterval(function(){
		
		chart.load({
	        columns: [['종합', Math.floor(Math.random() * 110)]]
	    });
		chart.load({
	        columns: [['data1', Math.floor(Math.random() * 110)]]
	    });
		chart.load({
	        columns: [['data2', Math.floor(Math.random() * 110)]]
	    });
	}, 1500);
	
}

var f_searchList = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'my.S_CALENDAR_VIEW_LIST');
	
	gf_ajax( fData
			, function(){
				$('#listTable tbody tr').remove();	
			}
			, function(data){
				$.each(data.result, function(idx, item){
										
					var tr = $('<tr>');
					var chkbox = $('<td>').addClass('pd-default line-rt').append( $('<input class="form-checkbox" type="checkbox" id="' + item.CAL_TYPE + '_' + item.KEY_ID + '" >') );
					tr.append(chkbox);
					
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
					f_color(tr.find('.minicolors'));
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
				defaultValue : defaultColor
		    });
	

}