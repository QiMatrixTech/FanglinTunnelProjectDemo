<template>
  <div class="user-list-container">
    <h2>用户管理</h2>

    <!-- 顶部操作栏 -->
    <el-row justify="space-between" style="margin-bottom: 10px;">
      <el-col :span="4">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户名"
          prefix-icon="el-icon-search"
          @input="filterUsers"
        />
      </el-col>
      <el-col :span="4" style="text-align: right;">
        <el-button type="primary" @click="openDialog()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 用户表格 -->
    <el-table
      :data="filteredUsers"
      border
      style="width: 100%"
      highlight-current-row
    >
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑/新增用户对话框 -->
    <el-dialog
      :title="dialogForm.id ? '编辑用户' : '添加用户'"
      v-model="dialogVisible"
      width="400px"
    >
      <el-form :model="dialogForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="dialogForm.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="dialogForm.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="dialogForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="dialogForm.status">
            <el-radio label="启用" />
            <el-radio label="停用" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    return {
      searchKeyword: '',
      userList: [
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', status: '启用' },
        { id: 2, username: 'user1', email: 'user1@example.com', role: 'user', status: '启用' },
      ],
      filteredUsers: [],
      dialogVisible: false,
      dialogForm: {
        id: null,
        username: '',
        email: '',
        role: '',
        status: '启用',
      },
    }
  },
  mounted() {
    this.filteredUsers = this.userList
  },
  methods: {
    openDialog(user = null) {
      if (user) {
        this.dialogForm = { ...user }
      } else {
        this.dialogForm = {
          id: null,
          username: '',
          email: '',
          role: '',
          status: '启用',
        }
      }
      this.dialogVisible = true
    },
    submitUser() {
      const { id, username, email, role, status } = this.dialogForm
      if (!username || !email || !role) {
        this.$message.warning('请完整填写信息')
        return
      }

      if (id) {
        const index = this.userList.findIndex((u) => u.id === id)
        if (index !== -1) this.userList.splice(index, 1, { id, username, email, role, status })
      } else {
        this.userList.push({
          id: Date.now(),
          username,
          email,
          role,
          status,
        })
      }

      this.dialogVisible = false
      this.filterUsers()
    },
    deleteUser(user) {
      this.$confirm(`确定要删除用户 "${user.username}" 吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.userList = this.userList.filter((u) => u.id !== user.id)
        this.filterUsers()
        this.$message.success('用户已删除')
      })
    },
    filterUsers() {
      const keyword = this.searchKeyword.toLowerCase()
      this.filteredUsers = this.userList.filter((u) =>
        u.username.toLowerCase().includes(keyword)
      )
    },
  },
}
</script>

<style scoped>
.user-list-container {
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
