<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "파일관리")}</title>
<meta name="google" content="notranslate">

<!-- fancy 트리 -->
<link href="/plugin/fancytree/skin-win8/ui.fancytree.css?v=${pb:jsNow()}" rel="stylesheet">
<script src="/plugin/fancytree/modules/jquery.fancytree.js?v=${pb:jsNow()}"></script>
<script src="/plugin/fancytree/modules/jquery.fancytree.dnd.js?v=${pb:jsNow()}"></script>
<script src="/plugin/fancytree/modules/jquery.fancytree.edit.js?v=${pb:jsNow()}"></script>


<style type="text/css">
	#treeContainer > ul{
	    height: 94%;
    	overflow: auto;
	}
	#fileViewContainer .file_img{
		display: inline-block;
		vertical-align: top;
		width: 100px;
		min-height: 120px;
		margin: 10px 15px;
		padding: 5px;
		box-sizing: border-box;
		transition: all 0.1s linear;
	}
	#preview_list .file_img{
		display: inline-block;
		vertical-align: top;
		width: 85px;
		min-height: 100px;
		padding: 5px;
		box-sizing: border-box;
		transition: all 0.1s linear;
	}
</style>
</head>
<body onselectstart="return false;">
	<input type='hidden' id='publicKey' value='${publicKey}'>
	
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
	
	<!-- 컨텍스트메뉴 -->
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
		    	<div id='previewBtn'><span>${pb:msg(pageContext.request, "미리보기")}</span></div>
		  	</li>
		  	<li>
		    	<div id='fileNewFolderBtn'><span>${pb:msg(pageContext.request, "새폴더")}</span></div>
		  	</li>
		  	<li>
		    	<div id='fileEncodingBtn'><span>${pb:msg(pageContext.request, "인코딩_신청")}</span></div>
		  	</li>
		  	<li>
		    	<div id='fileDownBtn'><span>${pb:msg(pageContext.request, "다운로드")}</span></div>
		  	</li>
		  	<li>
		    	<div id='fileDeleteBtn'><span>${pb:msg(pageContext.request, "삭제")}</span></div>
		  	</li>
		</ul>
	</div>
	
	<!-- 모달 -->
	<div id="modal_hideItemShow" title='${pb:msg(pageContext.request, "숨김항목보기")}' class='no-drag-area'>
		<p class="validateTips form-require-label">* ${pb:msg(pageContext.request, "마이페이지")} > ${pb:msg(pageContext.request, "개인정보수정")} > ${pb:msg(pageContext.request, "2차_비밀번호를_설정하세요")}</p>
		
		<div class="div-10  mg-tp-default2">
			<label class="form">${pb:msg(pageContext.request, "2차_비밀번호")}</label>
			<input type="password" name="PWD2" id="PWD2" class="form form-text mg-tp-default">
		</div>
	</div>
	
	<div id="modal_preview" title='${pb:msg(pageContext.request, "미리보기")}' class='no-drag-area'>
		<div id='preview_list' class='mg-pl-default no-mg-lt pd-pl-default panel-1' style="border: 1px solid silver; float: left; height: 97%; overflow: auto;">
			
		</div>
		<div id='preview_view' class='mg-pl-tp-default pd-pl-default panel-9-1' style="border: 1px solid silver; float: left; height: 97%;">
			
			<div id="pdf_viewer" style="display: none; width: 100%;height: 100%;">
	            <iframe style="width: 100%; height: 100%;">
	
	            </iframe>
	        </div>
			
			<div id="img_viewer" style="display: none; width: 100%;height: 100%; position: relative; display: flex; justify-content: center; align-items: center;">
	            <img style="max-width: 100%; max-height: 100%;">
	        </div>
	        
	        <div id="video_viewer" style="display: none; width: 100%;height: 100%;">
	            <video style="width:100%; height:100%;" controls preload="metadata">
					<source name='videoSource' type="video/mp4">					
				</video>
				
				<div id="subtitleContext" class="context no-drag-area" style="display: none;">
					<ul id="subtitleContextUl">
					</ul>
				</div>
	        </div>
	        
		</div>
	</div>
	
</body>
</html>