/**
 * 파일관리
 */
var f_dragData = [];

var folderTree; 

$(document).ready(function() {
	
	
	folderTree = f_tree('treeContainer');
	
	
	//파일 드래그 영역 표시
	f_set_dragSelect('#fileViewContainer img');
	
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
	
	$('.file_img').attr('src', '../img/file_img01.png')
				  .attr('ondragstart', 'dragStart(event)')
				  .attr('ondragend', 'dragEnd(event)');
	
	//트리 컨텍스트메뉴
	$('#newFolderBtn').on('click', f_newFolder);
	$('#folderDeleteBtn').on('click', f_folderDelete);
	$('#showFolderBtn').on('click', {param1 : 'Y'}, f_showFolder);
	$('#hideFolderBtn').on('click', {param1 : 'N'}, f_showFolder);
	$('#showFolderViewBtn').on('click', f_showFolderView);
	
	
});

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
	
var f_search = function(){
	
	f_treeReload();
	
}
var f_searchTree = function(p_type){
	var result = [];
	
	var searchParam = {
		QUERY_ID : 'my.S_FILE_MANAGE_TREE',
	};
	
	if(gf_nvl(p_type, '') == 'ALL'){
		searchParam['SHOW_YN'] = 'ALL'
	}
	
	if( typeof folderTree == 'object' ){
		folderTree.clear();
	}
	
	gf_ajax(searchParam
	, function(){
		return true;
	}
	, function(data){
		
		$.each(data.result, function(idx, item){
		
			var myFileManageId = item.MY_FILE_MANAGE_ID;
			var showYn = item.SHOW_YN;
			var parentKeyId = gf_nvl(item.PARENT_KEY_ID, '');
			var keyId = item.KEY_ID;
			var title = item.TITLE;
			var folder = (item.TYPE_CODE == 'FOLDER' ? true : false);
			
			var resultItem = {
//					myFileManageId : myFileManageId,
					showYn : showYn,
					expanded : true,
					folder : folder,
					title : title,
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
		
		
	}, null, null, null, false);
	
	return result;
}

var f_tree = function(containerId){
	var result;
	var clearYn = false;
	$("#" + containerId).fancytree({
		extensions: ["dnd", "edit"],
		source: function(){
			var data = f_searchTree();
			
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
		},		
		edit: { // title 수정
	      triggerStart: ["f2", "dblclick", "mac+enter"], // 수정전환 키 조합
	      close: function(event, data) {
	    	  //수정완료
//	    	  if( data.save && data.node.title == data.orgTitle ){
//	    		  
//	    	  }
	      }
	    },
	    modifyChild : function(event, data){
//	    	console.log('data.operation', data.operation);
	    	
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

var f_newFolder = function(e){
	var currNode = folderTree.getActiveNode();
	if( currNode == null){
		currNode = folderTree.getRootNode();
	}
	var result = currNode.addChildren( {title : gf_mlg('새폴더'), folder : true} );
	folderTree.activateKey(result.key);
	$('.context').hide();
}
var f_folderDelete = function(e){
	if(folderTree.getActiveNode() != null){
		f_modifyChildAction('remove', folderTree.getActiveNode());
		folderTree.getActiveNode().remove();
	}
	$('.context').hide();
	folderTree._triggerTreeEvent('activate');
}

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

var f_showFolder = function(e){
	if(folderTree.getActiveNode() != null){
		
		folderTree.getActiveNode().data.showYn = (e.data.param1 == 'N' ? '0' : '1');
		
		f_modifyChildAction('rename', folderTree.getActiveNode());
	}
	$('.context').hide();
//	folderTree._triggerTreeEvent('activate');	//노드없이 활성화트리거
	folderTree._triggerNodeEvent('activate', folderTree.getActiveNode());	//해당노드를 활성화트리거
}

var f_showFolderView = function(){
	
	f_treeReload('ALL');
	$('.context').hide();
		
}

var f_treeReload = function(p_type){
	
	var clearYn = false;
	folderTree.reload(function(){
		var data = f_searchTree(p_type);
		
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