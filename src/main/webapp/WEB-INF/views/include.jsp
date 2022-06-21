<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib uri="/resources/tld/PRJBTagLib.tld" prefix="pb" %>

<!-- Jquery -->
<script src="/script/jquery-3.6.0.min.js?v=${pb:jsNow()}"></script>
<!-- Jquery-UI -->
<script src="/plugin/jquery-ui-1.13.0/jquery-ui.js?v=${pb:jsNow()}"></script>
<link  href="/plugin/jquery-ui-1.13.0/jquery-ui.css?v=${pb:jsNow()}" rel="stylesheet" />

<!-- SlickGrid -->
<!-- 그리드설정 -->
<c:if test="${gridData.size() > 0}">
	<script src="/plugin/slickGrid/lib/jquery.event.drag-2.3.0.js?v=${pb:jsNow()}"></script>
	<%-- <script src="/plugin/slickGrid/lib/jquery.event.drop-2.3.0.js?v=${pb:jsNow()}"></script> --%>
	<script src="/plugin/slickGrid/slick.core.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/slick.dataview.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/slick.editors.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/slick.formatters.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/slick.grid.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/slick.groupitemmetadataprovider.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/slick.remotemodel.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/lib/select2.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/plugins/slick.checkboxselectcolumn.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/plugins/slick.rowselectionmodel.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/plugins/slick.autotooltips.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/plugins/slick.cellrangedecorator.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/plugins/slick.cellrangeselector.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/plugins/slick.cellexternalcopymanager.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/plugins/slick.cellselectionmodel.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/plugins/slick.resizer.js?v=${pb:jsNow()}"></script>
	<link  href="/plugin/slickGrid/slick.grid.css?v=${pb:jsNow()}" rel="stylesheet" />
	<link  href="/plugin/slickGrid/css/select2.css?v=${pb:jsNow()}" rel="stylesheet" />
</c:if>

<!-- 암호화 -->
<script src="/script/jsencrypt.min.js?v=${pb:jsNow()}"></script>

<!-- Jquery.toast -->
<script src="/plugin/jquery-toast/jquery.toast.js?v=${pb:jsNow()}"></script>
<link  href="/plugin/jquery-toast/jquery.toast.css?v=${pb:jsNow()}" rel="stylesheet" />

<!-- 아이콘 -->
<link rel="stylesheet" type="text/css" href="/icon/flaticon/css/uicons-regular-rounded.css" />

<!-- 사용자정의 -->
<link  href="/css/reset.css?v=${pb:jsNow()}" rel="stylesheet" />
<link  href="/css/common.css?v=${pb:jsNow()}" rel="stylesheet" />
<link  href="/css/margin.css?v=${pb:jsNow()}" rel="stylesheet" />
<link  href="/css/padding.css?v=${pb:jsNow()}" rel="stylesheet" />
<link  href="/css/div.css?v=${pb:jsNow()}" rel="stylesheet" />
<link  href="/css/panel.css?v=${pb:jsNow()}" rel="stylesheet" />
<link  href="/css/scroll.css?v=${pb:jsNow()}" rel="stylesheet" />
<link  href="/css/common-laptop.css?v=${pb:jsNow()}" rel="stylesheet" />
<script src="/script/common.js?v=${pb:jsNow()}"></script>

<!-- 다국어/버튼 , 사용자id -->
<script type="text/javascript">
const mlg = ${MLG};
const btnList = JSON.parse(gf_nvl('${btnList}', '[]'));
const gv_commUserId = '${sessionScope.COMM_USER_ID}';
</script>

<!-- 그리드설정 -->
<c:if test="${gridData.size() > 0}">

	<!-- 슬릭그리드엑셀 -->
	<script src="/plugin/slickGrid/plugins/require.js?v=${pb:jsNow()}"></script>
	<script src="/plugin/slickGrid/plugins/underscore.js?v=${pb:jsNow()}"></script>
	<script src="/script/prjb.slickgrid.export.excel.js?v=${pb:jsNow()}"></script>
	<script type="text/javascript">
	requirejs.config({
		baseUrl: '/plugin/slickGrid/plugins/'  //give the location of the folder which contains require, excel-builder, etc
	});
	</script>

	<%@ include file="./gridData.jsp"%>
</c:if>


<!-- 페이지변수(설정값) 불변 -->
<script type="text/javascript">
const pageParam = JSON.parse(gf_nvl('${pageParam}', '{}'));
</script>
<!-- 메뉴호출시 전송한변수 -->
<script type="text/javascript">
const menuParam = JSON.parse(gf_nvl('${menuParam}', '{}'));
</script>
<!-- 글로벌변수 -->
<script src="/viewJs/variable.js?v=${pb:jsNow()}"></script>
<!-- 공통 document ready -->
<script src="/viewJs/commonReady.js?v=${pb:jsNow()}"></script>
<%-- 각 화면 스크립트 --%>
<script src="${jsLink}?v=${pb:jsNow()}"></script>