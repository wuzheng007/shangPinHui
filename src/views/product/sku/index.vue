<template>
  <div class="sku-container">
    <el-table :data="tableData" border stripe style="margin-bottom: 10px;">
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="名称" align="center" prop="skuName"></el-table-column>
      <el-table-column label="描述" align="center" prop="skuDesc" min-width="150"></el-table-column>
      <el-table-column label="默认图片" align="center">
        <template v-slot="{ row }">
          <el-image style="width: 100px; height: 100px;" fit="contain" :src="row.skuDefaultImg"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="重量" align="center" prop="weight"></el-table-column>
      <el-table-column label="价格" align="center" prop="price"></el-table-column>
      <el-table-column label="操作" align="center" prop="" min-width="150">
        <template v-slot="{ row, $index }">
          <el-tooltip effect="dark" :content="row.isSale === 0 ? '上架' : '下架'" placement="top">
            <el-button v-if="row.isSale === 0" type="success" icon="el-icon-top" size="mini"
              @click="changeSaleState(row)"></el-button>
            <el-button v-else type="warning" icon="el-icon-bottom" size="mini" @click="changeSaleState(row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="修改" placement="top">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleRowEdit(row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="查看详情" placement="top">
            <el-button type="info" icon="el-icon-info" size="mini" @click="handleRowView(row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top" style="margin-left: 10px;">
            <el-popconfirm :title="`确定删除${row.skuName}吗？`" @onConfirm="handleRowDelete(row)">
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-popconfirm>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="params.page" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 查看详情抽屉 -->
    <el-drawer size="40%" :title="drawerTitle" :visible.sync="drawerVisible">
      <div v-loading="drawerContentLoading">
        <el-row>
          <el-col class="label" :span="5">名称</el-col>
          <el-col :span="18">{{ sku.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col class="label" :span="5">描述</el-col>
          <el-col :span="18">{{ sku.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col class="label" :span="5">价格</el-col>
          <el-col :span="18">{{ sku.price }}</el-col>
        </el-row>
        <el-row>
          <el-col class="label" :span="5">平台属性</el-col>
          <el-col :span="18">
            <el-tag v-for="tag in sku.skuAttrValueList" :key="tag.id">{{ tag.attrName }}-{{ tag.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="label" :span="5">商品图片</el-col>
          <el-col :span="18">
            <el-carousel height="200px">
              <el-carousel-item v-for="item in sku.skuImageList" :key="item.id">
                <el-image :src="item.imgUrl" style="width: 100%; height: 100%" fit="contain"></el-image>
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getSkuList, onSale, cancelSale, getSkuById, deleteSku } from '@/api/product'
export default {
  name: 'Sku',
  data() {
    return {
      tableData: [{}],
      total: 0,
      params: {
        page: 1,
        limit: 10
      },
      drawerVisible: false, // 抽屉显隐
      drawerTitle: '', // 抽屉标题
      drawerContentLoading: false,
      sku: {} // sku信息
    }
  },
  mounted() {
    this.fetchTableData()
  },
  methods: {
    async fetchTableData() {
      const { page, limit } = this.params
      const { code, data } = await getSkuList(page, limit)
      if (code !== 200) {
        return this.$message.error('获取数据失败')
      }
      const { records, total } = data
      this.tableData = records
      this.total = total
    },
    // 表格操作列上架下架按钮处理
    async changeSaleState(row) {
      const { isSale, id } = row
      let code
      if (isSale === 0) {
        const res = await onSale(id)
        code = res.code
      } else if (isSale === 1) {
        const res = await cancelSale(id)
        code = res.code
      }
      if (code !== 200) {
        return this.$message.error('操作失败')
      }
      this.fetchTableData()
    },
    // 表格操作列编辑按钮处理
    handleRowEdit() {
      this.$message('开发中')
    },
    // 表格操作列查看详情按钮处理
    async handleRowView(row) {
      this.drawerVisible = true
      this.drawerContentLoading = true
      const { code, data } = await getSkuById(row.id)
      this.drawerContentLoading = false
      if (code !== 200) {
        return this.$message.error('获取sku数据失败')
      }
      this.sku = data
    },
    // 表格操作列删除按钮处理
    async handleRowDelete(row) {
      console.log(row)
      const { code } = await deleteSku(row.id)
      if (code !== 200) {
        return this.$message.error('删除失败')
      }
      if (this.tableData.length === 1 && this.params.page > 1) {
        this.params.page -= 1
      }
      this.fetchTableData()
    },
    handleSizeChange(e) {
      this.params.limit = e
      this.fetchTableData()
    },
    handleCurrentChange(e) {
      this.params.page = e
      this.fetchTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 0 10px 10px 0;
}

::v-deep .el-row {
  margin-bottom: 20px;

  .label {
    font-size: 16px;
    font-weight: 700;
    text-align: right;
    padding-right: 20px;
  }

  .el-carousel__button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
}

::v-deep .el-drawer {
  overflow: auto;
}
</style>
