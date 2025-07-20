(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4384],{826:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n});var a=r(72),o=r(4),i=r(983),s=r(3228);function n(){let[e,t]=(0,o.useState)(""),[r,n]=(0,o.useState)(""),[l,c]=(0,o.useState)(!1),d=(0,i.useRouter)(),p=async t=>{t.preventDefault(),c(!0);try{let t=await fetch("".concat("http://localhost:5000","/api/auth/login"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:r})});if(t.ok){let e=await t.json();localStorage.setItem("token",e.token),s.Ay.success("Admin login successful!"),d.push("/")}else s.Ay.error("Invalid admin credentials")}catch(e){s.Ay.error("Login failed. Please try again.")}finally{c(!1)}};return(0,a.jsx)("div",{className:"min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center",children:(0,a.jsx)("div",{className:"max-w-md w-full mx-4",children:(0,a.jsxs)("div",{className:"bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20",children:[(0,a.jsxs)("div",{className:"text-center mb-8",children:[(0,a.jsx)("div",{className:"mx-auto h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center mb-4",children:(0,a.jsx)("svg",{className:"h-6 w-6 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 15v2m0 0v2m0-2h2m-2 0H8m13-9.5a9 9 0 11-18 0 9 9 0 0118 0z"})})}),(0,a.jsx)("h2",{className:"text-3xl font-bold text-white mb-2",children:"Super Admin Access"}),(0,a.jsx)("p",{className:"text-gray-300",children:"Secure login to LeafyHealth administration"})]}),(0,a.jsxs)("form",{onSubmit:p,className:"space-y-6",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-200 mb-2",children:"Admin Email"}),(0,a.jsx)("input",{type:"email",required:!0,value:e,onChange:e=>t(e.target.value),className:"w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",placeholder:"admin@leafyhealth.com"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-200 mb-2",children:"Password"}),(0,a.jsx)("input",{type:"password",required:!0,value:r,onChange:e=>n(e.target.value),className:"w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",placeholder:"Enter admin password"})]}),(0,a.jsx)("button",{type:"submit",disabled:l,className:"w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50",children:l?"Authenticating...":"Access Admin Panel"})]}),(0,a.jsx)("div",{className:"mt-6 text-center",children:(0,a.jsx)("p",{className:"text-sm text-gray-400",children:"Restricted access for authorized personnel only"})})]})})})}},2644:(e,t,r)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/auth/login",function(){return r(826)}])},3228:(e,t,r)=>{"use strict";r.d(t,{Ay:()=>X,oR:()=>$});var a,o=r(4);let i={data:""},s=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let r="",a="",o="";for(let i in e){let s=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+s+";":a+="f"==i[1]?c(s,i):i+"{"+c(s,"k"==i[1]?"":t)+"}":"object"==typeof s?a+=c(s,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=s&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=c.p?c.p(i,s):i+":"+s+";")}return r+(t&&o?t+"{"+o+"}":o)+a},d={},p=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+p(e[r]);return t}return e};function u(e){let t,r,a,o=this||{},u=e.call?e(o.p):e;return((e,t,r,a,o)=>{var i,u,m,f;let h=p(e),g=d[h]||(d[h]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(h));if(!d[g]){let t=h!==e?e:(e=>{let t,r,a=[{}];for(;t=s.exec(e.replace(n,""));)t[4]?a.shift():t[3]?(r=t[3].replace(l," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);d[g]=c(o?{["@keyframes "+g]:t}:t,r?"":"."+g)}let b=r&&d.g?d.g:null;return r&&(d.g=d[g]),i=d[g],u=t,m=a,(f=b)?u.data=u.data.replace(f,i):-1===u.data.indexOf(i)&&(u.data=m?i+u.data:u.data+i),g})(u.unshift?u.raw?(t=[].slice.call(arguments,1),r=o.p,u.reduce((e,a,o)=>{let i=t[o];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):u.reduce((e,t)=>Object.assign(e,t&&t.call?t(o.p):t),{}):u,(a=o.target,"object"==typeof window?((a?a.querySelector("#_goober"):window._goober)||Object.assign((a||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:a||i),o.g,o.o,o.k)}u.bind({g:1});let m,f,h,g=u.bind({k:1});function b(e,t){let r=this||{};return function(){let a=arguments;function o(i,s){let n=Object.assign({},i),l=n.className||o.className;r.p=Object.assign({theme:f&&f()},n),r.o=/ *go\d+/.test(l),n.className=u.apply(r,a)+(l?" "+l:""),t&&(n.ref=s);let c=e;return e[0]&&(c=n.as||e,delete n.as),h&&c[0]&&h(n),m(c,n)}return t?t(o):o}}var y=(e,t)=>"function"==typeof e?e(t):e,x=(()=>{let e=0;return()=>(++e).toString()})(),v=(()=>{let e;return()=>{if(void 0===e&&"u">typeof window){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),w=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},j=[],N={toasts:[],pausedAt:void 0},k=e=>{N=w(N,e),j.forEach(e=>{e(N)})},E=e=>(t,r)=>{let a=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||x()}))(t,e,r);return k({type:2,toast:a}),a.id},$=(e,t)=>E("blank")(e,t);$.error=E("error"),$.success=E("success"),$.loading=E("loading"),$.custom=E("custom"),$.dismiss=e=>{k({type:3,toastId:e})},$.remove=e=>k({type:4,toastId:e}),$.promise=(e,t,r)=>{let a=$.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?y(t.success,e):void 0;return o?$.success(o,{id:a,...r,...null==r?void 0:r.success}):$.dismiss(a),e}).catch(e=>{let o=t.error?y(t.error,e):void 0;o?$.error(o,{id:a,...r,...null==r?void 0:r.error}):$.dismiss(a)}),e};var A=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,_=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,C=g`
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
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${A} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${_} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${C} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,z=g`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,O=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${z} 1s linear infinite;
`,P=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,I=g`
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
}`,L=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${P} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${I} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,D=b("div")`
  position: absolute;
`,F=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,H=g`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,M=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${H} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,R=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?o.createElement(M,null,t):t:"blank"===r?null:o.createElement(F,null,o.createElement(O,{...a}),"loading"!==r&&o.createElement(D,null,"error"===r?o.createElement(S,{...a}):o.createElement(L,{...a})))},q=b("div")`
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
`,B=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;o.memo(({toast:e,position:t,style:r,children:a})=>{let i=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,o]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},s=o.createElement(R,{toast:e}),n=o.createElement(B,{...e.ariaProps},y(e.message,e));return o.createElement(q,{className:e.className,style:{...i,...r,...e.style}},"function"==typeof a?a({icon:s,message:n}):o.createElement(o.Fragment,null,s,n))}),a=o.createElement,c.p=void 0,m=a,f=void 0,h=void 0,u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var X=$}},e=>{e.O(0,[636,6593,8792],()=>e(e.s=2644)),_N_E=e.O()}]);