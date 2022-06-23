<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%-- <%@ page session="false"%>     --%>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "실적등록")}</title>
<meta name="google" content="notranslate">

<link href="/plugin/fullcalendar-5.11.0/lib/main.css?v=${pb:jsNow()}" rel="stylesheet">
<script src="/plugin/fullcalendar-5.11.0/lib/main.min.js?v=${pb:jsNow()}"></script>
<script src='/plugin/fullcalendar-5.11.0/lib/locales-all.min.js'></script>

</head>
<body>
	<div id='content' class="pd-pl-default">
		<div id="content-header" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-1">
					<label class="form">${pb:msg(pageContext.request, "조회_월")}</label>
					<input class="form form-text mg-tp-default" type="month" tabindex="1" enter-exec='99' id="searchParam1">
				</div>
			</div>
		</div>
		
		<div id='masterGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1 panel-2'>
			<div id="masterGrid" class="grid"></div>
		</div>
		<div id='detailGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1 panel-3-1'>
			<div id="detailGrid" class="grid"></div>
		</div>
		<div id='calendarContainer' class='content-area content-panel mg-pl-tp-default pd-pl-default ht-pl-1 panel-5-1'>
			<div id="calendar"></div>
		</div>
	</div>
</body>
</html>