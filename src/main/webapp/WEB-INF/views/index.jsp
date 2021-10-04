<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ include file="include.jsp" %>
<html>
	<head>
	<style type="text/css">
		.column {
			width: 170px;
			float: left;
			padding-bottom: 100px;
		}
		
		.portlet {
			margin: 0 1em 1em 0;
			padding: 0.3em;
		}
		
		.portlet-header {
			padding: 0.2em 0.3em;
			margin-bottom: 0.5em;
			position: relative;
		}
		
		.portlet-toggle {
			position: absolute;
			top: 50%;
			right: 0;
			margin-top: -8px;
		}
		
		.portlet-content {
			padding: 0.4em;
		}

		.portlet-placeholder {
			border: 1px dotted black;
			margin: 0 1em 1em 0;
			height: 50px;
		}
		
		.menu-span{
			display:inline-block;
			width:110px;
			text-align: center;
		}
	</style>
		<meta charset="UTF-8">
		<title>Home</title>
		
		<script type="text/javascript">
		var tabs;
		var tabTitle = $( "#tab_title" );
	    var tabContent = $( "#tab_content" );
	    var tabTemplate = "<li class='indexTabLi' ><a href='@href@'><span class='menu-span'>@label@</span><span class='ui-icon ui-icon-closethick' role='presentation'>Remove Tab</span></a></li>";
	    var tabCounter = 1;
	    var selectedTabId = '';
	    
		$(document).ready(function () {

			//메뉴셋팅
			getMenu();
			
		    tabs = $("#indexTab").tabs();
		    tabs.find( ".ui-tabs-nav" ).sortable({
				axis: "x",
				stop: function() {
				  tabs.tabs( "refresh" );
				}
		    });
		    
		 	// Close icon: removing the tab on click
		    tabs.on( "click", "span.ui-icon-closethick", function() {
				var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
				$( "#" + panelId ).remove();
				tabs.tabs( "refresh" );
		    });
		    $('#tabContextUl').menu();
		    attachTabEvent();
		    
		    //메인탭 기능(컨텍스트)셋팅
		    $('#menuBtn').on('click', menuOpen);
		    $('#logoutBtn').on('click', logout);
		    $('#closeTabBtn').on('click', tabClose);
		    $('#closeRightBtn').on('click', tabRightClose);
		    $('#closeOthersBtn').on('click', tabOtherClose);
		    $('#refreshTabBtn').on('click', tabRefresh);
		    
		  	//메뉴 우측 퀵메뉴 셋팅		    
		    setQuickMenu();
		  	
		});
		
		//메뉴 우측 퀵메뉴 셋팅
		function setQuickMenu(){
			$(".column" ).sortable({
				connectWith: ".column",
				handle: ".portlet-header",
				cancel: ".portlet-toggle",
				placeholder: "portlet-placeholder ui-corner-all"
			});
		   
			$(".portlet").addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
						.find( ".portlet-header" )
						.addClass( "ui-widget-header ui-corner-all" )
						.prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
		   
			$( ".portlet-toggle" ).on( "click", function() {
				var icon = $( this );
				icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
				icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
			});
		}
		
		//메뉴셋팅
		function getMenu(){
			
			var fData = new FormData();
			fData.set('QUERY_ID', 'com.S_MY_MENU');
	  		gf_ajax( fData
	  				, null
	  				, function(data){
	  					$.each(data.result, function( index, item){
	  						var depth = item.MENU_DEPTH;
	  						var menuCode = item.MENU_CODE;
	  						var menuUrl = item.MENU_URL;
	  						var menuNm = gf_mlg(item.MLG_CODE);
	  						
	  						var tag;
	  						if(gf_nvl(menuUrl, '') == ''){
	  							tag = $('<span>' + menuNm + '</span>');
	  						}
	  						else{
	  							tag = $('<button id="' + menuCode +'" >' + menuNm + '</button>');
	  						}
	  						$('#menuList').append(tag);
	  						
	  						$('#' + menuCode).on('click', {
	  							 'menuNm' : menuNm
	  							,'menuCode' : menuCode
	  						}, addPage);
	  					});
					});
	  		
		}
		
		//탭 우클릭 컨텍스트
		function attachTabEvent(){
			$('.indexTabLi').off('mousedown');
			$('.indexTabLi').on('mousedown', function(e){
				
		    	if ((e.button == 2) || (e.which == 3)) {
		    		if($(e.currentTarget).attr('id') == 'mainTab' ){
		    			$('.onlyMainLi').show();
		    			$('.onlyOtherLi').hide();
		    		}else{
		    			$('.onlyMainLi').hide();
		    			$('.onlyOtherLi').show();
		    		}
				    $('#tabContext').css({
				    		'top' : e.pageY
						 , 'left' : e.pageX
						 , 'z-index': '9999'
						 , 'display' : 'block'
				    });
				    selectedTabId = $(e.currentTarget).attr('aria-controls');
		    	}else{
		    		$('#tabContext').css({
				    		'top' : 0
						 , 'left' : 0
						 , 'z-index': '-1'
						 , 'display' : 'none'
				    });
		    		selectedTabId = '';
		    	}
		    });
		}
		
		//메뉴목록 열기
		var menuOpen = function(){
			$( "#menu" ).dialog({
			      resizable: true,
			      height: "630",
			      minWidth: '840',
			      modal: true
			});
		}
		
		//메뉴열기
		var addPage = function(e){
			
			var label = e.data.menuNm;
	        var id = "tabs-" + (++tabCounter);
	        var showLabel = label.length > 8 ? label.substr(0,8) + '...' : label;
	        var li = $( tabTemplate.replace( /@href@/g, "#" + id ).replace( /@label@/g, showLabel ) );
	        
	        li.attr('title', label);
	        
	        var tabContentHtml = '<iframe src="/page?menuCode=' + e.data.menuCode + '" scrolling="no"></iframe>';
	 
	      	tabs.find( ".ui-tabs-nav" ).append( li );
	      	tabs.append( "<div id='" + id + "'>" + tabContentHtml + "</div>" );
			tabs.tabs( "refresh" );
// 			$( "#menu" ).dialog( "close" );
			attachTabEvent();
			$("#indexTab").tabs({active : tabs.find('li').length -1});
			
		}
		
		//로그아웃
		var logout = function(){
			 
			if(confirm('${pb:msg(pageContext.request, "로그아웃_하시겠습니까?")}')){
				location.replace('/logout');	
			}
		}
		
		//탭닫기
		var tabClose = function(){
			if(selectedTabId != ''){
				var panelId = $('.indexTabLi[aria-controls=' + selectedTabId + ']').remove().attr( "aria-controls" );
				$( "#" + panelId ).remove();
				$("#indexTab").tabs().tabs( "refresh" );				
			}
		}
		
		//우측탭 닫기
		var tabRightClose = function(){
			if(selectedTabId != ''){
				var removeIdx = $('.indexTabLi[aria-controls=' + selectedTabId + ']').index();
				$.each($('.indexTabLi:gt(' + removeIdx + ')'), function(index, item){
					//메인탭은 삭제할수없다.
					if($(item).attr('id') != 'mainTab'){
						var panelId = $(item).remove().attr( "aria-controls" );
						$( "#" + panelId ).remove();	
					}
				});
				$("#indexTab").tabs().tabs( "refresh" );				
			}
		}
		
		//다른탭 닫기
		var tabOtherClose = function(){
			if(selectedTabId != ''){
				$.each($('.indexTabLi[aria-controls!=' + selectedTabId + ']'), function(index, item){
					//메인탭은 삭제할수없다.
					if($(item).attr('id') != 'mainTab'){
						var panelId = $(item).remove().attr( "aria-controls" );
						$( "#" + panelId ).remove();	
					}
				});
				$("#indexTab").tabs().tabs( "refresh" );				
			}
		}
		
		//탭새로고침
		var tabRefresh = function(){
			if(selectedTabId != ''){
				$('#' + selectedTabId).find('iframe').contents().get(0).location.reload(true);
			}
		}
		
		</script>
	</head>
	<body>
		<div id="indexTab">
			<ul style="background-color: #FFFFFF;">
				<li id='mainTab' class='indexTabLi' title='MAIN'>
					<a href="#tabs-1"><span class="menu-span">MAIN</span></a>
				</li>
			</ul>
			<div id="tabs-1">
			  	<iframe src="/main" scrolling="no">
			  	</iframe>
		  	</div>
		</div>
		
		<div style="position: absolute;right: .4em;top:.15em;">
			<button type="button" id='menuBtn' title='${pb:msg(pageContext.request, "메뉴")}' class="menu-btn" style="width: 45px; height: 45px;">
			</button>
		</div>
		
		<div id="menu" title='${pb:msg(pageContext.request, "메뉴")}' style="display: none;">
			<div id="menuList" style="width: 30%; height:100%; float: left; padding-right: 5px; box-sizing: border-box;">
<!-- 			메뉴셋팅 -->
			</div>
			<div id="quickMenu" style="width: 68%; height:100%; float: left; padding-left: 10px; border-left: 5px solid #e9e9e9;">
				<div class="column">
				  <div class="portlet">
				    <div class="portlet-header">Feeds</div>
				    <div class="portlet-content">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</div>
				  </div>
				 
				  <div class="portlet">
				    <div class="portlet-header">News</div>
				    <div class="portlet-content">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</div>
				  </div>
				 
				</div>
				 
				<div class="column">
				 
				  <div class="portlet">
				    <div class="portlet-header">Shopping</div>
				    <div class="portlet-content">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</div>
				  </div>
				 
				</div>
				 
				<div class="column">
				 
				  <div class="portlet">
				    <div class="portlet-header">Links</div>
				    <div class="portlet-content">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</div>
				  </div>
				 
				  <div class="portlet">
				    <div class="portlet-header">Images</div>
				    <div class="portlet-content">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</div>
				  </div>
				 
				</div>
			</div>
			
		</div>


	<div id="tabContext" class="context">
		<ul id="tabContextUl">
			<li class='onlyOtherLi' style="display: none;" >
		    	<div id='favoriteTabBtn'><span class="ui-icon ui-icon-star"></span><span>${pb:msg(pageContext.request, "즐겨찾기")}</span></div>
		  	</li>
			<li class='onlyOtherLi' style="display: none;" >
		    	<div id='closeTabBtn'><span class="ui-icon ui-icon-closethick"></span><span>${pb:msg(pageContext.request, "탭닫기")}</span></div>
		  	</li>
			<li>
		    	<div id='closeRightBtn'><span>${pb:msg(pageContext.request, "우측_탭닫기")}</span></div>
		  	</li>
		  	<li>
		    	<div id='closeOthersBtn'><span>${pb:msg(pageContext.request, "다른_탭닫기")}</span></div>
		  	</li>
		  	<li>
		    	<div id='refreshTabBtn'><span class="ui-icon ui-icon-arrowrefresh-1-e"></span><span>${pb:msg(pageContext.request, "새로고침")}</span></div>
		  	</li>
			<li class='onlyMainLi' style="display: none;">
		    	<div id='logoutBtn' ><span class="ui-icon ui-icon-power"></span><span>${pb:msg(pageContext.request, "로그아웃")}</span></div>
		  	</li>
		</ul>
	</div>

</body>
</html>
