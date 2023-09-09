<template>
  <div class="wrap">
    <div>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        align="center"
      />
      <el-table-column
        prop="tmName"
        label="品牌名称"
        align="center"
      />
      <el-table-column
        prop="logoUrl"
        label="品牌logo"
        align="center"
      >
        <template v-slot=" { row }">
          <el-image
            style="width: 100px; height: 100px"
            :src="row.logoUrl"
            fit="contain"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器   -->
    <el-pagination
      :style="{textAlign: 'center'}"
      :current-page="params.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="params.limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加和修改对话框 -->
    <el-dialog :title="form.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible" @closed="dialogClosed">
      <el-form ref="form" :model="form" :rules="rules" label-width="7em">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌logo" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBarndPage, addTrademark, updateTrademark, removeTrademark } from '@/api/brand.js'
export default {
  name: 'Brand',
  data() {
    return {
      tableData: [],
      total: 0,
      params: {
        page: 1,
        limit: 10
      },
      dialogFormVisible: false,
      form: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请填写品牌名称', trigger: 'blur' }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌logo', trigger: 'change' }
        ]
      },
      submitLoading: false
    }
  },
  mounted() {
    this.fetchTableData()
  },
  methods: {
    async fetchTableData() {
      const { data } = await getBarndPage(this.params)
      this.tableData = data.records
      this.total = data.total
    },
    // 添加按钮点击处理
    handleAdd() {
      this.dialogFormVisible = true
    },
    // 表格行编辑按钮回调
    handleEdit(row) {
      this.dialogFormVisible = true
      for (const key in this.form) {
        this.form[key] = row[key]
      }
      this.form.id = row.id
    },
    // 表格行删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该品牌, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await removeTrademark(row.id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 当前页只有一项，并且不是第一页时，删完完成后请求上一页数据
          if (this.tableData.length === 1 && this.params.page > 1) {
            this.params.page -= 1
          }
          this.fetchTableData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(e) {
      this.params.limit = e
      this.fetchTableData()
    },
    handleCurrentChange(e) {
      this.params.page = e
      this.fetchTableData()
    },
    // logo上传成功回调
    handleAvatarSuccess(res) {
      this.form.logoUrl = res.data
    },
    // logo上传之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('logo图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('logo图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 提交对话框内表单
    submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) {
          return
        }
        // 根据是否有id，可判断出是新增还是修改，从而选择对应的请求函数
        const handleFun = this.form.id ? updateTrademark : addTrademark
        this.submitLoading = true
        const res = await handleFun(this.form)
        this.submitLoading = false
        const code = res.code
        if (code === 200) {
          this.$message.success(this.form.id ? '修改成功' : '添加成功')
          this.dialogFormVisible = false
          this.fetchTableData()
        }
      })
    },
    // 对话框关闭动画结束的回调
    dialogClosed() {
      this.form = this.$options.data().form
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: contain;
  }
</style>
