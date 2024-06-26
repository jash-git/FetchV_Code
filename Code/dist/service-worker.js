importScripts("./js/options.js");let e=!1,t=null,r=1;const n=[],o=[],i=[],s={},a={};let c=!1;const l=(()=>{let e=/Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];return!(e&&(e=e.split(".")[0],!isNaN(e)))||parseInt(e)<110})();try{chrome.action.setBadgeTextColor({color:"#FFFFFF"}),chrome.action.setBadgeBackgroundColor({color:"#FF0000"})}catch(e){}const u=()=>new Promise((e=>{chrome.tabs.query({}).then((async t=>{for(const e of t){const t=`storage${e.id}`;await new Promise((e=>{chrome.storage.local.get(t,(r=>{Object.keys(r).length>0&&(s[t]=r[t]),e()}))}))}e()}))})),m=async e=>{if("getContexts"in chrome.runtime){const t=await chrome.runtime.getContexts({contextTypes:["OFFSCREEN_DOCUMENT"],documentUrls:[chrome.runtime.getURL(e)]});return Boolean(t.length)}{const t=await clients.matchAll();return await t.some((t=>t.url.endsWith(`/${e}`)))}},d=async()=>{if("offscreen"in chrome){const e="offscreen.html";if(c=await m(e),c)return;try{await chrome.offscreen.createDocument({url:e,reasons:[chrome.offscreen.Reason.BLOBS],justification:"Convert blob data to blob URL"}),c=!0}catch(e){c=!1}}else c=!1},f=async()=>{if("offscreen"in chrome){const e="offscreen.html";await m(e)&&chrome.offscreen.closeDocument((()=>{c=!1}))}},p=()=>{const e=e=>{e?.size?.min&&(e.size.min=1024*e.size.min,e.size.min<0&&(e.size.min=0)),e?.size?.max&&(e.size.max=1024*e.size.max,e.size.max<0&&(e.size.max=0))};return new Promise((t=>{try{chrome.storage.sync.get(["options"]).then((r=>{if(void 0!==r.options){const e=r.options;for(let t in OPTION)void 0!==e[t]&&(OPTION[t]=e[t])}e(OPTION),t()}))}catch(r){e(OPTION),t()}}))},h=(e,t)=>{let r=Object.keys(e).length;r=r>0?r.toString():"",chrome.action.setBadgeText({text:r,tabId:t})},g=e=>{chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds:[e]})},v=(e,t=null)=>{for(;;){let t=-1;for(let r in n)if(n[r].tabId===e){t=r;break}if(!(t>-1))break;n.splice(t,1)}if(t){const e=[];for(const r in a)a[r]===t&&e.push(r);if(e.length>0)for(const t of e)delete a[t],g(parseInt(t))}},b=e=>{const t=n.find((t=>t.tabId===e));if(t)return t.ruleId;let r=1;for(const e of n)e.ruleId===r&&r++;return n.push({tabId:e,ruleId:r}),r},O=e=>{for(;;){let t=-1;for(let r in i)if(i[r].tabId===e){t=r;break}if(!(t>-1))break;i.splice(t,1)}},T=(e,t)=>{i.find((e=>e.requestId===t))||i.push({tabId:e,requestId:t})},I=(e=0)=>{setTimeout((()=>{if(n.length>0){const e=n[0].tabId;chrome.tabs.sendMessage(e,{cmd:"CONNECT_WORKER",parameter:{}})}}),e)},x=(e,t,r,n)=>new Promise((o=>{if(r.length>0){const i=a[t];if(n&&i&&i===e)return void o(0);chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds:[t],addRules:[{id:t,priority:1,action:{type:"modifyHeaders",requestHeaders:r},condition:{urlFilter:e,resourceTypes:["xmlhttprequest"]}}]},(function(){n?a[t]=e:i&&delete a[t],o(t)}))}else o(0)}));chrome.declarativeNetRequest.getDynamicRules((function(e){const t=[];for(let r of e)t.push(r.id);t.length>0&&chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds:t})})),chrome.runtime.onSuspend.addListener((()=>{chrome.storage.local.clear()})),chrome.runtime.onConnect.addListener((function(n){const o=n.name;if("POPUP"===o)return e=!0,void n.onDisconnect.addListener((function(){e=!1,g(r)}));if("TASK_TAB"===o){const e=n.sender.tab.id;if(t)return void n.disconnect();n._timer=setTimeout((()=>{n.disconnect(),t=null,I()}),25e4),n.onDisconnect.addListener((()=>{t=null,clearTimeout(n._timer),delete n._timer,I(1e3)})),t=e}})),chrome.runtime.onMessage.addListener((function(e,r,a){const{cmd:u,parameter:m}=e;if("FETCH_DATA"===u){let{url:e,headers:t,method:r,ruleId:n,inprivate:o,isMP4:i}=m;const s=[];t||(t={});for(const e in t)"range"!==e.toLowerCase()&&s.push({header:e,operation:"set",value:t[e]});return x(e,n,s,i).then((n=>{if(c&&!o)chrome.runtime.sendMessage({cmd:"OFFSCREEN_FETCH_DATA",parameter:{url:e,headers:t,method:r}},(e=>{n&&!i&&g(n),e||(e={ok:!1,statusText:"Fetch Error"}),a(e)}));else{let o=new AbortController,s=setTimeout((()=>{o.abort(),o=null}),2e4);const c={signal:o.signal,method:r,mode:"cors",credentials:"include",headers:t};fetch(e,c).then((e=>{if(e.ok)return e.arrayBuffer();a({ok:!1,statusText:`Fetch Error-${e.status}`})})).then((function(e){a({ok:!0,content:Array.from(new Uint8Array(e))})})).catch((function(e){"AbortError"===e.name?a({ok:!1,statusText:"Request Timeout"}):a({ok:!1,statusText:e.messsage})})).finally((()=>{n&&!i&&g(n),clearTimeout(s),s=null}))}})),!0}if("REC_ON_DATA"===u){const e=parseInt(m.recorderTabId);return n.find((t=>t.tabId===e))?(chrome.tabs.sendMessage(e,{cmd:u,parameter:m}),a(!0),!0):void a(!1)}if("OPEN_INITIATOR"===u){const{initiator:e}=m;return chrome.tabs.create({url:e,index:r.tab.index+1}),a(""),!0}if("BUILD_CONNECT"===u){const{requestId:e}=m,n=r.tab.id,o=b(n);e&&T(n,e);let i=!t;return l||(i=!1),d().then((()=>{a({allow:i,ruleId:o})})),!0}if("REMOVE_TASK_TAB"===u){const e=r.tab.id,t=m.url||null;v(e,t);const n=o.indexOf(e);return n>-1&&o.splice(n,1),a(),!0}if("CHECK_DOWNLOADING_REQUEST_EXIST"===u){for(let e in i){const t=i[e];if(t.requestId===m.requestId)return a({exist:!0,tabId:t.tabId}),!0}return a({exist:!1}),!0}if("REC_START"===u)return chrome.tabs.update(m.tab,{active:!0}),chrome.tabs.sendMessage(m.tab,{cmd:u,parameter:{tab:r.tab.id}}),a(),!0;if("REC_STOP"===u)return chrome.tabs.sendMessage(m.tab,{cmd:u,parameter:{}}),a(),!0;if("REC_STOP_FROM_TARGET"===u){const e=parseInt(m.recorderTabId);if(!n.find((t=>t.tabId===e)))return;return chrome.tabs.sendMessage(e,{cmd:"REC_STOP",parameter:{}}),a(),!0}if("GET_ICON"===u)return a(r.tab.favIconUrl),!0;if("RESET_OPTIONS"===u){const{storageKey:e}=m;return p().then((()=>{if(!e)return void a();const t=s[e],r=[];for(const e in t){const n=t[e],o=new URL(n.url).hostname;o&&OPTION.domain.includes(o)&&r.push(e)}if(r.length>0){for(const e of r)delete t[e];0===Object.keys(t).length?(delete s[e],chrome.storage.local.remove([e],(()=>{a()}))):chrome.storage.local.set({[e]:t},(()=>{a()}))}else a()})),!0}return"TAB_ACTIVE"===u?(chrome.tabs.update(r.tab.id,{active:!0},(()=>{a()})),!0):"OPEN_DOWNLOADS"===u?(chrome.tabs.create({url:"chrome://downloads/",index:r.tab.index+1}),!0):void a()})),chrome.tabs.onRemoved.addListener((function(e){v(e),O(e);const t=o.indexOf(e);t>-1&&o.splice(t,1);const r=`storage${e}`;chrome.storage.local.remove([r]),s[r]&&delete s[r]})),chrome.tabs.onUpdated.addListener((function(e,t,r){if("loading"===t.status&&t.url){const r=`storage${e}`;chrome.storage.local.remove([r],(()=>{h({},e)})),s[r]&&delete s[r],t.url.startsWith(OPTION.site)&&(t.url.includes("#google")?o.push(e):o.includes(e)||(O(e),v(e)))}})),async function(){await p(),await u();const t=(e,t)=>{e=e.toLowerCase();for(let r=0;r<t.length;r++)if(t[r].name.toLowerCase()===e)return t[r].value.toLowerCase();return null},r=(e,t)=>{let r={m3u8:"video/mp4",m3u:"video/mp4",mp4:"video/mp4","3gp":"video/3gpp",flv:"video/x-flv",mov:"video/quicktime",avi:"video/x-msvideo",wmv:"video/x-ms-wmv",webm:"video/webm",ogg:"video/ogg",ogv:"video/ogg",f4v:"video/x-f4v",acc:"application/vnd.americandynamics.acc",mkv:"video/x-matroska",rmvb:"application/vnd.rn-realmedia-vbr",m4s:"video/iso.segment",mp3:"audio/mpeg",wav:"audio/wav"};return r[e]?r[e]:t},n={},o=["youtube.com","globo.com"],i=["m3u8","m3u","mp4","3gp","flv","mov","avi","wmv","webm","f4v","acc","mkv","mp3","wav","ogg"],a=["range","content-length","content-type","accept-encoding","accept","accept-language"];chrome.webRequest.onBeforeSendHeaders.addListener((function(e){if(!e.initiator)return;if(0!==e.initiator.indexOf("http"))return;const t=e.requestHeaders;n[e.requestId]=t||{}}),{urls:["<all_urls>"],types:["media","xmlhttprequest","object","other"]},["requestHeaders","extraHeaders"]),chrome.webRequest.onResponseStarted.addListener((async function(c){let{requestId:l,initiator:u,url:m,tabId:d,responseHeaders:f,statusCode:p}=c,g={};if(n[l]&&(g=n[l],delete n[l]),0!==m.indexOf("http"))return;if(!u)return;if(0!==u.indexOf("http"))return;const v=new URL(u).hostname;for(const e of o)if(v.endsWith(e))return;if(0===u.indexOf(OPTION.site))return;if(-1===d){if(!await new Promise((e=>{chrome.tabs.query({active:!0,lastFocusedWindow:!0}).then((([t])=>{t&&t.url.includes(u)?(d=t.id,e(!0)):e(!1)}))})))return}if(f.length<1)return;if(p<200||p>300)return;const b=new URL(m).hostname;if(b){if((e=>{const t=["zg9wcglvy2ru","ywr0bmc=","amf2agrozwxsbw==","ywzjzg4=","c2fjzg5zc2vkz2u=","c3vycml0"],r=e.split(".");r.pop();const n=r.length;if(n>1){const e=r[n-1];if(t.indexOf(btoa(e).toLowerCase())>-1)return!0}return!1})(b))return;if(OPTION.domain.includes(b))return}let O=0,T=(e=>{let r=t("Content-Range",e);return r?(r=r.split(" "),2!==r.length?null:(r=r[1].split("/"),2!==r.length?null:(r[1]=parseInt(r[1]),r[1]?{chunk:r[0],total:r[1]}:null))):null})(f);O=T?T.total:(e=>{let r=t("Content-Length",e);return r?(r=parseInt(r),r<1?0:r):0})(f);let I=t("content-type",f);if(!I)return;let x=(e=>{const{responseHeaders:r,url:n}=e;let o=null,i=t("content-disposition",r);if(i){i=i.split(";");for(let e=0;e<i.length;e++)if(i[e].indexOf("filename=")>-1){if(i[e]=i[e].replace(/filename=/i,"").replace(/\"/g,"").replace(/\'/g,"").replace(/(^\s*)|(\s*$)/g,""),o=i[e],o)return o;break}}return i=n.replace(/http:\/\//i,"").replace(/https:\/\//i,""),i=i.split("?"),i=i[0].split("/"),i.length<2?null:(i=i[i.length-1],i||o)})(c);x||(x="no-filename");let w=((e,t)=>{if(e.includes("master.txt")&&0===t.indexOf("text/plain"))return"m3u8";let r=(e=>{let t=e.split(".");return t.length<2?null:t[t.length-1].toLowerCase()})(e);const n=["m3u8","m3u","mp4","webm","avi","ogg","flv","mkv","3gp","mp3"];let o={general:{"application/vnd.apple.mpegurl":["m3u8","m3u"],"application/x-mpegurl":["m3u8","m3u"],"application/vnd.americandynamics.acc":["acc"],"application/vnd.rn-realmedia-vbr":["rmvb"],"video/mp4":["mp4","m4s"],"video/3gpp":["3gp"],"video/3gpp2":["3gp2"],"video/x-flv":["flv"],"video/quicktime":["mov"],"video/x-msvideo":["avi"],"video/x-ms-wmv":["wmv"],"video/webm":["webm"],"video/ogg":["ogg","ogv"],"video/x-f4v":["f4v"],"video/x-matroska":["mkv"],"video/iso.segment":["m4s"],"audio/mpeg":["mp3"],"audio/wav":["wav"],"audio/ogg":["ogg"]},stream:{"application/octet-stream":n,"binary/octet-stream":n}};if(o.general[t]){if(!r)return o.general[t][0];let e=o.general[t].indexOf(r);return e<0?o.general[t][0]:o.general[t][e]}if(o.stream[t]){if(!r)return null;let e=o.stream[t].indexOf(r);return e<0?null:o.stream[t][e]}return n.includes(r)?r:null})(x,I);if(!w)return;if(i.indexOf(w)<0)return;let y=w;if("m3u8"!==w&&"m3u"!==w){if(!O)return;if(OPTION.size.min&&O<OPTION.size.min)return;if(OPTION.size.max&&O>OPTION.size.max)return}else y="hls";const R=`storage${d}`;let C=s[R];if(C||(C={},s[R]=C),Object.keys(C).length>30)return;if(((e,t)=>{for(let r in t)if(t[r].url===e)return!0;return!1})(m,C))return;const N={};for(const e in g){const t=g[e];a.includes(t.name.toLowerCase())||(N[t.name]=t.value)}const E="POST"===c.method?"POST":"GET";C[l]={storageKey:R,requestId:l,url:m,method:E,format:w,contentType:r(w,I),name:x,size:O,headers:N,type:y},chrome.storage.local.set({[R]:C}),e&&chrome.runtime.sendMessage({cmd:"POPUP_APPEND_ITEMS",parameter:{tab:d,item:{[l]:C[l]}}}),h(C,d)}),{urls:["<all_urls>"],types:["media","xmlhttprequest","object","other"]},["responseHeaders"])}();