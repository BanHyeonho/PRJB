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
	
	//폴더추가
	$('#newFolderBtn').on('click', f_newFolder);
	$('#folderDeleteBtn').on('click', f_folderDelete);
	
	
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
	
//	folderTree.reload({'url' : '/plugin/fancytree/ajax-tree-fs.json'})
//	gf_ajax({
//	  			QUERY_ID : 'st.S_ST_VIDEO_VIEW_FILE',
////	  			p_loginId : $('#searchParam1').val()
//			}, function(){
//				gf_gridClear(masterGrid);
//			}
//			, function(data){
//				
//				gf_gridCallback('masterGrid', data);
//				
//			});
}
var f_searchTree = function(){
	var result = [];
	
	gf_ajax({
			QUERY_ID : 'my.S_FILE_MANAGE_TREE',
	}, function(){
		return true;
	}
	, function(data){
		
		$.each(data.result, function(idx, item){
		
			var myFileManageId = item.MY_FILE_MANAGE_ID;
			var parentKeyId = gf_nvl(item.PARENT_KEY_ID, '');
			var keyId = item.KEY_ID;
			var title = item.TITLE;
			var folder = (item.TYPE_CODE == 'FOLDER' ? true : false);
			
			var resultItem = {
					myFileManageId : myFileManageId,
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
			
//			console.log("activate " + data.node);
			
			var text = data.node.title;
			var parent = data.node.parent;
			
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
			
			$('#current-path').val(text);
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

	    	var queryId = '';
	    	var title = data.childNode.title;
    		var key_id = data.childNode.key;
    		var parent_id = data.node.key;
    		parent_id = (parent_id == 'root_1' ? null : parent_id);
    		
	    	//삭제
	    	if(data.operation == 'remove'){
	    		queryId = 'com.D_COMM_QUERY';
	    	}
	    	//추가
	    	else if(data.operation == 'add'){
	    		queryId = 'com.I_COMM_QUERY';
	    	}
	    	//이동, 이름변경(변경)
	    	else if(data.operation == 'move'
	    		 || data.operation == 'rename'
    		){
	    		queryId = 'my.U_FILE_MANAGE_TREE';
	    	}
	    	
	    	console.log('title', title);
    		console.log('key_id', key_id);
    		console.log('parent_id', parent_id);
    		
    		var fData = new FormData();
    		fData.set('QUERY_ID', queryId);
    		fData.set('TABLE_NAME', 'MY_FILE_MANAGE');
    		
    		if(gf_nvl(data.childNode.data.myFileManageId, '') != ''){
    			fData.set('MY_FILE_MANAGE_ID', data.childNode.data.myFileManageId);	
    		}
    		
    		fData.set('SEQ', data.node.getChildren().indexOf(data.childNode) +1);
    		fData.set('KEY_ID', key_id);
    		fData.set('TITLE', title);
    		fData.set('TYPE_CODE', 'FOLDER');
    		if(parent_id != null){
    			fData.set('PARENT_KEY_ID', parent_id);	
    		}
    		fData.set('SHOW_YN', '1');
    		
    		gf_ajax(fData
	    	, function(){
	    		return (queryId == '' ? false : true);
	    	}
			, function(data){
				
			}, null, null, null, false);
	    	
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
		folderTree.getActiveNode().remove();
	}
	$('.context').hide();
}