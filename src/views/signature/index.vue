<template>
  <div class="app-container">
    {{ message }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SignatureDashboard',
  components: { },
  data() {
    return {
      message: '签名概览'
    }
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
  },
  mounted() {},
  methods: {
    fetchData() {
      console.log('fetchData')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
