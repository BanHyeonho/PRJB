<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ include file="include.jsp" %>
<html>
<head>
	<meta charset="UTF-8">
	<title>${pb:msg(pageContext.request, "signUp")}</title>
	<script type="text/javascript">
	$(document).ready(function () {
		
		
		$('#goBackBtn').on('click', goBack);
		$('#registBtn').on('click', regist);
	});
	var goBack = function(){
		if(confirm('${pb:msg(pageContext.request, "confirmGoBack")}')){
			location.replace('/');	
		}
	}
	
	var regist = function(){
		
		var fData = new FormData($('#registForm')[0]);
		fData.set('PWD', commSecurePw( $('#registForm [name=PWD]').val() , '${publicKey}' ));
		commAjax(fData, function(){
			
			var rs = chkRequire(["registForm"]);
			
			for (var i = 0; i < rs.tags.length; i++) {
				toast(msg('${pb:msg(pageContext.request, "requireEmpty")}', {
					param : $(rs.tags[i]).attr('placeholder')
				}), 'info');
			}
			return rs.result;
			
		}, function(data){
			
			if(data.result == 'success'){
				location.replace('/');
			}
			//아이디중복
			else if( data.result == 'duplicatedId'){
				toast('${pb:msg(pageContext.request, "duplicatedId")}', 'info');
				$('#registForm [name=LOGIN_ID]').focus();
			}
			
		}, null, null, '/registAction');
	}
	
	</script>
</head>
<body>
	<div class="background-img">
		<div class="center-table">
			<form action="#" id='registForm'>
				<input type="text" class="input-text font-size-36 mg-bt-15 input-green" autofocus tabindex="1" name="LOGIN_ID" require="true" placeholder='${pb:msg(pageContext.request, "loginId")}' >
				<input type="password" class="input-text font-size-36 mg-bt-15 input-green" tabindex="2" name="PWD" require="true" placeholder='${pb:msg(pageContext.request, "password")}' >
				<input type="text" class="input-text font-size-36 mg-bt-15 input-green" data-enter='4' tabindex="3" name="USER_NM" require="true" placeholder='${pb:msg(pageContext.request, "name")}' >
				<button type="button" class="font-size-24 fl-right mg-lt-15 btn btn-green" tabindex="5" id='goBackBtn'>${pb:msg(pageContext.request, "goBack")}</button>
				<button type="button" class="font-size-24 fl-right btn btn-green" tabindex="4" id='registBtn'>${pb:msg(pageContext.request, "join")}</button>
			</form>
		</div>
	</div>
</body>
</html>
