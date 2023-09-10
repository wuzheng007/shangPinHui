<template>
  <div class="category-select-container">
    <el-form :model="form" inline :disabled="disabled">
      <el-form-item label="一级分类">
        <el-select v-model="form.cate1" placeholder="请选择" @change="handleChangeCate1">
          <el-option v-for="item in cate1List" :key="item.id" :value="item.id" :label="item.name">{{ item.name }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="form.cate2" placeholder="请选择" @change="handleChangeCate2">
          <el-option v-for="item in cate2List" :key="item.id" :value="item.id" :label="item.name">{{ item.name }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="form.cate3" placeholder="请选择" @change="handleChangeCate3">
          <el-option v-for="item in cate3List" :key="item.id" :value="item.id" :label="item.name">{{ item.name }}</el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCategory1, getCategory2, getCategory3 } from '@/api/product.js'
export default {
  name: 'CategorySelect',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        cate1: '',
        cate2: '',
        cate3: ''
      },
      cate1List: [],
      cate2List: [],
      cate3List: []
    }
  },
  mounted() {
    this.fetchCate1List()
  },
  methods: {
    // 获取一级分类
    async fetchCate1List() {
      const { code, data } = await getCategory1()
      if (code === 200) {
        this.cate1List = data
      }
    },
    // 获取二级分类
    async fetchCate2List() {
      const { code, data } = await getCategory2(this.form.cate1)
      if (code === 200) {
        this.cate2List = data
      }
    },
    // 获取三级分类
    async fetchCate3List() {
      const { code, data } = await getCategory3(this.form.cate2)
      if (code === 200) {
        this.cate3List = data
      }
    },
    // 一级分类变化
    handleChangeCate1() {
      // 清空二级分类和三级分类选中值和分类列表
      this.form.cate2 = ''
      this.form.cate3 = ''
      this.cate2List = []
      this.cate3List = []
      this.fetchCate2List()
      this.$emit('selected', { ...this.form })
    },
    // 二级分类变化
    handleChangeCate2() {
      // 清空三级分类选中值和分类列表
      this.form.cate3 = ''
      this.cate3List = []
      this.fetchCate3List()
      this.$emit('selected', { ...this.form })
    },
    // 三级分类变化
    handleChangeCate3() {
      // 完成选择，抛出selected事件
      this.$emit('selected', { ...this.form })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
