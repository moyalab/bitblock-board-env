window.APP_VERSION="0.22.0";function Button(e){const{first:i=!1,size:a="",square:r=!1,icon:s="connect.svg",onClick:g=w=>{},disabled:p=!1,active:l=!1,tooltip:c,label:f,background:h}=e;let k=html``;c&&(k=html`<div class="tooltip">${c}</div>`),k=html``;let y=l?"active":"",F=l?"selected":"",n=h?"inverted":"",o=i?"first":"",d=r?"square":"",u=p?"inactive":"active",v=a==="small"?"":html`<div class="label ${u} ${F}">${f}</div>`;return html`
     <div class="button ${o}">
       <button disabled=${p} class="${d}${a} ${y} ${n}" onclick=${g}>
         <img class="icon" src="media/${s}" />
       </button>
       ${v}
       ${k}
     </div>
   `}(function(){let e=null,i=null;function a(){return e||(e=document.createElement("div"),e.className="editor-context-menu",e.setAttribute("role","menu"),e.style.display="none",document.body.appendChild(e),e)}function r(){e&&(e.style.display="none",e.innerHTML="",i=null,document.removeEventListener("mousedown",s,!0),document.removeEventListener("keydown",g,!0),window.removeEventListener("blur",r),window.removeEventListener("resize",r),window.removeEventListener("scroll",r,!0))}function s(o){e&&e.contains(o.target)||r()}function g(o){o.key==="Escape"&&(o.preventDefault(),r())}function p(o){return o.state.selection.main}function l(o){const d=p(o);return d.from!==d.to}async function c(o){const{from:d,to:u}=p(o);if(d===u)return;const v=o.state.sliceDoc(d,u);try{await navigator.clipboard.writeText(v)}catch(w){return}o.dispatch({changes:{from:d,to:u,insert:""},selection:{anchor:d}}),o.focus()}async function f(o){const{from:d,to:u}=p(o);if(d===u)return;const v=o.state.sliceDoc(d,u);try{await navigator.clipboard.writeText(v)}catch(w){}o.focus()}async function h(o){let d;try{d=await navigator.clipboard.readText()}catch(w){return}if(d==null||d==="")return;const{from:u,to:v}=p(o);o.dispatch({changes:{from:u,to:v,insert:d},selection:{anchor:u+d.length}}),o.focus()}function k(o){o.dispatch({selection:{anchor:0,head:o.state.doc.length}}),o.focus()}function y(o,d,u){const v=document.createElement("div");return v.className="editor-context-menu__item"+(d?"":" is-disabled"),v.setAttribute("role","menuitem"),v.textContent=o,d&&v.addEventListener("click",()=>{r(),u()}),v}function F(o,d){const u=e;u.style.display="block",u.style.left="0px",u.style.top="0px";const v=u.offsetWidth,w=u.offsetHeight,S=window.innerWidth,P=window.innerHeight,R=4;let O=o,M=d;O+v+R>S&&(O=Math.max(R,S-v-R)),M+w+R>P&&(M=Math.max(R,P-w-R)),u.style.left=O+"px",u.style.top=M+"px"}function n(o,d){if(!d)return;i=d;const u=a();u.innerHTML="";const v=window.t||(P=>P),w=l(d);u.appendChild(y(v("editor.menu.cut"),w,()=>c(d))),u.appendChild(y(v("editor.menu.copy"),w,()=>f(d))),u.appendChild(y(v("editor.menu.paste"),!0,()=>h(d)));const S=document.createElement("div");S.className="editor-context-menu__sep",u.appendChild(S),u.appendChild(y(v("editor.menu.selectAll"),!0,()=>k(d))),F(o.clientX,o.clientY),document.addEventListener("mousedown",s,!0),document.addEventListener("keydown",g,!0),window.addEventListener("blur",r),window.addEventListener("resize",r),window.addEventListener("scroll",r,!0)}window.EditorContextMenu={show:n,hide:r}})();const EDITOR_FONT_MIN=8,EDITOR_FONT_MAX=48,EDITOR_FONT_DEFAULT=16,EDITOR_FONT_STEP=1,SNIPPET_MIME="application/vnd.micropython-ide.code-snippet";window.DragSnippet=window.DragSnippet||(function(){let e="";return{set(i){e=i||""},get(){return e},clear(){e=""},MIME:SNIPPET_MIME}})();function getEditorFontSize(){const e=document.documentElement.style.getPropertyValue("--editor-font-size").trim(),i=parseFloat(e);return Number.isFinite(i)?i:EDITOR_FONT_DEFAULT}function setEditorFontSize(e){const i=Math.max(EDITOR_FONT_MIN,Math.min(EDITOR_FONT_MAX,e));document.documentElement.style.setProperty("--editor-font-size",i+"px")}class CodeMirrorEditor extends Component{constructor(){super(),this.editor=null,this.content="# empty file",this.scrollTop=0,this.onWheelZoom=this.onWheelZoom.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this._dropZone=null,this._dropAfterLine=null,this._snippetDragOver=null,this._snippetDragLeave=null,this._snippetDragEnd=null,this._snippetDrop=null}createElement(i){return i&&(this.content=i),html`<div id="code-editor"></div>`}load(i){const a=r=>{this.content=r.state.doc.toString(),this.onChange()};this.editor=createEditor(this.content,i,a),i.addEventListener("wheel",this.onWheelZoom,{passive:!1}),i.addEventListener("contextmenu",this.onContextMenu),this._wheelEl=i,this._installSnippetDnd(),setTimeout(()=>{this.editor.scrollDOM.addEventListener("scroll",this.updateScrollPosition.bind(this)),this.editor.scrollDOM.scrollTo({top:this.scrollTop,left:0})},10)}update(){return!1}unload(){this.editor.scrollDOM.removeEventListener("scroll",this.updateScrollPosition),this._wheelEl&&(this._wheelEl.removeEventListener("wheel",this.onWheelZoom,{passive:!1}),this._wheelEl.removeEventListener("contextmenu",this.onContextMenu),this._wheelEl=null),this._uninstallSnippetDnd(),window.EditorContextMenu&&window.EditorContextMenu.hide()}onContextMenu(i){!window.EditorContextMenu||!this.editor||(i.preventDefault(),i.stopPropagation(),window.EditorContextMenu.show(i,this.editor))}onWheelZoom(i){if(!i.ctrlKey)return;i.preventDefault(),i.stopPropagation();const a=getEditorFontSize(),r=i.deltaY<0?EDITOR_FONT_STEP:-EDITOR_FONT_STEP;setEditorFontSize(a+r),this.editor&&typeof this.editor.requestMeasure=="function"&&(this.editor.viewState&&(this.editor.viewState.mustMeasureContent="refresh"),this.editor.requestMeasure())}updateScrollPosition(i){this.scrollTop=i.target.scrollTop}onChange(){return!1}_installSnippetDnd(){if(!this.editor)return;const i=this.editor.dom,a=r=>{const s=r.dataTransfer&&r.dataTransfer.types;return!!s&&Array.from(s).indexOf(SNIPPET_MIME)!==-1};this._snippetDragOver=r=>{if(!a(r))return;r.preventDefault(),r.stopPropagation(),r.dataTransfer&&(r.dataTransfer.dropEffect="copy");const s=window.DragSnippet&&window.DragSnippet.get()||"";s&&this._showSnippetDropZone(r.clientX,r.clientY,s)},this._snippetDragLeave=r=>{r.relatedTarget&&i.contains(r.relatedTarget)||this._clearSnippetDropZone()},this._snippetDragEnd=()=>this._clearSnippetDropZone(),this._snippetDrop=r=>{if(!a(r))return;r.preventDefault(),r.stopPropagation();const s=r.dataTransfer&&r.dataTransfer.getData(SNIPPET_MIME)||window.DragSnippet&&window.DragSnippet.get()||"",g=this._dropAfterLine;this._clearSnippetDropZone(),window.DragSnippet&&window.DragSnippet.clear(),s&&this._insertSnippet(s,g,r.clientX,r.clientY)},i.addEventListener("dragover",this._snippetDragOver,!0),i.addEventListener("dragleave",this._snippetDragLeave,!0),i.addEventListener("dragend",this._snippetDragEnd,!0),i.addEventListener("drop",this._snippetDrop,!0),this._snippetWindowEnd=()=>this._clearSnippetDropZone(),window.addEventListener("dragend",this._snippetWindowEnd),window.addEventListener("drop",this._snippetWindowEnd)}_uninstallSnippetDnd(){if(!this.editor)return;const i=this.editor.dom;this._snippetDragOver&&i.removeEventListener("dragover",this._snippetDragOver,!0),this._snippetDragLeave&&i.removeEventListener("dragleave",this._snippetDragLeave,!0),this._snippetDragEnd&&i.removeEventListener("dragend",this._snippetDragEnd,!0),this._snippetDrop&&i.removeEventListener("drop",this._snippetDrop,!0),this._snippetWindowEnd&&(window.removeEventListener("dragend",this._snippetWindowEnd),window.removeEventListener("drop",this._snippetWindowEnd)),this._clearSnippetDropZone()}_clearSnippetDropZone(){this._dropZone&&this._dropZone.parentNode&&this._dropZone.parentNode.removeChild(this._dropZone),this._dropZone=null,this._dropAfterLine=null}_resolveAfterLine(i,a){const r=this.editor;if(!r)return null;const s=r.state.doc,g=s.lines;let p=r.posAtCoords({x:i,y:a});if(p==null){const k=r.dom.getBoundingClientRect();return a<k.top+k.height/2?0:g}const l=s.lineAt(p).number,c=r.coordsAtPos(s.line(l).from);if(!c)return l;const f=r.defaultLineHeight||c.bottom-c.top||16;return a>c.top+f/2?l:l-1}_showSnippetDropZone(i,a,r){const s=this.editor;if(!s)return;const g=s.state.doc,p=g.lines,l=this._resolveAfterLine(i,a);if(l==null||this._dropAfterLine===l&&this._dropZone)return;this._clearSnippetDropZone(),this._dropAfterLine=l;let c;if(l<=0){const w=s.coordsAtPos(0);if(!w)return;c=w.top}else if(l>=p){const w=g.line(p),S=s.coordsAtPos(w.to);if(!S)return;c=S.bottom}else{const w=g.line(l+1),S=s.coordsAtPos(w.from);if(!S)return;c=S.top}const f=s.dom.getBoundingClientRect(),h=Math.max(f.top,Math.min(f.bottom-2,c)),k=s.defaultLineHeight||18,y=parseFloat(getComputedStyle(s.contentDOM).fontSize)||14,n=String(r).split(`
`).length*k+6,o=Math.max(0,f.bottom-h),d=document.createElement("div");d.className="snippet-drop-zone",d.style.position="fixed",d.style.top=`${h}px`,d.style.left=`${f.left}px`,d.style.width=`${f.width}px`,d.style.height=`${Math.min(n,o)}px`,d.style.zIndex="50",d.style.pointerEvents="none";const u=document.createElement("div");u.className="snippet-drop-bar",d.appendChild(u);const v=document.createElement("pre");v.className="snippet-drop-ghost",v.style.fontSize=`${y}px`,v.style.lineHeight=`${k}px`,v.textContent=r,d.appendChild(v),document.body.appendChild(d),this._dropZone=d}_insertSnippet(i,a,r,s){const g=this.editor;if(!g)return;const p=g.state.doc,l=p.lines,c=i.endsWith(`
`)?i.slice(0,-1):i;let f=a;f==null&&(f=this._resolveAfterLine(r,s),f==null&&(f=l));let h,k;f>=l?(h=p.length,k=`
${c}`):f<=0?(h=0,k=`${c}
`):(h=p.line(f+1).from,k=`${c}
`);const y=h+k.length;g.dispatch({changes:{from:h,to:h,insert:k},selection:{anchor:y},scrollIntoView:!0}),g.focus()}}function Tab(e){const{text:i="undefined",icon:a="ms-computer.svg",onSelectTab:r=()=>!1,onCloseTab:s=()=>!1,onStartRenaming:g=()=>!1,onFinishRenaming:p=()=>!1,disabled:l=!1,active:c=!1,renaming:f=!1,hasChanges:h=!1}=e;if(c)if(f){let n=function(d){p(d.target.value)},o=function(d){d.key.toLowerCase()==="enter"&&d.target.blur(),d.key.toLowerCase()==="escape"&&(d.target.value=null,d.target.blur())};var y=n,F=o;return html`
        <div class="tab active" tabindex="0">
          <img class="icon" src="media/${a}" />
          <div class="text">
            <input type="text"
              value=${i}
              onblur=${n}
              onkeydown=${o}
              />
          </div>
        </div>
      `}else return html`
        <div class="tab active" tabindex="0">
          <img class="icon" src="media/${a}" />
          <div class="text"
               onclick=${g}
               ondblclick=${g}>
            ${h?" *":""} ${i}
          </div>
          <div class="options" >
            <button onclick=${s}>
              <img class="icon" src="media/close.svg" />
            </button>
          </div>
        </div>
      `;function k(n){n.target.classList.contains("close-tab")||r(n)}return html`
    <div
      class="tab"
      tabindex="1"
      onclick=${k}
      >
      <img class="icon" src="media/${a}" />
      <div class="text">
        ${h?"*":""} ${i}
      </div>
      <div class="options close-tab">
        <button class="close-tab" onclick=${s}>
          <img class="close-tab icon" src="media/close.svg" />
        </button>
      </div>
    </div>
  `}class XTerm extends Component{constructor(i,a,r){super(i),this.term=new Terminal({fontSize:16,fontFamily:'"CodeFont", monospace',fontWeight:"normal",lineHeight:1.2,theme:{background:"#0d1b2a",foreground:"#e0eaea",cursor:"#ffffff",cursorAccent:"#0d1b2a",selectionBackground:"rgba(0, 212, 170, 0.25)",black:"#1e2d3d",red:"#ff6b6b",green:"#4ecdc4",yellow:"#ffd166",blue:"#5b9bd5",magenta:"#c792ea",cyan:"#00d4aa",white:"#e0eaea",brightBlack:"#4a6070",brightRed:"#ff8e8e",brightGreen:"#7be4dc",brightYellow:"#ffe599",brightBlue:"#80b8e8",brightMagenta:"#d6b0f5",brightCyan:"#33dfbb",brightWhite:"#f5fafa"}}),this.resizeTerm=this.resizeTerm.bind(this)}load(i){this.term.open(i),this.resizeTerm(),window.addEventListener("resize",this.resizeTerm)}createElement(){return html`<div class="terminal-wrapper"></div>`}update(){return this.resizeTerm(),!1}resizeTerm(){if(document.querySelector("#panel")){const i=window.getComputedStyle(document.querySelector("#panel")),a=parseInt(i.getPropertyValue("width")),r=parseInt(i.getPropertyValue("height")),s=Math.floor(a/this.term._core._renderService.dimensions.actualCellWidth)-6,g=Math.floor((r-PANEL_CLOSED)/this.term._core._renderService.dimensions.actualCellHeight)-2;this.term.resize(s,g)}}}const I18N_STORAGE_KEY="language",I18N_SUPPORTED=["en","ko"],I18N_DICT={en:{"toolbar.connect":"Connect","toolbar.disconnect":"Disconnect","toolbar.reset":"Reset","toolbar.run":"Run","toolbar.stop":"Stop","toolbar.new":"New","toolbar.save":"Save","toolbar.addPackage":"Add Package","toolbar.fullScreen":"Full Screen","toolbar.exitFullScreen":"Exit Full","toolbar.settings":"Settings","toolbar.uploadFirmware":"Upload Firmware","toolbar.tooltip.connect":"Connect ({shortcut})","toolbar.tooltip.disconnect":"Disconnect ({shortcut})","toolbar.tooltip.reset":"Reset ({shortcut})","toolbar.tooltip.run":"Run ({shortcut})","toolbar.tooltip.stop":"Stop ({shortcut})","toolbar.tooltip.new":"New ({shortcut})","toolbar.tooltip.save":"Save ({shortcut})","toolbar.tooltip.addPackageEnabled":"Install a MicroPython package onto the board","toolbar.tooltip.addPackageDisabled":"Connect to a board first","toolbar.tooltip.enterFullScreen":"Enter full screen","toolbar.tooltip.exitFullScreen":"Exit full screen","toolbar.tooltip.settings":"Toggle settings sidebar","toolbar.tooltip.uploadFirmware":"Upload MicroPython firmware","firmware.title":"Upload MicroPython Firmware","firmware.close":"Close","firmware.serial.title":"Serial Connection","firmware.serial.baudRate":"Baud Rate","firmware.serial.baudDefault":"921,600 (default)","firmware.serial.connect":"Connect Port","firmware.serial.disconnect":"Disconnect","firmware.serial.help":"If it doesn\u2019t connect, hold BOOT and press RESET to enter bootloader mode.","firmware.select.title":"Select Firmware","firmware.tab.micropython":"MicroPython","firmware.tag.stable":"STABLE","firmware.tag.legacy":"LEGACY","firmware.upload.button":"Upload Firmware","firmware.upload.uploading":"Uploading...","firmware.upload.done":"Done","firmware.upload.success":"Upload finished. The board will reboot automatically.","firmware.upload.error":"Upload failed. Hold BOOT + press RESET to re-enter bootloader and try again.","firmware.upload.progressLabel":"Upload progress","firmware.log.title":"Log Console","firmware.log.clear":"Clear","firmware.log.empty":"Logs will appear here once you connect to a serial port.","firmware.version.mpy_v1_28_0.label":"MicroPython v1.28.0","firmware.version.mpy_v1_28_0.description":"Official MicroPython firmware (ESP32_GENERIC_S3 build, single image)","firmware.version.mpy_v1_28_0.changelog.0":"Python 3 REPL via serial","firmware.version.mpy_v1_28_0.changelog.1":"Official ESP32_GENERIC_S3 build (4MB flash)","firmware.version.mpy_v1_28_0.changelog.2":"Single .bin flashed at 0x0","firmware.log.notSupported":"Web Serial API is not supported in this browser.","firmware.log.selectingPort":"Selecting serial port...","firmware.log.portCancelled":"Port selection cancelled.","firmware.log.initializingEsptool":"Initializing esptool-js...","firmware.log.connected":"\u2713 {chip} connected (baud: {baud})","firmware.log.connectFailed":"Connect failed: {err}","firmware.log.bootResetHint":"Hold BOOT and press RESET, then try again.","firmware.log.disconnected":"Disconnected","firmware.log.disconnectFailed":"Disconnect failed: {err}","firmware.log.connectFirst":"Connect to a port first.","firmware.log.flashStart":"Starting ESP32-S3 firmware flash (esptool-js)","firmware.log.flashMode":"  Flash Mode: {value}","firmware.log.flashFreq":"  Flash Freq: {value}","firmware.log.flashSize":"  Flash Size: {value}","firmware.log.fileCount":"  Files: {n}","firmware.log.flashDone":"\u2713 Firmware flash complete!","firmware.log.boardReset":"Resetting board...","firmware.log.resetDone":"\u2713 Reset done \u2014 board boots in normal mode","firmware.log.flashFailed":"\u2717 Flash failed: {err}","firmware.log.bootResetRetryHint":"Hold BOOT + RESET to re-enter bootloader and try again.","firmware.log.selectFw":"Please select a firmware.","firmware.log.fwNotFound":"Selected firmware version not found.","firmware.log.loadingFw":"Loading firmware {version}...","firmware.log.downloading":"  Downloading: {path}","firmware.log.loadFailed":"File load failed: {path} ({status})","firmware.log.loadedEntry":"  \u2713 {label}: {bytes} bytes","firmware.log.allLoaded":"All files loaded ({n} total)","firmware.log.loadError":"Firmware load error: {err}","sidebar.connectToBoard":"Connect to board","sidebar.selectFolder":"Select a folder...","sidebar.refresh":"Refresh file list","sidebar.deleteBoard":"Delete selected files on board","sidebar.deleteDisk":"Delete selected files on disk","sidebar.toggle":"Toggle sidebar","sidebar.hideFiles":"Hide files","sidebar.showFiles":"Show files","repl.connectedTo":"Connected to {name}","repl.showTerminal":"Show terminal","repl.copy":"Copy","repl.paste":"Paste","repl.clean":"Clean ({shortcut})","dialog.install.title":"Install a MicroPython package","dialog.install.search":"Search packages\u2026","dialog.install.loading":"Loading package list\u2026","dialog.install.noResults":"No packages match your search.","dialog.install.unnamed":"(unnamed)","dialog.install.working":"Working\u2026","dialog.install.installThis":"Install this package","dialog.install.openDocs":"Open documentation","dialog.install.noDocs":"No documentation URL available","dialog.install.overwrite":"Overwrite existing","dialog.install.installAsMpy":"Install as .mpy when available","dialog.install.fromUrl":"Install from URL","dialog.install.urlPlaceholder":"github:owner/repo@version","dialog.install.installBtn":"Install","dialog.install.close":"Close","dialog.install.closeDisabled":"Cannot close while installing","dialog.install.mpyNotSupported":"Board does not report an .mpy format \u2014 only .py will be installed","dialog.install.mpyFormatArch":"Board: {arch}, format {format}","dialog.install.mpyFormatOnly":"Format {format}","dialog.install.resolving":"Resolving\u2026","dialog.install.installed":"Installed.","dialog.newFile.title":"Create new file","dialog.newFile.close":"Close","dialog.newFile.board":"Board","dialog.newFile.computer":"Computer","dialog.ok":"OK","dialog.cancel":"Cancel","dialog.yes":"Yes","dialog.unsaved.title":"Unsaved Changes","dialog.unsaved.msg":"Your file has unsaved changes. Are you sure you want to proceed?","dialog.unsaved.msgMayHave":"You may have unsaved changes. Are you sure you want to proceed?","dialog.connectFailed.title":"Connection Failed","dialog.connectFailed.msg":"Could not connect to the board. Reset it and try again.","dialog.fileExists.title":"File Already Exists","dialog.fileExists.msg":"File {name} already exists on {source}. Please choose another name.","dialog.overwrite.title":"Confirm Overwrite","dialog.overwrite.msgFile":`You are about to overwrite the file {name} on your {source}.

 Are you sure you want to proceed?`,"dialog.overwrite.msgFileBoard":`You are about to overwrite the file {name} on your board.

Are you sure you want to proceed?`,"dialog.overwrite.msgFileDisk":`You are about to overwrite the file {name} on your disk.

Are you sure you want to proceed?`,"dialog.overwrite.msgValueBoard":`You are about to overwrite {name} on your board.

Are you sure you want to proceed?`,"dialog.overwrite.msgValueDisk":`You are about to overwrite {name} on your disk.

Are you sure you want to proceed?`,"dialog.overwrite.msgSingleBoardHeader":`You are about to overwrite the following file/folder on your board:

`,"dialog.overwrite.msgSingleDiskHeader":`You are about to overwrite the following file/folder on your disk:

`,"dialog.overwrite.msgManyBoardHeader":`You are about to overwrite the following files/folders on your board:

`,"dialog.overwrite.msgManyDiskHeader":`You are about to overwrite the following files/folders on your disk:

`,"dialog.overwrite.proceed":"Are you sure you want to proceed?","dialog.delete.title":"Confirm Delete","dialog.delete.header":`You are about to delete the following files:

`,"dialog.delete.fromBoard":`From your board:
`,"dialog.delete.fromDisk":`From your disk:
`,"overlay.loading":"Loading files...","overlay.removing":"Removing...","overlay.connecting":"Connecting...","overlay.saving":"Saving file... {progress}","overlay.transferring":"Transferring file","toast.boardDisconnected":"Board disconnected.","toast.packageRegistryFailed":"Could not load package registry: {err}","settings.title":"Settings","settings.close":"Close settings","settings.language":"Language","settings.apply":"Apply","settings.shortcuts.title":"Shortcuts","settings.shortcuts.clearEditor":"Clear all editor code","settings.shortcuts.run":"Run","settings.shortcuts.stop":"Stop","editor.menu.cut":"Cut","editor.menu.copy":"Copy","editor.menu.paste":"Paste","editor.menu.selectAll":"Select All","activity.explorer":"Explorer","activity.mpy":"MPY","activity.bitblock":"BitBlock","activity.settings":"Settings","topic.loading":"Loading\u2026","topic.error":"Failed to load: {err}","topic.back":"Back","topic.empty":"No topics yet."},ko:{"toolbar.connect":"\uC5F0\uACB0","toolbar.disconnect":"\uC5F0\uACB0 \uD574\uC81C","toolbar.reset":"\uC7AC\uC2DC\uC791","toolbar.run":"\uC2E4\uD589","toolbar.stop":"\uC911\uC9C0","toolbar.new":"\uC0C8 \uD30C\uC77C","toolbar.save":"\uC800\uC7A5","toolbar.addPackage":"\uD328\uD0A4\uC9C0 \uCD94\uAC00","toolbar.fullScreen":"\uC804\uCCB4 \uD654\uBA74","toolbar.exitFullScreen":"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC","toolbar.settings":"\uC124\uC815","toolbar.uploadFirmware":"\uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","toolbar.tooltip.connect":"\uC5F0\uACB0 ({shortcut})","toolbar.tooltip.disconnect":"\uC5F0\uACB0 \uD574\uC81C ({shortcut})","toolbar.tooltip.reset":"\uC7AC\uC2DC\uC791 ({shortcut})","toolbar.tooltip.run":"\uC2E4\uD589 ({shortcut})","toolbar.tooltip.stop":"\uC911\uC9C0 ({shortcut})","toolbar.tooltip.new":"\uC0C8 \uD30C\uC77C ({shortcut})","toolbar.tooltip.save":"\uC800\uC7A5 ({shortcut})","toolbar.tooltip.addPackageEnabled":"\uBCF4\uB4DC\uC5D0 MicroPython \uD328\uD0A4\uC9C0 \uC124\uCE58","toolbar.tooltip.addPackageDisabled":"\uBA3C\uC800 \uBCF4\uB4DC\uC5D0 \uC5F0\uACB0\uD558\uC138\uC694","toolbar.tooltip.enterFullScreen":"\uC804\uCCB4 \uD654\uBA74\uC73C\uB85C \uC804\uD658","toolbar.tooltip.exitFullScreen":"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC","toolbar.tooltip.settings":"\uC124\uC815 \uC0AC\uC774\uB4DC\uBC14 \uD1A0\uAE00","toolbar.tooltip.uploadFirmware":"\uB9C8\uC774\uD06C\uB85C\uD30C\uC774\uC36C \uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","firmware.title":"\uB9C8\uC774\uD06C\uB85C\uD30C\uC774\uC36C \uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","firmware.close":"\uB2EB\uAE30","firmware.serial.title":"\uC2DC\uB9AC\uC5BC \uC5F0\uACB0","firmware.serial.baudRate":"Baud Rate","firmware.serial.baudDefault":"921,600 (\uAE30\uBCF8\uAC12)","firmware.serial.connect":"\uD3EC\uD2B8 \uC5F0\uACB0","firmware.serial.disconnect":"\uC5F0\uACB0 \uD574\uC81C","firmware.serial.help":"\uC5F0\uACB0\uC774 \uC548 \uB418\uBA74 BOOT \uBC84\uD2BC\uC744 \uB204\uB978 \uCC44 RESET\uC744 \uB20C\uB7EC \uBD80\uD2B8\uB85C\uB354 \uBAA8\uB4DC\uB85C \uC9C4\uC785\uD558\uC138\uC694.","firmware.select.title":"\uD38C\uC6E8\uC5B4 \uC120\uD0DD","firmware.tab.micropython":"MicroPython","firmware.tag.stable":"STABLE","firmware.tag.legacy":"LEGACY","firmware.upload.button":"\uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","firmware.upload.uploading":"\uC5C5\uB85C\uB4DC \uC911...","firmware.upload.done":"\uC5C5\uB85C\uB4DC \uC644\uB8CC","firmware.upload.success":"\uC5C5\uB85C\uB4DC\uAC00 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uBCF4\uB4DC\uAC00 \uC790\uB3D9\uC73C\uB85C \uC7AC\uC2DC\uC791\uB429\uB2C8\uB2E4.","firmware.upload.error":"\uC5C5\uB85C\uB4DC \uC2E4\uD328. BOOT+RESET\uC73C\uB85C \uBD80\uD2B8\uB85C\uB354 \uC9C4\uC785 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","firmware.upload.progressLabel":"\uC5C5\uB85C\uB4DC \uC9C4\uD589","firmware.log.title":"\uB85C\uADF8 \uCF58\uC194","firmware.log.clear":"\uCD08\uAE30\uD654","firmware.log.empty":"\uC2DC\uB9AC\uC5BC \uD3EC\uD2B8\uC5D0 \uC5F0\uACB0\uD558\uBA74 \uB85C\uADF8\uAC00 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4.","firmware.version.mpy_v1_28_0.label":"\uB9C8\uC774\uD06C\uB85C\uD30C\uC774\uC36C v1.28.0","firmware.version.mpy_v1_28_0.description":"MicroPython \uACF5\uC2DD \uD38C\uC6E8\uC5B4 (ESP32_GENERIC_S3 \uBE4C\uB4DC, \uB2E8\uC77C \uC774\uBBF8\uC9C0)","firmware.version.mpy_v1_28_0.changelog.0":"Python 3 \uD638\uD658 REPL \xB7 REPL \uC2DC\uB9AC\uC5BC \uC811\uC18D\uC73C\uB85C \uBC14\uB85C \uCF54\uB529","firmware.version.mpy_v1_28_0.changelog.1":"\uACF5\uC2DD ESP32_GENERIC_S3 \uBE4C\uB4DC (4MB \uD50C\uB798\uC2DC)","firmware.version.mpy_v1_28_0.changelog.2":"\uB2E8\uC77C .bin \uC774\uBBF8\uC9C0\uB97C 0x0 \uC624\uD504\uC14B\uC5D0 \uC77C\uAD04 \uD50C\uB798\uC2DC","firmware.log.notSupported":"\uC774 \uBE0C\uB77C\uC6B0\uC800\uB294 Web Serial API\uB97C \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.","firmware.log.selectingPort":"\uC2DC\uB9AC\uC5BC \uD3EC\uD2B8 \uC120\uD0DD \uC911...","firmware.log.portCancelled":"\uD3EC\uD2B8 \uC120\uD0DD\uC774 \uCDE8\uC18C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.","firmware.log.initializingEsptool":"esptool-js \uCD08\uAE30\uD654 \uC911...","firmware.log.connected":"\u2713 {chip} \uC5F0\uACB0 \uC644\uB8CC (baud: {baud})","firmware.log.connectFailed":"\uC5F0\uACB0 \uC2E4\uD328: {err}","firmware.log.bootResetHint":"BOOT \uBC84\uD2BC\uC744 \uB204\uB978 \uCC44 RESET \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","firmware.log.disconnected":"\uC5F0\uACB0 \uD574\uC81C","firmware.log.disconnectFailed":"\uC5F0\uACB0 \uD574\uC81C \uC2E4\uD328: {err}","firmware.log.connectFirst":"\uBA3C\uC800 \uD3EC\uD2B8\uC5D0 \uC5F0\uACB0\uD574\uC8FC\uC138\uC694.","firmware.log.flashStart":"ESP32-S3 \uD38C\uC6E8\uC5B4 \uD50C\uB798\uC2F1 \uC2DC\uC791 (esptool-js)","firmware.log.flashMode":"  Flash Mode: {value}","firmware.log.flashFreq":"  Flash Freq: {value}","firmware.log.flashSize":"  Flash Size: {value}","firmware.log.fileCount":"  \uD30C\uC77C \uC218: {n}","firmware.log.flashDone":"\u2713 \uD38C\uC6E8\uC5B4 \uD50C\uB798\uC2F1 \uC644\uB8CC!","firmware.log.boardReset":"\uBCF4\uB4DC \uB9AC\uC14B \uC911...","firmware.log.resetDone":"\u2713 \uB9AC\uC14B \uC644\uB8CC \u2014 \uBCF4\uB4DC\uAC00 \uC815\uC0C1 \uBAA8\uB4DC\uB85C \uBD80\uD305\uB429\uB2C8\uB2E4","firmware.log.flashFailed":"\u2717 \uD50C\uB798\uC2F1 \uC2E4\uD328: {err}","firmware.log.bootResetRetryHint":"BOOT + RESET\uC73C\uB85C \uBD80\uD2B8\uB85C\uB354 \uC7AC\uC9C4\uC785 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","firmware.log.selectFw":"\uD38C\uC6E8\uC5B4\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.","firmware.log.fwNotFound":"\uC120\uD0DD\uD55C \uD38C\uC6E8\uC5B4 \uBC84\uC804\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.","firmware.log.loadingFw":"\uD38C\uC6E8\uC5B4 {version} \uD30C\uC77C \uB85C\uB4DC \uC911...","firmware.log.downloading":"  \uB2E4\uC6B4\uB85C\uB4DC: {path}","firmware.log.loadFailed":"\uD30C\uC77C \uB85C\uB4DC \uC2E4\uD328: {path} ({status})","firmware.log.loadedEntry":"  \u2713 {label}: {bytes} bytes","firmware.log.allLoaded":"\uBAA8\uB4E0 \uD30C\uC77C \uB85C\uB4DC \uC644\uB8CC (\uCD1D {n}\uAC1C)","firmware.log.loadError":"\uD38C\uC6E8\uC5B4 \uB85C\uB4DC \uC624\uB958: {err}","sidebar.connectToBoard":"\uBCF4\uB4DC \uC5F0\uACB0","sidebar.selectFolder":"\uD3F4\uB354\uB97C \uC120\uD0DD\uD558\uC138\uC694...","sidebar.refresh":"\uD30C\uC77C \uBAA9\uB85D \uC0C8\uB85C \uACE0\uCE68","sidebar.deleteBoard":"\uBCF4\uB4DC\uC5D0\uC11C \uC120\uD0DD\uD55C \uD30C\uC77C \uC0AD\uC81C","sidebar.deleteDisk":"\uB514\uC2A4\uD06C\uC5D0\uC11C \uC120\uD0DD\uD55C \uD30C\uC77C \uC0AD\uC81C","sidebar.toggle":"\uC0AC\uC774\uB4DC\uBC14 \uD1A0\uAE00","sidebar.hideFiles":"\uD30C\uC77C \uC228\uAE30\uAE30","sidebar.showFiles":"\uD30C\uC77C \uBCF4\uC774\uAE30","repl.connectedTo":"{name}\uC5D0 \uC5F0\uACB0\uB428","repl.showTerminal":"\uD130\uBBF8\uB110 \uD45C\uC2DC","repl.copy":"\uBCF5\uC0AC","repl.paste":"\uBD99\uC5EC\uB123\uAE30","repl.clean":"\uC9C0\uC6B0\uAE30 ({shortcut})","dialog.install.title":"MicroPython \uD328\uD0A4\uC9C0 \uC124\uCE58","dialog.install.search":"\uD328\uD0A4\uC9C0 \uAC80\uC0C9\u2026","dialog.install.loading":"\uD328\uD0A4\uC9C0 \uBAA9\uB85D \uBD88\uB7EC\uC624\uB294 \uC911\u2026","dialog.install.noResults":"\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.","dialog.install.unnamed":"(\uC774\uB984 \uC5C6\uC74C)","dialog.install.working":"\uC791\uC5C5 \uC911\u2026","dialog.install.installThis":"\uC774 \uD328\uD0A4\uC9C0 \uC124\uCE58","dialog.install.openDocs":"\uBB38\uC11C \uC5F4\uAE30","dialog.install.noDocs":"\uBB38\uC11C URL\uC774 \uC5C6\uC2B5\uB2C8\uB2E4","dialog.install.overwrite":"\uAE30\uC874 \uD30C\uC77C \uB36E\uC5B4\uC4F0\uAE30","dialog.install.installAsMpy":"\uAC00\uB2A5\uD558\uBA74 .mpy\uB85C \uC124\uCE58","dialog.install.fromUrl":"URL\uC5D0\uC11C \uC124\uCE58","dialog.install.urlPlaceholder":"github:owner/repo@version","dialog.install.installBtn":"\uC124\uCE58","dialog.install.close":"\uB2EB\uAE30","dialog.install.closeDisabled":"\uC124\uCE58 \uC911\uC5D0\uB294 \uB2EB\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4","dialog.install.mpyNotSupported":"\uBCF4\uB4DC\uAC00 .mpy \uD3EC\uB9F7\uC744 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC544 .py\uB9CC \uC124\uCE58\uB429\uB2C8\uB2E4","dialog.install.mpyFormatArch":"\uBCF4\uB4DC: {arch}, \uD3EC\uB9F7 {format}","dialog.install.mpyFormatOnly":"\uD3EC\uB9F7 {format}","dialog.install.resolving":"\uBD84\uC11D \uC911\u2026","dialog.install.installed":"\uC124\uCE58\uB428.","dialog.newFile.title":"\uC0C8 \uD30C\uC77C \uB9CC\uB4E4\uAE30","dialog.newFile.close":"\uB2EB\uAE30","dialog.newFile.board":"\uBCF4\uB4DC","dialog.newFile.computer":"\uCEF4\uD4E8\uD130","dialog.ok":"\uD655\uC778","dialog.cancel":"\uCDE8\uC18C","dialog.yes":"\uC608","dialog.unsaved.title":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D","dialog.unsaved.msg":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?","dialog.unsaved.msgMayHave":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D\uC774 \uC788\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?","dialog.connectFailed.title":"\uC5F0\uACB0 \uC2E4\uD328","dialog.connectFailed.msg":"\uBCF4\uB4DC\uC5D0 \uC5F0\uACB0\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC7AC\uC2DC\uC791 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","dialog.fileExists.title":"\uD30C\uC77C\uC774 \uC774\uBBF8 \uC874\uC7AC\uD569\uB2C8\uB2E4","dialog.fileExists.msg":"{source}\uC5D0 {name} \uD30C\uC77C\uC774 \uC774\uBBF8 \uC874\uC7AC\uD569\uB2C8\uB2E4. \uB2E4\uB978 \uC774\uB984\uC744 \uC0AC\uC6A9\uD558\uC138\uC694.","dialog.overwrite.title":"\uB36E\uC5B4\uC4F0\uAE30 \uD655\uC778","dialog.overwrite.msgFile":`{source}\uC5D0 \uC788\uB294 {name} \uD30C\uC77C\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4.

 \uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,"dialog.overwrite.msgFileBoard":`\uBCF4\uB4DC\uC5D0 \uC788\uB294 {name} \uD30C\uC77C\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4.

\uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,"dialog.overwrite.msgFileDisk":`\uB514\uC2A4\uD06C\uC5D0 \uC788\uB294 {name} \uD30C\uC77C\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4.

\uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,"dialog.overwrite.msgValueBoard":`\uBCF4\uB4DC\uC5D0 \uC788\uB294 {name}\uC744(\uB97C) \uB36E\uC5B4\uC501\uB2C8\uB2E4.

\uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,"dialog.overwrite.msgValueDisk":`\uB514\uC2A4\uD06C\uC5D0 \uC788\uB294 {name}\uC744(\uB97C) \uB36E\uC5B4\uC501\uB2C8\uB2E4.

\uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,"dialog.overwrite.msgSingleBoardHeader":`\uBCF4\uB4DC\uC758 \uB2E4\uC74C \uD30C\uC77C/\uD3F4\uB354\uB97C \uB36E\uC5B4\uC501\uB2C8\uB2E4:

`,"dialog.overwrite.msgSingleDiskHeader":`\uB514\uC2A4\uD06C\uC758 \uB2E4\uC74C \uD30C\uC77C/\uD3F4\uB354\uB97C \uB36E\uC5B4\uC501\uB2C8\uB2E4:

`,"dialog.overwrite.msgManyBoardHeader":`\uBCF4\uB4DC\uC758 \uB2E4\uC74C \uD30C\uC77C/\uD3F4\uB354\uB4E4\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4:

`,"dialog.overwrite.msgManyDiskHeader":`\uB514\uC2A4\uD06C\uC758 \uB2E4\uC74C \uD30C\uC77C/\uD3F4\uB354\uB4E4\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4:

`,"dialog.overwrite.proceed":"\uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?","dialog.delete.title":"\uC0AD\uC81C \uD655\uC778","dialog.delete.header":`\uB2E4\uC74C \uD30C\uC77C\uB4E4\uC744 \uC0AD\uC81C\uD569\uB2C8\uB2E4:

`,"dialog.delete.fromBoard":`\uBCF4\uB4DC\uC5D0\uC11C:
`,"dialog.delete.fromDisk":`\uB514\uC2A4\uD06C\uC5D0\uC11C:
`,"overlay.loading":"\uD30C\uC77C \uBD88\uB7EC\uC624\uB294 \uC911...","overlay.removing":"\uC0AD\uC81C \uC911...","overlay.connecting":"\uC5F0\uACB0 \uC911...","overlay.saving":"\uD30C\uC77C \uC800\uC7A5 \uC911... {progress}","overlay.transferring":"\uD30C\uC77C \uC804\uC1A1 \uC911","toast.boardDisconnected":"\uBCF4\uB4DC\uC640 \uC5F0\uACB0\uC774 \uB04A\uC5B4\uC84C\uC2B5\uB2C8\uB2E4.","toast.packageRegistryFailed":"\uD328\uD0A4\uC9C0 \uB808\uC9C0\uC2A4\uD2B8\uB9AC \uBD88\uB7EC\uC624\uAE30 \uC2E4\uD328: {err}","settings.title":"\uC124\uC815","settings.close":"\uC124\uC815 \uB2EB\uAE30","settings.language":"\uC5B8\uC5B4","settings.apply":"\uC801\uC6A9","settings.shortcuts.title":"\uB2E8\uCD95\uD0A4","settings.shortcuts.clearEditor":"\uC5D0\uB514\uD130 \uCF54\uB4DC \uC804\uCCB4 \uC9C0\uC6B0\uAE30","settings.shortcuts.run":"\uC2E4\uD589","settings.shortcuts.stop":"\uC815\uC9C0","editor.menu.cut":"\uC798\uB77C\uB0B4\uAE30","editor.menu.copy":"\uBCF5\uC0AC","editor.menu.paste":"\uBD99\uC5EC\uB123\uAE30","editor.menu.selectAll":"\uC804\uCCB4 \uC120\uD0DD","activity.explorer":"\uD30C\uC77C","activity.mpy":"MPY","activity.bitblock":"\uBE44\uD2B8\uBE14\uB85D","activity.settings":"\uC124\uC815","topic.loading":"\uBD88\uB7EC\uC624\uB294 \uC911\u2026","topic.error":"\uB85C\uB4DC \uC2E4\uD328: {err}","topic.back":"\uB4A4\uB85C","topic.empty":"\uC544\uC9C1 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}};function i18nDetectDefault(){const e=(navigator.language||"en").split("-")[0].toLowerCase();return I18N_SUPPORTED.includes(e)?e:"en"}function i18nGetStored(){try{return localStorage.getItem(I18N_STORAGE_KEY)}catch(e){return null}}function i18nSetStored(e){try{localStorage.setItem(I18N_STORAGE_KEY,e)}catch(i){}}let __i18nLang=(function(){const e=i18nGetStored();return e&&I18N_SUPPORTED.includes(e)?e:i18nDetectDefault()})();function applyHtmlLang(e){typeof document!="undefined"&&document.documentElement&&(document.documentElement.lang=e)}applyHtmlLang(__i18nLang);function t(e,i){const a=I18N_DICT[__i18nLang]||I18N_DICT.en;let r=a[e]!==void 0?a[e]:I18N_DICT.en[e]!==void 0?I18N_DICT.en[e]:e;if(i)for(const s in i)r=r.split("{"+s+"}").join(String(i[s]));return r}window.t=t,window.i18n={getLanguage:()=>__i18nLang,setLanguage:e=>{I18N_SUPPORTED.includes(e)&&(__i18nLang=e,i18nSetStored(e),applyHtmlLang(e))},getAvailable:()=>I18N_SUPPORTED.slice(),detectDefault:i18nDetectDefault},window.FirmwareConfig={FIRMWARE_VERSIONS:[{id:"micropython-v1.28.0",version:"v1.28.0",board:"micropython",labelKey:"firmware.version.mpy_v1_28_0.label",descriptionKey:"firmware.version.mpy_v1_28_0.description",changelogKeys:["firmware.version.mpy_v1_28_0.changelog.0","firmware.version.mpy_v1_28_0.changelog.1","firmware.version.mpy_v1_28_0.changelog.2"],image:"firmware/micropython.png",date:"2026-04-06",tag:"stable",combinedImage:"ESP32_GENERIC_S3-20260406-v1.28.0.bin"}],BOARD_TABS:[{id:"micropython",labelKey:"firmware.tab.micropython",icon:"firmware/micropython.png"}],getFlashMap(e){return[{path:`firmware/${e.board}/${e.version}/${e.combinedImage}`,address:0,label:"MicroPython (combined)"}]},DEFAULT_SETTINGS:{baudRate:921600},FLASH_MODE:"keep",FLASH_FREQ:"keep",FLASH_SIZE:"keep"};function CodeEditor(e,i){return e.editingFile?e.openFiles.find(r=>r.id==e.editingFile).editor.render():html`
      <div id="code-editor"></div>
    `}function NewFileDialog(e,i){const a=e.isNewFileDialogOpen?"open":"closed";function r(y){y.target.id=="dialog-new-file"&&i("close-new-file-dialog")}function s(y){y.stopPropagation(),i("close-new-file-dialog")}function g(y){return F=>{F&&F.stopPropagation&&F.stopPropagation();const n=document.querySelector("#file-name"),o=n.value.trim()||n.placeholder;i("create-new-tab",y,o)}}new MutationObserver((y,F)=>{const n=document.querySelector("#dialog-new-file input");n&&(n.focus(),F.disconnect())}).observe(document.body,{childList:!0,subtree:!0});const l=[...(e.openFiles||[]).map(y=>y.fileName),...(e.diskFiles||[]).map(y=>y.fileName),...(e.boardFiles||[]).map(y=>y.fileName)],f={type:"text",id:"file-name",value:"",placeholder:generateFileName(l)},h=e.isConnected?html`<button type="button" onclick=${g("board")}>${t("dialog.newFile.board")}</button>`:"",k=html`
  <div id="dialog-new-file" class="dialog ${a}" onclick=${r}>
    <div class="dialog-content">
      <div class="dialog-header">
        <div class="dialog-title">${t("dialog.newFile.title")}</div>
        <button class="dialog-close" type="button" aria-label=${t("dialog.newFile.close")} onclick=${s}>×</button>
      </div>
      <div class="dialog-body">
        <input ${f} />
      </div>
      <div class="dialog-actions">
        ${h}
        <button type="button" class="dialog-action-default" onclick=${g("disk")}>${t("dialog.newFile.computer")}</button>
      </div>
    </div>
  </div>
`;if(e.isNewFileDialogOpen){const y=k.querySelector("#dialog-new-file .dialog-content input");return y&&y.focus(),k}}function InstallPackageDialog(e,i){const a=e.isInstallPackageDialogOpen?"open":"closed",r=e.packageSearchResults||[],s=e.selectedPackage,g=!!e.isInstallingPackage;function p(u){i("search-packages",u.target.value)}function l(u){return()=>{g||i("select-package-to-install",u)}}function c(u){return v=>{v&&v.stopPropagation&&v.stopPropagation(),!g&&i("install-package",u)}}function f(u){return v=>{v&&v.stopPropagation&&v.stopPropagation();const w=u.docs||u.url;if(!w)return;const S=/^https?:\/\//.test(w)?w:w.startsWith("github:")?"https://github.com/"+w.substring(7).split("@")[0]:w.startsWith("gitlab:")?"https://gitlab.com/"+w.substring(7).split("@")[0]:w;window.open(S,"_blank","noopener,noreferrer")}}function h(){g||i("close-install-package-dialog")}function k(u){i("toggle-install-overwrite",u.target.checked)}const y=r.length===0?html`<div class="package-empty">${e.packageList.length===0?t("dialog.install.loading"):t("dialog.install.noResults")}</div>`:r.map(u=>{const v=s&&s.name===u.name&&s.url===u.url,w="package-item"+(v?" selected":""),S=u.url?html`<span class="package-source">${u.url}</span>`:html`<span class="package-source">micropython-lib</span>`,R=!!(u.docs||u.url||""),O=v?html`
              <div class="package-actions">
                <button class="package-action-btn"
                        title=${t("dialog.install.installThis")}
                        disabled=${g}
                        onclick=${c(u)}>
                  <span class="material-symbols-outlined">deployed_code_update</span>
                </button>
                <button class="package-action-btn"
                        title=${t(R?"dialog.install.openDocs":"dialog.install.noDocs")}
                        disabled=${!R}
                        onclick=${f(u)}>
                  <span class="material-symbols-outlined">description</span>
                </button>
              </div>
            `:"";return html`
          <div class="${w}" onclick=${l(u)}>
            <div class="package-info">
              <div class="package-head">
                <span class="material-symbols-outlined package-icon">deployed_code</span>
                <span class="package-name">${u.name||t("dialog.install.unnamed")}</span>
                ${u.version?html`<span class="package-version">v${u.version}</span>`:""}
              </div>
              <div class="package-desc">${u.description||""}</div>
              ${S}
            </div>
            ${O}
          </div>
        `}),F=e.installPackageError?html`<div class="install-error">${e.installPackageError}</div>`:"",n=g?html`<div class="install-progress">${e.installPackageProgress||t("dialog.install.working")}</div>`:"",o=g?html`<button class="dialog-close-floating" disabled title=${t("dialog.install.closeDisabled")}><span class="material-symbols-outlined">close</span></button>`:html`<button class="dialog-close-floating" onclick=${h} title=${t("dialog.install.close")}><span class="material-symbols-outlined">close</span></button>`,d=html`
  <div id="dialog-install-package" class="dialog ${a}">
    <div class="dialog-content install-package-dialog">
      ${o}
      <div class="dialog-title">${t("dialog.install.title")}</div>

      <input type="search"
             id="install-package-search"
             placeholder=${t("dialog.install.search")}
             value=${e.packageSearchQuery||""}
             oninput=${p} />

      <div class="package-list">${y}</div>

      <div class="install-options">
        <label class="install-option">
          <input type="checkbox" checked=${!!e.packageOverwrite} onchange=${k} />
          ${t("dialog.install.overwrite")}
        </label>
      </div>

      ${F}
      ${n}
    </div>
  </div>
  `;if(e.isInstallPackageDialogOpen)return d}function FileActions(e,i){const{isConnected:a,selectedFiles:r}=e;return html`
  <div id="file-actions">
    ${Button({icon:"arrow-up.svg",size:"small",disabled:!canUpload({isConnected:a,selectedFiles:r}),onClick:()=>i("upload-files")})}
    ${Button({icon:"arrow-down.svg",size:"small",disabled:!canDownload({isConnected:a,selectedFiles:r}),onClick:()=>i("download-files")})}
  </div>

  `}const DiskFileList=generateFileList("disk"),BoardFileList=generateFileList("board");function generateFileList(e){return function(a,r){function s(y){y.key.toLowerCase()==="enter"&&y.target.blur(),y.key.toLowerCase()==="escape"&&(y.target.value=null,y.target.blur())}const g=html`
      <div class="item">
        <img class="icon" src="media/file.svg" />
        <div class="text">
          <input type="text" onkeydown=${s} onblur=${y=>r("finish-creating-file",y.target.value)}/>
        </div>
      </div>
    `,p=html`
      <div class="item">
        <img class="icon" src="media/folder.svg" />
        <div class="text">
          <input type="text" onkeydown=${s} onblur=${y=>r("finish-creating-folder",y.target.value)}/>
        </div>
      </div>
    `;function l(y,F){const n=html`
        <input type="text"
          value=${y.fileName}
          onkeydown=${s}
          onblur=${P=>r("finish-renaming-file",P.target.value)}
          onclick=${P=>!1}
          ondblclick=${P=>!1}
          />
      `,o=a.selectedFiles.find(P=>P.fileName===y.fileName&&P.source===e);function d(P){return P.preventDefault(),r("rename-file",e,y),!1}function u(){a.renamingFile||r(`navigate-${e}-folder`,y.fileName)}function v(){a.renamingFile||r("open-file",e,y)}let w=y.fileName;const S=a.selectedFiles.find(P=>P.fileName===w);return a.renamingFile==e&&S&&(w=n),y.type==="folder"?html`
          <div
            class="item ${o?"selected":""}"
            onclick=${P=>r("toggle-file-selection",y,e,P)}
            ondblclick=${u}
            >
            <img class="icon" src="media/folder.svg" />
            <div class="text">${w}</div>
            <div class="options" onclick=${d}>
              <img src="media/ms-edit.svg" />
            </div>
          </div>
        `:html`
          <div
            class="item ${o?"selected":""}"
            onclick=${P=>r("toggle-file-selection",y,e,P)}
            ondblclick=${v}
            >
            <img class="icon" src="media/file.svg"  />
            <div class="text">${w}</div>
            <div class="options" onclick=${d}>
              <img src="media/ms-edit.svg" />
            </div>
          </div>
        `}const c=a[`${e}Files`].sort((y,F)=>{const n=y.fileName.toUpperCase(),o=F.fileName.toUpperCase();if(y.type==="folder"&&F.type==="file")return-1;if(y.type===F.type){if(n<o)return-1;if(n>o)return 1}return 0}),f=html`<div class="item"
  onclick=${()=>r(`navigate-${e}-parent`)}
  style="cursor: pointer"
  >
  ..
</div>`,h=html`
      <div class="file-list">
        <div class="list">
          ${e==="disk"&&a.diskNavigationPath!="/"?f:""}
          ${e==="board"&&a.boardNavigationPath!="/"?f:""}
          ${a.creatingFile==e?g:null}
          ${a.creatingFolder==e?p:null}
          ${c.map(l)}
        </div>
      </div>
    `;return new MutationObserver(y=>{const F=h.querySelector("input");F&&F.focus()}).observe(h,{childList:!0,subtree:!0}),h}}function ReplPanel(e,i){const a=e.panelHeight<=PANEL_CLOSED,r=a?0:e.panelHeight,s=()=>{e.panelHeight>PANEL_CLOSED?i("close-panel"):i("open-panel")},g=a?"closed":"open",p=e.isResizingPanel?"resizing":"",l=e.panelHeight>PANEL_TOO_SMALL?"visible":"hidden";let c="terminal-enabled";return(!e.isConnected||e.isNewFileDialogOpen)&&(c="terminal-disabled"),html`
    <div class="panel-container">
      <div id="panel" class="${g} ${p}" style="height: ${r}px">
        <div class="panel-bar">
          <div id="connection-status" style="visibility:${e.isConnected?"visible":"hidden"};">
            <img src="media/ms-usb.svg" />
            <div>${e.isConnected?t("repl.connectedTo",{name:"bitblock"}):""}</div>
          </div>
          <div class="spacer"></div>
          <div id="drag-handle"
            onmousedown=${()=>i("start-resizing-panel")}
            onmouseup=${()=>i("stop-resizing-panel")}
            ></div>
          <div class="term-operations ${l}">
            ${ReplOperations(e,i)}
          </div>
          ${Button({icon:`arrow-${e.panelHeight>PANEL_CLOSED?"down":"up"}.svg`,size:"small",onClick:s})}
        </div>
        <div class=${c}>
          ${e.cache(XTerm,"terminal").render()}
        </div>
      </div>
      <button class="panel-reopen-handle ${a?"visible":""}"
              onclick=${()=>i("open-panel")}
              aria-label=${t("repl.showTerminal")}
              title=${t("repl.showTerminal")}>
        <span class="material-symbols-outlined">keyboard_arrow_up</span>
      </button>
    </div>
  `}function ReplOperations(e,i){return[Button({icon:"copy.svg",size:"small",tooltip:t("repl.copy"),onClick:()=>document.execCommand("copy")}),Button({icon:"paste.svg",size:"small",tooltip:t("repl.paste"),onClick:()=>document.execCommand("paste")}),Button({icon:"delete.svg",size:"small",tooltip:t("repl.clean",{shortcut:`${e.platform==="darwin"?"Cmd":"Ctrl"}+L`}),onClick:()=>i("clear-terminal")})]}function Tabs(e,i){const a=html`
    <div id="tabs">
      ${e.openFiles.map(s=>Tab({text:s.fileName,icon:s.source==="board"?"ms-videogame-asset.svg":"ms-computer.svg",active:s.id===e.editingFile,renaming:s.id===e.renamingTab,hasChanges:s.hasChanges,onSelectTab:()=>i("select-tab",s.id),onCloseTab:()=>i("close-tab",s.id),onStartRenaming:()=>i("rename-tab",s.id),onFinishRenaming:g=>i("finish-renaming-tab",g)}))}
    </div>
  `;return new MutationObserver(s=>{const g=a.querySelector("input");g&&g.focus()}).observe(a,{childList:!0,subtree:!0}),a}function Toolbar(e,i){const a=window.canSave({view:e.view,isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile}),r=window.canExecute({view:e.view,isConnected:e.isConnected}),s=e.platform==="darwin"?"Cmd":"Ctrl",g=e.isSidebarOpen?"":"sidebar-collapsed";return html`
    <div id="navigation-bar" class="${g}">
      <div id="app-logo">
        <img src="media/logo.svg" alt="MicroPython for Bitblock" />
      </div>
      <div id="toolbar">
        ${Button({icon:e.isConnected?"ms-videogame-asset.svg":"ms-videogame-asset-off.svg",label:e.isConnected?t("toolbar.disconnect"):t("toolbar.connect"),tooltip:e.isConnected?t("toolbar.tooltip.disconnect",{shortcut:`${s}+Shift+D`}):t("toolbar.tooltip.connect",{shortcut:`${s}+Shift+C`}),onClick:()=>e.isConnected?i("disconnect"):i("connect"),active:e.isConnected,first:!0})}
        ${Button({icon:"ms-restart.svg",label:t("toolbar.reset"),tooltip:t("toolbar.tooltip.reset",{shortcut:`${s}+Shift+R`}),disabled:!r,onClick:()=>i("reset")})}
        <div class="separator"></div>

        ${Button({icon:"ms-play.svg",label:t("toolbar.run"),tooltip:t("toolbar.tooltip.run",{shortcut:`${s}+R`}),disabled:!r||e.isRunning,onClick:p=>{p.altKey?i("run-from-button",!0):i("run-from-button")}})}
        ${Button({icon:"ms-stop.svg",label:t("toolbar.stop"),tooltip:t("toolbar.tooltip.stop",{shortcut:`${s}+H`}),disabled:!r||!e.isRunning,onClick:()=>i("stop")})}

        <div class="separator"></div>

        ${Button({icon:"ms-note-add.svg",label:t("toolbar.new"),tooltip:t("toolbar.tooltip.new",{shortcut:`${s}+N`}),disabled:e.view!="editor"||e.isFirmwareUploaderOpen,onClick:()=>i("create-new-file")})}

        ${Button({icon:"ms-save.svg",label:t("toolbar.save"),tooltip:t("toolbar.tooltip.save",{shortcut:`${s}+S`}),disabled:!a||e.isFirmwareUploaderOpen,onClick:()=>i("save")})}

        <div class="separator"></div>

        ${Button({icon:"ms-deployed-code.svg",label:t("toolbar.addPackage"),disabled:!e.isConnected,tooltip:e.isConnected?t("toolbar.tooltip.addPackageEnabled"):t("toolbar.tooltip.addPackageDisabled"),onClick:()=>i("open-install-package-dialog")})}

        ${Button({icon:e.isFullscreen?"ms-fullscreen-exit.svg":"ms-fullscreen.svg",label:e.isFullscreen?t("toolbar.exitFullScreen"):t("toolbar.fullScreen"),tooltip:e.isFullscreen?t("toolbar.tooltip.exitFullScreen"):t("toolbar.tooltip.enterFullScreen"),onClick:()=>i("toggle-fullscreen")})}

        <div class="toolbar-version">${window.APP_VERSION||""}</div>
      </div>
    </div>
  `}function RunFab(e,i){if(e.view!=="editor"||!e.isConnected)return"";const a=!!e.isRunning,r=()=>i(a?"stop":"run-from-button"),s=t(a?"toolbar.stop":"toolbar.run"),p=e.panelHeight>PANEL_CLOSED?e.panelHeight+16:24;return html`
    <button class="run-fab ${a?"is-running":""}"
            style="bottom: ${p}px"
            title=${s}
            aria-label=${s}
            onclick=${r}>
      <img class="icon" src=${a?"media/ms-stop.svg":"media/ms-play.svg"} />
    </button>
  `}function FileManagerPanel(e,i){let a=t("sidebar.connectToBoard");const r=!!e.diskNavigationRoot;let s=r?`${e.diskNavigationRoot}${e.diskNavigationPath}`:t("sidebar.selectFolder");e.isConnected&&(a=`bitblock${e.boardNavigationPath}`);const g=(e.selectedFiles||[]).filter(f=>f.source==="board").length,p=(e.selectedFiles||[]).filter(f=>f.source==="disk").length,l=html`
    <div id="board-files">
      <div class="device-header">
        <img class="icon" src="media/${e.isConnected?"ms-videogame-asset.svg":"ms-videogame-asset-off.svg"}" />
        <div onclick=${()=>i("connect")} class="text">
          <span>${a}</span>
        </div>
        <button disabled=${!e.isConnected}
                onclick=${()=>i("refresh-files")}
                title=${t("sidebar.refresh")}>
          <img class="icon" src="media/ms-refresh.svg" />
        </button>
        <button disabled=${!e.isConnected} onclick=${()=>i("create-folder","board")}>
          <img class="icon" src="media/new-folder.svg" />
        </button>
        <button disabled=${!e.isConnected} onclick=${()=>i("create-file","board")}>
          <img class="icon" src="media/new-file.svg" />
        </button>
        <button disabled=${!e.isConnected||g===0}
                onclick=${()=>i("remove-files","board")}
                title=${t("sidebar.deleteBoard")}>
          <img class="icon" src="media/delete.svg" />
        </button>
      </div>
      ${BoardFileList(e,i)}
    </div>
  `,c=html`
    <div id="disk-files">
      <div class="device-header">
        <img class="icon" src="media/ms-computer.svg" />
        <div class="text" onclick=${()=>i("select-disk-navigation-root")}>
          <span>${s}</span>
        </div>
        <button disabled=${!r}
                onclick=${()=>i("refresh-files")}
                title=${t("sidebar.refresh")}>
          <img class="icon" src="media/ms-refresh.svg" />
        </button>
        <button disabled=${!r} onclick=${()=>i("create-folder","disk")}>
          <img class="icon" src="media/new-folder.svg" />
        </button>
        <button disabled=${!r} onclick=${()=>i("create-file","disk")}>
          <img class="icon" src="media/new-file.svg" />
        </button>
        <button disabled=${!r||p===0}
                onclick=${()=>i("remove-files","disk")}
                title=${t("sidebar.deleteDisk")}>
          <img class="icon" src="media/delete.svg" />
        </button>
      </div>
      ${DiskFileList(e,i)}
    </div>
  `;return html`
    <div id="file-manager" class="sidebar-files">
      ${l}
      ${FileActions(e,i)}
      ${c}
    </div>
  `}const TOPIC_VIEW_TO_FILE={mpy:"mpyTutorial",bitblock:"bitblockTutorials"},TOPIC_VIEW_TO_LABEL_KEY={mpy:"activity.mpy",bitblock:"activity.bitblock"},TOPIC_VIEW_FORCED_LANG={mpy:"ko",bitblock:"ko"};function iconBgFor(e){const i=e.iconBg&&String(e.iconBg).trim();if(i)return i;const a=e.id||"";return a.endsWith("_classifier")?"#bbf7d0":["cv2","hand","face","pose"].includes(a)?"#e9d5ff":"#bfdbfe"}function TopicListPanel(e,i,a){const r=TOPIC_VIEW_TO_FILE[a];if(!r)return html`<div class="topic-empty">${t("topic.empty")}</div>`;const s=e.topicsByFile[r];if(!s&&!e.topicsError[r]){const p=TOPIC_VIEW_FORCED_LANG[a]||e.language;i("load-topics",{key:r,lang:p})}if(e.topicsError[r])return html`
      <div class="topic-error">
        ${t("topic.error",{err:e.topicsError[r]})}
      </div>
    `;if(!s)return html`<div class="topic-loading">${t("topic.loading")}</div>`;const g=e.selectedTopicId[a];if(g){const p=s.topics.find(l=>l.id===g);if(p)return TopicDetail(e,i,a,p);e.selectedTopicId[a]=null}return html`
    <div class="topic-list">
      <header class="topic-list-header">
        <span class="material-symbols-outlined">menu_book</span>
        <span>${t(TOPIC_VIEW_TO_LABEL_KEY[a]||"activity.mpy")}</span>
      </header>
      <div class="topic-list-body">
        ${s.topics.length===0?html`<div class="topic-empty">${t("topic.empty")}</div>`:s.topics.map(p=>html`
              <button class="topic-card"
                      onclick=${()=>i("select-topic",{view:a,topicId:p.id})}>
                <span class="topic-card-icon" style=${`background:${iconBgFor(p)}`}>
                  <span class="material-symbols-outlined">${p.icon||"menu_book"}</span>
                </span>
                <span class="topic-card-text">
                  <span class="topic-card-title">${p.title}</span>
                  ${p.description?html`<span class="topic-card-desc">${p.description}</span>`:""}
                </span>
                <span class="topic-card-arrow">
                  <span class="material-symbols-outlined">arrow_forward</span>
                </span>
              </button>
            `)}
      </div>
    </div>
  `}function TopicDetail(e,i,a,r){const s=()=>i("select-topic",{view:a,topicId:null}),g=r.entries||[],p=r.entriesAfter||[],l=`topic-${a}-${r.id}`;function c(f){const h=document.getElementById(`${l}-${f}`);h&&h.scrollIntoView({block:"nearest",behavior:"smooth"})}return html`
    <div class="topic-detail">
      <div class="topic-detail-backbar">
        <button class="topic-detail-back-link" onclick=${s}>
          <span class="material-symbols-outlined">chevron_left</span>
          <span>${t("topic.back")}</span>
        </button>
      </div>
      <header class="topic-detail-header">
        <span class="topic-detail-icon" style=${`background:${iconBgFor(r)}`}>
          <span class="material-symbols-outlined">${r.icon||"help"}</span>
        </span>
        <div class="topic-detail-text">
          <h2 class="topic-detail-title">${r.title}</h2>
          ${r.description?html`<p class="topic-detail-desc">${r.description}</p>`:""}
        </div>
      </header>
      <div class="topic-detail-body">
        ${EntryToc(g,p,c)}
        ${r.notice?html`
            <div class="topic-notice">
              <span class="material-symbols-outlined topic-notice-icon">warning</span>
              <p class="topic-notice-text">${r.notice}</p>
            </div>
          `:""}
        ${r.externalLink?html`
            <div class="topic-external">
              <a class="topic-external-link"
                 href=${r.externalLink.href}
                 target="_blank"
                 rel="noopener noreferrer">
                <span class="material-symbols-outlined">${r.externalLink.icon||"open_in_new"}</span>
                <span>${r.externalLink.label}</span>
              </a>
            </div>
          `:""}
        ${g.map((f,h)=>html`
          <div id=${`${l}-b-${h}`}>
            ${EntryView(e,i,a,r.id,f,`b-${h}`)}
          </div>
        `)}
        ${p.map((f,h)=>html`
          <div id=${`${l}-a-${h}`}>
            ${EntryView(e,i,a,r.id,f,`a-${h}`)}
          </div>
        `)}
      </div>
    </div>
  `}function EntryToc(e,i,a){const r=e||[],s=i||[];if(r.length+s.length===0)return"";function p(l,c){const f=l.name&&l.name.trim()?l.name:"(\uC774\uB984 \uC5C6\uC74C)";return html`
      <button type="button"
              class="topic-toc-item"
              onclick=${()=>a(c)}>
        ${f}
      </button>
    `}return html`
    <div class="topic-toc-wrapper">
      <div class="topic-toc">
        <div class="topic-toc-title">목차</div>
        <div class="topic-toc-items">
          ${r.map((l,c)=>p(l,`b-${c}`))}
          ${r.length>0&&s.length>0?html`<div class="topic-toc-divider"></div>`:""}
          ${s.map((l,c)=>p(l,`a-${c}`))}
        </div>
      </div>
    </div>
  `}function EntryView(e,i,a,r,s,g){const p=`${a}:${r}:${g}`,c=!!!(e.collapsedEntries&&e.collapsedEntries[p]),f=Array.isArray(s.examples)?s.examples.filter(h=>{const k=h&&h.code||"",y=h&&h.description||"";return k!==""||y!==""}):[];return html`
    <article class="entry">
      <div class="entry-header">
        <h3 class="entry-name">${s.name}</h3>
        <button type="button"
                class="entry-more"
                onclick=${()=>i("toggle-entry",{key:p})}>
          <span>More</span>
          <span class="material-symbols-outlined">${c?"keyboard_arrow_up":"keyboard_arrow_down"}</span>
        </button>
      </div>

      ${s.summary?html`<p class="entry-summary">${s.summary}</p>`:""}

      ${s.extension?html`<div class="entry-extension">${s.extension}</div>`:""}

      ${s.warning?NoticeBox(s.warning,s.warningType,s.warningShowIcon):""}

      ${c&&s.details?html`<div class="entry-details-box">${s.details}</div>`:""}

      ${s.warning2?NoticeBox(s.warning2,s.warning2Type,s.warning2ShowIcon):""}

      ${c&&s.table?EntryTable(s.table):""}

      ${f.map(h=>html`
        <div class="entry-example">
          ${h.description?html`<p class="entry-example-desc">${h.description}</p>`:""}
          <div class="entry-code"
               role="button"
               tabindex="0"
               draggable="true"
               title="클릭해서 복사 · 드래그해서 에디터에 삽입"
               onclick=${()=>copyText(h.code||"")}
               ondragstart=${k=>onCodeDragStart(k,h.code||"")}
               ondragend=${onCodeDragEnd}>
            <span class="material-symbols-outlined entry-code-grip">drag_indicator</span>
            <pre class="entry-code-pre"><code>${h.code||""}</code></pre>
          </div>
        </div>
      `)}
    </article>
  `}function NoticeBox(e,i,a){const r=i||"warning",s=a!==!1,g=r==="info"?"info":r==="error"?"error":"warning";return html`
    <div class=${`entry-notice entry-notice-${r}`}>
      ${s?html`<span class="material-symbols-outlined entry-notice-icon">${g}</span>`:""}
      <div class="entry-notice-text">${e}</div>
    </div>
  `}function EntryTable(e){return html`
    <div class="entry-table-wrap">
      <table class="entry-table">
        <thead>
          <tr>
            ${(e.headers||[]).map(i=>html`<th>${i}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${(e.rows||[]).map(i=>html`
            <tr>
              ${i.map((a,r)=>html`
                <td class=${r===0?"entry-table-first":""}>${a}</td>
              `)}
            </tr>
          `)}
        </tbody>
      </table>
    </div>
  `}function copyText(e){if(e)try{navigator.clipboard&&navigator.clipboard.writeText(e)}catch(i){}}function onCodeDragStart(e,i){if(!e.dataTransfer)return;e.dataTransfer.effectAllowed="copy";const a=window.DragSnippet&&window.DragSnippet.MIME||"application/vnd.micropython-ide.code-snippet";try{e.dataTransfer.setData(a,i)}catch(r){}try{e.dataTransfer.setData("text/plain",i)}catch(r){}window.DragSnippet&&window.DragSnippet.set(i)}function onCodeDragEnd(){window.DragSnippet&&window.DragSnippet.clear()}function SettingsPanel(e,i){const a=e.language,r=window.AppShortcuts&&window.AppShortcuts.map||{},s=window.AppShortcuts&&window.AppShortcuts.displayLabel||(p=>p),g=[{accel:r.CLEAR_EDITOR,descKey:"settings.shortcuts.clearEditor"},{accel:r.RUN,descKey:"settings.shortcuts.run"},{accel:r.STOP,descKey:"settings.shortcuts.stop"}].filter(p=>p.accel);return html`
    <div class="settings-panel">
      <div class="topic-list-header">${t("settings.title")}</div>
      <div class="settings-panel-body">
        <section class="settings-card">
          <div class="settings-card-title">${t("settings.language")}</div>
          <div class="settings-card-body">
            <select id="language-select" class="settings-select">
              <option value="en" selected=${a==="en"}>English</option>
              <option value="ko" selected=${a==="ko"}>한국어</option>
            </select>
            <button class="settings-apply" onclick=${()=>{const p=document.getElementById("language-select");p&&i("set-language",p.value)}}>${t("settings.apply")}</button>
          </div>
        </section>

        <section class="settings-card">
          <div class="settings-card-title">${t("settings.shortcuts.title")}</div>
          <div class="settings-shortcut-list">
            ${g.map(p=>html`
              <div class="settings-shortcut-row">
                <kbd class="settings-shortcut-key">${s(p.accel)}</kbd>
                <span class="settings-shortcut-desc">${t(p.descKey)}</span>
              </div>
            `)}
          </div>
        </section>
      </div>
    </div>
  `}const BITBLOCK_ICON_SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5 L20.5 7.25 L20.5 16.75 L12 21.5 L3.5 16.75 L3.5 7.25 Z"/><path d="M3.5 7.25 L12 12 L20.5 7.25"/><path d="M12 12 L12 21.5"/></svg>',MPY_ICON_SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 2h20v20H2V2zm4 2h2v13H6V4zm4 4h2v13h-2V8zm4-4h2v13h-2V4zm3.5 13.5h2v2h-2v-2z"/></svg>',ACTIVITY_TOP=[{id:"explorer",icon:"folder",labelKey:"activity.explorer"},{id:"mpy",svg:MPY_ICON_SVG,labelKey:"activity.mpy"},{id:"bitblock",svg:BITBLOCK_ICON_SVG,labelKey:"activity.bitblock"}],ACTIVITY_BOTTOM=[{id:"settings",icon:"settings",labelKey:"activity.settings"}];function renderSvgIcon(e){const i=document.createElement("span");return i.className="activity-icon activity-svg-icon",i.innerHTML=e,i}function ActivityBar(e,i){const a=s=>{const g=e.activeView===s.id,p=()=>{if(g&&e.isSidebarOpen){if(s.id==="mpy"||s.id==="bitblock"){e.selectedTopicId[s.id]&&i("select-topic",{view:s.id,topicId:null});return}i("toggle-sidebar");return}i("set-active-view",s.id),e.isSidebarOpen||i("toggle-sidebar")},l="activity-item"+(g?" is-active":""),c=t(s.labelKey),f=s.svg?renderSvgIcon(s.svg):html`<span class="material-symbols-outlined activity-icon">${s.icon}</span>`;return html`
      <button class="${l}"
              title=${c}
              aria-label=${c}
              onclick=${p}>
        ${f}
        <span class="activity-label">${c}</span>
      </button>
    `},r=html`<div class="activity-divider" role="separator" aria-orientation="horizontal"></div>`;return html`
    <nav class="activity-bar" aria-label="activity">
      <div class="activity-group activity-top">
        ${a(ACTIVITY_TOP[0])}
        ${r}
        ${ACTIVITY_TOP.slice(1).map(a)}
      </div>
      <div class="activity-group activity-bottom">${ACTIVITY_BOTTOM.map(a)}</div>
    </nav>
  `}function Sidebar(e,i){const a=!!e.isSidebarOpen,r="app-sidebar"+(a?"":" collapsed"),s=a?"chevron_left":"chevron_right",g=a?`flex: 0 0 ${e.sidebarWidth}px; width: ${e.sidebarWidth}px;`:"";let p;switch(e.activeView){case"mpy":p=TopicListPanel(e,i,"mpy");break;case"bitblock":p=TopicListPanel(e,i,"bitblock");break;case"settings":p=SettingsPanel(e,i);break;default:p=FileManagerPanel(e,i);break}return html`
    <aside class="${r}" style=${g}>
      ${p}
      <button class="sidebar-toggle"
              onclick=${()=>i("toggle-sidebar")}
              aria-label=${t("sidebar.toggle")}
              title=${t(a?"sidebar.hideFiles":"sidebar.showFiles")}>
        <span class="material-symbols-outlined">${s}</span>
      </button>
    </aside>
  `}const SIDEBAR_WIDTH_MIN_UI=180,SIDEBAR_WIDTH_MAX_UI=600,SIDEBAR_WIDTH_DEFAULT_UI=400;function startSidebarDrag(e,i,a){e.preventDefault();const r=e.clientX,s=document.querySelector(".app-sidebar");let g=a;function p(c){const f=Math.max(SIDEBAR_WIDTH_MIN_UI,Math.min(SIDEBAR_WIDTH_MAX_UI,a+(c.clientX-r)));g=f,s&&(s.style.flex=`0 0 ${f}px`,s.style.width=`${f}px`)}function l(){window.removeEventListener("mousemove",p),window.removeEventListener("mouseup",l),document.body.classList.remove("is-resizing-sidebar"),i("set-sidebar-width",g)}document.body.classList.add("is-resizing-sidebar"),window.addEventListener("mousemove",p),window.addEventListener("mouseup",l)}function SidebarResizer(e,i){const a="sidebar-resizer"+(e.isSidebarOpen?"":" is-hidden");return html`
    <div class="${a}"
         role="separator"
         aria-orientation="vertical"
         title="Drag to resize · Double-click to reset"
         onmousedown=${r=>e.isSidebarOpen&&startSidebarDrag(r,i,e.sidebarWidth)}
         ondblclick=${()=>e.isSidebarOpen&&i("set-sidebar-width",SIDEBAR_WIDTH_DEFAULT_UI)}>
    </div>
  `}function FirmwareUploader(e,i){if(!e.isFirmwareUploaderOpen)return html`<div class="firmware-uploader closed"></div>`;const a=e.fw,s=window.FirmwareConfig.FIRMWARE_VERSIONS.filter(l=>l.board===a.activeTab),g=a.isConnected&&!a.isUploading&&!!a.selectedVersion;window.__fwScrollPending||(window.__fwScrollPending=!0,requestAnimationFrame(()=>{window.__fwScrollPending=!1;const l=document.querySelector(".firmware-uploader .log-container");l&&(l.scrollTop=l.scrollHeight)}));function p(){a.uploadStatus==="success"?i("disconnect"):i("fw-upload")}return html`
    <div class="firmware-uploader open">
      <div class="firmware-uploader-titlebar">
        <div class="firmware-uploader-title">${t("firmware.title")}</div>
        <button class="firmware-uploader-close"
                type="button"
                aria-label=${t("firmware.close")}
                onclick=${()=>i("close-firmware-uploader")}>×</button>
      </div>
      <div class="firmware-uploader-body">
        <div class="layout">
          <div class="col-left">
            <section class="panel">
              <div class="panel-header">
                <h2>${t("firmware.serial.title")}</h2>
              </div>
              <div class="panel-body">
                <div class="setting-row">
                  <label>${t("firmware.serial.baudRate")}</label>
                  <select
                    onchange=${l=>i("fw-set-baud",l.target.value)}
                    disabled=${a.isConnected}>
                    <option value="115200" selected=${a.baudRate===115200}>115,200</option>
                    <option value="230400" selected=${a.baudRate===230400}>230,400</option>
                    <option value="460800" selected=${a.baudRate===460800}>460,800</option>
                    <option value="921600" selected=${a.baudRate===921600}>${t("firmware.serial.baudDefault")}</option>
                  </select>
                </div>

                <p class="help-text">${t("firmware.serial.help")}</p>
              </div>
            </section>
          </div>

          <div class="col-right">
            <section class="panel">
              <div class="panel-header">
                <h2>${t("firmware.select.title")}</h2>
              </div>
              <div class="panel-body">
                <div class="version-list">
                  ${s.map(l=>html`
                    <div
                      class=${`version-card ${a.selectedVersion===l.id?"selected":""}`}
                      onclick=${()=>i("fw-select-version",l.id)}>
                      <div class="version-card-top">
                        <div class="version-info">
                          <img src=${l.image} alt=${l.board} class="version-board-img"
                               onerror=${c=>{c.target.style.display="none"}} />
                          <div>
                            <span class="version-number">${t(l.labelKey)}</span>
                            <span class=${`version-tag tag-${l.tag}`}>${t("firmware.tag."+l.tag)}</span>
                          </div>
                        </div>
                        <span class="version-date">${l.version}</span>
                      </div>
                      <p class="version-desc">${t(l.descriptionKey)}</p>
                      <div class="version-meta"><span>${l.date}</span></div>
                      ${a.selectedVersion===l.id?html`
                        <div class="version-changelog">
                          <ul>
                            ${l.changelogKeys.map(c=>html`<li>${t(c)}</li>`)}
                          </ul>
                        </div>
                      `:""}
                    </div>
                  `)}
                </div>
              </div>
            </section>

            <section class="panel upload-panel">
              <div class="panel-body">
                ${a.uploadStatus==="uploading"?html`
                  <div class="progress-container">
                    <div class="progress-header">
                      <span>${t("firmware.upload.progressLabel")}</span>
                      <span class="progress-pct">${a.uploadProgress}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" style=${`width:${a.uploadProgress}%`}></div>
                    </div>
                  </div>
                `:""}

                ${a.uploadStatus==="error"?html`
                  <div class="upload-result error">
                    <span>${t("firmware.upload.error")}</span>
                  </div>
                `:""}

                <button
                  class="btn btn-upload"
                  onclick=${p}
                  disabled=${a.uploadStatus!=="success"&&!g}>
                  ${a.isUploading?html`<span class="spinner"></span> ${t("firmware.upload.uploading")}`:a.uploadStatus==="success"?t("firmware.upload.done"):html`<span class="material-symbols-outlined">upload_2</span> ${t("firmware.upload.button")}`}
                </button>
              </div>
            </section>
          </div>
        </div>

        <section class="panel log-panel">
          <div class="log-container log-container-grow">
            ${a.logs.length===0?html`<div class="log-empty">${t("firmware.log.empty")}</div>`:a.logs.map(l=>html`
                  <div class=${`log-entry log-${l.type}`}>
                    <span class="log-time">${l.timestamp}</span>
                    <span class="log-badge">${l.type.toUpperCase()}</span>
                    <span class="log-msg">${l.message}</span>
                  </div>
                `)}
          </div>
        </section>
        <div class="log-spacer"></div>
      </div>
    </div>
  `}function Overlay(e,i){const a=html`<span class="material-symbols-outlined overlay-spinner">hourglass_empty</span>`,r=g=>html`<div class="overlay-message">${a}<span>${g}</span></div>`;let s=html`<div id="overlay" class="closed"></div>`;return e.diskFiles==null&&(i("load-disk-files"),s=html`<div id="overlay" class="open">${r(t("overlay.loading"))}</div>`),e.isRemoving&&(s=html`<div id="overlay" class="open">${r(t("overlay.removing"))}</div>`),e.isConnecting&&(s=html`<div id="overlay" class="open">${r(t("overlay.connecting"))}</div>`),e.isLoadingFiles&&(s=html`<div id="overlay" class="open">${r(t("overlay.loading"))}</div>`),e.isSaving&&(s=html`<div id="overlay" class="open">${r(t("overlay.saving",{progress:e.savingProgress}))}</div>`),e.isTransferring&&(s=html`<div id="overlay" class="open">${r(html`${t("overlay.transferring")}<br><br>${e.transferringProgress}`)}</div>`),s}function EditorView(e,i){return html`
    <div class="working-area">
      ${Tabs(e,i)}
      ${CodeEditor(e,i)}
      ${ReplPanel(e,i)}
      ${RunFab(e,i)}
    </div>
  `}(function(){function e(...g){return g.filter(l=>l!=null&&l!=="").map(l=>String(l)).join("/").replace(/\/+/g,"/")}function i(...g){let p=e(...g);return p.startsWith("/")||(p="/"+p),p.replace(/\/+/g,"/")}function a(g){if(!g)return"/";const p=String(g).replace(/\/+$/,"");if(p===""||p==="/")return"/";const l=p.lastIndexOf("/");return l<=0?"/":p.slice(0,l)}function r(g){const p=String(g||"").replace(/\/+$/,""),l=p.lastIndexOf("/");return l===-1?p:p.slice(l+1)}function s(g){return g?String(g).replace(/\\/g,"/").replace(/\/+/g,"/").replace(/^\/+/,""):""}window.PosixPath={join:e,resolve:i,dirname:a,basename:r,normalize:s}})(),(function(){const e={CLOSE:"CommandOrControl+Shift+W",CONNECT:"CommandOrControl+Shift+C",DISCONNECT:"CommandOrControl+Shift+D",RUN:"F5",RUN_SELECTION:"CommandOrControl+Alt+Enter",RUN_SELECTION_WL:"CommandOrControl+Alt+S",STOP:"Shift+F5",RESET:"CommandOrControl+Shift+R",NEW:"CommandOrControl+N",SAVE:"CommandOrControl+S",CLEAR_TERMINAL:"CommandOrControl+L",CLEAR_EDITOR:"CommandOrControl+D",EDITOR_VIEW:"CommandOrControl+Alt+1",FILES_VIEW:"CommandOrControl+Alt+2"};function i(){const r=navigator.userAgentData&&navigator.userAgentData.platform||navigator.platform||"";return/mac|darwin/i.test(r)}function a(r){if(!r)return"";const s=i();return r.replace("CommandOrControl",s?"Cmd":"Ctrl").replace("CmdOrCtrl",s?"Cmd":"Ctrl").replace("Alt",s?"Option":"Alt")}window.AppShortcuts={map:e,displayLabel:a,isMacPlatform:i}})(),(function(){const e="micropython-ide-fsa",a="handles",r="diskRoot";function s(){return new Promise((h,k)=>{const y=indexedDB.open(e,1);y.onupgradeneeded=()=>{const F=y.result;F.objectStoreNames.contains(a)||F.createObjectStore(a)},y.onsuccess=()=>h(y.result),y.onerror=()=>k(y.error)})}async function g(h){const k=await s();try{await new Promise((y,F)=>{const n=k.transaction(a,"readwrite");n.objectStore(a).put(h,r),n.oncomplete=()=>y(),n.onerror=()=>F(n.error),n.onabort=()=>F(n.error)})}finally{k.close()}}async function p(){const h=await s();try{return await new Promise((k,y)=>{const n=h.transaction(a,"readonly").objectStore(a).get(r);n.onsuccess=()=>k(n.result||null),n.onerror=()=>y(n.error)})}finally{h.close()}}async function l(){const h=await s();try{await new Promise((k,y)=>{const F=h.transaction(a,"readwrite");F.objectStore(a).delete(r),F.oncomplete=()=>k(),F.onerror=()=>y(F.error)})}finally{h.close()}}async function c(h,k="readwrite"){const y={mode:k};return typeof h.queryPermission=="function"&&await h.queryPermission(y)==="granted"||typeof h.requestPermission=="function"&&await h.requestPermission(y)==="granted"}async function f(h,k="readwrite"){return typeof h.queryPermission!="function"?!1:await h.queryPermission({mode:k})==="granted"}window.FsaHandleStore={saveHandle:g,loadHandle:p,clearHandle:l,verifyPermission:c,queryPermissionOnly:f}})(),(function(){let e=!1;function i(){if(e)return;e=!0;const r=`
      .app-dialog {
        border: none;
        border-radius: 6px;
        padding: 0;
        max-width: 460px;
        font-family: inherit;
        color: #222;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      }
      .app-dialog::backdrop { background: rgba(0,0,0,0.45); }
      .app-dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px 12px;
        gap: 12px;
        border-bottom: 1px solid #e0e0e0;
      }
      .app-dialog-title {
        font-weight: 700;
        font-size: 22.5px;
        color: #111;
      }
      .app-dialog-close {
        background: none;
        border: none;
        cursor: pointer;
        /* Match right-padding with .app-dialog-buttons button so the X
           and the last action button line up on the same vertical axis. */
        padding: 2px 2px 2px 8px;
        color: #d32f2f;
        font-size: 30px;
        line-height: 1;
      }
      .app-dialog-close:hover { color: #a10e0e; }
      .app-dialog-body { padding: 14px 18px; }
      .app-dialog-message {
        margin: 0;
        white-space: pre-wrap;
        font-size: 18px;
        line-height: 1.5;
      }
      .app-dialog-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 32px;
        /* Right padding is larger than the header's 18px so the last
           action button's visible right edge lands slightly inside the
           X button's right edge instead of overshooting due to font
           metric differences between 'L' (minimal right bearing) and
           '\xD7' (notable right bearing). */
        padding: 10px 30px 14px 18px;
        box-sizing: border-box;
        max-width: 100%;
      }
      .app-dialog-buttons button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px 2px;
        font-family: inherit;
        font-size: 20px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: #888;
        max-width: 100%;
      }
      .app-dialog-buttons button:hover { color: #444; }
      .app-dialog-buttons button.app-dialog-default {
        font-weight: 700;
        color: #1976d2;
      }
      .app-dialog-buttons button.app-dialog-default:hover { color: #1565c0; }
    `,s=document.createElement("style");s.textContent=r,document.head.appendChild(s)}function a(r){i();const s=r&&r.buttons||["OK"],g=r&&r.defaultId!=null?r.defaultId:0,p=r&&r.cancelId!=null?r.cancelId:-1,l=r&&r.message||"",c=r&&r.title||"";return new Promise(f=>{const h=document.createElement("dialog");h.className="app-dialog",h.setAttribute("data-dialog-type",r&&r.type||"info");let k=!1;function y(P){if(!k){k=!0;try{h.close()}catch(R){}h.parentNode&&h.parentNode.removeChild(h),f(P!==p)}}const F=()=>y(p===-1?s.length:p),n=document.createElement("div");n.className="app-dialog-header";const o=document.createElement("div");o.className="app-dialog-title",o.textContent=c,n.appendChild(o);const d=document.createElement("button");d.className="app-dialog-close",d.type="button",d.setAttribute("aria-label","Close"),d.textContent="\xD7",d.addEventListener("click",F),n.appendChild(d),h.appendChild(n);const u=document.createElement("div");u.className="app-dialog-body";const v=document.createElement("p");v.className="app-dialog-message",v.textContent=l,u.appendChild(v),h.appendChild(u);const w=document.createElement("div");w.className="app-dialog-buttons",s.forEach((P,R)=>{const O=document.createElement("button");O.type="button",O.textContent=P,R===g&&O.classList.add("app-dialog-default"),O.addEventListener("click",()=>y(R)),w.appendChild(O)}),h.appendChild(w),h.addEventListener("cancel",P=>{P.preventDefault(),F()}),document.body.appendChild(h),h.showModal();const S=w.querySelector(".app-dialog-default");S&&S.focus()})}window.AppDialog={openDialog:a}})(),(function(){if(!window.AppShortcuts){console.error("[shortcut-manager] AppShortcuts not loaded");return}const e=window.AppShortcuts.isMacPlatform(),i=[],a=[];let r=!1;function s(F){const n=e?F.metaKey:F.ctrlKey,o=typeof F.key=="string"&&/^F\d{1,2}$/.test(F.key);if(!n&&!o)return null;const d=[];n&&d.push("CommandOrControl"),F.altKey&&d.push("Alt"),F.shiftKey&&d.push("Shift");let u=null;return o?u=F.key:F.code&&F.code.startsWith("Key")?u=F.code.slice(3).toUpperCase():F.code&&F.code.startsWith("Digit")?u=F.code.slice(5):F.key==="Enter"?u="Enter":F.key===" "?u="Space":F.key&&F.key.length===1?u=F.key.toUpperCase():u=F.key,u?(d.push(u),d.join("+")):null}function g(){const F=window.AppShortcuts.map,n=new Set;for(const o of Object.keys(F))n.add(F[o]);return n}let p=g();function l(F){if(!F)return!1;const n=(F.tagName||"").toLowerCase();return!!(n==="input"||n==="textarea"||n==="select"||F.isContentEditable)}function c(F){if(r||i.length===0)return;const n=s(F);if(n&&p.has(n)){F.preventDefault(),F.stopPropagation();for(const o of i)try{o(n)}catch(d){console.error("[shortcut]",d)}}}window.addEventListener("keydown",c,!0);function f(F){typeof F=="function"&&i.push(F)}function h(F){typeof F=="function"&&a.push(F)}function k(F){r=!!F;for(const n of a)try{n(r)}catch(o){console.error("[disable-shortcuts]",o)}}function y(F){for(const n of i)try{n(F)}catch(o){console.error("[shortcut/menu]",o)}}window.AppShortcutManager={onShortcut:f,onDisableShortcuts:h,setSuppressed:k,dispatchAccelerator:y,eventToAccelerator:s,refreshKnown:()=>{p=g()}}})(),(function(){const e=f=>()=>Promise.reject(new Error(`not implemented yet: ${f}`));window.PosixPath||console.error("[web-bridges] PosixPath not loaded \u2014 check script order");const i=window.PosixPath||{join:(...f)=>f.filter(Boolean).join("/").replace(/\/+/g,"/"),resolve:(...f)=>"/"+f.filter(Boolean).join("/").replace(/\/+/g,"/"),dirname:f=>(f||"/").replace(/\/[^/]*$/,"")||"/"},a=i.join,r=i.resolve,s=i.dirname;window.BridgeSerial={loadPorts:e("BridgeSerial.loadPorts"),requestPort:e("BridgeSerial.requestPort"),connect:e("BridgeSerial.connect"),disconnect:e("BridgeSerial.disconnect"),run:e("BridgeSerial.run"),execFile:e("BridgeSerial.execFile"),getPrompt:e("BridgeSerial.getPrompt"),keyboardInterrupt:e("BridgeSerial.keyboardInterrupt"),reset:e("BridgeSerial.reset"),eval:e("BridgeSerial.eval"),onData:()=>{},listFiles:e("BridgeSerial.listFiles"),ilistFiles:e("BridgeSerial.ilistFiles"),loadFile:e("BridgeSerial.loadFile"),removeFile:e("BridgeSerial.removeFile"),saveFileContent:e("BridgeSerial.saveFileContent"),uploadFile:e("BridgeSerial.uploadFile"),downloadFile:e("BridgeSerial.downloadFile"),renameFile:e("BridgeSerial.renameFile"),onConnectionClosed:()=>{},createFolder:e("BridgeSerial.createFolder"),removeFolder:e("BridgeSerial.removeFolder"),fileExists:e("BridgeSerial.fileExists"),getNavigationPath:(f,h)=>h===".."?s(f):a(f,h),getFullPath:(f,h,k)=>a(f,(h||"").replace(/\\/g,"/"),(k||"").replace(/\\/g,"/")),getParentPath:f=>s(f)},window.BridgeDisk={openFolder:e("BridgeDisk.openFolder"),listFiles:e("BridgeDisk.listFiles"),ilistFiles:e("BridgeDisk.ilistFiles"),ilistAllFiles:e("BridgeDisk.ilistAllFiles"),loadFile:e("BridgeDisk.loadFile"),loadFileBytes:e("BridgeDisk.loadFileBytes"),removeFile:e("BridgeDisk.removeFile"),saveFileContent:e("BridgeDisk.saveFileContent"),renameFile:e("BridgeDisk.renameFile"),createFolder:e("BridgeDisk.createFolder"),removeFolder:e("BridgeDisk.removeFolder"),fileExists:e("BridgeDisk.fileExists"),getAppPath:()=>Promise.resolve("./"),getNavigationPath:(f,h)=>h===".."?s(f):a(f,h),getFullPath:(f,h,k)=>r(f,(h||"").replace(/\\/g,"/"),(k||"").replace(/\\/g,"/")),getParentPath:f=>s(f)};const g={CLOSE:"CommandOrControl+Shift+W",CONNECT:"CommandOrControl+Shift+C",DISCONNECT:"CommandOrControl+Shift+D",RUN:"F5",RUN_SELECTION:"CommandOrControl+Alt+Enter",RUN_SELECTION_WL:"CommandOrControl+Alt+S",STOP:"Shift+F5",RESET:"CommandOrControl+Shift+R",NEW:"CommandOrControl+N",SAVE:"CommandOrControl+S",CLEAR_TERMINAL:"CommandOrControl+L",CLEAR_EDITOR:"CommandOrControl+D",EDITOR_VIEW:"CommandOrControl+Alt+1",FILES_VIEW:"CommandOrControl+Alt+2"},p=window.AppShortcuts&&window.AppShortcuts.map||g;function l(){const h=(navigator.userAgentData&&navigator.userAgentData.platform||navigator.platform||"").toLowerCase();return h.includes("win")?"win32":h.includes("mac")?"darwin":h.includes("linux")?"linux":"unknown"}const c=l();window.BridgeWindow={setWindowSize:()=>{},onKeyboardShortcut:()=>{},onDisableShortcuts:()=>{},beforeClose:()=>{},confirmClose:()=>Promise.resolve(),isPackaged:()=>Promise.resolve(!1),openDialog:e("BridgeWindow.openDialog"),getOS:()=>c,isWindows:()=>c==="win32",isMac:()=>c==="darwin",isLinux:()=>c==="linux",updateMenuState:()=>Promise.resolve(),getShortcuts:()=>p},window.launchApp=async(f,h)=>{const k=h||f;k&&window.open(k,"_blank","noopener,noreferrer")}})(),(function(){const e=typeof navigator!="undefined"&&"serial"in navigator;function i(p){return new Promise(l=>setTimeout(l,p))}function a(p){return p.replace(/\r\n/g,`
`)}function r(p){return p.slice(2,-3)}function s(p,l=2,c=3){return p.slice(l,-c).split(",").filter(h=>h.length>0).map(Number)}class g{constructor(){this.port=null,this.writer=null,this.reader=null,this._readLoopPromise=null,this._matcher=null,this._inboundBuffer="",this._dataListener=null,this._closeListener=null,this.reject_run=null,this.write_chunk_size=128,this.write_chunk_sleep=10,this.fs_chunk_size=48}async list_ports(){if(!e)throw new Error("Web Serial API not supported in this browser");return(await navigator.serial.getPorts()).map(c=>{const f=c.getInfo&&c.getInfo()||{};return{path:f.usbVendorId!=null?`bitblock:${f.usbVendorId.toString(16)}:${(f.usbProductId||0).toString(16)}`:"serial",vendorId:f.usbVendorId,productId:f.usbProductId,_port:c}})}async request_port(l){if(!e)throw new Error("Web Serial API not supported in this browser");const c=l?{filters:l}:{};return await navigator.serial.requestPort(c)}async open(l){if(!e)throw new Error("Web Serial API not supported in this browser");this.port&&await this.close();let c;l&&l._port?c=l._port:l&&typeof l.open=="function"?c=l:c=await navigator.serial.requestPort(),await c.open({baudRate:115200}),this.port=c,this.writer=c.writable.getWriter(),this._startReadLoop()}_startReadLoop(){const l=new TextDecoder;this._readLoopPromise=(async()=>{for(;this.port&&this.port.readable;){let c;try{c=this.port.readable.getReader()}catch(f){break}this.reader=c;try{for(;;){const{value:f,done:h}=await c.read();if(h)break;if(f&&f.byteLength>0){const k=l.decode(f,{stream:!0});this._onIncomingText(k)}}}catch(f){break}finally{try{c.releaseLock()}catch(f){}this.reader=null}}this._onClose()})()}_onIncomingText(l){if(this._dataListener)try{this._dataListener(l)}catch(c){}if(this._matcher){if(this._matcher.buffer+=l,this._matcher.dc)try{this._matcher.dc(l)}catch(f){}const c=this._matcher.buffer.indexOf(this._matcher.ending);if(c!==-1){const f=this._matcher;this._matcher=null;const h=f.buffer.slice(0,c+f.ending.length);this._inboundBuffer=f.buffer.slice(c+f.ending.length),f.resolve(h)}}else this._inboundBuffer+=l}_onClose(){const l=this._closeListener;if(l)try{l()}catch(c){}if(this._matcher){const c=this._matcher;this._matcher=null,c.reject(new Error("serial connection closed"))}}async close(){if(this.reject_run){try{this.reject_run(new Error("pre close"))}catch(c){}this.reject_run=null}const l=this.port;this.port=null;try{this.reader&&await this.reader.cancel()}catch(c){}try{this.writer&&(await this.writer.close().catch(()=>{}),this.writer.releaseLock())}catch(c){}this.writer=null,this.reader=null;try{l&&await l.close()}catch(c){}}on_data(l){this._dataListener=l}on_close(l){this._closeListener=l}read_until(l,c){return new Promise((f,h)=>{if(this._matcher){const F=this._matcher;this._matcher=null,F.reject(new Error("superseded"))}const k=this._inboundBuffer;this._inboundBuffer="";const y=k.indexOf(l);if(y!==-1){const F=k.slice(0,y+l.length);return this._inboundBuffer=k.slice(y+l.length),f(F)}this._matcher={ending:l,dc:c,buffer:k,resolve:f,reject:h}})}async write_and_read_until(l,c,f){if(!this.writer)throw new Error("serial not open");this._inboundBuffer="";const h=new TextEncoder,k=this.write_chunk_size,y=this.write_chunk_sleep;for(let n=0;n<l.length;n+=k){const o=l.slice(n,n+k);await this.writer.write(h.encode(o)),await i(y)}let F;return c&&(F=await this.read_until(c,f)),await i(y),F}async get_prompt(){return await i(150),await this.stop(),await i(150),await this.write_and_read_until("\r",`\r
>>>`)}async enter_raw_repl(){return await this.write_and_read_until("","raw REPL; CTRL-B to exit")}async exit_raw_repl(){return await this.write_and_read_until("",`\r
>>>`)}async exec_raw(l,c){return await this.write_and_read_until(l),await this.write_and_read_until("",">",c)}async execfile(l,c){const f=typeof l=="string"?l:new TextDecoder().decode(l);await this.enter_raw_repl();const h=await this.exec_raw(f,c);return await this.exit_raw_repl(),h}async run(l,c){const f=c||function(){};return new Promise(async(h,k)=>{this.reject_run&&(this.reject_run(new Error("re-run")),this.reject_run=null),this.reject_run=k;try{await this.enter_raw_repl();const y=await this.exec_raw(l||"#",f);await this.exit_raw_repl(),this.reject_run=null,h(y)}catch(y){this.reject_run=null,k(y)}})}async eval(l){if(!this.writer)throw new Error("serial not open");await this.writer.write(new TextEncoder().encode(l))}async stop(){if(this.reject_run){try{this.reject_run(new Error("pre stop"))}catch(l){}this.reject_run=null}this.writer&&await this.writer.write(new TextEncoder().encode(""))}async reset(){if(this.reject_run){try{this.reject_run(new Error("pre reset"))}catch(l){}this.reject_run=null}this.writer&&(await this.writer.write(new TextEncoder().encode("")),await this.writer.write(new TextEncoder().encode("")))}async fs_exists(l){l=l||"";let c=`try:
`;c+=`  f = open("${l}", "r")
`,c+=`  print(1)
`,c+=`except OSError:
`,c+=`  print(0)
`,c+=`del f
`,await this.enter_raw_repl();const f=await this.exec_raw(c);return await this.exit_raw_repl(),f[2]==="1"}async fs_ls(l){l=l||"";let c=`import os
`;c+=`try:
`,c+=`  print(os.listdir("${l}"))
`,c+=`except OSError:
`,c+=`  print([])
`,await this.enter_raw_repl();let f=await this.exec_raw(c);return await this.exit_raw_repl(),f=r(f).replace(/'/g,'"'),JSON.parse(f)}async fs_ils(l){l=l||"";let c=`import os
`;c+=`try:
`,c+=`  l=[]
`,c+=`  f=None
`,c+=`  for f in os.ilistdir("${l}"):
`,c+=`    l.append(list(f))
`,c+=`  print(l)
`,c+=`except OSError:
`,c+=`  print([])
`,c+=`del l
`,c+=`if f:del f
`,await this.enter_raw_repl();let f=await this.exec_raw(c);return await this.exit_raw_repl(),f=r(f).replace(/'/g,'"').split("OK"),JSON.parse(f)}async fs_cat_binary(l){if(!l)throw new Error("Path to file was not specified");await this.enter_raw_repl();const c=256;let f=`with open('${l}','rb') as f:
`;f+=`  while 1:
`,f+=`    b=f.read(${c})
`,f+=`    if not b:break
`,f+=`    print(",".join(str(e) for e in b),end=",")
`,f+=`del f
`,f+=`del b
`;let h=await this.exec_raw(f);await this.exit_raw_repl();const k=s(h,2,4);return new Uint8Array(k)}async fs_cat(l){if(!l)throw new Error("Path to file was not specified");await this.enter_raw_repl();const c=`with open('${l}','r') as f:
 while 1:
  b=f.read(256)
  if not b:break
  print(b,end='')
del f
del b
`;let f=await this.exec_raw(c);return await this.exit_raw_repl(),a(r(f))}async fs_put(l,c,f){if(!l||!c)throw new Error("Must specify source bytes and destination");const h=f||function(){},k=l instanceof Uint8Array?l:l instanceof ArrayBuffer?new Uint8Array(l):new TextEncoder().encode(String(l));let y="";y+=await this.enter_raw_repl(),y+=await this.exec_raw(`f=open('${c}','wb')
w=f.write`);const F=this.fs_chunk_size;for(let n=0;n<k.length;n+=F){const o=k.subarray(n,n+F);y+=await this.exec_raw(`w(bytes([${o}]))`),h(parseInt(n/k.length*100)+"%")}return y+=await this.exec_raw(`f.close()
del f
del w
`),y+=await this.exit_raw_repl(),h("100%"),y}async fs_save(l,c,f){if(l==null||!c)throw new Error("Must specify content and destination path");const h=f||function(){},k=typeof l=="string"?new TextEncoder().encode(l):l instanceof Uint8Array?l:new Uint8Array(l);let y="";y+=await this.enter_raw_repl(),y+=await this.exec_raw(`f=open('${c}','wb')
w=f.write`);const F=this.fs_chunk_size;for(let n=0;n<k.length;n+=F){const o=k.subarray(n,n+F);y+=await this.exec_raw(`w(bytes([${o}]))`),h(parseInt(n/k.length*100)+"%")}return y+=await this.exec_raw(`f.close()
del f
del w
`),y+=await this.exit_raw_repl(),h("100%"),y}async fs_mkdir(l){if(!l)throw new Error("Path required");await this.enter_raw_repl();const c=await this.exec_raw(`import os
os.mkdir('${l}')`);return await this.exit_raw_repl(),c}async fs_rmdir(l){if(!l)throw new Error("Path required");let c=`import os
`;c+=`try:
`,c+=`  os.rmdir("${l}")
`,c+=`except OSError:
`,c+=`  print(0)
`,await this.enter_raw_repl();const f=await this.exec_raw(c);return await this.exit_raw_repl(),f}async fs_rm(l){if(!l)throw new Error("Path required");let c=`import os
`;c+=`try:
`,c+=`  os.remove("${l}")
`,c+=`except OSError:
`,c+=`  print(0)
`,await this.enter_raw_repl();const f=await this.exec_raw(c);return await this.exit_raw_repl(),f}async fs_rename(l,c){if(!l||!c)throw new Error("Both paths required");await this.enter_raw_repl();const f=await this.exec_raw(`import os
os.rename('${l}', '${c}')`);return await this.exit_raw_repl(),f}}typeof window!="undefined"&&(window.MicroPythonWeb=g),typeof module!="undefined"&&module.exports&&(module.exports={MicroPythonWeb:g,extract:r,extractBytes:s,fixLineBreak:a})})(),(function(){if(!window.MicroPythonWeb){console.error("[BridgeSerial] MicroPythonWeb not loaded \u2014 check script order in index.html");return}const e=new window.MicroPythonWeb;let i=[],a=null,r=null;async function s(){if(a!=null)return a;if(r)return r;r=(async()=>{const b=await fetch("helpers.py",{cache:"no-cache"});if(!b.ok)throw new Error(`helpers.py fetch failed: HTTP ${b.status}`);return a=await b.text(),a})();try{return await r}finally{r=null}}let g=null,p=null;e.on_data(b=>{g&&g(b)}),e.on_close(()=>{p&&p()});async function l(){const b=await e.list_ports();return i=b,b.filter(E=>E.vendorId!=null&&E.productId!=null).map(E=>({path:E.path,vendorId:E.vendorId,productId:E.productId}))}function c(b){return i.find(E=>E.path===b)||null}const f=[{usbVendorId:12346,usbProductId:16385}],h=[{usbVendorId:12346,usbProductId:4097}];window.FIRMWARE_PORT_FILTERS=h;async function k(b={}){const E=b.firmware?h:f;let x;try{x=await e.request_port(E)}catch(L){if(L&&(L.name==="NotFoundError"||/No port selected/i.test(L.message||"")))return null;throw L}i=await e.list_ports();const D=i.find(L=>L._port===x);return!D||D.vendorId==null||D.productId==null?null:{path:D.path,vendorId:D.vendorId,productId:D.productId}}async function y(b){let E=c(b);if(E||(i=await e.list_ports(),E=c(b)),!E)throw new Error(`Port not found: ${b}. Try clicking Connect again to re-authorize.`);await e.open(E),s().catch(()=>{})}async function F(){return await e.close()}function n(b){return e.run(b)}async function o(b){const E=await s();return await e.execfile(E)}function d(){return e.get_prompt()}function u(b){return e.eval(b)}function v(){return e.stop()}async function w(){await e.stop();try{await e.exit_raw_repl()}catch(b){}await e.reset()}function S(b){return e.fs_ls(b)}function P(b){return e.fs_ils(b)}async function R(b){return await e.fs_cat_binary(b)||new Uint8Array}function O(b){return e.fs_rm(b)}function M(b,E){return e.fs_rename(b,E)}function C(b){return e.fs_mkdir(b)}function N(b){return e.fs_rmdir(b)}async function T(b,E,x){return await e.fs_save(E||" ",b,x||function(){})}async function I(b,E,x){if(!window.BridgeDisk||!window.BridgeDisk.loadFileBytes)throw new Error("BridgeDisk.loadFileBytes is required for uploadFile (Phase 3)");const D=await window.BridgeDisk.loadFileBytes(b),L=String(E).replace(/\\/g,"/");return await e.fs_put(D,L,x||function(){})}async function A(b,E){if(!window.BridgeDisk||!window.BridgeDisk.saveFileContent)throw new Error("BridgeDisk.saveFileContent is required for downloadFile (Phase 3)");const x=await e.fs_cat_binary(b);return await window.BridgeDisk.saveFileContent(E,x)}async function m(b){const E=await e.run(`
import os
try:
  os.stat("${b}")
  print(0)
except OSError:
  print(1)
`);return E&&E[2]==="0"}function $(b){g=b}function _(b){p=b}Object.assign(window.BridgeSerial,{loadPorts:l,requestPort:k,connect:y,disconnect:F,run:n,execFile:o,getPrompt:d,keyboardInterrupt:v,reset:w,eval:u,onData:$,listFiles:S,ilistFiles:P,loadFile:R,removeFile:O,saveFileContent:T,uploadFile:I,downloadFile:A,renameFile:M,onConnectionClosed:_,createFolder:C,removeFolder:N,fileExists:m}),window.__micropython=e})(),(function(){if(!window.PosixPath||!window.FsaHandleStore){console.error("[BridgeDisk] Required modules missing \u2014 check script order in index.html");return}const e=window.PosixPath,i=window.FsaHandleStore;let a=null,r=null;const s=(async()=>{try{const C=await i.loadHandle();C&&await i.queryPermissionOnly(C,"readwrite")&&(a=C,r=C.name)}catch(C){}})();function g(C){let N=e.normalize(C);if(r){if(N===r)return"";if(N.startsWith(r+"/"))return N.slice(r.length+1)}return N}async function p(C,N){if(!a)throw new Error("No folder selected");if(!C||C==="."||C==="/")return a;let T=a;for(const I of C.split("/").filter(A=>A&&A!=="."))T=await T.getDirectoryHandle(I,N||void 0);return T}async function l(C,N){const T=g(C),I=e.dirname(T),A=e.basename(T),m=N&&N.create?{create:!0}:void 0;return await(await p(I==="/"?"":I,m)).getFileHandle(A,N||void 0)}async function c(){if(a)return;const C=await i.loadHandle();if(C&&await i.verifyPermission(C,"readwrite")){a=C,r=C.name;return}throw new Error('No folder selected. Click "Open Folder" first.')}async function f(C){const N=await p(C),T=[];for await(const[I,A]of N.entries())A.kind==="file"&&T.push(I);return T}async function h(C){const N=await p(C),T=[];for await(const[I,A]of N.entries())I.startsWith(".")||T.push({path:I,type:A.kind==="directory"?"folder":"file"});return T}async function k(C,N,T){const I=await p(C);for await(const[A,m]of I.entries()){if(A.startsWith("."))continue;const $=C?C+"/"+A:A,_=N?N+"/"+A:A;T.push({path:_,type:m.kind==="directory"?"folder":"file"}),m.kind==="directory"&&await k($,_,T)}}async function y(){if(typeof window.showDirectoryPicker!="function")throw new Error("File System Access API not supported in this browser");let C;try{C=await window.showDirectoryPicker({mode:"readwrite"})}catch(T){if(T&&(T.name==="AbortError"||/aborted|cancel/i.test(T.message||"")))return{folder:null,files:[]};throw T}await i.saveHandle(C),a=C,r=C.name;const N=await f("");return{folder:C.name,files:N}}async function F(C){return await c(),await f(g(C))}async function n(C){return await c(),await h(g(C))}async function o(C){await c();const N=[];return await k(g(C),String(C||""),N),N}async function d(C){await c();const T=await(await l(C)).getFile();return new Uint8Array(await T.arrayBuffer())}async function u(C){const N=await d(C);return new TextDecoder("utf-8").decode(N)}async function v(C,N){await c();const I=await(await l(C,{create:!0})).createWritable();let A;return N instanceof Uint8Array?A=N:N instanceof ArrayBuffer?A=new Uint8Array(N):A=String(N==null?"":N),await I.write(A),await I.close(),!0}async function w(C){await c();const N=g(C),T=e.dirname(N),I=e.basename(N);return await(await p(T==="/"?"":T)).removeEntry(I),!0}async function S(C,N){await c();const T=g(C),I=g(N),A=await l(C);if(typeof A.move=="function"){const $=e.dirname(T),_=e.dirname(I),b=e.basename(I);try{if($===_)await A.move(b);else{const x=await p(_==="/"?"":_,{create:!0});await A.move(x,b)}return!0}catch(E){}}const m=await d(C);return await v(N,m),await w(C),!0}async function P(C){return await c(),await p(g(C),{create:!0}),!0}async function R(C){await c();const N=g(C);if(!N)throw new Error("Cannot remove the root folder");const T=e.dirname(N),I=e.basename(N);return await(await p(T==="/"?"":T)).removeEntry(I,{recursive:!0}),!0}async function O(C){await c();try{return await l(C),!0}catch(N){if(N&&N.name==="NotFoundError")try{return await p(g(C)),!0}catch(T){return!1}throw N}}function M(){return Promise.resolve("./")}Object.assign(window.BridgeDisk,{openFolder:y,listFiles:F,ilistFiles:n,ilistAllFiles:o,loadFile:u,loadFileBytes:d,saveFileContent:v,removeFile:w,renameFile:S,createFolder:P,removeFolder:R,fileExists:O,getAppPath:M,whenReady:()=>s,hasRoot:()=>!!a}),window.__bridgeDiskState=()=>({rootName:r,hasHandle:!!a})})(),(function(){if(!window.AppDialog||!window.AppShortcuts||!window.AppShortcutManager){console.error("[BridgeWindow] required modules missing \u2014 check script order");return}function e(h){return window.AppDialog.openDialog(h||{})}function i(){return window.AppShortcuts.map}function a(h){window.AppShortcutManager.onShortcut(h)}function r(h){window.AppShortcutManager.onDisableShortcuts(h)}let s=null;function g(h){s=h,window.addEventListener("beforeunload",k=>{if(s){try{Promise.resolve(s()).catch(()=>{})}catch(y){}k.preventDefault(),k.returnValue=""}})}function p(){try{window.close()}catch(h){}return Promise.resolve()}function l(){}function c(){return Promise.resolve(!1)}function f(h){try{window.dispatchEvent(new CustomEvent("menu-state-change",{detail:h}))}catch(k){}return Promise.resolve()}Object.assign(window.BridgeWindow,{openDialog:e,getShortcuts:i,onKeyboardShortcut:a,onDisableShortcuts:r,beforeClose:g,confirmClose:p,setWindowSize:l,isPackaged:c,updateMenuState:f})})(),(function(){const e=["https://raw.githubusercontent.com/arduino/package-index-py/main/package-list.yaml","https://raw.githubusercontent.com/arduino/package-index-py/main/micropython-lib.yaml","https://raw.githubusercontent.com/moyalab/package-index-py/main/package-list.yaml"],i="https://micropython.org/pi/v2",a="/lib";let r=null,s=null;function g(m){if(!m)return"";const $=m.indexOf("OK"),_=m.indexOf("");return $===-1||_===-1||_<=$+2?"":m.substring($+2,_).trim()}async function p(m=!1){if(r&&!m)return r;if(s)return s;s=(async()=>{let $=[];for(const _ of e)try{const b=await fetch(_,{cache:"no-cache"});if(!b.ok)throw new Error(`HTTP ${b.status}`);const E=await b.text(),x=window.jsyaml.load(E);x&&Array.isArray(x.packages)&&($=$.concat(x.packages))}catch(b){throw new Error(`Failed to fetch ${_}: ${b.message}`)}return $.sort((_,b)=>(_.name||"").localeCompare(b.name||"")),r=$,$})();try{return await s}finally{s=null}}function l(m,$){const _=Array.isArray($)?$:r||[];if(!m)return _.slice();const b=m.trim().toLowerCase();return b?_.filter(E=>E?[E.name,E.description,E.author,E.url,Array.isArray(E.tags)?E.tags.join(" "):E.tags].filter(Boolean).join(" ").toLowerCase().includes(b):!1):_.slice()}function c(m){if(!m)return null;const $=m.split("-");return $.length>=3?$[2]:null}async function f(){if(!window.BridgeSerial||typeof window.BridgeSerial.run!="function")return{format:null,arch:null};let m=null,$=null;try{const _=await window.BridgeSerial.run(`import sys
try:
  print(sys.implementation._mpy & 0xff)
except AttributeError:
  print("")
`),b=g(_);b&&/^\d+$/.test(b)&&(m=Number(b))}catch(_){}try{const _=await window.BridgeSerial.run(`try:
  import platform
  print(platform.platform())
except Exception:
  print("")
`);$=c(g(_))}catch(_){}return{format:m,arch:$}}function h(m){return m?m.startsWith("github:")||m.startsWith("gitlab:")||m.startsWith("http://")||m.startsWith("https://"):!1}function k(m,$){let _=String(m).trim(),b=$||null;const E=_.lastIndexOf("@");if(E>_.indexOf("://")&&E!==-1)b=b||_.substring(E+1),_=_.substring(0,E);else if(_.startsWith("github:")||_.startsWith("gitlab:")){const x=_.indexOf(":"),D=_.substring(x+1),L=D.lastIndexOf("@");L!==-1&&(b=b||D.substring(L+1),_=_.substring(0,x+1)+D.substring(0,L))}if(b=b||"HEAD",/\.(py|mpy)$/i.test(_))return{kind:"file",fileUrl:y(_,b),fileName:_.split("/").pop(),version:b};if(_.startsWith("github:")||_.startsWith("gitlab:")){const x=_.startsWith("github:")?"github":"gitlab",L=_.substring(_.indexOf(":")+1).split("/"),H=L[0],B=L[1],z=L.slice(2).join("/");return{kind:"repo",host:x,owner:H,repo:B,subdir:z,version:b}}try{const x=new URL(_);if(x.hostname==="github.com"||x.hostname==="www.github.com"){const D=x.pathname.replace(/^\//,"").split("/"),L=D[0],H=D[1];let B=D.slice(2);return(B[0]==="tree"||B[0]==="blob")&&(b=b==="HEAD"?B[1]||"HEAD":b,B=B.slice(2)),{kind:"repo",host:"github",owner:L,repo:H,subdir:B.join("/"),version:b}}if(x.hostname==="gitlab.com"||x.hostname==="www.gitlab.com"){const D=x.pathname.replace(/^\//,"").split("/");return{kind:"repo",host:"gitlab",owner:D[0],repo:D[1],subdir:D.slice(2).join("/"),version:b}}if(x.hostname==="raw.githubusercontent.com"){const D=x.pathname.replace(/^\//,"").split("/"),L=D[0],H=D[1],B=D[2];return{kind:"repo",host:"github",owner:L,repo:H,subdir:D.slice(3).join("/"),version:b==="HEAD"?B:b}}}catch(x){}throw new Error(`Unrecognized package URL: ${m}`)}function y(m,$){if(m.startsWith("github:")){const b=m.substring(7).split("/"),E=b[0],x=b[1],D=b.slice(2).join("/");return`https://raw.githubusercontent.com/${E}/${x}/${$}/${D}`}if(m.startsWith("gitlab:")){const b=m.substring(7).split("/"),E=b[0],x=b[1],D=b.slice(2).join("/");return`https://gitlab.com/${E}/${x}/-/raw/${$}/${D}`}return m}function F(m,$){const _=m.version||"HEAD",b=m.subdir?m.subdir.replace(/\/$/,"")+"/":"";return m.host==="github"?`https://raw.githubusercontent.com/${m.owner}/${m.repo}/${_}/${b}${$}`:`https://gitlab.com/${m.owner}/${m.repo}/-/raw/${_}/${b}${$}`}async function n(m){const $=await fetch(m,{cache:"no-cache"});if(!$.ok)throw new Error(`Fetch ${m} \u2192 HTTP ${$.status}`);const _=await $.arrayBuffer();return new Uint8Array(_)}async function o(m){const $=await fetch(m,{cache:"no-cache"});if(!$.ok)throw new Error(`Fetch ${m} \u2192 HTTP ${$.status}`);return await $.json()}async function d(m){const $=F(m,"package.json");try{return await o($)}catch(_){throw new Error(`Could not find package.json at ${$} \u2014 ${_.message}`)}}function u(...m){return m.filter($=>$!=null&&$!=="").join("/").replace(/\/+/g,"/")}function v(m){if(!m)return"/";const $=m.lastIndexOf("/");return $<=0?"/":m.substring(0,$)}async function w(m){const $=m.split("/").filter(Boolean);let _="";for(const b of $){_+="/"+b;try{await window.BridgeSerial.createFolder(_)}catch(E){}}}async function S(m,$,_){return await w(v($)),await window.BridgeSerial.saveFileContent($,m,_||(()=>{}))}async function P(m){let $;try{$=await window.BridgeSerial.ilistFiles(m)}catch(_){return}if(Array.isArray($)){for(const _ of $){const b=_[0],E=_[1],x=u(m,b);if(E===16384)await P(x);else try{await window.BridgeSerial.removeFile(x)}catch(D){}}try{await window.BridgeSerial.removeFolder(m)}catch(_){}}}function R(m,$){const _=[];if(!m||!Array.isArray(m.hashes))return _;for(const[b,E]of m.hashes){const x=E.slice(0,2);_.push({boardRelPath:b,fileUrl:`${i}/file/${x}/${E}`})}return _}function O(m,$){const _=[];if(!m||!Array.isArray(m.urls))return _;for(const b of m.urls){const E=b[0],x=b[1];let D;/^https?:\/\//.test(x)?D=x:x.startsWith("github:")||x.startsWith("gitlab:")?D=y(x,$.version):D=F($,x),_.push({boardRelPath:E,fileUrl:D})}return _}async function M(m,{visitedKey:$,mpyFormat:_,visited:b=new Set}){if(b.has($))return{entries:[],packageName:null};b.add($);let E=[],x=null,D=null;if(m.kind==="index"){const L=`${i}/package/${_}/${m.name}/${m.version}.json`,H=await o(L);x=H.name||m.name,E=R(H,_),D=H.deps||null}else if(m.kind==="repo"){const L=await d(m.repo);x=L.name||m.repo.repo,E=O(L,m.repo),D=L.deps||null}else if(m.kind==="file"){const L=m.fileName;x=L.replace(/\.(m?py)$/i,""),E=[{boardRelPath:L,fileUrl:m.fileUrl}]}if(Array.isArray(D))for(const L of D){const H=Array.isArray(L)?L[0]:L,B=Array.isArray(L)?L[1]:null,z=C(H,B),V=N(z),j=await M(z,{visitedKey:V,mpyFormat:_,visited:b});E=E.concat(j.entries)}return{entries:E,packageName:x}}function C(m,$){if(!m)throw new Error("Empty package identifier");if(h(m)||/\.(py|mpy)$/i.test(m)){const b=k(m,$);return b.kind==="file"?{kind:"file",fileUrl:b.fileUrl,fileName:b.fileName}:{kind:"repo",repo:b}}const _=$||"latest";return{kind:"index",name:m,version:_==="HEAD"?"latest":_}}function N(m){return m.kind==="index"?`index:${m.name}@${m.version}`:m.kind==="repo"?`repo:${m.repo.host}:${m.repo.owner}/${m.repo.repo}/${m.repo.subdir}@${m.repo.version}`:`file:${m.fileUrl}`}function T(m){const $=new Set;for(const _ of m){const b=_.boardRelPath.split("/")[0];b&&b.indexOf(".")===-1&&$.add(b)}return Array.from($)}async function I(m,$={}){const{overwrite:_=!0,installAsMpy:b=!0,mpySpec:E=null,onProgress:x=()=>{}}=$;if(!m)throw new Error("No package provided");const L=b&&E&&E.format!=null?String(E.format):"py";let H;if(m.url)H=C(m.url,m.version);else if(m.name)H=C(m.name,m.version);else throw new Error("Package has neither name nor url");x({phase:"resolve",message:"Resolving package and dependencies\u2026"});const{entries:B}=await M(H,{visitedKey:N(H),mpyFormat:L});if(B.length===0)throw new Error("No files to install");const z=a;try{await window.BridgeSerial.createFolder(z)}catch(U){}const V=T(B);for(const U of V){const W=u(z,U);if(await window.BridgeSerial.fileExists(W)){if(!_)throw new Error(`Package folder already exists: ${W}`);x({phase:"cleanup",message:`Removing existing ${W}\u2026`}),await P(W)}}for(const U of B){if(U.boardRelPath.indexOf("/")!==-1)continue;const W=u(z,U.boardRelPath);if(await window.BridgeSerial.fileExists(W)){if(!_)throw new Error(`File already exists: ${W}`);try{await window.BridgeSerial.removeFile(W)}catch(K){}}}let j=0;for(const U of B){j+=1;const W=u(z,U.boardRelPath);x({phase:"install",message:`Installing ${j}/${B.length}: ${U.boardRelPath}`,current:j,total:B.length});const q=await n(U.fileUrl);await S(q,W,K=>{x({phase:"install",message:`Installing ${j}/${B.length}: ${U.boardRelPath} ${K}`,current:j,total:B.length,chunk:K})})}return x({phase:"done",message:`Installed ${B.length} file(s)`}),{installedFiles:B.length,formatUsed:L}}async function A(m,$={}){if(!m||typeof m!="string")throw new Error("URL is required");return await I({url:m.trim()},$)}window.PackageInstaller={getPackageList:p,findPackages:l,getBoardMpySpec:f,installPackage:I,installFromURL:A,_internals:{parseRepoUrl:k,resolveInstallTarget:C,targetKey:N,extractStdout:g,parseArchFromPlatform:c}}})(),(function(){const{ESPLoader:e,Transport:i}=window.esptoolJs;let a=null,r=null,s=null,g=null;function p(){return"serial"in navigator}function l(d){a=d}function c(d,u){a&&a.emit(d,u)}function f(d,u="info"){c("fw-log",{message:d,type:u})}function h(){return{clean(){},writeLine(d){if(!d||d.trim()==="")return;const u=d.replace(/\r?\n/g,"").trim();if(!u)return;let v="info";/error|fail/i.test(u)?v="error":/warning/i.test(u)?v="warn":/done|hash|leaving/i.test(u)&&(v="success"),f(u,v)},write(){}}}async function k(d=921600){if(!p())throw f(t("firmware.log.notSupported"),"error"),new Error("Web Serial not supported");try{f(t("firmware.log.selectingPort"),"info");const u=window.FIRMWARE_PORT_FILTERS||[];g=await navigator.serial.requestPort(u.length?{filters:u}:{}),r=new i(g,!1);const v=g.getInfo(),w={vendorId:v.usbVendorId?`0x${v.usbVendorId.toString(16).toUpperCase().padStart(4,"0")}`:"N/A",productId:v.usbProductId?`0x${v.usbProductId.toString(16).toUpperCase().padStart(4,"0")}`:"N/A"};c("fw-state",{portInfo:w}),f(t("firmware.log.initializingEsptool"),"info"),s=new e({transport:r,baudrate:parseInt(d),terminal:h()});const S=await s.main();return c("fw-state",{isConnected:!0,chipName:S}),f(t("firmware.log.connected",{chip:S,baud:d}),"success"),S}catch(u){throw u&&u.name==="NotFoundError"?f(t("firmware.log.portCancelled"),"warn"):(f(t("firmware.log.connectFailed",{err:u&&u.message?u.message:String(u)}),"error"),f(t("firmware.log.bootResetHint"),"warn")),u}}async function y(){try{r&&await r.disconnect()}catch(d){f(t("firmware.log.disconnectFailed",{err:d&&d.message?d.message:String(d)}),"error")}finally{r=null,s=null,g=null,c("fw-state",{isConnected:!1,chipName:null,portInfo:null,uploadProgress:0,uploadStatus:"idle"}),f(t("firmware.log.disconnected"),"info")}}async function F(d,u={}){if(!s)return f(t("firmware.log.connectFirst"),"error"),!1;const{eraseAll:v=!1}=u;c("fw-state",{isUploading:!0,uploadStatus:"uploading",uploadProgress:0});try{f("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","info"),f(t("firmware.log.flashStart"),"info"),f(t("firmware.log.flashMode",{value:window.FirmwareConfig.FLASH_MODE}),"info"),f(t("firmware.log.flashFreq",{value:window.FirmwareConfig.FLASH_FREQ}),"info"),f(t("firmware.log.flashSize",{value:window.FirmwareConfig.FLASH_SIZE}),"info"),f(t("firmware.log.fileCount",{n:d.length}),"info");for(const R of d)f(`  0x${R.address.toString(16).padStart(5,"0")} \u2192 ${R.label} (${n(R.data.length)})`,"info");f("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","info");const w=d.map(R=>({data:o(R.data),address:R.address})),S=d.reduce((R,O)=>R+O.data.length,0),P=d.map(R=>R.data.length);return await s.writeFlash({fileArray:w,flashMode:window.FirmwareConfig.FLASH_MODE,flashFreq:window.FirmwareConfig.FLASH_FREQ,flashSize:window.FirmwareConfig.FLASH_SIZE,eraseAll:v,compress:!0,reportProgress:(R,O,M)=>{const C=P.slice(0,R).reduce((T,I)=>T+I,0),N=Math.round((C+O)/S*100);c("fw-state",{uploadProgress:N})}}),f("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","success"),f(t("firmware.log.flashDone"),"success"),f("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","success"),f(t("firmware.log.boardReset"),"info"),await s.after(),f(t("firmware.log.resetDone"),"success"),c("fw-state",{uploadProgress:100,uploadStatus:"success",isUploading:!1}),!0}catch(w){return f(t("firmware.log.flashFailed",{err:w&&w.message?w.message:String(w)}),"error"),f(t("firmware.log.bootResetRetryHint"),"warn"),c("fw-state",{uploadStatus:"error",isUploading:!1}),!1}}function n(d){if(d===0)return"0 B";const u=["B","KB","MB","GB"],v=Math.floor(Math.log(d)/Math.log(1024));return(d/Math.pow(1024,v)).toFixed(2)+" "+u[v]}function o(d){let v="";for(let w=0;w<d.length;w+=8192){const S=d.subarray(w,Math.min(w+8192,d.length));v+=String.fromCharCode.apply(null,S)}return v}window.FirmwareTool={isSupported:p,setEmitter:l,connect:k,disconnect:y,flashFirmware:F}})(),(function(){function e(){return typeof navigator!="undefined"&&"serial"in navigator&&typeof window.showDirectoryPicker=="function"}function i(){const s=navigator.userAgentData&&navigator.userAgentData.brands&&navigator.userAgentData.brands.map(g=>g.brand).join(", ")||navigator.userAgent||"";return html`
      <div id="app" class="app-unsupported">
        <div class="app-unsupported-card">
          <h2>This browser isn't supported</h2>
          <p>
            <strong>Arduino Lab for MicroPython</strong> (web edition) needs the
            <strong>Web Serial</strong> and <strong>File System Access</strong>
            APIs to talk to your board and read your local files.
          </p>
          <p>
            These are currently available only in Chromium-based browsers:
            <strong>Chrome 89+</strong>, <strong>Edge 89+</strong>,
            <strong>Opera 75+</strong>, and other Chromium derivatives.
            Firefox and Safari do not implement Web Serial.
          </p>
          <p class="app-unsupported-actions">
            <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">Download Chrome</a>
            <span class="sep">·</span>
            <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer">Download Edge</a>
          </p>
          <p class="app-unsupported-ua">Detected: ${s}</p>
        </div>
      </div>
    `}let a=!1;function r(){if(a)return;a=!0;const s=`
      .app-unsupported {
        font-family: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 24px;
        background: #fafafa;
      }
      .app-unsupported-card {
        max-width: 560px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 28px 32px;
      }
      .app-unsupported-card h2 { margin-top: 0; }
      .app-unsupported-card p { line-height: 1.5; }
      .app-unsupported-actions { margin-top: 24px; font-size: 15px; }
      .app-unsupported-actions a { color: #1976d2; text-decoration: none; }
      .app-unsupported-actions a:hover { text-decoration: underline; }
      .app-unsupported-actions .sep { margin: 0 10px; color: #aaa; }
      .app-unsupported-ua {
        margin-top: 28px;
        font-size: 12px;
        color: #888;
        word-break: break-all;
      }
    `,g=document.createElement("style");g.textContent=s,document.head.appendChild(g)}window.UnsupportedBrowser={isSupported:e,render:()=>(r(),i())}})();const log=console.log,serialBridge=window.BridgeSerial,disk=window.BridgeDisk,win=window.BridgeWindow,shortcuts=window.BridgeWindow.getShortcuts();let notyf=null;const newFileContent=`from bitblock import Bitblock
import time

print('Hello, BitBlock!')
`;async function sleep(e){return new Promise(i=>setTimeout(i,e))}async function confirmDialog(e,i,a,r){let s=[];a&&s.push(a),i&&s.push(i);let g=await win.openDialog({type:"question",title:r||"",buttons:s,defaultId:0,cancelId:1,message:e});return Promise.resolve(g)}async function store(e,i){win.setWindowSize(720,640),notyf||(notyf=new window.Notyf({duration:2e3,position:{x:"center",y:"top"},dismissible:!0,ripple:!0})),e.platform=window.BridgeWindow.getOS(),e.view="editor",e.diskNavigationPath="/",e.diskNavigationRoot=getDiskNavigationRootFromStorage(),e.diskFiles=[],e.boardNavigationPath="/",e.boardNavigationRoot="/",e.boardFiles=[],e.openFiles=[],e.selectedFiles=[],e.newTabFileName=null,e.editingFile=null,e.creatingFile=null,e.renamingFile=null,e.creatingFolder=null,e.renamingTab=null,e.isSidebarOpen=!0,e.sidebarWidth=getSidebarWidthFromStorage(),e.isFullscreen=!1,e.language=window.i18n.getLanguage(),e.isConnecting=!1,e.isConnected=!1,e.connectedPort=null,e.isRunning=!1,e.isNewFileDialogOpen=!1,e.isFirmwareUploaderOpen=!1,e.fw={isConnected:!1,chipName:null,portInfo:null,baudRate:window.FirmwareConfig?window.FirmwareConfig.DEFAULT_SETTINGS.baudRate:921600,activeTab:"micropython",selectedVersion:null,isUploading:!1,uploadStatus:"idle",uploadProgress:0,logs:[]},window.FirmwareTool&&window.FirmwareTool.setEmitter&&window.FirmwareTool.setEmitter(i),e.isInstallPackageDialogOpen=!1,e.isInstallingPackage=!1,e.installPackageProgress="",e.installPackageError=null,e.packageList=[],e.packageSearchQuery="",e.packageSearchResults=[],e.selectedPackage=null,e.packageOverwrite=!0,e.installAsMpy=!0,e.boardMpyFormat=null,e.boardMpyArch=null,e.isSaving=!1,e.savingProgress=0,e.isTransferring=!1,e.transferringProgress="",e.isRemoving=!1,e.isLoadingFiles=!1,e.dialogs=[],e.isTerminalBound=!1,e.shortcutsDisabled=!1,e.activeView="explorer",e.topicsByFile={},e.selectedTopicId={},e.topicsLoading={},e.topicsError={},e.collapsedEntries={},await F("disk"),e.diskNavigationRoot&&window.BridgeDisk&&window.BridgeDisk.whenReady&&window.BridgeDisk.whenReady().then(()=>{window.BridgeDisk.hasRoot&&window.BridgeDisk.hasRoot()&&i.emit("refresh-files")}),e.savedPanelHeight=PANEL_DEFAULT,e.panelHeight=PANEL_DEFAULT,e.isResizingPanel=!1,e.resizePanel=function(n){e.panelHeight=PANEL_CLOSED/2+document.body.clientHeight-n.clientY,e.panelHeight<=PANEL_CLOSED?e.savedPanelHeight=PANEL_DEFAULT:e.savedPanelHeight=e.panelHeight,i.emit("render")};const a=()=>{window.BridgeWindow.updateMenuState({isConnected:e.isConnected,view:e.view})};async function r(){if(e.diskNavigationRoot)return e.diskNavigationRoot;const n=await selectDiskFolder();return n?(saveDiskNavigationRootToStorage(n),e.diskNavigationRoot=n,e.diskNavigationPath="/",n):null}i.on("select-disk-navigation-root",async()=>{const n=await selectDiskFolder();if(!n){i.emit("render");return}saveDiskNavigationRootToStorage(n),e.diskNavigationRoot=n,e.diskNavigationPath="/",e.selectedFiles=(e.selectedFiles||[]).filter(o=>o.source!=="disk"),i.emit("refresh-files"),i.emit("render")}),i.on("toggle-sidebar",()=>{e.isSidebarOpen=!e.isSidebarOpen,i.emit("render")}),i.on("set-sidebar-width",n=>{const o=clampSidebarWidth(n);o!==e.sidebarWidth&&(e.sidebarWidth=o,saveSidebarWidthToStorage(o),i.emit("render"))}),i.on("set-language",n=>{window.i18n.setLanguage(n),e.language=window.i18n.getLanguage(),e.topicsByFile={},e.topicsLoading={},e.topicsError={},i.emit("render")}),i.on("set-active-view",n=>{e.activeView=n,i.emit("render")}),i.on("select-topic",({view:n,topicId:o})=>{e.selectedTopicId[n]=o,e.collapsedEntries={},i.emit("render")}),i.on("toggle-entry",({key:n})=>{n&&(e.collapsedEntries[n]?delete e.collapsedEntries[n]:e.collapsedEntries[n]=!0,i.emit("render"))}),i.on("load-topics",async({key:n,lang:o})=>{if(!e.topicsLoading[n]){e.topicsLoading[n]=!0,e.topicsError[n]=null,i.emit("render");try{const d=await fetch(`data/topics/${n}.${o}.json`);if(!d.ok)throw new Error(`HTTP ${d.status}`);const u=await d.json();e.topicsByFile[n]={topics:u,lang:o}}catch(d){e.topicsError[n]=d&&d.message?d.message:String(d)}e.topicsLoading[n]=!1,i.emit("render")}}),i.on("toggle-fullscreen",async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch(n){console.error("fullscreen toggle failed",n)}}),document.addEventListener("fullscreenchange",()=>{e.isFullscreen=!!document.fullscreenElement,i.emit("render")}),i.on("change-view",async n=>{e.view!==n&&(e.selectedFiles=[],n==="file-manager"&&(i.emit("stop"),await sleep(250),i.emit("refresh-files")),e.view=n,i.emit("render"),a())}),i.on("launch-app",async(n,o)=>{window.launchApp(n,o)}),i.on("open-install-package-dialog",async()=>{if(!e.isConnected){i.emit("connect");return}e.isInstallPackageDialogOpen=!0,e.installPackageError=null,e.installPackageProgress="",i.emit("render");try{const n=await window.PackageInstaller.getBoardMpySpec();e.boardMpyFormat=n.format,e.boardMpyArch=n.arch}catch(n){e.boardMpyFormat=null,e.boardMpyArch=null}if(e.packageList.length===0)try{const n=await window.PackageInstaller.getPackageList();e.packageList=n,e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,n)}catch(n){e.installPackageError=t("toast.packageRegistryFailed",{err:n.message})}else e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,e.packageList);i.emit("render")}),i.on("close-install-package-dialog",()=>{e.isInstallingPackage||(e.isInstallPackageDialogOpen=!1,i.emit("render"))}),i.on("search-packages",n=>{e.packageSearchQuery=n||"",e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,e.packageList),i.emit("render")}),i.on("select-package-to-install",n=>{e.selectedPackage=n,i.emit("render")}),i.on("toggle-install-overwrite",n=>{e.packageOverwrite=!!n,i.emit("render")});async function s(n){e.isInstallingPackage=!0,e.installPackageError=null,e.installPackageProgress=t("dialog.install.resolving"),i.emit("render");try{await window.PackageInstaller.installPackage(n,{overwrite:e.packageOverwrite,installAsMpy:!0,mpySpec:{format:e.boardMpyFormat,arch:e.boardMpyArch},onProgress:o=>{e.installPackageProgress=o&&o.message?o.message:"",i.emit("render")}}),e.installPackageProgress=t("dialog.install.installed"),i.emit("refresh-files")}catch(o){e.installPackageError=o.message||String(o)}finally{e.isInstallingPackage=!1,i.emit("render")}}i.on("install-package",async n=>{e.isInstallingPackage||!n||await s(n)}),i.on("select-port",async n=>{log("connect",n);const o=n.path;e.isConnecting=!0,i.emit("render");let d=setTimeout(()=>{let v=win.openDialog({type:"error",title:t("dialog.connectFailed.title"),buttons:[t("dialog.ok")],cancelId:0,message:t("dialog.connectFailed.msg")});i.emit("connection-timeout")},3500);try{await serialBridge.connect(o)}catch(v){console.error(v)}await serialBridge.getPrompt(),clearTimeout(d),e.isConnecting=!1,e.isConnected=!0,e.boardNavigationPath=await getBoardNavigationPath(),a(),e.view==="editor"&&e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),e.connectedPort=o;let u=e.cache(XTerm,"terminal").term;e.isTerminalBound||(e.isTerminalBound=!0,u.onData(v=>{serialBridge.eval(v),u.scrollToBottom()}),serialBridge.eval("")),serialBridge.onData(v=>{u.write(v),u.scrollToBottom()}),serialBridge.onConnectionClosed(()=>i.emit("disconnected")),i.emit("refresh-files"),i.emit("render")}),i.on("disconnected",()=>{e.isConnected=!1,e.isRunning=!1,e.panelHeight=PANEL_CLOSED,e.boardFiles=[],e.boardNavigationPath="/",e.boardMpyFormat=null,e.boardMpyArch=null,e.isInstallPackageDialogOpen=!1,notyf.error({message:t("toast.boardDisconnected"),className:"toast-board-disconnected"}),i.emit("refresh-files"),i.emit("render"),a()}),i.on("disconnect",async()=>{if(e.isFirmwareUploaderOpen){await window.FirmwareTool.disconnect();return}await serialBridge.disconnect()}),i.on("connection-timeout",async()=>{e.isConnected=!1,e.isConnecting=!1,e.isRunning=!1,i.emit("render")}),i.on("connect",async()=>{if(e.isFirmwareUploaderOpen){try{await window.FirmwareTool.connect(e.fw.baudRate)}catch(o){}return}let n;try{n=await serialBridge.requestPort()}catch(o){console.error("connect: requestPort failed",o);return}n&&i.emit("select-port",n)}),i.on("toggle-firmware-uploader",async()=>{const n=!e.isFirmwareUploaderOpen;e.isConnected&&(await serialBridge.disconnect(),e.isConnected=!1),e.fw.isConnected&&await window.FirmwareTool.disconnect(),e.fw.uploadStatus="idle",e.fw.uploadProgress=0,e.isFirmwareUploaderOpen=n,i.emit("render")}),i.on("close-firmware-uploader",async()=>{e.isConnected&&(await serialBridge.disconnect(),e.isConnected=!1),e.fw.isConnected&&await window.FirmwareTool.disconnect(),e.fw.uploadStatus="idle",e.fw.uploadProgress=0,e.isFirmwareUploaderOpen=!1,i.emit("render")}),i.on("fw-set-baud",n=>{e.fw.baudRate=parseInt(n,10)||e.fw.baudRate,i.emit("render")}),i.on("fw-set-tab",n=>{e.fw.activeTab=n,e.fw.selectedVersion=null,e.fw.uploadStatus="idle",i.emit("render")}),i.on("fw-select-version",n=>{e.fw.selectedVersion=n,e.fw.uploadStatus="idle",i.emit("render")}),i.on("fw-clear-logs",()=>{e.fw.logs=[],i.emit("render")}),i.on("fw-state",n=>{const o=e.fw.uploadStatus==="success";Object.assign(e.fw,n),!o&&e.fw.uploadStatus==="success"&&notyf&&notyf.success(t("firmware.upload.success")),i.emit("render")}),i.on("fw-log",n=>{const o=window.i18n&&window.i18n.getLanguage()==="ko"?"ko-KR":"en-US",d=new Date().toLocaleTimeString(o,{hour12:!1});e.fw.logs.push({timestamp:d,message:n.message,type:n.type||"info"}),i.emit("render")}),i.on("fw-upload",async()=>{const n=window.FirmwareConfig,o=e.fw.selectedVersion;if(!o){i.emit("fw-log",{type:"warn",message:t("firmware.log.selectFw")});return}const d=n.FIRMWARE_VERSIONS.find(u=>u.id===o);if(!d){i.emit("fw-log",{type:"error",message:t("firmware.log.fwNotFound")});return}try{const u=n.getFlashMap(d);i.emit("fw-log",{type:"info",message:t("firmware.log.loadingFw",{version:d.version})});const v=[];for(const w of u){i.emit("fw-log",{type:"info",message:t("firmware.log.downloading",{path:w.path})});const S=await fetch(w.path);if(!S.ok)throw new Error(t("firmware.log.loadFailed",{path:w.path,status:S.status}));const P=new Uint8Array(await S.arrayBuffer());v.push({data:P,address:w.address,label:w.label}),i.emit("fw-log",{type:"success",message:t("firmware.log.loadedEntry",{label:w.label,bytes:P.length})})}i.emit("fw-log",{type:"success",message:t("firmware.log.allLoaded",{n:v.length})}),await window.FirmwareTool.flashFirmware(v)}catch(u){i.emit("fw-log",{type:"error",message:t("firmware.log.loadError",{err:u.message})}),i.emit("fw-state",{uploadStatus:"error"})}}),i.on("run-from-button",(n=!1)=>{n?h():f()}),i.on("run",async(n=!1)=>{log("run");const o=e.openFiles.find(w=>w.id==e.editingFile);let d=o.editor.editor.state.doc.toString();const u=o.editor.editor.state.selection.ranges[0].from,v=o.editor.editor.state.selection.ranges[0].to;v-u>0&&n&&(selectedCode=o.editor.editor.state.doc.toString().substring(u,v),selectedCode.trim().length>0&&(d=selectedCode)),e.isRunning=!0,i.emit("open-panel"),el=document.querySelector(".xterm-helper-textarea"),el&&el.focus(),i.emit("render");try{await serialBridge.getPrompt(),await serialBridge.run(d)}catch(w){log("error",w)}finally{e.isRunning=!1}el=document.querySelector(".cm-content"),el&&el.focus(),i.emit("render")}),i.on("stop",async()=>{log("stop"),e.isRunning=!1,e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),i.emit("open-panel"),i.emit("render"),e.isConnected&&await serialBridge.getPrompt()}),i.on("reset",async()=>{log("reset"),e.isRunning=!1,e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),i.emit("open-panel"),i.emit("render"),await serialBridge.reset(),i.emit("update-files"),i.emit("render")}),i.on("open-panel",()=>{i.emit("stop-resizing-panel"),e.panelHeight=e.savedPanelHeight,i.emit("render"),setTimeout(()=>{e.cache(XTerm,"terminal").resizeTerm()},550)}),i.on("close-panel",()=>{i.emit("stop-resizing-panel"),e.savedPanelHeight=e.panelHeight,e.panelHeight=0,i.emit("render")}),i.on("clear-terminal",()=>{e.cache(XTerm,"terminal").term.clear()}),i.on("start-resizing-panel",()=>{log("start-resizing-panel"),e.isResizingPanel=!0,i.emit("render"),window.addEventListener("mousemove",e.resizePanel),document.body.addEventListener("mouseleave",()=>{i.emit("stop-resizing-panel")},{once:!0}),document.querySelector("#tabs").addEventListener("mouseenter",()=>{i.emit("stop-resizing-panel")},{once:!0})}),i.on("stop-resizing-panel",()=>{log("stop-resizing-panel"),e.isResizingPanel=!1,window.removeEventListener("mousemove",e.resizePanel),i.emit("render")}),i.on("create-new-file",()=>{log("create-new-file"),g(),e.isNewFileDialogOpen=!0,i.emit("render"),document.addEventListener("keydown",g)}),i.on("close-new-file-dialog",()=>{e.isNewFileDialogOpen=!1,g(),i.emit("render")}),i.on("save",async()=>{if(log("save"),canSave({view:e.view,isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile})==!1){log("can't save");return}let o=e.openFiles.find(P=>P.id===e.editingFile);if(o.source==="disk"&&!e.diskNavigationRoot&&!await r()){i.emit("render");return}let d=!1;const u=o.parentFolder,v=u===null;v&&(o.source=="board"?o.parentFolder=e.boardNavigationPath:o.source=="disk"&&(o.parentFolder=e.diskNavigationPath));let w=!1;if(o.source=="board"?(await serialBridge.getPrompt(),w=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName))):o.source=="disk"&&(w=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))),(v||!w)&&(o.source=="board"?(o.parentFolder=e.boardNavigationPath,await serialBridge.getPrompt(),d=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName))):o.source=="disk"&&(o.parentFolder=e.diskNavigationPath,d=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName)))),d&&!await confirmDialog(t("dialog.overwrite.msgFile",{name:o.fileName,source:o.source}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){o.parentFolder=u,i.emit("render");return}e.isSaving=!0,i.emit("render");const S=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName),S,P=>{e.savingProgress=P,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName),S)}catch(P){log("error",P)}o.hasChanges=!1,e.isSaving=!1,e.savingProgress=0,i.emit("refresh-files"),i.emit("render")}),i.on("select-tab",n=>{log("select-tab",n),e.editingFile=n,i.emit("render")}),i.on("close-tab",async n=>{if(log("close-tab",n),e.openFiles.find(d=>d.id===n).hasChanges&&!await confirmDialog(t("dialog.unsaved.msg"),t("dialog.cancel"),t("dialog.yes"),t("dialog.unsaved.title")))return!1;e.openFiles=e.openFiles.filter(d=>d.id!==n),e.openFiles.length>0?e.editingFile=e.openFiles[0].id:await F("disk"),i.emit("render")}),i.on("refresh-files",async()=>{if(log("refresh-files"),!e.isLoadingFiles){if(e.isLoadingFiles=!0,i.emit("render"),e.isConnected)try{e.boardFiles=await getBoardFiles(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""))}catch(n){e.boardFiles=[]}else e.boardFiles=[];if(e.diskNavigationRoot)try{e.diskFiles=await getDiskFiles(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""))}catch(n){const o=n&&typeof n.message=="string"?n.message:"";n&&(n.name==="NotAllowedError"||n.name==="SecurityError")||o.startsWith("No folder selected")?e.diskFiles=[]:(e.diskNavigationRoot=null,e.diskNavigationPath="/",e.diskFiles=[])}else e.diskFiles=[];i.emit("refresh-selected-files"),e.isLoadingFiles=!1,i.emit("render")}}),i.on("refresh-selected-files",()=>{log("refresh-selected-files"),e.selectedFiles=e.selectedFiles.filter(n=>n.source==="board"?e.isConnected?e.boardFiles.find(o=>n.fileName===o.fileName):!1:e.diskFiles.find(o=>n.fileName===o.fileName)),i.emit("render")}),i.on("create-new-tab",async(n,o=null)=>{const d=n=="board"?e.boardNavigationPath:e.diskNavigationPath;log("create-new-tab",n,o,d),await F(n,o,d)&&(i.emit("close-new-file-dialog"),i.emit("render"))}),i.on("create-file",(n,o=null)=>{log("create-file",n),e.creatingFile===null&&(e.creatingFile=n,e.creatingFolder=null,o!=null&&i.emit("finish-creating-file",o),i.emit("render"))}),i.on("finish-creating-file",async n=>{if(log("finish-creating",n),!!e.creatingFile){if(!n){e.creatingFile=null,i.emit("render");return}if(e.creatingFile=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:n})&&!await confirmDialog(t("dialog.overwrite.msgFileBoard",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFile=null,i.emit("render");return}await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n),newFileContent)}else if(e.creatingFile=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:n})&&!await confirmDialog(t("dialog.overwrite.msgFileDisk",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFile=null,i.emit("render");return}await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n),newFileContent)}setTimeout(()=>{e.creatingFile=null,g(),i.emit("refresh-files"),i.emit("render")},200)}}),i.on("create-folder",n=>{log("create-folder",n),e.creatingFolder===null&&(e.creatingFolder=n,e.creatingFile=null,i.emit("render"))}),i.on("finish-creating-folder",async n=>{if(log("finish-creating-folder",n),!!e.creatingFolder){if(!n){e.creatingFolder=null,i.emit("render");return}if(e.creatingFolder=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:n})){if(!await confirmDialog(t("dialog.overwrite.msgValueBoard",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFolder=null,i.emit("render");return}await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}await serialBridge.createFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}else if(e.creatingFolder=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:n})){if(!await confirmDialog(t("dialog.overwrite.msgValueDisk",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFolder=null,i.emit("render");return}await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}await disk.createFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}setTimeout(()=>{e.creatingFolder=null,i.emit("refresh-files"),i.emit("render")},200)}}),i.on("remove-files",async n=>{log("remove-files",n||"(all)");const o=n?e.selectedFiles.filter(S=>S.source===n):e.selectedFiles;if(o.length===0)return;let d=o.filter(S=>S.source==="board").map(S=>S.fileName),u=o.filter(S=>S.source==="disk").map(S=>S.fileName),v=t("dialog.delete.header");if(d.length&&(v+=t("dialog.delete.fromBoard"),d.forEach(S=>v+=`${S}
`),v+=`
`),u.length&&(v+=t("dialog.delete.fromDisk"),u.forEach(S=>v+=`${S}
`),v+=`
`),v+=t("dialog.overwrite.proceed"),!!await confirmDialog(v,t("dialog.cancel"),t("dialog.yes"),t("dialog.delete.title"))){e.isRemoving=!0,i.emit("render");for(let S in o){const P=o[S];P.type=="folder"?P.source==="board"?await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,P.fileName)):await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,P.fileName)):P.source==="board"?await serialBridge.removeFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,P.fileName)):await disk.removeFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,P.fileName))}i.emit("refresh-files"),n?e.selectedFiles=e.selectedFiles.filter(S=>S.source!==n):e.selectedFiles=[],e.isRemoving=!1,i.emit("render")}}),i.on("rename-file",(n,o)=>{log("rename-file",n,o),e.renamingFile=n,i.emit("render")}),i.on("finish-renaming-file",async n=>{log("finish-renaming-file",n);const o=e.selectedFiles[0];if(!n||o.fileName==n){e.renamingFile=null,i.emit("render");return}if(e.renamingFile=="board"&&e.isConnected){if((await checkOverwrite({fileNames:[n],parentPath:disk.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""),source:"board"})).length>0){let u=t("dialog.overwrite.msgSingleBoardHeader");if(u+=`${n}

`,u+=t("dialog.overwrite.proceed"),!await confirmDialog(u,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingFile=null,i.emit("render");return}o.type=="folder"?await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n)):o.type=="file"&&await serialBridge.removeFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}}else if(e.renamingFile=="disk"&&(await checkOverwrite({fileNames:[n],parentPath:disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""),source:"disk"})).length>0){let u=t("dialog.overwrite.msgSingleDiskHeader");if(u+=`${n}

`,u+=t("dialog.overwrite.proceed"),!await confirmDialog(u,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingFile=null,i.emit("render");return}o.type=="folder"?await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n)):o.type=="file"&&await disk.removeFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}e.isSaving=!0,i.emit("render");try{e.renamingFile=="board"?await serialBridge.renameFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,o.fileName),serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n)):await disk.renameFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,o.fileName),disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n));const d=e.openFiles.findIndex(u=>u.fileName===o.fileName&&u.source===o.source&&u.parentFolder===o.parentFolder);d>-1&&(e.openFiles[d].fileName=n,i.emit("render"))}catch(d){alert(`The file ${o.fileName} could not be renamed to ${n}`)}e.isSaving=!1,e.renamingFile=null,i.emit("refresh-files"),i.emit("render")}),i.on("rename-tab",n=>{log("rename-tab",n),e.renamingTab=n,i.emit("render")}),i.on("finish-renaming-tab",async n=>{log("finish-renaming-tab",n);const o=e.openFiles.find(P=>P.id===e.renamingTab);if(!n||o.fileName==n){e.renamingTab=null,e.isSaving=!1,i.emit("render");return}const d=o.parentFolder,u=o.fileName;o.fileName=n;const v=d===null;let w=!1;v||(o.source=="board"?w=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,u)):o.source=="disk"&&(w=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,u)))),(v||!w)&&(o.source=="board"?o.parentFolder=e.boardNavigationPath:o.source=="disk"&&(o.parentFolder=e.diskNavigationPath));let S=!1;if(o.source=="board"?S=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName)):o.source=="disk"&&(S=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))),S&&!await confirmDialog(t("dialog.overwrite.msgFile",{name:o.fileName,source:o.source}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingTab=null,o.fileName=u,i.emit("render");return}if(e.isSaving=!0,i.emit("render"),w){if(o.hasChanges){const P=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,u),P,R=>{e.savingProgress=R,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,u),P)}catch(R){log("error",R)}}try{o.source=="board"?await serialBridge.renameFile(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,u),serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName)):o.source=="disk"&&await disk.renameFile(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,u),disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))}catch(P){log("error",P)}}else if(!w){const P=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName),P,R=>{e.savingProgress=R,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName),P)}catch(R){log("error",R)}}o.hasChanges=!1,e.renamingTab=null,e.isSaving=!1,e.savingProgress=0,i.emit("refresh-files"),i.emit("render")}),i.on("toggle-file-selection",(n,o,d)=>{log("toggle-file-selection",n,o,d);let u=o=="board"?e.boardNavigationPath:e.diskNavigationPath;if(d&&!d.ctrlKey&&!d.metaKey){e.selectedFiles=[{fileName:n.fileName,type:n.type,source:o,parentFolder:u}],i.emit("render");return}e.selectedFiles.find(w=>w.fileName===n.fileName&&w.source===o)?e.selectedFiles=e.selectedFiles.filter(w=>!(w.fileName===n.fileName&&w.source===o)):e.selectedFiles.push({fileName:n.fileName,type:n.type,source:o,parentFolder:u}),i.emit("render")}),i.on("open-selected-files",async()=>{log("open-selected-files");let n=[],o=[];if(!e.isLoadingFiles){e.isLoadingFiles=!0,i.emit("render");for(let d in e.selectedFiles){let u=e.selectedFiles[d];if(u.type=="folder")continue;const v=e.openFiles.find(w=>w.fileName==u.fileName&&w.source==u.source&&w.parentFolder==u.parentFolder);if(v)o.push(v);else{let w=null;if(u.source=="board"){const S=await serialBridge.loadFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,u.fileName)),P=new Uint8Array(S),R=new TextDecoder("utf-8").decode(P);w=y({parentFolder:e.boardNavigationPath,fileName:u.fileName,source:u.source,content:R}),w.editor.onChange=function(){w.hasChanges=!0,i.emit("render")}}else if(u.source=="disk"){const S=await disk.loadFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,u.fileName));w=y({parentFolder:e.diskNavigationPath,fileName:u.fileName,source:u.source,content:S}),w.editor.onChange=function(){w.hasChanges=!0,i.emit("render")}}n.push(w)}}o.length>0&&(e.editingFile=o[0].id),n.length>0&&(e.editingFile=n[0].id),e.openFiles=e.openFiles.concat(n),e.selectedFiles=[],e.view="editor",a(),e.isLoadingFiles=!1,i.emit("render")}}),i.on("open-file",(n,o)=>{log("open-file",n,o),e.selectedFiles=[{fileName:o.fileName,type:o.type,source:n,parentFolder:e[`${n}NavigationPath`]}],i.emit("open-selected-files")}),i.on("upload-files",async()=>{log("upload-files");const n=await checkOverwrite({source:"board",fileNames:e.selectedFiles.map(o=>o.fileName),parentPath:serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,"")});if(n.length>0){let o=t("dialog.overwrite.msgManyBoardHeader");if(n.forEach(u=>o+=`${u.fileName}
`),o+=`
`,o+=t("dialog.overwrite.proceed"),!await confirmDialog(o,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title")))return}e.isTransferring=!0,i.emit("render");for(let o in e.selectedFiles){const d=e.selectedFiles[o],u=disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,d.fileName),v=serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,d.fileName);d.type=="folder"?(await uploadFolder(u,v,(w,S)=>{e.transferringProgress=`${S}: ${w}`,i.emit("render")}),e.transferringProgress=""):(await serialBridge.uploadFile(u,v,w=>{e.transferringProgress=`${d.fileName}: ${w}`,i.emit("render")}),e.transferringProgress="")}e.isTransferring=!1,e.selectedFiles=[],i.emit("refresh-files"),i.emit("render")}),i.on("download-files",async()=>{log("download-files");const n=await checkOverwrite({source:"disk",fileNames:e.selectedFiles.map(o=>o.fileName),parentPath:disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,"")});if(n.length>0){let o=t("dialog.overwrite.msgManyDiskHeader");if(n.forEach(u=>o+=`${u.fileName}
`),o+=`
`,o+=t("dialog.overwrite.proceed"),!await confirmDialog(o,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title")))return}e.isTransferring=!0,i.emit("render");for(let o in e.selectedFiles){const d=e.selectedFiles[o],u=serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,d.fileName),v=disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,d.fileName);d.type=="folder"?await downloadFolder(u,v,w=>{e.transferringProgress=w,i.emit("render")}):await serialBridge.downloadFile(u,v,w=>{e.transferringProgress=w,i.emit("render")})}e.isTransferring=!1,e.selectedFiles=[],i.emit("refresh-files"),i.emit("render")}),i.on("navigate-board-folder",n=>{log("navigate-board-folder",n),e.boardNavigationPath=serialBridge.getNavigationPath(e.boardNavigationPath,n),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-board-parent",()=>{log("navigate-board-parent"),e.boardNavigationPath=serialBridge.getNavigationPath(e.boardNavigationPath,".."),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-disk-folder",n=>{log("navigate-disk-folder",n),e.diskNavigationPath=disk.getNavigationPath(e.diskNavigationPath,n),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-disk-parent",()=>{log("navigate-disk-parent"),e.diskNavigationPath=disk.getNavigationPath(e.diskNavigationPath,".."),i.emit("refresh-files"),i.emit("render")}),win.beforeClose(async()=>{if(!!e.openFiles.find(o=>o.hasChanges)&&!await confirmDialog(t("dialog.unsaved.msgMayHave"),t("dialog.cancel"),t("dialog.yes"),t("dialog.unsaved.title")))return!1;await win.confirmClose()}),win.onDisableShortcuts(n=>{e.shortcutsDisabled=n}),win.onKeyboardShortcut(n=>{if(!(e.isTransferring||e.isRemoving||e.isSaving||e.isNewFileDialogOpen)&&!e.shortcutsDisabled){if(n===shortcuts.CLOSE&&i.emit("close-tab",e.editingFile),n===shortcuts.CONNECT&&i.emit("connect"),n===shortcuts.DISCONNECT&&i.emit("disconnect"),n===shortcuts.RESET){if(e.view!="editor")return;i.emit("reset")}if(n===shortcuts.CLEAR_TERMINAL){if(e.view!="editor")return;i.emit("clear-terminal")}if(n===shortcuts.CLEAR_EDITOR){if(e.view!="editor")return;const o=e.openFiles.find(v=>v.id==e.editingFile),d=o&&o.editor&&o.editor.editor;if(!d)return;const u=d.state.doc.length;if(u===0)return;d.dispatch({changes:{from:0,to:u,insert:""},selection:{anchor:0}}),d.focus()}if(n===shortcuts.RUN){if(e.view!="editor")return;f()}if(n===shortcuts.RUN_SELECTION||n===shortcuts.RUN_SELECTION_WL){if(e.view!="editor")return;h()}if(n===shortcuts.STOP){if(e.view!="editor")return;k()}if(n===shortcuts.NEW){if(e.view!="editor")return;i.emit("create-new-file")}if(n===shortcuts.SAVE){if(e.view!="editor")return;i.emit("save")}if(n===shortcuts.EDITOR_VIEW){if(e.view!="file-manager")return;i.emit("change-view","editor")}if(n===shortcuts.FILES_VIEW){if(e.view!="editor")return;i.emit("change-view","file-manager")}}});function g(n=null){n&&n.key!="Escape"||(document.removeEventListener("keydown",g),e.isNewFileDialogOpen=!1,i.emit("render"))}let p=!1;function l(){p=!0,setTimeout(()=>{p=!1},500)}function c(n=!1){p||(i.emit("run",n),l())}function f(){canExecute({view:e.view,isConnected:e.isConnected})&&c()}function h(){canExecute({view:e.view,isConnected:e.isConnected})&&c(!0)}function k(){canExecute({view:e.view,isConnected:e.isConnected})&&i.emit("stop")}function y(n){const{source:o,parentFolder:d,fileName:u,content:v=newFileContent,hasChanges:w=!1}=n,S=generateHash(),P=e.cache(CodeMirrorEditor,`editor_${S}`);return P.content=v,{id:S,source:o,parentFolder:d,fileName:u,editor:P,hasChanges:w}}async function F(n,o=null,d=null){const u=n=="board"?e.boardNavigationPath:e.diskNavigationPath;let v=o;if(v===null){const R=e.openFiles.filter(M=>M.source===n&&M.parentFolder===d).map(M=>M.fileName),O=(n==="board"?e.boardFiles:e.diskFiles).map(M=>M.fileName);v=generateFileName([...R,...O])}const w=y({fileName:v,parentFolder:d,source:n,hasChanges:!0});let S=!1;if(d!=null&&(n=="board"?(await serialBridge.getPrompt(),S=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,w.parentFolder,w.fileName))):n=="disk"&&(S=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,w.parentFolder,w.fileName)))),e.openFiles.find(R=>R.parentFolder===w.parentFolder&&R.fileName===w.fileName&&R.source===w.source)||S){const R=await confirmDialog(t("dialog.fileExists.msg",{name:w.fileName,source:n}),t("dialog.ok"),void 0,t("dialog.fileExists.title"));return!1}return w.editor.onChange=function(){w.hasChanges=!0,i.emit("render")},e.openFiles.push(w),e.editingFile=w.id,!0}}const SIDEBAR_WIDTH_MIN=180,SIDEBAR_WIDTH_MAX=600,SIDEBAR_WIDTH_DEFAULT=400;function clampSidebarWidth(e){const i=Number(e);return Number.isFinite(i)?Math.max(SIDEBAR_WIDTH_MIN,Math.min(SIDEBAR_WIDTH_MAX,Math.round(i))):SIDEBAR_WIDTH_DEFAULT}function getSidebarWidthFromStorage(){const e=localStorage.getItem("sidebarWidth");return e==null?SIDEBAR_WIDTH_DEFAULT:clampSidebarWidth(e)}function saveSidebarWidthToStorage(e){try{return localStorage.setItem("sidebarWidth",String(e)),!0}catch(i){return log("saveSidebarWidthToStorage",i),!1}}function getDiskNavigationRootFromStorage(){let e=localStorage.getItem("diskNavigationRoot");return(!e||e=="null")&&(e=null),e}function saveDiskNavigationRootToStorage(e){try{return localStorage.setItem("diskNavigationRoot",e),!0}catch(i){return log("saveDiskNavigationRootToStorage",i),!1}}async function selectDiskFolder(){let{folder:e,files:i}=await disk.openFolder();return e!==null&&e!="null"?e:null}async function getDiskFiles(e){let i=await disk.ilistFiles(e);return i=i.map(a=>({fileName:a.path,type:a.type})),i=i.sort(sortFilesAlphabetically),i}function sortFilesAlphabetically(e,i){return e.fileName.localeCompare(i.fileName)}function generateHash(){return`${Date.now()}_${parseInt(Math.random()*1024)}`}async function getBoardNavigationPath(){let e=await serialBridge.execFile(await getHelperFullPath());e=await serialBridge.run("iget_root()");let i="";try{e=e.substring(e.indexOf("OK")+2,e.indexOf("")),i=e}catch(a){log("error",e)}return i}async function getBoardFiles(e){await serialBridge.getPrompt();let i=await serialBridge.ilistFiles(e);return i=i.map(a=>({fileName:a[0],type:a[1]===16384?"folder":"file"})),i=i.sort(sortFilesAlphabetically),i}function checkDiskFile({root:e,parentFolder:i,fileName:a}){return e==null||i==null||a==null?!1:disk.fileExists(disk.getFullPath(e,i,a))}async function checkBoardFile({root:e,parentFolder:i,fileName:a}){return e==null||i==null||a==null?!1:(await serialBridge.getPrompt(),serialBridge.fileExists(serialBridge.getFullPath(e,i,a)))}async function checkOverwrite({fileNames:e=[],parentPath:i,source:a}){let r=[];return a==="board"?r=await getBoardFiles(i):r=await getDiskFiles(i),r.filter(s=>e.indexOf(s.fileName)!==-1)}function generateFileName(e=[]){const i=new Set(e);if(!i.has("untitled.py"))return"untitled.py";for(let a=2;a<1e4;a++){const r=`untitled_${a}.py`;if(!i.has(r))return r}return`untitled_${Date.now()}.py`}function canSave({view:e,isConnected:i,openFiles:a,editingFile:r}){const s=e==="editor",g=a.find(p=>p.id===r);return!g.hasChanges||!s?!1:g.source==="disk"?!0:i}function canExecute({view:e,isConnected:i}){return e==="editor"&&i}function canDownload({isConnected:e,selectedFiles:i}){const a=i.filter(r=>r.source==="disk");return e&&i.length>0&&a.length===0}function canUpload({isConnected:e,selectedFiles:i}){const a=i.filter(r=>r.source==="board");return e&&i.length>0&&a.length===0}function canEdit({selectedFiles:e}){return e.filter(a=>a.type=="file").length!=0}async function removeBoardFolder(e){let i=await serialBridge.execFile(await getHelperFullPath());await serialBridge.run(`delete_folder('${e}')`)}async function uploadFolder(e,i,a){a=a||function(){},await serialBridge.createFolder(i);let r=await disk.ilistAllFiles(e);for(let s in r){const g=r[s],p=g.path.substring(e.length);g.type==="folder"?await serialBridge.createFolder(serialBridge.getFullPath(i,p,"")):await serialBridge.uploadFile(disk.getFullPath(e,p,""),serialBridge.getFullPath(i,p,""),l=>{a(l,p)})}}async function downloadFolder(e,i,a){a=a||function(){},await disk.createFolder(i);let r=await serialBridge.execFile(await getHelperFullPath());r=await serialBridge.run(`ilist_all('${e}')`);let s=[];try{r=r.substring(r.indexOf("OK")+2,r.indexOf("")),s=JSON.parse(r)}catch(g){log("error",r)}for(let g in s){const p=s[g],l=p.path.substring(e.length);p.type=="folder"?await disk.createFolder(disk.getFullPath(i,l,"")):await serialBridge.downloadFile(serialBridge.getFullPath(e,l,""),serialBridge.getFullPath(i,l,""))}}async function getHelperFullPath(){const e=await disk.getAppPath();return await win.isPackaged()?disk.getFullPath(e,"..","ui/helpers.py"):disk.getFullPath(e,"ui/helpers.py","")}const PANEL_CLOSED=32,PANEL_TOO_SMALL=52,PANEL_DEFAULT=320;function App(e,i){return window.UnsupportedBrowser&&!window.UnsupportedBrowser.isSupported()?window.UnsupportedBrowser.render():html`
    <div id="app">
      <div class="app-shell">
        ${Toolbar(e,i)}
        <div class="app-main">
          ${FirmwareUploader(e,i)}
          ${ActivityBar(e,i)}
          ${Sidebar(e,i)}
          ${SidebarResizer(e,i)}
          <div class="app-content">
            ${EditorView(e,i)}
          </div>
        </div>
        <footer class="app-footer"></footer>
      </div>
      ${NewFileDialog(e,i)}
      ${InstallPackageDialog(e,i)}
      ${Overlay(e,i)}
    </div>
  `}function isAdminHash(){const e=window.location.hash||"";return e.startsWith("#admin/editor")||e.startsWith("#/admin/editor")}window.addEventListener("load",()=>{if(isAdminHash())return;let e=Choo();e.use(store),e.route("*",App),e.mount("#app"),e.emitter.on("DOMContentLoaded",()=>{e.state.diskNavigationRoot&&e.emitter.emit("refresh-files")})}),window.addEventListener("hashchange",e=>{const i=(new URL(e.oldURL).hash||"").replace(/^#\/?/,"").startsWith("admin/editor"),a=isAdminHash();i!==a&&window.location.reload()}),window.addEventListener("contextmenu",e=>{e.preventDefault()}),window.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{const e=document.getElementById("splash");e&&(e.classList.add("splash-hidden"),setTimeout(()=>e.remove(),400))},2e3)});
