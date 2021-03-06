<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "게시글보기")}</title>
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
</style>
</head>
<body>
	<div id='content' class="pd-pl-default">
		<div id="content-header-1" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
		</div>
		
		<div id='boardEditorContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1-1 panel-8'>
			<form id='boardForm'>
				<div class="div-2-1 mg-rt-default3">
					<label class="form form-require-label">${pb:msg(pageContext.request, "카테고리")}</label>
					<input type="hidden" id='CATEGORY_CODE' value='MOVIE' disabled>
					<input type="text" class="form form-text mg-tp-default" id='CATEGORY_NAME' disabled require='true' tabindex="1">
				</div>
				<div class="div-2-1 mg-rt-default3">
					<label class="form form-require-label">${pb:msg(pageContext.request, "공개여부")}</label>
					<div class="div-10 mg-tp-default">
						<div class="div-4">
							<input type="radio" class="form-radio" name="OPEN_YN" id="OPEN_Y" value='1' tabindex="2" disabled>
							<label for="OPEN_Y" class="form-radio-label">${pb:msg(pageContext.request, "공개")}</label>
						</div>
						<div class="div-6">
							<input type="radio" class="form-radio" name="OPEN_YN" id="OPEN_N" value='0' tabindex="3" disabled>
							<label for="OPEN_N" class="form-radio-label">${pb:msg(pageContext.request, "비공개")}</label>
						</div>
					</div>
				</div>
				<div class="div-6">
					<label class="form form-require-label">${pb:msg(pageContext.request, "제목")}</label>
					<input type="text" class="form form-text mg-tp-default" require='true' id='TITLE' tabindex="4" disabled>
				</div>
			</form>
			<iframe id='editor' src="/editor" class="mg-tp-default"></iframe>
		</div>
		<!-- 첨부파일영역 -->
		<div id='attachedFileContainer' class='content-panel mg-pl-tp-default pd-pl-default ht-pl-1-1 panel-2-1'>
			<div style="overflow-y: auto; height:100%;" id='attachedFileArea'>
				<input type="file" id="attachedFile" multiple="multiple" style="display:none;">
				<table id="attachedFileTable" style="width:100%;">
					<thead>
						<tr>
							<td colspan="2" style="color: #ec7b7e;" class="pd-bt-default" >
							</td>
							<td>
								<i class="fi fi-rr-Clip" id='attachedFileBtn'></i>
							</td>
						</tr>
					</thead>
					<tbody>
					
					</tbody>
				</table>
			</div>
		</div>
	</div>
</body>
</html>