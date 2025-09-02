import{a9 as y,c as b,o as c,y as d,m as r,B as v,aC as g,U as $,aQ as C,V as w,r as p,a as S,p as s,t as P,D as B,u as V,a5 as z,I as _,b as I,x as k,z as A}from"./index-yZgVnA0i.js";import{s as T}from"./InputGroup.vue_vue_type_script_setup_true_lang-ArITdiN5.js";var x={name:"MinusIcon",extends:y};function G(e,n,o,i,a,t){return c(),b("svg",r({width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.pti()),n[0]||(n[0]=[d("path",{d:"M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z",fill:"currentColor"},null,-1)]),16)}x.render=G;var O=({dt:e})=>`
.p-checkbox {
    position: relative;
    display: inline-flex;
    user-select: none;
    vertical-align: bottom;
    width: ${e("checkbox.width")};
    height: ${e("checkbox.height")};
}

.p-checkbox-input {
    cursor: pointer;
    appearance: none;
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: 1;
    outline: 0 none;
    border: 1px solid transparent;
    border-radius: ${e("checkbox.border.radius")};
}

.p-checkbox-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${e("checkbox.border.radius")};
    border: 1px solid ${e("checkbox.border.color")};
    background: ${e("checkbox.background")};
    width: ${e("checkbox.width")};
    height: ${e("checkbox.height")};
    transition: background ${e("checkbox.transition.duration")}, color ${e("checkbox.transition.duration")}, border-color ${e("checkbox.transition.duration")}, box-shadow ${e("checkbox.transition.duration")}, outline-color ${e("checkbox.transition.duration")};
    outline-color: transparent;
    box-shadow: ${e("checkbox.shadow")};
}

.p-checkbox-icon {
    transition-duration: ${e("checkbox.transition.duration")};
    color: ${e("checkbox.icon.color")};
    font-size: ${e("checkbox.icon.size")};
    width: ${e("checkbox.icon.size")};
    height: ${e("checkbox.icon.size")};
}

.p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
    border-color: ${e("checkbox.hover.border.color")};
}

.p-checkbox-checked .p-checkbox-box {
    border-color: ${e("checkbox.checked.border.color")};
    background: ${e("checkbox.checked.background")};
}

.p-checkbox-checked .p-checkbox-icon {
    color: ${e("checkbox.icon.checked.color")};
}

.p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
    background: ${e("checkbox.checked.hover.background")};
    border-color: ${e("checkbox.checked.hover.border.color")};
}

.p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
    color: ${e("checkbox.icon.checked.hover.color")};
}

.p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
    border-color: ${e("checkbox.focus.border.color")};
    box-shadow: ${e("checkbox.focus.ring.shadow")};
    outline: ${e("checkbox.focus.ring.width")} ${e("checkbox.focus.ring.style")} ${e("checkbox.focus.ring.color")};
    outline-offset: ${e("checkbox.focus.ring.offset")};
}

.p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
    border-color: ${e("checkbox.checked.focus.border.color")};
}

.p-checkbox.p-invalid > .p-checkbox-box {
    border-color: ${e("checkbox.invalid.border.color")};
}

.p-checkbox.p-variant-filled .p-checkbox-box {
    background: ${e("checkbox.filled.background")};
}

.p-checkbox-checked.p-variant-filled .p-checkbox-box {
    background: ${e("checkbox.checked.background")};
}

.p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
    background: ${e("checkbox.checked.hover.background")};
}

.p-checkbox.p-disabled {
    opacity: 1;
}

.p-checkbox.p-disabled .p-checkbox-box {
    background: ${e("checkbox.disabled.background")};
    border-color: ${e("checkbox.checked.disabled.border.color")};
}

.p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
    color: ${e("checkbox.icon.disabled.color")};
}

.p-checkbox-sm,
.p-checkbox-sm .p-checkbox-box {
    width: ${e("checkbox.sm.width")};
    height: ${e("checkbox.sm.height")};
}

.p-checkbox-sm .p-checkbox-icon {
    font-size: ${e("checkbox.icon.sm.size")};
    width: ${e("checkbox.icon.sm.size")};
    height: ${e("checkbox.icon.sm.size")};
}

.p-checkbox-lg,
.p-checkbox-lg .p-checkbox-box {
    width: ${e("checkbox.lg.width")};
    height: ${e("checkbox.lg.height")};
}

.p-checkbox-lg .p-checkbox-icon {
    font-size: ${e("checkbox.icon.lg.size")};
    width: ${e("checkbox.icon.lg.size")};
    height: ${e("checkbox.icon.lg.size")};
}
`,N={root:function(n){var o=n.instance,i=n.props;return["p-checkbox p-component",{"p-checkbox-checked":o.checked,"p-disabled":i.disabled,"p-invalid":o.$pcCheckboxGroup?o.$pcCheckboxGroup.$invalid:o.$invalid,"p-variant-filled":o.$variant==="filled","p-checkbox-sm p-inputfield-sm":i.size==="small","p-checkbox-lg p-inputfield-lg":i.size==="large"}]},box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},j=v.extend({name:"checkbox",style:O,classes:N}),F={name:"BaseCheckbox",extends:T,props:{value:null,binary:Boolean,indeterminate:{type:Boolean,default:!1},trueValue:{type:null,default:!0},falseValue:{type:null,default:!1},readonly:{type:Boolean,default:!1},required:{type:Boolean,default:!1},tabindex:{type:Number,default:null},inputId:{type:String,default:null},inputClass:{type:[String,Object],default:null},inputStyle:{type:Object,default:null},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:j,provide:function(){return{$pcCheckbox:this,$parentInstance:this}}};function l(e){"@babel/helpers - typeof";return l=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},l(e)}function q(e,n,o){return(n=L(n))in e?Object.defineProperty(e,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[n]=o,e}function L(e){var n=M(e,"string");return l(n)=="symbol"?n:n+""}function M(e,n){if(l(e)!="object"||!e)return e;var o=e[Symbol.toPrimitive];if(o!==void 0){var i=o.call(e,n);if(l(i)!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(e)}function U(e){return K(e)||D(e)||H(e)||E()}function E(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function H(e,n){if(e){if(typeof e=="string")return h(e,n);var o={}.toString.call(e).slice(8,-1);return o==="Object"&&e.constructor&&(o=e.constructor.name),o==="Map"||o==="Set"?Array.from(e):o==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?h(e,n):void 0}}function D(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function K(e){if(Array.isArray(e))return h(e)}function h(e,n){(n==null||n>e.length)&&(n=e.length);for(var o=0,i=Array(n);o<n;o++)i[o]=e[o];return i}var u={name:"Checkbox",extends:F,inheritAttrs:!1,emits:["change","focus","blur","update:indeterminate"],inject:{$pcCheckboxGroup:{default:void 0}},data:function(){return{d_indeterminate:this.indeterminate}},watch:{indeterminate:function(n){this.d_indeterminate=n}},methods:{getPTOptions:function(n){var o=n==="root"?this.ptmi:this.ptm;return o(n,{context:{checked:this.checked,indeterminate:this.d_indeterminate,disabled:this.disabled}})},onChange:function(n){var o=this;if(!this.disabled&&!this.readonly){var i=this.$pcCheckboxGroup?this.$pcCheckboxGroup.d_value:this.d_value,a;this.binary?a=this.d_indeterminate?this.trueValue:this.checked?this.falseValue:this.trueValue:this.checked||this.d_indeterminate?a=i.filter(function(t){return!w(t,o.value)}):a=i?[].concat(U(i),[this.value]):[this.value],this.d_indeterminate&&(this.d_indeterminate=!1,this.$emit("update:indeterminate",this.d_indeterminate)),this.$pcCheckboxGroup?this.$pcCheckboxGroup.writeValue(a,n):this.writeValue(a,n),this.$emit("change",n)}},onFocus:function(n){this.$emit("focus",n)},onBlur:function(n){var o,i;this.$emit("blur",n),(o=(i=this.formField).onBlur)===null||o===void 0||o.call(i,n)}},computed:{groupName:function(){return this.$pcCheckboxGroup?this.$pcCheckboxGroup.groupName:this.$formName},checked:function(){var n=this.$pcCheckboxGroup?this.$pcCheckboxGroup.d_value:this.d_value;return this.d_indeterminate?!1:this.binary?n===this.trueValue:C(this.value,n)},dataP:function(){return $(q({invalid:this.$invalid,checked:this.checked,disabled:this.disabled,filled:this.$variant==="filled"},this.size,this.size))}},components:{CheckIcon:g,MinusIcon:x}},Q=["data-p-checked","data-p-indeterminate","data-p-disabled","data-p"],W=["id","value","name","checked","tabindex","disabled","readonly","required","aria-labelledby","aria-label","aria-invalid","aria-checked"],Z=["data-p"];function J(e,n,o,i,a,t){var m=p("CheckIcon"),f=p("MinusIcon");return c(),b("div",r({class:e.cx("root")},t.getPTOptions("root"),{"data-p-checked":t.checked,"data-p-indeterminate":a.d_indeterminate||void 0,"data-p-disabled":e.disabled,"data-p":t.dataP}),[d("input",r({id:e.inputId,type:"checkbox",class:[e.cx("input"),e.inputClass],style:e.inputStyle,value:e.value,name:t.groupName,checked:t.checked,tabindex:e.tabindex,disabled:e.disabled,readonly:e.readonly,required:e.required,"aria-labelledby":e.ariaLabelledby,"aria-label":e.ariaLabel,"aria-invalid":e.invalid||void 0,"aria-checked":a.d_indeterminate?"mixed":void 0,onFocus:n[0]||(n[0]=function(){return t.onFocus&&t.onFocus.apply(t,arguments)}),onBlur:n[1]||(n[1]=function(){return t.onBlur&&t.onBlur.apply(t,arguments)}),onChange:n[2]||(n[2]=function(){return t.onChange&&t.onChange.apply(t,arguments)})},t.getPTOptions("input")),null,16,W),d("div",r({class:e.cx("box")},t.getPTOptions("box"),{"data-p":t.dataP}),[S(e.$slots,"icon",{checked:t.checked,indeterminate:a.d_indeterminate,class:B(e.cx("icon")),dataP:t.dataP},function(){return[t.checked?(c(),s(m,r({key:0,class:e.cx("icon")},t.getPTOptions("icon"),{"data-p":t.dataP}),null,16,["class","data-p"])):a.d_indeterminate?(c(),s(f,r({key:1,class:e.cx("icon")},t.getPTOptions("icon"),{"data-p":t.dataP}),null,16,["class","data-p"])):P("",!0)]})],16,Z)],16,Q)}u.render=J;const R=["for"],ee=V({__name:"Checkbox",props:z({label:{},modelValue:{},defaultValue:{},binary:{type:Boolean,default:!0},selectable:{type:Boolean,default:!0},pt:{},value:{}},{modelValue:{},modelModifiers:{}}),emits:["update:modelValue"],setup(e){const n=e,o=_(e,"modelValue");return(i,a)=>n.label?(c(),b("label",{key:0,for:n.label,class:"flex items-center gap-2 text-sm"},[I(k(u),{modelValue:o.value,"onUpdate:modelValue":a[0]||(a[0]=t=>o.value=t),name:n.label,pt:i.pt,binary:n.binary,value:n.value},null,8,["modelValue","name","pt","binary","value"]),d("span",null,A(n.label),1)],8,R)):(c(),s(k(u),{key:1,modelValue:o.value,"onUpdate:modelValue":a[1]||(a[1]=t=>o.value=t),name:n.label,pt:i.pt,binary:n.binary,value:n.value},null,8,["modelValue","name","pt","binary","value"]))}});export{ee as _,u as s};
