<template>
  <div>
    <el-card style="margin: 20px 0;">
      <CategorySelect :disabled="isEdit" @selected="handleSelected" />
    </el-card>
    <el-card>
      <!-- 查看 -->
      <template v-if="!isEdit">
        <el-button type="primary" size="small" icon="el-icon-plus" :disabled="isDisabledPlus" @click="goEditAttrInfo('')">添加属性</el-button>
        <el-table key="1" :data="tableData" stripe>
          <el-table-column label="序号" type="index" align="center" />
          <el-table-column label="属性名称" prop="attrName" align="center" width="200" />
          <el-table-column label="属性值名称" prop="attrValueList" align="center">
            <template v-slot="{ row }">
              <el-tag v-for="item in row.attrValueList" :key="item.id" style="margin: 5px" type="success">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150px">
            <template v-slot="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="goEditAttrInfo(row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delAttrInfo(row)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 添加和修改 -->
      <template v-else>
        <el-form inline :model="attrInfo" label-width="4em" size="mini">
          <el-form-item label="属性名">
            <el-input v-model.trim="attrInfo.attrName" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" size="small" :disabled="!attrInfo.attrName.length" @click="addAttrValue">添加属性值</el-button>
        <!-- <el-button size="small">取消</el-button> -->
        <el-table key="2" :data="attrInfo.attrValueList" stripe style="margin: 20px 0;">
          <el-table-column label="序号" type="index" width="60px" align="center" />
          <el-table-column prop="valueName" label="属性值名称" align="center">
            <template v-slot="{ row, $index }">
              <el-input v-if="row.editing" v-model.trim="row.valueName" v-focus placeholder="请输入属性值" size="mini" @blur="handleBlurAndKeyup(row,$index)" @keyup.native.enter="handleBlurAndKeyup(row,$index)" />
              <p v-else style="margin:0;" @dblclick="row.editing=true">{{ row.valueName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template v-slot="{ row, $index }">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="delSingleAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="small" :disabled="isDisabledSave" :loading="saving" @click="submitInfo">保存</el-button>
        <el-button size="small" @click="claceEdit">取消</el-button>
      </template>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import CategorySelect from '../components/CategorySelect'
import { getAttrInfoList, saveAttrInfo, delAttr } from '@/api/product.js'
export default {
  name: 'Attr',
  components: {
    CategorySelect
  },
  directives: {
    // 自动聚焦指令
    focus: {
      inserted(el) {
        el.querySelector('input').focus()
      }
    }
  },
  data() {
    return {
      selectedIds: {
        cate1: '',
        cate2: '',
        cate3: ''
      },
      tableData: [],
      isEdit: false, // 是否编辑
      attrInfo: {
        attrName: '',
        attrValueList: [
          /* {
            attrId: 0,
            id: 0,
            valueName: ''
          } */
        ],
        // categoryId: 0,
        categoryLevel: 3
        // id: 0
      },
      saving: false
    }
  },
  computed: {
    // 是否禁用添加属性值按钮
    isDisabledPlus() {
      return Object.values(this.selectedIds).some(item => !item)
    },
    // 是否禁用保存按钮
    isDisabledSave() {
      if (this.attrInfo.attrValueList.length === 0) {
        return true
      }
      return this.attrInfo.attrValueList.every(item => !item.valueName)
    }
  },
  watch: {
    'selectedIds.cate3': {
      handler(val) {
        if (val) {
          this.fetchTableData()
        } else {
          this.tableData = []
        }
      }
    }
  },
  methods: {
    handleSelected(e) {
      const { cate1, cate2, cate3 } = e
      this.selectedIds.cate1 = cate1
      this.selectedIds.cate2 = cate2
      this.selectedIds.cate3 = cate3
    },
    /**
     * @Date 2023-09-10 01:30:36
     * @introduction 获取属性信息表格数据
     * @description 详细描述
     * @param {参数类型} 参数 参数说明
     */
    async fetchTableData() {
      const { cate1, cate2, cate3 } = this.selectedIds
      const { code, data } = await getAttrInfoList(cate1, cate2, cate3)
      if (code === 200) {
        this.tableData = data
      }
    },
    // 去编辑属性信息（新增或修改）
    goEditAttrInfo(row) {
      // 没有row数据说明是新增属性,反之是修改
      this.isEdit = true
      if (!row) {
        return
      }
      // 不能直接赋值，否则编辑时修改了数据会影响原数据
      const cloneData = cloneDeep(row)
      cloneData.attrValueList.forEach(item => {
        // 添加一个标记，标识是否在编辑中
        item.editing = false
      })
      this.attrInfo = cloneData
    },
    // 删除属性
    delAttrInfo(row) {
      this.$confirm('此操作将永久删除该属性，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code } = await delAttr(row.id)
        if (code === 200) {
          this.$message.success('删除成功！')
          this.fetchTableData()
        }
      })
    },
    // 添加属性值
    addAttrValue() {
      const attrValueInfo = {
        attrId: this.attrInfo.id,
        // id: 0,
        valueName: '',
        editing: true // 标识是否编辑中，编辑中显示输入框，否则显示纯文本
      }
      this.attrInfo.attrValueList.push(attrValueInfo)
    },
    // 删除一个属性值
    delSingleAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 属性值名称输入框失焦和按下回车处理
    handleBlurAndKeyup(row, index) {
      // 当前属性值是否重复了
      const isRepeat = this.attrInfo.attrValueList.some((item, i) => {
        if (index !== i) {
          if (item.valueName && item.valueName === row.valueName) {
            return true
          }
        } else {
          return false
        }
      })
      if (isRepeat) {
        this.$message(`${row.valueName}已存在，请输入其他属性值！`)
      }
      // 属性值名称有值且未重复，才将编辑状态改为false
      if (row.valueName && !isRepeat) {
        row.editing = false
      }
    },
    // 提交信息
    async submitInfo() {
      // 过滤出属性值不为空的数据
      const attrValueList = this.attrInfo.attrValueList.filter(item => item.valueName)
      // 去重后的属性值列表
      const values = [...new Set(this.attrInfo.attrValueList.map(item => item.valueName))]
      if (values.length !== attrValueList.length) {
        this.$message('请删除重复的属性值！')
        return
      }
      const params = {
        ...this.attrInfo,
        attrValueList,
        categoryId: this.selectedIds.cate3
      }
      this.saving = true
      const { code } = await saveAttrInfo(params)
      this.saving = false
      if (code === 200) {
        this.$message.success('保存成功！')
        this.isEdit = false
        this.fetchTableData()
      }
    },
    // 取消编辑
    claceEdit() {
      this.isEdit = false
      this.attrInfo = this.$options.data().attrInfo
    }
  }
}
</script>

<style lang="scss" scoped >

</style>
