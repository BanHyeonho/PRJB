/**
 * 파일관리
 */

const pageInfo = {
		moduleCode : 'MY',
		menuUrl : 'fileManage'
}

const gv_fileExtension = parent.index_info.gv_fileExtension;

var f_dragData = [];

var folderTree; 

let fileManageInfo = {
	attachedFiles : [],
	attachedDelFiles : [],
}

$(document).ready(function() {
	
	folderTree = f_tree('treeContainer');
	
	//파일 드래그 영역 표시
	f_set_dragSelect('#fileViewContainer .file_img');
	
	$('#treeContainer').attr('ondrop', 'drop(event)')
					   .attr('ondragover', 'allowDrop(event)')
					   .on('contextmenu', function(e) {
						   f_show_treeContext(e);
						   return false;
						});
	$('#treeContextUl').menu();
	
	
	$('#fileViewContainer').on('contextmenu', function(e) {
						   f_show_fileViewContext(e);
						   return false;
						});
	
	$('#fileViewContextUl').menu();
		
	//파일 드래그 셋팅
	f_setFileDrag();

	//모달셋팅
	f_set_modal();
	
	//트리 컨텍스트메뉴
	$('#newFolderBtn').on('click', f_newFolder);
	$('#folderDeleteBtn').on('click', f_folderDelete);
	$('#showFolderBtn').on('click', {param1 : 'Y'}, f_showFolder);
	$('#hideFolderBtn').on('click', {param1 : 'N'}, f_showFolder);
	$('#showFolderViewBtn').on('click', f_showFolderView);
	
	//파일영역 컨텍스트메뉴
	$('#fileNewFolderBtn').on('click', f_newFolder);
	$('#fileDeleteBtn').on('click', f_fileDelete);
	$('#fileDownBtn').on('click', f_fileDown);
	$('#previewBtn').on('click', f_openPreview);
	
	f_search();
	
});

/*****************************************************************************************************************************************************************
 * 
 * 모달
 * 
 *****************************************************************************************************************************************************************/
var f_set_modal = function(){
	
	//숨김항목보기 모달
	var hideItemOption = {
			resizable : false,
			height: 230,
			width: 460,
			buttons : {}
	}
	hideItemOption.buttons[gf_mlg('확인')] = function(){
    	
		var modal = $(this);
    	var fData = new FormData();
    	fData.set('PWD2', gf_securePw( $('#PWD2').val() , $('#publicKey').val() ));
    	fData.set('TITLE_STR', $('#searchParam1').val() );
    	
    	gf_ajax( fData, function(){
    		
    		var rs = true;
    		if( $('#PWD2').val() == '' ){
    			gf_toast(gf_mlg("을(를)_입력하세요", {
    				param : $('#PWD2').siblings('label').text()
    			}), 'info');
    			rs = false;
    		}
    		gf_delFormData(fData);
    		
    		return rs;
    		
    	}, function(data){
    		$('#PWD2').val('');
    		if(data.state == 'success'){
    			
    			f_treeReload( makeTree(data.result, []) );
    			modal.dialog('close');
    		}
    		//아이디, 비밀번호 오류
    		else if( data.state == 'chkPwd2'){
    			gf_toast(gf_mlg('2차_비밀번호가_일치하지_않습니다'), 'info');
    			$('#PWD2').focus();
    		}
    	}, null, null, '/my/showFolderView');
    	
    	
    };
    hideItemOption.buttons[gf_mlg('닫기')] = function(){
    	$(this).dialog('close');
    };
	gf_modal('modal_hideItemShow', hideItemOption);
	
	//미리보기 모달
	var previewOption = {
			resizable : true,
			height: 700,
			width: 1250,
			buttons : {}
	}
	gf_modal('modal_preview', previewOption);
	
}
/*****************************************************************************************************************************************************************
 * 
 * 버튼 기능
 * 
 *****************************************************************************************************************************************************************/
var f_search = function(){
	f_fileClear();
	f_treeReload();
	
}

var f_save = function(){
	var fData = new FormData();

	var fileInfo = [];
	//첨부파일
	$.each(fileManageInfo.attachedFiles, function(idx, item){
		
		fileInfo.push({
			KEY_ID : item.KEY_ID,
			PARENT_KEY_ID : folderTree.getActiveNode() == null ? null : folderTree.getActiveNode().key
		});
		
		fData.append(item.KEY_ID + '_File', item);
	});
	
	fData.append('fileInfo', JSON.stringify(fileInfo));
	
	//첨부파일삭제
	if(fileManageInfo.attachedDelFiles.length > 0){
		fData.append('attachedFileDel', JSON.stringify(fileManageInfo.attachedDelFiles));	
	}
		
	gf_ajax( fData
			, function(){
				var result = false;
				var saveDataLen = fileManageInfo.attachedDelFiles.length + fileManageInfo.attachedFiles.length;
				
				if(saveDataLen > 0){
					result = true;
				}
				else{
					gf_toast(gf_mlg('저장할_데이터가_없습니다'), 'info');	
				}
				
				return result;
			}
			, function(data){
				console.log(data);
				
				var result = data.result;
				
				if(result.state == 'success'){
					gf_toast(gf_mlg('저장_되었습니다'), 'success');	
				}
				else{
					gf_toast(gf_mlg('개의_항목에_오류가_발생하였습니다',{
						param : result.failCnt
					}), 'info');
				}
				f_search();	
				
			}
			, null
			, null
			, '/my/fileManageSave');
}

/*****************************************************************************************************************************************************************
 * 
 * 트리영역 기능
 * 
 *****************************************************************************************************************************************************************/
function dragStart(event) {

  $.each($('.drag-highlight'), function(idx, item){
	    f_dragData.push($(item).attr('id'));
  });
  event.dataTransfer.setData("dragData", f_dragData);  
}

function dragEnd(event) {
  f_dragData = [];
  $('.drag-highlight').removeClass('drag-highlight');
  $('.file_img_over').removeClass('file_img_over');
}


function allowDrop(event) {
	  event.preventDefault();
}

function drop(event) {

  event.preventDefault();
  var data = event.dataTransfer.getData("dragData").split(',');
  console.log('drop', data);

}

//트리데이터 조회
var f_searchTree = function(){
	var result = [];
	
	var searchParam = {
		QUERY_ID : 'my.S_FILE_MANAGE_TREE'
	};
		
	if( typeof folderTree == 'object' ){
		folderTree.clear();
	}
	
	if($('#searchParam1').val() == ''){
		
		gf_ajax(searchParam
				, null
				, function(data){
					var resultList = data.result.filter(x=> x.TYPE_CODE == 'FOLDER');
					
					result = makeTree(resultList, result);
					
				}, null, null, null, false);
	}
	else{
		gf_ajax({
					QUERY_ID : 'my.S_FILE_MANAGE_TREE_ITEM',
					TITLE_STR : $('#searchParam1').val()
				}
				, null
				, function(data){
					
					var itemFilter = new Set();
					
					$.each(data.result, function(idx, item){
						var list = item.KEY_STR.split('/');
						list.shift();
						
						$.each(list, function(idx2, item2){
							itemFilter.add(item2);
						});
					});
					
					var itemList = '';
					if(itemFilter.size > 0){
						itemFilter.forEach(function(idx, item){
							itemList += '/' +item;
						});	
					}
					else{
						itemList = '-1';
					}
					
					searchParam['FILE_LIST'] = itemList;
					
					gf_ajax(searchParam
							, null
							, function(data2){
								var resultList = data2.result.filter(x=> x.TYPE_CODE == 'FOLDER');
								
								result = makeTree(resultList, result);
								
							}, null, null, null, false);
			
			
				}, null, null, null, false);
		
	}
	
	return result;
}

function makeTree(data, result){
	$.each(data, function(idx, item){
		
		var myFileManageId = item.MY_FILE_MANAGE_ID;
		var showYn = item.SHOW_YN;
		var parentKeyId = gf_nvl(item.PARENT_KEY_ID, '');
		var keyId = item.KEY_ID;
		var title = item.TITLE;
		var childCnt = item.CHILD_CNT;			
		var folder = (item.TYPE_CODE == 'FOLDER' ? true : false);
		
		var resultItem = {
				myFileManageId : myFileManageId,
				showYn : showYn,
				expanded : true,
				folder : folder,
				title : title,
				childCnt : childCnt,
				key : keyId
			};
		
		if(parentKeyId == ''){
			result.push(resultItem);
		}
		else{
			
			var child = gf_nvl(deepFind(result, parentKeyId), {});
			
			if(child.hasOwnProperty('children')){
				child['children'].push(resultItem);
			}
			else{
				child['children'] = [resultItem];
			}
		}
		
	});
	
	return result;
	
	function deepFind(p_list, p_parent_key){
		var findChild = p_list.find(x=> x.key == p_parent_key);
		if(typeof findChild == 'object'){
			return findChild;
		}
		
		for(var i=0 ; i<p_list.length; i++){
			
			var v_list = p_list[i]['children'];
			if( typeof v_list == 'object' ){
				var tmp = deepFind(v_list, p_parent_key);
				if(typeof tmp == 'object'){
					return tmp;
				}
			}
		}
	}
}

var f_tree = function(containerId){
	var result;
	var clearYn = false;
	$("#" + containerId).fancytree({
		extensions: ["dnd", "edit"],
		source: function(){
			var data = [];
			if(data.length == 0){
				clearYn = true;
			}
			
			return data;
		},
		activate: function(event, data) {
			
			var text = gf_nvl(data.node, {}).title;
			var parent = gf_nvl(data.node, {}).parent;
			
			a:while(parent != null){
				
				if(parent.isRoot()){
					text = '/' + text;
					break a;
				}
				else{
					text = parent.title  + '/' + text;
				}
				parent = parent.parent;
			}
			
			$('#current-path').val(gf_nvl(text, '/'));
			
			f_searchFile();
		},		
		edit: { // title 수정
	      triggerStart: ["f2", "dblclick", "mac+enter"], // 수정전환 키 조합
	      close: function(event, data) {
	    	  //수정완료
//		    	  if( data.save && data.node.title == data.orgTitle ){
//		    		  
//		    	  }
	      }
	    },
	    modifyChild : function(event, data){
//		    	console.log('data.operation', data.operation);
	    	
	    	f_modifyChildAction(data.operation, data.childNode);
	    	
	    },
		dnd: {
			autoExpandMS: 400,
			focusOnClick: true,
			preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
			preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
			dragStart: function(node, data) {
				/** This function MUST be defined to enable dragging for the tree.
				 *  Return false to cancel dragging of node.
				 */
				return true;
			},
			dragEnter: function(node, data) {
				/** data.otherNode may be null for non-fancytree droppables.
				 *  Return false to disallow dropping on node. In this case
				 *  dragOver and dragLeave are not called.
				 *  Return 'over', 'before, or 'after' to force a hitMode.
				 *  Return ['before', 'after'] to restrict available hitModes.
				 *  Any other return value will calc the hitMode from the cursor position.
				 */
				// Prevent dropping a parent below another parent (only sort
				// nodes under the same parent)
/* 					if(node.parent !== data.otherNode.parent){
					return false;
				}
				// Don't allow dropping *over* a node (would create a child)
				return ["before", "after"];
*/
			   return true;
			},
			dragDrop: function(node, data) {
				/** This function MUST be defined to enable dropping of items on
				 *  the tree.
				 */
				data.otherNode.moveTo(node, data.hitMode);
			}
		}
	}).children('ul').addClass('fancytree-connectors');
	
	result = $.ui.fancytree.getTree("#" + containerId);
	
	if(clearYn){
		result.clear();
		clearYn = false;
	}
	return result;
}

var f_show_treeContext = function(e){
	$('.context').hide();
	$('#treeContext').css({
			'top' : e.pageY
		 , 'left' : e.pageX
		 , 'z-index': '9999'
		 , 'display' : 'block'
	});
}

var f_show_fileViewContext = function(e){
	$('.context').hide();
	$('#fileViewContext').css({
			'top' : e.pageY
		 , 'left' : e.pageX
		 , 'z-index': '9999'
		 , 'display' : 'block'
	});
}

//새폴더
var f_newFolder = function(e){
	var currNode = folderTree.getActiveNode();
	if( currNode == null){
		currNode = folderTree.getRootNode();
	}
	var result = currNode.addChildren( {title : gf_mlg('새폴더'), folder : true} );
	folderTree.activateKey(result.key);
	$('.context').hide();
}

//폴더삭제
var f_folderDelete = function(e){
	if(folderTree.getActiveNode() != null){
		f_modifyChildAction('remove', folderTree.getActiveNode());
		folderTree.getActiveNode().remove();
	}
	$('.context').hide();
	folderTree._triggerTreeEvent('activate');
}

//트리 수정action
var f_modifyChildAction = function(p_operation, p_node){
	if(p_node == null){
		return;
	}
	
	var queryId = '';
	var title = p_node.title;
	var key_id = p_node.key;
	var parent_id = p_node.parent.key;
	parent_id = (parent_id == 'root_1' ? null : parent_id);
	
	var nodeData = gf_nvl(p_node.data, {});
	//삭제
	if(p_operation == 'remove'){
		queryId = 'my.D_FILE_MANAGE_TREE';
	}
	//추가
	else if(p_operation == 'add'){
		queryId = 'my.U_FILE_MANAGE_TREE';
	}
	//이동, 이름변경(변경)
	else if(p_operation == 'move'
		 || p_operation == 'rename'
	){
		queryId = 'my.U_FILE_MANAGE_TREE';
	}
	
	var fData = new FormData();
	fData.set('QUERY_ID', queryId);
	fData.set('TABLE_NAME', 'MY_FILE_MANAGE');
	
	fData.set('SEQ', p_node.parent.getChildren().indexOf(p_node) +1);
	fData.set('KEY_ID', key_id);
	fData.set('TITLE', title);
	fData.set('TYPE_CODE', 'FOLDER');
	if(parent_id != null){
		fData.set('PARENT_KEY_ID', parent_id);	
	}
	fData.set('SHOW_YN', gf_nvl( nodeData.showYn, '1'));
	
	gf_ajax(fData
	, function(){
		return (queryId == '' ? false : true);
	}
	, function(data){
		
	}, null, null, null, false);
}

//폴더 숨기기/보이기
var f_showFolder = function(e){
	if(folderTree.getActiveNode() != null){
		
		folderTree.getActiveNode().data.showYn = (e.data.param1 == 'N' ? '0' : '1');
		
		f_modifyChildAction('rename', folderTree.getActiveNode());
	}
	$('.context').hide();
//		folderTree._triggerTreeEvent('activate');	//노드없이 활성화트리거
	folderTree._triggerNodeEvent('activate', folderTree.getActiveNode());	//해당노드를 활성화트리거
	
	$('#current-path').focus();	//즉각적인 아이콘변경을 위함
}

//숨김파일 모두보기
var f_showFolderView = function(){
	
	$( "#modal_hideItemShow" ).dialog('open');
	
	$('.context').hide();
		
}

//데이터로 트리만들기
var f_treeReload = function(p_data){
	
	var clearYn = false;
	folderTree.reload(function(){
		var data = [];
		
		//일반조회
		if(gf_nvl(p_data, '') == ''){
			data = f_searchTree();
		}
		else{
			data = p_data;
		}
		
		if(data.length == 0){
			clearYn = true;
		}
		
		return data;
	}).then(function(){
		if(clearYn){
			folderTree.clear();
			clearYn = false;
		}
		folderTree._triggerTreeEvent('activate');
	});
}
	

/*****************************************************************************************************************************************************************
 * 
 * 파일영역 기능
 * 
 *****************************************************************************************************************************************************************/
//파일 드래그 영역 표시
function f_set_dragSelect(p_target){
	var target = p_target; //셀렉트로 묶을 객체
	
	var mode = false;	//드래그 중인지 체크
	var move = false;	//클릭만 했는지, 드래그했는지 체크
		
	var startX = 0;
	var startY = 0;
	var left, top, width, height;
	
	$('body').append($('<div id="drag-area"></div>'));
		
	$(p_target).on('mouseover', function(e){
		if( $(e.target).hasClass('drag-highlight') 
		&& $('.file_img_over').length == 0
		&& !mode
		){
			
			$(e.target).addClass('file_img_over');	
		}
	}).on('mouseout', function(e){
		
		if(move){
			$('.file_img_over').removeClass('file_img_over');	
		}
	});
	
	var $focus = $("#drag-area");

	$(document).on("mousedown", function(e) {

		if( !($(e.target).closest('.context').length > 0)
		){
			$('.context').hide();
		}
		
		if($(e.target).closest('.no-drag-area').length > 0
		|| $(e.target).closest('.ui-widget-header').length > 0
		|| $(e.target).closest('.ui-widget-content').length > 0		
		|| $(e.target).prop('tagName').toLowerCase() == 'button'
		|| $(e.target).prop('tagName').toLowerCase() == 'input'
		|| e.which == 3	//우클릭
		){
			return;
		}
		
		move = false;
		mode = true;
				
		startX = e.clientX;
		startY = e.clientY;
		width = height = 0;
		
		$focus.css("left", startX);
		$focus.css('top', startY);
		$focus.css("width", width);
		$focus.css("height", height);
		
		$focus.show();
		
	}).on('mouseup', function(e) {
		if($(e.target).closest('.no-drag-area').length > 0
		|| $(e.target).prop('tagName').toLowerCase() == 'button'
		|| e.which == 3	//우클릭
		){
			return;
		}
		
		mode = false;
		 $focus.hide();
		 $focus.css("width", 0);
		 $focus.css('height', 0);
		 
		 //클릭만 한경우
		 if(!move){
			width = 1;
			left = e.clientX;
			height = 1;
			top = e.clientY;
			
		 }
		 
		//범위 내 객체를 선택한다.
		$('.drag-highlight').removeClass('drag-highlight');
		$('.file_img_over').removeClass('file_img_over');
		rangeSelect(target, left, top, left + width, top + height, function(include) {
			if(include){
				$(this).addClass('drag-highlight');
			}
		});
		
		//클릭만 한경우
		 if(!move){
			 setTimeout(function(){
				 $('.drag-highlight').trigger('mouseover');	 
			 },0);
		 }
		 
	}).on('mousemove', function(e) {
		//선택한 아이콘 이동
		if( $('.file_img_over').length > 0 ){
			$focus.hide();
			return;
		}
		
		if(!mode) {
			return;
		}
		move = true;
		
		var x = e.clientX;
		var y = e.clientY;
		//마우스 이동에 따라 선택 영역을 리사이징 한다
		width = Math.max(x - startX, startX - x);
		left = Math.min(startX, x);
		height = Math.max(y - startY, startY - y);
		top = Math.min(startY, y);

		$focus.css('left', left);
		$focus.css("width", width);
		$focus.css('height', height);
		$focus.css('top', top);
		
	});
	
	function rangeSelect(selector, x1, y1, x2, y2, cb) {
		
		if(x1 == 0
		&& y1 == 0
		&& x2 == 0
		&& y2 == 0
		){
			return false;
		}
		
		$(selector).each(function() {

			setTimeout(function(p_this){
				var $this = $(p_this);
				var offset = $this.offset();
				var x = offset.left;
				var y = offset.top;
				var w = $this.width();
				var h = $this.height();
				
				//드래그영역과 아이콘이 겹치는치 체크
				var r1 = {
					x : x,
					y : y,
					w : w,
					h : h,
				};
				var r2 ={
					x : x1,
					y : y1,
					w : x2 - x1,
					h : y2 - y1,	
				};
				cb.call(p_this, chkIntersection(r1, r2));
			}, 0, this);
			
		});
	}
	
	function chkIntersection(r1, r2){

		if(r1.x > r2.x+r2.w){
			return false;
		}
		else if(r1.x+r1.w < r2.x){
	    	return false;
	    }
		else if(r1.y > r2.y+r2.h){
	    	return false;
	    }
		else if(r1.y+r1.h < r2.y){
	    	return false;
	    }
		else{
		    var rect = {};
		    rect.x = Math.max(r1.x, r2.x);
		    rect.y = Math.max(r1.y, r2.y);
		    rect.w = Math.min(r1.x+r1.w, r2.x+r2.w)-rect.x;
		    rect.h = Math.min(r1.y+r1.h, r2.y+r2.h)-rect.y;
//		    console.log(rect);
		    
		    if(isNaN(rect.x)
    		|| isNaN(rect.y)
    		|| isNaN(rect.w)
    		|| isNaN(rect.h)
    		){
		    	return false;
		    }
		    
			return true;	
		}
	}
}

//첨부파일드래그
var f_setFileDrag = function(){
	//첨부파일
//	$('#attachedFileBtn').on('click', function(){
//		$('#attachedFile').click();
//	});
	$("#attachedFile").change(function () {
        fileAttachment();
    })
    //드래그 앤 드랍
    $("#attachedFileArea").on("dragenter", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
    }).on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        $(this).css({"background-color": "#FFD8D8"});

    }).on("dragleave", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        $(this).css({"background-color": ""});

    }).on("drop", function (e) {
    	
        e.preventDefault();
        e.stopPropagation();
        
        $(this).css({"background-color": ""});

        e.dataTransfer = e.originalEvent.dataTransfer;
        var files = e.target.files || e.dataTransfer.files;
        fileAttachment(files);

    });
	
	var fileAttachment = function (dragDrop) {

	    var file_names = dragDrop ? dragDrop : $("#attachedFile").prop("files");

	    for (var i = 0; i < file_names.length; i++) {

	        (function (file) {

	            setTimeout(function () {

	                //파일확장자
	                var fileExt = file.name.substring(file.name.lastIndexOf('.') +1, file.name.length).toUpperCase();
	                
	                var fileExtensions = parent.index_info.gv_fileExtension.map(x=>x.CODE_VALUE);
	                //폴더 또는 용량이 없는 파일
	                if(file.size == 0
	        		|| file.name.lastIndexOf('.') == -1
	        		){
	                  gf_toast(gf_mlg('폴더_또는_용량이_없는_파일은_업로드_할_수_없습니다'));
	                    return false;   
	                }
	                //최대용량 초과
	                else if( Number(file.size) >  Number(gv_fileMaxSize)){
	                	gf_toast(gf_mlg('업로드_최대용량을_초과하였습니다',{
	                		param : gf_getFileSize(gv_fileMaxSize)
	                	}));
	                    return false;
	                }
	                //파일명 한도 초과
	                else if(file.name.length > gv_fileNameMaxlength){
	                	gf_toast(gf_mlg('최대_파일_명_길이를_초과하였습니다',{
	                		param1 : gv_fileNameMaxlength,
	                		param2 : file.name.length
	                	}));
	                	return false;
	                }
	                //업로드 불가 파일확장자
                	else if(fileExtensions.indexOf(fileExt.toUpperCase()) == -1 
            			 && file.type == ''
            		){
	                	gf_toast(gf_mlg('다음의_확장자만_업로드_가능합니다',{
	                		param : fileExtensions.join()
	                	}));
	                    return false;
	                }
	                else{
	                	var fileId = new Date().getTime() + '_' + $('.file_img').length;
	                	
	                	var fSize = gf_getFileSize(file.size);    

						var v_item = {
								TYPE_CODE : 'FILE',
								FILE_ID : fileId,
								FILE_EXTENSION : fileExt,
								TITLE : file.name
						};
						
						f_makeFile(v_item, 'attachedFileArea', file);
						
						file['KEY_ID'] = fileId;
						
	                    fileManageInfo.attachedFiles.push(file);
	                }

	            }, 0);

	        }(file_names[i]));

	    }

	}
}


//파일 조회
var f_searchFile = function(){
	var searchParam = {
			QUERY_ID : 'my.S_FILE_MANAGE',	
	};
	
	if(gf_nvl(folderTree.getActiveNode(), '') != ''){
		searchParam['PARENT_KEY_ID'] = folderTree.getActiveNode().key
	}
	
	gf_ajax(searchParam
	, function(data){
		f_fileClear();
		
		return true;
	}
	, function(data){
		
		if(data.result.length > 0){
			$.each(data.result, function(idx, item){
				f_makeFile(item, 'attachedFileArea');
			});
		}
				
	}, null, null, null, false);
	
}
//파일영역 클리어
var f_fileClear = function(){
	$('#attachedFileArea div').remove();
	
	fileManageInfo.attachedFiles = [];
	fileManageInfo.attachedDelFiles = [];
	
}
//파일모양 생성
var f_makeFile = function(p_file, p_target, p_fileOrigin){
	
	var div = $('<div></div>').addClass('file_img')
		.attr('ondragstart', 'dragStart(event)')
		.attr('ondragend', 'dragEnd(event)')
		.attr('MY_FILE_MANAGE_ID', p_file.MY_FILE_MANAGE_ID)
		.attr('KEY_ID', p_file.KEY_ID)
		.attr('FILE_ID', p_file.FILE_ID)
		.attr('RANDOM_KEY', p_file.RANDOM_KEY)
		.attr('FILE_EXTENSION', p_file.FILE_EXTENSION)
		;

	var fileIcon = 'file_folder.png';
	
	var fileInfo = {}; 
	if(gf_nvl(p_file.TYPE_CODE, '') == 'FILE'){
		
		fileInfo = gf_nvl(parent.index_info.gv_fileExtension.find(x=> x.CODE_VALUE == p_file.FILE_EXTENSION.toUpperCase()), {});
				
		fileIcon = gf_nvl(fileInfo.ICON, 'file_default.png');
	}
	
	var fileImg = $('<img>').attr('src', '../img/' + fileIcon );
	var fileNm = $('<p></p>').addClass('mg-tp-sm').addClass('text-center').text(p_file.TITLE);
	div.append(fileImg).append(fileNm);
	
	$('#' + p_target).append(div);
	
	//이미지일 경우 미리보기
	if( fileInfo.ATTRIBUTE1 == 'IMG' ){
		
		if( gf_nvl(p_file.RANDOM_KEY, '') != '' ){
			setTimeout(function(){
				
				//gif파일은 썸네일을 만들지 않는다.
				if(p_file.FILE_EXTENSION.toLowerCase() == 'gif'){
					fileImg.attr('src', '/preview?MODULE_CODE=MY&MENU_URL=fileManage&COMM_FILE_ID=' + p_file.FILE_ID + '&RANDOM_KEY=' + p_file.RANDOM_KEY);	
				}
				else{
					fileImg.attr('src', '/thumbnailPreview?MODULE_CODE=MY&MENU_URL=fileManage&COMM_FILE_ID=' + p_file.FILE_ID + '&RANDOM_KEY=' + p_file.RANDOM_KEY + '&WIDTH=' + Math.floor(Number(fileImg.css('width').replace('px', ''))) );	
				}
				
			}, 0);	
		}
		else{
			
			setTimeout(function(){
				var reader = new FileReader();
				
				reader.onload = function(event) {
					fileImg.attr('src', event.target.result);
				};
				
				reader.readAsDataURL(p_fileOrigin);
				
			}, 0);

		}
		
		
	}
	
}

//파일삭제 type: DB / SCRIPT 
var f_fileDelete = function (e) {

	var deleteTarget = $('#attachedFileArea .drag-highlight');
	if(deleteTarget.length > 0){
		
		var confirmText = gf_mlg('개의_파일을_삭제하시겠습니까',{
    		param : deleteTarget.length
    	});
		
		if( confirm(confirmText) ){
		
			$.each(deleteTarget, function(idx, item){
				setTimeout(function(){
					var fileId = $(item).attr('FILE_ID');
					var randomKey = $(item).attr('RANDOM_KEY');
					var myFileManageId = $(item).attr('MY_FILE_MANAGE_ID');
					var keyId = $(item).attr('KEY_ID');
					
					//화면에 올리기만한 데이터 1건식 삭제
					if(gf_nvl(myFileManageId, '') == ''){
						fileManageInfo.attachedFiles = fileManageInfo.attachedFiles.filter((x, idx, array) => {
				            return x.KEY_ID != fileId
				        });
					}
					//DB데이터 삭제
					else{
						
						fileManageInfo.attachedDelFiles.push({
							MY_FILE_MANAGE_ID : myFileManageId,
							COMM_FILE_ID : fileId,
							KEY_ID : keyId,
			            	RANDOM_KEY : randomKey
			            });
						
					}
					
					$(item).remove();
				}, 0);			
				
			});
			
			
		}
	}
	
	$('.context').hide();
}

//파일다운로드
var f_fileDown = function(){
	
	var target = $('#attachedFileArea .drag-highlight');
	if(target.length > 0){
		
		//파일1개 다운로드
		if(target.length == 1){
						
			var fileId = target.attr('FILE_ID');
			var randomKey = target.attr('RANDOM_KEY');
			location.href = '/fileDownload?MODULE_CODE=' + pageInfo.moduleCode
										+ '&MENU_URL=' + pageInfo.menuUrl
										+ '&COMM_FILE_ID=' + fileId + '&RANDOM_KEY=' + randomKey;
		}
		//압축 다운로드
		else{
			var fileName = prompt(gf_mlg('압축_파일_명을_입력하세요'));
			if(gf_nvl(fileName, '') != ''){
			
				var fileData =[];
				$.each(target, function(idx, item){
					var fileId = $(item).attr('FILE_ID');
					var randomKey = $(item).attr('RANDOM_KEY');
					fileData.push({
						COMM_FILE_ID : fileId,
						RANDOM_KEY : randomKey
					});
				});
				
				gf_ajax({
							MODULE_CODE : pageInfo.moduleCode,
							MENU_URL : pageInfo.menuUrl,
							fileData : JSON.stringify(fileData)
						}
						, null
						, function(data){
							
							var link = '/zipFileDownload?zipFileName=' + encodeURIComponent(fileName);
							link += '&DOWNLOAD_KEY=' + encodeURIComponent(data.result);
							location.href = link;
						}
						, null
						, null
						, '/createDownloadKey');
								
			}
		}
		
	}
	
	$('.context').hide();
}

//파일 미리보기
var f_openPreview = function(){
	
	var searchParam = {
			QUERY_ID : 'my.S_FILE_MANAGE_PREVIEW_LIST',	
	};
	
	if(gf_nvl(folderTree.getActiveNode(), '') != ''){
		searchParam['PARENT_KEY_ID'] = folderTree.getActiveNode().key
	}
	
	gf_ajax(searchParam
	, function(data){
		$('#preview_list div').remove();
		$('#img_viewer img').attr('src', '');
		$('#pdf_viewer iframe').attr('src', '');
		
		return true;
	}
	, function(data){
		
		if(data.result.length > 0){
			$.each(data.result, function(idx, item){
				f_makeFile(item, 'preview_list');
			});
		}
		
		$('#preview_list .file_img').on('click', function(e){
			e.preventDefault();
	        e.stopPropagation();
	        
	        if( !$(e.target).hasClass('drag-highlight') ){
	        	$('#preview_list .file_img').removeClass('drag-highlight');
				$(e.currentTarget).addClass('drag-highlight');
				f_show_fileView(e.currentTarget);
    		}
	        
		});
		
		$( "#modal_preview" ).dialog('open');
		$('.context').hide();
		
	}, null, null, null, false);
	
	
}

var f_show_fileView = function(me){

	var comm_file_id = $(me).attr('file_id');
	var random_key = $(me).attr('random_key');
	var file_ext = $(me).attr('file_extension').toLowerCase();
	
	var moduleCode = pageInfo.moduleCode;
	var menuUrl = pageInfo.menuUrl;
	
	var url = '';
	
	$('#video_viewer').hide();
	$('#pdf_viewer').hide();
	$('#img_viewer').hide();
	
//	var videoTag = $('source[name=videoSource]').parent()[0];
//	videoTag.pause();
//	$('source[name=videoSource]').attr('src', '');
//	videoTag.load();
	
	//pdf
	if(file_ext == 'pdf'){
		$('#pdf_viewer').show();
		
		url = '/resources/plugin/pdfjs/web/viewer.html?file=/preview?' + encodeURIComponent('MODULE_CODE=' + moduleCode + '&MENU_URL=' + menuUrl + '&COMM_FILE_ID=' + comm_file_id + '&RANDOM_KEY=' + random_key);
		$('#pdf_viewer iframe').attr('src', url);

	}
	//엑셀, 워드 등(pdf변환후 미리보기해야하는 경우)
	else if(gv_fileExtension.filter(x=> x.CODE_VALUE.toLowerCase() == file_ext && x.ATTRIBUTE3 == '1').length > 0){
		$('#pdf_viewer').show();
		
		url = '/resources/plugin/pdfjs/web/viewer.html?file=/librePreview?' + encodeURIComponent('MODULE_CODE=' + moduleCode + '&MENU_URL=' + menuUrl + '&COMM_FILE_ID=' + comm_file_id + '&RANDOM_KEY=' + random_key);
		$('#pdf_viewer iframe').attr('src', url);
		
	}
	if(file_ext == 'mp4'){
		$('#video_viewer').show();
		
		
//		$('#video_viewer iframe').attr('src', url);
	}
	//이미지
	else{
		$('#img_viewer').show();

		url = '/preview?' + encodeURI('MODULE_CODE=' + moduleCode + '&MENU_URL=' + menuUrl + '&COMM_FILE_ID=' + comm_file_id + '&RANDOM_KEY=' + random_key);
		$('#img_viewer img').attr('src', url);

	}
	
}