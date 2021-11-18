<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ include file="include.jsp" %>
<html>
<head>
<meta charset="UTF-8">
<title>Home</title>
<style type="text/css">
.column-bookMark {
	width: 170px;
	float: left;
	padding-bottom: 100px;
}
.column-openMenu {
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
.menu-div{
	border-bottom: 1px solid #ddd;
	padding: 10px;
	cursor: pointer;
}
.menu-depth{
	margin-left: 20px;
}
.menu-text{
	font-size: 16px;
}

.ui-autocomplete-category {
    font-weight: bold;
    padding: .2em .4em;
    margin: .8em 0 .2em;
    line-height: 1.5;
}
.ui-autocomplete{
	overflow-y: auto;
    overflow-x: hidden;
    max-height: 500px;
}
</style>
<meta name="google" content="notranslate">
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
		
	<div style="position: absolute; right:0.5%; top:0.5%;">
		<button type="button" id='menuBtn' title='${pb:msg(pageContext.request, "메뉴")}' class="menu-btn">
			<i class="fi fi-rr-Menu-burger"></i>
		</button>
	</div>
		
	<div id="menu" title='${pb:msg(pageContext.request, "메뉴")}' style="display: none; padding-left: 0;">
		<div id="menuList" style="width: 30%; height:100%; float: left; padding-right: 5px; box-sizing: border-box; overflow-y: auto;">
		<!-- 메뉴셋팅 -->
		</div>
		<div id="quickMenu" style="width: 68%; height:100%; float: left; padding-left: 10px; border-left: 5px solid #e9e9e9;">
			<div class="div-4" style="float: right;">
				<input id="menuSearch" class="form form-text mg-tp-default" placeholder='${pb:msg(pageContext.request, "메뉴검색")}'>
			</div>
			<div class="div-6">
				<div class="column-bookMark" id="bookMark">
				  <div class="portlet">
				    <div class="portlet-header">Feeds</div>
				    <div class="portlet-content">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</div>
				  </div>
				 
				  <div class="portlet">
				    <div class="portlet-header">News</div>
				    <div class="portlet-content">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</div>
				  </div>
				 
				</div>
				 
				<div class="column-openMenu" id="openMenu">
				 
				  <div class="portlet">
				    <div class="portlet-header">Shopping</div>
				    <div class="portlet-content">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</div>
				  </div>
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
