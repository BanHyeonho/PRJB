<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "영상시청")}</title>
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
					<label class="form">${pb:msg(pageContext.request, "영상명")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="1" enter-exec='99' id="searchParam1">
				</div>
			</div>
		</div>
		<div id='masterGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1 panel-2'>
			<div id="masterGrid" class="grid"></div>
		</div>
		<div id='videoContainer' class='content-panel mg-pl-tp-default pd-pl-default ht-pl-1 panel-8-1'>
			<video style="width:100%; height:100%;" controls preload="metadata">
				<source id='videoSource'>
<!-- 				<track label="English" kind="subtitles" srclang="en" src="captions/vtt/sintel-en.vtt" default> -->
<!-- 				<track label="한국어" kind="subtitles" srclang="kr" src="/resources/videos/test.vtt" default> -->
<!-- 				<track label="영어" kind="subtitles" srclang="en" src="/resources/videos/test_en.vtt"> -->
<!-- 				<track label="기타" kind="subtitles" srclang="etc" src="/resources/videos/test_etc.vtt" > -->
			</video>
		</div>
	</div>
</body>
</html>