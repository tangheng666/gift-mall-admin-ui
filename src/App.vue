<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    key() {
      return this.$route.fullPath

      // return this.$route.name !== undefined
      //   ? this.$route.name + +new Date()
      //   : this.$route + +new Date()
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
}
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  /* overflow: hidden; */
}

.app-main {
  width: 100%;
  height: 100%;
}

.br button {
  margin-right: 5px;
}

.operation button {
  margin-right: 5px;
}

.ivu-btn-text:focus {
  box-shadow: none !important;
}
</style>
