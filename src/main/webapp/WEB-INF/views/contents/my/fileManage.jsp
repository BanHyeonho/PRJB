<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "파일관리")}</title>
<meta name="google" content="notranslate">
</head>
<body onselectstart="return false;">
	<div id='content' class="pd-pl-default">
		<div id="content-header" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "파일명")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="1" enter-exec='99' id="searchParam1">
				</div>
			</div>
		</div>
		<div id='treeContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1 panel-2'>

		</div>
		<div id='fileViewContainer' class='content-panel mg-pl-tp-default pd-pl-default ht-pl-1 panel-8-1'>
			<img class="file_img" id='test1'>
			<img class="file_img" id='test2'>
			<img class="file_img" id='test3'>
			<img class="file_img" id='test4'>
			<img class="file_img" id='test5'>
			<img class="file_img" id='test6'>
			<img class="file_img" id='test7'>
			<img class="file_img" id='test8'>
			<img class="file_img" id='test9'>
		</div>
	</div>
</body>
</html>