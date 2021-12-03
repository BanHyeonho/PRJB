<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib uri="/resources/tld/PRJBTagLib.tld" prefix="pb" %>
<!DOCTYPE html>
<html oncontextmenu='return false;' >
<head>
<link  href="/css/scroll.css?v=${pb:jsNow()}" rel="stylesheet" />
<style>
body{
	margin: 0;
}
</style>
</head>
<body>
<div class="editor-container">
	<div class="editor">
	</div>
</div>
<script src="/plugin/ckeditor5/build/ckeditor.js?v=${pb:jsNow()}"></script>
<script>
/**
 * 에디터설정
 */
	var watchdog = new CKSource.EditorWatchdog();
	let toolbar_size = 0;
	
	window.watchdog = watchdog;
	
	watchdog.setCreator( ( element, config ) => {
		return CKSource.Editor.create( element, config ).then( editor => {
				return editor;
			})
	} );
	
	watchdog.setDestructor( editor => {
		return editor.destroy();
	} );
	
	watchdog.on( 'error', handleError );
	
	watchdog.create( document.querySelector( '.editor' ), {
			extraPlugins: [ImageUploadAdapterPlugin],
			removePlugins : ['Title']
		})
		.then( editor => {
			
			//읽기모드 watchdog.editor.isReadOnly = true / false
	        const toolbarElement = watchdog.editor.ui.view.toolbar.element;
	        toolbar_size = toolbarElement.clientHeight;
	        watchdog.editor.on( 'change:isReadOnly', ( evt, propertyName, isReadOnly ) => {
	            if ( isReadOnly ) {
	                toolbarElement.style.display = 'none';
	                setSize(toolbar_size);
	            } else {
	                toolbarElement.style.display = 'flex';
	                setSize(0);
	            }
	        } );	        
	        window.onresize = function(event){
	        	setSize(0);
        	} 
	        window.onload = function(event){
	        	setSize(0);
      		}
    	})
		.catch( handleError );
	
	function setSize(p_add_height){
		var innerHeight = window.innerHeight;
		var editHeight = innerHeight - 50;
		editHeight = (editHeight < 100) ? 100 : editHeight;
		var style = document.createElement('style');
		style.innerHTML = "body{margin:0;} "
						+ ".ck-editor__editable{min-height: " + (editHeight+p_add_height) + "px;}";
		document.head.appendChild(style);
	}
	
	function handleError( error ) {
		console.error( 'Oops, something went wrong!' );
		console.error( 'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:' );
		console.warn( 'Build id: f2h31jbqmsb1-joyrzfl3otll' );
		console.error( error );
	}
	
	function ImageUploadAdapterPlugin(editor) {
	    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
	        return new UploadAdapter(loader)
	    }
	}
</script>
<script>
/**
 * 이미지업로드
 */
class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then( file => new Promise(((resolve, reject) => {
            this._initRequest();
            this._initListeners( resolve, reject, file );
            this._sendRequest( file );
        })))
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        xhr.open('POST', '${domain}/ckeditor/image', true);
        xhr.responseType = 'json';
    }

    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = '파일을 업로드 할 수 없습니다.'

        xhr.addEventListener('error', () => {reject(genericErrorText)})
        xhr.addEventListener('abort', () => reject())
        xhr.addEventListener('load', () => {
            const response = xhr.response
            if(!response || response.error) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }

            resolve({
                default: response.url //업로드된 파일 주소
            })
        })
    }

    _sendRequest(file) {
        const data = new FormData()
        data.append('upload',file)
        this.xhr.send(data)
    }
}
</script>
</body>
</html>