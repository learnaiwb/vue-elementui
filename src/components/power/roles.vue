<template>
  <div>
     <!-- 角色管理 -->
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleData" border stripe>
        <el-table-column type="expand"></el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="名称" prop="role"></el-table-column>
        <el-table-column>
          <template>
            <el-button size="mini" type='primary' icon='el-icon-edit'>编辑</el-button>
            <el-button  size="mini" type="danger" icon='el-icon-delete'>删除</el-button>
            <el-button  size="mini" type="warning" icon='el-icon-setting'>分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleData: []
    }
  },
  methods: {
    async getRoleList() {
      const res = await this.$http.get('/role/rolelist')
      this.roleData = res
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>
<style lang="less" scoped>
</style>
