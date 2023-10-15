<template>
  <div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      style="width: 100%;"
      row-key="id"
      border
      stripe
      :expand-row-keys="expandRowKeys"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column prop="toCode" label="跳转权限值" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-tooltip v-if="row.level !== 4" effect="dark" :content="row.level !== 3 ? '添加菜单' : '添加功能'" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd(row)" />
          </el-tooltip>
          <el-tooltip v-if="row.level !== 1" effect="dark" :content="row.level !== 4 ? '修改菜单' : '修改功能'" placement="top">
            <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleUpdate(row)" />
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" @closed="handleClosed">
      <el-form ref="form" :model="form" :rules="rules" label-width="8em" :validate-on-rule-change="false">
        <el-form-item v-if="[2, 3].includes(form.level)" label="父级名称">
          <el-input :value="parentName" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item :label="form.level === 4 ? '功能权限值' : '权限值'" prop="code">
          <el-input v-model="form.code" :placeholder="`请输入${form.level === 4 ? '功能权限值' : '权限值'}`" />
        </el-form-item>
        <el-form-item v-if="form.level === 4" label="跳转路由权限值" prop="toCode">
          <el-input v-model="form.toCode" placeholder="请输入跳转路由权限值" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, updatePermission, removePermission } from '@/api/permissionManagement'
export default {
  name: 'Permission',
  data() {
    return {
      tableData: [],
      tableLoading: false,
      expandRowKeys: [], // 展开的行
      dialogVisible: false, // 弹窗显隐
      dialogTitle: '', // 弹窗标题
      parentName: {}, // 当前行
      form: { // 弹窗表单
        level: 0, // 级别
        name: '',
        code: '',
        toCode: ''
      }
    }
  },
  computed: {
    rules() {
      return { // 表单验证规则
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: `请输入${this.form.level === 4 ? '功能权限值' : '权限值'}`, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchTableData()
  },
  methods: {
    async fetchTableData() {
      try {
        this.tableLoading = true
        const { code, data } = await getPermissionList()
        if (![200, 20000].includes(code)) {
          return this.$message.error('获取数据失败')
        }
        this.tableData = data.children
        this.expandRowKeys = [data.children[0].id]
      } finally {
        this.tableLoading = false
      }
    },
    // 表格添加按钮处理
    handleAdd(row) {
      const { level, name, id } = row
      this.dialogVisible = true
      this.parentName = name
      this.form.level = level + 1
      this.form.pid = id
      if (this.form.level === 2) {
        this.dialogTitle = '添加一级菜单'
      } else if (this.form.level === 3) {
        this.dialogTitle = '添加二级菜单'
      } else if (this.form.level === 4) {
        this.dialogTitle = '添加功能'
      }
    },
    // 表格修改按钮处理
    handleUpdate(row) {
      const { name, id } = row
      this.dialogVisible = true
      this.parentName = name
      for (const key in this.form) {
        this.form[key] = row[key]
      }
      this.form.id = id
      if (this.form.level === 2) {
        this.dialogTitle = '修改一级菜单'
      } else if (this.form.level === 3) {
        this.dialogTitle = '修改二级菜单'
      } else if (this.form.level === 4) {
        this.dialogTitle = '修改功能'
      }
    },
    // 表格删除按钮处理
    handleDelete(row) {
      this.$confirm('此操作将永久删除该节点及其子节点（若有）, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code } = await removePermission(row.id)
        if (![200, 20000].includes(code)) {
          this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.fetchTableData()
      })
    },
    // 确定按钮处理
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const data = { ...this.form }
        // 不是（设置按钮）功能权限值的时候删除toCode
        if (this.form.level !== 4) {
          delete data.toCode
        }
        // 是否成功的标志
        let isSuccess = false
        if (this.form.id) { // 修改
          const { code } = await updatePermission(data)
          if ([200, 20000].includes(code)) {
            isSuccess = true
          }
        } else { // 添加
          const { code } = await addPermission(data)
          if ([200, 20000].includes(code)) {
            isSuccess = true
          }
        }
        if (!isSuccess) {
          return this.$message.error('操作失败')
        }
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.fetchTableData()
      })
    },
    handleClosed() {
      this.form = this.$options.data().form
      this.$refs.form.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped></style>
