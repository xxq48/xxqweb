<template>
  <div class="role-management">
    <h1>角色管理</h1>
    
    <!-- 操作按钮区 -->
    <div class="action-buttons">
      <el-button type="primary" @click="handleAdd">新增角色</el-button>
    </div>
    
    <!-- 角色表格 -->
    <el-table 
      :data="roles" 
      border 
      style="width: 100%; margin-top: 20px;"
    >
      <el-table-column 
        prop="id" 
        label="ID" 
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column 
        prop="name" 
        label="角色名称" 
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column 
        prop="code" 
        label="角色编码" 
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column 
        prop="description" 
        label="权限描述" 
        align="center"
      ></el-table-column>
      <el-table-column 
        prop="createTime" 
        label="创建时间" 
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column 
        label="操作" 
        width="200"
        align="center"
      >
        <template #default="scope">
          <el-button 
            type="success" 
            size="small" 
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="handleDelete(scope.row)"
            style="margin-left: 10px;"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 新增/编辑角色弹窗 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible" 
      width="500px"
    >
      <el-form 
        :model="form" 
        ref="roleForm" 
        :rules="rules" 
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
    
    <!-- 删除确认弹窗 -->
    <el-dialog 
      title="确认删除" 
      v-model="deleteDialogVisible" 
      width="30%"
    >
      <p>确定要删除角色 <span style="color: red">{{ deleteRoleName }}</span> 吗？</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RoleManagement',
  data() {
    return {
      // 角色列表数据
      roles: [
        {
          id: '1',
          name: '超级管理员',
          code: 'ROLE_SUPER_ADMIN',
          description: '系统所有权限，含用户 / 角色配置',
          createTime: '2023-01-12 10:00:00'
        },
        {
          id: '2',
          name: '内容运营',
          code: 'ROLE_CONTENT_OP',
          description: '资讯 / 课程内容发布、编辑权限',
          createTime: '2023-01-12 10:00:00'
        },
        {
          id: '3',
          name: '留学顾问',
          code: 'ROLE_CONSULTANT',
          description: '咨询回复、学生规划权限',
          createTime: '2023-01-12 10:00:00'
        },
        {
          id: '4',
          name: '教师',
          code: 'ROLE_TEACHER',
          description: '课程资料管理、学员答疑权限',
          createTime: '2023-01-12 10:00:00'
        },
        {
          id: '5',
          name: '普通用户',
          code: 'ROLE_USER',
          description: '浏览内容、提交咨询基础权限',
          createTime: '2023-01-12 10:00:00'
        }
      ],
      
      // 弹窗相关
      dialogVisible: false,
      dialogTitle: '',
      deleteDialogVisible: false,
      deleteRoleName: '',
      currentRole: null,
      
      // 表单数据
      form: {
        id: '',
        name: '',
        code: '',
        description: '',
        createTime: ''
      },
      
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { pattern: /^[A-Z_]+$/, message: '请使用大写字母和下划线', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入权限描述', trigger: 'blur' },
          { min: 5, message: '描述至少 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增角色
    handleAdd() {
      this.dialogTitle = '新增角色';
      this.currentRole = null;
      // 重置表单
      this.form = {
        id: '',
        name: '',
        code: '',
        description: '',
        createTime: ''
      };
      this.dialogVisible = true;
    },
    
    // 编辑角色
    handleEdit(row) {
      this.dialogTitle = '编辑角色';
      this.currentRole = row;
      // 复制数据到表单
      this.form = { ...row };
      this.dialogVisible = true;
    },
    
    // 删除角色
    handleDelete(row) {
      this.deleteRoleName = row.name;
      this.currentRole = row;
      this.deleteDialogVisible = true;
    },
    
    // 确认删除
    confirmDelete() {
      if (this.currentRole) {
        this.roles = this.roles.filter(role => role.id !== this.currentRole.id);
        this.$message.success('角色删除成功');
      }
      this.deleteDialogVisible = false;
      this.currentRole = null;
    },
    
    // 提交表单
    handleSubmit() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          if (this.currentRole) {
            // 编辑操作
            const index = this.roles.findIndex(role => role.id === this.currentRole.id);
            if (index !== -1) {
              this.roles[index] = { ...this.form };
              this.$message.success('角色编辑成功');
            }
          } else {
            // 新增操作
            const newId = (parseInt(this.roles[this.roles.length - 1].id) + 1).toString();
            const newRole = {
              ...this.form,
              id: newId,
              createTime: new Date().toLocaleString()
            };
            this.roles.push(newRole);
            this.$message.success('角色新增成功');
          }
          this.dialogVisible = false;
        }
      });
    }
  }
}
</script>

<style scoped>
.role-management {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 40px);
}

.action-buttons {
  margin-top: 10px;
}
</style>