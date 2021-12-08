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
</head>
<body>
	<div id='content' class="pd-pl-default">
		<div id="content-header" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "글제목")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="1" enter-exec='99' id="TITLE">
				</div>
			</div>
		</div>
		<div id='boardFileGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1 panel-3'>
			<div id="boardFileGrid" class="grid"></div>
		</div>
		<div id='boardOneContainer' class='content-panel mg-pl-tp-default mg-pl-rt-default pd-pl-default ht-pl-3 panel-4-1'>
			<iframe id='editor' src="/editor" class="mg-tp-default"></iframe>
		</div>
		<div id='videoGridContainer' class='content-panel mg-pl-tp-default pd-pl-default ht-pl-3 panel-3-1'>
			<div id="videoGrid" class="grid"></div>
		</div>
		<div id='subTitleContainer' class='content-panel mg-pl-tp-default mg-pl-rt-default pd-pl-default ht-pl-3 panel-4-1'>
			<iframe id='editor2' src="/editor" class="mg-tp-default"></iframe>
		</div>
		<div id='videoFileGridContainer' class='content-panel mg-pl-tp-default pd-pl-default ht-pl-3 panel-3-1'>
			<div id="videoFileGrid" class="grid"></div>
		</div>
	</div>
</body>
</html>