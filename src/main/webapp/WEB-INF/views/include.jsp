<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib uri="/resources/tld/PRJBTagLib.tld" prefix="pb" %>

<!-- Jquery -->
<script src="/script/jquery-3.5.1.min.js?v=${pb:jsNow()}"></script>

<!-- Jquery-UI -->
<script src="/plugin/jquery-ui-1.12.1/jquery-ui.min.js?v=${pb:jsNow()}"></script>
<link  href="/plugin/jquery-ui-1.12.1/jquery-ui.min.css?v=${pb:jsNow()}" rel="stylesheet" />

<!-- SlickGrid -->
<script src="/plugin/slickGrid/lib/jquery.event.drag-2.3.0.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/lib/jquery.event.drop-2.3.0.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/slick.core.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/slick.dataview.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/slick.editors.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/slick.formatters.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/slick.grid.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/slick.groupitemmetadataprovider.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/slick.remotemodel.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/lib/select2.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/plugins/slick.autotooltips.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/plugins/slick.cellrangedecorator.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/plugins/slick.cellrangeselector.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/plugins/slick.cellexternalcopymanager.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/plugins/slick.cellselectionmodel.js?v=${pb:jsNow()}"></script>
<script src="/plugin/slickGrid/plugins/slick.resizer.js?v=${pb:jsNow()}"></script>
<link  href="/plugin/slickGrid/slick.grid.css?v=${pb:jsNow()}" rel="stylesheet" />
<link  href="/plugin/slickGrid/css/select2.css?v=${pb:jsNow()}" rel="stylesheet" />

<!-- Jquery.toast -->
<script src="/plugin/jquery-toast/jquery.toast.js?v=${pb:jsNow()}"></script>
<link  href="/plugin/jquery-toast/jquery.toast.css?v=${pb:jsNow()}" rel="stylesheet" />

<!-- 암호화 -->
<script src="/script/jsencrypt.min.js?v=${pb:jsNow()}"></script>

<!-- 사용자정의 -->
<link  href="/css/reset.css?v=${pb:jsNow()}" rel="stylesheet" />
<script src="/script/common.js?v=${pb:jsNow()}"></script>
<link  href="/css/common.css?v=${pb:jsNow()}" rel="stylesheet" />
<link  href="/css/common-laptop.css?v=${pb:jsNow()}" rel="stylesheet" />

<!-- 공통실행함수 -->
<script type="text/javascript">

	//다국어
	const mlg = ${MLG};
	
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
		$( document ).tooltip( { tooltipClass: "common-tooltip" } );
		
		//메뉴명
		$('#content-title').text(parent.$('li[aria-selected="true"] span.menu-span').text());
				
	});
</script>

        
