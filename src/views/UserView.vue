<template>
  <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 10px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
  
  <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
  
  <el-table :data="state.tableData" border stripe style="width: 100%; margin-top: 20px;">
    <el-table-column fixed prop="suId" label="编号" width="100" />
    <el-table-column prop="suName" label="用户名" width="120" />
    <el-table-column prop="suEmail" label="邮箱" width="200" />
    <el-table-column prop="suPhone" label="手机号" width="150" />
    <el-table-column prop="suRole" label="角色" width="150" />
    <el-table-column prop="suCreateTime" label="创建时间" width="200" />
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
      <el-form-item label="编号" :label-width="state.formLabelWidth" prop="suId">
        <el-input v-model="state.form.suId" autocomplete="off" readonly />
      </el-form-item>
      <el-form-item label="用户名" :label-width="state.formLabelWidth" prop="suName">
        <el-input v-model="state.form.suName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="state.formLabelWidth" prop="suEmail">
        <el-input v-model="state.form.suEmail" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机号" :label-width="state.formLabelWidth" prop="suPhone">
        <el-input v-model="state.form.suPhone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色" :label-width="state.formLabelWidth" prop="suRole">
        <el-select v-model="state.form.suRole" placeholder="请选择角色">
          <el-option label="超级管理员" value="ROLE_SUPER_ADMIN" />
          <el-option label="内容运营" value="ROLE_CONTENT_OP" />
          <el-option label="留学顾问" value="ROLE_CONSULTANT" />
          <el-option label="教师" value="ROLE_TEACHER" />
          <el-option label="普通用户" value="ROLE_USER" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" :label-width="state.formLabelWidth" prop="suCreateTime">
        <el-date-picker
          v-model="state.form.suCreateTime"
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
      <el-form-item label="用户名" :label-width="state.formLabelWidth" prop="suName">
        <el-input v-model="state.Addform.suName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" :label-width="state.formLabelWidth" prop="suPwd">
        <el-input v-model="state.Addform.suPwd" autocomplete="off" show-password />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="state.formLabelWidth" prop="suEmail">
        <el-input v-model="state.Addform.suEmail" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机号" :label-width="state.formLabelWidth" prop="suPhone">
        <el-input v-model="state.Addform.suPhone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色" :label-width="state.formLabelWidth" prop="suRole">
        <el-select v-model="state.Addform.suRole" placeholder="请选择角色">
          <el-option label="超级管理员" value="ROLE_SUPER_ADMIN" />
          <el-option label="内容运营" value="ROLE_CONTENT_OP" />
          <el-option label="留学顾问" value="ROLE_CONSULTANT" />
          <el-option label="教师" value="ROLE_TEACHER" />
          <el-option label="普通用户" value="ROLE_USER" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" :label-width="state.formLabelWidth" prop="suCreateTime">
        <el-date-picker
          v-model="state.Addform.suCreateTime"
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

// 定义用户数据类型接口（补充邮箱、手机号、角色字段）
interface User {
  suId: string | number;
  suName: string;
  suPwd: string;
  suEmail: string;
  suPhone: string;
  suRole: string;
  suCreateTime: string;
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
    suId: "",
    suName: "",
    suEmail: "",
    suPhone: "",
    suRole: "",
    suCreateTime: "",
  } as User,
  Addform: {
    suName: "",
    suPwd: "",
    suEmail: "",
    suPhone: "",
    suRole: "",
    suCreateTime: "",
  } as User,
});

// 编辑表单验证规则（补充邮箱、手机号验证）
const editRules = reactive<FormRules<User>>({
  suId: [
    { required: true, message: "编号不能为空", trigger: "blur" },
    { type: "number", message: "编号必须为数字", trigger: "blur" },
  ],
  suName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  suEmail: [
    { required: true, message: "邮箱不能为空", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  suPhone: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号格式", trigger: "blur" }
  ],
  suRole: [{ required: true, message: "请选择角色", trigger: "blur" }],
  suCreateTime: [{ required: true, message: "请选择创建时间", trigger: "blur" }],
});

// 新增表单验证规则
const addRules = reactive<FormRules<User>>({
  suName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  suPwd: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 4, message: "密码长度不能少于4位", trigger: "blur" }
  ],
  suEmail: [
    { required: true, message: "邮箱不能为空", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  suPhone: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号格式", trigger: "blur" }
  ],
  suRole: [{ required: true, message: "请选择角色", trigger: "blur" }],
  suCreateTime: [{ required: true, message: "请选择创建时间", trigger: "blur" }],
});

// 初始化数据
const initMockData = () => {
 
  const mockData: User[] = [
    {
      suId: "1",
      suName: "刘总监",
      suPwd: "1111",
      suEmail: "admin@globaledu.com",
      suPhone: "13811112222",
      suRole: "ROLE_SUPER_ADMIN",
      suCreateTime: "2023-01-12 10:00:00"
    },
    {
      suId: "2",
      suName: "陈编辑",
      suPwd: "2222",
      suEmail: "editor_chen@globaledu.com",
      suPhone: "13922223333",
      suRole: "ROLE_CONTENT_OP",
      suCreateTime: "2024-01-10 11:20:00"
    },
    {
      suId: "3",
      suName: "李留学",
      suPwd: "3333",
      suEmail: "li_teacher@globaledu.com",
      suPhone: "13733334444",
      suRole: "ROLE_CONSULTANT",
      suCreateTime: "2024-02-05 09:10:00"
    },
    {
      suId: "4",
      suName: "王家长",
      suPwd: "4444",
      suEmail: "wang_parent@example.com",
      suPhone: "13644445555",
      suRole: "ROLE_USER",
      suCreateTime: "2024-03-20 14:30:00"
    },
    {
      suId: "5",
      suName: "张同学",
      suPwd: "5555",
      suEmail: "zhang_stu@school.com",
      suPhone: "13555556666",
      suRole: "ROLE_USER",
      suCreateTime: "2024-04-10 16:10:00"
    }
  ];
  
  state.tableData = mockData;
  state.total = mockData.length;
};

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
      const index = state.tableData.findIndex(item => item.suId === state.form.suId);
      if (index !== -1) {
        state.tableData[index] = { ...state.form };
        state.dialogFormVisible = false;
        ElMessage.success("修改成功");
      }
      
      
      axios({
        method: "post",
        url: "http://localhost:8080/sysUser/updateUser",
        data: state.form,
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
      const newId = (Math.max(...state.tableData.map(item => Number(item.suId))) + 1).toString();
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
        data: state.Addform,
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
    suId: "",
    suName: "",
    suPwd: "",
    suEmail: "",
    suPhone: "",
    suRole: "",
    suCreateTime: ""
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
    state.tableData = state.tableData.filter(item => item.suId !== row.suId);
    state.total--;
    ElMessage.success("删除成功");
    
    
    axios({
      method: "post",
      url: "http://localhost:8080/sysUser/delUser",
      params: { suId: row.suId },
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