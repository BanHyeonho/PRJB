<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%-- <%@ page session="false"%> --%>
<%@ include file="../../include.jsp"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "메모장")}</title>
<meta name="google" content="notranslate">
<style type="text/css">
#editor{
	height: 91%;
}
@media screen and (max-width: 1280px) {
	#editor{
		height: 90%;
	}
}
#fileIcon{
	font-size: 25px; 
	position: absolute; 
	right:0; 
	cursor: pointer; 
	z-index: 10;
}
#attachedFileContainer{
	border: 1px solid #ccc; 
	height: 300px; 
	width: 300px; 
	position: absolute;
	right: 0; 
	z-index: 9;
	display: none;
}
</style>
</head>
<body>
	<div id='content' class="pd-pl-default">
		<div id="content-header" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
			<div class="search-area mg-tp-default2">
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "검색")}</label>
					<input class="form form-text mg-tp-default" type="text" tabindex="1" enter-exec='99' id="searchParam1">
				</div>
			</div>
		</div>
		<div id='masterGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1 panel-2'>
			<div id="masterGrid" class="grid"></div>
		</div>
		<div id='detailGridContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1 panel-2-1'>
			<div id='detailGrid' class="grid"></div>
		</div>
		
		
		<div id='noteEditorContainer' class='content-panel mg-pl-tp-default pd-pl-default ht-pl-1 panel-6-1' style="position: relative;">
			<form id='noteForm'>
				<input type="hidden" id='MY_NOTE_DETAIL_ID' name='MY_NOTE_DETAIL_ID' require='true'>
				<div class="div-7-1 mg-rt-default3">
					<label class="form form-require-label">${pb:msg(pageContext.request, "제목")}</label>
					<input type="text" class="form form-text mg-tp-default" require='true' id='TITLE' name='TITLE' disabled>
				</div>
				<div class="div-2">
					<label class="form">${pb:msg(pageContext.request, "수정_시간")}</label>
					<span class="form mg-tp-default1" id="MDT" name='MDT'>-</span>
				</div>
				<div class="div-1" style="position: absolute;">
					<i class="fi fi-rr-Clip" id='fileIcon'></i>
					<!-- 첨부파일영역 -->
					<div id='attachedFileContainer' class='content-panel mg-pl-tp-default pd-pl-default'>
						<div style="overflow-y: auto; height:100%;" id='attachedFileArea'>
							<input type="file" id="attachedFile" multiple="multiple" style="display:none;">
							<table id="attachedFileTable" style="width:100%;">
								<thead>
									<tr>
										<td colspan="3" class="pd-default form-require-label" >
											${pb:msg(pageContext.request, "파일을_드래그하세요")}
										</td>
									</tr>
								</thead>
								<tbody>
								
								</tbody>
							</table>
						</div>
					</div>
				</div>		
			</form>
			<iframe id='editor' src="/editor" class="mg-tp-default"></iframe>
		</div>
	</div>
</body>
</html>