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
	<div id='content'>
		<div id='header-dummy'></div>
		<div id="content-header" class="content-panel">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "작성자")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="2" enter-exec='99' id="searchParam2">
				</div>
				<div class="div-5">
					<label class="form">${pb:msg(pageContext.request, "제목")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="3" enter-exec='99' id="searchParam2">
				</div>
			</div>
		</div>
		<div id='categoryGridContainer' class='content-panel ht-pl-1 wd-pl-1 no-mg-tp'>
			<div id="categoryGrid" class="grid"></div>
		</div>
		<div id="boardContainer" class='content-panel ht-pl-1 wd-pl-3 no-mg-tp no-mg-lt'>
			<div id='boardGridContainer' style="height:96%;">
				<div id="boardGrid" class="grid"></div>
			</div>
			<div>
			페이지네이션
			</div>
		</div>
	</div>
</body>
</html>