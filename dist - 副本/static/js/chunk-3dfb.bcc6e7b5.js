(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-3dfb"],{"2qJ+":function(t,e,i){},I1T6:function(t,e,i){"use strict";var o=i("2qJ+");i.n(o).a},JJ0r:function(t,e,i){"use strict";var o=i("oZM+");i.n(o).a},ghTK:function(t,e,i){"use strict";i.r(e);var o=i("unDg"),a=i.n(o),n=i("6ZY3"),s=i.n(n),l=i("Mz3J"),r=i("GquX"),c=i("dsdk"),u=i("ISyM"),d=i("xA6U"),m={name:"product_storecard",components:{Pagination:l.a,synchrodataDialog:r.a,actionBar:c.a,uploadImage:u.a},filters:{},data:function(){var t=function(t,e,i){if(""==e||void 0==e)i();else{/^(\-|\+)?\d+(\.\d+)?$/.test(e)?i():i(new Error)}};return{commandFilterList:[],multipleSelection:[],listLoading:!0,goodsList:[],temp:{id:null,item:{name:"",category_id:null,price:"",remark:"",amount:"",donation_amount:"",imageurl:"",exp:12,exp_unit:1,is_expired_vaild:1}},dialogEditFormVisible:!1,synchrodataDialog:{show:!1,activeName:3},dialogStatus:"",dialogTitle:{create:"新增储值卡",edit:"新增储值卡"},editStatus:{autoAdd:!1,autoCoding:!1},rules:{price:[{required:!0,trigger:"blur",message:"单价不能为空"},{validator:t,trigger:"blur",message:"单价格式不正确"}],category_id:[{required:!0,trigger:"blur",message:"分类不能为空"}],exp:[{required:!0,trigger:"blur",message:"时效不能为空"},{validator:t,trigger:"blur",message:"时效格式不正确"}],name:[{required:!0,trigger:"blur",message:"卡片名称不能为空"}],amount:[{required:!0,trigger:"blur",message:"储值金额不能为空"},{validator:t,trigger:"blur",message:"储值金额格式不正确"}],donation_amount:[{required:!0,trigger:"blur",message:"赠送金额不能为空"},{validator:t,trigger:"blur",message:"赠送金额格式不正确"}]},listQuery:{page:1,limit:20,category_id:"",search:"",price:"",code:""},total:100,layout:" sizes, jumper, next, pager, prev, total",activeTab:"0",stopGoodsList:[],stopListLoading:!0,stopListQuery:{page:1,limit:10,type:3},stopTotal:0,multipleSelectionStop:[]}},methods:{handleCommand:function(t){"del"==t?this.showDelBox():"stop"==t?this.showStopBox():this.showSaleBox()},handleGoodsFilter:function(){this.listQuery.page=1,this.getGoodsList()},handleSearch:function(){this.handleGoodsFilter()},handleSelectionChange:function(t){0==this.activeTab?this.multipleSelection=t:this.multipleSelectionStop=t},showDelBox:function(){var t=this;0!=this.multipleSelectionStop.length?this.$confirm("确定永久性删除此商品吗?","温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:!0}).then(function(){t.handledelGoods()}).catch(function(t){}):this.$message.warning("请选择商品进行操作")},handledelGoods:function(){var t=[];this.multipleSelectionStop.forEach(function(e,i){t.push(e.product_id)});var e=t.join(",");this.deleteProducts(e)},handleSort:function(t){var e={},i=t.prop,o="ascending"==t.order?"asc":"descending"==t.order?"desc":"";switch(console.log(t),i){case"category":e.category=o;break;case"price":e.price=o;break;case"exp":e.exp=o;break;case null:e={}}var a=this.listQuery,n=a.limit,l=a.category_id,r=a.search;this.listQuery=s()({},{page:1,limit:n,category_id:l,search:r},e),this.getGoodsList(),console.log(this.listQuery)},resetTemp:function(){this.temp={id:null,item:{name:"",category_id:this.commandFilterList[0].id,price:"",remark:"",amount:0,donation_amount:0,imageurl:"",exp:12,exp_unit:1,is_expired_vaild:1}}},handleAdd:function(){var t=this;this.resetTemp(),this.dialogStatus="create",this.dialogEditFormVisible=!0,this.$nextTick(function(){t.$refs.dataForm.clearValidate()})},createData:function(){var t=this;this.$refs.dataForm.validate(function(e){e&&Object(d.c)(t.temp.item).then(function(e){console.log(t.temp),t.getGoodsList(),t.$message.success("新增成功"),t.editStatus.autoAdd?t.handleAdd():(t.dialogEditFormVisible=!1,console.log(t.temp.item))}).catch(function(t){console.log(t)})})},handleEdit:function(t){var e=this;this.resetTemp(),this.temp.id=t.id,console.log(this.temp.id),Object(d.q)(this.temp.id).then(function(t){var i=t.success.data;console.log(i);var o=i.amount,a=i.donation_amount,n=i.exp,l=i.exp_unit,r=void 0===l?0:l,c=i.is_expired_vaild,u=i.item,d=u.category_id,m=u.imageurl,p=u.name,g=u.price,f=u.remark;e.temp=s()({},e.temp,{item:{amount:o,donation_amount:a,exp:n,exp_unit:r,is_expired_vaild:c,category_id:d,imageurl:m,name:p,price:g,remark:f}}),e.dialogStatus="edit",e.dialogEditFormVisible=!0,e.$nextTick(function(){e.$refs.dataForm.clearValidate()})})},updateData:function(){var t=this;this.$refs.dataForm.validate(function(e){e&&Object(d.k)(t.temp.id,t.temp.item).then(function(e){t.dialogEditFormVisible=!1,console.log(t.temp),t.getGoodsList(),t.$message.success("编辑成功")}).catch(function(t){console.log(t)})})},getGoodsList:function(){var t=this;Object(d.a)(this.listQuery).then(function(e){console.log(e);var i=e.success.data;0==t.commandFilterList.length&&(t.commandFilterList=[].concat(a()(i.cateinfo))),t.goodsList=[].concat(a()(i.item.data)),t.total=i.item.total,t.listLoading=!1,console.log(t.goodsList)})},handleDelete:function(t){var e=this,i=t.product_id;this.$confirm("确定永久性删除此商品吗?","温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:!0}).then(function(){e.deleteProducts(i)}).catch(function(t){})},deleteProducts:function(t){var e=this;Object(d.g)(t).then(function(t){e.getStopGoodsList(),e.$message.success("删除成功")}).catch(function(t){console.log(t),e.$message.error("删除失败")})},getStopGoodsList:function(){var t=this;this.stopListLoading=!0,Object(d.w)(this.stopListQuery).then(function(e){var i=e.success.data;t.stopGoodsList=[].concat(a()(i.data)),t.stopTotal=i.total,t.stopListLoading=!1,console.log("停售产品列表",t.stopGoodsList)}).catch(function(t){})},handleStop:function(t){var e=this,i=t.item_id;this.$confirm("确定停售此商品吗?","温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:!0}).then(function(){e.stopProducts(i)}).catch(function(t){})},stopProducts:function(t){var e=this;Object(d.z)(t).then(function(t){e.getGoodsList(),e.getStopGoodsList(),e.$message.success("停售成功")}).catch(function(t){console.log(t)})},handleSale:function(t){var e=this,i=t.id;this.$confirm("确定开售此商品吗?","温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:!0}).then(function(){e.saleProducts(i)}).catch(function(t){})},saleProducts:function(t){var e=this;Object(d.x)(t).then(function(t){e.getGoodsList(),e.getStopGoodsList(),console.log("开售成功")}).catch(function(t){console.log(t)})},showStopBox:function(){var t=this;0!=this.multipleSelection.length?this.$confirm("确定停售此商品吗?","温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:!0}).then(function(){var e=t.multipleSelection.map(function(t,e){return t.item_id});e.join(","),t.stopProducts(e)}).catch(function(t){}):this.$message.warning("请选择商品进行操作")},showSaleBox:function(){var t=this;0!=this.multipleSelectionStop.length?this.$confirm("确定开售此商品吗?","温馨提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:!0}).then(function(){var e=t.multipleSelectionStop.map(function(t,e){return t.id});e.join(","),t.saleProducts(e)}).catch(function(t){}):this.$message.warning("请选择商品进行操作")}},mounted:function(){},created:function(){this.getGoodsList()},computed:{syncDialogShow:function(){return this.synchrodataDialog.show}},watch:{syncDialogShow:function(t,e){t||this.getGoodsList()},activeTab:function(t,e){0!=t||this.goodsList.length?1!=t||this.stopGoodsList.length||this.getStopGoodsList():this.getGoodsList()}}},p=(i("I1T6"),i("JJ0r"),i("ZrdR")),g=Object(p.a)(m,function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"app-container product_storecard"},[i("el-card",{staticClass:"filter-box mb-15",attrs:{shadow:"always"}},[i("action-bar",{attrs:{activeName:t.synchrodataDialog.activeName,category_id:t.listQuery.category_id,commandFilterList:t.commandFilterList,search:t.listQuery.search,activeTab:t.activeTab},on:{"update:category_id":function(e){t.$set(t.listQuery,"category_id",e)},"update:search":function(e){t.$set(t.listQuery,"search",e)},"update:activeTab":function(e){t.activeTab=e},handleCommand:t.handleCommand,handleGoodsFilter:t.handleGoodsFilter,handleSearch:t.handleSearch,showSynchroDialog:function(e){t.synchrodataDialog.show=!0},handleAdd:t.handleAdd}},[i("template",{slot:"0"},[i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],ref:"goodsList",staticClass:"goods_list",staticStyle:{width:"100%"},attrs:{data:t.goodsList,fit:"",stripe:""},on:{"selection-change":t.handleSelectionChange,"sort-change":t.handleSort}},[i("el-table-column",{attrs:{align:"left",type:"index",width:"40px"}}),t._v(" "),i("el-table-column",{attrs:{align:"left",type:"selection",width:"30px"}}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"名称",prop:"name",width:"420px"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("div",{staticClass:"product_name"},[i("span",{staticClass:"product_img"},[i("img",{directives:[{name:"productImg",rawName:"v-productImg",value:e.row.item.imageurl,expression:"scope.row.item.imageurl"}]})]),t._v("\n                "+t._s(e.row.item.name)+"\n              ")])]}}])}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"来源"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.item.source_item_id>0?"总部分配":"单店添加"))])]}}])}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"分类",prop:"category",sortable:"custom"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.item.category?e.row.item.category.name:"-"))])]}}])}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"单价",prop:"price",sortable:"custom"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(t._f("formatMoney")(e.row.item.price)))])]}}])}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"时效",prop:"exp",sortable:"custom"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.exp)+t._s(e.row.exp_unit))])]}}])}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"备注",prop:"remark"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(null==e.row.item.remark||""==e.row.item.remark?"-":e.row.item.remark))])]}}])}),t._v(" "),i("el-table-column",{attrs:{width:"160",align:"left",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{attrs:{size:"mini"},on:{click:function(i){t.handleEdit(e.row)}}},[t._v("编辑")]),t._v(" "),i("el-button",{attrs:{size:"mini"},on:{click:function(i){t.handleStop(e.row)}}},[t._v("停售")])]}}])})],1),t._v(" "),i("pagination",{directives:[{name:"show",rawName:"v-show",value:t.total>0,expression:"total>0"}],staticClass:"pagination",attrs:{layout:t.layout,total:t.total,page:t.listQuery.page,limit:t.listQuery.limit},on:{"update:page":function(e){t.$set(t.listQuery,"page",e)},"update:limit":function(e){t.$set(t.listQuery,"limit",e)},pagination:t.getGoodsList}})],1),t._v(" "),i("template",{slot:"1"},[i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.stopListLoading,expression:"stopListLoading"}],ref:"goodsList",staticClass:"goods_list",staticStyle:{width:"100%"},attrs:{data:t.stopGoodsList,fit:"",stripe:""},on:{"selection-change":t.handleSelectionChange,"sort-change":t.handleSort}},[i("el-table-column",{attrs:{align:"left",type:"index",width:"40px"}}),t._v(" "),i("el-table-column",{attrs:{align:"left",type:"selection",width:"30px"}}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"名称",prop:"name",width:"420px"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("div",{staticClass:"product_name"},[i("span",{staticClass:"product_img"},[i("img",{directives:[{name:"productImg",rawName:"v-productImg",value:e.row.imageurl,expression:"scope.row.imageurl"}]})]),t._v("\n                "+t._s(e.row.name)+"\n              ")])]}}])}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"来源"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.source_item_id>0?"总部分配":"单店添加"))])]}}])}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"分类",prop:"category",sortable:"custom"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.category?e.row.category.name:"-"))])]}}])}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"单价",prop:"price",sortable:"custom"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(t._f("formatMoney")(e.row.price)))])]}}])}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"时效",prop:"exp",sortable:"custom"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.exp)+t._s(e.row.exp_unit))])]}}])}),t._v(" "),i("el-table-column",{attrs:{align:"left",label:"备注",prop:"remark"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(null==e.row.remark||""==e.row.remark?"-":e.row.remark))])]}}])}),t._v(" "),i("el-table-column",{attrs:{width:"160",align:"left",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{attrs:{size:"mini"},on:{click:function(i){t.handleSale(e.row)}}},[t._v("开售")]),t._v(" "),i("el-button",{attrs:{size:"mini"},on:{click:function(i){t.handleDelete(e.row)}}},[t._v("删除")])]}}])})],1),t._v(" "),i("pagination",{directives:[{name:"show",rawName:"v-show",value:t.stopTotal>0,expression:"stopTotal>0"}],staticClass:"pagination",attrs:{layout:t.layout,total:t.stopTotal,page:t.stopListQuery.page,limit:t.stopListQuery.limit},on:{"update:page":function(e){t.$set(t.stopListQuery,"page",e)},"update:limit":function(e){t.$set(t.stopListQuery,"limit",e)},pagination:t.getStopGoodsList}})],1)],2),t._v(" "),i("el-dialog",{staticClass:"goods_dialog",attrs:{title:t.dialogTitle[t.dialogStatus],visible:t.dialogEditFormVisible,width:"770px"},on:{"update:visible":function(e){t.dialogEditFormVisible=e}}},[i("el-form",{ref:"dataForm",attrs:{"label-position":"right","label-width":"95px",model:t.temp.item,rules:t.rules,"show-message":!0}},[i("el-row",{attrs:{gutter:20}},[i("el-col",{staticClass:"left_content",attrs:{span:13}},[i("upload-image",{attrs:{imageurl:t.temp.item.imageurl},on:{"update:imageurl":function(e){t.$set(t.temp.item,"imageurl",e)}}})],1),t._v(" "),i("el-col",{staticClass:"right_content",attrs:{span:11}},[i("el-form-item",{attrs:{label:"储值卡名称",prop:"name"}},[i("el-input",{model:{value:t.temp.item.name,callback:function(e){t.$set(t.temp.item,"name",e)},expression:"temp.item.name"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"储值卡分类",prop:"category_id"}},[i("el-select",{staticStyle:{width:"100%"},model:{value:t.temp.item.category_id,callback:function(e){t.$set(t.temp.item,"category_id",e)},expression:"temp.item.category_id"}},t._l(t.commandFilterList,function(t,e,o){return i("el-option",{key:o,attrs:{label:t.name,value:t.id}})}))],1),t._v(" "),i("el-form-item",{attrs:{label:"储值金额",prop:"amount"}},[i("el-input",{model:{value:t.temp.item.amount,callback:function(e){t.$set(t.temp.item,"amount",e)},expression:"temp.item.amount"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"赠送金额",prop:"donation_amount"}},[i("el-input",{model:{value:t.temp.item.donation_amount,callback:function(e){t.$set(t.temp.item,"donation_amount",e)},expression:"temp.item.donation_amount"}},[i("template",{slot:"append"},[t._v("元")])],2)],1),t._v(" "),i("el-form-item",{attrs:{label:"单价",prop:"price"}},[i("el-input",{model:{value:t.temp.item.price,callback:function(e){t.$set(t.temp.item,"price",e)},expression:"temp.item.price"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"过期可用"}},[i("el-radio-group",{model:{value:t.temp.item.is_expired_vaild,callback:function(e){t.$set(t.temp.item,"is_expired_vaild",e)},expression:"temp.item.is_expired_vaild"}},[i("el-radio",{attrs:{label:1}},[t._v("是")]),t._v(" "),i("el-radio",{attrs:{label:0}},[t._v("否")])],1)],1),t._v(" "),i("el-form-item",{attrs:{label:"时效",prop:"exp"}},[i("el-input",{staticClass:"exp fl",model:{value:t.temp.item.exp,callback:function(e){t.$set(t.temp.item,"exp",e)},expression:"temp.item.exp"}}),t._v(" "),i("el-select",{staticClass:"exp_unit fl",model:{value:t.temp.item.exp_unit,callback:function(e){t.$set(t.temp.item,"exp_unit",e)},expression:"temp.item.exp_unit"}},t._l(["天","月"],function(t,e,o){return i("el-option",{key:o,attrs:{label:t,value:e}})}))],1),t._v(" "),i("el-form-item",{staticStyle:{"margin-bottom":"0px"},attrs:{label:"备注"}},[i("el-input",{attrs:{type:"textarea",rows:3},model:{value:t.temp.item.remark,callback:function(e){t.$set(t.temp.item,"remark",e)},expression:"temp.item.remark"}})],1)],1)],1)],1),t._v(" "),i("div",{staticClass:"dialog-footer",staticStyle:{"vertical-align":"middle"},attrs:{slot:"footer"},slot:"footer"},["create"==t.dialogStatus?i("div",{staticClass:"fl",staticStyle:{"vertical-align":"middle","margin-top":"10px"}},[i("el-checkbox",{model:{value:t.editStatus.autoAdd,callback:function(e){t.$set(t.editStatus,"autoAdd",e)},expression:"editStatus.autoAdd"}},[t._v("连续增加")])],1):t._e(),t._v(" "),i("el-button",{on:{click:function(e){t.dialogEditFormVisible=!1}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:function(e){"create"==t.dialogStatus?t.createData():t.updateData()}}},[t._v("确 定")])],1)],1),t._v(" "),i("synchrodata-dialog",{attrs:{visible:t.synchrodataDialog.show,activeName:t.synchrodataDialog.activeName},on:{"update:visible":function(e){t.$set(t.synchrodataDialog,"show",e)}}})],1)],1)},[],!1,null,"184c77ca",null);g.options.__file="storecard.vue";e.default=g.exports},"oZM+":function(t,e,i){}}]);