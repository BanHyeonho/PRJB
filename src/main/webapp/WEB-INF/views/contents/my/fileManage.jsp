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
	
	<div id="fileViewContext" class="context no-drag-area" style="display: none;">
		<ul id="fileViewContextUl">
		  	<li>
		    	<div id='preViewBtn'><span>${pb:msg(pageContext.request, "미리보기")}</span></div>
		  	</li>
		  	<li>
		    	<div id='fileNewFolderBtn'><span>${pb:msg(pageContext.request, "새폴더")}</span></div>
		  	</li>
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