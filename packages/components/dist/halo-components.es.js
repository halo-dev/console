import { openBlock, createElementBlock, createElementVNode, defineComponent, computed, normalizeClass, unref, renderSlot, createBlock, resolveDynamicComponent, toDisplayString, createVNode, createCommentVNode, createTextVNode, Fragment, renderList, provide, useSlots, ref, inject, withModifiers, Transition, withCtx, withDirectives, vShow, Teleport, withKeys, normalizeStyle, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
var tailwind = /* @__PURE__ */ (() => '*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input:-ms-input-placeholder,textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}:root{--themeable-primary-50: 251, 254, 253;--themeable-primary-100: 220, 247, 238;--themeable-primary-200: 190, 240, 223;--themeable-primary-300: 160, 232, 208;--themeable-primary-400: 132, 223, 192;--themeable-primary-500: 103, 213, 176;--themeable-primary-600: 76, 203, 160;--themeable-primary-700: 56, 185, 141;--themeable-primary-800: 49, 154, 119;--themeable-primary-900: 42, 124, 96;--themeable-primary: 76, 203, 160;--themeable-secondary-50: 163, 182, 240;--themeable-secondary-100: 132, 158, 233;--themeable-secondary-200: 101, 133, 226;--themeable-secondary-300: 71, 109, 218;--themeable-secondary-400: 45, 86, 207;--themeable-secondary-500: 40, 74, 174;--themeable-secondary-600: 34, 62, 142;--themeable-secondary-700: 28, 49, 110;--themeable-secondary-800: 21, 36, 79;--themeable-secondary-900: 14, 23, 49;--themeable-secondary: 14, 23, 49}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::-webkit-backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.visible{visibility:visible}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.top-0{top:0px}.bottom-0{bottom:0px}.mt-3{margin-top:.75rem}.-mt-6{margin-top:-1.5rem}.ml-auto{margin-left:auto}.ml-1{margin-left:.25rem}.ml-4{margin-left:1rem}.ml-2{margin-left:.5rem}.mr-3{margin-right:.75rem}.box-border{box-sizing:border-box}.block{display:block}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.hidden{display:none}.h-full{height:100%}.h-5{height:1.25rem}.h-3{height:.75rem}.h-8{height:2rem}.h-6{height:1.5rem}.h-16{height:4rem}.h-10{height:2.5rem}.h-20{height:5rem}.h-24{height:6rem}.h-12{height:3rem}.h-32{height:8rem}.h-28{height:7rem}.h-40{height:10rem}.h-4{height:1rem}.w-full{width:100%}.w-4{width:1rem}.w-16{width:4rem}.w-6{width:1.5rem}.w-1\\/2{width:50%}.w-1\\/3{width:33.333333%}.min-w-0{min-width:0px}.flex-1{flex:1 1 0%}.flex-shrink-0{flex-shrink:0}.flex-grow{flex-grow:1}.translate-y-4{--tw-translate-y: 1rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-y-0{--tw-translate-y: 0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@-webkit-keyframes spin{to{transform:rotate(360deg)}}@keyframes spin{to{transform:rotate(360deg)}}.animate-spin{-webkit-animation:spin 1s linear infinite;animation:spin 1s linear infinite}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-6{gap:1.5rem}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(.5rem * var(--tw-space-x-reverse));margin-left:calc(.5rem * calc(1 - var(--tw-space-x-reverse)))}.self-center{align-self:center}.overflow-y-auto{overflow-y:auto}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded{border-radius:.25rem}.border{border-width:1px}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.bg-indigo-200{--tw-bg-opacity: 1;background-color:rgb(199 210 254 / var(--tw-bg-opacity))}.bg-indigo-300{--tw-bg-opacity: 1;background-color:rgb(165 180 252 / var(--tw-bg-opacity))}.bg-indigo-400{--tw-bg-opacity: 1;background-color:rgb(129 140 248 / var(--tw-bg-opacity))}.bg-green-200{--tw-bg-opacity: 1;background-color:rgb(187 247 208 / var(--tw-bg-opacity))}.bg-red-200{--tw-bg-opacity: 1;background-color:rgb(254 202 202 / var(--tw-bg-opacity))}.fill-current{fill:currentColor}.p-3{padding:.75rem}.p-0{padding:0}.p-4{padding:1rem}.pb-5{padding-bottom:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-semibold{font-weight:600}.text-green-700{--tw-text-opacity: 1;color:rgb(21 128 61 / var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity: 1;color:rgb(107 114 128 / var(--tw-text-opacity))}.text-green-500{--tw-text-opacity: 1;color:rgb(34 197 94 / var(--tw-text-opacity))}.text-red-700{--tw-text-opacity: 1;color:rgb(185 28 28 / var(--tw-text-opacity))}.text-red-500{--tw-text-opacity: 1;color:rgb(239 68 68 / var(--tw-text-opacity))}.text-gray-800{--tw-text-opacity: 1;color:rgb(31 41 55 / var(--tw-text-opacity))}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.opacity-25{opacity:.25}.opacity-75{opacity:.75}.opacity-0{opacity:0}.opacity-100{opacity:1}.outline{outline-style:solid}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition{transition-property:color,background-color,border-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-text-decoration-color,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-text-decoration-color,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-200{transition-duration:.2s}.duration-100{transition-duration:.1s}.ease-out{transition-timing-function:cubic-bezier(0,0,.2,1)}.ease-in{transition-timing-function:cubic-bezier(.4,0,1,1)}.group:hover .group-hover\\:block{display:block}@media (min-width: 640px){.sm\\:translate-y-0{--tw-translate-y: 0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.sm\\:scale-95{--tw-scale-x: .95;--tw-scale-y: .95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.sm\\:scale-100{--tw-scale-x: 1;--tw-scale-y: 1;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.sm\\:space-x-3>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(.75rem * var(--tw-space-x-reverse));margin-left:calc(.75rem * calc(1 - var(--tw-space-x-reverse)))}}@media (min-width: 768px){.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width: 1024px){.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}\n')();
const _hoisted_1$Y = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$R = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16zm3.833 3.337a.595.595 0 0 1 .763.067a.59.59 0 0 1 .063.76c-2.18 3.046-3.38 4.678-3.598 4.897a1.502 1.502 0 0 1-2.122 0a1.502 1.502 0 0 1 0-2.122c.374-.373 2.005-1.574 4.894-3.602zM17.5 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2zm-11 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2zm2.318-3.596a1 1 0 1 1-1.416 1.414a1 1 0 0 1 1.416-1.414zM12 5.5a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"
}, null, -1);
const _hoisted_3$P = [
  _hoisted_2$R
];
function render$E(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$Y, _hoisted_3$P);
}
var dashboard3Line = { name: "ri-dashboard-3-line", render: render$E };
const _hoisted_1$X = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$Q = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "m10.828 12l4.95 4.95l-1.414 1.414L8 12l6.364-6.364l1.414 1.414z"
}, null, -1);
const _hoisted_3$O = [
  _hoisted_2$Q
];
function render$D(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$X, _hoisted_3$O);
}
var arrowLeftSLine = { name: "ri-arrow-left-s-line", render: render$D };
const _hoisted_1$W = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$P = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "m13.172 12l-4.95-4.95l1.414-1.414L16 12l-6.364 6.364l-1.414-1.414z"
}, null, -1);
const _hoisted_3$N = [
  _hoisted_2$P
];
function render$C(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$W, _hoisted_3$N);
}
var IconArrowRight = { name: "ri-arrow-right-s-line", render: render$C };
const _hoisted_1$V = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$O = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "m12 16l-6-6h12z"
}, null, -1);
const _hoisted_3$M = [
  _hoisted_2$O
];
function render$B(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$V, _hoisted_3$M);
}
var arrowDownSFill = { name: "ri-arrow-down-s-fill", render: render$B };
const _hoisted_1$U = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$N = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "m12 10.828l-4.95 4.95l-1.414-1.414L12 8l6.364 6.364l-1.414 1.414z"
}, null, -1);
const _hoisted_3$L = [
  _hoisted_2$N
];
function render$A(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$U, _hoisted_3$L);
}
var arrowUpSLine = { name: "ri-arrow-up-s-line", render: render$A };
const _hoisted_1$T = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$M = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "m12 13.172l4.95-4.95l1.414 1.414L12 16L5.636 9.636L7.05 8.222z"
}, null, -1);
const _hoisted_3$K = [
  _hoisted_2$M
];
function render$z(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$T, _hoisted_3$K);
}
var arrowDownSLine = { name: "ri-arrow-down-s-line", render: render$z };
const _hoisted_1$S = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$L = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM11 5H4v14h7V5zm2 0v14h7V5h-7zm1 2h5v2h-5V7zm0 3h5v2h-5v-2z"
}, null, -1);
const _hoisted_3$J = [
  _hoisted_2$L
];
function render$y(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$S, _hoisted_3$J);
}
var bookReadLine = { name: "ri-book-read-line", render: render$y };
const _hoisted_1$R = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$K = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M5 8v12h14V8H5zm0-2h14V4H5v2zm15 16H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zM7 10h4v4H7v-4zm0 6h10v2H7v-2zm6-5h4v2h-4v-2z"
}, null, -1);
const _hoisted_3$I = [
  _hoisted_2$K
];
function render$x(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$R, _hoisted_3$I);
}
var pagesLine = { name: "ri-pages-line", render: render$x };
const _hoisted_1$Q = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$J = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M2 8.994A5.99 5.99 0 0 1 8 3h8c3.313 0 6 2.695 6 5.994V21H8c-3.313 0-6-2.695-6-5.994V8.994zM20 19V8.994A4.004 4.004 0 0 0 16 5H8a3.99 3.99 0 0 0-4 3.994v6.012A4.004 4.004 0 0 0 8 19h12zm-6-8h2v2h-2v-2zm-6 0h2v2H8v-2z"
}, null, -1);
const _hoisted_3$H = [
  _hoisted_2$J
];
function render$w(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$Q, _hoisted_3$H);
}
var message3Line = { name: "ri-message-3-line", render: render$w };
const _hoisted_1$P = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$I = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 2c5.522 0 10 3.978 10 8.889a5.558 5.558 0 0 1-5.556 5.555h-1.966c-.922 0-1.667.745-1.667 1.667c0 .422.167.811.422 1.1c.267.3.434.689.434 1.122C13.667 21.256 12.9 22 12 22C6.478 22 2 17.522 2 12S6.478 2 12 2zm-1.189 16.111a3.664 3.664 0 0 1 3.667-3.667h1.966A3.558 3.558 0 0 0 20 10.89C20 7.139 16.468 4 12 4a8 8 0 0 0-.676 15.972a3.648 3.648 0 0 1-.513-1.86zM7.5 12a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zM12 9a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3z"
}, null, -1);
const _hoisted_3$G = [
  _hoisted_2$I
];
function render$v(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$P, _hoisted_3$G);
}
var paletteLine = { name: "ri-palette-line", render: render$v };
const _hoisted_1$O = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$H = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M2 18h7v2H2v-2zm0-7h9v2H2v-2zm0-7h20v2H2V4zm18.674 9.025l1.156-.391l1 1.732l-.916.805a4.017 4.017 0 0 1 0 1.658l.916.805l-1 1.732l-1.156-.391c-.41.37-.898.655-1.435.83L19 21h-2l-.24-1.196a3.996 3.996 0 0 1-1.434-.83l-1.156.392l-1-1.732l.916-.805a4.017 4.017 0 0 1 0-1.658l-.916-.805l1-1.732l1.156.391c.41-.37.898-.655 1.435-.83L17 11h2l.24 1.196c.536.174 1.024.46 1.434.83zM18 18a2 2 0 1 0 0-4a2 2 0 0 0 0 4z"
}, null, -1);
const _hoisted_3$F = [
  _hoisted_2$H
];
function render$u(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$O, _hoisted_3$F);
}
var listSettingsLine = { name: "ri-list-settings-line", render: render$u };
const _hoisted_1$N = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$G = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M15.199 9.945a2.6 2.6 0 0 1-.79-1.551l-.403-3.083l-2.73 1.486a2.6 2.6 0 0 1-1.72.273L6.5 6.5l.57 3.056a2.6 2.6 0 0 1-.273 1.72l-1.486 2.73l3.083.403a2.6 2.6 0 0 1 1.55.79l2.138 2.257l1.336-2.807a2.6 2.6 0 0 1 1.23-1.231l2.808-1.336l-2.257-2.137zm.025 5.563l-2.213 4.65a.6.6 0 0 1-.977.155l-3.542-3.739a.6.6 0 0 0-.357-.182l-5.107-.668a.6.6 0 0 1-.449-.881l2.462-4.524a.6.6 0 0 0 .062-.396L4.16 4.86a.6.6 0 0 1 .7-.7l5.063.943a.6.6 0 0 0 .396-.062l4.524-2.462a.6.6 0 0 1 .881.45l.668 5.106a.6.6 0 0 0 .182.357l3.739 3.542a.6.6 0 0 1-.155.977l-4.65 2.213a.6.6 0 0 0-.284.284zm.797 1.927l1.414-1.414l4.243 4.242l-1.415 1.415l-4.242-4.243z"
}, null, -1);
const _hoisted_3$E = [
  _hoisted_2$G
];
function render$t(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$N, _hoisted_3$E);
}
var magicLine = { name: "ri-magic-line", render: render$t };
const _hoisted_1$M = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$F = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm2.595 7.812a3.51 3.51 0 0 1 0-1.623l-.992-.573l1-1.732l.992.573A3.496 3.496 0 0 1 17 14.645V13.5h2v1.145c.532.158 1.012.44 1.405.812l.992-.573l1 1.732l-.992.573a3.51 3.51 0 0 1 0 1.622l.992.573l-1 1.732l-.992-.573a3.496 3.496 0 0 1-1.405.812V22.5h-2v-1.145a3.496 3.496 0 0 1-1.405-.812l-.992.573l-1-1.732l.992-.572zM18 19.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3z"
}, null, -1);
const _hoisted_3$D = [
  _hoisted_2$F
];
function render$s(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$M, _hoisted_3$D);
}
var userSettingsLine = { name: "ri-user-settings-line", render: render$s };
const _hoisted_1$L = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$E = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M2 12c0-.865.11-1.703.316-2.504A3 3 0 0 0 4.99 4.867a9.99 9.99 0 0 1 4.335-2.505a3 3 0 0 0 5.348 0a9.99 9.99 0 0 1 4.335 2.505a3 3 0 0 0 2.675 4.63a10.036 10.036 0 0 1 0 5.007a3 3 0 0 0-2.675 4.629a9.99 9.99 0 0 1-4.335 2.505a3 3 0 0 0-5.348 0a9.99 9.99 0 0 1-4.335-2.505a3 3 0 0 0-2.675-4.63A10.056 10.056 0 0 1 2 12zm4.804 3c.63 1.091.81 2.346.564 3.524c.408.29.842.541 1.297.75A4.993 4.993 0 0 1 12 18c1.26 0 2.438.471 3.335 1.274c.455-.209.889-.46 1.297-.75A4.993 4.993 0 0 1 17.196 15a4.993 4.993 0 0 1 2.77-2.25a8.126 8.126 0 0 0 0-1.5A4.993 4.993 0 0 1 17.195 9a4.993 4.993 0 0 1-.564-3.524a7.989 7.989 0 0 0-1.297-.75A4.993 4.993 0 0 1 12 6a4.993 4.993 0 0 1-3.335-1.274a7.99 7.99 0 0 0-1.297.75A4.993 4.993 0 0 1 6.804 9a4.993 4.993 0 0 1-2.77 2.25a8.126 8.126 0 0 0 0 1.5A4.993 4.993 0 0 1 6.805 15zM12 15a3 3 0 1 1 0-6a3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2a1 1 0 0 0 0 2z"
}, null, -1);
const _hoisted_3$C = [
  _hoisted_2$E
];
function render$r(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$L, _hoisted_3$C);
}
var settings4Line = { name: "ri-settings-4-line", render: render$r };
const _hoisted_1$K = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$D = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M13 18v2h6v2h-6a2 2 0 0 1-2-2v-2H8a4 4 0 0 1-4-4V7a1 1 0 0 1 1-1h2V2h2v4h6V2h2v4h2a1 1 0 0 1 1 1v7a4 4 0 0 1-4 4h-3zm-5-2h8a2 2 0 0 0 2-2v-3H6v3a2 2 0 0 0 2 2zm10-8H6v1h12V8zm-6 6.5a1 1 0 1 1 0-2a1 1 0 0 1 0 2zM11 2h2v3h-2V2z"
}, null, -1);
const _hoisted_3$B = [
  _hoisted_2$D
];
function render$q(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$K, _hoisted_3$B);
}
var plug2Line = { name: "ri-plug-2-line", render: render$q };
const _hoisted_1$J = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$C = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 3c5.392 0 9.878 3.88 10.819 9c-.94 5.12-5.427 9-10.819 9c-5.392 0-9.878-3.88-10.819-9C2.121 6.88 6.608 3 12 3zm0 16a9.005 9.005 0 0 0 8.777-7a9.005 9.005 0 0 0-17.554 0A9.005 9.005 0 0 0 12 19zm0-2.5a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9zm0-2a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5z"
}, null, -1);
const _hoisted_3$A = [
  _hoisted_2$C
];
function render$p(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$J, _hoisted_3$A);
}
var eyeLine = { name: "ri-eye-line", render: render$p };
const _hoisted_1$I = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$B = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12.414 5H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2zM20 11H4v8h16v-8zm0-2V7h-8.414l-2-2H4v4h16z"
}, null, -1);
const _hoisted_3$z = [
  _hoisted_2$B
];
function render$o(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$I, _hoisted_3$z);
}
var folder2Line = { name: "ri-folder-2-line", render: render$o };
const _hoisted_1$H = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$A = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M4.5 10.5c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5S6 12.825 6 12s-.675-1.5-1.5-1.5zm15 0c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5S21 12.825 21 12s-.675-1.5-1.5-1.5zm-7.5 0c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5s1.5-.675 1.5-1.5s-.675-1.5-1.5-1.5z"
}, null, -1);
const _hoisted_3$y = [
  _hoisted_2$A
];
function render$n(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$H, _hoisted_3$y);
}
var moreLine = { name: "ri-more-line", render: render$n };
const _hoisted_1$G = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$z = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "m12 10.586l4.95-4.95l1.414 1.414l-4.95 4.95l4.95 4.95l-1.414 1.414l-4.95-4.95l-4.95 4.95l-1.414-1.414l4.95-4.95l-4.95-4.95L7.05 5.636z"
}, null, -1);
const _hoisted_3$x = [
  _hoisted_2$z
];
function render$m(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$G, _hoisted_3$x);
}
var IconClose = { name: "ri-close-line", render: render$m };
const _hoisted_1$F = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$y = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"
}, null, -1);
const _hoisted_3$w = [
  _hoisted_2$y
];
function render$l(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$F, _hoisted_3$w);
}
var IconErrorWarning = { name: "ri-error-warning-line", render: render$l };
const _hoisted_1$E = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$x = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16zm-.997-4L6.76 11.757l1.414-1.414l2.829 2.829l5.656-5.657l1.415 1.414L11.003 16z"
}, null, -1);
const _hoisted_3$v = [
  _hoisted_2$x
];
function render$k(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$E, _hoisted_3$v);
}
var IconCheckboxCircle = { name: "ri-checkbox-circle-line", render: render$k };
const _hoisted_1$D = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$w = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"
}, null, -1);
const _hoisted_3$u = [
  _hoisted_2$w
];
function render$j(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$D, _hoisted_3$u);
}
var IconInformation = { name: "ri-information-line", render: render$j };
const _hoisted_1$C = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$v = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16zm0-9.414l2.828-2.829l1.415 1.415L13.414 12l2.829 2.828l-1.415 1.415L12 13.414l-2.828 2.829l-1.415-1.415L10.586 12L7.757 9.172l1.415-1.415L12 10.586z"
}, null, -1);
const _hoisted_3$t = [
  _hoisted_2$v
];
function render$i(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$C, _hoisted_3$t);
}
var IconCloseCircle = { name: "ri-close-circle-line", render: render$i };
const _hoisted_1$B = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$u = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-4.586 6l1.768 1.768l-1.414 1.414L12 15.414l-1.768 1.768l-1.414-1.414L10.586 14l-1.768-1.768l1.414-1.414L12 12.586l1.768-1.768l1.414 1.414L13.414 14zM9 4v2h6V4H9z"
}, null, -1);
const _hoisted_3$s = [
  _hoisted_2$u
];
function render$h(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$B, _hoisted_3$s);
}
var deleteBin2Line = { name: "ri-delete-bin-2-line", render: render$h };
const _hoisted_1$A = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$t = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16z"
}, null, -1);
const _hoisted_3$r = [
  _hoisted_2$t
];
function render$g(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$A, _hoisted_3$r);
}
var addCircleLine = { name: "ri-add-circle-line", render: render$g };
const _hoisted_1$z = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$s = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M7 19v-6h10v6h2V7.828L16.172 5H5v14h2zM4 3h13l4 4v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm5 12v4h6v-4H9z"
}, null, -1);
const _hoisted_3$q = [
  _hoisted_2$s
];
function render$f(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$z, _hoisted_3$q);
}
var saveLine = { name: "ri-save-line", render: render$f };
const _hoisted_1$y = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$r = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
}, null, -1);
const _hoisted_3$p = [
  _hoisted_2$r
];
function render$e(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$y, _hoisted_3$p);
}
var listUnordered = { name: "ri-list-unordered", render: render$e };
const _hoisted_1$x = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$q = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M14 10h-4v4h4v-4zm2 0v4h3v-4h-3zm-2 9v-3h-4v3h4zm2 0h3v-3h-3v3zM14 5h-4v3h4V5zm2 0v3h3V5h-3zm-8 5H5v4h3v-4zm0 9v-3H5v3h3zM8 5H5v3h3V5zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
}, null, -1);
const _hoisted_3$o = [
  _hoisted_2$q
];
function render$d(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$x, _hoisted_3$o);
}
var gridLine = { name: "ri-grid-line", render: render$d };
const _hoisted_1$w = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$p = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm-.997-6l7.07-7.071l-1.414-1.414l-5.656 5.657l-2.829-2.829l-1.414 1.414L11.003 16z"
}, null, -1);
const _hoisted_3$n = [
  _hoisted_2$p
];
function render$c(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$w, _hoisted_3$n);
}
var checkboxCircleFill = { name: "ri-checkbox-circle-fill", render: render$c };
const _hoisted_1$v = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$o = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M11 2c4.968 0 9 4.032 9 9s-4.032 9-9 9s-9-4.032-9-9s4.032-9 9-9zm0 16c3.867 0 7-3.133 7-7c0-3.868-3.133-7-7-7c-3.868 0-7 3.132-7 7c0 3.867 3.132 7 7 7zm8.485.071l2.829 2.828l-1.415 1.415l-2.828-2.829l1.414-1.414z"
}, null, -1);
const _hoisted_3$m = [
  _hoisted_2$o
];
function render$b(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$v, _hoisted_3$m);
}
var search2Line = { name: "ri-search-2-line", render: render$b };
const _hoisted_1$u = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$n = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M4 16h16V5H4v11zm9 2v2h4v2H7v-2h4v-2H2.992A.998.998 0 0 1 2 16.993V4.007C2 3.451 2.455 3 2.992 3h18.016c.548 0 .992.449.992 1.007v12.986c0 .556-.455 1.007-.992 1.007H13z"
}, null, -1);
const _hoisted_3$l = [
  _hoisted_2$n
];
function render$a(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$u, _hoisted_3$l);
}
var computerLine = { name: "ri-computer-line", render: render$a };
const _hoisted_1$t = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$m = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M7 4v16h10V4H7zM6 2h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm6 15a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"
}, null, -1);
const _hoisted_3$k = [
  _hoisted_2$m
];
function render$9(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$t, _hoisted_3$k);
}
var smartphoneLine = { name: "ri-smartphone-line", render: render$9 };
const _hoisted_1$s = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$l = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M6 4v16h12V4H6zM5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm7 15a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"
}, null, -1);
const _hoisted_3$j = [
  _hoisted_2$l
];
function render$8(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$s, _hoisted_3$j);
}
var tabletLine = { name: "ri-tablet-line", render: render$8 };
const _hoisted_1$r = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$k = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm5.793 8.914l3.535-3.535l1.415 1.414l-4.95 4.95l-3.536-3.536l1.415-1.414l2.12 2.121z"
}, null, -1);
const _hoisted_3$i = [
  _hoisted_2$k
];
function render$7(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$r, _hoisted_3$i);
}
var userFollowLine = { name: "ri-user-follow-line", render: render$7 };
const _hoisted_1$q = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$j = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16zm-5-7h9v2h-4v3l-5-5zm5-4V6l5 5H8V9h4z"
}, null, -1);
const _hoisted_3$h = [
  _hoisted_2$j
];
function render$6(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$q, _hoisted_3$h);
}
var exchangeLine = { name: "ri-exchange-line", render: render$6 };
const _hoisted_1$p = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$i = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
}, null, -1);
const _hoisted_3$g = [
  _hoisted_2$i
];
function render$5(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$p, _hoisted_3$g);
}
var githubFill = { name: "ri-github-fill", render: render$5 };
const _hoisted_1$o = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$h = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "m12 12.586l4.243 4.242l-1.415 1.415L13 16.415V22h-2v-5.587l-1.828 1.83l-1.415-1.415L12 12.586zM12 2a7.001 7.001 0 0 1 6.954 6.194a5.5 5.5 0 0 1-.953 10.784v-2.014a3.5 3.5 0 1 0-1.112-6.91a5 5 0 1 0-9.777 0a3.5 3.5 0 0 0-1.292 6.88l.18.03v2.014a5.5 5.5 0 0 1-.954-10.784A7 7 0 0 1 12 2z"
}, null, -1);
const _hoisted_3$f = [
  _hoisted_2$h
];
function render$4(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$o, _hoisted_3$f);
}
var uploadCloud2Line = { name: "ri-upload-cloud-2-line", render: render$4 };
const _hoisted_1$n = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$g = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M3.783 2.826L12 1l8.217 1.826a1 1 0 0 1 .783.976v9.987a6 6 0 0 1-2.672 4.992L12 23l-6.328-4.219A6 6 0 0 1 3 13.79V3.802a1 1 0 0 1 .783-.976zM5 4.604v9.185a4 4 0 0 0 1.781 3.328L12 20.597l5.219-3.48A4 4 0 0 0 19 13.79V4.604L12 3.05L5 4.604zM12 11a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5zm-4.473 5a4.5 4.5 0 0 1 8.946 0H7.527z"
}, null, -1);
const _hoisted_3$e = [
  _hoisted_2$g
];
function render$3(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$n, _hoisted_3$e);
}
var shieldUserLine = { name: "ri-shield-user-line", render: render$3 };
const _hoisted_1$m = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$f = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M7.105 15.21A3.001 3.001 0 1 1 5 15.17V8.83a3.001 3.001 0 1 1 2 0V12c.836-.628 1.874-1 3-1h4a3.001 3.001 0 0 0 2.895-2.21a3.001 3.001 0 1 1 2.032.064A5.001 5.001 0 0 1 14 13h-4a3.001 3.001 0 0 0-2.895 2.21zM6 17a1 1 0 1 0 0 2a1 1 0 0 0 0-2zM6 5a1 1 0 1 0 0 2a1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2a1 1 0 0 0 0-2z"
}, null, -1);
const _hoisted_3$d = [
  _hoisted_2$f
];
function render$2(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$m, _hoisted_3$d);
}
var gitBranchLine = { name: "ri-git-branch-line", render: render$2 };
const _hoisted_1$l = {
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$e = /* @__PURE__ */ createElementVNode("path", {
  fill: "currentColor",
  d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16zM9 9h6v6H9V9z"
}, null, -1);
const _hoisted_3$c = [
  _hoisted_2$e
];
function render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$l, _hoisted_3$c);
}
var stopCircleLine = { name: "ri-stop-circle-line", render: render$1 };
var Alert_vue_vue_type_style_index_0_scoped_true_lang = /* @__PURE__ */ (() => ".alert-wrapper[data-v-3bf3a1a9]{display:flex;flex-direction:column;box-sizing:border-box;border-width:1px;padding:12px 16px;border-radius:4px}.alert-wrapper .alert-header[data-v-3bf3a1a9]{display:flex}.alert-wrapper .alert-header .alert-icon[data-v-3bf3a1a9]{align-self:center;margin-right:.75rem;font-size:1.125rem;line-height:1.75rem}.alert-wrapper .alert-header .alert-title[data-v-3bf3a1a9]{align-self:center;margin-right:.75rem;flex:1 1 0%;font-weight:500;font-size:1rem;line-height:1.5rem}.alert-wrapper .alert-header .alert-close[data-v-3bf3a1a9]{align-self:center;cursor:pointer;border-radius:9999px;padding:.125rem}.alert-wrapper .alert-header .alert-close[data-v-3bf3a1a9]:hover{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s;--tw-bg-opacity: 1;background-color:rgb(209 213 219 / var(--tw-bg-opacity));--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.alert-wrapper .alert-description[data-v-3bf3a1a9]{font-size:.875rem;line-height:1.25rem;margin-top:.5rem}.alert-wrapper .alert-actions[data-v-3bf3a1a9]{border-top-width:1px;margin-top:.75rem;padding-top:.5rem}.alert-wrapper.alert-default[data-v-3bf3a1a9]{--tw-bg-opacity: 1;background-color:rgb(249 250 251 / var(--tw-bg-opacity));--tw-border-opacity: 1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}.alert-wrapper.alert-default .alert-icon[data-v-3bf3a1a9],.alert-wrapper.alert-default .alert-description[data-v-3bf3a1a9]{--tw-text-opacity: 1;color:rgb(75 85 99 / var(--tw-text-opacity))}.alert-wrapper.alert-default .alert-close[data-v-3bf3a1a9],.alert-wrapper.alert-default .alert-title[data-v-3bf3a1a9]{--tw-text-opacity: 1;color:rgb(55 65 81 / var(--tw-text-opacity))}.alert-wrapper.alert-success[data-v-3bf3a1a9]{--tw-bg-opacity: 1;background-color:rgb(240 253 244 / var(--tw-bg-opacity));--tw-border-opacity: 1;border-color:rgb(134 239 172 / var(--tw-border-opacity))}.alert-wrapper.alert-success .alert-icon[data-v-3bf3a1a9],.alert-wrapper.alert-success .alert-description[data-v-3bf3a1a9]{--tw-text-opacity: 1;color:rgb(22 163 74 / var(--tw-text-opacity))}.alert-wrapper.alert-success .alert-close[data-v-3bf3a1a9],.alert-wrapper.alert-success .alert-title[data-v-3bf3a1a9]{--tw-text-opacity: 1;color:rgb(21 128 61 / var(--tw-text-opacity))}.alert-wrapper.alert-info[data-v-3bf3a1a9]{--tw-bg-opacity: 1;background-color:rgb(240 249 255 / var(--tw-bg-opacity));--tw-border-opacity: 1;border-color:rgb(125 211 252 / var(--tw-border-opacity))}.alert-wrapper.alert-info .alert-icon[data-v-3bf3a1a9],.alert-wrapper.alert-info .alert-description[data-v-3bf3a1a9]{--tw-text-opacity: 1;color:rgb(2 132 199 / var(--tw-text-opacity))}.alert-wrapper.alert-info .alert-close[data-v-3bf3a1a9],.alert-wrapper.alert-info .alert-title[data-v-3bf3a1a9]{--tw-text-opacity: 1;color:rgb(3 105 161 / var(--tw-text-opacity))}.alert-wrapper.alert-warning[data-v-3bf3a1a9]{--tw-bg-opacity: 1;background-color:rgb(255 247 237 / var(--tw-bg-opacity));--tw-border-opacity: 1;border-color:rgb(253 186 116 / var(--tw-border-opacity))}.alert-wrapper.alert-warning .alert-icon[data-v-3bf3a1a9],.alert-wrapper.alert-warning .alert-description[data-v-3bf3a1a9]{--tw-text-opacity: 1;color:rgb(234 88 12 / var(--tw-text-opacity))}.alert-wrapper.alert-warning .alert-close[data-v-3bf3a1a9],.alert-wrapper.alert-warning .alert-title[data-v-3bf3a1a9]{--tw-text-opacity: 1;color:rgb(194 65 12 / var(--tw-text-opacity))}.alert-wrapper.alert-error[data-v-3bf3a1a9]{--tw-bg-opacity: 1;background-color:rgb(254 242 242 / var(--tw-bg-opacity));--tw-border-opacity: 1;border-color:rgb(252 165 165 / var(--tw-border-opacity))}.alert-wrapper.alert-error .alert-icon[data-v-3bf3a1a9],.alert-wrapper.alert-error .alert-description[data-v-3bf3a1a9]{--tw-text-opacity: 1;color:rgb(220 38 38 / var(--tw-text-opacity))}.alert-wrapper.alert-error .alert-close[data-v-3bf3a1a9],.alert-wrapper.alert-error .alert-title[data-v-3bf3a1a9]{--tw-text-opacity: 1;color:rgb(185 28 28 / var(--tw-text-opacity))}\n")();
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$k = { class: "alert-header" };
const _hoisted_2$d = { class: "alert-icon" };
const _hoisted_3$b = { class: "alert-title" };
const _hoisted_4$7 = {
  key: 0,
  class: "alert-description"
};
const _hoisted_5$2 = {
  key: 1,
  class: "alert-actions"
};
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "Alert",
  props: {
    type: {
      type: String,
      default: "default"
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  emits: ["close"],
  setup(__props, { emit }) {
    const props = __props;
    const TypeIcons = {
      success: IconCheckboxCircle,
      info: IconInformation,
      default: IconInformation,
      warning: IconErrorWarning,
      error: IconCloseCircle
    };
    const classes = computed(() => {
      return [`alert-${props.type}`];
    });
    const handleClose = () => {
      emit("close");
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([unref(classes), "alert-wrapper"])
      }, [
        createElementVNode("div", _hoisted_1$k, [
          createElementVNode("div", _hoisted_2$d, [
            renderSlot(_ctx.$slots, "icon", {}, () => [
              (openBlock(), createBlock(resolveDynamicComponent(TypeIcons[__props.type])))
            ], true)
          ]),
          createElementVNode("div", _hoisted_3$b, toDisplayString(__props.title), 1),
          __props.closable ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "alert-close",
            onClick: handleClose
          }, [
            createVNode(unref(IconClose))
          ])) : createCommentVNode("", true)
        ]),
        __props.description || _ctx.$slots.description ? (openBlock(), createElementBlock("div", _hoisted_4$7, [
          renderSlot(_ctx.$slots, "description", {}, () => [
            createTextVNode(toDisplayString(__props.description), 1)
          ], true)
        ])) : createCommentVNode("", true),
        _ctx.$slots.actions ? (openBlock(), createElementBlock("div", _hoisted_5$2, [
          renderSlot(_ctx.$slots, "actions", {}, void 0, true)
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
var Alert = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-3bf3a1a9"]]);
var Button_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".btn{border-radius:4px;display:inline-flex;flex-shrink:0;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;flex-wrap:wrap;align-items:center;justify-content:center;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s;text-align:center;font-size:.875rem;line-height:1.25rem;-webkit-text-decoration-line:none;text-decoration-line:none;height:2.25rem;padding-left:1rem;padding-right:1rem;outline-width:0px;border-style:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;vertical-align:middle}.btn:hover{opacity:.9}.btn:active{opacity:1}.btn:disabled{opacity:.5;cursor:not-allowed}.btn-default{border:1px solid #d9d9d9}.btn-default .btn-icon{color:#0e1731}.btn-primary{background:#4ccba0;--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.btn-secondary{background:#0e1731;--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.btn-danger{background:#d71d1d;--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.btn-block{width:100%}.btn-icon{height:1.25rem;width:1.25rem;--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity));margin-right:.75rem}.btn-loading{cursor:not-allowed}.btn-loading:hover{opacity:1}.btn-lg{height:2.75rem;padding-left:1.25rem;padding-right:1.25rem;font-size:1.125rem;line-height:1.75rem}.btn-sm{height:1.75rem;padding-left:.75rem;padding-right:.75rem;font-size:.75rem;line-height:1rem}.btn-sm .btn-icon{height:.75rem;width:.75rem;margin-right:.5rem}.btn-xs{height:1.5rem;padding-left:.5rem;padding-right:.5rem;font-size:.75rem;line-height:1rem}.btn-xs .btn-icon{height:.75rem;width:.75rem;margin-right:.5rem}.btn-circle{width:2.25rem;padding:0;border-radius:9999px}.btn-lg.btn-circle{width:2.75rem}.btn-sm.btn-circle{width:1.75rem}.btn-xs.btn-circle{width:1.5rem}\n")();
const _hoisted_1$j = ["disabled"];
const _hoisted_2$c = {
  key: 0,
  class: "btn-icon"
};
const _hoisted_3$a = {
  key: 0,
  class: "animate-spin",
  fill: "none",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg"
};
const _hoisted_4$6 = /* @__PURE__ */ createElementVNode("circle", {
  class: "opacity-25",
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  "stroke-width": "4"
}, null, -1);
const _hoisted_5$1 = /* @__PURE__ */ createElementVNode("path", {
  class: "opacity-75",
  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
  fill: "currentColor"
}, null, -1);
const _hoisted_6 = [
  _hoisted_4$6,
  _hoisted_5$1
];
const _hoisted_7 = { class: "btn-content" };
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "Button",
  props: {
    type: {
      type: String,
      default: "default"
    },
    size: {
      type: String,
      default: "md"
    },
    circle: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    route: {
      type: Object
    }
  },
  emits: ["click"],
  setup(__props, { emit }) {
    const props = __props;
    const router = useRouter();
    const classes = computed(() => {
      return [
        `btn-${props.size}`,
        `btn-${props.type}`,
        { "btn-circle": props.circle },
        { "btn-block": props.block },
        { "btn-loading": props.loading }
      ];
    });
    function handleClick() {
      if (props.disabled || props.loading)
        return;
      if (props.route) {
        router.push(props.route);
      }
      emit("click");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        class: normalizeClass([unref(classes), "btn"]),
        disabled: __props.disabled,
        onClick: handleClick
      }, [
        _ctx.$slots.icon || __props.loading ? (openBlock(), createElementBlock("span", _hoisted_2$c, [
          __props.loading ? (openBlock(), createElementBlock("svg", _hoisted_3$a, _hoisted_6)) : renderSlot(_ctx.$slots, "icon", { key: 1 })
        ])) : createCommentVNode("", true),
        createElementVNode("span", _hoisted_7, [
          renderSlot(_ctx.$slots, "default")
        ])
      ], 10, _hoisted_1$j);
    };
  }
});
var Card_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".card-wrapper{box-sizing:border-box;display:flex;flex-direction:column;--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));--tw-shadow: 0 1px 2px 0 rgb(0 0 0 / .05);--tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);overflow:hidden;border-radius:4px;border:1px solid #eaecf0}.card-wrapper .card-header{display:flex;justify-content:space-between;border-bottom:1px solid #eaecf0}.card-wrapper .card-header .card-header-title{align-self:center;font-size:1rem;line-height:1.5rem;font-weight:700;padding:12px 16px}.card-wrapper .card-header .card-header-actions{align-self:center}.card-wrapper .card-body{padding:12px 16px}.card-wrapper .card-footer{border-top:1px solid #eaecf0;padding:12px 16px}\n")();
const _hoisted_1$i = { class: "card-wrapper" };
const _hoisted_2$b = {
  key: 0,
  class: "card-header"
};
const _hoisted_3$9 = { class: "card-header-title" };
const _hoisted_4$5 = { class: "card-header-actions" };
const _hoisted_5 = {
  key: 1,
  class: "card-footer"
};
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "Card",
  props: {
    title: {
      type: String
    },
    bodyClass: {
      type: Object
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$i, [
        __props.title || _ctx.$slots.header ? (openBlock(), createElementBlock("div", _hoisted_2$b, [
          renderSlot(_ctx.$slots, "header", {}, () => [
            createElementVNode("div", _hoisted_3$9, toDisplayString(__props.title), 1),
            createElementVNode("div", _hoisted_4$5, [
              renderSlot(_ctx.$slots, "actions")
            ])
          ])
        ])) : createCommentVNode("", true),
        createElementVNode("div", {
          class: normalizeClass([__props.bodyClass, "card-body"])
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2),
        _ctx.$slots.footer ? (openBlock(), createElementBlock("div", _hoisted_5, [
          renderSlot(_ctx.$slots, "footer")
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
var CheckBox_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".checkbox-wrapper{display:flex;align-items:center;box-sizing:border-box;flex-grow:0}\n")();
const _hoisted_1$h = { class: "checkbox-inner" };
const _hoisted_2$a = ["id", "checked", "value"];
const _hoisted_3$8 = ["for"];
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "CheckBox",
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Boolean]
    },
    label: {
      type: String
    },
    name: {
      type: String
    }
  },
  emits: ["update:checked", "change"],
  setup(__props, { emit }) {
    const props = __props;
    const id = ["checkbox", props.name, props.value].filter((item) => !!item).join("-");
    function handleChange(e) {
      const { checked } = e.target;
      emit("update:checked", checked);
      emit("change", e);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([{ "checkbox-wrapper-checked": __props.checked }, "checkbox-wrapper"])
      }, [
        createElementVNode("div", _hoisted_1$h, [
          createElementVNode("input", {
            id: unref(id),
            checked: __props.checked,
            value: __props.value,
            type: "checkbox",
            onChange: handleChange
          }, null, 40, _hoisted_2$a)
        ]),
        __props.label ? (openBlock(), createElementBlock("label", {
          key: 0,
          for: unref(id),
          class: "checkbox-label"
        }, toDisplayString(__props.label), 9, _hoisted_3$8)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
var CheckBoxGroup_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => "")();
const _hoisted_1$g = { class: "checkbox-group-wrapper" };
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "CheckBoxGroup",
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return [];
      }
    },
    options: {
      type: Object
    },
    valueKey: {
      type: String,
      default: "value"
    },
    labelKey: {
      type: String,
      default: "label"
    },
    name: {
      type: String
    }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit }) {
    const props = __props;
    function handleChange(e) {
      const { value, checked } = e.target;
      const checkedValues = [...props.modelValue];
      if (checked) {
        checkedValues.push(value);
      } else {
        checkedValues.splice(checkedValues.indexOf(value), 1);
      }
      emit("update:modelValue", checkedValues);
      emit("change", checkedValues);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$g, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option, index) => {
          return openBlock(), createBlock(unref(_sfc_main$i), {
            key: index,
            checked: __props.modelValue.includes(option[__props.valueKey]),
            label: option[__props.labelKey],
            name: __props.name,
            value: option[__props.valueKey],
            onChange: handleChange
          }, null, 8, ["checked", "label", "name", "value"]);
        }), 128))
      ]);
    };
  }
});
const _hoisted_1$f = { class: "flex items-center justify-between bg-white p-4" };
const _hoisted_2$9 = { class: "min-w-0 flex-1 self-center" };
const _hoisted_3$7 = { class: "flex items-center truncate text-xl font-bold text-gray-800" };
const _hoisted_4$4 = { class: "self-center" };
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "PageHeader",
  props: {
    title: {
      type: String
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$f, [
        createElementVNode("div", _hoisted_2$9, [
          createElementVNode("h2", _hoisted_3$7, [
            renderSlot(_ctx.$slots, "icon"),
            createElementVNode("span", null, toDisplayString(__props.title), 1)
          ])
        ]),
        createElementVNode("div", _hoisted_4$4, [
          renderSlot(_ctx.$slots, "actions")
        ])
      ]);
    };
  }
});
var Input_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".input-wrapper{box-sizing:border-box;position:relative;width:100%;display:inline-flex}.input-wrapper input{outline-width:0px;--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;resize:none;width:100%;--tw-text-opacity: 1;color:rgb(0 0 0 / var(--tw-text-opacity));display:block;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s;-webkit-appearance:none;-moz-appearance:none;appearance:none;border:1px solid #ced4da;border-radius:4px}.input-wrapper input:active{border-color:#4ccba0}.input-wrapper input:focus{border-color:#4ccba0}.input-wrapper input:disabled{opacity:.5;cursor:not-allowed}.input-wrapper input.input-lg{height:2.75rem;padding-left:1rem;padding-right:1rem;font-size:1.125rem;line-height:1.75rem}.input-wrapper input.input-md{height:2.25rem;padding-left:.75rem;padding-right:.75rem;font-size:.875rem;line-height:1.25rem}.input-wrapper input.input-sm{height:1.75rem;padding-left:.75rem;padding-right:.75rem;font-size:.75rem;line-height:1rem}.input-wrapper input.input-xs{height:1.5rem;padding-left:.5rem;padding-right:.5rem;font-size:.75rem;line-height:1rem}.input-wrapper .input-prefix{position:absolute;display:flex;top:50%;transform:translateY(-50%);align-items:center;justify-content:center}.input-wrapper .input-suffix{position:absolute;display:flex;top:50%;right:0;transform:translateY(-50%);align-items:center;justify-content:center}\n")();
const _hoisted_1$e = { class: "input-wrapper" };
const _hoisted_2$8 = {
  key: 0,
  class: "input-prefix"
};
const _hoisted_3$6 = ["disabled", "placeholder", "value"];
const _hoisted_4$3 = {
  key: 1,
  class: "input-suffix"
};
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "Input",
  props: {
    modelValue: {
      type: String
    },
    size: {
      type: String,
      default: "md"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    const props = __props;
    const classes = computed(() => {
      return [`input-${props.size}`];
    });
    function handleInput(e) {
      const { value } = e.target;
      emit("update:modelValue", value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$e, [
        _ctx.$slots.prefix ? (openBlock(), createElementBlock("div", _hoisted_2$8, [
          renderSlot(_ctx.$slots, "prefix")
        ])) : createCommentVNode("", true),
        createElementVNode("input", {
          class: normalizeClass(unref(classes)),
          disabled: __props.disabled,
          placeholder: __props.placeholder,
          value: __props.modelValue,
          type: "text",
          onInput: handleInput
        }, null, 42, _hoisted_3$6),
        _ctx.$slots.suffix ? (openBlock(), createElementBlock("div", _hoisted_4$3, [
          renderSlot(_ctx.$slots, "suffix")
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
const _hoisted_1$d = { class: "menu-container w-full p-3" };
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "Menu",
  props: {
    openIds: {
      type: Object,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    provide("openIds", props.openIds);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$d, [
        createElementVNode("ul", null, [
          renderSlot(_ctx.$slots, "default")
        ])
      ]);
    };
  }
});
var MenuItem_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => '.menu-item{cursor:pointer}.menu-item-title{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s;font-size:1rem;line-height:1.5rem;display:flex;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;padding:.5rem;font-weight:400;border-radius:4px}.menu-item-title:hover,.menu-item-title.active{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity));font-weight:500}.menu-item-title.active:after{position:absolute;top:calc(50% - 13px);left:-8px;width:3px;height:26px;content:"";background:#242e41;border-radius:6px}.menu-icon-collapse.open{transform:rotate(90deg)}.submenus-show-enter-active{transition:all .1s ease-out}.submenus-show-leave-active{transition:all .8s cubic-bezier(1,.5,.8,1)}.submenus-show-enter-from,.submenus-show-enter-to{transform:translateY(-10px);opacity:0}\n')();
const _hoisted_1$c = ["onClick"];
const _hoisted_2$7 = {
  key: 0,
  class: "menu-icon mr-3 self-center"
};
const _hoisted_3$5 = { class: "menu-title flex-1 self-center" };
const _hoisted_4$2 = { class: "sub-menu-items transition-all" };
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "MenuItem",
  props: {
    id: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  emits: ["select"],
  setup(__props, { emit }) {
    const props = __props;
    const slots = useSlots();
    const open = ref(false);
    const openIds = inject("openIds");
    if (openIds == null ? void 0 : openIds.includes(props.id)) {
      open.value = true;
    }
    const hasSubmenus = computed(() => {
      return slots.default && slots.default().length > 0;
    });
    function handleClick() {
      if (hasSubmenus.value) {
        open.value = !open.value;
        return;
      }
      emit("select", props.id);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("li", {
        class: normalizeClass([{ "has-submenus": unref(hasSubmenus) }, "menu-item"]),
        onClick: withModifiers(handleClick, ["stop"])
      }, [
        createElementVNode("div", {
          class: normalizeClass([{ active: __props.active }, "menu-item-title"])
        }, [
          _ctx.$slots.icon ? (openBlock(), createElementBlock("span", _hoisted_2$7, [
            renderSlot(_ctx.$slots, "icon")
          ])) : createCommentVNode("", true),
          createElementVNode("span", _hoisted_3$5, toDisplayString(__props.title), 1),
          _ctx.$slots.default ? (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass([{ open: open.value }, "menu-icon-collapse self-center transition-all"])
          }, [
            createVNode(unref(IconArrowRight))
          ], 2)) : createCommentVNode("", true)
        ], 2),
        createVNode(Transition, { name: "submenus-show" }, {
          default: withCtx(() => [
            withDirectives(createElementVNode("ul", _hoisted_4$2, [
              renderSlot(_ctx.$slots, "default")
            ], 512), [
              [vShow, _ctx.$slots.default && open.value]
            ])
          ]),
          _: 3
        })
      ], 10, _hoisted_1$c);
    };
  }
});
var MenuLabel_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".menu-label{padding-top:10px;padding-bottom:10px;color:#847e7e;font-size:14px;font-weight:400}\n")();
const _sfc_main$c = {};
const _hoisted_1$b = { class: "menu-label flex flex-col" };
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("li", _hoisted_1$b, [
    renderSlot(_ctx.$slots, "default")
  ]);
}
var VMenuLabel = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render]]);
const VRoutesMenu = defineComponent({
  name: "VRoutesMenu",
  props: {
    menus: {
      type: Object
    }
  },
  emits: ["select"],
  setup(props, {
    emit
  }) {
    const route = useRoute();
    const {
      push
    } = useRouter();
    const openIds = computed(() => {
      return route.matched.map((item) => item.path);
    });
    async function handleSelect(id) {
      emit("select", id);
      await push(id);
    }
    function renderIcon(icon) {
      if (!icon)
        return void 0;
      return createVNode(icon, {
        "height": "20px",
        "width": "20px"
      }, null);
    }
    function renderItems(items) {
      return items == null ? void 0 : items.map((item) => {
        var _a;
        return createVNode(Fragment, null, [((_a = item.children) == null ? void 0 : _a.length) ? createVNode(_sfc_main$d, {
          "key": item.path,
          "id": item.path,
          "title": item.name
        }, {
          default: () => [renderItems(item.children)],
          icon: () => renderIcon(item.icon)
        }) : createVNode(_sfc_main$d, {
          "key": item.path,
          "id": item.path,
          "title": item.name,
          "onSelect": handleSelect,
          "active": openIds.value.includes(item.path)
        }, {
          icon: () => renderIcon(item.icon)
        })]);
      });
    }
    return () => createVNode(_sfc_main$e, {
      "openIds": openIds.value
    }, {
      default: () => {
        var _a;
        return [(_a = props.menus) == null ? void 0 : _a.map((menu) => {
          var _a2;
          return createVNode(Fragment, null, [menu.name && createVNode(VMenuLabel, null, {
            default: () => [menu.name]
          }), ((_a2 = menu.items) == null ? void 0 : _a2.length) && renderItems(menu.items)]);
        })];
      }
    });
  }
});
var Modal_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".modal-wrapper{position:fixed;top:0px;left:0px;height:100%;width:100%;display:flex;flex-direction:row;align-items:center;justify-content:center;z-index:999}.modal-wrapper .modal-layer{flex:none;position:absolute;top:0px;left:0px;height:100%;width:100%;transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s;background-color:rgb(107 114 128 / var(--tw-bg-opacity));--tw-bg-opacity: .75}.modal-wrapper .modal-content{display:flex;flex-direction:column;position:relative;--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));align-items:stretch;--tw-shadow: 0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1);--tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);width:calc(100vw - 20px);max-height:calc(100vh - 20px);border-radius:4px}.modal-wrapper .modal-content .modal-header{display:flex;justify-content:space-between;border-bottom-width:1px}.modal-wrapper .modal-content .modal-header .modal-header-title{align-self:center;font-size:1rem;line-height:1.5rem;font-weight:700;padding:12px 16px}.modal-wrapper .modal-content .modal-header .modal-header-actions{align-self:center;height:100%}.modal-wrapper .modal-content .modal-header .modal-header-actions .modal-header-action{cursor:pointer;padding:12px 16px}.modal-wrapper .modal-content .modal-header .modal-header-actions .modal-header-action:hover{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.modal-wrapper .modal-content .modal-body{overflow-y:auto;overflow-x:hidden;flex:1 1 0%;word-wrap:break-word;padding:12px 16px}.modal-wrapper .modal-content .modal-footer{border-top-width:1px;padding:12px 16px}.modal-wrapper.modal-wrapper-fullscreen .modal-content{width:100vw!important;max-width:100vw!important;height:100vh!important;max-height:100vh!important;border-radius:0}\n")();
const _hoisted_1$a = { class: "modal-header" };
const _hoisted_2$6 = { class: "modal-header-title" };
const _hoisted_3$4 = { class: "modal-header-actions flex flex-row" };
const _hoisted_4$1 = {
  key: 0,
  class: "modal-footer"
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "Modal",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    width: {
      type: Number,
      default: 500
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    bodyClass: {
      type: Object
    }
  },
  emits: ["update:visible", "close"],
  setup(__props, { emit }) {
    const props = __props;
    const rootVisible = ref(false);
    const wrapperClasses = computed(() => {
      return {
        "modal-wrapper-fullscreen": props.fullscreen
      };
    });
    const contentStyles = computed(() => {
      return {
        maxWidth: props.width + "px"
      };
    });
    function handleClose() {
      emit("update:visible", false);
      emit("close");
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, { to: "body" }, [
        withDirectives(createElementVNode("div", {
          class: normalizeClass([unref(wrapperClasses), "modal-wrapper"]),
          "aria-modal": "true",
          role: "dialog",
          tabindex: "0",
          onKeyup: _cache[4] || (_cache[4] = withKeys(($event) => handleClose(), ["esc"]))
        }, [
          createVNode(Transition, {
            "enter-active-class": "ease-out duration-200",
            "enter-from-class": "opacity-0",
            "enter-to-class": "opacity-100",
            "leave-active-class": "ease-in duration-100",
            "leave-from-class": "opacity-100",
            "leave-to-class": "opacity-0",
            onBeforeEnter: _cache[1] || (_cache[1] = ($event) => rootVisible.value = true),
            onAfterLeave: _cache[2] || (_cache[2] = ($event) => rootVisible.value = false)
          }, {
            default: withCtx(() => [
              withDirectives(createElementVNode("div", {
                class: "modal-layer",
                onClick: _cache[0] || (_cache[0] = ($event) => handleClose())
              }, null, 512), [
                [vShow, __props.visible]
              ])
            ]),
            _: 1
          }),
          createVNode(Transition, {
            "enter-active-class": "ease-out duration-200",
            "enter-from-class": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            "enter-to-class": "opacity-100 translate-y-0 sm:scale-100",
            "leave-active-class": "ease-in duration-100",
            "leave-from-class": "opacity-100 translate-y-0 sm:scale-100",
            "leave-to-class": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          }, {
            default: withCtx(() => [
              withDirectives(createElementVNode("div", {
                style: normalizeStyle(unref(contentStyles)),
                class: "modal-content transform transition-all"
              }, [
                createElementVNode("div", _hoisted_1$a, [
                  renderSlot(_ctx.$slots, "header", {}, () => [
                    createElementVNode("div", _hoisted_2$6, toDisplayString(__props.title), 1),
                    createElementVNode("div", _hoisted_3$4, [
                      renderSlot(_ctx.$slots, "actions"),
                      createElementVNode("div", {
                        class: "modal-header-action",
                        onClick: _cache[3] || (_cache[3] = ($event) => handleClose())
                      }, [
                        createVNode(unref(IconClose))
                      ])
                    ])
                  ])
                ]),
                createElementVNode("div", {
                  class: normalizeClass([__props.bodyClass, "modal-body"])
                }, [
                  renderSlot(_ctx.$slots, "default")
                ], 2),
                _ctx.$slots.footer ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
                  renderSlot(_ctx.$slots, "footer")
                ])) : createCommentVNode("", true)
              ], 4), [
                [vShow, __props.visible]
              ])
            ]),
            _: 3
          })
        ], 34), [
          [vShow, rootVisible.value]
        ])
      ]);
    };
  }
});
var Radio_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".radio-wrapper{display:flex;align-items:center;box-sizing:border-box;flex-grow:0}.radio-wrapper .radio-inner{align-self:center;position:relative}.radio-wrapper .radio-label{display:flex;align-self:center;align-items:flex-start;margin-left:.75rem}\n")();
const _hoisted_1$9 = { class: "radio-inner" };
const _hoisted_2$5 = ["id", "checked", "name", "value"];
const _hoisted_3$3 = ["for"];
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "Radio",
  props: {
    modelValue: {
      type: [String, Number, Boolean]
    },
    value: {
      type: [String, Number, Boolean]
    },
    label: {
      type: String
    },
    name: {
      type: String
    }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit }) {
    const props = __props;
    const id = ["radio", props.name, props.value].filter((item) => !!item).join("-");
    const checked = computed(() => props.modelValue === props.value);
    function handleChange(e) {
      const { value } = e.target;
      emit("update:modelValue", value);
      emit("change", value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([{ "radio-wrapper-checked": unref(checked) }, "radio-wrapper"])
      }, [
        createElementVNode("div", _hoisted_1$9, [
          createElementVNode("input", {
            id: unref(id),
            checked: unref(checked),
            name: __props.name,
            value: __props.value,
            type: "radio",
            onChange: handleChange
          }, null, 40, _hoisted_2$5)
        ]),
        __props.label ? (openBlock(), createElementBlock("label", {
          key: 0,
          for: unref(id),
          class: "radio-label"
        }, toDisplayString(__props.label), 9, _hoisted_3$3)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
const _hoisted_1$8 = { class: "radio-group-wrapper" };
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "RadioGroup",
  props: {
    modelValue: {
      type: [String, Number, Boolean]
    },
    options: {
      type: Object
    },
    valueKey: {
      type: String,
      default: "value"
    },
    labelKey: {
      type: String,
      default: "label"
    },
    name: {
      type: String
    }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit }) {
    function handleChange(value) {
      emit("update:modelValue", value);
      emit("change", value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$8, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option, index) => {
          return openBlock(), createBlock(unref(_sfc_main$a), {
            key: index,
            label: option[__props.labelKey] + "",
            "model-value": __props.modelValue,
            name: __props.name,
            value: option[__props.valueKey],
            onChange: handleChange
          }, null, 8, ["label", "model-value", "name", "value"]);
        }), 128))
      ]);
    };
  }
});
var Select_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".select-wrapper{box-sizing:border-box;position:relative;width:100%;display:inline-flex}.select-wrapper select{outline-width:0px;--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;width:100%;--tw-text-opacity: 1;color:rgb(0 0 0 / var(--tw-text-opacity));display:block;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s;-webkit-appearance:none;-moz-appearance:none;appearance:none;border:1px solid #ced4da;border-radius:4px}.select-wrapper select:active{border-color:#4ccba0}.select-wrapper select:focus{border-color:#4ccba0}.select-wrapper select:disabled{opacity:.5;cursor:not-allowed}.select-wrapper select.select-lg{height:2.75rem;padding-left:1rem;padding-right:1rem;font-size:1.125rem;line-height:1.75rem}.select-wrapper select.select-md{height:2.25rem;padding-left:.75rem;padding-right:.75rem;font-size:.875rem;line-height:1.25rem}.select-wrapper select.select-sm{height:1.75rem;padding-left:.75rem;padding-right:.75rem;font-size:.75rem;line-height:1rem}.select-wrapper select.select-xs{height:1.5rem;padding-left:.5rem;padding-right:.5rem;font-size:.75rem;line-height:1rem}\n")();
const _hoisted_1$7 = { class: "select-wrapper" };
const _hoisted_2$4 = ["disabled", "value"];
const _hoisted_3$2 = {
  key: "placeholder",
  disabled: "",
  hidden: "",
  value: ""
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "Select",
  props: {
    modelValue: {
      type: String
    },
    size: {
      type: String,
      default: "md"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    const props = __props;
    const classes = computed(() => {
      return [`select-${props.size}`];
    });
    function handleChange(e) {
      const { value } = e.target;
      emit("update:modelValue", value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$7, [
        createElementVNode("select", {
          class: normalizeClass(unref(classes)),
          disabled: __props.disabled,
          value: __props.modelValue,
          onChange: handleChange
        }, [
          __props.placeholder ? (openBlock(), createElementBlock("option", _hoisted_3$2, toDisplayString(__props.placeholder), 1)) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "default")
        ], 42, _hoisted_2$4)
      ]);
    };
  }
});
const _hoisted_1$6 = ["value"];
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "Option",
  props: {
    value: {
      type: [String, Number, Boolean]
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("option", { value: __props.value }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, _hoisted_1$6);
    };
  }
});
const SpacingSize = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20
};
var Space_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".space-wrapper{display:inline-flex;box-sizing:border-box}.space-wrapper.space-direction-row{flex-direction:row}.space-wrapper.space-direction-column{flex-direction:column}.space-wrapper.space-align-center{align-items:center}.space-wrapper.space-align-start{align-items:flex-start}.space-wrapper.space-align-end{align-items:flex-end}.space-wrapper.space-align-stretch{align-items:stretch}\n")();
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "Space",
  props: {
    spacing: {
      type: String,
      default: "xs"
    },
    direction: {
      type: String,
      default: "row"
    },
    align: {
      type: String,
      default: "center"
    }
  },
  setup(__props) {
    const props = __props;
    const wrapperClasses = computed(() => {
      const { direction, align } = props;
      return [`space-direction-${direction}`, `space-align-${align}`];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([unref(wrapperClasses), "space-wrapper"]),
        style: normalizeStyle(`gap: ${unref(SpacingSize)[__props.spacing]}px`)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 6);
    };
  }
});
var Tabs_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".tabs-wrapper{display:flex}.tabs-wrapper.tabs-direction-row{flex-direction:column}.tabs-wrapper.tabs-direction-row .tabs-items-wrapper{margin-top:.5rem}.tabs-wrapper.tabs-direction-column .tabs-items-wrapper{margin-left:.5rem}\n")();
const _hoisted_1$5 = { class: "tabs-bar-wrapper" };
const _hoisted_2$3 = { class: "tabs-items-wrapper" };
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Tabs",
  props: {
    activeId: {
      type: [Number, String]
    },
    type: {
      type: String,
      default: "default"
    },
    direction: {
      type: String,
      default: "row"
    },
    idKey: {
      type: String,
      default: "id"
    },
    labelKey: {
      type: String,
      default: "label"
    }
  },
  emits: ["update:activeId", "change"],
  setup(__props, { emit }) {
    const props = __props;
    provide("activeId", computed(() => props.activeId));
    const slots = useSlots();
    const tabItems = computed(() => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots).map(({ props: slotProps }) => {
        return {
          id: slotProps == null ? void 0 : slotProps[props.idKey],
          label: slotProps == null ? void 0 : slotProps[props.labelKey]
        };
      });
    });
    const classes = computed(() => {
      return [`tabs-direction-${props.direction}`];
    });
    const handleChange = (id) => {
      emit("update:activeId", id);
      emit("change", id);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([unref(classes), "tabs-wrapper"])
      }, [
        createElementVNode("div", _hoisted_1$5, [
          createVNode(unref(_sfc_main$3), {
            activeId: __props.activeId,
            direction: __props.direction,
            items: unref(tabItems),
            type: __props.type,
            onChange: handleChange
          }, null, 8, ["activeId", "direction", "items", "type"])
        ]),
        createElementVNode("div", _hoisted_2$3, [
          renderSlot(_ctx.$slots, "default")
        ])
      ], 2);
    };
  }
});
const _hoisted_1$4 = {
  key: 0,
  class: "tabs-item-wrapper"
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "TabItem",
  props: {
    id: {
      type: String
    },
    label: {
      type: String
    }
  },
  setup(__props) {
    const props = __props;
    const activeId = inject("activeId");
    const isActive = computed(() => {
      return (activeId == null ? void 0 : activeId.value) === props.id;
    });
    return (_ctx, _cache) => {
      return unref(isActive) ? (openBlock(), createElementBlock("div", _hoisted_1$4, [
        renderSlot(_ctx.$slots, "default")
      ])) : createCommentVNode("", true);
    };
  }
});
var Tabbar_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".tabbar-wrapper .tabbar-items{display:flex;align-items:center;flex-direction:row}.tabbar-wrapper .tabbar-item{display:flex;cursor:pointer;align-self:center;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s;font-size:1rem;line-height:1.5rem;justify-content:center;gap:.5rem}.tabbar-wrapper .tabbar-item .tabbar-item-label,.tabbar-wrapper .tabbar-item .tabbar-item-icon{align-self:center}.tabbar-wrapper.tabbar-default{border-bottom-width:2px;--tw-border-opacity: 1;border-bottom-color:rgb(243 244 246 / var(--tw-border-opacity))}.tabbar-wrapper.tabbar-default .tabbar-items{margin-bottom:-2px;justify-content:flex-start}.tabbar-wrapper.tabbar-default .tabbar-item{height:2.5rem;padding:.25rem 1.25rem;--tw-border-opacity: 1;border-bottom-color:rgb(243 244 246 / var(--tw-border-opacity));border-bottom-width:2px}.tabbar-wrapper.tabbar-default .tabbar-item.tabbar-item-active{color:#0e1731;border-bottom-color:#0e1731}.tabbar-wrapper.tabbar-pills .tabbar-items{gap:.25rem;justify-content:flex-start}.tabbar-wrapper.tabbar-pills .tabbar-item{height:2.5rem;padding:.25rem 2.25rem;opacity:.7;border-radius:4px}.tabbar-wrapper.tabbar-pills .tabbar-item.tabbar-item-active{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity));opacity:1}.tabbar-wrapper.tabbar-pills .tabbar-item:hover{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.tabbar-wrapper.tabbar-outline{padding:.25rem;--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity));border-radius:4px}.tabbar-wrapper.tabbar-outline .tabbar-items{gap:.25rem;justify-content:flex-start}.tabbar-wrapper.tabbar-outline .tabbar-item{height:2.5rem;padding:.25rem 2.25rem;opacity:.7;border-radius:4px}.tabbar-wrapper.tabbar-outline .tabbar-item.tabbar-item-active{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));opacity:1;--tw-shadow: 0 1px 2px 0 rgb(0 0 0 / .05);--tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.tabbar-wrapper.tabbar-outline .tabbar-item:hover{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.tabbar-wrapper.tabbar-direction-row .tabbar-items{flex-direction:row}.tabbar-wrapper.tabbar-direction-column .tabbar-items{flex-direction:column}.tabbar-wrapper.tabbar-direction-column.tabbar-default{border-bottom-width:0;border-bottom-width:0px;border-right-width:2px;--tw-border-opacity: 1;border-right-color:rgb(243 244 246 / var(--tw-border-opacity))}.tabbar-wrapper.tabbar-direction-column.tabbar-default .tabbar-items{margin-bottom:0;margin-right:-2px}.tabbar-wrapper.tabbar-direction-column.tabbar-default .tabbar-item{border-bottom-width:0;border-right-width:2px}.tabbar-wrapper.tabbar-direction-column.tabbar-default .tabbar-item.tabbar-item-active{border-right-color:#0e1731}\n")();
const _hoisted_1$3 = { class: "tabbar-items" };
const _hoisted_2$2 = ["onClick"];
const _hoisted_3$1 = {
  key: 0,
  class: "tabbar-item-icon"
};
const _hoisted_4 = {
  key: 1,
  class: "tabbar-item-label"
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Tabbar",
  props: {
    activeId: {
      type: [Number, String]
    },
    items: {
      type: Object
    },
    type: {
      type: String,
      default: "default"
    },
    direction: {
      type: String,
      default: "row"
    },
    idKey: {
      type: String,
      default: "id"
    },
    labelKey: {
      type: String,
      default: "label"
    }
  },
  emits: ["update:activeId", "change"],
  setup(__props, { emit }) {
    const props = __props;
    const classes = computed(() => {
      return [`tabbar-${props.type}`, `tabbar-direction-${props.direction}`];
    });
    const handleChange = (id) => {
      emit("update:activeId", id);
      emit("change", id);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([unref(classes), "tabbar-wrapper"])
      }, [
        createElementVNode("div", _hoisted_1$3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item, index) => {
            return openBlock(), createElementBlock("div", {
              key: index,
              class: normalizeClass([{ "tabbar-item-active": item[__props.idKey] === __props.activeId }, "tabbar-item"]),
              onClick: ($event) => handleChange(item[__props.idKey])
            }, [
              item.icon ? (openBlock(), createElementBlock("div", _hoisted_3$1, [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon)))
              ])) : createCommentVNode("", true),
              item[__props.labelKey] ? (openBlock(), createElementBlock("div", _hoisted_4, toDisplayString(item[__props.labelKey]), 1)) : createCommentVNode("", true)
            ], 10, _hoisted_2$2);
          }), 128))
        ])
      ], 2);
    };
  }
});
var Tag_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".tag-wrapper{border-radius:4px;display:inline-flex;flex-shrink:0;flex-wrap:wrap;box-sizing:border-box;cursor:pointer;text-align:center;align-items:center;justify-content:center;width:auto;vertical-align:middle;height:1.25rem;font-size:.75rem;line-height:1rem}.tag-wrapper.tag-default{border:1px solid #d9d9d9}.tag-wrapper.tag-primary{background:#4ccba0;border:1px solid #4ccba0;--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.tag-wrapper.tag-secondary{background:#0e1731;border:1px solid #0e1731;--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.tag-wrapper.tag-danger{background:#d71d1d;border:1px solid #d71d1d;--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.tag-wrapper.tag-rounded{border-radius:9999px}.tag-wrapper .tag-content{padding-left:.25rem;padding-right:.25rem}.tag-wrapper .tag-left-icon{padding-left:.25rem}.tag-wrapper .tag-right-icon{padding-right:.25rem}\n")();
const _hoisted_1$2 = {
  key: 0,
  class: "tag-left-icon"
};
const _hoisted_2$1 = { class: "tag-content" };
const _hoisted_3 = {
  key: 1,
  class: "tag-right-icon"
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Tag",
  props: {
    theme: {
      type: String,
      default: "default"
    },
    rounded: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const classes = computed(() => {
      return [`tag-${props.theme}`, { "tag-rounded": props.rounded }];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([unref(classes), "tag-wrapper"])
      }, [
        _ctx.$slots.leftIcon ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
          renderSlot(_ctx.$slots, "leftIcon")
        ])) : createCommentVNode("", true),
        createElementVNode("span", _hoisted_2$1, [
          renderSlot(_ctx.$slots, "default")
        ]),
        _ctx.$slots.rightIcon ? (openBlock(), createElementBlock("div", _hoisted_3, [
          renderSlot(_ctx.$slots, "rightIcon")
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
var Textarea_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() => ".textarea-wrapper{box-sizing:border-box;position:relative;width:100%;display:inline-flex}.textarea-wrapper textarea{outline-width:0px;--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;width:100%;--tw-text-opacity: 1;color:rgb(0 0 0 / var(--tw-text-opacity));display:block;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:.75rem;font-size:.875rem;line-height:1.25rem;border:1px solid #ced4da;border-radius:4px}.textarea-wrapper textarea:active{border-color:#4ccba0}.textarea-wrapper textarea:focus{border-color:#4ccba0}.textarea-wrapper textarea:disabled{opacity:.5;cursor:not-allowed}\n")();
const _hoisted_1$1 = { class: "textarea-wrapper" };
const _hoisted_2 = ["disabled", "placeholder", "rows", "value"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Textarea",
  props: {
    modelValue: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    rows: {
      type: Number,
      default: 3
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    function handleInput(e) {
      const { value } = e.target;
      emit("update:modelValue", value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createElementVNode("textarea", {
          disabled: __props.disabled,
          placeholder: __props.placeholder,
          rows: __props.rows,
          value: __props.modelValue,
          onInput: handleInput
        }, "\n    ", 40, _hoisted_2)
      ]);
    };
  }
});
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function isElement$1(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles$1 = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect$2,
  requires: ["computeStyles"]
};
function getBasePlacement$1(placement) {
  return placement.split("-")[0];
}
var max = Math.max;
var min = Math.min;
var round = Math.round;
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth;
    if (offsetWidth > 0) {
      scaleX = round(rect.width) / offsetWidth || 1;
    }
    if (offsetHeight > 0) {
      scaleY = round(rect.height) / offsetHeight || 1;
    }
  }
  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
function getDocumentElement(element) {
  return ((isElement$1(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
  var isIE = navigator.userAgent.indexOf("Trident") !== -1;
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min2, value, max2) {
  var v = within(min2, value, max2);
  return v > max2 ? max2 : v;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement$1(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect$1(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow$1 = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect$1,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function getVariation(placement) {
  return placement.split("-")[1];
}
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref) {
  var x = _ref.x, y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref4.x;
  y = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement$1(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles$1 = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
var passive = {
  passive: true
};
function effect(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect,
  data: {}
};
var hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash[matched];
  });
}
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle(body || html).direction === "rtl") {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement$1(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement$1(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement$1(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement$1(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement$1(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement$1(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement$1(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement$1(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break")
        break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip$1 = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide$1 = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement$1(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
}
var offset$1 = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets$1 = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement$1(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min$1 = offset2 + overflow[mainSide];
    var max$1 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
var preventOverflow$1 = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce$1(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn2());
        });
      });
    }
    return pending;
  };
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options2);
        state.scrollParents = {
          reference: isElement$1(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      update: debounce$1(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref3) {
        var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect3 = _ref3.effect;
        if (typeof effect3 === "function") {
          var cleanupFn = effect3({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});
var BOX_CLASS = "tippy-box";
var CONTENT_CLASS = "tippy-content";
var BACKDROP_CLASS = "tippy-backdrop";
var ARROW_CLASS = "tippy-arrow";
var SVG_ARROW_CLASS = "tippy-svg-arrow";
var TOUCH_OPTIONS = {
  passive: true,
  capture: true
};
var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO2() {
  return document.body;
};
function getValueAtIndexOrReturn(value, index, defaultValue) {
  if (Array.isArray(value)) {
    var v = value[index];
    return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
  }
  return value;
}
function isType(value, type) {
  var str = {}.toString.call(value);
  return str.indexOf("[object") === 0 && str.indexOf(type + "]") > -1;
}
function invokeWithArgsOrReturn(value, args) {
  return typeof value === "function" ? value.apply(void 0, args) : value;
}
function debounce(fn2, ms) {
  if (ms === 0) {
    return fn2;
  }
  var timeout;
  return function(arg) {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      fn2(arg);
    }, ms);
  };
}
function splitBySpaces(value) {
  return value.split(/\s+/).filter(Boolean);
}
function normalizeToArray(value) {
  return [].concat(value);
}
function pushIfUnique(arr, value) {
  if (arr.indexOf(value) === -1) {
    arr.push(value);
  }
}
function unique(arr) {
  return arr.filter(function(item, index) {
    return arr.indexOf(item) === index;
  });
}
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
function arrayFrom(value) {
  return [].slice.call(value);
}
function removeUndefinedProps(obj) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (obj[key] !== void 0) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
function div() {
  return document.createElement("div");
}
function isElement(value) {
  return ["Element", "Fragment"].some(function(type) {
    return isType(value, type);
  });
}
function isNodeList(value) {
  return isType(value, "NodeList");
}
function isMouseEvent(value) {
  return isType(value, "MouseEvent");
}
function isReferenceElement(value) {
  return !!(value && value._tippy && value._tippy.reference === value);
}
function getArrayOfElements(value) {
  if (isElement(value)) {
    return [value];
  }
  if (isNodeList(value)) {
    return arrayFrom(value);
  }
  if (Array.isArray(value)) {
    return value;
  }
  return arrayFrom(document.querySelectorAll(value));
}
function setTransitionDuration(els, value) {
  els.forEach(function(el) {
    if (el) {
      el.style.transitionDuration = value + "ms";
    }
  });
}
function setVisibilityState(els, state) {
  els.forEach(function(el) {
    if (el) {
      el.setAttribute("data-state", state);
    }
  });
}
function getOwnerDocument(elementOrElements) {
  var _element$ownerDocumen;
  var _normalizeToArray = normalizeToArray(elementOrElements), element = _normalizeToArray[0];
  return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
}
function isCursorOutsideInteractiveBorder(popperTreeData, event) {
  var clientX = event.clientX, clientY = event.clientY;
  return popperTreeData.every(function(_ref) {
    var popperRect = _ref.popperRect, popperState = _ref.popperState, props = _ref.props;
    var interactiveBorder = props.interactiveBorder;
    var basePlacement = getBasePlacement(popperState.placement);
    var offsetData = popperState.modifiersData.offset;
    if (!offsetData) {
      return true;
    }
    var topDistance = basePlacement === "bottom" ? offsetData.top.y : 0;
    var bottomDistance = basePlacement === "top" ? offsetData.bottom.y : 0;
    var leftDistance = basePlacement === "right" ? offsetData.left.x : 0;
    var rightDistance = basePlacement === "left" ? offsetData.right.x : 0;
    var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
    var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
    var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
    var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
  });
}
function updateTransitionEndListener(box, action, listener) {
  var method = action + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(event) {
    box[method](event, listener);
  });
}
function actualContains(parent, child) {
  var target = child;
  while (target) {
    var _target$getRootNode;
    if (parent.contains(target)) {
      return true;
    }
    target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
  }
  return false;
}
var currentInput = {
  isTouch: false
};
var lastMouseMoveTime = 0;
function onDocumentTouchStart() {
  if (currentInput.isTouch) {
    return;
  }
  currentInput.isTouch = true;
  if (window.performance) {
    document.addEventListener("mousemove", onDocumentMouseMove);
  }
}
function onDocumentMouseMove() {
  var now = performance.now();
  if (now - lastMouseMoveTime < 20) {
    currentInput.isTouch = false;
    document.removeEventListener("mousemove", onDocumentMouseMove);
  }
  lastMouseMoveTime = now;
}
function onWindowBlur() {
  var activeElement = document.activeElement;
  if (isReferenceElement(activeElement)) {
    var instance = activeElement._tippy;
    if (activeElement.blur && !instance.state.isVisible) {
      activeElement.blur();
    }
  }
}
function bindGlobalEventListeners() {
  document.addEventListener("touchstart", onDocumentTouchStart, TOUCH_OPTIONS);
  window.addEventListener("blur", onWindowBlur);
}
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
var isIE11 = isBrowser ? !!window.msCrypto : false;
var pluginProps = {
  animateFill: false,
  followCursor: false,
  inlinePositioning: false,
  sticky: false
};
var renderProps = {
  allowHTML: false,
  animation: "fade",
  arrow: true,
  content: "",
  inertia: false,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
};
var defaultProps = Object.assign({
  appendTo: TIPPY_DEFAULT_APPEND_TO,
  aria: {
    content: "auto",
    expanded: "auto"
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: true,
  ignoreAttributes: false,
  interactive: false,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: "",
  offset: [0, 10],
  onAfterUpdate: function onAfterUpdate() {
  },
  onBeforeUpdate: function onBeforeUpdate() {
  },
  onCreate: function onCreate() {
  },
  onDestroy: function onDestroy() {
  },
  onHidden: function onHidden() {
  },
  onHide: function onHide() {
  },
  onMount: function onMount() {
  },
  onShow: function onShow() {
  },
  onShown: function onShown() {
  },
  onTrigger: function onTrigger() {
  },
  onUntrigger: function onUntrigger() {
  },
  onClickOutside: function onClickOutside() {
  },
  placement: "top",
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: false,
  touch: true,
  trigger: "mouseenter focus",
  triggerTarget: null
}, pluginProps, renderProps);
var defaultKeys = Object.keys(defaultProps);
var setDefaultProps = function setDefaultProps2(partialProps) {
  var keys = Object.keys(partialProps);
  keys.forEach(function(key) {
    defaultProps[key] = partialProps[key];
  });
};
function getExtendedPassedProps(passedProps) {
  var plugins = passedProps.plugins || [];
  var pluginProps2 = plugins.reduce(function(acc, plugin) {
    var name = plugin.name, defaultValue = plugin.defaultValue;
    if (name) {
      var _name;
      acc[name] = passedProps[name] !== void 0 ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
    }
    return acc;
  }, {});
  return Object.assign({}, passedProps, pluginProps2);
}
function getDataAttributeProps(reference2, plugins) {
  var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
    plugins
  }))) : defaultKeys;
  var props = propKeys.reduce(function(acc, key) {
    var valueAsString = (reference2.getAttribute("data-tippy-" + key) || "").trim();
    if (!valueAsString) {
      return acc;
    }
    if (key === "content") {
      acc[key] = valueAsString;
    } else {
      try {
        acc[key] = JSON.parse(valueAsString);
      } catch (e) {
        acc[key] = valueAsString;
      }
    }
    return acc;
  }, {});
  return props;
}
function evaluateProps(reference2, props) {
  var out = Object.assign({}, props, {
    content: invokeWithArgsOrReturn(props.content, [reference2])
  }, props.ignoreAttributes ? {} : getDataAttributeProps(reference2, props.plugins));
  out.aria = Object.assign({}, defaultProps.aria, out.aria);
  out.aria = {
    expanded: out.aria.expanded === "auto" ? props.interactive : out.aria.expanded,
    content: out.aria.content === "auto" ? props.interactive ? null : "describedby" : out.aria.content
  };
  return out;
}
var innerHTML = function innerHTML2() {
  return "innerHTML";
};
function dangerouslySetInnerHTML(element, html) {
  element[innerHTML()] = html;
}
function createArrowElement(value) {
  var arrow2 = div();
  if (value === true) {
    arrow2.className = ARROW_CLASS;
  } else {
    arrow2.className = SVG_ARROW_CLASS;
    if (isElement(value)) {
      arrow2.appendChild(value);
    } else {
      dangerouslySetInnerHTML(arrow2, value);
    }
  }
  return arrow2;
}
function setContent(content, props) {
  if (isElement(props.content)) {
    dangerouslySetInnerHTML(content, "");
    content.appendChild(props.content);
  } else if (typeof props.content !== "function") {
    if (props.allowHTML) {
      dangerouslySetInnerHTML(content, props.content);
    } else {
      content.textContent = props.content;
    }
  }
}
function getChildren(popper2) {
  var box = popper2.firstElementChild;
  var boxChildren = arrayFrom(box.children);
  return {
    box,
    content: boxChildren.find(function(node) {
      return node.classList.contains(CONTENT_CLASS);
    }),
    arrow: boxChildren.find(function(node) {
      return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
    }),
    backdrop: boxChildren.find(function(node) {
      return node.classList.contains(BACKDROP_CLASS);
    })
  };
}
function render(instance) {
  var popper2 = div();
  var box = div();
  box.className = BOX_CLASS;
  box.setAttribute("data-state", "hidden");
  box.setAttribute("tabindex", "-1");
  var content = div();
  content.className = CONTENT_CLASS;
  content.setAttribute("data-state", "hidden");
  setContent(content, instance.props);
  popper2.appendChild(box);
  box.appendChild(content);
  onUpdate(instance.props, instance.props);
  function onUpdate(prevProps, nextProps) {
    var _getChildren = getChildren(popper2), box2 = _getChildren.box, content2 = _getChildren.content, arrow2 = _getChildren.arrow;
    if (nextProps.theme) {
      box2.setAttribute("data-theme", nextProps.theme);
    } else {
      box2.removeAttribute("data-theme");
    }
    if (typeof nextProps.animation === "string") {
      box2.setAttribute("data-animation", nextProps.animation);
    } else {
      box2.removeAttribute("data-animation");
    }
    if (nextProps.inertia) {
      box2.setAttribute("data-inertia", "");
    } else {
      box2.removeAttribute("data-inertia");
    }
    box2.style.maxWidth = typeof nextProps.maxWidth === "number" ? nextProps.maxWidth + "px" : nextProps.maxWidth;
    if (nextProps.role) {
      box2.setAttribute("role", nextProps.role);
    } else {
      box2.removeAttribute("role");
    }
    if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
      setContent(content2, instance.props);
    }
    if (nextProps.arrow) {
      if (!arrow2) {
        box2.appendChild(createArrowElement(nextProps.arrow));
      } else if (prevProps.arrow !== nextProps.arrow) {
        box2.removeChild(arrow2);
        box2.appendChild(createArrowElement(nextProps.arrow));
      }
    } else if (arrow2) {
      box2.removeChild(arrow2);
    }
  }
  return {
    popper: popper2,
    onUpdate
  };
}
render.$$tippy = true;
var idCounter = 1;
var mouseMoveListeners = [];
var mountedInstances = [];
function createTippy(reference2, passedProps) {
  var props = evaluateProps(reference2, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps))));
  var showTimeout;
  var hideTimeout;
  var scheduleHideAnimationFrame;
  var isVisibleFromClick = false;
  var didHideDueToDocumentMouseDown = false;
  var didTouchMove = false;
  var ignoreOnFirstUpdate = false;
  var lastTriggerEvent;
  var currentTransitionEndListener;
  var onFirstUpdate;
  var listeners = [];
  var debouncedOnMouseMove = debounce(onMouseMove, props.interactiveDebounce);
  var currentTarget;
  var id = idCounter++;
  var popperInstance = null;
  var plugins = unique(props.plugins);
  var state = {
    isEnabled: true,
    isVisible: false,
    isDestroyed: false,
    isMounted: false,
    isShown: false
  };
  var instance = {
    id,
    reference: reference2,
    popper: div(),
    popperInstance,
    props,
    state,
    plugins,
    clearDelayTimeouts,
    setProps,
    setContent: setContent2,
    show,
    hide: hide2,
    hideWithInteractivity,
    enable,
    disable,
    unmount,
    destroy
  };
  if (!props.render) {
    return instance;
  }
  var _props$render = props.render(instance), popper2 = _props$render.popper, onUpdate = _props$render.onUpdate;
  popper2.setAttribute("data-tippy-root", "");
  popper2.id = "tippy-" + instance.id;
  instance.popper = popper2;
  reference2._tippy = instance;
  popper2._tippy = instance;
  var pluginsHooks = plugins.map(function(plugin) {
    return plugin.fn(instance);
  });
  var hasAriaExpanded = reference2.hasAttribute("aria-expanded");
  addListeners();
  handleAriaExpandedAttribute();
  handleStyles();
  invokeHook("onCreate", [instance]);
  if (props.showOnCreate) {
    scheduleShow();
  }
  popper2.addEventListener("mouseenter", function() {
    if (instance.props.interactive && instance.state.isVisible) {
      instance.clearDelayTimeouts();
    }
  });
  popper2.addEventListener("mouseleave", function() {
    if (instance.props.interactive && instance.props.trigger.indexOf("mouseenter") >= 0) {
      getDocument().addEventListener("mousemove", debouncedOnMouseMove);
    }
  });
  return instance;
  function getNormalizedTouchSettings() {
    var touch = instance.props.touch;
    return Array.isArray(touch) ? touch : [touch, 0];
  }
  function getIsCustomTouchBehavior() {
    return getNormalizedTouchSettings()[0] === "hold";
  }
  function getIsDefaultRenderFn() {
    var _instance$props$rende;
    return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
  }
  function getCurrentTarget() {
    return currentTarget || reference2;
  }
  function getDocument() {
    var parent = getCurrentTarget().parentNode;
    return parent ? getOwnerDocument(parent) : document;
  }
  function getDefaultTemplateChildren() {
    return getChildren(popper2);
  }
  function getDelay(isShow) {
    if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === "focus") {
      return 0;
    }
    return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
  }
  function handleStyles(fromHide) {
    if (fromHide === void 0) {
      fromHide = false;
    }
    popper2.style.pointerEvents = instance.props.interactive && !fromHide ? "" : "none";
    popper2.style.zIndex = "" + instance.props.zIndex;
  }
  function invokeHook(hook, args, shouldInvokePropsHook) {
    if (shouldInvokePropsHook === void 0) {
      shouldInvokePropsHook = true;
    }
    pluginsHooks.forEach(function(pluginHooks) {
      if (pluginHooks[hook]) {
        pluginHooks[hook].apply(pluginHooks, args);
      }
    });
    if (shouldInvokePropsHook) {
      var _instance$props;
      (_instance$props = instance.props)[hook].apply(_instance$props, args);
    }
  }
  function handleAriaContentAttribute() {
    var aria = instance.props.aria;
    if (!aria.content) {
      return;
    }
    var attr = "aria-" + aria.content;
    var id2 = popper2.id;
    var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
    nodes.forEach(function(node) {
      var currentValue = node.getAttribute(attr);
      if (instance.state.isVisible) {
        node.setAttribute(attr, currentValue ? currentValue + " " + id2 : id2);
      } else {
        var nextValue = currentValue && currentValue.replace(id2, "").trim();
        if (nextValue) {
          node.setAttribute(attr, nextValue);
        } else {
          node.removeAttribute(attr);
        }
      }
    });
  }
  function handleAriaExpandedAttribute() {
    if (hasAriaExpanded || !instance.props.aria.expanded) {
      return;
    }
    var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
    nodes.forEach(function(node) {
      if (instance.props.interactive) {
        node.setAttribute("aria-expanded", instance.state.isVisible && node === getCurrentTarget() ? "true" : "false");
      } else {
        node.removeAttribute("aria-expanded");
      }
    });
  }
  function cleanupInteractiveMouseListeners() {
    getDocument().removeEventListener("mousemove", debouncedOnMouseMove);
    mouseMoveListeners = mouseMoveListeners.filter(function(listener) {
      return listener !== debouncedOnMouseMove;
    });
  }
  function onDocumentPress(event) {
    if (currentInput.isTouch) {
      if (didTouchMove || event.type === "mousedown") {
        return;
      }
    }
    var actualTarget = event.composedPath && event.composedPath()[0] || event.target;
    if (instance.props.interactive && actualContains(popper2, actualTarget)) {
      return;
    }
    if (normalizeToArray(instance.props.triggerTarget || reference2).some(function(el) {
      return actualContains(el, actualTarget);
    })) {
      if (currentInput.isTouch) {
        return;
      }
      if (instance.state.isVisible && instance.props.trigger.indexOf("click") >= 0) {
        return;
      }
    } else {
      invokeHook("onClickOutside", [instance, event]);
    }
    if (instance.props.hideOnClick === true) {
      instance.clearDelayTimeouts();
      instance.hide();
      didHideDueToDocumentMouseDown = true;
      setTimeout(function() {
        didHideDueToDocumentMouseDown = false;
      });
      if (!instance.state.isMounted) {
        removeDocumentPress();
      }
    }
  }
  function onTouchMove() {
    didTouchMove = true;
  }
  function onTouchStart() {
    didTouchMove = false;
  }
  function addDocumentPress() {
    var doc = getDocument();
    doc.addEventListener("mousedown", onDocumentPress, true);
    doc.addEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
    doc.addEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
    doc.addEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
  }
  function removeDocumentPress() {
    var doc = getDocument();
    doc.removeEventListener("mousedown", onDocumentPress, true);
    doc.removeEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
    doc.removeEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
    doc.removeEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
  }
  function onTransitionedOut(duration, callback) {
    onTransitionEnd(duration, function() {
      if (!instance.state.isVisible && popper2.parentNode && popper2.parentNode.contains(popper2)) {
        callback();
      }
    });
  }
  function onTransitionedIn(duration, callback) {
    onTransitionEnd(duration, callback);
  }
  function onTransitionEnd(duration, callback) {
    var box = getDefaultTemplateChildren().box;
    function listener(event) {
      if (event.target === box) {
        updateTransitionEndListener(box, "remove", listener);
        callback();
      }
    }
    if (duration === 0) {
      return callback();
    }
    updateTransitionEndListener(box, "remove", currentTransitionEndListener);
    updateTransitionEndListener(box, "add", listener);
    currentTransitionEndListener = listener;
  }
  function on(eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }
    var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
    nodes.forEach(function(node) {
      node.addEventListener(eventType, handler, options);
      listeners.push({
        node,
        eventType,
        handler,
        options
      });
    });
  }
  function addListeners() {
    if (getIsCustomTouchBehavior()) {
      on("touchstart", onTrigger2, {
        passive: true
      });
      on("touchend", onMouseLeave, {
        passive: true
      });
    }
    splitBySpaces(instance.props.trigger).forEach(function(eventType) {
      if (eventType === "manual") {
        return;
      }
      on(eventType, onTrigger2);
      switch (eventType) {
        case "mouseenter":
          on("mouseleave", onMouseLeave);
          break;
        case "focus":
          on(isIE11 ? "focusout" : "blur", onBlurOrFocusOut);
          break;
        case "focusin":
          on("focusout", onBlurOrFocusOut);
          break;
      }
    });
  }
  function removeListeners() {
    listeners.forEach(function(_ref) {
      var node = _ref.node, eventType = _ref.eventType, handler = _ref.handler, options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }
  function onTrigger2(event) {
    var _lastTriggerEvent;
    var shouldScheduleClickHide = false;
    if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
      return;
    }
    var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === "focus";
    lastTriggerEvent = event;
    currentTarget = event.currentTarget;
    handleAriaExpandedAttribute();
    if (!instance.state.isVisible && isMouseEvent(event)) {
      mouseMoveListeners.forEach(function(listener) {
        return listener(event);
      });
    }
    if (event.type === "click" && (instance.props.trigger.indexOf("mouseenter") < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
      shouldScheduleClickHide = true;
    } else {
      scheduleShow(event);
    }
    if (event.type === "click") {
      isVisibleFromClick = !shouldScheduleClickHide;
    }
    if (shouldScheduleClickHide && !wasFocused) {
      scheduleHide(event);
    }
  }
  function onMouseMove(event) {
    var target = event.target;
    var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper2.contains(target);
    if (event.type === "mousemove" && isCursorOverReferenceOrPopper) {
      return;
    }
    var popperTreeData = getNestedPopperTree().concat(popper2).map(function(popper3) {
      var _instance$popperInsta;
      var instance2 = popper3._tippy;
      var state2 = (_instance$popperInsta = instance2.popperInstance) == null ? void 0 : _instance$popperInsta.state;
      if (state2) {
        return {
          popperRect: popper3.getBoundingClientRect(),
          popperState: state2,
          props
        };
      }
      return null;
    }).filter(Boolean);
    if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
      cleanupInteractiveMouseListeners();
      scheduleHide(event);
    }
  }
  function onMouseLeave(event) {
    var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf("click") >= 0 && isVisibleFromClick;
    if (shouldBail) {
      return;
    }
    if (instance.props.interactive) {
      instance.hideWithInteractivity(event);
      return;
    }
    scheduleHide(event);
  }
  function onBlurOrFocusOut(event) {
    if (instance.props.trigger.indexOf("focusin") < 0 && event.target !== getCurrentTarget()) {
      return;
    }
    if (instance.props.interactive && event.relatedTarget && popper2.contains(event.relatedTarget)) {
      return;
    }
    scheduleHide(event);
  }
  function isEventListenerStopped(event) {
    return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf("touch") >= 0 : false;
  }
  function createPopperInstance() {
    destroyPopperInstance();
    var _instance$props2 = instance.props, popperOptions = _instance$props2.popperOptions, placement = _instance$props2.placement, offset2 = _instance$props2.offset, getReferenceClientRect = _instance$props2.getReferenceClientRect, moveTransition = _instance$props2.moveTransition;
    var arrow2 = getIsDefaultRenderFn() ? getChildren(popper2).arrow : null;
    var computedReference = getReferenceClientRect ? {
      getBoundingClientRect: getReferenceClientRect,
      contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
    } : reference2;
    var tippyModifier = {
      name: "$$tippy",
      enabled: true,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function fn2(_ref2) {
        var state2 = _ref2.state;
        if (getIsDefaultRenderFn()) {
          var _getDefaultTemplateCh = getDefaultTemplateChildren(), box = _getDefaultTemplateCh.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(attr) {
            if (attr === "placement") {
              box.setAttribute("data-placement", state2.placement);
            } else {
              if (state2.attributes.popper["data-popper-" + attr]) {
                box.setAttribute("data-" + attr, "");
              } else {
                box.removeAttribute("data-" + attr);
              }
            }
          });
          state2.attributes.popper = {};
        }
      }
    };
    var modifiers = [{
      name: "offset",
      options: {
        offset: offset2
      }
    }, {
      name: "preventOverflow",
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: "flip",
      options: {
        padding: 5
      }
    }, {
      name: "computeStyles",
      options: {
        adaptive: !moveTransition
      }
    }, tippyModifier];
    if (getIsDefaultRenderFn() && arrow2) {
      modifiers.push({
        name: "arrow",
        options: {
          element: arrow2,
          padding: 3
        }
      });
    }
    modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
    instance.popperInstance = createPopper(computedReference, popper2, Object.assign({}, popperOptions, {
      placement,
      onFirstUpdate,
      modifiers
    }));
  }
  function destroyPopperInstance() {
    if (instance.popperInstance) {
      instance.popperInstance.destroy();
      instance.popperInstance = null;
    }
  }
  function mount() {
    var appendTo = instance.props.appendTo;
    var parentNode;
    var node = getCurrentTarget();
    if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === "parent") {
      parentNode = node.parentNode;
    } else {
      parentNode = invokeWithArgsOrReturn(appendTo, [node]);
    }
    if (!parentNode.contains(popper2)) {
      parentNode.appendChild(popper2);
    }
    instance.state.isMounted = true;
    createPopperInstance();
  }
  function getNestedPopperTree() {
    return arrayFrom(popper2.querySelectorAll("[data-tippy-root]"));
  }
  function scheduleShow(event) {
    instance.clearDelayTimeouts();
    if (event) {
      invokeHook("onTrigger", [instance, event]);
    }
    addDocumentPress();
    var delay = getDelay(true);
    var _getNormalizedTouchSe = getNormalizedTouchSettings(), touchValue = _getNormalizedTouchSe[0], touchDelay = _getNormalizedTouchSe[1];
    if (currentInput.isTouch && touchValue === "hold" && touchDelay) {
      delay = touchDelay;
    }
    if (delay) {
      showTimeout = setTimeout(function() {
        instance.show();
      }, delay);
    } else {
      instance.show();
    }
  }
  function scheduleHide(event) {
    instance.clearDelayTimeouts();
    invokeHook("onUntrigger", [instance, event]);
    if (!instance.state.isVisible) {
      removeDocumentPress();
      return;
    }
    if (instance.props.trigger.indexOf("mouseenter") >= 0 && instance.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(event.type) >= 0 && isVisibleFromClick) {
      return;
    }
    var delay = getDelay(false);
    if (delay) {
      hideTimeout = setTimeout(function() {
        if (instance.state.isVisible) {
          instance.hide();
        }
      }, delay);
    } else {
      scheduleHideAnimationFrame = requestAnimationFrame(function() {
        instance.hide();
      });
    }
  }
  function enable() {
    instance.state.isEnabled = true;
  }
  function disable() {
    instance.hide();
    instance.state.isEnabled = false;
  }
  function clearDelayTimeouts() {
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    cancelAnimationFrame(scheduleHideAnimationFrame);
  }
  function setProps(partialProps) {
    if (instance.state.isDestroyed) {
      return;
    }
    invokeHook("onBeforeUpdate", [instance, partialProps]);
    removeListeners();
    var prevProps = instance.props;
    var nextProps = evaluateProps(reference2, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
      ignoreAttributes: true
    }));
    instance.props = nextProps;
    addListeners();
    if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
      cleanupInteractiveMouseListeners();
      debouncedOnMouseMove = debounce(onMouseMove, nextProps.interactiveDebounce);
    }
    if (prevProps.triggerTarget && !nextProps.triggerTarget) {
      normalizeToArray(prevProps.triggerTarget).forEach(function(node) {
        node.removeAttribute("aria-expanded");
      });
    } else if (nextProps.triggerTarget) {
      reference2.removeAttribute("aria-expanded");
    }
    handleAriaExpandedAttribute();
    handleStyles();
    if (onUpdate) {
      onUpdate(prevProps, nextProps);
    }
    if (instance.popperInstance) {
      createPopperInstance();
      getNestedPopperTree().forEach(function(nestedPopper) {
        requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
      });
    }
    invokeHook("onAfterUpdate", [instance, partialProps]);
  }
  function setContent2(content) {
    instance.setProps({
      content
    });
  }
  function show() {
    var isAlreadyVisible = instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);
    if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
      return;
    }
    if (getCurrentTarget().hasAttribute("disabled")) {
      return;
    }
    invokeHook("onShow", [instance], false);
    if (instance.props.onShow(instance) === false) {
      return;
    }
    instance.state.isVisible = true;
    if (getIsDefaultRenderFn()) {
      popper2.style.visibility = "visible";
    }
    handleStyles();
    addDocumentPress();
    if (!instance.state.isMounted) {
      popper2.style.transition = "none";
    }
    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh2 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh2.box, content = _getDefaultTemplateCh2.content;
      setTransitionDuration([box, content], 0);
    }
    onFirstUpdate = function onFirstUpdate2() {
      var _instance$popperInsta2;
      if (!instance.state.isVisible || ignoreOnFirstUpdate) {
        return;
      }
      ignoreOnFirstUpdate = true;
      void popper2.offsetHeight;
      popper2.style.transition = instance.props.moveTransition;
      if (getIsDefaultRenderFn() && instance.props.animation) {
        var _getDefaultTemplateCh3 = getDefaultTemplateChildren(), _box = _getDefaultTemplateCh3.box, _content = _getDefaultTemplateCh3.content;
        setTransitionDuration([_box, _content], duration);
        setVisibilityState([_box, _content], "visible");
      }
      handleAriaContentAttribute();
      handleAriaExpandedAttribute();
      pushIfUnique(mountedInstances, instance);
      (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
      invokeHook("onMount", [instance]);
      if (instance.props.animation && getIsDefaultRenderFn()) {
        onTransitionedIn(duration, function() {
          instance.state.isShown = true;
          invokeHook("onShown", [instance]);
        });
      }
    };
    mount();
  }
  function hide2() {
    var isAlreadyHidden = !instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);
    if (isAlreadyHidden || isDestroyed || isDisabled) {
      return;
    }
    invokeHook("onHide", [instance], false);
    if (instance.props.onHide(instance) === false) {
      return;
    }
    instance.state.isVisible = false;
    instance.state.isShown = false;
    ignoreOnFirstUpdate = false;
    isVisibleFromClick = false;
    if (getIsDefaultRenderFn()) {
      popper2.style.visibility = "hidden";
    }
    cleanupInteractiveMouseListeners();
    removeDocumentPress();
    handleStyles(true);
    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh4 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh4.box, content = _getDefaultTemplateCh4.content;
      if (instance.props.animation) {
        setTransitionDuration([box, content], duration);
        setVisibilityState([box, content], "hidden");
      }
    }
    handleAriaContentAttribute();
    handleAriaExpandedAttribute();
    if (instance.props.animation) {
      if (getIsDefaultRenderFn()) {
        onTransitionedOut(duration, instance.unmount);
      }
    } else {
      instance.unmount();
    }
  }
  function hideWithInteractivity(event) {
    getDocument().addEventListener("mousemove", debouncedOnMouseMove);
    pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
    debouncedOnMouseMove(event);
  }
  function unmount() {
    if (instance.state.isVisible) {
      instance.hide();
    }
    if (!instance.state.isMounted) {
      return;
    }
    destroyPopperInstance();
    getNestedPopperTree().forEach(function(nestedPopper) {
      nestedPopper._tippy.unmount();
    });
    if (popper2.parentNode) {
      popper2.parentNode.removeChild(popper2);
    }
    mountedInstances = mountedInstances.filter(function(i) {
      return i !== instance;
    });
    instance.state.isMounted = false;
    invokeHook("onHidden", [instance]);
  }
  function destroy() {
    if (instance.state.isDestroyed) {
      return;
    }
    instance.clearDelayTimeouts();
    instance.unmount();
    removeListeners();
    delete reference2._tippy;
    instance.state.isDestroyed = true;
    invokeHook("onDestroy", [instance]);
  }
}
function tippy$1(targets, optionalProps) {
  if (optionalProps === void 0) {
    optionalProps = {};
  }
  var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
  bindGlobalEventListeners();
  var passedProps = Object.assign({}, optionalProps, {
    plugins
  });
  var elements = getArrayOfElements(targets);
  var instances = elements.reduce(function(acc, reference2) {
    var instance = reference2 && createTippy(reference2, passedProps);
    if (instance) {
      acc.push(instance);
    }
    return acc;
  }, []);
  return isElement(targets) ? instances[0] : instances;
}
tippy$1.defaultProps = defaultProps;
tippy$1.setDefaultProps = setDefaultProps;
tippy$1.currentInput = currentInput;
Object.assign({}, applyStyles$1, {
  effect: function effect2(_ref) {
    var state = _ref.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;
    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }
  }
});
tippy$1.setDefaultProps({
  render
});
var tippy = /* @__PURE__ */ (() => '.tippy-box[data-animation=fade][data-state=hidden]{opacity:0}[data-tippy-root]{max-width:calc(100vw - 10px)}.tippy-box{position:relative;background-color:#333;color:#fff;border-radius:4px;font-size:14px;line-height:1.4;white-space:normal;outline:0;transition-property:transform,visibility,opacity}.tippy-box[data-placement^=top]>.tippy-arrow{bottom:0}.tippy-box[data-placement^=top]>.tippy-arrow:before{bottom:-7px;left:0;border-width:8px 8px 0;border-top-color:initial;transform-origin:center top}.tippy-box[data-placement^=bottom]>.tippy-arrow{top:0}.tippy-box[data-placement^=bottom]>.tippy-arrow:before{top:-7px;left:0;border-width:0 8px 8px;border-bottom-color:initial;transform-origin:center bottom}.tippy-box[data-placement^=left]>.tippy-arrow{right:0}.tippy-box[data-placement^=left]>.tippy-arrow:before{border-width:8px 0 8px 8px;border-left-color:initial;right:-7px;transform-origin:center left}.tippy-box[data-placement^=right]>.tippy-arrow{left:0}.tippy-box[data-placement^=right]>.tippy-arrow:before{left:-7px;border-width:8px 8px 8px 0;border-right-color:initial;transform-origin:center right}.tippy-box[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(.54,1.5,.38,1.11)}.tippy-arrow{width:16px;height:16px;color:#333}.tippy-arrow:before{content:"";position:absolute;border-color:transparent;border-style:solid}.tippy-content{position:relative;padding:5px 9px;z-index:1}\n')();
const _hoisted_1 = { class: "tooltip-wrapper" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Tooltip",
  props: {
    content: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    onMounted(() => {
      tippy$1(".tooltip-wrapper > :first-child", {
        content: props.content
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, { to: "body" }, [
        createElementVNode("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "default")
        ])
      ]);
    };
  }
});
export { addCircleLine as IconAddCircle, arrowDownSFill as IconArrowDown, arrowDownSLine as IconArrowDownLine, arrowLeftSLine as IconArrowLeft, IconArrowRight, arrowUpSLine as IconArrowUpLine, bookReadLine as IconBookRead, IconCheckboxCircle, checkboxCircleFill as IconCheckboxFill, IconClose, IconCloseCircle, computerLine as IconComputer, dashboard3Line as IconDashboard, deleteBin2Line as IconDeleteBin, IconErrorWarning, exchangeLine as IconExchange, eyeLine as IconEye, folder2Line as IconFolder, gitBranchLine as IconGitBranch, githubFill as IconGitHub, gridLine as IconGrid, IconInformation, listUnordered as IconList, listSettingsLine as IconListSettings, magicLine as IconMagic, message3Line as IconMessage, moreLine as IconMore, pagesLine as IconPages, paletteLine as IconPalette, smartphoneLine as IconPhone, plug2Line as IconPlug, saveLine as IconSave, search2Line as IconSearch, settings4Line as IconSettings, shieldUserLine as IconShieldUser, stopCircleLine as IconStopCircle, tabletLine as IconTablet, uploadCloud2Line as IconUpload, userFollowLine as IconUserFollow, userSettingsLine as IconUserSettings, Alert as VAlert, _sfc_main$k as VButton, _sfc_main$j as VCard, _sfc_main$i as VCheckbox, _sfc_main$h as VCheckboxGroup, _sfc_main$f as VInput, _sfc_main$e as VMenu, _sfc_main$d as VMenuItem, VMenuLabel, _sfc_main$b as VModal, _sfc_main$7 as VOption, _sfc_main$g as VPageHeader, _sfc_main$a as VRadio, _sfc_main$9 as VRadioGroup, VRoutesMenu, _sfc_main$8 as VSelect, _sfc_main$6 as VSpace, _sfc_main$4 as VTabItem, _sfc_main$3 as VTabbar, _sfc_main$5 as VTabs, _sfc_main$2 as VTag, _sfc_main$1 as VTextarea, _sfc_main as VTooltip };
//# sourceMappingURL=halo-components.es.js.map
