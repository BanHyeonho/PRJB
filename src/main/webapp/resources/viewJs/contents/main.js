/**
 * 로그인후 첫화면
 */
$(document).ready(function () {
		  	
});

var f_test = function(){
	$.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/test",
        data: new FormData(),
        async: true,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 1800000,   //30분
        success: function(data){
            console.log('완료');
        }
    });
}