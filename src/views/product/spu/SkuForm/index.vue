<template>
  <el-form ref="form" :model="sku" :rules="rules" label-width="6em">
    <el-form-item label="SPU名称">
      <span>{{ spu.spuName }}</span>
    </el-form-item>
    <el-form-item label="SKU名称" prop="skuName">
      <el-input v-model="sku.skuName" placeholder="请输入sku名称" />
    </el-form-item>
    <el-form-item label="价格(元)" prop="price">
      <el-input v-model="sku.price" placeholder="请输入价格" />
    </el-form-item>
    <el-form-item label="重量(kg)" prop="weight">
      <el-input v-model="sku.weight" placeholder="请输入重量" />
    </el-form-item>
    <el-form-item label="规格描述" prop="skuDesc">
      <el-input v-model="sku.skuDesc" type="textarea" rows="4" placeholder="请输入规格描述" />
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline label-width="6em">
        <el-form-item v-for="attrInfo in attrInfoList" :key="attrInfo.id" :label="attrInfo.attrName">
          <el-select v-model="attrInfo.selectValue" clearable>
            <el-option
              v-for="attrValueItem in attrInfo.attrValueList"
              :key="attrValueItem.id"
              :label="attrValueItem.valueName"
              :value="`${attrValueItem.attrId}:${attrValueItem.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline label-width="6em">
        <el-form-item v-for="spuSaleAttr in spuSaleAttrList" :key="spuSaleAttr.id" :label="spuSaleAttr.saleAttrName">
          <el-select v-model="spuSaleAttr.selectValue" clearable>
            <el-option
              v-for="spuSaleAttrValueItem in spuSaleAttr.spuSaleAttrValueList"
              :key="spuSaleAttrValueItem.id"
              :label="spuSaleAttrValueItem.saleAttrValueName"
              :value="`${spuSaleAttrValueItem.baseSaleAttrId}:${spuSaleAttrValueItem.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table :data="skuImageList" border stripe @selection-change="selectionChange">
        <el-table-column type="selection" align="center" />
        <el-table-column label="图片" prop="" align="center">
          <template v-slot="{ row, $index }">
            <el-image style="width: 100px; height: 100px" :src="row.imgUrl" fit="contain" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName" align="center" />
        <el-table-column label="操作" prop="" align="center">
          <template v-slot="{ row, $index }">
            <el-button
              v-if="row.isDefault === 0"
              plain
              size="mini"
              type="primary"
              @click="changeDefault(row, $index)"
            >设为默认</el-button>
            <el-tag v-else type="success">默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="$emit('close', false)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getAttrInfoList, getSpuSaleAttrListById, getSpuImgsById, saveSkuInfo } from '@/api/product'
export default {
  name: 'SkuForm',
  props: {
    cateIdInfo: {
      type: Object,
      default: () => ({})
    },
    spu: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      sku: {
        skuName: '',
        price: '',
        weight: '',
        skuDesc: '',
        skuImageList: [
          /*  {
            "id": 0,
            "imgName": "string",
            "imgUrl": "string",
            "isDefault": "string",
            "skuId": 0,
            "spuImgId": 0
          } */
        ],
        skuDefaultImg: ''
        /* "category3Id": 0,
        "spuId": 0,
        "tmId": 0
        "isSale": 0,
        "skuAttrValueList": [
          {
            "attrId": 0,
            "attrName": "string",
            "id": 0,
            "skuId": 0,
            "valueId": 0,
            "valueName": "string"
          }
        ],
        "skuSaleAttrValueList": [
          {
            "id": 0,
            "saleAttrId": 0,
            "saleAttrName": "string",
            "saleAttrValueId": 0,
            "saleAttrValueName": "string",
            "skuId": 0,
            "spuId": 0
          }
        ], */
      },
      rules: {
        skuName: [
          { required: true, message: '请输入SKU名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          {
            pattern: /(^[1-9][0-9]{0,7}$)|(^((0\.0[1-9]$)|(^0\.[1-9]\d?)$)|(^[1-9][0-9]{0,7}\.\d{1,2})$)/, message: '请输入合法的价格', trigger: 'blur'
          }
        ],
        weight: [
          { required: true, message: '请输入重量', trigger: 'blur' }
        ],
        skuDesc: [
          { required: true, message: '请输入规格描述', trigger: 'blur' }
        ]
      },
      attrInfoList: [], // 平台属性
      spuSaleAttrList: [], // 销售属性
      skuImageList: [] // 图片列表表格数据
    }
  },
  mounted() {
    this.fetchAttrInfoList()
    this.fetchSpuSaleAttrList()
    this.fetchSkuImageList()
  },
  methods: {
    // 获取平台属性
    async fetchAttrInfoList() {
      const { cate1, cate2, cate3 } = this.cateIdInfo
      const { code, data } = await getAttrInfoList(cate1, cate2, cate3)
      // const { code, data } = await getAttrInfoList(1, 1, 1)
      if (code !== 200) return this.$message.error('获取平台属性失败')
      this.attrInfoList = data
    },
    // 获取销售属性
    async fetchSpuSaleAttrList() {
      const { code, data } = await getSpuSaleAttrListById(this.spu.id)
      // const { code, data } = await getSpuSaleAttrListById(10485)
      if (code !== 200) {
        this.$message.error('获取销售属性失败')
      }
      this.spuSaleAttrList = data
    },
    // 获取图片列表
    async fetchSkuImageList() {
      const { code, data } = await getSpuImgsById(this.spu.id)
      // const { code, data } = await getSpuImgsById(10485)
      if (code !== 200) {
        return this.$message.error('获取sku图片失败')
      }
      this.skuImageList = data.map(item => {
        return {
          ...item,
          isDefault: 0 // 不是默认0， 是默认1
        }
      })
    },
    // 改变默认
    changeDefault(row, index) {
      this.skuImageList.forEach((item, i) => {
        item.isDefault = index === i ? 1 : 0
      })
      this.sku.skuDefaultImg = row.imgUrl
    },
    // 图片表格选中项变化回调
    selectionChange(selection) {
      this.sku.skuImageList = selection.map(item => {
        const { imgName, imgUrl, isDefault } = item
        return {
          imgName,
          imgUrl
        }
      })
      // console.log('selection', selection)
    },
    // 处理保存
    handleSave() {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          return
        }
        // 平台属性数据处理
        const skuAttrValueList = this.attrInfoList.filter(item => item.selectValue).map(item => {
          const [attrId, valueId] = item.selectValue.split(':')
          return {
            attrId,
            valueId
          }
        })
        // 销售属性数据处理
        const skuSaleAttrValueList = this.spuSaleAttrList.filter(item => item.selectValue).map(item => {
          const [saleAttrId, saleAttrValueId] = item.selectValue.split(':')
          return {
            saleAttrId, // 销售属性id
            saleAttrValueId // 销售属性值id
          }
        })
        const params = {
          ...this.sku,
          category3Id: this.cateIdInfo.cate3,
          spuId: this.spu.id,
          tmId: this.spu.tmId,
          skuAttrValueList,
          skuSaleAttrValueList
        }
        console.log('保存', params)
        const { code, date } = await saveSkuInfo(params)
        if (code !== 200) {
          return this.$message.error('保存失败！')
        }
        this.$message.success('保存成功')
        this.$emit('close', true)
      })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
