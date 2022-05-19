/**
 * 개인정보수정 
 */
let currentType;
$(document).ready(function() {
	$('.menu-div').on('click', f_tabClick);
	$('#removePwd2').on('click', f_removePwd2);
	
	
	$('.menu-div:eq(0)').trigger('click');
});

var f_tabClick = function(e){
	e.preventDefault();
    e.stopPropagation();
    
    if(currentType == $(e.currentTarget).attr('id')){
    	return;
    }
    
	$('.selected-menu').removeClass('selected-menu');
	$('.content-area').hide();
	$(e.currentTarget).addClass('selected-menu');
	$('#' + $(e.currentTarget).attr('id') + 'Container').show();
	
	f_search();
}
var f_removePwd2 = function(){
	if(confirm(gf_mlg('2차_비밀번호를_삭제_하시겠습니까'))){
		
		gf_ajax({
			QUERY_ID : 'com.U_REMOVE_PWD2'
		}
		, null
		, function(data){
			gf_toast(gf_mlg('2차_비밀번호가_삭제_되었습니다'), 'success');
			
			f_searchPrivacy('removePwd2');			
		});
		
	}
}
/*****************************************************************************************************************************************************************
 * 
 * 조회
 * 
 *****************************************************************************************************************************************************************/
var f_search = function(){
	var type =  $('.selected-menu').attr('id');
	currentType = type;
	
	switch (currentType) {
	case 'privacy':
		f_searchPrivacy('search');
		break;
	case 'social':
		f_searchSocial();
		break;
	}
	
}
var f_searchPrivacy = function(type){
	gf_ajax({
				QUERY_ID : 'my.S_MY_PRIVACY'
			}
			, null
			, function(data){
				if(type == 'search'){
					f_clear();
					gf_setFormData(data.result[0]);
				}
				else if(type == 'removePwd2'){
					$('#MODIFY_DATE').text(data.result[0]['MODIFY_DATE']);
				}				
			});
}

var f_searchSocial = function(){
	
}

var f_clear = function(){
	$('#privacyContainer input').val('');
}
/*****************************************************************************************************************************************************************
 * 
 * 저장
 * 
 *****************************************************************************************************************************************************************/
var f_save = function(){
	switch (currentType) {
	case 'privacy':
		f_savePrivacy();
		break;
	case 'social':
		f_saveSocial();
		break;
	}
}
var f_savePrivacy = function(){
	var fData = new FormData();
	gf_ajax(fData
			, function(){
		
				return true;
			}
			, function(data){
				f_search();
			}, null, null, '/chgPrivacy');
	
}
var f_saveSocial = function(){
	
}