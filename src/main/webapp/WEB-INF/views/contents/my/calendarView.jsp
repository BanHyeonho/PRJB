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
.p-half{
	width : 100%;
	height: 49% !important;
}

.line-bt{
	border-bottom : 2px solid #bbb; 
}
.line-tp{
	border-top : 2px solid #bbb; 
}
.line-lt{
	border-left : 2px solid #bbb; 
}
.line-rt{
	border-right : 2px solid #bbb; 
}

.form-checkbox{
	width: 25px;
	height: 25px;
}

.minicolors{
	vertical-align: super;
}
.color-label{
	vertical-align: super;
	font-size: 18px;
}
</style>

<!-- fullcalendar -->
<link href="/plugin/fullcalendar-5.11.0/lib/main.css?v=${pb:jsNow()}" rel="stylesheet">
<script src="/plugin/fullcalendar-5.11.0/lib/main.min.js?v=${pb:jsNow()}"></script>
<script src='/plugin/fullcalendar-5.11.0/lib/locales-all.min.js'></script>

<!-- minicolors -->
<link href="/plugin/jquery-minicolors/jquery.minicolors.css?v=${pb:jsNow()}" rel="stylesheet">
<script src="/plugin/jquery-minicolors/jquery.minicolors.min.js?v=${pb:jsNow()}"></script>

<!-- c3 차트 -->
<link href="/plugin/c3-0.7.20/c3.min.css" rel="stylesheet">
<script src="/plugin/c3-0.7.20/d3.v5.min.js" charset="utf-8"></script>
<script src="/plugin/c3-0.7.20/c3.min.js"></script>

</head>
<body>
	<div id='content' class="pd-pl-default">
		<div id='listContainer' class='mg-pl-default no-mg-tp no-mg-lt ht-pl-notitle panel-2 no-pd' style="position: relative;">
			<div class='content-panel p-half ' style="position: absolute;top: 0; overflow: auto;">
				<table style="width: 100%; max-height: 100%;" id='listTable'>
					<thead>
						<tr>
							<td colspan="2" class='pd-default' style="width: 30%;"><span class="font-size-24">${pb:msg(pageContext.request, "목록")}</span></td>
						</tr>
					</thead>
					<tbody>
						
					</tbody>
				</table>
			</div>
			<div class='content-panel p-half' style="position: absolute;bottom: 0;">
				<table style="width: 100%;">
					<thead>
						<tr class="line-bt">
							<td colspan="2" class='pd-default' style="width: 30%;"><span class="font-size-24">${pb:msg(pageContext.request, "달성율")}</span></td>
						</tr>
					</thead>
				</table>
				<div class='pd-default'>
					<div id="chart"></div>
				</div>
			</div>
		</div>
		<div id='calendarContainer' class='content-panel no-mg pd-pl-default ht-pl-notitle panel-8-1'>
			<div id="calendar"></div>
		</div>
	</div>
</body>
</html>