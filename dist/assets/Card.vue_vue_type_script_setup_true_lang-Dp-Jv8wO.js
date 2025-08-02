import{B as c,d as u,c as r,o as a,t as o,y as l,m as t,a as s,u as $,p as m,w as f,x as b}from"./index-C3glLUwq.js";var y=({dt:e})=>`
.p-card {
    background: ${e("card.background")};
    color: ${e("card.color")};
    box-shadow: ${e("card.shadow")};
    border-radius: ${e("card.border.radius")};
    display: flex;
    flex-direction: column;
}

.p-card-caption {
    display: flex;
    flex-direction: column;
    gap: ${e("card.caption.gap")};
}

.p-card-body {
    padding: ${e("card.body.padding")};
    display: flex;
    flex-direction: column;
    gap: ${e("card.body.gap")};
}

.p-card-title {
    font-size: ${e("card.title.font.size")};
    font-weight: ${e("card.title.font.weight")};
}

.p-card-subtitle {
    color: ${e("card.subtitle.color")};
}
`,h={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},v=c.extend({name:"card",style:y,classes:h}),g={name:"BaseCard",extends:u,style:v,provide:function(){return{$pcCard:this,$parentInstance:this}}},i={name:"Card",extends:g,inheritAttrs:!1};function k(e,n,d,p,C,B){return a(),r("div",t({class:e.cx("root")},e.ptmi("root")),[e.$slots.header?(a(),r("div",t({key:0,class:e.cx("header")},e.ptm("header")),[s(e.$slots,"header")],16)):o("",!0),l("div",t({class:e.cx("body")},e.ptm("body")),[e.$slots.title||e.$slots.subtitle?(a(),r("div",t({key:0,class:e.cx("caption")},e.ptm("caption")),[e.$slots.title?(a(),r("div",t({key:0,class:e.cx("title")},e.ptm("title")),[s(e.$slots,"title")],16)):o("",!0),e.$slots.subtitle?(a(),r("div",t({key:1,class:e.cx("subtitle")},e.ptm("subtitle")),[s(e.$slots,"subtitle")],16)):o("",!0)],16)):o("",!0),l("div",t({class:e.cx("content")},e.ptm("content")),[s(e.$slots,"content")],16),e.$slots.footer?(a(),r("div",t({key:1,class:e.cx("footer")},e.ptm("footer")),[s(e.$slots,"footer")],16)):o("",!0)],16)],16)}i.render=k;const S=$({__name:"Card",props:{pt:{}},setup(e){const n=e;return(d,p)=>(a(),m(b(i),{pt:n.pt},{content:f(()=>[s(d.$slots,"default")]),_:3},8,["pt"]))}});export{S as _};
