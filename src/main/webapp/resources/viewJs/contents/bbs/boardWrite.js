/**
 * 게시글쓰기
 */
var attachedFiles = [];
$(document).ready(function() {
    
	$('#attachedFileBtn').on('click', function(){
		$('#attachedFile').click();
	});
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
    
    f_search();
});
var fileAttachment = function (dragDrop) {

    var file_names = dragDrop ? dragDrop : $("#attachedFile").prop("files");

    for (var i = 0; i < file_names.length; i++) {

        (function (file) {

            setTimeout(function () {

                //파일확장자
                var fileExt = file.name.substring(file.name.lastIndexOf('.'), file.name.length).toLowerCase();
                
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
                //업로드 불가 파일확장자
//                else if(fileExt == '.exe'){
//                    return false;
//                }
                else{
                	var fileId = new Date().getTime();
                	var fSize = gf_getFileSize(file.size);    

                    file.id = fileId;

                    var tr = $('<tr>');
                    var fileNm = $('<td class="pd-bt-default pd-rt-default">').text(file.name);
                    var fileSize = $('<td class="pd-rt-default">').text('(' + fSize + ')');
                    var fileDel = $('<td>').html( $('<i class="fi fi-rr-Cross-small" style="cursor:pointer;" onclick="fileDelete(this,' + file.id + ');" ></i>') );
                    tr.append(fileNm).append(fileSize).append(fileDel);
                    
                    $('#attachedFileTable tbody').append(tr);

                    attachedFiles.push(file);
                }

            }, 1);

        }(file_names[i]));

    }

}
//파일삭제
var fileDelete = function (me, id) {

    $(me).closest('tr').remove();
    attachedFiles = attachedFiles.filter((x, idx, array) => {
        return x.id != id
    });

}

var f_search = function(){
	
	var fData = new FormData();
	fData.set('QUERY_ID', 'com.S_COMM_MENU');
	gf_ajax( fData
			, function(){
				
			}
			, function(data){
				
				
			});
}
  	
var f_save = function(){
		
	var fData = new FormData();
	
	gf_ajax( fData
			, function(){
				
			}
			, function(data){
				
				if(data.result == 'success'){
				
				}
			}
			, null
			, null
			, '/save');
}