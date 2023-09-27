<template>
  <div>
    <el-form ref="form" inline :model="form">
      <el-form-item prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button @click="resetForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="handleAdd">添 加</el-button>
      <el-button type="danger" :disabled="tableSelectData.length===0" @click="handleDel">批量删除</el-button>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" border stripe style="margin: 10px 0;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column label="角色名称" prop="roleName" align="center">
        <template v-slot="{ row }">
          <div v-if="row.isEditing" style="display: flex;">
            <el-input v-model="row.roleName" size="mini" style="margin-right: 30px;" />
            <el-button type="warning" size="mini" icon="el-icon-close" @click="cancelEdit(row)">取消</el-button>
          </div>
          <span v-else>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="" align="center">
        <template v-slot="{row}">
          <div>
            <el-tooltip content="分配权限" placement="top">
              <el-button type="info" size="mini" icon="el-icon-info" @click="handleRowDistribution(row)" />
            </el-tooltip>
            <el-tooltip :content="row.isEditing ? '确定': '修改角色'" placement="top">
              <el-button v-if="!row.isEditing" type="primary" size="mini" icon="el-icon-edit" @click="handleStartEdit(row)" />
              <el-button v-else type="primary" size="mini" icon="el-icon-check" :disabled="row.cacheText === row.roleName" @click="handleConfirm(row)" />
            </el-tooltip>
            <el-tooltip content="删除角色" placement="top" style="margin-left: 10px;">
              <el-popconfirm :title="`确认删除${row.roleName}吗？`" @onConfirm="handleRowDelete(row)">
                <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete" />
              </el-popconfirm>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-size="limit"
      layout="sizes, prev, pager, next, jumper, ->, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加角色弹窗 -->
    <el-dialog :visible.sync="addDialogVisible" :title="addDialogTitle" @closed="handleAddAndEditDialogClosed">
      <el-form ref="roleForm" :model="roleForm" :rules="roleFormRules" label-width="6em">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRolePage, saveRole, removeRole, updateRole, removeRoles } from '@/api/permissionManagement'
export default {
  name: 'Role',
  data() {
    return {
      form: {
        roleName: ''
      },
      page: 1,
      limit: 10,
      tableData: [],
      tableLoading: false,
      total: 0,
      addDialogVisible: false,
      addDialogTitle: '添加角色',
      roleForm: { // 添加角色表单
        roleName: ''
      },
      roleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      tableSelectData: [] // 表格选中项
    }
  },
  mounted() {
    this.fetchTableData()
  },
  methods: {
    // 获取表格数据
    async fetchTableData() {
      try {
        this.tableLoading = true
        const { code, data } = await getRolePage(this.page, this.limit, this.form)
        if (![200, 20000].includes(code)) {
          return this.$message.error('获取角色列表失败')
        }
        this.tableData = data.items.map(item => {
          return {
            ...item,
            cacheText: item.roleName,
            isEditing: false
          }
        })
        this.total = data.total
      } finally {
        this.tableLoading = false
      }
    },
    // 处理查询按钮点击事件
    handleSearch() {
      const { page, limit } = this.$options.data()
      this.page = page
      this.limit = limit
      this.fetchTableData()
    },
    // 处理清空按钮点击
    resetForm() {
      this.$refs.form.resetFields()
    },
    // 处理每页显示条数改变事件
    handleSizeChange(e) {
      this.limit = e
      this.fetchTableData()
    },
    // 处理页码改变事件
    handleCurrentChange(e) {
      this.page = e
      this.fetchTableData()
    },
    // 处理添加按钮点击
    handleAdd() {
      this.addDialogTitle = '添加角色'
      this.addDialogVisible = true
    },
    // 处理批量删除按钮点击
    handleDel() {
      this.$confirm('删除后无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const idList = this.tableSelectData.map(item => item.id)
        const { code, success } = await removeRoles(idList)
        if (![200, 20000].includes(code) || !success) {
          return this.$message.error('删除失败')
        }
        if (this.tableData.length === this.tableSelectData.length && this.page > 1) {
          this.page--
        }
        this.fetchTableData()
        this.$message.success('删除成功')
      })
    },
    // 当表格选择项发生变化时会触发该事件
    handleSelectionChange(e) {
      this.tableSelectData = e
    },
    // 表格角色列取消按钮处理函数
    cancelEdit(row) {
      row.roleName = row.cacheText
      row.isEditing = false
      this.$message('取消修改')
    },
    // 表格行分配角色按钮点击事件
    handleRowDistribution(row) {

    },
    // 表格行编辑图标按钮点击事件
    handleStartEdit(row) {
      row.isEditing = true
    },
    // 表格行确定按钮点击事件
    async handleConfirm(row) {
      const { id, roleName } = row
      const data = {
        id,
        roleName
      }
      const { code, success } = await updateRole(data)
      if (![200, 20000].includes(code) || !success) {
        return this.$message.error('修改失败！')
      }
      this.$message.success('修改成功！')
      this.fetchTableData()
    },
    // 表格行删除角色按钮点击事件
    async handleRowDelete(row) {
      const { code, success } = await removeRole(row.id)
      if (![200, 20000].includes(code) || !success) {
        return this.$message.error('删除失败')
      }
      if (this.tableData.length === 1 && this.page > 1) {
        this.page--
      }
      this.fetchTableData()
      this.$message.success('删除成功')
    },
    // 添加角色弹窗确认按钮点击事件
    onConfirm() {
      this.$refs.roleForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { code, success } = await saveRole(this.roleForm)
        if (![200, 20000].includes(code) || !success) {
          return this.$message.error('添加失败')
        }
        this.addDialogVisible = false
        this.fetchTableData()
        this.$message.success('添加成功')
      })
    },
    // 添加角色弹窗关闭事件
    handleAddAndEditDialogClosed() {
      this.roleForm = this.$options.data().roleForm
      this.$nextTick(() => {
        this.$refs.roleForm.clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
