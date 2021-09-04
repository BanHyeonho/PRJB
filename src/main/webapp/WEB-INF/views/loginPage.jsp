<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="include.jsp" %>
<html>
<head>
	<meta charset="UTF-8">
	<title>${pb:msg(pageContext.request, "login")}</title>
	<script type="text/javascript">
	$(document).ready(function () {
		
		$('#loginBtn').on('click', login);
		$('#registBtn').on('click', regist);
	});
	
	var login = function(){
		
		var fData = new FormData($('#loginForm')[0]);
		fData.set('PWD', commSecurePw( $('#loginForm [name=PWD]').val() , '${publicKey}' ));
		
		commAjax( fData, function(){
			
			var rs = chkRequire(["loginForm"]);
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
			//아이디, 패스워드 오류
			else if( data.result == 'chkIdPwd'){
				toast('${pb:msg(pageContext.request, "chkIdPwd")}', 'info');
				$('#loginForm [name=pwd]').val('');
				$('#loginForm [name=pwd]').focus();
			}
		}, null, null, '/loginAction');
	}
	
	var regist = function(){
		location.replace('/registPage');
	}
	
	</script>
</head>
<body>
	<div class="background-img">
		<div class="center-table">
			<form action="#" id='loginForm'>
				<input type="text" class="input-text font-size-36 mg-bt-15 input-green" autofocus tabindex="1" name="LOGIN_ID" require="true" placeholder='${pb:msg(pageContext.request, "loginId")}'>
				<input type="password" class="input-text font-size-36 mg-bt-15 input-green" data-enter='3' tabindex="2" name="PWD" require="true" placeholder='${pb:msg(pageContext.request, "password")}' >
				<button type="button" class="font-size-24 fl-right mg-lt-15 btn btn-green" tabindex="3" id='loginBtn'>${pb:msg(pageContext.request, "login")}</button>
				<button type="button" class="font-size-24 fl-right btn btn-green" tabindex="4" id='registBtn'>${pb:msg(pageContext.request, "signUp")}</button>
			</form>
		</div>
	</div>
</body>
</html>
