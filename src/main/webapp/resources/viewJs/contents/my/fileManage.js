/**
 * 파일관리
 */
$(document).ready(function() {
	
	
	//파일 드래그 영역 표시
	f_set_dragSelect('#fileViewContainer img');
	
	$('#treeContainer').attr('ondrop', 'drop(event)')
					   .attr('ondragover', 'allowDrop(event)');
	
	$('.file_img').attr('src', '../img/file_img01.png')
				  .attr('ondragstart', 'dragStart(event)')
				  .attr('ondragend', 'dragEnd(event)');
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
