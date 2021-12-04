<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "권한그룹관리")}</title>
<meta name="google" content="notranslate">
</head>
<body>
	<div id='content' class="pd-pl-default">
		<div id="content-header-1" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
		</div>
		
		<div id='groupGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1-1 panel-6'>
			<div id="groupGrid" class="grid"></div>
		</div>
		<div id='userGridContainer' class='content-panel mg-pl-tp-default pd-pl-default ht-pl-1-1 panel-4-1'>
			<div id="userGrid" class="grid"></div>
		</div>
	</div>
</body>
</html>