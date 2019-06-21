<template>
  <div class="box-card-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ title }}</span>
      </div>
      <div v-for="(item, index) in data" :key="index" class="item">
        <span class="key">{{ item.key }}</span>
        <span class="value">{{ item.value }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'DetailCard',
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
 .box-card-container {
    .item {
      margin-bottom: 18px;
      font-size: 14px;
      .key {
        display: inline-block;
        width: 100px;
        text-align: center;
        word-break: break-all;
        vertical-align: middle;
      }
      .value {
        display: inline-block;
        width: calc(100% - 120px);
        word-break: break-all;
        vertical-align: middle;
        color: #5e6d82;
      }
    }
 }
</style>
