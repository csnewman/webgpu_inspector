!function(e){class t{constructor(e){if(e=e||{},this.config={maxFrameCount:Math.max((e.frames??100)-1,1),exportName:e.export||'WebGPURecord',canvasWidth:e.width||800,canvasHeight:e.height||600,removeUnusedResources:!!e.removeUnusedResources,messageRecording:!!e.messageRecording},this._objectIndex=1,this._initalized=!1,this._initializeCommands=[],this._frameCommands=[],this._frameObjects=[],this._currentFrameCommands=null,this._currentFrameObjects=null,this._frameIndex=-1,this._isRecording=!1,this._frameVariables={},this._arrayCache=[],this._totalData=0,this._isRecording=!0,this._initalized=!0,this._initializeObjects=[],this._frameVariables[-1]=new Set,this._adapter=null,this._unusedTextures=new Set,this._unusedTextureViews=new Map,this._unusedBuffers=new Set,this._dataCacheObjects=[],!navigator.gpu)return;this._gpuWrapper=new o(this),this._gpuWrapper.onPromiseResolve=this._onAsyncResolve.bind(this),this._gpuWrapper.onPreCall=this._preMethodCall.bind(this),this._gpuWrapper.onPostCall=this._onMethodCall.bind(this),this._registerObject(navigator.gpu),this._recordLine(`${this._getObjectVariable(navigator.gpu)} = navigator.gpu;`,null),this._wrapCanvases();const t=this,r=document.createElement;document.createElement=e=>{const o=r.call(document,e);return'canvas'==e&&t._wrapCanvas(o),o};const s=window.requestAnimationFrame;window.requestAnimationFrame=e=>{s((function(){t._frameStart(),e(performance.now()),t._frameEnd()}))}}getNextId(){return this._objectIndex++}_frameStart(){this._frameIndex++,this._frameVariables[this._frameIndex]=new Set,this._currentFrameCommands=[],this._frameCommands.push(this._currentFrameCommands),this._currentFrameObjects=[],this._frameObjects.push(this._currentFrameObjects)}_frameEnd(){this._frameIndex==this.config.maxFrameCount&&this.generateOutput()}_removeUnusedCommands(e,t,r){for(let o=e.length-1;o>=0;--o){const s=e[o];s&&(r.has(s.__id)&&(t[o]=''))}}generateOutput(){const e=new Set;if(this._isRecording=!1,this.config.removeUnusedResources){for(const t of this._unusedTextures)e.add(t);for(const[t,r]of this._unusedTextureViews)e.add(t);for(const t of this._unusedBuffers)e.add(t);this._removeUnusedCommands(this._initializeObjects,this._initializeCommands,e)}if(this._initializeCommands=this._initializeCommands.filter((e=>''!=e)),this.config.removeUnusedResources)for(const t of e)for(let e=0,r=this._dataCacheObjects.length;e<r;++e){let r=this._dataCacheObjects[e];if(r){for(let e=r.length-1;e>=0;--e)r[e].__id==t&&r.splice(e,1);0==r.length&&(this._arrayCache[e].length=0,this._arrayCache[e].type='Uint8Array',this._arrayCache[e].array=new Uint8Array(0))}}let t=`\n    <!DOCTYPE html>\n    <html>\n        <body style="text-align: center;">\n            <canvas id="#webgpu" width=${this.config.canvasWidth} height=${this.config.canvasHeight}></canvas>\n            <script>\n    let D = new Array(${this._arrayCache.length});\n    async function main() {\n      await loadData();\n\n      let canvas = document.getElementById("#webgpu");\n      let frameLabel = document.createElement("div");\n      frameLabel.style = "position: absolute; top: 10px; left: 10px; font-size: 24pt; color: #f00;";\n      document.body.append(frameLabel);\n      ${this._getVariableDeclarations(-1)}\n      ${this._initializeCommands.join('\n  ')}\n`;for(let r=0,o=this._frameCommands.length;r<o;++r)this.config.removeUnusedResources&&(this._removeUnusedCommands(this._frameObjects[r],this._frameCommands[r],e),this._frameCommands[r]=this._frameCommands[r].filter((e=>''!=e))),t+=`\n      async function f${r}() {\n          ${this._getVariableDeclarations(r)}\n          ${this._frameCommands[r].join('\n  ')}\n      }\n`;t+='    let frames=[';for(let e=0,r=this._frameCommands.length;e<r;++e)t+=`f${e},`;t+='];',t+=`\n        let frame = 0;\n        let lastFrame = -1;\n        let t0 = performance.now();\n        async function renderFrame() {\n            if (frame > ${this._frameCommands.length-1}) return;\n            requestAnimationFrame(renderFrame);\n            if (frame == lastFrame) return;\n            lastFrame = frame;\n            let t1 = performance.now();\n            frameLabel.innerText = "F: " + (frame + 1) + "  T:" + (t1 - t0).toFixed(2);\n            t0 = t1;\n            try {\n                await frames[frame]();\n            } catch (err) {\n                console.log("Error Frame:", frame);\n                console.error(err);\n            }\n            frame++;\n        }\n        requestAnimationFrame(renderFrame);\n    }\n    \n    function setCanvasSize(canvas, width, height) {\n        if (canvas.width !== width || canvas.height !== height) {\n            canvas.width = width;\n            canvas.height = height;\n        }\n    }\n    \n    async function B64ToA(s, type, length) {\n        const res = await fetch(s);\n        const x = new Uint8Array(await res.arrayBuffer());\n        if (type == "Uint32Array")\n            return new Uint32Array(x.buffer, 0, x.length/4);\n        return new Uint8Array(x.buffer, 0, x.length);\n    }\n    \n    async function loadData() {\n`;let r=[];for(let e=0;e<this._arrayCache.length;++e){let o=this._arrayCache[e];r.push(new Promise((r=>{this._encodeDataUrl(o.array).then((s=>{t+=`D[${e}] = await B64ToA("${s}", "${o.type}", ${o.length});\n`,r()}))})))}Promise.all(r).then((()=>{t+='\n      }\n      main();\n              <\/script>\n          </body>\n      </html>\n',this._downloadFile(t,(this.config.exportName||'WebGpuRecord')+'.html')}))}async _encodeDataUrl(e,t='application/octet-stream'){const r=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);return await new Promise(((e,o)=>{const s=Object.assign(new FileReader,{onload:()=>e(s.result),onerror:()=>o(s.error)});s.readAsDataURL(new File([r],'',{type:t}))}))}_downloadFile(e,t){const r=document.createElement('a');if(r.href=URL.createObjectURL(new Blob([e],{type:'text/html'})),r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),this.config.messageRecording){const t=1048576;if(e.length<=t)window.postMessage({action:'webgpu_recording',data:e,index:0,count:1});else{let r=0;const o=e.length;let s=0,i=Math.ceil(o/t);for(;r<o;){const n=o-r,a=n>t?t:n,c=e.substr(r,a);window.postMessage({action:'webgpu_recording',data:c,index:s,count:i}),s++,r+=a}}}}_wrapCanvas(e){if(e.__id)return;this._registerObject(e);let t=this,r=e.getContext;e.getContext=(o,s)=>{let i=r.call(e,o,s);return'webgpu'==o&&i&&t._wrapContext(i),i}}_wrapCanvases(){const e=document.getElementsByTagName('canvas');for(let t=0;t<e.length;++t){const r=e[t];this._wrapCanvas(r)}}_registerObject(e){const t=this.getNextId(e);e.__id=t,e.__frame=this._frameIndex}_isFrameVariable(e,t){return this._frameVariables[e]&&this._frameVariables[e].has(t)}_removeVariable(e){for(const t in this._frameVariables){this._frameVariables[t].delete(e)}}_addVariable(e,t){this._frameVariables[e].add(t)}_getVariableDeclarations(e){const t=this._frameVariables[e];return t.size?`let ${[...t].join(',')};`:''}_getObjectVariable(e){void 0===e.__id&&this._registerObject(e);const t=`x${e.constructor.name.replace(/^GPU/,'')}${e.__id||0}`;return this._frameIndex!=e.__frame?this._isFrameVariable(-1,t)||(this._removeVariable(t),this._addVariable(-1,t)):this._addVariable(this._frameIndex,t),t}_wrapContext(e){this._recordLine(`${this._getObjectVariable(e)} = canvas.getContext("webgpu");`,null)}_getBytesFromImageSource(e){let t=document.createElement('canvas');t.width=e.width,t.height=e.height;let r=t.getContext('2d');return r.drawImage(e,0,0),r.getImageData(0,0,e.width,e.height).data}_onAsyncResolve(e,t,r,o,s){if('requestDevice'===t){const t=e;void 0===t.__id&&this._recordCommand(!0,navigator.gpu,'requestAdapter',t,[])}this._recordCommand(!0,e,t,s,r)}_preMethodCall(e,t,r){if('unmap'===t){if(e.__mappedRanges){for(const t of e.__mappedRanges){const e=this._getDataCache(t,0,t.byteLength,t);this._recordLine(`new Uint8Array(${this._getObjectVariable(t)}).set(D[${e}]);`,null)}delete e.__mappedRanges}}else'getCurrentTexture'===t&&this._recordLine(`setCanvasSize(${this._getObjectVariable(e)}.canvas, ${e.canvas.width}, ${e.canvas.height})`,null)}_onMethodCall(e,t,r,o){if('copyExternalImageToTexture'==t){const o=this._getBytesFromImageSource(r[0].source),s=4,i=r[0].source.width*s,n=r[1].texture,a=this._getDataCache(o,o.byteOffset,o.byteLength,n);this._recordLine(`${this._getObjectVariable(e)}.writeTexture(${this._stringifyObject(t,r[1])}, D[${a}], {bytesPerRow:${i}}, ${this._stringifyObject(t,r[2])});`,e)}else this._recordCommand(!1,e,t,o,r);'getMappedRange'==t?(e.__mappedRanges||(e.__mappedRanges=[]),e.__mappedRanges.push(o)):'submit'==t&&this._recordLine('',null)}_stringifyObject(e,t){let r='',o=!0;for(let s in t){let i=t[s];if(void 0!==i){if(o||(r+=','),o=!1,r+=`"${s}":`,'requestDevice'==e){if('requiredFeatures'==s){r+='requiredFeatures';continue}if('requiredLimits'==s){r+='requiredLimits';continue}}if('createBindGroup'==e){if('resource'==s&&this._unusedTextureViews.has(i.__id)){const e=this._unusedTextureViews.get(i.__id);this._unusedTextures.delete(e)}}else if('beginRenderPass'==e&&'colorAttachments'==s)for(const e of i)if(e.view){const t=e.view;if(this._unusedTextureViews.has(t.__id)){const e=this._unusedTextureViews.get(t.__id);this._unusedTextures.delete(e),this._unusedTextureViews.delete(t.__id)}}null===i?r+='null':'string'==typeof i?r+=`\`${i}\``:void 0!==i.__id?r+=this._getObjectVariable(i):void 0!==i.__data?r+=`D[${i.__data}]`:i.constructor==Array?r+=this._stringifyArray(i):r+='object'==typeof i?this._stringifyObject(e,i):`${i}`}}return r=`{${r}}`,r}_stringifyArray(e){let t='[';return t+=this._stringifyArgs('',e),t+=']',t}_getDataCache(e,t,r,o){let s=this;function i(e){return e.BYTES_PER_ELEMENT?31-Math.clz32(e.BYTES_PER_ELEMENT):0}function n(e,t){const r=s._arrayCache[e].array;if(r.length!=t.length)return!1;for(let e=0,o=r.length;e<o;++e)if(r[e]!=t[e])return!1;return!0}const a=(e.byteOffset??0)+((t??0)<<i(e)),c=void 0===r?e.byteLength:r<<i(e);this._totalData+=c;const d=new Uint8Array(e.buffer??e,a,c);let h=-1;for(let e=0;e<s._arrayCache.length;++e){if(s._arrayCache[e].length==r&&n(e,d)){h=e;break}}if(-1==h){h=s._arrayCache.length;const t=Uint8Array.from(d);s._arrayCache.push({length:c,type:'ArrayBuffer'===e.constructor?Uint8Array:e.constructor.name,array:t})}return o&&(this._dataCacheObjects[h]||(this._dataCacheObjects[h]=[]),this._dataCacheObjects[h].push(o)),h}_stringifyArgs(e,r){if(0==r.length||1==r.length&&void 0===r[0])return'';if(r=[...r],'writeBuffer'==e){const e=r[2],t=r[3],o=r[4],s=this._getDataCache(e,t,o,e);r[2]={__data:s},r[3]=0}else if('writeTexture'==e){const e=r[0].texture,o=r[1],s=r[2].bytesPerRow,i=r[3].width||r[3][0],{blockWidth:n,blockHeight:a,bytesPerBlock:c}=t._formatInfo[e.format],d=i/n,h=(r[2].rowsPerImage||(r[3].height||r[3][1]||1)/a)*(r[3].depthOrArrayLayers||r[3][2]||1),p=h>0?s*(h-1)+d*c:0,u=r[2].offset,l=this._getDataCache(new Uint8Array(o.buffer||o,o.byteOffset,o.byteLength),u,p,e);r[1]={__data:l},r[2].offset=0}else if('setBindGroup'==e){if(5==r.length){const e=r[2],t=r[3],o=r[4],s=this._getDataCache(e,t,o,e);r[2]={__data:s},r.length=3}else if(3==r.length){const e=r[2],t=this._getDataCache(e,0,e.length,e);r[2]={__data:t},r.length=3}}else if('createBindGroup'==e){if(r[0].entries){const e=r[0].entries;for(const t of e){const e=t.resource;if(e&&e.__id){if(this._unusedTextureViews.has(e.__id)){const t=this._unusedTextureViews.get(e.__id);this._unusedTextures.delete(t)}}else if(e&&e.buffer){const t=e.buffer;this._unusedBuffers.has(t.__id)&&this._unusedBuffers.delete(t.__id)}}}}else if('copyBufferToBuffer'==e)this._unusedBuffers.has(r[0].__id)&&this._unusedBuffers.delete(r[0].__id),this._unusedBuffers.has(r[2].__id)&&this._unusedBuffers.delete(r[2].__id);else if('setVertexBuffer'==e){const e=r[1];this._unusedBuffers.has(e.__id)&&this._unusedBuffers.delete(e.__id)}else if('setIndexBuffer'==e){const e=r[0];this._unusedBuffers.has(e.__id)&&this._unusedBuffers.delete(e.__id)}else if('beginRenderPass'==e){if(r[0].colorAttachments){const e=r[0].colorAttachments;for(const t of e)if(t.view){const e=t.view;if(this._unusedTextureViews.has(e.__id)){const t=this._unusedTextureViews.get(e.__id);this._unusedTextures.delete(t),this._unusedTextureViews.delete(e.__id)}}}if(r[0].depthStencilAttachment){const e=r[0].depthStencilAttachment;if(e.view){const t=e.view;if(this._unusedTextureViews.has(t.__id)){const e=this._unusedTextureViews.get(t.__id);this._unusedTextures.delete(e),this._unusedTextureViews.delete(t.__id)}}}}const o=[];for(let t of r)void 0===t?o.push('undefined'):null===t?o.push('null'):void 0!==t.__data?o.push(`D[${t.__data}]`):t.__id?o.push(this._getObjectVariable(t)):t.constructor===Array?o.push(this._stringifyArray(t)):'object'==typeof t?o.push(this._stringifyObject(e,t)):'string'==typeof t?o.push(`\`${t}\``):o.push(t);return o.join()}_recordLine(e,t){this._isRecording&&(-1==this._frameIndex?(this._initializeCommands.push(e),this._initializeObjects.push(t)):(this._currentFrameCommands.push(e),this._currentFrameObjects.push(t)))}_recordCommand(e,t,r,o,s){if(this._isRecording){if(o){if('string'==typeof o)return;this._registerObject(o)}e=e?'await ':'';let i=t;const n=!!this._adapter;if(n||'requestAdapter'!=r?'createTexture'==r?(this._unusedTextures.add(o.__id),i=o):'createView'==r?this._unusedTextureViews.set(o.__id,t.__id):'writeTexture'==r?i=s[0].texture:'createBuffer'==r?(this._unusedBuffers.add(o.__id),i=o):'writeBuffer'==r&&(i=s[0]):this._adapter=o,'beginRenderPass'!=r&&'beginComputePass'!=r||this._recordLine('\n',null),o?this._recordLine(`${this._getObjectVariable(o)} = ${e}${this._getObjectVariable(t)}.${r}(${this._stringifyArgs(r,s)});`,i):this._recordLine(`${e}${this._getObjectVariable(t)}.${r}(${this._stringifyArgs(r,s)});`,i),'end'==r&&this._recordLine('\n',null),!n&&'requestAdapter'==r){const e=this._getObjectVariable(o);this._recordLine(`const requiredFeatures = [];\n          for (const x of ${e}.features) {\n              requiredFeatures.push(x);\n          }`,i),this._recordLine(`const requiredLimits = {};\n          const exclude = new Set(["minSubgroupSize", "maxSubgroupSize"]);\n          for (const x in ${e}.limits) {\n            if (!exclude.has(x)) {\n              requiredLimits[x] = ${e}.limits[x];\n            }\n          }`,i)}if(o instanceof GPUDevice){const e=o.queue;void 0===e.__id&&this._recordLine(`${this._getObjectVariable(e)} = ${this._getObjectVariable(o)}.queue;`,o)}}}}t._asyncMethods=new Set(['requestAdapter','requestDevice','createComputePipelineAsync','createRenderPipelineAsync','mapAsync']),t._skipMethods=new Set(['toString','entries','getContext','forEach','has','keys','values','getPreferredFormat','requestAdapterInfo','pushErrorScope','popErrorScope']),t._formatInfo={r8unorm:{blockWidth:1,blockHeight:1,bytesPerBlock:1},r8snorm:{blockWidth:1,blockHeight:1,bytesPerBlock:1},r8uint:{blockWidth:1,blockHeight:1,bytesPerBlock:1},r8sint:{blockWidth:1,blockHeight:1,bytesPerBlock:1},rg8unorm:{blockWidth:1,blockHeight:1,bytesPerBlock:2},rg8snorm:{blockWidth:1,blockHeight:1,bytesPerBlock:2},rg8uint:{blockWidth:1,blockHeight:1,bytesPerBlock:2},rg8sint:{blockWidth:1,blockHeight:1,bytesPerBlock:2},rgba8unorm:{blockWidth:1,blockHeight:1,bytesPerBlock:4},'rgba8unorm-srgb':{blockWidth:1,blockHeight:1,bytesPerBlock:4},rgba8snorm:{blockWidth:1,blockHeight:1,bytesPerBlock:4},rgba8uint:{blockWidth:1,blockHeight:1,bytesPerBlock:4},rgba8sint:{blockWidth:1,blockHeight:1,bytesPerBlock:4},bgra8unorm:{blockWidth:1,blockHeight:1,bytesPerBlock:4},'bgra8unorm-srgb':{blockWidth:1,blockHeight:1,bytesPerBlock:4},r16uint:{blockWidth:1,blockHeight:1,bytesPerBlock:2},r16sint:{blockWidth:1,blockHeight:1,bytesPerBlock:2},r16float:{blockWidth:1,blockHeight:1,bytesPerBlock:2},rg16uint:{blockWidth:1,blockHeight:1,bytesPerBlock:4},rg16sint:{blockWidth:1,blockHeight:1,bytesPerBlock:4},rg16float:{blockWidth:1,blockHeight:1,bytesPerBlock:4},rgba16uint:{blockWidth:1,blockHeight:1,bytesPerBlock:8},rgba16sint:{blockWidth:1,blockHeight:1,bytesPerBlock:8},rgba16float:{blockWidth:1,blockHeight:1,bytesPerBlock:8},r32uint:{blockWidth:1,blockHeight:1,bytesPerBlock:4},r32sint:{blockWidth:1,blockHeight:1,bytesPerBlock:4},r32float:{blockWidth:1,blockHeight:1,bytesPerBlock:4},rg32uint:{blockWidth:1,blockHeight:1,bytesPerBlock:8},rg32sint:{blockWidth:1,blockHeight:1,bytesPerBlock:8},rg32float:{blockWidth:1,blockHeight:1,bytesPerBlock:8},rgba32uint:{blockWidth:1,blockHeight:1,bytesPerBlock:16},rgba32sint:{blockWidth:1,blockHeight:1,bytesPerBlock:16},rgba32float:{blockWidth:1,blockHeight:1,bytesPerBlock:16},rgb10a2unorm:{blockWidth:1,blockHeight:1,bytesPerBlock:4},rg11b10ufloat:{blockWidth:1,blockHeight:1,bytesPerBlock:4},rgb9e5ufloat:{blockWidth:1,blockHeight:1,bytesPerBlock:4},stencil8:{blockWidth:1,blockHeight:1,bytesPerBlock:1},depth16unorm:{blockWidth:1,blockHeight:1,bytesPerBlock:2},depth32float:{blockWidth:1,blockHeight:1,bytesPerBlock:4},depth24plus:{blockWidth:1,blockHeight:1},'depth24plus-stencil8':{blockWidth:1,blockHeight:1},'depth32float-stencil8':{blockWidth:1,blockHeight:1},'bc1-rgba-unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:8},'bc1-rgba-unorm-srgb':{blockWidth:4,blockHeight:4,bytesPerBlock:8},'bc2-rgba-unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'bc2-rgba-unorm-srgb':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'bc3-rgba-unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'bc3-rgba-unorm-srgb':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'bc4-r-unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:8},'bc4-r-snorm':{blockWidth:4,blockHeight:4,bytesPerBlock:8},'bc5-rg-unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'bc5-rg-snorm':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'bc6h-rgb-ufloat':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'bc6h-rgb-float':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'bc7-rgba-unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'bc7-rgba-unorm-srgb':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'etc2-rgb8unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:8},'etc2-rgb8unorm-srgb':{blockWidth:4,blockHeight:4,bytesPerBlock:8},'etc2-rgb8a1unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:8},'etc2-rgb8a1unorm-srgb':{blockWidth:4,blockHeight:4,bytesPerBlock:8},'etc2-rgba8unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'etc2-rgba8unorm-srgb':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'eac-r11unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:8},'eac-r11snorm':{blockWidth:4,blockHeight:4,bytesPerBlock:8},'eac-rg11unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'eac-rg11snorm':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'astc-4x4-unorm':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'astc-4x4-unorm-srgb':{blockWidth:4,blockHeight:4,bytesPerBlock:16},'astc-5x4-unorm':{blockWidth:5,blockHeight:4,bytesPerBlock:16},'astc-5x4-unorm-srgb':{blockWidth:5,blockHeight:4,bytesPerBlock:16},'astc-5x5-unorm':{blockWidth:5,blockHeight:5,bytesPerBlock:16},'astc-5x5-unorm-srgb':{blockWidth:5,blockHeight:5,bytesPerBlock:16},'astc-6x5-unorm':{blockWidth:6,blockHeight:5,bytesPerBlock:16},'astc-6x5-unorm-srgb':{blockWidth:6,blockHeight:5,bytesPerBlock:16},'astc-6x6-unorm':{blockWidth:6,blockHeight:6,bytesPerBlock:16},'astc-6x6-unorm-srgb':{blockWidth:6,blockHeight:6,bytesPerBlock:16},'astc-8x5-unorm':{blockWidth:8,blockHeight:5,bytesPerBlock:16},'astc-8x5-unorm-srgb':{blockWidth:8,blockHeight:5,bytesPerBlock:16},'astc-8x6-unorm':{blockWidth:8,blockHeight:6,bytesPerBlock:16},'astc-8x6-unorm-srgb':{blockWidth:8,blockHeight:6,bytesPerBlock:16},'astc-8x8-unorm':{blockWidth:8,blockHeight:8,bytesPerBlock:16},'astc-8x8-unorm-srgb':{blockWidth:8,blockHeight:8,bytesPerBlock:16},'astc-10x5-unorm':{blockWidth:10,blockHeight:5,bytesPerBlock:16},'astc-10x5-unorm-srgb':{blockWidth:10,blockHeight:5,bytesPerBlock:16},'astc-10x6-unorm':{blockWidth:10,blockHeight:6,bytesPerBlock:16},'astc-10x6-unorm-srgb':{blockWidth:10,blockHeight:6,bytesPerBlock:16},'astc-10x8-unorm':{blockWidth:10,blockHeight:8,bytesPerBlock:16},'astc-10x8-unorm-srgb':{blockWidth:10,blockHeight:8,bytesPerBlock:16},'astc-10x10-unorm':{blockWidth:10,blockHeight:10,bytesPerBlock:16},'astc-10x10-unorm-srgb':{blockWidth:10,blockHeight:10,bytesPerBlock:16},'astc-12x10-unorm':{blockWidth:12,blockHeight:10,bytesPerBlock:16},'astc-12x10-unorm-srgb':{blockWidth:12,blockHeight:10,bytesPerBlock:16},'astc-12x12-unorm':{blockWidth:12,blockHeight:12,bytesPerBlock:16},'astc-12x12-unorm-srgb':{blockWidth:12,blockHeight:12,bytesPerBlock:16}};const r=new Set([GPUAdapter,GPUDevice,GPUBuffer,GPUTexture,GPUTextureView,GPUExternalTexture,GPUSampler,GPUBindGroupLayout,GPUBindGroup,GPUPipelineLayout,GPUShaderModule,GPUComputePipeline,GPURenderPipeline,GPUCommandBuffer,GPUCommandEncoder,GPUComputePassEncoder,GPURenderPassEncoder,GPURenderBundle,GPUQueue,GPUQuerySet,GPUCanvasContext]);class o{constructor(e){this._idGenerator=e,this.onPreCall=null,this.onPostCall=null,this.onPromise=null,this.onPromiseResolve=null,this._wrapGPUTypes()}_wrapGPUTypes(){GPU.prototype.requestAdapter=this._wrapMethod('requestAdapter',GPU.prototype.requestAdapter),GPU.prototype.getPreferredFormat=this._wrapMethod('getPreferredFormat',GPU.prototype.getPreferredFormat),GPUAdapter.prototype.requestDevice=this._wrapMethod('requestDevice',GPUAdapter.prototype.requestDevice),GPUDevice.prototype.destroy=this._wrapMethod('destroy',GPUDevice.prototype.destroy),GPUDevice.prototype.createBuffer=this._wrapMethod('createBuffer',GPUDevice.prototype.createBuffer),GPUDevice.prototype.createTexture=this._wrapMethod('createTexture',GPUDevice.prototype.createTexture),GPUDevice.prototype.createSampler=this._wrapMethod('createSampler',GPUDevice.prototype.createSampler),GPUDevice.prototype.importExternalTexture=this._wrapMethod('importExternalTexture',GPUDevice.prototype.importExternalTexture),GPUDevice.prototype.createBindGroupLayout=this._wrapMethod('createBindGroupLayout',GPUDevice.prototype.createBindGroupLayout),GPUDevice.prototype.createPipelineLayout=this._wrapMethod('createPipelineLayout',GPUDevice.prototype.createPipelineLayout),GPUDevice.prototype.createBindGroup=this._wrapMethod('createBindGroup',GPUDevice.prototype.createBindGroup),GPUDevice.prototype.createShaderModule=this._wrapMethod('createShaderModule',GPUDevice.prototype.createShaderModule),GPUDevice.prototype.createComputePipeline=this._wrapMethod('createComputePipeline',GPUDevice.prototype.createComputePipeline),GPUDevice.prototype.createRenderPipeline=this._wrapMethod('createRenderPipeline',GPUDevice.prototype.createRenderPipeline),GPUDevice.prototype.createComputePipelineAsync=this._wrapMethod('createComputePipelineAsync',GPUDevice.prototype.createComputePipelineAsync),GPUDevice.prototype.createRenderPipelineAsync=this._wrapMethod('createRenderPipelineAsync',GPUDevice.prototype.createRenderPipelineAsync),GPUDevice.prototype.createCommandEncoder=this._wrapMethod('createCommandEncoder',GPUDevice.prototype.createCommandEncoder),GPUDevice.prototype.createRenderBundleEncoder=this._wrapMethod('createRenderBundleEncoder',GPUDevice.prototype.createRenderBundleEncoder),GPUDevice.prototype.createQuerySet=this._wrapMethod('createQuerySet',GPUDevice.prototype.createQuerySet),GPUBuffer.prototype.mapAsync=this._wrapMethod('mapAsync',GPUBuffer.prototype.mapAsync),GPUBuffer.prototype.getMappedRange=this._wrapMethod('getMappedRange',GPUBuffer.prototype.getMappedRange),GPUBuffer.prototype.unmap=this._wrapMethod('unmap',GPUBuffer.prototype.unmap),GPUBuffer.prototype.destroy=this._wrapMethod('destroy',GPUBuffer.prototype.destroy),GPUTexture.prototype.createView=this._wrapMethod('createView',GPUTexture.prototype.createView),GPUTexture.prototype.destroy=this._wrapMethod('destroy',GPUTexture.prototype.destroy),GPUShaderModule.prototype.getCompilationInfo=this._wrapMethod('getCompilationInfo',GPUShaderModule.prototype.getCompilationInfo),GPUComputePipeline.prototype.getBindGroupLayout=this._wrapMethod('getBindGroupLayout',GPUComputePipeline.prototype.getBindGroupLayout),GPURenderPipeline.prototype.getBindGroupLayout=this._wrapMethod('getBindGroupLayout',GPURenderPipeline.prototype.getBindGroupLayout),GPUCommandEncoder.prototype.beginRenderPass=this._wrapMethod('beginRenderPass',GPUCommandEncoder.prototype.beginRenderPass),GPUCommandEncoder.prototype.beginComputePass=this._wrapMethod('beginComputePass',GPUCommandEncoder.prototype.beginComputePass),GPUCommandEncoder.prototype.copyBufferToBuffer=this._wrapMethod('copyBufferToBuffer',GPUCommandEncoder.prototype.copyBufferToBuffer),GPUCommandEncoder.prototype.copyBufferToTexture=this._wrapMethod('copyBufferToTexture',GPUCommandEncoder.prototype.copyBufferToTexture),GPUCommandEncoder.prototype.copyTextureToBuffer=this._wrapMethod('copyTextureToBuffer',GPUCommandEncoder.prototype.copyTextureToBuffer),GPUCommandEncoder.prototype.copyTextureToTexture=this._wrapMethod('copyTextureToTexture',GPUCommandEncoder.prototype.copyTextureToTexture),GPUCommandEncoder.prototype.clearBuffer=this._wrapMethod('clearBuffer',GPUCommandEncoder.prototype.clearBuffer),GPUCommandEncoder.prototype.resolveQuerySet=this._wrapMethod('resolveQuerySet',GPUCommandEncoder.prototype.resolveQuerySet),GPUCommandEncoder.prototype.finish=this._wrapMethod('finish',GPUCommandEncoder.prototype.finish),GPUCommandEncoder.prototype.pushDebugGroup=this._wrapMethod('pushDebugGroup',GPUCommandEncoder.prototype.pushDebugGroup),GPUCommandEncoder.prototype.popDebugGroup=this._wrapMethod('popDebugGroup',GPUCommandEncoder.prototype.popDebugGroup),GPUCommandEncoder.prototype.insertDebugMarker=this._wrapMethod('insertDebugMarker',GPUCommandEncoder.prototype.insertDebugMarker),GPUComputePassEncoder.prototype.setPipeline=this._wrapMethod('setPipeline',GPUComputePassEncoder.prototype.setPipeline),GPUComputePassEncoder.prototype.dispatchWorkgroups=this._wrapMethod('dispatchWorkgroups',GPUComputePassEncoder.prototype.dispatchWorkgroups),GPUComputePassEncoder.prototype.dispatchWorkgroupsIndirect=this._wrapMethod('dispatchWorkgroupsIndirect',GPUComputePassEncoder.prototype.dispatchWorkgroupsIndirect),GPUComputePassEncoder.prototype.end=this._wrapMethod('end',GPUComputePassEncoder.prototype.end),GPUComputePassEncoder.prototype.setBindGroup=this._wrapMethod('setBindGroup',GPUComputePassEncoder.prototype.setBindGroup),GPUComputePassEncoder.prototype.setBindGroup=this._wrapMethod('setBindGroup',GPUComputePassEncoder.prototype.setBindGroup),GPUComputePassEncoder.prototype.pushDebugGroup=this._wrapMethod('pushDebugGroup',GPUComputePassEncoder.prototype.pushDebugGroup),GPUComputePassEncoder.prototype.popDebugGroup=this._wrapMethod('popDebugGroup',GPUComputePassEncoder.prototype.popDebugGroup),GPUComputePassEncoder.prototype.insertDebugMarker=this._wrapMethod('insertDebugMarker',GPUComputePassEncoder.prototype.insertDebugMarker),GPURenderPassEncoder.prototype.setViewport=this._wrapMethod('setViewport',GPURenderPassEncoder.prototype.setViewport),GPURenderPassEncoder.prototype.setScissorRect=this._wrapMethod('setScissorRect',GPURenderPassEncoder.prototype.setScissorRect),GPURenderPassEncoder.prototype.setBlendConstant=this._wrapMethod('setBlendConstant',GPURenderPassEncoder.prototype.setBlendConstant),GPURenderPassEncoder.prototype.setStencilReference=this._wrapMethod('setStencilReference',GPURenderPassEncoder.prototype.setStencilReference),GPURenderPassEncoder.prototype.beginOcclusionQuery=this._wrapMethod('beginOcclusionQuery',GPURenderPassEncoder.prototype.beginOcclusionQuery),GPURenderPassEncoder.prototype.endOcclusionQuery=this._wrapMethod('endOcclusionQuery',GPURenderPassEncoder.prototype.endOcclusionQuery),GPURenderPassEncoder.prototype.executeBundles=this._wrapMethod('executeBundles',GPURenderPassEncoder.prototype.executeBundles),GPURenderPassEncoder.prototype.end=this._wrapMethod('end',GPURenderPassEncoder.prototype.end),GPURenderPassEncoder.prototype.setPipeline=this._wrapMethod('setPipeline',GPURenderPassEncoder.prototype.setPipeline),GPURenderPassEncoder.prototype.setIndexBuffer=this._wrapMethod('setIndexBuffer',GPURenderPassEncoder.prototype.setIndexBuffer),GPURenderPassEncoder.prototype.setVertexBuffer=this._wrapMethod('setVertexBuffer',GPURenderPassEncoder.prototype.setVertexBuffer),GPURenderPassEncoder.prototype.draw=this._wrapMethod('draw',GPURenderPassEncoder.prototype.draw),GPURenderPassEncoder.prototype.drawIndexed=this._wrapMethod('drawIndexed',GPURenderPassEncoder.prototype.drawIndexed),GPURenderPassEncoder.prototype.drawIndirect=this._wrapMethod('drawIndirect',GPURenderPassEncoder.prototype.drawIndirect),GPURenderPassEncoder.prototype.drawIndexedIndirect=this._wrapMethod('drawIndexedIndirect',GPURenderPassEncoder.prototype.drawIndexedIndirect),GPURenderPassEncoder.prototype.setBindGroup=this._wrapMethod('setBindGroup',GPURenderPassEncoder.prototype.setBindGroup),GPURenderPassEncoder.prototype.pushDebugGroup=this._wrapMethod('pushDebugGroup',GPURenderPassEncoder.prototype.pushDebugGroup),GPURenderPassEncoder.prototype.popDebugGroup=this._wrapMethod('popDebugGroup',GPURenderPassEncoder.prototype.popDebugGroup),GPURenderPassEncoder.prototype.insertDebugMarker=this._wrapMethod('insertDebugMarker',GPURenderPassEncoder.prototype.insertDebugMarker),GPUQueue.prototype.submit=this._wrapMethod('submit',GPUQueue.prototype.submit),GPUQueue.prototype.writeBuffer=this._wrapMethod('writeBuffer',GPUQueue.prototype.writeBuffer),GPUQueue.prototype.writeTexture=this._wrapMethod('writeTexture',GPUQueue.prototype.writeTexture),GPUQueue.prototype.copyExternalImageToTexture=this._wrapMethod('copyExternalImageToTexture',GPUQueue.prototype.copyExternalImageToTexture),GPUQuerySet.prototype.destroy=this._wrapMethod('destroy',GPUQuerySet.prototype.destroy),GPUCanvasContext.prototype.configure=this._wrapMethod('configure',GPUCanvasContext.prototype.configure),GPUCanvasContext.prototype.unconfigure=this._wrapMethod('unconfigure',GPUCanvasContext.prototype.unconfigure),GPUCanvasContext.prototype.getCurrentTexture=this._wrapMethod('getCurrentTexture',GPUCanvasContext.prototype.getCurrentTexture)}_wrapMethod(e,t){const r=this;return function(){const o=this,s=[...arguments];r.onPreCall&&r.onPreCall(o,e,s);const i=t.call(o,...s);if(i instanceof Promise){const t=r._idGenerator.getNextId(o);r.onPromise&&r.onPromise(o,e,s,t);const n=i,a=new Promise((i=>{n.then((n=>{r.onPromiseResolve&&r.onPromiseResolve(o,e,s,t,n),i(n)}))}));return a}return r.onPostCall&&r.onPostCall(o,e,s,i),i}}}(function(){const e=document.getElementById('__webgpu_recorder');if(e){const r=e.getAttribute('filename'),o=e.getAttribute('frames'),s=e.getAttribute('messageRecording'),i=e.getAttribute('removeUnusedResources');r&&new t({frames:o||1,export:r,removeUnusedResources:!!i,messageRecording:!!s})}})(),e.GPUObjectTypes=r,e.GPUObjectWrapper=o,Object.defineProperty(e,'__esModule',{value:!0})}({});
//# sourceMappingURL=webgpu_recorder.js.map
