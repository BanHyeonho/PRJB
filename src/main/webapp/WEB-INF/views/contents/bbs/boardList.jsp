<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "게시판")}</title>
<meta name="google" content="notranslate">
</head>
<body>
	<div id='content' class="pd-pl-default">
		<div id="content-header" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2-1 mg-rt-default3">
					<label class="form">${pb:msg(pageContext.request, "작성자")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="2" enter-exec='99' id="WRITER">
				</div>
				<div class="div-8">
					<label class="form">${pb:msg(pageContext.request, "제목")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="3" enter-exec='99' id="TITLE">
				</div>
			</div>
		</div>
		<div id='categoryGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1 panel-2-1'>
			<div id="categoryGrid" class="grid"></div>
		</div>
		<div id="boardGridContainer" class='content-panel mg-pl-tp-default pd-pl-default ht-pl-1 panel-8'>
			<div id="boardGrid" class="grid"></div>
		</div>
	</div>
</body>
</html>