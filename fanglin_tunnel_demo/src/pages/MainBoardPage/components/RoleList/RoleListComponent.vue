<template>
  <div class="role-list-container">
    <h2>角色管理</h2>

    <!-- 操作栏 -->
    <el-row justify="end" style="margin-bottom: 10px;">
      <el-button type="primary" @click="openDialog()">添加角色</el-button>
    </el-row>

    <!-- 表格 -->
    <el-table :data="roleList" border class="el-role-table">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="description" label="角色描述" />
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteRole(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑角色对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogForm.id ? '编辑角色' : '添加角色'" width="500px">
      <el-form :model="dialogForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="dialogForm.description" />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            :data="permissionTree"
            show-checkbox
            node-key="id"
            :default-checked-keys="dialogForm.permissionIds"
            :props="{ label: 'label', children: 'children' }"
            ref="permTree"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRole">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RoleList',
  data() {
    return {
      roleList: [
        {
          id: 1,
          name: '管理员',
          description: '系统最高权限',
          created_at: '2024-01-01',
          permissionIds: [1, 2, 3, 4],
        },
        {
          id: 2,
          name: '监控员',
          description: '仅查看监测数据',
          created_at: '2024-03-10',
          permissionIds: [2],
        },
      ],
      dialogVisible: false,
      dialogForm: {
        id: null,
        name: '',
        description: '',
        permissionIds: [],
      },
      permissionTree: [
        { id: 1, label: '首页' },
        {
          id: 2,
          label: '设备监控',
          children: [
            { id: 21, label: '温湿度监测' },
            { id: 22, label: '结构应变监测' },
          ],
        },
        { id: 3, label: '报警记录' },
        { id: 4, label: '数据分析' },
      ],
    }
  },
  methods: {
    openDialog(role = null) {
      if (role) {
        this.dialogForm = { ...role, permissionIds: [...role.permissionIds] }
        this.$nextTick(() => {
          this.$refs.permTree.setCheckedKeys(this.dialogForm.permissionIds)
        })
      } else {
        this.dialogForm = { id: null, name: '', description: '', permissionIds: [] }
      }
      this.dialogVisible = true
    },
    submitRole() {
      const checked = this.$refs.permTree.getCheckedKeys()
      this.dialogForm.permissionIds = checked

      if (this.dialogForm.id) {
        const idx = this.roleList.findIndex(r => r.id === this.dialogForm.id)
        if (idx !== -1) this.roleList.splice(idx, 1, { ...this.dialogForm })
      } else {
        this.roleList.push({
          ...this.dialogForm,
          id: Date.now(),
          created_at: new Date().toISOString().split('T')[0],
        })
      }

      this.dialogVisible = false
      this.$message.success('保存成功')
    },
    deleteRole(role) {
      this.$confirm(`确定要删除角色 "${role.name}" 吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.roleList = this.roleList.filter(r => r.id !== role.id)
        this.$message.success('角色已删除')
      })
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
