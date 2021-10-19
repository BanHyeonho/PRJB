<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "메뉴등록")}</title>
<meta name="google" content="notranslate">
</head>
<body>
	<div id='content'>		
		<div id='header-dummy'></div>
		<div id="content-header-1" class="content-panel">
			<span id="content-title"></span>
			<div class="btn-area">
				<button type="button" id='searchBtn' class="btn btn-st1 fl-right">${pb:msg(pageContext.request, "조회")}</button>
				<button type="button" id='saveBtn' class="btn btn-st1 fl-right mg-rt-default">${pb:msg(pageContext.request, "저장")}</button>
				<button type="button" id='mlgRegistBtn' class="btn btn-st1 fl-right mg-rt-default">${pb:msg(pageContext.request, "다국어_일괄등록")}</button>
			</div>
		</div>
		
		<div id='masterGridContainer' class='content-panel ht-pl-1-1 wd-pl-3 no-mg-tp'>
			<div id="masterGrid" class="grid"></div>
		</div>
		<div id='functionGridContainer' class='content-panel ht-pl-1-1 wd-pl-1 no-mg-tp no-mg-lt'>
			<div id="functionGrid" class="grid"></div>
		</div>
	</div>
</body>
</html>