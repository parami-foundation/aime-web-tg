"use strict";(self.webpackChunkaime_tma=self.webpackChunkaime_tma||[]).push([[8301],{33121:function(T,m,e){e.r(m),e.d(m,{default:function(){return g}});var H=e(67294),s={chatContainer:"chatContainer___G1RSH",chatWrapper:"chatWrapper___rqFL1",chatContent:"chatContent___ZnbvF"},v=e(701),o=e(82188),h=e(58904),r={cardItemContainer:"cardItemContainer___S39db",cardItemWrapper:"cardItemWrapper___zukGI",cardItemHeader:"cardItemHeader___EU5Wl",cardItemHeaderDate:"cardItemHeaderDate___HZGp3",cardItemContent:"cardItemContent___sKhD1",cardItemContentAvatar:"cardItemContentAvatar___IgIoN",cardItemAvatarImg:"cardItemAvatarImg___XzQ7I",cardItemContentText:"cardItemContentText___pxYT1",cardItemContentTextName:"cardItemContentTextName___rsTFM",cardItemContentTextMessage:"cardItemContentTextMessage___n5jBq"},I=e(46393),u=e(30381),C=e.n(u),t=e(85893),x=function(c){var n=c.character,a=c.chatSession;return(0,t.jsx)("div",{className:r.cardItemContainer,onClick:function(){o.history.push("/chat/".concat(n==null?void 0:n.id,"?session=").concat(a==null?void 0:a.id))},children:(0,t.jsxs)("div",{className:r.cardItemWrapper,children:[(0,t.jsx)("div",{className:r.cardItemHeader,children:(0,t.jsx)("div",{className:r.cardItemHeaderDate,children:(0,t.jsx)("span",{children:!!(a!=null&&a.created_at)&&C()(a==null?void 0:a.created_at).format("YYYY-MM-DD HH:mm:ss")})})}),(0,t.jsxs)("div",{className:r.cardItemContent,children:[(0,t.jsx)("div",{className:r.cardItemContentAvatar,children:(0,t.jsx)("div",{className:r.cardItemAvatar,children:(0,t.jsx)(I.Z,{className:r.cardItemAvatarImg,src:n==null?void 0:n.avatar_url,fallback:e(41508),preview:!1})})}),(0,t.jsxs)("div",{className:r.cardItemContentText,children:[(0,t.jsx)("div",{className:r.cardItemContentTextName,children:n==null?void 0:n.name}),(0,t.jsx)("div",{className:r.cardItemContentTextMessage,children:"You\u2019re wasting my time. I literally..."})]})]})]})})},j=x,N=e(20081),f=function(){var c,n=(0,o.useModel)("useChat"),a=n.chatSession;return(0,t.jsx)(v.$,{children:(0,t.jsxs)("div",{className:s.chatContainer,children:[(0,t.jsx)("div",{className:s.chatWrapper,children:(0,t.jsx)("div",{className:s.chatContent,children:!!(a!=null&&a.keys())&&((c=Array.from(a==null?void 0:a.keys()))===null||c===void 0?void 0:c.map(function(d){var l=N.x.get(d),i=a==null?void 0:a.get(d);return!l||!i?null:(0,t.jsx)(j,{character:l,chatSession:i},d)}))})}),(0,t.jsx)(h.Z,{})]})})},g=f}}]);
