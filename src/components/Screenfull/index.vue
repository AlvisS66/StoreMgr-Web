<template>
  <div>
    <svg class="screenfull-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" @click="click"><path class="cls-1" d="M2.38,1.4H5.55a.7.7,0,0,0,.7-.7h0a.7.7,0,0,0-.7-.7H.7A.7.7,0,0,0,0,.7V5.55a.7.7,0,0,0,.7.7h0a.7.7,0,0,0,.7-.7V2.38L5.12,6.11a.7.7,0,0,0,1-1ZM15.3,0H10.47a.7.7,0,0,0-.7.7h0a.7.7,0,0,0,.7.7h3.15L9.94,5.09a.69.69,0,0,0,1,1L14.6,2.38V5.53a.69.69,0,0,0,.7.69h0a.69.69,0,0,0,.7-.69V.7A.7.7,0,0,0,15.3,0ZM6.11,9.94a.71.71,0,0,0-1,0L1.4,13.63V10.47a.7.7,0,0,0-.7-.7h0a.7.7,0,0,0-.7.7V15.3a.7.7,0,0,0,.7.7H5.55a.7.7,0,0,0,.7-.7h0a.7.7,0,0,0-.7-.7H2.39l3.72-3.69A.68.68,0,0,0,6.11,9.94Zm9.19-.11h0a.69.69,0,0,0-.7.69v3.12L10.91,10a.69.69,0,0,0-1,1l3.67,3.65H10.47a.7.7,0,0,0-.7.7h0a.7.7,0,0,0,.7.7H15.3a.7.7,0,0,0,.7-.7V10.52A.69.69,0,0,0,15.3,9.83Z"/></svg>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  props: {
    width: {
      type: Number,
      default: 22
    },
    height: {
      type: Number,
      default: 22
    },
    fill: {
      type: String,
      default: '#48576a'
    }
  },
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
  fill: #fff;
}
</style>
