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

<link href="/plugin/fancytree/skin-win8/ui.fancytree.css?v=${pb:jsNow()}" rel="stylesheet">
<script src="/plugin/fancytree/modules/jquery.fancytree.js?v=${pb:jsNow()}"></script>
<script src="/plugin/fancytree/modules/jquery.fancytree.dnd.js?v=${pb:jsNow()}"></script>
<script src="/plugin/fancytree/modules/jquery.fancytree.edit.js?v=${pb:jsNow()}"></script>
  
<style type="text/css">
	#treeContainer > ul{
	    height: 94%;
    	overflow: auto;
	}
</style>
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
		<div id='treeContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1 panel-2 no-drag-area'>
			<div class="div-10">
				<input class="form form-text mg-bt-default" type="text" id="current-path" value="/" readonly>
			</div>
		</div>
		<div id='fileViewContainer' class='content-panel mg-pl-tp-default pd-pl-default ht-pl-1 panel-8-1'>
			<div style="overflow-y: auto; height:100%;" id='attachedFileArea'>
<!-- 				<div class="file_img"> -->
<!-- 					<img id='test1' style="width: 100%;" src='../img/file_default.png'> -->
<!-- 					<p class='mg-tp-sm text-center'>기본이미지</p> -->
<!-- 				</div> -->
<!-- 				<div class="file_img"> -->
<!-- 					<img id='test1' style="width: 100%;" src='../img/file_excel.png'> -->
<!-- 					<p class='mg-tp-sm text-center'>엑셀.xlsx</p> -->
<!-- 				</div> -->
<!-- 				<div class="file_img"> -->
<!-- 					<img id='test1' style="width: 100%;" src='../img/file_folder.png'> -->
<!-- 					<p class='mg-tp-sm text-center'>새폴더</p> -->
<!-- 				</div> -->
<!-- 				<div class="file_img"> -->
<!-- 					<img id='test1' style="width: 100%;" src='../img/file_img.png'> -->
<!-- 					<p class='mg-tp-sm text-center'>이미지.png</p> -->
<!-- 				</div> -->
<!-- 				<div class="file_img"> -->
<!-- 					<img id='test1' style="width: 100%;" src='../img/file_pdf.png'> -->
<!-- 					<p class='mg-tp-sm text-center'>피디에프.pdf</p> -->
<!-- 				</div> -->
<!-- 				<div class="file_img"> -->
<!-- 					<img id='test1' style="width: 100%;" src='../img/file_word.png'> -->
<!-- 					<p class='mg-tp-sm text-center'>워드.doc</p> -->
<!-- 				</div> -->
<!-- 				<div class="file_img"> -->
<!-- 					<img id='test1' style="width: 100%;" src='../img/file_ppt.png'> -->
<!-- 					<p class='mg-tp-sm text-center'>피피티.ppt</p> -->
<!-- 				</div> -->
<!-- 				<div class="file_img"> -->
<!-- 					<img id='test1' style="width: 100%;" src='../img/file_video.png'> -->
<!-- 					<p class='mg-tp-sm text-center'>영상.mp4</p> -->
<!-- 				</div> -->
				
<!-- 				<img class="file_img" id='test1'> -->
<!-- 				<img class="file_img" id='test2'> -->
<!-- 				<img class="file_img" id='test3'> -->
<!-- 				<img class="file_img" id='test4'> -->
<!-- 				<img class="file_img" id='test5'> -->
<!-- 				<img class="file_img" id='test6'> -->
<!-- 				<img class="file_img" id='test7'> -->
<!-- 				<img class="file_img" id='test8'> -->
<!-- 				<img class="file_img" id='test9'> -->
			</div>
		</div>
	</div>
	
	<div id="treeContext" class="context" style="display: none;">
		<ul id="treeContextUl">
			<li>
		    	<div id='newFolderBtn'><span>${pb:msg(pageContext.request, "새폴더")}</span></div>
		  	</li>
		  	<li>
		    	<div id='hideFolderBtn'><span>${pb:msg(pageContext.request, "숨김")}</span></div>
		  	</li>
		  	<li>
		    	<div id='showFolderBtn'><span>${pb:msg(pageContext.request, "숨김해제")}</span></div>
		  	</li>
		  	<li>
		    	<div id='showFolderViewBtn'><span>${pb:msg(pageContext.request, "숨김항목보기")}</span></div>
		  	</li>
		  	<li>
		    	<div id='folderDeleteBtn'><span>${pb:msg(pageContext.request, "삭제")}</span></div>
		  	</li>
		</ul>
	</div>
	
	<div id="fileViewContext" class="context" style="display: none;">
		<ul id="fileViewContextUl">
		  	<li>
		    	<div id='fileDownBtn'><span>${pb:msg(pageContext.request, "다운로드")}</span></div>
		  	</li>
		  	<li>
		    	<div id='fileDeleteBtn'><span>${pb:msg(pageContext.request, "삭제")}</span></div>
		  	</li>
		</ul>
	</div>
	
</body>
</html>