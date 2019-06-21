<template>
  <div class="app-container">
    {{ message }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CertificateManagement',
  components: { },
  data() {
    return {
      message: '证书管理'
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
