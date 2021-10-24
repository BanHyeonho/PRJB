<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page session="false"%>
<%@ include file="../../include.jsp"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "그리드관리")}</title>
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
				
		<div id='menuGridContainer' class='content-panel no-mg-tp wd-pl-1 ht-pl-2-1'>
			<div id="menuGrid" class="grid"></div>
		</div>
		<div id='masterGridContainer' class='content-panel no-mg-tp wd-pl-2 no-mg-lt ht-pl-2-1'>
			<div id='masterGrid' class="grid"></div>
		</div>
		<div id='contextGridContainer' class='content-panel no-mg-tp wd-pl-1 no-mg-lt ht-pl-2-1'>
			<div id='contextGrid' class="grid"></div>
		</div>
		<div id='detailGridContainer' class='content-panel wd-pl-3 no-mg-tp ht-pl-2-1'>
			<div id='detailGrid' class="grid"></div>
		</div>
		<div id='comboPopupGridContainer' class='content-panel wd-pl-1 no-mg-tp no-mg-lt ht-pl-2-1'>
			<div id='comboPopupGrid' class="grid"></div>
		</div>
	</div>
</body>
</html>