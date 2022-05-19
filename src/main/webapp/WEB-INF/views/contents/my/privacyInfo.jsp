<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pb:msg(pageContext.request, "개인정보변경")}</title>
<meta name="google" content="notranslate">
<style type="text/css">

.menu-div{
	border-bottom: 1px solid #ddd;
	cursor: pointer;
}
.menu-text{
	font-size: 24px;
}
</style>
</head>
<body>
	<div id='content' class="pd-pl-default">
		<div id="content-header-1" class="content-panel pd-pl-default no-mg">
			<span id="content-title"></span>
			<div class="btn-area" id='BTN_AREA1'>
			</div>
		</div>
		
		<div id='subContainer' class='content-panel mg-pl-default no-mg-lt pd-pl-default ht-pl-1-1 panel-2'>
			<div class="menu-div pd-default" id="privacy">
				<span class="menu-text">나의 정보</span>
			</div>
			<div class="menu-div pd-default" id="social">
				<span class="menu-text">소셜 로그인</span>
			</div>
		</div>
		<div id='privacyContainer' style="display: none;" class='content-area content-panel mg-pl-tp-default pd-pl-default ht-pl-1-1 panel-8-1'>
			<table>
				<tbody>
					<tr style="border-bottom: 1px solid #ddd;">
						<td style="width: 15%; vertical-align: top;">
							<div class="pd-default" style="position: relative; height: 230px; border: 1px solid #ddd; display: flex; justify-content: center; align-items: center;">
								<img src="../img/default_profile.png" style="max-width: 100%; max-height:100%;">
								<i class="fi fi-rr-camera" style="position: absolute; left: 0; bottom: 0; font-size: 35px; border: 1px solid #ddd; cursor: pointer;"></i>
							</div>
						</td>
						<td style="width: 20%; vertical-align: top;">
							<div class="div-10 pd-lt-default">
								<label class="form">${pb:msg(pageContext.request, "로그인ID")}</label>
								<input class="form form-text mg-tp-default" type="text" id="LOGIN_ID" readonly>
							</div>
							<div class="div-10 pd-lt-default pd-tp-default">
								<label class="form">*${pb:msg(pageContext.request, "사용자명")}</label>
								<input class="form form-text mg-tp-default" type="text" tabindex="2" id="USER_NAME">
							</div>
							<div class="div-10 pd-lt-default pd-tp-default">
								<label class="form">*${pb:msg(pageContext.request, "이메일")}</label>
								<input class="form form-text mg-tp-default" type="text" tabindex="3" id="EMAIL">
							</div>
							<div class="div-10 pd-lt-default pd-tp-default pd-bt-default">
								<label class="form">${pb:msg(pageContext.request, "닉네임")}</label>
								<input class="form form-text mg-tp-default" type="text" tabindex="4" id="NICKNAME">
							</div>
						</td>
						<td style="width: 20%; vertical-align: top;">
							<div class="div-10 pd-lt-default">
								<label class="form">${pb:msg(pageContext.request, "현재_비밀번호")}</label>
								<input class="form form-text mg-tp-default" type="password" tabindex="5" id="OLD_PWD" >
							</div>
							<div class="div-10 pd-lt-default pd-tp-default">
								<label class="form">*${pb:msg(pageContext.request, "새_비밀번호")}</label>
								<input class="form form-text mg-tp-default" type="password" tabindex="6" id="NEW_PWD">
							</div>
							<div class="div-10 pd-lt-default pd-tp-default">
								<label class="form">*${pb:msg(pageContext.request, "비밀번호_확인")}</label>
								<input class="form form-text mg-tp-default" type="password" tabindex="7" id="NEW_PWD_CHK">
							</div>
							<div class="div-10 pd-lt-default pd-tp-default pd-bt-default">
								<label class="form">${pb:msg(pageContext.request, "2차_비밀번호")}</label>
								<input class="form form-text mg-tp-default" style="width: 70%;" type="password" tabindex="8" id="PWD2">
								<button type="button" class="btn fl-right mg-tp-default" style="min-height: 28px;" id='removePwd2'>${pb:msg(pageContext.request, "삭제")}</button>
							</div>
							
						</td>
						<td style="width: 60%; vertical-align: top;">
							<div class="div-10 pd-lt-default">
								<label class="form">${pb:msg(pageContext.request, "가입일")}</label>
								<span class="form mg-tp-default" id="REGIST_DATE"></span>
							</div>
							<div class="div-10 pd-lt-default pd-tp-default">
								<label class="form">${pb:msg(pageContext.request, "수정일")}</label>
								<span class="form mg-tp-default" id="MODIFY_DATE"></span>
							</div>
						</td>
					</tr>
				</tbody>
				
			</table>
			
		</div>
		<div id='socialContainer' style="display: none;" class='content-area content-panel mg-pl-tp-default pd-pl-default ht-pl-1-1 panel-8-1'>
			소셜
		</div>
	</div>
</body>
</html>