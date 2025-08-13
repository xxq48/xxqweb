<template>
  <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 10px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>师资管理</el-breadcrumb-item>
    <el-breadcrumb-item>教师列表</el-breadcrumb-item>
  </el-breadcrumb>
  
  <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
  
  <el-table :data="state.tableData" border stripe style="width: 100%; margin-top: 20px;">
    <el-table-column fixed prop="id" label="编号" width="100" />
    <el-table-column prop="name" label="姓名" width="120" />
    <el-table-column prop="title" label="职称" width="150" />
    <el-table-column prop="specialty" label="擅长领域" width="200" />
    <el-table-column prop="educationBackground" label="学历" width="250" />
    <el-table-column prop="time" label="入职时间" width="200" />
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
        <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
  <el-dialog v-model="state.dialogFormVisible" title="修改教师信息" width="600">
    <el-form :model="state.form" ref="editFormRef" :rules="editRules">
      <el-form-item label="编号" :label-width="state.formLabelWidth" prop="id">
        <el-input v-model="state.form.id" autocomplete="off" readonly />
      </el-form-item>
      <el-form-item label="姓名" :label-width="state.formLabelWidth" prop="name">
        <el-input v-model="state.form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="头像路径" :label-width="state.formLabelWidth" prop="avatar">
        <el-input v-model="state.form.avatar" autocomplete="off" />
      </el-form-item>
      <el-form-item label="职称" :label-width="state.formLabelWidth" prop="title">
        <el-input v-model="state.form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="擅长领域" :label-width="state.formLabelWidth" prop="specialty">
        <el-input v-model="state.form.specialty" autocomplete="off" />
      </el-form-item>
      <el-form-item label="个人简介" :label-width="state.formLabelWidth" prop="introduction">
        <el-input v-model="state.form.introduction" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="成就描述" :label-width="state.formLabelWidth" prop="experience">
        <el-input v-model="state.form.experience" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学历" :label-width="state.formLabelWidth" prop="educationBackground">
        <el-input v-model="state.form.educationBackground" autocomplete="off" />
      </el-form-item>
      <!-- <el-form-item label="岗位" :label-width="state.formLabelWidth" prop="position">
        <el-input v-model="state.form.position" autocomplete="off" />
      </el-form-item> -->
      <el-form-item label="状态" :label-width="state.formLabelWidth" prop="status">
        <el-select v-model="state.form.status" placeholder="请选择状态">
          <el-option label="在职" value="1" />
          <el-option label="离职" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间" :label-width="state.formLabelWidth" prop="time">
        <el-date-picker
          v-model="state.form.time"
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
  <el-dialog v-model="state.dialogAddFormVisible" title="新增教师信息" width="600">
    <el-form :model="state.Addform" ref="addFormRef" :rules="addRules">
      <el-form-item label="姓名" :label-width="state.formLabelWidth" prop="name">
        <el-input v-model="state.Addform.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="头像路径" :label-width="state.formLabelWidth" prop="avatar">
        <el-input v-model="state.Addform.avatar" autocomplete="off" />
      </el-form-item>
      <el-form-item label="职称" :label-width="state.formLabelWidth" prop="title">
        <el-input v-model="state.Addform.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="擅长领域" :label-width="state.formLabelWidth" prop="specialty">
        <el-input v-model="state.Addform.specialty" autocomplete="off" />
      </el-form-item>
      <el-form-item label="个人简介" :label-width="state.formLabelWidth" prop="introduction">
        <el-input v-model="state.Addform.introduction" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="成就描述" :label-width="state.formLabelWidth" prop="experience">
        <el-input v-model="state.Addform.experience" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学历" :label-width="state.formLabelWidth" prop="educationBackground">
        <el-input v-model="state.Addform.educationBackground" autocomplete="off" />
      </el-form-item>
      <!-- <el-form-item label="岗位" :label-width="state.formLabelWidth" prop="position">
        <el-input v-model="state.Addform.position" autocomplete="off" />
      </el-form-item> -->
      <el-form-item label="状态" :label-width="state.formLabelWidth" prop="status">
        <el-select v-model="state.Addform.status" placeholder="请选择状态">
          <el-option label="在职" value="1" />
          <el-option label="离职" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间" :label-width="state.formLabelWidth" prop="time">
        <el-date-picker
          v-model="state.Addform.time"
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

// 1. 修正Teacher接口定义（完整闭合，字段与后端一致）
interface Teacher {
  id: string | number;
  name: string;
  avatar: string;
  title: string; // 教师头衔
  specialty: string; // 擅长领域
  introduction: string; // 个人简介
  experience: string; // 成就描述
  educationBackground: string; // 学历
  status: string; // 状态（1在职/0离职）
  time: string; // 入职时间
}

// 2. 表单引用
const editFormRef = ref<FormInstance>();
const addFormRef = ref<FormInstance>();

// 3. 修正state定义（包含所有必需属性）
const state = reactive({
  dialogFormVisible: false, // 编辑弹窗显示状态
  dialogAddFormVisible: false, // 新增弹窗显示状态
  formLabelWidth: "140px", // 表单标签宽度
  tableData: [] as Teacher[], // 表格数据
  pageNum: 1, // 当前页码
  pageSize: 5, // 每页条数
  total: 0, // 总记录数
  form: { // 编辑表单数据
    id: "",
    name: "",
    avatar: "",
    title: "",
    specialty: "",
    introduction: "",
    experience: "",
    educationBackground: "",
    status: "1",
    time: "",
    position: ""
  } as Teacher,
  Addform: { // 新增表单数据（不含id）
    name: "",
    avatar: "",
    title: "",
    specialty: "",
    introduction: "",
    experience: "",
    educationBackground: "",
    status: "1",
    time: "",
    position: ""
  } as Omit<Teacher, 'id'>,
});

// 4. 修正编辑表单验证规则（字段与form匹配）
const editRules = reactive<FormRules<Teacher>>({
  id: [
    { required: true, message: "编号不能为空", trigger: "blur" },
    { type: "number", message: "编号必须为数字", trigger: "blur", transform: (value) => Number(value) },
  ],
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  title: [{ required: true, message: "职称不能为空", trigger: "blur" }],
  specialty: [{ required: true, message: "擅长领域不能为空", trigger: "blur" }],
  educationBackground: [{ required: true, message: "学历不能为空", trigger: "blur" }],
  // position: [{ required: true, message: "岗位不能为空", trigger: "blur" }], // 后端必需
  time: [{ required: true, message: "请选择入职时间", trigger: "blur" }],
});

// 5. 修正新增表单验证规则（字段与Addform匹配）
const addRules = reactive<FormRules<Teacher>>({
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  title: [{ required: true, message: "职称不能为空", trigger: "blur" }],
  specialty: [{ required: true, message: "擅长领域不能为空", trigger: "blur" }],
  educationBackground: [{ required: true, message: "学历不能为空", trigger: "blur" }],
  // position: [{ required: true, message: "岗位不能为空", trigger: "blur" }], // 后端必需
  time: [{ required: true, message: "请选择入职时间", trigger: "blur" }],
});

// 6. 获取教师数据（接口参数与后端匹配）
const getData = () => {
  axios({
    method: "get",
    url: "http://localhost:8080/teacher/pageTeacher",
    params: { pageNum: state.pageNum, pageSize: state.pageSize }
  }).then((res) => {
    if (res.data.code === 0) {
      state.tableData = res.data.data || res.data.records || [];
      state.total = res.data.count || res.data.total || 0;
    } else {
      ElMessage.error("加载失败：" + res.data.msg);
      state.tableData = [];
    }
  }).catch((err) => {
    ElMessage.error("接口请求失败：" + err.message);
  });
};

// 7. 刷新数据
const refreshData = (page: number) => {
  state.pageNum = page;
  getData();
};

// 8. 显示编辑窗口
const handleEdit = (index: number, row: Teacher) => {
  state.dialogFormVisible = true;
  state.form = JSON.parse(JSON.stringify(row)); // 深拷贝避免双向绑定问题
};

// 9. 更新教师信息
const update = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      axios({
        method: "post",
        url: "http://localhost:8080/teacher/updateTeacher",
        params: state.form,
      }).then((res) => {
        if (res.data.code === 0) {
          state.dialogFormVisible = false;
          getData(); // 重新加载数据
          ElMessage.success("修改成功");
        } else {
          ElMessage.error(res.data.msg);
        }
      });
    }
  });
};

// 10. 新增教师
const add = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      axios({
        method: "post",
        url: "http://localhost:8080/teacher/addTeacher",
        params: state.Addform,
      }).then((res) => {
        if (res.data.code === 0) {
          state.dialogAddFormVisible = false;
          getData(); // 重新加载数据
          ElMessage.success("新增成功");
        } else {
          ElMessage.error(res.data.msg);
        }
      });
    }
  });
};

// 11. 显示新增窗口
const handleAdd = () => {
  state.dialogAddFormVisible = true;
  // 重置新增表单
  state.Addform = {
    name: "",
    avatar: "",
    title: "",
    specialty: "",
    introduction: "",
    experience: "",
    educationBackground: "",
    status: "1",
    time: "",
    // position: ""
  };
};

// 12. 删除教师
const handleDelete = (row: Teacher) => {
  ElMessageBox.confirm("确定删除该教师信息吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/teacher/delTeacher",
      params: { id: row.id },
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success("删除成功");
        getData(); // 重新加载数据
      } else {
        ElMessage.error(res.data.msg);
      }
    });
  });
};

// 13. 页面初始化加载数据
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