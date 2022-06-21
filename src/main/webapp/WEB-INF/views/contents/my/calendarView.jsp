<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "달력")}</title>
<meta name="google" content="notranslate">
<style type="text/css">
.hi{
	width : 100%;
	height: 49% !important;
}
</style>

<link href="/plugin/fullcalendar-5.11.0/lib/main.min.css?v=${pb:jsNow()}" rel="stylesheet">
<script src="/plugin/fullcalendar-5.11.0/lib/main.min.js?v=${pb:jsNow()}"></script>
<script src='/plugin/fullcalendar-5.11.0/lib/locales-all.min.js'></script>
</head>
<body>
	<div id='content' class="pd-pl-default">
<!-- 		<div id="content-header-1" class="content-panel pd-pl-default no-mg"> -->
<!-- 			<span id="content-title"></span> -->
<!-- 			<div class="btn-area" id='BTN_AREA1'> -->
<!-- 			</div> -->
<!-- 		</div> -->

		<div id='listContainer' class='mg-pl-default no-mg-tp no-mg-lt ht-pl-notitle panel-2 no-pd' style="position: relative;">
			<div class='content-panel hi ' style="position: absolute;top: 0;">
			</div>
			<div class='content-panel hi ' style="position: absolute;bottom: 0;">
			</div>
		</div>
		<div id='calendarContainer' class='content-panel no-mg pd-pl-default ht-pl-notitle panel-8-1'>
			<div id="calendar" class=""></div>
		</div>
	</div>
</body>
</html>