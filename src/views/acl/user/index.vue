<template>
  <div>
    <el-form ref="form" inline :model="form">
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
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
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column label="用户名" prop="username" align="center" width="150" />
      <el-table-column label="用户昵称" prop="nickName" align="center" width="150" />
      <el-table-column label="权限列表" prop="roleName" align="center" />
      <el-table-column label="创建时间" prop="gmtCreate" align="center" />
      <el-table-column label="更新时间" prop="gmtModified" align="center" />
      <el-table-column label="操作" prop="">
        <template v-slot="{row}">
          <div>
            <el-tooltip content="分配角色" placement="top">
              <el-button type="info" size="mini" icon="el-icon-user" @click="handleRowDistribution(row)" />
            </el-tooltip>
            <el-tooltip content="修改用户" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleRowEdit(row)" />
            </el-tooltip>
            <el-tooltip content="删除用户" placement="top" style="margin-left: 10px;">
              <el-popconfirm :title="`确认删除${row.nickName}吗？`" @onConfirm="handleRowDelete(row)">
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
    <!-- 添加和修改用户弹窗 -->
    <el-dialog :visible.sync="addAndEditDialogVisible" :title="addAndEditDialogTitle" @closed="handleAddAndEditDialogClosed">
      <el-form ref="userForm" :model="userForm" :rules="userFormRules" label-width="6em">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="userForm.nickName" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="userForm.password" show-password placeholder="请输入密码" :disabled="addAndEditDialogTitle==='修改用户'" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="addAndEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 设置角色弹窗 -->
    <el-dialog :visible.sync="setRolesDialogVisible" title="设置角色" @closed="handleSetRolesDialogClosed">
      <el-form ref="setRolesForm" :model="setRolesForm" label-width="5em">
        <el-form-item label="用户名">
          <el-input v-model="setRolesForm.username" disabled />
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox v-model="allCheck" border size="small" style="margin-bottom: 20px;">全选</el-checkbox>
          <el-checkbox-group v-model="setRolesForm.roleIdList" size="small">
            <el-checkbox v-for="role in allRolesList" :key="role.id" style="margin: 0 10px 10px 0;" :label="role.id" border>{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirmRoles">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getUserPage, saveUser, removeUser, updateUser, removeUsers, getUserAssignRoles, setUserAssignRole } from '@/api/permissionManagement'
export default {
  name: 'User',
  data() {
    return {
      form: {
        username: ''
      },
      page: 1,
      limit: 10,
      tableData: [],
      tableLoading: false,
      total: 0,
      addAndEditDialogVisible: false,
      addAndEditDialogTitle: '添加用户',
      userForm: { // 添加和修改用户表单
        username: '',
        nickName: '',
        password: ''
      },
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度至少为 6 个字符', trigger: 'blur' }
        ]
      },
      tableSelectData: [], // 表格选中项
      setRolesDialogVisible: false, // 设置角色弹窗显隐
      setRolesForm: {
        username: '',
        roleIdList: []
      },
      // allCheck: false, // 角色全选
      allRolesList: [] // 所有角色
    }
  },
  computed: {
    // 全选
    allCheck: {
      get() {
        return this.setRolesForm.roleIdList.length === this.allRolesList.length
      },
      set(val) {
        if (val) {
          this.setRolesForm.roleIdList = this.allRolesList.map(item => item.id)
        } else {
          this.setRolesForm.roleIdList = []
        }
      }
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
        const { code, data } = await getUserPage(this.page, this.limit, this.form)
        if (![200, 20000].includes(code)) {
          return this.$message.error('获取用户列表失败')
        }
        this.tableData = data.items
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
      this.addAndEditDialogTitle = '添加用户'
      this.addAndEditDialogVisible = true
    },
    // 处理批量删除按钮点击
    handleDel() {
      this.$confirm('删除后无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const idList = this.tableSelectData.map(item => item.id)
        const { code, success } = await removeUsers(idList)
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
    // 表格行分配角色按钮点击事件
    async handleRowDistribution(row) {
      const { id, username } = row
      this.setRolesDialogVisible = true
      this.setRolesForm.username = username
      this.setRolesForm.userId = id
      const { code, data } = await getUserAssignRoles(id)
      if (![200, 20000].includes(code)) {
        return this.$message.error('获取数据失败')
      }
      const { allRolesList, assignRoles } = data
      this.allRolesList = allRolesList
      this.setRolesForm.roleIdList = assignRoles.map(item => item.id)
    },
    // 表格行修改用户按钮点击事件
    async handleRowEdit(row) {
      this.addAndEditDialogTitle = '修改用户'
      this.addAndEditDialogVisible = true
      for (const key in this.userForm) {
        this.userForm[key] = row[key]
      }
      this.userForm.id = row.id
    },
    // 表格行删除用户按钮点击事件
    async handleRowDelete(row) {
      const { code, success } = await removeUser(row.id)
      if (![200, 20000].includes(code) || !success) {
        return this.$message.error('删除失败')
      }
      if (this.tableData.length === 1 && this.page > 1) {
        this.page--
      }
      this.fetchTableData()
      this.$message.success('删除成功')
    },
    // 添加和修改用户弹窗确认按钮点击事件
    onConfirm() {
      this.$refs.userForm.validate(async valid => {
        if (!valid) {
          return
        }
        let flag // 操作是否成功标识
        if (this.addAndEditDialogTitle === '添加用户') {
          const { code, success } = await saveUser(this.userForm)
          if (![200, 20000].includes(code) || !success) {
            flag = false
          }
        } else if (this.addAndEditDialogTitle === '修改用户') {
          const { code, success } = await updateUser(this.userForm)
          if (![200, 20000].includes(code) || !success) {
            flag = false
          }
        }
        if (flag === false) {
          return this.$message.error(`${this.addAndEditDialogTitle}失败！`)
        }
        this.addAndEditDialogVisible = false
        this.fetchTableData()
        this.$message.success(`${this.addAndEditDialogTitle}成功！`)
      })
    },
    // 添加和修改用户弹窗关闭事件
    handleAddAndEditDialogClosed() {
      this.userForm = this.$options.data().userForm
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    },
    // 设置角色弹窗确定按钮处理
    async onConfirmRoles() {
      const { userId, roleIdList } = this.setRolesForm
      const data = {
        userId,
        roleIdList
      }
      const { code, success } = await setUserAssignRole(data)
      if (![200, 20000].includes(code) || !success) {
        return this.$message.error('设置失败！')
      }
      this.$message.success('设置成功！')
      this.setRolesDialogVisible = false
      this.fetchTableData()
    },
    // 设置角色弹窗关闭事件
    handleSetRolesDialogClosed() {
      this.setRolesForm = this.$options.data().setRolesForm
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  max-height: 400px;
  overflow-y: auto;
}
</style>
