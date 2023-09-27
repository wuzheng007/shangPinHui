<template>
  <div>
    <el-card style="margin: 20px 0;">
      <CategorySelect :disabled="scene !== 1" @selected="handleCateSelect" />
    </el-card>
    <el-card>
      <div v-show="scene === 1">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          :disabled="isDisableAddSpu"
          @click="changeScene(2)"
        >添加SPU</el-button>
        <el-table :data="tableData" border stripe>
          <el-table-column label="序号" type="index" width="60px" align="center" />
          <el-table-column label="SPU名称" align="center" prop="spuName" />
          <el-table-column label="SPU描述" align="center" prop="description" />
          <el-table-column label="操作" align="center">
            <template v-slot="{ row }">
              <el-tooltip content="添加sku" placement="top">
                <el-button type="success" icon="el-icon-plus" size="mini" @click="handleRowAddSku(row)" />
              </el-tooltip>
              <el-tooltip content="修改spu" placement="top">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="handleRowEdit(row)" />
              </el-tooltip>
              <el-tooltip content="查看当前spu全部sku列表" placement="top">
                <el-button type="info" icon="el-icon-info" size="mini" @click="handleRowView(row)" />
              </el-tooltip>
              <el-tooltip content="删除spu" placement="top">
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  style="margin-left: 10px;"
                  icon-color="red"
                  :title="`确定删除${row.spuName}吗？`"
                  @onConfirm="handleRowDel(row)"
                >
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="params.page"
          :page-size="params.limit"
          layout="sizes, prev, pager, next, jumper, ->, total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <SpuForm v-if="scene === 2" :category3id="selectedCate.cate3" :spu="spu" @close="handleClose" />
      <SkuForm v-if="scene === 3" :cate-id-info="selectedCate" :spu="spu" @close="handleClose" />
    </el-card>
    <!-- 弹窗（显示sku信息） -->
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogVisible">
      <el-table v-loading="skuTableDataLoading" :data="skuTableData" border stripe max-height="400">
        <el-table-column label="名称" align="center" prop="skuName" />
        <el-table-column label="价格" align="center" prop="price" />
        <el-table-column label="重量" align="center" prop="weight" />
        <el-table-column label="默认图片" align="center">
          <template v-slot="{ row }">
            <el-image style="width: 100px; height: 100px;" fit="contain" :src="row.skuDefaultImg" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import CategorySelect from '../components/CategorySelect'
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
import { getSpuPage, deleteSpuInfo, findBySpuId } from '@/api/product'
export default {
  name: 'Spu',
  components: {
    CategorySelect,
    SpuForm,
    SkuForm
  },
  data() {
    return {
      scene: 1, // 场景：1.列表 2.添加/修改spu 3.添加sku
      selectedCate: {
        cate1: '',
        cate2: '',
        cate3: ''
      },
      tableData: [],
      params: {
        page: 1,
        limit: 10
      },
      total: 0,
      spu: {},
      dialogVisible: false,
      skuTableData: [],
      skuTableDataLoading: false
    }
  },
  computed: {
    isDisableAddSpu() {
      if (this.selectedCate.cate3 || this.selectedCate.cate3 === 0) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    'selectedCate.cate3': {
      handler(val) {
        if (!val && val !== 0) {
          this.tableData = []
          this.total = 0
        } else {
          this.fetchTableData()
        }
      }
    }
  },
  methods: {
    async fetchTableData() {
      const { page, limit } = this.params
      const res = await getSpuPage(page, limit, { category3Id: this.selectedCate.cate3 })
      if (res.code !== 200) return this.$message.error('获取SPU列表失败')
      const { records, total } = res.data
      this.tableData = records
      this.total = total
    },
    // 改变场景
    changeScene(n) {
      this.scene = n
    },
    // 选择分类
    handleCateSelect(e) {
      const { cate1, cate2, cate3 } = e
      this.selectedCate.cate1 = cate1
      this.selectedCate.cate2 = cate2
      this.selectedCate.cate3 = cate3
    },
    handleSizeChange(pageSize) {
      this.params.limit = pageSize
      if (this.selectedCate.cate3) {
        this.fetchTableData()
      }
    },
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
      if (this.selectedCate.cate3) {
        this.fetchTableData()
      }
    },
    // 表格行添加sku按钮回调
    handleRowAddSku(row) {
      this.spu = row
      this.scene = 3
    },
    // 表格行修改spu按钮回调
    handleRowEdit(row) {
      this.spu = row
      this.scene = 2
    },
    // 表格行查看sku列表按钮回调
    async handleRowView(row) {
      this.spu = row
      this.dialogVisible = true
      this.skuTableDataLoading = true
      const { code, data } = await findBySpuId(row.id)
      this.skuTableDataLoading = false
      if (code !== 200) {
        return this.$message.error('获取sku数据失败')
      }
      this.skuTableData = data
    },
    // 表格行删除spu按钮回调
    async handleRowDel(row) {
      const { code } = await deleteSpuInfo(row.id)
      if (code !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      // 当前页数据只有一条且不是第一页时，删除后需要跳转到上一页
      if (this.tableData.length === 1 && this.params.page > 1) {
        this.params.page -= 1
      }
      this.fetchTableData()
    },
    /**
     * @Date 2023-09-22 14:45:38
     * @introduction spu表单关闭事件
     * @description 详细描述
     * @param {Boolean}  e 是否需要刷新列表
     */
    handleClose(e) {
      if (e) {
        this.fetchTableData()
      }
      this.scene = 1
      this.spu = ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
