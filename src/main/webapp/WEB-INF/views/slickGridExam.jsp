<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ include file="include.jsp" %>
<html>
<!-- 슬릭그리드 참고용 화면 -->
<head>
	<style>
	    body {
	      font-family: Helvetica, arial, freesans, clean, sans-serif;
	      font-size: 15px;
	    }
	
	    a {
	      color: #4183c4;
	      text-decoration: none;
	    }
	
	    a:hover {
	      text-decoration: underline;
	    }
	
	    li {
	      margin-bottom: 15px;
	    }
	</style>
	<meta charset="UTF-8">
	<title>SlickGridExam</title>
	<script type="text/javascript">
	$(document).ready(function () {
		$('#resultFrame').css('height', $('#examList').parent().css('height'));
		
		$('#examList li').on('click',function(e){
			e.preventDefault();
			
			$('#resultFrame').attr('src', '/plugin/slickGrid/examples/' + $(e.target).attr('href'));
			
		});
		
		$(window).resize(function() {
			$('#resultFrame').css('height', $('#examList').parent().css('height'));
	    });
	});
	</script>
</head>
<body>
	<h1>SlickGrid Examples</h1>
	<div style="display: inline-block;width: 30%;overflow-y: scroll;">
	    <ul style="height: 86%;" id='examList'>
	      <li><a href="example1-simple.html">Basic use with minimal configuration</a></li>
	      <li><a href="example2-formatters.html">Adding some formatting</a></li>
	      <li><a href="example7-events.html">Handling events</a></li>
	      <li><a href="example14-highlighting.html">Highlighting and flashing cells</a></li>
	      <li><a href="example3-editing.html">Making it editable</a></li>
	      <li><a href="example3a-compound-editors.html">Writing compound editors</a></li>
	      <li><a href="example3b-editing-with-undo.html">Implementing Undo</a></li>
	      <li><a href="example-composite-editor-item-details.html">Using a CompositeEditor to implement detached item edit form</a></li>
	      <li>(most comprehensive) <a href="example4-model.html">Using a filtered data view to drive the grid</a></li>
	      <li><a href="example5-collapsing.html">Adding tree functionality (expand/collapse) to the grid</a></li>
	      <li><a href="example6-ajax-loading.html"><span class="caps">AJAX</span>-loading data with search</a></li>
	      <li><a href="example8-alternative-display.html">Using pre-compiled micro-templates to render cells</a></li>
	      <li><a href="example9-row-reordering.html">Row selection &amp; reordering</a></li>
	      <li><a href="example10-async-post-render.html">Using background post-rendering to add graphs</a></li>
	      <li><a href="example11-autoheight.html" title="autoHeight">No vertical scrolling</a></li>
	      <li><a href="example12-fillbrowser.html">Filling the whole window</a></li>
	      <li><a href="example13-getItem-sorting.html">Sorting by an index, getItem method</a></li>
	      <li><a href="example-header-row.html">Using fixed header row for quick filters</a></li>
	      <li><a href="example-checkbox-row-select.html">Plugin:  Checkbox row selectors with CheckboxSelectColumn plugin</a></li>
	      <li><a href="example-spreadsheet.html">Spreadsheet: cell range selection, copy’n’paste and Excel-style formula editor</a></li>
	      <li><a href="example-grouping.html">Interactive grouping and aggregates</a>.</li>
	      <li><a href="example-colspan.html">Colspan</a></li>
	      <li><a href="example-optimizing-dataview.html">Optimizing DataView for 500’000 rows</a></li>
	      <li><a href="example-explicit-initialization.html">Explicit initialization</a></li>
	      <li><a href="example-multi-column-sort.html">Multi-column sorting</a></li>
	      <li><a href="example-custom-column-value-extractor.html">Using dataItemColumnValueExtractor option to specify a custom column value extractor</a></li>
	      <li><a href="example-plugin-headerbuttons.html">Plugin: Column header buttons</a></li>
	      <li><a href="example-plugin-headermenu.html">Plugin: Column header menu</a></li>
	      <li><a href="example-autotooltips.html">Plugin: Auto tooltips</a></li>
		</ul>
	</div>
	<div style="display: inline-block;width: 69%; position: absolute;">
		<iframe src="" style="width: 100%;" id='resultFrame'>
		</iframe>
	</div>
</body>
</html>
