<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "공통코드관리")}</title>
<meta name="google" content="notranslate">
</head>
<body>
	<div id='content'>
		<div id='header-dummy'></div>
		<div id="content-header" class="content-panel">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "코드/코드명")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="1" enter-exec='99' id="searchParam1">
				</div>
			</div>
		</div>
		
		<div id='masterGridContainer' class='content-panel wd-pl-4 ht-pl-2 no-mg-tp'>
			<div id="masterGrid" class="grid"></div>
		</div>
		<div id='detailGridContainer' class='content-panel wd-pl-4 ht-pl-2 no-mg-tp'>
			<div id='detailGrid' class="grid"></div>
		</div>
	</div>
</body>
</html>