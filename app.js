window.APP_VERSION="0.22.0";function Button(e){const{first:i=!1,size:r="",square:l=!1,icon:c="connect.svg",onClick:f=w=>{},disabled:g=!1,active:s=!1,tooltip:u,label:p,background:y}=e;let k=html``;u&&(k=html`<div class="tooltip">${u}</div>`),k=html``;let b=s?"active":"",F=s?"selected":"",n=y?"inverted":"",o=i?"first":"",a=l?"square":"",d=g?"inactive":"active",m=r==="small"?"":html`<div class="label ${d} ${F}">${p}</div>`;return html`
     <div class="button ${o}">
       <button disabled=${g} class="${a}${r} ${b} ${n}" onclick=${f}>
         <img class="icon" src="media/${c}" />
       </button>
       ${m}
       ${k}
     </div>
   `}(function(){let e=null,i=null;function r(){return e||(e=document.createElement("div"),e.className="editor-context-menu",e.setAttribute("role","menu"),e.style.display="none",document.body.appendChild(e),e)}function l(){e&&(e.style.display="none",e.innerHTML="",i=null,document.removeEventListener("mousedown",c,!0),document.removeEventListener("keydown",f,!0),window.removeEventListener("blur",l),window.removeEventListener("resize",l),window.removeEventListener("scroll",l,!0))}function c(o){e&&e.contains(o.target)||l()}function f(o){o.key==="Escape"&&(o.preventDefault(),l())}function g(o){return o.state.selection.main}function s(o){const a=g(o);return a.from!==a.to}async function u(o){const{from:a,to:d}=g(o);if(a===d)return;const m=o.state.sliceDoc(a,d);try{await navigator.clipboard.writeText(m)}catch(w){return}o.dispatch({changes:{from:a,to:d,insert:""},selection:{anchor:a}}),o.focus()}async function p(o){const{from:a,to:d}=g(o);if(a===d)return;const m=o.state.sliceDoc(a,d);try{await navigator.clipboard.writeText(m)}catch(w){}o.focus()}async function y(o){let a;try{a=await navigator.clipboard.readText()}catch(w){return}if(a==null||a==="")return;const{from:d,to:m}=g(o);o.dispatch({changes:{from:d,to:m,insert:a},selection:{anchor:d+a.length}}),o.focus()}function k(o){o.dispatch({selection:{anchor:0,head:o.state.doc.length}}),o.focus()}function b(o,a,d){const m=document.createElement("div");return m.className="editor-context-menu__item"+(a?"":" is-disabled"),m.setAttribute("role","menuitem"),m.textContent=o,a&&m.addEventListener("click",()=>{l(),d()}),m}function F(o,a){const d=e;d.style.display="block",d.style.left="0px",d.style.top="0px";const m=d.offsetWidth,w=d.offsetHeight,E=window.innerWidth,P=window.innerHeight,R=4;let L=o,M=a;L+m+R>E&&(L=Math.max(R,E-m-R)),M+w+R>P&&(M=Math.max(R,P-w-R)),d.style.left=L+"px",d.style.top=M+"px"}function n(o,a){if(!a)return;i=a;const d=r();d.innerHTML="";const m=window.t||(P=>P),w=s(a);d.appendChild(b(m("editor.menu.cut"),w,()=>u(a))),d.appendChild(b(m("editor.menu.copy"),w,()=>p(a))),d.appendChild(b(m("editor.menu.paste"),!0,()=>y(a)));const E=document.createElement("div");E.className="editor-context-menu__sep",d.appendChild(E),d.appendChild(b(m("editor.menu.selectAll"),!0,()=>k(a))),F(o.clientX,o.clientY),document.addEventListener("mousedown",c,!0),document.addEventListener("keydown",f,!0),window.addEventListener("blur",l),window.addEventListener("resize",l),window.addEventListener("scroll",l,!0)}window.EditorContextMenu={show:n,hide:l}})();const EDITOR_FONT_MIN=8,EDITOR_FONT_MAX=48,EDITOR_FONT_DEFAULT=16,EDITOR_FONT_STEP=1;function getEditorFontSize(){const e=document.documentElement.style.getPropertyValue("--editor-font-size").trim(),i=parseFloat(e);return Number.isFinite(i)?i:EDITOR_FONT_DEFAULT}function setEditorFontSize(e){const i=Math.max(EDITOR_FONT_MIN,Math.min(EDITOR_FONT_MAX,e));document.documentElement.style.setProperty("--editor-font-size",i+"px")}class CodeMirrorEditor extends Component{constructor(){super(),this.editor=null,this.content="# empty file",this.scrollTop=0,this.onWheelZoom=this.onWheelZoom.bind(this),this.onContextMenu=this.onContextMenu.bind(this)}createElement(i){return i&&(this.content=i),html`<div id="code-editor"></div>`}load(i){const r=l=>{this.content=l.state.doc.toString(),this.onChange()};this.editor=createEditor(this.content,i,r),i.addEventListener("wheel",this.onWheelZoom,{passive:!1}),i.addEventListener("contextmenu",this.onContextMenu),this._wheelEl=i,setTimeout(()=>{this.editor.scrollDOM.addEventListener("scroll",this.updateScrollPosition.bind(this)),this.editor.scrollDOM.scrollTo({top:this.scrollTop,left:0})},10)}update(){return!1}unload(){this.editor.scrollDOM.removeEventListener("scroll",this.updateScrollPosition),this._wheelEl&&(this._wheelEl.removeEventListener("wheel",this.onWheelZoom,{passive:!1}),this._wheelEl.removeEventListener("contextmenu",this.onContextMenu),this._wheelEl=null),window.EditorContextMenu&&window.EditorContextMenu.hide()}onContextMenu(i){!window.EditorContextMenu||!this.editor||(i.preventDefault(),i.stopPropagation(),window.EditorContextMenu.show(i,this.editor))}onWheelZoom(i){if(!i.ctrlKey)return;i.preventDefault(),i.stopPropagation();const r=getEditorFontSize(),l=i.deltaY<0?EDITOR_FONT_STEP:-EDITOR_FONT_STEP;setEditorFontSize(r+l),this.editor&&typeof this.editor.requestMeasure=="function"&&(this.editor.viewState&&(this.editor.viewState.mustMeasureContent="refresh"),this.editor.requestMeasure())}updateScrollPosition(i){this.scrollTop=i.target.scrollTop}onChange(){return!1}}function Tab(e){const{text:i="undefined",icon:r="ms-computer.svg",onSelectTab:l=()=>!1,onCloseTab:c=()=>!1,onStartRenaming:f=()=>!1,onFinishRenaming:g=()=>!1,disabled:s=!1,active:u=!1,renaming:p=!1,hasChanges:y=!1}=e;if(u)if(p){let n=function(a){g(a.target.value)},o=function(a){a.key.toLowerCase()==="enter"&&a.target.blur(),a.key.toLowerCase()==="escape"&&(a.target.value=null,a.target.blur())};var b=n,F=o;return html`
        <div class="tab active" tabindex="0">
          <img class="icon" src="media/${r}" />
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
          <img class="icon" src="media/${r}" />
          <div class="text"
               onclick=${f}
               ondblclick=${f}>
            ${y?" *":""} ${i}
          </div>
          <div class="options" >
            <button onclick=${c}>
              <img class="icon" src="media/close.svg" />
            </button>
          </div>
        </div>
      `;function k(n){n.target.classList.contains("close-tab")||l(n)}return html`
    <div
      class="tab"
      tabindex="1"
      onclick=${k}
      >
      <img class="icon" src="media/${r}" />
      <div class="text">
        ${y?"*":""} ${i}
      </div>
      <div class="options close-tab">
        <button class="close-tab" onclick=${c}>
          <img class="close-tab icon" src="media/close.svg" />
        </button>
      </div>
    </div>
  `}class XTerm extends Component{constructor(i,r,l){super(i),this.term=new Terminal({fontSize:16,fontFamily:'"CodeFont", monospace',fontWeight:"normal",lineHeight:1.2,theme:{background:"#0d1b2a",foreground:"#e0eaea",cursor:"#ffffff",cursorAccent:"#0d1b2a",selectionBackground:"rgba(0, 212, 170, 0.25)",black:"#1e2d3d",red:"#ff6b6b",green:"#4ecdc4",yellow:"#ffd166",blue:"#5b9bd5",magenta:"#c792ea",cyan:"#00d4aa",white:"#e0eaea",brightBlack:"#4a6070",brightRed:"#ff8e8e",brightGreen:"#7be4dc",brightYellow:"#ffe599",brightBlue:"#80b8e8",brightMagenta:"#d6b0f5",brightCyan:"#33dfbb",brightWhite:"#f5fafa"}}),this.resizeTerm=this.resizeTerm.bind(this)}load(i){this.term.open(i),this.resizeTerm(),window.addEventListener("resize",this.resizeTerm)}createElement(){return html`<div class="terminal-wrapper"></div>`}update(){return this.resizeTerm(),!1}resizeTerm(){if(document.querySelector("#panel")){const i=window.getComputedStyle(document.querySelector("#panel")),r=parseInt(i.getPropertyValue("width")),l=parseInt(i.getPropertyValue("height")),c=Math.floor(r/this.term._core._renderService.dimensions.actualCellWidth)-6,f=Math.floor((l-PANEL_CLOSED)/this.term._core._renderService.dimensions.actualCellHeight)-2;this.term.resize(c,f)}}}const I18N_STORAGE_KEY="language",I18N_SUPPORTED=["en","ko"],I18N_DICT={en:{"toolbar.connect":"Connect","toolbar.disconnect":"Disconnect","toolbar.reset":"Reset","toolbar.run":"Run","toolbar.stop":"Stop","toolbar.new":"New","toolbar.save":"Save","toolbar.addPackage":"Add Package","toolbar.fullScreen":"Full Screen","toolbar.exitFullScreen":"Exit Full","toolbar.settings":"Settings","toolbar.uploadFirmware":"Upload Firmware","toolbar.tooltip.connect":"Connect ({shortcut})","toolbar.tooltip.disconnect":"Disconnect ({shortcut})","toolbar.tooltip.reset":"Reset ({shortcut})","toolbar.tooltip.run":"Run ({shortcut})","toolbar.tooltip.stop":"Stop ({shortcut})","toolbar.tooltip.new":"New ({shortcut})","toolbar.tooltip.save":"Save ({shortcut})","toolbar.tooltip.addPackageEnabled":"Install a MicroPython package onto the board","toolbar.tooltip.addPackageDisabled":"Connect to a board first","toolbar.tooltip.enterFullScreen":"Enter full screen","toolbar.tooltip.exitFullScreen":"Exit full screen","toolbar.tooltip.settings":"Toggle settings sidebar","toolbar.tooltip.uploadFirmware":"Upload MicroPython firmware","firmware.title":"Upload MicroPython Firmware","firmware.close":"Close","firmware.serial.title":"Serial Connection","firmware.serial.baudRate":"Baud Rate","firmware.serial.baudDefault":"921,600 (default)","firmware.serial.connect":"Connect Port","firmware.serial.disconnect":"Disconnect","firmware.serial.help":"If it doesn\u2019t connect, hold BOOT and press RESET to enter bootloader mode.","firmware.select.title":"Select Firmware","firmware.tab.micropython":"MicroPython","firmware.tag.stable":"STABLE","firmware.tag.legacy":"LEGACY","firmware.upload.button":"Upload Firmware","firmware.upload.uploading":"Uploading...","firmware.upload.done":"Done","firmware.upload.success":"Upload finished. The board will reboot automatically.","firmware.upload.error":"Upload failed. Hold BOOT + press RESET to re-enter bootloader and try again.","firmware.upload.progressLabel":"Upload progress","firmware.log.title":"Log Console","firmware.log.clear":"Clear","firmware.log.empty":"Logs will appear here once you connect to a serial port.","firmware.version.mpy_v1_28_0.label":"MicroPython v1.28.0","firmware.version.mpy_v1_28_0.description":"Official MicroPython firmware (ESP32_GENERIC_S3 build, single image)","firmware.version.mpy_v1_28_0.changelog.0":"Python 3 REPL via serial","firmware.version.mpy_v1_28_0.changelog.1":"Official ESP32_GENERIC_S3 build (4MB flash)","firmware.version.mpy_v1_28_0.changelog.2":"Single .bin flashed at 0x0","firmware.log.notSupported":"Web Serial API is not supported in this browser.","firmware.log.selectingPort":"Selecting serial port...","firmware.log.portCancelled":"Port selection cancelled.","firmware.log.initializingEsptool":"Initializing esptool-js...","firmware.log.connected":"\u2713 {chip} connected (baud: {baud})","firmware.log.connectFailed":"Connect failed: {err}","firmware.log.bootResetHint":"Hold BOOT and press RESET, then try again.","firmware.log.disconnected":"Disconnected","firmware.log.disconnectFailed":"Disconnect failed: {err}","firmware.log.connectFirst":"Connect to a port first.","firmware.log.flashStart":"Starting ESP32-S3 firmware flash (esptool-js)","firmware.log.flashMode":"  Flash Mode: {value}","firmware.log.flashFreq":"  Flash Freq: {value}","firmware.log.flashSize":"  Flash Size: {value}","firmware.log.fileCount":"  Files: {n}","firmware.log.flashDone":"\u2713 Firmware flash complete!","firmware.log.boardReset":"Resetting board...","firmware.log.resetDone":"\u2713 Reset done \u2014 board boots in normal mode","firmware.log.flashFailed":"\u2717 Flash failed: {err}","firmware.log.bootResetRetryHint":"Hold BOOT + RESET to re-enter bootloader and try again.","firmware.log.selectFw":"Please select a firmware.","firmware.log.fwNotFound":"Selected firmware version not found.","firmware.log.loadingFw":"Loading firmware {version}...","firmware.log.downloading":"  Downloading: {path}","firmware.log.loadFailed":"File load failed: {path} ({status})","firmware.log.loadedEntry":"  \u2713 {label}: {bytes} bytes","firmware.log.allLoaded":"All files loaded ({n} total)","firmware.log.loadError":"Firmware load error: {err}","sidebar.connectToBoard":"Connect to board","sidebar.selectFolder":"Select a folder...","sidebar.refresh":"Refresh file list","sidebar.deleteBoard":"Delete selected files on board","sidebar.deleteDisk":"Delete selected files on disk","sidebar.toggle":"Toggle sidebar","sidebar.hideFiles":"Hide files","sidebar.showFiles":"Show files","repl.connectedTo":"Connected to {name}","repl.showTerminal":"Show terminal","repl.copy":"Copy","repl.paste":"Paste","repl.clean":"Clean ({shortcut})","dialog.install.title":"Install a MicroPython package","dialog.install.search":"Search packages\u2026","dialog.install.loading":"Loading package list\u2026","dialog.install.noResults":"No packages match your search.","dialog.install.unnamed":"(unnamed)","dialog.install.working":"Working\u2026","dialog.install.installThis":"Install this package","dialog.install.openDocs":"Open documentation","dialog.install.noDocs":"No documentation URL available","dialog.install.overwrite":"Overwrite existing","dialog.install.installAsMpy":"Install as .mpy when available","dialog.install.fromUrl":"Install from URL","dialog.install.urlPlaceholder":"github:owner/repo@version","dialog.install.installBtn":"Install","dialog.install.close":"Close","dialog.install.closeDisabled":"Cannot close while installing","dialog.install.mpyNotSupported":"Board does not report an .mpy format \u2014 only .py will be installed","dialog.install.mpyFormatArch":"Board: {arch}, format {format}","dialog.install.mpyFormatOnly":"Format {format}","dialog.install.resolving":"Resolving\u2026","dialog.install.installed":"Installed.","dialog.newFile.title":"Create new file","dialog.newFile.close":"Close","dialog.newFile.board":"Board","dialog.newFile.computer":"Computer","dialog.ok":"OK","dialog.cancel":"Cancel","dialog.yes":"Yes","dialog.unsaved.title":"Unsaved Changes","dialog.unsaved.msg":"Your file has unsaved changes. Are you sure you want to proceed?","dialog.unsaved.msgMayHave":"You may have unsaved changes. Are you sure you want to proceed?","dialog.connectFailed.title":"Connection Failed","dialog.connectFailed.msg":"Could not connect to the board. Reset it and try again.","dialog.fileExists.title":"File Already Exists","dialog.fileExists.msg":"File {name} already exists on {source}. Please choose another name.","dialog.overwrite.title":"Confirm Overwrite","dialog.overwrite.msgFile":`You are about to overwrite the file {name} on your {source}.

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
`,"overlay.loading":"Loading files...","overlay.removing":"Removing...","overlay.connecting":"Connecting...","overlay.saving":"Saving file... {progress}","overlay.transferring":"Transferring file","toast.boardDisconnected":"Board disconnected.","toast.packageRegistryFailed":"Could not load package registry: {err}","settings.title":"Settings","settings.close":"Close settings","settings.language":"Language","settings.apply":"Apply","editor.menu.cut":"Cut","editor.menu.copy":"Copy","editor.menu.paste":"Paste","editor.menu.selectAll":"Select All","activity.explorer":"Explorer","activity.python":"Python","activity.settings":"Settings","topic.loading":"Loading\u2026","topic.error":"Failed to load: {err}","topic.back":"Back","topic.empty":"No topics yet.","admin.title":"Tutorial Editor","admin.openMain":"Back to app","admin.file":"File","admin.lang":"Language","admin.save":"Save","admin.saving":"Saving\u2026","admin.dirty":"Unsaved changes","admin.clean":"All saved","admin.loadError":"Load failed: {err}","admin.saveError":"Save failed: {err}","admin.topics":"Topics","admin.addTopic":"Add topic","admin.removeTopic":"Remove topic","admin.moveUp":"Move up","admin.moveDown":"Move down","admin.entries":"Entries","admin.addEntry":"Add entry","admin.removeEntry":"Remove entry","admin.addExample":"Add example","admin.removeExample":"Remove example","admin.field.id":"id","admin.field.title":"title","admin.field.description":"description","admin.field.icon":"icon (Material Symbol name)","admin.field.notice":"notice","admin.field.name":"name","admin.field.summary":"summary","admin.field.details":"details (Markdown)","admin.field.code":"code","admin.field.exampleDesc":"example description","admin.preview":"Preview"},ko:{"toolbar.connect":"\uC5F0\uACB0","toolbar.disconnect":"\uC5F0\uACB0 \uD574\uC81C","toolbar.reset":"\uC7AC\uC2DC\uC791","toolbar.run":"\uC2E4\uD589","toolbar.stop":"\uC911\uC9C0","toolbar.new":"\uC0C8 \uD30C\uC77C","toolbar.save":"\uC800\uC7A5","toolbar.addPackage":"\uD328\uD0A4\uC9C0 \uCD94\uAC00","toolbar.fullScreen":"\uC804\uCCB4 \uD654\uBA74","toolbar.exitFullScreen":"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC","toolbar.settings":"\uC124\uC815","toolbar.uploadFirmware":"\uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","toolbar.tooltip.connect":"\uC5F0\uACB0 ({shortcut})","toolbar.tooltip.disconnect":"\uC5F0\uACB0 \uD574\uC81C ({shortcut})","toolbar.tooltip.reset":"\uC7AC\uC2DC\uC791 ({shortcut})","toolbar.tooltip.run":"\uC2E4\uD589 ({shortcut})","toolbar.tooltip.stop":"\uC911\uC9C0 ({shortcut})","toolbar.tooltip.new":"\uC0C8 \uD30C\uC77C ({shortcut})","toolbar.tooltip.save":"\uC800\uC7A5 ({shortcut})","toolbar.tooltip.addPackageEnabled":"\uBCF4\uB4DC\uC5D0 MicroPython \uD328\uD0A4\uC9C0 \uC124\uCE58","toolbar.tooltip.addPackageDisabled":"\uBA3C\uC800 \uBCF4\uB4DC\uC5D0 \uC5F0\uACB0\uD558\uC138\uC694","toolbar.tooltip.enterFullScreen":"\uC804\uCCB4 \uD654\uBA74\uC73C\uB85C \uC804\uD658","toolbar.tooltip.exitFullScreen":"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC","toolbar.tooltip.settings":"\uC124\uC815 \uC0AC\uC774\uB4DC\uBC14 \uD1A0\uAE00","toolbar.tooltip.uploadFirmware":"\uB9C8\uC774\uD06C\uB85C\uD30C\uC774\uC36C \uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","firmware.title":"\uB9C8\uC774\uD06C\uB85C\uD30C\uC774\uC36C \uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","firmware.close":"\uB2EB\uAE30","firmware.serial.title":"\uC2DC\uB9AC\uC5BC \uC5F0\uACB0","firmware.serial.baudRate":"Baud Rate","firmware.serial.baudDefault":"921,600 (\uAE30\uBCF8\uAC12)","firmware.serial.connect":"\uD3EC\uD2B8 \uC5F0\uACB0","firmware.serial.disconnect":"\uC5F0\uACB0 \uD574\uC81C","firmware.serial.help":"\uC5F0\uACB0\uC774 \uC548 \uB418\uBA74 BOOT \uBC84\uD2BC\uC744 \uB204\uB978 \uCC44 RESET\uC744 \uB20C\uB7EC \uBD80\uD2B8\uB85C\uB354 \uBAA8\uB4DC\uB85C \uC9C4\uC785\uD558\uC138\uC694.","firmware.select.title":"\uD38C\uC6E8\uC5B4 \uC120\uD0DD","firmware.tab.micropython":"MicroPython","firmware.tag.stable":"STABLE","firmware.tag.legacy":"LEGACY","firmware.upload.button":"\uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","firmware.upload.uploading":"\uC5C5\uB85C\uB4DC \uC911...","firmware.upload.done":"\uC5C5\uB85C\uB4DC \uC644\uB8CC","firmware.upload.success":"\uC5C5\uB85C\uB4DC\uAC00 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uBCF4\uB4DC\uAC00 \uC790\uB3D9\uC73C\uB85C \uC7AC\uC2DC\uC791\uB429\uB2C8\uB2E4.","firmware.upload.error":"\uC5C5\uB85C\uB4DC \uC2E4\uD328. BOOT+RESET\uC73C\uB85C \uBD80\uD2B8\uB85C\uB354 \uC9C4\uC785 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","firmware.upload.progressLabel":"\uC5C5\uB85C\uB4DC \uC9C4\uD589","firmware.log.title":"\uB85C\uADF8 \uCF58\uC194","firmware.log.clear":"\uCD08\uAE30\uD654","firmware.log.empty":"\uC2DC\uB9AC\uC5BC \uD3EC\uD2B8\uC5D0 \uC5F0\uACB0\uD558\uBA74 \uB85C\uADF8\uAC00 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4.","firmware.version.mpy_v1_28_0.label":"\uB9C8\uC774\uD06C\uB85C\uD30C\uC774\uC36C v1.28.0","firmware.version.mpy_v1_28_0.description":"MicroPython \uACF5\uC2DD \uD38C\uC6E8\uC5B4 (ESP32_GENERIC_S3 \uBE4C\uB4DC, \uB2E8\uC77C \uC774\uBBF8\uC9C0)","firmware.version.mpy_v1_28_0.changelog.0":"Python 3 \uD638\uD658 REPL \xB7 REPL \uC2DC\uB9AC\uC5BC \uC811\uC18D\uC73C\uB85C \uBC14\uB85C \uCF54\uB529","firmware.version.mpy_v1_28_0.changelog.1":"\uACF5\uC2DD ESP32_GENERIC_S3 \uBE4C\uB4DC (4MB \uD50C\uB798\uC2DC)","firmware.version.mpy_v1_28_0.changelog.2":"\uB2E8\uC77C .bin \uC774\uBBF8\uC9C0\uB97C 0x0 \uC624\uD504\uC14B\uC5D0 \uC77C\uAD04 \uD50C\uB798\uC2DC","firmware.log.notSupported":"\uC774 \uBE0C\uB77C\uC6B0\uC800\uB294 Web Serial API\uB97C \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.","firmware.log.selectingPort":"\uC2DC\uB9AC\uC5BC \uD3EC\uD2B8 \uC120\uD0DD \uC911...","firmware.log.portCancelled":"\uD3EC\uD2B8 \uC120\uD0DD\uC774 \uCDE8\uC18C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.","firmware.log.initializingEsptool":"esptool-js \uCD08\uAE30\uD654 \uC911...","firmware.log.connected":"\u2713 {chip} \uC5F0\uACB0 \uC644\uB8CC (baud: {baud})","firmware.log.connectFailed":"\uC5F0\uACB0 \uC2E4\uD328: {err}","firmware.log.bootResetHint":"BOOT \uBC84\uD2BC\uC744 \uB204\uB978 \uCC44 RESET \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","firmware.log.disconnected":"\uC5F0\uACB0 \uD574\uC81C","firmware.log.disconnectFailed":"\uC5F0\uACB0 \uD574\uC81C \uC2E4\uD328: {err}","firmware.log.connectFirst":"\uBA3C\uC800 \uD3EC\uD2B8\uC5D0 \uC5F0\uACB0\uD574\uC8FC\uC138\uC694.","firmware.log.flashStart":"ESP32-S3 \uD38C\uC6E8\uC5B4 \uD50C\uB798\uC2F1 \uC2DC\uC791 (esptool-js)","firmware.log.flashMode":"  Flash Mode: {value}","firmware.log.flashFreq":"  Flash Freq: {value}","firmware.log.flashSize":"  Flash Size: {value}","firmware.log.fileCount":"  \uD30C\uC77C \uC218: {n}","firmware.log.flashDone":"\u2713 \uD38C\uC6E8\uC5B4 \uD50C\uB798\uC2F1 \uC644\uB8CC!","firmware.log.boardReset":"\uBCF4\uB4DC \uB9AC\uC14B \uC911...","firmware.log.resetDone":"\u2713 \uB9AC\uC14B \uC644\uB8CC \u2014 \uBCF4\uB4DC\uAC00 \uC815\uC0C1 \uBAA8\uB4DC\uB85C \uBD80\uD305\uB429\uB2C8\uB2E4","firmware.log.flashFailed":"\u2717 \uD50C\uB798\uC2F1 \uC2E4\uD328: {err}","firmware.log.bootResetRetryHint":"BOOT + RESET\uC73C\uB85C \uBD80\uD2B8\uB85C\uB354 \uC7AC\uC9C4\uC785 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","firmware.log.selectFw":"\uD38C\uC6E8\uC5B4\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.","firmware.log.fwNotFound":"\uC120\uD0DD\uD55C \uD38C\uC6E8\uC5B4 \uBC84\uC804\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.","firmware.log.loadingFw":"\uD38C\uC6E8\uC5B4 {version} \uD30C\uC77C \uB85C\uB4DC \uC911...","firmware.log.downloading":"  \uB2E4\uC6B4\uB85C\uB4DC: {path}","firmware.log.loadFailed":"\uD30C\uC77C \uB85C\uB4DC \uC2E4\uD328: {path} ({status})","firmware.log.loadedEntry":"  \u2713 {label}: {bytes} bytes","firmware.log.allLoaded":"\uBAA8\uB4E0 \uD30C\uC77C \uB85C\uB4DC \uC644\uB8CC (\uCD1D {n}\uAC1C)","firmware.log.loadError":"\uD38C\uC6E8\uC5B4 \uB85C\uB4DC \uC624\uB958: {err}","sidebar.connectToBoard":"\uBCF4\uB4DC \uC5F0\uACB0","sidebar.selectFolder":"\uD3F4\uB354\uB97C \uC120\uD0DD\uD558\uC138\uC694...","sidebar.refresh":"\uD30C\uC77C \uBAA9\uB85D \uC0C8\uB85C \uACE0\uCE68","sidebar.deleteBoard":"\uBCF4\uB4DC\uC5D0\uC11C \uC120\uD0DD\uD55C \uD30C\uC77C \uC0AD\uC81C","sidebar.deleteDisk":"\uB514\uC2A4\uD06C\uC5D0\uC11C \uC120\uD0DD\uD55C \uD30C\uC77C \uC0AD\uC81C","sidebar.toggle":"\uC0AC\uC774\uB4DC\uBC14 \uD1A0\uAE00","sidebar.hideFiles":"\uD30C\uC77C \uC228\uAE30\uAE30","sidebar.showFiles":"\uD30C\uC77C \uBCF4\uC774\uAE30","repl.connectedTo":"{name}\uC5D0 \uC5F0\uACB0\uB428","repl.showTerminal":"\uD130\uBBF8\uB110 \uD45C\uC2DC","repl.copy":"\uBCF5\uC0AC","repl.paste":"\uBD99\uC5EC\uB123\uAE30","repl.clean":"\uC9C0\uC6B0\uAE30 ({shortcut})","dialog.install.title":"MicroPython \uD328\uD0A4\uC9C0 \uC124\uCE58","dialog.install.search":"\uD328\uD0A4\uC9C0 \uAC80\uC0C9\u2026","dialog.install.loading":"\uD328\uD0A4\uC9C0 \uBAA9\uB85D \uBD88\uB7EC\uC624\uB294 \uC911\u2026","dialog.install.noResults":"\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.","dialog.install.unnamed":"(\uC774\uB984 \uC5C6\uC74C)","dialog.install.working":"\uC791\uC5C5 \uC911\u2026","dialog.install.installThis":"\uC774 \uD328\uD0A4\uC9C0 \uC124\uCE58","dialog.install.openDocs":"\uBB38\uC11C \uC5F4\uAE30","dialog.install.noDocs":"\uBB38\uC11C URL\uC774 \uC5C6\uC2B5\uB2C8\uB2E4","dialog.install.overwrite":"\uAE30\uC874 \uD30C\uC77C \uB36E\uC5B4\uC4F0\uAE30","dialog.install.installAsMpy":"\uAC00\uB2A5\uD558\uBA74 .mpy\uB85C \uC124\uCE58","dialog.install.fromUrl":"URL\uC5D0\uC11C \uC124\uCE58","dialog.install.urlPlaceholder":"github:owner/repo@version","dialog.install.installBtn":"\uC124\uCE58","dialog.install.close":"\uB2EB\uAE30","dialog.install.closeDisabled":"\uC124\uCE58 \uC911\uC5D0\uB294 \uB2EB\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4","dialog.install.mpyNotSupported":"\uBCF4\uB4DC\uAC00 .mpy \uD3EC\uB9F7\uC744 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC544 .py\uB9CC \uC124\uCE58\uB429\uB2C8\uB2E4","dialog.install.mpyFormatArch":"\uBCF4\uB4DC: {arch}, \uD3EC\uB9F7 {format}","dialog.install.mpyFormatOnly":"\uD3EC\uB9F7 {format}","dialog.install.resolving":"\uBD84\uC11D \uC911\u2026","dialog.install.installed":"\uC124\uCE58\uB428.","dialog.newFile.title":"\uC0C8 \uD30C\uC77C \uB9CC\uB4E4\uAE30","dialog.newFile.close":"\uB2EB\uAE30","dialog.newFile.board":"\uBCF4\uB4DC","dialog.newFile.computer":"\uCEF4\uD4E8\uD130","dialog.ok":"\uD655\uC778","dialog.cancel":"\uCDE8\uC18C","dialog.yes":"\uC608","dialog.unsaved.title":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D","dialog.unsaved.msg":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?","dialog.unsaved.msgMayHave":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D\uC774 \uC788\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?","dialog.connectFailed.title":"\uC5F0\uACB0 \uC2E4\uD328","dialog.connectFailed.msg":"\uBCF4\uB4DC\uC5D0 \uC5F0\uACB0\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC7AC\uC2DC\uC791 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","dialog.fileExists.title":"\uD30C\uC77C\uC774 \uC774\uBBF8 \uC874\uC7AC\uD569\uB2C8\uB2E4","dialog.fileExists.msg":"{source}\uC5D0 {name} \uD30C\uC77C\uC774 \uC774\uBBF8 \uC874\uC7AC\uD569\uB2C8\uB2E4. \uB2E4\uB978 \uC774\uB984\uC744 \uC0AC\uC6A9\uD558\uC138\uC694.","dialog.overwrite.title":"\uB36E\uC5B4\uC4F0\uAE30 \uD655\uC778","dialog.overwrite.msgFile":`{source}\uC5D0 \uC788\uB294 {name} \uD30C\uC77C\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4.

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
`,"overlay.loading":"\uD30C\uC77C \uBD88\uB7EC\uC624\uB294 \uC911...","overlay.removing":"\uC0AD\uC81C \uC911...","overlay.connecting":"\uC5F0\uACB0 \uC911...","overlay.saving":"\uD30C\uC77C \uC800\uC7A5 \uC911... {progress}","overlay.transferring":"\uD30C\uC77C \uC804\uC1A1 \uC911","toast.boardDisconnected":"\uBCF4\uB4DC\uC640 \uC5F0\uACB0\uC774 \uB04A\uC5B4\uC84C\uC2B5\uB2C8\uB2E4.","toast.packageRegistryFailed":"\uD328\uD0A4\uC9C0 \uB808\uC9C0\uC2A4\uD2B8\uB9AC \uBD88\uB7EC\uC624\uAE30 \uC2E4\uD328: {err}","settings.title":"\uC124\uC815","settings.close":"\uC124\uC815 \uB2EB\uAE30","settings.language":"\uC5B8\uC5B4","settings.apply":"\uC801\uC6A9","editor.menu.cut":"\uC798\uB77C\uB0B4\uAE30","editor.menu.copy":"\uBCF5\uC0AC","editor.menu.paste":"\uBD99\uC5EC\uB123\uAE30","editor.menu.selectAll":"\uC804\uCCB4 \uC120\uD0DD","activity.explorer":"\uD30C\uC77C","activity.python":"\uD30C\uC774\uC36C","activity.settings":"\uC124\uC815","topic.loading":"\uBD88\uB7EC\uC624\uB294 \uC911\u2026","topic.error":"\uB85C\uB4DC \uC2E4\uD328: {err}","topic.back":"\uB4A4\uB85C","topic.empty":"\uC544\uC9C1 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.","admin.title":"\uD29C\uD1A0\uB9AC\uC5BC \uD3B8\uC9D1\uAE30","admin.openMain":"\uC571\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30","admin.file":"\uD30C\uC77C","admin.lang":"\uC5B8\uC5B4","admin.save":"\uC800\uC7A5","admin.saving":"\uC800\uC7A5 \uC911\u2026","admin.dirty":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D","admin.clean":"\uBAA8\uB450 \uC800\uC7A5\uB428","admin.loadError":"\uB85C\uB4DC \uC2E4\uD328: {err}","admin.saveError":"\uC800\uC7A5 \uC2E4\uD328: {err}","admin.topics":"\uD1A0\uD53D","admin.addTopic":"\uD1A0\uD53D \uCD94\uAC00","admin.removeTopic":"\uD1A0\uD53D \uC0AD\uC81C","admin.moveUp":"\uC704\uB85C","admin.moveDown":"\uC544\uB798\uB85C","admin.entries":"\uC5D4\uD2B8\uB9AC","admin.addEntry":"\uC5D4\uD2B8\uB9AC \uCD94\uAC00","admin.removeEntry":"\uC5D4\uD2B8\uB9AC \uC0AD\uC81C","admin.addExample":"\uC608\uC81C \uCD94\uAC00","admin.removeExample":"\uC608\uC81C \uC0AD\uC81C","admin.field.id":"id","admin.field.title":"\uC81C\uBAA9","admin.field.description":"\uD55C \uC904 \uC124\uBA85","admin.field.icon":"\uC544\uC774\uCF58 (Material Symbol \uC774\uB984)","admin.field.notice":"\uC548\uB0B4 \uBC15\uC2A4","admin.field.name":"\uC774\uB984","admin.field.summary":"\uC694\uC57D","admin.field.details":"\uC0C1\uC138 (Markdown)","admin.field.code":"\uCF54\uB4DC","admin.field.exampleDesc":"\uC608\uC81C \uC124\uBA85","admin.preview":"\uBBF8\uB9AC\uBCF4\uAE30"}};function i18nDetectDefault(){const e=(navigator.language||"en").split("-")[0].toLowerCase();return I18N_SUPPORTED.includes(e)?e:"en"}function i18nGetStored(){try{return localStorage.getItem(I18N_STORAGE_KEY)}catch(e){return null}}function i18nSetStored(e){try{localStorage.setItem(I18N_STORAGE_KEY,e)}catch(i){}}let __i18nLang=(function(){const e=i18nGetStored();return e&&I18N_SUPPORTED.includes(e)?e:i18nDetectDefault()})();function applyHtmlLang(e){typeof document!="undefined"&&document.documentElement&&(document.documentElement.lang=e)}applyHtmlLang(__i18nLang);function t(e,i){const r=I18N_DICT[__i18nLang]||I18N_DICT.en;let l=r[e]!==void 0?r[e]:I18N_DICT.en[e]!==void 0?I18N_DICT.en[e]:e;if(i)for(const c in i)l=l.split("{"+c+"}").join(String(i[c]));return l}window.t=t,window.i18n={getLanguage:()=>__i18nLang,setLanguage:e=>{I18N_SUPPORTED.includes(e)&&(__i18nLang=e,i18nSetStored(e),applyHtmlLang(e))},getAvailable:()=>I18N_SUPPORTED.slice(),detectDefault:i18nDetectDefault},window.FirmwareConfig={FIRMWARE_VERSIONS:[{id:"micropython-v1.28.0",version:"v1.28.0",board:"micropython",labelKey:"firmware.version.mpy_v1_28_0.label",descriptionKey:"firmware.version.mpy_v1_28_0.description",changelogKeys:["firmware.version.mpy_v1_28_0.changelog.0","firmware.version.mpy_v1_28_0.changelog.1","firmware.version.mpy_v1_28_0.changelog.2"],image:"firmware/micropython.png",date:"2026-04-06",tag:"stable",combinedImage:"ESP32_GENERIC_S3-20260406-v1.28.0.bin"}],BOARD_TABS:[{id:"micropython",labelKey:"firmware.tab.micropython",icon:"firmware/micropython.png"}],getFlashMap(e){return[{path:`firmware/${e.board}/${e.version}/${e.combinedImage}`,address:0,label:"MicroPython (combined)"}]},DEFAULT_SETTINGS:{baudRate:921600},FLASH_MODE:"keep",FLASH_FREQ:"keep",FLASH_SIZE:"keep"};function CodeEditor(e,i){return e.editingFile?e.openFiles.find(l=>l.id==e.editingFile).editor.render():html`
      <div id="code-editor"></div>
    `}function NewFileDialog(e,i){const r=e.isNewFileDialogOpen?"open":"closed";function l(b){b.target.id=="dialog-new-file"&&i("close-new-file-dialog")}function c(b){b.stopPropagation(),i("close-new-file-dialog")}function f(b){return F=>{F&&F.stopPropagation&&F.stopPropagation();const n=document.querySelector("#file-name"),o=n.value.trim()||n.placeholder;i("create-new-tab",b,o)}}new MutationObserver((b,F)=>{const n=document.querySelector("#dialog-new-file input");n&&(n.focus(),F.disconnect())}).observe(document.body,{childList:!0,subtree:!0});const s=[...(e.openFiles||[]).map(b=>b.fileName),...(e.diskFiles||[]).map(b=>b.fileName),...(e.boardFiles||[]).map(b=>b.fileName)],p={type:"text",id:"file-name",value:"",placeholder:generateFileName(s)},y=e.isConnected?html`<button type="button" onclick=${f("board")}>${t("dialog.newFile.board")}</button>`:"",k=html`
  <div id="dialog-new-file" class="dialog ${r}" onclick=${l}>
    <div class="dialog-content">
      <div class="dialog-header">
        <div class="dialog-title">${t("dialog.newFile.title")}</div>
        <button class="dialog-close" type="button" aria-label=${t("dialog.newFile.close")} onclick=${c}>×</button>
      </div>
      <div class="dialog-body">
        <input ${p} />
      </div>
      <div class="dialog-actions">
        ${y}
        <button type="button" class="dialog-action-default" onclick=${f("disk")}>${t("dialog.newFile.computer")}</button>
      </div>
    </div>
  </div>
`;if(e.isNewFileDialogOpen){const b=k.querySelector("#dialog-new-file .dialog-content input");return b&&b.focus(),k}}function InstallPackageDialog(e,i){const r=e.isInstallPackageDialogOpen?"open":"closed",l=e.packageSearchResults||[],c=e.selectedPackage,f=!!e.isInstallingPackage;function g(d){i("search-packages",d.target.value)}function s(d){return()=>{f||i("select-package-to-install",d)}}function u(d){return m=>{m&&m.stopPropagation&&m.stopPropagation(),!f&&i("install-package",d)}}function p(d){return m=>{m&&m.stopPropagation&&m.stopPropagation();const w=d.docs||d.url;if(!w)return;const E=/^https?:\/\//.test(w)?w:w.startsWith("github:")?"https://github.com/"+w.substring(7).split("@")[0]:w.startsWith("gitlab:")?"https://gitlab.com/"+w.substring(7).split("@")[0]:w;window.open(E,"_blank","noopener,noreferrer")}}function y(){f||i("close-install-package-dialog")}function k(d){i("toggle-install-overwrite",d.target.checked)}const b=l.length===0?html`<div class="package-empty">${e.packageList.length===0?t("dialog.install.loading"):t("dialog.install.noResults")}</div>`:l.map(d=>{const m=c&&c.name===d.name&&c.url===d.url,w="package-item"+(m?" selected":""),E=d.url?html`<span class="package-source">${d.url}</span>`:html`<span class="package-source">micropython-lib</span>`,R=!!(d.docs||d.url||""),L=m?html`
              <div class="package-actions">
                <button class="package-action-btn"
                        title=${t("dialog.install.installThis")}
                        disabled=${f}
                        onclick=${u(d)}>
                  <span class="material-symbols-outlined">deployed_code_update</span>
                </button>
                <button class="package-action-btn"
                        title=${t(R?"dialog.install.openDocs":"dialog.install.noDocs")}
                        disabled=${!R}
                        onclick=${p(d)}>
                  <span class="material-symbols-outlined">description</span>
                </button>
              </div>
            `:"";return html`
          <div class="${w}" onclick=${s(d)}>
            <div class="package-info">
              <div class="package-head">
                <span class="material-symbols-outlined package-icon">deployed_code</span>
                <span class="package-name">${d.name||t("dialog.install.unnamed")}</span>
                ${d.version?html`<span class="package-version">v${d.version}</span>`:""}
              </div>
              <div class="package-desc">${d.description||""}</div>
              ${E}
            </div>
            ${L}
          </div>
        `}),F=e.installPackageError?html`<div class="install-error">${e.installPackageError}</div>`:"",n=f?html`<div class="install-progress">${e.installPackageProgress||t("dialog.install.working")}</div>`:"",o=f?html`<button class="dialog-close-floating" disabled title=${t("dialog.install.closeDisabled")}><span class="material-symbols-outlined">close</span></button>`:html`<button class="dialog-close-floating" onclick=${y} title=${t("dialog.install.close")}><span class="material-symbols-outlined">close</span></button>`,a=html`
  <div id="dialog-install-package" class="dialog ${r}">
    <div class="dialog-content install-package-dialog">
      ${o}
      <div class="dialog-title">${t("dialog.install.title")}</div>

      <input type="search"
             id="install-package-search"
             placeholder=${t("dialog.install.search")}
             value=${e.packageSearchQuery||""}
             oninput=${g} />

      <div class="package-list">${b}</div>

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
  `;if(e.isInstallPackageDialogOpen)return a}function FileActions(e,i){const{isConnected:r,selectedFiles:l}=e;return html`
  <div id="file-actions">
    ${Button({icon:"arrow-up.svg",size:"small",disabled:!canUpload({isConnected:r,selectedFiles:l}),onClick:()=>i("upload-files")})}
    ${Button({icon:"arrow-down.svg",size:"small",disabled:!canDownload({isConnected:r,selectedFiles:l}),onClick:()=>i("download-files")})}
  </div>

  `}const DiskFileList=generateFileList("disk"),BoardFileList=generateFileList("board");function generateFileList(e){return function(r,l){function c(b){b.key.toLowerCase()==="enter"&&b.target.blur(),b.key.toLowerCase()==="escape"&&(b.target.value=null,b.target.blur())}const f=html`
      <div class="item">
        <img class="icon" src="media/file.svg" />
        <div class="text">
          <input type="text" onkeydown=${c} onblur=${b=>l("finish-creating-file",b.target.value)}/>
        </div>
      </div>
    `,g=html`
      <div class="item">
        <img class="icon" src="media/folder.svg" />
        <div class="text">
          <input type="text" onkeydown=${c} onblur=${b=>l("finish-creating-folder",b.target.value)}/>
        </div>
      </div>
    `;function s(b,F){const n=html`
        <input type="text"
          value=${b.fileName}
          onkeydown=${c}
          onblur=${P=>l("finish-renaming-file",P.target.value)}
          onclick=${P=>!1}
          ondblclick=${P=>!1}
          />
      `,o=r.selectedFiles.find(P=>P.fileName===b.fileName&&P.source===e);function a(P){return P.preventDefault(),l("rename-file",e,b),!1}function d(){r.renamingFile||l(`navigate-${e}-folder`,b.fileName)}function m(){r.renamingFile||l("open-file",e,b)}let w=b.fileName;const E=r.selectedFiles.find(P=>P.fileName===w);return r.renamingFile==e&&E&&(w=n),b.type==="folder"?html`
          <div
            class="item ${o?"selected":""}"
            onclick=${P=>l("toggle-file-selection",b,e,P)}
            ondblclick=${d}
            >
            <img class="icon" src="media/folder.svg" />
            <div class="text">${w}</div>
            <div class="options" onclick=${a}>
              <img src="media/ms-edit.svg" />
            </div>
          </div>
        `:html`
          <div
            class="item ${o?"selected":""}"
            onclick=${P=>l("toggle-file-selection",b,e,P)}
            ondblclick=${m}
            >
            <img class="icon" src="media/file.svg"  />
            <div class="text">${w}</div>
            <div class="options" onclick=${a}>
              <img src="media/ms-edit.svg" />
            </div>
          </div>
        `}const u=r[`${e}Files`].sort((b,F)=>{const n=b.fileName.toUpperCase(),o=F.fileName.toUpperCase();if(b.type==="folder"&&F.type==="file")return-1;if(b.type===F.type){if(n<o)return-1;if(n>o)return 1}return 0}),p=html`<div class="item"
  onclick=${()=>l(`navigate-${e}-parent`)}
  style="cursor: pointer"
  >
  ..
</div>`,y=html`
      <div class="file-list">
        <div class="list">
          ${e==="disk"&&r.diskNavigationPath!="/"?p:""}
          ${e==="board"&&r.boardNavigationPath!="/"?p:""}
          ${r.creatingFile==e?f:null}
          ${r.creatingFolder==e?g:null}
          ${u.map(s)}
        </div>
      </div>
    `;return new MutationObserver(b=>{const F=y.querySelector("input");F&&F.focus()}).observe(y,{childList:!0,subtree:!0}),y}}function ReplPanel(e,i){const r=e.panelHeight<=PANEL_CLOSED,l=r?0:e.panelHeight,c=()=>{e.panelHeight>PANEL_CLOSED?i("close-panel"):i("open-panel")},f=r?"closed":"open",g=e.isResizingPanel?"resizing":"",s=e.panelHeight>PANEL_TOO_SMALL?"visible":"hidden";let u="terminal-enabled";return(!e.isConnected||e.isNewFileDialogOpen)&&(u="terminal-disabled"),html`
    <div class="panel-container">
      <div id="panel" class="${f} ${g}" style="height: ${l}px">
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
          <div class="term-operations ${s}">
            ${ReplOperations(e,i)}
          </div>
          ${Button({icon:`arrow-${e.panelHeight>PANEL_CLOSED?"down":"up"}.svg`,size:"small",onClick:c})}
        </div>
        <div class=${u}>
          ${e.cache(XTerm,"terminal").render()}
        </div>
      </div>
      <button class="panel-reopen-handle ${r?"visible":""}"
              onclick=${()=>i("open-panel")}
              aria-label=${t("repl.showTerminal")}
              title=${t("repl.showTerminal")}>
        <span class="material-symbols-outlined">keyboard_arrow_up</span>
      </button>
    </div>
  `}function ReplOperations(e,i){return[Button({icon:"copy.svg",size:"small",tooltip:t("repl.copy"),onClick:()=>document.execCommand("copy")}),Button({icon:"paste.svg",size:"small",tooltip:t("repl.paste"),onClick:()=>document.execCommand("paste")}),Button({icon:"delete.svg",size:"small",tooltip:t("repl.clean",{shortcut:`${e.platform==="darwin"?"Cmd":"Ctrl"}+L`}),onClick:()=>i("clear-terminal")})]}function Tabs(e,i){const r=html`
    <div id="tabs">
      ${e.openFiles.map(c=>Tab({text:c.fileName,icon:c.source==="board"?"ms-videogame-asset.svg":"ms-computer.svg",active:c.id===e.editingFile,renaming:c.id===e.renamingTab,hasChanges:c.hasChanges,onSelectTab:()=>i("select-tab",c.id),onCloseTab:()=>i("close-tab",c.id),onStartRenaming:()=>i("rename-tab",c.id),onFinishRenaming:f=>i("finish-renaming-tab",f)}))}
    </div>
  `;return new MutationObserver(c=>{const f=r.querySelector("input");f&&f.focus()}).observe(r,{childList:!0,subtree:!0}),r}function Toolbar(e,i){const r=window.canSave({view:e.view,isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile}),l=window.canExecute({view:e.view,isConnected:e.isConnected}),c=e.platform==="darwin"?"Cmd":"Ctrl",f=e.isSidebarOpen?"":"sidebar-collapsed";return html`
    <div id="navigation-bar" class="${f}">
      <div id="app-logo">
        <img src="media/logo.svg" alt="MicroPython for Bitblock" />
      </div>
      <div id="toolbar">
        ${Button({icon:e.isConnected?"ms-videogame-asset.svg":"ms-videogame-asset-off.svg",label:e.isConnected?t("toolbar.disconnect"):t("toolbar.connect"),tooltip:e.isConnected?t("toolbar.tooltip.disconnect",{shortcut:`${c}+Shift+D`}):t("toolbar.tooltip.connect",{shortcut:`${c}+Shift+C`}),onClick:()=>e.isConnected?i("disconnect"):i("connect"),active:e.isConnected,first:!0})}
        ${Button({icon:"ms-restart.svg",label:t("toolbar.reset"),tooltip:t("toolbar.tooltip.reset",{shortcut:`${c}+Shift+R`}),disabled:!l,onClick:()=>i("reset")})}
        <div class="separator"></div>

        ${Button({icon:"ms-play.svg",label:t("toolbar.run"),tooltip:t("toolbar.tooltip.run",{shortcut:`${c}+R`}),disabled:!l||e.isRunning,onClick:g=>{g.altKey?i("run-from-button",!0):i("run-from-button")}})}
        ${Button({icon:"ms-stop.svg",label:t("toolbar.stop"),tooltip:t("toolbar.tooltip.stop",{shortcut:`${c}+H`}),disabled:!l||!e.isRunning,onClick:()=>i("stop")})}

        <div class="separator"></div>

        ${Button({icon:"ms-note-add.svg",label:t("toolbar.new"),tooltip:t("toolbar.tooltip.new",{shortcut:`${c}+N`}),disabled:e.view!="editor"||e.isFirmwareUploaderOpen,onClick:()=>i("create-new-file")})}

        ${Button({icon:"ms-save.svg",label:t("toolbar.save"),tooltip:t("toolbar.tooltip.save",{shortcut:`${c}+S`}),disabled:!r||e.isFirmwareUploaderOpen,onClick:()=>i("save")})}

        <div class="separator"></div>

        ${Button({icon:"ms-deployed-code.svg",label:t("toolbar.addPackage"),disabled:!e.isConnected,tooltip:e.isConnected?t("toolbar.tooltip.addPackageEnabled"):t("toolbar.tooltip.addPackageDisabled"),onClick:()=>i("open-install-package-dialog")})}

        ${Button({icon:e.isFullscreen?"ms-fullscreen-exit.svg":"ms-fullscreen.svg",label:e.isFullscreen?t("toolbar.exitFullScreen"):t("toolbar.fullScreen"),tooltip:e.isFullscreen?t("toolbar.tooltip.exitFullScreen"):t("toolbar.tooltip.enterFullScreen"),onClick:()=>i("toggle-fullscreen")})}

        <div class="toolbar-version">${window.APP_VERSION||""}</div>
      </div>
    </div>
  `}function RunFab(e,i){if(e.view!=="editor"||!e.isConnected)return"";const r=!!e.isRunning,l=()=>i(r?"stop":"run-from-button"),c=t(r?"toolbar.stop":"toolbar.run"),g=e.panelHeight>PANEL_CLOSED?e.panelHeight+16:24;return html`
    <button class="run-fab ${r?"is-running":""}"
            style="bottom: ${g}px"
            title=${c}
            aria-label=${c}
            onclick=${l}>
      <img class="icon" src=${r?"media/ms-stop.svg":"media/ms-play.svg"} />
    </button>
  `}function FileManagerPanel(e,i){let r=t("sidebar.connectToBoard");const l=!!e.diskNavigationRoot;let c=l?`${e.diskNavigationRoot}${e.diskNavigationPath}`:t("sidebar.selectFolder");e.isConnected&&(r=`bitblock${e.boardNavigationPath}`);const f=(e.selectedFiles||[]).filter(p=>p.source==="board").length,g=(e.selectedFiles||[]).filter(p=>p.source==="disk").length,s=html`
    <div id="board-files">
      <div class="device-header">
        <img class="icon" src="media/${e.isConnected?"ms-videogame-asset.svg":"ms-videogame-asset-off.svg"}" />
        <div onclick=${()=>i("connect")} class="text">
          <span>${r}</span>
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
        <button disabled=${!e.isConnected||f===0}
                onclick=${()=>i("remove-files","board")}
                title=${t("sidebar.deleteBoard")}>
          <img class="icon" src="media/delete.svg" />
        </button>
      </div>
      ${BoardFileList(e,i)}
    </div>
  `,u=html`
    <div id="disk-files">
      <div class="device-header">
        <img class="icon" src="media/ms-computer.svg" />
        <div class="text" onclick=${()=>i("select-disk-navigation-root")}>
          <span>${c}</span>
        </div>
        <button disabled=${!l}
                onclick=${()=>i("refresh-files")}
                title=${t("sidebar.refresh")}>
          <img class="icon" src="media/ms-refresh.svg" />
        </button>
        <button disabled=${!l} onclick=${()=>i("create-folder","disk")}>
          <img class="icon" src="media/new-folder.svg" />
        </button>
        <button disabled=${!l} onclick=${()=>i("create-file","disk")}>
          <img class="icon" src="media/new-file.svg" />
        </button>
        <button disabled=${!l||g===0}
                onclick=${()=>i("remove-files","disk")}
                title=${t("sidebar.deleteDisk")}>
          <img class="icon" src="media/delete.svg" />
        </button>
      </div>
      ${DiskFileList(e,i)}
    </div>
  `;return html`
    <div id="file-manager" class="sidebar-files">
      ${s}
      ${FileActions(e,i)}
      ${u}
    </div>
  `}const TOPIC_VIEW_TO_FILE={pythonRef:"micropythonReference"};function TopicListPanel(e,i,r){const l=TOPIC_VIEW_TO_FILE[r];if(!l)return html`<div class="topic-empty">${t("topic.empty")}</div>`;const c=e.topicsByFile[l];if(!c&&!e.topicsError[l]&&i("load-topics",{key:l,lang:e.language}),e.topicsError[l])return html`
      <div class="topic-error">
        ${t("topic.error",{err:e.topicsError[l]})}
      </div>
    `;if(!c)return html`<div class="topic-loading">${t("topic.loading")}</div>`;const f=e.selectedTopicId[r];if(f){const g=c.topics.find(s=>s.id===f);if(g)return TopicDetail(e,i,r,g);e.selectedTopicId[r]=null}return html`
    <div class="topic-list">
      <header class="topic-list-header">
        <span class="material-symbols-outlined">menu_book</span>
        <span>${t("activity.python")}</span>
      </header>
      <div class="topic-list-body">
        ${c.topics.length===0?html`<div class="topic-empty">${t("topic.empty")}</div>`:c.topics.map(g=>html`
              <button class="topic-card"
                      onclick=${()=>i("select-topic",{view:r,topicId:g.id})}>
                <span class="topic-card-icon">
                  <span class="material-symbols-outlined">${g.icon||"menu_book"}</span>
                </span>
                <span class="topic-card-text">
                  <span class="topic-card-title">${g.title}</span>
                  ${g.description?html`<span class="topic-card-desc">${g.description}</span>`:""}
                </span>
                <span class="topic-card-arrow">
                  <span class="material-symbols-outlined">arrow_forward</span>
                </span>
              </button>
            `)}
      </div>
    </div>
  `}function TopicDetail(e,i,r,l){const c=()=>i("select-topic",{view:r,topicId:null});return html`
    <div class="topic-detail">
      <header class="topic-detail-header">
        <button class="topic-back"
                onclick=${c}
                title=${t("topic.back")}
                aria-label=${t("topic.back")}>
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 class="topic-detail-title">${l.title}</h2>
      </header>
      ${l.description?html`<p class="topic-detail-desc">${l.description}</p>`:""}
      ${l.notice?html`<div class="topic-notice">${l.notice}</div>`:""}
      <div class="topic-entries">
        ${(l.entries||[]).map(EntryView)}
      </div>
      ${l.entriesAfter&&l.entriesAfter.length?html`<div class="topic-entries">
            ${l.entriesAfter.map(EntryView)}
          </div>`:""}
    </div>
  `}function EntryView(e){return html`
    <article class="entry">
      <h3 class="entry-name">${e.name}</h3>
      ${e.summary?html`<p class="entry-summary">${e.summary}</p>`:""}
      ${e.details?html`<pre class="entry-details">${e.details}</pre>`:""}
      ${(e.examples||[]).map(i=>html`
        <div class="entry-example">
          ${i.description?html`<p class="entry-example-desc">${i.description}</p>`:""}
          <pre class="entry-example-code"><code>${i.code}</code></pre>
        </div>
      `)}
    </article>
  `}function SettingsPanel(e,i){const r=e.language;return html`
    <div class="settings-panel">
      <div class="topic-list-header">${t("settings.title")}</div>
      <div class="settings-panel-body">
        <section class="settings-card">
          <div class="settings-card-title">${t("settings.language")}</div>
          <div class="settings-card-body">
            <select id="language-select" class="settings-select">
              <option value="en" selected=${r==="en"}>English</option>
              <option value="ko" selected=${r==="ko"}>한국어</option>
            </select>
            <button class="settings-apply" onclick=${()=>{const l=document.getElementById("language-select");l&&i("set-language",l.value)}}>${t("settings.apply")}</button>
          </div>
        </section>
      </div>
    </div>
  `}const PYTHON_ICON_SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 255" width="24" height="24" preserveAspectRatio="xMidYMid meet" fill="currentColor"><path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13a11.12 11.12 0 0 1-11.13 11.13a11.12 11.12 0 0 1-11.13-11.13a11.12 11.12 0 0 1 11.13-11.13z"/><path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zM162.87 234.46a11.12 11.12 0 0 1-11.13-11.13a11.12 11.12 0 0 1 11.13-11.131a11.12 11.12 0 0 1 11.13 11.13a11.12 11.12 0 0 1-11.13 11.13z"/></svg>',ACTIVITY_TOP=[{id:"explorer",icon:"folder",labelKey:"activity.explorer"},{id:"pythonRef",svg:PYTHON_ICON_SVG,labelKey:"activity.python"}],ACTIVITY_BOTTOM=[{id:"settings",icon:"settings",labelKey:"activity.settings"}];function renderSvgIcon(e){const i=document.createElement("span");return i.className="activity-icon activity-svg-icon",i.innerHTML=e,i}function ActivityBar(e,i){const r=c=>{const f=e.activeView===c.id,g=()=>{if(f&&e.isSidebarOpen){if(c.id==="pythonRef"){e.selectedTopicId[c.id]&&i("select-topic",{view:c.id,topicId:null});return}i("toggle-sidebar");return}i("set-active-view",c.id),e.isSidebarOpen||i("toggle-sidebar")},s="activity-item"+(f?" is-active":""),u=t(c.labelKey),p=c.svg?renderSvgIcon(c.svg):html`<span class="material-symbols-outlined activity-icon">${c.icon}</span>`;return html`
      <button class="${s}"
              title=${u}
              aria-label=${u}
              onclick=${g}>
        ${p}
        <span class="activity-label">${u}</span>
      </button>
    `},l=html`<div class="activity-divider" role="separator" aria-orientation="horizontal"></div>`;return html`
    <nav class="activity-bar" aria-label="activity">
      <div class="activity-group activity-top">
        ${r(ACTIVITY_TOP[0])}
        ${l}
        ${ACTIVITY_TOP.slice(1).map(r)}
      </div>
      <div class="activity-group activity-bottom">${ACTIVITY_BOTTOM.map(r)}</div>
    </nav>
  `}function Sidebar(e,i){const r=!!e.isSidebarOpen,l="app-sidebar"+(r?"":" collapsed"),c=r?"chevron_left":"chevron_right",f=r?`flex: 0 0 ${e.sidebarWidth}px; width: ${e.sidebarWidth}px;`:"";let g;switch(e.activeView){case"pythonRef":g=TopicListPanel(e,i,"pythonRef");break;case"settings":g=SettingsPanel(e,i);break;default:g=FileManagerPanel(e,i);break}return html`
    <aside class="${l}" style=${f}>
      ${g}
      <button class="sidebar-toggle"
              onclick=${()=>i("toggle-sidebar")}
              aria-label=${t("sidebar.toggle")}
              title=${t(r?"sidebar.hideFiles":"sidebar.showFiles")}>
        <span class="material-symbols-outlined">${c}</span>
      </button>
    </aside>
  `}const SIDEBAR_WIDTH_MIN_UI=180,SIDEBAR_WIDTH_MAX_UI=600,SIDEBAR_WIDTH_DEFAULT_UI=400;function startSidebarDrag(e,i,r){e.preventDefault();const l=e.clientX,c=document.querySelector(".app-sidebar");let f=r;function g(u){const p=Math.max(SIDEBAR_WIDTH_MIN_UI,Math.min(SIDEBAR_WIDTH_MAX_UI,r+(u.clientX-l)));f=p,c&&(c.style.flex=`0 0 ${p}px`,c.style.width=`${p}px`)}function s(){window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",s),document.body.classList.remove("is-resizing-sidebar"),i("set-sidebar-width",f)}document.body.classList.add("is-resizing-sidebar"),window.addEventListener("mousemove",g),window.addEventListener("mouseup",s)}function SidebarResizer(e,i){const r="sidebar-resizer"+(e.isSidebarOpen?"":" is-hidden");return html`
    <div class="${r}"
         role="separator"
         aria-orientation="vertical"
         title="Drag to resize · Double-click to reset"
         onmousedown=${l=>e.isSidebarOpen&&startSidebarDrag(l,i,e.sidebarWidth)}
         ondblclick=${()=>e.isSidebarOpen&&i("set-sidebar-width",SIDEBAR_WIDTH_DEFAULT_UI)}>
    </div>
  `}function FirmwareUploader(e,i){if(!e.isFirmwareUploaderOpen)return html`<div class="firmware-uploader closed"></div>`;const r=e.fw,c=window.FirmwareConfig.FIRMWARE_VERSIONS.filter(s=>s.board===r.activeTab),f=r.isConnected&&!r.isUploading&&!!r.selectedVersion;window.__fwScrollPending||(window.__fwScrollPending=!0,requestAnimationFrame(()=>{window.__fwScrollPending=!1;const s=document.querySelector(".firmware-uploader .log-container");s&&(s.scrollTop=s.scrollHeight)}));function g(){r.uploadStatus==="success"?i("disconnect"):i("fw-upload")}return html`
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
                    onchange=${s=>i("fw-set-baud",s.target.value)}
                    disabled=${r.isConnected}>
                    <option value="115200" selected=${r.baudRate===115200}>115,200</option>
                    <option value="230400" selected=${r.baudRate===230400}>230,400</option>
                    <option value="460800" selected=${r.baudRate===460800}>460,800</option>
                    <option value="921600" selected=${r.baudRate===921600}>${t("firmware.serial.baudDefault")}</option>
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
                  ${c.map(s=>html`
                    <div
                      class=${`version-card ${r.selectedVersion===s.id?"selected":""}`}
                      onclick=${()=>i("fw-select-version",s.id)}>
                      <div class="version-card-top">
                        <div class="version-info">
                          <img src=${s.image} alt=${s.board} class="version-board-img"
                               onerror=${u=>{u.target.style.display="none"}} />
                          <div>
                            <span class="version-number">${t(s.labelKey)}</span>
                            <span class=${`version-tag tag-${s.tag}`}>${t("firmware.tag."+s.tag)}</span>
                          </div>
                        </div>
                        <span class="version-date">${s.version}</span>
                      </div>
                      <p class="version-desc">${t(s.descriptionKey)}</p>
                      <div class="version-meta"><span>${s.date}</span></div>
                      ${r.selectedVersion===s.id?html`
                        <div class="version-changelog">
                          <ul>
                            ${s.changelogKeys.map(u=>html`<li>${t(u)}</li>`)}
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
                ${r.uploadStatus==="uploading"?html`
                  <div class="progress-container">
                    <div class="progress-header">
                      <span>${t("firmware.upload.progressLabel")}</span>
                      <span class="progress-pct">${r.uploadProgress}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" style=${`width:${r.uploadProgress}%`}></div>
                    </div>
                  </div>
                `:""}

                ${r.uploadStatus==="error"?html`
                  <div class="upload-result error">
                    <span>${t("firmware.upload.error")}</span>
                  </div>
                `:""}

                <button
                  class="btn btn-upload"
                  onclick=${g}
                  disabled=${r.uploadStatus!=="success"&&!f}>
                  ${r.isUploading?html`<span class="spinner"></span> ${t("firmware.upload.uploading")}`:r.uploadStatus==="success"?t("firmware.upload.done"):html`<span class="material-symbols-outlined">upload_2</span> ${t("firmware.upload.button")}`}
                </button>
              </div>
            </section>
          </div>
        </div>

        <section class="panel log-panel">
          <div class="log-container log-container-grow">
            ${r.logs.length===0?html`<div class="log-empty">${t("firmware.log.empty")}</div>`:r.logs.map(s=>html`
                  <div class=${`log-entry log-${s.type}`}>
                    <span class="log-time">${s.timestamp}</span>
                    <span class="log-badge">${s.type.toUpperCase()}</span>
                    <span class="log-msg">${s.message}</span>
                  </div>
                `)}
          </div>
        </section>
        <div class="log-spacer"></div>
      </div>
    </div>
  `}function Overlay(e,i){const r=html`<span class="material-symbols-outlined overlay-spinner">hourglass_empty</span>`,l=f=>html`<div class="overlay-message">${r}<span>${f}</span></div>`;let c=html`<div id="overlay" class="closed"></div>`;return e.diskFiles==null&&(i("load-disk-files"),c=html`<div id="overlay" class="open">${l(t("overlay.loading"))}</div>`),e.isRemoving&&(c=html`<div id="overlay" class="open">${l(t("overlay.removing"))}</div>`),e.isConnecting&&(c=html`<div id="overlay" class="open">${l(t("overlay.connecting"))}</div>`),e.isLoadingFiles&&(c=html`<div id="overlay" class="open">${l(t("overlay.loading"))}</div>`),e.isSaving&&(c=html`<div id="overlay" class="open">${l(t("overlay.saving",{progress:e.savingProgress}))}</div>`),e.isTransferring&&(c=html`<div id="overlay" class="open">${l(html`${t("overlay.transferring")}<br><br>${e.transferringProgress}`)}</div>`),c}function EditorView(e,i){return html`
    <div class="working-area">
      ${Tabs(e,i)}
      ${CodeEditor(e,i)}
      ${ReplPanel(e,i)}
      ${RunFab(e,i)}
    </div>
  `}const ADMIN_FILES=[{value:"micropythonReference",label:"micropythonReference"}],ADMIN_LANGS=[{value:"ko",label:"\uD55C\uAD6D\uC5B4"},{value:"en",label:"English"}];function AdminFileSelector(e,i){const r=e.editorState,l=s=>{i("editor-set-file",{fileKey:s.target.value,lang:r.lang})},c=s=>{i("editor-set-file",{fileKey:r.fileKey,lang:s.target.value})};let f="",g="status";return r.saving?(f=t("admin.saving"),g="status"):r.saveError?(f=t("admin.saveError",{err:r.saveError}),g="status error"):r.loadError?(f=t("admin.loadError",{err:r.loadError}),g="status error"):r.dirty?(f=t("admin.dirty"),g="status dirty"):r.loaded&&(f=t("admin.clean"),g="status"),html`
    <div class="admin-toolbar">
      <h1>${t("admin.title")}</h1>
      <label>
        ${t("admin.file")}:
        <select onchange=${l} value=${r.fileKey}>
          ${ADMIN_FILES.map(s=>html`
            <option value=${s.value} selected=${r.fileKey===s.value}>${s.label}</option>
          `)}
        </select>
      </label>
      <label>
        ${t("admin.lang")}:
        <select onchange=${c} value=${r.lang}>
          ${ADMIN_LANGS.map(s=>html`
            <option value=${s.value} selected=${r.lang===s.value}>${s.label}</option>
          `)}
        </select>
      </label>
      <span class=${g}>${f}</span>
      <span class="spacer"></span>
      <a href="#" class="back-link" onclick=${s=>{s.preventDefault(),window.location.hash=""}}>
        ← ${t("admin.openMain")}
      </a>
      <button class="primary"
              disabled=${!r.dirty||r.saving||!r.loaded}
              onclick=${()=>i("editor-save")}>
        ${r.saving?t("admin.saving"):t("admin.save")}
      </button>
    </div>
  `}function AdminTopicMetaEditor(e,i){const r=e.editorState,l=r.topics[r.selectedTopicIdx];if(!l)return html`<div class="admin-form"><p>${t("topic.empty")}</p></div>`;const c=r.selectedTopicIdx,f=g=>s=>{i("editor-patch-topic",{idx:c,patch:{[g]:s.target.value}})};return html`
    <div class="admin-form">
      <div class="admin-field">
        <label>${t("admin.field.id")}</label>
        <input type="text" value=${l.id||""} oninput=${f("id")} />
      </div>
      <div class="admin-field">
        <label>${t("admin.field.title")}</label>
        <input type="text" value=${l.title||""} oninput=${f("title")} />
      </div>
      <div class="admin-field">
        <label>${t("admin.field.description")}</label>
        <input type="text" value=${l.description||""} oninput=${f("description")} />
      </div>
      <div class="admin-field">
        <label>${t("admin.field.icon")}</label>
        <input type="text" value=${l.icon||""} oninput=${f("icon")} placeholder="menu_book" />
      </div>
      <div class="admin-field">
        <label>${t("admin.field.notice")}</label>
        <textarea oninput=${f("notice")}>${l.notice||""}</textarea>
      </div>
    </div>
  `}function AdminEntryEditor(e,i,r,l,c){const f=s=>u=>{i("editor-patch-entry",{topicIdx:r,entryIdx:c,patch:{[s]:u.target.value}})},g=Array.isArray(l.examples)?l.examples:[];return html`
    <div class="admin-entry">
      <div class="admin-entry-header">
        <span class="title">${l.name||"(no name)"}</span>
        <button title=${t("admin.removeEntry")}
                onclick=${()=>i("editor-remove-entry",{topicIdx:r,entryIdx:c})}>
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>

      <div class="admin-field">
        <label>${t("admin.field.name")}</label>
        <input type="text" value=${l.name||""} oninput=${f("name")} />
      </div>
      <div class="admin-field">
        <label>${t("admin.field.summary")}</label>
        <input type="text" value=${l.summary||""} oninput=${f("summary")} />
      </div>
      <div class="admin-field">
        <label>${t("admin.field.details")}</label>
        <textarea oninput=${f("details")}>${l.details||""}</textarea>
      </div>

      ${g.map((s,u)=>html`
        <div class="admin-example">
          <div class="admin-field">
            <label>${t("admin.field.exampleDesc")}</label>
            <input type="text" value=${s.description||""}
                   oninput=${p=>i("editor-set-example",{topicIdx:r,entryIdx:c,exampleIdx:u,patch:{description:p.target.value}})} />
          </div>
          <div class="admin-field">
            <label>${t("admin.field.code")}</label>
            <textarea class="code"
                      oninput=${p=>i("editor-set-example",{topicIdx:r,entryIdx:c,exampleIdx:u,patch:{code:p.target.value}})}>${s.code||""}</textarea>
          </div>
          <button class="admin-add"
                  onclick=${()=>i("editor-remove-example",{topicIdx:r,entryIdx:c,exampleIdx:u})}>
            ${t("admin.removeExample")}
          </button>
        </div>
      `)}
      <button class="admin-add"
              onclick=${()=>i("editor-add-example",{topicIdx:r,entryIdx:c})}>
        + ${t("admin.addExample")}
      </button>
    </div>
  `}function AdminEntryListEditor(e,i){const r=e.editorState,l=r.selectedTopicIdx,c=r.topics[l];if(!c)return html`<div></div>`;const f=Array.isArray(c.entries)?c.entries:[];return html`
    <div class="admin-form">
      <h2 style="padding:0;margin:0 0 4px;font-size:13px;">${t("admin.entries")} (${f.length})</h2>
      ${f.map((g,s)=>AdminEntryEditor(e,i,l,g,s))}
      <button class="admin-add"
              onclick=${()=>i("editor-add-entry",{topicIdx:l})}>
        + ${t("admin.addEntry")}
      </button>
    </div>
  `}function AdminTopicListEditor(e,i){const r=e.editorState,l=r.topics;return html`
    <div class="admin-col">
      <h2>${t("admin.topics")} (${l.length})</h2>
      ${l.map((c,f)=>{const g="admin-topic-row"+(f===r.selectedTopicIdx?" is-selected":"");return html`
          <button class=${g}
                  onclick=${()=>i("editor-select-topic",f)}>
            <span class="title">${c.title||c.id||"(untitled)"}</span>
            <span class="actions">
              <button title=${t("admin.moveUp")}
                      disabled=${f===0}
                      onclick=${s=>{s.stopPropagation(),i("editor-move-topic",{from:f,to:f-1})}}>
                <span class="material-symbols-outlined" style="font-size:18px;">arrow_upward</span>
              </button>
              <button title=${t("admin.moveDown")}
                      disabled=${f===l.length-1}
                      onclick=${s=>{s.stopPropagation(),i("editor-move-topic",{from:f,to:f+1})}}>
                <span class="material-symbols-outlined" style="font-size:18px;">arrow_downward</span>
              </button>
              <button title=${t("admin.removeTopic")}
                      onclick=${s=>{s.stopPropagation(),i("editor-remove-topic",f)}}>
                <span class="material-symbols-outlined" style="font-size:18px;">delete</span>
              </button>
            </span>
          </button>
        `})}
      <button class="admin-add" onclick=${()=>i("editor-add-topic")}>
        + ${t("admin.addTopic")}
      </button>
    </div>
  `}function AdminTopicPreview(e,i){const r=e.editorState,l=r.topics[r.selectedTopicIdx];if(!l)return html`<div class="admin-col"><div class="admin-preview">${t("topic.empty")}</div></div>`;const c=f=>Array.isArray(f.examples)?f.examples:[];return html`
    <div class="admin-col">
      <div class="admin-preview">
        <h3>${l.title||"(untitled)"}</h3>
        ${l.description?html`<p style="color:#41454d;font-size:12px;">${l.description}</p>`:""}
        ${l.notice?html`<div class="topic-notice">${l.notice}</div>`:""}
        ${(l.entries||[]).map(f=>html`
          <div class="preview-block">
            <div style="font-weight:700;font-size:13px;">${f.name}</div>
            ${f.summary?html`<div style="color:#41454d;font-size:12px;">${f.summary}</div>`:""}
            ${f.details?html`<pre style="white-space:pre-wrap;font-family:inherit;font-size:12px;color:#333840;">${f.details}</pre>`:""}
            ${c(f).map(g=>html`
              <pre class="entry-example-code" style="margin-top:6px;"><code>${g.code}</code></pre>
            `)}
          </div>
        `)}
      </div>
    </div>
  `}function AdminApp(e,i){const r=e.editorState;return!r.loaded&&!r.loading&&!r.loadError&&setTimeout(()=>i("editor-load",{fileKey:r.fileKey,lang:r.lang}),0),html`
    <div class="admin-app">
      ${AdminFileSelector(e,i)}
      <div class="admin-grid">
        ${AdminTopicListEditor(e,i)}
        <div class="admin-col">
          ${r.loading?html`<div class="admin-preview">${t("topic.loading")}</div>`:r.loadError?html`<div class="admin-preview" style="color:#aa2d00;">${t("admin.loadError",{err:r.loadError})}</div>`:html`<div>
                  ${AdminTopicMetaEditor(e,i)}
                  ${AdminEntryListEditor(e,i)}
                </div>`}
        </div>
        ${AdminTopicPreview(e,i)}
      </div>
    </div>
  `}(function(){function e(...f){return f.filter(s=>s!=null&&s!=="").map(s=>String(s)).join("/").replace(/\/+/g,"/")}function i(...f){let g=e(...f);return g.startsWith("/")||(g="/"+g),g.replace(/\/+/g,"/")}function r(f){if(!f)return"/";const g=String(f).replace(/\/+$/,"");if(g===""||g==="/")return"/";const s=g.lastIndexOf("/");return s<=0?"/":g.slice(0,s)}function l(f){const g=String(f||"").replace(/\/+$/,""),s=g.lastIndexOf("/");return s===-1?g:g.slice(s+1)}function c(f){return f?String(f).replace(/\\/g,"/").replace(/\/+/g,"/").replace(/^\/+/,""):""}window.PosixPath={join:e,resolve:i,dirname:r,basename:l,normalize:c}})(),(function(){const e={CLOSE:"CommandOrControl+Shift+W",CONNECT:"CommandOrControl+Shift+C",DISCONNECT:"CommandOrControl+Shift+D",RUN:"CommandOrControl+Enter",RUN_SELECTION:"CommandOrControl+Alt+Enter",RUN_SELECTION_WL:"CommandOrControl+Alt+S",STOP:"CommandOrControl+H",RESET:"CommandOrControl+Shift+R",NEW:"CommandOrControl+N",SAVE:"CommandOrControl+S",CLEAR_TERMINAL:"CommandOrControl+L",EDITOR_VIEW:"CommandOrControl+Alt+1",FILES_VIEW:"CommandOrControl+Alt+2"};function i(){const l=navigator.userAgentData&&navigator.userAgentData.platform||navigator.platform||"";return/mac|darwin/i.test(l)}function r(l){if(!l)return"";const c=i();return l.replace("CommandOrControl",c?"Cmd":"Ctrl").replace("CmdOrCtrl",c?"Cmd":"Ctrl").replace("Alt",c?"Option":"Alt")}window.AppShortcuts={map:e,displayLabel:r,isMacPlatform:i}})(),(function(){const e="micropython-ide-fsa",r="handles",l="diskRoot";function c(){return new Promise((y,k)=>{const b=indexedDB.open(e,1);b.onupgradeneeded=()=>{const F=b.result;F.objectStoreNames.contains(r)||F.createObjectStore(r)},b.onsuccess=()=>y(b.result),b.onerror=()=>k(b.error)})}async function f(y){const k=await c();try{await new Promise((b,F)=>{const n=k.transaction(r,"readwrite");n.objectStore(r).put(y,l),n.oncomplete=()=>b(),n.onerror=()=>F(n.error),n.onabort=()=>F(n.error)})}finally{k.close()}}async function g(){const y=await c();try{return await new Promise((k,b)=>{const n=y.transaction(r,"readonly").objectStore(r).get(l);n.onsuccess=()=>k(n.result||null),n.onerror=()=>b(n.error)})}finally{y.close()}}async function s(){const y=await c();try{await new Promise((k,b)=>{const F=y.transaction(r,"readwrite");F.objectStore(r).delete(l),F.oncomplete=()=>k(),F.onerror=()=>b(F.error)})}finally{y.close()}}async function u(y,k="readwrite"){const b={mode:k};return typeof y.queryPermission=="function"&&await y.queryPermission(b)==="granted"||typeof y.requestPermission=="function"&&await y.requestPermission(b)==="granted"}async function p(y,k="readwrite"){return typeof y.queryPermission!="function"?!1:await y.queryPermission({mode:k})==="granted"}window.FsaHandleStore={saveHandle:f,loadHandle:g,clearHandle:s,verifyPermission:u,queryPermissionOnly:p}})(),(function(){let e=!1;function i(){if(e)return;e=!0;const l=`
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
    `,c=document.createElement("style");c.textContent=l,document.head.appendChild(c)}function r(l){i();const c=l&&l.buttons||["OK"],f=l&&l.defaultId!=null?l.defaultId:0,g=l&&l.cancelId!=null?l.cancelId:-1,s=l&&l.message||"",u=l&&l.title||"";return new Promise(p=>{const y=document.createElement("dialog");y.className="app-dialog",y.setAttribute("data-dialog-type",l&&l.type||"info");let k=!1;function b(P){if(!k){k=!0;try{y.close()}catch(R){}y.parentNode&&y.parentNode.removeChild(y),p(P!==g)}}const F=()=>b(g===-1?c.length:g),n=document.createElement("div");n.className="app-dialog-header";const o=document.createElement("div");o.className="app-dialog-title",o.textContent=u,n.appendChild(o);const a=document.createElement("button");a.className="app-dialog-close",a.type="button",a.setAttribute("aria-label","Close"),a.textContent="\xD7",a.addEventListener("click",F),n.appendChild(a),y.appendChild(n);const d=document.createElement("div");d.className="app-dialog-body";const m=document.createElement("p");m.className="app-dialog-message",m.textContent=s,d.appendChild(m),y.appendChild(d);const w=document.createElement("div");w.className="app-dialog-buttons",c.forEach((P,R)=>{const L=document.createElement("button");L.type="button",L.textContent=P,R===f&&L.classList.add("app-dialog-default"),L.addEventListener("click",()=>b(R)),w.appendChild(L)}),y.appendChild(w),y.addEventListener("cancel",P=>{P.preventDefault(),F()}),document.body.appendChild(y),y.showModal();const E=w.querySelector(".app-dialog-default");E&&E.focus()})}window.AppDialog={openDialog:r}})(),(function(){if(!window.AppShortcuts){console.error("[shortcut-manager] AppShortcuts not loaded");return}const e=window.AppShortcuts.isMacPlatform(),i=[],r=[];let l=!1;function c(F){if(!(e?F.metaKey:F.ctrlKey))return null;const o=["CommandOrControl"];F.altKey&&o.push("Alt"),F.shiftKey&&o.push("Shift");let a=null;return F.code&&F.code.startsWith("Key")?a=F.code.slice(3).toUpperCase():F.code&&F.code.startsWith("Digit")?a=F.code.slice(5):F.key==="Enter"?a="Enter":F.key===" "?a="Space":F.key&&F.key.length===1?a=F.key.toUpperCase():a=F.key,a?(o.push(a),o.join("+")):null}function f(){const F=window.AppShortcuts.map,n=new Set;for(const o of Object.keys(F))n.add(F[o]);return n}let g=f();function s(F){if(!F)return!1;const n=(F.tagName||"").toLowerCase();return!!(n==="input"||n==="textarea"||n==="select"||F.isContentEditable)}function u(F){if(l||i.length===0)return;const n=c(F);if(n&&g.has(n)){F.preventDefault(),F.stopPropagation();for(const o of i)try{o(n)}catch(a){console.error("[shortcut]",a)}}}window.addEventListener("keydown",u,!0);function p(F){typeof F=="function"&&i.push(F)}function y(F){typeof F=="function"&&r.push(F)}function k(F){l=!!F;for(const n of r)try{n(l)}catch(o){console.error("[disable-shortcuts]",o)}}function b(F){for(const n of i)try{n(F)}catch(o){console.error("[shortcut/menu]",o)}}window.AppShortcutManager={onShortcut:p,onDisableShortcuts:y,setSuppressed:k,dispatchAccelerator:b,eventToAccelerator:c,refreshKnown:()=>{g=f()}}})(),(function(){const e=p=>()=>Promise.reject(new Error(`not implemented yet: ${p}`));window.PosixPath||console.error("[web-bridges] PosixPath not loaded \u2014 check script order");const i=window.PosixPath||{join:(...p)=>p.filter(Boolean).join("/").replace(/\/+/g,"/"),resolve:(...p)=>"/"+p.filter(Boolean).join("/").replace(/\/+/g,"/"),dirname:p=>(p||"/").replace(/\/[^/]*$/,"")||"/"},r=i.join,l=i.resolve,c=i.dirname;window.BridgeSerial={loadPorts:e("BridgeSerial.loadPorts"),requestPort:e("BridgeSerial.requestPort"),connect:e("BridgeSerial.connect"),disconnect:e("BridgeSerial.disconnect"),run:e("BridgeSerial.run"),execFile:e("BridgeSerial.execFile"),getPrompt:e("BridgeSerial.getPrompt"),keyboardInterrupt:e("BridgeSerial.keyboardInterrupt"),reset:e("BridgeSerial.reset"),eval:e("BridgeSerial.eval"),onData:()=>{},listFiles:e("BridgeSerial.listFiles"),ilistFiles:e("BridgeSerial.ilistFiles"),loadFile:e("BridgeSerial.loadFile"),removeFile:e("BridgeSerial.removeFile"),saveFileContent:e("BridgeSerial.saveFileContent"),uploadFile:e("BridgeSerial.uploadFile"),downloadFile:e("BridgeSerial.downloadFile"),renameFile:e("BridgeSerial.renameFile"),onConnectionClosed:()=>{},createFolder:e("BridgeSerial.createFolder"),removeFolder:e("BridgeSerial.removeFolder"),fileExists:e("BridgeSerial.fileExists"),getNavigationPath:(p,y)=>y===".."?c(p):r(p,y),getFullPath:(p,y,k)=>r(p,(y||"").replace(/\\/g,"/"),(k||"").replace(/\\/g,"/")),getParentPath:p=>c(p)},window.BridgeDisk={openFolder:e("BridgeDisk.openFolder"),listFiles:e("BridgeDisk.listFiles"),ilistFiles:e("BridgeDisk.ilistFiles"),ilistAllFiles:e("BridgeDisk.ilistAllFiles"),loadFile:e("BridgeDisk.loadFile"),loadFileBytes:e("BridgeDisk.loadFileBytes"),removeFile:e("BridgeDisk.removeFile"),saveFileContent:e("BridgeDisk.saveFileContent"),renameFile:e("BridgeDisk.renameFile"),createFolder:e("BridgeDisk.createFolder"),removeFolder:e("BridgeDisk.removeFolder"),fileExists:e("BridgeDisk.fileExists"),getAppPath:()=>Promise.resolve("./"),getNavigationPath:(p,y)=>y===".."?c(p):r(p,y),getFullPath:(p,y,k)=>l(p,(y||"").replace(/\\/g,"/"),(k||"").replace(/\\/g,"/")),getParentPath:p=>c(p)};const f={CLOSE:"CommandOrControl+Shift+W",CONNECT:"CommandOrControl+Shift+C",DISCONNECT:"CommandOrControl+Shift+D",RUN:"CommandOrControl+Enter",RUN_SELECTION:"CommandOrControl+Alt+Enter",RUN_SELECTION_WL:"CommandOrControl+Alt+S",STOP:"CommandOrControl+H",RESET:"CommandOrControl+Shift+R",NEW:"CommandOrControl+N",SAVE:"CommandOrControl+S",CLEAR_TERMINAL:"CommandOrControl+L",EDITOR_VIEW:"CommandOrControl+Alt+1",FILES_VIEW:"CommandOrControl+Alt+2"},g=window.AppShortcuts&&window.AppShortcuts.map||f;function s(){const y=(navigator.userAgentData&&navigator.userAgentData.platform||navigator.platform||"").toLowerCase();return y.includes("win")?"win32":y.includes("mac")?"darwin":y.includes("linux")?"linux":"unknown"}const u=s();window.BridgeWindow={setWindowSize:()=>{},onKeyboardShortcut:()=>{},onDisableShortcuts:()=>{},beforeClose:()=>{},confirmClose:()=>Promise.resolve(),isPackaged:()=>Promise.resolve(!1),openDialog:e("BridgeWindow.openDialog"),getOS:()=>u,isWindows:()=>u==="win32",isMac:()=>u==="darwin",isLinux:()=>u==="linux",updateMenuState:()=>Promise.resolve(),getShortcuts:()=>g},window.launchApp=async(p,y)=>{const k=y||p;k&&window.open(k,"_blank","noopener,noreferrer")}})(),(function(){const e=typeof navigator!="undefined"&&"serial"in navigator;function i(g){return new Promise(s=>setTimeout(s,g))}function r(g){return g.replace(/\r\n/g,`
`)}function l(g){return g.slice(2,-3)}function c(g,s=2,u=3){return g.slice(s,-u).split(",").filter(y=>y.length>0).map(Number)}class f{constructor(){this.port=null,this.writer=null,this.reader=null,this._readLoopPromise=null,this._matcher=null,this._inboundBuffer="",this._dataListener=null,this._closeListener=null,this.reject_run=null,this.write_chunk_size=128,this.write_chunk_sleep=10,this.fs_chunk_size=48}async list_ports(){if(!e)throw new Error("Web Serial API not supported in this browser");return(await navigator.serial.getPorts()).map(u=>{const p=u.getInfo&&u.getInfo()||{};return{path:p.usbVendorId!=null?`bitblock:${p.usbVendorId.toString(16)}:${(p.usbProductId||0).toString(16)}`:"serial",vendorId:p.usbVendorId,productId:p.usbProductId,_port:u}})}async request_port(s){if(!e)throw new Error("Web Serial API not supported in this browser");const u=s?{filters:s}:{};return await navigator.serial.requestPort(u)}async open(s){if(!e)throw new Error("Web Serial API not supported in this browser");this.port&&await this.close();let u;s&&s._port?u=s._port:s&&typeof s.open=="function"?u=s:u=await navigator.serial.requestPort(),await u.open({baudRate:115200}),this.port=u,this.writer=u.writable.getWriter(),this._startReadLoop()}_startReadLoop(){const s=new TextDecoder;this._readLoopPromise=(async()=>{for(;this.port&&this.port.readable;){let u;try{u=this.port.readable.getReader()}catch(p){break}this.reader=u;try{for(;;){const{value:p,done:y}=await u.read();if(y)break;if(p&&p.byteLength>0){const k=s.decode(p,{stream:!0});this._onIncomingText(k)}}}catch(p){break}finally{try{u.releaseLock()}catch(p){}this.reader=null}}this._onClose()})()}_onIncomingText(s){if(this._dataListener)try{this._dataListener(s)}catch(u){}if(this._matcher){if(this._matcher.buffer+=s,this._matcher.dc)try{this._matcher.dc(s)}catch(p){}const u=this._matcher.buffer.indexOf(this._matcher.ending);if(u!==-1){const p=this._matcher;this._matcher=null;const y=p.buffer.slice(0,u+p.ending.length);this._inboundBuffer=p.buffer.slice(u+p.ending.length),p.resolve(y)}}else this._inboundBuffer+=s}_onClose(){const s=this._closeListener;if(s)try{s()}catch(u){}if(this._matcher){const u=this._matcher;this._matcher=null,u.reject(new Error("serial connection closed"))}}async close(){if(this.reject_run){try{this.reject_run(new Error("pre close"))}catch(u){}this.reject_run=null}const s=this.port;this.port=null;try{this.reader&&await this.reader.cancel()}catch(u){}try{this.writer&&(await this.writer.close().catch(()=>{}),this.writer.releaseLock())}catch(u){}this.writer=null,this.reader=null;try{s&&await s.close()}catch(u){}}on_data(s){this._dataListener=s}on_close(s){this._closeListener=s}read_until(s,u){return new Promise((p,y)=>{if(this._matcher){const F=this._matcher;this._matcher=null,F.reject(new Error("superseded"))}const k=this._inboundBuffer;this._inboundBuffer="";const b=k.indexOf(s);if(b!==-1){const F=k.slice(0,b+s.length);return this._inboundBuffer=k.slice(b+s.length),p(F)}this._matcher={ending:s,dc:u,buffer:k,resolve:p,reject:y}})}async write_and_read_until(s,u,p){if(!this.writer)throw new Error("serial not open");this._inboundBuffer="";const y=new TextEncoder,k=this.write_chunk_size,b=this.write_chunk_sleep;for(let n=0;n<s.length;n+=k){const o=s.slice(n,n+k);await this.writer.write(y.encode(o)),await i(b)}let F;return u&&(F=await this.read_until(u,p)),await i(b),F}async get_prompt(){return await i(150),await this.stop(),await i(150),await this.write_and_read_until("\r",`\r
>>>`)}async enter_raw_repl(){return await this.write_and_read_until("","raw REPL; CTRL-B to exit")}async exit_raw_repl(){return await this.write_and_read_until("",`\r
>>>`)}async exec_raw(s,u){return await this.write_and_read_until(s),await this.write_and_read_until("",">",u)}async execfile(s,u){const p=typeof s=="string"?s:new TextDecoder().decode(s);await this.enter_raw_repl();const y=await this.exec_raw(p,u);return await this.exit_raw_repl(),y}async run(s,u){const p=u||function(){};return new Promise(async(y,k)=>{this.reject_run&&(this.reject_run(new Error("re-run")),this.reject_run=null),this.reject_run=k;try{await this.enter_raw_repl();const b=await this.exec_raw(s||"#",p);await this.exit_raw_repl(),this.reject_run=null,y(b)}catch(b){this.reject_run=null,k(b)}})}async eval(s){if(!this.writer)throw new Error("serial not open");await this.writer.write(new TextEncoder().encode(s))}async stop(){if(this.reject_run){try{this.reject_run(new Error("pre stop"))}catch(s){}this.reject_run=null}this.writer&&await this.writer.write(new TextEncoder().encode(""))}async reset(){if(this.reject_run){try{this.reject_run(new Error("pre reset"))}catch(s){}this.reject_run=null}this.writer&&(await this.writer.write(new TextEncoder().encode("")),await this.writer.write(new TextEncoder().encode("")))}async fs_exists(s){s=s||"";let u=`try:
`;u+=`  f = open("${s}", "r")
`,u+=`  print(1)
`,u+=`except OSError:
`,u+=`  print(0)
`,u+=`del f
`,await this.enter_raw_repl();const p=await this.exec_raw(u);return await this.exit_raw_repl(),p[2]==="1"}async fs_ls(s){s=s||"";let u=`import os
`;u+=`try:
`,u+=`  print(os.listdir("${s}"))
`,u+=`except OSError:
`,u+=`  print([])
`,await this.enter_raw_repl();let p=await this.exec_raw(u);return await this.exit_raw_repl(),p=l(p).replace(/'/g,'"'),JSON.parse(p)}async fs_ils(s){s=s||"";let u=`import os
`;u+=`try:
`,u+=`  l=[]
`,u+=`  f=None
`,u+=`  for f in os.ilistdir("${s}"):
`,u+=`    l.append(list(f))
`,u+=`  print(l)
`,u+=`except OSError:
`,u+=`  print([])
`,u+=`del l
`,u+=`if f:del f
`,await this.enter_raw_repl();let p=await this.exec_raw(u);return await this.exit_raw_repl(),p=l(p).replace(/'/g,'"').split("OK"),JSON.parse(p)}async fs_cat_binary(s){if(!s)throw new Error("Path to file was not specified");await this.enter_raw_repl();const u=256;let p=`with open('${s}','rb') as f:
`;p+=`  while 1:
`,p+=`    b=f.read(${u})
`,p+=`    if not b:break
`,p+=`    print(",".join(str(e) for e in b),end=",")
`,p+=`del f
`,p+=`del b
`;let y=await this.exec_raw(p);await this.exit_raw_repl();const k=c(y,2,4);return new Uint8Array(k)}async fs_cat(s){if(!s)throw new Error("Path to file was not specified");await this.enter_raw_repl();const u=`with open('${s}','r') as f:
 while 1:
  b=f.read(256)
  if not b:break
  print(b,end='')
del f
del b
`;let p=await this.exec_raw(u);return await this.exit_raw_repl(),r(l(p))}async fs_put(s,u,p){if(!s||!u)throw new Error("Must specify source bytes and destination");const y=p||function(){},k=s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new TextEncoder().encode(String(s));let b="";b+=await this.enter_raw_repl(),b+=await this.exec_raw(`f=open('${u}','wb')
w=f.write`);const F=this.fs_chunk_size;for(let n=0;n<k.length;n+=F){const o=k.subarray(n,n+F);b+=await this.exec_raw(`w(bytes([${o}]))`),y(parseInt(n/k.length*100)+"%")}return b+=await this.exec_raw(`f.close()
del f
del w
`),b+=await this.exit_raw_repl(),y("100%"),b}async fs_save(s,u,p){if(s==null||!u)throw new Error("Must specify content and destination path");const y=p||function(){},k=typeof s=="string"?new TextEncoder().encode(s):s instanceof Uint8Array?s:new Uint8Array(s);let b="";b+=await this.enter_raw_repl(),b+=await this.exec_raw(`f=open('${u}','wb')
w=f.write`);const F=this.fs_chunk_size;for(let n=0;n<k.length;n+=F){const o=k.subarray(n,n+F);b+=await this.exec_raw(`w(bytes([${o}]))`),y(parseInt(n/k.length*100)+"%")}return b+=await this.exec_raw(`f.close()
del f
del w
`),b+=await this.exit_raw_repl(),y("100%"),b}async fs_mkdir(s){if(!s)throw new Error("Path required");await this.enter_raw_repl();const u=await this.exec_raw(`import os
os.mkdir('${s}')`);return await this.exit_raw_repl(),u}async fs_rmdir(s){if(!s)throw new Error("Path required");let u=`import os
`;u+=`try:
`,u+=`  os.rmdir("${s}")
`,u+=`except OSError:
`,u+=`  print(0)
`,await this.enter_raw_repl();const p=await this.exec_raw(u);return await this.exit_raw_repl(),p}async fs_rm(s){if(!s)throw new Error("Path required");let u=`import os
`;u+=`try:
`,u+=`  os.remove("${s}")
`,u+=`except OSError:
`,u+=`  print(0)
`,await this.enter_raw_repl();const p=await this.exec_raw(u);return await this.exit_raw_repl(),p}async fs_rename(s,u){if(!s||!u)throw new Error("Both paths required");await this.enter_raw_repl();const p=await this.exec_raw(`import os
os.rename('${s}', '${u}')`);return await this.exit_raw_repl(),p}}typeof window!="undefined"&&(window.MicroPythonWeb=f),typeof module!="undefined"&&module.exports&&(module.exports={MicroPythonWeb:f,extract:l,extractBytes:c,fixLineBreak:r})})(),(function(){if(!window.MicroPythonWeb){console.error("[BridgeSerial] MicroPythonWeb not loaded \u2014 check script order in index.html");return}const e=new window.MicroPythonWeb;let i=[],r=null,l=null;async function c(){if(r!=null)return r;if(l)return l;l=(async()=>{const v=await fetch("helpers.py",{cache:"no-cache"});if(!v.ok)throw new Error(`helpers.py fetch failed: HTTP ${v.status}`);return r=await v.text(),r})();try{return await l}finally{l=null}}let f=null,g=null;e.on_data(v=>{f&&f(v)}),e.on_close(()=>{g&&g()});async function s(){const v=await e.list_ports();return i=v,v.filter(_=>_.vendorId!=null&&_.productId!=null).map(_=>({path:_.path,vendorId:_.vendorId,productId:_.productId}))}function u(v){return i.find(_=>_.path===v)||null}const p=[{usbVendorId:12346,usbProductId:16385}],y=[{usbVendorId:12346,usbProductId:4097}];window.FIRMWARE_PORT_FILTERS=y;async function k(v={}){const _=v.firmware?y:p;let x;try{x=await e.request_port(_)}catch(D){if(D&&(D.name==="NotFoundError"||/No port selected/i.test(D.message||"")))return null;throw D}i=await e.list_ports();const T=i.find(D=>D._port===x);return!T||T.vendorId==null||T.productId==null?null:{path:T.path,vendorId:T.vendorId,productId:T.productId}}async function b(v){let _=u(v);if(_||(i=await e.list_ports(),_=u(v)),!_)throw new Error(`Port not found: ${v}. Try clicking Connect again to re-authorize.`);await e.open(_),c().catch(()=>{})}async function F(){return await e.close()}function n(v){return e.run(v)}async function o(v){const _=await c();return await e.execfile(_)}function a(){return e.get_prompt()}function d(v){return e.eval(v)}function m(){return e.stop()}async function w(){await e.stop();try{await e.exit_raw_repl()}catch(v){}await e.reset()}function E(v){return e.fs_ls(v)}function P(v){return e.fs_ils(v)}async function R(v){return await e.fs_cat_binary(v)||new Uint8Array}function L(v){return e.fs_rm(v)}function M(v,_){return e.fs_rename(v,_)}function C(v){return e.fs_mkdir(v)}function N(v){return e.fs_rmdir(v)}async function A(v,_,x){return await e.fs_save(_||" ",v,x||function(){})}async function I(v,_,x){if(!window.BridgeDisk||!window.BridgeDisk.loadFileBytes)throw new Error("BridgeDisk.loadFileBytes is required for uploadFile (Phase 3)");const T=await window.BridgeDisk.loadFileBytes(v),D=String(_).replace(/\\/g,"/");return await e.fs_put(T,D,x||function(){})}async function O(v,_){if(!window.BridgeDisk||!window.BridgeDisk.saveFileContent)throw new Error("BridgeDisk.saveFileContent is required for downloadFile (Phase 3)");const x=await e.fs_cat_binary(v);return await window.BridgeDisk.saveFileContent(_,x)}async function h(v){const _=await e.run(`
import os
try:
  os.stat("${v}")
  print(0)
except OSError:
  print(1)
`);return _&&_[2]==="0"}function S(v){f=v}function $(v){g=v}Object.assign(window.BridgeSerial,{loadPorts:s,requestPort:k,connect:b,disconnect:F,run:n,execFile:o,getPrompt:a,keyboardInterrupt:m,reset:w,eval:d,onData:S,listFiles:E,ilistFiles:P,loadFile:R,removeFile:L,saveFileContent:A,uploadFile:I,downloadFile:O,renameFile:M,onConnectionClosed:$,createFolder:C,removeFolder:N,fileExists:h}),window.__micropython=e})(),(function(){if(!window.PosixPath||!window.FsaHandleStore){console.error("[BridgeDisk] Required modules missing \u2014 check script order in index.html");return}const e=window.PosixPath,i=window.FsaHandleStore;let r=null,l=null;const c=(async()=>{try{const C=await i.loadHandle();C&&await i.queryPermissionOnly(C,"readwrite")&&(r=C,l=C.name)}catch(C){}})();function f(C){let N=e.normalize(C);if(l){if(N===l)return"";if(N.startsWith(l+"/"))return N.slice(l.length+1)}return N}async function g(C,N){if(!r)throw new Error("No folder selected");if(!C||C==="."||C==="/")return r;let A=r;for(const I of C.split("/").filter(O=>O&&O!=="."))A=await A.getDirectoryHandle(I,N||void 0);return A}async function s(C,N){const A=f(C),I=e.dirname(A),O=e.basename(A),h=N&&N.create?{create:!0}:void 0;return await(await g(I==="/"?"":I,h)).getFileHandle(O,N||void 0)}async function u(){if(r)return;const C=await i.loadHandle();if(C&&await i.verifyPermission(C,"readwrite")){r=C,l=C.name;return}throw new Error('No folder selected. Click "Open Folder" first.')}async function p(C){const N=await g(C),A=[];for await(const[I,O]of N.entries())O.kind==="file"&&A.push(I);return A}async function y(C){const N=await g(C),A=[];for await(const[I,O]of N.entries())I.startsWith(".")||A.push({path:I,type:O.kind==="directory"?"folder":"file"});return A}async function k(C,N,A){const I=await g(C);for await(const[O,h]of I.entries()){if(O.startsWith("."))continue;const S=C?C+"/"+O:O,$=N?N+"/"+O:O;A.push({path:$,type:h.kind==="directory"?"folder":"file"}),h.kind==="directory"&&await k(S,$,A)}}async function b(){if(typeof window.showDirectoryPicker!="function")throw new Error("File System Access API not supported in this browser");let C;try{C=await window.showDirectoryPicker({mode:"readwrite"})}catch(A){if(A&&(A.name==="AbortError"||/aborted|cancel/i.test(A.message||"")))return{folder:null,files:[]};throw A}await i.saveHandle(C),r=C,l=C.name;const N=await p("");return{folder:C.name,files:N}}async function F(C){return await u(),await p(f(C))}async function n(C){return await u(),await y(f(C))}async function o(C){await u();const N=[];return await k(f(C),String(C||""),N),N}async function a(C){await u();const A=await(await s(C)).getFile();return new Uint8Array(await A.arrayBuffer())}async function d(C){const N=await a(C);return new TextDecoder("utf-8").decode(N)}async function m(C,N){await u();const I=await(await s(C,{create:!0})).createWritable();let O;return N instanceof Uint8Array?O=N:N instanceof ArrayBuffer?O=new Uint8Array(N):O=String(N==null?"":N),await I.write(O),await I.close(),!0}async function w(C){await u();const N=f(C),A=e.dirname(N),I=e.basename(N);return await(await g(A==="/"?"":A)).removeEntry(I),!0}async function E(C,N){await u();const A=f(C),I=f(N),O=await s(C);if(typeof O.move=="function"){const S=e.dirname(A),$=e.dirname(I),v=e.basename(I);try{if(S===$)await O.move(v);else{const x=await g($==="/"?"":$,{create:!0});await O.move(x,v)}return!0}catch(_){}}const h=await a(C);return await m(N,h),await w(C),!0}async function P(C){return await u(),await g(f(C),{create:!0}),!0}async function R(C){await u();const N=f(C);if(!N)throw new Error("Cannot remove the root folder");const A=e.dirname(N),I=e.basename(N);return await(await g(A==="/"?"":A)).removeEntry(I,{recursive:!0}),!0}async function L(C){await u();try{return await s(C),!0}catch(N){if(N&&N.name==="NotFoundError")try{return await g(f(C)),!0}catch(A){return!1}throw N}}function M(){return Promise.resolve("./")}Object.assign(window.BridgeDisk,{openFolder:b,listFiles:F,ilistFiles:n,ilistAllFiles:o,loadFile:d,loadFileBytes:a,saveFileContent:m,removeFile:w,renameFile:E,createFolder:P,removeFolder:R,fileExists:L,getAppPath:M,whenReady:()=>c,hasRoot:()=>!!r}),window.__bridgeDiskState=()=>({rootName:l,hasHandle:!!r})})(),(function(){if(!window.AppDialog||!window.AppShortcuts||!window.AppShortcutManager){console.error("[BridgeWindow] required modules missing \u2014 check script order");return}function e(y){return window.AppDialog.openDialog(y||{})}function i(){return window.AppShortcuts.map}function r(y){window.AppShortcutManager.onShortcut(y)}function l(y){window.AppShortcutManager.onDisableShortcuts(y)}let c=null;function f(y){c=y,window.addEventListener("beforeunload",k=>{if(c){try{Promise.resolve(c()).catch(()=>{})}catch(b){}k.preventDefault(),k.returnValue=""}})}function g(){try{window.close()}catch(y){}return Promise.resolve()}function s(){}function u(){return Promise.resolve(!1)}function p(y){try{window.dispatchEvent(new CustomEvent("menu-state-change",{detail:y}))}catch(k){}return Promise.resolve()}Object.assign(window.BridgeWindow,{openDialog:e,getShortcuts:i,onKeyboardShortcut:r,onDisableShortcuts:l,beforeClose:f,confirmClose:g,setWindowSize:s,isPackaged:u,updateMenuState:p})})(),(function(){const e=["https://raw.githubusercontent.com/arduino/package-index-py/main/package-list.yaml","https://raw.githubusercontent.com/arduino/package-index-py/main/micropython-lib.yaml","https://raw.githubusercontent.com/moyalab/package-index-py/main/package-list.yaml"],i="https://micropython.org/pi/v2",r="/lib";let l=null,c=null;function f(h){if(!h)return"";const S=h.indexOf("OK"),$=h.indexOf("");return S===-1||$===-1||$<=S+2?"":h.substring(S+2,$).trim()}async function g(h=!1){if(l&&!h)return l;if(c)return c;c=(async()=>{let S=[];for(const $ of e)try{const v=await fetch($,{cache:"no-cache"});if(!v.ok)throw new Error(`HTTP ${v.status}`);const _=await v.text(),x=window.jsyaml.load(_);x&&Array.isArray(x.packages)&&(S=S.concat(x.packages))}catch(v){throw new Error(`Failed to fetch ${$}: ${v.message}`)}return S.sort(($,v)=>($.name||"").localeCompare(v.name||"")),l=S,S})();try{return await c}finally{c=null}}function s(h,S){const $=Array.isArray(S)?S:l||[];if(!h)return $.slice();const v=h.trim().toLowerCase();return v?$.filter(_=>_?[_.name,_.description,_.author,_.url,Array.isArray(_.tags)?_.tags.join(" "):_.tags].filter(Boolean).join(" ").toLowerCase().includes(v):!1):$.slice()}function u(h){if(!h)return null;const S=h.split("-");return S.length>=3?S[2]:null}async function p(){if(!window.BridgeSerial||typeof window.BridgeSerial.run!="function")return{format:null,arch:null};let h=null,S=null;try{const $=await window.BridgeSerial.run(`import sys
try:
  print(sys.implementation._mpy & 0xff)
except AttributeError:
  print("")
`),v=f($);v&&/^\d+$/.test(v)&&(h=Number(v))}catch($){}try{const $=await window.BridgeSerial.run(`try:
  import platform
  print(platform.platform())
except Exception:
  print("")
`);S=u(f($))}catch($){}return{format:h,arch:S}}function y(h){return h?h.startsWith("github:")||h.startsWith("gitlab:")||h.startsWith("http://")||h.startsWith("https://"):!1}function k(h,S){let $=String(h).trim(),v=S||null;const _=$.lastIndexOf("@");if(_>$.indexOf("://")&&_!==-1)v=v||$.substring(_+1),$=$.substring(0,_);else if($.startsWith("github:")||$.startsWith("gitlab:")){const x=$.indexOf(":"),T=$.substring(x+1),D=T.lastIndexOf("@");D!==-1&&(v=v||T.substring(D+1),$=$.substring(0,x+1)+T.substring(0,D))}if(v=v||"HEAD",/\.(py|mpy)$/i.test($))return{kind:"file",fileUrl:b($,v),fileName:$.split("/").pop(),version:v};if($.startsWith("github:")||$.startsWith("gitlab:")){const x=$.startsWith("github:")?"github":"gitlab",D=$.substring($.indexOf(":")+1).split("/"),H=D[0],B=D[1],z=D.slice(2).join("/");return{kind:"repo",host:x,owner:H,repo:B,subdir:z,version:v}}try{const x=new URL($);if(x.hostname==="github.com"||x.hostname==="www.github.com"){const T=x.pathname.replace(/^\//,"").split("/"),D=T[0],H=T[1];let B=T.slice(2);return(B[0]==="tree"||B[0]==="blob")&&(v=v==="HEAD"?B[1]||"HEAD":v,B=B.slice(2)),{kind:"repo",host:"github",owner:D,repo:H,subdir:B.join("/"),version:v}}if(x.hostname==="gitlab.com"||x.hostname==="www.gitlab.com"){const T=x.pathname.replace(/^\//,"").split("/");return{kind:"repo",host:"gitlab",owner:T[0],repo:T[1],subdir:T.slice(2).join("/"),version:v}}if(x.hostname==="raw.githubusercontent.com"){const T=x.pathname.replace(/^\//,"").split("/"),D=T[0],H=T[1],B=T[2];return{kind:"repo",host:"github",owner:D,repo:H,subdir:T.slice(3).join("/"),version:v==="HEAD"?B:v}}}catch(x){}throw new Error(`Unrecognized package URL: ${h}`)}function b(h,S){if(h.startsWith("github:")){const v=h.substring(7).split("/"),_=v[0],x=v[1],T=v.slice(2).join("/");return`https://raw.githubusercontent.com/${_}/${x}/${S}/${T}`}if(h.startsWith("gitlab:")){const v=h.substring(7).split("/"),_=v[0],x=v[1],T=v.slice(2).join("/");return`https://gitlab.com/${_}/${x}/-/raw/${S}/${T}`}return h}function F(h,S){const $=h.version||"HEAD",v=h.subdir?h.subdir.replace(/\/$/,"")+"/":"";return h.host==="github"?`https://raw.githubusercontent.com/${h.owner}/${h.repo}/${$}/${v}${S}`:`https://gitlab.com/${h.owner}/${h.repo}/-/raw/${$}/${v}${S}`}async function n(h){const S=await fetch(h,{cache:"no-cache"});if(!S.ok)throw new Error(`Fetch ${h} \u2192 HTTP ${S.status}`);const $=await S.arrayBuffer();return new Uint8Array($)}async function o(h){const S=await fetch(h,{cache:"no-cache"});if(!S.ok)throw new Error(`Fetch ${h} \u2192 HTTP ${S.status}`);return await S.json()}async function a(h){const S=F(h,"package.json");try{return await o(S)}catch($){throw new Error(`Could not find package.json at ${S} \u2014 ${$.message}`)}}function d(...h){return h.filter(S=>S!=null&&S!=="").join("/").replace(/\/+/g,"/")}function m(h){if(!h)return"/";const S=h.lastIndexOf("/");return S<=0?"/":h.substring(0,S)}async function w(h){const S=h.split("/").filter(Boolean);let $="";for(const v of S){$+="/"+v;try{await window.BridgeSerial.createFolder($)}catch(_){}}}async function E(h,S,$){return await w(m(S)),await window.BridgeSerial.saveFileContent(S,h,$||(()=>{}))}async function P(h){let S;try{S=await window.BridgeSerial.ilistFiles(h)}catch($){return}if(Array.isArray(S)){for(const $ of S){const v=$[0],_=$[1],x=d(h,v);if(_===16384)await P(x);else try{await window.BridgeSerial.removeFile(x)}catch(T){}}try{await window.BridgeSerial.removeFolder(h)}catch($){}}}function R(h,S){const $=[];if(!h||!Array.isArray(h.hashes))return $;for(const[v,_]of h.hashes){const x=_.slice(0,2);$.push({boardRelPath:v,fileUrl:`${i}/file/${x}/${_}`})}return $}function L(h,S){const $=[];if(!h||!Array.isArray(h.urls))return $;for(const v of h.urls){const _=v[0],x=v[1];let T;/^https?:\/\//.test(x)?T=x:x.startsWith("github:")||x.startsWith("gitlab:")?T=b(x,S.version):T=F(S,x),$.push({boardRelPath:_,fileUrl:T})}return $}async function M(h,{visitedKey:S,mpyFormat:$,visited:v=new Set}){if(v.has(S))return{entries:[],packageName:null};v.add(S);let _=[],x=null,T=null;if(h.kind==="index"){const D=`${i}/package/${$}/${h.name}/${h.version}.json`,H=await o(D);x=H.name||h.name,_=R(H,$),T=H.deps||null}else if(h.kind==="repo"){const D=await a(h.repo);x=D.name||h.repo.repo,_=L(D,h.repo),T=D.deps||null}else if(h.kind==="file"){const D=h.fileName;x=D.replace(/\.(m?py)$/i,""),_=[{boardRelPath:D,fileUrl:h.fileUrl}]}if(Array.isArray(T))for(const D of T){const H=Array.isArray(D)?D[0]:D,B=Array.isArray(D)?D[1]:null,z=C(H,B),K=N(z),j=await M(z,{visitedKey:K,mpyFormat:$,visited:v});_=_.concat(j.entries)}return{entries:_,packageName:x}}function C(h,S){if(!h)throw new Error("Empty package identifier");if(y(h)||/\.(py|mpy)$/i.test(h)){const v=k(h,S);return v.kind==="file"?{kind:"file",fileUrl:v.fileUrl,fileName:v.fileName}:{kind:"repo",repo:v}}const $=S||"latest";return{kind:"index",name:h,version:$==="HEAD"?"latest":$}}function N(h){return h.kind==="index"?`index:${h.name}@${h.version}`:h.kind==="repo"?`repo:${h.repo.host}:${h.repo.owner}/${h.repo.repo}/${h.repo.subdir}@${h.repo.version}`:`file:${h.fileUrl}`}function A(h){const S=new Set;for(const $ of h){const v=$.boardRelPath.split("/")[0];v&&v.indexOf(".")===-1&&S.add(v)}return Array.from(S)}async function I(h,S={}){const{overwrite:$=!0,installAsMpy:v=!0,mpySpec:_=null,onProgress:x=()=>{}}=S;if(!h)throw new Error("No package provided");const D=v&&_&&_.format!=null?String(_.format):"py";let H;if(h.url)H=C(h.url,h.version);else if(h.name)H=C(h.name,h.version);else throw new Error("Package has neither name nor url");x({phase:"resolve",message:"Resolving package and dependencies\u2026"});const{entries:B}=await M(H,{visitedKey:N(H),mpyFormat:D});if(B.length===0)throw new Error("No files to install");const z=r;try{await window.BridgeSerial.createFolder(z)}catch(U){}const K=A(B);for(const U of K){const W=d(z,U);if(await window.BridgeSerial.fileExists(W)){if(!$)throw new Error(`Package folder already exists: ${W}`);x({phase:"cleanup",message:`Removing existing ${W}\u2026`}),await P(W)}}for(const U of B){if(U.boardRelPath.indexOf("/")!==-1)continue;const W=d(z,U.boardRelPath);if(await window.BridgeSerial.fileExists(W)){if(!$)throw new Error(`File already exists: ${W}`);try{await window.BridgeSerial.removeFile(W)}catch(V){}}}let j=0;for(const U of B){j+=1;const W=d(z,U.boardRelPath);x({phase:"install",message:`Installing ${j}/${B.length}: ${U.boardRelPath}`,current:j,total:B.length});const q=await n(U.fileUrl);await E(q,W,V=>{x({phase:"install",message:`Installing ${j}/${B.length}: ${U.boardRelPath} ${V}`,current:j,total:B.length,chunk:V})})}return x({phase:"done",message:`Installed ${B.length} file(s)`}),{installedFiles:B.length,formatUsed:D}}async function O(h,S={}){if(!h||typeof h!="string")throw new Error("URL is required");return await I({url:h.trim()},S)}window.PackageInstaller={getPackageList:g,findPackages:s,getBoardMpySpec:p,installPackage:I,installFromURL:O,_internals:{parseRepoUrl:k,resolveInstallTarget:C,targetKey:N,extractStdout:f,parseArchFromPlatform:u}}})(),(function(){const{ESPLoader:e,Transport:i}=window.esptoolJs;let r=null,l=null,c=null,f=null;function g(){return"serial"in navigator}function s(a){r=a}function u(a,d){r&&r.emit(a,d)}function p(a,d="info"){u("fw-log",{message:a,type:d})}function y(){return{clean(){},writeLine(a){if(!a||a.trim()==="")return;const d=a.replace(/\r?\n/g,"").trim();if(!d)return;let m="info";/error|fail/i.test(d)?m="error":/warning/i.test(d)?m="warn":/done|hash|leaving/i.test(d)&&(m="success"),p(d,m)},write(){}}}async function k(a=921600){if(!g())throw p(t("firmware.log.notSupported"),"error"),new Error("Web Serial not supported");try{p(t("firmware.log.selectingPort"),"info");const d=window.FIRMWARE_PORT_FILTERS||[];f=await navigator.serial.requestPort(d.length?{filters:d}:{}),l=new i(f,!1);const m=f.getInfo(),w={vendorId:m.usbVendorId?`0x${m.usbVendorId.toString(16).toUpperCase().padStart(4,"0")}`:"N/A",productId:m.usbProductId?`0x${m.usbProductId.toString(16).toUpperCase().padStart(4,"0")}`:"N/A"};u("fw-state",{portInfo:w}),p(t("firmware.log.initializingEsptool"),"info"),c=new e({transport:l,baudrate:parseInt(a),terminal:y()});const E=await c.main();return u("fw-state",{isConnected:!0,chipName:E}),p(t("firmware.log.connected",{chip:E,baud:a}),"success"),E}catch(d){throw d&&d.name==="NotFoundError"?p(t("firmware.log.portCancelled"),"warn"):(p(t("firmware.log.connectFailed",{err:d&&d.message?d.message:String(d)}),"error"),p(t("firmware.log.bootResetHint"),"warn")),d}}async function b(){try{l&&await l.disconnect()}catch(a){p(t("firmware.log.disconnectFailed",{err:a&&a.message?a.message:String(a)}),"error")}finally{l=null,c=null,f=null,u("fw-state",{isConnected:!1,chipName:null,portInfo:null,uploadProgress:0,uploadStatus:"idle"}),p(t("firmware.log.disconnected"),"info")}}async function F(a,d={}){if(!c)return p(t("firmware.log.connectFirst"),"error"),!1;const{eraseAll:m=!1}=d;u("fw-state",{isUploading:!0,uploadStatus:"uploading",uploadProgress:0});try{p("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","info"),p(t("firmware.log.flashStart"),"info"),p(t("firmware.log.flashMode",{value:window.FirmwareConfig.FLASH_MODE}),"info"),p(t("firmware.log.flashFreq",{value:window.FirmwareConfig.FLASH_FREQ}),"info"),p(t("firmware.log.flashSize",{value:window.FirmwareConfig.FLASH_SIZE}),"info"),p(t("firmware.log.fileCount",{n:a.length}),"info");for(const R of a)p(`  0x${R.address.toString(16).padStart(5,"0")} \u2192 ${R.label} (${n(R.data.length)})`,"info");p("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","info");const w=a.map(R=>({data:o(R.data),address:R.address})),E=a.reduce((R,L)=>R+L.data.length,0),P=a.map(R=>R.data.length);return await c.writeFlash({fileArray:w,flashMode:window.FirmwareConfig.FLASH_MODE,flashFreq:window.FirmwareConfig.FLASH_FREQ,flashSize:window.FirmwareConfig.FLASH_SIZE,eraseAll:m,compress:!0,reportProgress:(R,L,M)=>{const C=P.slice(0,R).reduce((A,I)=>A+I,0),N=Math.round((C+L)/E*100);u("fw-state",{uploadProgress:N})}}),p("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","success"),p(t("firmware.log.flashDone"),"success"),p("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","success"),p(t("firmware.log.boardReset"),"info"),await c.after(),p(t("firmware.log.resetDone"),"success"),u("fw-state",{uploadProgress:100,uploadStatus:"success",isUploading:!1}),!0}catch(w){return p(t("firmware.log.flashFailed",{err:w&&w.message?w.message:String(w)}),"error"),p(t("firmware.log.bootResetRetryHint"),"warn"),u("fw-state",{uploadStatus:"error",isUploading:!1}),!1}}function n(a){if(a===0)return"0 B";const d=["B","KB","MB","GB"],m=Math.floor(Math.log(a)/Math.log(1024));return(a/Math.pow(1024,m)).toFixed(2)+" "+d[m]}function o(a){let m="";for(let w=0;w<a.length;w+=8192){const E=a.subarray(w,Math.min(w+8192,a.length));m+=String.fromCharCode.apply(null,E)}return m}window.FirmwareTool={isSupported:g,setEmitter:s,connect:k,disconnect:b,flashFirmware:F}})(),(function(){function e(){return typeof navigator!="undefined"&&"serial"in navigator&&typeof window.showDirectoryPicker=="function"}function i(){const c=navigator.userAgentData&&navigator.userAgentData.brands&&navigator.userAgentData.brands.map(f=>f.brand).join(", ")||navigator.userAgent||"";return html`
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
          <p class="app-unsupported-ua">Detected: ${c}</p>
        </div>
      </div>
    `}let r=!1;function l(){if(r)return;r=!0;const c=`
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
    `,f=document.createElement("style");f.textContent=c,document.head.appendChild(f)}window.UnsupportedBrowser={isSupported:e,render:()=>(l(),i())}})();const log=console.log,serialBridge=window.BridgeSerial,disk=window.BridgeDisk,win=window.BridgeWindow,shortcuts=window.BridgeWindow.getShortcuts();let notyf=null;const newFileContent=`from bitblock import Bitblock
import time

print('Hello, BitBlock!')
`;async function sleep(e){return new Promise(i=>setTimeout(i,e))}async function confirmDialog(e,i,r,l){let c=[];r&&c.push(r),i&&c.push(i);let f=await win.openDialog({type:"question",title:l||"",buttons:c,defaultId:0,cancelId:1,message:e});return Promise.resolve(f)}async function store(e,i){win.setWindowSize(720,640),notyf||(notyf=new window.Notyf({duration:2e3,position:{x:"center",y:"top"},dismissible:!0,ripple:!0})),e.platform=window.BridgeWindow.getOS(),e.view="editor",e.diskNavigationPath="/",e.diskNavigationRoot=getDiskNavigationRootFromStorage(),e.diskFiles=[],e.boardNavigationPath="/",e.boardNavigationRoot="/",e.boardFiles=[],e.openFiles=[],e.selectedFiles=[],e.newTabFileName=null,e.editingFile=null,e.creatingFile=null,e.renamingFile=null,e.creatingFolder=null,e.renamingTab=null,e.isSidebarOpen=!0,e.sidebarWidth=getSidebarWidthFromStorage(),e.isFullscreen=!1,e.language=window.i18n.getLanguage(),e.isConnecting=!1,e.isConnected=!1,e.connectedPort=null,e.isRunning=!1,e.isNewFileDialogOpen=!1,e.isFirmwareUploaderOpen=!1,e.fw={isConnected:!1,chipName:null,portInfo:null,baudRate:window.FirmwareConfig?window.FirmwareConfig.DEFAULT_SETTINGS.baudRate:921600,activeTab:"micropython",selectedVersion:null,isUploading:!1,uploadStatus:"idle",uploadProgress:0,logs:[]},window.FirmwareTool&&window.FirmwareTool.setEmitter&&window.FirmwareTool.setEmitter(i),e.isInstallPackageDialogOpen=!1,e.isInstallingPackage=!1,e.installPackageProgress="",e.installPackageError=null,e.packageList=[],e.packageSearchQuery="",e.packageSearchResults=[],e.selectedPackage=null,e.packageOverwrite=!0,e.installAsMpy=!0,e.boardMpyFormat=null,e.boardMpyArch=null,e.isSaving=!1,e.savingProgress=0,e.isTransferring=!1,e.transferringProgress="",e.isRemoving=!1,e.isLoadingFiles=!1,e.dialogs=[],e.isTerminalBound=!1,e.shortcutsDisabled=!1,e.activeView="explorer",e.topicsByFile={},e.selectedTopicId={},e.topicsLoading={},e.topicsError={},e.editorState={loaded:!1,loading:!1,saving:!1,dirty:!1,fileKey:"micropythonReference",lang:"ko",topics:[],selectedTopicIdx:0,loadError:null,saveError:null},await F("disk"),e.diskNavigationRoot&&window.BridgeDisk&&window.BridgeDisk.whenReady&&window.BridgeDisk.whenReady().then(()=>{window.BridgeDisk.hasRoot&&window.BridgeDisk.hasRoot()&&i.emit("refresh-files")}),e.savedPanelHeight=PANEL_DEFAULT,e.panelHeight=PANEL_DEFAULT,e.isResizingPanel=!1,e.resizePanel=function(n){e.panelHeight=PANEL_CLOSED/2+document.body.clientHeight-n.clientY,e.panelHeight<=PANEL_CLOSED?e.savedPanelHeight=PANEL_DEFAULT:e.savedPanelHeight=e.panelHeight,i.emit("render")};const r=()=>{window.BridgeWindow.updateMenuState({isConnected:e.isConnected,view:e.view})};async function l(){if(e.diskNavigationRoot)return e.diskNavigationRoot;const n=await selectDiskFolder();return n?(saveDiskNavigationRootToStorage(n),e.diskNavigationRoot=n,e.diskNavigationPath="/",n):null}i.on("select-disk-navigation-root",async()=>{const n=await selectDiskFolder();if(!n){i.emit("render");return}saveDiskNavigationRootToStorage(n),e.diskNavigationRoot=n,e.diskNavigationPath="/",e.selectedFiles=(e.selectedFiles||[]).filter(o=>o.source!=="disk"),i.emit("refresh-files"),i.emit("render")}),i.on("toggle-sidebar",()=>{e.isSidebarOpen=!e.isSidebarOpen,i.emit("render")}),i.on("set-sidebar-width",n=>{const o=clampSidebarWidth(n);o!==e.sidebarWidth&&(e.sidebarWidth=o,saveSidebarWidthToStorage(o),i.emit("render"))}),i.on("set-language",n=>{window.i18n.setLanguage(n),e.language=window.i18n.getLanguage(),e.topicsByFile={},e.topicsLoading={},e.topicsError={},e.editorState&&(e.editorState.loaded=!1,e.editorState.lang=n),i.emit("render")}),i.on("set-active-view",n=>{e.activeView=n,i.emit("render")}),i.on("select-topic",({view:n,topicId:o})=>{e.selectedTopicId[n]=o,i.emit("render")}),i.on("load-topics",async({key:n,lang:o})=>{if(!e.topicsLoading[n]){e.topicsLoading[n]=!0,e.topicsError[n]=null,i.emit("render");try{const a=await fetch(`data/topics/${n}.${o}.json`);if(!a.ok)throw new Error(`HTTP ${a.status}`);const d=await a.json();e.topicsByFile[n]={topics:d,lang:o}}catch(a){e.topicsError[n]=a&&a.message?a.message:String(a)}e.topicsLoading[n]=!1,i.emit("render")}}),i.on("editor-load",async({fileKey:n,lang:o}={})=>{const a=e.editorState;if(!a.loading){a.loading=!0,a.loadError=null,a.fileKey=n||a.fileKey,a.lang=o||a.lang,i.emit("render");try{const d=await fetch(`/api/topics?fileKey=${a.fileKey}&lang=${a.lang}`);if(!d.ok)throw new Error(`HTTP ${d.status}`);a.topics=await d.json(),a.loaded=!0,a.dirty=!1,a.selectedTopicIdx=0}catch(d){a.loadError=d&&d.message?d.message:String(d)}a.loading=!1,i.emit("render")}}),i.on("editor-save",async()=>{const n=e.editorState;if(!n.saving){n.saving=!0,n.saveError=null,i.emit("render");try{const o=await fetch(`/api/topics?fileKey=${n.fileKey}&lang=${n.lang}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(n.topics)});if(!o.ok)throw new Error(`HTTP ${o.status}`);n.dirty=!1,delete e.topicsByFile[n.fileKey]}catch(o){n.saveError=o&&o.message?o.message:String(o)}n.saving=!1,i.emit("render")}}),i.on("editor-set-file",({fileKey:n,lang:o})=>{const a=e.editorState;a.fileKey=n,a.lang=o,a.loaded=!1,i.emit("editor-load",{fileKey:n,lang:o})}),i.on("editor-select-topic",n=>{e.editorState.selectedTopicIdx=n,i.emit("render")}),i.on("editor-patch-topic",({idx:n,patch:o})=>{const a=e.editorState,d=a.topics[n];d&&(Object.assign(d,o),a.dirty=!0,i.emit("render"))}),i.on("editor-add-topic",()=>{const n=e.editorState;n.topics.push({id:"new-topic-"+Date.now().toString(36),title:"New Topic",description:"",icon:"menu_book",notice:"",entries:[]}),n.selectedTopicIdx=n.topics.length-1,n.dirty=!0,i.emit("render")}),i.on("editor-remove-topic",n=>{const o=e.editorState;o.topics.length<=0||n<0||n>=o.topics.length||(o.topics.splice(n,1),o.selectedTopicIdx>=o.topics.length&&(o.selectedTopicIdx=Math.max(0,o.topics.length-1)),o.dirty=!0,i.emit("render"))}),i.on("editor-move-topic",({from:n,to:o})=>{const a=e.editorState;if(n===o||n<0||o<0||n>=a.topics.length||o>=a.topics.length)return;const[d]=a.topics.splice(n,1);a.topics.splice(o,0,d),a.selectedTopicIdx=o,a.dirty=!0,i.emit("render")}),i.on("editor-add-entry",({topicIdx:n})=>{const o=e.editorState,a=o.topics[n];a&&(Array.isArray(a.entries)||(a.entries=[]),a.entries.push({name:"new entry",summary:"",details:"",examples:[]}),o.dirty=!0,i.emit("render"))}),i.on("editor-remove-entry",({topicIdx:n,entryIdx:o})=>{const a=e.editorState,d=a.topics[n];!d||!d.entries||o<0||o>=d.entries.length||(d.entries.splice(o,1),a.dirty=!0,i.emit("render"))}),i.on("editor-move-entry",({topicIdx:n,from:o,to:a})=>{const d=e.editorState,m=d.topics[n];if(!m||!m.entries||o===a||o<0||a<0||o>=m.entries.length||a>=m.entries.length)return;const[w]=m.entries.splice(o,1);m.entries.splice(a,0,w),d.dirty=!0,i.emit("render")}),i.on("editor-patch-entry",({topicIdx:n,entryIdx:o,patch:a})=>{const d=e.editorState,m=d.topics[n];!m||!m.entries||!m.entries[o]||(Object.assign(m.entries[o],a),d.dirty=!0,i.emit("render"))}),i.on("editor-set-example",({topicIdx:n,entryIdx:o,exampleIdx:a,patch:d})=>{const m=e.editorState,w=m.topics[n]&&m.topics[n].entries[o];w&&(Array.isArray(w.examples)||(w.examples=[]),w.examples[a]||(w.examples[a]={code:"",description:""}),Object.assign(w.examples[a],d),m.dirty=!0,i.emit("render"))}),i.on("editor-add-example",({topicIdx:n,entryIdx:o})=>{const a=e.editorState,d=a.topics[n]&&a.topics[n].entries[o];d&&(Array.isArray(d.examples)||(d.examples=[]),d.examples.push({code:"",description:""}),a.dirty=!0,i.emit("render"))}),i.on("editor-remove-example",({topicIdx:n,entryIdx:o,exampleIdx:a})=>{const d=e.editorState,m=d.topics[n]&&d.topics[n].entries[o];!m||!Array.isArray(m.examples)||(m.examples.splice(a,1),d.dirty=!0,i.emit("render"))}),i.on("toggle-fullscreen",async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch(n){console.error("fullscreen toggle failed",n)}}),document.addEventListener("fullscreenchange",()=>{e.isFullscreen=!!document.fullscreenElement,i.emit("render")}),i.on("change-view",async n=>{e.view!==n&&(e.selectedFiles=[],n==="file-manager"&&(i.emit("stop"),await sleep(250),i.emit("refresh-files")),e.view=n,i.emit("render"),r())}),i.on("launch-app",async(n,o)=>{window.launchApp(n,o)}),i.on("open-install-package-dialog",async()=>{if(!e.isConnected){i.emit("connect");return}e.isInstallPackageDialogOpen=!0,e.installPackageError=null,e.installPackageProgress="",i.emit("render");try{const n=await window.PackageInstaller.getBoardMpySpec();e.boardMpyFormat=n.format,e.boardMpyArch=n.arch}catch(n){e.boardMpyFormat=null,e.boardMpyArch=null}if(e.packageList.length===0)try{const n=await window.PackageInstaller.getPackageList();e.packageList=n,e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,n)}catch(n){e.installPackageError=t("toast.packageRegistryFailed",{err:n.message})}else e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,e.packageList);i.emit("render")}),i.on("close-install-package-dialog",()=>{e.isInstallingPackage||(e.isInstallPackageDialogOpen=!1,i.emit("render"))}),i.on("search-packages",n=>{e.packageSearchQuery=n||"",e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,e.packageList),i.emit("render")}),i.on("select-package-to-install",n=>{e.selectedPackage=n,i.emit("render")}),i.on("toggle-install-overwrite",n=>{e.packageOverwrite=!!n,i.emit("render")});async function c(n){e.isInstallingPackage=!0,e.installPackageError=null,e.installPackageProgress=t("dialog.install.resolving"),i.emit("render");try{await window.PackageInstaller.installPackage(n,{overwrite:e.packageOverwrite,installAsMpy:!0,mpySpec:{format:e.boardMpyFormat,arch:e.boardMpyArch},onProgress:o=>{e.installPackageProgress=o&&o.message?o.message:"",i.emit("render")}}),e.installPackageProgress=t("dialog.install.installed"),i.emit("refresh-files")}catch(o){e.installPackageError=o.message||String(o)}finally{e.isInstallingPackage=!1,i.emit("render")}}i.on("install-package",async n=>{e.isInstallingPackage||!n||await c(n)}),i.on("select-port",async n=>{log("connect",n);const o=n.path;e.isConnecting=!0,i.emit("render");let a=setTimeout(()=>{let m=win.openDialog({type:"error",title:t("dialog.connectFailed.title"),buttons:[t("dialog.ok")],cancelId:0,message:t("dialog.connectFailed.msg")});i.emit("connection-timeout")},3500);try{await serialBridge.connect(o)}catch(m){console.error(m)}await serialBridge.getPrompt(),clearTimeout(a),e.isConnecting=!1,e.isConnected=!0,e.boardNavigationPath=await getBoardNavigationPath(),r(),e.view==="editor"&&e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),e.connectedPort=o;let d=e.cache(XTerm,"terminal").term;e.isTerminalBound||(e.isTerminalBound=!0,d.onData(m=>{serialBridge.eval(m),d.scrollToBottom()}),serialBridge.eval("")),serialBridge.onData(m=>{d.write(m),d.scrollToBottom()}),serialBridge.onConnectionClosed(()=>i.emit("disconnected")),i.emit("refresh-files"),i.emit("render")}),i.on("disconnected",()=>{e.isConnected=!1,e.isRunning=!1,e.panelHeight=PANEL_CLOSED,e.boardFiles=[],e.boardNavigationPath="/",e.boardMpyFormat=null,e.boardMpyArch=null,e.isInstallPackageDialogOpen=!1,notyf.error({message:t("toast.boardDisconnected"),className:"toast-board-disconnected"}),i.emit("refresh-files"),i.emit("render"),r()}),i.on("disconnect",async()=>{if(e.isFirmwareUploaderOpen){await window.FirmwareTool.disconnect();return}await serialBridge.disconnect()}),i.on("connection-timeout",async()=>{e.isConnected=!1,e.isConnecting=!1,e.isRunning=!1,i.emit("render")}),i.on("connect",async()=>{if(e.isFirmwareUploaderOpen){try{await window.FirmwareTool.connect(e.fw.baudRate)}catch(o){}return}let n;try{n=await serialBridge.requestPort()}catch(o){console.error("connect: requestPort failed",o);return}n&&i.emit("select-port",n)}),i.on("toggle-firmware-uploader",async()=>{const n=!e.isFirmwareUploaderOpen;e.isConnected&&(await serialBridge.disconnect(),e.isConnected=!1),e.fw.isConnected&&await window.FirmwareTool.disconnect(),e.fw.uploadStatus="idle",e.fw.uploadProgress=0,e.isFirmwareUploaderOpen=n,i.emit("render")}),i.on("close-firmware-uploader",async()=>{e.isConnected&&(await serialBridge.disconnect(),e.isConnected=!1),e.fw.isConnected&&await window.FirmwareTool.disconnect(),e.fw.uploadStatus="idle",e.fw.uploadProgress=0,e.isFirmwareUploaderOpen=!1,i.emit("render")}),i.on("fw-set-baud",n=>{e.fw.baudRate=parseInt(n,10)||e.fw.baudRate,i.emit("render")}),i.on("fw-set-tab",n=>{e.fw.activeTab=n,e.fw.selectedVersion=null,e.fw.uploadStatus="idle",i.emit("render")}),i.on("fw-select-version",n=>{e.fw.selectedVersion=n,e.fw.uploadStatus="idle",i.emit("render")}),i.on("fw-clear-logs",()=>{e.fw.logs=[],i.emit("render")}),i.on("fw-state",n=>{const o=e.fw.uploadStatus==="success";Object.assign(e.fw,n),!o&&e.fw.uploadStatus==="success"&&notyf&&notyf.success(t("firmware.upload.success")),i.emit("render")}),i.on("fw-log",n=>{const o=window.i18n&&window.i18n.getLanguage()==="ko"?"ko-KR":"en-US",a=new Date().toLocaleTimeString(o,{hour12:!1});e.fw.logs.push({timestamp:a,message:n.message,type:n.type||"info"}),i.emit("render")}),i.on("fw-upload",async()=>{const n=window.FirmwareConfig,o=e.fw.selectedVersion;if(!o){i.emit("fw-log",{type:"warn",message:t("firmware.log.selectFw")});return}const a=n.FIRMWARE_VERSIONS.find(d=>d.id===o);if(!a){i.emit("fw-log",{type:"error",message:t("firmware.log.fwNotFound")});return}try{const d=n.getFlashMap(a);i.emit("fw-log",{type:"info",message:t("firmware.log.loadingFw",{version:a.version})});const m=[];for(const w of d){i.emit("fw-log",{type:"info",message:t("firmware.log.downloading",{path:w.path})});const E=await fetch(w.path);if(!E.ok)throw new Error(t("firmware.log.loadFailed",{path:w.path,status:E.status}));const P=new Uint8Array(await E.arrayBuffer());m.push({data:P,address:w.address,label:w.label}),i.emit("fw-log",{type:"success",message:t("firmware.log.loadedEntry",{label:w.label,bytes:P.length})})}i.emit("fw-log",{type:"success",message:t("firmware.log.allLoaded",{n:m.length})}),await window.FirmwareTool.flashFirmware(m)}catch(d){i.emit("fw-log",{type:"error",message:t("firmware.log.loadError",{err:d.message})}),i.emit("fw-state",{uploadStatus:"error"})}}),i.on("run-from-button",(n=!1)=>{n?y():p()}),i.on("run",async(n=!1)=>{log("run");const o=e.openFiles.find(w=>w.id==e.editingFile);let a=o.editor.editor.state.doc.toString();const d=o.editor.editor.state.selection.ranges[0].from,m=o.editor.editor.state.selection.ranges[0].to;m-d>0&&n&&(selectedCode=o.editor.editor.state.doc.toString().substring(d,m),selectedCode.trim().length>0&&(a=selectedCode)),e.isRunning=!0,i.emit("open-panel"),el=document.querySelector(".xterm-helper-textarea"),el&&el.focus(),i.emit("render");try{await serialBridge.getPrompt(),await serialBridge.run(a)}catch(w){log("error",w)}finally{e.isRunning=!1}el=document.querySelector(".cm-content"),el&&el.focus(),i.emit("render")}),i.on("stop",async()=>{log("stop"),e.isRunning=!1,e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),i.emit("open-panel"),i.emit("render"),e.isConnected&&await serialBridge.getPrompt()}),i.on("reset",async()=>{log("reset"),e.isRunning=!1,e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),i.emit("open-panel"),i.emit("render"),await serialBridge.reset(),i.emit("update-files"),i.emit("render")}),i.on("open-panel",()=>{i.emit("stop-resizing-panel"),e.panelHeight=e.savedPanelHeight,i.emit("render"),setTimeout(()=>{e.cache(XTerm,"terminal").resizeTerm()},550)}),i.on("close-panel",()=>{i.emit("stop-resizing-panel"),e.savedPanelHeight=e.panelHeight,e.panelHeight=0,i.emit("render")}),i.on("clear-terminal",()=>{e.cache(XTerm,"terminal").term.clear()}),i.on("start-resizing-panel",()=>{log("start-resizing-panel"),e.isResizingPanel=!0,i.emit("render"),window.addEventListener("mousemove",e.resizePanel),document.body.addEventListener("mouseleave",()=>{i.emit("stop-resizing-panel")},{once:!0}),document.querySelector("#tabs").addEventListener("mouseenter",()=>{i.emit("stop-resizing-panel")},{once:!0})}),i.on("stop-resizing-panel",()=>{log("stop-resizing-panel"),e.isResizingPanel=!1,window.removeEventListener("mousemove",e.resizePanel),i.emit("render")}),i.on("create-new-file",()=>{log("create-new-file"),f(),e.isNewFileDialogOpen=!0,i.emit("render"),document.addEventListener("keydown",f)}),i.on("close-new-file-dialog",()=>{e.isNewFileDialogOpen=!1,f(),i.emit("render")}),i.on("save",async()=>{if(log("save"),canSave({view:e.view,isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile})==!1){log("can't save");return}let o=e.openFiles.find(P=>P.id===e.editingFile);if(o.source==="disk"&&!e.diskNavigationRoot&&!await l()){i.emit("render");return}let a=!1;const d=o.parentFolder,m=d===null;m&&(o.source=="board"?o.parentFolder=e.boardNavigationPath:o.source=="disk"&&(o.parentFolder=e.diskNavigationPath));let w=!1;if(o.source=="board"?(await serialBridge.getPrompt(),w=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName))):o.source=="disk"&&(w=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))),(m||!w)&&(o.source=="board"?(o.parentFolder=e.boardNavigationPath,await serialBridge.getPrompt(),a=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName))):o.source=="disk"&&(o.parentFolder=e.diskNavigationPath,a=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName)))),a&&!await confirmDialog(t("dialog.overwrite.msgFile",{name:o.fileName,source:o.source}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){o.parentFolder=d,i.emit("render");return}e.isSaving=!0,i.emit("render");const E=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName),E,P=>{e.savingProgress=P,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName),E)}catch(P){log("error",P)}o.hasChanges=!1,e.isSaving=!1,e.savingProgress=0,i.emit("refresh-files"),i.emit("render")}),i.on("select-tab",n=>{log("select-tab",n),e.editingFile=n,i.emit("render")}),i.on("close-tab",async n=>{if(log("close-tab",n),e.openFiles.find(a=>a.id===n).hasChanges&&!await confirmDialog(t("dialog.unsaved.msg"),t("dialog.cancel"),t("dialog.yes"),t("dialog.unsaved.title")))return!1;e.openFiles=e.openFiles.filter(a=>a.id!==n),e.openFiles.length>0?e.editingFile=e.openFiles[0].id:await F("disk"),i.emit("render")}),i.on("refresh-files",async()=>{if(log("refresh-files"),!e.isLoadingFiles){if(e.isLoadingFiles=!0,i.emit("render"),e.isConnected)try{e.boardFiles=await getBoardFiles(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""))}catch(n){e.boardFiles=[]}else e.boardFiles=[];if(e.diskNavigationRoot)try{e.diskFiles=await getDiskFiles(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""))}catch(n){const o=n&&typeof n.message=="string"?n.message:"";n&&(n.name==="NotAllowedError"||n.name==="SecurityError")||o.startsWith("No folder selected")?e.diskFiles=[]:(e.diskNavigationRoot=null,e.diskNavigationPath="/",e.diskFiles=[])}else e.diskFiles=[];i.emit("refresh-selected-files"),e.isLoadingFiles=!1,i.emit("render")}}),i.on("refresh-selected-files",()=>{log("refresh-selected-files"),e.selectedFiles=e.selectedFiles.filter(n=>n.source==="board"?e.isConnected?e.boardFiles.find(o=>n.fileName===o.fileName):!1:e.diskFiles.find(o=>n.fileName===o.fileName)),i.emit("render")}),i.on("create-new-tab",async(n,o=null)=>{const a=n=="board"?e.boardNavigationPath:e.diskNavigationPath;log("create-new-tab",n,o,a),await F(n,o,a)&&(i.emit("close-new-file-dialog"),i.emit("render"))}),i.on("create-file",(n,o=null)=>{log("create-file",n),e.creatingFile===null&&(e.creatingFile=n,e.creatingFolder=null,o!=null&&i.emit("finish-creating-file",o),i.emit("render"))}),i.on("finish-creating-file",async n=>{if(log("finish-creating",n),!!e.creatingFile){if(!n){e.creatingFile=null,i.emit("render");return}if(e.creatingFile=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:n})&&!await confirmDialog(t("dialog.overwrite.msgFileBoard",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFile=null,i.emit("render");return}await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n),newFileContent)}else if(e.creatingFile=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:n})&&!await confirmDialog(t("dialog.overwrite.msgFileDisk",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFile=null,i.emit("render");return}await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n),newFileContent)}setTimeout(()=>{e.creatingFile=null,f(),i.emit("refresh-files"),i.emit("render")},200)}}),i.on("create-folder",n=>{log("create-folder",n),e.creatingFolder===null&&(e.creatingFolder=n,e.creatingFile=null,i.emit("render"))}),i.on("finish-creating-folder",async n=>{if(log("finish-creating-folder",n),!!e.creatingFolder){if(!n){e.creatingFolder=null,i.emit("render");return}if(e.creatingFolder=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:n})){if(!await confirmDialog(t("dialog.overwrite.msgValueBoard",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFolder=null,i.emit("render");return}await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}await serialBridge.createFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}else if(e.creatingFolder=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:n})){if(!await confirmDialog(t("dialog.overwrite.msgValueDisk",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFolder=null,i.emit("render");return}await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}await disk.createFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}setTimeout(()=>{e.creatingFolder=null,i.emit("refresh-files"),i.emit("render")},200)}}),i.on("remove-files",async n=>{log("remove-files",n||"(all)");const o=n?e.selectedFiles.filter(E=>E.source===n):e.selectedFiles;if(o.length===0)return;let a=o.filter(E=>E.source==="board").map(E=>E.fileName),d=o.filter(E=>E.source==="disk").map(E=>E.fileName),m=t("dialog.delete.header");if(a.length&&(m+=t("dialog.delete.fromBoard"),a.forEach(E=>m+=`${E}
`),m+=`
`),d.length&&(m+=t("dialog.delete.fromDisk"),d.forEach(E=>m+=`${E}
`),m+=`
`),m+=t("dialog.overwrite.proceed"),!!await confirmDialog(m,t("dialog.cancel"),t("dialog.yes"),t("dialog.delete.title"))){e.isRemoving=!0,i.emit("render");for(let E in o){const P=o[E];P.type=="folder"?P.source==="board"?await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,P.fileName)):await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,P.fileName)):P.source==="board"?await serialBridge.removeFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,P.fileName)):await disk.removeFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,P.fileName))}i.emit("refresh-files"),n?e.selectedFiles=e.selectedFiles.filter(E=>E.source!==n):e.selectedFiles=[],e.isRemoving=!1,i.emit("render")}}),i.on("rename-file",(n,o)=>{log("rename-file",n,o),e.renamingFile=n,i.emit("render")}),i.on("finish-renaming-file",async n=>{log("finish-renaming-file",n);const o=e.selectedFiles[0];if(!n||o.fileName==n){e.renamingFile=null,i.emit("render");return}if(e.renamingFile=="board"&&e.isConnected){if((await checkOverwrite({fileNames:[n],parentPath:disk.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""),source:"board"})).length>0){let d=t("dialog.overwrite.msgSingleBoardHeader");if(d+=`${n}

`,d+=t("dialog.overwrite.proceed"),!await confirmDialog(d,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingFile=null,i.emit("render");return}o.type=="folder"?await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n)):o.type=="file"&&await serialBridge.removeFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}}else if(e.renamingFile=="disk"&&(await checkOverwrite({fileNames:[n],parentPath:disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""),source:"disk"})).length>0){let d=t("dialog.overwrite.msgSingleDiskHeader");if(d+=`${n}

`,d+=t("dialog.overwrite.proceed"),!await confirmDialog(d,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingFile=null,i.emit("render");return}o.type=="folder"?await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n)):o.type=="file"&&await disk.removeFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}e.isSaving=!0,i.emit("render");try{e.renamingFile=="board"?await serialBridge.renameFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,o.fileName),serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n)):await disk.renameFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,o.fileName),disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n));const a=e.openFiles.findIndex(d=>d.fileName===o.fileName&&d.source===o.source&&d.parentFolder===o.parentFolder);a>-1&&(e.openFiles[a].fileName=n,i.emit("render"))}catch(a){alert(`The file ${o.fileName} could not be renamed to ${n}`)}e.isSaving=!1,e.renamingFile=null,i.emit("refresh-files"),i.emit("render")}),i.on("rename-tab",n=>{log("rename-tab",n),e.renamingTab=n,i.emit("render")}),i.on("finish-renaming-tab",async n=>{log("finish-renaming-tab",n);const o=e.openFiles.find(P=>P.id===e.renamingTab);if(!n||o.fileName==n){e.renamingTab=null,e.isSaving=!1,i.emit("render");return}const a=o.parentFolder,d=o.fileName;o.fileName=n;const m=a===null;let w=!1;m||(o.source=="board"?w=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,d)):o.source=="disk"&&(w=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,d)))),(m||!w)&&(o.source=="board"?o.parentFolder=e.boardNavigationPath:o.source=="disk"&&(o.parentFolder=e.diskNavigationPath));let E=!1;if(o.source=="board"?E=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName)):o.source=="disk"&&(E=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))),E&&!await confirmDialog(t("dialog.overwrite.msgFile",{name:o.fileName,source:o.source}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingTab=null,o.fileName=d,i.emit("render");return}if(e.isSaving=!0,i.emit("render"),w){if(o.hasChanges){const P=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,d),P,R=>{e.savingProgress=R,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,d),P)}catch(R){log("error",R)}}try{o.source=="board"?await serialBridge.renameFile(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,d),serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName)):o.source=="disk"&&await disk.renameFile(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,d),disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))}catch(P){log("error",P)}}else if(!w){const P=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName),P,R=>{e.savingProgress=R,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName),P)}catch(R){log("error",R)}}o.hasChanges=!1,e.renamingTab=null,e.isSaving=!1,e.savingProgress=0,i.emit("refresh-files"),i.emit("render")}),i.on("toggle-file-selection",(n,o,a)=>{log("toggle-file-selection",n,o,a);let d=o=="board"?e.boardNavigationPath:e.diskNavigationPath;if(a&&!a.ctrlKey&&!a.metaKey){e.selectedFiles=[{fileName:n.fileName,type:n.type,source:o,parentFolder:d}],i.emit("render");return}e.selectedFiles.find(w=>w.fileName===n.fileName&&w.source===o)?e.selectedFiles=e.selectedFiles.filter(w=>!(w.fileName===n.fileName&&w.source===o)):e.selectedFiles.push({fileName:n.fileName,type:n.type,source:o,parentFolder:d}),i.emit("render")}),i.on("open-selected-files",async()=>{log("open-selected-files");let n=[],o=[];if(!e.isLoadingFiles){e.isLoadingFiles=!0,i.emit("render");for(let a in e.selectedFiles){let d=e.selectedFiles[a];if(d.type=="folder")continue;const m=e.openFiles.find(w=>w.fileName==d.fileName&&w.source==d.source&&w.parentFolder==d.parentFolder);if(m)o.push(m);else{let w=null;if(d.source=="board"){const E=await serialBridge.loadFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,d.fileName)),P=new Uint8Array(E),R=new TextDecoder("utf-8").decode(P);w=b({parentFolder:e.boardNavigationPath,fileName:d.fileName,source:d.source,content:R}),w.editor.onChange=function(){w.hasChanges=!0,i.emit("render")}}else if(d.source=="disk"){const E=await disk.loadFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,d.fileName));w=b({parentFolder:e.diskNavigationPath,fileName:d.fileName,source:d.source,content:E}),w.editor.onChange=function(){w.hasChanges=!0,i.emit("render")}}n.push(w)}}o.length>0&&(e.editingFile=o[0].id),n.length>0&&(e.editingFile=n[0].id),e.openFiles=e.openFiles.concat(n),e.selectedFiles=[],e.view="editor",r(),e.isLoadingFiles=!1,i.emit("render")}}),i.on("open-file",(n,o)=>{log("open-file",n,o),e.selectedFiles=[{fileName:o.fileName,type:o.type,source:n,parentFolder:e[`${n}NavigationPath`]}],i.emit("open-selected-files")}),i.on("upload-files",async()=>{log("upload-files");const n=await checkOverwrite({source:"board",fileNames:e.selectedFiles.map(o=>o.fileName),parentPath:serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,"")});if(n.length>0){let o=t("dialog.overwrite.msgManyBoardHeader");if(n.forEach(d=>o+=`${d.fileName}
`),o+=`
`,o+=t("dialog.overwrite.proceed"),!await confirmDialog(o,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title")))return}e.isTransferring=!0,i.emit("render");for(let o in e.selectedFiles){const a=e.selectedFiles[o],d=disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a.fileName),m=serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a.fileName);a.type=="folder"?(await uploadFolder(d,m,(w,E)=>{e.transferringProgress=`${E}: ${w}`,i.emit("render")}),e.transferringProgress=""):(await serialBridge.uploadFile(d,m,w=>{e.transferringProgress=`${a.fileName}: ${w}`,i.emit("render")}),e.transferringProgress="")}e.isTransferring=!1,e.selectedFiles=[],i.emit("refresh-files"),i.emit("render")}),i.on("download-files",async()=>{log("download-files");const n=await checkOverwrite({source:"disk",fileNames:e.selectedFiles.map(o=>o.fileName),parentPath:disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,"")});if(n.length>0){let o=t("dialog.overwrite.msgManyDiskHeader");if(n.forEach(d=>o+=`${d.fileName}
`),o+=`
`,o+=t("dialog.overwrite.proceed"),!await confirmDialog(o,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title")))return}e.isTransferring=!0,i.emit("render");for(let o in e.selectedFiles){const a=e.selectedFiles[o],d=serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a.fileName),m=disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a.fileName);a.type=="folder"?await downloadFolder(d,m,w=>{e.transferringProgress=w,i.emit("render")}):await serialBridge.downloadFile(d,m,w=>{e.transferringProgress=w,i.emit("render")})}e.isTransferring=!1,e.selectedFiles=[],i.emit("refresh-files"),i.emit("render")}),i.on("navigate-board-folder",n=>{log("navigate-board-folder",n),e.boardNavigationPath=serialBridge.getNavigationPath(e.boardNavigationPath,n),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-board-parent",()=>{log("navigate-board-parent"),e.boardNavigationPath=serialBridge.getNavigationPath(e.boardNavigationPath,".."),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-disk-folder",n=>{log("navigate-disk-folder",n),e.diskNavigationPath=disk.getNavigationPath(e.diskNavigationPath,n),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-disk-parent",()=>{log("navigate-disk-parent"),e.diskNavigationPath=disk.getNavigationPath(e.diskNavigationPath,".."),i.emit("refresh-files"),i.emit("render")}),win.beforeClose(async()=>{if(!!e.openFiles.find(o=>o.hasChanges)&&!await confirmDialog(t("dialog.unsaved.msgMayHave"),t("dialog.cancel"),t("dialog.yes"),t("dialog.unsaved.title")))return!1;await win.confirmClose()}),win.onDisableShortcuts(n=>{e.shortcutsDisabled=n}),win.onKeyboardShortcut(n=>{if(!(e.isTransferring||e.isRemoving||e.isSaving||e.isNewFileDialogOpen)&&!e.shortcutsDisabled){if(n===shortcuts.CLOSE&&i.emit("close-tab",e.editingFile),n===shortcuts.CONNECT&&i.emit("connect"),n===shortcuts.DISCONNECT&&i.emit("disconnect"),n===shortcuts.RESET){if(e.view!="editor")return;i.emit("reset")}if(n===shortcuts.CLEAR_TERMINAL){if(e.view!="editor")return;i.emit("clear-terminal")}if(n===shortcuts.RUN){if(e.view!="editor")return;p()}if(n===shortcuts.RUN_SELECTION||n===shortcuts.RUN_SELECTION_WL){if(e.view!="editor")return;y()}if(n===shortcuts.STOP){if(e.view!="editor")return;k()}if(n===shortcuts.NEW){if(e.view!="editor")return;i.emit("create-new-file")}if(n===shortcuts.SAVE){if(e.view!="editor")return;i.emit("save")}if(n===shortcuts.EDITOR_VIEW){if(e.view!="file-manager")return;i.emit("change-view","editor")}if(n===shortcuts.FILES_VIEW){if(e.view!="editor")return;i.emit("change-view","file-manager")}}});function f(n=null){n&&n.key!="Escape"||(document.removeEventListener("keydown",f),e.isNewFileDialogOpen=!1,i.emit("render"))}let g=!1;function s(){g=!0,setTimeout(()=>{g=!1},500)}function u(n=!1){g||(i.emit("run",n),s())}function p(){canExecute({view:e.view,isConnected:e.isConnected})&&u()}function y(){canExecute({view:e.view,isConnected:e.isConnected})&&u(!0)}function k(){canExecute({view:e.view,isConnected:e.isConnected})&&i.emit("stop")}function b(n){const{source:o,parentFolder:a,fileName:d,content:m=newFileContent,hasChanges:w=!1}=n,E=generateHash(),P=e.cache(CodeMirrorEditor,`editor_${E}`);return P.content=m,{id:E,source:o,parentFolder:a,fileName:d,editor:P,hasChanges:w}}async function F(n,o=null,a=null){const d=n=="board"?e.boardNavigationPath:e.diskNavigationPath;let m=o;if(m===null){const R=e.openFiles.filter(M=>M.source===n&&M.parentFolder===a).map(M=>M.fileName),L=(n==="board"?e.boardFiles:e.diskFiles).map(M=>M.fileName);m=generateFileName([...R,...L])}const w=b({fileName:m,parentFolder:a,source:n,hasChanges:!0});let E=!1;if(a!=null&&(n=="board"?(await serialBridge.getPrompt(),E=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,w.parentFolder,w.fileName))):n=="disk"&&(E=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,w.parentFolder,w.fileName)))),e.openFiles.find(R=>R.parentFolder===w.parentFolder&&R.fileName===w.fileName&&R.source===w.source)||E){const R=await confirmDialog(t("dialog.fileExists.msg",{name:w.fileName,source:n}),t("dialog.ok"),void 0,t("dialog.fileExists.title"));return!1}return w.editor.onChange=function(){w.hasChanges=!0,i.emit("render")},e.openFiles.push(w),e.editingFile=w.id,!0}}const SIDEBAR_WIDTH_MIN=180,SIDEBAR_WIDTH_MAX=600,SIDEBAR_WIDTH_DEFAULT=400;function clampSidebarWidth(e){const i=Number(e);return Number.isFinite(i)?Math.max(SIDEBAR_WIDTH_MIN,Math.min(SIDEBAR_WIDTH_MAX,Math.round(i))):SIDEBAR_WIDTH_DEFAULT}function getSidebarWidthFromStorage(){const e=localStorage.getItem("sidebarWidth");return e==null?SIDEBAR_WIDTH_DEFAULT:clampSidebarWidth(e)}function saveSidebarWidthToStorage(e){try{return localStorage.setItem("sidebarWidth",String(e)),!0}catch(i){return log("saveSidebarWidthToStorage",i),!1}}function getDiskNavigationRootFromStorage(){let e=localStorage.getItem("diskNavigationRoot");return(!e||e=="null")&&(e=null),e}function saveDiskNavigationRootToStorage(e){try{return localStorage.setItem("diskNavigationRoot",e),!0}catch(i){return log("saveDiskNavigationRootToStorage",i),!1}}async function selectDiskFolder(){let{folder:e,files:i}=await disk.openFolder();return e!==null&&e!="null"?e:null}async function getDiskFiles(e){let i=await disk.ilistFiles(e);return i=i.map(r=>({fileName:r.path,type:r.type})),i=i.sort(sortFilesAlphabetically),i}function sortFilesAlphabetically(e,i){return e.fileName.localeCompare(i.fileName)}function generateHash(){return`${Date.now()}_${parseInt(Math.random()*1024)}`}async function getBoardNavigationPath(){let e=await serialBridge.execFile(await getHelperFullPath());e=await serialBridge.run("iget_root()");let i="";try{e=e.substring(e.indexOf("OK")+2,e.indexOf("")),i=e}catch(r){log("error",e)}return i}async function getBoardFiles(e){await serialBridge.getPrompt();let i=await serialBridge.ilistFiles(e);return i=i.map(r=>({fileName:r[0],type:r[1]===16384?"folder":"file"})),i=i.sort(sortFilesAlphabetically),i}function checkDiskFile({root:e,parentFolder:i,fileName:r}){return e==null||i==null||r==null?!1:disk.fileExists(disk.getFullPath(e,i,r))}async function checkBoardFile({root:e,parentFolder:i,fileName:r}){return e==null||i==null||r==null?!1:(await serialBridge.getPrompt(),serialBridge.fileExists(serialBridge.getFullPath(e,i,r)))}async function checkOverwrite({fileNames:e=[],parentPath:i,source:r}){let l=[];return r==="board"?l=await getBoardFiles(i):l=await getDiskFiles(i),l.filter(c=>e.indexOf(c.fileName)!==-1)}function generateFileName(e=[]){const i=new Set(e);if(!i.has("untitled.py"))return"untitled.py";for(let r=2;r<1e4;r++){const l=`untitled_${r}.py`;if(!i.has(l))return l}return`untitled_${Date.now()}.py`}function canSave({view:e,isConnected:i,openFiles:r,editingFile:l}){const c=e==="editor",f=r.find(g=>g.id===l);return!f.hasChanges||!c?!1:f.source==="disk"?!0:i}function canExecute({view:e,isConnected:i}){return e==="editor"&&i}function canDownload({isConnected:e,selectedFiles:i}){const r=i.filter(l=>l.source==="disk");return e&&i.length>0&&r.length===0}function canUpload({isConnected:e,selectedFiles:i}){const r=i.filter(l=>l.source==="board");return e&&i.length>0&&r.length===0}function canEdit({selectedFiles:e}){return e.filter(r=>r.type=="file").length!=0}async function removeBoardFolder(e){let i=await serialBridge.execFile(await getHelperFullPath());await serialBridge.run(`delete_folder('${e}')`)}async function uploadFolder(e,i,r){r=r||function(){},await serialBridge.createFolder(i);let l=await disk.ilistAllFiles(e);for(let c in l){const f=l[c],g=f.path.substring(e.length);f.type==="folder"?await serialBridge.createFolder(serialBridge.getFullPath(i,g,"")):await serialBridge.uploadFile(disk.getFullPath(e,g,""),serialBridge.getFullPath(i,g,""),s=>{r(s,g)})}}async function downloadFolder(e,i,r){r=r||function(){},await disk.createFolder(i);let l=await serialBridge.execFile(await getHelperFullPath());l=await serialBridge.run(`ilist_all('${e}')`);let c=[];try{l=l.substring(l.indexOf("OK")+2,l.indexOf("")),c=JSON.parse(l)}catch(f){log("error",l)}for(let f in c){const g=c[f],s=g.path.substring(e.length);g.type=="folder"?await disk.createFolder(disk.getFullPath(i,s,"")):await serialBridge.downloadFile(serialBridge.getFullPath(e,s,""),serialBridge.getFullPath(i,s,""))}}async function getHelperFullPath(){const e=await disk.getAppPath();return await win.isPackaged()?disk.getFullPath(e,"..","ui/helpers.py"):disk.getFullPath(e,"ui/helpers.py","")}const PANEL_CLOSED=32,PANEL_TOO_SMALL=52,PANEL_DEFAULT=320;function App(e,i){return window.UnsupportedBrowser&&!window.UnsupportedBrowser.isSupported()?window.UnsupportedBrowser.render():html`
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
  `}window.addEventListener("load",()=>{let e=Choo();e.use(store),e.route("/admin",(i,r)=>AdminApp(i,r)),e.route("*",App),e.mount("#app"),e.emitter.on("DOMContentLoaded",()=>{e.state.diskNavigationRoot&&e.emitter.emit("refresh-files")})}),window.addEventListener("contextmenu",e=>{e.preventDefault()}),window.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{const e=document.getElementById("splash");e&&(e.classList.add("splash-hidden"),setTimeout(()=>e.remove(),400))},2e3)});
