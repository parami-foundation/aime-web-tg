(self.webpackChunkaime_tma=self.webpackChunkaime_tma||[]).push([[3743],{80868:function(d,E,p){var f=Object.create,i=Object.defineProperty,m=Object.getOwnPropertyDescriptor,P=Object.getOwnPropertyNames,_=Object.getPrototypeOf,b=Object.prototype.hasOwnProperty,v=(t,e,r)=>e in t?i(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,g=(t,e)=>{for(var r in e)i(t,r,{get:e[r],enumerable:!0})},h=(t,e,r,l)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of P(e))!b.call(t,a)&&a!==r&&i(t,a,{get:()=>e[a],enumerable:!(l=m(e,a))||l.enumerable});return t},O=(t,e,r)=>(r=t!=null?f(_(t)):{},h(e||!t||!t.__esModule?i(r,"default",{value:t,enumerable:!0}):r,t)),w=t=>h(i({},"__esModule",{value:!0}),t),o=(t,e,r)=>(v(t,typeof e!="symbol"?e+"":e,r),r),u={};g(u,{default:()=>n}),d.exports=w(u);var c=O(p(67294)),y=p(38045),D=p(71776);const L="https://player.vimeo.com/api/player.js",M="Vimeo",k=t=>t.replace("/manage/videos","");class n extends c.Component{constructor(){super(...arguments),o(this,"callPlayer",y.callPlayer),o(this,"duration",null),o(this,"currentTime",null),o(this,"secondsLoaded",null),o(this,"mute",()=>{this.setMuted(!0)}),o(this,"unmute",()=>{this.setMuted(!1)}),o(this,"ref",e=>{this.container=e})}componentDidMount(){this.props.onMount&&this.props.onMount(this)}load(e){this.duration=null,(0,y.getSDK)(L,M).then(r=>{if(!this.container)return;const{playerOptions:l,title:a}=this.props.config;this.player=new r.Player(this.container,{url:k(e),autoplay:this.props.playing,muted:this.props.muted,loop:this.props.loop,playsinline:this.props.playsinline,controls:this.props.controls,...l}),this.player.ready().then(()=>{const s=this.container.querySelector("iframe");s.style.width="100%",s.style.height="100%",a&&(s.title=a)}).catch(this.props.onError),this.player.on("loaded",()=>{this.props.onReady(),this.refreshDuration()}),this.player.on("play",()=>{this.props.onPlay(),this.refreshDuration()}),this.player.on("pause",this.props.onPause),this.player.on("seeked",s=>this.props.onSeek(s.seconds)),this.player.on("ended",this.props.onEnded),this.player.on("error",this.props.onError),this.player.on("timeupdate",({seconds:s})=>{this.currentTime=s}),this.player.on("progress",({seconds:s})=>{this.secondsLoaded=s}),this.player.on("bufferstart",this.props.onBuffer),this.player.on("bufferend",this.props.onBufferEnd),this.player.on("playbackratechange",s=>this.props.onPlaybackRateChange(s.playbackRate))},this.props.onError)}refreshDuration(){this.player.getDuration().then(e=>{this.duration=e})}play(){const e=this.callPlayer("play");e&&e.catch(this.props.onError)}pause(){this.callPlayer("pause")}stop(){this.callPlayer("unload")}seekTo(e,r=!0){this.callPlayer("setCurrentTime",e),r||this.pause()}setVolume(e){this.callPlayer("setVolume",e)}setMuted(e){this.callPlayer("setMuted",e)}setLoop(e){this.callPlayer("setLoop",e)}setPlaybackRate(e){this.callPlayer("setPlaybackRate",e)}getDuration(){return this.duration}getCurrentTime(){return this.currentTime}getSecondsLoaded(){return this.secondsLoaded}render(){const{display:e}=this.props,r={width:"100%",height:"100%",overflow:"hidden",display:e};return c.default.createElement("div",{key:this.props.url,ref:this.ref,style:r})}}o(n,"displayName","Vimeo"),o(n,"canPlay",D.canPlay.vimeo),o(n,"forceLoad",!0)}}]);
