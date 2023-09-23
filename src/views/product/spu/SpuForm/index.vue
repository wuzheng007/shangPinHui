<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="6em">
    <el-form-item label="SPU名称" prop="spuName">
      <el-input v-model="form.spuName" placeholder="SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌" prop="tmId">
      <el-select v-model="form.tmId" placeholder="请选择品牌">
        <el-option v-for="item in trademarkList" :key="item.id" :label="item.tmName" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述" prop="description">
      <el-input type="textarea" v-model="form.description" placeholder="请输入SPU描述" rows="4"></el-input>
    </el-form-item>
    <!-- SPU图片 -->
    <el-form-item label="SPU图片">
      <el-upload action="/admin/product/fileUpload" list-type="picture-card" :file-list="spuImageList"
        :on-success="onSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select v-model="selectSaleAttrStr" :placeholder="`还有${unSelectBaseSaleAttrList.length}项未选择`" clearable
        filterable>
        <el-option v-for="item in unSelectBaseSaleAttrList" :key="item.id" :label="item.name"
          :value="`${item.id},${item.name}`"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" :disabled="!selectSaleAttrStr"
        @click="handleAddSaleAttr">添加销售属性</el-button>
    </el-form-item>
    <el-form-item label="">
      <el-table :data="spuSaleAttrList" border stripe>
        <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
        <el-table-column label="属性名" prop="saleAttrName" align="center" width="120"></el-table-column>
        <el-table-column label="属性值列表" prop="" align="center">
          <template v-slot="{ row, $index }">
            <el-tag :key="i" v-for="(tag, i) in row.spuSaleAttrValueList" closable :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(i, 1)">
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input :ref="`saveTagInput${$index}`" v-if="row.inputVisible" v-model.trim="row.inputValue" size="small"
              @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(row, $index)">添加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="" align="center" width="100">
          <template v-slot="{ row, $index }">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteSaleAttr($index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="$emit('close', false)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getTrademarkList, getBaseSaleAttrList, saveSpuInfo, updateSpuInfo,  getSpuInfoById, getSpuImgsById } from '@/api/product'
export default {
  props: {
    category3Id: [Number, String],
    spu: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        spuName: "",
        tmId: '',
        description: "",
      },
      rules: {
        spuName: [
          { required: true, message: '请输入SPU名称', trigger: 'blur' },
        ],
        tmId: [
          { required: true, message: '请选择品牌', trigger: 'change' },
        ],
        description: [
          { required: true, message: '请输入SPU描述', trigger: 'blur' },
        ],
      },
      trademarkList: [], // 品牌列表
      spuInfo: {}, // SPU信息，编辑时使用
      spuImageList: [], // SPU图片列表
      baseSaleAttrList: [], // 基础销售属性列表
      selectSaleAttrStr: '', // 选择的销售属性字符串， '1,颜色'
      dialogImageUrl: '',
      dialogVisible: false,
      spuSaleAttrList: [
        /* {
            "baseSaleAttrId": 0,
            "id": 0,
            "saleAttrName": "",
            "spuId": 0,
            "spuSaleAttrValueList": [
              {
                "baseSaleAttrId": 0,
                "id": 0,
                "saleAttrName": "",
                "saleAttrValueName": "",
                "spuId": 0
              }
            ]
          } */
      ], //  表格销售属性列表
    }
  },
  computed: {
    // 未选择的基础销售属性
    unSelectBaseSaleAttrList() {
      // 已有的销售属性id
      const haveBaseSaleAttrId = this.spuSaleAttrList.map(item => +item.baseSaleAttrId)
      return this.baseSaleAttrList.filter(item => !haveBaseSaleAttrId.includes(+item.id))
    },
    selectSaleAttr() {
      return this.selectSaleAttrStr.split(',')
    }
  },
  mounted() {
    this.fetchTrademarkList()
    this.fetchBaseSaleAttrList()
    if (this.spu.id) {
      this.fetchSpuInfo()
      this.fetchSpuImageList()
    }
  },
  methods: {
    // 获取SPU信息
    async fetchSpuInfo() {
      const { code, data } = await getSpuInfoById(this.spu.id)
      if (code !== 200)  {
        return this.$message.error('获取SPU信息失败')
      }
      this.spuInfo = data
      for (let key in this.form) {
        this.form[key] = data[key]
      }
      this.spuSaleAttrList = data.spuSaleAttrList
    },
    // 获取SPU图片列表
    async fetchSpuImageList() {
      const { code, data } = await getSpuImgsById(this.spu.id)
      if (code !== 200) return this.$message.error('获取SPU图片列表失败')
      this.spuImageList = data.map(item => {
        return {
          url: item.imgUrl,
          name: item.imgName
        }
      })
    },
    // 获取品牌列表
    async fetchTrademarkList() {
      const { code, data } = await getTrademarkList()
      if (code !== 200) return this.$message.error('获取品牌列表失败')
      this.trademarkList = data
    },
    // 获取基础销售属性列表
    async fetchBaseSaleAttrList() {
      const { code, data } = await getBaseSaleAttrList()
      if (code !== 200) return this.$message.error('获取销售属性列表失败')
      this.baseSaleAttrList = data
    },
    // 处理添加销售属性
    handleAddSaleAttr() {
      const item = {
        baseSaleAttrId: this.selectSaleAttr[0],
        saleAttrName: this.selectSaleAttr[1],
        spuSaleAttrValueList: []
      }
      this.spuSaleAttrList.push(item)
      this.selectSaleAttrStr = ''
    },
    // 处理删除销售属性
    handleDeleteSaleAttr(index) {
      this.spuSaleAttrList.splice(index, 1)
    },
    // 展示销售属性值输入框
    showInput(row, index) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      this.$nextTick(() => {
        this.$refs[`saveTagInput${index}`].$refs.input.focus();
      });
    },
    // 处理添加销售属性值
    handleInputConfirm(row) {
      if (!row.inputValue) {
        this.$delete(row, 'inputVisible')
        this.$delete(row, 'inputValue')
        return
      }
      // 是否有重复项
      const result = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === row.inputValue)
      if (result) {
        return this.$message(`${row.inputValue}已存在`)
      }
      const item = {
        "baseSaleAttrId": row.baseSaleAttrId,
        // "isChecked": "",
        "saleAttrName": row.saleAttrName,
        "saleAttrValueName": row.inputValue,
        // "spuId": 0
      }
      row.spuSaleAttrValueList.push(item)
      this.$delete(row, 'inputVisible')
      this.$delete(row, 'inputValue')
    },
    handleRemove(file, fileList) {
      this.spuImageList = fileList
    },
    // sup图片上传成功的回调
    onSuccess(response, file, fileList) {
      // 上传成功后，服务器返回的数据会自动放进fileLit的项中
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 处理保存
    async handleSave() {
      this.$refs.form.validate(async(valid) => {
        if(!valid) {
          return
        }
        const params = {
          ...this.form,
          category3Id: this.category3Id,
          spuImageList: this.spuImageList.map(item => {
            return {
              imgUrl: item.response ? item.response.data : item.url,
              imgName: item.name,
            }
          }),
          spuSaleAttrList: this.spuSaleAttrList
        }
        if(this.spu.id) {
          params.id = this.spu.id
          const { code } = await updateSpuInfo(params)
          if (code !== 200) return this.$message.error('修改失败')
        }else {
          const { code } = await saveSpuInfo(params)
          if (code !== 200) return this.$message.error('保存失败')
        }
        this.$message.success(this.spu.id ? '修改成功' : '添加成功')
        this.$emit('close', true)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-tag+.el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
}

::v-deep .el-upload-list__item-thumbnail {
  object-fit: contain;
}
</style>
