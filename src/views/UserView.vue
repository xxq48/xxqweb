<template>
  <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 10px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
  
  <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
  
  <el-table :data="state.tableData" border stripe style="width: 100%; margin-top: 20px;">
    <el-table-column fixed prop="id" label="编号" width="100" />
    <el-table-column prop="name" label="用户名" width="120" />
    <el-table-column prop="email" label="邮箱" width="200" />
    <el-table-column prop="phone" label="手机号" width="150" />
    <el-table-column prop="roleName" label="角色" width="150" />
    <el-table-column prop="time" label="创建时间" width="200" />
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleDelete(scope.row)">
          删除
        </el-button>
        <el-button
          link
          type="primary"
          size="small"
          @click="handleEdit(scope.$index, scope.row)"
        >编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  
  <el-pagination
    background
    layout="prev, pager, next"
    :total="state.total"
    :page-size="state.pageSize"
    @current-change="refreshData"
    style="margin-top: 20px; text-align: right;"
  />
  
  <!-- 编辑窗口 -->
  <el-dialog v-model="state.dialogFormVisible" title="修改用户信息" width="500">
    <el-form :model="state.form" ref="editFormRef" :rules="editRules">
      <el-form-item label="编号" :label-width="state.formLabelWidth" prop="id">
        <el-input v-model="state.form.id" autocomplete="off" readonly />
      </el-form-item>
      <el-form-item label="用户名" :label-width="state.formLabelWidth" prop="name">
        <el-input v-model="state.form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="state.formLabelWidth" prop="email">
        <el-input v-model="state.form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机号" :label-width="state.formLabelWidth" prop="phone">
        <el-input v-model="state.form.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色" :label-width="state.formLabelWidth" prop="role">
        <el-select v-model="state.form.roleId" placeholder="请选择角色">
          <el-option label="超级管理员" :value="1" />
          <el-option label="内容运营" :value="2" />
          <el-option label="留学顾问" :value="3" />
          <el-option label="教师" :value="4" />
          <el-option label="普通用户" :value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" :label-width="state.formLabelWidth" prop="suCreateTime">
        <el-date-picker
          v-model="state.form.createTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择日期时间"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="state.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="update(editFormRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
  
  <!-- 新增窗口 -->
  <el-dialog v-model="state.dialogAddFormVisible" title="新增用户信息" width="500">
    <el-form :model="state.Addform" ref="addFormRef" :rules="addRules">
      <el-form-item label="用户名" :label-width="state.formLabelWidth" prop="name">
        <el-input v-model="state.Addform.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" :label-width="state.formLabelWidth" prop="pwd">
        <el-input v-model="state.Addform.pwd" autocomplete="off" show-password />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="state.formLabelWidth" prop="email">
        <el-input v-model="state.Addform.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机号" :label-width="state.formLabelWidth" prop="phone">
        <el-input v-model="state.Addform.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色" :label-width="state.formLabelWidth" prop="role">
        <el-select v-model="state.Addform.roleId" placeholder="请选择角色">
          <el-option label="超级管理员" value="1" />
          <el-option label="内容运营" value="2" />
          <el-option label="留学顾问" value="3" />
          <el-option label="教师" value="4" />
          <el-option label="普通用户" value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" :label-width="state.formLabelWidth" prop="suCreateTime">
        <el-date-picker
          v-model="state.Addform.createTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择日期时间"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="state.dialogAddFormVisible = false">取消</el-button>
        <el-button type="primary" @click="add(addFormRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import type { FormInstance, FormRules } from "element-plus";
import { Plus, ArrowRight } from "@element-plus/icons-vue";

// 新增角色映射对象，建立编码与中文名称的对应关系
const roleMap = {
  'ROLE_SUPER_ADMIN': '超级管理员',
  'ROLE_CONTENT_OP': '内容运营',
  'ROLE_CONSULTANT': '留学顾问',
  'ROLE_TEACHER': '教师',
  'ROLE_USER': '普通用户'
};

// 定义用户数据类型接口（补充邮箱、手机号、角色字段）
interface User {
  id: string | number;
  name: string;
  pwd: string;
  email: string;
  phone: string;
  roleId: number;
  createTime: string;
}

// 定义表单引用
const editFormRef = ref<FormInstance>();
const addFormRef = ref<FormInstance>();

// 定义页面状态
const state = reactive({
  dialogFormVisible: false,
  dialogAddFormVisible: false,
  formLabelWidth: "140px",
  tableData: [] as User[],
  pageNum: 1,
  pageSize: 5, 
  total: 0,
  form: {
    id: "",
    name: "",
    email: "",
    phone: "",
    roleId: 0,
    createTime: "",
  } as User,
  Addform: {
    name: "",
    pwd: "",
    email: "",
    phone: "",
    roleId: 0,
    createTime: "",
  } as User,
});

// 编辑表单验证规则（补充邮箱、手机号验证）
const editRules = reactive<FormRules<User>>({
  id: [
    { required: true, message: "编号不能为空", trigger: "blur" },
    { type: "number", message: "编号必须为数字", trigger: "blur" },
  ],
  name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  email: [
    { required: true, message: "邮箱不能为空", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  phone: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号格式", trigger: "blur" }
  ],
  roleId: [{ required: true, message: "请选择角色", trigger: "blur" }],
  createTime: [{ required: true, message: "请选择创建时间", trigger: "blur" }],
});

// 新增表单验证规则
const addRules = reactive<FormRules<User>>({
  name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  pwd: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 4, message: "密码长度不能少于4位", trigger: "blur" }
  ],
  email: [
    { required: true, message: "邮箱不能为空", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  phone: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号格式", trigger: "blur" }
  ],
  roleId: [{ required: true, message: "请选择角色", trigger: "blur" }],
  createTime: [{ required: true, message: "请选择创建时间", trigger: "blur" }],
});



// 获取后台数据（实际项目中替换为接口请求）
const getData = () => {
  // 这里使用模拟数据，实际项目中保留axios请求
//  initMockData();
  
   axios({
    method: "get",
    url: "http://localhost:8080/sysUser/pageUser",
    params: { pageNum: state.pageNum, pageSize: state.pageSize }
  }).then((res) => {
    // 假设后端返回格式正确：{ code:0, data: [], count:0 }
    if (res.data.code === 0) {
      state.tableData = res.data.data;
      state.total = res.data.count;
    } else {
      ElMessage.error("加载失败：" + res.data.msg);
      state.tableData = []; // 或回退到模拟数据
    }
  }).catch((err) => {
    // 处理接口请求失败（如网络错误、后端未启动）
    ElMessage.error("接口请求失败：" + err.message);
    // 可选：回退到模拟数据
    // initMockData();
  });
};



// 刷新数据
const refreshData = (page: number) => {
  state.pageNum = page;
  getData();
};

// 显示编辑窗口
const handleEdit = (index: number, row: User) => {
  state.dialogFormVisible = true;
  // 深拷贝避免双向绑定问题
  state.form = JSON.parse(JSON.stringify(row));
};

// 更新用户
const update = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      // 模拟接口请求，实际项目中替换为真实接口
      const index = state.tableData.findIndex(item => item.id === state.form.id);
      if (index !== -1) {
        state.tableData[index] = { ...state.form };
        state.dialogFormVisible = false;
        ElMessage.success("修改成功");
      }
      
      
      axios({
        method: "post",
        url: "http://localhost:8080/sysUser/updateUser",
        params: state.form,
      }).then((res) => {
        if (res.data.code === 0) {
          state.dialogFormVisible = false;
          getData();
          ElMessage.success("修改成功");
        } else {
          ElMessage.error(res.data.msg);
        }
      });
      
    }
  });
};

// 新增用户
const add = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      // 模拟接口请求，实际项目中替换为真实接口
      const newId = (Math.max(...state.tableData.map(item => Number(item.id))) + 1).toString();
      const newUser = {
        ...state.Addform,
        suId: newId
      };
      state.tableData.unshift(newUser);
      state.total++;
      state.dialogAddFormVisible = false;
      ElMessage.success("新增成功");
      
       
      axios({
        method: "post",
        url: "http://localhost:8080/sysUser/addUser",
        params: state.Addform,
      }).then((res) => {
        if (res.data.code === 0) {
          state.dialogAddFormVisible = false;
          getData();
          ElMessage.success("新增成功");
        } else {
          ElMessage.error(res.data.msg);
        }
      });
      
    }
  });
};

// 显示新增窗口
const handleAdd = () => {
  state.dialogAddFormVisible = true;
  // 重置表单
  state.Addform = {
    id: "",
    name: "",
    pwd: "",
    email: "",
    phone: "",
    roleId: 0,
    createTime: ""
  };
};

// 删除用户
const handleDelete = (row: User) => {
  ElMessageBox.confirm("确定删除该用户吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    // 模拟接口请求，实际项目中替换为真实接口
    state.tableData = state.tableData.filter(item => item.id !== row.id);
    state.total--;
    ElMessage.success("删除成功");
    
    
    axios({
      method: "post",
      url: "http://localhost:8080/sysUser/delUser",
      params: { suId: row.id },
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success("删除成功");
        getData();
      } else {
        ElMessage.error(res.data.msg);
      }
    });
    
  });
};

// 页面初始化
onMounted(() => {
  getData();
});
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>