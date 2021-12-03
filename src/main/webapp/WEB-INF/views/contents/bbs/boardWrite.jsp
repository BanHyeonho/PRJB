<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "게시글쓰기")}</title>
<meta name="google" content="notranslate">
</head>
<body>
	<div id='content'>		
		<div id='header-dummy'></div>
		<div id="content-header-1" class="content-panel">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
		</div>
		
		<div id='boardEditorContainer' class='content-panel ht-pl-1-1 wd-pl-3 no-mg-tp'>
			<div class="div-2-1 mg-rt-default3">
				<label class="form">${pb:msg(pageContext.request, "카테고리코드")}</label>
				<input type="hidden" id='CATEGORY_CODE' value='MOVIE'>
				<input type="text" class="form form-text mg-tp-default" id='CATEGORY_NAME' tabindex="1" value='영화'>
			</div>
			<div class="div-8">
				<label class="form">${pb:msg(pageContext.request, "제목")}</label>
				<input type="text" class="form form-text mg-tp-default" id='TITLE' tabindex="2">
			</div>
			<iframe id='editor' src="/editor" class="mg-tp-default" style="height: 90%;" ></iframe>
		</div>
		<!-- 첨부파일영역 -->
		<div id='attachedFileContainer' class='content-panel ht-pl-1-1 wd-pl-1 no-mg-tp no-mg-lt'>
			<div style="overflow-y: auto; height:100%;" id='attachedFileArea'>
				<input type="file" id="attachedFile" multiple="multiple" style="display:none;">
				<table id="attachedFileTable" style="width:100%;">
					<thead>
						<tr>
							<td colspan="2" style="color: #ec7b7e;" class="pd-bt-default" >
								${pb:msg(pageContext.request, "파일을_드래그하세요")}
							</td>
							<td>
								<i class="fi fi-rr-Clip" id='attachedFileBtn' style="cursor:pointer;"></i>
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