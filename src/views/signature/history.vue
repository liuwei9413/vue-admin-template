<template>
  <div class="app-container">
    {{ message }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SignatureHistory',
  components: { },
  data() {
    return {
      message: '签名历史记录'
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
