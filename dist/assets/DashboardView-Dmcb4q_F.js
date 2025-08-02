import{_ as st}from"./Breadcrumb.vue_vue_type_script_setup_true_lang-AYgv0TFk.js";import{_ as h}from"./Card.vue_vue_type_script_setup_true_lang-BksEgFa1.js";import{A as B}from"./api.service-b5QBwVQS.js";import{_ as g}from"./Icon.vue_vue_type_script_setup_true_lang-CVQb9Wi0.js";import{B as N,R as Y,d as I,U as G,m as f,V as nt,g as ot,W as K,X as S,n as J,q as M,a as A,p as $,o as u,w as b,Y as z,D as rt,_ as V,a0 as it,a1 as lt,j as L,a2 as ct,a3 as W,c as v,t as k,y as o,u as F,G as Q,v as _,b as c,z as m,a4 as ut,a5 as dt,I as bt,x as y,F as ft,A as pt,Q as ht,N as U,L as O}from"./index-BFriXCk4.js";import{_ as vt}from"./DataTable.vue_vue_type_script_setup_true_lang-WvfC2gTT.js";import{s as gt,a as mt,_ as xt}from"./DatePicker.vue_vue_type_script_setup_true_lang-DTeN0Tgc.js";import"./index-kKbbyj1F.js";import"./index-CFjhT2rJ.js";import"./Animation-DojD3Owr.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./Checkbox.vue_vue_type_script_setup_true_lang-DxfELvZD.js";import"./InputGroup.vue_vue_type_script_setup_true_lang-AgrzrgF7.js";import"./index-DXDKuAte.js";import"./index-Kvn03z1S.js";import"./index-DcNogzml.js";import"./index-DPNwHT-c.js";import"./index-d0we0FJS.js";var yt={root:function(e){var s=e.instance,n=e.props;return["p-tab",{"p-tab-active":s.active,"p-disabled":n.disabled}]}},wt=N.extend({name:"tab",classes:yt}),$t={name:"BaseTab",extends:I,props:{value:{type:[String,Number],default:void 0},disabled:{type:Boolean,default:!1},as:{type:[String,Object],default:"BUTTON"},asChild:{type:Boolean,default:!1}},style:wt,provide:function(){return{$pcTab:this,$parentInstance:this}}},X={name:"Tab",extends:$t,inheritAttrs:!1,inject:["$pcTabs","$pcTabList"],methods:{onFocus:function(){this.$pcTabs.selectOnFocus&&this.changeActiveValue()},onClick:function(){this.changeActiveValue()},onKeydown:function(e){switch(e.code){case"ArrowRight":this.onArrowRightKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"PageDown":this.onPageDownKey(e);break;case"PageUp":this.onPageUpKey(e);break;case"Enter":case"NumpadEnter":case"Space":this.onEnterKey(e);break}},onArrowRightKey:function(e){var s=this.findNextTab(e.currentTarget);s?this.changeFocusedTab(e,s):this.onHomeKey(e),e.preventDefault()},onArrowLeftKey:function(e){var s=this.findPrevTab(e.currentTarget);s?this.changeFocusedTab(e,s):this.onEndKey(e),e.preventDefault()},onHomeKey:function(e){var s=this.findFirstTab();this.changeFocusedTab(e,s),e.preventDefault()},onEndKey:function(e){var s=this.findLastTab();this.changeFocusedTab(e,s),e.preventDefault()},onPageDownKey:function(e){this.scrollInView(this.findLastTab()),e.preventDefault()},onPageUpKey:function(e){this.scrollInView(this.findFirstTab()),e.preventDefault()},onEnterKey:function(e){this.changeActiveValue(),e.preventDefault()},findNextTab:function(e){var s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,n=s?e:e.nextElementSibling;return n?S(n,"data-p-disabled")||S(n,"data-pc-section")==="activebar"?this.findNextTab(n):K(n,'[data-pc-name="tab"]'):null},findPrevTab:function(e){var s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,n=s?e:e.previousElementSibling;return n?S(n,"data-p-disabled")||S(n,"data-pc-section")==="activebar"?this.findPrevTab(n):K(n,'[data-pc-name="tab"]'):null},findFirstTab:function(){return this.findNextTab(this.$pcTabList.$refs.tabs.firstElementChild,!0)},findLastTab:function(){return this.findPrevTab(this.$pcTabList.$refs.tabs.lastElementChild,!0)},changeActiveValue:function(){this.$pcTabs.updateValue(this.value)},changeFocusedTab:function(e,s){ot(s),this.scrollInView(s)},scrollInView:function(e){var s;e==null||(s=e.scrollIntoView)===null||s===void 0||s.call(e,{block:"nearest"})}},computed:{active:function(){var e;return nt((e=this.$pcTabs)===null||e===void 0?void 0:e.d_value,this.value)},id:function(){var e;return"".concat((e=this.$pcTabs)===null||e===void 0?void 0:e.$id,"_tab_").concat(this.value)},ariaControls:function(){var e;return"".concat((e=this.$pcTabs)===null||e===void 0?void 0:e.$id,"_tabpanel_").concat(this.value)},attrs:function(){return f(this.asAttrs,this.a11yAttrs,this.ptmi("root",this.ptParams))},asAttrs:function(){return this.as==="BUTTON"?{type:"button",disabled:this.disabled}:void 0},a11yAttrs:function(){return{id:this.id,tabindex:this.active?this.$pcTabs.tabindex:-1,role:"tab","aria-selected":this.active,"aria-controls":this.ariaControls,"data-pc-name":"tab","data-p-disabled":this.disabled,"data-p-active":this.active,onFocus:this.onFocus,onKeydown:this.onKeydown}},ptParams:function(){return{context:{active:this.active}}},dataP:function(){return G({active:this.active})}},directives:{ripple:Y}};function _t(t,e,s,n,r,a){var d=J("ripple");return t.asChild?A(t.$slots,"default",{key:1,dataP:a.dataP,class:rt(t.cx("root")),active:a.active,a11yAttrs:a.a11yAttrs,onClick:a.onClick}):M((u(),$(z(t.as),f({key:0,class:t.cx("root"),"data-p":a.dataP,onClick:a.onClick},a.attrs),{default:b(function(){return[A(t.$slots,"default")]}),_:3},16,["class","data-p","onClick"])),[[d]])}X.render=_t;var kt={root:"p-tablist",content:function(e){var s=e.instance;return["p-tablist-content",{"p-tablist-viewport":s.$pcTabs.scrollable}]},tabList:"p-tablist-tab-list",activeBar:"p-tablist-active-bar",prevButton:"p-tablist-prev-button p-tablist-nav-button",nextButton:"p-tablist-next-button p-tablist-nav-button"},Pt=N.extend({name:"tablist",classes:kt}),Tt={name:"BaseTabList",extends:I,props:{},style:Pt,provide:function(){return{$pcTabList:this,$parentInstance:this}}},Z={name:"TabList",extends:Tt,inheritAttrs:!1,inject:["$pcTabs"],data:function(){return{isPrevButtonEnabled:!1,isNextButtonEnabled:!0}},resizeObserver:void 0,watch:{showNavigators:function(e){e?this.bindResizeObserver():this.unbindResizeObserver()},activeValue:{flush:"post",handler:function(){this.updateInkBar()}}},mounted:function(){var e=this;setTimeout(function(){e.updateInkBar()},150),this.showNavigators&&(this.updateButtonState(),this.bindResizeObserver())},updated:function(){this.showNavigators&&this.updateButtonState()},beforeUnmount:function(){this.unbindResizeObserver()},methods:{onScroll:function(e){this.showNavigators&&this.updateButtonState(),e.preventDefault()},onPrevButtonClick:function(){var e=this.$refs.content,s=this.getVisibleButtonWidths(),n=V(e)-s,r=Math.abs(e.scrollLeft),a=n*.8,d=r-a,x=Math.max(d,0);e.scrollLeft=W(e)?-1*x:x},onNextButtonClick:function(){var e=this.$refs.content,s=this.getVisibleButtonWidths(),n=V(e)-s,r=Math.abs(e.scrollLeft),a=n*.8,d=r+a,x=e.scrollWidth-n,w=Math.min(d,x);e.scrollLeft=W(e)?-1*w:w},bindResizeObserver:function(){var e=this;this.resizeObserver=new ResizeObserver(function(){return e.updateButtonState()}),this.resizeObserver.observe(this.$refs.list)},unbindResizeObserver:function(){var e;(e=this.resizeObserver)===null||e===void 0||e.unobserve(this.$refs.list),this.resizeObserver=void 0},updateInkBar:function(){var e=this.$refs,s=e.content,n=e.inkbar,r=e.tabs;if(n){var a=K(s,'[data-pc-name="tab"][data-p-active="true"]');this.$pcTabs.isVertical()?(n.style.height=lt(a)+"px",n.style.top=L(a).top-L(r).top+"px"):(n.style.width=ct(a)+"px",n.style.left=L(a).left-L(r).left+"px")}},updateButtonState:function(){var e=this.$refs,s=e.list,n=e.content,r=n.scrollTop,a=n.scrollWidth,d=n.scrollHeight,x=n.offsetWidth,w=n.offsetHeight,P=Math.abs(n.scrollLeft),T=[V(n),it(n)],j=T[0],E=T[1];this.$pcTabs.isVertical()?(this.isPrevButtonEnabled=r!==0,this.isNextButtonEnabled=s.offsetHeight>=w&&parseInt(r)!==d-E):(this.isPrevButtonEnabled=P!==0,this.isNextButtonEnabled=s.offsetWidth>=x&&parseInt(P)!==a-j)},getVisibleButtonWidths:function(){var e=this.$refs,s=e.prevButton,n=e.nextButton,r=0;return this.showNavigators&&(r=((s==null?void 0:s.offsetWidth)||0)+((n==null?void 0:n.offsetWidth)||0)),r}},computed:{templates:function(){return this.$pcTabs.$slots},activeValue:function(){return this.$pcTabs.d_value},showNavigators:function(){return this.$pcTabs.scrollable&&this.$pcTabs.showNavigators},prevButtonAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.previous:void 0},nextButtonAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.next:void 0},dataP:function(){return G({scrollable:this.$pcTabs.scrollable})}},components:{ChevronLeftIcon:mt,ChevronRightIcon:gt},directives:{ripple:Y}},Bt=["data-p"],Ct=["aria-label","tabindex"],Dt=["data-p"],St=["aria-orientation"],Lt=["aria-label","tabindex"];function Ot(t,e,s,n,r,a){var d=J("ripple");return u(),v("div",f({ref:"list",class:t.cx("root"),"data-p":a.dataP},t.ptmi("root")),[a.showNavigators&&r.isPrevButtonEnabled?M((u(),v("button",f({key:0,ref:"prevButton",type:"button",class:t.cx("prevButton"),"aria-label":a.prevButtonAriaLabel,tabindex:a.$pcTabs.tabindex,onClick:e[0]||(e[0]=function(){return a.onPrevButtonClick&&a.onPrevButtonClick.apply(a,arguments)})},t.ptm("prevButton"),{"data-pc-group-section":"navigator"}),[(u(),$(z(a.templates.previcon||"ChevronLeftIcon"),f({"aria-hidden":"true"},t.ptm("prevIcon")),null,16))],16,Ct)),[[d]]):k("",!0),o("div",f({ref:"content",class:t.cx("content"),onScroll:e[1]||(e[1]=function(){return a.onScroll&&a.onScroll.apply(a,arguments)}),"data-p":a.dataP},t.ptm("content")),[o("div",f({ref:"tabs",class:t.cx("tabList"),role:"tablist","aria-orientation":a.$pcTabs.orientation||"horizontal"},t.ptm("tabList")),[A(t.$slots,"default"),o("span",f({ref:"inkbar",class:t.cx("activeBar"),role:"presentation","aria-hidden":"true"},t.ptm("activeBar")),null,16)],16,St)],16,Dt),a.showNavigators&&r.isNextButtonEnabled?M((u(),v("button",f({key:1,ref:"nextButton",type:"button",class:t.cx("nextButton"),"aria-label":a.nextButtonAriaLabel,tabindex:a.$pcTabs.tabindex,onClick:e[2]||(e[2]=function(){return a.onNextButtonClick&&a.onNextButtonClick.apply(a,arguments)})},t.ptm("nextButton"),{"data-pc-group-section":"navigator"}),[(u(),$(z(a.templates.nexticon||"ChevronRightIcon"),f({"aria-hidden":"true"},t.ptm("nextIcon")),null,16))],16,Lt)),[[d]]):k("",!0)],16,Bt)}Z.render=Ot;var At=({dt:t})=>`
.p-tabs {
    display: flex;
    flex-direction: column;
}

.p-tablist {
    display: flex;
    position: relative;
}

.p-tabs-scrollable > .p-tablist {
    overflow: hidden;
}

.p-tablist-viewport {
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scrollbar-width: none;
    overscroll-behavior: contain auto;
}

.p-tablist-viewport::-webkit-scrollbar {
    display: none;
}

.p-tablist-tab-list {
    position: relative;
    display: flex;
    background: ${t("tabs.tablist.background")};
    border-style: solid;
    border-color: ${t("tabs.tablist.border.color")};
    border-width: ${t("tabs.tablist.border.width")};
}

.p-tablist-content {
    flex-grow: 1;
}

.p-tablist-nav-button {
    all: unset;
    position: absolute !important;
    flex-shrink: 0;
    inset-block-start: 0;
    z-index: 2;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${t("tabs.nav.button.background")};
    color: ${t("tabs.nav.button.color")};
    width: ${t("tabs.nav.button.width")};
    transition: color ${t("tabs.transition.duration")}, outline-color ${t("tabs.transition.duration")}, box-shadow ${t("tabs.transition.duration")};
    box-shadow: ${t("tabs.nav.button.shadow")};
    outline-color: transparent;
    cursor: pointer;
}

.p-tablist-nav-button:focus-visible {
    z-index: 1;
    box-shadow: ${t("tabs.nav.button.focus.ring.shadow")};
    outline: ${t("tabs.nav.button.focus.ring.width")} ${t("tabs.nav.button.focus.ring.style")} ${t("tabs.nav.button.focus.ring.color")};
    outline-offset: ${t("tabs.nav.button.focus.ring.offset")};
}

.p-tablist-nav-button:hover {
    color: ${t("tabs.nav.button.hover.color")};
}

.p-tablist-prev-button {
    inset-inline-start: 0;
}

.p-tablist-next-button {
    inset-inline-end: 0;
}

.p-tablist-prev-button:dir(rtl),
.p-tablist-next-button:dir(rtl) {
    transform: rotate(180deg);
}

.p-tab {
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
    position: relative;
    border-style: solid;
    white-space: nowrap;
    gap: ${t("tabs.tab.gap")};
    background: ${t("tabs.tab.background")};
    border-width: ${t("tabs.tab.border.width")};
    border-color: ${t("tabs.tab.border.color")};
    color: ${t("tabs.tab.color")};
    padding: ${t("tabs.tab.padding")};
    font-weight: ${t("tabs.tab.font.weight")};
    transition: background ${t("tabs.transition.duration")}, border-color ${t("tabs.transition.duration")}, color ${t("tabs.transition.duration")}, outline-color ${t("tabs.transition.duration")}, box-shadow ${t("tabs.transition.duration")};
    margin: ${t("tabs.tab.margin")};
    outline-color: transparent;
}

.p-tab:not(.p-disabled):focus-visible {
    z-index: 1;
    box-shadow: ${t("tabs.tab.focus.ring.shadow")};
    outline: ${t("tabs.tab.focus.ring.width")} ${t("tabs.tab.focus.ring.style")} ${t("tabs.tab.focus.ring.color")};
    outline-offset: ${t("tabs.tab.focus.ring.offset")};
}

.p-tab:not(.p-tab-active):not(.p-disabled):hover {
    background: ${t("tabs.tab.hover.background")};
    border-color: ${t("tabs.tab.hover.border.color")};
    color: ${t("tabs.tab.hover.color")};
}

.p-tab-active {
    background: ${t("tabs.tab.active.background")};
    border-color: ${t("tabs.tab.active.border.color")};
    color: ${t("tabs.tab.active.color")};
}

.p-tabpanels {
    background: ${t("tabs.tabpanel.background")};
    color: ${t("tabs.tabpanel.color")};
    padding: ${t("tabs.tabpanel.padding")};
    outline: 0 none;
}

.p-tabpanel:focus-visible {
    box-shadow: ${t("tabs.tabpanel.focus.ring.shadow")};
    outline: ${t("tabs.tabpanel.focus.ring.width")} ${t("tabs.tabpanel.focus.ring.style")} ${t("tabs.tabpanel.focus.ring.color")};
    outline-offset: ${t("tabs.tabpanel.focus.ring.offset")};
}

.p-tablist-active-bar {
    z-index: 1;
    display: block;
    position: absolute;
    inset-block-end: ${t("tabs.active.bar.bottom")};
    height: ${t("tabs.active.bar.height")};
    background: ${t("tabs.active.bar.background")};
    transition: 250ms cubic-bezier(0.35, 0, 0.25, 1);
}
`,Nt={root:function(e){var s=e.props;return["p-tabs p-component",{"p-tabs-scrollable":s.scrollable}]}},It=N.extend({name:"tabs",style:At,classes:Nt}),jt={name:"BaseTabs",extends:I,props:{value:{type:[String,Number],default:void 0},lazy:{type:Boolean,default:!1},scrollable:{type:Boolean,default:!1},showNavigators:{type:Boolean,default:!0},tabindex:{type:Number,default:0},selectOnFocus:{type:Boolean,default:!1}},style:It,provide:function(){return{$pcTabs:this,$parentInstance:this}}},tt={name:"Tabs",extends:jt,inheritAttrs:!1,emits:["update:value"],data:function(){return{d_value:this.value}},watch:{value:function(e){this.d_value=e}},methods:{updateValue:function(e){this.d_value!==e&&(this.d_value=e,this.$emit("update:value",e))},isVertical:function(){return this.orientation==="vertical"}}};function Et(t,e,s,n,r,a){return u(),v("div",f({class:t.cx("root")},t.ptmi("root")),[A(t.$slots,"default")],16)}tt.render=Et;const C={getDashboardTotalData:()=>B.get("dashboard/total-data"),getDashboardLowStockData:()=>B.get("dashboard/low-stock"),getDashboardChartDataProductIn:t=>B.get("dashboard/chart/stock-in",{params:t}),getDashboardChartDataProductOut:t=>B.get("dashboard/chart/stock-out",{params:t}),getDashboardChartDataProductMutation:t=>B.get("dashboard/chart/stock-mutation",{params:t})},Vt={class:"w-full text-xs"},Kt={class:"grid grid-rows-2 gap-3"},Mt={class:"grid sm:grid-cols-4 gap-3"},zt={class:"flex flex-row gap-2 justify-between"},Ft={class:"flex flex-col gap-2 text-black"},Rt={class:"font-bold md:text-lg text-sm"},Wt={class:"flex items-center justify-center"},Ut={class:"flex flex-row gap-2 justify-between"},Ht={class:"flex flex-col gap-2 text-black"},qt={class:"font-bold md:text-lg text-sm"},Yt={class:"flex items-center justify-center"},Gt={class:"flex flex-row gap-2 justify-between"},Jt={class:"flex flex-col gap-2 text-black"},Qt={class:"font-bold md:text-lg text-sm"},Xt={class:"flex items-center justify-center"},Zt={class:"flex flex-row gap-2 justify-between"},te={class:"flex flex-col gap-2 text-black"},ee={class:"font-bold md:text-lg text-sm"},ae={class:"flex items-center justify-center"},se={class:"grid sm:grid-cols-4 gap-3"},ne={class:"flex flex-row gap-2 justify-between"},oe={class:"flex flex-col gap-2 text-black"},re={class:"font-bold md:text-lg text-sm"},ie={class:"flex items-center justify-center"},le={class:"flex flex-row gap-2 justify-between"},ce={class:"flex flex-col gap-2 text-black"},ue={class:"font-bold md:text-lg text-sm"},de={class:"flex items-center justify-center"},be={class:"flex flex-row gap-2 justify-between"},fe={class:"flex flex-col gap-2 text-black"},pe={class:"font-bold md:text-lg text-sm"},he={class:"flex items-center justify-center"},ve={class:"flex flex-row gap-2 justify-between"},ge={class:"flex flex-col gap-2 text-black"},me={class:"font-bold md:text-lg text-sm"},xe={class:"flex items-center justify-center"},ye=F({__name:"DashboardTotalData",setup(t){Q(()=>{s()});const e=_(),s=async()=>{try{const{data:n}=await C.getDashboardTotalData();e.value=n.data}catch(n){console.error("Error fetching dashboard total data:",n)}};return(n,r)=>(u(),v("div",Vt,[o("div",Kt,[o("div",Mt,[c(h,{class:"w-full"},{default:b(()=>{var a;return[o("div",zt,[o("div",Ft,[r[0]||(r[0]=o("span",{class:"font-medium text-xs"},"Data Barang",-1)),o("span",Rt,m((a=e.value)==null?void 0:a.totalProducts),1)]),o("div",Wt,[c(g,{icon:"box-3",class:"md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default",type:"fill"})])])]}),_:1}),c(h,{class:"w-full"},{default:b(()=>{var a;return[o("div",Ut,[o("div",Ht,[r[1]||(r[1]=o("span",{class:"font-medium text-xs"},"Data Pengguna",-1)),o("span",qt,m((a=e.value)==null?void 0:a.totalUsers),1)]),o("div",Yt,[c(g,{icon:"user",class:"md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default",type:"fill"})])])]}),_:1}),c(h,{class:"w-full"},{default:b(()=>{var a;return[o("div",Gt,[o("div",Jt,[r[2]||(r[2]=o("span",{class:"font-medium text-xs"},"Produk Masuk (Pending)",-1)),o("span",Qt,m((a=e.value)==null?void 0:a.totalProductInPending),1)]),o("div",Xt,[c(g,{icon:"folder-warning",class:"md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default",type:"fill"})])])]}),_:1}),c(h,{class:"w-full"},{default:b(()=>{var a;return[o("div",Zt,[o("div",te,[r[3]||(r[3]=o("span",{class:"font-medium text-xs"},"Produk Masuk (Selesai)",-1)),o("span",ee,m((a=e.value)==null?void 0:a.totalProductInCompleted),1)]),o("div",ae,[c(g,{icon:"folder-check",class:"md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default",type:"fill"})])])]}),_:1})]),o("div",se,[c(h,{class:"w-full"},{default:b(()=>{var a;return[o("div",ne,[o("div",oe,[r[4]||(r[4]=o("span",{class:"font-medium text-xs"},"Produk Keluar (Pending)",-1)),o("span",re,m((a=e.value)==null?void 0:a.totalProductOutPending),1)]),o("div",ie,[c(g,{icon:"folder-warning",class:"md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default",type:"fill"})])])]}),_:1}),c(h,{class:"w-full"},{default:b(()=>{var a;return[o("div",le,[o("div",ce,[r[5]||(r[5]=o("span",{class:"font-medium text-xs"},"Produk Keluar (Selesai)",-1)),o("span",ue,m((a=e.value)==null?void 0:a.totalProductOutCompleted),1)]),o("div",de,[c(g,{icon:"folder-check",class:"md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default",type:"fill"})])])]}),_:1}),c(h,{class:"w-full"},{default:b(()=>{var a;return[o("div",be,[o("div",fe,[r[6]||(r[6]=o("span",{class:"font-medium text-xs"},"Produk Mutasi (Pending)",-1)),o("span",pe,m((a=e.value)==null?void 0:a.totalProductMutationPending),1)]),o("div",he,[c(g,{icon:"folder-warning",class:"md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default",type:"fill"})])])]}),_:1}),c(h,{class:"w-full"},{default:b(()=>{var a;return[o("div",ve,[o("div",ge,[r[7]||(r[7]=o("span",{class:"font-medium text-xs"},"Produk Mutasi (Selesai)",-1)),o("span",me,m((a=e.value)==null?void 0:a.totalProductMutationCompleted),1)]),o("div",xe,[c(g,{icon:"folder-check",class:"md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default",type:"fill"})])])]}),_:1})])])]))}});var we={root:{position:"relative"}},$e={root:"p-chart"},_e=N.extend({name:"chart",classes:$e,inlineStyles:we}),ke={name:"BaseChart",extends:I,props:{type:String,data:null,options:null,plugins:null,width:{type:Number,default:300},height:{type:Number,default:150},canvasProps:{type:null,default:null}},style:_e,provide:function(){return{$pcChart:this,$parentInstance:this}}},et={name:"Chart",extends:ke,inheritAttrs:!1,emits:["select","loaded"],chart:null,watch:{data:{handler:function(){this.reinit()},deep:!0},type:function(){this.reinit()},options:function(){this.reinit()}},mounted:function(){this.initChart()},beforeUnmount:function(){this.chart&&(this.chart.destroy(),this.chart=null)},methods:{initChart:function(){var e=this;ut(()=>import("./auto-CSZ8dA-i.js"),[]).then(function(s){e.chart&&(e.chart.destroy(),e.chart=null),s&&s.default&&(e.chart=new s.default(e.$refs.canvas,{type:e.type,data:e.data,options:e.options,plugins:e.plugins})),e.$emit("loaded",e.chart)})},getCanvas:function(){return this.$canvas},getChart:function(){return this.chart},getBase64Image:function(){return this.chart.toBase64Image()},refresh:function(){this.chart&&this.chart.update()},reinit:function(){this.initChart()},onCanvasClick:function(e){if(this.chart){var s=this.chart.getElementsAtEventForMode(e,"nearest",{intersect:!0},!1),n=this.chart.getElementsAtEventForMode(e,"dataset",{intersect:!0},!1);s&&s[0]&&n&&this.$emit("select",{originalEvent:e,element:s[0],dataset:n})}},generateLegend:function(){if(this.chart)return this.chart.generateLegend()}}};function D(t){"@babel/helpers - typeof";return D=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},D(t)}function H(t,e){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),s.push.apply(s,n)}return s}function q(t){for(var e=1;e<arguments.length;e++){var s=arguments[e]!=null?arguments[e]:{};e%2?H(Object(s),!0).forEach(function(n){Pe(t,n,s[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):H(Object(s)).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(s,n))})}return t}function Pe(t,e,s){return(e=Te(e))in t?Object.defineProperty(t,e,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[e]=s,t}function Te(t){var e=Be(t,"string");return D(e)=="symbol"?e:e+""}function Be(t,e){if(D(t)!="object"||!t)return t;var s=t[Symbol.toPrimitive];if(s!==void 0){var n=s.call(t,e);if(D(n)!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var Ce=["width","height"];function De(t,e,s,n,r,a){return u(),v("div",f({class:t.cx("root"),style:t.sx("root")},t.ptmi("root")),[o("canvas",f({ref:"canvas",width:t.width,height:t.height,onClick:e[0]||(e[0]=function(d){return a.onCanvasClick(d)})},q(q({},t.canvasProps),t.ptm("canvas"))),null,16,Ce)],16)}et.render=De;const Se={class:"w-full text-xs"},Le=F({__name:"TabMenu",props:dt({tabLabels:{default:[]}},{activeIndex:{default:0},activeIndexModifiers:{}}),emits:["update:activeIndex"],setup(t){const e=bt(t,"activeIndex"),s=t;return(n,r)=>(u(),v("div",Se,[c(y(tt),{value:e.value,"onUpdate:value":r[0]||(r[0]=a=>e.value=a)},{default:b(()=>[c(y(Z),{pt:{tabList:{class:"!border-bottom-1 !border-blue-200"},activeBar:{class:"!bg-primary"}}},{default:b(()=>[(u(!0),v(ft,null,pt(s.tabLabels,(a,d)=>(u(),$(y(X),{value:d,class:"!p-2"},{default:b(()=>[ht(m(a),1)]),_:2},1032,["value"]))),256))]),_:1})]),_:1},8,["value"])]))}}),Oe={id:"main-view",class:"bg-[#eeedf2] w-full overflow-y-hidden"},Ae={class:"flex flex-col gap-3 p-4"},Ne={class:"flex items-center justify-between"},Ie={key:0,class:"pt-2"},je={class:"overflow-x-auto p-2"},Ee={class:"grid grid-cols-4"},Ve={class:"py-4 overflow-auto"},Ke={class:"flex flex-col gap-2"},na=F({__name:"DashboardView",setup(t){const e=_(),s=_(),n=_(new Date),r=_(0),a=_(!1);Q(()=>{j()});const d=[{name:"Dashboard",route:"/dashboard"}],x=[{header:"Kode Produk",field:"product.code",sortable:!1,bodyTemplate:i=>i.codeProduct||"-"},{header:"Nama Produk",field:"product.name",sortable:!1,bodyTemplate:i=>i.productName||"-"},{header:"Merek",field:"product.brand.name",sortable:!1,bodyTemplate:i=>i.brand||"-"},{header:"Jumlah Stok",field:"quantity",sortable:!1,bodyTemplate:i=>i.quantity!==void 0?i.quantity.toLocaleString():"-"},{header:"Lokasi Stok",field:"location.name",sortable:!1,bodyTemplate:i=>i.location||"-"}],w=async()=>{var i;try{const l={year:(i=n.value)==null?void 0:i.getFullYear()},{data:p}=await C.getDashboardChartDataProductIn(l);s.value=p.data}catch(l){console.error("Error fetching chart data:",l)}},P=async()=>{var i;try{const l={year:(i=n.value)==null?void 0:i.getFullYear()},{data:p}=await C.getDashboardChartDataProductOut(l);s.value=p.data}catch(l){console.error("Error fetching chart data:",l)}},T=async()=>{var i;try{const l={year:(i=n.value)==null?void 0:i.getFullYear()},{data:p}=await C.getDashboardChartDataProductMutation(l);s.value=p.data}catch(l){console.error("Error fetching chart data:",l)}},j=()=>{const i=getComputedStyle(document.documentElement),l=i.getPropertyValue("--p-text-color"),p=i.getPropertyValue("--p-text-muted-color"),R=i.getPropertyValue("--p-content-border-color");e.value={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:l}}},scales:{x:{ticks:{color:p},grid:{color:R}},y:{beginAtZero:!0,ticks:{color:p},grid:{color:R}}}}},E=()=>{a.value=!a.value},at=async()=>{try{const{data:i}=await C.getDashboardLowStockData();return i}catch(i){console.error("Error fetching table data:",i)}};return U(()=>a.value,()=>{a.value?r.value===0?w():r.value===1?P():r.value===2&&T():(s.value=void 0,e.value=void 0,n.value=new Date)},{immediate:!0}),U([n,r],()=>{a.value&&(r.value===0?w():r.value===1?P():r.value===2&&T())},{immediate:!0}),(i,l)=>(u(),v("div",Oe,[o("div",Ae,[c(st,{menus:d}),y(O)("setting_user").view?(u(),$(ye,{key:0})):k("",!0),y(O)("product_in").view&&y(O)("product_out").view&&y(O)("product_mutation").view?(u(),$(h,{key:1,class:"w-full"},{default:b(()=>[o("div",{onClick:E,class:"w-full bg-blue-500/80 text-white p-2 rounded-xl hover:cursor-pointer"},[o("div",Ne,[l[2]||(l[2]=o("span",{class:"text-sm"},"Trend Transaksi Produk ",-1)),c(g,{icon:a.value?"arrow-up-s":"arrow-down-s",class:"text-xl !h-full"},null,8,["icon"])])]),a.value?(u(),v("div",Ie,[c(Le,{"active-index":r.value,"onUpdate:activeIndex":l[0]||(l[0]=p=>r.value=p),"tab-labels":["Produk Masuk","Produk Keluar","Produk Mutasi"]},null,8,["active-index"]),o("div",je,[o("div",Ee,[o("div",null,[l[3]||(l[3]=o("span",{class:"text-xs font-medium"},"Berdasarkan Tahun",-1)),c(xt,{"model-value":n.value,"onUpdate:modelValue":l[1]||(l[1]=p=>n.value=p),view:"year",dateFormat:"yy"},null,8,["model-value"])])]),o("div",Ve,[a.value&&n.value?(u(),$(y(et),{key:0,type:"bar",data:s.value,options:e.value,pt:{root:{style:"width: 1200px;"},canvas:{class:"!w-full"}}},null,8,["data","options"])):k("",!0)])])])):k("",!0)]),_:1})):k("",!0),c(h,{pt:{body:{class:"!p-4 md:!p-5"}}},{default:b(()=>[o("div",Ke,[l[4]||(l[4]=o("div",null,[o("span",{class:"text-sm font-medium"},"Stock Barang yang telah mencapai batas minimum")],-1)),c(vt,{"data-key":"id",columns:x,"fetch-function":at,"use-options":!1,"table-name":"table-dashboard-low-stock","selection-type":"none"})])]),_:1})])]))}});export{na as default};
