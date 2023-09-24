<template>
  <el-card>
    <div class="card-header">
      <span>{{ title }}</span>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-xinxi1"></use>
      </svg>
    </div>
    <div class="main">
      <slot name="main"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'CardItem',
  props: {
    title: String, //
  }
}
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #C0C4CC;
}
.card-footer {
  border-top: 1px solid #DCDFE6;
  padding-top: 10px;
}
</style>
