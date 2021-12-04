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
	<div id='content' class="pd-pl-default">
		<div id="content-header-1" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
		</div>
				
		<div id='menuGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-2-1 panel-2'>
			<div id="menuGrid" class="grid"></div>
		</div>
		<div id='masterGridContainer' class='content-panel pd-pl-default mg-pl-default no-mg-lt ht-pl-2-1 panel-6-1'>
			<div id='masterGrid' class="grid"></div>
		</div>
		<div id='contextGridContainer' class='content-panel pd-pl-default mg-pl-default no-mg-lt no-mg-rt ht-pl-2-1 panel-2-1'>
			<div id='contextGrid' class="grid"></div>
		</div>
		<div id='detailGridContainer' class='content-panel pd-pl-default mg-pl-rt-default ht-pl-2-1 panel-8'>
			<div id='detailGrid' class="grid"></div>
		</div>
		<div id='comboPopupGridContainer' class='content-panel pd-pl-default ht-pl-2-1 panel-2-1'>
			<div id='comboPopupGrid' class="grid"></div>
		</div>
	</div>
</body>
</html>