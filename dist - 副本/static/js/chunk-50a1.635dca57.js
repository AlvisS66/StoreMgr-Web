(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-50a1"],{"/LZ2":function(t,e,n){"use strict";var a=n("fTem");n.n(a).a},"/TXT":function(t,e,n){},"7EYj":function(t,e,n){},"869R":function(t,e,n){"use strict";var a=n("h8Og");n.n(a).a},GquX:function(t,e,n){"use strict";var a=n("unDg"),i=n.n(a),o=n("Mz3J"),r=n("xA6U"),s={name:"synchrodata-dialog",props:{visible:{type:Boolean,default:!1},activeName:{type:Number,default:0}},components:{Pagination:o.a},data:function(){return{editDialog:{listLoading:!0,show:!1,editTitle:["商品列表","服务列表","次卡列表","储值卡列表"],placeholder:["搜索编码、名称","搜索编码、名称","搜索名称","搜索名称"]},multipleSelection:[],goodsList:[],listQuery:{search:void 0,page:1,limit:10},total:0,layout:" sizes, jumper, next, pager, prev, total"}},methods:{handleSearch:function(){this.listQuery.page=1,this.getGoodsList()},handleSelectionChange:function(t){this.multipleSelection=t},handleOperateSyncMultiple:function(){var t=this;0!=this.multipleSelection.length?this.$confirm("确定是否批量同步已选择的"+this.multipleSelection.length+"件产品?","温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:!0}).then(function(){console.log(t.multipleSelection);var e=[];t.multipleSelection.forEach(function(t,n){e.push(t.id)});var n=e.join(",");t.operateSyncData({id:n,is_sync:1})}).catch(function(t){}):this.$message.warning("请选择产品进行操作")},handleOperateSync:function(t){var e=this,n=t.id,a=t.is_sync,i=a?"取消该同步":"同步该";this.$confirm("确定是否"+i+"产品?","温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:!0}).then(function(){console.log(t),a=0==a?1:0,e.operateSyncData({id:n,is_sync:a})}).catch(function(t){})},operateSyncData:function(t){var e=this;Object(r.u)(t).then(function(t){e.getGoodsList(),e.$message.success("同步成功")}).catch(function(t){console.log(t)})},getGoodsList:function(){var t=this;Object(r.A)(this.activeName,this.listQuery).then(function(e){var n=e.success.data;console.log(n),t.goodsList=[].concat(i()(n.item.data)),t.total=n.item.total,t.editDialog.listLoading=!1,console.log("synchrodata-dialog")}).catch(function(t){console.log(t)})}},created:function(){},mounted:function(){},computed:{show:{get:function(){return this.visible},set:function(t){this.$emit("update:visible",t)}}},watch:{show:function(t){t&&(this.editDialog.listLoading=!0,this.getGoodsList())}}},c=(n("/LZ2"),n("myeN"),n("ZrdR")),l=Object(c.a)(s,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"app-container synchrodata"},[n("el-dialog",{staticClass:"edit-dialog",attrs:{visible:t.show,top:"0",center:""},on:{"update:visible":function(e){t.show=e}}},[n("div",{staticClass:"dialog-title",attrs:{slot:"title"},slot:"title"},[n("button",{staticClass:"header-close-btn",attrs:{type:"button","aria-label":"Close"},on:{click:function(e){t.show=!1}}},[n("svg-icon",{attrs:{"icon-class":"back"}})],1),t._v(" "),n("span",[t._v(t._s(t.editDialog.editTitle[t.activeName]))])]),t._v(" "),n("el-scrollbar",{staticClass:"scrollbar"},[n("div",{staticClass:"pr-10"},[n("div",{staticClass:"clearfix Sync_Operate"},[n("el-button",{staticClass:"fl",attrs:{plain:""},on:{click:t.handleOperateSyncMultiple}},[t._v("\n            批量同步\n          ")]),t._v(" "),n("el-input",{staticClass:"fr search",attrs:{placeholder:t.editDialog.placeholder[t.activeName],"prefix-icon":"el-icon-search",clearable:""},on:{change:t.handleSearch},model:{value:t.listQuery.search,callback:function(e){t.$set(t.listQuery,"search",e)},expression:"listQuery.search"}})],1),t._v(" "),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.editDialog.listLoading,expression:"editDialog.listLoading"}],ref:"goodsList",staticClass:"goods_list",staticStyle:{width:"100%"},attrs:{data:t.goodsList,fit:"",stripe:""},on:{"selection-change":t.handleSelectionChange}},[n("el-table-column",{attrs:{align:"left",type:"index",width:"40px"}}),t._v(" "),n("el-table-column",{attrs:{align:"left",type:"selection",width:"30px"}}),t._v(" "),0==t.activeName||1==t.activeName?n("el-table-column",{key:"code",attrs:{align:"left",label:"编码",prop:"code"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(e.row.code))])]}}])}):t._e(),t._v(" "),n("el-table-column",{attrs:{align:"left",label:"名称",prop:"name",width:"420px"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("div",{staticClass:"product_name"},[n("span",{staticClass:"product_img"},[n("img",{attrs:{src:e.row.imageurl,alt:""}})]),t._v("\n                "+t._s(e.row.name)+"\n              ")])]}}])}),t._v(" "),n("el-table-column",{attrs:{align:"left",label:"分类",prop:"category"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(e.row.catename))])]}}])}),t._v(" "),n("el-table-column",{attrs:{align:"left",label:"单价",prop:"price"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v("￥"+t._s(e.row.price))])]}}])}),t._v(" "),2==t.activeName||3==t.activeName?n("el-table-column",{key:"exp",attrs:{align:"left",label:"时效",prop:"exp",sortable:"custom"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(e.row.exp)+t._s(0==e.row.exp_unit?"天":"月"))])]}}])}):t._e(),t._v(" "),n("el-table-column",{attrs:{align:"left",label:"状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(e.row.is_sync?"同步":"未同步"))])]}}])}),t._v(" "),n("el-table-column",{attrs:{width:"170",align:"left",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{size:"mini",type:"primary",plain:1==e.row.is_sync},on:{click:function(n){t.handleOperateSync(e.row)}}},[t._v(t._s(e.row.is_sync?"同步取消":"同步"))])]}}])})],1),t._v(" "),n("pagination",{directives:[{name:"show",rawName:"v-show",value:t.total>0,expression:"total>0"}],staticClass:"pagination",attrs:{layout:t.layout,total:t.total,page:t.listQuery.page,limit:t.listQuery.limit},on:{"update:page":function(e){t.$set(t.listQuery,"page",e)},"update:limit":function(e){t.$set(t.listQuery,"limit",e)},pagination:t.getGoodsList}})],1)])],1)],1)},[],!1,null,"27bfedbe",null);l.options.__file="synchrodata-dialog.vue";e.a=l.exports},ISyM:function(t,e,n){"use strict";var a=n("Nlzp"),i={name:"upload-image",props:["imageurl"],data:function(){return{uploadUrl:a.c}},methods:{uploadImage:function(){},beforeUpload:function(t){},uploadSuccess:function(t,e,n){console.log(t.success.data),console.log(e),this.$emit("update:imageurl",t.success.data)},uploadError:function(t,e,n){console.log(t)}}},o=(n("Ifee"),n("869R"),n("ZrdR")),r=Object(o.a)(i,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"app-container upload_image"},[n("div",{staticClass:"upload_img"},[n("div",{staticClass:"image-preview"},[n("div",{staticClass:"image-preview-wrapper"},[n("img",{directives:[{name:"productImg",rawName:"v-productImg",value:t.imageurl,expression:"imageurl"}]}),t._v(" "),n("div",{staticClass:"image-preview-action"})])]),t._v(" "),n("div",{staticClass:"upload_box"},[n("el-upload",{ref:"uploadImg",staticClass:"upload_btn",attrs:{action:t.uploadUrl,name:"imageurl","show-file-list":!1,"before-upload":t.beforeUpload,"with-credentials":!1,"on-success":t.uploadSuccess,"on-error":t.uploadError}},[n("div",{staticClass:"trigger_btn",attrs:{slot:"trigger"},slot:"trigger"},[n("i",{staticClass:"el-icon-plus"})]),t._v(" "),n("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[t._v("上传产品图片尺寸为480px*360px")])])],1)])])},[],!1,null,"12cbd52a",null);r.options.__file="upload-image.vue";e.a=r.exports},Ifee:function(t,e,n){"use strict";var a=n("Xk8b");n.n(a).a},K3OJ:function(t,e,n){},Nlzp:function(t,e,n){"use strict";n.d(e,"a",function(){return i}),n.d(e,"b",function(){return o}),n.d(e,"c",function(){return r});var a=n("t3Un");function i(t){var e=t.start_date,n=t.end_date;return Object(a.a)({url:"statistics/indexData",method:"get",params:{start_date:e,end_date:n}})}function o(){return Object(a.a)({url:"statistics/indexGraphData",method:"get",params:{}})}var r="http://api.zgyjyy.com/storeApi/upload/images"},VnJw:function(t,e,n){"use strict";var a=n("/TXT");n.n(a).a},Xk8b:function(t,e,n){},Y5bG:function(t,e,n){"use strict";n.d(e,"a",function(){return i}),Math.easeInOutQuad=function(t,e,n,a){return(t/=a/2)<1?n/2*t*t+e:-n/2*(--t*(t-2)-1)+e};var a=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)};function i(t,e,n){var i=document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop,o=t-i,r=0;e=void 0===e?500:e;!function t(){r+=20,function(t){document.documentElement.scrollTop=t,document.body.parentNode.scrollTop=t,document.body.scrollTop=t}(Math.easeInOutQuad(r,i,o,e)),r<e?a(t):n&&"function"==typeof n&&n()}()}},dsdk:function(t,e,n){"use strict";var a={name:"product_action_bar",props:["activeName","category_id","commandFilterList","search","activeTab"],data:function(){return{title:["商品","服务","次卡","储值卡"],placeholder:["搜索编码、名称","搜索编码、名称","搜索名称","搜索名称"]}},methods:{},computed:{listQuerySearch:{get:function(){return this.search},set:function(t){this.$emit("update:search",t)}},listQueryCategory_id:{get:function(){return this.category_id},set:function(t){this.$emit("update:category_id",t)}},activeList:{get:function(){return this.activeTab},set:function(t){this.$emit("update:activeTab",t)}}},created:function(){}},i=(n("v2Lv"),n("VnJw"),n("ZrdR")),o=Object(i.a)(a,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"app-container product_action_bar"},[n("el-tabs",{staticClass:"common-tabs",model:{value:t.activeList,callback:function(e){t.activeList=e},expression:"activeList"}},[n("el-tab-pane",{attrs:{label:t.title[t.activeName]+"列表",name:"0"}},[n("div",{staticClass:"filter_container"},[n("div",{staticClass:"header"},[n("el-dropdown",{staticClass:"fl",attrs:{trigger:"click",placement:"bottom-start"},on:{command:function(e){t.$emit("handleCommand",e)}}},[n("el-button",{staticClass:"showbtn",attrs:{type:"primary"}},[t._v("\n              批量操作"),n("i",{staticClass:"el-icon-arrow-down el-icon--right",staticStyle:{color:"#c7cbd2"}})]),t._v(" "),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[n("el-dropdown-item",{attrs:{command:"stop"}},[t._v("停售")])],1)],1),t._v(" "),n("el-form",{staticClass:"goods_category fl",attrs:{inline:!0}},[n("el-form-item",{attrs:{label:"产品分类"}},[n("el-select",{attrs:{placeholder:"分类"},on:{change:function(e){t.$emit("handleGoodsFilter")}},model:{value:t.listQueryCategory_id,callback:function(e){t.listQueryCategory_id=e},expression:"listQueryCategory_id"}},[n("el-option",{staticClass:"goods_select_option",attrs:{label:"全部",value:""}}),t._v(" "),t._l(t.commandFilterList,function(t,e,a){return n("el-option",{key:a,staticClass:"goods_select_option",attrs:{label:t.name,value:t.id}})})],2)],1)],1),t._v(" "),n("el-button",{staticClass:"fr",attrs:{plain:""},on:{click:function(e){t.$emit("showSynchroDialog")}}},[t._v("\n            同步总部数据\n          ")]),t._v(" "),n("el-popover",{staticClass:"fr sync_tips",attrs:{placement:"bottom",width:"200",trigger:"hover",content:"同步总部产品列表，且库存默认为零。"}},[n("i",{staticClass:"el-icon-question",attrs:{slot:"reference"},slot:"reference"})]),t._v(" "),n("el-button",{staticClass:"fr add_member",attrs:{type:"primary"},on:{click:function(e){t.$emit("handleAdd")}}},[t._v("\n            新增"+t._s(t.title[t.activeName])+"\n          ")]),t._v(" "),n("el-input",{staticClass:"fr search",attrs:{placeholder:t.placeholder[t.activeName],"prefix-icon":"el-icon-search",clearable:""},on:{change:function(e){t.$emit("handleSearch")}},model:{value:t.listQuerySearch,callback:function(e){t.listQuerySearch=e},expression:"listQuerySearch"}})],1)]),t._v(" "),t._t("0")],2),t._v(" "),n("el-tab-pane",{attrs:{label:"已停售"+t.title[t.activeName],name:"1"}},[n("div",{staticClass:"filter_container"},[n("div",{staticClass:"header"},[n("el-dropdown",{staticClass:"fl",attrs:{trigger:"click",placement:"bottom-start"},on:{command:function(e){t.$emit("handleCommand",e)}}},[n("el-button",{staticClass:"showbtn",attrs:{type:"primary"}},[t._v("\n              批量操作"),n("i",{staticClass:"el-icon-arrow-down el-icon--right",staticStyle:{color:"#c7cbd2"}})]),t._v(" "),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[n("el-dropdown-item",{attrs:{command:"sale"}},[t._v("开售")]),t._v(" "),n("el-dropdown-item",{attrs:{command:"del"}},[t._v("删除")])],1)],1)],1)]),t._v(" "),t._t("1")],2)],1)],1)},[],!1,null,"3bc99fe1",null);o.options.__file="action-bar.vue";e.a=o.exports},fTem:function(t,e,n){},h8Og:function(t,e,n){},myeN:function(t,e,n){"use strict";var a=n("7EYj");n.n(a).a},v2Lv:function(t,e,n){"use strict";var a=n("K3OJ");n.n(a).a},xA6U:function(t,e,n){"use strict";n.d(e,"v",function(){return i}),n.d(e,"o",function(){return o}),n.d(e,"d",function(){return r}),n.d(e,"r",function(){return s}),n.d(e,"l",function(){return c}),n.d(e,"h",function(){return l}),n.d(e,"y",function(){return u}),n.d(e,"p",function(){return d}),n.d(e,"e",function(){return p}),n.d(e,"s",function(){return m}),n.d(e,"m",function(){return f}),n.d(e,"i",function(){return h}),n.d(e,"B",function(){return v}),n.d(e,"f",function(){return g}),n.d(e,"t",function(){return b}),n.d(e,"n",function(){return _}),n.d(e,"j",function(){return y}),n.d(e,"b",function(){return w}),n.d(e,"a",function(){return C}),n.d(e,"c",function(){return O}),n.d(e,"q",function(){return j}),n.d(e,"k",function(){return S}),n.d(e,"g",function(){return x}),n.d(e,"A",function(){return k}),n.d(e,"u",function(){return L}),n.d(e,"w",function(){return N}),n.d(e,"z",function(){return T}),n.d(e,"x",function(){return $});var a=n("t3Un");function i(t){return Object(a.a)({url:"items/product/list",method:"post",data:t})}function o(){return Object(a.a)({url:"items/product/create",method:"get"})}function r(t){return Object(a.a)({url:"items/product",method:"post",data:t})}function s(t){return Object(a.a)({url:"items/product/"+t+"/edit",method:"get"})}function c(t,e){return Object(a.a)({url:"items/product/"+t,method:"patch",data:e})}function l(t){return Object(a.a)({url:"items/product/"+t,method:"delete"})}function u(t){return Object(a.a)({url:"items/service/list",method:"post",data:t})}function d(){return Object(a.a)({url:"items/service/create",method:"get"})}function p(t){return Object(a.a)({url:"items/service",method:"post",data:t})}function m(t){return Object(a.a)({url:"items/service/"+t+"/edit",method:"get"})}function f(t,e){return Object(a.a)({url:"items/service/"+t,method:"patch",data:e})}function h(t){return Object(a.a)({url:"/items/service/"+t,method:"delete"})}function v(t){return Object(a.a)({url:"items/tcard/list",method:"post",data:t})}function g(t){return Object(a.a)({url:"items/tcard",method:"post",data:t})}function b(t){return Object(a.a)({url:"items/tcard/"+t+"/edit",method:"get"})}function _(t,e){return Object(a.a)({url:"items/tcard/"+t,method:"patch",data:e})}function y(t){return Object(a.a)({url:"/items/tcard/"+t,method:"delete"})}function w(t,e){return Object(a.a)({url:"/items/tcard/additems/"+t,method:"post",data:e})}function C(t){return Object(a.a)({url:"items/ppcard/list",method:"post",data:t})}function O(t){return Object(a.a)({url:"items/ppcard",method:"post",data:t})}function j(t){return Object(a.a)({url:"items/ppcard/"+t+"/edit",method:"get"})}function S(t,e){return Object(a.a)({url:"items/ppcard/"+t,method:"patch",data:e})}function x(t){return Object(a.a)({url:"/items/ppcard/"+t,method:"delete"})}function k(t,e){return Object(a.a)({url:"items/syncdata/"+t,method:"post",data:e})}function L(t){return Object(a.a)({url:"items/operatesync",method:"post",data:t})}function N(t){return Object(a.a)({url:"items/stop/list",method:"post",data:t})}function T(t){return Object(a.a)({url:"items/stop/"+t,method:"get"})}function $(t){return Object(a.a)({url:"items/sale/"+t,method:"get"})}}}]);