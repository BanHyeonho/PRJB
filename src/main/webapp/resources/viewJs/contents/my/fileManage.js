/**
 * 파일관리
 */
$(document).ready(function() {
	
	f_tree();
	
	//파일 드래그 영역 표시
//	f_set_dragSelect('#fileViewContainer img');
//	
//	$('#treeContainer').attr('ondrop', 'drop(event)')
//					   .attr('ondragover', 'allowDrop(event)');
//	
//	$('.file_img').attr('src', '../img/file_img01.png')
//				  .attr('ondragstart', 'dragStart(event)')
//				  .attr('ondragend', 'dragEnd(event)');
});

var f_dragData = [];

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

var f_tree = function(){
	$("#tree").fancytree({
		extensions: ["dnd", "edit"],
		// titlesTabbable: true,
		source: {
			url: "/plugin/fancytree/ajax-tree-fs.json"
		},
//		autoScroll: true,
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
		},
		activate: function(event, data) {
//			alert("activate " + data.node);
		},
		lazyLoad: function(event, data) {
			data.result = {url: "ajax-sub2.json"}
		}
	}).children('ul').addClass('fancytree-connectors');
}
