<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%-- <%@ page session="false"%>     --%>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "계획등록")}</title>
<meta name="google" content="notranslate">
<style type="text/css">
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
.text-alien{
	text-align: right;
}
.form-date{
	width: 46.8%;
}
.form-checkbox{
	width: 20px;
	height: 20px;
	vertical-align: text-bottom;
	margin: 0 2px;
}
.checkbox-label{
	padding-right: 5px;
}

.item-btn{
	min-height: 32px;
	font-size: 16px;
	background-color: #ffff;
    border: 1px solid #bbb;
}
</style>


<link href="/plugin/fullcalendar-5.11.0/lib/main.css?v=${pb:jsNow()}" rel="stylesheet">
<script src="/plugin/fullcalendar-5.11.0/lib/main.min.js?v=${pb:jsNow()}"></script>
<script src='/plugin/fullcalendar-5.11.0/lib/locales-all.min.js'></script>

</head>
<body>
	<div id='content' class="pd-pl-default">
		<div id="content-header-1" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
		</div>
		
		<div id='masterGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1-1 panel-2'>
			<div id="masterGrid" class="grid"></div>
		</div>
		<div id='contentContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1-1 panel-3-1'>
			<input type="hidden" id='MY_PLAN_ID'>
			<table style="width: 100%; max-height: 100%;">
				<tr class="line-bt">
					<td class='pd-default line-rt' style="width: 30%;"><span class="font-size-24">${pb:msg(pageContext.request, "계획설정")}</span></td>
				</tr>
				<tr>
					<td class='pd-default font-size-default line-rt text-alien'><label for='PLAN_NAME'>${pb:msg(pageContext.request, "계획명")}</label></td>
					<td class='pd-lt-default'><input class="form form-text mg-tp-default" type="text" id='PLAN_NAME'></td>
				</tr>
				<tr>
					<td class='pd-default font-size-default line-rt text-alien'>${pb:msg(pageContext.request, "기간")}</td>
					<td class='pd-lt-default' >
						<input class="form-text mg-tp-default form-date" type="date" id='START_DATE'>
						~
						<input class="form-text mg-tp-default form-date" type="date" id='END_DATE'>
					</td>
				</tr>
				<tr class="line-bt">
					<td class='pd-default font-size-default line-rt text-alien'>${pb:msg(pageContext.request, "제외요일")}</td>
					<td class='pd-lt-default'>
						<input class="form-text form-checkbox" type="checkbox" id='sun'><label for='sun' class='checkbox-label' >${pb:msg(pageContext.request, "일")}</label>
						<input class="form-text form-checkbox" type="checkbox" id='mon'><label for='mon' class='checkbox-label' >${pb:msg(pageContext.request, "월")}</label>
						<input class="form-text form-checkbox" type="checkbox" id='tue'><label for='tue' class='checkbox-label' >${pb:msg(pageContext.request, "화")}</label>
						<input class="form-text form-checkbox" type="checkbox" id='wed'><label for='wed' class='checkbox-label' >${pb:msg(pageContext.request, "수")}</label>
						<input class="form-text form-checkbox" type="checkbox" id='thu'><label for='thu' class='checkbox-label' >${pb:msg(pageContext.request, "목")}</label>
						<input class="form-text form-checkbox" type="checkbox" id='fri'><label for='fri' class='checkbox-label' >${pb:msg(pageContext.request, "금")}</label>
						<input class="form-text form-checkbox" type="checkbox" id='sat'><label for='sat' class='checkbox-label' >${pb:msg(pageContext.request, "토")}</label>
					</td>
				</tr>
				<tr>
					<td class='pd-default font-size-default line-rt text-alien' style="vertical-align: top;">${pb:msg(pageContext.request, "달성항목")}</td>
					<td class='pd-lt-default pd-tp-default'>
						<table style="width: 100%" id='MY_PLAN_ITEM_TABLE'>
							<thead>
								<tr class="line-bt">
									<td style="width: 60%;" class="font-size-default">${pb:msg(pageContext.request, "항목")}</td>
									<td style="width: 30%;" class="font-size-default">${pb:msg(pageContext.request, "목표")}</td>
									<td style="width: 10%;" class="pd-bt-default"><button type="button" class="item-btn" id='itemPlusBtn'><span class="ui-icon ui-icon-plus"></span></button></td>
								</tr>								
							</thead>
							<tbody>
							
							</tbody>
						</table>
					</td>
				</tr>
			</table>
		</div>
		<div id='calendarContainer' class='content-area content-panel mg-pl-tp-default pd-pl-default ht-pl-1-1 panel-5-1'>
			<div id="calendar"></div>
		</div>
	</div>
</body>
</html>