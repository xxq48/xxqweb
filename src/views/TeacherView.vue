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
    <el-table-column prop="education" label="学历" width="250" />
    <el-table-column prop="createTime" label="入职时间" width="200" />
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
      <el-form-item label="个人简介" :label-width="state.formLabelWidth" prop="intro">
        <el-input v-model="state.form.intro" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="成就描述" :label-width="state.formLabelWidth" prop="achievement">
        <el-input v-model="state.form.achievement" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学历" :label-width="state.formLabelWidth" prop="education">
        <el-input v-model="state.form.education" autocomplete="off" />
      </el-form-item>
      <el-form-item label="状态" :label-width="state.formLabelWidth" prop="status">
        <el-select v-model="state.form.status" placeholder="请选择状态">
          <el-option label="在职" value="1" />
          <el-option label="离职" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间" :label-width="state.formLabelWidth" prop="createTime">
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
      <el-form-item label="个人简介" :label-width="state.formLabelWidth" prop="intro">
        <el-input v-model="state.Addform.intro" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="成就描述" :label-width="state.formLabelWidth" prop="achievement">
        <el-input v-model="state.Addform.achievement" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学历" :label-width="state.formLabelWidth" prop="education">
        <el-input v-model="state.Addform.education" autocomplete="off" />
      </el-form-item>
      <el-form-item label="状态" :label-width="state.formLabelWidth" prop="status">
        <el-select v-model="state.Addform.status" placeholder="请选择状态">
          <el-option label="在职" value="1" />
          <el-option label="离职" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间" :label-width="state.formLabelWidth" prop="createTime">
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

// 定义教师数据类型接口
interface Teacher {
  id: string | number;
  name: string;
  avatar: string;
  title: string;
  specialty: string;
  intro: string;
  achievement: string;
  education: string;
  status: string;
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
  tableData: [] as Teacher[],
  pageNum: 1,
  pageSize: 5,
  total: 0,
  form: {
    id: "",
    name: "",
    avatar: "",
    title: "",
    specialty: "",
    intro: "",
    achievement: "",
    education: "",
    status: "1",
    createTime: "",
  } as Teacher,
  Addform: {
    id: "",
    name: "",
    avatar: "",
    title: "",
    specialty: "",
    intro: "",
    achievement: "",
    education: "",
    status: "1",
    createTime: "",
  } as Teacher,
});

// 编辑表单验证规则
const editRules = reactive<FormRules<Teacher>>({
  id: [
    { required: true, message: "编号不能为空", trigger: "blur" },
    { type: "number", message: "编号必须为数字", trigger: "blur" },
  ],
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  title: [{ required: true, message: "职称不能为空", trigger: "blur" }],
  specialty: [{ required: true, message: "擅长领域不能为空", trigger: "blur" }],
  education: [{ required: true, message: "学历不能为空", trigger: "blur" }],
  createTime: [{ required: true, message: "请选择入职时间", trigger: "blur" }],
});

// 新增表单验证规则
const addRules = reactive<FormRules<Teacher>>({
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  title: [{ required: true, message: "职称不能为空", trigger: "blur" }],
  specialty: [{ required: true, message: "擅长领域不能为空", trigger: "blur" }],
  education: [{ required: true, message: "学历不能为空", trigger: "blur" }],
  createTime: [{ required: true, message: "请选择入职时间", trigger: "blur" }],
});

// 获取教师数据
const getData = () => {
  // 实际项目中使用接口请求
  axios({
    method: "get",
    url: "http://localhost:8080/teacher/pageTeacher",
    params: { pageNum: state.pageNum, pageSize: state.pageSize }
  }).then((res) => {
    if (res.data.code === 0) {
      state.tableData = res.data.data;
      state.total = res.data.count;
    } else {
      ElMessage.error("加载失败：" + res.data.msg);
    }
  }).catch((err) => {
    ElMessage.error("接口请求失败：" + err.message);
  });

  // 模拟教师数据（基于teacher.txt）
  const mockData = [
    {
      id: "1",
      name: "赵美本",
      avatar: "/teachers/zhao.jpg",
      title: "藤校申请总监",
      specialty: "美国本科 / 研究生申请",
      intro: "哥伦比亚大学教育学硕士，12 年留学规划经验，擅长挖掘学生独特优势",
      achievement: "帮助 200 + 学生录取哈佛 / 耶鲁等藤校，曾任职美国某教育集团中国区负责人",
      education: "哥伦比亚大学教育学硕士、北京大学本科",
      status: "1",
      createTime: "2024-05-01 09:00:00"
    },
    {
      id: "2",
      name: "孙雅思",
      avatar: "/teachers/sun.jpg",
      title: "雅思教研组长",
      specialty: "雅思教学 / 教研",
      intro: "剑桥大学 TESOL 认证讲师，9 年雅思教学经验，独创 \"阅读定位黄金三步法\"",
      achievement: "累计授课 8000 + 小时，学员雅思平均提分 1.5+，出版《雅思阅读高分攻略》",
      education: "伦敦大学学院 TESOL 硕士、北京师范大学本科",
      status: "1",
      createTime: "2024-01-20 10:30:00"
    },
    {
      id: "3",
      name: "周澳新",
      avatar: "/teachers/zhou.jpg",
      title: "澳新教育顾问",
      specialty: "澳洲 / 新西兰留学",
      intro: "墨尔本大学教育学博士，熟悉澳洲八大录取政策，擅长低均分逆袭案例规划",
      achievement: "近 5 年帮助 150 + 学生拿到澳洲八大 offer，含 30 + 奖学金案例",
      education: "墨尔本大学教育学博士、南京大学本科",
      status: "1",
      createTime: "2024-02-10 14:15:00"
    },
    {
      id: "4",
      name: "吴托福",
      avatar: "/teachers/wu.jpg",
      title: "托福听力主讲",
      specialty: "托福听力 / 口语",
      intro: "前 ETS 官方评分员，8 年托福教学经验，专注听力逻辑拆解与笔记法训练",
      achievement: "学员托福听力平均提分 8+，培养出 50 + 名听力满分学员",
      education: "宾夕法尼亚大学语言学硕士、复旦大学本科",
      status: "1",
      createTime: "2024-03-05 11:20:00"
    }
  ];
  state.tableData = mockData;
  state.total = mockData.length;
};

// 刷新数据
const refreshData = (page: number) => {
  state.pageNum = page;
  getData();
};

// 显示编辑窗口
const handleEdit = (index: number, row: Teacher) => {
  state.dialogFormVisible = true;
  state.form = JSON.parse(JSON.stringify(row));
};

// 更新教师信息
const update = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      // 实际项目中替换为接口请求
      const index = state.tableData.findIndex(item => item.id === state.form.id);
      if (index !== -1) {
        state.tableData[index] = { ...state.form };
        state.dialogFormVisible = false;
        ElMessage.success("修改成功");
      }

      axios({
        method: "post",
        url: "http://localhost:8080/teacher/updateTeacher",
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

// 新增教师
const add = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      // 实际项目中替换为接口请求
      const newId = (Math.max(...state.tableData.map(item => Number(item.id))) + 1).toString();
      const newTeacher = {
        ...state.Addform,
        id: newId
      };
      state.tableData.unshift(newTeacher);
      state.total++;
      state.dialogAddFormVisible = false;
      ElMessage.success("新增成功");

      axios({
        method: "post",
        url: "http://localhost:8080/teacher/addTeacher",
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
    id: "",
    name: "",
    avatar: "",
    title: "",
    specialty: "",
    intro: "",
    achievement: "",
    education: "",
    status: "1",
    createTime: ""
  };
};

// 删除教师
const handleDelete = (row: Teacher) => {
  ElMessageBox.confirm("确定删除该教师信息吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    // 实际项目中替换为接口请求
    state.tableData = state.tableData.filter(item => item.id !== row.id);
    state.total--;
    ElMessage.success("删除成功");

    // axios({
    //   method: "post",
    //   url: "http://localhost:8080/teacher/delTeacher",
    //   params: { id: row.id },
    // }).then((res) => {
    //   if (res.data.code === 0) {
    //     ElMessage.success("删除成功");
    //     getData();
    //   } else {
    //     ElMessage.error(res.data.msg);
    //   }
    // });
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