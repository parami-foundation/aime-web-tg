"use strict";(self.webpackChunkaime_tma=self.webpackChunkaime_tma||[]).push([[4893],{84893:function(B,y,v){v.d(y,{LiveAudioVisualizer:function(){return j}});var p=v(67294),E={exports:{}},R={};var S;function A(){if(S)return R;S=1;var n=p,c=Symbol.for("react.element"),d=Symbol.for("react.fragment"),f=Object.prototype.hasOwnProperty,s=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u={key:!0,ref:!0,__self:!0,__source:!0};function h(r,a,l){var e,t={},i=null,m=null;l!==void 0&&(i=""+l),a.key!==void 0&&(i=""+a.key),a.ref!==void 0&&(m=a.ref);for(e in a)f.call(a,e)&&!u.hasOwnProperty(e)&&(t[e]=a[e]);if(r&&r.defaultProps)for(e in a=r.defaultProps,a)t[e]===void 0&&(t[e]=a[e]);return{$$typeof:c,type:r,key:i,ref:m,props:t,_owner:s.current}}return R.Fragment=d,R.jsx=h,R.jsxs=h,R}var T={};var k;function I(){return k||(k=1),T}E.exports=A();var D=E.exports;const O=(n,c,d,f)=>{let s=c/(d+f),u=Math.floor(n.length/s);s>n.length&&(s=n.length,u=1);const h=[];for(let r=0;r<s;r++){let a=0;for(let l=0;l<u&&r*u+l<n.length;l++)a+=n[r*u+l];h.push(a/u)}return h},P=(n,c,d,f,s,u)=>{const h=c.height/2,r=c.getContext("2d");r&&(r.clearRect(0,0,c.width,c.height),s!=="transparent"&&(r.fillStyle=s,r.fillRect(0,0,c.width,c.height)),n.forEach((a,l)=>{r.fillStyle=u;const e=l*(d+f),t=h-a/2,i=d,m=a||1;r.beginPath(),r.roundRect?(r.roundRect(e,t,i,m,50),r.fill()):r.fillRect(e,t,i,m)}))},j=({mediaRecorder:n,width:c="100%",height:d="100%",barWidth:f=2,gap:s=1,backgroundColor:u="transparent",barColor:h="rgb(160, 198, 255)",fftSize:r=1024,maxDecibels:a=-10,minDecibels:l=-90,smoothingTimeConstant:e=.4})=>{const[t]=(0,p.useState)(()=>new AudioContext),[i,m]=(0,p.useState)(),_=(0,p.useRef)(null);(0,p.useEffect)(()=>{if(!n.stream)return;const o=t.createAnalyser();m(o),o.fftSize=r,o.minDecibels=l,o.maxDecibels=a,o.smoothingTimeConstant=e,t.createMediaStreamSource(n.stream).connect(o)},[n.stream]),(0,p.useEffect)(()=>{i&&n.state==="recording"&&w()},[i,n.state]);const w=(0,p.useCallback)(()=>{if(!i)return;const o=new Uint8Array(i==null?void 0:i.frequencyBinCount);n.state==="recording"?(i==null||i.getByteFrequencyData(o),C(o),requestAnimationFrame(w)):n.state==="paused"?C(o):n.state==="inactive"&&t.state!=="closed"&&t.close()},[i,t.state]),C=o=>{if(!_.current)return;const g=O(o,_.current.width,f,s);P(g,_.current,f,s,u,h)};return D.jsx("canvas",{ref:_,width:c,height:d,style:{aspectRatio:"unset"}})},M=(n,c,d,f,s)=>{const u=n.getChannelData(0),h=d/(f+s),r=Math.floor(u.length/h),a=c/2;let l=[],e=0;for(let t=0;t<h;t++){const i=[];let m=0;const _=[];let w=0;for(let g=0;g<r&&t*r+g<n.length;g++){const b=u[t*r+g];b<=0&&(i.push(b),m++),b>0&&(_.push(b),w++)}const C=i.reduce((g,b)=>g+b,0)/m,o={max:_.reduce((g,b)=>g+b,0)/w,min:C};o.max>e&&(e=o.max),Math.abs(o.min)>e&&(e=Math.abs(o.min)),l.push(o)}if(a*.8>e*a){const t=a*.8/e;l=l.map(i=>({max:i.max*t,min:i.min*t}))}return l},x=(n,c,d,f,s,u,h,r=0,a=1)=>{const l=c.height/2,e=c.getContext("2d");if(!e)return;e.clearRect(0,0,c.width,c.height),s!=="transparent"&&(e.fillStyle=s,e.fillRect(0,0,c.width,c.height));const t=(r||0)/a;n.forEach((i,m)=>{const _=m/n.length,w=t>_;e.fillStyle=w&&h?h:u;const C=m*(d+f),o=l+i.min,g=d,b=l+i.max-o;e.beginPath(),e.roundRect?(e.roundRect(C,o,g,b,50),e.fill()):e.fillRect(C,o,g,b)})},z=(0,p.forwardRef)(({blob:n,width:c,height:d,barWidth:f=2,gap:s=1,currentTime:u,style:h,backgroundColor:r="transparent",barColor:a="rgb(184, 184, 184)",barPlayedColor:l="rgb(160, 198, 255)"},e)=>{const t=(0,p.useRef)(null),[i,m]=(0,p.useState)([]),[_,w]=(0,p.useState)(0);return(0,p.useImperativeHandle)(e,()=>t.current,[]),(0,p.useEffect)(()=>{(async()=>{if(!t.current)return;if(!n){const o=Array.from({length:100},()=>({max:0,min:0}));x(o,t.current,f,s,r,a,l);return}const C=await n.arrayBuffer();await new AudioContext().decodeAudioData(C,o=>{if(!t.current)return;w(o.duration);const g=M(o,d,c,f,s);m(g),x(g,t.current,f,s,r,a,l)})})()},[n,t.current]),(0,p.useEffect)(()=>{t.current&&x(i,t.current,f,s,r,a,l,u,_)},[u,_]),D.jsx("canvas",{ref:t,width:c,height:d,style:{...h}})});z.displayName="AudioVisualizer"}}]);
