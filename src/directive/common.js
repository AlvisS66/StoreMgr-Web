import Vue from 'vue'

Vue.directive('loadmore', {
  bind(el, binding) {
    const selectWrap = el.querySelector('.el-scrollbar__wrap')
    selectWrap.addEventListener('scroll', function () {
      let sign = 100
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
});

// 默认头像 传参 [ 头像 url , 性别 ]
Vue.directive('avatar',
  function (el, binding, vnode) {
    if (binding.value[0]) {
      el.src = binding.value[0];
      return;
    }
    if (binding.value[1] == 0) {
      el.src = "./static/avatar/avatar-female.png";
    } else if (binding.value[1] == 1) {
      el.src = "./static/avatar/avatar-male.png";
    } else {
      el.src = "./static/avatar/avatar.png";
    }
  }
);

// 默认产品图 传参  产品图 url
Vue.directive('productImg',
  function (el, binding, vnode) {
    if (binding.value) {
      el.src = binding.value;
      return;
    }
    el.src = "./static/product_img/product_img.png";
  }
);

