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
	<div id='content' class="pd-pl-default">
		<div id="content-header" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "기능코드/명칭")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="1" enter-exec='99' id="searchParam1">
				</div>
			</div>
		</div>
		<div id='functionGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1 panel-7'>
			<div id="functionGrid" class="grid"></div>
		</div>
		<div id='menuGridContainer' class='content-panel mg-pl-tp-default pd-pl-default ht-pl-1 panel-3-1'>
			<div id="menuGrid" class="grid"></div>
		</div>
	</div>
</body>
</html>