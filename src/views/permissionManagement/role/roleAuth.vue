<template>
  <div>
    <el-input :value="this.$route.query.roleName" :disabled="true" />
    <el-tree
      ref="tree"
      :data="treeData"
      show-checkbox
      default-expand-all
      :default-checked-keys="defaultCheckedIds"
      node-key="id"
      :props="defaultProps"
      style="margin: 20px 0;"
    />
    <div>
      <el-button size="small" type="primary" :loading="loading" @click="handleSave">保 存</el-button>
      <el-button size="small" @click="$router.back()">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { getRoleAssignMenu, setRoleAssignAuth } from '@/api/permissionManagement'
export default {
  name: 'RoleAuth',
  data() {
    return {
      treeData: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      defaultCheckedIds: [], // 默认选中的节点id
      loading: false
    }
  },
  created() {
    this.fetchTreeData()
  },
  methods: {
    // 根据角色id获取菜单树
    async fetchTreeData() {
      const { data, code } = await getRoleAssignMenu(this.$route.query.id)
      if (![200, 20000].includes(code)) {
        return this.$message.error('获取数据失败')
      }
      this.treeData = data.children
      this.defaultCheckedIds = this.genDefaultCheckedIds(data.children)
    },
    // 处理保存回调
    async handleSave() {
      const arr = this.$refs.tree.getCheckedNodes()
      const params = {
        roleId: this.$route.query.id,
        permissionId: arr.filter(item => item.level === 4).map(item => item.id).join(',')
      }
      this.loading = true
      try {
        const { success } = await setRoleAssignAuth(params)
        if (!success) {
          return this.$message.error('保存失败')
        }
        this.$message.success('保存成功')
        this.$router.replace({ name: 'Role' })
      } finally {
        this.loading = false
      }
    },
    // 生成默认选中的节点，且等级level为4的id数组集合
    genDefaultCheckedIds(data) {
      return data.reduce((pre, cur) => {
        if (cur.select && cur.level === 4) {
          pre.push(cur.id)
        } else if (cur.children.length > 0) {
          pre.push(...this.genDefaultCheckedIds(cur.children))
        }
        return pre
      }, [])
    }
  }
}
</script>

<style lang="scss" scoped></style>
