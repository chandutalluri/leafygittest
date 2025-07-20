"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2397],{743:(t,e,r)=>{r.d(e,{A:()=>i});var s=r(4);let i=s.forwardRef(function(t,e){let{title:r,titleId:i,...a}=t;return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:e,"aria-labelledby":i},a),r?s.createElement("title",{id:i},r):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"}))})},3228:(t,e,r)=>{r.d(e,{Ay:()=>N,oR:()=>O});var s,i=r(4);let a={data:""},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,l=(t,e)=>{let r="",s="",i="";for(let a in t){let n=t[a];"@"==a[0]?"i"==a[1]?r=a+" "+n+";":s+="f"==a[1]?l(n,a):a+"{"+l(n,"k"==a[1]?"":e)+"}":"object"==typeof n?s+=l(n,e?e.replace(/([^,])+/g,t=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,e=>/&/.test(e)?e.replace(/&/g,t):t?t+" "+e:e)):a):null!=n&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=l.p?l.p(a,n):a+":"+n+";")}return r+(e&&i?e+"{"+i+"}":i)+s},c={},h=t=>{if("object"==typeof t){let e="";for(let r in t)e+=r+h(t[r]);return e}return t};function d(t){let e,r,s,i=this||{},d=t.call?t(i.p):t;return((t,e,r,s,i)=>{var a,d,p,f;let m=h(t),y=c[m]||(c[m]=(t=>{let e=0,r=11;for(;e<t.length;)r=101*r+t.charCodeAt(e++)>>>0;return"go"+r})(m));if(!c[y]){let e=m!==t?t:(t=>{let e,r,s=[{}];for(;e=n.exec(t.replace(o,""));)e[4]?s.shift():e[3]?(r=e[3].replace(u," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][e[1]]=e[2].replace(u," ").trim();return s[0]})(t);c[y]=l(i?{["@keyframes "+y]:e}:e,r?"":"."+y)}let b=r&&c.g?c.g:null;return r&&(c.g=c[y]),a=c[y],d=e,p=s,(f=b)?d.data=d.data.replace(f,a):-1===d.data.indexOf(a)&&(d.data=p?a+d.data:d.data+a),y})(d.unshift?d.raw?(e=[].slice.call(arguments,1),r=i.p,d.reduce((t,s,i)=>{let a=e[i];if(a&&a.call){let t=a(r),e=t&&t.props&&t.props.className||/^go/.test(t)&&t;a=e?"."+e:t&&"object"==typeof t?t.props?"":l(t,""):!1===t?"":t}return t+s+(null==a?"":a)},"")):d.reduce((t,e)=>Object.assign(t,e&&e.call?e(i.p):e),{}):d,(s=i.target,"object"==typeof window?((s?s.querySelector("#_goober"):window._goober)||Object.assign((s||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:s||a),i.g,i.o,i.k)}d.bind({g:1});let p,f,m,y=d.bind({k:1});function b(t,e){let r=this||{};return function(){let s=arguments;function i(a,n){let o=Object.assign({},a),u=o.className||i.className;r.p=Object.assign({theme:f&&f()},o),r.o=/ *go\d+/.test(u),o.className=d.apply(r,s)+(u?" "+u:""),e&&(o.ref=n);let l=t;return t[0]&&(l=o.as||t,delete o.as),m&&l[0]&&m(o),p(l,o)}return e?e(i):i}}var g=(t,e)=>"function"==typeof t?t(e):t,v=(()=>{let t=0;return()=>(++t).toString()})(),R=(()=>{let t;return()=>{if(void 0===t&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");t=!e||e.matches}return t}})(),x=(t,e)=>{switch(e.type){case 0:return{...t,toasts:[e.toast,...t.toasts].slice(0,20)};case 1:return{...t,toasts:t.toasts.map(t=>t.id===e.toast.id?{...t,...e.toast}:t)};case 2:let{toast:r}=e;return x(t,{type:+!!t.toasts.find(t=>t.id===r.id),toast:r});case 3:let{toastId:s}=e;return{...t,toasts:t.toasts.map(t=>t.id===s||void 0===s?{...t,dismissed:!0,visible:!1}:t)};case 4:return void 0===e.toastId?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(t=>t.id!==e.toastId)};case 5:return{...t,pausedAt:e.time};case 6:let i=e.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(t=>({...t,pauseDuration:t.pauseDuration+i}))}}},w=[],k={toasts:[],pausedAt:void 0},E=t=>{k=x(k,t),w.forEach(t=>{t(k)})},Q=t=>(e,r)=>{let s=((t,e="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:e,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...r,id:(null==r?void 0:r.id)||v()}))(e,t,r);return E({type:2,toast:s}),s.id},O=(t,e)=>Q("blank")(t,e);O.error=Q("error"),O.success=Q("success"),O.loading=Q("loading"),O.custom=Q("custom"),O.dismiss=t=>{E({type:3,toastId:t})},O.remove=t=>E({type:4,toastId:t}),O.promise=(t,e,r)=>{let s=O.loading(e.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof t&&(t=t()),t.then(t=>{let i=e.success?g(e.success,t):void 0;return i?O.success(i,{id:s,...r,...null==r?void 0:r.success}):O.dismiss(s),t}).catch(t=>{let i=e.error?g(e.error,t):void 0;i?O.error(i,{id:s,...r,...null==r?void 0:r.error}):O.dismiss(s)}),t};var I=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,C=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,M=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,S=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${C} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${M} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,j=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,A=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${j} 1s linear infinite;
`,F=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,D=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,$=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${D} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,L=b("div")`
  position: absolute;
`,U=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,_=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,P=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${_} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,H=({toast:t})=>{let{icon:e,type:r,iconTheme:s}=t;return void 0!==e?"string"==typeof e?i.createElement(P,null,e):e:"blank"===r?null:i.createElement(U,null,i.createElement(A,{...s}),"loading"!==r&&i.createElement(L,null,"error"===r?i.createElement(S,{...s}):i.createElement($,{...s})))},z=b("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,q=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;i.memo(({toast:t,position:e,style:r,children:s})=>{let a=t.height?((t,e)=>{let r=t.includes("top")?1:-1,[s,i]=R()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:e?`${y(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(t.position||e||"top-center",t.visible):{opacity:0},n=i.createElement(H,{toast:t}),o=i.createElement(q,{...t.ariaProps},g(t.message,t));return i.createElement(z,{className:t.className,style:{...a,...r,...t.style}},"function"==typeof s?s({icon:n,message:o}):i.createElement(i.Fragment,null,n,o))}),s=i.createElement,l.p=void 0,p=s,f=void 0,m=void 0,d`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var N=O},4229:(t,e,r)=>{r.d(e,{n:()=>c});var s=r(4),i=r(9563),a=r(2776),n=r(5437),o=r(4121),u=class extends n.Q{#t;#e=void 0;#r;#s;constructor(t,e){super(),this.#t=t,this.setOptions(e),this.bindMethods(),this.#i()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(t){let e=this.options;this.options=this.#t.defaultMutationOptions(t),(0,o.f8)(this.options,e)||this.#t.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#r,observer:this}),e?.mutationKey&&this.options.mutationKey&&(0,o.EN)(e.mutationKey)!==(0,o.EN)(this.options.mutationKey)?this.reset():this.#r?.state.status==="pending"&&this.#r.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#r?.removeObserver(this)}onMutationUpdate(t){this.#i(),this.#a(t)}getCurrentResult(){return this.#e}reset(){this.#r?.removeObserver(this),this.#r=void 0,this.#i(),this.#a()}mutate(t,e){return this.#s=e,this.#r?.removeObserver(this),this.#r=this.#t.getMutationCache().build(this.#t,this.options),this.#r.addObserver(this),this.#r.execute(t)}#i(){let t=this.#r?.state??(0,i.$)();this.#e={...t,isPending:"pending"===t.status,isSuccess:"success"===t.status,isError:"error"===t.status,isIdle:"idle"===t.status,mutate:this.mutate,reset:this.reset}}#a(t){a.jG.batch(()=>{if(this.#s&&this.hasListeners()){let e=this.#e.variables,r=this.#e.context;t?.type==="success"?(this.#s.onSuccess?.(t.data,e,r),this.#s.onSettled?.(t.data,null,e,r)):t?.type==="error"&&(this.#s.onError?.(t.error,e,r),this.#s.onSettled?.(void 0,t.error,e,r))}this.listeners.forEach(t=>{t(this.#e)})})}},l=r(6180);function c(t,e){let r=(0,l.jE)(e),[i]=s.useState(()=>new u(r,t));s.useEffect(()=>{i.setOptions(t)},[i,t]);let n=s.useSyncExternalStore(s.useCallback(t=>i.subscribe(a.jG.batchCalls(t)),[i]),()=>i.getCurrentResult(),()=>i.getCurrentResult()),c=s.useCallback((t,e)=>{i.mutate(t,e).catch(o.lQ)},[i]);if(n.error&&(0,o.GU)(i.options.throwOnError,[n.error]))throw n.error;return{...n,mutate:c,mutateAsync:n.mutate}}},7014:(t,e,r)=>{r.d(e,{I:()=>v});var s=r(343),i=r(2776),a=r(9648),n=r(5437),o=r(3423),u=r(4121),l=class extends n.Q{constructor(t,e){super(),this.options=e,this.#t=t,this.#n=null,this.#o=(0,o.T)(),this.options.experimental_prefetchInRender||this.#o.reject(Error("experimental_prefetchInRender feature flag is not enabled")),this.bindMethods(),this.setOptions(e)}#t;#u=void 0;#l=void 0;#e=void 0;#c;#h;#o;#n;#d;#p;#f;#m;#y;#b;#g=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#u.addObserver(this),c(this.#u,this.options)?this.#v():this.updateResult(),this.#R())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return h(this.#u,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return h(this.#u,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#x(),this.#w(),this.#u.removeObserver(this)}setOptions(t){let e=this.options,r=this.#u;if(this.options=this.#t.defaultQueryOptions(t),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,u.Eh)(this.options.enabled,this.#u))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#k(),this.#u.setOptions(this.options),e._defaulted&&!(0,u.f8)(this.options,e)&&this.#t.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#u,observer:this});let s=this.hasListeners();s&&d(this.#u,r,this.options,e)&&this.#v(),this.updateResult(),s&&(this.#u!==r||(0,u.Eh)(this.options.enabled,this.#u)!==(0,u.Eh)(e.enabled,this.#u)||(0,u.d2)(this.options.staleTime,this.#u)!==(0,u.d2)(e.staleTime,this.#u))&&this.#E();let i=this.#Q();s&&(this.#u!==r||(0,u.Eh)(this.options.enabled,this.#u)!==(0,u.Eh)(e.enabled,this.#u)||i!==this.#b)&&this.#O(i)}getOptimisticResult(t){var e,r;let s=this.#t.getQueryCache().build(this.#t,t),i=this.createResult(s,t);return e=this,r=i,(0,u.f8)(e.getCurrentResult(),r)||(this.#e=i,this.#h=this.options,this.#c=this.#u.state),i}getCurrentResult(){return this.#e}trackResult(t,e){return new Proxy(t,{get:(t,r)=>(this.trackProp(r),e?.(r),Reflect.get(t,r))})}trackProp(t){this.#g.add(t)}getCurrentQuery(){return this.#u}refetch({...t}={}){return this.fetch({...t})}fetchOptimistic(t){let e=this.#t.defaultQueryOptions(t),r=this.#t.getQueryCache().build(this.#t,e);return r.fetch().then(()=>this.createResult(r,e))}fetch(t){return this.#v({...t,cancelRefetch:t.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#e))}#v(t){this.#k();let e=this.#u.fetch(this.options,t);return t?.throwOnError||(e=e.catch(u.lQ)),e}#E(){this.#x();let t=(0,u.d2)(this.options.staleTime,this.#u);if(u.S$||this.#e.isStale||!(0,u.gn)(t))return;let e=(0,u.j3)(this.#e.dataUpdatedAt,t);this.#m=setTimeout(()=>{this.#e.isStale||this.updateResult()},e+1)}#Q(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#u):this.options.refetchInterval)??!1}#O(t){this.#w(),this.#b=t,!u.S$&&!1!==(0,u.Eh)(this.options.enabled,this.#u)&&(0,u.gn)(this.#b)&&0!==this.#b&&(this.#y=setInterval(()=>{(this.options.refetchIntervalInBackground||s.m.isFocused())&&this.#v()},this.#b))}#R(){this.#E(),this.#O(this.#Q())}#x(){this.#m&&(clearTimeout(this.#m),this.#m=void 0)}#w(){this.#y&&(clearInterval(this.#y),this.#y=void 0)}createResult(t,e){let r,s=this.#u,i=this.options,n=this.#e,l=this.#c,h=this.#h,f=t!==s?t.state:this.#l,{state:m}=t,y={...m},b=!1;if(e._optimisticResults){let r=this.hasListeners(),n=!r&&c(t,e),o=r&&d(t,s,e,i);(n||o)&&(y={...y,...(0,a.k)(m.data,t.options)}),"isRestoring"===e._optimisticResults&&(y.fetchStatus="idle")}let{error:g,errorUpdatedAt:v,status:R}=y;r=y.data;let x=!1;if(void 0!==e.placeholderData&&void 0===r&&"pending"===R){let t;n?.isPlaceholderData&&e.placeholderData===h?.placeholderData?(t=n.data,x=!0):t="function"==typeof e.placeholderData?e.placeholderData(this.#f?.state.data,this.#f):e.placeholderData,void 0!==t&&(R="success",r=(0,u.pl)(n?.data,t,e),b=!0)}if(e.select&&void 0!==r&&!x)if(n&&r===l?.data&&e.select===this.#d)r=this.#p;else try{this.#d=e.select,r=e.select(r),r=(0,u.pl)(n?.data,r,e),this.#p=r,this.#n=null}catch(t){this.#n=t}this.#n&&(g=this.#n,r=this.#p,v=Date.now(),R="error");let w="fetching"===y.fetchStatus,k="pending"===R,E="error"===R,Q=k&&w,O=void 0!==r,I={status:R,fetchStatus:y.fetchStatus,isPending:k,isSuccess:"success"===R,isError:E,isInitialLoading:Q,isLoading:Q,data:r,dataUpdatedAt:y.dataUpdatedAt,error:g,errorUpdatedAt:v,failureCount:y.fetchFailureCount,failureReason:y.fetchFailureReason,errorUpdateCount:y.errorUpdateCount,isFetched:y.dataUpdateCount>0||y.errorUpdateCount>0,isFetchedAfterMount:y.dataUpdateCount>f.dataUpdateCount||y.errorUpdateCount>f.errorUpdateCount,isFetching:w,isRefetching:w&&!k,isLoadingError:E&&!O,isPaused:"paused"===y.fetchStatus,isPlaceholderData:b,isRefetchError:E&&O,isStale:p(t,e),refetch:this.refetch,promise:this.#o,isEnabled:!1!==(0,u.Eh)(e.enabled,t)};if(this.options.experimental_prefetchInRender){let e=t=>{"error"===I.status?t.reject(I.error):void 0!==I.data&&t.resolve(I.data)},r=()=>{e(this.#o=I.promise=(0,o.T)())},i=this.#o;switch(i.status){case"pending":t.queryHash===s.queryHash&&e(i);break;case"fulfilled":("error"===I.status||I.data!==i.value)&&r();break;case"rejected":("error"!==I.status||I.error!==i.reason)&&r()}}return I}updateResult(){let t=this.#e,e=this.createResult(this.#u,this.options);this.#c=this.#u.state,this.#h=this.options,void 0!==this.#c.data&&(this.#f=this.#u),(0,u.f8)(e,t)||(this.#e=e,this.#a({listeners:(()=>{if(!t)return!0;let{notifyOnChangeProps:e}=this.options,r="function"==typeof e?e():e;if("all"===r||!r&&!this.#g.size)return!0;let s=new Set(r??this.#g);return this.options.throwOnError&&s.add("error"),Object.keys(this.#e).some(e=>this.#e[e]!==t[e]&&s.has(e))})()}))}#k(){let t=this.#t.getQueryCache().build(this.#t,this.options);if(t===this.#u)return;let e=this.#u;this.#u=t,this.#l=t.state,this.hasListeners()&&(e?.removeObserver(this),t.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#R()}#a(t){i.jG.batch(()=>{t.listeners&&this.listeners.forEach(t=>{t(this.#e)}),this.#t.getQueryCache().notify({query:this.#u,type:"observerResultsUpdated"})})}};function c(t,e){return!1!==(0,u.Eh)(e.enabled,t)&&void 0===t.state.data&&("error"!==t.state.status||!1!==e.retryOnMount)||void 0!==t.state.data&&h(t,e,e.refetchOnMount)}function h(t,e,r){if(!1!==(0,u.Eh)(e.enabled,t)&&"static"!==(0,u.d2)(e.staleTime,t)){let s="function"==typeof r?r(t):r;return"always"===s||!1!==s&&p(t,e)}return!1}function d(t,e,r,s){return(t!==e||!1===(0,u.Eh)(s.enabled,t))&&(!r.suspense||"error"!==t.state.status)&&p(t,r)}function p(t,e){return!1!==(0,u.Eh)(e.enabled,t)&&t.isStaleByTime((0,u.d2)(e.staleTime,t))}var f=r(4),m=r(6180);r(72);var y=f.createContext(function(){let t=!1;return{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t}}()),b=f.createContext(!1);b.Provider;var g=(t,e,r)=>e.fetchOptimistic(t).catch(()=>{r.clearReset()});function v(t,e){return function(t,e,r){let s=f.useContext(b),a=f.useContext(y),n=(0,m.jE)(r),o=n.defaultQueryOptions(t);if(n.getDefaultOptions().queries?._experimental_beforeQuery?.(o),o._optimisticResults=s?"isRestoring":"optimistic",o.suspense){let t=t=>"static"===t?t:Math.max(t??1e3,1e3),e=o.staleTime;o.staleTime="function"==typeof e?(...r)=>t(e(...r)):t(e),"number"==typeof o.gcTime&&(o.gcTime=Math.max(o.gcTime,1e3))}(o.suspense||o.throwOnError||o.experimental_prefetchInRender)&&!a.isReset()&&(o.retryOnMount=!1),f.useEffect(()=>{a.clearReset()},[a]);let l=!n.getQueryCache().get(o.queryHash),[c]=f.useState(()=>new e(n,o)),h=c.getOptimisticResult(o),d=!s&&!1!==t.subscribed;if(f.useSyncExternalStore(f.useCallback(t=>{let e=d?c.subscribe(i.jG.batchCalls(t)):u.lQ;return c.updateResult(),e},[c,d]),()=>c.getCurrentResult(),()=>c.getCurrentResult()),f.useEffect(()=>{c.setOptions(o)},[o,c]),o?.suspense&&h.isPending)throw g(o,c,a);if((({result:t,errorResetBoundary:e,throwOnError:r,query:s,suspense:i})=>t.isError&&!e.isReset()&&!t.isFetching&&s&&(i&&void 0===t.data||(0,u.GU)(r,[t.error,s])))({result:h,errorResetBoundary:a,throwOnError:o.throwOnError,query:n.getQueryCache().get(o.queryHash),suspense:o.suspense}))throw h.error;if(n.getDefaultOptions().queries?._experimental_afterQuery?.(o,h),o.experimental_prefetchInRender&&!u.S$&&h.isLoading&&h.isFetching&&!s){let t=l?g(o,c,a):n.getQueryCache().get(o.queryHash)?.promise;t?.catch(u.lQ).finally(()=>{c.updateResult()})}return o.notifyOnChangeProps?h:c.trackResult(h)}(t,l,e)}},8699:(t,e,r)=>{r.d(e,{A:()=>i});var s=r(4);let i=s.forwardRef(function(t,e){let{title:r,titleId:i,...a}=t;return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:e,"aria-labelledby":i},a),r?s.createElement("title",{id:i},r):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"}),s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 6h.008v.008H6V6Z"}))})},8798:(t,e,r)=>{r.d(e,{A:()=>s});let s=(0,r(5935).A)("building",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["path",{d:"M9 22v-4h6v4",key:"r93iot"}],["path",{d:"M8 6h.01",key:"1dz90k"}],["path",{d:"M16 6h.01",key:"1x0f13"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M8 14h.01",key:"6423bh"}]])},8887:(t,e,r)=>{r.d(e,{A:()=>i});var s=r(4);let i=s.forwardRef(function(t,e){let{title:r,titleId:i,...a}=t;return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:e,"aria-labelledby":i},a),r?s.createElement("title",{id:i},r):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"}))})},9461:(t,e,r)=>{r.d(e,{A:()=>s});let s=(0,r(5935).A)("menu",[["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 18h16",key:"19g7jn"}],["path",{d:"M4 6h16",key:"1o0s65"}]])},9894:(t,e,r)=>{r.d(e,{A:()=>s});let s=(0,r(5935).A)("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]])}}]);