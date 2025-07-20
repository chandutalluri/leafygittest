(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8907],{347:(e,t,a)=>{"use strict";a.d(t,{BT:()=>n,Wu:()=>o,ZB:()=>l,Zp:()=>r,aR:()=>i});var s=a(72);a(4);let r=e=>{let{children:t,className:a=""}=e;return(0,s.jsx)("div",{className:"bg-white border rounded-lg shadow ".concat(a),children:t})},i=e=>{let{children:t,className:a=""}=e;return(0,s.jsx)("div",{className:"px-6 py-4 border-b ".concat(a),children:t})},l=e=>{let{children:t,className:a=""}=e;return(0,s.jsx)("h3",{className:"text-lg font-semibold ".concat(a),children:t})},n=e=>{let{children:t,className:a=""}=e;return(0,s.jsx)("p",{className:"text-sm text-gray-600 mt-1 ".concat(a),children:t})},o=e=>{let{children:t,className:a=""}=e;return(0,s.jsx)("div",{className:"px-6 py-4 ".concat(a),children:t})}},1830:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(5935).A)("map-pin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]])},1853:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>y});var s=a(72),r=a(4),i=a(6316),l=a.n(i),n=a(347),o=a(3413),c=a(2489),d=a(447),m=a(1830);let p=(0,a(5935).A)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);var u=a(5814),x=a(9998),h=a(6383),f=a(4580),g=a(3228);function y(){let[e,t]=(0,r.useState)([]),[a,i]=(0,r.useState)(!0),[y,b]=(0,r.useState)(!1),[v,j]=(0,r.useState)(null),[N,w]=(0,r.useState)({name:"",contact_person:"",phone:"",email:"",address:"",quality_tiers:[]});(0,r.useEffect)(()=>{_()},[]);let _=async()=>{try{let e=await f.A.get("/api/traditional/vendors");t(e.data.data||[])}catch(e){console.error("Error fetching vendors:",e)}finally{i(!1)}},k=async e=>{e.preventDefault();try{v?(await f.A.put("/api/traditional/vendors/".concat(v.id),N),g.Ay.success("Vendor updated successfully")):(await f.A.post("/api/traditional/vendors",N),g.Ay.success("Vendor added successfully")),_(),E()}catch(e){console.error("Error saving vendor:",e),g.Ay.error("Failed to save vendor")}},A=async e=>{try{await f.A.patch("/api/traditional/vendors/".concat(e.id,"/status"),{is_active:!e.is_active}),g.Ay.success("Vendor ".concat(e.is_active?"deactivated":"activated")),_()}catch(e){console.error("Error updating vendor status:",e),g.Ay.error("Failed to update vendor status")}},E=()=>{w({name:"",contact_person:"",phone:"",email:"",address:"",quality_tiers:[]}),j(null),b(!1)};return(0,s.jsxs)("div",{className:"p-4",children:[(0,s.jsx)(l(),{children:(0,s.jsx)("title",{children:"Traditional Vendors Management - Super Admin"})}),(0,s.jsxs)("div",{className:"p-6 max-w-7xl mx-auto",children:[(0,s.jsxs)("div",{className:"flex justify-between items-center mb-8",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("h1",{className:"text-3xl font-bold text-gray-900",children:"Traditional Vendors"}),(0,s.jsx)("p",{className:"text-gray-600 mt-2",children:"Manage vendors for traditional home supplies"})]}),(0,s.jsxs)(o.$,{onClick:()=>b(!0),className:"bg-emerald-600 hover:bg-emerald-700",children:[(0,s.jsx)(c.A,{className:"w-4 h-4 mr-2"}),"Add Vendor"]})]}),a?(0,s.jsx)("div",{className:"text-center py-12",children:(0,s.jsx)("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"})}):0===e.length?(0,s.jsxs)(n.Zp,{className:"p-12 text-center",children:[(0,s.jsx)(d.A,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),(0,s.jsx)("p",{className:"text-gray-600",children:"No vendors found"}),(0,s.jsx)(o.$,{onClick:()=>b(!0),className:"mt-4",children:"Add First Vendor"})]}):(0,s.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:e.map(e=>(0,s.jsxs)(n.Zp,{className:"p-6",children:[(0,s.jsxs)("div",{className:"flex justify-between items-start mb-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("h3",{className:"text-lg font-semibold",children:e.name}),(0,s.jsx)("p",{className:"text-sm text-gray-600",children:e.contact_person})]}),(0,s.jsx)("span",{className:"px-2 py-1 rounded-full text-xs ".concat(e.is_active?"bg-green-100 text-green-800":"bg-gray-100 text-gray-800"),children:e.is_active?"Active":"Inactive"})]}),(0,s.jsxs)("div",{className:"space-y-2 text-sm mb-4",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2",children:[(0,s.jsx)(m.A,{className:"w-4 h-4 text-gray-400"}),(0,s.jsx)("span",{className:"text-gray-600",children:e.address})]}),(0,s.jsxs)("div",{className:"flex items-center gap-2",children:[(0,s.jsx)("span",{className:"text-gray-600",children:"Quality Tiers:"}),(0,s.jsx)("div",{className:"flex gap-1",children:e.quality_tiers.map(e=>(0,s.jsx)("span",{className:"font-semibold text-emerald-600",children:(e=>{switch(e){case"ordinary":return"₹";case"medium":return"₹₹";case"best":return"₹₹₹";default:return e}})(e)},e))})]})]}),(0,s.jsxs)("div",{className:"grid grid-cols-3 gap-2 mb-4 text-center",children:[(0,s.jsxs)("div",{className:"bg-gray-50 rounded p-2",children:[(0,s.jsx)(p,{className:"w-4 h-4 text-yellow-500 mx-auto mb-1"}),(0,s.jsx)("p",{className:"text-xs text-gray-600",children:"Rating"}),(0,s.jsx)("p",{className:"font-semibold",children:e.rating.toFixed(1)})]}),(0,s.jsxs)("div",{className:"bg-gray-50 rounded p-2",children:[(0,s.jsx)(u.A,{className:"w-4 h-4 text-blue-500 mx-auto mb-1"}),(0,s.jsx)("p",{className:"text-xs text-gray-600",children:"Orders"}),(0,s.jsx)("p",{className:"font-semibold",children:e.total_orders})]}),(0,s.jsxs)("div",{className:"bg-gray-50 rounded p-2",children:[(0,s.jsx)(x.A,{className:"w-4 h-4 text-green-500 mx-auto mb-1"}),(0,s.jsx)("p",{className:"text-xs text-gray-600",children:"Revenue"}),(0,s.jsxs)("p",{className:"font-semibold",children:["₹",(e.total_revenue||0).toFixed(0)]})]})]}),(0,s.jsxs)("div",{className:"flex gap-2",children:[(0,s.jsxs)(o.$,{size:"sm",variant:"outline",onClick:()=>{j(e),w({name:e.name,contact_person:e.contact_person,phone:e.phone,email:e.email,address:e.address,quality_tiers:e.quality_tiers}),b(!0)},className:"flex-1",children:[(0,s.jsx)(h.A,{className:"w-4 h-4 mr-1"}),"Edit"]}),(0,s.jsx)(o.$,{size:"sm",variant:e.is_active?"outline":"default",onClick:()=>A(e),className:"flex-1",children:e.is_active?"Deactivate":"Activate"})]})]},e.id))}),y&&(0,s.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",children:(0,s.jsxs)(n.Zp,{className:"w-full max-w-md p-6",children:[(0,s.jsx)("h2",{className:"text-xl font-semibold mb-4",children:v?"Edit Vendor":"Add New Vendor"}),(0,s.jsxs)("form",{onSubmit:k,className:"space-y-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-1",children:"Vendor Name"}),(0,s.jsx)("input",{type:"text",value:N.name,onChange:e=>w({...N,name:e.target.value}),className:"w-full px-3 py-2 border rounded-lg",required:!0})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-1",children:"Contact Person"}),(0,s.jsx)("input",{type:"text",value:N.contact_person,onChange:e=>w({...N,contact_person:e.target.value}),className:"w-full px-3 py-2 border rounded-lg",required:!0})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-1",children:"Phone"}),(0,s.jsx)("input",{type:"tel",value:N.phone,onChange:e=>w({...N,phone:e.target.value}),className:"w-full px-3 py-2 border rounded-lg",required:!0})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-1",children:"Email"}),(0,s.jsx)("input",{type:"email",value:N.email,onChange:e=>w({...N,email:e.target.value}),className:"w-full px-3 py-2 border rounded-lg",required:!0})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-1",children:"Address"}),(0,s.jsx)("textarea",{value:N.address,onChange:e=>w({...N,address:e.target.value}),className:"w-full px-3 py-2 border rounded-lg",rows:2,required:!0})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-1",children:"Quality Tiers"}),(0,s.jsx)("div",{className:"flex gap-3",children:["ordinary","medium","best"].map(e=>(0,s.jsxs)("label",{className:"flex items-center",children:[(0,s.jsx)("input",{type:"checkbox",checked:N.quality_tiers.includes(e),onChange:t=>{t.target.checked?w({...N,quality_tiers:[...N.quality_tiers,e]}):w({...N,quality_tiers:N.quality_tiers.filter(t=>t!==e)})},className:"mr-2"}),(0,s.jsx)("span",{className:"capitalize",children:e})]},e))})]}),(0,s.jsxs)("div",{className:"flex gap-2 pt-4",children:[(0,s.jsxs)(o.$,{type:"submit",className:"flex-1 bg-emerald-600 hover:bg-emerald-700",children:[v?"Update":"Add"," Vendor"]}),(0,s.jsx)(o.$,{type:"button",variant:"outline",onClick:E,className:"flex-1",children:"Cancel"})]})]})]})})]})]})}},2489:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(5935).A)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]])},3228:(e,t,a)=>{"use strict";a.d(t,{Ay:()=>B,oR:()=>A});var s,r=a(4);let i={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,o=/\n+/g,c=(e,t)=>{let a="",s="",r="";for(let i in e){let l=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+l+";":s+="f"==i[1]?c(l,i):i+"{"+c(l,"k"==i[1]?"":t)+"}":"object"==typeof l?s+=c(l,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=l&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=c.p?c.p(i,l):i+":"+l+";")}return a+(t&&r?t+"{"+r+"}":r)+s},d={},m=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+m(e[a]);return t}return e};function p(e){let t,a,s,r=this||{},p=e.call?e(r.p):e;return((e,t,a,s,r)=>{var i,p,u,x;let h=m(e),f=d[h]||(d[h]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(h));if(!d[f]){let t=h!==e?e:(e=>{let t,a,s=[{}];for(;t=l.exec(e.replace(n,""));)t[4]?s.shift():t[3]?(a=t[3].replace(o," ").trim(),s.unshift(s[0][a]=s[0][a]||{})):s[0][t[1]]=t[2].replace(o," ").trim();return s[0]})(e);d[f]=c(r?{["@keyframes "+f]:t}:t,a?"":"."+f)}let g=a&&d.g?d.g:null;return a&&(d.g=d[f]),i=d[f],p=t,u=s,(x=g)?p.data=p.data.replace(x,i):-1===p.data.indexOf(i)&&(p.data=u?i+p.data:p.data+i),f})(p.unshift?p.raw?(t=[].slice.call(arguments,1),a=r.p,p.reduce((e,s,r)=>{let i=t[r];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"")):p.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):p,(s=r.target,"object"==typeof window?((s?s.querySelector("#_goober"):window._goober)||Object.assign((s||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:s||i),r.g,r.o,r.k)}p.bind({g:1});let u,x,h,f=p.bind({k:1});function g(e,t){let a=this||{};return function(){let s=arguments;function r(i,l){let n=Object.assign({},i),o=n.className||r.className;a.p=Object.assign({theme:x&&x()},n),a.o=/ *go\d+/.test(o),n.className=p.apply(a,s)+(o?" "+o:""),t&&(n.ref=l);let c=e;return e[0]&&(c=n.as||e,delete n.as),h&&c[0]&&h(n),u(c,n)}return t?t(r):r}}var y=(e,t)=>"function"==typeof e?e(t):e,b=(()=>{let e=0;return()=>(++e).toString()})(),v=(()=>{let e;return()=>{if(void 0===e&&"u">typeof window){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),j=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let r=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+r}))}}},N=[],w={toasts:[],pausedAt:void 0},_=e=>{w=j(w,e),N.forEach(e=>{e(w)})},k=e=>(t,a)=>{let s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||b()}))(t,e,a);return _({type:2,toast:s}),s.id},A=(e,t)=>k("blank")(e,t);A.error=k("error"),A.success=k("success"),A.loading=k("loading"),A.custom=k("custom"),A.dismiss=e=>{_({type:3,toastId:e})},A.remove=e=>_({type:4,toastId:e}),A.promise=(e,t,a)=>{let s=A.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?y(t.success,e):void 0;return r?A.success(r,{id:s,...a,...null==a?void 0:a.success}):A.dismiss(s),e}).catch(e=>{let r=t.error?y(t.error,e):void 0;r?A.error(r,{id:s,...a,...null==a?void 0:a.error}):A.dismiss(s)}),e};var E=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,$=f`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,C=f`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,q=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${E} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${$} 0.15s ease-out forwards;
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
`,z=f`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,M=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${z} 1s linear infinite;
`,V=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,F=f`
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
}`,S=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${V} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${F} 0.2s ease-out forwards;
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
`,O=g("div")`
  position: absolute;
`,D=g("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,I=f`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,P=g("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${I} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,R=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return void 0!==t?"string"==typeof t?r.createElement(P,null,t):t:"blank"===a?null:r.createElement(D,null,r.createElement(M,{...s}),"loading"!==a&&r.createElement(O,null,"error"===a?r.createElement(q,{...s}):r.createElement(S,{...s})))},Z=g("div")`
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
`,L=g("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;r.memo(({toast:e,position:t,style:a,children:s})=>{let i=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[s,r]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${f(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${f(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},l=r.createElement(R,{toast:e}),n=r.createElement(L,{...e.ariaProps},y(e.message,e));return r.createElement(Z,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof s?s({icon:l,message:n}):r.createElement(r.Fragment,null,l,n))}),s=r.createElement,c.p=void 0,u=s,x=void 0,h=void 0,p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var B=A},3413:(e,t,a)=>{"use strict";a.d(t,{$:()=>r});var s=a(72);let r=a(4).forwardRef((e,t)=>{let{children:a,className:r="",size:i="md",variant:l="default",...n}=e;return(0,s.jsx)("button",{ref:t,className:"".concat("inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"," ").concat({sm:"px-3 py-1.5 text-sm",md:"px-4 py-2",lg:"px-6 py-3 text-lg"}[i]," ").concat({default:"bg-blue-600 text-white hover:bg-blue-700",outline:"border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",destructive:"bg-red-600 text-white hover:bg-red-700"}[l]," disabled:opacity-50 disabled:cursor-not-allowed ").concat(r),...n,children:a})});r.displayName="Button"},6383:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(5935).A)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]])},9392:(e,t,a)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/traditional/vendors",function(){return a(1853)}])}},e=>{e.O(0,[8963,636,6593,8792],()=>e(e.s=9392)),_N_E=e.O()}]);