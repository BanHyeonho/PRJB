<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "기능관리")}</title>
<meta name="google" content="notranslate">
</head>
<body>
	<div id='content'>
		<div id='header-dummy'></div>
		<div id="content-header" class="content-panel">
			<span id="content-title"></span>
			<div class="btn-area">
				<button type="button" id='searchBtn' tabindex="99" class="btn btn-st1 fl-right">${pb:msg(pageContext.request, "조회")}</button>
				<button type="button" id='saveBtn' class="btn btn-st1 fl-right mg-rt-default">${pb:msg(pageContext.request, "저장")}</button>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "기능코드/명칭")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="1" enter-exec='99' id="searchParam1">
				</div>
			</div>
		</div>
		<div id='functionGridContainer' class='content-panel ht-pl-1 wd-pl-3 no-mg-tp'>
			<div id="functionGrid" class="grid"></div>
		</div>
		<div id='menuGridContainer' class='content-panel ht-pl-1 wd-pl-1 no-mg-tp no-mg-lt'>
			<div id="menuGrid" class="grid"></div>
		</div>
	</div>
</body>
</html>