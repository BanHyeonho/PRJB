<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ include file="../../include.jsp" %>
<!DOCTYPE html><!--
	Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
	This file is licensed under the terms of the MIT License (see LICENSE.md).
-->

<html lang="en" dir="ltr">
	<head>
		<title>CKEditor 5 DecoupledDocumentEditor build</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="icon" type="image/png" href="https://c.cksource.com/a/1/logos/ckeditor5.png">
		<link rel="stylesheet" type="text/css" href="/plugin/ckeditor/sample/styles.css" />
	</head>
	<body data-editor="DecoupledDocumentEditor" data-collaboration="false" data-revision-history="false">
		<header>
			<div class="centered">
				<h1><a href="https://ckeditor.com/ckeditor-5/" target="_blank" rel="noopener noreferrer"><img src="https://c.cksource.com/a/1/logos/ckeditor5.svg" alt="CKEditor 5 logo">CKEditor 5</a></h1>
				<nav>
					<ul>
						<li><a href="https://ckeditor.com/docs/ckeditor5/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
						<li><a href="https://ckeditor.com/" target="_blank" rel="noopener noreferrer">Website</a></li>
					</ul>
				</nav>
			</div>
		</header>
		<main>
			<div class="message">
				<div class="centered">
					<h2>CKEditor 5 online builder demo - DecoupledDocumentEditor build</h2>
				</div>
			</div>
			<div class="centered">
				<div class="row">
					<div class="document-editor__toolbar"></div>
				</div>
				<div class="row row-editor">
					<div class="editor-container">
						<div class="editor">
							<h2>Bilingual Personality Disorder</h2>
							<figure class="image image-style-side"><img src="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg">
								<figcaption>One language, one person.</figcaption>
							</figure>
							<p>
								This may be the first time you hear about this made-up disorder but
								it actually isn’t so far from the truth. Even the studies that were conducted almost half a century show that
								<strong>the language you speak has more effects on you than you realise</strong>.
							</p>
							<p>
								One of the very first experiments conducted on this topic dates back to 1964.
								<a href="https://www.researchgate.net/publication/9440038_Language_and_TAT_content_in_bilinguals">In the experiment</a>
								designed by linguist Ervin-Tripp who is an authority expert in psycholinguistic and sociolinguistic studies,
								adults who are bilingual in English in French were showed series of pictures and were asked to create 3-minute stories.
								In the end participants emphasized drastically different dynamics for stories in English and French.
							</p>
							<p>
								Another ground-breaking experiment which included bilingual Japanese women married to American men in San Francisco were
								asked to complete sentences. The goal of the experiment was to investigate whether or not human feelings and thoughts
								are expressed differently in <strong>different language mindsets</strong>.
								Here is a sample from the the experiment:
							</p>
							<table>
								<thead>
									<tr>
										<th></th>
										<th>English</th>
										<th>Japanese</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Real friends should</td>
										<td>Be very frank</td>
										<td>Help each other</td>
									</tr>
									<tr>
										<td>I will probably become</td>
										<td>A teacher</td>
										<td>A housewife</td>
									</tr>
									<tr>
										<td>When there is a conflict with family</td>
										<td>I do what I want</td>
										<td>It's a time of great unhappiness</td>
									</tr>
								</tbody>
							</table>
							<p>
								More recent <a href="https://books.google.pl/books?id=1LMhWGHGkRUC">studies</a> show, the language a person speaks affects
								their cognition, behaviour, emotions and hence <strong>their personality</strong>.
								This shouldn’t come as a surprise
								<a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">since we already know</a> that different regions
								of the brain become more active depending on the person’s activity at hand. Since structure, information and especially
								<strong>the culture</strong> of languages varies substantially and the language a person speaks is an essential element of daily life.
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
		<footer>
			<p><a href="https://ckeditor.com/ckeditor-5/" target="_blank" rel="noopener">CKEditor 5</a>
				– Rich text editor of tomorrow, available today
			</p>
			<p>Copyright © 2003-2021,
				<a href="https://cksource.com/" target="_blank" rel="noopener">CKSource</a>
				– Frederico Knabben. All rights reserved.
			</p>
		</footer>
		<script src="/plugin/ckeditor/build/ckeditor.js?v=${pb:jsNow()}"></script>
		<script>DecoupledDocumentEditor
				.create( document.querySelector( '.editor' ), {
					
					licenseKey: '',
					
					
					
				} )
				.then( editor => {
					window.editor = editor;
			
					// Set a custom container for the toolbar.
					document.querySelector( '.document-editor__toolbar' ).appendChild( editor.ui.view.toolbar.element );
					document.querySelector( '.ck-toolbar' ).classList.add( 'ck-reset_all' );
				} )
				.catch( error => {
					console.error( 'Oops, something went wrong!' );
					console.error( 'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:' );
					console.warn( 'Build id: d3nk80u00yoj-u9490jx48w7r' );
					console.error( error );
				} );
		</script>
	</body>
</html>