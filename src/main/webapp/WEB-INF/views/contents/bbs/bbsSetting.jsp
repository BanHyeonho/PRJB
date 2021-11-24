<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "게시판설정")}</title>
<meta name="google" content="notranslate">
</head>
<body>
	<div id='content'>		
		<div id='header-dummy'></div>
		<div id="content-header-1" class="content-panel">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
		</div>
		<div id='moduleGridContainer' class='content-panel no-mg-tp wd-pl-1 ht-pl-1-1'>
			<div id="moduleGrid" class="grid"></div>
		</div>
		<div id='categoryGridContainer' class='content-panel no-mg-tp wd-pl-1 no-mg-lt ht-pl-1-1'>
			<div id='categoryGrid' class="grid"></div>
		</div>
		<div id='authGroupGridContainer' class='content-panel no-mg-tp wd-pl-2 no-mg-lt ht-pl-2-1'>
			<div id='authGroupGrid' class="grid"></div>
		</div>
		<div id='bbsAuthGridContainer' class='content-panel no-mg-tp wd-pl-2 no-mg-lt ht-pl-2-1'>
			<div id='bbsAuthGrid' class="grid"></div>
		</div>
	</div>
</body>
</html>