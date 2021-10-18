/**
 * 공통 document ready
 */
$(document).ready(function() {
	
	//자동완성 사용안함
	$('input').attr('autocomplete', 'off');
	
	//엔터입력시 실행
	$('[enter-exec]').on('keydown',function(e){
		//엔터
		if(e.which == 13){
			e.preventDefault();
			e.stopPropagation();
			var execIdx = $(e.currentTarget).attr('enter-exec');
			$('[tabindex=' + execIdx + ']').click();
		}
	});
	
	//우클릭막기
	$(document).on('contextmenu', function() {
		  return false;
	});
	//드래그 막기
	$(document).on('dragstart', function() {
		  return false;
	});
	//선택막기
	$(document).on('selectstart', function() {
		  return false;
	});
	
	$('body').on('click',function(e){
		parent.$('.context').css({
    		'top' : 0
			 , 'left' : 0
			 , 'z-index': '-1'
			 , 'display' : 'none'
	    });
		parent.selectedTabId = '';
	});
	
	//툴팁 클래스적용
	//$( document ).tooltip( { tooltipClass: "common-tooltip" } );
	
	//메뉴명
	$('#content-title').text(parent.$('li[aria-selected="true"] span.menu-span').text());
			
});