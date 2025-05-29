<template>
  <div class="permission-matrix">
    <h2>角色权限配置</h2>

    <el-table :data="permissionList" border>
      <el-table-column prop="page" label="页面模块" width="200" />
      <el-table-column
        v-for="role in roleList"
        :key="role.id"
        :label="role.name"
      >
        <template #default="{ row }">
          <el-checkbox-group
            v-model="row.rolePermissions[role.id]"
            @change="handleChange(row.page, role.id)"
          >
            <el-checkbox label="view">查看</el-checkbox>
            <el-checkbox label="edit">编辑</el-checkbox>
            <el-checkbox label="delete">删除</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: right; margin-top: 20px">
      <el-button type="primary" @click="savePermissions">保存权限</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PermissionMatrix',
  data() {
    return {
      roleList: [
        { id: 1, name: '管理员' },
        { id: 2, name: '监控员' },
        { id: 3, name: '普通用户' },
      ],
      permissionList: [
        {
          page: '首页',
          rolePermissions: {
            1: ['view', 'edit'],
            2: ['view'],
            3: ['view'],
          },
        },
        {
          page: '设备监控',
          rolePermissions: {
            1: ['view', 'edit', 'delete'],
            2: ['view'],
            3: [],
          },
        },
        {
          page: '报警记录',
          rolePermissions: {
            1: ['view', 'delete'],
            2: ['view'],
            3: [],
          },
        },
        {
          page: '数据分析',
          rolePermissions: {
            1: ['view'],
            2: [],
            3: [],
          },
        },
      ],
    }
  },
  methods: {
    handleChange(page, roleId) {
      console.log(`权限变更：${page} - 角色 ${roleId}`, this.permissionList)
    },
    savePermissions() {
      // 提交 permissionList 到后端保存
      console.log('权限保存：', this.permissionList)
      this.$message.success('权限保存成功')
    },
  },
}
</script>

<style scoped>
.role-list-container {
  padding: 20px;
  color: #e0e9ff;
}
.el-dialog {
  background: #1c2b4a;
}
.el-table {
  background-color: rgba(18, 43, 77, 0.6);
  overflow: hidden;
  color: #e0e9ff;
  backdrop-filter: blur(6px);
  font-size: 14px;
  --el-table-header-bg-color: transparent !important;
  --el-table-bg-color: transparent !important;
  --el-table-tr-bg-color: transparent !important;
  --el-table-current-row-bg-color: transparent !important;
  --el-table-row-hover-bg-color: transparent !important;
  --el-table-expanded-cell-bg-color: transparent !important;
}

/* 表头背景 */
.el-table th {
  background-color: rgba(10, 31, 60, 0.8) !important;
  color: #ffffff !important;
  font-weight: bold;
}

/* 表格行背景 */
.el-table tr {
  background-color: transparent !important;
}

/* 鼠标悬浮高亮行 */
.el-table__body tr:hover > td {
  background-color: rgba(0, 191, 255, 0.1) !important;
}

/* 单元格边框颜色柔和 */
.el-table td,
.el-table th.is-leaf {
  border-color: rgba(255, 255, 255, 0.1);
}

/* tag 风格优化 */
.el-tag {
  background-color: #1a4d65;
  border: none;
  color: #e0f7ff;
}
.el-input {
    --el-input-bg-color: rgba(10, 31, 60, 0.7) !important;
}
</style>
