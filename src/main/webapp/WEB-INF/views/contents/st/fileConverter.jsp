<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "파일변환")}</title>
<meta name="google" content="notranslate">
<style type="text/css">
    
</style>
</head>
<body>
	<div id='content' class="pd-pl-default">
		<div id="content-header" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2-1 mg-rt-default3">
					<label class="form">${pb:msg(pageContext.request, "신청메뉴")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="1" enter-exec='99' id="MENU_NAME">
				</div>
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "신청자")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="2" enter-exec='99' id="USER_NAME">
				</div>
			</div>
		</div>
		<div id='waitGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1 panel-3'>
			<div id="waitGrid" class="grid"></div>
		</div>
		<div id='processingGridContainer' class='content-panel mg-pl-tp-default pd-pl-default ht-pl-1 panel-4-1'>
			<div id="processingGrid" class="grid"></div>
		</div>
		<div id='completeGridContainer' class='content-panel mg-pl-tp-default pd-pl-default ht-pl-1 panel-3-1'>
			<div id="completeGrid" class="grid"></div>
		</div>
	</div>
</body>
</html>