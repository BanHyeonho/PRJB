<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<script type="text/javascript">
var gridList = [];
<c:forEach var="item" items="${gridContextData}">
	var ${item.get("GRID_NAME")}Context = '${item.get("CONTEXT_MENU")}'.split(',');
</c:forEach>

<c:forEach var="detail" items="${gridData}">
	<c:forEach var="item" items="${detail}" varStatus="status">
		<c:choose>
			<c:when test="${status.first}">
				gridList.push('${item.get("GRID_NAME")}');
				var ${item.get("GRID_NAME")};
				var ${item.get("GRID_NAME")}DataDel = [];
				var ${item.get("GRID_NAME")}Filters = {};
				var ${item.get("GRID_NAME")}Idx = 0;
				
				<c:if test="${item.get(\"EDITOR\") == 'Select2Editor'}">
					<c:set var="comboName" value="${item.get(\"GRID_NAME\")}.${item.get(\"FIELD\")}_SOURCE" />
					var ${item.get("GRID_NAME")}_${item.get("FIELD")}_SOURCE = {
						<c:forEach var="combo" items="${requestScope[comboName]}" varStatus="status">
							<c:choose>
								<c:when test="${status.first}">
									'${combo.get("CODE_VALUE")}' : '${combo.get("CODE_NAME")}'
								</c:when>
								<c:otherwise>
								    ,'${combo.get("CODE_VALUE")}' : '${combo.get("CODE_NAME")}' 		
								</c:otherwise>
						    </c:choose>
						</c:forEach>
					};
				</c:if>
				var ${item.get("GRID_NAME")}Columns = [{
					 id: '${item.get("FIELD")}'
					,align:'${item.get("TEXT_ALIGN")}'
					,name: '${item.get("FIELD_NAME")}'
					,field: '${item.get("FIELD")}'
					<c:if test="${item.get(\"FOOTER\") != null}">
					,footer: '${item.get("FOOTER")}'
					</c:if>
					<c:if test="${item.get(\"TREE_YN\") == '1'}">
					,treeYn:'1'
					</c:if>
					<c:if test="${item.get(\"SORT_YN\") == '1'}">
					,sortable: true
					</c:if>
					<c:if test="${item.get(\"ATTRIBUTE2\") == '1'}">
					,checkBoxYn:'1'
					</c:if>
					<c:if test="${item.get(\"EDITOR\") != null}">
					,editor: ${item.get("EDITOR")}
					</c:if>
					<c:if test="${item.get(\"EDITOR\") == 'Select2Editor'}">
					,dataSource: ${item.get("GRID_NAME")}_${item.get("FIELD")}_SOURCE
					</c:if>
					<c:if test="${item.get(\"FILTER_YN\") != '1'}">
					,filterYn: '0'
					</c:if>
					<c:if test="${item.get(\"PASTE_YN\") == '1'}">
					,pasteYn: '1'
					</c:if>
					<c:choose>
						<c:when test="${item.get(\"HIDE_YN\") == '1'}">
						,cssClass: "grid_cell_hidden"
						,headerCssClass: "grid_cell_hidden"
						,width: Number('0')
						</c:when>
						<c:otherwise>
						,width: Number('${item.get("WIDTH")}')
						</c:otherwise>
					</c:choose>
					<c:if test="${item.get(\"ATTRIBUTE1\") != null}">
					,excelFileNm: '${item.get("ATTRIBUTE1")}'
					</c:if>
					,formatter: gf_slickGridFormatter
				}];
			</c:when>
			<c:otherwise>
				<c:if test="${item.get(\"EDITOR\") == 'Select2Editor'}">
					<c:set var="comboName" value="${item.get(\"GRID_NAME\")}.${item.get(\"FIELD\")}_SOURCE" />
					var ${item.get("GRID_NAME")}_${item.get("FIELD")}_SOURCE = {
						<c:forEach var="combo" items="${requestScope[comboName]}" varStatus="status">
							<c:choose>
								<c:when test="${status.first}">
									'${combo.get("CODE_VALUE")}' : '${combo.get("CODE_NAME")}'
								</c:when>
								<c:otherwise>
								    ,'${combo.get("CODE_VALUE")}' : '${combo.get("CODE_NAME")}' 		
								</c:otherwise>
						    </c:choose>
						</c:forEach>
					};
				</c:if>
				${item.get("GRID_NAME")}Columns.push({
					 id: '${item.get("FIELD")}'
							,align:'${item.get("TEXT_ALIGN")}'
							,name: '${item.get("FIELD_NAME")}'
							,field: '${item.get("FIELD")}'
							<c:if test="${item.get(\"FOOTER\") != null}">
							,footer: '${item.get("FOOTER")}'
							</c:if>
							<c:if test="${item.get(\"SORT_YN\") == '1'}">
							,sortable: true
							</c:if>
							<c:if test="${item.get(\"EDITOR\") != null}">
							,editor: ${item.get("EDITOR")}
							</c:if>
							<c:if test="${item.get(\"EDITOR\") == 'Select2Editor'}">
							,dataSource: ${item.get("GRID_NAME")}_${item.get("FIELD")}_SOURCE
							</c:if>
							<c:if test="${item.get(\"PASTE_YN\") == '1'}">
							,pasteYn: '1'
							</c:if>
							<c:choose>
								<c:when test="${item.get(\"HIDE_YN\") == '1'}">
								,cssClass: "grid_cell_hidden"
								,headerCssClass: "grid_cell_hidden"
								,width: Number('0')
								</c:when>
								<c:otherwise>
								,width: Number('${item.get("WIDTH")}')
								</c:otherwise>
							</c:choose>
							<c:if test="${item.get(\"ATTRIBUTE1\") != null}">
							,excelFileNm: '${item.get("ATTRIBUTE1")}'
							</c:if>
							,formatter: gf_slickGridFormatter
						});
			</c:otherwise>
		</c:choose>
	</c:forEach>
</c:forEach>

var gridEventIgnore = false;
</script>