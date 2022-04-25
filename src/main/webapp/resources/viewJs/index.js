/**
 * 메인프레임
 */
var tabs;
var tabTitle = $( "#tab_title" );
var tabContent = $( "#tab_content" );
var tabTemplate = "<li class='indexTabLi' menu-code='@menuCode@' onclick='f_selectFrame(this);'><a href='@href@'><span class='menu-span'>@label@</span><span class='tabCloseBtn ui-icon ui-icon-closethick' role='presentation'>Remove Tab</span></a></li>";
var tabCounter = 1;
var selectedTabId = '';

let menuSearchData = [];

//모든화면에서 사용가능 변수
var index_info = {
	gv_fileExtension : []	//첨부파일 허용확장자
}
$(document).ready(function () {

	f_getBackgroundData();
	
	//메뉴셋팅
	f_getMenu();
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
    f_attachTabEvent();
    
    //메인탭 기능(컨텍스트)셋팅
    $('#menuBtn').on('click', f_menuOpen);
    $('#logoutBtn').on('click', f_logout);
    $('#closeTabBtn').on('click', f_tabClose);
    $('#closeRightBtn').on('click', f_tabRightClose);
    $('#closeOthersBtn').on('click', f_tabOtherClose);
    $('#refreshTabBtn').on('click', f_tabRefresh);
    $('#favoriteTabBtn').on('click', f_menuBookmark);
           
});

//모든화면에서 사용가능한 static 변수데이터 가져오기
function f_getBackgroundData(){
	gf_ajax({
		QUERY_ID : 'combo.S_SYS_CODE',
		MASTER_CODE : 'FILE_EXTENSION'
	}, null
	, function(data){
		if(data.result.length > 0){
			index_info.gv_fileExtension = data.result;
		}
	});
}

//메뉴검색
function f_searchMenu(){
	
	gf_autoComplete('menuSearch', menuSearchData, function(event, ui){
		$('#' + ui.item.menuCode).trigger('click');
	});
	
}

//최근사용메뉴 조회
function f_openMenuList(){
	
	var fData = new FormData();
	fData.set('selectQuery', JSON.stringify({
		QUERY_ID : 'com.S_LAST_MENU_OPEN_LIST'
	}));
	
	gf_ajax( fData
			, null
			, function(data){
				if(data.result.selectQuery.length > 0){
					
						$('#openMenu .portlet').remove();
						if(data.result.selectQuery.length > 0){
							
							for (var i = 0; i < data.result.selectQuery.length; i++) {
								var item = data.result.selectQuery[i];
								var menuNm = item.MENU_NAME;
								var menuCode = item.MENU_CODE
								
								var portlet = $('<div>').addClass('portlet');
								var portletHeader = $('<div>').addClass('portlet-header').text(menuNm);
								var portletAtag = $('<a>').attr('href', 'javascript:$("#' + menuCode + '").trigger("click");').text(gf_mlg('이동'));
								var portletContent = $('<div>').addClass('portlet-content').html(portletAtag);
								
								portlet.append(portletHeader).append(portletContent);
								$('#openMenu').append(portlet);
							}
								
							//메뉴 우측 퀵메뉴 셋팅		    
						    f_setQuickMenu('openMenu');
						}
						
				}
			});
	
}
//즐겨찾기메뉴 조회
function f_bookmarkMenuList(){
	
	var fData = new FormData();
	fData.set('selectQuery', JSON.stringify({
		QUERY_ID : 'com.S_COMM_USER_BOOKMARK'
	}));
	
	gf_ajax( fData
			, null
			, function(data){
				$('#bookMark .portlet').remove();
				if(data.result.selectQuery.length > 0){
					
					for (var i = 0; i < data.result.selectQuery.length; i++) {
						var item = data.result.selectQuery[i];
						var menuNm = item.MENU_NAME;
						var menuCode = item.MENU_CODE;
						
						var portlet = $('<div>').addClass('portlet');
						var portletHidden = $('<input type="hidden" name="menuCode"/>').val(menuCode);
						var portletHeader = $('<div>').addClass('portlet-header').text(menuNm);
						var portletAtag = $('<a>').attr('href', 'javascript:$("#' + menuCode + '").trigger("click");').text(gf_mlg('이동'));
						var portletContent = $('<div>').addClass('portlet-content').html(portletAtag);
						
						portlet.append(portletHidden).append(portletHeader).append(portletContent);
						$('#bookMark').append(portlet);
					}
					
					//메뉴 우측 퀵메뉴 셋팅		    
				    f_setQuickMenu('bookMark');
				}
			});
	
}
//즐겨찾기
function f_menuBookmark(e){
	
	var v_menuCode = $('[aria-controls=' + selectedTabId + ']').attr('menu-code');
	if(gf_nvl(v_menuCode, '') == ''){
		return;
	}
	
	f_menuBookmarkExec(v_menuCode);
}
function f_menuBookmarkExec(v_menuCode){
	
	var fData = new FormData();
	fData.set('insertQUERY', JSON.stringify({
		QUERY_ID : 'com.P_COMM_USER_BOOKMARK',
		MENU_CODE : v_menuCode
	}));
	fData.set('selectQuery', JSON.stringify({
		QUERY_ID : 'com.S_COMM_USER_BOOKMARK'
	}));
	
	gf_ajax( fData
			, null
			, function(data){
		
				var result = data.result.selectQuery;
				var cnt = result.filter(x=>x.MENU_CODE == v_menuCode).length;
				
				if(cnt > 0){
				
					gf_toast(gf_mlg('즐겨찾기를_추가하였습니다'), 'info');	
				}
				else{
					gf_toast(gf_mlg('즐겨찾기를_삭제하였습니다'), 'info');	
				}
			});
}
//메뉴 우측 퀵메뉴 셋팅
function f_setQuickMenu(type){
	
	var sortableClass;
	
	if(type == 'bookMark'){
		sortableClass = 'column-bookMark';
	}
	else{
		sortableClass = 'column-openMenu';
	}
	
	$("." + sortableClass).sortable({
		connectWith: "." + sortableClass,
		handle: ".portlet-header",
		cancel: ".portlet-toggle",
		placeholder: "portlet-placeholder ui-corner-all"
	});
	
	$(".portlet").addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
				.find( ".portlet-header" )
				.addClass( "ui-widget-header ui-corner-all" )
				.prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");


	$( ".portlet-toggle" ).on( "click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		
		var menuCode = $( this ).parent().siblings('input[name="menuCode"]').val();
		$( this ).closest('.portlet').remove();
		f_menuBookmarkExec(menuCode);
		
	});
	
	//최근메뉴이력은 삭제불가
	$('.column-openMenu .ui-icon').remove();
	
}

//메뉴셋팅
function f_getMenu(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_MY_MENU');
	gf_ajax( fData
			, null
			, function(data){
		
				menuSearchData = [];
				var bigMenus = data.result.filter(x=>x.MENU_DEPTH==0);
				
				for(let i=0; i<data.result.length; i++){
					var item = data.result[i];
					var depth = Number(item.MENU_DEPTH);
					var upMenuCode = item.UP_MENU_CODE;
					var menuCode = item.MENU_CODE;
					var menuUrl = item.MENU_URL;
					var menuNm = gf_mlg(item.MLG_CODE);
					var iconClass;
					//중메뉴
					if(gf_nvl(item.CHILD_YN, '0') == '1'){
						iconClass = gf_nvl(item.ATTRIBUTE1, 'fi fi-rr-Caret-down');
					}
					//말단메뉴
					else{
						iconClass = gf_nvl(item.ATTRIBUTE1, 'fi fi-rr-Minus-small');
						
						var bigMenuCode = item.MENU_PATH.split('@')[1];
						var bigMenu = bigMenus.find(x=>x.MENU_CODE==bigMenuCode);
						
						menuSearchData.push({
							label : menuNm, 
							category : gf_mlg(bigMenu.MLG_CODE),
							value : menuNm,
							menuCode : menuCode,
							menuUrl : menuUrl
						});
					}
					
					
					var tag = $('<div></div>').addClass('menu-div').attr('id', menuCode);
					var menuName = $('<span></span>').addClass("menu-text").text(menuNm);
					var icon = $('<i style="margin-right:5px;"></i>').addClass(iconClass);
					
					var menuDepth;
					
					if(depth == 0){
						menuDepth = menuName;
						tag.append(icon);
					}
					else{
						menuDepth = $('<div></div>').addClass('menu-depth');
						for(let j=1; j<depth; j++){
							if(menuDepth.find('.menu-depth:last').length == 0){
  								menuDepth.append($('<div></div>').addClass('menu-depth'));
  							}
  							else{
  								menuDepth.find('.menu-depth:last').append($('<div></div>').addClass('menu-depth'));
  							}
  						}
						
						if(menuDepth.find('.menu-depth:last').length == 0){
							menuDepth.append(icon);
							menuDepth.append(menuName);
						}
						else{
							menuDepth.find('.menu-depth:last').append(icon);
							menuDepth.find('.menu-depth:last').append(menuName);
						}
						
					}
					
					
					tag.append(menuDepth);
					
					//최상위
					if(gf_nvl(upMenuCode, '') == ''){
						$('#menuList').append(tag);	
						$('#menuList').append($('<div style="display:none;"></div>').attr('name', menuCode));
						tag.on('click', function(e){
							
							$('.menu-div').removeClass('selected-menu');
							$('div[name=' + $(e.target).closest('div .menu-div').attr('id') + ']').slideToggle('fast');
							$(e.target).closest('div .menu-div').addClass('selected-menu');
						});
					}
					//중메뉴
					else if(data.result.filter(x=>x.UP_MENU_CODE == menuCode).length > 0){
						$('div[name=' + upMenuCode +']').append(tag);
						$('div[name=' + upMenuCode +']').append($('<div style="display:none;"></div>').attr('name', menuCode));
						tag.on('click', function(e){
							$('.menu-div').removeClass('selected-menu');
							$('div[name=' + $(e.target).closest('div .menu-div').attr('id') + ']').slideToggle('fast');
							$(e.target).closest('div .menu-div').addClass('selected-menu');
						});
					}
					//최하위
					else{
						$('div[name=' + upMenuCode +']').append(tag);
					}
					
					if(gf_nvl(menuUrl, '') != ''){
						$('#' + menuCode).on('click', {
  							 'menuNm' : menuNm
  							,'menuCode' : menuCode
  						}, f_addPage);	
					}
				}
			});
	
}

//탭 우클릭 컨텍스트
function f_attachTabEvent(){
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
var f_menuOpen = function(){
	$( "#menu" ).dialog({
	      resizable: false,
	      height: "630",
	      width: '900',
//	      maxWidth: '900',
//	      maxHeight: '640',
	      modal: true
	});
	
    //즐겨찾기가져오기
    f_bookmarkMenuList();
    
	//최근사용메뉴 가져오기
	f_openMenuList();
	
	//메뉴검색
	f_searchMenu();
}
		
//메뉴열기
var f_addPage = function(e){
	
	var v_param = {
		target : e.target,
		menuNm : e.data.menuNm,
		menuCode : e.data.menuCode
	};
	
	f_addPageExec(v_param);
}
var f_addPageExec = function(p_param){
	
	$('.menu-div').removeClass('selected-menu');
	
	if(gf_nvl(p_param.target, '') != ''){
		$(p_param.target).closest('div .menu-div').addClass('selected-menu');	
	}
	
	var label = p_param.menuNm;
    var id = "tabs-" + (++tabCounter);
    var showLabel = label.length > 8 ? label.substr(0,8) + '...' : label;
    var li = $( tabTemplate.replace( /@href@/g, "#" + id ).replace( /@label@/g, showLabel ).replace( /@menuCode@/g, p_param.menuCode ) );
        
    //개발
    if(location.hostname.indexOf('localhost') > -1){
    	var v_menu_url = menuSearchData.filter(x=>x.menuCode == p_param.menuCode)[0].menuUrl.split('_');
    	$.each(v_menu_url, function(idx, item){
    		if(idx == 0){
    			label += ' : contents/' + item;		
    		}
    		else{
    			label += '/' + item;
    		}
    	});
    }
    
    li.attr('title', label);
        
    var pageSrc = '/page?menuCode=' + p_param.menuCode;
    if(Object.keys(gf_nvl(p_param.menuParam, {})).length > 0){
    	pageSrc += '&menuParam=' + encodeURIComponent( JSON.stringify(p_param.menuParam) );
    }
    
    var tabContentHtml = '<iframe src="' + pageSrc + '" scrolling="no"></iframe>';
 
  	tabs.find( ".ui-tabs-nav" ).append( li );
  	tabs.append( "<div id='" + id + "'>" + tabContentHtml + "</div>" );
	tabs.tabs( "refresh" );
// 	$( "#menu" ).dialog( "close" );
	f_attachTabEvent();
	$("#indexTab").tabs({active : tabs.find('li').length -1});
}

//탭 선택시
var f_selectFrame = function(me){
	var tabId = $(me).attr('aria-controls');
	var tabFrame = $('#' + tabId + ' iframe')[0].contentWindow;
	//메뉴명
	tabFrame.$('#content-title').text($(me).attr('title'));
	
	//그리드 리사이즈
	var v_gridList = tabFrame.gridList;
	tabFrame.gf_gridResize(v_gridList);
}

//로그아웃
var f_logout = function(){
	 
	if(confirm(gf_mlg('로그아웃_하시겠습니까?'))){
		location.replace('/logout');	
	}
}

//탭닫기
var f_tabClose = function(){
	if(selectedTabId != ''){
		var panelId = $('.indexTabLi[aria-controls=' + selectedTabId + ']').remove().attr( "aria-controls" );
		$( "#" + panelId ).remove();
		$("#indexTab").tabs().tabs( "refresh" );				
	}
}
		
//우측탭 닫기
var f_tabRightClose = function(){
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
var f_tabOtherClose = function(){
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
var f_tabRefresh = function(){
	if(selectedTabId != ''){
		$('#' + selectedTabId).find('iframe').contents().get(0).location.reload(true);
	}
}