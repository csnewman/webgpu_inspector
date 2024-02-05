!function(){const e='WEBGPU_INSPECTOR_LOADED',t='WEBGPU_RECORDER_LOADED',s=new class o{constructor(e,t,s){this.name=e,this.tabId=t??0,this.listeners=[],s&&this.listeners.push(s),this._port=null,this.reset()}reset(){const e=this;this._port=chrome.runtime.connect({name:this.name}),this._port.onDisconnect.addListener((()=>{e.reset()})),this._port.onMessage.addListener((t=>{for(const s of e.listeners)s(t)}))}addListener(e){this.listeners.push(e)}postMessage(e){this.tabId&&(e.tabId=this.tabId);try{this._port.postMessage(e)}catch(e){this.reset()}}}('webgpu-inspector-content',0,(s=>{let o=s.action;o&&('inspector_capture'==o&&(sessionStorage.setItem('WEBGPU_INSPECTOR_CAPTURE_FRAME','true'),i||(o='initialize_inspector')),'inspect_request_texture'==o&&window.postMessage(s,'*'),'initialize_inspector'==o&&(sessionStorage.setItem(e,'true'),setTimeout((()=>{window.location.reload()}),50)),'initialize_recorder'==o&&(sessionStorage.setItem(t,`${s.frames}%${s.filename}`),setTimeout((()=>{window.location.reload()}),50)))}));let i=!1;function n(e,t,s){const o=document.createElement('script');if(o.id=e,o.src=t,s)for(const e in s)o.setAttribute(e,s[e]);(document.head||document.documentElement).appendChild(o)}if(window.addEventListener('message',(e=>{if(e.source!==window)return;const t=e.data;if('object'==typeof t&&null!==t)try{s.postMessage(t)}catch(e){console.log('#### error:',e)}})),sessionStorage.getItem(e))n('__webgpu_inspector',chrome.runtime.getURL('webgpu_inspector.js')),sessionStorage.removeItem(e),i=!0;else if(sessionStorage.getItem(t)){const e=sessionStorage.getItem(t).split('%');n('__webgpu_recorder',chrome.runtime.getURL('webgpu_recorder.js'),{filename:e[1],frames:e[0],removeUnusedResources:1,messageRecording:1}),sessionStorage.removeItem(t)}s.postMessage({action:'PageLoaded'})}();
//# sourceMappingURL=content_script.js.map
