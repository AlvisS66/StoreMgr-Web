<template>
  <div>
    <svg :class="{'is-active':isActive}" width="64" height="64" class="hamburger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15.57" @click="toggleClick"> <path class="cls-1" d="M15.26,14.52H1.18a.74.74,0,1,0,0,1.48H15.26a.74.74,0,0,0,0-1.48ZM4.93,12.41a.74.74,0,0,0,0-1.05L1.79,8.22,4.93,5.07A.74.74,0,0,0,4.93,4a.73.73,0,0,0-1,0L.22,7.69a.74.74,0,0,0,0,1l3.67,3.67A.73.73,0,0,0,4.93,12.41ZM1.18,1.92H15.26a.75.75,0,0,0,0-1.49H1.18a.76.76,0,0,0-.75.75A.75.75,0,0,0,1.18,1.92ZM15.26,7.11H7.85a.74.74,0,0,0,0,1.48h7.41a.74.74,0,1,0,0-1.48Z" transform="translate(0 -0.43)"/></svg>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  transform: rotate(180deg);
  transition: .38s;
  transform-origin: 50% 50%;
  fill: #fff;
}

.hamburger.is-active {
  transform: rotate(0deg);
}
</style>
