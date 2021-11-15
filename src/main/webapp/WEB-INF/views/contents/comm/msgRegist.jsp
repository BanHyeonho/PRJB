<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "다국어등록")}</title>
<meta name="google" content="notranslate">
</head>
<body>
	<div id='content'>
		<div id='header-dummy'></div>
		<div id="content-header" class="content-panel">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			<a id='downloadLink'>Download Excel</a>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "다국어코드/한국어")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="1" enter-exec='99' id="searchParam1">
				</div>
			</div>
		</div>
		<div id='masterGridContainer' class='content-panel ht-pl-1 wd-pl-4 no-mg-tp'>
			<div id="masterGrid" class="grid"></div>
		</div>
	</div>
</body>
<script type="text/javascript">
var excelOptions = {
	      headerStyle: {
	          font: {
	              bold: true,  //enable bold
	              font: 12, // font size
	              color: '00ffffff' //font color --Note: Add 00 before the color code
	          },
	          fill: {   //fill background
	              type: 'pattern', 
	              patternType: 'solid',
	              fgColor: '00428BCA' //background color --Note: Add 00 before the color code
	          }
	      },
	      cellStyle: {
	          font: {
	              bold: false,  //enable bold
	              font: 12, // font size
	              color: '00000000' //font color --Note: Add 00 before the color code
	          },
	          fill: {   //fill background
	              type: 'pattern',
	              patternType: 'solid',
	              fgColor: '00ffffff' //background color --Note: Add 00 before the color code
	          }
	      },
	  };
var data = [];
for (var i = 0; i < 500; i++) {
  data[i] = {
    title: "Task " + i,
    duration: "5 days",
    percentComplete: Math.round(Math.random() * 100),
    start: "01/01/2009",
    finish: "01/05/2009",
    effortDriven: (i % 5 == 0)
  };
}

$('body').exportToExcel("Report.xlsx", "Report", data, excelOptions, function (response) {
//     console.log(response);
});
</script>
</html>